import {view} from '../view.js';
import {Table} from '../table.js';
import {model} from '../model.js';
import {controller} from '../controller.js';

const template = `<table id="table" class="screen"></table>
  <div class="info" id="messageArea">
    <div class="info__block">
      Линии: <span class="info__score">0</span>
    </div>
    <div class="info__block">
      Скорость: <span class="info__speed">0</span>
    </div>
    <div class="info__block">
      <div class="nextFigure">
        <table id="nextFigure__table" class="nextFigure__table">
        </table>
      </div>
    </div>
  </div>`;

let _screenTable;
let _nextFigureScreen;
let _linesSpan;
let _speedSpan;

//
function getElem() {
  const elem = view.getElementFromTemplate(template);
//  const button = elem.querySelector(`.main-play`);
//  button.onclick = function () {
//    view.renderScreen(`screenArtist`);
//  };

  let table = new Table(model.rows, model.cells);

  let tableElem = table.getElem();

  let screen = elem.querySelector(`.screen`);
  screen.appendChild(tableElem);


  setTimeout(init, 0);

  return elem;
}

function init() {

  _screenTable = document.querySelector(`.screen`);
  _nextFigureScreen = document.querySelector(`.nextFigure__table`);
  _linesSpan = document.querySelector(`.info__score`);
  _speedSpan = document.querySelector(`.info__speed`);
  model.generateFigure();
  controller.init();
}

// let screenTable = document.querySelector(`.screen`);
// let nextFigureScreen = document.querySelector(`.nextFigure__table`);
// let linesSpan = document.querySelector(`.info__score`);
// let speedSpan = document.querySelector(`.info__speed`);

export default {
  getElem,
  get screenTable() {
    return _screenTable;
  },
  get nextFigureScreen() {
    return _nextFigureScreen;
  },
  get linesSpan() {
    return _linesSpan;
  },
  get speedSpan() {
    return _speedSpan;
  }
};
