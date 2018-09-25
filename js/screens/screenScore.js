import {model} from '../model.js';
import {view} from '../view.js';

const template = (highScore) => `<div class="score">
<h1>High Scores</h1>\
<p>Вы набрали: <span class="score__currentRecord">${highScore.score}</span> очков.</p>
<table class="score__table">
${highScore.record.map((item) => {
  return `<tr  class="score__row">
          <td  class="score__cell score__cell_name">${item.name}</td>
          <td  class="score__cell score__cell_score">${item.score}</td>
        </tr>`;
}).join(``)}
</table>


<button type="button" class="score__replay">Play again?</button>
</div>`;

function getElem() {
  let record = model.record;
  let score = model.score;

  const elem = view.getElementFromTemplate(template({record, score}));
  const button = elem.querySelector(`.score__replay`);
  button.onclick = function () {
    model.init();
    view.renderScreen(`screenGame`);
  };

//  setTimeout(init, 0);

  return elem;
}

function init() {
//  showHighScores();
}

//function showHighScores() {
//  let record = model.record;
//  console.log(`Game over!
//Вы набрали: ${model.score} очков.
//Рекорд: ${model.record[0].name} - ${model.record[0].score}`);
//  debugger;
//}

export default {
  getElem
};
