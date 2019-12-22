//// Figure class /////////////////////////////////////////////////////////

var Rotate = {cw : 0, ccw: 1, deflt: 1}

function Figure(block)	{
	if(arguments.length == 0)	{ // default constructor
		this.figureId = Figure.defaultFigureId;
		this.figure = Figure.defaultFigure;
		this.color = Figure.colors[Figure.defaultFigureId].deviate(Figure.deviations);
		this.position = new Point(0, 0);
	}
	else if(typeof block == 'number')	{ // initialize by id
		this.figureId = block;
		this.figure = Figure.figures[block];
		this.color = Figure.colors[block].deviate(Figure.deviations);
		this.position = new Point(0, 0);
	}
	else	{ // initialize by another block
		this.figureId = block.figureId;
		this.figure = block.figure;
		this.color = block.color;
		this.position = block.position;
	}
}

Figure.figures = [
	/*0 |*/  [ [0,0,1,0,0], [0,0,1,0,0], [0,0,1,0,0], [0,0,1,0,0], [0,0,0,0,0] ],
	/*1 _|*/ [ [0,0,0,0,0], [0,0,1,1,0], [0,0,1,0,0], [0,0,1,0,0], [0,0,0,0,0] ],
	/*2 |_*/ [ [0,0,0,0,0], [0,1,1,0,0], [0,0,1,0,0], [0,0,1,0,0], [0,0,0,0,0] ],
	/*3 T*/  [ [0,0,0,0,0], [0,0,0,0,0], [0,1,1,1,0], [0,0,1,0,0], [0,0,0,0,0] ],
	/*4 _-*/ [ [0,0,0,0,0], [0,0,0,0,0], [0,0,1,1,0], [0,1,1,0,0], [0,0,0,0,0] ],
	/*5 -_*/ [ [0,0,0,0,0], [0,0,0,0,0], [0,1,1,0,0], [0,0,1,1,0], [0,0,0,0,0] ],
	/*6 []*/ [ [0,0,0,0,0], [0,1,1,0,0], [0,1,1,0,0], [0,0,0,0,0], [0,0,0,0,0] ]
];

Figure.colors = [
	new Color(150,224,89), new Color( 75,193,213), new Color(231,96,73), new Color(255,220,29), 
	new Color(221,156,216), new Color( 82,133,238), new Color(240,134,62) 
]
Figure.colors[-1]=-1;

Figure.area = 5;
Figure.defaultFigureId = 4;
Figure.defaultFigure = Figure.figures[Figure.defaultFigureId];
Figure.deviations = {base:25, r:5, g:5, b:5, a:0};

Figure.prototype.rotate = function(direction)	{
	if(this.figureId == 6) return null; // Box is not rotating
	if(arguments.length == 0)
		direction = Rotate.deflt;
	
	var newFigure = new Figure(this);
	newFigure.figure = new Array(Figure.array);
	
	for(var i=0; i<Figure.area; ++i)	{
		newFigure.figure[i] = new Array(Figure.array);
		for(var j=0; j<Figure.area; ++j)	{
			if(direction == Rotate.cw)
				newFigure.figure[i][j] = this.figure[Figure.area - 1 - j][i];
			else if(direction == Rotate.ccw)
				newFigure.figure[i][j] = this.figure[j][Figure.area - 1 - i];
		}
	}

	return newFigure;
}

/**
 *	Return an array of (x, y) pairs representing blocks that are to be
 *	rendered for this figure (not empty blocks of a figure)
 */
Figure.prototype.getBlocksToRender = function()	{
	var res = new Array();
	for(var i=0; i<this.figure.length; ++i)
		for(var j=0; j<this.figure[i].length; ++j)
			if(this.figure[i][j] == 1) 
				res.push(Point.sum(this.position, new Point(j,i)));
	return res;
}

/**
 *	Return a list of blocks ((x, y) pairs) that are present in 
 *	current figure and not present (set) in figure specified
 *
 *	@param figure - another figure to compare to
 */
Figure.prototype.andNot = function(figure)	{
	var res = new Array();
	for(var i=0; i<this.figure.length; ++i)
		for(var j=0; j<this.figure[i].length; ++j)
			if(this.figure[i][j] == 1 && this.figure[i][j] != figure.figure[i][j]) 
				res.push(Point.sum(this.position, new Point(j,i)));
	return res;
}

Figure.prototype.shifted = function(by)	{
	var res = {draw:new Array(), clear:new Array()}
	for(var i=0; i<this.figure.length; ++i)
		for(var j=0; j<this.figure[i].length; ++j)	{
			var k=j+by;	
		
			if(k>=0 && k < this.figure[i].length)	{
				if(this.figure[i][j] == 1 && this.figure[i][k] == 0)
					res.draw.push(Point.sum(this.position, new Point(k,i)));
			
				else if (this.figure[i][j] == 0 && this.figure[i][k] == 1)
					res.clear.push(Point.sum(this.position, new Point(k,i)));
				
				else if (this.figure[i][j] == 1 && (j==0 || j== this.figure[i].length - 1))
					res.clear.push(Point.sum(this.position, new Point(j,i)));
			}
			else if(this.figure[i][j])
				res.draw.push(Point.sum(this.position, new Point(k,i)));
		}
	return res;
}