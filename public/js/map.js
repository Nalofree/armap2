
  var coords;
  var zoom = 13;
  var map, clusterer, placemarks = [];

  var city = getCookie('city_name');
  if (city === "") {
    var data;
    $.ajax({
      type: 'POST',
      data: data,
      url: '/getlocation',
      success: function (data) {
        console.log(data.coords);
        coords = data.coords;
      },
      error: function (data,status,error) {
        console.log(data,status,error);
      }
    });
    ymaps.ready(function(){
      var myGeocoder = ymaps.geocode(coords);
      myGeocoder.then(
        function (res) {
            city = res.geoObjects.get(0).properties.get('description');
            var cityArr = city.split(',');
            var cityName = cityArr[1];
            console.log(cityName);
            $('#city').text(cityName);
        },
        function (err) {
            console.log('Error');
        }
      );
    });
  }else{
    $('#city').text(city);
    ymaps.ready(function(){
      var myGeocoder = ymaps.geocode(city);
      myGeocoder.then(
        function (res) {
            coords = res.geoObjects.get(0).geometry.getCoordinates();
        },
        function (err) {
            console.log('Error');
        }
      );
    });
  }

  ymaps.ready(function(){
    map = new ymaps.Map("map", {
      center: coords,
      zoom: zoom,
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

    if($("#filter").length) {

      function setPlaceMarks(){
        var data = {};
        data.meanings=[];
        data.price = [];
        data.area = [];
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
        console.log(data);
        $.ajax({
          type: 'POST',
          data: data,
          url: '/filtred',
          success: function(data) {
            console.log('success');
            console.log(data);
            // console.log(data.geo);
            $('#filter-result').empty();
            if (data.count > 0) {
              for (var i = 0; i < data.offices.length; i++) {
                var adres = decodeURI(data.offices[i].office_adres) ? decodeURI(data.offices[i].office_adres) : 'Error';
                var name = decodeURI(data.offices[i].office_name);// ? decodeURI(data.offices[i].office_name) : 'Error';
                var officeItem = '<article><a href="office-'+data.offices[i].office_id+'">\
                  <div class="result-img"><img src="images/obj/'+data.offices[i].image_filename+'"/></div>\
                  <div class="result-desc">\
                    <h4>'+name+'</h4>\
                    <p>'+adres+'</p>\
                    <section>\
                      <div class="result-price">\
                        <p>Цена за м<sup>2</sup>: <br/><span>'+data.offices[i].office_subprice+' р.</span></p>\
                      </div>\
                      <div class="result-square">\
                        <p>Площадь: <br/><span>'+data.offices[i].office_area+' м<sup>2</sup></span></p>\
                      </div>\
                    </section>\
                  </div></a></article>';
                $('#filter-result').append(officeItem);
              }
              if ($('#map').length) {
                for (var i = 0; i < data.objects.length; i++) {
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
                    balloonContentFooter: '<a href="/object-'+data.objects[i].object_id+'" class="balloon-count-link">Найдено '+officeCountByObject+' помещений</a><a href="/object-'+data.objects[i].object_id+'" class="balloon-more-link">Подробнее</a>',
                    hintContent: '<strong>'+name+'</strong><br>'+adres,
                    clusterCaption: name,
                    iconContent: officeCountByObject
                  });
                  map.geoObjects.add(placemarks[i]);
                  map.events.add('click', function (e) {
                      map.balloon.close();
                  });
                }
                $("#filter .filtr-it").click(function(){
                	for (var i = placemarks.length - 1; i >= 0; i--) {
                		map.geoObjects.remove(placemarks[i]);
                	};
                  $('a[href="#filter-result"]').click();
                  map.geoObjects.removeAll();
                });
                var clusterer = new ymaps.Clusterer({ hasBalloon: true, disableClickZoom: true,  zoomMargin: 50});
                clusterer.add(placemarks);
                // map.geoObjects.add(clusterer);
                $("#filter .filtr-it").click(function(){
                    map.geoObjects.remove(clusterer);
                });
              }else{
                console.log('map is false');
              }
            }else{
              var officeItem = '<p class="lead" align=center>Нет результатов, измените параметры поиска или свяжитесь с менеджером для более точного поиска помещения</p>';
              $('#filter-result').append(officeItem);
            }
          },
          error: function(data,status,error){
            console.log(data);
            console.log(status);
            console.log(error);
          }
        });
        $("#filter .filtr-it").click(function(){
        	for (var i = placemarks.length - 1; i >= 0; i--) {
        		map.geoObjects.remove(placemarks[i]);
        	};
          $('a[href="#filter-result"]').click();
          map.geoObjects.removeAll();
        });
        var clusterer = new ymaps.Clusterer({ hasBalloon: true, disableClickZoom: true,  zoomMargin: 50});
        clusterer.add(placemarks);
        map.geoObjects.add(clusterer);
        $("#filter .filtr-it").click(function(){
            map.geoObjects.remove(clusterer);
        });
      }

      setPlaceMarks();
      $("#filter .filtr-it").click(function (e) {
    		e.preventDefault();
        setPlaceMarks();
    	});
    };
  });
