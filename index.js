var express = require('express'),
    server,
    app = express(),
    // Promise = require('promise'),
    //session = require('express-session'),
    mysql = require('mysql');

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

// app.use( session({
//    secret : 's3Cur3',
//    name : 'sessionId',
//    resave: false,
//    saveUninitialized: false
//   })
// );

// function getObjects(req, res, next){
//   connection.query('SELECT * FROM objects LEFT JOIN images_object\
// 										ON images_object_object = object_id LEFT JOIN images\
// 										ON image_id = images_object_image',
// 		function(error, result, fields){
// 			if (error) throw error;
// 		  var objects = [];
// 		  for (var i = 0; i <= result.length - 1; i++) {
// 		   	objects[i] = {
// 		   		object_id: result[i].object_id,
// 		   		object_name: decodeURI(result[i].object_name),
// 		   		object_coordinates: result[i].object_coordinates,
// 		   		object_addres: decodeURI(result[i].object_addres),
// 		   		object_show: result[i].object_show
// 		   	};
// 		  };
//       res.objects = objects;
//       next();
// 	});
// };
//
// function getOffices(req, res, next){
//   console.log(res.objectsIds);
//   connection.query('SELECT * FROM offices WHERE office_id\
//    IN ('+req.objectsIds+')',
//   function(error, result, fields) {
//     if (error) throw error;
//     var offices = [];
//     for (var i = 0; i < result.length; i++) {
//       offices[i] = {
//         office_id: result[i].office_id,
//         office_description: result[i].office_description,
//         office_area: result[i].office_area,
//         office_subprice: result[i].office_subprice,
//         office_totalprice: result[i].office_totalprice,
//         office_height: result[i].office_height,
//         office_owner: result[i].office_owner,
//         office_object: result[i].office_object,
//         office_status: result[i].office_status
//       };
//     };
//     res.offices = offices;
//     next();
//   });
// };

//connection.end();


/* getObjects getting objects array by params
  params as object:
    id:  list of number | self id,
    name:  list of text,
    coordinates:  list of text,
    addres:  list of text | temp parametr,
    show:  list of 1 or 0,
    publish:  list of 1 or 0,
    type:  list of number | types id,
    author: list of number | authors id
 */

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

function getOfficeById(ofcId) {
  return new Promise(function(resolve, reject) {
    var offices=[];
    connection.query('SELECT * FROM offices LEFT JOIN images_office\
    									ON images_office_office = office_id LEFT JOIN images\
    									ON image_id = images_office_image WHERE office_id = '+ofcId+' AND image_cover = 1',
    	function(error, result, fields){
    		if (error) reject(error);
        if (result!== undefined) {
          //for (var i = 0; i <= result.length - 1; i++) {
           	office = {
           		office_id: result[0].office_id,
           		office_name: decodeURI(result[0].office_name),
           		office_dascription: decodeURI(result[0].office_description),
           		office_area: result[0].office_area,
           		office_show: result[0].office_show,
              office_cover: result[0].image_name,
              office_create_date: result[0].office_create_date,
              office_publish: result[0].office_publish,
              office_type: result[0].office_type,
              office_taked: result[0].office_taked,
              office_author: result[0].office_author,
              office_height: result[0].office_height,
              office_subprice: result[0].office_subprice,
              office_totalprice: result[0].office_totalprice,
              office_object: result[0].office_object,
           	};
            getOfficeImages(result[0].office_id).then(function(images) {
              office.office_images = images;
              resolve(office);
            });
        }else{
          reject('No one results');
        }
    });
  });
};

