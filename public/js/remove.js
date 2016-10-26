$(document).ready(function () {
  $('.del-obj').click(function (e) {
    e.preventDefault();
    var delObjId = $(this).attr('data-title'),
        button = $(this),
        data = {object_id: delObjId};
    $.ajax({
      type: 'POST',
      data: data,
      url: '/delobj',
      success: function (data) {
        console.log('success');
        console.log(data);
        button.closest(".kab-item").fadeOut();
      },
      error: function (data,error,status) {
        console.log('error');
        console.log(data,error,status);
      }
    });
  });
  $('.del-ofc').click(function (e) {
    e.preventDefault();
    var delOfcId = $(this).attr('data-title'),
        button = $(this),
        data = {office_id: delOfcId};
    $.ajax({
      type: 'POST',
      data: data,
      url: '/delofc',
      success: function (data) {
        console.log('success');
        console.log(data);
        button.closest("tr").fadeOut();
      },
      error: function (data,error,status) {
        console.log('error');
        console.log(data,error,status);
      }
    });
  });
});
