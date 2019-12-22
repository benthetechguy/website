//// Helper Functions ////////////////////////////////////////////////

/*	miscellaneous helper functions
 *	and simple structures
 */

String.prototype.pad = function(n, s)	{
	s = s || ' ';
	var l = this.length;
	return (Math.abs(n)>l)?(n>0?this+s.rep(n-l):s.rep(Math.abs(n)-l)+this):this.toString();
}

String.prototype.rep = 
String.prototype.x = function(n)	{
	return (new Array(n+1)).join(this);
}

String.prototype.trim = function(){ return this.replace(/^\s+|\s+$/g, "")}
function trim(str){return str.trim()}

String.prototype.trimsplit = 
String.prototype.ts = function(splitter)	{
	return this.split(splitter).map(trim);
}
String.prototype.isIn = function(str)	{
	return str.indexOf(this) != -1;
}
String.prototype.has = function(str)	{
	return this.indexOf(str) != -1;
}

Number.prototype.zf = 
Number.prototype.zerofill = function(w, p)	{
	if(p) return this.toFixed(p).pad(-w, '0')
	return this.toString().pad(-w, '0')
}

Number.prototype.pad = function(w, p, s)	{
	if(p) return this.toFixed(p).pad(w, s)
	return this.toString().pad(w, s)
}

Number.prototype.constrain =  function(min, max)	{
	if(arguments.length == 1 && 'min' in min && 'max' in min)	{
		var t = min;
		max = t.max;
		min = t.min;
	}
	return Math.min(max, Math.max(min, this));
}

String.prototype.fmt = function(a)	{
	var r = this
	for(var k in a)	{
		var rx = new RegExp('\\$\\{'+k+'\\}', 'g');
		r = r.replace(rx, a[k]);
	}
	return r
}

String.prototype.format = function(a)	{
	var r = this.fmt(a);
	for(i in a)	{
		l = a[i]
		var rx = new RegExp('\\$\\{('+i+')(?::(-|0)?(\\d+)?(?:(?:\\.)(\\d+))?)?\\}');
		var n = new Number(l), m;
		while(m = r.match(rx))	{
			var o=m[0], f=m[2], w=m[3], p=m[4]
			if(f&&f=='-') w=-w;
			var s = (f && f == '0')?n.zerofill(w, p):(p?n.pad(w, p):l.pad(w))
			r = r.replace(o, s);
		}
	}
	return r;
}

// operators to use in reduce
function add(a, b){return a + b}
function mul(a, b){return a * b}
function sub(a, b){return a - b}
function div(a, b){return a / b}
function sqr(a)   {return a * a}

function deviate(deviation){
	return deviation && Math.floor(2*deviation * Math.random() - deviation) || 0;
}

if(!('reduce' in Array))
Array.prototype.reduce = function(fn2, init)    {
    var i = 0;
    if(arguments.length < 2) init = this[++i];
    	
	var res = init, l = this.length;
    for(; i<l; ++i) res = fn2(res, this[i], i, this);
    return res;
}

Array.prototype.delayedReduce = function(delay, fn2, init, callback)	{
	var i = 0;
    if(arguments.length < 2) init = this[++i];
    var res = init, l = this.length;
    var fn = function(res, elt, idx, array){
    	res = fn2(res, elt, idx, array);
    	if(++idx < l)
    		window.setTimeout(arguments.callee, delay, res, array[idx], idx, array);
    	else if(callback) callback(res);
    }
    
    fn(res, this[i], i, this);
}

Array.prototype.clone = function()	{
	return [].concat(this);
}

Array.prototype.shuffle = function () {
	var i,L;
	i = L = this.length;
	while (i--)	{
		var r = Math.floor(Math.random()*L);
		var x = this[i];
		this[i] = this[r];
		this[r] = x;
	}
}

Array.prototype.sum = function(){return this.reduce(add, 0)}
Array.prototype.prod = function(){return this.reduce(mul, 0)}

Function.prototype.append = function(g){
	var f = this;
	return function(){f();g()}
}

Function.prototype.wrap = function(g){
	var f = this;
	return function(){f(g())}
}

Function.prototype.detach = function(obj)	{
	var fn = this;
	return function(){return fn.apply(obj, arguments)}
}

Number.prototype.abbr = function()	{
	var s = this.toString();
	var order = Math.floor((s.length - 1) / 3), disp;
	if(order > 0) return s.substr(0, s.length - 3*order) + [, 'K', 'M', 'B'][Math.min(3, order)];
	else return s;
}

Number.prototype.rr = 
Number.prototype.repeatingRate = function()	{
	var s = this.toString();
	if(s.match(/(\w+)\1{4,}|0{4,}$/)) return 'platinum';
	else if(s.match(/(\w+)\1{3}|0{3}$/)) return 'gold';
	else if(s.match(/(\w+)\1{2}|0{2}$/)) return 'silver';
}

Number.prototype.toPos = function()	{
	var s = this % 10, sfx='th';
	if(d = this % 100 - s == 10) return this + '-th';
	switch(s)	{
		case 1: sfx = 'st'; break;
		case 2: sfx = 'nd'; break;
		case 3: sfx = 'rd'; break;
	}
	return this + '-' + sfx;
}

Number.prototype.toAgoInterval = function()	{
	var interval = (Date.now() - this) / 1000;
	var days = Math.floor(interval / 86400); 
	
	if ( isNaN(days) || days <0 || days>= 31 )
        return 'on ' + (new Date(this));
	
	
	return days == 0 && (
		interval<60    && "just now" ||
		interval<120   && "1 minute ago" ||
		interval<3600  && Math.floor( interval / 60 ) + " minutes ago" ||
		interval<7200  && "1 hour ago" ||
		interval<86400 && Math.floor( interval / 3600 ) + " hours ago") ||
		days == 1 && "Yesterday" ||
		days <7 && days + " days ago" ||
		days <31 && Math.ceil( days / 7 ) + " weeks ago";
}
