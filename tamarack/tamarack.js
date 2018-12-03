// To make jQuery work in Electron
if(typeof require == 'function') window.$ = window.jQuery = require('../jquery/jquery.min.js');

/**
 * @class A static class containing information on the tamarack library. Do not use constructor.
 * @hideconstructor 
 */
class tamarack {
	/**
	 * The current tamarack version.
	 * @readonly
	 */
	static get version() {
		return 0.6;
	}
}

// Global functions

/**
 * Makes an element of tag _tag.
 * @param {String} _tag The tag of the element to be created
 * @returns {HTMLElement} The new element
 */
function make(_tag) {
	return document.createElement(_tag);
}

/**
 * Takes a string, splits it into lines, 
 * and makes a &lt;p&gt; element for each line.
 * @param {String} _text The string to be converted into &lt;p&gt; elements
 * @returns {string} HTML representing the all of the paragraphs
 */
function makeParagraphs(_text) {
	var htmlString = "";
	var lines = _text.split("\n");
	for(var i=0;i<lines.length;i++)
		htmlString += "<p>" + lines[i] + "</p>";
	
	return htmlString;
}

/**
 * Creates a new text node containing the string _text.
 * @param {String} _text The string to be placed inside the text node
 * @returns {Node} The new text node containing _text
 */
function say(_text) {
	return document.createTextNode(_text);
}

/**
 * Creates a new element of tag _tag containing the string _text.
 * @param {String} _text The string to be placed inside the element
 * @param {String} _tag The tag of the element to be created
 * @returns {HTMLElement} The new element containing _text
 */
function sayText(_text,_tag) {
	var textNode = document.createTextNode(_text);
	var element = make(_tag);
	element.appendChild(textNode);
	return element;
}

/**
 * Creates a new &lt;p&gt; element containing the string _text.
 * @param {string} _text The string to be placed inside a &lt;p&gt; element
 * @returns {HTMLElement} The new &lt;p&gt; element containing _text
 */
function sayP(_text) {
	return sayText(_text, "p");
}

/**
 * Creates a linear gradient
 * @param {Number} _angle_deg The angle (in degrees) of the linear-gradient
 * @param {Array} _colors An array of colors that will make up the gradient
 * @returns {string} The generated linear-gradient(...) css style
 */
function createLinearGradient(_angle_deg, _colors) {
	var gradient = "linear-gradient(" + _angle_deg + "deg";
	for(var i=0;i<_colors.length;i++)
		gradient += ("," + _colors[i] + " " + tkNumber.toPercentF(i,_colors.length));
	return gradient + " )";
}

/**
 * Inserts text into a editable text element at the caret position
 * @param {*} _element The element to insert the text into
 * @param {String} _text The text to insert
 */
function insertTextAtCaret(_element, _text) { 
	if (document.selection) { // IE
		_element.focus();
		sel = document.selection.createRange();
		sel.text = _text;
	} else if (_element.selectionStart || _element.selectionStart == '0') { // Everything elese
		var startPos = _element.selectionStart;
		var endPos = _element.selectionEnd;
		_element.value = _element.value.substring(0, startPos)
			+ _text
			+ _element.value.substring(endPos, _element.value.length);
			_element.selectionStart = startPos + _text.length;
			_element.selectionEnd = startPos + _text.length;
	} else {
		_element.value += _text;
	}
}

// Static classes

/**
 * @class A class containing static functions dealing with numbers. Do not use constructor.
 * @hideconstructor 
 */
class tkNumber {	
	/**
	 * Generate a random whole number between _min and _max, inclusive.
	 * @param {Number} _min The minimum number
	 * @param {Number} _max The maximum number
	 * @return {Number} The generated whole number
	 */
	static random(_min,_max) {
		_min = Math.ceil(_min);
		_max = Math.floor(_max);
		return Math.floor(Math.random() * (_max - _min + 1)) + _min;
	}

	/**
	 * Generate a random decimal number between _min and _max, inclusive.
	 * @param {Number} _min 
	 * @param {Number} _max 
	 * @return {Number} The generated decimal number
	 */
	static randomDecimal(_min,_max) {
		return Math.random() < 0.5 ? ((1-Math.random()) * (_max-_min) + _min) : (Math.random() * (_max-_min) + _min);
	}

	/**
	 * Get the percent of _max that _value represents.
	 * @param {Number} _value The number
	 * @param {Number} _max The maximum number
	 * @return {Number} The percentage
	 */
	static toPercent(_value,_max) {
		return ((_value*100)/_max);
	}

	/**
	 * Get the formatted percent of _max that _value represents, 
	 * that is, what tkNumber.toPercentage() would return + a percent sign.
	 * @param {Number} _value The number
	 * @param {Number} _max The maximum number
	 * @return {String} The percentage, including %
	 */
	static toPercentF(_value,_max)	{
		return this.toPercent(_value, _max) + "%";
	}

	/**
	 * Convert a percentage into a number.
	 * @param {Number} _value The percentage
	 * @param {Number} _max The maximum number
	 * @return {Number} The number
	 */
	static fromPercent(_value,_max)	{
		return ((_value*_max)/100);
	}
}

/**
 * @class A class containing static functions dealing with arrays. Do not use constructor.
 * @hideconstructor 
 */
class tkArray {
	/**
	 * Compare all the elements in array _arr with
	 * each other.
	 * @param {Array} _arr The array whose elements are to be compared with each other
	 * @returns {Boolean} True if all elements are equal (as compared by JavaScript's === comparer), 
	 * false otherwise 
	 * @example
	 * tkArray.areElementsEqual(["blue", "blue", "blue"]);
	 * // Output: true
	 * 
	 * tkArray.areElementsEqual(["blue", "blue", "red"]);
	 * // Output: false
	 * 
	 * tkArray.areElementsEqual([false, false, 0]);
	 * // Output: false
	 */
	static areElementsEqual(_arr) {
		for(var i=0;i<_arr.length;i++)
			for(var j=0;j<_arr.length;j++)
				if (_arr[i]!==_arr[j])
					return false;
		return true;
	}

	/**
	 * Determine if an object is an array
	 * @param {Object} _object 
	 * @returns {Boolean} True if _object is an Array, false otherwise	 
	 * @example
	 * tkArray.isArray([1, 2]);
	 * // Output: true
	 * 
	 * tkArray.isArray("hello");
	 * // Output: false
	 */
	static isArray(_object) {
		return (_object.constructor === Array);
	}
}

// Regular classes
class tkFont {
	constructor(_family,_size,_weight,_style) {
		this.family = (_family) ? _family : "Arial";
		this.size = (_size) ? _size : "24px";
		this.weight = (_weight) ? _weight : "normal"; 
		this.style = (_style) ? _style : "normal";
		this.variant = "";
	}

	
	// Check if a font family exists
	static exists(_family) {
		// From https://www.samclarke.com/javascript-is-font-available/
		var width;
		var body = document.body;

		var container = document.createElement('span');
		container.innerHTML = Array(100).join('wi');
		container.style.cssText = [
			'position:absolute',
			'width:auto',
			'font-size:128px',
			'left:-99999px'
		].join(' !important;');

		var getWidth = function (fontFamily) {
			container.style.fontFamily = fontFamily;

			body.appendChild(container);
			width = container.clientWidth;
			body.removeChild(container);

			return width;
		};

		// Pre compute the widths of monospace, serif & sans-serif
		// to improve performance.
		var monoWidth  = getWidth('monospace');
		var serifWidth = getWidth('serif');
		var sansWidth  = getWidth('sans-serif');

		return monoWidth !== getWidth(_family + ',monospace') 
			|| sansWidth !== getWidth(_family + ',sans-serif') 
			|| serifWidth !== getWidth(_family + ',serif');
	}

	static getStandardFonts() {
		return ["Arial","Arial Black","Arial Narrow","Calibri","Century Gothic","Comic Sans",
		"Courier New","Georgia","Helvetica","Impact","Lucida Sans","Palantino","Papyrus","Tahoma","Times New Roman","Trebuchet","Verdana"];
	}

	static getAvailableFonts() {		
		var standardFonts = tkFont.getStandardFonts();
		var availableFonts = [];

		for(var i=0;i<standardFonts.length;i++)
			if (tkFont.exists(standardFonts[i]))
				availableFonts.push(standardFonts[i]);

		return availableFonts;
	}

	static fromElement(_element) {
		var element = makeElement(_element);

		var computedFamily = element.computedProperty("font-family");
		var fontFamily = (computedFamily.includes(",")) ? tkFont.getStandardFonts()[0] : computedFamily;

		return new tkFont(fontFamily, 
			element.computedProperty("font-size"),
			element.computedProperty("font-weight"),
			element.computedProperty("font-style"));
	}

	getCss() {
		return this.style + " " + 
		this.variant + " " +
		this.weight + " " +
		this.size + " " +
		this.family;
	}
}

/**
 * @class A class containing various functions 
 * to convert between color types, grab colors from elements,
 * generate random colors, parse color strings, and more. Used 
 * internally by tamarack to represent color.
 */
class tkColor {
	/**
	 * Create a tkColor object, optionally based
	 * off of an existing color, _color_string.
	 * @param {String} _color_string The string representing a color to be parsed
	 */
	constructor(_color_string) {
		this.r = 0;
		this.g = 0;
		this.b = 0;

		this.h = 0;
		this.s = 0;
		this.l = 0;

		this.a = 1;

		if(_color_string)
			this.parse(_color_string);
	}

	/**
	 * Generate a random RGB color, without an alpha channel.
	 * @returns {String} The randomly generated color in the format of rgb(0,0,0)
	 * @example 
	 * tkColor.randomRgbString();
	 * // Output: "rgb(174,236,36)"
	 */
	static randomRgbString() {
		return "rgb(" + tkNumber.random(0,255) + "," + tkNumber.random(0,255) + "," + tkNumber.random(0,255) + ")";
	}

