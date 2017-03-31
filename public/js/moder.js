

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
          $("input.object-coords").val(autoccords.join(","));
          console.log(autoccords);
          $(this).hide();
          var cityData = {
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


  $(".moder-object_confirm").click(function (e) {
    e.preventDefault();
    var btn = $(this);
    var objData = {
      objectid: $(this).attr("data-title"),
      objectname: $(this).closest(".item-object-info").find(".object-name").val(),
      objecttype: $(this).closest(".item-object-info").find(".object-type").val(),
      objectadres: $(this).closest(".item-object-info").find(".object-address").val(),
      objectcoords: $(this).closest(".item-object-info").find(".object-coords").val() ? $(this).closest(".item-object-info").find(".object-coords").val() : null,
      objectcover: $(this).closest(".item-object-info").find("input.object-cover").val() ? $(this).closest(".item-object-info").find("input.object-cover").val() : null
    };
    console.log(objData);
    $(".close-layout").fadeIn();
    $.ajax({
      url: '/confirmobject',
      type: "POST",
      data: objData,
      success: function ( data, status, error ) {
        console.log( data, status, error );
        btn.closest(".item-object-info").fadeOut(function () {
          $(this).next(".item-object-info").fadeIn();
          $(this).next(".item-object-info").find('.object-info-block').removeClass("object-disabled");
          $(this).next(".item-object-info").find('.object-info-block').addClass("object-published");
          $(this).closest(".item-object-more").find('.object-status-note').text("Подтвержден");
        });
        btn.closest(".item-object-more").prev(".item-desc").find(".status.new").removeClass("orange-text");
        btn.closest(".item-object-more").prev(".item-desc").find(".status.new").removeClass("red-text");
        btn.closest(".item-object-more").prev(".item-desc").find(".status.new").text("Подтвержден");
        btn.closest(".mod-object-list-item").find(".object-info-img img").attr("src","/uplimage"+data.objinfo.objectcover).text("Подтвержден");
        $(".mod-object-list-item").find(".add-obj-photos-items").empty();
        $(".mod-object-list-item").find(".changeobjimage").val(null);
        //changeobjimage
        btn.closest(".item-object-info").find("input.object-cover").val();
        // object-info-img
        $(".close-layout").fadeOut();
      },
      error: function ( data, status, error ) {
        console.log( data, status, error );
        $(".close-layout").fadeOut();
      },
    });
  });

  $(".moder-object_unconfirm").click(function (e) {
    e.preventDefault();
    var objectid = $(this).attr("data-title");
    var objectname = $(this).closest(".item-object-info").find(".object-name").val();
    $("#modal-object .modal-header p").text(objectname); //mobal-btns
    $("#modal-object .mobal-btns .success-btn").attr("data-title", objectid);
    $("#modal-object .modal-comment textarea").val('');
  });

  $("#modal-object .mobal-btns .success-btn").click(function (e) {
    e.preventDefault();
    var disableObjData = {};
    disableObjData.comment = "";
    disableObjData.objectid = $(this).attr("data-title");
    disableObjData.reasons = [];
    $("#modal-object .modal-cause input[type='checkbox']").each(function () {
      disableObjData.reasons.push($(this).val());
    });//.val()
    if ($("#modal-object .modal-comment textarea").val()) {
      // alert($("#modal-object .modal-comment textarea").val());
      disableObjData.comment = $("#modal-object .modal-comment textarea").val();
      // console.log(disableObjData);
      $.ajax({
        url: '/unconfirmobject',
        type: "POST",
        data: disableObjData,
        success: function ( data, status, error ) {
          console.log( data, status, error );
          $("#modal-object").modal('hide');
          $(".moder-object_confirm[data-title="+disableObjData.objectid+"]").closest(".item-object-more").prev(".item-desc").find(".status.new").removeClass("orange-text");
          $(".moder-object_confirm[data-title="+disableObjData.objectid+"]").closest(".item-object-more").prev(".item-desc").find(".status.new").addClass("red-text");
          $(".moder-object_confirm[data-title="+disableObjData.objectid+"]").closest(".item-object-more").prev(".item-desc").find(".status.new").text("Отклонён");
          $(".moder-object_confirm[data-title="+disableObjData.objectid+"]").closest(".item-object-info").fadeOut(function () {
            $(this).next(".item-object-info").fadeIn();
            $(this).next(".item-object-info").find('.object-info-block').addClass("object-disabled");
            $(this).next(".item-object-info").find('.object-info-block').removeClass("object-published");
            $(this).closest(".item-object-more").find('.object-status-note').text("Отклонён");
          });
          $(".moder-object_confirm[data-title="+disableObjData.objectid+"]").closest(".item-object-more").prev(".item-desc").find(".status.new").removeClass("orange-text");
          $(".moder-object_confirm[data-title="+disableObjData.objectid+"]").closest(".item-object-more").prev(".item-desc").find(".status.new").addClass("red-text");
          $(".moder-object_confirm[data-title="+disableObjData.objectid+"]").closest(".item-object-more").prev(".item-desc").find(".status.new").text("Отклонён");
          $(".moder-object_confirm[data-title="+disableObjData.objectid+"]").closest(".item-object-info").fadeOut();
          $(".moder-object_confirm[data-title="+disableObjData.objectid+"]").closest(".item-object-more .solution-done").fadeIn();
          $(".close-layout").fadeOut();
        },
        error: function ( data, status, error ) {
          console.log( data, status, error );
          $("#modal-object").modal('hide');
        },
      });
    }else{
      alert("Комментарий обязателен!");
    }
  });

  $(".change-solution-btn").click(function (e) {
    e.preventDefault();
    $(this).closest(".item-object-info.done-solution").fadeOut(function () {
      $(this).prev(".item-object-info.change-solution").fadeIn();
    });
  });

  $('#room-square, #room-price, #room-height').keyup(function () {
    var string = $(this).val();
    // $(this).val(string.replace(/[^\d(\\.|\\,)]+/g,""));
    if (/^[0-9]+(\.?|\,?)[0-9]{0,2}$/g.test(string)) {
      console.log(string);
      newText = string.replace(/\,/, ".");
      $(this).val(newText);
    }else{
      $(this).val(string.substring(0,string.length-1));
    }
  });

  //.unconfirmofcphoto-show
  var ucimgs;

  $(".unconfirmofcphoto-show").click(function () {
    // $()
    var ofcid = $(this).attr("data-title");
    // var oficename = $(this).closest(".item-room-more").find("#room-name").val();
    $("#modal-photo .unconfirmofcphoto").attr("data-title", ofcid);
    // $("#modal-rooms .modal-header p").text("Помещение - "+oficename);

    var btn = $(this);
    ucimgs = [];
    btn.closest(".item-room-block-three").find(".item-three-images .image input[type='checkbox']:checked").each(function () {
      ucimgs.push($(this).closest(".image").find("img").attr("src"));
    });
    console.log(ucimgs);
  });

  //.unconfirmofcphoto

  $(".unconfirmofcphoto").click(function () {
    // var btn = $(this);
    // e.preventDefault();
    var ofcId = $(this).attr('data-title');
    var btn = $(this);
    var comment = $("#modal-photo .modal-comment textarea").val();
    var reasons = [];

    $("#modal-photo .modal-cause input[type='checkbox']:checked").each(function () {
      reasons.push($(this).val());
    });

    console.log(reasons, comment);

    if ($("#modal-photo .modal-comment textarea").val()) {
      $(".close-layout").show();

      $.ajax({
        type: 'POST',
        data: {office_id: ofcId, reasons: reasons, comment: comment, ucimgs: ucimgs},
        url: '/unconfirmofcphoto',
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
    }else{
      alert("Комментарий обязателен!");
    }
  });


  $(".unconfirmoffice-show").click(function () {
    var ofcid = $(this).attr("data-title");
    var oficename = $(this).closest(".item-room-more").find("#room-name").val();
    $("#modal-rooms .unconfirmoffice").attr("data-title", ofcid);
    $("#modal-rooms .modal-header p").text("Помещение - "+oficename);
    // alert(oficename);
  });

  $(".refuseoffice ").click(function (e) {
    e.preventDefault();
    var ofcId = $(this).attr('data-title');
    var btn = $(this);
    $(".close-layout").show();
    $.ajax({
      type: 'POST',
      data: {office_id: ofcId},
      url: '/refuseoffice',
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

  $(".unconfirmoffice").click(function (e) {
    e.preventDefault();
    var ofcId = $(this).attr('data-title');
    var btn = $(this);
    var comment = $("#modal-rooms .modal-comment textarea").val();
    var reasons = [];

    $("#modal-rooms .modal-cause input[type='checkbox']:checked").each(function () {
      reasons.push($(this).val());
    });

    console.log(reasons, comment);

    if ($("#modal-rooms .modal-comment textarea").val()) {
      $(".close-layout").show();

      $.ajax({
        type: 'POST',
        data: {office_id: ofcId, reasons: reasons, comment: comment},
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
    }else{
      alert("Комментарий обязателен!");
    }
  });

  $(".confirmoffice").click(function (e) {
    e.preventDefault();
    var ofcId = $(this).attr('data-title');
    var btn = $(this);
    var officename = btn.closest(".item-room-more").find("#room-name").val();
    var officetel = btn.closest(".item-room-more").find("#room-tel").val();
    var officeprice = btn.closest(".item-room-more").find("#room-price").val();
    var officesquare = btn.closest(".item-room-more").find("#room-square").val();
    var officeheight = btn.closest(".item-room-more").find("#room-height").val();
    $(".close-layout").show();
    $.ajax({
      type: 'POST',
      data: {
        office_id: ofcId,
        officename: officename,
        officetel: officetel,
        officeprice: officeprice,
        officesquare: officesquare,
        officeheight: officeheight
      },
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
        btn.closest(".item-room").find(".show-room-info").text('Просмотр');
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


// $('.myclass').attr('style', '');

// $("show-object-info") open

// $(".item-object-more").each(function () {
//   var objPublish = $(this).attr('data-title');
//   var solution = $(this).find('.item-object-info.change-solution');
//   var objstatus = $(this).find('.object-status');
//   if (objPublish == 0) {
//     objstatus.parent().hide();
//   }else{
//     solution.hide();
//     objstatus.parent().show();
//     if(objPublish == 1) {
//       objstatus.addClass('object-published');
//       objstatus.removeClass('object-disabled');
//     }else{
//       objstatus.addClass('object-disabled');
//       objstatus.removeClass('object-published');
//     };
//   };
//   $(this).find('.object-status .change-btn').click(function () {
//     var objId = $(this).attr('data-title');
//     console.log(objId);
//     $(".close-layout").show();
//     $.ajax({
//       type: 'POST',
//       data: {object_id: objId},
//       url: '/changesolutionobject',
//       success: function (data, status, error) {
//         console.log(data, status, error);
//         objstatus.parent().hide();
//         solution.show();
//         $(".close-layout").hide();
//       },
//       error: function (data, status, error) {
//         console.log(data, status, error);
//         alert("Что-то пошло не так, попробуйте снова");
//         $(".close-layout").hide();
//       }
//     });
//   });



//   $(this).find('.object-info-block .success-btn').click(function () {
//     var objdata = {};
//     var btn = $(this);
//     objdata.objid = $(this).attr('data-title');
//     objdata.objectname = $(this).closest(".object-info-block").find("input.object-name").val();
//     objdata.objecttype = $(this).closest(".object-info-block").find("select.object-type").val();
//     objdata.objectadres = $(this).closest(".object-info-block").find("input.object-address").val();
//     objdata.objectcoords = $(this).closest(".object-info-block").find("input.object-coords").val() ? $(this).find("input.object-coords").val() : null;
//     console.log(objdata);
//     $(".close-layout").show();
//     $.ajax({
//       type: 'POST',
//       data: objdata,
//       url: '/confirmobject',
//       success: function (data, status, error) {
//         console.log(data, status, error);
//         objstatus.addClass('object-published');
//         objstatus.removeClass('object-disabled');
//         $(".object-info-name span").text("Подтвержден");
//         objstatus.parent().show();
//         solution.hide();
//         btn.closest(".item-object-more").find(".object-info-name h3").text(data.objinfo.objectname);
//         btn.closest(".item-object-more").find(".object-info-name p.objectadres").text(data.objinfo.objectadres);
//         btn.closest(".item-object-more").find(".object-info-name p.objcttype").text(data.objtypename);
//         $(".close-layout").hide();
//       },
//       error: function (data, status, error) {
//         console.log(data, status, error);
//         alert("Что-то пошло не так, попробуйте снова");
//         $(".close-layout").hide();
//       }
//     });
//   });
//
//   $("#modal-object .success-btn").click(function () {
//     var objId = $(this).attr('data-title');
//     console.log(objId);
//     $(".close-layout").show();
//     var comment = $(".modal-comment textarea").val();
//     console.log(comment);
//     $.ajax({
//       type: 'POST',
//       data: {object_id: objId},
//       url: '/unconfirmobject',
//       success: function (data, status, error) {
//         console.log(data, status, error);
//         objstatus.parent().show();
//         objstatus.addClass('object-disabled');
//         objstatus.removeClass('object-published');
//         $(".object-info-name span").text("Отклонён");
//         $(".object-info-name span").text();
//         solution.hide();
//         $(".close-layout").hide();
//       },
//       error: function (data, status, error) {
//         console.log(data, status, error);
//         alert("Что-то пошло не так, попробуйте снова");
//         $(".close-layout").hide();
//       }
//     });
//   });
// });
