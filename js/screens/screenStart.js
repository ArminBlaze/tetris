import {view} from '../view.js';
import {model} from '../model.js';


const template = ``;

// import screensController from '../screensController.js';
//
// const template = `<section class="main main--welcome">
//    <section class="logo" title="Угадай мелодию"><h1>Угадай мелодию</h1></section>
//    <button class="main-play">Начать игру</button>
//    <h2 class="title main-title">Правила игры</h2>
//    <p class="text main-text">
//      Правила просты&nbsp;— за&nbsp;2 минуты дать
//      максимальное количество правильных ответов.<br>
//      Удачи!
//    </p>
//  </section>`;
//
//
function getElem() {
//  let table = new Table(model.rows, model.cells);

//  let tableElem = table.getElem();

//  let screen = document.querySelector(`.screen`);
//  screen.appendChild(tableElem);

  const elem = view.getElementFromTemplate(template);
  const button = elem.querySelector(`.main-play`);
  button.onclick = function () {
    view.renderScreen(`screenGame`);
  };

  return elem;
}

export default {
  getElem
};