	/**
	 * Generate a random RGBA color, with an alpha channel.
	 * @returns {String} The randomly generated color in the format of rgba(0,0,0,0)
	 * @example 
	 * tkColor.randomRgbaString();
	 * // Output: "rgba(26,30,96,0.33)"
	 */
	static randomRgbaString() {
		return "rgba(" + tkNumber.random(0,255) + "," + tkNumber.random(0,255) + "," + tkNumber.random(0,255) + "," + (Math.random()).toFixed(2) + ")";
	}

	/**
	 * Find whether _color represents a valid color that can be used.
	 * Currently, tamarack does not accept colors formatted in names,
	   such as "black" or "transparent", instead use #000000 or rgba(0,0,0,0).
	 * @param {String} _color
	 * @example 
	 * tkColor.isColor("blah");
	 * // Output: false
	 * tkColor.isColor("#000000");
	 * // Output: true
	 */
	static isColor(_color) {
		if (_color === "" || _color === "inherit" || _color === "transparent") 
			return false;

		// Test if color changes from the test color
		var image = make("img");
		image.style.color = "rgb(0, 0, 0)";
		image.style.color = _color;

		if (image.style.color !== "rgb(0, 0, 0)") 
			return true; 

		// Test again to account for the previously used test color
		image.style.color = "rgb(255, 255, 255)";
		image.style.color = _color;

		return (image.style.color !== "rgb(255, 255, 255)");
	}	

	/**
	 * Extract a color from the computed background-color style
	 * of the HTMLElement _element.
	 * @param {HTMLElement} _element The element
	 * @returns {tkColor} The tkColor generated from the extracted color
	 * @example
	 * tkColor.fromElementBackground(document.body);
	 * // Output, the default white: tkColor {r: 255, g: 255, b: 255, h: 0, s: 0, …}
	 */
	static fromElementBackground(_element) {
		return new tkColor((new tkElement(_element).computedProperty("background-color")));
	}

	/**
	 * Extract a color from the computed color style
	 * of the HTMLElement _element.
	 * @param {HTMLElement} _element The element
	 * @returns {tkColor} The tkColor generated from the extracted color
	 * @example
	 * tkColor.fromElementColor(document.body);
	 * // Output, the default black: tkColor {r: 33, g: 37, b: 41, h: 210, s: 10.81081081081081, …}
	 */
	static fromElementColor(_element) {
		return new tkColor((new tkElement(_element).computedProperty("color")));
	}

	/**
	 * Generate a random tkColor, with an alpha channel.
	 * @returns {tkColor} The generated color
	 * @example
	 * tkColor.random();
	 * // Output: tkColor {r: 202, g: 141, b: 212, h: 291.5492957746479, s: 45.22292993630575, …}
	 */
	static random() {
		var color = new tkColor();
		color.randomize();

		return color;
	}

	/**
	 * Generate a random tkColor, without an alpha channel.
	 * @returns {tkColor} The generated color
	 * @example
	 * tkColor.randomOpaque();
	 * // Output: tkColor {r: 217, g: 127, b: 11, h: 33.78640776699029, s: 90.35087719298247, …}
	 */
	static randomOpaque() {
		var color = new tkColor();
		color.randomizeOpaque();

		return color;
	}
	
	/**
	 * Compare a tkColor to another tkColor, _other.
	 * @returns {Boolean} True if all of the values are the same, false otherwise
	 * @example
	 * let color1 = new tkColor("rgba(255,0,0,1)"); // Red
	 * let color2 = new tkColor("hsla(0,100,50,1)"); // Exact same color, but in HSLA
	 * color1.equals(color2);
	 * // Output: true
	 */
	equals(_other) 	{
		if(	_other.h == this.h 
			&& _other.s == this.s 
			&& _other.l == this.l 
			&& _other.a == this.a)
			return true;

		return false;
	}
	
	/**
	 * Set all of the values of the current tkColor 
	 * randomly, with alpha channel.
	 */ 
	randomize()	{
		this.fromRgba(tkNumber.random(0,255),
		tkNumber.random(0,255),
		tkNumber.random(0,255),
		(tkNumber.randomDecimal(0,1)).toFixed(2));
	}

	/**
	 * Set all of the value of the current tkColor 
	 * randomly, without alpha channel.
	 */ 
	randomizeOpaque() {
		this.fromRgba(tkNumber.random(0,255),
		tkNumber.random(0,255),
		tkNumber.random(0,255),
		1);
	}

	/**
	 * Create a deep copy of the current tkColor.
	 * @returns {tkColor} A deep copy of the current tkColor
	 */
	clone()	{
		var new_color = new tkColor();
		new_color.fromHsla(this.h,this.s,this.l,this.a);
		return new_color;
	}

	/**
	 * Set the current tkColor from RGBA values.
	 * @param {Number} _r Red
	 * @param {Number} _g Green
	 * @param {Number} _b Blue
	 * @param {Number} _a Alpha
	 */
	fromRgba(_r,_g,_b,_a) {
		var hsl = this.rgbToHsl(_r,_g,_b);
		this.r = _r;
		this.g = _g;
		this.b = _b;

		this.h = hsl[0];
		this.s = hsl[1];
		this.l = hsl[2];

		this.a = _a;
	}

	/**
	 * Set the current tkColor from HSLA values.
	 * @param {Number} _h Hue
	 * @param {Number} _s Saturation
	 * @param {Number} _l Lightness
	 * @param {Number} _a Alpha
	 */
	fromHsla(_h,_s,_l,_a) {
		var rgb = this.hslToRgb(_h,_s,_l);
		this.r = rgb[0];
		this.g = rgb[1];
		this.b = rgb[2];

		this.h = _h;
		this.s = _s;
		this.l = _l;

		this.a = _a;
	}

	/**
	 * Set the current tkColor from a hexadecimal value.
	 * @param {Number} _hex Hexadecimal
	 */
	fromHex(_hex) {
		var rgb = this.hexToRgb(_hex);
		this.fromRgba(rgb[0],rgb[1],rgb[2],this.a);
	}

	/**
	 * Parse a color, _input, and the current tkColor to match it.
	 * @param {String} _input The color to parse
	 */
	parse(_input) {
		if(_input.startsWith("#")) {
			this.fromHex(_input);
		} else if (_input.startsWith("hsl")) {
			var trimmed = _input.replace("hsla(","");
			trimmed = trimmed.replace("hsl(","");
			trimmed = trimmed.replace(")","");
			var chunks = trimmed.split(",");
			if (chunks.length == 3) // hsl
				this.fromHsla(parseInt(chunks[0]),parseInt(chunks[1]),parseInt(chunks[2]),1);
			else if (chunks.length == 4) //hsla 
				this.fromHsla(parseInt(chunks[0]),parseInt(chunks[1]),parseInt(chunks[2]),parseFloat(chunks[3]),1);
		} else if (_input.startsWith("rgb")) {
			var trimmed = _input.replace("rgba(","");
			trimmed = trimmed.replace("rgb(","");
			trimmed = trimmed.replace(")","");
			var chunks = trimmed.split(",");
			if (chunks.length == 3) // rgb
				this.fromRgba(parseInt(chunks[0]),parseInt(chunks[1]),parseInt(chunks[2]),1);
			else if (chunks.length == 4) //rgba
				this.fromRgba(parseInt(chunks[0]),parseInt(chunks[1]),parseInt(chunks[2]),parseFloat(chunks[3]),1);
		} else {
			this.fromRgba(0,0,0,0);
		}
	}

	/**
	 * Get the current tkColor's string representation, represented in hsla(0,0%,0%,1) form.
	 * @returns {String} The current color, as an RGBA string
	 */
	getHslaString() {
		return "hsla(" + this.h.toFixed(0) + ", " + this.s.toFixed(0) + "%, " + this.l.toFixed(0) + "%, " + this.a.toFixed(2) + ")";
	}

	/**
	 * Get the current tkColor's string representation, represented in rgba(0,0,0,1) form.
	 * @returns {String} The current color, as an HSLA string
	 */
	getRgbaString() {
		return "rgba(" + this.r.toFixed(0) + ", " + this.g.toFixed(0) + ", " + this.b.toFixed(0) + ", " + this.a.toFixed(2) + ")";
	}

	/**
	 * Get the current tkColor's string representation, represented in #000000 form.
	 * @returns {String} The current color, as a hexadecimal color
	 */
	getHexString()	{
		return this.rgbToHex(this.r, this.g, this.b);
	}

	/**
	 * Convert an HSL color to an RGB color.
	 * @param {Number} _h Hue
	 * @param {Number} _s Saturation
	 * @param {Number} _l Lightness
	 * @returns {Array} An array [r,g,b], which represents the converted color
	 */
	hslToRgb(_h,_s,_l) {
		var r, g, b;

		if(_h>0) _h /= 360;
		if(_s>0) _s /= 100;
		if(_l>0) _l /= 100;

		if(_s == 0) {
			r = g = b = _l; // achromatic
		} else {
			var hue2rgb = function hue2rgb(_p,_q,_t) {
				if(_t < 0) _t += 1;
				if(_t > 1) _t -= 1;
				if(_t < 1/6) return _p + (_q - _p) * 6 * _t;
				if(_t < 1/2) return _q;
				if(_t < 2/3) return _p + (_q - _p) * (2/3 - _t) * 6;
				return _p;
			}

			var q = _l < 0.5 ? _l * (1 + _s) : _l + _s - _l * _s;
			var p = 2 * _l - q;
			r = hue2rgb(p, q, _h + 1/3);
			g = hue2rgb(p, q, _h);
			b = hue2rgb(p, q, _h - 1/3);
		}

		return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	}

	/**
	 * Convert an RGB color to an HSL color.
	 * @param {Number} _r Red
	 * @param {Number} _g Green
	 * @param {Number} _b Blue
	 * @returns {Array} An array [h,s,l], which represents the converted color
	 */
	rgbToHsl(_r,_g,_b) {
		_r /= 255, _g /= 255, _b /= 255;
		var max = Math.max(_r, _g, _b), min = Math.min(_r, _g, _b);
		var h, s, l = (max + min) / 2;

		if(max == min) {
			h = s = 0; // achromatic
		} else {
			var d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch(max) {
				case _r: h = (_g - _b) / d + (_g < _b ? 6 : 0); break;
				case _g: h = (_b - _r) / d + 2; break;
				case _b: h = (_r - _g) / d + 4; break;
			}
			h /= 6;
		}

		return [h*360, s*100, l*100];
	}
	/**
	 * Convert a hexadecimal color to HSL.
	 * @param {String} _hex The hexadecimal color 
	 * @returns {Array} An array [h,s,l], which represents the converted color
	 */
	hexToHsl(_hex)	{
		var rgb = this.hexToRgb(_hex);
		return this.rgbToHsl(rgb[0], rgb[1], rgb[2]);
	}

