var Lib = {
/**
 *	Output information about game statistics. The information is
 *	only valid after game is over.
 *
 * 	@argument {Object} stats		statistics objects to report
 * 	@argument {Boolean} global		true if reporting globals statistics	
 *	@return - array of game traits
 */
mkStatsReport : function(stats, global, classic)	{
	var res = [];
	global = !!global; classic = !!classic;
	if(global && stats.score)	// briefly show globally earned score
	{
		res.push([stats.score.abbr(), stats.score + 'pts earned globally']);
	}
	
	if(stats.lines)
	{
		var x = [stats.lines.abbr(), stats.lines + ' lines burned'];
		if(global) x[1] += ' globally';
		if(stats.forLines) x[1] += ' (' + stats.forLines + 'pts)';
		res.push(x);
	}
	
	if(stats.figures && (classic || stats.drops != stats.figures))
	{
		var x = [stats.figures.abbr(), stats.figures + ' figures used'];
		if(global) x[1] += ' globally';
		if(stats.forFigures) x[1] += ' (' + stats.forFigures + 'pts)';
		res.push(x);
	}
	
	if(!classic && stats.drops)
	{
		var x = [stats.drops.abbr(), stats.drops + ' figures dropped'];
		if(stats.dropLevels){
			if(stats.forDrops) x[1] += ' (' + stats.forDrops + 'pts for ' + stats.dropLevels + ' levels down)';
			else x[1] += ' ' + stats.dropLevels + ' levels down';
		}
		res.push(x);
	}
	
	var gt = stats.time || stats.gameTime
	if(gt){
		var d=	Math.floor(gt / 864e5 % 24); 
		var h=	Math.floor(gt / 36e5 % 60);
		var m=	Math.floor(gt / 6e4 % 60); 
		var s=	Math.floor(gt / 1e3 % 60);

		var txt = 'game time ' + (d ? d + ' days ' : '') + h.zf(2) + ':' + m.zf(2) + ':' + s.zf(2);
		if(global) txt = 'total ' + txt;
		if(d || h) res.push([(d ? d + ' days ' : '') + h.zf(2) + 'h ' + m.zf(2) + 'm', txt]);
		else if(m < 2)
			res.push([(m*60 + s) + 's', txt]);
		else res.push([m.zf(2) + 'm ' + s.zf(2) + 's', txt]);
	}
	
	return res.map(function(pair){
			return Tag.mk('span', {title: pair[1]}, pair[0]);
		});
},

animateFavicon: function(delay, array)	{
	function getFavicon()	{
		var lns = document.getElementsByTagName('link');
		for(var i in lns)	{
			var l = lns[i];
			if(l.rel == 'shortcut icon' && l.type == 'image/x-icon') return l;
		}
	}
	
	function mkLink(url)	{
		var link = document.createElement('link');
		link.setAttribute('type', 'image/x-icon');
		link.setAttribute('rel', 'shortcut icon');
		link.setAttribute('href', url);
		return link;
	}
	
	array.delayedReduce(delay, function(fav, element){
		var parent = fav.parentNode;
		parent.removeChild(fav);
		return parent.appendChild(mkLink(element));		
	}, getFavicon());
}

}
