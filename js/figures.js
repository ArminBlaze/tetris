import {model} from './model.js';
import {view} from './view.js';
import {controller} from './controller.js';
import utils from './utils';
import {Table} from './table.js';

const delayBetweenFigures = 300;


// Прототип с методами
class Figure {

  get currentCoords() {
    return this._currentCoords;
  }
  set currentCoords(coords) {
    this._currentCoords = coords;
  }

  drawFigure() {
    // протестировать координаты перед отрисовкой, если заняты - конец игры
    let canMove = controller.testCoords(this.currentCoords);

    if (!canMove) {
      model.gameOver();
    }

    view.refresh();

    this.currentCoords.forEach((item) => {
      view.displayHit(item);
    });
  }

  drawNextFigure() {
    console.log(`drawNextFigure()`);
    // нужно рефрешить оконо след фигуры
    view.refreshNextFigure();

    // вызвать calculateFigureSize и получить размер фигуры
    this.calculateFigureSize();

    // генерируем мини-таблицу для следующей фигуры
    // вызвать функцию генерации таблицы (поля) с указанным размером
    // она должна получить размер и вернуть элемент
    this.table = new Table(this.rows, this.cells);

    let table = this.table.getElem();
//    let nextFigureScreen = document.querySelector(`.nextFigure__table`);
//    debugger;
    if (!view.nextFigureScreen) {
      return;
    }

    view.nextFigureScreen.innerHTML = ``;
    view.nextFigureScreen.appendChild(table);

    let coords = this.previewCoords || this.coords;

    view.displayNextFigure(coords);
//
  }

  calculateFigureSize() {
//    console.log(`displayNextFigure`, this.coords);
    // вычислить ширину и высоту фигуры
    let minCell = 0;
    let maxCell = 0;
    let minRow = 0;
    let maxRow = 0;

    this.coords.forEach((item) => {
      let coords = model.splitCoords(item);
//      row: itemRow, cell: itemCell
      if (coords.cell < minCell) {
        minCell = coords.cell;
      }
      if (coords.cell > maxCell) {
        maxCell = coords.cell;
      }
      if (coords.row < minRow) {
        minRow = coords.row;
      }
      if (coords.row > maxRow) {
        maxRow = coords.row;
      }
    });

    let width = (maxCell - minCell) + 1;
    let height = (maxRow - minRow) + 1;

//    console.log(`Width: ` + width, `Height: ` + height);
    this.cells = width;
    this.rows = height;
  }

  eraseFigure() {
    this.currentCoords.forEach((item) => view.clearCell(item));
  }

  startMoving() {

    // запуск функции вычисления тика
    this.tick = this.calculateTickSpeed();
    view.refreshInfo();

    this.startTimer();


//    this.timer = setTimeout(function timerok() {
//      console.log(this);
//      console.log(model);
//      console.log(`Сработал таймер ` + this.timer);
//      //двигаем фигуру вниз
//      this.move(`down`);
//
//      this.tick = 1000 -  model.speed*100;
//      this.timer = setTimeout(timerok.bind(this), this.tick);
//    }.bind(this), model.figure.tick);
  }

  startTimer() {
    this.timer = setInterval(function () {
      this.move(`down`);
    }.bind(this), this.tick);
  }

  pause() {
    model.paused = !model.paused;

    if (model.paused) {
      clearInterval(this.timer);
      // Добавить надпись ПАУЗА
      console.log(`Пауза`);
    } else {
      this.startTimer();
    }
  }

  calculateTickSpeed() {
    model.speed = Math.floor(model.score / 10);
    if (model.speed > 9) {
      model.speed = 9;
    }
    // 1000 магическое число - 1секунда. Стандартный таймер
    // 100 магическое число - шаг ускорения таймера, при повышении уровня скорости
    // каждые 10 линий фигура ускоряется на 100мс
    let timerTick = 1000 - model.speed * 100;
//    console.log(timerTick);
    return timerTick;
  }

  move(direction) {

    if (model.figure != this) {
      debugger;
      console.log(`return!`);
      return;
    }
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

      // задержка при генерации новой фигуры
//      debugger;
      // удаляем текущую фигуру, чтобы остановить таймер движения фигуры и создаём новую фигуру с задержкой
      this.destroy();

      setTimeout(function () {
        model.generateFigure();
      }, delayBetweenFigures);

//      model.generateFigure();
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
//    console.log(`Слияние с кучей`);
//    console.log(model.lines);

    model.linesToDelete = [];
    // выполнить слияние с кучей
    // для каждого пикселя вызвать запись в кучу
    coords.forEach((item) => model.fire(item));

    // выполнить проверку на полную линию (уже выполняется в методе model.fire)
    // вызываем перерисовку всего поля (уже выполняется в методе model.fire)

    // удаляем фигуру
//    сортируем, чтобы удалять начиная с верхней линии
    model.linesToDelete.sort((a, b) => a - b);
    model.linesToDelete.forEach((row) => model.deleteLine(row));
//    view.refresh();
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

  destroy() {
    // убирает таймер и удаляет фигуру\
//    console.log(`удаляем фигуру`, this);
    model.figure = null;
    clearInterval(this.timer);
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
    this.previewCoords = [`0.0`, `0.1`, `0.2`, `0.3`];
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
    this.coords = [`1.0`, `1.1`, `1.2`, `0.2`];
    this.rotatePosition = 3;
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
//    this.coords = [`0.1`, `1.1`, `2.1`, `2.0`];
    this.coords = [`1.2`, `1.1`, `1.0`, `0.0`];
    this.rotatePosition = 1;
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
