import {model} from './model.js';
import {view} from './view.js';
import {controller} from './controller.js';
import utils from './utils';


// Прототип с методами
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
//    console.log(direction);
    let coords = this.currentCoords;
//    console.log(coords);
    let newCoords = this.calculateCoordsAfterMove(coords, direction);
    // тестируем новые координаты на пересечение и границу экрана
    let canMove = controller.testCoords(newCoords);
//    console.log(canMove);
    // если есть препятствие и движение влево-вправо - не двигаем


    // если нет препятствия - отрисовываем фигуру на новом месте
    if (canMove) {
      this.redrawFigure(newCoords);

    // если есть препятствие и движение вниз - запускаем слияние с кучей
    } else if (!canMove && direction === `down`) {
      // записываем координаты фигуры в кучу
      this.fusionWithMasonry(coords);

      // создаём новую фигуру?
//      метод model должен удалить фигуру и создать новую
      model.generateFigure();
    }

  }

  redrawFigure(coords) {
    // удаляем текущие пиксели с поля (clearCell())
    this.eraseFigure();
      // записываем новые пиксели в фигуру
    this.currentCoords = coords;
      // отрисовываем новые пиксели
    this.drawFigure();
  }

  fusionWithMasonry(coords) {
    console.log(`Слияние с кучей`);
    console.log(model.lines);

    model.linesToDelete = [];
    // выполнить слияние с кучей
    // для каждого пикселя вызвать запись в кучу
    coords.forEach((item) => model.fire(item));

    // выполнить проверку на полную линию (уже выполняется в методе model.fire)
    // вызываем перерисовку всего поля (уже выполняется в методе model.fire)

    // удаляем фигуру
    model.linesToDelete.forEach((row) => model.deleteLine(row));
    view.refresh();
  }

  calculateCoordsAfterMove(coords, direction) {
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

//    console.log(newCoords);
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

  rotate() {
    if (this.rotateCoords.length === 0) {
      return;
    }
		// взять текущее положение фигуры и переключиться на следующее
    let coords = this.currentCoords;

    let nextRotateIndex = utils.nextIndexInArray(this.rotatePosition, this.rotateCoords);

		// взять вектор следующего положения фигуры
    let nextRotateVector = this.rotateCoords[nextRotateIndex];

		// сложить текущие координаты с вектором
//    console.log(coords, nextRotateVector);
    let coordsAfterRotate = this.sumTwoVectors(coords, nextRotateVector);

		// проверить координаты - можно ли повернуть
    let canMove = controller.testCoords(coordsAfterRotate);
    if (!canMove) {
      return;
    }

		// если проверка прошла - записать в this.rotatePosition
    this.rotatePosition = nextRotateIndex;

    // перерисовать фигуру
    this.redrawFigure(coordsAfterRotate);

  }

  sumTwoVectors(coords1, coords2) {
//    console.log(coords1, coords2);
    let newCoords = coords1.map((item, i) => {
      let splitted1 = model.splitCoords(coords1[i]);
      let splitted2 = model.splitCoords(coords2[i]);
//      console.log(splitted1, splitted2);

      let newCoord = (splitted1.row + splitted2.row) + `.` + (splitted1.cell + splitted2.cell);
//      console.log(newCoord);
      return newCoord;
    });

//    console.log(newCoords);
    return newCoords;
  }
}


// Фигуры

class Square extends Figure {
  constructor() {
    super();
    this.init();
  }

  init() {
    this.coords = [`0.0`, `0.1`, `1.0`, `1.1`];
    this.rotatePosition = 0;
    this.rotateCoords = [];
  }
}


class Line extends Figure {
  constructor() {
    super();
    this.init();
  }

  init() {
    this.coords = [`0.-1`, `0.0`, `0.1`, `0.2`];
    this.rotatePosition = 0;
    this.rotateCoords = [
			[`3.-1`, `2.0`, `1.1`, `0.2`],
			[`-3.1`, `-2.0`, `-1.-1`, `0.-2`]
    ];
  }
}

class Zeka extends Figure {
  constructor() {
    super();
    this.init();
  }

  init() {
    this.coords = [`1.0`, `1.1`, `0.1`, `0.2`];
    this.rotatePosition = 0;
    this.rotateCoords = [
			[`+2.0`, `+1.+1`, `0.0`, `-1.+1`],
			[`-2.0`, `-1.-1`, `0.0`, `+1.-1`]
    ];
  }
}

class ZekaReverse extends Figure {
  constructor() {
    super();
    this.init();
  }

  init() {
    this.coords = [`0.0`, `0.1`, `1.1`, `1.2`];
    this.rotatePosition = 0;
    this.rotateCoords = [
			[`-1.-1`, `0.0`, `+1.-1`, `+2.0`],
			[`+1.+1`, `0.0`, `-1.+1`, `-2.0`]
    ];
  }
}

class Leka extends Figure {
  constructor() {
    super();
    this.init();
  }

  init() {
    this.coords = [`0.0`, `1.0`, `2.0`, `2.1`];
    this.rotatePosition = 0;
    this.rotateCoords = [
			[`-2.+0`, `-1.-1`, `+0.-2`, `+1.-1`],
			[`+1.+2`, `-0.+1`, `-1.+0`, `-0.-1`],
			[`+1.+0`, `-0.+1`, `-1.+2`, `-2.+1`],
			[`+0.-2`, `+1.-1`, `+2.0`, `+1.+1`]
    ];
  }
}

class LekaReverse extends Figure {
  constructor() {
    super();
    this.init();
  }

  init() {
    this.coords = [`0.1`, `1.1`, `2.1`, `2.0`];
    this.rotatePosition = 0;
    this.rotateCoords = [
			[`-1.+1`, `+0.-0`, `+1.-1`, `-0.-2`],
			[`+2.+1`, `+1.+0`, `-0.-1`, `-1.+0`],
			[`+0.-2`, `-1.-1`, `-2.+0`, `-1.+1`],
			[`-1.-0`, `+0.+1`, `+1.+2`, `+2.+1`]
    ];
  }
}

class Troyka extends Figure {
  constructor() {
    super();
    this.init();
  }

  init() {
    this.coords = [`1.0`, `1.1`, `1.2`, `0.1`];
    this.rotatePosition = 0;
    this.rotateCoords = [
			[`-0.-1`, `+1.-0`, `+2.+1`, `-0.+1`],
			[`-2.+1`, `-1.+0`, `-0.-1`, `-0.+1`],
			[`+1.+1`, `-0.-0`, `-1.-1`, `+1.-1`],
			[`+1.-1`, `+0.+0`, `-1.+1`, `-1.-1`]
    ];
  }
}

const figures = [
  Square,
  Line,
  Zeka,
  ZekaReverse,
  Leka,
  LekaReverse,
  Troyka
];

export {figures};