	/**
	 * Convert a hexadecimal color to RGB.
	 * @param {String} _hex The hexadecimal color 
	 * @returns {Array} An array [r,g,b], which represents the converted color
	 */
	hexToRgb(_hex)	{
		// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
		var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		_hex = _hex.replace(shorthandRegex, function(m, r, g, b) {
			return r + r + g + g + b + b;
		});

		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(_hex);
		return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
	}

	/**
	 * Convert an HSL color to hexadecimal color.
	 * @param {Number} _h Hue
	 * @param {Number} _s Saturation
	 * @param {Number} _l Lightness
	 * @returns {String} The converted hexadecimal color
	 */
	hslToHex(_h,_s,_l) {
		var rgb = this.hslToRgb(_h,_s,_l);
		return this.rgbToHex(rgb[0], rgb[1], rgb[2]);
	}

	/**
	 * Convert an RGB color to hexadecimal color.
	 * @param {Number} _r Red
	 * @param {Number} _g Green
	 * @param {Number} _b Blue
	 * @returns {String} The converted hexadecimal color
	 */
	rgbToHex(_r,_g,_b) {
		return "#" + ((1 << 24) + (_r << 16) + (_g << 8) + _b).toString(16).slice(1);
	}

	/**
	 * Return a clone of the current tkColor, but lighter by a 
	 * factor of _factor.
	 * @param {Number} _factor The factor to multiply the lightness value by
	 * @returns {tkColor} The new, tkColor
	 */
	lighter(_factor) {
		var c = this.clone();
		var new_l = (_factor * c.l) + c.l;
		
		if (new_l > 100)
			new_l = 100;
		else if (new_l < 0)
			new_l = 0;

		c.fromHsla(c.h, c.s, new_l, c.a);
		return c;
	}

	/**
	 * If the current tkColor's lightness is less than 50% and the
	 * alpha is more than 0.4.
	 * @returns {Boolean} True if dark, false otherwise
	 */
	isDark() {
		return (this.l <= 50 && this.a > 0.4);
	}
	
	/**
	 * The opposite of tkColor.isDark().
	 * @returns {Boolean} True if not dark, false otherwise
	 */
	isLight() {
		return (!this.isDark());
	}

	/**
	 * If the red, green, and blue values are equal to each other.
	 * @returns {Boolean} True if all are equal, false otherwise
	 */
	isGray() {
		return (tkArray.areElementsEqual([this.r,this.g,this.b]));
	}
}

// A control can be any html element
/**
 * A wrapper around a HTMLElement exposing additional functionality.
 */
class tkControl {	
	/**
	 * Initialize the tkControl.
	 */
	constructor() {
		this._element = document.body;
		this._element.id = "";
		this._parent = null;
	}

	/**
	 * The element the tkControl represents
	 * @type {HTMLElement}
	 */
	get element()	{
		return this._element;
	}
	
	set element(_element) {
		this._element = _element;
	}
	
	/**
	 * The id of the element.
	 * @type {String}
	 */
	get id() {
		return this.element.id;
	}
	
	set id(_id) {
		this.element.id = _id;
	}
	
	/**
	 * The style of the element.
	 * @type {CSSStyleDeclaration}
	 * @readonly
	 */	
	get style() {
		return this.element.style;
	}
	
	/**
	 * Shorthand for tkControl.element.
	 * @type {HTMLElement}
	 */
	get e()	{
		return this.element;
	}
	
	set e(_e) {
		this.element = _e;
	}

	/**
	 * The inner HTML of an the element. 
	 */
	get innerHtml() {
		return this.element.innerHTML;
	}

	set innerHtml(_html) {
		this.element.innerHTML = _html;
	}

	/**
	 * Make the element fullscreen.
	 */
	makeFullscreen() {
		if (this.element.requestFullscreen)
			this.element.requestFullscreen();
		else if (this.element.msRequestFullscreen) 
		  this.element.msRequestFullscreen();
		else if (this.element.mozRequestFullScreen) 
		  this.element.mozRequestFullScreen();
		else if (this.element.webkitRequestFullscreen) 
		  this.element.webkitRequestFullscreen();
	}	

	/**
	 * Exit fullscreen.
	 */
	exitFullscreen() {
		if (document.exitFullscreen) 
			document.exitFullscreen();
		else if (document.webkitExitFullscreen)
			document.webkitExitFullscreen();
		else if (document.mozCancelFullScreen)
			document.mozCancelFullScreen();
		else if (document.msExitFullscreen) 
			document.msExitFullscreen();
	}

	/**
	 * Determine if the root element is fullscreen.
	 * @returns {Boolean} True if the document's fullscreen element is
	 * the root element
	 */
	isFullscreen() {
		return (document.fullscreenElement == this.element 
				|| document.mozFullScreenElement == this.element 
				|| document.webkitFullscreenElement == this.element 
				|| document.msFullscreenElement == this.element);
	}

	/**
	 * Toogle the element being fullscreen
	 */
	toggleFullscreen()	{
		if (this.isFullscreen())
			this.exitFullscreen();
		else
			this.makeFullscreen();
	}

	/**
	 * Determine if the root element has an attribute named _attribute.
	 * @param {String} _attribute The attribute name
	 * @returns {Boolean} True if the element contains an attribute named _attribute, false otherwise
	 */	
	hasAttribute(_attribute) {
		return this.element.hasAttribute(_attribute);
	}
	
	/**
	 * Get the value of the attribute named _attribute 
	 * for the root element.
	 * @param {String} _attribute 
	 * @returns {String} The value of the attribute
	 */
	getAttribute(_attribute) {
		return this.element.getAttribute(_attribute);
	}
		
	/**
	 * Set the value of the attribute named _attribute to _value 
	 * for the root element.
	 * @param {String} _attribute 
	 * @param {String} _value
	 */
	setAttribute(_attribute, _value)	{
		this.element.setAttribute(_attribute,_value);		
	}
	
	/**
	 * Remove the attribute named _attribute from the 
	 * root element.
	 * @param {String} _attribute 
	 */
	removeAttribute(_attribute)	{
		this.element.removeAttribute(_attribute);
	}
	
	/**
	 * Add an attribute named _attribute without a value to 
	 * the root element.
	 * @param {*} _attribute 
	 */
	addAttribute(_attribute) {
		var attribute = document.createAttribute(_attribute); 
		this.element.setAttributeNode(attribute);
	}

	/**
	 * Set an attribute node to _attribute_node in 
	 * the root element.
	 * @param {Attr} _attribute_node 
	 */
	setAttributeNode(_attribute_node) {
		this.element.setAttributeNode(_attribute_node);
	}

	/**
	 * The width of the root element.
	 * @type {String}
	 */
	get width()	{
		return this.getAttribute("width");
	}
	
	set width(_width) {
		this.setAttribute("width",_width);
		this.element.style.width = _width;
	}
		
	/**
	 * The height of the root element.
	 * @type {String}
	 */
	get height() {
		return this.getAttribute("height");
	}

	set height(_height)	{
		this.setAttribute("height",_height);
		this.element.style.height = _height;
	}
	
	/**
	 * Set both the width and the height
	 * at the same time for the root element.
	 * @param {Number} _width 
	 * @param {Number} _height 
	 */
	setSize(_width,_height) {
		this.width = _width;
		this.height = _height;
	}	
	
	/**
	 * The background style of the root element.
	 * @type {String}
	 */
	get background() {
		return this.element.style.background;
	}

	set background(_background) {
		this.element.style.background = _background;
	}		
		
	/**
	 * The color style of the root element.
	 * @type {String}
	 */
	get fontColor() {
		return this.element.style.color;
	}

	set fontColor(_color) {
		this.element.style.color = _color;
	}	
	
	/**
	 * The border style of the root element.
	 * @type {String}
	 */
	get border() {
		return this.element.style.border;
	}

	set border(_border) {
		this.element.style.border = _border;
	}	

	/**
	 * The padding of the root element.
	 * @type {String}
	 */
	get padding() {
		return this.element.style.padding;
	}

	set padding(_padding) {
		this.element.style.padding = _padding;
	}
	
	/**
	 * The margin of the root element.
	 * @type {String}
	 */
	get margin() {
		return this.element.style.margin;
	}

	set margin(_margin) {
		this.element.style.margin = _margin;
	}

	/**
	 * The display of the root element.
	 * @type {String}
	 */
	get display() {
		return this.element.style.display;
	}

	set display(_display) {
		this.element.style.display = _display;
	}

	/**
	 * Remove all child elements from the root element.
	 */
	clear()	{
		while (this.element.firstChild) 
			this.element.removeChild(this.element.firstChild);
	}

	/**
	 * The role attribute of root element.
	 * @type {String}
	 */
	get role() {
		return this.getAttribute("role");
	}

	set role(_role)	{
		this.setAttribute("role",_role);
	}

	/**
	 * Add classes to root element.
	 * @param {...String} _classes Classes to add to the root element
	 */
	addClass(/* classes to add */)	{
		for (var i=0;i<arguments.length;i++)
			this.element.classList.add(arguments[i]);
	}

	/**
	 * Remove classes from root element.
	 * @param {...String} _classes Classes to remove from the root element
	 */
	removeClass(/* classes to remove */) {
		for (var i=0;i<arguments.length;i++)
			this.element.classList.remove(arguments[i]);
	}

	/**
	 * Toggle a class in the root element.
	 * @param {String} _class Class to toggle from the root element
	 */
	toggleClass(_class)	{
		this.element.classList.toggle(_class);
	}

	/**
	 * Get the class at position _index in the root element's
	 * class list. 
	 * @param {Number} _index The index of the class
	 */
	classAt(_index)	{
		this.element.classList.item(_index);
	}

