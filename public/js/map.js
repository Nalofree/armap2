
var coords = [], cityId, placemarks = [];

coords[0] = getCookie("clientlatitude");
coords[1] = getCookie("clientlongitude");
cityId = getCookie("city_id");

function SetMap(coords) {
  return new Promise(function (resolve, reject) {
    ymaps.ready(function () {
      var map = new ymaps.Map("map", {
        center: coords,
        zoom: 13,
        controls: ["fullscreenControl"]
      });
      map.controls.add("zoomControl",{
        position: {
          right: 5,
          bottom: 45
        }
      });
      map.controls.add("fullscreenControl",{
        position: {
         top: 55,
         right: 5
        }
      });
      map.behaviors.enable('scrollZoom');
      resolve(map);
    });
  });
}

// SetMap(coords);

if (cityId) {
  console.log('get city name & city coords');
  $.ajax({
    type: 'POST',
    data: {city_id: cityId},
    url: '/getcitybyid',
    success: function (data, status, error) {
      console.log(data, status, error);
      mapCoords = data.city.city_coords.split(",");
      $("#city").text(decodeURI(data.city.city_name));
      SetMap(mapCoords).then(function (map) {
        if ($("#search-filter").length) {
          var myCollection = new ymaps.GeoObjectCollection();
          var myClusterer = new ymaps.Clusterer(
            {clusterDisableClickZoom: true}
          );
          filter(cityId).then(function (placemarks) {
            for (var i = 0; i < placemarks.length; i++) {
              myClusterer.add(placemarks[i]);
            }
            map.geoObjects.add(myClusterer);
          });
          $(".filtr-it").click(function () {
            for (var i = 0; i < placemarks.length; i++) {
              myClusterer.remove(placemarks[i]);
            }
            map.geoObjects.remove(myClusterer);
            filter(cityId).then(function (placemarks) {
              for (var i = 0; i < placemarks.length; i++) {
                myClusterer.add(placemarks[i]);
              }
              map.geoObjects.add(myClusterer);
            });
          });
        }
      });
    },
    error: function (data, status, error) {
      console.log(data, status, error);
    },
  });
}else{
  ymaps.ready(function(){
    var myGeocoder = ymaps.geocode(coords, {kind:"locality"}), newCoords;
    myGeocoder.then(
      function (res) {
        newCoords = res.geoObjects.get(0).geometry.getCoordinates();
        cityName = res.geoObjects.get(0).getLocalities();
        cityNameStr = encodeURI(cityName[0]);
        console.log(cityName, newCoords);
        $.ajax({
          type: 'POST',
          data: {city_name: cityNameStr},
          url: '/getcitybyname',
          success: function (data, status, error) {
            console.log(data, status, error);
            if (data.count > 0) {
              mapCoords = data.city.city_coords.split(",");
              SetMap(mapCoords);
              if ($("#search-filter").length) {
                filter(cityId).then(function (placemarks) {
                  // console.log(placemarks);
                });
                $(".filtr-it").click(function () {
                  filter(cityId).then(function (placemarks) {
                    // console.log(placemarks);
                  });
                });
              }
              $("#city").text(decodeURI(data.city.city_name));
              $(".tooltip-white__quastion-cityname").text(decodeURI(data.city.city_name));
              $("#isyourcity").show();
              $(".close-layout").show();
              $("#mycity").click(function () {
                setCookie("city_id",data.citys[0].city_id, 365);
              });
              $("#notmycity").click(function () {
                setNewCity();
              });
            }else{
              console.log('Set new city');
              setNewCity();
              SetMap(newCoords);
            }
          },
          error: function (data, status, error) {
            console.log(data, status, error);
          },
        });
      },
      function (err) {
        console.log('Error ', err);
      }
    );
  });
}



