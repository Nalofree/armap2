var express = require('express'),
    server,
    app = express(),
    bodyParser = require('body-parser'),
    // Promise = require('promise'),
    //session = require('express-session'),
    mysql = require('mysql'),
    crypto = require('crypto'),
    geoip = require('geoip-lite'),
    cookieSession = require('cookie-session');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'admin_armap_db',
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

app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'jade');

// var ip = "188.168.22.110";
// var geo = geoip.lookup(ip);
//
// console.log(geo);

function getObjects(objParams) {
  if (objParams!== undefined) {
    var whereString = 'WHERE ',
        whereArray = [];
    for (var key in objParams) {
      var parametr = objParams[key];
      whereArray.push('object_'+key+' IN ('+parametr+')');
    }
    whereString = whereString + whereArray.join(' AND ');
    console.log(whereString);
  }else{
    var whereString = '';
    console.log(whereString);
  }
  return new Promise(function(resolve, reject) {
    var objects=[];
    connection.query('SELECT * FROM objects LEFT JOIN images_object\
    									ON images_object_object = object_id LEFT JOIN images\
    									ON image_id = images_object_image '+ whereString,
    	function(error, result, fields){
    		if (error) reject(error);
        if (result!== undefined) {
          for (var i = 0; i <= result.length - 1; i++) {
           	objects[i] = {
           		object_id: result[i].object_id,
           		object_name: decodeURI(result[i].object_name),
           		object_coordinates: result[i].object_coordinates,
           		object_addres: decodeURI(result[i].object_addres),
           		object_show: result[i].object_show,
              object_image: result[i].image_name,
              object_create_date: result[i].object_create_date,
              object_publish: result[i].object_publish,
              object_type: result[i].object_type,
              object_author: result[i].object_author,
           	};
          };
          resolve(objects);
        }else{
          reject('No one results');
        }
    });
  });
};

function getOffices(ofcParams) {
  if (ofcParams!== undefined) {
    var whereString = 'WHERE ',
        whereArray = [];
    for (var key in ofcParams) {
      var parametr = ofcParams[key];
      whereArray.push('office_'+key+' IN ('+parametr+')');
    }
    whereString = whereString + whereArray.join(' AND ');
    //console.log(whereString);
    whereString += ' AND ';
  }else{
    var whereString = ' WHERE ';
    //console.log(whereString);
  }
  return new Promise(function(resolve, reject) {
    var offices=[];
    connection.query('SELECT * FROM offices LEFT JOIN images_office\
    									ON images_office_office = office_id LEFT JOIN images\
    									ON image_id = images_office_image '+ whereString + ' image_cover = 1',
    	function(error, result, fields){
    		if (error) reject(error);
        if (result!== undefined) {
          for (var i = 0; i <= result.length - 1; i++) {
           	offices[i] = {
           		office_id: result[i].office_id,
           		office_name: decodeURI(result[i].office_name),
           		office_dascription: decodeURI(result[i].office_description),
           		office_area: result[i].office_area,
           		office_show: result[i].office_show,
              office_cover: result[i].image_name,
              office_create_date: result[i].office_create_date,
              office_publish: result[i].office_publish,
              office_type: result[i].office_type,
              office_taked: result[i].office_taked,
              office_author: result[i].office_author,
              office_height: result[i].office_height,
              office_subprice: result[i].office_subprice,
              office_totalprice: result[i].office_totalprice,
              office_object: result[i].office_object,
              providers: []
           	};
            //offices[i].office_id;
          };
          var k;
          var officeId;
          for (var i = 0; i < offices.length; i++) {
            //console.log(i);
            k = i;
            officeId = offices[i].office_id;
            connection.query('SELECT * FROM providers_office LEFT JOIN \
            providers ON provider_id = providers_office_provider \
            WHERE  providers_office_office = '+officeId,
            function (error, result, fields) {
              //console.log(k);
              //console.log(offices[k]);
              if (error) reject(error);
              //console.log("providers: " + result[0].provider_id);
              var providers = [];
              for (var j = 0; j < result.length; j++) {
                providers.push({name: result[j].provider_name, id: result[j].provider_id})
              }
              offices[k].providers = providers;
              //console.log(providers);
              connection.query('SELECT * FROM included_services_office LEFT JOIN \
              included_services ON includes_id = included_services_office_service \
              WHERE  included_services_office_office = '+officeId,
              function (error, result, fields) {
                //console.log(k);
                //console.log(offices[k]);
                if (error) reject(error);
                //console.log("includes: " + result[0].include_id);
                var includes = [];
                for (var j = 0; j < result.length; j++) {
                  includes.push({name: result[j].includes_name, id: result[j].includes_id})
                }
                offices[k].includes = includes;
                //console.log(includes);
                connection.query('SELECT * FROM extended_services_office LEFT JOIN \
                extended_services ON extendes_id = extended_services_office_service \
                WHERE  extended_services_office_office = '+officeId,
                function (error, result, fields) {
                  //console.log(k);
                  //console.log(offices[k]);
                  if (error) reject(error);
                  //console.log("extendes: " + result[0].extende_id);
                  var extendes = [];
                  for (var j = 0; j < result.length; j++) {
                    extendes.push({name: result[j].extendes_name, id: result[j].extendes_id})
                  }
                  offices[k].extendes = extendes;
                  //console.log(extendes);
                  resolve(offices);
                });
              });
            });
          }
        }else{
          reject('No one results');
        }
    });
  });
};

