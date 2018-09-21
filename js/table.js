class Table {
  constructor(rows, cells) {
    this.rows = rows;
    this.cells = cells;
    // конструктор должен получать размер таблицы
  }

  getElem() {
    if (!this.elem) {
      this.render();
    }
    return this.elem;
  }

  render() {
//    this.elem = createElementFromHtml(html);
//
//    this.elem.addEventListener('click', this);

    // тут должен создаваться новый элемент через createElement, а не искаться в документе
    // либо искаться по селектору, который передан в конструкторе
//    this.elem = document.querySelector(`#table`);
    this.elem = document.createDocumentFragment();

    this.template = this.getTemplate();

    // это нужно переписать - оно должно получать размер из конструктора, а не брать из модели
    this.drawTable();
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

  // вместо state.rows нужно передавать объект size.rows/size.cells
  drawTable() {
//    console.log(state);

    let fragment = document.createDocumentFragment();

    for (let i = 0; i < this.rows; i++) {
      let tr = this.template.trTemplate.cloneNode(true);
      fragment.appendChild(tr);

      for (let j = 0; j < this.cells; j++) {
        let td = this.template.tdTemplate.cloneNode(true);
        td.classList.add(`${i + `.` + j}`);
        td.id = i + `.` + j;
        tr.appendChild(td);
      }
    }

    this.elem.appendChild(fragment);
  }
}

export {Table};
