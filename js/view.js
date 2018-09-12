import {model} from './model.js';
import {controller} from './controller.js';

let view = {
  displayMessage(msg) {
    let area = document.getElementById(`messageArea`);
    area.innerHTML = msg;
  },

	// location нужно передавать как строку ("01"), иначе JS будет считать это 8-ричным числом
  displayHit(location) {
    console.log(location);
    location = location + ``;
    let cell = document.getElementById(location);
//		cell.setAttribute("class", "hit");
    cell.classList.add(`hit`);
  },

  clearCell(location) {
    location = location + ``;
    let cell = document.getElementById(location);
//		cell.setAttribute("class", "");
    cell.classList.remove(`hit`);
  },

  refresh() {
    for (let i = 0; i < model.currentState.lines.length; i++) {
      for (let j = 0; j < model.currentState.lines[i].length; j++) {
        if (model.currentState.lines[i][j]) {
          this.displayHit(i + `.` + j);
        } else {
          this.clearCell(i + `.` + j);
        }
      }
    }
  }
};

export {view};
