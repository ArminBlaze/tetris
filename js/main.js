import data from './data.js';

let table = document.querySelector(`#table`);

data.init();


let template = document.querySelector(`template`);

let trTemplate;
let tdTemplate;


if (`content` in template) { // полифилл под IE11
  trTemplate = template.content.querySelector(`.screen__row`);
  tdTemplate = template.content.querySelector(`.screen__cell`);
} else {
  trTemplate = template.children[0];
  tdTemplate = template.children[1];
}

drawTable(data.currentState, table);

function drawTable(state, elem) {
  console.log(state);

  let fragment = document.createDocumentFragment();

  for (let i = 0; i < state.rows; i++) {
    let tr = trTemplate.cloneNode(true);
    fragment.appendChild(tr);

    for (let j = 0; j < state.cells; j++) {
      let td = tdTemplate.cloneNode(true);
      td.id = i+j;
      tr.appendChild(td);
    }
  }
  
  elem.appendChild(fragment);
}
