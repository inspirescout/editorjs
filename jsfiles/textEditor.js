class TextEditor{
	constructor(container, uploader, options) {
		this.container = container;
		this.styleController = new StyleController(container);
		this.waitForInitialization = this.initialize(container, uploader, options);
		this.waitForInitialization.then(()=>{
			this.initialized = true;
		}).catch(()=>{
			this.initialized = false;
		});
	}

	async initialize(container, uploader, options){
		return new Promise((resolve, reject)=>{
			this.events = [];
			this.modules = options.modules;
	
			this.uploader = ()=>{return Promise.reject("Uploader not defined!")};
			if (typeof uploader === "function") {
				this.uploader = uploader;
			} else {
				console.error("The uploader should be a function!");
			}
	
			const loadModule = async (module)=>{
				return new Promise((resolve, reject)=>{
					if (window[`editorjs-${module}`]) {
						resolve();
					}
	
					let script = document.createElement("SCRIPT");
					script.id = module;
					script.setAttribute("src", module);
					script.setAttribute("type", "text/javascript");
	
					container.append(script);
					script.addEventListener("load", () => {
						window[`editorjs-${module}`] = true;
						resolve();
					});
	
					script.addEventListener("error", reject);
				});
			};
	
			const addTunes = (tunes) => {
				if (options.footnotes) {
					tunes.push("footnotes");
				}
	
				if (options.textVariantTune) {
					tunes.push("textVariant");
				}
				if (options.anchor) {
					tunes.push("anchorTune");
				}
	
				if (options.textAlignment) {
					tunes.push("alignmentTune");
				}

				tunes.push("changeDeleteIcon");
			};
	
	
			let loadPromises = [];
			let config = {
				autofocus: true,
				readOnly: options.read_only,
				placeholder: options.placeholder,
				inlineToolbar: true,
				data: {},
				logLevel: 'ERROR',
				tools: {
					changeDeleteIcon: ChangeToolsDeleteButtonToThrashBin,
				},
				tunes: [],
				holder: container,
				onChange: (api, event) => {
					this.trigger("change", event);
				},
				onReady: ()=>{ 
					if (options.dragAndDrop) {
						this.dragAndDrop = new DragDrop(this.editor);
					}
	
					if (options.undo) {
						this.undo = new Undo({ editor: this.editor });
					}

					this.initializeSelfEvents();

				},
				...options,
			};
			
	
			//=======Tunes=======


			if (options.nestedlist) {
				let promise = loadModule(this.modules["nestedlist"]).then(() => {
					config.tools.nestedlist = {
						class: NestedList,
						
						inlineToolbar: true,
						config: {
							defaultStyle: 'unordered'
						  },
					};
	
	
					
				});
				console.log("nestedlist");
	
				loadPromises.push(promise);
			}



			




			if (options.footnotes) {
				let promise = loadModule(this.modules["footnotes"]).then(() => {
					config.tools.footnotes = FootnotesTune;
				});
	
				loadPromises.push(promise);
			}
	
			if (options.textVariantTune) {
				let promise = loadModule(this.modules["textVariantTune"]).then(() => {
					config.tools.textVariant = TextVariantTune;
				});
				loadPromises.push(promise);
			}
	
			if (options.textAlignment) {
				let promise = loadModule(this.modules["textAlignment"]).then(() => {
					config.tools.alignmentTune = {
						class:AlignmentBlockTune,
						config:{
						  default: "left"
						},
					};
				});
				loadPromises.push(promise);
			}
	
	
			//=======Blocks========
			config.tools.paragraph = {
				inlineToolbar: true,
				tunes: [],
			};
			addTunes(config.tools.paragraph.tunes);
	
			
			if (options.ai_block) {
				config.tools.aiBlock = {
					class: AIBlock
				};
			}	
	

			if (options.alert) {
				let promise = loadModule(this.modules["alert"]).then(()=>{
					config.tools.alert = {
						class: Alert,
						tunes: [],
						inlineToolbar: true,
					};
					addTunes(config.tools.alert.tunes);
				});
				loadPromises.push(promise);
			}
	
			if (options.attaches) {
				let promise = loadModule(this.modules["attaches"]).then(()=>{
					config.tools.attaches = {
						class: AttachesTool,
						tunes: [],
						types: "*",
						config: {
							uploader:{
								uploadByFile: this.uploader,
							} 
						}
					};
				});
	
				loadPromises.push(promise);
			}
	
			if (options.button) {
				let promise = loadModule(this.modules["button"]).then(() => {
					config.tools.AnyButton = {
						class: AnyButton,
						tunes: [],
						inlineToolbar: false
					};
				});
	
				loadPromises.push(promise);
			}
	
			if (options.checklist) {
				let promise = loadModule(this.modules["checklist"]).then(() => {
					config.tools.checklist = {
						class: Checklist,
						tunes: [],
						inlineToolbar: true,
					};
	
	
					addTunes(config.tools.checklist.tunes);
				});
	
				loadPromises.push(promise);
			}
	
			if (options.columns) {
				let promise = loadModule(this.modules["columns"]).then(() => {
					config.tools.columns = {
						class : editorjsColumns,
						tunes: [],
						inlineToolbar: true
					};
	
					addTunes(config.tools.columns.tunes);
				});
	
				loadPromises.push(promise);
			}
			  
	
			if (options.delimiter) {
				let promise = loadModule(this.modules["delimiter"]).then(() => {
					config.tools.delimiter = Delimiter;
				});
	
				loadPromises.push(promise);
			}
	
			if (options.embed) {
				let promise = loadModule(this.modules["embed"]).then(() => {
					config.tools.embed = {
						class: Embed,
						config: {
							services: {
								facebook: true,
								instagram: true,
								youtube: true,
								twitter: true,
								miro: true,
								vimeo: true,
								gfycat: true,
								imgur: true,
								vine: true,
								aparat: true,
								coub: true,
								codepen: true,
								pinterest: true,
								bubble: {
									//https://s3.amazonaws.com/appforest_uf/f1669308054372x593456996061786600/database-test.mp4
									regex: /^(?:https?:\/\/|\/\/)s3.amazonaws.com\/appforest_uf\/(?<remote_id>[\d\D]+)/,
									embedUrl: "https://s3.amazonaws.com/appforest_uf/<%= remote_id %>",
									html: "<iframe height='300' scrolling='no' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'></iframe>",
									height: 300,
									width: 600
								}
							}
						}
					};
				});
	
				loadPromises.push(promise);
			}
	
			if (options.header) {
				let promise = loadModule(this.modules["header"]).then(() => {
					config.tools.header =  {
						class: Header,
						inlineToolbar: true,
						tunes: [],
						config: {
						  placeholder: 'Type...',
						  levels: [1, 2, 3, 4, 5, 6],
						  defaultLevel: 2
						}
					};
	
					addTunes(config.tools.header.tunes);
				});
	
				loadPromises.push(promise);
			}
	
			if (options.image) {
				let promise = loadModule(this.modules["image"]).then(() => {
					config.tools.image = {
						class: ImageTool,
						tunes: [],
						config: {
							uploader: {
								uploadByFile: this.uploader,
							}
						}
					};
				});
				loadPromises.push(promise);
			}
	
			if (options.list) {
				let promise = loadModule(this.modules["list"]).then(() => {
					config.tools.list = {
						class: NestedList,
						tunes: [],
						inlineToolbar: true
					};
	
					addTunes(config.tools.list.tunes);
				});
				loadPromises.push(promise);
			}
	
			if (options.quote) {
				let promise = loadModule(this.modules["quote"]).then(() => {
					config.tools.quote = {
						class: Quote,
						tunes: [],
						inlineToolbar: true,
						shortcut: 'CMD+SHIFT+O'
					};
	
					addTunes(config.tools.quote.tunes);
				});
				loadPromises.push(promise);
			}
	
			if (options.rawHTML) {
				let promise = loadModule(this.modules["rawHTML"]).then(() => {
					config.tools.raw = {
						class: RawTool,
						tunes: [],
						inlineToolbar: true,
					};
	
					addTunes(config.tools.raw.tunes);
				});
				loadPromises.push(promise);
			}
	
			if (options.table) {
				let promise = loadModule(this.modules["table"]).then(() => {
					config.tools.table = {
						class: Table,
						tunes: [],
						inlineToolbar: true,
					};
	
					addTunes(config.tools.table.tunes);
				});
				loadPromises.push(promise);
			}
	
			if (options.toggleBlock) {
				let promise = loadModule(this.modules["toggleBlock"]).then(() => {
					config.tools.toggle = {
						class: Toggle,
						inlineToolbar: true,
						tunes: []
					};
				});
				loadPromises.push(promise);
			}
	
			if (options.warning) {
				let promise = loadModule(this.modules["warning"]).then(() => {
					config.tools.warning = {
						class: Warning,
						tunes: [],
					};
	
					addTunes(config.tools.warning.tunes);
				});
				loadPromises.push(promise);
			}
	
			//======Inline tools========
			if (options.textColor) {
				let promise = loadModule(this.modules["textColor"]).then(() => {
					config.tools.ColorPicker = TextColor;
				});
				loadPromises.push(promise);
			}

			if (options.textColor) {
				let promise = loadModule(this.modules["textColorPlugin"]).then(() => {					
					config.tools.Color = {
						class: ColorPlugin,
						colorCollections: ['#EC7878','#9C27B0','#673AB7','#3F51B5','#0070FF','#03A9F4','#00BCD4','#4CAF50','#8BC34A','#CDDC39', '#FFF'],
						defaultColor: '#FF1300',
						type: 'text', 
						customPicker: true // add a button to allow selecting any colour  
					 };
					 config.tools.Marker = {
						class: ColorPlugin,
						defaultColor: '#FFBF00',
						type: 'marker',
						icon: `<svg fill="#000000" height="200px" width="200px" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M17.6,6L6.9,16.7c-0.2,0.2-0.3,0.4-0.3,0.6L6,23.9c0,0.3,0.1,0.6,0.3,0.8C6.5,24.9,6.7,25,7,25c0,0,0.1,0,0.1,0l6.6-0.6 c0.2,0,0.5-0.1,0.6-0.3L25,13.4L17.6,6z"></path> <path d="M26.4,12l1.4-1.4c1.2-1.2,1.1-3.1-0.1-4.3l-3-3c-0.6-0.6-1.3-0.9-2.2-0.9c-0.8,0-1.6,0.3-2.2,0.9L19,4.6L26.4,12z"></path> </g> <g> <path d="M28,29H4c-0.6,0-1-0.4-1-1s0.4-1,1-1h24c0.6,0,1,0.4,1,1S28.6,29,28,29z"></path> </g> </g></svg>`
					   };
				});
				loadPromises.push(promise);
			}
		
			if (options.mermaid) {
				let promise = loadModule(this.modules["mermaid"]).then(() => {
					config.tools.mermaid = {
						class: MermaidTool,
						theme: 'neutral',
					};
				});
				loadPromises.push(promise);
			}
			
			
	
			if (options.strikethrough) {
				let promise = loadModule(this.modules["strikethrough"]).then(() => {
					config.tools.strikethrough = {
						class: Strikethrough,
						shortcut: 'CMD+SHIFT+X',
					};
				});
				loadPromises.push(promise);
			}


			if (options.anchor) {
				let promise = loadModule(this.modules["anchor"]).then(() => {
					config.tools.anchorTune = {
						class: AnchorTune,
						tunes: [],
						
					};
	
					addTunes(config.tools.table.tunes);
				});
				loadPromises.push(promise);
			}

			if (options.tooltip) {
				let promise = loadModule(this.modules["tooltip"])
					.then(() => {
						config.tools.tooltip = {
							class: Tooltip,
							location: 'left',
							inlineToolbar: true,
							highlightColor: '#FFEFD5',
							underline: true,
							backgroundColor: '#154360',
							textColor: '#FDFEFE',
							shortcut: 'CMD+SHIFT+F',
							holder: 'customHolderID',
						};
						console.log("LOADED TOOLTIP");
					})
					.catch((error) => {
						console.error('Error loading tooltip module:', error);
					});
			
				promise.then(() => {
					console.log("Tooltip module resolved successfully.");
				}).catch((error) => {
					console.error('Error resolving tooltip module:', error);
				});
			
				console.log("tooltiDADAD");
				console.log(container.id);
				console.log(container);
				loadPromises.push(promise);
			}
			

			if (options.inlinetemplate) {
				let promise = loadModule(this.modules["inlinetemplate"]).then(() => {  
					config.tools.inlinetemplate = {  
					  class: EditorJSInlineTemplate.TemplateInlineTool,  
					  config: {
						buttonHTML: `
							<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512">
							<path d="M336 64h32a48 48 0 0148 48v320a48 48 0 01-48 48H144a48 48 0 01-48-48V112a48 48 0 0148-48h32" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32"/>
							<rect x="176" y="32" width="160" height="64" rx="26.13" ry="26.13" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32"/>
							</svg>
						`,
					  html: "<b>template</b>⭐",		
					  }					  				  
					};  
				   });
				   console.log("EditorJSInlineTemplate.TemplateInlineTool INITTTT");
				   loadPromises.push(promise);		
				
			}
	
			if (options.marker) {
				let promise = loadModule(this.modules["marker"]).then(() => {
					config.tools.Marker = {
						class: Marker,
						inlineToolbar: true,
						shortcut: 'CMD+SHIFT+M',
					};
				});
				loadPromises.push(promise);
			}
	
			if (options.inlineCode) {
				let promise = loadModule(this.modules["inlineCode"]).then(() => {
					config.tools.inlineCode = {
						class: InlineCode,
						inlineToolbar: true,
						shortcut: 'CMD+SHIFT+M',
					};
				});
				loadPromises.push(promise);
			}
	
			if (options.fontFamily) {
				let promise = loadModule(this.modules["fontFamily"]).then(() => {
					config.tools.fontFamily = FontFamilyTool;
				});
	
				loadPromises.push(promise);
			}
	
			if (options.underline) {
				let promise = loadModule(this.modules["underline"]).then(() => {
					config.tools.underline = Underline;
				});
				loadPromises.push(promise);
			}
	
			//=======Features==========
			if (options.undo) {
				let promise = loadModule(this.modules["undo"]);
				loadPromises.push(promise);
			}
			
	
			if (options.dragAndDrop) {
				let promise = loadModule(this.modules["dragAndDrop"]);
				loadPromises.push(promise);
			}
	
			Promise.allSettled(loadPromises).then(() => {
	
				this.editor = new EditorJS(config);
				this.editor.isReady.then(resolve);
			}).catch(reject);
		});
	}

	initializeSelfEvents(){
		let editorInputElement = this.container.getElementsByClassName("codex-editor__redactor")[0];
		let heightChangeObserver = new ResizeObserver(this.fitHeightToContent.bind(this));
		heightChangeObserver.observe(editorInputElement);

		window.document.addEventListener("keydown", (event)=>{
			let isEnter = event.key === 'Enter' || event.keyCode === 13;
			if (isEnter) {
				this.trigger("enter");
			}
		}, true);

		this.on("enter", ()=>{
			let currentIndex = this.editor.blocks.getCurrentBlockIndex();
			let currentBlock = this.getCurrentBlock();
			let lastInput = this.getLastInput();
			let isAIcommand = lastInput.includes("/ai");
			let isAiImageCommand = lastInput.includes("/image"); 
			
			if (isAIcommand) {
				let input = lastInput.split("/ai")[1];
				let text = lastInput.split("/ai")[0];
				
				setTimeout(()=>this.setBlockText(currentIndex, text), 500);
				this.trigger("ai", input);
			}

			if (isAiImageCommand) {
				let input = lastInput.split("/image")[1];
				let text = lastInput.split("/image")[0];
				setTimeout(()=>this.setBlockText(currentIndex, text), 500);
				this.trigger("ai_image", input);
			}
		});
	}

	loadAiText(text){
		if (!text) {
			console.error("Invalid text!");
			return;
		}

		text = text.split("\n");

		for(let i = 0; i < text.length; i++){
			if (!text[i]) continue;
			this.insertTextToNextBlock(text[i]);
		}
	}

	loadAiImage(imageURL){
		this.insertImageToNextBlock(imageURL);
	}
	

	load(data){
		if (!this.initialized) {
			this.waitForInitialization.then(this.load.bind(this, data));
			return;
		}

		this.editor.render(data);
	}	

	insertTextToNextBlock(text){
		let currentBlockIndex = this.editor.blocks.getCurrentBlockIndex() + 1;
		this.insertText(text, currentBlockIndex);
	}

	insertImageToNextBlock(imageURL) {
		let currentBlockIndex = this.editor.blocks.getCurrentBlockIndex() + 1;
		this.insertImage(imageURL, currentBlockIndex);
	}

	insertTextToLastLine(text){
		let lastLineIndex = this.editor.blocks.getBlocksCount() - 1;
		this.insertText(text, lastLineIndex);
	}

	insertImageToLastLine(imageURL) {
		let lastLineIndex = this.editor.blocks.getBlocksCount() - 1;
		this.insertImage(imageURL, lastLineIndex);
	}

	insertText(text, index){
		return this.insertBlock("paragraph", {"text": text}, {},  index, true)
	}

	insertImage(imageURL, index){
		return this.insertBlock("image", {"file": {"url": imageURL}}, {},  index, true);
	}

	insertBlock(type, data, config, index, focus){
		if (!this.initialized) {
			this.waitForInitialization.then(this.insertBlock.bind(this, type, data, config, index, focus));
			return;
		}

		if (typeof index !== "number") {
			index = this.editor.blocks.getBlocksCount();
		}

		return this.editor.blocks.insert(type, data, config, index, focus);
	}

	createNewBlock(){
		this.editor.blocks.insert();
	}

	getLastInput(){
		let lastBlockIndex = this.editor.blocks.getCurrentBlockIndex();
		return this.getBlockText(lastBlockIndex);
	}

	getCurrentBlock(){
		let currentBlockIndex = this.editor.blocks.getCurrentBlockIndex();
		return this.editor.blocks.getBlockByIndex(currentBlockIndex);		
	}


	getBlockText(index){
		return this.editor.blocks.getBlockByIndex(index)?.holder?.innerText;
	}

	getTextElementFromHolder(holder){
		let paragraph = holder.getElementsByClassName("ce-paragraph")[0];
		return paragraph;
	}

	save(){
		if (!this.initialized) {
			this.waitForInitialization.then(this.save.bind(this));
			return;
		}

		this.editor.save().then((save)=>{
			this.trigger("save", save);
		}).catch((error)=>{
			this.throwError(error);
		});
	}

	clear(){
		if (!this.initialized) {
			this.waitForInitialization.then(this.clear.bind(this));
			return;
		}

		this.editor.clear();
	}

	deleteBlock(index){
		this.editor.blocks.delete(index);
	}


	fitHeightToContent(){
		let codeEditor = this.container.getElementsByClassName("codex-editor__redactor")[0];
		let toolbar = this.container.querySelector(":scope > .codex-editor > .ce-toolbar");

		codeEditor.style.paddingBottom = 0;
		let height = parseInt(getComputedStyle(codeEditor).height) + 15;
		this.container.style.height = `${height}px`;
		if (toolbar) toolbar.style.top = `${height-43}px`;
	}

	setStyle(options){
		if (!this.initialized) {
			this.waitForInitialization.then(this.setStyle.bind(this, options));
			return;
		}


		let plusButtonClass = ".ce-toolbar__plus";
		let tunesButtonClass = ".ce-toolbar__settings-btn";
		let plusButtonStyle = {};
		let tunesButtonStyle = {};

		if (options.add_button_color) plusButtonStyle["color"] = options.add_button_color;
		if (options.add_button_background_color) plusButtonStyle["background-color"] = options.add_button_background_color;

		this.styleController.changeCSS(plusButtonClass, plusButtonStyle);

		if (options.tune_button_color) tunesButtonStyle["color"] = options.tune_button_color;
		if (options.tune_button_background_color) tunesButtonStyle["background-color"] = options.tune_button_background_color;

		this.styleController.changeCSS(tunesButtonClass, tunesButtonStyle);

		if (options.add_button_hover_color) {
			this.styleController.changeCSS(plusButtonClass + ":hover", {
				"background-color": options.add_button_hover_color
			});
		}

		if (options.tune_button_hover_color) {
			this.styleController.changeCSS(tunesButtonClass + ":hover", {
				"background-color": options.tune_button_hover_color
			});
		}

		this.styleController.applyCSS();
	}

	setBlockText(index, text){
		let block = this.editor.blocks.getBlockByIndex(index);
		let blockId = block.id;
		this.editor.blocks.update(blockId, {"text": text});
	}

	setBlockData(index, data){
		let block = this.editor.blocks.getBlockByIndex(index);
		let blockId = block.id;

		editor.editor.blocks.getBlockByIndex(index).save().then((block)=>{
			data = Object.assign(block.data, data);
			this.editor.blocks.update(blockId, data);
		});
	}

	on(name, callback){
		if (!Array.isArray(this.events[name])) {
			this.events[name] = [];
		}

		this.events[name].push(callback);
	}

	throwError(error){
		console.error(error);
		this.trigger("error", error);
	}

	trigger(name, data){
		if (!this.events[name]) return;

		if (!Array.isArray(data)) {
			data = [data];
		}

		for (let i = 0; i < this.events[name].length; i++) {
			let callback = this.events[name][i];
			if (typeof callback !== "function") continue;
			callback(...data);	
		}
	}	
}


