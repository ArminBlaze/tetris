window.onload = init;

//Вешаем события на кнопку и окно ввода после загрузки страницы

function init() {
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;
	
	var form = document.getElementById("form");
	form.addEventListener("submit", function(e){
				e.preventDefault();
				handleFireButton();
	});
	
	handleCells();
	model.generateFigure();
	
	window.addEventListener("keydown", keyHandle);
//	window.addEventListener("keyup", keyHandle);
//	window.addEventListener("keypress", keyHandle);
}

function keyHandle (e) {
//	e.preventDefault();
		var keycode = e.keyCode;
		console.log(keycode);
	var key = "";
	
	switch(keycode) {
			case 37:
				key = "left";
				break;
			case 38:
				key = "up";
				break;
			case 39:
				key = "right";
				break;
			case 40:
				key = "down";
				break;
		}
	
	model.figure.move(key);
};

function handleCells() {
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
	
	var table = document.getElementById("table");
	var trs = table.querySelectorAll("tr");
	
	for (var i = 0; i < trs.length; i++) {
		var tr = trs[i];
		var tds = tr.querySelectorAll("td");
		
		for (var j = 0; j < tds.length; j++) {
			//перевод буквы в цифру
			var row = alphabet[i];
			var column = j;
			var td = tds[j];
			
			td.classList.add("" + row + column);
			td.onclick = handleTd;
		}
	}
	
}

function handleTd() {
	//берём класс ячейки, на которой кликнули
	var guess = this.className;
	
	//НУЖНО ПЕРЕДАВАТЬ КЛАССЫ
	
//	console.log(guess);
	controller.processGuess(guess);
}

function handleFireButton() {
	// Код получения данных от формы
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value;
	controller.processGuess(guess);
	guessInput.value = "";
	guessInput.focus();
}






//Объект отображения



var view = {
	displayMessage: function(msg) {
		var area = document.getElementById("messageArea");
		area.innerHTML = msg;
	},
	
	//location нужно передавать как строку ("01"), иначе JS будет считать это 8-ричным числом
	displayHit: function(location) {
		console.log(location);
		var location = location + "";
		var cell = document.getElementById(location);
//		cell.setAttribute("class", "hit");
		cell.classList.add("hit");
	},
	
	clearCell: function(location) {
		var location = location + "";
		var cell = document.getElementById(location);
//		cell.setAttribute("class", "");
		cell.classList.remove("hit");
	},
	
	refresh: function() {
		for(var i = 0; i < model.lines.length; i++) {
			for(var j = 0; j < model.lines[i].length; j++) {
				if(model.lines[i][j]) {
					this.displayHit(i + "" + j);
				} else {
					this.clearCell(i + "" + j);
				}
			}
		}
	}
};






////////////////////////////////////////////////////////////////////
//Объект модели
////////////////////////////////////////////////////////////////////



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





////////////////////////////////////////////////////////////////////
//Объект контроллера
////////////////////////////////////////////////////////////////////



var controller = {
	guesses: 0,
	
	processGuess: function (guess) {
		var location = this.parseGuess(guess);
		if (location) var hitLog = this.isHit(location);
		if(location && hitLog) {
			alert("You already fired in this cell!");
			debugger;
		} else if (location) {
			this.guesses++;
//			this.hitLog.push(location);
			
			var hit = model.fire(location);
		}
	},
	
	parseGuess: function (guess) {
		var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
		
		if (!guess || guess.length !== 2) {
			debugger;
			alert("Oops, please enter a letter and a number on the board.")
		} else {
			//перевод буквы в цифру
			var firstChar = guess.charAt(0);
			if( isFinite(firstChar) ) {
				var row = firstChar;
			} else {
				var row = alphabet.indexOf(firstChar);
			}
			var column = guess.charAt(1);
			
			if(!isFinite(row) || !isFinite(column)) {
				alert("Oops, that isn't on the board.");
			} else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
				alert("Oops, that's off the board!");
			} else {
				return row + column;
			}
		}
		
		return null;
	},
	
	isHit: function (location) {
		var row = +location.charAt(0);
		var column = +location.charAt(1);
		
		return (model.lines[row][column]);
	}
};


//Конструктор фигурки тетриса
//есть координаты фигуры при появлении на экране
//координаты самих точек
//функции
function Figure() {
	this.row = 0,
	this.column = 3
};

Figure.prototype.move = function(direction) {
	if(direction == "down") {
		this.row += 1;
	} else if (direction == "left") {
		this.column -= 1;
	} else if (direction == "right") {
		this.column += 1;
	} else if (direction == "up") {
		this.row -= 1;
	}
	
	controller.processGuess("" + this.row + this.column);
};

Figure.prototype.init = function () {
	controller.processGuess("" + this.row + this.column);
};
	


