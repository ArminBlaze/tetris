import {model} from './model.js';
import {view} from './view.js';
import {controller} from './controller.js';

class Figure {

  get currentCoords() {
    return this._currentCoords;
  }
  set currentCoords(coords) {
    this._currentCoords = coords;
  }

  drawFigure() {
    this.currentCoords.forEach((item) => {
      view.displayHit(item);
    });
  }

  eraseFigure() {
    this.currentCoords.forEach((item) => view.clearCell(item));
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


    // если нет препятствия - отрисовываем фигуру на новом месте
    if (canMove) {
      // удаляем текущие пиксели с поля (clearCell())
      this.eraseFigure();
      // записываем новые пиксели в фигуру
      this.currentCoords = newCoords;
      // отрисовываем новые пиксели
      this.drawFigure();
    }
    // если есть препятствие и движение вниз - запускаем слияние с кучей
    else if (!canMove && direction === `down`) {

      // записываем координаты фигуры в кучу
      this.fusionWithMasonry(coords);

      // создаём новую фигуру?
//      метод model должен удалить фигуру и создать новую
      model.generateFigure();
    }

  }

  fusionWithMasonry(coords) {
    console.log(`Слияние с кучей`);
    // выполнить слияние с кучей
    // для каждого пикселя вызвать запись в кучу
    coords.forEach((item) => model.fire(item));

    // выполнить проверку на полную линию (уже выполняется в методе model.fire)
    // вызываем перерисовку всего поля (уже выполняется в методе model.fire)

    // удаляем фигуру

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

//    console.log(startCoords);

    let absoluteCoords = [];
    this.coords.forEach((item) => {
      let itemCoords = model.splitCoords(item);
      let itemAbsolutePos = (itemCoords.row + startCoords.row) + `.` + (itemCoords.cell + startCoords.cell);
      absoluteCoords.push(itemAbsolutePos);
    });

//    console.log(absoluteCoords);
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

class Line extends Figure {
  constructor() {
    super();
    this.init();
  }

  init() {
    this.coords = [`0.-1`, `0.0`, `0.1`, `0.2`];
  }
}

const figures = [
  Square,
	Line
];

export {figures};