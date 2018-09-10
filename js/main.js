import data from './data.js';
import {Table} from './table.js';


class Application {

  constructor() {
    data.init();
    this.table = new Table();

    this.render();
  }

  render() {
    this.table.getElem();
//    document.body.append(this.userList.getElem());
//
//    this.load();
//
//    this.userList.getElem().addEventListener('user-select', this.onUserSelect.bind(this))
  }

  generateFigure() {
    this.drawFigure(data.currentState.figures.square);
  }

  drawFigure(figure) {
    let coords = figure.coords;

  }

}

let app = new Application();

app.generateFigure();