class ChangeToolsDeleteButtonToThrashBin {
	constructor({ api }) {
		this.api = api;
	}

	render(){
		let wrapper = this.api.ui.nodes.wrapper;

		ElementUtils.waitTillElementExists(wrapper, ":scope > .ce-toolbar .ce-settings__button--delete").then((deleteButton)=>{
			deleteButton.innerHTML = "";
			deleteButton.classList.add("fa");
			deleteButton.style.color = "black";
			deleteButton.style.fontSize = "20px";
			deleteButton.style.lineHeight = "32px";
			deleteButton.style.textAlignment = "center";
		}).catch(()=>{});



		const button = document.createElement('DIV');
		button.style.display = "none";
		return button; 
	}

	static get isTune() {
		return true;
	}
}



class TemplateInlineTool {
	constructor({ api, config }) {
		this.api = api;
		this.config = config || {
			buttonHTML: `
				<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512">
				  <path d="M336 64h32a48 48 0 0148 48v320a48 48 0 01-48 48H144a48 48 0 01-48-48V112a48 48 0 0148-48h32" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32"/>
				  <rect x="176" y="32" width="160" height="64" rx="26.13" ry="26.13" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32"/>
				</svg>
			`,
			html: "<b>template</b>⭐",
		};
	}

	render() {
		let wrapper = this.api.ui.nodes.wrapper;

		ElementUtils.waitTillElementExists(wrapper, ":scope > .ce-toolbar .ce-settings__button--delete").then((templateButton) => {
			templateButton.innerHTML = this.config.buttonHTML;
			templateButton.classList.add("fa");
			templateButton.style.color = "black";
			templateButton.style.fontSize = "20px";
			templateButton.style.lineHeight = "32px";
			templateButton.style.textAlignment = "center";
		}).catch(()=>{});

		const button = document.createElement('DIV');
		button.style.display = "none";
		return button; 
	}

