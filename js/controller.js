import {model} from './model.js';

//переместить ее в controller, чтобы self = controller
function throttleWithFirstDelay (f, key, ms, firstDelay) {
	var timer;
	var args;
	var called = false;

	return function() {	
//				debugger;
		console.log('debounce');
		var self = this;
		args = [].slice.call(arguments);

		if(timer) {
			console.log('найден таймер');
			called = true;
			return;
		}
		
		console.log('первичный запуск функции');
		f.apply(self, args);

		//рекурсивный вызов timeout вместо interval
		timer = setTimeout(function runTimer() {
//					debugger;
			console.log('запуск ф-ции в таймере');
			if(!called) {
				timer = null;
				console.log('не было вызова, сбрасываю таймер');
			}

			if (timer && called) {
				console.log('есть таймер и кнопка нажата');
				if(Key.isDown(key)) {
					f.apply(self, args);
				}
				timer = setTimeout(runTimer, ms, args);
			}

			called = false;
			console.log('called = false');
		}, firstDelay, args);
	};
}

function decorRotate() {
	model.figure.rotate();
}


const KEYCODES = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  ESC: 27
};

const Key = {
  _pressed: {},

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  ESC: 27,

  isDown(keyCode) {
    return this._pressed[keyCode];
  },

  onKeydown(event) {
    this._pressed[event.keyCode] = true;
  },

  onKeyup(event) {
    delete this._pressed[event.keyCode];
  }
};


let debouncedRotateWithFirstDelay = throttleWithFirstDelay(decorRotate, Key.UP, 500, 500);

let controller = {
  guesses: 0,

  init() {
    let startButton = document.querySelector(`.main-play`);
    startButton.onclick = function () {
      model.startGame();
    };
  },

  activate() {
//    window.addEventListener(`keydown`, this.keyHandle);

    window.addEventListener(`keyup`, this.keyUpHandle, false);
    window.addEventListener(`keydown`, this.keyDownHandle, false);
    this.activateKeyRefresher();
  },

  deactivate() {
//    window.removeEventListener(`keydown`, this.keyHandle);

    window.removeEventListener(`keyup`, this.keyUpHandle);
    window.removeEventListener(`keydown`, this.keyDownHandle);
    this.deactivateKeyRefresher();
  },
	
	 keyDownHandle(e) {
    console.log(`Нажата кнопка ` + e.keyCode);
    Key.onKeydown(e);

    // отменяем событие
    let keycode = e.keyCode;

    switch (keycode) {
      case Key.LEFT:
      case Key.UP:
      case Key.RIGHT:
      case Key.DOWN:
      case Key.ESC:
        e.preventDefault();
        break;
    }
  },

  keyUpHandle(e) {
    console.log(`Отжата кнопка ` + e.keyCode);
    Key.onKeyup(e);
  },

  activateKeyRefresher() {
    this.keyTimer = setInterval(this.keyUpdate, 100);
  },

  deactivateKeyRefresher() {
    clearInterval(this.keyTimer);
  },

  keyUpdate() {
		if (Key.isDown(Key.UP)) {
    	debouncedRotateWithFirstDelay();
    }
		
    if (Key.isDown(Key.LEFT)) {
      model.figure.move(`left`);
//      this.moveLeft();
    }
    if (Key.isDown(Key.DOWN)) {
      model.figure.move(`down`);
//      this.moveDown();
    }
    if (Key.isDown(Key.RIGHT)) {
      model.figure.move(`right`);
//      this.moveRight();
    }
    if (Key.isDown(Key.ESC)) {
      model.figure.pause();
//      debugger;
    }
  },

  keyHandle(e) {
    console.log(e.repeat);

    let keycode = e.keyCode;
//    console.log(keycode);

    switch (keycode) {
      case Key.LEFT:
        e.preventDefault();
        model.figure.move(`left`);
        break;
      case Key.UP:
        e.preventDefault();
        model.figure.rotate();
        break;
      case Key.RIGHT:
        e.preventDefault();
        model.figure.move(`right`);
        break;
      case Key.DOWN:
        e.preventDefault();
        model.figure.move(`down`);
        break;
      case Key.ESC:
        e.preventDefault();
        model.figure.pause();
        break;
    }
  },

  // тут нужно тестировать на выход за пределы поля и пересечение с "кучей"
  testCoords(coords) {
//    console.log(coords);
    // каждый пиксель фигуры нужно протестировать
    return coords.every((item) => {
      return this.testPixel(item);
    });


//    if (!isFinite(row) || !isFinite(column)) {
//        alert(`Oops, that isn't on the board.`);
//      } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
//        alert(`Oops, that's off the board!`);
//      } else {
//        return row + column;
//      }

  },

  testPixel(coords) {
//    console.log(coords);
    // проверка на выход за пределы поля
    let pixelCoords = model.splitCoords(coords);
//    console.log(pixelCoords);

    // убрать pixelCoords.row < 0 чтобы можно было располагать фигуры сверху за экраном
    if (pixelCoords.row >= model.rows || pixelCoords.cell < 0 || pixelCoords.cell >= model.cells) {
//      console.log(pixelCoords);
//      console.log(`пиксель пытается попасть за пределы экрана`);
      return false;
    }


    // проверка на пересечение с кучей
    // model.lines[row][column]
    if (pixelCoords.row >= 0 && model.lines[pixelCoords.row][pixelCoords.cell]) {
//      console.log(pixelCoords);
//      console.log(`пересечение с кучей`);
      return false;
    }

    return true;
  },

  processGuess(guess) {
    debugger;
    let location = this.parseGuess(guess);
    if (location) {
      var hitLog = this.isHit(location);
    }
    if (location && hitLog) {
      console.log(`You already fired in this cell!`);
//			debugger;
    } else if (location) {
      this.guesses++;
//			this.hitLog.push(location);

      let hit = model.fire(location);
    }
  },

  isHit(location) {
    let row = +location.charAt(0);
    let column = +location.charAt(1);

    return (model.lines[row][column]);
  }
};

export {controller};
