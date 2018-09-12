import {view} from './view.js';
import {controller} from './controller.js';

class Figure {

  get currentCoords() {
    return this._currentCoords;
  }
  set currentCoords(coords) {
    this._currentCoords = coords;
  }

  move(direction) {
    console.log(direction);
    let coords = this.currentCoords;
    console.log(coords);
    let newCoords = this.shiftCoords(coords, direction);
    // тестируем новые координаты на пересечение и границу экрана
    let canMove = controller.testCoords(newCoords);
    console.log(canMove);
    // если есть препятствие и движение влево-вправо - не двигаем
    // если есть препятствие и движение вниз - запускаем слияние с кучей

    // если нет препятствия - отрисовываем фигуру на новом месте
    if(canMove) {
      //удаляем текущие пиксели с поля (clearCell())
      console.log(coords);
      coords.forEach(item => view.clearCell(item));
      //записываем новые пиксели в фигуру
      this.currentCoords = newCoords;
      //отрисовываем новые пиксели
      this.currentCoords.forEach(item => view.displayHit(item));
    }

  }

  shiftCoords(coords, direction) {
    let newCoords;
    let rowVector = 0;
    let cellVector = 0;

    switch (direction) {
      case `left`:
        cellVector = -1;
        break;
      case `up`:
        rowVector = -1;
        break;
      case `right`:
        cellVector = 1;
        break;
      case `down`:
        rowVector = 1;
        break;
    }

    newCoords = coords.map((item) => {
      let itemCoords = model.splitCoords(item);
      let itemNewPos = (itemCoords.row + rowVector) + `.` + (itemCoords.cell + cellVector);
      return itemNewPos;
    });

    console.log(newCoords);
    return newCoords;
  }


  calculateRealCoords(startPos) {
    let startCoords = model.splitCoords(startPos);

    console.log(startCoords);

    let absoluteCoords = [];
    this.coords.forEach((item) => {
      let itemCoords = model.splitCoords(item);
      let itemAbsolutePos = (itemCoords.row + startCoords.row) + `.` + (itemCoords.cell + startCoords.cell);
      absoluteCoords.push(itemAbsolutePos);
    });

    console.log(absoluteCoords);
    return absoluteCoords;
  }

}

class Square extends Figure {
  constructor() {
    super();
    this.init();
  }

  init() {
    this.coords = [`0.0`, `0.1`, `1.0`, `1.1`];
  }
}

const figures = {
  Square
};

const initState = Object.freeze({
  rows: 20,
  cells: 10,
  speed: 1
});

let currentState = null;

let model = {
  figures,
  initState,
  currentState,
  get rows() {
    return this.currentState.rows;
  },
  get cells() {
    return this.currentState.cells;
  },
  get lines() {
    return this.currentState.lines;
  },

  init() {
    this.currentState = Object.assign({}, this.initState);
    this.generateLines();
    console.log(`init`);
  },

  generateLines() {
    let lines = [];
    for (let i = 0; i < this.currentState.rows; i++) {
      let arr = new Array(this.currentState.cells);
      arr.fill(0);
      lines.push(arr);
    }
    console.log(lines);
    this.currentState.lines = lines;
  },

  splitCoords(coords) {
    let itemPos = coords.split(`.`);
    let itemRow = +itemPos[0];
    let itemCell = +itemPos[1];
    return {row: itemRow, cell: itemCell};
  },

  pickRandomFigure() {

  },

  // эта функция должна выбирать одну рандомную фигуру
  generateFigure() {
    // let figure = pickRandomFigure()
    this.figure = new this.figures.Square();

    let coords = this.figure.coords;
    console.log(coords);
    let center = this.currentState.cells / 2 - 1;
    console.log(center);
//    figure.currentCoords =;
    this.figure.currentCoords = this.figure.calculateRealCoords(`0.${center}`);
    console.log(this.figure.currentCoords);

    this.drawFigure(this.figure);
  },

  // эта функция отрисовывает фигуру?
  drawFigure(figure) {
    figure.currentCoords.forEach((item) => {
      view.displayHit(item);
    });
  },


  fire(location) {
    let row = Math.floor(location / 10);
    let column = location % 10;
    this.lines[row][column] = 1;
//		console.log(this.lines);
    view.displayHit(location);
    if (this.isFullLine(row)) {
      this.score++;
      console.log(`Score: ` + this.score);
      this.deleteLine(row);
      console.log(this.lines);
      view.refresh();
    }
  },

  isFullLine(row) {
    for (let i = 0; i < this.lines[row].length; i++) {
      if (!this.lines[row][i]) {
        return false;
      }
    }

    return true;
  },

  deleteLine(row) {
    do {
      this.lines[row] = this.lines[row - 1];
      row--;
    } while (row >= 1);
    this.lines[0] = [0, 0, 0, 0, 0, 0, 0];
  }
};

export {model};
