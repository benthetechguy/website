//// Class (structure) Color ////////////////////////////////////////
// Represents an RGB(A) colour

function Color(r, g, b, a)	{
	if(arguments.length == 0)	{ // default constructor
		this.red = this.green = this.blue = 0;
		this.alpha = NaN; // not specified
	}
	else if(arguments.length == 1)	{ // copy constructor
		this.red = r.red;
		this.green = r.green;
		this.blue = r.blue;
		this.alpha = r.alpha;
	}
	else if(arguments.length == 3 || arguments.length == 4)	{
		this.red = parseInt(r).constrain(0, 255);
		this.green = parseInt(g).constrain(0, 255);
		this.blue = parseInt(b).constrain(0, 255);
		if(arguments.length == 4)
			this.alpha = parseFloat(a).constrain(0, 1);
		else
			this.alpha = NaN;
	}
}

Color.prototype.toString = function()	{
	if(isNaN(this.alpha))
		return 'rgb(' + this.red + ', ' + this.green + ', ' + this.blue + ')';
	else
		return 'rgba(' + this.red + ', ' + this.green + ', ' + this.blue + ', ' + this.alpha + ')';
}

/*	Parse a colour specified in HTML format and
 *	return as a Color object, alpha is optional
 */
Color.parse = function(scol, alpha)	{
	var base=10, r, g, b;
	if(scol.substr(0, 3) == 'rgb')	{ // parsing RGB(A) text
		var groups = scol.match(/(a)?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*((?:1|0)?\.\d+|1|0)\s*)?\)/)
		var a = groups[1];
		var r = groups[2];
		var g = groups[3];
		var b = groups[4];
		var alpha = groups[5];
		alpha = (a && alpha)? parseFloat(alpha): null;
	}
	else	{
		base = 16;
		if(scol.substr(0,1) == '#')	scol = scol.substr(1);
		var w = scol.length/3;
		if(w != 2 && w != 1) return;
		
		var r = scol.substr(0, w);
		var g = scol.substr(w, w);
		var b = scol.substr(2*w, w);
		
		if(w == 1)	{
			r = r.rep(2);
			g = g.rep(2);
			b = b.rep(2);
		}
	}
	
	return new Color(
		parseInt(r, base), parseInt(g, base),
		parseInt(b, base), alpha
	);
}

Color.prototype.lighter = function(tones)	{
	return new Color(
		(this.red + tones).constrain(0, 255),
		(this.green + tones).constrain(0, 255),
		(this.blue + tones).constrain(0, 255),
		this.alpha);
}

// Alter color in random fassion
// deviation is {base: int, r: int, g: int, b:int, a: float}
Color.prototype.deviate = function(deviation)	{
	var step = 4;
	var dev = deviate(deviation.base/step)*step;
	return new Color(
		(this.red + dev + deviate(deviation.r/step)*step).constrain(0, 255),
		(this.green + dev + deviate(deviation.g/step)*step).constrain(0, 255),
		(this.blue + dev + deviate(deviation.b/step)*step).constrain(0, 255),
		(this.alpha + deviate(deviation.a).constrain(0, 1))
	);
}
