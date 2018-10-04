import {model} from './model.js';
// import {controller} from './controller.js';

import screenStart from './screens/screenStart.js';
import screenGame from './screens/screenGame.js';
import screenScore from './screens/screenScore.js';

const screens = {
  screenStart,
  screenGame,
  screenScore
};

let board = document.querySelector(`#board`);
let screenTable = document.querySelector(`.screen`);
let nextFigureScreen = document.querySelector(`.nextFigure__table`);
let linesSpan = document.querySelector(`.info__score`);
let speedSpan = document.querySelector(`.info__speed`);


let view = {
  init() {
//    this.renderScreen(`screenStart`);
//    this.showOverlay(`start`);
    this.overlay = document.querySelector(`.overlay__start`);
  },

  displayMessage(msg) {
    let area = document.getElementById(`messageArea`);
    area.innerHTML = msg;
  },

	// location нужно передавать как строку ("01"), иначе JS будет считать это 8-ричным числом
  displayHit(location, area) {
    if (location[0] === `-`) {
      return;
    }
//    console.log(location);
    // берем либо экран игры либо экран следующей фигуры
    if (!area) {
//      area = screenGame.screenTable;
      area = screenTable;
    } else {
//      area = screenGame.nextFigureScreen;
      area = nextFigureScreen;
    }

    location = location + ``;
//    let cell = area.getElementById(location);
    // экранируем первый символ, т.к. имена классов - цифры
    let firstLocationNum = `\\3` + location[0] + ` `;
    let restLocation = location.slice(1);
    restLocation = restLocation.replace(`.`, `\\.`);

    // ищём ячейку
    let cell = area.querySelector(`.` + firstLocationNum + restLocation);

    // экранировать первую цифру и точку

//    debugger;
//    let unicodeNum = location.charCodeAt(0);
//    let unicodeNum2 = location.charCodeAt(1);
//    let unicodeNum3 = location.charCodeAt(2);
//    console.log(String.fromCharCode(unicodeNum,unicodeNum2,unicodeNum3));
//    let cell = area.getElementsByClassName(`.` + location)[0];
//		cell.setAttribute("class", "hit");
    if (!cell) {
      return;
    }
    cell.classList.add(`hit`);
  },

  clearCell(location) {
    location = location + ``;
    let cell = document.getElementById(location);
//		cell.setAttribute("class", "");
    if (!cell) {
      return;
    }
    cell.classList.remove(`hit`);
  },

  refresh() {
    console.log(`view.refresh`);
    for (let i = 0; i < model.currentState.lines.length; i++) {
      for (let j = 0; j < model.currentState.lines[i].length; j++) {
        if (model.currentState.lines[i][j]) {
          this.displayHit(i + `.` + j);
        } else {
          this.clearCell(i + `.` + j);
        }
      }
    }


  },

  refreshNextFigure() {
    nextFigureScreen.querySelectorAll(`td`).forEach((cell) => cell.classList.remove(`hit`));
  },

  displayNextFigure(coords) {


    // отрисовать поле нужного размера

    // отрисовать на нём фигуру


//     и отрисовать след фигуру в окошке, передав параметр - элемент куда отрисовать
    coords.forEach((item) => {
      this.displayHit(item, `draw nextFigure`);
    });
  },

  refreshInfo() {
  // пишем сколько линий стерто
    linesSpan.innerHTML = model.score;
    speedSpan.innerHTML = model.speed;
//    nextFigureBlock.innerHTML = model.nextFigure;
  },

  getElementFromTemplate(template) {
    let container = document.createElement(`template`);
    container.innerHTML = template;
    return container.content;
  },

  renderScreen(name, parent) {
    let elem = screens[name].getElem();
    parent.innerHTML = ``;
    parent.appendChild(elem);
  },

  // принимаем имя оверлея на вход и ищём его по классу
  // name => querySelector(`.overlay++` + name);
  showOverlay(name) {

    // меняем классы у существуюущих в разметке элементов с классом .overlay
    // например - .overlay .overlay__start .hidden
    // удаляем .hidden - этот экран становится виден
    if (this.overlay) {
      this.hideOverlay();
    }

    this.overlay = document.querySelector(`.overlay__` + name);
    this.overlay.classList.remove(`hidden`);

//    board.innerHTML = ``;
//    board.appendChild(elem);
//    console.log(screens);
  },

  hideOverlay() {
    this.overlay.classList.add(`hidden`);
  }
};

export {view};
