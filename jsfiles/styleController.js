class StyleController{
	constructor(canvas){
		this.elements = {};
		this.styleElement = document.createElement("style");
		canvas.append(this.styleElement);
	}

	//It changes a property or a list of properties value.
	//To change a list of properties the property field must be a object with all the properties to change.
	changeCSS(selector, property, value){
		selector = selector.split(' ').join('');

		if(!this.elements[selector]){
			this.elements[selector] = {};
		}

		if(typeof property === 'string'){
			this.elements[selector][property] = value;
		}else if(typeof property === 'object'){
			this.elements[selector] = Object.assign(this.elements[selector], property);
		}
	}

	applyCSS(){
		this.styleElement.innerHTML = this.toCSSText();
	}

	toCSSText(){
		let text = '\n';

		for(let selector in this.elements){
			text += `${selector}{\n`;
			for(let property in this.elements[selector]){
				text += `  ${property}: ${this.elements[selector][property]};\n`;
			}
			text += `}\n\n`;
		}
		return text;
	}
}