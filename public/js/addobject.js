
function getTime(){
  var now = new Date();//1998-02-03 22:23:00
      now = now.getFullYear() + '-' +
        ('00' + (now.getMonth()+1)).slice(-2) + '-' +
        ('00' + now.getDate()).slice(-2) + ' ' +
        ('00' + now.getHours()).slice(-2) + ':' +
        ('00' + now.getMinutes()).slice(-2) + ':' +
        ('00' + now.getSeconds()).slice(-2);
      console.log(now);
      return now;
};

$(document).ready(function() {
  var objectData={};
  var officeData = {};

  $('.btn-create-object').click(function (e) {
    e.preventDefault();
    $('.kab-create-step-one').toggle();
    $('input').val('');
    $('input:checkbox').removeAttr('checked');
    $('select').prop('selectedIndex',0);
  });

  $('#objadres').keyup(function(){
  	var myGeocoder = ymaps.geocode($("#city").text()+', '+$(this).val()),
  	autoaddres,
  	autoccordinates,
    objectId,
    objectName;
  	myGeocoder.then(
  	  function (res) {
  	  	autoaddres = res.geoObjects.get(0).properties.get('text');
  	  	//console.log(autoaddres);
        $('.obj-addr-autoshow').show();
			  $('.obj-addr-autoshow').text(autoaddres);
  	    autoccordinates = res.geoObjects.get(0).geometry.getCoordinates();
  	    //console.log(autoccordinates);
        $("#objcoords").val(autoccordinates);
        $("#choose-object").val('');
        $('.obj-addr-autoshow').click(function () {
          $('#objadres').val(autoaddres);
          $('.obj-addr-autoshow').hide();
        });
  	  },
  	  function (err) {
  	      console.log(err);
  	  }
  	);
  });

  $("#choose-object").change(function () {
    if ($(this).val() != '') {
      $("#objcoords").val('');
      $('#objadres').val('');
      // $('.kab-create-step-two').fadeIn();
      console.log($(this).val());
      objectData.Id = $(this).val();
      objectData.object_name = $(this).find('option:selected').text();
      objectData.object_adres = $(this).find('option:selected').attr('title');
      $('.step-inform-address').html("Адрес: <span>"+objectData.object_adres+"</span><span>"+objectData.object_name+"</span>");
      // autoaddres =
    }else{
      // $('.kab-create-step-three').fadeIn();
    }
  });

  $('.first-step').click(function (e) {
    e.preventDefault();
    if ($("#choose-object").val() != '' || $("#objcoords").val() != '') {
      $('.kab-create-step-one').hide();//.animate({'display':'none'},500);
      if ($("#choose-object").val() != '') {
        $("#objcoords").val('');
        $('#objadres').val('');
        $('.kab-create-step-three').fadeIn();
      }else{
        $('.kab-create-step-two').fadeIn();
        // $('.step-inform-adres').text('Адрес: '+autoaddres);
        var now = getTime();
        objectData = {
          object_adres: $('#objadres').val(),
          object_coords: $("#objcoords").val(),
          object_create: now,
          object_publish: 0,
          object_show: 1,
          // object_type: $('input[name="objectType"]:checked').attr('data-title'),
          object_city: getCookie('city_id')
        }
        // console.log(objectData.object_type);
        $('.step-inform-address').html("Адрес: <span>"+objectData.object_adres+"</span>");
      }
    }else{
      alert('Заполните поля');
    }
  });

  $('.second-step').click(function (e) {
    e.preventDefault();
    if ($('#objname').val() != '') {
      $('.kab-create-step-two').hide();//.animate({'display':'none'},500);
      $('.kab-create-step-three').show();
      objectData.object_name = $('#objname').val();
      //console.log(objectData);
      objectData.object_type = $('input[name="objectType"]:checked').attr('data-title');
        console.log(objectData.object_type);
      $(".close-layout").show();
      $.ajax({
        type: 'POST',
        data: objectData,
  			url: '/setobject',
  			success: function(data) {
          console.log(data);
          objectData.Id = data.insertId;
          $(".close-layout").hide();
        },
        error: function(data,status,error) {
          console.log(data + status + error);
          $(".close-layout").hide();
        }
      });
    }else{
      alert('Заполните поля');
    }
  });

  function fieldsIsEmpty() {
    var meanings = $('input[name="meanings"]:checked').index() >=0 ? true : false,
        included = $('input[name="included"]:checked').index() >=0 ? true : false,
        advanced = $('input[name="advanced"]:checked').index() >=0 ? true : false,
        providers = $('input[name="providers"]:checked').index() >=0 ? true : false,
        mainPhoto = $('input[name="mainPhoto"]:checked').index() >=0 ? true : false,
        header = $('#create-header').val() != '' ? true : false,
        square = $('#create-square').val() != '' ? true : false,
        price = $('#create-price').val() != '' ? true : false,
        tel = $('#create-tel').val() != '' ? true : false,
        height = $('#create-height').val() != '' ? true : false,
        result = meanings & included & advanced & providers & mainPhoto & header & square & price & tel & height;
        if (result) {
          return true;
        }else{

        }
        //console.log(" meanings: "+meanings+"; included: "+included+"; advanced: "+advanced+"; providers: "+providers+"; mainPhoto: "+mainPhoto+"; header: "+header+"; square: "+square+"; price: "+price+"; tel: "+tel+"; height: "+height);
        console.log(result);
    //return result;
  }

  $('#create-square, #create-price, #create-height').keyup(function () {
    var string = $(this).val();
    $(this).val(string.replace(/[^\d\\.]+/g,""));
    // parseFloat($(this).val())
    var totalPrice = getTotalPrice($('#create-square').val(), $('#create-price').val());
    // totalPrice = totalPrice.toFixed(2);
    $('.comp-price').text(totalPrice);
  });

  $('.comp-price').text(getTotalPrice($('#create-square').val(), $('#create-price').val()));

  function getTotalPrice(area, subprice) {
    var totalPrice;
    if (area && subprice) {
      totalPrice = parseFloat(area) * parseFloat(subprice);
    }else{
      totalPrice = 0;
    }
    return totalPrice.toFixed(2);
  }

  $('.third-step.step-btn').click(function (e) {
    e.preventDefault();
    if (!fieldsIsEmpty()) {
      alert('Заполните все поля');
    }else{
      var now = getTime();
      var images=[];
      $('input[name="mainPhoto"]').each(function () {
        images.push($(this).val());
      });

      function checkboxProcess(checkboxName) {
        var arr=[];
        $('input[name='+checkboxName+']').each(function () {
          if ($(this).prop("checked")) {
            arr.push($(this).attr('data-title'));
          }
        });
        console.log(arr);
        return arr;
      };

      officeData.meanings = checkboxProcess('meanings');
      officeData.included = checkboxProcess('included');
      officeData.advanced = checkboxProcess('advanced');
      officeData.providers = checkboxProcess('providers');
      officeData.cover = checkboxProcess('mainPhoto');
      officeData.images = images;
      officeData.header = $('#create-header').val();
      officeData.sqare =  $('#create-square').val();
      officeData.price = $('#create-price').val();
      officeData.phone = $('#create-tel').val();
      officeData.height = $('#create-height').val();
      officeData.create = now;
      officeData.object = objectData.Id;
      // console.log(officeData);

      $.ajax({
        url: '/addoffice',
        type: 'post',
        data: officeData,
        success: function (data) {
          console.log('success '+data);
          $('.kab-create-step-three').hide();
          $('body,html').animate({"scrollTop":0},"slow");
          $('.kab-create-step-complite').fadeIn();
          $('input').val('');
          $('input:checkbox').removeAttr('checked');
          $('select').prop('selectedIndex',0);
        },
        error: function (data) {
          console.log('error '+data);
        }
      });
    }
  });

  $('.kab-create-step-complite .step-btn').click(function (e) {
    e.preventDefault();
    $(this).parent().fadeOut();
    location.reload();
  });

  $('.kab-item-create a').click(function (e) {
    e.preventDefault();
    //console.log($(this).attr('href'));
    objectData.Id = $(this).attr('href');
    objectData.object_name = $(this).parent().parent().parent().find('.kab-item-header h4').text();
    objectData.object_adres = $(this).parent().parent().parent().find('.kab-item-header p').text();
    $('.step-inform-address').html("Адрес: <span>"+objectData.object_adres+"</span><span>"+objectData.object_name+"</span>");
    $('.kab-create-step-three').fadeIn();
  });

  $('#setimages').change(function (e) {
    files = this.files;
    var data = new FormData();
    $.each( files, function( key, value ){
        if ((value.type).indexOf('image') >= 0) {
            data.append( 'uplimage', value );
        }
    });
    var officeid = $(this).attr('data-title') != '' ? $(this).attr('data-title') : false;
    data.append('officeid', officeid);
    console.log(files);
    console.log(data);
    $(".close-layout").show();
    $.ajax({
      url: '/uploadimage',
      type: 'POST',
      data: data,
      cache: false,
      dataType: 'json',
      processData: false, // Не обрабатываем файлы (Don't process the files)
      contentType: false, // Так jQuery скажет серверу что это строковой запрос
      success: function (data) {
        console.log(data);
        // $('.add-photos-items').empty();
        for (var i = 0; i < data.images.length; i++) {
          $('.add-photos-items').append("<a href=/uploads/"+data.images[i].image_filename+">"+data.images[i].image_filename+"</a>");
          // $('.add-photos-items').append("<img src=/uploads/"+data.images[i].image_filename+">");

          // $('.add-photos-items').append('<div class="add-photos-item"><img src="/uploads/'+data[i].image_filename+'" alt="" width=180><div class="photos-settings"><div class="radio"><label for="mainPhoto"><input type="radio" name="mainPhoto" value="'+data[i].image_id+'" data-title="'+data[i].image_id+'">Главная</label></div><a href="#" class="deluplimage"  data-title="'+data[i].image_id+'">Удалить</a></div></div>');
          console.log(data.images[i].image_filename);
          // $('.add-photos-item img').hide().attr('src',"/uploads/"+data[i].image_filename).fadeIn();
          // $('.add-photos-item img').fadeOut(800, function () {
          //   $('.add-photos-item img').attr('src',"/uploads/"+data[i].image_filename).fadeIn().delay(2000);
          // });
        }

        // setTimeout(function(){
        //   $('.add-photos-items').fadeOut();
        //   $('.add-photos-items').fadeIn();
        // }, 500);

        $('#setimages').val('');
        $(".close-layout").hide();

      },
      error: function (data) {
        console.log(data);
        $(".close-layout").hide();
      }
    });
  });

  $('.add-photos-items').on('click','.deluplimage', function (e) {
    e.preventDefault();
    console.log($(this).parent().parent().children('img').attr('src'));
    var imgWhereString = [];
    $('.add-photos-item img').each(function () {
      imgWhereString.push($(this).attr('src').split('/')[2]);
    });
    imgWhereString = imgWhereString.join('","');
    var imgData = {path:$(this).parent().parent().children('img').attr('src'),imgWhereString:imgWhereString};
    var deletedItem = $(this).parent().parent();
    imgData.imageid = $(this).attr('data-title') != '' ? $(this).attr('data-title') : false;
    $.ajax({
      url: '/deluplimage',
      type: 'post',
      data: imgData,
      success: function (data) {
        console.log(data);
        // $('.add-photos-items').empty();
        // for (var i = 0; i < data.length; i++) {
        //   $('.add-photos-items').append('<div class="add-photos-item"><img src="/uploads/'+data[i].image_filename+'" alt="" width=180><div class="photos-settings"><div class="radio"><label for="mainPhoto"><input type="radio" name="mainPhoto">Главная</label></div><a href="#" class="deluplimage">Удалить</a></div></div>');
        // }
        deletedItem.remove();
        $(".close-layout").hide();
      },
      error: function (data) {
        console.log(data);
        $(".close-layout").hide();
      }
    });
  });

});