	/**
	 * Determine if the root element has a class
	 * named _class in its class list.
	 * @param {String} _class Class to search for
	 */
	hasClass(_class) {
		return this.element.classList.contains(_class);
	}

	/**
	 * The class name of the root element.
	 * @type {String}
	 */
	get className()	{
		return this.element.className;
	}

	set className(_class_name) {
		this.element.className = _class_name;
	}

	/**
	 * Add tkWidgets to the root element.
	 * @param {...tkWidget} _widgets tkWidgets to add to the root element
	 */
	add(/* tkControls to add */) {
		for (var i=0;i<arguments.length;i++) {
			this.element.appendChild(arguments[i].element);
			arguments[i]._parent = this;
		}
	}

	/**
	 * Remove tkWidgets from the root element.
	 * @param {...tkWidget} _widgets tkWidgets to remove from the root element
	 */
	remove(/* tkControls to remove */)	{
		for (var i=0;i<arguments.length;i++) {
			this.element.removeChild(arguments[i].element);
			arguments[i]._parent = null;
		}
	}

	/**
	 * Add elements to the root element.
	 * @param {...HTMLElement} _widgets Elements to add to the root element
	 */
	addElement(/* elements to add */) {
		for (var i=0;i<arguments.length;i++)
			this.element.appendChild(arguments[i]);
	}

	/**
	 * Remove elements from the root element.
	 * @param {...HTMLElement} _widgets Elements to remove from the root element
	 */
	removeElement(/* elements to remove */) {
		for (var i=0;i<arguments.length;i++)
			this.element.removeChild(arguments[i]);
	}
	
	/**
	 * Get the parent tkWidget.
	 * @returns {tkWidget} The parent tkWidget
	 */
	getParent() {
		return this._parent;
	}

	/**
	 * Get the parent element of the root element.
	 * @returns {HTMLElement} The parent element 
	 */
	getParentElement() {
		return this.e.parentNode;
	}

	/**
	 * A wrapper around the jQuery $(element).on(...) function 
	   that sends the tkControl associated with the element as one 
	   of the parameters.
	 * @param {String} _event_name 
	 * @param {Function} _function 
	 */
	on(_event_name,_function) {
		var _control = this;
		$(this.element).on(_event_name, function() {
			_function(_control);
		});
	}

	/**
	 * Trigger an event by the name of _event_name.
	 * @param {String} _event_name 
	 */
	trigger(_event_name) {
		$(this.element).trigger(_event_name);
	}

	/**
	 * Get the computed property by the name of _property_name of an element.
	 * @param {String} _property_name 
	 * @returns {*} The computed property value
	 */
	computedProperty(_property_name) {
		return window.getComputedStyle(this.element, null).getPropertyValue(_property_name);
	}
}


// A widget is a control that is associated with an element besides document.
class tkWidget extends tkControl {
	constructor(_tag) {
		super();
		this.element = make((_tag) ? _tag : "div");
	}

	addToElement(_destination_element) {
		_destination_element.appendChild(this.element);
	}

	addTo(_destination_widget) {
		_destination_widget.element.appendChild(this.element);
		this._parent = _destination_widget;
	}
	
	removeFromElement(_destination_element) {
		_destination_element.removeChild(this.element);
	}

	removeFrom(_destination_widget) {
		_destination_widget.element.removeChild(this.element);
		this._parent = null;
	}

	delete() {
		if(this.element.parentNode) {
			this.element.parentNode.removeChild(this.element);
			this._parent = null;
		}
	}

	// animations
	fadeIn() {
		$(this.element).fadeIn(150);
	}

	fadeOut() {
		$(this.element).fadeOut(150);
	}

	slide()	{
		$(this.element).slideToggle(250);
	}

	// element to display on mouse hover
	get tooltip() {
		return this.tooltipTitle;
	}

	set tooltip(_title) {
		this.tooltipTitle = _title;
		$(this.element).tooltip({title: _title})
	}
 }

class tkDiv extends tkWidget {
	constructor() {
		super();
		this.element = make("div");
	}
}

class tkPalette extends tkDiv {
	constructor() {
		super();
		this.className = "tkPalette";
	}
}

class tkDocument extends tkControl {	
	constructor(_title) {
		super();
		this.element = document.body;
		
		if(_title)
		document.title = _title;
	}
	
	get title()	{
		return document.title;
	}
	
	set title(_title) {
		document.title = _title;
	}

	setBackground(_background) {
		this.style.backgroundColor = _background;
	}

	setBackgroundColor(_background)	{
		this.style.background = _background;
	}

	setBackgroundLinearGradient(_angle_deg,_start,_end) {
		this.style.background = "linear-gradient(" + _angle_deg + "deg," + _start  + "," + _end + ") fixed";
	}

	setBackgroundImage(_background)	{
		this.style.backgroundImage = _background;
	}

	setBackgroundImageCover(_image)	{
		this.style.background = "url(" + _image + ") no-repeat center center fixed";
	}

	clearBackground() {
		this.style.background = null;
	}

	buildUrl(_url,_args,_vals) {
		let url = _url + "?";
		let max = Math.min(_args.length,_vals.length);
		for(var i=0; i<max; i++) {
			url += _args[i] + "=" + _vals[i];
			if (i < max-1) url += "&";
		}

		return url;
	}

	parseUrl(_name,_url) {
		if (!_url)
			_url = window.location.href;
		
		_name = _name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + _name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(_url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	getParameter(_name)	{
		return this.parseUrl(_name,this.getUrl());
	}
				
	getUrl() {
		return window.location.href;
	}
	
	isFullscreen() {
		if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) 
				return true;
			return false;
	}
}

class tkElement extends tkWidget {
	constructor(_element) {
		super(_element.id);
		this.element = _element;
	}
}

function makeElement(_elem) {
	return new tkElement(_elem);
}

function makeElementFromId(_id) {
	return new tkElement(document.getElementById(_id));
}

class tkText extends tkWidget {
	constructor(_tag,_text) {
		super();
		
		this.element = make(_tag);
		this.textNode = document.createTextNode((_text) ? _text : "");
		this.element.appendChild(this.textNode);
	}

	get text() {
		return this.textNode.nodeValue;
	}
	
	set text(_string) {
		this.textNode.nodeValue = _string;
	}
}

class tkLink extends tkText {
	constructor(_text,_source) {
		super("a",_text);

		if (_source)
			this.source = _source;
	}
		
	// Link source
	get source() {
		return this.getAttribute("href");
	}

	set source(_source) {
		this.setAttribute("href", _source);
	}
}

var tkWidgetStyle= {
	PRIMARY: 0,
	SECONDARY: 1,
	SUCCESS: 2,
	DANGER: 3,
	WARNING: 4,
	INFO: 5,
	LIGHT: 6,
	DARK: 7,
	LINK: 8
};

class tkButton extends tkWidget {
	constructor(_text,_button_style,_class,_outline,_on_click) {
		super();

		this.element = make("button");
		this.element.type = "button";
		var btnClass = "";

		switch(_button_style) {
			case tkWidgetStyle.PRIMARY:
				btnClass = "btn btn-primary";
				break;
			case tkWidgetStyle.SECONDARY:
				btnClass = "btn btn-secondary";
				break;
			case tkWidgetStyle.SUCCESS:
				btnClass = "btn btn-success";
				break;				
			case tkWidgetStyle.DANGER:
				btnClass = "btn btn-danger";
				break;
			case tkWidgetStyle.WARNING:
				btnClass = "btn btn-warning";
				break;				
			case tkWidgetStyle.INFO:
				btnClass = "btn btn-info";
				break;
			case tkWidgetStyle.LIGHT:
				btnClass = "btn btn-light";
				break;
			case tkWidgetStyle.DARK:
				btnClass = "btn btn-dark";
				break;
			default:
				btnClass = "btn btn-primary";
		}

		if (_outline)
			btnClass = btnClass.replace("btn-", "btn-outline-");

		this.className = btnClass + ((_class) ? (" " + _class) : "");
		
		this.imageWidget = new tkImage();
		this.imageWidget.className = "tkButtonImage";
		this.element.appendChild(this.imageWidget.element);
		this.imageWidget.e.style.display = "none";

		this.textWidget = new tkText("span");
		this.textWidget.className = "tkButtonText";
		this.element.appendChild(this.textWidget.element);
		this.text = _text;

		if (!_on_click)
			_on_click = function() {};

		this.on("click",_on_click);
	}	

	get outline() {
		return (btnClass.includes("btn-outline-"));
	}

	set outline(_outline) {
		if (_outline)
			btnClass = btnClass.replace("btn-", "btn-outline-");
		else 
			btnClass = btnClass.replace("btn-outline", "btn-");
	}

	get image()	{
		return this.image.source;
	}

	set image(_image) {
		if(_image)
			this.imageWidget.e.style.display = "inline";
		else {			
			this.imageWidget.e.style.display = "none";
			return;
		}

		this.imageWidget.source = _image;
	}

	get text()	{
		return this.textWidget.text;
	}

	set text(_text)	{
		this.textWidget.text = _text;
	}
}

class tkColorButton extends tkButton {
	constructor(_text) {
		super(_text,tkWidgetStyle.PRIMARY,"tkColorButton",false);

		this.colorDialog = new tkColorDialog();	
		this.color = this.colorDialog.color;

		this.on("click", (_color_button) => {
			this.colorDialog.color = tkColor.fromElementBackground(_color_button.element);
			this.colorDialog.show((_dialogResult) => {
				if (_dialogResult == tkDialogResult.OK) 
					_color_button.color = _color_button.colorDialog.color;
			});
		});
	}	

	get color() {
		return this._color;
	}

