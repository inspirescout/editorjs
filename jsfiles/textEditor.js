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

			
			
			
	
			if (options.strikethrough) {
				let promise = loadModule(this.modules["strikethrough"]).then(() => {
					config.tools.strikethrough = {
						class: Strikethrough,
						shortcut: 'CMD+SHIFT+X',
					};
				});
				loadPromises.push(promise);
			}

			if (options.tooltip) {
				let promise = loadModule(this.modules["tooltip"]).then(() => {  
					config.tools.tooltip = {  
					  class: Tooltip,
					  config: {
						buttonHTML: `
						<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="14" viewBox="0 -5 21 30">
						<path fill="currentColor" stroke-width="0" d="M4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H16L12,22L8,18H4A2,2 0 0,1 2,16V4A2,2 0 0,1 4,2M4,4V16H8.83L12,19.17L15.17,16H20V4H4M6,7H18V9H6V7M6,11H16V13H6V11Z" />
					  </svg>
						`,
					  html: "<b>template</b>⭐",	
					  location: 'left',
					  highlightColor: '#FFEFD5',
					  underline: true,
					  backgroundColor: '#154360',
					  textColor: '#FDFEFE',
					  holder: container.id,	
					  }			  
		
					};  
				   }).catch((error) => {
					console.error('Error loading tooltip module:', error);
				});
				   console.log("tooltiDADAD");
				   console.log(container.id);
				   console.log(container);
				   loadPromises.push(promise);
				   console.log("tooltipcheck");
					console.log(options.tooltip);

				console.log("tooltipyolooooooo");
				
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

class Tooltip {
	static get isInline() {
	  return true;
	}
  
	get state() {
	  return this._state;
	}
  
	set state(state) {
	  this._state = state;
	  const { button } = this;
	  const { inlineToolButtonActive } = this.api.styles;
	  button.classList.toggle(inlineToolButtonActive, state);
	}
  
	
	constructor({ api, config = {} }) {
	  this.api = api;
	  console.log('Tooltip initialized CONSTRUCTOR');
	  this.config = config || {
			buttonHTML: `
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="14" viewBox="0 -5 21 30">
			<path fill="currentColor" stroke-width="0" d="M4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H16L12,22L8,18H4A2,2 0 0,1 2,16V4A2,2 0 0,1 4,2M4,4V16H8.83L12,19.17L15.17,16H20V4H4M6,7H18V9H6V7M6,11H16V13H6V11Z" />
		  </svg>		  
			`,
			html: "<b>template</b>⭐",
		};
	  this.button = null;
	  this._state = false;
	  this.spanTooltip = null;
  
	  const { location = 'bottom' } = config;
	  this.tooltipLocation = location;
	  this.highlightColor = config.highlightColor;
	  this.underline = config.underline ? config.underline : false;
	  this.backgroundColor = config.backgroundColor;
	  this.textColor = config.textColor;
	  this.editorId = config.holder ? config.holder : container;
	  this.tag = 'SPAN';
		
	  const style = document.createElement('style');
	  style.innerHTML = `
		.${this.CSS.input} {
		  border: 0;
		  border-radius: 0 0 4px 4px;
		  border-top: 1px solid rgba(201,201,204,.48);
		}
		.${this.CSS.span} {
		  padding: 3px;
		  border-radius: 6px;
		}
		.${this.CSS.underline} {
		  text-decoration: underline;
		}
		.${this.CSS.tooltip} {
		  display: inline-block;
		}
	  `;
	  document.head.appendChild(style);

	  this.CSS = {
		input: 'tooltip-tool__input',
		tooltip: 'cdx-tooltip',
		span: 'tooltip-tool__span',
		underline: 'tooltip-tool__underline',
	  };
	  this.tooltipsObserver();
	  if (this.backgroundColor || this.textColor) this.customTooltip();
	}
  
	/**
	 * Customize the tooltips style with data passed in the config object
	 * implementing a Mutation Observer in the dynamic tooltip tag.
	 */
  
	customTooltip() {
		try {
		  console.log('customTooltip CONSTRUCTOR');
		  const tooltipTag = document.querySelector('.ct');
		  const tooltipContent = document.querySelector('.ct__content');
		  const observer = new MutationObserver((mutationList) => {
			mutationList.forEach((mutation) => {
			  if (mutation.type === 'childList') {
				const content = tooltipContent.textContent;
				if (document.querySelector(`[data-tooltip="${content}"]`)) {
				  if (this.backgroundColor) this.setTooltipColor();
				  if (this.textColor) this.setTooltipTextColor();
				} else {
				  tooltipTag.classList.remove('tooltip-color');
				  tooltipContent.classList.remove('tooltip-text-color');
				}
			  }
			});
		  });
	  
		  observer.observe(tooltipContent, { childList: true });
		} catch (error) {
		  // Handle or log the error
		  console.error('Error in customTooltip:', error);
		}
	  }
	  
	  tooltipSheet() {
		try {
		  console.log('tooltipSheet');
		  const sheetsList = document.styleSheets;
		  const sheets = Object.values(sheetsList);
		  return sheets.filter((sheet) => sheet.ownerNode.id === 'editorjs-tooltip');
		} catch (error) {
		  // Handle or log the error
		  console.error('Error in tooltipSheet:', error);
		}
	  }
	  
	  tooltipCssRules(selector) {
		try {
		  console.log('tooltipCssRules');
		  const sheet = this.tooltipSheet()[0];
		  if (sheet) {
			const cssRules = Array.from(sheet.cssRules).filter((rule) => rule.selectorText === selector);
			return cssRules;
		  }
		  return [];
		} catch (error) {
		  // Handle or log the error
		  console.error('Error in tooltipCssRules:', error);
		  return [];
		}
	  }
	  
	tooltipCssRule(selector) {
		try {
		  const tooltipSheet = this.tooltipSheet();
		  const cssRules = Object.values(tooltipSheet[0].cssRules);
		  return cssRules.filter((cssRule) => cssRule.selectorText === selector);
		} catch (error) {
		  console.error(`Failed to get CSS rule for selector "${selector}":`, error);
		  // Rethrow the error if you want it to be caught higher up
		  throw error;
		}
	  }
  
	/**
	 * Set the tooltip color using the cssRules to overwrite the rules
	 */
	setTooltipColor() {
		try {
		  const tooltipTag = document.querySelector('.ct');
		  if (!tooltipTag) {
			throw new Error("Tooltip tag not found");
		  }
	  
		  const beforeTooltip = this.tooltipCssRule('.tooltip-color::before');
		  const afterTooltip = this.tooltipCssRule('.tooltip-color::after');
	  
		  if (!beforeTooltip[0] || !afterTooltip[0]) {
			throw new Error("Tooltip CSS rules not found");
		  }
	  
		  beforeTooltip[0].style.setProperty('background-color', this.backgroundColor);
		  afterTooltip[0].style.setProperty('background-color', this.backgroundColor);
		  tooltipTag.classList.add('tooltip-color');
		} catch (error) {
		  console.error("Failed to set tooltip color:", error);
		  // Rethrow the error if you want it to be caught higher up
		  throw error;
		}
	  }
  
	/**
	 * Set the tooltip text color.
	 */
	setTooltipTextColor() {
		try {
		  const textColor = this.tooltipCssRule('.tooltip-text-color');
		  const tooltipContent = document.querySelector('.ct__content');
	  
		  textColor[0].style.setProperty('color', this.textColor);
		  tooltipContent.classList.add('tooltip-text-color');
		} catch (error) {
		  console.error('An error occurred in setTooltipTextColor:', error);
		  // Handle or log the error accordingly
		}
	  }
	  
	  /**
	   * Observe if some tooltip span is inserted and create the respective tooltip
	   */
	  tooltipsObserver() {
		try {
		  const holder = document.getElementById(this.editorId);
		  const observer = new MutationObserver((mutationList) => {
			mutationList.forEach((mutation) => {
			  if (mutation.type === 'childList' && mutation.target.classList.contains('codex-editor__redactor')) {
				const spanTooltips = document.querySelectorAll('.cdx-tooltip');
	  
				spanTooltips.forEach((span) => this.createTooltip(span.dataset.tooltip, span));
			  }
			});
		  });
	  
		  observer.observe(holder, { childList: true, subtree: true });
		} catch (error) {
		  console.error('An error occurred in tooltipsObserver:', error);
		  // Handle or log the error accordingly
		}
	  }
	  
  
	/**
	 * Create the Tooltips with the Tooltip API
	 * @param {String} tooltipValue is the tooltip text
	 * @param {HTMLElement} spanTooltip is the selected text where the tooltip is created
	 */
	createTooltip(tooltipValue, spanTooltip = this.spanTooltip) {
		try {
		  if (this.spanTooltip) {
			this.spanTooltip.dataset.tooltip = tooltipValue;
			this.setBackgroundColor(this.spanTooltip);
			this.setUnderlineDecoration(this.spanTooltip);
		  } else {
			this.setBackgroundColor(spanTooltip);
			this.setUnderlineDecoration(spanTooltip);
		  }
		  const { tooltipLocation } = this;
		  this.api.tooltip.onHover(spanTooltip, tooltipValue, { placement: tooltipLocation });
		} catch (error) {
		  // Handle or log the error
		  console.error('Error in createTooltip:', error);
		}
	  }
	  
	  setBackgroundColor(spanTooltip) {
		try {
		  const tooltip = spanTooltip;
		  if (tooltip.childElementCount > 0) {
			tooltip.firstChild.classList.add(this.CSS.span);
			tooltip.firstChild.style.background = this.highlightColor;
		  } else {
			tooltip.classList.add(this.CSS.span);
			tooltip.style.background = this.highlightColor;
		  }
		} catch (error) {
		  // Handle or log the error
		  console.error('Error in setBackgroundColor:', error);
		}
	  }
	  
	  setUnderlineDecoration(spanTooltip) {
		try {
		  const tooltip = spanTooltip;
		  if (this.underline) {
			(tooltip.childElementCount > 0)
			  ? tooltip.firstChild.classList.add(this.CSS.underline)
			  : tooltip.classList.add(this.CSS.underline);
		  }
		} catch (error) {
		  // Handle or log the error
		  console.error('Error in setUnderlineDecoration:', error);
		}
	  }
	  
  
	  render() {
		try {
		  let wrapper = this.api.ui.nodes.wrapper;
	  
		  ElementUtils.waitTillElementExists(wrapper, ":scope > .ce-toolbar .ce-settings__button--delete")
			.then((tooltipButton) => {
			  tooltipButton.innerHTML = this.config.buttonHTML;
			  tooltipButton.classList.add("fa");
			  tooltipButton.style.color = "black";
			  tooltipButton.style.fontSize = "20px";
			  tooltipButton.style.lineHeight = "32px";
			  tooltipButton.style.textAlignment = "center";
			})
			.catch((error) => {
			  // Handle or log the error
			  console.error('Error in waitTillElementExists:', error);
			});
	  
		  const { inlineToolButton } = this.api.styles;
		  this.button.classList.add(inlineToolButton);
		  const button = document.createElement('DIV');
		  button.style.display = "none";
		  return button;
		} catch (error) {
		  // Handle or log the error
		  console.error('Error in render:', error);
		}
	  }
	  

	static get isTune() {
		return true;
	}



	
  
	surround(range) {
  try {
    if (this.state) {
      this.unwrap(range);
      return;
    }

    this.wrap(range);
  } catch (error) {
    console.error('Error in surround:', error);
  }
}

wrap(range) {
  try {
    const selectedText = range.extractContents();
    this.spanTooltip = document.createElement(this.tag);

    this.spanTooltip.classList.add(this.CSS.tooltip);
    this.spanTooltip.appendChild(selectedText);
    range.insertNode(this.spanTooltip);

    this.api.selection.expandToTag(this.spanTooltip);
  } catch (error) {
    console.error('Error in wrap:', error);
  }
}

unwrap(range) {
  try {
    this.spanTooltip = this.api.selection.findParentTag(this.tag, this.CSS.tooltip);
    const text = range.extractContents();

    if (this.spanTooltip) {
      this.spanTooltip.remove();
      range.insertNode(text);
    }
  } catch (error) {
    console.error('Error in unwrap:', error);
  }
}

checkState() {
  try {
    this.spanTooltip = this.api.selection.findParentTag(this.tag);
    this.state = !!this.spanTooltip;

    if (this.state) {
      this.showActions();
    } else {
      this.hideActions();
    }
  } catch (error) {
    console.error('Error in checkState:', error);
  }
}

renderActions() {
  try {
    this.spanTooltip = this.api.selection.findParentTag(this.tag);
    this.tooltipInput = document.createElement('input');
    this.tooltipInput.placeholder = 'Add a tooltip';
    this.tooltipInput.classList.add(this.api.styles.input);
    this.tooltipInput.classList.add(this.CSS.input);

    if (this.spanTooltip) {
      const tooltipStored = this.spanTooltip.dataset.tooltip;
      this.tooltipInput.value = tooltipStored;
    }

    this.tooltipInput.hidden = true;

    return this.tooltipInput;
  } catch (error) {
    console.error('Error in renderActions:', error);
    return null; // Handle the error appropriately based on your use case
  }
}

showActions() {
  try {
    this.tooltipInput.hidden = false;
    this.api.listeners.on(this.tooltipInput, 'keydown', (e) => {
      if (e.key === 'Enter') {
        const tooltipValue = this.tooltipInput.value;
        this.createTooltip(tooltipValue);
        this.closeToolbar();
      }
    }, false);
  } catch (error) {
    console.error('Error in showActions:', error);
  }
}

hideActions() {
  try {
    this.tooltipInput.hidden = true;
  } catch (error) {
    console.error('Error in hideActions:', error);
  }
}

closeToolbar() {
  try {
    const toolbar = document.querySelector('.ce-inline-toolbar--showed');
    if (toolbar) {
      toolbar.classList.remove('ce-inline-toolbar--showed');
    }
  } catch (error) {
    console.error('Error in closeToolbar:', error);
  }
}

static get sanitize() {
  try {
    return {
      span: (e) => {
        e.classList.remove('tooltip-tool__span', 'tooltip-tool__underline');
        return { class: true, 'data-tooltip': true };
      },
    };
  } catch (error) {
    console.error('Error in sanitize:', error);
    return null; // Handle the error appropriately based on your use case
  }
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