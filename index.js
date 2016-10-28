var express = require('express'),
    server,
    app = express(),
    bodyParser = require('body-parser'),
    //multiparty = require('multiparty'),
    fs = require('fs'),
    multer  = require('multer'),
    //upload = multer({ dest: 'uploads/' }),
    mysql = require('mysql'),
    crypto = require('crypto'),
    geoip = require('geoip-lite'),
    cookieSession = require('cookie-session'),
    cookieParser = require('cookie-parser'),
    watermark = require('image-watermark'),
    im = require('imagemagick');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    var arr, exIndex, ex;
    arr = file.originalname.split('.');
    exIndex = arr.length-1;
    ex = arr[exIndex];
    cb(null, 'upload-'+Date.now() + '.' + ex);
  }
});

var upload = multer({ storage: storage });

var watermarkOptions = {
    'text' : 'rentozavr-rf',
    //'resize' : '200%',
    //'override-image' : true,
    //'dstPath' : 'uploads/watermark.jpg'
};

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'admin_armapuser',
  password : 'HQCbezLWux',
  database : 'armap2_db',
  //charset: 'cp1251'
  charset: 'UTF8_GENERAL_CI'
});

connection.connect();

app.use(function(req,res,next) {
  console.log("%s %s", req.method, req.url);
  next();
});

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

app.use(cookieParser());

app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({extended: true}));
//app.set('view engine', 'jade');

// var ip = "188.168.22.110";
// var geo = geoip.lookup(ip);
//
// console.log(geo);

function geolocation(req,res,next) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(ip);
  ip = ip.substring(7);
  // var ip = "188.168.22.110";
  console.log(typeof(ip));
  var geo;
  if (ip != undefined) {
    geo = geoip.lookup(ip) ? geoip.lookup(ip.slice(1,-1)) : 0;
    geo.zoom = 13;
    geo.ip = ip;
  }else{
    geo = {};//61.802742, 97.175641
    geo.ll = [61.802742, 97.175641];
    geo.city = "Все города";
    geo.zoom = 4;
    geo.ip = ip;
  }
  // return geo;
  res.geo = geo;
  next();
}

function auth(req, res, next) {
  var role;
  if (req.session.role) {
  	res.role = req.session.role;
    res.userfullname = req.session.userfullname;
    res.userid = req.session.userid;
  }else{
  	res.role = 0;
  };
  next();
};

app.post('/register',function (req,res) {
  var user = req.body;
  var pass = req.body.pass;
  var hash = crypto.createHmac('sha256', pass)
                     .update('I love cupcakes')
                     .digest('hex');
  connection.query('SELECT * FROM users WHERE user_email = "'+user.email+'"',function (error,result,fields) {
    if (error) throw error;
    if (result.length > 0) {
      res.send({status: 'error', err: 'email already exist'});
    }else{
      connection.query('INSERT INTO users (user_email,user_pass,user_role,user_firstname,user_lastname,user_ban) \
      VALUES ("'+user.email+'","'+hash+'",1,"'+encodeURI(user.firstname)+'","'+encodeURI(user.lastname)+'",0)',
      function(error, result, fields) {
        if (error) throw error;
        res.send({status:'success'});
      });
    }
  });
})

app.post('/login',function (req,res) {
  console.log(req.body);
  //res.send(req.body);
  var email = req.body.email;
  connection.query('SELECT * FROM users WHERE user_email = "'+email+'"',
  function(error, result, fields){
    if (error) throw error;
    if (result.length > 0) {
      var pass = req.body.pass;
      var hash = crypto.createHmac('sha256', pass)
                         .update('I love cupcakes')
                         .digest('hex');
      if (result[0].user_pass === hash) {
        var user = result[0];
        console.log(user);
        connection.query('SELECT * FROM roles WHERE role_id = '+user.user_role, function (error,result,fields) {
          if (error) throw error;
          req.session.userfullname = decodeURI(user.user_firstname) + ' ' + decodeURI(user.user_lastname);
  				req.session.role = result[0].role_name;
          req.session.userid = user.user_id;
          req.cookies.role = result[0].role_name;
          req.cookies.userid = user.user_id;
          res.send({status: 'success',
                    username: req.session.userfullname,
                    role: req.session.role,
                    userid: req.session.userid
          });
        });
      }
    }else{
      res.send({status: 'unsuccess'});
    }
  });
});

