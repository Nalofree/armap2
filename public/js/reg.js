function fieldValidation() {
  // допишу потом
}

$("#login-register .btn-submit").click(function (e) {
  e.preventDefault();
  if ($("#reg_firstname").val() && $("#reg_lastname").val() && $("#reg_email").val() && $("#reg_pass").val() ) {
    var firstname = $("#reg_firstname").val(),
        lastname = $("#reg_lastname").val(),
        pass = $("#reg_pass").val(),
        email = $("#reg_email").val();
    var formValid = false;
    if (firstname.length > 30 || !(/^[А-ЯA-Z]([А-ЯA-Z])+[А-ЯA-Z]$/igm.test(firstname))) {
      $("#reg_firstname").val('');
      $("#reg_firstname").css("border-color","red");
      $("#reg_firstname").focus(function () {
        $(this).css("border-color","#e2e2e2");
      });
      formValid = false;
    }else{
      formValid = true;
    };
    if (lastname.length > 30 || !(/^[А-ЯA-Z]([А-ЯA-Z])+[А-ЯA-Z]$/igm.test(lastname))) {
      $("#reg_lastname").val('');
      $("#reg_lastname").css("border-color","red");
      $("#reg_lastname").focus(function () {
        $(this).css("border-color","#e2e2e2");
      });
      formValid = false;
    }else{
      formValid = true;
    };
    if (email.length > 60 || !(/\S+@\S+\.\S+/igm.test(email))) {
      $("#reg_email").val('');
      $("#reg_email").css("border-color","red");
      $("#reg_email").focus(function () {
        $(this).css("border-color","#e2e2e2");
      });
      formValid = false;
    }else{
      formValid = true;
    };
    if ((pass.length > 60 || pass.length < 8) || !(/^[A-Za-z0-9][A-Za-z0-9]+[A-Za-z0-9]$/igm.test(pass))) {
      $("#reg_pass").val('');
      $("#reg_pass").css("border-color","red");
      $("#reg_pass").focus(function () {
        $(this).css("border-color","#e2e2e2");
      });
      formValid = false;
    }else{
      formValid = true;
    };
    //alert('ok!');
    if (formValid) {
      //$('#login-register').submit();
      var data = {
        firstname: firstname,
        lastname: lastname,
        pass: pass,
        email: email
      }
      $.ajax('/register', {
        type: 'post',
        data: data,
        dataType: 'json',
        timeout: 10000,
        success: function(data) {
          if (data.status == 'success') {
            $('.modal-form').hide();
            $('.modal-thanks').show();
            console.log(data);
          }else{
            $('.modal-form').hide();
            $('.modal-regerror h4').text('Такая почта уже используется');
            $('.modal-regerror p').text('Возможно вы уже зарегистрированы');
            $('.modal-regerror').show();
            console.log(data);
          }

        },
        error  : function(data, error, status){
          console.log(data, error, status);
        }
      });
    }
  }else{
    alert('Заполните все поля!');
  }
});