$("#city").click(function (e) {
  e.preventDefault();
  setNewCity();
});
//
// var coords = [], cityId, cityName, placemarks = [];
// coords[0] = getCookie("clientlatitude");
// coords[1] = getCookie("clientlongitude");
// // console.log(coords);
//
// cityId = getCookie("city_id");
//
// // function setExistCity(cityId) {
// //   return new Promise(function (resolve,reject) {
// //     var data = {city_id: cityId};
// //     $.ajax({
// //       type: 'POST'
// //     });
// //   });
// // }
//
function filter(cityId) {
  return new Promise(function (resolve, reject) {
    // resolve(sucess = 'sucess');
    // reject(error = 'error');
    var data = {};
    data.meanings=[];
    data.price = [];
    data.area = [];
    data.city = cityId;
    $(".filter-object-type input[type='checkbox']:checked").each(function () {
      data.meanings.push($(this).attr('data-title'));
    });
    data.area = squareSlider.noUiSlider.get();
    for (var i = 0; i < data.area.length; i++) {
      data.area[i] = parseInt(data.area[i]);
    }
    data.price = priceSlider.noUiSlider.get();
    for (var i = 0; i < data.price.length; i++) {
      data.price[i] = parseInt(data.price[i]);
    }
    $.ajax({
      type: 'POST',
      data: data,
      url: '/filtred',
      success: function(data,status,error) {
        // console.log('success');
        // console.log(data);
        console.log(data,status,error);
        $('#filter-result').empty();
        if (data.count > 0) {
          // for (var i = 0; i < data.offices.length; i++) {
          //   var adres = decodeURI(data.offices[i].office_adres) ? decodeURI(data.offices[i].office_adres) : 'Error';
          //   var name = decodeURI(data.offices[i].office_name);// ? decodeURI(data.offices[i].office_name) : 'Error';
          //   var officeItem = '<article><a href="office-'+data.offices[i].office_id+'">\
          //     <div class="result-img"><img src="images/obj/'+data.offices[i].image_filename+'"/></div>\
          //     <div class="result-desc">\
          //       <h4>'+name+'</h4>\
          //       <p>'+adres+'</p>\
          //       <section>\
          //         <div class="result-price">\
          //           <p>Цена за м<sup>2</sup>: <br/><span>'+data.offices[i].office_subprice+' р.</span></p>\
          //         </div>\
          //         <div class="result-square">\
          //           <p>Площадь: <br/><span>'+data.offices[i].office_area+' м<sup>2</sup></span></p>\
          //         </div>\
          //       </section>\
          //     </div></a></article>';
          //   $('#filter-result').append(officeItem);
          //   $("#filter-result").addClass('active in');
          //   $(".filter-result-btn").addClass('active');
          //   $(".filter-btn").removeClass('active');
          //   $("#filter").removeClass('active in');
          // }
          for (var i = 0; i < data.objects.length; i++) {
            for (var j = 0; j < data.objects[i].object_offices.length; j++) {
              // data.objects[i].object_offices[j]
              var adres = decodeURI(data.objects[i].object_offices[j].office_adres) ? decodeURI(data.objects[i].object_offices[j].office_adres) : 'Error';
              var name = decodeURI(data.objects[i].object_offices[j].office_name);// ? decodeURI(data.objects[i].object_offices[j].office_name) : 'Error';
              var officeItem = '<article><a href="office-'+data.objects[i].object_offices[j].office_id+'">\
                <div class="result-img"><img src="images/obj/'+data.objects[i].object_offices[j].image_filename+'"/></div>\
                <div class="result-desc">\
                  <h4>'+name+'</h4>\
                  <p>'+adres+'</p>\
                  <section>\
                    <div class="result-price">\
                      <p>Цена за м<sup>2</sup>: <br/><span>'+data.objects[i].object_offices[j].office_subprice+' р.</span></p>\
                    </div>\
                    <div class="result-square">\
                      <p>Площадь: <br/><span>'+data.objects[i].object_offices[j].office_area+' м<sup>2</sup></span></p>\
                    </div>\
                  </section>\
                </div></a></article>';
              $('#filter-result').append(officeItem);
              $("#filter-result").addClass('active in');
              $(".filter-result-btn").addClass('active');
              $(".filter-btn").removeClass('active');
              $("#filter").removeClass('active in');
            }
          }
          //var placemarks = [];
          ymaps.ready(function () {
            placemarks = [];
            for (var i = 0; i < data.objects.length; i++) {
              // if (data.objects[i].offices_count > 0) {
                var coordss=data.objects[i].object_coords.split(',');
                var coordsArr = [];
                coordsArr[0] = parseFloat(coordss[0]);
                coordsArr[1] = parseFloat(coordss[1]);
                var officeCountByObject = data.objects[i].offices_count;
                officeCountByObject = officeCountByObject.toString();
                var adres = decodeURI(data.objects[i].object_adres) ? decodeURI(data.objects[i].object_adres) : 'Error!';
                var name = decodeURI(data.objects[i].object_name) ? decodeURI(data.objects[i].object_name) : 'Error!';
                placemarks[i] = new ymaps.Placemark(coordsArr,{
                  balloonContentHeader: name,
                  balloonContentBody: adres,
                  balloonContentFooter: '<a href="/object-'+data.objects[i].object_id+'" class="balloon-count-link">Найдено помещений: '+officeCountByObject+'</a><a href="/object-'+data.objects[i].object_id+'" class="balloon-more-link">Подробнее</a>',
                  hintContent: '<strong>'+name+'</strong><br>'+adres,
                  clusterCaption: name,
                  iconContent: officeCountByObject
                });
              // }
            }
            resolve(placemarks);
            // console.log("placemarks ",placemarks);
          });
        }else{
          var officeItem = '<p class="lead" align=center>Нет результатов, измените параметры поиска или свяжитесь с менеджером для более точного поиска помещения</p>';
          $('#filter-result').append(officeItem);
          var noresults = "No one results";
          resolve(noresults);
        }
      },
      error: function(data,status,error){
        console.log(data);
        console.log(status);
        console.log(error);
        reject(error);
      }
    });
  });
}
//
// function SetMap(coords, placemarks) {
//   var map = new ymaps.Map("map", {
//     center: coords,
//     zoom: 13,
//     controls: ["fullscreenControl"]
//   });
//   map.controls.add("zoomControl",{
//     position: {
//       right: 5,
//       bottom: 45
//     }
//   });
//   map.controls.add("fullscreenControl",{
//     position: {
//       top: 55,
//       right: 5
//     }
//   });
//   map.behaviors.enable('scrollZoom');
//   for (var i = 0; i < placemarks.length; i++) {
//       map.geoObjects.add(placemarks[i]);
//   };
//   var clusterer = new ymaps.Clusterer({ hasBalloon: true, disableClickZoom: true,  zoomMargin: 50});
//   clusterer.add(placemarks);
//   map.geoObjects.add(clusterer);
// }
//
function setNewCity() {
  $("#choosecity").show();
  $(".close-layout").show()
  var cityData;
  ymaps.ready(function () {
    $(".citys-form__input").keyup(function () {
      $(".citys-form__tooltip").show();
      // $(".citys-form__submit").css("color", "red");//#2c71e7
      $(".citys-form__submit").prop('disabled', true);
      var myGeocoder2 = ymaps.geocode("Россия, " + $(this).val(), {kind:"locality"}),//ymaps.geocode(coords, {kind:"locality"})
      autocity,
      autoccords;
      myGeocoder2.then(
        function (res) {
          // alert(res.geoObjects.get(0).getLocalities());
          autoccords = res.geoObjects.get(0).geometry.getCoordinates();
          autocity = res.geoObjects.get(0).getLocalities();
          $(".citys-form__tooltip").text(res.geoObjects.get(0).getLocalities());
          $(".citys-form__tooltip").click(function () {
            $(".citys-form__submit").prop('disabled', false);
            $(".citys-form__input").val(autocity);
            console.log(autoccords);
            $(this).hide();
            cityData = {
              city_name: encodeURI(autocity),
              city_coords: autoccords.join(","),
            };
            console.log(cityData);
          });
        },
        function (err) {
            console.log(err);
        }
      );
    });
  });
  $(".citys-form__submit").click(function () {
    console.log(cityData);
    $.ajax({
      data: cityData,
      type: 'POST',
      url: '/addcity',
      success: function (data, error, status) {
        $("#choosecity").hide();
        $(".close-layout").hide();
        console.log(data, error, status);
        setCookie("city_id",data.city_id, 365);
      },
      error: function (data, error, status) {
        $("#choosecity").hide();
        $(".close-layout").hide();
        console.log(data, error, status);
      }
    });
  });
  $.ajax({
    type: 'POST',
    url: '/choosecity',
    success: function (data) {
      $(".citys").show();
      $("#isyourcity").hide();
      if (data.count === 0) {
        $(".citys-list").empty();
        $(".citys-list").append("<h3 align=center>Городов пока нет, добавьте свой</h3>");
      }else{
        $(".citys-list").empty();
        for (var i = 0; i < data.citys.length; i++) {
          $(".citys-list").append("<div class='citys-list__item' id='city-"+data.citys[i].city_id+"'>"+decodeURI(data.citys[i].city_name)+"</div>");
        }
        $(".citys-list__item").click(function () {
          var cityId = $(this).attr("id").split("-")[1];
          setCookie("city_id", cityId, 365);
          location.reload();
        });
      }
    },
    error: function (data,status,error) {
      console.log(data,status,error);
    }
  });
};
//
// $("#city").click(function (e) {
//   e.preventDefault();
//   $("#isyourcity").toggle();
//   $("#mycity").click(function () {
//     // setCookie("city_id", $("#city").attr("data-title"), 365);
//     $("#isyourcity").hide();
//   });
//   $("#notmycity").click(function () {
//     // setCookie("city_id", $("#city").attr("data-title"), 365);
//     $("#isyourcity").hide();
//     setNewCity();
//   });
// });
//
// if (cityId) {
//   cityName = getCookie("city_name");
//   // removeCookie("city_id");
//   ymaps.ready(function () {
//     if ($('#search-filter').length) {
//       filter(cityId).then(
//         success => {
//           // console.log(placemarks);
//           SetMap(coords, placemarks);
//         },
//         error => {
//           console.log(error);
//         }
//       );
//       $(".filtr-it").click(function () {
//         filter(cityId).then(
//           success => {
//             console.log(placemarks);
//             SetMap(coords, placemarks);
//           },
//           error => {
//             console.log(error);
//           }
//         );
//       });
//     }
//   });
// }else{
//   ymaps.ready(function(){
//     var myGeocoder = ymaps.geocode(coords, {kind:"locality"}), newCoords;
//     myGeocoder.then(
//       function (res) {
//         newCoords = res.geoObjects.get(0).geometry.getCoordinates();
//         cityName = res.geoObjects.get(0).getLocalities();
//         $.ajax({
//           data: {city_name: encodeURI(cityName)},
//           type: "POST",
//           url: "/getcity",
//           success: function (data) {
//             var cityName;
//             if (data.citys.length > 0) {
//               console.log(decodeURI(data.citys[0].city_name));
//               cityName = decodeURI(data.citys[0].city_name);
//               cityId = data.citys[0].city_id;
//               // console.log(data.citys[0].city_coords);
//               $("#city").text(cityName);
//               $("#city").attr("data-title", cityId);
//
//               if ($('#search-filter').length) {
//                 filter(cityId).then(
//                   success => {
//                     // console.log(placemarks);
//                     SetMap(newCoords, placemarks);
//                   },
//                   error => {
//                     console.log(error);
//                   }
//                 );
//                 $(".filtr-it").click(function () {
//                   filter(cityId).then(
//                     success => {
//                       console.log(placemarks);
//                       SetMap(newCoords, placemarks);
//                     },
//                     error => {
//                       console.log(error);
//                     }
//                   );
//                 });
//               }
//             }else{
//               setNewCity();
//             };
//           },
//           error: function (data, error, status) {
//             console.log(data, error, status);
//           }
//         });
//       },
//       function (err) {
//         console.log('Error');
//       }
//     );
//   });
// };
//
// // $(document).ready(function () {
// //   var ctyName, map, data;
// //   cityName = decodeURI(getCookie("city_name"));
// //   //removeCookie("city_name"); //Удаление куков по имени
// //   //removeCookie("city"); //Удаление куков по имени
// //   //removeCookie("city_id"); //Удаление куков по имени
// //   //removeCookie("city_coords"); //Удаление куков по имени
// //
// //   function isYourCity(cityName) {
// //     $("#isyourcity").show();
// //     $("#mycity").click(function () {
// //       setCookie('city_name',encodeURI(cityName),365);
// //       // console.log(" set city cookie");
// //       $("#isyourcity").hide();
// //       ymaps.ready(function(){
// //         filter(cityName,map);
// //         $("#filter .filtr-it").click(function(){
// //           filter(cityName,map);
// //         });
// //       });
// //     });
// //     $("#notmycity").click(function () {
// //       $(".close-layout").show();
// //       var data = {};
// //       $.ajax({
// //         type: 'POST',
// //         url: '/choosecity',
// //         success: function (data) {
// //           // console.log(data);
// //           $(".citys").show();
// //           $("#isyourcity").hide();
// //           if (data.count === 0) {
// //             $(".citys-list").empty();
// //             $(".citys-list").append("<h3 align=center>Городов пока нет, добавьте свой</h3>");
// //           }else{
// //             $(".citys-list").empty();
// //             for (var i = 0; i < data.citys.length; i++) {
// //               $(".citys-list").append("<div class='citys-list__item' id='city-"+data.citys[i].city_id+"'>"+decodeURI(data.citys[i].city_name)+"</div>");
// //             }
// //             $(".citys-list__item").click(function () {
// //               var city = $(this).text();
// //               setCookie('city_name',encodeURI(city), 365);
// //               $("#city").text(decodeURI(getCookie('city_name')));
// //               // console.log(city);
// //               ymaps.ready(function(){
// //                 var myGeocoder = ymaps.geocode(city),
// //                     newCoords;
// //                 myGeocoder.then(
// //                   function (res) {
// //                       newCoords = res.geoObjects.get(0).geometry.getCoordinates();
// //                       // console.log(newCoords);
// //                       map.setCenter(newCoords, 13);
// //                       filter(city,map);
// //                       // alert('filtr');
// //                       $("#filter .filtr-it").click(function(){
// //                       	filter(city,map);
// //                       });
// //                   },
// //                   function (err) {
// //                       console.log('Error');
// //                   }
// //                 );
// //                 if (map) {
// //                   map.behaviors.enable('scrollZoom');
// //                 }
// //                 $(".citys").hide();
// //                 // getObjInfoByCity(city);
// //                 $(".close-layout").hide();
// //               });
// //             });
// //           }
// //         },
// //         error: function (data,status,error) {
// //           console.log(data,status,error);
// //         }
// //       });
// //     });
// //   }
// //
// //   $(".citys-form__submit").click(function (e) {
// //     e.preventDefault();
// //     if ($(".citys-form__input").val()) {
// //       var newCityData = {
// //         city_name: encodeURI($(".citys-form__input").val())
// //       };
// //       // console.log(newCityData);
// //       $.ajax({
// //         type: 'POST',
// //         data: newCityData,
// //         url: '/addcity',
// //         success: function (newCityData) {
// //           // console.log(newCityData);
// //           $(".citys-list").append("<div class='citys-list__item' id='city-"+newCityData.city_id+"'>"+decodeURI(newCityData.city_name) +"</div>");
// //           $(".citys-form__input").val("");
// //           $(".citys-list__item").click(function () {
// //             var city = $(this).text();
// //             setCookie('city_name',encodeURI(city), 365);
// //             $("#city").text(decodeURI(getCookie('city_name')));
// //             var myGeocoder = ymaps.geocode(city),
// //                 newCoords;
// //             myGeocoder.then(
// //               function (res) {
// //                   newCoords = res.geoObjects.get(0).geometry.getCoordinates();
// //                   // console.log(newCoords);
// //                   map.setCenter(newCoords, 13);
// //                   filter(cityName,map);
// //                   $("#filter .filtr-it").click(function(){
// //                   	filter(cityName,map);
// //                   });
// //               },
// //               function (err) {
// //                   console.log('Error');
// //               }
// //             );
// //             $(".citys").hide();
// //             $(".close-layout").hide();
// //           });
// //         },
// //         error: function (newCityData,status,error) {
// //           console.log(newCityData,status,error);
// //         }
// //       });
// //     }else{
// //       alert('Введите название города');
// //     }
// //   });
// //
// //   if (cityName) {
// //     // console.log("City name:" + cityName);
// //     // console.log("Set city name in head");
// //     // console.log("Get coords by city name");
// //     // console.log("Set map");
// //     // console.log("Get objects");
// //     // console.log("Set placemarks");
// //     ymaps.ready(function(){
// //       var myGeocoder = ymaps.geocode(cityName),
// //       coords;
// //       myGeocoder.then(
// //         function (res) {
// //             coords = res.geoObjects.get(0).geometry.getCoordinates();
// //             console.log(res.geoObjects.get(0));
// //             setCookie('city_name',encodeURI(cityName), 365);
// //             $('#city').text(cityName);
// //             map = new ymaps.Map("map", {
// //               center: coords,
// //               zoom: 13,
// //               controls: ["fullscreenControl"]
// //             });
// //             map.controls.add("zoomControl",{
// //               position: {
// //                 right: 5,
// //                 bottom: 45
// //               }
// //             });
// //             map.controls.add("fullscreenControl",{
// //               position: {
// //                 top: 55,
// //                 right: 5
// //               }
// //             });
// //             map.behaviors.enable('scrollZoom');
// //             filter(cityName,map);
// //             $("#filter .filtr-it").click(function(){
// //             	filter(cityName,map);
// //             });
// //         },
// //         function (err) {
// //             console.log('Error');
// //         }
// //       );
// //     });
// //   }else{
// //     // console.log("City name: none");
// //     // console.log("Get coords by ip");
// //     $.ajax({
// //       type: 'POST',
// //       url: '/getlocation',
// //       success: function (data) {
// //         var coords;
// //         coords = data.coords;
// //         // console.log(coords);
// //         ymaps.ready(function(){
// //           var myGeocoder = ymaps.geocode(coords);
// //           var cityName;
// //           myGeocoder.then(
// //             function (res) {
// //                 city = res.geoObjects.get(0).properties.get('description');
// //                 var cityArr = city.split(',');
// //                 cityName = cityArr[1];
// //                 setCookie('city_name',encodeURI(city), 365);
// //                 $('#city').text(cityName);
// //             },
// //             function (err) {
// //                 console.log('Error');
// //             }
// //           );
// //           map = new ymaps.Map("map", {
// //             center: coords,
// //             zoom: 13,
// //             controls: ["fullscreenControl"]
// //         	});
// //           map.controls.add("zoomControl",{
// //             position: {
// //               right: 5,
// //               bottom: 45
// //             }
// //           });
// //           map.controls.add("fullscreenControl",{
// //             position: {
// //               top: 55,
// //               right: 5
// //             }
// //           });
// //           map.behaviors.enable('scrollZoom');
// //           filter(cityName,map);
// //           $("#filter .filtr-it").click(function(){
// //           	filter(cityName,map);
// //           });
// //         });
// //       },
// //       error: function (data,status,error) {
// //         console.log(data,status,error);
// //       },
// //     });
// //     // console.log("Get city name by coords or user choise");
// //     // console.log("Set city cookies");
// //     // console.log("Set city name in head");
// //     // console.log("Set map");
// //     // console.log("Get objects");
// //     // console.log("Set placemarks");
// //     isYourCity(getCookie('city_name'));
// //   }
// //
// //   $("#city").click(function (e) {
// //     e.preventDefault();
// //     isYourCity(cityName);
// //   });
// //
// //   function getCoords() {
// //     var coords;
// //     $.ajax({
// //       type: 'POST',
// //       url: '/getlocation',
// //       success: function (data) {
// //         coords = data.coords;
// //         // console.log(coords);
// //       },
// //       error: function (data,status,error) {
// //         console.log(data,status,error);
// //       },
// //     });
// //   };
// //
// //   function filter(city,map) {
// //     var data = {};
// //     data.meanings=[];
// //     data.price = [];
// //     data.area = [];
// //     data.city = encodeURI(city);
// //     $(".filter-object-type input[type='checkbox']:checked").each(function () {
// //       data.meanings.push($(this).attr('data-title'));
// //     });
// //     data.area = squareSlider.noUiSlider.get();
// //     for (var i = 0; i < data.area.length; i++) {
// //       data.area[i] = parseInt(data.area[i]);
// //     }
// //     data.price = priceSlider.noUiSlider.get();
// //     for (var i = 0; i < data.price.length; i++) {
// //       data.price[i] = parseInt(data.price[i]);
// //     }
// //     $.ajax({
// //       type: 'POST',
// //       data: data,
// //       url: '/filtred',
// //       success: function(data) {
// //         // console.log('success');
// //         // console.log(data);
// //         $('#filter-result').empty();
// //         if (data.count > 0) {
// //           for (var i = 0; i < data.offices.length; i++) {
// //             var adres = decodeURI(data.offices[i].office_adres) ? decodeURI(data.offices[i].office_adres) : 'Error';
// //             var name = decodeURI(data.offices[i].office_name);// ? decodeURI(data.offices[i].office_name) : 'Error';
// //             var officeItem = '<article><a href="office-'+data.offices[i].office_id+'">\
// //               <div class="result-img"><img src="images/obj/'+data.offices[i].image_filename+'"/></div>\
// //               <div class="result-desc">\
// //                 <h4>'+name+'</h4>\
// //                 <p>'+adres+'</p>\
// //                 <section>\
// //                   <div class="result-price">\
// //                     <p>Цена за м<sup>2</sup>: <br/><span>'+data.offices[i].office_subprice+' р.</span></p>\
// //                   </div>\
// //                   <div class="result-square">\
// //                     <p>Площадь: <br/><span>'+data.offices[i].office_area+' м<sup>2</sup></span></p>\
// //                   </div>\
// //                 </section>\
// //               </div></a></article>';
// //             $('#filter-result').append(officeItem);
// //             $("#filter-result").addClass('active in');
// //             $(".filter-result-btn").addClass('active');
// //             $(".filter-btn").removeClass('active');
// //             $("#filter").removeClass('active in');
// //           }
// //           var placemarks = [];
// //           for (var i = 0; i < data.objects.length; i++) {
// //             var coordss=data.objects[i].object_coords.split(',');
// //             var coordsArr = [];
// //             coordsArr[0] = parseFloat(coordss[0]);
// //             coordsArr[1] = parseFloat(coordss[1]);
// //             var officeCountByObject = data.objects[i].offices_count;
// //             officeCountByObject = officeCountByObject.toString();
// //             var adres = decodeURI(data.objects[i].object_adres) ? decodeURI(data.objects[i].object_adres) : 'Error!';
// //             var name = decodeURI(data.objects[i].object_name) ? decodeURI(data.objects[i].object_name) : 'Error!';
// //             placemarks[i] = new ymaps.Placemark(coordsArr,{
// //               balloonContentHeader: name,
// //               balloonContentBody: adres,
// //               balloonContentFooter: '<a href="/object-'+data.objects[i].object_id+'" class="balloon-count-link">Найдено '+officeCountByObject+' помещений</a><a href="/object-'+data.objects[i].object_id+'" class="balloon-more-link">Подробнее</a>',
// //               hintContent: '<strong>'+name+'</strong><br>'+adres,
// //               clusterCaption: name,
// //               iconContent: officeCountByObject
// //             });
// //             map.geoObjects.add(placemarks[i]);
// //             map.events.add('click', function (e) {
// //                 map.balloon.close();
// //             });
// //           }
// //           $("#filter .filtr-it").click(function(){
// //           	for (var i = placemarks.length - 1; i >= 0; i--) {
// //           		map.geoObjects.remove(placemarks[i]);
// //           	};
// //             map.geoObjects.removeAll();
// //           });
// //           var clusterer = new ymaps.Clusterer({ hasBalloon: true, disableClickZoom: true,  zoomMargin: 50});
// //           clusterer.add(placemarks);
// //           map.geoObjects.add(clusterer);
// //           $("#filter .filtr-it").click(function(){
// //               map.geoObjects.remove(clusterer);
// //           });
// //         }else{
// //           var officeItem = '<p class="lead" align=center>Нет результатов, измените параметры поиска или свяжитесь с менеджером для более точного поиска помещения</p>';
// //           $('#filter-result').append(officeItem);
// //         }
// //       },
// //       error: function(data,status,error){
// //         console.log(data);
// //         console.log(status);
// //         console.log(error);
// //       }
// //     });
// //   }
// // });
//
//
//
//
// // console.log(cityName);
//
//
//
// // $(document).ready(function () {
// //
// //   function getCoords() {
// //     var coords;
// //     $.ajax({
// //       type: 'POST',
// //       url: '/getlocation',
// //       success: function (data) {
// //         coords = data.coords;
// //         console.log(coords);
// //       },
// //       error: function (data,status,error) {
// //         console.log(data,status,error);
// //       },
// //     });
// //   };
// //
// //   function filter() {
// //     var data = {};
// //     data.meanings=[];
// //     data.price = [];
// //     data.area = [];
// //     data.city = city;
// //     $(".filter-object-type input[type='checkbox']:checked").each(function () {
// //       data.meanings.push($(this).attr('data-title'));
// //     });
// //     data.area = squareSlider.noUiSlider.get();
// //     for (var i = 0; i < data.area.length; i++) {
// //       data.area[i] = parseInt(data.area[i]);
// //     }
// //     data.price = priceSlider.noUiSlider.get();
// //     for (var i = 0; i < data.price.length; i++) {
// //       data.price[i] = parseInt(data.price[i]);
// //     }
// //     $.ajax({
// //       type: 'POST',
// //       data: data,
// //       url: '/filtred',
// //       success: function(data) {
// //         console.log('success');
// //         // console.log(data);
// //         $('#filter-result').empty();
// //         if (data.count > 0) {
// //           for (var i = 0; i < data.offices.length; i++) {
// //             var adres = decodeURI(data.offices[i].office_adres) ? decodeURI(data.offices[i].office_adres) : 'Error';
// //             var name = decodeURI(data.offices[i].office_name);// ? decodeURI(data.offices[i].office_name) : 'Error';
// //             var officeItem = '<article><a href="office-'+data.offices[i].office_id+'">\
// //               <div class="result-img"><img src="images/obj/'+data.offices[i].image_filename+'"/></div>\
// //               <div class="result-desc">\
// //                 <h4>'+name+'</h4>\
// //                 <p>'+adres+'</p>\
// //                 <section>\
// //                   <div class="result-price">\
// //                     <p>Цена за м<sup>2</sup>: <br/><span>'+data.offices[i].office_subprice+' р.</span></p>\
// //                   </div>\
// //                   <div class="result-square">\
// //                     <p>Площадь: <br/><span>'+data.offices[i].office_area+' м<sup>2</sup></span></p>\
// //                   </div>\
// //                 </section>\
// //               </div></a></article>';
// //             $('#filter-result').append(officeItem);
// //           }
// //         }else{
// //           var officeItem = '<p class="lead" align=center>Нет результатов, измените параметры поиска или свяжитесь с менеджером для более точного поиска помещения</p>';
// //           $('#filter-result').append(officeItem);
// //         }
// //       },
// //       error: function(data,status,error){
// //         console.log(data);
// //         console.log(status);
// //         console.log(error);
// //       }
// //     });
// //     return data;
// //   }
// //
// //   console.log(getCoords());
// //   console.log('filtred:');
// //   console.log(filter());
// // });
// //
// // function SetMap(coords) {
// //
// // }
// //
// // function setPlaceMarks() {
// //
// // }
// //
// // function isYourCity() {
// //   $("#isyourcity").show();
// //   $("#mycity").click(function () {
// //     cityName = $("#city").text();
// //     setCookie('city_name',encodeURI(ityName),365);
// //     $("#isyourcity").hide();
// //   });
// //   $("#notmycity").click(function () {
// //     var data;
// //     $(".close-layout").show();
// //     $.ajax({
// //       type: 'POST',
// //       data: data,
// //       url: '/choosecity',
// //       success: function (data) {
// //         console.log(data);
// //         $(".citys").show();
// //         $("#isyourcity").hide();
// //         if (data.count === 0) {
// //           $(".citys-list").empty();
// //           $(".citys-list").append("<h3 align=center>Городов пока нет, добавьте свой</h3>");
// //         }else{
// //           $(".citys-list").empty();
// //           for (var i = 0; i < data.citys.length; i++) {
// //             $(".citys-list").append("<div class='citys-list__item' id='city-"+data.citys[i].city_id+"'>"+decodeURI(data.citys[i].city_name)+"</div>");
// //           }
// //           $(".citys").find(".citys-list__item").click(function () {
// //             setCookie('city', $(this).text(), 365);
// //             var myGeocoder = ymaps.geocode(city),
// //                 coords;
// //             myGeocoder.then(
// //               function (res) {
// //                   coords = res.geoObjects.get(0).geometry.getCoordinates();
// //                   console.log(coords);
// //               },
// //               function (err) {
// //                   console.log('Error');
// //               }
// //             );
// //             map.setCenter(coords, 13);
// //             $(".citys").hide();
// //           });
// //         }
// //       },
// //       error: function (data,status,error) {
// //         console.log(data,status,error);
// //       }
// //     });
// //     $(".citys-form__submit").click(function (e) {
// //       e.preventDefault();
// //       if ($(".citys-form__input").val()) {
// //         var data = {
// //           city_name: encodeURI($(".citys-form__input").val())
// //         };
// //         $.ajax({
// //           type: 'POST',
// //           data: data,
// //           url: '/addcity',
// //           success: function (data) {
// //             console.log(data);
// //             $(".citys-list").append("<div class='citys-list__item' id='city-"+data.city_id+"'>"+decodeURI(data.city_name)+"</div>");
// //             $(".citys-form__input").val("");
// //             $(".citys").find(".citys-list__item").click(function () {
// //               setCookie('city', $(this).text(), 365);
// //               var myGeocoder = ymaps.geocode(city),
// //                   coords;
// //               myGeocoder.then(
// //                 function (res) {
// //                     coords = res.geoObjects.get(0).geometry.getCoordinates();
// //                     console.log(coords);
// //                 },
// //                 function (err) {
// //                     console.log('Error');
// //                 }
// //               );
// //               map.setCenter(coords, 13);
// //               $(".citys").hide();
// //             });
// //           },
// //           error: function (data,status,error) {
// //             console.log(data,status,error);
// //           }
// //         });
// //       }else{
// //         alert('Введите название города');
// //       }
// //     });
// //   });
// // }
// //
// //   var coords = ["55.7543", "37.619744"];
// //   var zoom = 13;
// //   var map, clusterer, placemarks = [];
// //
// //   var city = getCookie('city_name');
// //   if (city === "") {
// //     var data;
// //     $.ajax({
// //       type: 'POST',
// //       data: data,
// //       url: '/getlocation',
// //       success: function (data) {
// //         console.log(data.coords);
// //         coords = data.coords;
// //       },
// //       error: function (data,status,error) {
// //         console.log(data,status,error);
// //       }
// //     });
// //     ymaps.ready(function(){
// //       var myGeocoder = ymaps.geocode(coords);
// //       myGeocoder.then(
// //         function (res) {
// //             city = res.geoObjects.get(0).properties.get('description');
// //             var cityArr = city.split(',');
// //             var cityName = cityArr[1];
// //             console.log(cityName);
// //             $('#city').text(cityName);
// //             isYourCity();
// //         },
// //         function (err) {
// //             console.log('Error');
// //         }
// //       );
// //     });
// //   }else{
// //     $('#city').text(city);
// //     ymaps.ready(function(){
// //       var myGeocoder = ymaps.geocode(city);
// //       myGeocoder.then(
// //         function (res) {
// //             coords = res.geoObjects.get(0).geometry.getCoordinates();
// //         },
// //         function (err) {
// //             console.log('Error');
// //         }
// //       );
// //     });
// //   }
//
//   // ymaps.ready(function(){
//   //   map = new ymaps.Map("map", {
//   //     center: coords,
//   //     zoom: zoom,
//   //     controls: ["fullscreenControl"]
//   // 	});
//   //   map.controls.add("zoomControl",{
//   //     position: {
//   //       right: 5,
//   //       bottom: 45
//   //     }
//   //   });
//   //   map.controls.add("fullscreenControl",{
//   //     position: {
//   //       top: 55,
//   //       right: 5
//   //     }
//   //   });
//   //
//   //   map.behaviors.enable('scrollZoom');
//   //
//   //   $("#city").click(function () {
//   //     isYourCity();
//   //   });
//   //
//   //   if($("#filter").length) {
//   //     function setPlaceMarks(){
//   //       var data = {};
//   //       data.meanings=[];
//   //       data.price = [];
//   //       data.area = [];
//   //       $(".filter-object-type input[type='checkbox']:checked").each(function () {
//   //         data.meanings.push($(this).attr('data-title'));
//   //       });
//   //       data.area = squareSlider.noUiSlider.get();
//   //       for (var i = 0; i < data.area.length; i++) {
//   //         data.area[i] = parseInt(data.area[i]);
//   //       }
//   //       data.price = priceSlider.noUiSlider.get();
//   //       for (var i = 0; i < data.price.length; i++) {
//   //         data.price[i] = parseInt(data.price[i]);
//   //       }
//   //       console.log(data);
//   //       $.ajax({
//   //         type: 'POST',
//   //         data: data,
//   //         url: '/filtred',
//   //         success: function(data) {
//   //           console.log('success');
//   //           console.log(data);
//   //           // console.log(data.geo);
//   //           $('#filter-result').empty();
//   //           if (data.count > 0) {
//   //             for (var i = 0; i < data.offices.length; i++) {
//   //               var adres = decodeURI(data.offices[i].office_adres) ? decodeURI(data.offices[i].office_adres) : 'Error';
//   //               var name = decodeURI(data.offices[i].office_name);// ? decodeURI(data.offices[i].office_name) : 'Error';
//   //               var officeItem = '<article><a href="office-'+data.offices[i].office_id+'">\
//   //                 <div class="result-img"><img src="images/obj/'+data.offices[i].image_filename+'"/></div>\
//   //                 <div class="result-desc">\
//   //                   <h4>'+name+'</h4>\
//   //                   <p>'+adres+'</p>\
//   //                   <section>\
//   //                     <div class="result-price">\
//   //                       <p>Цена за м<sup>2</sup>: <br/><span>'+data.offices[i].office_subprice+' р.</span></p>\
//   //                     </div>\
//   //                     <div class="result-square">\
//   //                       <p>Площадь: <br/><span>'+data.offices[i].office_area+' м<sup>2</sup></span></p>\
//   //                     </div>\
//   //                   </section>\
//   //                 </div></a></article>';
//   //               $('#filter-result').append(officeItem);
//   //             }
//   //             if ($('#map').length) {
//   //               for (var i = 0; i < data.objects.length; i++) {
//   //                 var coordss=data.objects[i].object_coords.split(',');
//   //                 var coordsArr = [];
//   //                 coordsArr[0] = parseFloat(coordss[0]);
//   //                 coordsArr[1] = parseFloat(coordss[1]);
//   //                 var officeCountByObject = data.objects[i].offices_count;
//   //                 officeCountByObject = officeCountByObject.toString();
//   //                 var adres = decodeURI(data.objects[i].object_adres) ? decodeURI(data.objects[i].object_adres) : 'Error!';
//   //                 var name = decodeURI(data.objects[i].object_name) ? decodeURI(data.objects[i].object_name) : 'Error!';
//   //                 placemarks[i] = new ymaps.Placemark(coordsArr,{
//   //                   balloonContentHeader: name,
//   //                   balloonContentBody: adres,
//   //                   balloonContentFooter: '<a href="/object-'+data.objects[i].object_id+'" class="balloon-count-link">Найдено '+officeCountByObject+' помещений</a><a href="/object-'+data.objects[i].object_id+'" class="balloon-more-link">Подробнее</a>',
//   //                   hintContent: '<strong>'+name+'</strong><br>'+adres,
//   //                   clusterCaption: name,
//   //                   iconContent: officeCountByObject
//   //                 });
//   //                 map.geoObjects.add(placemarks[i]);
//   //                 map.events.add('click', function (e) {
//   //                     map.balloon.close();
//   //                 });
//   //               }
//   //               $("#filter .filtr-it").click(function(){
//   //               	for (var i = placemarks.length - 1; i >= 0; i--) {
//   //               		map.geoObjects.remove(placemarks[i]);
//   //               	};
//   //                 $('a[href="#filter-result"]').click();
//   //                 map.geoObjects.removeAll();
//   //               });
//   //               var clusterer = new ymaps.Clusterer({ hasBalloon: true, disableClickZoom: true,  zoomMargin: 50});
//   //               clusterer.add(placemarks);
//   //               map.geoObjects.add(clusterer);
//   //               $("#filter .filtr-it").click(function(){
//   //                   map.geoObjects.remove(clusterer);
//   //               });
//   //             }else{
//   //               console.log('map is false');
//   //             }
//   //           }else{
//   //             var officeItem = '<p class="lead" align=center>Нет результатов, измените параметры поиска или свяжитесь с менеджером для более точного поиска помещения</p>';
//   //             $('#filter-result').append(officeItem);
//   //           }
//   //         },
//   //         error: function(data,status,error){
//   //           console.log(data);
//   //           console.log(status);
//   //           console.log(error);
//   //         }
//   //       });
//   //       $("#filter .filtr-it").click(function(){
//   //       	for (var i = placemarks.length - 1; i >= 0; i--) {
//   //       		map.geoObjects.remove(placemarks[i]);
//   //       	};
//   //         $('a[href="#filter-result"]').click();
//   //         map.geoObjects.removeAll();
//   //       });
//   //       var clusterer = new ymaps.Clusterer({ hasBalloon: true, disableClickZoom: true,  zoomMargin: 50});
//   //       clusterer.add(placemarks);
//   //       map.geoObjects.add(clusterer);
//   //       $("#filter .filtr-it").click(function(){
//   //           map.geoObjects.remove(clusterer);
//   //       });
//   //     }
//   //
//   //     setPlaceMarks();
//   //     $("#filter .filtr-it").click(function (e) {
//   //   		e.preventDefault();
//   //       setPlaceMarks();
//   //   	});
//   //   };
//   // });
