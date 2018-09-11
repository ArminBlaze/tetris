import {view} from './view.js';
import {model} from './model.js';

let controller = {
  guesses: 0,

  init() {
    window.addEventListener(`keydown`, this.keyHandle);
  },

  keyHandle(e) {

    let keycode = e.keyCode;
    console.log(keycode);
    let key = ``;

    switch (keycode) {
      case 37:
        e.preventDefault();
        key = `left`;
        break;
      case 38:
        e.preventDefault();
        key = `up`;
        break;
      case 39:
        e.preventDefault();
        key = `right`;
        break;
      case 40:
        e.preventDefault();
        key = `down`;
        break;
    }

    model.figure.move(key);
  },

  //тут нужно тестировать на выход за пределы поля и пересечение с "кучей"
  testCoords(coords) {
    console.log(coords);



//    if (!isFinite(row) || !isFinite(column)) {
//        alert(`Oops, that isn't on the board.`);
//      } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
//        alert(`Oops, that's off the board!`);
//      } else {
//        return row + column;
//      }
  },

  processGuess(guess) {
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

  parseGuess(guess) {
    let alphabet = [`A`, `B`, `C`, `D`, `E`, `F`, `G`];

    if (!guess || guess.length !== 2) {
      debugger;
      console.log(`Oops, please enter a letter and a number on the board.`);
    } else {
			// перевод буквы в цифру
      let firstChar = guess.charAt(0);
      if (isFinite(firstChar)) {
        var row = firstChar;
      } else {
        var row = alphabet.indexOf(firstChar);
      }
      let column = guess.charAt(1);

      if (!isFinite(row) || !isFinite(column)) {
        alert(`Oops, that isn't on the board.`);
      } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
        alert(`Oops, that's off the board!`);
      } else {
        return row + column;
      }
    }

    return null;
  },

  isHit(location) {
    let row = +location.charAt(0);
    let column = +location.charAt(1);

    return (model.lines[row][column]);
  }
};

export {controller};
