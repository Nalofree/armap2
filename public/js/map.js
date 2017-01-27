$(document).ready(function () {

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

  if (cityId) {
    console.log('get city name & city coords');
    $.ajax({
      type: 'POST',
      data: {city_id: cityId},
      url: '/getcitybyid',
      success: function (data, status, error) {
        console.log(data, status, error);
        mapCoords = data.city.city_coords.split(",");
        $("#city").text(data.city.city_name);
        if ($("#map").length) {
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
        }
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
          cityNameStr = cityName[0];
          console.log(cityName, newCoords);
          $.ajax({
            type: 'POST',
            data: {city_name: cityNameStr},
            url: '/getcitybyname',
            success: function (data, status, error) {
              console.log(data, status, error);
              if (data.count > 0) {
                mapCoords = data.city.city_coords.split(",");
                if ($("#map").length) {
                  SetMap(mapCoords);
                }
                if ($("#search-filter").length) {
                  filter(cityId).then(function (placemarks) {
                  });
                  $(".filtr-it").click(function () {
                    filter(cityId).then(function (placemarks) {
                    });
                  });
                }
                $("#city").text(data.city.city_name);
                $(".tooltip-white__quastion-cityname").text(data.city.city_name);
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
                if ($("#map").length) {
                  SetMap(newCoords);
                }
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

  function filter(cityId) {
    return new Promise(function (resolve, reject) {
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
          console.log(data,status,error);
          $('#filter-result').empty();
          if (data.count > 0) {
            for (var i = 0; i < data.objects.length; i++) {
              for (var j = 0; j < data.objects[i].object_offices.length; j++) {
                var adres = data.objects[i].object_offices[j].office_adres;
                var name = data.objects[i].object_offices[j].office_name;
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
            ymaps.ready(function () {
              placemarks = [];
              for (var i = 0; i < data.objects.length; i++) {
                  var coordss=data.objects[i].object_coords.split(',');
                  var coordsArr = [];
                  coordsArr[0] = parseFloat(coordss[0]);
                  coordsArr[1] = parseFloat(coordss[1]);
                  var officeCountByObject = data.objects[i].offices_count;
                  officeCountByObject = officeCountByObject.toString();
                  var adres = data.objects[i].object_adres;
                  var name = data.objects[i].object_name;
                  placemarks[i] = new ymaps.Placemark(coordsArr,{
                    balloonContentHeader: name,
                    balloonContentBody: adres,
                    balloonContentFooter: '<a href="/object-'+data.objects[i].object_id+'" class="balloon-count-link">Найдено помещений: '+officeCountByObject+'</a><a href="/object-'+data.objects[i].object_id+'" class="balloon-more-link">Подробнее</a>',
                    hintContent: '<strong>'+name+'</strong><br>'+adres,
                    clusterCaption: name,
                    iconContent: officeCountByObject
                  });
              }
              resolve(placemarks);
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

  function setNewCity() {
    $("#choosecity").show();
    $(".close-layout").show()
    var cityData;
    ymaps.ready(function () {
      $(".citys-form__input").keyup(function () {
        $(".citys-form__tooltip").show();
        $(".citys-form__submit").prop('disabled', true);
        var myGeocoder2 = ymaps.geocode("Россия, " + $(this).val(), {kind:"locality"}),
        autocity,
        autoccords;
        myGeocoder2.then(
          function (res) {
            autoccords = res.geoObjects.get(0).geometry.getCoordinates();
            autocity = res.geoObjects.get(0).getLocalities();
            $(".citys-form__tooltip").text(res.geoObjects.get(0).getLocalities());
            $(".citys-form__tooltip").click(function () {
              $(".citys-form__submit").prop('disabled', false);
              $(".citys-form__input").val(autocity);
              console.log(autoccords);
              $(this).hide();
              cityData = {
                city_name: autocity,
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
    $(".citys-form__submit").click(function (e) {
      e.preventDefault();
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
            $(".citys-list").append("<div class='citys-list__item' id='city-"+data.citys[i].city_id+"'>"+data.citys[i].city_name+"</div>");
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

});
