if(!('CanvasRenderingContext2D' in this))	{ // safari fix
	CanvasRenderingContext2D = {}
	CanvasRenderingContext2D.prototype
		= document.createElement('canvas').getContext('2d').__proto__
}
// Extensions for Canvas (CanvasRenderingContext2D) used by tetris

CanvasRenderingContext2D.prototype.sharpRect
  = function(x, y, w, h){with(this)	{
  	fillRect(x, y, w, 1);
	fillRect(x, y+1, 1, h-1);
	fillRect(x, y+h, w+1, 1);
	fillRect(x+w, y, 1, h);
}}

CanvasRenderingContext2D.prototype.vLine = function(x, y, h)	{
	this.fillRect(x, y, 1, h);
}

CanvasRenderingContext2D.prototype.hLine = function(x, y, w)	{
	this.fillRect(x, y, w, 1);
}

CanvasRenderingContext2D.prototype.fillPolygon = function(vertices, fs)	{
	with(this){
		beginPath();
		moveTo(vertices[0], vertices[1]);
		for(var i=2; i<vertices.length; i += 2)lineTo(vertices[i], vertices[i+1]);
		closePath();
		fillStyle = fs;
		fill();
	}
}

CanvasRenderingContext2D.prototype.renderBox = function(color, point)	{
	var origin = new Point(point.x * this.tetris.gridsize.width, point.y * this.tetris.gridsize.height);

	this.translate(origin.x, origin.y);

	if(color == 0)
		this.clearRect(0, 0, this.tetris.box.width, this.tetris.box.height);
	else with(this)	{
		fillStyle = color.toString();
		fillRect(0, 0, tetris.box.width, tetris.box.height);
		fillPolygon(tetris.highlightPath, tetris.highlight);
		fillPolygon(tetris.shadowPath, tetris.shadow);
	}

	this.translate(-origin.x, -origin.y);
	return color;// needed for use with reduce
}

var __7segment = {
	masks: [1008, 384, 872, 968, 408, 728, 760, 1920, 1016, 984, 4, 11], 
	paths: [],
	aspect: 2,
	squeeze: .5, 
	width: .08,
	color:	{off: 'rgba(94, 220, 50, .7)', on: 'rgba(94, 220, 50, .9)'},
	recalcPaths: function(s)	{
		__7segment.squeeze = s;
		__7segment.paths = [];
		
		s = s/(1+s);
		var w = __7segment.width;
		var a = w*__7segment.aspect; // thickness of vertical bars
		var b=w/2, m=a/2; // half widths
		var y=b/3, z=m/3; // paddings
		
/*A*/	__7segment.paths.push([z, 0,	1-z, 0,		1-a-z, w,			a+z, w]);
/*B*/	__7segment.paths.push([1, y,	1, .5-y,	1-a, .5-b-y,	1-a, w+y]);
/*C*/	__7segment.paths.push([1, .5+y,	1, 1-y,		1-a, 1-w-y,		1-a, .5+b+y]);
/*D*/	__7segment.paths.push([1-z, 1,	z, 1, 		a+z, 1-w,			1-a-z, 1-w]);
/*E*/	__7segment.paths.push([0, 1-y,	0, .5+y,		a, .5+b+y,		a, 1-w-y]);
/*F*/	__7segment.paths.push([0, .5-y,	0, y, 		a, w+y, 		a, .5-b-y]);
/*G*/	__7segment.paths.push([z, .5,	a+z, .5-b,	1-a-z, .5-b,	1-z, .5,		1-a-z, .5+b,	a+z, .5+b]);
/*,*/	__7segment.paths.push([1-a-2*z, 1-w-2*y,	1-a-b-z, 1-w-y,	1-3*a, 1-2*w,	1-3*a, 1-3*w,	1-2*a, 1-3*w, 	1-a-2*z, 1-3*b-2*y]);
/*+*/	__7segment.paths.push([.5, .25,	.5+m, .25+b, .5+m, .5-b-2*y,   .5-m, .5-b-2*y, .5-m, .25+b]);
/*+*/	__7segment.paths.push([.5, .75,	.5+m, .75-b, .5+m, .5+b+2*y,   .5-m, .5+b+2*y, .5-m, .75-b]);

		__7segment.paths.forEach(function(i){
			i.forEach(function(x, j, a){
				if((j%2))return;
				a[j] = a[j] * (1-s) + s*(1-a[j+1]);
			});
		});
		
	}
}

__7segment.recalcPaths(.2);

