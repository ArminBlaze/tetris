var model = {
	score: 0,
	lines: [
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0]
	],

	figure: {},

	fire: function(location) {
		var row = Math.floor(location / 10);
		var column = location % 10;
		this.lines[row][column] = 1;
//		console.log(this.lines);
		view.displayHit(location);
		if(this.isFullLine(row)) {
			this.score++;
			console.log("Score: " + this.score);
			this.deleteLine(row);
			console.log(this.lines);
			view.refresh();
		}
	},

	isFullLine: function (row) {
		for (var i = 0; i < this.lines[row].length; i++) {
			if(!this.lines[row][i]) {
				return false;
			}
		}

		return true;
	},

	deleteLine: function (row) {
		do {
			this.lines[row] = this.lines[row-1];
			row--;
		}while (row >= 1);
		this.lines[0] = [0, 0, 0, 0, 0, 0, 0];
	},

	deleteFigure() {
		this.figure = new Figure();
		this.figure.init();
	},

	generateFigure() {
		this.figure = new Figure();
		this.figure.init();
	}


}
