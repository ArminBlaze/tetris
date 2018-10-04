import {model} from './model.js';

const KEYCODES = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  ESC: 27
};

let controller = {
  guesses: 0,

  init() {
    let startButton = document.querySelector(`.main-play`);
    startButton.onclick = function () {
      model.startGame();
    };
  },

  activate() {
    window.addEventListener(`keydown`, this.keyHandle);
  },

  deactivate() {
    window.removeEventListener(`keydown`, this.keyHandle);
  },

  keyHandle(e) {
    console.log(e.repeat);

    let keycode = e.keyCode;
//    console.log(keycode);
    let key = ``;

    switch (keycode) {
      case KEYCODES.LEFT:
        e.preventDefault();
        key = `left`;
        break;
      case KEYCODES.UP:
        e.preventDefault();
        model.figure.rotate();
        return;
        break;
      case KEYCODES.RIGHT:
        e.preventDefault();
        key = `right`;
        break;
      case KEYCODES.DOWN:
        e.preventDefault();
        key = `down`;
        break;
      case KEYCODES.ESC:
        e.preventDefault();
        model.figure.pause();
        return;
        break;
    }

    model.figure.move(key);
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