CanvasRenderingContext2D.prototype.renderDigit = function(d)	{
	if(d == '.') d = 10;
	else if(d =='+') d= 11;
	
	var self = this;
	d = __7segment.masks[d || 0];
	
	__7segment.paths.forEach(function(poly, i){
		//if(i>9)return;
		if(1 << 9-i & d) self.fillPolygon(poly, __7segment.color.on);
		else  self.fillPolygon(poly, __7segment.color.off);
	});
}

CanvasRenderingContext2D.prototype.clearDigit = function()	{
	var s = __7segment.squeeze / 3;
	this.clearRect(-.02, -.02, 1.04, 1.04);
	return;
	this.clearRect(s*2, 0, 1-s*2, 1/3);
	this.clearRect(s, 1/3, 1-s*2, 1/3);
	this.clearRect(0, 2/3, 1-s*2, 1/3);
}

CanvasRenderingContext2D.prototype.renderScore = function(score, x, y, w, prev)	{
	this.save();
	this.translate(x, y);
	var h = w * __7segment.aspect;
	var aw = w*(__7segment.squeeze + 1), self=this;
	this.scale(aw, h);
	
	score.toString().split('').forEach(function(d, i){
		if(!(prev && prev[i] == d))	{
			self.clearDigit();
			self.renderDigit(d);
		}
		
		self.translate(1.3 - __7segment.squeeze, 0);
	});
	
	this.restore();
}

//// VIEWPORT CLASS ///////////////////////////////////////////////////////////

function Viewport(pos, size, pad)	{
	this.pos = pos;
	this.size = size;
	this.pad = pad;
	this.canvas = null;
}

Viewport.prototype.__defineGetter__('ambientSize', function(){
	return Rectangle.sum(this.size, this.pad);
}); 

Viewport.prototype.__defineGetter__('contentPos', function(){
	return new Point(this.pos.x + this.pad.width, this.pos.y + this.pad.height);
});

Viewport.prototype.__defineGetter__('colors', function(){
	if(!this['private:colors'])	{
		this['private:colors'] = [
			'rgba(240, 104, 251, 0.3)',
			'rgba(247, 240,  53, 0.3)',
			'rgba(144, 248, 122, 0.3)',
			'rgba(252, 131, 117, 0.3)',
			'rgba(112, 240, 234, 0.3)']
		this['private:colors'].shuffle();
	}
	return this['private:colors'];
});	

Viewport.prototype.shift = function(sh)	{
	this.canvas.translate(this.pos.x + this.pad.width, this.pos.y + this.pad.height + (sh || 0));
} 

Viewport.prototype.unshift = function(sh)	{
	this.canvas.translate(-this.pos.x -this.pad.width, -this.pos.y -this.pad.height - (sh || 0));
}

Viewport.prototype.mkFill = function(size, decay)	{
	var grad = this.canvas.createLinearGradient(size.width / 4, 0, this.size.width * 3/4, size.height), l = this.colors.length - 1;
	
	this.colors.forEach(function(c, i){
		if(decay)	{
			c = Color.parse(c);
			c.alpha /= decay;
			c = c.toString();
		}
		grad.addColorStop(i / l, c);
	});
	return grad;
}

Viewport.prototype.enframe = function()	{
	var as = this.ambientSize;
	
	with(this.canvas)	{
		save();
		fillStyle = this.mkFill(as);
		translate(this.pos.x, this.pos.y);
		sharpRect(0, 0, as.width, as.height);
		restore();
	}
}

Viewport.prototype.mkGrid = function(fieldSize, gridType)	{
	var v, h, vv, hh, width = this.size.width / fieldSize.width, height = this.size.height / fieldSize.height;
	if(gridType == '|')	{
		h = 1;
		v = height;
	}
	else if(gridType == '+')	{
		h = Math.floor(width*.55);
		v = Math.floor(height*.3);
	}
	
	vv = Math.floor(v/2);
	hh = Math.floor(h/2);	
	
	this.shift();
	with(this.canvas)	{
		fillStyle = this.mkFill(this.size, 3);
		for(var j=1; j<fieldSize.width; ++j)	{
			if(gridType == '|')	{
				vLine(j * width - 1, -this.pad.height, this.pad.height + vv + 1);
				vLine(j * width - 1, fieldSize.height * height - vv, this.pad.height + vv - 1);
			}
			for(var i=1; i<fieldSize.height; ++i)	{
				vLine(j * width - 1, i * height - vv, v);
				hLine(j * width - hh - 1, i * height - 1, h);
			}
		}
	}	
	this.unshift();
}
