//// TIMER CLASS ////////////////////////////////////////////////////////

function Timer(action, timeout)
{
	this.t = timeout;
	this.a = action;
	this.h = null;
}

Timer.prototype.start = function(t)	{
	this.t = t || this.t;
	if(!this.h)
		this.h = window.setTimeout(this.a, this.t);
}

Timer.prototype.stop = function()	{
	if(this.h)	{
		window.clearTimeout(this.h);
		this.h = null;
	}
}

Timer.prototype.restart = function(t)	{
	this.stop(); this.start(t);
}