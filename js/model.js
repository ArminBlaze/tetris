import {view} from './view.js';
import {controller} from './controller.js';
import {figures} from './figures.js';
import utils from './utils';


const initState = Object.freeze({
  rows: 20,
  cells: 10,
  speed: 0,
  score: 0
});

let currentState = null;

let model = {
  figures,
  initState,
  currentState,
  paused: false,
  get rows() {
    return this.currentState.rows;
  },
  get cells() {
    return this.currentState.cells;
  },
  get lines() {
    return this.currentState.lines;
  },
  get score() {
    return this.currentState.score;
  },
  set score(score) {
    this.currentState.score = score;
  },
  get speed() {
    return this.currentState.speed;
  },
  set speed(num) {
    this.currentState.speed = num;
  },

  init() {
    this.currentState = Object.assign({}, this.initState);
    this.generateLines();
//    console.log(`init`);
  },

  gameOver() {
    // тут нужен переход на экран конца игры
    // но пока можно просто перезапускать игру
    // значит нужно запустить метод перезапуска игры
    alert(`Game over! \nВы набрали: ${this.score} очков.`);
    model.init();
  },

  generateLines() {
    let lines = [];
    for (let i = 0; i < this.currentState.rows; i++) {
      let arr = new Array(this.currentState.cells);
      arr.fill(0);
      lines.push(arr);
    }
//    console.log(lines);
    this.currentState.lines = lines;
  },

  splitCoords(coords) {
    let itemPos = coords.split(`.`);
    let itemRow = +itemPos[0];
    let itemCell = +itemPos[1];
    return {row: itemRow, cell: itemCell};
  },

  pickRandomFigure() {
//		console.log(this.figures.length);
    let rand = utils.randomInteger(0, this.figures.length - 1);

    return new this.figures[rand]();
  },

  // эта функция должна выбирать одну рандомную фигуру
  generateFigure() {
    // let figure = pickRandomFigure()
    if (this.figure) {
      this.figure.destroy();
    }

    if (this.nextFigure) {
      this.figure = this.nextFigure;
    } else {
      this.figure = this.pickRandomFigure();
    }

    this.nextFigure = this.pickRandomFigure();

    console.log("Эта фигура: ", this.figure);
    console.log("След фигура: ", this.nextFigure);

//    let coords = this.figure.coords;
//    console.log(coords);
    let center = this.currentState.cells / 2 - 1;
//    console.log(center);
//    figure.currentCoords =;
    this.figure.currentCoords = this.figure.calculateRealCoords(`0.${center}`);
//    console.log(this.figure.currentCoords);

    this.figure.drawFigure();

    // отрисовать следующую фигуру в окне след фигуры
    console.log(this.nextFigure);
    this.nextFigure.drawNextFigure();

    // запускает таймер движения фигуры
    this.figure.startMoving();
  },


  fire(location) {
    let coords = this.splitCoords(location);
    let row = coords.row;
    let column = coords.cell;

    this.lines[row][column] = 1;
//		console.log(this.lines);
    view.displayHit(location);
    if (this.isFullLine(row)) {
      this.score++;
      console.log(`Score: ` + this.score);
//      this.deleteLine(row);

      this.linesToDelete.push(row);
      console.log(this.lines);
    }
  },

//  addToMasonry(pixel) {
//    console.log(pixel);
//  },

  isFullLine(row) {
    for (let i = 0; i < this.lines[row].length; i++) {
      if (!this.lines[row][i]) {
        return false;
      }
    }

    return true;
  },

  deleteLine(row) {
//    debugger;
    console.log(`удаляем линию ` + row);
    do {
      this.lines[row] = this.lines[row - 1];
      row--;
    } while (row >= 1);
//    this.lines[0] = [0, 0, 0, 0, 0, 0, 0];
    this.lines[0] = new Array(model.cells).fill(0);
  }
};

export {model};