	static get isTune() {
		return true;
	}
}









class AIBlock{
	constructor({ data, api, config, readOnly, block }) {
		this.block = block;
		this.data = data;

		this.container = document.createElement("DIV");
		this.prefix = document.createElement("DIV");
		this.input = document.createElement('DIV');
		this.input.textContent = data?.text;

		this.prefix.innerHTML = "/ai ";
		this.input.contentEditable = true;
		this.input.style.minWidth = "100px";
		this.input.style.textAlign = "left";
		this.input.style.marginLeft = "5px";

		this.input.contentEditable = !readOnly;
		
		this.container.className = "ce-ai-paragraph";
		this.container.append(this.prefix);
		this.container.append(this.input);
	}
		
	render(){
		return this.container;
	}

	save (){
		return { text: this.input.textContent };
	}

	static get isReadOnlySupported() {
		return true;
	}

	static get toolbox() {
		return {
			title: 'Ai tool',
			icon: "<i class='my-tool-icon'>AI</i>"
		};
	}
}

class ConvertStringToEditorJsSavePackage{

	isOrderedList(){}
	isUnorderedList(){}
	isList(){}
	isQuote(){}

}

class BubbleUtils {
	static loadAllBubbleList(list) {
		if (BubbleUtils.isBubbleListNull(list)) return [];
		return BubbleUtils.loadBubbleList(list, 0, list.length());
	}

