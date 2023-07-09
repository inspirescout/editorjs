function(instance, properties, context) {


	let editor = instance.data.editor;
	if (editor instanceof TextEditor) {
		console.error("The plugin is already initialized!");
		return;
	}
	
	
	let uploader = async (file) => {
		return new Promise((resolve, reject) => {
			if (!instance.canUploadFile(file)) {
				reject("Can't upload that file!");
			}

			FileUtils.convertToBase64(file).then((fileAsDataURL) => {
				let type = fileAsDataURL.split("base64,")[0];
				let base64 = fileAsDataURL.split("base64,")[1];
				context.uploadContent(file.name, base64, (err, url) => {
					if (err) reject(err);
					resolve({
						success: 1,
						file: {
							url: `https:${url}`,
							title: file.name,
							extension: type
						}
					});
				});
			}).catch((err) => {
				reject(err);
			});
		});
	};


	properties.modules = {};
	properties.modules.alert = ("//f3c54e482bcb804bef006393cbbb76fd.cdn.bubble.io/f1668597914838x278379484382573100/alert.js");
	properties.modules.attaches = ("//f3c54e482bcb804bef006393cbbb76fd.cdn.bubble.io/f1668597923465x621206336847559600/attaches.js");
	properties.modules.button = ("//f3c54e482bcb804bef006393cbbb76fd.cdn.bubble.io/f1668597929244x328993324906738500/button.js");
	properties.modules.checklist = ("//meta-l.cdn.bubble.io/f1688855009318x850344855991391100/checklist.js");
	properties.modules.columns = ("//f3c54e482bcb804bef006393cbbb76fd.cdn.bubble.io/f1669117509585x875350572921032200/columns.js");
	properties.modules.delimiter = ("//f3c54e482bcb804bef006393cbbb76fd.cdn.bubble.io/f1668171627873x962839436754961000/delimiter.js");
	properties.modules.dragAndDrop = ("//f3c54e482bcb804bef006393cbbb76fd.cdn.bubble.io/f1669130358665x335126802869376560/drag-drop.js");
	properties.modules.embed = ("//f3c54e482bcb804bef006393cbbb76fd.cdn.bubble.io/f1668171640091x746839511363697000/embed.js");
	properties.modules.fontFamily = ("//f3c54e482bcb804bef006393cbbb76fd.cdn.bubble.io/f1669117523105x640208833323189500/inline-font-family-tool.js");
	properties.modules.footnotes = ("//f3c54e482bcb804bef006393cbbb76fd.cdn.bubble.io/f1669117516443x128464011019860500/footnotes.js");
	properties.modules.header = ("//f3c54e482bcb804bef006393cbbb76fd.cdn.bubble.io/f1668171646069x979858516638509900/header.js");
	properties.modules.image = ("//f3c54e482bcb804bef006393cbbb76fd.cdn.bubble.io/f1684779241588x875807758489543200/image.min.js");
	properties.modules.inlineCode = ("//f3c54e482bcb804bef006393cbbb76fd.cdn.bubble.io/f1668171659106x774391810890868700/inline-code.js");
	properties.modules.list = ("//f3c54e482bcb804bef006393cbbb76fd.cdn.bubble.io/f1668171665354x752949127292524800/list.js");
	properties.modules.marker = ("//f3c54e482bcb804bef006393cbbb76fd.cdn.bubble.io/f1669130443158x931657112708441000/marker.js");
	properties.modules.quote = ("//f3c54e482bcb804bef006393cbbb76fd.cdn.bubble.io/f1668171671453x483698339838919900/quote.js");
	properties.modules.rawHTML = ("//f3c54e482bcb804bef006393cbbb76fd.cdn.bubble.io/f1668171677220x459975258394372800/rawHTML.js");
	properties.modules.strikethrough = ("//f3c54e482bcb804bef006393cbbb76fd.cdn.bubble.io/f1669117621837x572854774943550200/strikethrough.js");
	properties.modules.table = ("//f3c54e482bcb804bef006393cbbb76fd.cdn.bubble.io/f1668171684286x466892193292434100/table.js");
	properties.modules.textAlignment = ("//f3c54e482bcb804bef006393cbbb76fd.cdn.bubble.io/f1669117628665x359767664509752500/text-alignment-blocktune.js");
	properties.modules.textColor = ("//f3c54e482bcb804bef006393cbbb76fd.cdn.bubble.io/f1669117634971x380021326229439400/text-color.js");
	properties.modules.textVariantTune = ("//f3c54e482bcb804bef006393cbbb76fd.cdn.bubble.io/f1668188199335x259038918325400480/text-variant-tune.js");
	properties.modules.toggleBlock = ("//f3c54e482bcb804bef006393cbbb76fd.cdn.bubble.io/f1668598444774x903022427184868900/toggle-block.js");
	properties.modules.underline = ("//f3c54e482bcb804bef006393cbbb76fd.cdn.bubble.io/f1669117640265x432334274924913500/underline.js");
	properties.modules.undo = ("//f3c54e482bcb804bef006393cbbb76fd.cdn.bubble.io/f1668598454100x531247675840307300/undo.js");
	properties.modules.warning = ("//f3c54e482bcb804bef006393cbbb76fd.cdn.bubble.io/f1668171697986x225559463325168060/warning.js");
	properties.modules.nestedlist = ("//meta-l.cdn.bubble.io/f1688855452272x924920363413134700/nested-list.js");
	properties.modules.tooltip = ("//meta-l.cdn.bubble.io/f1688937413279x630826343885936800/tooltip.js");
	properties.modules.inlinetemplate = ("//meta-l.cdn.bubble.io/f1688934729955x655946112458521100/inline-template.js");



	instance.canvas[0].id = `text-editor-${instance.canvas[0].classList[1]}`;
	editor = new TextEditor(instance.canvas[0], uploader, properties);

	editor.on("ai", (input)=>{
		instance.publishState("ai_input", input);
		instance.triggerEvent("ai");
	});

	editor.on("ai_image", (input)=>{
		instance.publishState("ai_input", input);
		instance.triggerEvent("ai_image");
	});

	editor.on("change", (event) => {
		instance.publishState("amount_of_blocks", editor.editor.blocks.getBlocksCount());
		instance.triggerEvent("change");
	});

	editor.on("error", (error) => {
		instance.publishState("error_message", error);
		instance.triggerEvent("error");
	});

	editor.on("save", (data) => {
		let lines = [];
		let blocks = [...data.blocks];
		for (let i = 0; i < blocks.length; i++) {
			let block = blocks[i];
			blocks[i] = JSON.stringify(block);
			let extractLine = linesExtractors[block.type];
			if (extractLine) {
				lines.push(...extractLine(block));
			}
		}

		instance.publishState("json", JSON.stringify(data));
		instance.publishState("lines_content", lines);
		instance.publishState("blocks_json", blocks);
		instance.triggerEvent("save");
	})

	instance.canvas[0].classList.add("text-editor-js");
	instance.data.editor = editor;
	window.textEditor = editor;



	const linesExtractors = {
		"paragraph": (block) => {
			let text = block?.data?.text;
			if (text) {
				return text.split("<br>");
			}

			return [];
		},
		"header": (block) => {
			return linesExtractors.paragraph(block);
		},
		"quote": (block) => {
			return linesExtractors.paragraph(block);
		},
		"list": (block) => {
			let data = block.data;
			let extractLines = (data, depth) => {
				depth = ++depth || 0;
				if (depth > 50) {
					console.warn("Stop recursion to prevent loop!");
					return [];
				}

				let lines = [];
				let items = data.items;

				for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
					let item = items[itemIndex];
					let content = `${itemIndex + 1}.${item.content}`;
					lines.push(content);

					let children = extractLines(item, depth);
					for (let childIndex = 0; childIndex < children.length; childIndex++) {
						let child = children[childIndex];
						let childContent = `${itemIndex + 1}.${child}`;
						lines.push(childContent);
					}
				}

				return lines;
			}
			
			return extractLines(data);
		},
		"checklist": (block)=>{
			let items = block?.data?.items;
			let lines = [];
			for (let i = 0; i < items.length; i++) {
				let isChecked = items[i].checked;
				let text = items[i].text;
				lines.push(`[${(isChecked)?"X":" "}] ${text}`);
			}

			return lines;
		},
		"AnyButton": (block)=>{
			return [block?.data?.link];
		},
		"attaches": (block)=>{
			return [block?.data?.file?.url];
		},
		"image": (block)=>{
			return [block?.data?.file?.url];
		},
		"raw": (block)=>{
			let html = block?.data?.html;
			if (html) {
				return html.split("\\n");
			}

			return [];
		},
		"alert": (block)=>{
			let message = block?.data?.message;
			if (message) {
				return message.split("<br>");
			}
		},
		"table": (block)=>{
			let content = block?.data?.content;
			let lines = [];
			for (let i = 0; i < content.length; i++) {
				let line = content[i];
				lines.push(line.join(","));
			}
			
			return lines;
		},
		"warning": (block)=>{
			return [block?.data?.message];
		}, 
		"delimiter": (block)=>{
			return ["---------------------------------------------------"];
		}, 
		"toggle": (block)=>{
			return ["Toggle"];
		},
		"columns": (block)=>{
			return ["Columns"];
		}, 
		"embed": (block)=>{
			return [block?.data?.source];
		}
	};


}