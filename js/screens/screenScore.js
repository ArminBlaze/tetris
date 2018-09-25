import {model} from '../model.js';
import {view} from '../view.js';

const template = `<div>High Scores</div>
<button type="button" class="main-play">Play again?</button>`;

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
  const elem = view.getElementFromTemplate(template);
  const button = elem.querySelector(`.main-play`);
  button.onclick = function () {
    model.init();
    view.renderScreen(`screenGame`);
  };

  setTimeout(init, 0);

  return elem;
}

function init () {
  view.showHighScores();
}

export default {
  getElem
};
