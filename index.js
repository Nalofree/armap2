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

// var watermarkOptions = {
//     'text' : 'rentozavr-rf',
//     //'resize' : '200%',
//     //'override-image' : true,
//     //'dstPath' : 'uploads/watermark.jpg'
// };

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
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

function geolocation() {
  //var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  //ip = ip.substring(7);
  var ip = "188.168.22.110";
  if (ip != 0) {
    var geo = geoip.lookup(ip);// ? geoip.lookup(ip.slice(1,-1)) : 0;
    geo.zoom = 13;
  }else{
    var geo = {};//61.802742, 97.175641
    geo.ll = [61.802742, 97.175641];
    geo.city = "Все города";
    geo.zoom = 4;
  }
  return geo;
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

app.get('/',auth, function(req,res) {
  geo = geolocation();
  console.log('Cookies: ', req.cookies);
  res.render('home.jade',{
    role: res.role,
    username: res.userfullname,
    userid: res.userid,
    geo: geo,
    ishome: 1
  });
});

app.get('/my',auth, function(req,res) {
  geo = geolocation();
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
        connection.query('SELECT object_id,object_name,object_adres,object_cover FROM objects WHERE object_author ='+res.userid,function (error,result,fields) {
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

app.post('/uploadimage',upload.array('uplimage'),function (req,res,next) {
  var valuesString = [],
      imgWhereString = [];
  for (var i = 0; i < req.files.length; i++) {
  //   var options = {
  //     'text':'text',
  //     'color':'#fff',
  //     'dstPath': 'uploads/w_'+req.files[i].filename,
  //     'override-image': true,
  //     'resize': '50%'
  //   }
    // console.log(req.files[i]);
    // watermark.embedWatermark('uploads/'+req.files[i].filename, options);
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

app.post('/setobject',auth,function (req,res) {
  connection.query('INSERT INTO objects (object_name,object_create,object_author,object_coords,object_adres,object_publish,object_show,object_type)\
  VALUES ("'+req.body.object_name+'","'+req.body.object_create+'",'+res.userid+',"'+req.body.object_coords+'","'+req.body.object_adres+'",'+req.body.object_publish+','+req.body.object_show+','+req.body.object_type+')',
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
              for (var i = 0; i < result.length; i++) {
                fs.renameSync(__dirname+'/public/uploads/'+result[i].image_filename,__dirname+'/public/images/obj/'+result[i].image_filename);
                //fs.renameSync('uploads/'+result[i].image_min,'public/images/obj/'+result[i].image_min);
              }
              res.send(result);
            });
            //
          });
        });
    });
  });
})

server = app.listen(3000,function(){
  console.log('Listening on port 3000');
});
