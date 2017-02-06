$(document).ready(function () {
  $('#editofcmainsubmit').click(function (e) {
    e.preventDefault();
    if ($('#editofcmain input[name="name"]').val() && $('#editofcmain select[name="object"]').val() && $('#editofcmain input[name="area"]').val() && $('#editofcmain input[name="subprice"]').val() && $('#editofcmain input[name="phone"]').val()) {
      var data = {
        name: $('#editofcmain input[name="name"]').val(),
        description: $('#editofcmain textarea[name="description"]').val(),
        object: $('#editofcmain select[name="object"]').val(),
        area: $('#editofcmain input[name="area"]').val(),
        height: $('#editofcmain input[name="height"]').val(),
        subprice: $('#editofcmain input[name="subprice"]').val(),
        totalprice: $('#editofcmain .comp-price').text(),
        phone: $('#editofcmain input[name="phone"]').val(),
      }
      var ofcid = $(this).attr('data-title');
      if (!$('#editofcmain textarea[name="description"]').val()) {
        data.description = " "
      }
      if (!$('#editofcmain input[name="height"]').val()) {
        data.description = " "
      }
      $.ajax({
        url: '/editofcmain-'+ofcid,
        data: data,
        type: 'POST',
        success: function (data, status, error) {
          console.log(data, status, error);
          // $('#editofcmain input[name="name"]').val(data.office.office_name);
          // $('#editofcmain textarea[name="description"]').val(data.office.office_description);
          // $('#editofcmain select[name="object"]').val(data.office.office_object);
          // $('#editofcmain input[name="area"]').val(data.office.office_area);
          // $('#editofcmain input[name="height"]').val(data.office.office_height);
          // $('#editofcmain input[name="subprice"]').val(data.office.office_subprice);
          // $('#editofcmain .comp-price').text(data.office.office_totalprice);
          // $('#editofcmain input[name="phone"]').val(data.office.office_phone);
          alert('Информация сохранена!');
        },
        error: function (data, status, error) {
          // console.log(data, status, error);
          alert('Что-то пошло не так, повторите попытку позже или обратитесь к администратору');
        }
      });
    }else{
      alert("Заполните обязательные поля*")
    }
    // console.log(data);
  });

  $(".setoption").click(function () {
    console.log($(this).prop('checked'));
    var ofcid = $('#editofcmainsubmit').attr('data-title');
    var data = {
      optionid:$(this).attr('data-title')
    }
    if ($(this).prop('checked')) {
      data.val = 1;
    }else{
      data.val = 0;
    }
    $.ajax({
      url: '/editofcoptions-'+ofcid,
      type: 'POST',
      data: data,
      success: function (data, status, error) {
        // console.log(data, status, error);
        // alert('Информация сохранена!');
      },
      error: function (data, status, error) {
        // console.log(data, status, error);
        alert('Что-то пошло не так, повторите попытку позже или обратитесь к администратору');
      }
    });
  });

  $(".set-images").click(function (e) {
    e.preventDefault();
    if ($("input[name='mainPhoto']:checked").val()) {
      // alert($("input[name='mainPhoto']:checked").val());
      var mainimg = $("input[name='mainPhoto']:checked").val();
      var imageids = [];
      $(".deluplimage").each(function () {
        imgid = $(this).attr('data-title');
        imageids.push(imgid);
      });
      var ofcid =  $(this).attr('data-title');
      var data = {
        ofcid: ofcid,
        imageids: imageids,
        mainimg: mainimg
      }
      console.log(data);
      $.ajax({
        url: '/setuplimage',
        data: data,
        type: 'POST',
        success: function (data, status, error) {
          console.log(data, status, error);
        },
        error: function (data, status, error) {
          console.log(data, status, error);
        }
      });
    }else{
      // alert($("input[name='mainPhoto']:checked").val());
      alert('Выберите главное фото');
    }

  });
})
