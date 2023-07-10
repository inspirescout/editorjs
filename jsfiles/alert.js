/**
 * Skipped minification because the original files appears to be already minified.
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.Alert=t():e.Alert=t()}(window,(function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/",n(n.s=1)}([function(e,t){e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="#000" height="18" width="18" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"></path></svg>'},function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return f}));var r=n(0),o=n.n(r);function a(e){return function(e){if(Array.isArray(e))return i(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"==typeof e)return i(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return i(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function i(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?c(Object(n),!0).forEach((function(t){u(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):c(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function u(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function d(e,t,n){return t&&l(e.prototype,t),n&&l(e,n),e}
/**
 * Alert block for the Editor.js.
 *
 * @author Vishal Telangre
 * @license MIT
 */
/*
	Alert module for editorjs.
	Github: https://github.com/vishaltelangre/editorjs-alert
	License: https://github.com/vishaltelangre/editorjs-alert/blob/master/LICENSE

*/

n(2).toString();var f=function(){function e(t){var n=t.data,r=t.config,o=t.api,a=t.readOnly;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.api=o,this.defaultType=r.defaultType||e.DEFAULT_TYPE,this.messagePlaceholder=r.messagePlaceholder||e.DEFAULT_MESSAGE_PLACEHOLDER,this.data={type:e.ALERT_TYPES.includes(n.type)?n.type:this.defaultType,message:n.message||""},this.container=void 0,this.readOnly=a}return d(e,[{key:"CSS",get:function(){return{settingsButton:this.api.styles.settingsButton,settingsButtonActive:this.api.styles.settingsButtonActive,wrapper:"cdx-alert",wrapperForType:function(e){return"cdx-alert-".concat(e)},message:"cdx-alert__message"}}}],[{key:"toolbox",get:function(){return{icon:o.a,title:"Alert"}}},{key:"enableLineBreaks",get:function(){return!0}},{key:"DEFAULT_TYPE",get:function(){return"info"}},{key:"DEFAULT_MESSAGE_PLACEHOLDER",get:function(){return"Type here..."}},{key:"ALERT_TYPES",get:function(){return["primary","secondary","info","success","warning","danger","light","dark"]}}]),d(e,[{key:"render",value:function(){var e=[this.CSS.wrapper,this.CSS.wrapperForType(this.data.type)];this.container=this._make("div",e);var t=this._make("div",[this.CSS.message],{contentEditable:!this.readOnly,innerHTML:this.data.message});return t.dataset.placeholder=this.messagePlaceholder,this.container.appendChild(t),this.container}},{key:"renderSettings",value:function(){var t=this,n=this._make("div");return e.ALERT_TYPES.forEach((function(e){var r=t._make("div",[t.CSS.settingsButton,t.CSS.wrapper,t.CSS.wrapperForType(e)],{innerHTML:"A"});t.data.type===e&&r.classList.add(t.CSS.settingsButtonActive),r.addEventListener("click",(function(){t._changeAlertType(e),n.querySelectorAll(".".concat(t.CSS.settingsButton)).forEach((function(e){return e.classList.remove(t.CSS.settingsButtonActive)})),r.classList.add(t.CSS.settingsButtonActive)})),n.appendChild(r)})),n}},{key:"_changeAlertType",value:function(t){var n=this;this.data.type=t,e.ALERT_TYPES.forEach((function(e){var r=n.CSS.wrapperForType(e);n.container.classList.remove(r),t===e&&n.container.classList.add(r)}))}},{key:"save",value:function(e){var t=e.querySelector(".".concat(this.CSS.message));return s(s({},this.data),{},{message:t.innerHTML})}},{key:"_make",value:function(e){var t,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},o=document.createElement(e);Array.isArray(n)?(t=o.classList).add.apply(t,a(n)):n&&o.classList.add(n);for(var i in r)o[i]=r[i];return o}},{key:"onPaste",value:function(e){var t=e.detail.data;this.data={type:this.defaultType,message:t.innerHTML||""}}}],[{key:"isReadOnlySupported",get:function(){return!0}},{key:"conversionConfig",get:function(){var e=this;return{export:function(e){return e.message},import:function(t){return{message:t,type:e.DEFAULT_TYPE}}}}},{key:"sanitize",get:function(){return{type:!1,message:!0}}}]),e}()},function(e,t,n){var r=n(3),o=n(4);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[e.i,o,""]]);var a={insert:"head",singleton:!1};r(o,a);e.exports=o.locals||{}},function(e,t,n){"use strict";var r,o=function(){return void 0===r&&(r=Boolean(window&&document&&document.all&&!window.atob)),r},a=function(){var e={};return function(t){if(void 0===e[t]){var n=document.querySelector(t);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}e[t]=n}return e[t]}}(),i=[];function c(e){for(var t=-1,n=0;n<i.length;n++)if(i[n].identifier===e){t=n;break}return t}function s(e,t){for(var n={},r=[],o=0;o<e.length;o++){var a=e[o],s=t.base?a[0]+t.base:a[0],u=n[s]||0,l="".concat(s," ").concat(u);n[s]=u+1;var d=c(l),f={css:a[1],media:a[2],sourceMap:a[3]};-1!==d?(i[d].references++,i[d].updater(f)):i.push({identifier:l,updater:g(f,t),references:1}),r.push(l)}return r}function u(e){var t=document.createElement("style"),r=e.attributes||{};if(void 0===r.nonce){var o=n.nc;o&&(r.nonce=o)}if(Object.keys(r).forEach((function(e){t.setAttribute(e,r[e])})),"function"==typeof e.insert)e.insert(t);else{var i=a(e.insert||"head");if(!i)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");i.appendChild(t)}return t}var l,d=(l=[],function(e,t){return l[e]=t,l.filter(Boolean).join("\n")});function f(e,t,n,r){var o=n?"":r.media?"@media ".concat(r.media," {").concat(r.css,"}"):r.css;if(e.styleSheet)e.styleSheet.cssText=d(t,o);else{var a=document.createTextNode(o),i=e.childNodes;i[t]&&e.removeChild(i[t]),i.length?e.insertBefore(a,i[t]):e.appendChild(a)}}function p(e,t,n){var r=n.css,o=n.media,a=n.sourceMap;if(o?e.setAttribute("media",o):e.removeAttribute("media"),a&&btoa&&(r+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(a))))," */")),e.styleSheet)e.styleSheet.cssText=r;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(r))}}var y=null,h=0;function g(e,t){var n,r,o;if(t.singleton){var a=h++;n=y||(y=u(t)),r=f.bind(null,n,a,!1),o=f.bind(null,n,a,!0)}else n=u(t),r=p.bind(null,n,t),o=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(n)};return r(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;r(e=t)}else o()}}e.exports=function(e,t){(t=t||{}).singleton||"boolean"==typeof t.singleton||(t.singleton=o());var n=s(e=e||[],t);return function(e){if(e=e||[],"[object Array]"===Object.prototype.toString.call(e)){for(var r=0;r<n.length;r++){var o=c(n[r]);i[o].references--}for(var a=s(e,t),u=0;u<n.length;u++){var l=c(n[u]);0===i[l].references&&(i[l].updater(),i.splice(l,1))}n=a}}}},function(e,t,n){(t=n(5)(!1)).push([e.i,".cdx-alert {\n  position: relative;\n  padding: 8px;\n  border-radius: 5px;\n  margin: 5px;\n}\n\n.cdx-alert__message {\n  outline: none;\n}\n\n.cdx-alert [contentEditable='true'][data-placeholder]::before {\n  position: absolute;\n  content: attr(data-placeholder);\n  color: #707684;\n  font-weight: normal;\n  opacity: 0;\n}\n\n.cdx-alert [contentEditable='true'][data-placeholder]:empty::before {\n  opacity: 1;\n}\n\n.cdx-alert [contentEditable='true'][data-placeholder]:empty:focus::before {\n  opacity: 0;\n}\n\n.cdx-alert-primary {\n  background-color: #ebf8ff;\n  border: 1px solid #4299e1;\n  color: #2b6cb0;\n}\n\n.cdx-alert-secondary {\n  background-color: #f7fafc;\n  border: 1px solid #cbd5e0;\n  color: #222731;\n}\n\n.cdx-alert-info {\n margin: 5px;\n background-color: #e6fdff;\n  border: 1px solid #4cd4ce;\n  color: #00727c;\n}\n\n.cdx-alert-success {\n  background-color: #f0fff4;\n  border: 1px solid #68d391;\n  color: #2f855a;\n}\n\n.cdx-alert-warning {\n  background-color: #fffaf0;\n  border: 1px solid #ed8936;\n  color: #c05621;\n}\n\n.cdx-alert-danger {\n  background-color: #fff5f5;\n  border: 1px solid #fc8181;\n  color: #c53030;\n}\n\n.cdx-alert-light {\n  background-color: #fff;\n  border: 1px solid #edf2f7;\n  color: #1a202c;\n}\n\n.cdx-alert-dark {\n  background-color: #2d3748;\n  border: 1px solid #1a202c;\n  color: #d3d3d3;\n}\n\n.cdx-alert.cdx-settings-button {\n  margin: 3px;\n  width: 28px;\n  height: 28px;\n  opacity: 0.5;\n}\n\n.cdx-alert.cdx-settings-button:hover {\n  opacity: 1;\n}\n\n.cdx-alert.cdx-settings-button--active,\n.cdx-alert.ce-settings__button--focused {\n  font-weight: bold;\n  opacity: 0.9;\n}\n",""]),e.exports=t},function(e,t,n){"use strict";e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n=function(e,t){var n=e[1]||"",r=e[3];if(!r)return n;if(t&&"function"==typeof btoa){var o=(i=r,c=btoa(unescape(encodeURIComponent(JSON.stringify(i)))),s="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(c),"/*# ".concat(s," */")),a=r.sources.map((function(e){return"/*# sourceURL=".concat(r.sourceRoot||"").concat(e," */")}));return[n].concat(a).concat([o]).join("\n")}var i,c,s;return[n].join("\n")}(t,e);return t[2]?"@media ".concat(t[2]," {").concat(n,"}"):n})).join("")},t.i=function(e,n,r){"string"==typeof e&&(e=[[null,e,""]]);var o={};if(r)for(var a=0;a<this.length;a++){var i=this[a][0];null!=i&&(o[i]=!0)}for(var c=0;c<e.length;c++){var s=[].concat(e[c]);r&&o[s[0]]||(n&&(s[2]?s[2]="".concat(n," and ").concat(s[2]):s[2]=n),t.push(s))}},t}}]).default}));