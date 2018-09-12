import {model} from './model.js';
import {controller} from './controller.js';

class Table {
  constructor() {

  }

  getElem() {
    if (!this.elem) {
      this.render();
    }
    return this.elem;
  }

  render() {
//    let html = _.template(`<div class="user-list"></div>`)();
//    this.elem = createElementFromHtml(html);
//
//    this.elem.addEventListener('click', this);

    this.elem = document.querySelector(`#table`);

    this.template = this.getTemplate();

    this.drawTable(model.currentState, this.elem);
  }

  getTemplate() {
    if (this.template) {
      return this.template;
    }

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

    return {
      trTemplate,
      tdTemplate
    };
  }

  drawTable(state, elem) {
//    console.log(state);

    let fragment = document.createDocumentFragment();

    for (let i = 0; i < state.rows; i++) {
      let tr = this.template.trTemplate.cloneNode(true);
      fragment.appendChild(tr);

      for (let j = 0; j < state.cells; j++) {
        let td = this.template.tdTemplate.cloneNode(true);
        td.id = i + `.` + j;
        tr.appendChild(td);
      }
    }

    elem.appendChild(fragment);
  }
}

export {Table};