	set color(_color) {
		this._color = _color;
		this.background = this._color.getHslaString();
		this.style.borderColor = _color.lighter(-0.3).getHslaString();
		this.fontColor = (_color.isDark()) ? "white" : "black";
	}
}

class tkMenuItem extends tkLink {
	constructor(_text,_source,_on_click) {
		super(_text,_source);

		this.className = "dropdown-item";

		if (!_on_click)
			_on_click = function() {};

		this.on("click",_on_click);
	}
}

class tkMenuDivider extends tkDiv {
	constructor() {
		super();

		this.className = "dropdown-divider";
	}
}

class tkMenuButton extends tkWidget {
	constructor(_text,_button_style,_class,_menu_items) {
		super();

		this.element = make("div");
		this.className = "btn-group";

		this.button = new tkButton(_text, _button_style, "dropdown-toggle " + _class, false);
		this.button.setAttribute("data-toggle","dropdown");
		this.button.addToElement(this.e);

		this.menu = new tkDiv();
		this.menu.className = "dropdown-menu";
		this.menu.addToElement(this.e);
		
		this.items = (_menu_items) ? _menu_items : [];
		this.refreshItems();
	}	

	get image()	{
		return this.button.image;
	}

	set image(_image) {
		this.button.image = _image;
	}

	get text()	{
		return this.button.text;
	}

	set text(_text)	{
		this.button.text = _text;
	}

	refreshItems() {
		this.menu.clear();
		for(var i = 0; i<this.items.length; i++)
			this.items[i].addTo(this.menu);
	}

	addItem(_item) {
		this.items.push(_item);
		refreshItems();
	}

	removeItem(_item) {
		this.items.splice(_item,1);
		refreshItems();
	}
}

class tkSelectItem extends tkText {
	constructor(_text,_value) {
		super("option",_text);
		this.value = (_value) ? _value : _text;
	}

	get value() {
		return this.getAttribute("value");
	}

	set value(_value) {
		this.setAttribute("value",_value);
	}
}

class tkSelect extends tkWidget {
	constructor() {
		super("select");
		this.className = "form-control";
		this.items = [];
	}

	addItem(/* items to add */) {
		for(var i=0;i<arguments.length;i++)
			this.items.push(arguments[i]);

		this.refreshItems();
	}
	
	removeItem(/* items to remove */) {
		for(var i=0;i<arguments.length;i++)			
			this.items.splice(arguments[i],1);
		
		this.refreshItems();
	}	

	get selectedCount() {
		return this.selectedIndex.length;
	}

	getSelected() {
		var _active = [];
		var _activeIndex = this.getSelectedIndex();

		for(var i=0;i<_activeIndex.length;i++)
			_active.push(this.items[_activeIndex[i]]);

		return _active;
	}

	setSelected(/* items to select */) {	
		var _values = [];

		for(var i=0;i<arguments.length;i++)	
			_values.push(arguments[i].value);		

		$(this.element).val(_values);		
	}
	
	getSelectedIndex() {	
		var _activeValues = $(this.element).val();
		var _active = [];
		for(var i=0;i<this.items.length;i++)
			if (_activeValues.includes(this.items[i].value))
				_active.push(i);

		return _active;
	}
	
	setSelectedIndex(/* indexes to select */) {		
		var _items = [];
		for(var i=0;i<arguments.length;i++)	
			_items.push(this.items[arguments[i]]);		

		this.setSelected.apply(this,_items);
	}

	refreshItems() {
		this.clear();
		for(var i=0;i<this.items.length;i++)
			this.items[i].addTo(this);
	}

	get multipleSelection() {
		return (this.hasAttribute("multiple"));
	}
	
	set multipleSelection(_multiple_selection)	{
		if (this.multipleSelection == true)
			this.removeAttribute("multiple");
		
		if (_multiple_selection)
			this.addAttribute("multiple");
	}
}

class tkMediaPlayer extends tkWidget {
	constructor(_tag) {
		super(_tag);
	}

	get source() {
		return this.element.src;
	}

	set source(_source) {
		this.element.src = _source;
	}
	
	get showControls() {
		return (this.hasAttribute("controls"));
	}
	
	set showControls(_visible)	{
		if (this.showControls == true)
			this.removeAttribute("controls");
		
		if (_visible)
			this.addAttribute("controls");
	}
	
	get autoplay()	{
		return (this.hasAttribute("autoplay"));
	}
	
	set autoplay(_enabled) {
		if (this.autoplay == true)
			this.removeAttribute("autoplay");
		
		if (_enabled) {
			var auto = document.createAttribute("autoplay"); 
			this.setAttributeNode(auto);
		}
	}
	
	isPaused()	{
		return this.element.paused;
	}
	
	play()	{
		this.element.play();
	}
	
	pause()	{
		this.element.pause();
	}

	togglePlay() {
		if(this.isPaused()) 
			this.play();
		else
			this.pause();
	}
	
	get loop()	{
		return this.element.loop;
	}
	
	set loop(_loop)	{
		this.element.loop = _loop;
	}
	
	get mute()	{
		return this.element.muted;
	}
	
	set mute(_mute)	{
		this.element.muted = _mute;
	}
	
	get currentTime() {
		return this.element.currentTime;
	}
	
	set currentTime(_time)	{
		this.element.currentTime = _time;
	}
	
	getDuration()	{
		return this.element.duration;
	}
	
	get playbackRate()	{
		return this.element.playbackRate;
	}
	
	set playbackRate(_rate)	{
		this.element.playbackRate = _rate;
	}
	
	getNetworkState()	{
		return this.element.networkState;
	}
	
	getReadyState()	{
		return this.element.readyState;
	}
	
	getSeekable()	{
		return this.element.seekable;
	}
	
	isSeeking()	{
		return this.element.seeking;
	}
	
	get textTracks()	{
		return this.element.textTracks;
	}
	
	set textTracks(_tracks)	{
		this.element.textTracks = _Tracks;
	}
	
	get volume()	{
		return this.element.volume;
	}
	
	set volume(_volume)	{
		this.element.volume = _volume;
	}
	
	canPlay(_type)	{
		return this.element.canPlayType(_type);
	}
}

class tkVideoPlayer extends tkMediaPlayer {
	constructor()	{
		super("video");
		this.showControls = true;
	}	
}

class tkAudioPlayer extends tkMediaPlayer {
	constructor() {
		super("audio");
		this.showControls = true;
	}
}

class tkImage extends tkWidget {
	constructor() {
		super("img");
	}
	
	// Image source
	get source() {
		return this.element.src;
	}

	set source(_source) {
		this.element.src = _source;
	}
	
	// Image alternative text
	get alt() {
		return this.element.alt;
	}

	set alt(_alt) {
		this.element.alt = _alt;
	}
}

var tkProgressColor= {
	BLUE: "tkProgressBarBlue",
	GRAY: "tkProgressBarGray",
	RED: "tkProgressBarRed",
	ORANGE: "tkProgressBarOrange",
	YELLOW: "tkProgressBarYellow",
	GREEN: "tkProgressBarGreen"
};

class tkProgress extends tkWidget {
	constructor(_value) {
		super("div");
		this.className = "progress tkProgress";

		this.progressBar = new tkDiv();
		this.progressBar.className = "progress-bar";
		this.progressBar.role = "progressbar"
		this.add(this.progressBar);

		this.progressBarPercentage = new tkText("span");
		this.progressBar.add(this.progressBarPercentage);

		this.showPercentage = true;

		/* A map (key/value pairs) of values:
			threshold = tkBackgroundStyle
		*/		
		this.thresholds = new Map([
			[0, tkProgressColor.RED],
			[25, tkProgressColor.ORANGE],
			[50, tkProgressColor.YELLOW],
			[75, tkProgressColor.GREEN],
		]);

		this.useThresholds = true;

		this.max = 100;	
		this.value = (_value) ? _value : 50;	
	}
	
	get max() {
		return this._max;
	}
	
	set max(_max) {
		this._max = _max;
		this.updateProgress();
	}
	
	get value()	{
		return this._value;
	}
	
	set value(_value) {
		this._value = _value;
		this.updateProgress();
	}

	get showPercentage() {
		return (this.progressBarPercentage.display != "none");
	}

	set showPercentage(_show_percentage) {
		this.progressBarPercentage.display = (_show_percentage) ? "block" : "none";
	}

	get useThresholds() {
		return this._use_thresholds;
	}

	set useThresholds(_use_thresholds) {
		this._use_thresholds = _use_thresholds;
		this.updateProgress();
	}

	setColor(_color) {		
		this.progressBar.className = "progress-bar " + _color;
	}

	updateProgress() {
		this.progressBar.width = this.getPercentage() + "%";
		this.progressBarPercentage.text = this.getPercentage() + "%";

		if(this.useThresholds)
			for(var [key, value] of this.thresholds)
				if (this.getPercentage()>=key) 
					this.setColor(value);
	}

	getPercentage() {
		return (this.value/this.max)*100;
	}
}

class tkMeter extends tkWidget {
	constructor() {
		super("meter");
	}
	
	get value()	{
		return this.element.value;
	}
	
	set value(_value) {
		this.element.value = _value;
	}
	
	get high()	{
		return this.element.high;
	}
	
	set high(_high)	{
		this.element.high = _high;
	}
	
	get low() {
		return this.element.low;
	}
	
	set low(_low) {
		this.element.low = _low;
	}
	
	get max() {
		return this.element.max;
	}
	
	set max(_max) {
		this.element.max = _max;
	}
	
	get min() {
		return this.element.min;
	}
	
	set min(_min) {
		this.element.min = _min;
	}
	
	get optimum() {
		return this.element.optimum;
	}
	
	set optimum(_optimum) {
		this.element.optimum = _optimum;
	}
}

class tkReviewMeter extends tkMeter {
	constructor(_rating) {
		super();
		
		this.value = _rating;
		this.max = 5;
		this.min = 0;
		this.optimum = 5;
		this.low = 2;
		this.high = 4;
	}
}

class tkNotebookPage {
	constructor(_title,_id) {
		// A <li> that holds the tab button		
		this.tabHolder = new tkWidget("li");
		this.tabHolder.className = "nav-item";
		
		this.tabButton = new tkLink(_title, "#"+_id);
		this.tabButton.className = "nav-link";
		this.tabButton.setAttribute("data-toggle","tab");
		this.tabButton.role = "tab";
		this.tabHolder.add(this.tabButton);
		
		/*	A <div> that contains the content that
			is brought up when the tab is clicked	*/
		this.content = new tkDiv();
		this.content.id = _id;
		this.content.role = "tabpanel";
		this.content.className = "tab-pane fade";
	}
	
