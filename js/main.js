import {model} from './model.js';
import {Table} from './table.js';
import {view} from './view.js';
import {controller} from './controller.js';


class Application {

  constructor() {
    model.init();

    this.table = new Table(model.rows, model.cells);

    this.render();
  }

  render() {
    let table = this.table.getElem();
    let screen = document.querySelector(`.screen`);
    screen.appendChild(table);

    view.init();
    controller.init();
  }
}

let app = new Application();