function getOfficeImages(officeId) {
  if (officeId!== undefined) {
    return new Promise(function(resolve, reject) {
      var images=[];
      connection.query('SELECT * FROM images_office\
                         LEFT JOIN images\
                        ON image_id = images_office_image WHERE images_office_office = '+officeId,
        function(error, result, fields){
          if (error) reject(error);
          if (result!== undefined) {
            for (var i = 0; i <= result.length - 1; i++) {
              images[i] = {
                image_id: result[i].image_id,
                image_name: decodeURI(result[i].image_name),
                image_cover: result[i].image_cover
              };
            };
            resolve(images);
          }else{
            reject('No one results');
          }
      });
    });
  }else{
    reject('Wrong argument');
  }
};

function getMeanings() {
  return new Promise(function(resolve, reject) {
    var meanings=[];
    connection.query('SELECT * FROM meanings',
      function(error, result, fields){
        if (error) reject(error);
        if (result!== undefined) {
          for (var i = 0; i <= result.length - 1; i++) {
            meanings[i] = {
              meaning_id: result[i].meaning_id,
              meaning_name: decodeURI(result[i].meaning_name)
            };
          };
          resolve(meanings);
        }else{
          reject('No one results');
        }
    });
  });
};

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

app.get('/',auth, function(req,res) {
  console.log('role '+res.role);
  var geo = geolocation();
  getMeanings().then(function(meanings) {
    //console.log(geo);
    //console.log(meanings);
    res.render('home',{
      role: res.role,
      username: res.userfullname,
      geo: geo,
      meanings: meanings,
      ishome: 1
    });
  },function(error) {
    console.log(error);
    res.send('Something wrong with meanings');
  });
});

app.get('/allobjects', function(req,res) {
  getObjects().then(function(objects) {
    getOffices().then(function(offices) {
      for (var i = 0; i < objects.length; i++) {
        objects[i].object_offices = [];
        for (var j = 0; j < offices.length; j++) {
          if (objects[i].object_id == offices[j].office_object) {
            objects[i].object_offices.push(offices[j]);
          }
        }
      }
      res.send({
        objects: objects
      });
    },function(error) {
      console.log(error);
      res.send('Something wrong with offices');
    });
  },function(error) {
    console.log(error);
    res.send('Something wrong with objects');
  });
});

