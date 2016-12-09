// alert('moder');
ymaps.ready(function () {
  $(".object-address").keyup(function () {
    $(".moder-object-address__tooltip").show();
    // $(".citys-form__submit").css("color", "red");//#2c71e7
    $(".moder_confirm").prop('disabled', true);
    var myGeocoder2 = ymaps.geocode("Россия, "+ $("#city").text() + ',' + $(this).val()),//ymaps.geocode(coords, {kind:"locality"})
    autoadres,
    autoccords;
    console.log("Россия, "+ $("#city").text() + ',' + $(this).val());
    myGeocoder2.then(
      function (res) {
        // alert(res.geoObjects.get(0).getLocalities());
        autoccords = res.geoObjects.get(0).geometry.getCoordinates();
        autoadres = res.geoObjects.get(0).properties.get('text');
        $(".moder-object-address__tooltip").text(res.geoObjects.get(0).properties.get('text'));
        $(".moder-object-address__tooltip").click(function () {
          $(".moder_confirm").prop('disabled', false);
          $(".object-address").val(autoadres);
          console.log(autoccords);
          $(this).hide();
          cityData = {
            city_name: encodeURI(autoadres),
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
    var status = $(this).find('.object-info-block.object-status');
    // console.log(objPublish);
    if (objPublish == 0) {
      // $(this).find('.object-info-block').parent().show();
      status.parent().hide();
      // console.log();
    }else{
      solution.hide();
      status.parent().show();
      if(objPublish == 1) {
        status.addClass('object-published');
        status.removeClass('object-disabled');
      }else{
        status.addClass('object-disabled');
        status.removeClass('object-published');
      };
    };
    $(this).find('.object-status .change-btn').click(function () {
      status.hide();
      solution.show();
    });
    $(this).find('.object-info-block .success-btn').click(function () {
      status.show();
      status.addClass('object-published');
      status.removeClass('object-disabled');
      solution.hide();
      // alert('confirm');
    });
    //$(this).find('.object-status .disable-btn').click(function () {
      $("#modal-object .success-btn").click(function () {
        // alert(123);
        status.show();
        status.addClass('object-disabled');
        status.removeClass('object-published');
        solution.hide();
        // $('#modal-object').hide();
      });
    //});
  });
});
