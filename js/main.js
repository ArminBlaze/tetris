import {model} from './model.js';
import {controller} from './controller.js';
import {Table} from './table.js';


class Application {

  constructor() {
    model.init();
    controller.init();
    this.table = new Table(model.rows, model.cells);

    this.render();
  }

  render() {
    let table = this.table.getElem();
    let screen = document.querySelector(`.screen`);
    screen.appendChild(table);

    model.generateFigure();
//    document.body.append(this.userList.getElem());
//
//    this.load();
//
//    this.userList.getElem().addEventListener('user-select', this.onUserSelect.bind(this))
  }
}

let app = new Application();