function getOptions(officeId, service) {
  if ( officeId !== undefined ) {
    return new Promise(function(reslove, reject) {
      var services = [];
      connection.query('SELECT * FROM ' + service + ' LEFT JOIN ' + service + ' s_office WHERE ' + officeId, function(error, result, fields) {
        if ( error ) reject(error);
        if ( result !== undefined ) {

        }else{
          reject('no one result');
        }
      });
    });
  }else{
    reject('Wrong argument');
  };
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

//getObjects(paramsForObj).then(objects => console.log('objects'), error => console.log(error));

// var store = {
//   home: {
//     title: 'Карта'
//   },
//   objects: {
//     title: 'Все объекты'
//   },
//   object: {
//     title: 'Помещения в текущем объекте'
//   },
//   office: {
//     title: 'Текущее помещение'
//   },
//   mod: {
//     title: 'Модерация'
//   },
//   kab: {
//     title: 'Личный кабинет'
//   },
//   bookmarks: {
//     title: 'Закладки'
//   },
//   admin: {
//     title: 'Администрирование'
//   }
// }
//
// app.get('/:page?', function(req,res) {
//   var page = req.params.page;
//   var data;
//   var id = req.params.id;
//   if (!page) page = 'home';
//   data = store[page];
//   if (!data){
//     res.redirect('/');
//     return;
//   };
//   console.log('title: '+data.title);
//   res.render(page,{
//     title: data.title
//   });
// });

app.get('/objects', function (req, res) {
  //var objParams = {};
  //objParams.id = '51';
  var ofcParams = {};
  //ofcParams.object = '51'
  getObjects().then(function(objects) {
    objIds = [];
    for (var i = 0; i < objects.length; i++) {
      objIds.push(objects[i].object_id);
    };
    ofcParams.object = objIds.join(',');
    getOffices(ofcParams).then(function(offices) {
      //getOfficeImages(offices[0].office_id).then(function(images) {
        //offices[0].office_images = images;
        for (var i = 0; i < objects.length; i++) {
          objects[i].object_offices = [];
          for (var j = 0; j < offices.length; j++) {
            if (objects[i].object_id == offices[j].office_object && objects[i].object_offices.length <= 1) {
              objects[i].object_offices.push(offices[j]);
            }
          }
        }
        res.render('objects',{
          objects: objects
        });
    //});
    },function(error) {
      console.log(error);
    });
  },function(error) {
    console.log(error);
  });
});

app.get('/object:objectId', function (req, res) {
  var objParams = {};
  objParams.id = req.params.objectId;
  var ofcParams = {};
  ofcParams.object = req.params.objectId;
  getObjects(objParams).then(function(objects) {
    objIds = [];
    for (var i = 0; i < objects.length; i++) {
      objIds.push(objects[i].object_id);
    };
    ofcParams.object = objIds.join(',');
    getOffices(ofcParams).then(function(offices) {
      //getOfficeImages(offices[0].office_id).then(function(images) {
        //offices[0].office_images = images;
        for (var i = 0; i < objects.length; i++) {
          objects[i].object_offices = [];
          for (var j = 0; j < offices.length; j++) {
            if (objects[i].object_id == offices[j].office_object) {
              objects[i].object_offices.push(offices[j]);
            }
          }
        }
        res.render('object',{
          objects: objects
        });
    //});
    },function(error) {
      console.log(error);
    });
  },function(error) {
    console.log(error);
  });
});

app.get('/office:officeId', function (req, res) {
  var ofcId = req.params.officeId;
  getOfficeById(ofcId).then(function(office) {
    res.render('office',{
      office: office
    });
  });
});

// app.get('/objects', function (req, res) {
//   //var objParams = {};
//   //objParams.id = '51';
//   var ofcParams = {};
//   //ofcParams.object = '51'
//   getObjects().then(function(objects) {
//     //getOffices(ofcParams).then(function(offices) {
//       //getOfficeImages(offices[0].office_id).then(function(images) {
//         //offices[0].office_images = images;
//         res.send('objects',{
//           objects: objects
//           //offices: offices
//         });
//       //});
//     //},function(error) {
//     //  console.log(error);
//     //});
//   },function(error) {
//     console.log(error);
//   });
// });

server = app.listen(3000,function(){
  console.log('Listening on port 3000');
});
