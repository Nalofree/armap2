$(document).ready(function () {
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
  var bmarksString = getCookie('bmarks'),
      bmarksArray = (bmarksString.length > 0) ? bmarksString.split(',') : [];
  $("#main-menu ul li a span.active").text(bmarksArray.length);

  // removeCookie('bmarks');
  // console.log(getCookie('bmarks'));

  var trigger = $(".bookmark-trigger"),
      currentOfficeId = $(".bookmark-trigger").attr('data-title');

  isAdded(trigger,currentOfficeId);

  function isAdded(trigger,currentOfficeId) {
    var bmarksString = getCookie('bmarks');
        bmarksArray = (bmarksString.length > 0) ? bmarksString.split(',') : [];
    // console.log(bmarksArray.length);
    if (bmarksArray.length) {
      if (bmarksArray.indexOf(currentOfficeId) >= 0) {
        trigger.text('Удалить из закладок');
        // console.log(getCookie('bmarks'));
        $("#main-menu ul li a span.active").text(bmarksArray.length);
        return true;
      }else{
        trigger.text('Добавить в закладки');
        // console.log(getCookie('bmarks'));
        $("#main-menu ul li a span.active").text(bmarksArray.length);
        return false;
      };
    }else{
      trigger.text('Добавить в закладки');
      // console.log(getCookie('bmarks'));
      $("#main-menu ul li a span.active").text(bmarksArray.length);
      return false;
    };
  };

  trigger.click(function () {
    if (isAdded(trigger,currentOfficeId) != false) {
      var bmarksString = getCookie('bmarks');
          bmarksArray = (bmarksString.length > 0) ? bmarksString.split(',') : [];
      currentOfficeIdIndex = bmarksArray.indexOf(currentOfficeId);
      bmarksArray.splice(currentOfficeIdIndex,1);
      setCookie('bmarks', bmarksArray.join(','), 30);
      isAdded(trigger,currentOfficeId);
    }else{
      var bmarksString = getCookie('bmarks');
          bmarksArray = (bmarksString.length > 0) ? bmarksString.split(',') : [];
      bmarksArray.push(currentOfficeId);
      setCookie('bmarks', bmarksArray.join(','), 30);
      isAdded(trigger,currentOfficeId);
    };
    console.log(getCookie('bmarks'));
  });

  $('.bm-delete').click(function (e) {
    e.preventDefault();
    $(this).parent().hide();
    var bmarksString = getCookie('bmarks');
        bmarksArray = (bmarksString.length > 0) ? bmarksString.split(',') : [];
        currentOfficeId = $(this).attr('data-title');
    currentOfficeIdIndex = bmarksArray.indexOf(currentOfficeId);
    bmarksArray.splice(currentOfficeIdIndex,1);
    setCookie('bmarks', bmarksArray.join(','), 30);
    isAdded(trigger,currentOfficeId);
  })
});
