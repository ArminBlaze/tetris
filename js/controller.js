import {model} from './model.js';

const gameTickSpeed = 50;
const moveDelay = 200;
const rotateTick = 500;
const rotateDelay = 500;

function decorRotate() {
  if(!model.figure) return;
  model.figure.rotate();
}

function decorMove(direction) {
  if(!model.figure) return;
  model.figure.move(direction);
}

const Key = {
//  _pressed: {},
//  _timers: {},

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  ESC: 27,

  init() {
    this._pressed = {};
    this._timers = {};
  },

  isDown(keyCode) {
    return this._pressed[keyCode];
  },

  onKeydown(event) {
    this._pressed[event.keyCode] = true;
//    this._timers[event.keyCode] = true;
  },

  onKeyup(event) {
    delete this._pressed[event.keyCode];
    clearTimeout(this._timers[event.keyCode]);
    delete this._timers[event.keyCode];
  }
};


let debouncedRotateWithFirstDelay = throttleWithFirstDelay(decorRotate, Key.UP, rotateTick, rotateDelay);
let debouncedMoveLeft = throttleWithFirstDelay(decorMove, Key.LEFT, gameTickSpeed, moveDelay);
let debouncedMoveRight = throttleWithFirstDelay(decorMove, Key.RIGHT, gameTickSpeed, moveDelay);

// переместить ее в controller, чтобы self = controller
function throttleWithFirstDelay(f, key, ms, firstDelay) {
//  let timer;
//  Key._timers[event.keyCode] = true;
  let args;
  let called = false;

  return function () {
//				debugger;
    let self = this;
    args = [].slice.call(arguments);

    if (Key._timers[key]) {
      called = true;
      return;
    }

    f.apply(self, args);

		// рекурсивный вызов timeout вместо interval
    Key._timers[key] = setTimeout(function runTimer() {
//					debugger;
      if (!called) {
        Key._timers[key] = null;
      }

      if (Key._timers[key] && called) {
        if (Key.isDown(key)) {
          f.apply(self, args);
        }
        Key._timers[key] = setTimeout(runTimer, ms, args);
      }

      called = false;
    }, firstDelay, args);
  };
}

let controller = {
  init() {
    let startButton = document.querySelector(`.button_start`);
    let pauseButton = document.querySelector(`.button_pause`);

    startButton.onclick = function () {
      model.init();
      model.startGame();
    };

    pauseButton.onclick = function () {
      model.figure.pause();
    };
  },

  activate() {
//    window.addEventListener(`keydown`, this.keyHandle);

    window.addEventListener(`keyup`, this.keyUpHandle, false);
    window.addEventListener(`keydown`, this.keyDownHandle, false);
    this.activateKeyRefresher();
    Key.init();
  },

  deactivate() {
//    window.removeEventListener(`keydown`, this.keyHandle);

    window.removeEventListener(`keyup`, this.keyUpHandle);
    window.removeEventListener(`keydown`, this.keyDownHandle);
    this.deactivateKeyRefresher();
  },

  keyDownHandle(e) {
    Key.onKeydown(e);

    // отменяем событие
    let keycode = e.keyCode;

    switch (keycode) {
      case Key.LEFT:
      case Key.UP:
      case Key.RIGHT:
      case Key.DOWN:
        e.preventDefault();
        break;
      case Key.ESC:
        e.preventDefault();
        model.figure.pause();
        break;
    }
  },

  keyUpHandle(e) {
    Key.onKeyup(e);
  },

  activateKeyRefresher() {
    this.keyTimer = setInterval(this.keyUpdate, gameTickSpeed);
  },

  deactivateKeyRefresher() {
    clearInterval(this.keyTimer);
  },

  keyUpdate() {
    if (!model.figure) {
      return;
    }

    if (Key.isDown(Key.UP)) {
      debouncedRotateWithFirstDelay();
    }

    if (Key.isDown(Key.LEFT)) {
      debouncedMoveLeft(`left`);
    }
    if (Key.isDown(Key.DOWN)) {
      model.figure.move(`down`);
    }
    if (Key.isDown(Key.RIGHT)) {
      debouncedMoveRight(`right`);
    }
    if (Key.isDown(Key.ESC)) {
//      model.figure.pause();
    }
  },

  // тут нужно тестировать на выход за пределы поля и пересечение с "кучей"
  testCoords(coords) {
//    console.log(coords);
    // каждый пиксель фигуры нужно протестировать
    return coords.every((item) => {
      return this.testPixel(item);
    });
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

  isHit(location) {
    let row = +location.charAt(0);
    let column = +location.charAt(1);

    return (model.lines[row][column]);
  }
};

export {controller};
