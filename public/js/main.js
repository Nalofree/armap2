//Работа с куки

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1);
    if (c.indexOf(name) == 0) {
      return c.substring(name.length,c.length);
    }
  }
  return "";
}

function removeCookie(cookie_name){
  var cookie_date = new Date ();
  cookie_date.setTime (cookie_date.getTime() - 1);
  document.cookie = cookie_name += "=; expires=" + cookie_date.toGMTString();
}

//Удаление контейнера из шапки, если мы на главной странице
var win = window.location.pathname,
    topLine = $('.top-line'),
    mainMenu = $('#head-main-menu');

if (win == '/' || win == '/index.html') {
    topLine.addClass('main-page');
    mainMenu.addClass('main-page');
} else {
    topLine.removeClass('main-page');
    mainMenu.removeClass('main-page');
}



//Плавный скролл к якорю у ссылок с классом href
$(document).ready(function () {
    $('a[href*=#].href').bind("click", function (e) {
        var anchor = $(this);
        $('html, body').stop().animate({
            // scrollTop: $(anchor.attr('href')).offset().top
        }, 1000);
        e.preventDefault();
    });
    return false;
});

//Слайдер в карточке товара
$('#obj-slider').sliderPro({
    width: 640,
    height: 400,
    orientation: 'vertical',
    thumbnailsPosition: 'right',
    arrows: true,
    fadeArrows: false,
    buttons: false,
    thumbnailWidth: 125,
    thumbnailHeight: 100,
    breakpoints: {
        768: {
            width: '100%',
            height: 400,
            orientation: 'horizontal',
            thumbnailsPosition: 'bottom',
            arrows: false,
            buttons: true
        },
        480: {
            width: '100%',
            height: 220,
            orientation: 'horizontal',
            thumbnailsPosition: 'bottom',
            arrows: false,
            buttons: true
        },
        350: {
            width: '100%',
            height: 190,
            orientation: 'horizontal',
            thumbnailsPosition: 'bottom',
            arrows: false,
            buttons: true
        }
    }
});

//Стили объектов
var objects = $('.block-style'),
    styleBlock = $('.item-block'),
    styleLine = $('.item-line');

styleBlock.click(function () {
    styleBlock.addClass('active');
    styleLine.removeClass('active');

    objects.removeClass('style-line').delay(300);
    objects.addClass('style-block').delay(300);
});
styleLine.click(function () {
    styleLine.addClass('active');
    styleBlock.removeClass('active');

    objects.removeClass('style-block').delay(300);
    objects.addClass('style-line').delay(300);
});

if ($(window).width() <= '768') {
    objects.removeClass('style-line').delay(300);
    objects.addClass('style-block').delay(300);
}

//Появление таблицы помещений у объекта в админке
$(".rooms-show").click(function () {
    if ($(this).hasClass("active")) {
        $(this).removeClass("active");
        $(this).parent().next(".kab-item-table").animate({height: "hide"}, 200);
        $(this).parent().parent().animate({'margin-bottom': "45px"}, 200);
    } else {
        $(this).addClass("active");
        $(this).parent().next(".kab-item-table").animate({height: "show"}, 200);
        $(this).parent().parent().animate({'margin-bottom': "90px"}, 200);
    }
});

$(".readyreg").click(function () {
  $("#header-register").modal('hide');
});

$(".regnow").click(function () {
  $("#header-login").modal('hide');
});


//Создание объекта
/*var createObject = $(".kab-create-obj");
 createObject.hide();
 $(".btn-create").click(function(){
 if (createObject.hasClass("create-obj-open")) {
 createObject.removeClass("create-obj-open");
 createObject.animate({height: "hide", margin: "0"}, 400);
 }else{
 createObject.addClass("create-obj-open");
 createObject.animate({height: "show", margin: "0 0 45px"}, 400);
 }
 });*/

//Анимация перехода страниц для скрытия смены шапки
// $(".animsition").animsition({
//     inClass: 'fade-in',
//     outClass: 'fade-out',
//     inDuration: 1500,
//     outDuration: 800,
//     linkElement: '.animsition-link',
//     loading: true,
//     loadingParentElement: 'body',
//     loadingClass: 'animsition-loading',
//     loadingInner: '',
//     timeout: false,
//     timeoutCountdown: 5000,
//     onLoadEvent: true,
//     browser: ['animation-duration', '-webkit-animation-duration'],
//     overlay: false,
//     overlayClass: 'animsition-overlay-slide',
//     overlayParentElement: 'body',
//     transition: function (url) {
//         window.location.href = url;
//     }
// });

//Мобильное меню
var mobileMenu = $(".menu-items");
mobileMenu.hide();
$('.show-menu').click(function () {
    if ($(this).hasClass('active')) {
        $(this).removeClass('active');
        mobileMenu.animate({height: "hide"}, 400);
    } else {
        $(this).addClass('active');
        mobileMenu.animate({height: "show"}, 400);
    }
});

//Мобильный фильтр на главной
var tabContent = $("#search-filter"),
    mobileTopTabs = $('.mobile-filter-show-btn');

if ($(window).width() <= '768') {
    tabContent.hide();
}

$('.show-filter').click(function () {
    mobileTopTabs.fadeOut(400);
    setTimeout(function () {
        tabContent.animate({width: "show"}, 600);
    }, 500);
});
$('.close-filter').click(function () {
    setTimeout(function () {
        mobileTopTabs.fadeIn(400);
    }, 500);
    tabContent.animate({width: "hide"}, 600);
});

