// function(instance, properties, context) {


	let editor = instance.data.editor;
	if (!(editor instanceof TextEditor)) {
		console.error("The plugin is not initialized!");
		return;
	}
	let blocksAsString = BubbleUtils.loadAllBubbleList(properties.blocks);
	let blocks = [];

	for (let i = 0; i < blocksAsString.length; i++) {
		try{
			blocks.push(JSON.parse(blocksAsString[i]));
		}catch(err) {}
	}

	if (blocks.length === 0){
		editor.clear();
		return;
	}

	editor.load({ blocks: blocks });



// }