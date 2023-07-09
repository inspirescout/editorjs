// function(instance, properties, context) {



	let editor = instance.data.editor;
	if (!(editor instanceof TextEditor)) {
		console.error("The plugin is not initialized!");
		return;
	}

	editor.loadAiText(properties.text);



// }