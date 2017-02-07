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
    im = require('imagemagick'),
    requestIp = require('request-ip');

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

var geolocation = function(req,res,next) {
  var surceIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      ip, coords, randNum;
  //ip = surceIp.replace(/^.*:/, '');
  ip = "188.168.22.110";
  var geo;
  if (geoip.lookup(ip)) {
    geo = geoip.lookup(ip);
    geo.ip = ip;
  }else{
    geo = {};
    geo.ll = [55.7543, 37.619744];
    geo.ip = ip;
  }
  res.geo = geo;
  console.log(geo.ll);
  clientlatitude = req.cookies.clientlatitude;
  clientlongitude = req.cookies.clientlongitude;
  if (clientlatitude === undefined) {
    res.cookie('clientlatitude', geo.ll[0], { maxAge: 900000, httpOnly: false });
    res.cookie('clientlongitude', geo.ll[1], { maxAge: 900000, httpOnly: false });
    console.log('cookie created successfullyl', [clientlatitude, clientlongitude]);
  } else {
    console.log('cookie exists', [clientlatitude, clientlongitude]);
  }
  next();
}

app.use(geolocation);

// var ipMiddleware = function(req, res, next) {
//     var clientIp = requestIp.getClientIp(req);
//     // console.log(clientIp);
//     res.clientIp = clientIp;
//     next();
// };

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

// app.post('/getlocation', geolocation, function (req,res) {
//   var coords = res.geo.ll;
//   res.send({
//     coords: coords
//   });
// });

app.post('/choosecity',function (req,res) {
  connection.query('SELECT city_id, city_name FROM citys',function (error,result,fields) {
    if (error) throw error;
    if (result) {
      res.send({
        citys: result,
        count: result.length
      });
    }else{
      res.send({
        count: 0
      });
    }
  });
});

app.post('/getcitybyname',function (req,res) {
  connection.query('SELECT city_id, city_name, city_coords FROM citys WHERE city_name LIKE "%'+req.body.city_name+'%"',function (error,result,fields) {
    if (error) throw error;
    if (result.length > 0) {
      res.send({
        city: result[0],
        count: result.length
      });
    }else{
      res.send({
        count: 0
      });
    }
  });
});

app.post('/getcitybyid',function (req,res) {
  connection.query('SELECT city_id, city_name, city_coords FROM citys WHERE city_id = '+req.body.city_id, function (error,result,fields) {
    if (error) throw error;
    // console.log("city_id ", req.body.city_id);
    if (result) {
      res.send({
        city: result[0],
        count: result.length
      });
    }else{
      res.send({
        count: 0
      });
    }
  });
});

app.post('/addcity',function (req,res) {
  connection.query('INSERT INTO citys (city_name, city_coords) VALUES ("'+req.body.city_name+'", "'+req.body.city_coords+'")',function (error,result,fields) {
    console.log(req.body.city_name);
    if (error) throw error;
    if (result) {
      res.send({
        status: "success",
        city_id: result.insertId,
        city_name: req.body.city_name,
        city_coords: req.body.city_coords
      });
    }else{
      res.send({
        status: "unsuccess"
      });
    }
  });
});

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
      connection.query('INSERT INTO users (user_email,user_pass,user_role,user_firstname,user_lastname,user_ban,user_confirm) \
      VALUES ("'+user.email+'","'+hash+'",1,"'+user.firstname+'","'+user.lastname+'",0,0)',
      function(error, result, fields) {
        if (error) throw error;
        res.send({status:'success'});
      });
    }
  });
});


