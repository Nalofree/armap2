
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

  // $('.close-layout').click(function () {
  //   $('.close-layout').fadeOut();
  //   $('.kab-create-step-one').fadeOut();
  //   $('.kab-create-step-two').fadeOut();
  //   $('.kab-create-step-three').fadeOut();
  //   $('.kab-create-step-complite').fadeOut();
  // });

  $('.btn-create-object').click(function (e) {
    e.preventDefault();
    $('.kab-create-step-one').fadeIn();
    // $('.close-layout').fadeIn();
    $('input').val('');
    $('input:checkbox').removeAttr('checked');
    $('select').prop('selectedIndex',0);
  });

  $('#objadres').keyup(function(){
    $('.obj-addr-autoshow').hide();
    $(".obj-addr-autoshow .objects-list").empty();
    $(".obj-addr-autoshow .adres").empty();
    if ($(this).val().length > 3) {
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
  			  $('.obj-addr-autoshow p.adres').text(autoaddres);
          $(".obj-addr-autoshow .objects-list").empty();
          $.ajax({
            url: '/objectautolist',
            type: 'POST',
            data: {adres: autoaddres},
            success: function (data, status, error) {
              console.log(data, status, error);
              for (var i = 0; i < data.objects.length; i++) {
                $('.obj-addr-autoshow .objects-list').append("<p></p><div data-title="+data.objects[i].object_id+"><p><b>"+data.objects[i].object_name+"</b><br><small>"+data.objects[i].object_adres+"</small></p></div>");
                // console.log('append');
              }
            },
            error: function (data, status, error) {
              console.log(data, status, error);
            }
          });
    	    autoccordinates = res.geoObjects.get(0).geometry.getCoordinates();
    	    //console.log(autoccordinates);
          $("#objcoords").val(autoccordinates);
          $("#choose-object").val('');
          $('.obj-addr-autoshow p.adres').click(function () {
            $('#objadres').val(autoaddres);
            $('.obj-addr-autoshow').hide();
          });
          $(".obj-addr-autoshow").on('click', '.objects-list div', function () {
            // if ($(this).val() != '') {
              $("#objcoords").val('');
              $('#objadres').val('');
              // $('.kab-create-step-two').fadeIn();
              console.log($(this).val());
              objectData.Id = $(this).attr('data-title');
              objectData.object_name = $(this).find('b').text();
              objectData.object_adres = $(this).find('small').text();
              $('.step-inform-address').html("Адрес: <span>"+objectData.object_adres+"</span><span>"+objectData.object_name+"</span>");
              $('.kab-create-step-one').fadeOut();
              $('.kab-create-step-three').fadeIn();
              // $('.close-layout').fadeIn();
              $('.obj-addr-autoshow').hide();
              $(".obj-addr-autoshow .objects-list").empty();
              $(".obj-addr-autoshow .adres").empty();
              // autoaddres =
            // }else{
              // $('.kab-create-step-three').fadeIn();
            // }
          });
    	  },
    	  function (err) {
    	      console.log(err);
    	  }
    	);
    }else{
      $('.obj-addr-autoshow').hide();
    }
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

  var objimagefield = 0;

  $('.first-step').click(function (e) {
    e.preventDefault();
    var objectdata = {};
    if (($("#choose-object").val() != '' || $("#objcoords").val() != '')) {
      $('.kab-create-step-one').fadeOut();//.animate({'display':'none'},500);
      // if ($("#choose-object").val() != '') {
      //   $("#objcoords").val('');
      //   $('#objadres').val('');
      //   $('.kab-create-step-three').fadeIn();
      //   $('.close-layout').fadeIn();
      //   objdata.object_id: $("#choose-object").val(),
      //   objdata.object_cover: objimagefield
      //   console.log(objdata);
      //   $.ajax({
      //     url: '/setobjectimage',
      //     data: objdata,
      //     type: 'POST',
      //     success: function (data, status, error) {
      //       console.log(data, status, error);
      //     },
      //     error: function (data, status, error) {
      //       console.log(data, status, error);
      //     }
      //   });
      // }else{
        $('.kab-create-step-two').fadeIn();
        // $('.step-inform-adres').text('Адрес: '+autoaddres);
        // $('.close-layout').fadeIn();
        var now = getTime();
        objectData.object_adres = $('#objadres').val(),
        objectData.object_coords = $("#objcoords").val(),
        objectData.object_create = now,
        objectData.object_publish = 0,
        objectData.object_show = 1,
        // object_type: $('input[name="objectType"]:checked').attr('data-title'),
        objectData.object_cover = objimagefield,
        objectData.object_city = getCookie('city_id')
        console.log(objectData);
          $('.step-inform-address').empty();
        $('.step-inform-address').html("Адрес: <span>"+objectData.object_adres+"</span>");

      // }
    }else{
      alert('Заполните поля');
    }
  });

  $('#setobjimages, .changeobjimage').change(function (e) {
    files = this.files;
    var data = new FormData();
    var btn = $(this);
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
      processData: false,
      contentType: false,
      success: function (data) {
        console.log(data);
        for (var i = 0; i < data.images.length; i++) {
          $('.add-obj-photos-items').empty();
          $('.add-obj-photos-items').append('<div class="add-obj-photos-item"><img src="/uplimage'+data.images[i].image_id+'" alt="" width=180></div>');
          objimagefield = data.images[i].image_id;
          btn.closest(".item-object-info").find("input.object-cover").val(data.images[i].image_id);
        }
        $('#setimages').val('');
        $(".close-layout").hide();
      },
      error: function (data, status, error) {
        // console.log(data, status, error);
        console.log(status);
        // if (true) {
        //
        // }
        $(".close-layout").hide();
      }
    });
  });

  $('.second-step').click(function (e) {
    e.preventDefault();
    if ($('#objname').val() != '') {
      $('.kab-create-step-two').fadeOut();//.animate({'display':'none'},500);
      $('.kab-create-step-three').fadeIn();
      $('.close-layout').fadeIn();
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



  $('#create-square, #create-price, #create-height').keyup(function () {
    var string = $(this).val();
    // $(this).val(string.replace(/[^\d(\\.|\\,)]+/g,""));
    if (/^[0-9]+(\.?|\,?)[0-9]{0,2}$/g.test(string)) {
        console.log(string);
        newText = string.replace(/\,/, ".");
        $(this).val(newText);
      }else{
        $(this).val(string.substring(0,string.length-1));
      }
    // $(this).val(string.replace(/\\,+/g,"."));
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

  function fieldsIsEmpty() {
    var meanings = $('input[name="meaning"]:checked').index() >= 0 ? true : false,
        included = $('input[name="included"]:checked').index() >= 0 ? true : false,
        advanced = $('input[name="advanced"]:checked').index() >= 0 ? true : false,
        providers = $('input[name="providers"]:checked').index() >= 0 ? true : false,
        mainPhoto = $('input[name="mainPhoto"]:checked').index() >= 0 ? true : false,
        header = $('#create-header').val() != '' ? true : false,
        description = $('#create-description').val() != '' ? true : false,
        square = $('#create-square').val() != '' ? true : false,
        price = $('#create-price').val() != '' ? true : false,
        tel = $('#create-tel').val() != '' ? true : false,
        height = $('#create-height').val() != '' ? true : false,
        result = meanings & included & advanced & providers & mainPhoto & header & square & price & tel & height & description;
        if (result) {
          return true;
        }else{
          return false;
        }
        console.log(result);
  }

  // $('.third-step.step-btn').click(function (e) {
  $('body').on('click', '.third-step.step-btn', function (e) {
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



      officeData.meanings = checkboxProcess('meaning');
      officeData.included = checkboxProcess('included');
      officeData.advanced = checkboxProcess('advanced');
      officeData.providers = checkboxProcess('providers');
      officeData.cover = checkboxProcess('mainPhoto');
      officeData.images = images;
      officeData.header = $('#create-header').val();
      officeData.description = $('#create-description').val();
      officeData.sqare =  $('#create-square').val();
      officeData.price = $('#create-price').val();
      officeData.phone = $('#create-tel').val();
      officeData.height = $('#create-height').val();
      officeData.create = now;
      officeData.object = objectData.Id;
      // console.log(officeData);

      if (officeData.description.length <= 250) {
        $('.kab-create-step-three').empty();
        $.ajax({
          url: '/addoffice',
          type: 'post',
          data: officeData,
          success: function (data) {
            console.log('success '+data);
            // $('body,html').animate({"scrollTop":0},"slow");
            $('.kab-create-step-complite').fadeIn();
            // $('.close-layout').fadeIn();
            $('.kab-create-step-three').fadeOut();
            $('input').val('');
            $('input:checkbox').removeAttr('checked');
            $('select').prop('selectedIndex',0);
          },
          error: function (data) {
            console.log('error '+data);
          }
        });
      }else{
        alert("Описание не должно превышать 250 символов");
      }

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
    // $('.close-layout').fadeIn();
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
      processData: false,
      contentType: false,
      success: function (data) {
        console.log(data);
        for (var i = 0; i < data.images.length; i++) {
          $('.add-photos-items').append('<div class="add-photos-item"><img src="/uploads/'+data.images[i].image_filename+'" alt="" width=180><div class="photos-settings"><div class="radio"><label for="mainPhoto"><input type="radio" name="mainPhoto" value="'+data.images[i].image_id+'" data-title="'+data.images[i].image_id+'">Главная</label></div><a href="#" class="deluplimage"  data-title="'+data.images[i].image_id+'">Удалить</a></div></div>');
        }
        $('#setimages').val('');
        $(".close-layout").hide();
      },
      error: function (data, status, error) {
        console.log(data, status, error);
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
