import {model} from './model.js';

import {view} from './view.js';


class Application {

  constructor() {
    model.init();



    this.render();
  }

  render() {
    view.init();
//    document.body.append(this.userList.getElem());
//
//    this.load();
//
//    this.userList.getElem().addEventListener('user-select', this.onUserSelect.bind(this))
  }
}

let app = new Application();