	static loadBubbleList(list, start, length) {
		return list.get(start, length);
	}

	static isBubbleOptionSetList(list) {
		if (!Array.isArray(list)) return false;
		if (BubbleUtils.isPrimitive(list) || BubbleUtils.isBubbleListNull(list)) return false;
		return BubbleUtils.isBubbleOptionSet(list[0]);
	}

	static isBubbleListPrimitive(list) {
		if (BubbleUtils.isBubbleListNull(list)) return false;
		return BubbleUtils.isPrimitive(list[0]);
	}

	static isBubbleListNull(list) {
		let isNull = !BubbleUtils.isNotNull(list);
		try {
			list.length();
		} catch (err) {
			if (err.message == "e.length is not a function") isNull = true;
		}
		return isNull;
	}

	static isBubbleDatatype(value) {
		if (!value) return false;
		if (typeof value.get !== "function") return false;
		return !BubbleUtils.isBubbleOptionSet(value);
	}

	static isBubbleOptionSet(value) {
		if (!value) return false;
		if (typeof value.get !== "function") return false;

		let isOptionSet = false;
		try {
			value.get("_id");
		} catch (err) {
			isOptionSet = true;
		}
		return isOptionSet;
	}

	static isPrimitive(value) {
		return (typeof value !== "object");
	}

