import {model} from './model.js';
import {controller} from './controller.js';
import {Table} from './table.js';


class Application {

  constructor() {
    model.init();
    controller.init();
    this.table = new Table();

    this.render();
  }

  render() {
    this.table.getElem();

    model.generateFigure();
//    document.body.append(this.userList.getElem());
//
//    this.load();
//
//    this.userList.getElem().addEventListener('user-select', this.onUserSelect.bind(this))
  }



}

let app = new Application();

