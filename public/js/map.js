
var coords = $(".geo-ll").text().split(',');
var zoom = $(".geo-zoom").text();
console.log(coords);
var map, clusterer, placemarks = [];

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
  // $.ajax('/allobjects', {
  //   type: 'GET',
  //   dataType: 'json',
  //   timeout: 10000,
  //   success: function(data) {
  //     for (var i = 0; i < data.objects.length; i++) {
  //       var coords=data.objects[i].object_coordinates.split(',');
  //       var coordsInt = [];
  //       coordsInt[0] = parseFloat(coords[0]);
  //       coordsInt[1] = parseFloat(coords[1]);
  //       placemarks[i] = new ymaps.Placemark(coordsInt,{
  //         balloonContent: '<div class="balloon-wrap"><div class="balloon-text"><a href="/object'+data.objects[i].object_id+'" class="balloon-heading">'+data.objects[i].object_name+'</a>\
  //         <div class="balloon-adres"><span class="glyphicon glyphicon-map-marker"></span> '+data.objects[i].object_addres+'</div>\
  //         </div>\
  //         <div class="balloon-img"><a href="/object'+data.objects[i].object_id+'"><img src="'+data.imgFolder+data.objects[i].object_image+'" alt="" /></a></div>\
  //         <p><a class="blue-link" href="/object'+data.objects[i].object_id+'">Найдено '+data.objects[i].object_offices.length+' помещений</a></p>\
  //         <p><a href="/object'+data.objects[i].object_id+'" class="red-link">Подробнее &gt;</a></p><div class="clearfix"></div></div>',
  //         hintContent: "<a href='/object"+data.objects[i].object_id+"' class='baloon-heading'>"+data.objects[i].object_name+"</a><p><strong><a href='/object"+data.objects[i].object_id+"'>"+data.objects[i].object_addres+"</a></strong></p>\
  //         <p><a href='/object"+data.objects[i].object_id+"'>Найдено "+data.objects[i].object_offices.length+" помещений</a></p>",
  //         //clusterCaption: data.objects[i].object_name
  //         clusterCaption: ''
  // 			},{
  //         preset: 'islands#blueDotIcon',
  //         href: "/object"+data.objects[i].object_id,
  //         coords: coordsInt,
  //       });
  //       placemarks[i].events.add('click', function(e){
  //           //location = e.get('target').options.get('href');
  //           //console.log(e.get('target').options);
  //           //console.log(e.get('target').options._options.href);
  //           //window.location.href = e.get('target').options._options.href;
  //       });
  //       map.geoObjects.add(placemarks[i]);
  //       $('#placemarksCount').val(data.rows);
  //       map.events.add('click', function (e) {
  //           map.balloon.close();
  //       });
  //     };
  //     var clusterer = new ymaps.Clusterer({ hasBalloon: true, disableClickZoom: true,  zoomMargin: 50});
  //     clusterer.add(placemarks);
  //     map.geoObjects.add(clusterer);
  //   },
  //   error  : function(data, error, status)     { console.log(data, error, status); }
  // });
});
