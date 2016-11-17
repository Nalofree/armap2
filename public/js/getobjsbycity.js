// $(document).ready(function () {
  var city;
  city = getCookie('city_name');

  function getObjInfoByCity(city) {
    var data;
    data = {
      city: encodeURI(city)
    }
    $.ajax({
      type: 'POST',
      data: data,
      url: '/objects',
      success: function (data) {
        // console.log(data);
        if (data.objects.length > 0) {
          var objCover, rooms;
          $('#obj-items').empty();
          for (var i = 0; i < data.objects.length; i++) {
            rooms = "";
            if (data.objects[i].object_offices.length > 0) {
              for (var j = 0; j < data.objects[i].object_offices.length; j++) {
                // console.log(data.objects[i].object_id+': '+data.objects[i].object_offices);
                if (j <= 1) {
                  rooms += "<a class='item-object' href='office-"+data.objects[i].object_offices[j].office_id+"'>\
                                              <div class='item-object-img'>\
                                                <img src='images/obj/"+data.objects[i].object_offices[j].image_filename+"'>\
                                              </div>\
                                              <div class='item-object-desc'>\
                                                <h4>"+decodeURI(data.objects[i].object_offices[j].office_name)+"</h4>\
                                                <p>"+decodeURI(data.objects[i].object_adres)+"</p>\
                                                <section>\
                                                  <div class='item-object-price'>\
                                                    <p> Цена за м<sup>2</sup>: </p><br />\
                                                    <span>"+data.objects[i].object_offices[j].office_subprice+" р.</span>\
                                                  </div>\
                                                  <div class='item-object-square'>\
                                                    <p> Площадь: </p><br />\
                                                    <span>"+data.objects[i].object_offices[j].office_area+" м</span>\
                                                  </div>\
                                                </section>\
                                              </div>\
                                          </a>";
                }
              }
              rooms += "<a href='/object-"+data.objects[i].object_id+"'> Все помещения</a>";
            }else{
              rooms = "";
            }
            objCover = data.objects[i].object_cover ? "images/obj/"+data.objects[i].object_cover : "images/object/1.png";

            $('#obj-items').append("<section class = 'item'>\
                                      <div class='item-img'>\
                                        <a href = '/object-"+data.objects[i].object_id+"''>\
                                          <img src='"+objCover+"''>\
                                        </a>\
                                      </div>\
                                      <section>\
                                        <div class = 'item-desc'>\
                                          <h3 class='nowrap-text'>\
                                            <a href = '/object-"+data.objects[i].object_id+"''>\
                                              "+decodeURI(data.objects[i].object_name)+"\
                                            </a>\
                                          </h3>\
                                          <p><span>"+decodeURI(data.objects[i].object_adres)+"</span></p>\
                                        </div>\
                                        <div class='item-rooms'>\
                                        "+rooms+"\
                                        </div>\
                                      </section>\
                                    </section>");
          }
        }else{
          $('#obj-items').empty();
          $('#obj-items').append("<h3>Нет объектов для вашего города</h3>");
        }
      },
      error: function (data,status,error) {
        console.log(data,status,error);
      }
    });
  };

  getObjInfoByCity(city);

  $('.citys-list__item').click(function () {
    getObjInfoByCity(city);
  });

// });
// <article class="kab-item"><section class="kab-item-info"><div class="kab-item-img"><img src="images/search/result-big.png"></div><div class="kab-item-desc"><section class="kab-item-header"><h4 class="nowrap-text">Лермонтов</h4><p class="nowrap-text"> улица Лермонтова, 90/1</p></section><section class="kab-item-change"><div class="kab-item-edit"><a href="#" data-title="14" class="del-obj">Удалить</a><span>|</span><a href="#" data-title="14" class="edit-obj">Редактировать</a></div><div class="kab-item-create"><a href="14">+ Добавить помещение</a></div></section></div><span class="rooms-show"></span></section><!-- Таблица помещений--><section class="kab-item-table" style="display: none;"><table><tbody><tr></tr><tr><td class="table-date">16.10.2016 15:31</td><td class="table-name"><a href="#" class="nowrap-text">Коворкинг</a><span class="status wait">Ожидает модерации</span></td><td class="table-time">Осталось 7 дней</td><td class="table-square">120кв. м</td><td class="table-price">36000 руб.</td><td class="table-edit"><a href="javascript: void(0);" class="table-edit-menu-show">Редактировать</a><ul class="table-edit-menu" style="display: none;"><li><a href="#">Изменить</a></li><li><a href="#">Снять с публикации</a></li><li><a href="#" data-title="56" class="del-ofc">Удалить</a></li></ul></td></tr></tbody></table></section></article>