app.get('/logout',function (req,res) {
  req.session = null;
  res.redirect('/');
});

// ofcParams = {
//   meanings: string, /*meaning1, meaning2, ..., meaningN*/
//   subprice: string, /*minprice AND maxprice*/
//   area: string, /*minarea AND maxarea*/
// }

function getOffices(ofcParams) {
  if (ofcParams) {
    optionsСond = ofcParams.options != '' ? 'option_id IN ('+ofcParams.options+')' : '';
    subpriceСond = ofcParams.subprice != '' ? 'subprice BETWEEN ('+ofcParams.subprice+')' : '';
    areaСond = ofcParams.area != '' ? 'area BETWEEN ('+ofcParams.area+')' : '';
    if (ofcParams.options != '') {
      var ofcIdsArray = [],ofcIdsString;
      connection.query('SELECT * from options_offices LEFT JOIN offices ON office_id = link_office WHERE link_option IN ('+ofcParams.options+')',
      function (error,result,fields) {
        if (error) throw error;
        for (var i = 0; i < result.length; i++) {
          ofcIdsArray.push(result[i].office_id);
          console.log(ofcIdsArray);
        }
      });
    }else{

    }

  }else{

  }
}

app.get('/',auth,geolocation, function(req,res) {
  geo = res.geo;
  console.log('Cookies: ', req.cookies);
  connection.query('SELECT * FROM options WHERE option_type = 1',function (error,result,fields) {
    if (error) throw error;
    meanings = result;
    res.render('home.jade',{
      role: res.role,
      username: res.userfullname,
      userid: res.userid,
      geo: geo,
      meanings: meanings,
      ishome: 1
    });
  })
});

app.get('/my',auth,geolocation, function(req,res) {
  geo = res.geo;
  if (res.role == 'user' || res.role == 'admin' || res.role == 'moder') {
    connection.query('SELECT * FROM objtypes', function (error,result,fields) {
      if (error) throw error;
      var objtypes = result;
      connection.query('SELECT * FROM options', function (error,result,fields) {
        if (error) throw error;
        var meanings = [], included = [], advanced = [], providers = [];
        var opttypes = result;
        for (var i = 0; i < result.length; i++) {
          switch (result[i].option_type) {
            case 1:
              meanings.push(result[i]);
              break;
            case 2:
              included.push(result[i]);
              break;
            case 3:
              advanced.push(result[i]);
              break;
            case 4:
              providers.push(result[i]);
              break;
          }
          result[i]
        }
        connection.query('SELECT object_id,object_name,object_adres,object_cover\
         FROM objects WHERE object_author ='+res.userid,function (error,result,fields) {
          if (error) throw error;
          var objects = result;
          connection.query('SELECT * FROM offices WHERE office_author ='+res.userid, function (error,result,fields) {
            if (error) throw error;
            var offices = result;
            for (var i = 0; i < offices.length; i++) {
              var date = offices[i].office_create,
                  day = date.getDate() < 10 ? '0'+date.getDate() : date.getDate(),
                  month = date.getMonth() < 10 ? '0'+date.getMonth() : date.getMonth(),
                  year = date.getFullYear(),
                  hours = date.getHours() < 10 ? '0'+date.getHours() : date.getHours(),
                  minutes = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes(),
                  time = hours+':'+minutes;
              offices[i].office_create = day+'.'+month+'.'+year+' '+time;
            }
            console.log(meanings[2].option_id);
            res.render('my.jade',{
              role: res.role,
              username: res.userfullname,
              userid: res.userid,
              geo: geo,
              objects: objects,
              objtypes: objtypes,
              offices: offices,
              meanings: meanings,
              included: included,
              advanced: advanced,
              providers: providers
            });
          })
        });
      });
    });
  }else{
    res.redirect('/');
  }
});

