// // var coords;
// $(document).ready(function () {
//   // var city = getCookie('city_name');
//   // if (city === "") {
//   //   var data;
//   //   $.ajax({
//   //     type: 'POST',
//   //     data: data,
//   //     url: '/getlocation',
//   //     success: function (data) {
//   //       console.log(data.coords);
//   //       coords = data.coords;
//   //     },
//   //     error: function (data,status,error) {
//   //       console.log(data,status,error);
//   //     }
//   //   });
//   //   ymaps.ready(function(){
//   //     var myGeocoder = ymaps.geocode(coords);
//   //     myGeocoder.then(
//   //       function (res) {
//   //           $(".geo-ll").text(res.geoObjects.get(0).properties);
//   //           city = res.geoObjects.get(0).properties;
//   //       },
//   //       function (err) {
//   //           console.log('Error');
//   //       }
//   //     );
//   //   });
//   //   $('#city').text(city);
//   // }else{
//   //   $('#city').text(city);
//   //   ymaps.ready(function(){
//   //     var myGeocoder = ymaps.geocode(city);
//   //     myGeocoder.then(
//   //       function (res) {
//   //           $(".geo-ll").text(res.geoObjects.get(0).geometry.getCoordinates());
//   //           coords = res.geoObjects.get(0).geometry.getCoordinates();
//   //       },
//   //       function (err) {
//   //           console.log('Error');
//   //       }
//   //     );
//   //   });
//   // }
//   $("#city").click(function (e) {
//     e.preventDefault();
//     $("#isyourcity").show();
//     $("#mycity").click(function () {
//       cityName = $("#city").text();
//       setCookie('city_name',cityName,365);
//       $("#isyourcity").hide();
//       console.log(cityName);
//     });
//     $("#notmycity").click(function () {
//       var data;
//       $(".close-layout").show();
//       $.ajax({
//         type: 'POST',
//         data: data,
//         url: '/choosecity',
//         success: function (data) {
//           console.log(data);
//           $(".citys").show();
//           $("#isyourcity").hide();
//           if (data.count === 0) {
//             $(".citys-list").empty();
//             $(".citys-list").append("<h3 align=center>Городов пока нет, добавьте свой</h3>");
//           }else{
//             $(".citys-list").empty();
//             for (var i = 0; i < data.citys.length; i++) {
//               $(".citys-list").append("<div class='citys-list__item' id='city-"+data.citys[i].city_id+"'>"+decodeURI(data.citys[i].city_name)+"</div>");
//             }
//             $(".citys-list__item").click(function () {
//               cityName = $(this).text();
//               cityId = $(this).attr('id').split("-")[1];
//               setCookie('city_name',cityName,365);
//               setCookie('city_id',cityId,365);
//             });
//           }
//         },
//         error: function (data,status,error) {
//           console.log(data,status,error);
//         }
//       });
//       $(".citys-form__submit").click(function (e) {
//         e.preventDefault();
//         if ($(".citys-form__input").val()) {
//           var data = {
//             city_name: encodeURI($(".citys-form__input").val())
//           };
//           $.ajax({
//             type: 'POST',
//             data: data,
//             url: '/addcity',
//             success: function (data) {
//               console.log(data);
//               $(".citys-list").append("<div class='citys-list__item' id='city-"+data.city_id+"'>"+decodeURI(data.city_name)+"</div>");
//               $(".citys-form__input").val("");
//               $(".citys-list__item").click(function () {
//                 cityName = $(this).text();
//                 cityId = $(this).attr('id').split("-")[1];
//                 setCookie('city_name',cityName,365);
//                 setCookie('city_id',cityId,365);
//               });
//             },
//             error: function (data,status,error) {
//               console.log(data,status,error);
//             }
//           });
//         }else{
//           alert('Введите название города');
//         }
//       });
//     });
//   });
//   $("#notmycity").click(function () {
//     var data;
//     $(".close-layout").show();
//     $.ajax({
//       type: 'POST',
//       data: data,
//       url: '/choosecity',
//       success: function (data) {
//         console.log(data);
//         $(".citys").show();
//         $("#isyourcity").hide();
//         if (data.count === 0) {
//           $(".citys-list").empty();
//           $(".citys-list").append("<h3 align=center>Городов пока нет, добавьте свой</h3>");
//         }else{
//           $(".citys-list").empty();
//           for (var i = 0; i < data.citys.length; i++) {
//             $(".citys-list").append("<div class='citys-list__item' id='city-"+data.citys[i].city_id+"'>"+decodeURI(data.citys[i].city_name)+"</div>");
//           }
//           $(".citys-list__item").click(function () {
//             cityName = $(this).text();
//             cityId = $(this).attr('id').split("-")[1];
//             setCookie('city_name',cityName,365);
//             setCookie('city_id',cityId,365);
//           });
//         }
//       },
//       error: function (data,status,error) {
//         console.log(data,status,error);
//       }
//     });
//     $(".citys-form__submit").click(function (e) {
//       e.preventDefault();
//       if ($(".citys-form__input").val()) {
//         var data = {
//           city_name: encodeURI($(".citys-form__input").val())
//         };
//         $.ajax({
//           type: 'POST',
//           data: data,
//           url: '/addcity',
//           success: function (data) {
//             console.log(data);
//             $(".citys-list").append("<div class='citys-list__item' id='city-"+data.city_id+"'>"+decodeURI(data.city_name)+"</div>");
//             $(".citys-form__input").val("");
//             $(".citys-list__item").click(function () {
//               cityName = $(this).text();
//               cityId = $(this).attr('id').split("-")[1];
//               setCookie('city_name',cityName,365);
//               setCookie('city_id',cityId,365);
//             });
//           },
//           error: function (data,status,error) {
//             console.log(data,status,error);
//           }
//         });
//       }else{
//         alert('Введите название города');
//       }
//     });
//   });
// });
