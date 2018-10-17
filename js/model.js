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
  HIGH_SCORES_LENGTH: 10,
  HIGH_SCORES_NAME: `HighScores`,
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
    this.gameInProgress = true;
  },

  startGame() {
    view.hideOverlay();
    model.generateFigure();
    controller.activate();
  },

  gameOver() {
    // тут нужен переход на экран конца игры
    // но пока можно просто перезапускать игру
    // значит нужно запустить метод перезапуска игры
//    alert(`Game over! \nВы набрали: ${this.score} очков.`);

    this.gameInProgress = false;
    controller.deactivate();

    // записываем highScores
    this.handleHighScore();

    // переключаем экран и там уже выводим таблицу
    // создаём оверлей
    view.showOverlay(`score`);

    // пишем в оверлей таблицу
    view.renderScreen(`screenScore`, document.querySelector(`.overlay__score`));

    // выводим таблицу highScores
    // Этот метод нужно перенести в экран
  },

  handleHighScore() {
//    utils.getCookie
//    utils.setCookie

    // Получить пред результат

    let currentScore = this.score;

//    let prevScore = utils.getCookie(`score1`);
// //    Если текущий больше - обновить
//    if (!prevScore || prevScore < currentScore) {
//
//      utils.setCookie(`score1`, currentScore, {expires: 1 * 365 * 24 * 60 * 60});
//    }
//
// //     setCookie('key2', "", {expires: 1 * 365 * 24 * 60 * 60}); кука на год
//
//    this.record = utils.getCookie(`score1`);


    // сравнить текущий результат со всеми в массиве рекордов
    this.compareHighScore();

    //    Если текущий больше - обновить
    //    if (!prevScore || prevScore < currentScore) {
//
//      utils.setCookie(`score1`, currentScore, {expires: 1 * 365 * 24 * 60 * 60});
//    }
//
// //     setCookie('key2', "", {expires: 1 * 365 * 24 * 60 * 60}); кука на год
//
//    this.record = utils.getCookie(`score1`);
  },

  deleteHighScore() {
    // удаляем таблицу рекордов
    utils.deleteCookie(this.HIGH_SCORES_NAME);
  },

  compareHighScore() {
    // получить массив рекордов
    let score = this.score;
    let prevScores = this.getHighScoresArray();
    this.record = prevScores;
//    console.log(prevScores);


    // если массив пуст - создать новый массив и записать текущее значение и имя пользователя
    if (!prevScores) {
      prevScores = [this.createHighScore()];
    }
    // если массив короче определённого значения - просто добавляем в него рекорд
//    и сортируем массив
    else if (prevScores.length < this.HIGH_SCORES_LENGTH) {
      prevScores.push(this.createHighScore());
      prevScores.sort((a, b) => b.score - a.score);
    }
    // если массив есть - перебираем его и ищем куда вставить текущее значение
    // если
    else {
      // находим первый результат, который меньше текущего
      let position = false;

      prevScores.some((item, i) => {
        if (score > item.score) {
          position = i;
          return true;
        }
      });
      console.log(position);

      if (position === false) {
        return prevScores;
      }

      prevScores.splice(position, 0, this.createHighScore());
      prevScores.length = this.HIGH_SCORES_LENGTH;
    }

    this.record = prevScores;
    this.setHighScoresArray(prevScores);
  },

  createHighScore() {
    let name = this.enterUserName();
    return {name, score: this.score};
  },

  enterUserName() {
    let name = prompt(`Введите своё имя:`, ``);
    return name;
  },

  setHighScoresArray(arr) {
    console.log(arr);

    arr = JSON.stringify(arr);
//     Преобразование массива в строку:
//    > JSON.stringify([1, 2])
//    *returns* '[1, 2]'
//
//    Затем мы можем сделать его печеньем:
//    > $.cookie('cookie', '[1, 2]')
//
//    И затем проанализируйте его:
//    > JSON.parse($.cookie('cookie'))
//    *returns* [1, 2]
    utils.setCookie(this.HIGH_SCORES_NAME, arr, {expires: 1 * 365 * 24 * 60 * 60});
  },


  getHighScoresArray() {
    let cookie = utils.getCookie(this.HIGH_SCORES_NAME);
//    console.log(cookie);
    if (cookie) {
      return JSON.parse(cookie);
    } else {
      return null;
    }
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
//    if (this.figure) {
//      this.figure.destroy();
//    }

    // если игра закончилась, ничего не создавать
    if (!this.gameInProgress) {
      return;
    }
//    debugger;

    if (this.nextFigure) {
      this.figure = this.nextFigure;
    } else {
      this.figure = this.pickRandomFigure();
    }

    this.nextFigure = this.pickRandomFigure();

//    console.log(`Эта фигура: `, this.figure);
//    console.log(`След фигура: `, this.nextFigure);

//    let coords = this.figure.coords;
//    console.log(coords);
    let center = this.currentState.cells / 2 - 1;
//    console.log(center);
//    figure.currentCoords =;
    this.figure.currentCoords = this.figure.calculateRealCoords(`0.${center}`);
//    console.log(this.figure.currentCoords);

    this.figure.drawFigure();

    // отрисовать следующую фигуру в окне след фигуры
//    console.log(this.nextFigure);
    if (!this.gameInProgress) {
      return;
    }

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
//      console.log(this.lines);
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