	get title() {
		return this.tabButton.text;
	}
	
	set title(_string) {
		this.tabButton.text = _string;
	}
}

class tkNotebook extends tkWidget {
	constructor() {
		super("div");
		this.e.className = "tkNotebook";
		
		this.tabBar = new tkWidget("ul");
		this.tabBar.className = "nav nav-tabs";
		this.tabBar.role = "tablist";
		this.add(this.tabBar);
		
		this.contentPanel = make("div");
		this.contentPanel.className = "tab-content";
		this.element.appendChild(this.contentPanel);
		
		/*	Whether or not to wrap around when the
			end of index is reached*/
		this.wrap = true;

		/* Whether to jump to a newly added tab */
		this.newestTabActive = false;
		
		this.tabs = [];
		this.activeIndex = 0;		

		/* Custom events:
		   activeChanged: When the active tab is changed
		*/
	}
	
	addPage(/* pages to add */) {
		for(var i=0;i<arguments.length;i++) {
			var _page = arguments[i];

			this.tabBar.add(_page.tabHolder);
			this.contentPanel.appendChild(_page.content.e);
			this.tabs.push(_page);
			
			if (this.newestTabActive)
				this.active = _page;
			else if (this.active == undefined)
				this.activeIndex = 0;
				
			var _notebook = this;
			$(_page.tabButton.e).on('shown.bs.tab', function (e) {
				_notebook.trigger("activeChanged");
			});

			/* For some reason Bootstrap doesn't trigger the tab shown 
			   event when a new tab is added to an empty notebook. */
			if (this.tabs.length == 1) 
				this.trigger("activeChanged");
		}
	}
	
	removePage(/* pages to remove */) {		
		for(var i=0;i<arguments.length;i++) {
			var _old_active = this.activeIndex;
			var _page = arguments[i];

			this.tabBar.remove(_page.tabHolder);
			this.contentPanel.removeChild(_page.content.e);
			this.tabs.splice(this.getIndex(_page),1);
			this.activeIndex = Math.max(0,_old_active-1);

			$(_page.tabButton.e).off('shown.bs.tab');
		}
	}	

	clear() {
		while(this.pageCount > 0)
			this.removePage(this.tabs[this.tabs.length-1]);
	}

	get active() {
		return this.tabs[this.activeIndex];
	}

	set active(_page) {
		if(!_page) {
			this.trigger("activeChanged");
			return;			
		}
		
		$(_page.tabButton.e).tab('show');
	}
	
	get activeIndex() {
		for(var i=0;i<this.tabBar.e.childNodes.length;i++)
			if (this.tabBar.e.childNodes[i].firstChild.classList.contains("active"))
				return i;
	}
	
	set activeIndex(_index) {
		this.active = this.tabs[_index];
	}

	get tabsVisible() {
		return (this.tabBar.e.style.display != "none");
	}
	
	set tabsVisible(_visible) {
		this.tabBar.e.style.display = ((_visible) ? "block" : "none");
	}
	
	getIndex(_page) {
		return this.tabs.indexOf(_page);
	}

	get pageCount() {
		return this.tabs.length;
	}
		
	back() {
		if (this.activeIndex-1 < 0 && this.wrap)
			this.activeIndex = this.tabs.length-1;
		else
			this.activeIndex = Math.max(0, this.activeIndex-1);		
	}
	
	next() {
		if (this.activeIndex+1 >= this.tabs.length && this.wrap)
			this.activeIndex = 0;
		else
			this.activeIndex = Math.min(this.tabs.length-1, this.activeIndex+1);		
	}
}

class tkRibbon extends tkNotebook {
	constructor() {
		super();
		this.element.className = this.element.className + " ribbon";
		this.tabBar.className = this.tabBar.className + " ribbon-tabs";
		this.contentPanel.className = this.contentPanel.className + " ribbon-content";
	}
}

class tkRibbonPage extends tkNotebookPage {
	constructor(_title,_id)	{
		super(_title,_id);
	}
}

class tkRibbonGroup extends tkWidget {
	constructor() {
		super("div");
		this.className = "tkRibbonGroup";

		this.contentArea = make("div");
		this.contentArea.className = "fill";
		this.contentArea.style.display = "inline-flex";
		this.element.appendChild(this.contentArea);

		this.groupTitle = make("span");
		this.groupTitle.className = "tkRibbonGroupTitle";
		this.element.appendChild(this.groupTitle);

		this.groupTitleTextNode = document.createTextNode("");
		this.groupTitle.appendChild(this.groupTitleTextNode);
	}

	get title()	{
		return this.groupTitleTextNode.nodeValue;
	}
	
	set title(_string) {
		this.groupTitleTextNode.nodeValue = _string;
	}

	addButton(_button) {
		_button.className = "tkRibbonButton";
		this.contentArea.appendChild(_button);
	}

	removeButton(_button) {
		this.contentArea.removeChild(_button);
	}
}

class tkSlide extends tkNotebookPage {
	constructor(_id) {
		super("", _id);
	}
}

class tkSlideshow extends tkNotebook {
	constructor() {
		super();
		this.element.className = this.element.className + " tkSlideshow";
		this.tabsVisible = false;
	}
}

class tkListItem extends tkText {
	constructor() {
		super("li");
		this.element.className = "list-group-item";

		var item = this;
		this.clickEvent = item.toggleSelected;
		this.element.addEventListener('mouseup', function () {
			item.clickEvent();
		});
	}
	
	toggleSelected() {
		this.selected = !(this.selected);
	}

	get selected() {
		return this.hasClass("active");
	}

	set selected(_selected) {
		if(_selected)
			this.addClass("active");
		else
			this.removeClass("active");
	}
}

class tkList extends tkWidget {
	constructor(_on_selection_changed) {
		super("ul");
		this.element.className = "list-group";

		this.items = [];
		this.allowMultipleSelection = false;
		this.onSelectionChanged = (_on_selection_changed) ? _on_selection_changed : function() {};
	}
	
	get allowMultipleSelection() {
		return this._allow_multiple_selection;
	}

	set allowMultipleSelection(_allow_multiple_selection) {
		if (!_allow_multiple_selection && this.selected.length > 1)
			this.selected = this.selected[0];
		this._allow_multiple_selection = _allow_multiple_selection;
	}
	
	selectFirstAvailable() {
		if(this.selectionExists && this.items.length > 0)
			this.selected = [this.items[0]];
	}
	
	addItem(_item) {
		this.element.appendChild(_item.element);
		this.items.push(_item);

		// select only this item & deselect all others when clicked if allowMultipleSelection is false
		var list = this;
		_item.element.addEventListener('mouseup', function () {
			if(!list.allowMultipleSelection) 
				list.selected = [_item];
				list.onSelectionChanged();
		});

		this.selectFirstAvailable();
	}
	
	removeItem(_item) {
		this.items.splice(_item,1);
		this.element.removeChild(_item.element);
		
		this.selectFirstAvailable();
	}

	// returns array of selected items
	get selected() {
		var selectedItems = [];
		for(var i=0;i<this.items.length;i++)
			if (this.items[i].selected)
				selectedItems.push(this.items[i]);
		return selectedItems;
	}

	set selected(_selected) {
		this.deselectAll();
		
		for(var i=0;i<_selected.length;i++) {
			 var currentItem = this.items.find((item) => item == _selected[i])
			 if (currentItem) 
			 {
				 currentItem.selected = true;
				 if (!this.allowMultipleSelection) break;
			 }
		 }
	}

	getFirstSelected() {
		return (this.selected.length >= 1) ? this.selected[0] : undefined;
	}

	get selectionExists() {
		for(var i=0;i<this.items.length;i++)
			if (this.isSelected(this.items[i])) 
				return true;			
				
		return false;		
	}
	
	// return true if all items are selected
	isSelected(_items) {
		for(var i=0;i<_items.length;i++) {
			if (this.items.indexOf(_items[i]) == -1) 
				return false;


			var currentItem = this.items.find((item) => item == _items[i])
			if (!currentItem.selected) 
			return false;
		}

		 return true;
	}

	deselectAll() {
		for(var i=0;i<this.items.length;i++)
			this.items[i].selected = false;
	}

	selectAll()	{
		this.selected = this.items;
	}
}

class tkSlider extends tkWidget {
	constructor() {
		super("input");
		this.className = "tkSlider";
		this.setAttribute("type","range");
	}
	
	get min() {
		return this.e.min;
	}
	
	set min(_min) {		
		this.e.min = _min;
	}
	
	get max() {
		return this.e.max;
	}
	
	set max(_max) {
		this.e.max = _max;
	}
	
	get value() {
		return this.e.value;
	}
	
	set value(_value) {
		this.e.value = _value;	
	}
	
	get step() {
		return this.e.step;
	}
	
	set step(_step) {
		this.e.step = _step;		
	}
	
	get valueAsNumber() {
		return this.e.valueAsNumber;
	}
}

class tkTextEdit extends tkText {
	constructor() {
		super("textarea");
		this.className = "tkTextEdit";

		var textEdit = this;
		this.element.addEventListener('mouseup', function () {
			textEdit.selected_text = this.value.substring(this.selectionStart, this.selectionEnd)
		});
	}

	// Characters, not pixels
	get width() {
		return this.getAttribute("cols");
	}
	
	set width(_width) {
		this.setAttribute("cols",_width);
	}
		
	get height() {
		return this.getAttribute("rows");
	}

	set height(_height) {
		this.setAttribute("rows",_height);
	}
	
	setSize(_width,_height) {
		this.width = _width;
		this.height = _height;
	}

	get resizable() {
		return !this.hasClass("noResize");
	}

	set resizable(_resizable) {
		if (_resizable)
			this.removeClass("noResize")
		else
			this.addClass("noResize")
	}

	get autofocus() {
		return this.hasAttribute("autofocus");
	}

	set autofocus(_autofocus) {
		if (this.autofocus == true)
			this.removeAttribute("autofocus");
		
		if (_autofocus) {
			var attr = document.createAttribute("autofocus"); 
			this.setAttributeNode(attr);
		}
	}

