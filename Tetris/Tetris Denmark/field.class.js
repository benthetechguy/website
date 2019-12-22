//// Field class /////////////////////////////////////////////////////////////

function Field(width, height)	{
	this.size = new Rectangle(width, height);

	this.field = new Array(height);
	for(var i=0; i<height; ++i)	{
		this.field[i] = new Array(width);
		for(var j=0; j<width; ++j)
			this.field[i][j] = 0;
	}
}

Field.prototype.burnLines = function(lowestLine, lines)	{
	var rslt = [], i=lowestLine, k=lowestLine-1;

	for(i;k>0;--i,--k)	{
		var lineClear = true;
		while(lines.indexOf(k) != -1) --k;
		for(var j=0;j<this.field[i].length;++j)	{
			if(this.field[i][j] != this.field[k][j])
				this.field[i][j] = this.field[k][j];
			rslt.push({color: this.field[i][j], point: new Point(j,i)});
			if(lineClear && this.field[i][j]) lineClear = false;
		}
		if(lineClear)break;
	}
	
	for(;i>k;--i)	{
		for(var j=0;j<this.field[i].length;++j)	{
			if(this.field[i][j])	{
				this.field[i][j] = 0;
				rslt.push({color: 0, point: new Point(j,i)});
			}
		}
	}

	return rslt;
}

Field.prototype.fill = function(figure)	{
	var blocks = figure.getBlocksToRender(), self = this, res=[];
	
	blocks.forEach(function(blk){
		self.field[blk.y][blk.x] = figure.color;
		if(res.indexOf(blk.y) == -1) res.push(blk.y);
	});
	
	return res;
}

// called through reduce
Field.prototype.fillBlocks = function(lines, point)	{
	this.field[point.y][point.x] = true;
	lines[point.y] = true;
	return lines;
}

Field.prototype.getFilledLines = function(allLines)	{
	var self = this;
	
	return allLines.filter(function(i)	{
		return self.field[i].every(function(x){return !!x});
	});
}

/**
 *  Yield  coordinates for all blocks in line spceified
 */
Field.prototype.getLineBlocks = function(i)	{
	var res = [];
	for(var j=0; j<this.field[i].length; ++j)
		if(this.field[i]) res.push(new Point(j, i));
	return res;
}

Field.prototype.getState = function()	{
	var res = [[], []];
	for(var i=0; i<this.field.length; ++i)	{
		for(var j=0; j<this.field[i].length; ++j)
			if(!this.field[i][j]) res[0].push(new Point(j, i));
			else res[1].push(new Point(j, i));
	}
	return res;
}

// called through reduce
Field.prototype.pointOk = function(point)	{
	return ((point.x >= 0) 
		&& (point.x < this.size.width) 
		&& (point.y < this.size.height) 
		&& (point.y >= 0)
		&& !this.field[point.y][point.x]);
}

// called through reduce
Field.prototype.getMinHeight = function(result, point)	{
	var heightTreshold = Math.min(result, this.size.height - point.y - 1);
	for(var y = point.y + 1; y<point.y + heightTreshold + 1; ++y)
		if(this.field[y][point.x])
			return Math.min(heightTreshold, y - point.y - 1);
	return heightTreshold;
}

Field.prototype.getFirstVoid = function(col, after)	{
	var mx = this.size.height, row= after || 0;
	while(++row < mx && !this.field[row][col]);
	return row;
}

Field.prototype.getHeights = function(points)	{
	var res = [], self=this;
	points.forEach(function(p){
		if(!(p.x in res))
			res[p.x] = new Span(0, self.getFirstVoid(p.x, p.y));
	
		res[p.x].shrink(p.y+1, res[p.x].right);
	});
	return res;
}