	static isNotNull(value) {
		return value != null && value != undefined
	}
}
class FileUtils{
	static convertToBase64(file){
		return new Promise((resolve, reject)=>{
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function () {
				resolve(reader.result);
			};
			reader.onerror = function (error) {
				reject(error);
			};
		});
	}

	static async convertImageURLToFile(imageURL){
		return new Promise((resolve, reject)=>{
			FileUtils.convertImageToBase64(imageURL).then((dataurl)=>{
				let file = new File([dataurl],`image.png`, { lastModified: new Date().getTime(), type: blob.type });
				resolve(file);
			}).catch(reject);
		});
	}

	static async convertImageToBase64(imageURL){
		return new Promise((resolve, reject) => {
			FileUtils.createImage(imageURL).then((image)=>{
				let canvas = document.createElement("CANVAS");
				canvas.width = image.width;
				canvas.height = image.height;
				let context = canvas.getContext("2d");
				context.drawImage(image);
				resolve(canvas.toDataURL("image/png"));
			}).catch(reject);
		});
	}

	static async createImage(imageURL){
		return new Promise((resolve, reject)=>{
			let image = new Image();
			image.crossOrigin = 'anonymous';
			image.onload = resolve;
			image.onerror = reject;
			image.src = imageURL;
		});
	}

