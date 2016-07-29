var express = require('express'),
    server,
    app = express(),
    // Promise = require('promise'),
    //session = require('express-session'),
    mysql = require('mysql');
    geoip = require('geoip-lite');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'admin_armapuser',
  password : 'HQCbezLWux',
  database : 'admin_armap_db'
});

connection.connect();

app.use(function(req,res,next) {
  console.log("%s %s", req.method, req.url);
  next();
});

app.use(express.static(__dirname+'/public'));
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
           	};
          };
          resolve(offices);
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

app.get('/', function(req,res) {
  // var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  // ip = ip.substring(7);
  ip = '188.168.22.110';
  getObjects().then(function(objects) {
    getOffices().then(function(offices) {
      getMeanings().then(function(meanings) {
        for (var i = 0; i < objects.length; i++) {
          objects[i].object_offices = [];
          for (var j = 0; j < offices.length; j++) {
            if (objects[i].object_id == offices[j].office_object) {
              objects[i].object_offices.push(offices[j]);
            }
          }
        }
        var geo = geoip.lookup(ip);// ? geoip.lookup(ip.slice(1,-1)) : 0;
        console.log(geo);
        console.log(meanings);
        res.render('home',{
          objects: objects,
          geo: geo,
          meanings: meanings
        });
      },function(error) {
        console.log(error);
        res.send('Something wrong with meanings');
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

server = app.listen(3000,function(){
  console.log('Listening on port 3000');
});