app.get('/object-:object_id', auth,geolocation, function (req,res) {
  //res.send(req.params);
  geo = res.geo;
  connection.query('SELECT * FROM objects WHERE object_id = '+req.params.object_id, function (error,result,fields) {
    if (error) throw error;
    object = result[0];
    connection.query('SELECT * FROM offices LEFT JOIN images ON office_cover = image_id WHERE office_object = '+object.object_id, function (error,result,fields) {
      if (error) throw error;
      console.log(result);
      object.object_offices = result;
      //console.log(object);
      res.render('object.jade',{
        role: res.role,
        username: res.userfullname,
        userid: res.userid,
        geo: geo,
        object: object
      });
    });
  });
});

app.get('/office-:office_id', auth,geolocation, function (req,res) {
  //res.send(req.params);
  var geo = res.geo;
  connection.query('SELECT * FROM offices WHERE office_id = ' + req.params.office_id, function (error,result,fields) {
    if (error) throw error;
    var office = result[0];
    connection.query('SELECT * FROM images WHERE image_office = ' + req.params.office_id, function (error,result,fields) {
      if (error) throw error;
      var images = result;
      connection.query('SELECT link_option FROM options_offices WHERE link_office = ' + req.params.office_id, function (error,result,fields) {
        if (error) throw error;
        var optionIds = result;
        var optionIdsArr = [];
        for (var i = 0; i < optionIds.length; i++) {
          optionIdsArr.push(optionIds[i].link_option);
        }
        optionIdsStr = optionIdsArr.join(',');
        console.log(optionIdsStr);
        connection.query('SELECT * FROM objtypes', function (error,result,fields) {
          if (error) throw error;
          var objtypes = result;
          connection.query('SELECT * FROM options WHERE option_id IN ('+optionIdsStr+')', function (error,result,fields) {
            if (error) throw error;
            var meanings = [], included = [], advanced = [], providers = [];
            var opttypes = result;
            for (var i = 0; i < result.length; i++) {
              switch (result[i].option_type) {
                case 1:
                  meanings.push(result[i]);
                  break;
                case 2:
                  included.push(result[i]);
                  break;
                case 3:
                  advanced.push(result[i]);
                  break;
                case 4:
                  providers.push(result[i]);
                  break;
              }
            }
            res.render('office.jade',{
              role: res.role,
              username: res.userfullname,
              userid: res.userid,
              geo: geo,
              office: office,
              images: images,
              meanings: meanings,
              included: included,
              advanced: advanced,
              providers: providers
            });
          });
        });
      });
    });
  });
});

app.get('/objects', auth,geolocation, function (req,res) {
  //res.send(req.params);
  geo = res.geo;
  connection.query('SELECT * FROM objects', function (error,result,fields) {
    if (error) throw error;
    var objects = result;
    connection.query('SELECT * FROM offices LEFT JOIN images ON office_cover = image_id',function (error, result, fields) {
      if (error) throw error;
      var offices = result;
      for (var i = 0; i < objects.length; i++) {
        objects[i].object_offices = [];
        for (var j = 0; j < offices.length; j++) {
          if (objects[i].object_id === offices[j].office_object) {
            objects[i].object_offices.push(offices[j]);
          }
        }
      }
      console.log(objects);
      res.render('objects.jade',{
        role: res.role,
        username: res.userfullname,
        userid: res.userid,
        geo: geo,
        objects: objects
      });
    });
  });
});

app.get('/bookmarks', auth,geolocation, function (req,res) {
  //res.send(req.params);
  geo = res.geo;
  console.log(req.cookies.bmarks);
  if (req.cookies.bmarks) {
    console.log('SELECT * FROM offices LEFT JOIN images ON office_cover = image_id WHERE office_id IN ('+req.cookies.bmarks+')');
    connection.query('SELECT * FROM offices LEFT JOIN images ON office_cover = image_id WHERE office_id IN ('+req.cookies.bmarks+')', function (error,result,fields) {
      if (error) throw error;
      offices = result;
      console.log(offices);
      res.render('bookmarks.jade',{
        role: res.role,
        username: res.userfullname,
        userid: res.userid,
        geo: geo,
        count: offices.length,
        offices: offices
      });
    });
  }else{
    res.render('bookmarks.jade',{
      role: res.role,
      username: res.userfullname,
      userid: res.userid,
      geo: geo,
      count: 0
    });
  }
});

