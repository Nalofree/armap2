
ymaps.ready(function () {
  $(".object-address").keyup(function () {
    $(".moder-object-address__tooltip").show();
    $(".moder_confirm").prop('disabled', true);
    var myGeocoder2 = ymaps.geocode("Россия, "+ $("#city").text() + ',' + $(this).val()),
    autoadres,
    autoccords;
    console.log("Россия, "+ $("#city").text() + ',' + $(this).val());
    myGeocoder2.then(
      function (res) {
        autoccords = res.geoObjects.get(0).geometry.getCoordinates();
        autoadres = res.geoObjects.get(0).properties.get('text');
        $(".moder-object-address__tooltip").text(res.geoObjects.get(0).properties.get('text'));
        $(".moder-object-address__tooltip").click(function () {
          $(".moder_confirm").prop('disabled', false);
          $(".object-address").val(autoadres);
          console.log(autoccords);
          $(this).hide();
          cityData = {
            city_name: autoadres,
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

$(document).ready(function () {

  $(".moder-object_unconfirm").click(function () {
    var objData = JSON.parse($(this).attr('data-title'));
    $(".modal-header-objectname").text('( '+objData.object_name+' )');
    $("#modal-object .success-btn").attr('data-title', objData.object_id);
  });

  $(".item-object-more").each(function () {
    var objPublish = $(this).attr('data-title');
    var solution = $(this).find('.item-object-info.change-solution');
    var objstatus = $(this).find('.object-status');
    if (objPublish == 0) {
      objstatus.parent().hide();
    }else{
      solution.hide();
      objstatus.parent().show();
      if(objPublish == 1) {
        objstatus.addClass('object-published');
        objstatus.removeClass('object-disabled');
      }else{
        objstatus.addClass('object-disabled');
        objstatus.removeClass('object-published');
      };
    };
    $(this).find('.object-status .change-btn').click(function () {
      var objId = $(this).attr('data-title');
      console.log(objId);
      $(".close-layout").show();
      $.ajax({
        type: 'POST',
        data: {object_id: objId},
        url: '/changesolutionobject',
        success: function (data, status, error) {
          console.log(data, status, error);
          objstatus.parent().hide();
          solution.show();
          $(".close-layout").hide();
        },
        error: function (data, status, error) {
          console.log(data, status, error);
          alert("Что-то пошло не так, попробуйте снова");
          $(".close-layout").hide();
        }
      });
    });
    $(this).find('.object-info-block .success-btn').click(function () {
      var objId = $(this).attr('data-title');
      console.log(objId);
      $(".close-layout").show();
      $.ajax({
        type: 'POST',
        data: {object_id: objId},
        url: '/confirmobject',
        success: function (data, status, error) {
          console.log(data, status, error);
          objstatus.addClass('object-published');
          objstatus.removeClass('object-disabled');
          $(".object-info-name span").text("Подтвержден");
          objstatus.parent().show();
          solution.hide();
          $(".close-layout").hide();
        },
        error: function (data, status, error) {
          console.log(data, status, error);
          alert("Что-то пошло не так, попробуйте снова");
          $(".close-layout").hide();
        }
      });
    });
      $("#modal-object .success-btn").click(function () {
        var objId = $(this).attr('data-title');
        console.log(objId);
        $(".close-layout").show();
        var comment = $(".modal-comment textarea").val();
        console.log(comment);
        $.ajax({
          type: 'POST',
          data: {object_id: objId},
          url: '/unconfirmobject',
          success: function (data, status, error) {
            console.log(data, status, error);
            objstatus.parent().show();
            objstatus.addClass('object-disabled');
            objstatus.removeClass('object-published');
            $(".object-info-name span").text("Отклонён");
            $(".object-info-name span").text();
            solution.hide();
            $(".close-layout").hide();
          },
          error: function (data, status, error) {
            console.log(data, status, error);
            alert("Что-то пошло не так, попробуйте снова");
            $(".close-layout").hide();
          }
        });
      });
  });

  $(".unconfirmoffice").click(function (e) {
    e.preventDefault();
    var ofcId = $(this).attr('data-title');
    var btn = $(this);
    $(".close-layout").show();

    $.ajax({
      type: 'POST',
      data: {office_id: ofcId},
      url: '/unconfirmoffice',
      success: function (data, status, error) {
        btn.parent().removeClass('published');
        btn.parent().addClass('disabled');
        btn.parent().parent().find('p.status').removeClass('published');
        btn.parent().parent().find('p.status').addClass('disabled');
        btn.parent().parent().find('p.status').text('Отклонено');
        btn.closest(".item-room-more").animate({height: "hide"}, 800);
        btn.closest(".item-room-more").prev('.item-desc').removeClass('open');
        btn.closest(".item-room-more").prev('.item-desc').find(".show-room-info").removeClass('open');
        btn.closest(".item-room-more").prev('.item-desc').find(".show-room-info").text('Просмотр');
        btn.closest(".item-room-more").prev('.item-desc').find(".item-show-more").removeClass('published');
        btn.closest(".item-room-more").prev('.item-desc').find(".item-show-more").addClass('disabled');
        $(".close-layout").hide();
      },
      error: function (data, status, error) {
        console.log(data, status, error);
        alert("Что-то пошло не так, попробуйте снова");
        $(".close-layout").hide();
      }
    });
  });

  $(".confirmoffice").click(function (e) {
    e.preventDefault();
    var ofcId = $(this).attr('data-title');
    var btn = $(this);
    $(".close-layout").show();
    $.ajax({
      type: 'POST',
      data: {office_id: ofcId},
      url: '/confirmoffice',
      success: function (data, status, error) {
        btn.closest(".item-room").find(".item-show-more").addClass('published');
        btn.closest(".item-room").find(".item-show-more").removeClass('disabled');
        btn.closest(".item-room").find('p.status').addClass('published');
        btn.closest(".item-room").find('p.status').removeClass('disabled');
        btn.closest(".item-room").find('p.status').text('Опубликовано');
        btn.closest(".item-room-more").animate({height: "hide"}, 800);
        btn.closest(".item-room").find('.item-desc').removeClass('open');
        btn.closest(".item-room").find(".show-room-info").removeClass('open');
        btn.closest(".item-room").find(".show-room-info").text('Снять с публикации');
        btn.closest(".item-room").find(".item-show-more").addClass('published');
        btn.closest(".item-room").find(".item-show-more").removeClass('disabled');
        $(".close-layout").hide();
        $(".close-layout").hide();
      },
      error: function (data, status, error) {
        console.log(data, status, error);
        alert("Что-то пошло не так, попробуйте снова");
        $(".close-layout").hide();
      }
    });
  });

  $(".banuser").click(function (e) {
    e.preventDefault();
    var thisbutton = $(this);
    var data = {
      user_id: $(this).attr('data-title')
    }
    $.ajax({
      url: '/userban',
      type: 'POST',
      data: data,
      success: function (data, status, error) {
        if (data.err) {
          alert(data.err);
        }else{
          thisbutton.text(data.result);
        }
      },
      error: function (data, status, error) {
        console.log(data, status, error);
      }
    });
  });

  $(".confirmuser").click(function (e) {
    e.preventDefault();
    var thisbutton = $(this);
    var data = {
      user_id: $(this).attr('data-title')
    }
    $.ajax({
      url: '/confirmuser',
      type: 'POST',
      data: data,
      success: function (data, status, error) {
        console.log(data, status, error);
        thisbutton.text(data.result);
        console.log(data.result);
      },
      error: function (data, status, error) {
        console.log(data, status, error);
      }
    });
  });

  $(".recuveofc").click(function (e) {
    e.preventDefault();
    var ofcid = $(this).attr('data-title');
    // alert(ofcid);
    var button = $(this);
    $.ajax({
      url: '/recuveofc',
      type: 'POST',
      data: {ofcid: ofcid},
      success: function (data, status, error) {
        console.log(data, status, error);
        button.closest('.archice-item').fadeOut();
      },
      error: function (data, status, error) {
        console.log(data, status, error);
      },
    });
  });

  $(".option-list").on("click", ".refuse-option", function (e) {
    e.preventDefault();
    $(".close-layout").fadeIn();
    var optionid = $(this).attr("data-title");
    var btn = $(this);
    $.ajax({
      url: "/refuseoption",
      type: "POST",
      data: {
        optionid: optionid
      },
      success: function (data, status, error) {
        console.log(data, status, error);
        if (data.err) {
          console.log(err);
          $(".close-layout").fadeOut();
        }else{
          btn.removeClass("btn-danger");
          btn.addClass("btn-success");
          btn.removeClass("refuse-option");
          btn.addClass("confirm-option");
          btn.html("&radic;");
          $(".close-layout").fadeOut();
        }
      },
      error: function (data, status, error) {
        console.log(data, status, error);
        $(".close-layout").fadeOut();
      }
    });

  });

  $(".option-list").on("click", ".confirm-option", function (e) {
    e.preventDefault();
    $(".close-layout").fadeIn();
    var optionid = $(this).attr("data-title");
    var btn = $(this);
    $.ajax({
      url: "/confirmoption",
      type: "POST",
      data: {
        optionid: optionid
      },
      success: function (data, status, error) {
        console.log(data, status, error);
        if (data.err) {
          console.log(err);
          $(".close-layout").fadeOut();
        }else{
          btn.removeClass("btn-success");
          btn.addClass("btn-danger");
          btn.removeClass("confirm-option");
          btn.addClass("refuse-option");
          btn.html("&times;");
          $(".close-layout").fadeOut();
        }
      },
      error: function (data, status, error) {
        console.log(data, status, error);
        $(".close-layout").fadeOut();
      }
    });

  });

  $(".edit-option").click(function (e) {
    e.preventDefault();
    $(this).fadeOut("fast", function () {
      $(this).next(".edit-option-field").fadeIn("fast",function () {
        $(this).focus();
      });
    });
  });

  $(".edit-option-field").change(function (e) {
    e.preventDefault();
    $(".close-layout").fadeIn();
    var field = $(this);
    $.ajax({
      url: "editoption",
      type: "POST",
      data: {
        optionname: field.val(),
        optionid: field.attr("data-title")
      },
      success: function ( data, status, error ) {
        if (data.err) {
          $(".close-layout").fadeOut();
        }else{
          field.fadeOut("fast", function () {
            field.val(data.optionname);
            field.prev(".edit-option").text(data.optionname);
            field.prev(".edit-option").fadeIn("fast");
          });
          $(".close-layout").fadeOut();
        }
        console.log( data, status, error );
      },
      error: function ( data, status, error ) {
        console.log( data, status, error );
        $(".close-layout").fadeOut();
      }
    })

  });

  $(".edit-option-field").focusout(function (e) {
    e.preventDefault();
    $(this).fadeOut("fast", function () {
      $(this).prev(".edit-option").fadeIn("fast");
    });
  });

  $(".delete-option").click(function (e) {
    e.preventDefault();
    $(".close-layout").fadeIn();
    var btn = $(this);
    var optionid = $(this).attr("data-title");
    $.ajax({
      url: "/deleteoption",
      type: "POST",
      data: { optionid: optionid },
      success: function ( data, status, error ) {
        if (data.err) {
          $(".close-layout").fadeOut();
        }else{
          btn.closest('tr').fadeOut(function () {
            $(".close-layout").fadeOut();
          });
        };
        console.log( data, status, error );
      },
      error: function ( data, status, error ) {
        console.log( data, status, error );
        $(".close-layout").fadeOut();
      }
    });
  });

});