	focus() {
		this.element.focus();
	}

	get disabled() {
		return this.hasAttribute("disabled");
	}

	set disabled(_disabled) {
		if (this.disabled == true)
			this.removeAttribute("disabled");
		
		if (_disabled) {
			var attr = document.createAttribute("disabled"); 
			this.setAttributeNode(attr);
		}
	}

	get maxLength() {
		return this.getAttribute("maxLength");
	}

	set maxLength(_max_length) {
		this.setAttribute("maxLength",_max_length);
	}

	get placeholder() {
		return this.getAttribute("placeholder");
	}

	set placeholder(_text) {
		this.setAttribute("placeholder",_text);
	}

	get readOnly() {
		return this.hasAttribute("readonly");
	}

	set readOnly(_read_only) {
		if (this.readOnly == true)
			this.removeAttribute("readonly");
		
		if (_read_only) {
			var attr = document.createAttribute("readonly"); 
			this.setAttributeNode(attr);
		}
		this.setAttribute("readonly",_read_only);
	}

	getSelectedText() {
		return this.selected_text;
	}
	
	get text() {
		return this.e.value;
	}
	
	set text(_string) {
		this.e.value = _string;
	}

	/**
	 * Insert text at the caret position.
	 * @param {String} _text The text to insert
	 */
	insertText(_text) {		
		insertTextAtCaret(this.element, _text);
	}
}

// Forms
class tkInput extends tkWidget {
	constructor() {
		super("input");
	}

	get type() {
		this.getAttribute("type");
	}

	set type(_type) {
		this.setAttribute("type",_type);
	}

	get name() {
		this.getAttribute("name");
	}

	set name(_name) {
		this.setAttribute("name",_name);
	}
	
	get readOnly() {
		return this.e.readonly;
	}
	
	set readOnly(_read_only) {
		this.e.readonly = _read_only;
	}
}

class tkTextInput extends tkInput {
	constructor() {
		super();
		this.type = "text";
		this.className = "tkTextInput";
	}
	
	get text() {
		return this.e.value;
	}
	
	set text(_text) {
		this.e.value = _text;
	}
			
	get defaultText() {
		return this.e.defaultValue;
	}
	
	set defaultText(_default_value) {
		this.e.defaultValue = _default_value;
	}
	
	get placeholder() {
		return this.e.placeholder;
	}
	
	set placeholder(_placeholder) {
		this.e.placeholder = _placeholder;
	}
	
	get maxLength() {
		return this.e.maxLength;
	}
	
	set maxLength(_max_length) {
		this.e.maxLength = _read_only;
	}

	insertText(_text) {
		insertTextAtCaret(this.element,_text);
	}
}

class tkRange extends tkInput {
	constructor() {
		super();
		this.type = "range";
	}
}

var tkDialogResult= {
	NOTHING: 0,
	OK: 1,
	CANCEL: 2,
	CLOSE: 3,
	ABORT: 4,
	IGNORE: 5,
	YES: 6,
	NO: 7,
	RETRY: 8
  };

class tkDialog extends tkWidget {
	constructor(_title,_choices) {
		super("div");
		this.className = "modal fade";

		this.modal = make("div");
		this.modal.className = "modal-dialog modal-dialog-centered";
		this.modal.role = "document";
		this.element.appendChild(this.modal);

		this.modalContent = make("div");
		this.modalContent.className = "modal-content";
		this.modal.appendChild(this.modalContent);
				
		this.modalHeader = make("div");
		this.modalHeader.className = "modal-header";
		this.modalContent.appendChild(this.modalHeader);

		this.modalTitle =  make("h5");
		this.titleNode = say("");
		this.title = (_title) ? _title : "";
		this.modalTitle.appendChild(this.titleNode);
		this.modalTitle.className = "modal-title";
		this.modalHeader.appendChild(this.modalTitle);

		this.modalBody = make("div");
		this.modalBody.className = "modal-body";
		this.modalContent.appendChild(this.modalBody);

		this.modalFooter = make("div");
		this.modalFooter.className = "modal-footer tkButtonPanel";
		this.modalContent.appendChild(this.modalFooter);
		
		/* 	An array of tkDialogResult listing 
			the buttons that are shown */
		this.choices = (_choices) ? _choices : [tkDialogResult.OK];
		this.choicesButtons = [];

		this.isOpen = false;
	}

	addContent(/* Elements to add to dialog body */) {		
		for (var i=0;i<arguments.length;i++)
			this.modalBody.appendChild(arguments[i]);
	}
	
	removeContent(/* Elements to remove from dialog body */)	{
		for (var i=0;i<arguments.length;i++)
			this.modalBody.removeChild(arguments[i]);
	}

	get title()	{
		return this.modalTitle.nodeValue;
	}

	set title(_title) {
		if (_title == "")
			this.modalHeader.style.display = "none";
		else
			this.modalHeader.style.display = "block";

		this.titleNode.nodeValue = _title;
	}

	static show(_text,_title,_choices,_on_dialog_result) {
		var dlg = new tkDialog(_title,_choices);
		dlg.addContent(sayP(_text));
		dlg.show(function(dialogResult) {
			if(_on_dialog_result) 
				_on_dialog_result(dialogResult);
		});
	}

	/*	Returns a tkDialogResult that 
		corresponds to the button clicked */
	show(_on_dialog_result)	{
		this.isOpen = true;
		$(this.element).modal("show");

		if(!_on_dialog_result) 
			_on_dialog_result = function() {};
		
		// Make sure to clear buttons from previous opening
		var buttonArea = makeElement(this.modalFooter);
		buttonArea.clear();
		
		var dialog = this;

		this.choicesButtons = [];
		if (this.choices.length < 1)
			this.modalFooter.style.display = "none";
		else
			this.modalFooter.style.display = "block";

		for(var i=0;i<this.choices.length;i++) {
			var button = new tkButton();
			var result = tkDialogResult.NOTHING;

			switch (this.choices[i]) {
				case tkDialogResult.NOTHING:
					continue;
				case tkDialogResult.OK:
					button.text = "OK";
					button.element.onclick = function() {
						result = tkDialogResult.OK;
						_on_dialog_result(result);
						dialog.close();
					};
					break;
				case tkDialogResult.CANCEL:
					button.text = "Cancel";
					button.className = "btn btn-secondary";
					button.element.onclick = function() {
						result = tkDialogResult.CANCEL;
						_on_dialog_result(result);
						dialog.close();
					};
					break;
				case tkDialogResult.CLOSE:
						button.text = "Close";
						button.className = "btn btn-secondary";
						button.element.onclick = function() {
							result = tkDialogResult.CLOSE;
							_on_dialog_result(result);
							dialog.close();
						};
						break;
				case tkDialogResult.ABORT:
					button.text = "Abort";
					button.className = "btn btn-danger";
					button.element.onclick = function() {
						result = tkDialogResult.ABORT;
						_on_dialog_result(result);
						dialog.close();
					};
					break;
				case tkDialogResult.IGNORE:
					button.text = "Ignore";
					button.className = "btn btn-secondary";
					button.element.onclick = function() {
						result = tkDialogResult.IGNORE;
						_on_dialog_result(result);
						dialog.close();
					};
					break;
				case tkDialogResult.YES:
					button.text = "Yes";
					button.element.onclick = function() {
						result = tkDialogResult.YES;
						_on_dialog_result(result);
						dialog.close();
					};
					break;
				case tkDialogResult.NO:
					button.text = "No";
					button.className = "btn btn-secondary";
					button.element.onclick = function() {
						result = tkDialogResult.NO;
						_on_dialog_result(result);
						dialog.close();
					};
					break;
				case tkDialogResult.RETRY:
					button.text = "Retry";
					button.className = "btn btn-secondary";
					button.element.onclick = function() {
						result = tkDialogResult.RETRY;
						_on_dialog_result(result);
						dialog.close();
					};
					break;
			}

			this.modalFooter.appendChild(button.element);
			this.choicesButtons.push(button);
		}
	}

	close()	{
		this.isOpen = false;
		$(this.element).modal('hide');

		// Remove dialog element from DOM when dialog is closed
		var dlg = this;
		$(this.element).on('hidden.bs.modal', function (e) {			
			dlg.delete();
		});
	}
}

class aboutTamarack {
	static show() {
		var aboutDialog = new tkDialog();

		var logo = sayP("tamarack " + tamarack.version);
		logo.className = "h5 tkAboutDialogLogo";
		var lines = [logo, sayP("By Ian Martinez")];
		var credits = [	sayText("Bootstrap","h5"), sayP("Copyright (c) 2011-2018 Twitter, Inc"),
						sayText("jQuery","h5"), sayP("Copyright (c) JS Foundation"),
						sayText("Breeze Icons","h5"), sayP("Copyright (c) 2014 Uri Herrera and others") ];

		aboutDialog.notebook = new tkNotebook();

		var aboutTab = new tkNotebookPage("Tamarack", "aboutTab");
		lines.forEach((e) => aboutTab.content.addElement(e));

		var creditsTab = new tkNotebookPage("Credits", "creditsTab");
		creditsTab.content.addClass("tkAboutDialogCredits");
		credits.forEach((e) => creditsTab.content.addElement(e));

		aboutDialog.notebook.addPage(aboutTab, creditsTab);
		aboutDialog.addContent(aboutDialog.notebook.element);

		aboutDialog.choices = [tkDialogResult.OK];
		aboutDialog.title = "About";

		aboutDialog.show();
	}
}

class tkFontDialog extends tkDialog {
	constructor() {
		super();

		this.choices = [tkDialogResult.OK,tkDialogResult.CANCEL];

		this.fontPicker = new tkFontPicker();
		this.addContent(this.fontPicker.element);
		this.element.style.minWidth = "35%";
		this.title = "Font";
		this.addClass("tkFontDialog");
	}

	static show(_font,_on_dialog_result) {
		var dlg = new tkFontDialog();
		dlg.font = _font;		
		dlg.show(function(dialogResult) {
			if(_on_dialog_result) 
				_on_dialog_result(dialogResult,dlg.font);
		});
	}
	