app.get('/moder', auth,geolocation,function (req,res) {
  geo = res.geo;
  connection.query('SELECT object_name, object_type, object_adres, object_author, object_id, object_cover, object_create FROM objects', function (error, result, fields) {
    if (error) throw error;
    var objects = result;
    connection.query('SELECT office_name, office_phone, office_subprice, office_area, office_height, office_create, image_filename FROM offices LEFT JOIN images ON image_id = office_cover', function (error, result, fields) {
      if (error) throw error;
      var offices = result;
      for (var i = 0; i < offices.length; i++) {
        var date = offices[i].office_create,
            day = date.getDate() < 10 ? '0'+date.getDate() : date.getDate(),
            month = date.getMonth() < 10 ? '0'+date.getMonth() : date.getMonth(),
            year = date.getFullYear(),
            hours = date.getHours() < 10 ? '0'+date.getHours() : date.getHours(),
            minutes = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes(),
            time = hours+':'+minutes;
        offices[i].office_create = day+'.'+month+'.'+year+' '+time;
      }
      connection.query('SELECT image_id, image_filename FROM images WHERE image_office IS NOT NULL', function (error, result, fields) {
        if (error) throw error;
        var images = result;
        for (var i = 0; i < objects.length; i++) {
          objects[i].offices = [];
          for (var j = 0; j < offices.length; j++) {
            if (offices[j].office_object == objects[i].object_id) {
              objects[i].offices.push(offices[j]);
            }
          }
        }
        console.log(offices);
        res.render('moder.jade',{
          role: res.role,
          username: res.userfullname,
          userid: res.userid,
          geo: geo,
          objects: objects,
          offices: offices,
          images: images
        });
      });
    })
  });
});

app.post('/delobj',function (req,res) {
  // res.send(req.body);
  connection.query('SELECT office_id FROM offices WHERE office_object = '+req.body.object_id,function (error,result,fields) {
    if (error) throw error;
    console.log(result.length);
    if (result.length > 0) {
      var offices = result,
          ofcIdsStr = "",
          ofcIdsArr = [];
      offices.forEach(function(office) {
        ofcIdsArr.push(office.office_id);
      });
      ofcIdsStr = ofcIdsArr.join(',');
      connection.query('DELETE FROM objects\
      WHERE object_id = '+req.body.object_id,
      function (error,result,fields) {
        if (error) throw error;
        connection.query('DELETE FROM offices\
        WHERE office_id IN ('+ofcIdsStr+')',
        function (error,result,fields) {
          if (error) throw error;
          connection.query('DELETE FROM images\
          WHERE image_office IN ('+ofcIdsStr+')',
          function (error,result,fields) {
            if (error) throw error;
            connection.query('DELETE FROM options_offices\
            WHERE link_office IN ('+ofcIdsStr+')',
            function (error,result,fields) {
              if (error) throw error;
              res.send(req.result);
            });
          });
        });
      });
    }else{
      connection.query('DELETE FROM objects WHERE object_id = '+req.body.object_id+'',
      function (error,result,fields) {
        if (error) throw error;
        res.send(req.result);
      });
    }
  });
});

app.post('/delofc',function (req,res) {
  // res.send(req.body);
  connection.query('DELETE FROM offices\
  WHERE office_id = '+req.body.office_id,
  function (error,result,fields) {
    if (error) throw error;
    connection.query('DELETE FROM images\
    WHERE image_office = '+req.body.office_id,
    function (error,result,fields) {
      if (error) throw error;
      connection.query('DELETE FROM options_offices\
      WHERE link_office = '+req.body.office_id,
      function (error,result,fields) {
        if (error) throw error;
        res.send(req.result);
      });
    });
  });
});

