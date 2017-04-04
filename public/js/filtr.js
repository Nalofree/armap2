if($("#filter").length) {
	var squareSlider = document.getElementById('square-slider');
	var priceSlider = document.getElementById('price-slider');
	noUiSlider.create(squareSlider, {
			start: [0, 700],
			connect: true,
			step: 5,
			range: {
					'min': [0],
					'max': [700]
			}
	});
	noUiSlider.create(priceSlider, {
			start: [200, 3000],
			connect: true,
			step: 5,
			range: {
					'min': [200],
					'max': [3000]
			}
	});

	function minMaxPrice(minarea, maxarea, minprice, maxprice) {
		var minmax = [0,0];
		minmax[0] = parseInt(minarea) * parseInt(minprice);
		minmax[1] = parseInt(maxarea) * parseInt(maxprice);
		// return minmax;
		$(".price-desc .min-price").text(minmax[0]+'p');
		$(".price-desc .max-price").text(minmax[1]+'p');
	}

	squareSlider.noUiSlider.on('update', function(){
		var priceCaptionArr = priceSlider.noUiSlider.get();
		var squareCaptionArr = squareSlider.noUiSlider.get();
		minMaxPrice(squareCaptionArr[0],squareCaptionArr[1],priceCaptionArr[0],priceCaptionArr[1]);
		$(".filter-object-square input.min").val(parseInt(squareCaptionArr[0])+'м');
		$(".filter-object-square input.max").val(parseInt(squareCaptionArr[1])+'м');
	});

	priceSlider.noUiSlider.on('update', function(){
		var priceCaptionArr = priceSlider.noUiSlider.get();
		var squareCaptionArr = squareSlider.noUiSlider.get();
		minMaxPrice(squareCaptionArr[0],squareCaptionArr[1],priceCaptionArr[0],priceCaptionArr[1]);
		$(".filter-object-price input.min").val(parseInt(priceCaptionArr[0])+'р');
		$(".filter-object-price input.max").val(parseInt(priceCaptionArr[1])+'р');
	});

	var r_minPrice = +$(".filter-object-price input.min").val();
	var r_maxPrice = +$(".filter-object-price input.max").val();
	var r_minSq = +$(".filter-object-square input.min").val();
	var r_maxSq = +$(".filter-object-square input.max").val();

	$(".filter-object-square input,.filter-object-price input").focus(function () {
		$(this).attr('data-value',$(this).val());
		$(this).val('');
	});

	$(".filter-object-square input,.filter-object-price input").blur(function () {
		if($(this).val() == '') {
			$(this).val($(this).attr('data-value'));
		}
	});

	$(".filter-object-square input").change(function() {
		var minVal = parseFloat($(".filter-object-square input.min").val().replace(/\D+/g,""));
		$(".filter-object-square input.min").val(parseInt(minVal)+'м');
		var maxVal = parseFloat($(".filter-object-square input.max").val().replace(/\D+/g,""));
		$(".filter-object-square input.max").val(parseInt(maxVal)+'м');
		var valArr = [minVal,maxVal];
		squareSlider.noUiSlider.set(valArr);
	});

	$(".filter-object-price input").change(function() {
		var minVal = parseFloat($(".filter-object-price input.min").val().replace(/\D+/g,""));
		$(".filter-object-price input.min").val(parseInt(minVal)+'м');
		var maxVal = parseFloat($(".filter-object-price input.max").val().replace(/\D+/g,""));
		$(".filter-object-price input.max").val(parseInt(maxVal)+'м');
		var valArr = [minVal,maxVal];
		priceSlider.noUiSlider.set(valArr);
	});

	//Фильтр в списке помещений

	var strGET = window.location.search.replace( '?', '');
	arrGET = strGET.split('&');
	console.log(arrGET);
	var objGET = {};
	for (item of arrGET) {
	  objGET[item.split("=")[0]] = item.split("=")[1];
	}

	console.log(objGET);
	if(arrGET.length > 0) {
		var squareSlider = document.getElementById('square-slider');
		var priceSlider = document.getElementById('price-slider');
	  squareSlider.noUiSlider.set([parseInt(objGET.minarea),parseInt(objGET.maxarea)]);
	  priceSlider.noUiSlider.set([parseInt(objGET.minprice),parseInt(objGET.maxprice)]);

		var meanings = objGET.meanings.split(",");

		$('input[name="meanings"]').each(function () {
			var cb = $(this);
			for (meaningsid of meanings) {
				if (cb.val() == meaningsid) {
					cb.prop("checked", true);
				}
			}
		});
	}

	// $("#filter .filtr-it").click(function (e) {
	// 	e.preventDefault();
	// 	var data = {};
	// 	data.meanings=[];
	// 	data.price = [];
	// 	data.area = [];
	// 	$(".filter-object-type input[type='checkbox']:checked").each(function () {
	// 		data.meanings.push($(this).attr('data-title'));
	// 	});
	// 	data.area = squareSlider.noUiSlider.get();
	// 	for (var i = 0; i < data.area.length; i++) {
	// 		data.area[i] = parseInt(data.area[i]);
	// 	}
	// 	data.price = priceSlider.noUiSlider.get();
	// 	for (var i = 0; i < data.price.length; i++) {
	// 		data.price[i] = parseInt(data.price[i]);
	// 	}
	// 	console.log(data);
	// 	$.ajax({
	// 		type: 'POST',
	// 		data: data,
	// 		//contentType: 'application/json',
	// 		url: '/filtred',
	// 		success: function(data) {
	// 			console.log('success');
	// 			console.log(data);
	// 			$('#filter-result').empty();
	// 			if (data.count > 0) {
	// 				for (var i = 0; i < data.offices.length; i++) {
	// 					var adres = decodeURI(data.offices[i].object_adres) ? decodeURI(data.objects[i].object_adres) : 'Error';
	// 					var officeItem = '<article><a href="#">\
	// 				    <div class="result-img"><img src="images/search/result-img.png"/></div>\
	// 				    <div class="result-desc">\
	// 				      <h4>'+data.offices[i].office_name+'</h4>\
	// 				      <p>'+adres+'</p>\
	// 				      <section>\
	// 				        <div class="result-price">\
	// 				          <p>Цена за м<sup>2</sup>: <br/><span>'+data.offices[i].office_subprice+' р.</span></p>\
	// 				        </div>\
	// 				        <div class="result-square">\
	// 				          <p>Площадь: <br/><span>'+data.offices[i].office_area+' м<sup>2</sup></span></p>\
	// 				        </div>\
	// 				      </section>\
	// 				    </div></a></article>';
	// 					$('#filter-result').append(officeItem);
	// 				}
	// 				if ($('#map').length) {
	// 					for (var i = 0; i < data.objects.length; i++) {
	// 						var coords=data.objects[i].object_coords.split(',');
	// 						var coordsArr = [];
	// 						coordsArr[0] = parseFloat(coords[0]);
	// 						coordsArr[1] = parseFloat(coords[1]);
	// 					}
	// 				}else{
	// 					console.log('map is false');
	// 				}
	// 			}else{
	// 				var officeItem = '<p class="lead" align=center>Нет результатов, измените параметры поиска или свяжитесь с менеджером для более точного поиска помещения</p>';
	// 				$('#filter-result').append(officeItem);
	// 			}
	// 		},
	// 		error: function(data,status,error){
	// 			console.log(data);
	// 			console.log(status);
	// 			console.log(error);
	// 		}
	// 	});
	// });

	// document.getElementById('read-button').addEventListener('click', function(){
	// 	alert( slider.noUiSlider.get() );
	// });
}else{
	//alert('no filtr');
}