app.post('/login',function (req,res) {
  console.log(req.body);
  //res.send(req.body);
  var email = req.body.email;
  connection.query('SELECT * FROM users WHERE user_email = "'+email+'"',
  function(error, result, fields){
    if (error) {throw error; res.send({status:'error'})};
    if (result.length > 0) {
      var pass = req.body.pass;
      var hash = crypto.createHmac('sha256', pass)
                         .update('I love cupcakes')
                         .digest('hex');
      if (result[0].user_pass === hash && result[0].user_confirm === 1 && result[0].user_ban === 0) {
        var user = result[0];
        console.log(user);
        connection.query('SELECT * FROM roles WHERE role_id = '+user.user_role, function (error,result,fields) {
          if (error) {throw error; res.send({status:'error'})};
          req.session.userfullname = user.user_firstname + ' ' + user.user_lastname;
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
      }else{
        res.send({status: 'unsuccess'});
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

app.post('/confirmobject', function (req,res) {
  connection.query('UPDATE objects SET object_publish = 1 WHERE object_id = '+req.body.object_id,
  function (error, result, fields) {
    if (error) throw error;
    res.send({success: 1});
  });
});

app.post('/unconfirmobject', function (req,res) {
  connection.query('UPDATE objects SET object_publish = 2 WHERE object_id = '+req.body.object_id,
  function (error, result, fields) {
    if (error) throw error;
    res.send({success: 1});
  });
});

app.post('/changesolutionobject', function (req,res) {
  connection.query('UPDATE objects SET object_publish = 0 WHERE object_id = '+req.body.object_id,
  function (error, result, fields) {
    if (error) throw error;
    res.send({success: 1});
  });
});

app.post('/objecttoarchive', function (req,res) {
  connection.query('UPDATE objects SET object_show = 0 WHERE object_id = '+req.body.object_id,
  function (error, result, fields) {
    if (error) throw error;
    res.send({success: 1});
  });
});

app.post('/confirmoffice', function (req,res) {
  connection.query('UPDATE offices SET office_publish = 1 WHERE office_id = '+req.body.office_id,
  function (error, result, fields) {
    if (error) throw error;
    res.send({success: 1});
  });
});

app.post('/unconfirmoffice', function (req,res) {
  connection.query('UPDATE offices SET office_publish = 2 WHERE office_id = '+req.body.office_id,
  function (error, result, fields) {
    if (error) throw error;
    res.send({success: 1});
  });
});

app.post('/officetoarchive', function (req,res) {
  connection.query('UPDATE offices SET office_show = 0 WHERE office_id = '+req.body.office_id,
  function (error, result, fields) {
    if (error) throw error;
    res.send({success: 1});
  });
});

app.post('/userban',auth, function (req,res) {
  if (req.session.role) {
    if (req.session.role == 'admin') {
      connection.query('SELECT user_ban, role_name FROM users LEFT JOIN roles ON role_id = user_role WHERE user_id = '+req.body.user_id, function (error, result, fields) {
        if (result[0].role_name == 'admin') {
          res.send({err: 'Ошибка доступа. Обратитесь к администратору системы.'})
        }else{
          if (result[0].user_ban == 1) {
            connection.query('UPDATE users SET user_ban = 0 WHERE user_id = '+req.body.user_id,
            function (error, result, fields) {
              if (error) throw error;
              res.send({success: 1, result: 'Заблокировать'});
            });
          }else{
            connection.query('UPDATE users SET user_ban = 1 WHERE user_id = '+req.body.user_id,
            function (error, result, fields) {
              if (error) throw error;
              res.send({success: 1, result: 'Заблокирован'});
            });
          }
        }
      });
    }else if(req.session.role == 'moder'){
      connection.query('SELECT user_ban, role_name FROM users LEFT JOIN roles ON role_id = user_role WHERE user_id = '+req.body.user_id, function (error, result, fields) {
        console.log(result[0]);
        if (result[0].role_name == 'admin' || result[0].role_name == 'moder' ) {
          res.send({err: 'Ошибка доступа. Обратитесь к администратору системы.'})
        }else{
          if (result[0].user_ban == 1) {
            connection.query('UPDATE users SET user_ban = 0 WHERE user_id = '+req.body.user_id,
            function (error, result, fields) {
              if (error) throw error;
              res.send({success: 1, result: 'Заблокировать'});
            });
          }else{
            connection.query('UPDATE users SET user_ban = 1 WHERE user_id = '+req.body.user_id,
            function (error, result, fields) {
              if (error) throw error;
              res.send({success: 1, result: 'Заблокирован'});
            });
          }
        }
      });
    }else{
      res.redirect('/');
    }
  }else{
    res.redirect('/');
  }
});

app.post('/confirmuser', function (req,res) {
  connection.query('UPDATE users SET user_confirm = 1 WHERE user_id = '+req.body.user_id,
  function (error, result, fields) {
    if (error) throw error;
    res.send({success: 1, result: 'Подтверждён'});
  });
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

app.get('/',auth, function(req,res) {
  console.log('Cookies: ', req.cookies);
  connection.query('SELECT * FROM options WHERE option_type = 1',function (error,result,fields) {
    if (error) throw error;
    meanings = result;
    res.render('home.jade',{
      role: res.role,
      username: res.userfullname,
      userid: res.userid,
      meanings: meanings,
      ishome: 1,
      //clientIp: res.clientIp
    });
  });
});

app.get('/my',auth, function(req,res) {
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
          // result[i]
        }
        console.log("city_id", req.cookies.city_id);
        connection.query('SELECT object_id,object_name,object_adres,object_cover\
         FROM objects WHERE object_city = '+req.cookies.city_id, function (error,result,fields) {
          if (error) throw error;
          var objects = result;
          for (var i = 0; i < objects.length; i++) {
            objects[i].object_offices = [];
          }
          connection.query('SELECT * FROM offices LEFT JOIN images ON office_cover = image_id WHERE office_author ='+res.userid+' ORDER BY office_create ASC', function (error,result,fields) {
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
              for (var j = 0; j < objects.length; j++) {
                if (offices[i].office_object === objects[j].object_id) {
                  objects[j].object_offices.push(offices[i]);
                  offices[i].office_adres = objects[j].object_adres;
                }
              }
            }
            // console.log(objects);
            // console.log(meanings[2].option_id);
            console.log(res.role);
            res.render('my.jade',{
              role: res.role,
              username: res.userfullname,
              userid: res.userid,
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

app.get('/editofc-:officeid', auth, function (req, res) {
  // req.session.role = result[0].role_name;
  // req.session.userid = user.user_id;
  // req.cookies.role = result[0].role_name;
  // req.cookies.userid = user.user_id;
  connection.query('SELECT * FROM offices WHERE office_author ='+req.session.userid+' AND office_id='+req.params.officeid, function (error,result,fields) {
    if (error) throw error;
    if (result.length > 0) {
      var office = result[0];
      connection.query('SELECT * FROM images WHERE image_office ='+office.office_id, function (error,result,fields) {
        if (error) throw error;
        // images = result;
        if (result.length > 0) {
          images = result;
        }else{
          images = false;
        }
        connection.query('SELECT * FROM options '/* LEFT JOIN options_offices ON link_option = option_id*/ +'LEFT JOIN opttypes ON option_type = opttype_id'/* WHERE link_office = '+office.office_id*/, function (error,result,fields) {
          if (error) throw error;
          var options;
          if (result.length > 0) {
            options = result;
            var meanings = [], includes = [], advanceds = [], providers = [];
            for (var i = 0; i < options.length; i++) {
              if (options[i].opttype_name == 'meaning') {
                meanings.push(options[i]);
              }
              if (options[i].opttype_name == 'included') {
                includes.push(options[i]);
              }
              if (options[i].opttype_name == 'advanced') {
                advanceds.push(options[i]);
              }
              if (options[i].opttype_name == 'providers') {
                providers.push(options[i]);
              }
            }
          }else{
            options = false
          }
          connection.query('SELECT link_option FROM options_offices WHERE link_office = '+office.office_id, function (error,result,fields) {
            if (error) throw error;
            var linkedopts = [];
            // console.log("linkedopts: "+typeof(linkedopts));
            for (var i = 0; i < result.length; i++) {
              linkedopts.push(result[i].link_option);
            }
            // linkedopts = linkedopts.join(' ');
            console.log("linkedopts: "+linkedopts);
            // console.log(result[0]);
            connection.query('SELECT object_name, object_id FROM objects', function (error,result,fields) {
              if (error) throw error;
              objects = result;
              res.render('editofc.jade', {office: office, images: images, meanings: meanings, includes: includes, advanceds: advanceds, providers: providers, linkedopts: linkedopts, objects: objects});
            });
          });
        });
      });
      // res.send({office: result});
    }else{
      res.render('editofc.jade', {office: false});
    }

  });
});

app.post('/editofcmain-:oficeid', function (req, res) {
  connection.query('UPDATE offices SET office_name = "'+req.body.name+'", office_description = "'+req.body.description+'", office_object = "'+req.body.object+'", office_area = "'+req.body.area+'", office_height = "'+req.body.height+'", office_subprice = "'+req.body.subprice+'", office_totalptice = "'+req.body.totalprice+'", office_phone = "'+req.body.phone+'" WHERE office_id = '+req.params.oficeid+'', function (error, result, fields) {
    if (error) throw error;
    connection.query('SELECT * FROM offices WHERE office_id = '+req.params.oficeid+'', function (error, result, fields) {
      if (error) throw error;
      res.send({office: result[0]});
    });
  });
});

app.post('/editofcoptions-:officeid', function (req, res) {
  // res.send(req.body);
  if (req.body.val == 1) {
    // res.send('add');
    connection.query('INSERT INTO options_offices (link_option, link_office) VALUES ('+req.body.optionid+', '+req.params.officeid+')', function (error, result, fields) {
      if (error) throw error;
      res.send('add');
    });
  }else{
    connection.query('DELETE from options_offices WHERE link_option='+req.body.optionid, function (error, result, fields) {
      if (error) throw error;
      res.send('remove');
    });
    // res.send('remove');
  }
})

app.get('/admin', auth, function (req, res) {
  if (res.role == 'admin') {
    connection.query('SELECT * FROM objtypes', function (error,result,fields) {
      if (error) throw error;
      objtypes = result;
      connection.query('SELECT * FROM citys', function (error,result,fields) {
        if (error) throw error;
        citys = result;
        connection.query('SELECT * FROM options', function (error,result,fields) {
          if (error) throw error;
          options = result;
          connection.query('SELECT * FROM objects', function (error,result,fields) {
            if (error) throw error;
            objects = result;
            res.render('admin.jade', {
              role: res.role,
              username: res.userfullname,
              userid: res.userid,
              objtypes: objtypes,
              citys: citys,
              options: options,
              objects: objects
            });
          });
        });
      });
    });
  }else{
    res.redirect("/");
  }
});

app.post('/admin/objtypes', function (req, res) {
  connection.query('UPDATE objtypes SET objtype_name = "'+req.body.name+'" WHERE objtype_id='+req.body.id, function (error,result,fields) {
    if (error) throw error;
    res.redirect('/admin');
  });
});

app.post('/admin/citys', function (req, res) {
  connection.query('UPDATE citys SET city_name = "'+req.body.name+'" WHERE city_id='+req.body.id, function (error,result,fields) {
    if (error) throw error;
    res.redirect('/admin');
  });
});

app.post('/admin/options', function (req, res) {
  connection.query('UPDATE options SET option_name = "'+req.body.name+'" WHERE option_id='+req.body.id, function (error,result,fields) {
    if (error) throw error;
    res.redirect('/admin');
  });
});

app.post('/admin/objects', function (req, res) {
  connection.query('UPDATE objects SET object_name = "'+req.body.name+'", object_adres = "'+req.body.adres+'" WHERE object_id='+req.body.id, function (error,result,fields) {
    if (error) throw error;
    res.redirect('/admin');
  });
});

app.post('/my', function (req,res) {
  // connection.query('SELECT * FROM objects WHERE object_adres LIKE "%'+req.body.city+'%" AND object_author ='+res.userid, function (error,result,fields) {
  connection.query('SELECT * FROM objects', function (error,result,fields) {
    if (error) throw error;
    var objects = result;
    var objByCityArr = [];
    if (result.length > 0) {
      for (var i = 0; i < result.length; i++) {
        objByCityArr.push(result[i].object_id);
        result[i].object_offices = [];
      }
      objByCity = objByCityArr.join(',');
    }
    console.log(req.body.city);
    console.log(res.userid);
    connection.query('SELECT * FROM offices LEFT JOIN images ON office_cover = image_id WHERE office_author ='+res.userid,function (error, result, fields) {
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
      for (var i = 0; i < objects.length; i++) {
        for (var j = 0; j < offices.length; j++) {
          if (objects[i].object_id === offices[j].office_object) {
            objects[i].object_offices.push(offices[j]);
          }
        }
      }
      console.log(objects);
      res.send({
        objects: objects
      });
    });
  });
});

app.get('/object-:object_id', auth, function (req,res) {
  connection.query('SELECT * FROM objects WHERE object_id = '+req.params.object_id+' AND object_show = 1 AND object_publish = 1', function (error,result,fields) {
    if (error) throw error;
    object = result[0];
    // console.log(result);
    // connection.query('SELECT * FROM offices LEFT JOIN images ON image_id = office_cover WHERE office_show = 1 AND office_object = '+req.params.object_id, function (error,result,fields) {
    connection.query('SELECT * FROM offices LEFT JOIN images ON image_id = office_cover WHERE office_show = 1 AND office_object = '+req.params.object_id, function (error,result,fields) {
      if (error) throw error;
      object.object_offices = result;
      console.log(result);
      // console.log("role",res.role);
      res.render('object.jade',{
        role: res.role,
        username: res.userfullname,
        userid: res.userid,
        object: object
      });
    });
  });
});

app.get('/office-:office_id', auth, function (req,res) {
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
            console.log("role",res.role);
            res.render('office.jade',{
              role: res.role,
              username: res.userfullname,
              userid: res.userid,
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

app.get('/objects', auth, function (req,res) {
  connection.query('SELECT * FROM objects WHERE object_city = '+req.cookies.city_id+' AND object_publish = 1 AND object_show = 1', function (error,result,fields) {
    if (error) throw error;
    var objects = result;
    console.log(objects);
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
      res.render('objects.jade',{
        role: res.role,
        username: res.userfullname,
        userid: res.userid,
        objects: objects
      });
    });
  });
});

// app.post('/objects', function (req, res) {
//   connection.query('SELECT * FROM objects WHERE object_adres LIKE "%'+req.body.city+'%"', function (error,result,fields) {
//     if (error) throw error;
//     var objects = result;
//     console.log(req.body.city);
//     connection.query('SELECT * FROM offices LEFT JOIN images ON office_cover = image_id',function (error, result, fields) {
//       if (error) throw error;
//       var offices = result;
//       for (var i = 0; i < objects.length; i++) {
//         objects[i].object_offices = [];
//         for (var j = 0; j < offices.length; j++) {
//           if (objects[i].object_id === offices[j].office_object) {
//             objects[i].object_offices.push(offices[j]);
//           }
//         }
//       }
//       console.log(objects);
//       res.render('objects.jade',{
//         role: res.role,
//         username: res.userfullname,
//         userid: res.userid,
//         objects: objects
//       });
//       // res.send({
//       //   objects: objects
//       // });
//     });
//   });
// });

app.get('/bookmarks', auth, function (req,res) {
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
        // geo: geo,
        count: offices.length,
        offices: offices
      });
    });
  }else{
    res.render('bookmarks.jade',{
      role: res.role,
      username: res.userfullname,
      userid: res.userid,
      count: 0
    });
  }
});

app.get('/moder', auth,function (req,res) {
  if (res.role == 'admin' || res.role == 'moder') {
    connection.query('SELECT object_id, object_name, object_type, object_adres, object_author, object_id, object_cover, object_create, object_city, object_type, object_publish FROM objects WHERE object_city = '+req.cookies.city_id, function (error, result, fields) {
      if (error) throw error;
      var objects = result;
      if (objects.length > 0) {
        var objTypeIdsArr = [];
        var objTypeIdsStr;
        var objAdresArr = [];
        for (var i = 0; i < objects.length; i++) {
          var date = objects[i].object_create,
              day = date.getDate() < 10 ? '0'+date.getDate() : date.getDate(),
              month = date.getMonth() < 10 ? '0'+date.getMonth() : date.getMonth(),
              year = date.getFullYear(),
              hours = date.getHours() < 10 ? '0'+date.getHours() : date.getHours(),
              minutes = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes(),
              time = hours+':'+minutes;
          objects[i].object_create = day+'.'+month+'.'+year+' '+time;
          // objects[i].object_adres = objects[i].object_adres
          objAdresArr = objects[i].object_adres.split(",");
          objAdresArr.splice(0,1);
          objects[i].object_adres = objAdresArr.join(',');
          objects[i].object_offices = [];
          objects[i].object_nopublishofccount = 0;
          objects[i].object_typename = "";
          objTypeIdsArr.push(objects[i].object_id);
        }
        objTypeIdsStr = objTypeIdsArr.join(',');
        connection.query('SELECT option_id, option_name FROM options LEFT JOIN opttypes ON option_type = opttype_id WHERE opttype_name ="meaning"', function (error, result, fields) {
          if (error) throw error;
          var objtypes = result;
          // console.log(objtypes);
          for (var i = 0; i < objects.length; i++) {
            for (var j = 0; j < objtypes.length; j++) {
              if (objtypes[j].objtype_id === objects[i].object_type) {
                objects[i].object_typename = objtypes[j].objtype_name;
                // console.log(decodeURI(objects[i].object_typename));
                // console.log("obj_type", objects[i].object_type);
              }
            }
          }
          connection.query('SELECT office_name, office_id, office_phone, office_subprice, office_show, office_area, office_height, office_create, office_cover, office_object, image_filename, office_publish, office_author FROM offices LEFT JOIN images ON image_id = office_cover', function (error, result, fields) {
            if (error) throw error;

            officesIdsArr = [];
            for (var i = 0; i < result.length; i++) {
              var date = result[i].office_create,
                  day = date.getDate() < 10 ? '0'+date.getDate() : date.getDate(),
                  month = date.getMonth() < 10 ? '0'+date.getMonth() : date.getMonth(),
                  year = date.getFullYear(),
                  hours = date.getHours() < 10 ? '0'+date.getHours() : date.getHours(),
                  minutes = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes(),
                  time = hours+':'+minutes;
              result[i].office_create = day+'.'+month+'.'+year+' '+time;
              officesIdsArr.push(result[i].office_id);
            }
            var archoffices = [];
            var offices = [];
            for (var i = 0; i < result.length; i++) {
              // result[i]
              if (result[i].office_show == 1) {
                offices.push(result[i]);
              }else{
                archoffices.push(result[i]);
              }
            }
            officesIdsStr = officesIdsArr.join(",");
            connection.query('SELECT image_id, image_filename, image_office FROM images WHERE image_office IN ('+officesIdsStr+')', function (error, result, fields) {
              if (error) throw error;
              var images = result;
              console.log(result);
              for (var i = 0; i < offices.length; i++) {
                offices[i].office_image = "";
                offices[i].office_images = [];
                for (var j = 0; j < images.length; j++) {
                  if (offices[i].office_id == images[j].image_office) {
                    offices[i].office_image = images[j].image_filename;
                    offices[i].office_images.push(images[j]);
                  }
                }
                console.log(offices[i].office_image);
              }
              var nopublishofccount = 0;
              for (var i = 0; i < objects.length; i++) {
                // objects[i].object_nopublishofccount = 0;
                for (var j = 0; j < offices.length; j++) {
                  if (offices[j].office_object === objects[i].object_id) {
                    objects[i].object_offices.push(offices[j]);
                    // console.log(objects[i].object_offices);
                    // console.log(offices[j].office_publish);
                    if (offices[j].office_publish === 0) {
                      objects[i].object_nopublishofccount++;
                      nopublishofccount++;
                    }
                  }
                }
              }

              for (var i = 0; i < archoffices.length; i++) {
                archoffices[i].office_image = [];
                for (var j = 0; j < images.length; j++) {
                  if (archoffices[i].office_id === images[j].image_office) {
                    archoffices[i].office_image = images[j].image_filename;
                  }
                }
              }
              connection.query("SELECT user_id, user_email, user_role, user_firstname, user_lastname, user_ban, user_mobile, user_confirm, role_name FROM users LEFT JOIN roles ON user_role = role_id", function (error, result, fields) {
                if (error) throw error;
                var users = result;
                console.log(users);
                for (var i = 0; i < objects.length; i++) {
                  //objects[i].object_author = [];
                  for (var j = 0; j < users.length; j++) {
                    if (objects[i].object_author === users[j].user_id) {
                      objects[i].object_author = users[j];
                    }
                  }
                  for (var k = 0; k < objects[i].object_offices.length; k++) {
                    //offices[i].office_author = [];
                    for (var j = 0; j < users.length; j++) {
                      if (objects[i].object_offices[k].office_author === users[j].user_id) {
                        objects[i].object_offices[k].office_author = users[j];
                      }
                    }
                  }
                }
                for (var k = 0; k < archoffices.length; k++) {
                  //offices[i].office_author = [];
                  for (var j = 0; j < users.length; j++) {
                    if (archoffices[k].office_author === users[j].user_id) {
                      archoffices[k].office_author = users[j];
                    }
                  }
                }


                // console.log(objects);
                // console.log(objects);

                res.render('moder.jade',{
                  nopublishofccount: nopublishofccount,
                  role: res.role,
                  username: res.userfullname,
                  userid: res.userid,
                  objects: objects,
                  objtypes: objtypes,
                  offices: offices,
                  images: images,
                  users: users,
                  archoffices: archoffices
                });
                // res.send({
                //   nopublishofccount: nopublishofccount,
                //   role: res.role,
                //   username: res.userfullname,
                //   userid: res.userid,
                //   objects: objects,
                //   objtypes: objtypes,
                //   offices: offices,
                //   images: images,
                //   users: users,
                //   archoffices: archoffices
                // });
              });
            });
          });
        });
      }else{
        res.render('moder.jade',{
          // nopublishofccount: nopublishofccount,
          role: res.role,
          username: res.userfullname,
          userid: res.userid,
          // objects: objects,
          // objtypes: objtypes,
          // offices: offices,
          // images: images,
          // users: users,
          // archoffices: archoffices
        });

        // res.send({
        //   // nopublishofccount: nopublishofccount,
        //   role: res.role,
        //   username: res.userfullname,
        //   userid: res.userid,
        //   // objects: objects,
        //   // objtypes: objtypes,
        //   // offices: offices,
        //   // images: images,
        //   // users: users,
        //   // archoffices: archoffices
        // });
      }

    });
  }else{
    res.redirect('/');
  }
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
  connection.query("UPDATE offices SET office_show = 0", function (error,result,fields) {
    if (error) throw error;
    res.send(req.result);
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
    // watermark.embedWatermark(__dirname+'/public/uploads/'+req.files[i].filename, options);
    // console.log(__dirname+'/uploads/'+req.files[i].filename);
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
        // console.log(req.body);
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

        if (req.body.imageid) {
          connection.query('DELETE FROM images WHERE image_id ='+req.body.imageid, function (error,result,fields) {
            if (error) throw error
            res.send(images);
          });
        }
      });
    });
  });
});

app.post('/setuplimage', function (req,res) {
  // res.send(req.body);
  images = req.body.imageids.join(',');
  connection.query('UPDATE images SET image_office = '+req.body.ofcid+' WHERE image_id IN ('+images+')', function (error,result,fields) {
    if (error) throw error;
    // res.send('restext');
    connection.query('UPDATE offices SET office_cover = '+req.body.mainimg+' WHERE office_id = '+req.body.ofcid, function (error,result,fields) {
      if (error) throw error;
      connection.query('SELECT * FROM images WHERE image_id IN ('+images+')',function (error,result,fields) {
        if (error) throw error;
        for (var i = 0; i < result.length; i++) {
          // fs.exists(__dirname+'/public/uploads/'+result[i].image_filename, (exists) => {
            // console.log(exists ? 'it\'s there' : 'no passwd!');
            if (fs.existsSync(__dirname+'/public/uploads/'+result[i].image_filename)) {
              fs.renameSync(__dirname+'/public/uploads/'+result[i].image_filename, __dirname+'/public/images/obj/'+result[i].image_filename);
            }
          // });
          // fs.renameSync(__dirname+'/public/uploads/'+result[i].image_filename, __dirname+'/public/images/obj/'+result[i].image_filename);
          //fs.renameSync('uploads/'+result[i].image_min,'public/images/obj/'+result[i].image_min); adding thumbail should be here
        }
        res.send(result);
      });
      // res.send('restext');
    })
  });
});

app.post('/setobject',auth,function (req,res) {
  // console.log('INSERT INTO objects (object_name,object_create,object_author,object_coords,object_adres,object_publish,object_show,object_type)\
  // VALUES ("'+req.body.object_name+'","'+req.body.object_create+'",'+res.userid+',"'+req.body.object_coords+'","'+req.body.object_adres+'",'+req.body.object_publish+','+req.body.object_show+','+req.body.object_type+')');
  connection.query('INSERT INTO objects (object_name,object_create,object_author,object_coords,object_adres,object_publish,object_show,object_type, object_city)\
  VALUES ("'+req.body.object_name+'","'+req.body.object_create+'",'+res.userid+',"'+req.body.object_coords+'","'+req.body.object_adres+'",0,1,'+req.body.object_type+','+req.body.object_city+')',
  function (error,result,fields) {
    if (error) throw error;
    res.send(result);
  });
});

app.post('/addoffice', auth, function(req,res) {
  connection.query('SELECT * FROM images WHERE image_id ='+req.body.cover[0],function (error,result,fields) {
    if (error) throw error;
    var cover = result[0].image_id;
    //console.log(cover);
    var images = req.body.images.join(',');
    console.log(req.body);
    connection.query('INSERT INTO offices (office_name, office_create, office_author, office_area, office_height, office_subprice, office_tacked, office_cover, office_publish, office_object, office_show, office_phone)\
    VALUES ("'+req.body.header+'", "'+req.body.create+'", "'+res.userid+'", "'+req.body.sqare+'", "'+req.body.height+'", "'+req.body.price+'", 0, '+cover+', 0, "'+req.body.object+'", 1, "'+req.body.phone+'")',
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
                fs.renameSync(__dirname+'/public/uploads/'+result[i].image_filename, __dirname+'/public/images/obj/'+result[i].image_filename);
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
  console.log(req.body.city);
  var objByCity;
  connection.query('SELECT object_id FROM objects WHERE object_city = '+req.body.city+' AND object_publish = 1 AND object_show = 1', function (error, result, fields) {// LIKE "%'+req.body.city+'%"
    if (error) throw error;
    var objByCityArr = [];
    if (result.length > 0) {
      for (var i = 0; i < result.length; i++) {
        objByCityArr.push(result[i].object_id);
      }
      objByCity = objByCityArr.join(',');
      console.log(objByCity);
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
            AND (office_subprice BETWEEN '+req.body.price[0]+' AND '+req.body.price[1]+') AND office_publish = 1', function (error,result,fields) { // AND (office_object IN ('+objByCity+'))
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
                connection.query('SELECT * FROM objects WHERE object_id IN ("'+objIdsString+'") AND object_publish = 1 AND object_show = 1', function (error,result,fields) { // WHERE object_id IN('+objIdsString+')
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
        AND (office_subprice BETWEEN '+req.body.price[0]+' AND '+req.body.price[1]+') AND office_publish = 1', function (error,result,fields) { // AND (office_object IN ('+objByCity+'))
          if (error) throw error;
          console.log(result.length);
          if (result.length<=0) {
            res.send({
              count: 0,
              messege: 'Empty offices answer, nothing to show'
            });
          }else{
            var offices = result;
            objIds = [];
            // console.log("offices: ", result.length);
            for (var i = 0; i < offices.length; i++) {
              objIds.push(offices[i].office_object);
            }
            objIdsString = objIds.join(',');
            // console.log('objIdsString', objIdsString);
            connection.query('SELECT * FROM objects WHERE object_id IN ('+objIdsString+') AND object_publish = 1 AND object_show = 1', function (error,result,fields) { // WHERE object_id IN('+objIdsString+')
              if (error) throw error;
              var objects = result;
              console.log("objects",objects);
              for (var i = 0; i < objects.length; i++) {
                var ofccount = 0;
                objects[i].object_offices = [];
                for (var j = 0; j < offices.length; j++) {
                  if (offices[j].office_object === objects[i].object_id) {
                    ofccount++;
                    var adres = objects[i].object_adres;
                    objects[i].offices_count = ofccount;
                    offices[j].office_adres = adres;
                    // console.log(offices[j].office_name);
                    objects[i].object_offices.push(offices[j]);
                  }
                }
                objects[i].offices_count = ofccount;
                // console.log("ofccount: ", ofccount);
              }
              // console.log(objects);
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
    }else{
      res.send({
        count: 0,
        messege: 'Empty answer, nothing to show'
      });
    }
  });
  // res.send(req.body);
  //meaningsString = req.body.meanings.join(',');
  //connection.query('SELECT * FROM options_offices WHERE link_option IN ('+meaningsString+')');
});

server = app.listen(8000,function(){
  console.log('Listening on port 8000');
});