app.post('/uploadimage',upload.array('uplimage'),function (req,res,next) {
  var valuesString = [],
      imgWhereString = [];
  for (var i = 0; i < req.files.length; i++) {
    var options = {
      'text':'text',
      'color':'#fff',
      'dstPath': 'uploads/w_'+req.files[i].filename,
      'override-image': true,
      'resize': '50%'
    }
    // console.log(req.files[i]);
    //watermark.embedWatermark(__dirname+'/public/uploads/'+req.files[i].filename, options);
    // console.log(__dirname+'\\uploads\\'+req.files[i].filename);
    // // files[i].originalname;
    // im.identify('uploads/'+req.files[i].filename, function(err, features){
    //   if (err) throw err;
    //   console.log(features);
    //   // { format: 'JPEG', width: 3904, height: 2622, depth: 8 }
    // });

    //add watermark

    //make a thumbail

    valuesString.push('("'+req.files[i].filename+'")');
    imgWhereString.push(req.files[i].filename);
    console.log(req.files[i].filename);
  }
  console.log(req.files);
  valuesString = valuesString.join(',');
  imgWhereString = imgWhereString.join('","')
  if (valuesString.length > 0) {
    connection.query('INSERT INTO images (image_filename) VALUES '+valuesString,function (error,result,fields) {
      if (error) throw error;
      connection.query('SELECT * FROM images WHERE image_filename IN ("'+imgWhereString+'")',function (error,result,fields) {
        if (error) throw error;
        images = result;
        res.send(images);
      });
    });
  }else{
    res.send('Nothing to upload');
  }
});

app.post('/deluplimage',function (req,res) {
  filename = req.body.path.split('/')[2];
  console.log(filename);
  connection.query('DELETE FROM images WHERE image_filename = "'+filename+'"',function (error,result,fields) {
    if (error) throw error;
    fs.unlink('public'+req.body.path, (err) => {
      if (err) throw err;
      console.log('successfully deleted public'+req.body.path);
      connection.query('SELECT * FROM images WHERE image_filename IN ("'+req.body.imgWhereString+'")',function (error,result,fields) {
        if (error) throw error;
        images = result;
        res.send(images);
      });
    });
  });
});

app.post('/setobject',auth,geolocation,function (req,res) {
  // console.log('INSERT INTO objects (object_name,object_create,object_author,object_coords,object_adres,object_publish,object_show,object_type)\
  // VALUES ("'+req.body.object_name+'","'+req.body.object_create+'",'+res.userid+',"'+req.body.object_coords+'","'+req.body.object_adres+'",'+req.body.object_publish+','+req.body.object_show+','+req.body.object_type+')');
  connection.query('INSERT INTO objects (object_name,object_create,object_author,object_coords,object_adres,object_publish,object_show,object_type)\
  VALUES ("'+encodeURI(req.body.object_name)+'","'+req.body.object_create+'",'+res.userid+',"'+req.body.object_coords+'","'+req.body.object_adres+'",'+req.body.object_publish+','+req.body.object_show+','+req.body.object_type+')',
  function (error,result,fields) {
    if (error) throw error;
    res.send(result);
  });
});

app.post('/addoffice', auth,geolocation, function(req,res) {
  connection.query('SELECT * FROM images WHERE image_id ='+req.body.cover[0],function (error,result,fields) {
    if (error) throw error;
    var cover = result[0].image_id;
    //console.log(cover);
    var images = req.body.images.join(',');
    console.log(req.body);
    connection.query('INSERT INTO offices (office_name, office_create, office_author, office_area, office_height, office_subprice, office_tacked, office_cover, office_publish, office_object, office_show, office_phone)\
    VALUES ("'+encodeURI(req.body.header)+'", "'+req.body.create+'", "'+res.userid+'", "'+req.body.sqare+'", "'+req.body.height+'", "'+req.body.price+'", 0, '+cover+', 0, "'+req.body.object+'", 1, "'+req.body.phone+'")',
      function (error,result,fields) {
        if (error) throw error;
        var options = req.body.meanings.join(',') + ',' + req.body.included.join(',') + ',' + req.body.advanced.join(',') + ',' + req.body.providers.join(',');
        options = options.split(',');
        var valString = [];
        var officeId = result.insertId;
        for (var i = 0; i < options.length; i++) {
          valString.push('('+officeId+','+options[i]+')');
        };
        valString = valString.join(',');
        //console.log(valString);
        connection.query('INSERT INTO options_offices (link_office,link_option)\
        VALUES '+valString+'',function (error,result,fields) {
          if (error) throw error;
          connection.query('UPDATE images SET image_office = '+officeId+' WHERE image_id IN ('+images+')',function (error,result,fields) {
            if (error) throw error;
            connection.query('SELECT * FROM images WHERE image_id IN ('+images+')',function (error,result,fields) {
              if (error) throw error;
              for (var i = 0; i < result.length; i++) {
                fs.renameSync(__dirname+'/public/uploads/'+result[i].image_filename,__dirname+'/public/images/obj/'+result[i].image_filename);
                //fs.renameSync('uploads/'+result[i].image_min,'public/images/obj/'+result[i].image_min); adding thumbail should be here
              }
              res.send(result);
            });
            //
          });
        });
    });
  });
});