app.get('/objects', auth, function(req,res) {
  var geo = geolocation();
  getObjects().then(function(objects) {
    getOffices().then(function(offices) {
      for (var i = 0; i < objects.length; i++) {
        objects[i].object_offices = [];
        for (var j = 0; j < offices.length; j++) {
          if (objects[i].object_id == offices[j].office_object) {
            objects[i].object_offices.push(offices[j]);
          }
        }
      }
      res.render('objects', {
        role: res.role,
        username: res.userfullname,
        userid: res.userid,
        geo: geo,
        objects: objects
      });
    },function(error) {
      console.log(error);
      res.send('Something wrong with offices');
    });
  },function(error) {
    console.log(error);
    res.send('Something wrong with objects');
  });
});

app.get('/object:objId', auth, function(req,res) {
  var geo = geolocation();
  getObjects({id:req.params.objId}).then(function(objects) {
    getOffices().then(function(offices) {
      for (var i = 0; i < objects.length; i++) {
        objects[i].object_offices = [];
        for (var j = 0; j < offices.length; j++) {
          if (objects[i].object_id == offices[j].office_object) {
            objects[i].object_offices.push(offices[j]);
          }
        }
      }
      res.render('object', {
        role: res.role,
        username: res.userfullname,
        userid: res.userid,
        geo: geo,
        objects: objects
      });
    },function(error) {
      console.log(error);
      res.send('Something wrong with offices');
    });
  },function(error) {
    console.log(error);
    res.send('Something wrong with objects');
  });
});

app.get('/office:officeId', auth, function(req,res) {
  var geo = geolocation();
  getOffices({id:req.params.officeId}).then(function(offices) {
    getOfficeImages(req.params.officeId).then(function(images) {
      console.log(offices[0]);
      res.render('office',{
        role: res.role,
        username: res.userfullname,
        userid: res.userid,
        geo: geo,
        office: offices[0],
        images: images
      });
    },function(error) {
      console.log(error);
      res.send('Something wrong with images');
    });
  },function(error) {
    console.log(error);
    res.send('Something wrong with offices');
  });
});

app.get('/bookmarks', auth, function(req,res) {
  var geo = geolocation();
  res.render('bookmarks',{
    geo: geo,
  });
});

app.post('/register', function(req,res) {
  console.log(req.body.pass);
  var pass = req.body.pass;
  var hash = crypto.createHmac('sha256', pass)
                     .update('I love cupcakes')
                     .digest('hex');
  console.log(hash);
  var email = encodeURI(req.body.email);
  console.log(email);
  connection.query('SELECT * FROM users WHERE user_email = "'+email+'"',
  function(error, result, fields){
    if (error) throw error;
    if (result.length > 0) {
      res.send({status: 'unsuccess'});
      console.log(result);
    }else{
      connection.query('INSERT INTO users (user_name,user_pass,user_role,user_firstname,user_lastname,user_email,user_proof)\
      VALUES ("reguser", "'+hash+'", 2, "'+req.body.firstname+'", "'+req.body.lastname+'", "'+email+'", 0)',
      function (error, result, fields) {
        if (error) throw error;
        res.send({status: 'success'});
        console.log(result);
      });
    }
  });
  //res.redirect('/');
});

app.post('/login',function (req,res) {
  console.log(req.body);
  //res.send(req.body);
  var email = req.body.email;
  connection.query('SELECT * FROM users WHERE user_email = "'+email+'"',
  function(error, result, fields){
    if (result.length > 0) {
      var pass = req.body.pass;
      var hash = crypto.createHmac('sha256', pass)
                         .update('I love cupcakes')
                         .digest('hex');
      if (result[0].user_pass === hash) {
        var user = result[0];
        console.log(user);
        connection.query('SELECT * FROM roles WHERE role_id = '+user.user_role, function (error,result,fields) {
          req.session.userfullname = user.user_firstname + ' ' + user.user_lastname;
  				req.session.role = result[0].role_name;
          req.session.userid = user.user_id;
  				console.log(req.session.role);
          console.log(req.session.userfullname);
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
  req.session.role = undefined;
  req.session.userfullname = undefined;
  res.redirect('/');
});

server = app.listen(3000,function(){
  console.log('Listening on port 3000');
});