	get font() {
		return this.fontPicker.font;
	}
	
	set font(_font)	{
		this.fontPicker.font = _font;
	}
}

class tkFontPicker extends tkWidget {
	constructor() {
		super("div");

		this.className = "tkFontPicker";
		this.choices = [tkDialogResult.OK,tkDialogResult.CANCEL];
		
		this.fontFamilyTitle = sayText("Family:", "h6");
		var current_picker = this;
		this.fontFamilyList = new tkList(function() {
			current_picker._font.family = current_picker.fontFamilyList.getFirstSelected().text;
			current_picker.refreshFont();
		});

		this.fontFamilyList.allowMultipleSelection = false;
		this.fontFamilyArray = tkFont.getAvailableFonts();
		this.fontFamilyArray.forEach((value) => {
			var item = new tkListItem();
			item.element.style.fontFamily = value;
			item.text = value;
			this.fontFamilyList.addItem(item);
		});

		this.fontDemoTitle = sayText("Preview:", "h6");
		this.fontDemo = new tkText("pre");
		this.fontDemo.className = "tkFontPickerPreview";
		this.fontDemo.text = "ABCDEFGHIJKLMNOPQRSTUVWXYZ\nabcdefghijklmnopqrstuvwxyz\n1234567890 ?!.";

		this.addElement(this.fontFamilyTitle,this.fontFamilyList.element,this.fontDemoTitle, this.fontDemo.element);

		this._font = new tkFont(this.fontFamilyArray[0],"24px","normal","normal");
		this.refreshFont();
	}

	get font() {
		return this._font;
	}

	set font(_font)	{		
		this._font = _font;
		this.refreshFont();
	}

	refreshFont() {
		this.fontDemo.style.font = this._font.getCss();
	}
}

class tkColorDialog extends tkDialog {
	constructor() {
		super();

		this.choices = [tkDialogResult.OK,tkDialogResult.CANCEL];

		this.colorPicker = new tkColorPicker();
		this.addContent(this.colorPicker.element);
		this.title = "Color";
		this.addClass("tkColorDialog");
	}

	static show(_color,_on_dialog_result) {
		var dlg = new tkColorDialog();
		dlg.color = _color;		
		dlg.show(function(dialogResult) {
			if(_on_dialog_result) 
				_on_dialog_result(dialogResult, dlg.color);
		});
	}

	get color()	{
		return this.colorPicker.color;
	}
	
	set color(_color) {
		this.colorPicker.color = _color;
	}
}

class tkColorPicker extends tkWidget {
	constructor() {
		super("div");
		
		this.className = "tkColorPicker";

		this.leftPane = make("div");
		this.leftPane.className = "tkColorPickerLeft";
		this.element.appendChild(this.leftPane);

		this.rightPane = make("div");
		this.rightPane.className = "tkColorPickerRight";
		this.element.appendChild(this.rightPane);

		this.colorPreview = make("div");
		this.colorPreview.className = "tkColorPickerPreview";
		this.colorPreviewContainer = make("div");
		this.colorPreviewContainer.className = "tkColorPickerPreviewContainer";
		this.colorPreviewContainer.appendChild(this.colorPreview);
		this.rightPane.appendChild(this.colorPreviewContainer);

		this.choices = [tkDialogResult.OK,tkDialogResult.CANCEL];

		var colorPicker = this;
		
		this.hueSlider = new tkSlider();
		this.hueSlider.className= "tkColorSlider"; 
		this.hueSlider.tooltip = "Hue";
		this.hueSlider.min = 0;
		this.hueSlider.max = 360;
		this.hueSlider.value = 0;
		this.hueSlider.e.onchange = function() {
			colorPicker.grabColor();
		};
		this.hueSliderContainer = make("div");
		this.hueSliderContainer.className = "tkColorSliderContainer";
		this.hueSlider.addToElement(this.hueSliderContainer);
		this.leftPane.appendChild(this.hueSliderContainer);

		this.saturationSlider = new tkSlider();		
		this.saturationSlider.className= "tkColorSlider"; 
		this.saturationSlider.tooltip = "Saturation";
		this.saturationSlider.min = 0;
		this.saturationSlider.max = 100;
		this.saturationSlider.value = 50;
		this.saturationSlider.e.onchange = function() {
			colorPicker.grabColor();
		};
		this.saturationSliderContainer = make("div");
		this.saturationSliderContainer.className = "tkColorSliderContainer";
		this.saturationSlider.addToElement(this.saturationSliderContainer);
		this.leftPane.appendChild(this.saturationSliderContainer);

		this.lightnessSlider = new tkSlider();	
		this.lightnessSlider.className= "tkColorSlider"; 
		this.lightnessSlider.tooltip = "Lightness";
		this.lightnessSlider.min = 0;
		this.lightnessSlider.max = 100;
		this.lightnessSlider.value = 50;
		this.lightnessSlider.e.onchange = function() {
			colorPicker.grabColor();			
		};
		this.lightnessSliderContainer = make("div");
		this.lightnessSliderContainer.className = "tkColorSliderContainer";
		this.lightnessSlider.addToElement(this.lightnessSliderContainer);
		this.leftPane.appendChild(this.lightnessSliderContainer);

		this.alphaSlider = new tkSlider();
		this.alphaSlider.className= "tkColorSlider"; 
		this.alphaSlider.tooltip = "Alpha";
		this.alphaSlider.min = 0;
		this.alphaSlider.max = 1;
		this.alphaSlider.value = 1;
		this.alphaSlider.step = 0.01;
		this.alphaSlider.e.onchange = function() {
			colorPicker.grabColor();
		};
		this.alphaSliderContainer = make("div");
		this.alphaSliderContainer.className = "tkColorSliderContainer";
		this.alphaSlider.addToElement(this.alphaSliderContainer);
		this.leftPane.appendChild(this.alphaSliderContainer);

		this.textInput = new tkColorTextInput();
		this.textInput.onInput = function()	{
			if(colorPicker.textInput.isValidColor()) {
				var new_color = new tkColor();
				new_color.parse(colorPicker.textInput.element.value);
				colorPicker.color = new_color;				
			}
		};

		this.textInput.addToElement(this.leftPane);
		this.internalColor = new tkColor();
		this.internalColor.fromRgba(0,0,0,1);
		this.color = this.internalColor;
		this.updateColor();
	}

	get color()	{
		return this.internalColor;
	}

	set color(_color) {		
		this.internalColor = _color;
		this.updateColor();
	}

	// Set color to the sliders' values
	grabColor() {
		var new_color = new tkColor();
		new_color.h = this.hueSlider.valueAsNumber;
		new_color.s = this.saturationSlider.valueAsNumber;
		new_color.l = this.lightnessSlider.valueAsNumber;		
		new_color.a = this.alphaSlider.valueAsNumber;
		
		this.color = new_color;
	}
	
	// Update the sliders to reflect the current color
	updateColor() {		
		this.hueSlider.value = this.color.h;
		this.saturationSlider.value = this.color.s;		
		this.lightnessSlider.value = this.color.l;
		this.alphaSlider.value = this.color.a;		
				
		var hue = [];
		for(var i=0;i<=360;i++)
			hue.push("hsla(" + i + "," + this.saturationSlider.valueAsNumber + "%," + this.lightnessSlider.valueAsNumber + "%," + this.alphaSlider.valueAsNumber + ")");	
		this.hueSlider.e.style.background =  createLinearGradient(90,hue);
		
		var saturation = [];
		for(var i=0;i<=100;i++)
			saturation.push("hsla(" + this.hueSlider.valueAsNumber + "," + i + "%," + this.lightnessSlider.valueAsNumber + "%," + this.alphaSlider.valueAsNumber + ")");	
		this.saturationSlider.e.style.background =  createLinearGradient(90,saturation);	
		
		var lightness = [];
		for(var i=0;i<=100;i++)
			lightness.push("hsla(" + this.hueSlider.valueAsNumber + "," + this.saturationSlider.valueAsNumber + "%," + i + "%," + this.alphaSlider.valueAsNumber + ")");	
		this.lightnessSlider.e.style.background =  createLinearGradient(90,lightness);
		
		var alpha = [];
		for(var i=0;i<=1;i+=0.01)
			alpha.push("hsla(" + this.hueSlider.valueAsNumber + "," + this.saturationSlider.valueAsNumber + "%," + this.lightnessSlider.valueAsNumber + "%," + i + ")");	
		this.alphaSlider.e.style.background =  createLinearGradient(90,alpha);
		
		this.colorPreview.style.backgroundColor = this.color.getHslaString();
		this.textInput.e.value = this.color.getHslaString();
	}
}

class tkColorTextInput extends tkTextInput {
	constructor() {
		super();

		this.onInput = function() {};
		this.isUserInput = true;
		var textInput = this;
		this.element.addEventListener("input", function() {
			if(textInput.isUserInput)
				textInput.onInput();
		});
	}

	isValidColor()	{
		return tkColor.isColor(this.element.value);
	}
}

class tkGroupBox extends tkWidget {
	constructor(_title,_description) {
		super("card");
		this.className = "card tkGroupBox";

		this.header = new tkText("h5",_title);
		this.header.className = "card-header";

		this.contentArea = new tkDiv();
		this.contentArea.className = "card-body";

		this.descriptionWidget = new tkText("p");
		this.descriptionWidget.className = "card-footer tkGroupBoxDescription";
		this.description = _description;

		this.add(this.header, this.descriptionWidget, this.contentArea);
	}

	get title() {
		return this.header.text;
	}

	set title(_title) {
		this.header.text = _title;
	}

	get description() {
		return this.descriptionWidget.text;
	}

	set description(_description) {
		if (_description) {
			this.descriptionWidget.style.display = "block"; 
			this.descriptionWidget.text = _description;
		} else {
			this.descriptionWidget.style.display = "none"; 
		}
	}
	
	addContent(/* items to add */) {
		this.contentArea.add.apply(this.contentArea, arguments);
	}	
	
	removeContent(/* items to remove */) {
		this.contentArea.remove.apply(this.contentArea, arguments);
	}

	clearContent() {
		this.contentArea.clear();
	}
}