app.post('/filtred',function (req,res) {
  if (req.body.meanings > 0) {
    var meaningsString = req.body.meanings.join(',');
    connection.query('SELECT link_office FROM options_offices WHERE link_option IN ('+meaningsString+')', function (error,result,fields) {
      if (error) throw error;
      var officesIdArr = [];
      console.log(result);
      if (result.length<=0) {
        res.send({
          count: 0,
          messege: 'Empty answer, nothing to show'
        });
      }else{
        result.forEach(function(item, i, arr) {
          officesIdArr.push(item.link_office);
        });
        officesIdString = officesIdArr.join(',');
        connection.query('SELECT * FROM offices LEFT JOIN images ON image_id = office_cover WHERE (office_id IN ('+officesIdString+')) AND (office_area BETWEEN '+req.body.area[0]+' AND '+req.body.area[1]+')\
        AND (office_subprice BETWEEN '+req.body.price[0]+' AND '+req.body.price[1]+')', function (error,result,fields) {
          if (error) throw error;
          if (result.length<=0) {
            res.send({
              count: 0,
              messege: 'Empty answer, nothing to show'
            });
          }else{
            var offices = result;
            objIds = [];
            for (var i = 0; i < result.length; i++) {
              objIds.push(result[i].office_object);
            }
            objIdsString = objIds.join(',');
            connection.query('SELECT * FROM objects WHERE object_id IN('+objIdsString+')', function (error,result,fields) {
              if (error) throw error;
              var objects = result;
              for (var i = 0; i < objects.length; i++) {
                var ofccount = 0;
                for (var j = 0; j < offices.length; j++) {
                  if (offices[j].office_object === objects[i].object_id) {
                    ofccount++;
                    objects[i].offices_count = ofccount;
                    offices[j].office_adres = objects[i].object_adres;
                    console.log(offices[j].office_adres);
                  }
                }
              }
              res.send({
                objects: objects,
                offices: offices,
                count: result.length,
                messege: 'Seccess, it\'s works'
              });
            });
          }
        });
      }
    });
  }else{
    connection.query('SELECT * FROM offices LEFT JOIN images ON image_id = office_cover  WHERE (office_area BETWEEN '+req.body.area[0]+' AND '+req.body.area[1]+')\
    AND (office_subprice BETWEEN '+req.body.price[0]+' AND '+req.body.price[1]+')', function (error,result,fields) {
      if (error) throw error;
      if (result.length<=0) {
        res.send({
          count: 0,
          messege: 'Empty answer, nothing to show'
        });
      }else{
        var offices = result;
        objIds = [];
        for (var i = 0; i < result.length; i++) {
          objIds.push(result[i].office_object);
        }
        objIdsString = objIds.join(',');
        connection.query('SELECT * FROM objects WHERE object_id IN('+objIdsString+')', function (error,result,fields) {
          if (error) throw error;
          var objects = result;
          for (var i = 0; i < objects.length; i++) {
            var ofccount = 0;
            for (var j = 0; j < offices.length; j++) {
              if (offices[j].office_object === objects[i].object_id) {
                ofccount++;
                var adres = objects[i].object_adres;
                objects[i].offices_count = ofccount;
                offices[j].office_adres = adres;
                console.log(offices[j].office_name);
              }
            }
          }
          res.send({
            objects: objects,
            offices: offices,
            count: result.length,
            messege: 'Seccess, it\'s works'
          });
        });
      }
    });
  }
  // res.send(req.body);
  //meaningsString = req.body.meanings.join(',');
  //connection.query('SELECT * FROM options_offices WHERE link_option IN ('+meaningsString+')');
});

server = app.listen(8000,function(){
  console.log('Listening on port 8000');
});
