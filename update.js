// function(instance, properties, context) {

	let isFitHeightOn = properties.bubble.fit_height();
	instance.data.minHeight = properties.bubble.min_height_css();
	if (isFitHeightOn) {
		instance.canvas[0].classList.add("fit-height");
		instance.canvas[0].style.minHeight = instance.data.minHeight;
	}
    

// }