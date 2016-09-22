$('.end-visit').click(function () {
  // $('.logout').click();
  //location.href = '/logout';
});

$('#login-form .btn-submit').click(function(e) {
  e.preventDefault();
  var email = $('#login_email').val(),
      pass = $('#login_pass').val();
  var data = {
        email: email,
        pass: pass
      }
    if (email && pass) {
      $.ajax('/login', {
        type: 'post',
        data: data,
        dataType: 'json',
        timeout: 10000,
        success: function(data) {
          if (data.status == 'success') {
            $('.modal-body').hide();
            $('.modal-footer').hide();
            $('.modal-form h4').css("color","green");
            $('.modal-form p').css("color","green");
            $('.modal-form h4').text('Успешный вход!');
            $('.modal-form p').text('Добро пожаловать');
            location.reload();
          }else{
            $('.modal-form h4').css("color","red");
            $('.modal-form p').css("color","red");
            $('.modal-form h4').text('Неверный логин или пароль!');
            $('.modal-form p').text('Повторите попытку');
          }
        },
        error  : function(data, error, status){
          console.log(data, error, status);
        }
      });
    }else{
      alert('Заполните все поля!');
    };
});