	static async fetchURlAsBlob(imageURL){
		return new Promise((resolve, reject)=>{
			fetch(imageURL, {mode: "cors"}).then((data)=>{
				data.blob().then(resolve).catch(reject);
			}).catch(reject);
		});
	}
}
class ElementUtils{
	static async waitTillElementIsVisible(element) {
		return new Promise((resolve, reject) => {
			if (!(element instanceof Element)) {
				reject("Invalid element");
			}
	
			let interval = setInterval(() => {
				let style = getComputedStyle(element);
				if (style.display !== "none" && style.visibility !== "hidden") {
					clearInterval(interval);
					resolve();
				}
			}, 50);
	
			setTimeout(() => {
				clearInterval(interval);
				reject("Timeout");
			}, 3000);
		});
	}
	
	static async waitTillElementExists(target, selector) {
		return new Promise((resolve, reject) => {
			let interval = setInterval(() => {
				if (ElementUtils.doesElementExists(target, selector)) {
					clearInterval(interval);
					resolve(target.querySelector(selector));
				}
			}, 50);
	
			setTimeout(() => {
				clearInterval(interval);
				reject("Timeout");
			}, 3000);
		});
	}

	static doesElementExists(target, selector) {
		let element = target.querySelector(selector);
		return !!element;
	}
	
	static isElement(target){
		return target instanceof Element;
	}
}