$(document).ready(function () {
  $("#formcallme").submit(function (e) {
    e.preventDefault();
    if ($("#formcallme input[name='name']").val() && $("#formcallme input[name='phone']").val()) {
      $("#call-me").modal('hide');
      $.ajax({
        url: "/sendmail",
        type: "POST",
        data: {
          name: $("#formcallme input[name='name']").val(),
          phone: $("#formcallme input[name='phone']").val(),
          type: "callme"
        },
        success: function (data, status, error) {
          console.log(data, status, error);
          if (data.err) {
            alert(data.err);
          }else{
            $("#formcallme input[name='name']").val('');
            $("#formcallme input[name='phone']").val('');
            alert("Ваше сообщение отправлено");
          }
        },
        error: function (data, status, error) {
          console.log(data, status, error);
          if (data.err) {
            alert(data.err);
          }else{
            alert(error);
          }
        }
      });
    }else{
      alert("Заполните все поля!")
    }
  });

  $("#footer-form").submit(function (e) {
    e.preventDefault();
    if ($("#footer-form input[name='email']").val() && $("#footer-form input[name='phone']").val()  && $("#footer-form textarea[name='message']").val()) {
      // $("#call-me").modal('hide');
      $(".close-all").fadeIn();
      $.ajax({
        url: "/sendmail",
        type: "POST",
        data: {
          email: $("#footer-form input[name='email']").val(),
          phone: $("#footer-form input[name='phone']").val(),
          message: $("#footer-form textarea[name='message']").val(),
          type: "footerform"
        },
        success: function (data, status, error) {
          console.log(data, status, error);
          if (data.err) {
            alert(data.err);
            $(".close-all").fadeOut();
          }else{
            $("#footer-form input[name='email']").val('');
            $("#footer-form input[name='phone']").val('');
            $("#footer-form textarea[name='message']").val('');
            $(".close-all").fadeOut();
            alert("Ваше сообщение отправлено");
          }
        },
        error: function (data, status, error) {
          console.log(data, status, error);
          $(".close-all").fadeOut();
          if (data.err) {
            alert(data.err);
          }else{
            alert(error);
          }
        }
      });
    }else{
      alert("Заполните все поля!")
    }
  });
});
