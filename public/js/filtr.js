if($("#filter").length) {
	var squareSlider = document.getElementById('square-slider');
	var priceSlider = document.getElementById('price-slider');
	noUiSlider.create(squareSlider, {
			start: [20, 300],
			connect: true,
			step: 5,
			range: {
					'min': [0],
					'max': [700]
			}
	});
	noUiSlider.create(priceSlider, {
			start: [500, 1500],
			connect: true,
			step: 5,
			range: {
					'min': [300],
					'max': [2000]
			}
	});

	squareSlider.noUiSlider.on('update', function(){
		var squareCaptionArr = squareSlider.noUiSlider.get();
		$(".filter-object-square input.min").val(parseInt(squareCaptionArr[0])+'м');
		$(".filter-object-square input.max").val(parseInt(squareCaptionArr[1])+'м');
	});

	priceSlider.noUiSlider.on('update', function(){
		var priceCaptionArr = priceSlider.noUiSlider.get();
		$(".filter-object-price input.min").val(parseInt(priceCaptionArr[0])+'р');
		$(".filter-object-price input.max").val(parseInt(priceCaptionArr[1])+'р');
	});

	$(".filter-object-square input,.filter-object-price input").focus(function () {
		$(this).val('');
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

	$("#filter .filtr-it").click(function (e) {
		e.preventDefault();
		var data = {};
		data.meanings=[];
		data.price = [];
		data.area = [];
		$(".filter-object-type input[type='checkbox']:checked").each(function () {
			data.meanings.push($(this).attr('name'));
		});
		data.area = squareSlider.noUiSlider.get();
		for (var i = 0; i < data.area.length; i++) {
			data.area[i] = parseInt(data.area[i]);
		}
		data.price = priceSlider.noUiSlider.get();
		for (var i = 0; i < data.price.length; i++) {
			data.price[i] = parseInt(data.price[i]);
		}
		console.log(data);
		$.ajax({
			type: 'POST',
			data: data,
			//contentType: 'application/json',
			url: '/filtred',
			success: function(data) {
				console.log('success');
				console.log(JSON.stringify(data));
			},
			error: function(data,status,error){
				console.log(data);
				console.log(status);
				console.log(error);
			}
		});
	});

	// document.getElementById('read-button').addEventListener('click', function(){
	// 	alert( slider.noUiSlider.get() );
	// });
}else{
	//alert('no filtr');
}