$('.mobile-filter-btn a').click(function () {
    $('.filter-result-btn').removeClass('active');
    $('.filter-btn').addClass('active');
});
$('.mobile-filter-result-btn a').click(function () {
    $('.filter-result-btn').addClass('active');
    $('.filter-btn').removeClass('active');
});

//Мобильный фильтр в результатах
var filterSearch = $("#filter"),
    showSearch = $('.show-search');

if ($(window).width() <= '768') {
    filterSearch.hide();
}
showSearch.click(function () {
    if (showSearch.hasClass('active')) {
        showSearch.removeClass('active');
        showSearch.text('Показать фильтр');
        filterSearch.animate({height: "hide"}, 600)
    } else {
        showSearch.addClass('active');
        showSearch.text('Скрыть фильтр');
        filterSearch.animate({height: "show"}, 600)
    }
});

//Модерация
var modObject = $(".item-object-more"),
    showObject = $(".show-object-info");

modObject.hide();

showObject.click(function () {
    if ($(this).hasClass('open')) {
        $(this).removeClass('open');
        $(this).parent().parent().next(modObject).animate({height: "hide"}, 600);
    } else {
        $(this).addClass('open');
        $(this).parent().parent().next(modObject).animate({height: "show"}, 600);
        $('.item-object-info').attr('style', '');
    }
});

var modRoom = $(".item-room-more"),
    showRoom = $(".show-room-info");

modRoom.hide();

showRoom.click(function () {
    if ($(this).hasClass('open')) {
        $(this).removeClass('open');
        $(this).closest('.item-desc').removeClass('open');
        $(this).text('Просмотр');
        $(this).closest('.item-desc').next(modRoom).animate({height: "hide"}, 200)
    } else {
        $(this).addClass('open');
        $(this).closest('.item-desc').addClass('open');
        $(this).text('Свернуть');
        $(this).closest('.item-desc').next(modRoom).animate({height: "show"}, 200)
    }
});

//Открытие формы в мобильном футере
var footerBtn = $('.footer-form-show'),
    footerForm = $('.footer-form');

if ($(window).width() <= '768') {
    footerForm.hide();
}
footerBtn.click(function () {
    if ($(this).hasClass('active')) {
        $(this).removeClass('active');
        footerForm.animate({height: "hide"}, 400);
    } else {
        $(this).addClass('active');
        footerForm.animate({height: "show"}, 400);
    }
});

//Меню таблицы в ЛК
var tableMenuBtn = $('.table-edit-menu-show'),
    tableMenu = $('.table-edit-menu');
$('.kab-tab-panel a').click(function (e) {
  e.preventDefault();
  $(this).tab('show');
});
tableMenu.hide();
tableMenuBtn.click(function () {
    if ($(this).hasClass('active')) {
        $(this).removeClass('active');
        $(this).next(tableMenu).animate({height: "hide", padding: "0 10px"}, 200);
    } else {
        $(this).addClass('active');
        $(this).next(tableMenu).animate({height: "show", padding: "10px"}, 200);
    }
});

//Появление футера
var footerShowBtn = $('.show-footer'),
    footer = $('#footer');

// footer.hide();
footerShowBtn.click(function () {
  document.scrollTop(99999);
    // if ($(this).hasClass('active')) {
    //     $(this).removeClass('active');
    //     footer.animate({height: "hide"}, 400);
    // } else {
    //     $(this).addClass('active');
    //     footer.animate({height: "show"}, 400);
    // }
});

$(document).ready(function () {
  $(".addmeaning, .addincluded, .addadvanced, .addprovider").keyup(function (e) {
    if (e.keyCode == 13) {
      e.preventDefault();
      if ($(this).val().length >= 3) {
        // alert($(this).val());
        var name = $(this).val();
        var opttype = $(this).attr('data-title');
        var field = $(this);
        $.ajax({
          url: "/addoption",
          type: "POST",
          data: {
            name: name,
            opttype: opttype
          },
          success: function (data, status, error) {
            if (data.err) {
              alert(data.err);
            }else{
              field.parent().before('<div class="checkbox"><label><input type="checkbox" data-title="'+data.optid+'" name="'+data.opttype+'"><div>'+data.name+'</div></label></div>');
            }
            console.log(data, status, error);
          },
          error: function (data, status, error) {
            console.log(data, status, error);
          }
        })
        $(this).val('');
      }else{
        alert("Длина названия не должна быть меньше 3 символов!");
      }
    }
  });
})

$(document).ready(function () {
  $("#create-tel, #room-tel").mask("+7 (999) 999-9999");
  $(".admin-trig .panel-heading").click(function () {
    if ($(this).hasClass("show")) {
      $(this).parent('.admin-trig').find(".panel-body").hide(200);
      $(this).removeClass("show");
    }else{
      $(".admin-trig .panel-body").hide(200);
      $(".admin-trig .panel-body").removeClass("show");
      $(this).parent('.admin-trig').find(".panel-body").show(200);
      $(this).addClass("show");
    }
    // $(".admin-trig .panel-body").hide(200);

  });

  $(".kab-create-obj .close").click(function (e) {
    e.preventDefault();
    $(this).closest("section").fadeOut();
  });

});
