(function () {
  'use strict';

  const template = ``;

  // import screensController from '../screensController.js';
  //
  // const template = `<section class="main main--welcome">
  //    <section class="logo" title="Угадай мелодию"><h1>Угадай мелодию</h1></section>
  //    <button class="button_start">Начать игру</button>
  //    <h2 class="title main-title">Правила игры</h2>
  //    <p class="text main-text">
  //      Правила просты&nbsp;— за&nbsp;2 минуты дать
  //      максимальное количество правильных ответов.<br>
  //      Удачи!
  //    </p>
  //  </section>`;
  //
  //
  function getElem() {
  //  let table = new Table(model.rows, model.cells);

  //  let tableElem = table.getElem();

  //  let screen = document.querySelector(`.screen`);
  //  screen.appendChild(tableElem);

    const elem = view.getElementFromTemplate(template);
    const button = elem.querySelector(`.button_start`);
    button.onclick = function () {
      view.renderScreen(`screenGame`);
    };

    return elem;
  }

  var screenStart = {
    getElem
  };

  const gameTickSpeed = 50;
  const moveDelay = 200;
  const rotateTick = 500;
  const rotateDelay = 500;

  function decorRotate() {
    if(!model.figure) return;
    model.figure.rotate();
  }

  function decorMove(direction) {
    if(!model.figure) return;
    model.figure.move(direction);
  }

  const Key = {
  //  _pressed: {},
  //  _timers: {},

    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    ESC: 27,

    init() {
      this._pressed = {};
      this._timers = {};
    },

    isDown(keyCode) {
      return this._pressed[keyCode];
    },

    onKeydown(event) {
      this._pressed[event.keyCode] = true;
  //    this._timers[event.keyCode] = true;
    },

    onKeyup(event) {
      delete this._pressed[event.keyCode];
      clearTimeout(this._timers[event.keyCode]);
      delete this._timers[event.keyCode];
    }
  };


  let debouncedRotateWithFirstDelay = throttleWithFirstDelay(decorRotate, Key.UP, rotateTick, rotateDelay);
  let debouncedMoveLeft = throttleWithFirstDelay(decorMove, Key.LEFT, gameTickSpeed, moveDelay);
  let debouncedMoveRight = throttleWithFirstDelay(decorMove, Key.RIGHT, gameTickSpeed, moveDelay);

  // переместить ее в controller, чтобы self = controller
  function throttleWithFirstDelay(f, key, ms, firstDelay) {
  //  let timer;
  //  Key._timers[event.keyCode] = true;
    let args;
    let called = false;

    return function () {
  //				debugger;
      let self = this;
      args = [].slice.call(arguments);

      if (Key._timers[key]) {
        called = true;
        return;
      }

      f.apply(self, args);

  		// рекурсивный вызов timeout вместо interval
      Key._timers[key] = setTimeout(function runTimer() {
  //					debugger;
        if (!called) {
          Key._timers[key] = null;
        }

        if (Key._timers[key] && called) {
          if (Key.isDown(key)) {
            f.apply(self, args);
          }
          Key._timers[key] = setTimeout(runTimer, ms, args);
        }

        called = false;
      }, firstDelay, args);
    };
  }

  let controller = {
    init() {
      let startButton = document.querySelector(`.button_start`);
      let pauseButton = document.querySelector(`.button_pause`);

      startButton.onclick = function () {
        model.init();
        model.startGame();
      };

      pauseButton.onclick = function () {
        model.figure.pause();
      };
    },

    activate() {
  //    window.addEventListener(`keydown`, this.keyHandle);

      window.addEventListener(`keyup`, this.keyUpHandle, false);
      window.addEventListener(`keydown`, this.keyDownHandle, false);
      this.activateKeyRefresher();
      Key.init();
    },

    deactivate() {
  //    window.removeEventListener(`keydown`, this.keyHandle);

      window.removeEventListener(`keyup`, this.keyUpHandle);
      window.removeEventListener(`keydown`, this.keyDownHandle);
      this.deactivateKeyRefresher();
    },

    keyDownHandle(e) {
      Key.onKeydown(e);

      // отменяем событие
      let keycode = e.keyCode;

      switch (keycode) {
        case Key.LEFT:
        case Key.UP:
        case Key.RIGHT:
        case Key.DOWN:
          e.preventDefault();
          break;
        case Key.ESC:
          e.preventDefault();
          model.figure.pause();
          break;
      }
    },

    keyUpHandle(e) {
      Key.onKeyup(e);
    },

    activateKeyRefresher() {
      this.keyTimer = setInterval(this.keyUpdate, gameTickSpeed);
    },

    deactivateKeyRefresher() {
      clearInterval(this.keyTimer);
    },

    keyUpdate() {
      if (!model.figure) {
        return;
      }

      if (Key.isDown(Key.UP)) {
        debouncedRotateWithFirstDelay();
      }

      if (Key.isDown(Key.LEFT)) {
        debouncedMoveLeft(`left`);
      }
      if (Key.isDown(Key.DOWN)) {
        model.figure.move(`down`);
      }
      if (Key.isDown(Key.RIGHT)) {
        debouncedMoveRight(`right`);
      }
      if (Key.isDown(Key.ESC)) ;
    },

    // тут нужно тестировать на выход за пределы поля и пересечение с "кучей"
    testCoords(coords) {
  //    console.log(coords);
      // каждый пиксель фигуры нужно протестировать
      return coords.every((item) => {
        return this.testPixel(item);
      });
    },

    testPixel(coords) {
  //    console.log(coords);
      // проверка на выход за пределы поля
      let pixelCoords = model.splitCoords(coords);
  //    console.log(pixelCoords);

      // убрать pixelCoords.row < 0 чтобы можно было располагать фигуры сверху за экраном
      if (pixelCoords.row >= model.rows || pixelCoords.cell < 0 || pixelCoords.cell >= model.cells) {
  //      console.log(pixelCoords);
  //      console.log(`пиксель пытается попасть за пределы экрана`);
        return false;
      }


      // проверка на пересечение с кучей
      // model.lines[row][column]
      if (pixelCoords.row >= 0 && model.lines[pixelCoords.row][pixelCoords.cell]) {
  //      console.log(pixelCoords);
  //      console.log(`пересечение с кучей`);
        return false;
      }

      return true;
    },

    isHit(location) {
      let row = +location.charAt(0);
      let column = +location.charAt(1);

      return (model.lines[row][column]);
    }
  };

  let _screenTable;
  let _nextFigureScreen;
  let _linesSpan;
  let _speedSpan;


  function getElem$1() {
  //  const elem = view.getElementFromTemplate(template);
  //  const button = elem.querySelector(`.button_start`);
  //  button.onclick = function () {
  //    view.renderScreen(`screenArtist`);
  //  };

    setTimeout(init, 0);

    return elem;
  }

  function init() {
  //  _screenTable = document.querySelector(`.screen`);
  //  _nextFigureScreen = document.querySelector(`.nextFigure__table`);
  //  _linesSpan = document.querySelector(`.info__score`);
  //  _speedSpan = document.querySelector(`.info__speed`);
    model.generateFigure();
  //  controller.init();
  }

  // let screenTable = document.querySelector(`.screen`);
  // let nextFigureScreen = document.querySelector(`.nextFigure__table`);
  // let linesSpan = document.querySelector(`.info__score`);
  // let speedSpan = document.querySelector(`.info__speed`);

  var screenGame = {
    getElem: getElem$1,
    get screenTable() {
      return _screenTable;
    },
    get nextFigureScreen() {
      return _nextFigureScreen;
    },
    get linesSpan() {
      return _linesSpan;
    },
    get speedSpan() {
      return _speedSpan;
    }
  };

  const template$1 = (highScore) => `<div class="score">
<h1 class="score__title">High Scores</h1>\
<p>Вы набрали: <span class="score__currentRecord">${highScore.score}</span></p>
<table class="score__table">
<tr><th>Игрок</th><th>Линии</th></tr>
${highScore.record.map((item) => {
  return `<tr  class="score__row">
          <td  class="score__cell score__cell_name">${item.name}</td>
          <td  class="score__cell score__cell_score">${item.score}</td>
        </tr>`;
}).join(``)}
</table>


<button type="button" class="score__button">Удалить рекорды?</button>
</div>`;

  function getElem$2() {
    let record = model.record;
    let score = model.score;

    const elem = view.getElementFromTemplate(template$1({record, score}));
    const button = elem.querySelector(`.score__button`);
    button.onclick = function () {
  //    model.init();
  //    view.renderScreen(`screenGame`);

      //кнопка должна удалять рекорды
      model.deleteHighScore();

      //и обновлять таблицу
      let scoreElem = document.querySelector(`.score`);
      scoreElem.innerHTML = `<h1 class="score__title score__title_center">Рекорды сброшены</h1>`;
  //    model.gameOver();
    };

  //  setTimeout(init, 0);

    return elem;
  }

  //function showHighScores() {
  //  let record = model.record;
  //  console.log(`Game over!
  //Вы набрали: ${model.score} очков.
  //Рекорд: ${model.record[0].name} - ${model.record[0].score}`);
  //  debugger;
  //}

  var screenScore = {
    getElem: getElem$2
  };

  const screens = {
    screenStart,
    screenGame,
    screenScore
  };

  let board = document.querySelector(`#board`);
  let screenTable = document.querySelector(`.screen`);
  let nextFigureScreen = document.querySelector(`.nextFigure__table`);
  let linesSpan = document.querySelector(`.info__score`);
  let speedSpan = document.querySelector(`.info__speed`);


  let view = {
    nextFigureScreen,

    init() {
  //    this.renderScreen(`screenStart`);
  //    this.showOverlay(`start`);
      this.overlay = document.querySelector(`.overlay__start`);
    },

    displayMessage(msg) {
      let area = document.getElementById(`messageArea`);
      area.innerHTML = msg;
    },

  	// location нужно передавать как строку ("01"), иначе JS будет считать это 8-ричным числом
    displayHit(location, area) {
      if (location[0] === `-`) {
        return;
      }
  //    console.log(location);
      // берем либо экран игры либо экран следующей фигуры
      if (!area) {
  //      area = screenGame.screenTable;
        area = screenTable;
      } else {
  //      area = screenGame.nextFigureScreen;
        area = nextFigureScreen;
      }

      location = location + ``;
  //    let cell = area.getElementById(location);
      // экранируем первый символ, т.к. имена классов - цифры
      let firstLocationNum = `\\3` + location[0] + ` `;
      let restLocation = location.slice(1);
      restLocation = restLocation.replace(`.`, `\\.`);

      // ищём ячейку
      let cell = area.querySelector(`.` + firstLocationNum + restLocation);

      // экранировать первую цифру и точку

  //    debugger;
  //    let unicodeNum = location.charCodeAt(0);
  //    let unicodeNum2 = location.charCodeAt(1);
  //    let unicodeNum3 = location.charCodeAt(2);
  //    console.log(String.fromCharCode(unicodeNum,unicodeNum2,unicodeNum3));
  //    let cell = area.getElementsByClassName(`.` + location)[0];
  //		cell.setAttribute("class", "hit");
      if (!cell) {
        return;
      }
      cell.classList.add(`hit`);
    },

    clearCell(location) {
      location = location + ``;
      let cell = document.getElementById(location);
  //		cell.setAttribute("class", "");
      if (!cell) {
        return;
      }
      cell.classList.remove(`hit`);
    },

    refresh() {
  //    console.log(`view.refresh`);
      for (let i = 0; i < model.currentState.lines.length; i++) {
        for (let j = 0; j < model.currentState.lines[i].length; j++) {
          if (model.currentState.lines[i][j]) {
            this.displayHit(i + `.` + j);
          } else {
            this.clearCell(i + `.` + j);
          }
        }
      }


    },

    refreshNextFigure() {
      nextFigureScreen.querySelectorAll(`td`).forEach((cell) => cell.classList.remove(`hit`));
    },

    displayNextFigure(coords) {


      // отрисовать поле нужного размера

      // отрисовать на нём фигуру


  //     и отрисовать след фигуру в окошке, передав параметр - элемент куда отрисовать
      coords.forEach((item) => {
        this.displayHit(item, `draw nextFigure`);
      });
    },

    refreshInfo() {
    // пишем сколько линий стерто
      linesSpan.innerHTML = model.score;
      speedSpan.innerHTML = model.speed;
  //    nextFigureBlock.innerHTML = model.nextFigure;
    },

    getElementFromTemplate(template) {
      let container = document.createElement(`template`);
      container.innerHTML = template;
      return container.content;
    },

    renderScreen(name, parent) {
      let elem = screens[name].getElem();
      parent.innerHTML = ``;
      parent.appendChild(elem);
    },

    // принимаем имя оверлея на вход и ищём его по классу
    // name => querySelector(`.overlay++` + name);
    showOverlay(name) {

      // меняем классы у существуюущих в разметке элементов с классом .overlay
      // например - .overlay .overlay__start .hidden
      // удаляем .hidden - этот экран становится виден
      if (this.overlay) {
        this.hideOverlay();
      }

      this.overlay = document.querySelector(`.overlay__` + name);
      this.overlay.classList.remove(`hidden`);

  //    board.innerHTML = ``;
  //    board.appendChild(elem);
  //    console.log(screens);
    },

    hideOverlay() {
      this.overlay.classList.add(`hidden`);
    }
  };

  function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
  }

  function nextIndexInArray(index, arr) {
    if (index < arr.length - 1) {
      return ++index;
    } else if (index === arr.length - 1) {
      return 0;
    }
  }

  function debounce (f, ms) {
    var timer;

    return function() {
      if(timer) clearTimeout(timer);

      var self = this;
      var args = [].slice.call(arguments);

      timer = setTimeout(function() {
        f.apply(self, args);
      }, ms, args);
    };
  }
  function throttle (f, ms) {
  	var timer;
  	var args;
  	var called = false;

  	return function() {	
  //				debugger;
  		var self = this;
  		args = [].slice.call(arguments);

  		if(timer) {
  			called = true;
  			return;
  		}

  		f.apply(self, args);

  		//рекурсивный вызов timeout вместо interval
  		timer = setTimeout(function runTimer() {
  //					debugger;
  			if(!called) {
  				timer = null;
  			}

  			if (timer && called) {
  				f.apply(self, args);
  				timer = setTimeout(runTimer, ms, args);
  			}

  			called = false;
  		}, ms, args);
  	};
  }


      // возвращает cookie с именем name, если есть, если нет, то undefined
  function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
          `(?:^|; )` + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, `\\$1`) + `=([^;]*)`
        ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }


  // Аргументы:
  // name  название cookie
  //
  // value значение cookie (строка)
  //
  // options Объект с дополнительными свойствами для установки cookie:
  //
  // expires Время истечения cookie. Интерпретируется по-разному, в зависимости от типа:
  //
  //        Число – количество секунд до истечения. Например, expires: 3600 – кука на час.
  //        Объект типа Date – дата истечения.
  //        Если expires в прошлом, то cookie будет удалено.
  //        Если expires отсутствует или 0, то cookie будет установлено как сессионное и исчезнет при закрытии браузера.
  //
  // path Путь для cookie.
  //
  // domain Домен для cookie.
  //
  // secure Если true, то пересылать cookie только по защищенному соединению.
  //
  //    setCookie('test', '123', {expires: 0});
  //    setCookie('key2', "", {expires: 1 * 365 * 24 * 60 * 60}); кука на год

  function setCookie(name, value, options) {
    options = options || {};

    let expires = options.expires;

    if (typeof expires === `number` && expires) {
      let d = new Date();
      d.setTime(d.getTime() + expires * 1000);
      expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
      options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    let updatedCookie = name + `=` + value;

    for (let propName in options) {
      updatedCookie += `; ` + propName;
      let propValue = options[propName];
      if (propValue !== true) {
        updatedCookie += `=` + propValue;
      }
    }

    console.log(updatedCookie);
    document.cookie = updatedCookie;
  }

  function deleteCookie(name) {
    setCookie(name, ``, {
      expires: -1
    });
  }


  var utils = {
    randomInteger,
    nextIndexInArray,
    getCookie,
    setCookie,
    deleteCookie,
  	debounce,
  	throttle
  };

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

  const delayBetweenFigures = 300;


  // Прототип с методами
  class Figure {

    get currentCoords() {
      return this._currentCoords;
    }
    set currentCoords(coords) {
      this._currentCoords = coords;
    }

    drawFigure() {
      // протестировать координаты перед отрисовкой, если заняты - конец игры
      let canMove = controller.testCoords(this.currentCoords);

      if (!canMove) {
        model.gameOver();
      }

      view.refresh();

      this.currentCoords.forEach((item) => {
        view.displayHit(item);
      });
    }

    drawNextFigure() {
      console.log(`drawNextFigure()`);
      // нужно рефрешить оконо след фигуры
      view.refreshNextFigure();

      // вызвать calculateFigureSize и получить размер фигуры
      this.calculateFigureSize();

      // генерируем мини-таблицу для следующей фигуры
      // вызвать функцию генерации таблицы (поля) с указанным размером
      // она должна получить размер и вернуть элемент
      this.table = new Table(this.rows, this.cells);

      let table = this.table.getElem();
  //    let nextFigureScreen = document.querySelector(`.nextFigure__table`);
  //    debugger;
      if (!view.nextFigureScreen) {
        return;
      }

      view.nextFigureScreen.innerHTML = ``;
      view.nextFigureScreen.appendChild(table);

      let coords = this.previewCoords || this.coords;

      view.displayNextFigure(coords);
  //
    }

    calculateFigureSize() {
  //    console.log(`displayNextFigure`, this.coords);
      // вычислить ширину и высоту фигуры
      let minCell = 0;
      let maxCell = 0;
      let minRow = 0;
      let maxRow = 0;

      this.coords.forEach((item) => {
        let coords = model.splitCoords(item);
  //      row: itemRow, cell: itemCell
        if (coords.cell < minCell) {
          minCell = coords.cell;
        }
        if (coords.cell > maxCell) {
          maxCell = coords.cell;
        }
        if (coords.row < minRow) {
          minRow = coords.row;
        }
        if (coords.row > maxRow) {
          maxRow = coords.row;
        }
      });

      let width = (maxCell - minCell) + 1;
      let height = (maxRow - minRow) + 1;

  //    console.log(`Width: ` + width, `Height: ` + height);
      this.cells = width;
      this.rows = height;
    }

    eraseFigure() {
      this.currentCoords.forEach((item) => view.clearCell(item));
    }

    startMoving() {

      // запуск функции вычисления тика
      this.tick = this.calculateTickSpeed();
      view.refreshInfo();

      this.startTimer();


  //    this.timer = setTimeout(function timerok() {
  //      console.log(this);
  //      console.log(model);
  //      console.log(`Сработал таймер ` + this.timer);
  //      //двигаем фигуру вниз
  //      this.move(`down`);
  //
  //      this.tick = 1000 -  model.speed*100;
  //      this.timer = setTimeout(timerok.bind(this), this.tick);
  //    }.bind(this), model.figure.tick);
    }

    startTimer() {
      this.timer = setInterval(function () {
        this.move(`down`);
      }.bind(this), this.tick);
    }

    pause() {
      model.paused = !model.paused;

      if (model.paused) {
        clearInterval(this.timer);
        // Добавить надпись ПАУЗА
        console.log(`Пауза`);
      } else {
        this.startTimer();
      }
    }

    calculateTickSpeed() {
      model.speed = Math.floor(model.score / 10);
      if (model.speed > 9) {
        model.speed = 9;
      }
      // 1000 магическое число - 1секунда. Стандартный таймер
      // 100 магическое число - шаг ускорения таймера, при повышении уровня скорости
      // каждые 10 линий фигура ускоряется на 100мс
      let timerTick = 1000 - model.speed * 100;
  //    console.log(timerTick);
      return timerTick;
    }

    move(direction) {

      if (model.figure != this) {
        debugger;
        console.log(`return!`);
        return;
      }
  //    console.log(direction);
      let coords = this.currentCoords;
  //    console.log(coords);
      let newCoords = this.calculateCoordsAfterMove(coords, direction);
      // тестируем новые координаты на пересечение и границу экрана
      let canMove = controller.testCoords(newCoords);
  //    console.log(canMove);
      // если есть препятствие и движение влево-вправо - не двигаем


      // если нет препятствия - отрисовываем фигуру на новом месте
      if (canMove) {
        this.redrawFigure(newCoords);

      // если есть препятствие и движение вниз - запускаем слияние с кучей
      } else if (!canMove && direction === `down`) {
        // записываем координаты фигуры в кучу
        this.fusionWithMasonry(coords);

        // создаём новую фигуру?
  //      метод model должен удалить фигуру и создать новую

        // задержка при генерации новой фигуры
  //      debugger;
        // удаляем текущую фигуру, чтобы остановить таймер движения фигуры и создаём новую фигуру с задержкой
        this.destroy();

        setTimeout(function () {
          model.generateFigure();
        }, delayBetweenFigures);

  //      model.generateFigure();
      }

    }

    redrawFigure(coords) {
      // удаляем текущие пиксели с поля (clearCell())
      this.eraseFigure();
        // записываем новые пиксели в фигуру
      this.currentCoords = coords;
        // отрисовываем новые пиксели
      this.drawFigure();
    }

    fusionWithMasonry(coords) {
  //    console.log(`Слияние с кучей`);
  //    console.log(model.lines);

      model.linesToDelete = [];
      // выполнить слияние с кучей
      // для каждого пикселя вызвать запись в кучу
      coords.forEach((item) => model.fire(item));

      // выполнить проверку на полную линию (уже выполняется в методе model.fire)
      // вызываем перерисовку всего поля (уже выполняется в методе model.fire)

      // удаляем фигуру
  //    сортируем, чтобы удалять начиная с верхней линии
      model.linesToDelete.sort((a, b) => a - b);
      model.linesToDelete.forEach((row) => model.deleteLine(row));
  //    view.refresh();
    }

    calculateCoordsAfterMove(coords, direction) {
      let newCoords;
      let rowVector = 0;
      let cellVector = 0;

      switch (direction) {
        case `left`:
          cellVector = -1;
          break;
        case `up`:
          rowVector = -1;
          break;
        case `right`:
          cellVector = 1;
          break;
        case `down`:
          rowVector = 1;
          break;
      }

      newCoords = coords.map((item) => {
        let itemCoords = model.splitCoords(item);
        let itemNewPos = (itemCoords.row + rowVector) + `.` + (itemCoords.cell + cellVector);
        return itemNewPos;
      });

  //    console.log(newCoords);
      return newCoords;
    }


    calculateRealCoords(startPos) {
      let startCoords = model.splitCoords(startPos);

  //    console.log(startCoords);

      let absoluteCoords = [];
      this.coords.forEach((item) => {
        let itemCoords = model.splitCoords(item);
        let itemAbsolutePos = (itemCoords.row + startCoords.row) + `.` + (itemCoords.cell + startCoords.cell);
        absoluteCoords.push(itemAbsolutePos);
      });

  //    console.log(absoluteCoords);
      return absoluteCoords;
    }

    rotate() {
      if (this.rotateCoords.length === 0) {
        return;
      }
  		// взять текущее положение фигуры и переключиться на следующее
      let coords = this.currentCoords;

      let nextRotateIndex = utils.nextIndexInArray(this.rotatePosition, this.rotateCoords);

  		// взять вектор следующего положения фигуры
      let nextRotateVector = this.rotateCoords[nextRotateIndex];

  		// сложить текущие координаты с вектором
  //    console.log(coords, nextRotateVector);
      let coordsAfterRotate = this.sumTwoVectors(coords, nextRotateVector);

  		// проверить координаты - можно ли повернуть
      let canMove = controller.testCoords(coordsAfterRotate);
      if (!canMove) {
        return;
      }

  		// если проверка прошла - записать в this.rotatePosition
      this.rotatePosition = nextRotateIndex;

      // перерисовать фигуру
      this.redrawFigure(coordsAfterRotate);

    }

    sumTwoVectors(coords1, coords2) {
  //    console.log(coords1, coords2);
      let newCoords = coords1.map((item, i) => {
        let splitted1 = model.splitCoords(coords1[i]);
        let splitted2 = model.splitCoords(coords2[i]);
  //      console.log(splitted1, splitted2);

        let newCoord = (splitted1.row + splitted2.row) + `.` + (splitted1.cell + splitted2.cell);
  //      console.log(newCoord);
        return newCoord;
      });

  //    console.log(newCoords);
      return newCoords;
    }

    destroy() {
      // убирает таймер и удаляет фигуру\
  //    console.log(`удаляем фигуру`, this);
      model.figure = null;
      clearInterval(this.timer);
    }
  }


  // Фигуры

  class Square extends Figure {
    constructor() {
      super();
      this.init();
    }

    init() {
      this.coords = [`0.0`, `0.1`, `1.0`, `1.1`];
      this.rotatePosition = 0;
      this.rotateCoords = [];
    }
  }


  class Line extends Figure {
    constructor() {
      super();
      this.init();
    }

    init() {
      this.coords = [`0.-1`, `0.0`, `0.1`, `0.2`];
      this.previewCoords = [`0.0`, `0.1`, `0.2`, `0.3`];
      this.rotatePosition = 0;
      this.rotateCoords = [
  			[`3.-1`, `2.0`, `1.1`, `0.2`],
  			[`-3.1`, `-2.0`, `-1.-1`, `0.-2`]
      ];
    }
  }

  class Zeka extends Figure {
    constructor() {
      super();
      this.init();
    }

    init() {
      this.coords = [`1.0`, `1.1`, `0.1`, `0.2`];
      this.rotatePosition = 0;
      this.rotateCoords = [
  			[`+2.0`, `+1.+1`, `0.0`, `-1.+1`],
  			[`-2.0`, `-1.-1`, `0.0`, `+1.-1`]
      ];
    }
  }

  class ZekaReverse extends Figure {
    constructor() {
      super();
      this.init();
    }

    init() {
      this.coords = [`0.0`, `0.1`, `1.1`, `1.2`];
      this.rotatePosition = 0;
      this.rotateCoords = [
  			[`-1.-1`, `0.0`, `+1.-1`, `+2.0`],
  			[`+1.+1`, `0.0`, `-1.+1`, `-2.0`]
      ];
    }
  }

  class Leka extends Figure {
    constructor() {
      super();
      this.init();
    }

    init() {
      this.coords = [`1.0`, `1.1`, `1.2`, `0.2`];
      this.rotatePosition = 3;
      this.rotateCoords = [
  			[`-2.+0`, `-1.-1`, `+0.-2`, `+1.-1`],
  			[`+1.+2`, `-0.+1`, `-1.+0`, `-0.-1`],
  			[`+1.+0`, `-0.+1`, `-1.+2`, `-2.+1`],
  			[`+0.-2`, `+1.-1`, `+2.0`, `+1.+1`]
      ];
    }
  }

  class LekaReverse extends Figure {
    constructor() {
      super();
      this.init();
    }

    init() {
  //    this.coords = [`0.1`, `1.1`, `2.1`, `2.0`];
      this.coords = [`1.2`, `1.1`, `1.0`, `0.0`];
      this.rotatePosition = 1;
      this.rotateCoords = [
  			[`-1.+1`, `+0.-0`, `+1.-1`, `-0.-2`],
  			[`+2.+1`, `+1.+0`, `-0.-1`, `-1.+0`],
  			[`+0.-2`, `-1.-1`, `-2.+0`, `-1.+1`],
  			[`-1.-0`, `+0.+1`, `+1.+2`, `+2.+1`]
      ];
    }
  }

  class Troyka extends Figure {
    constructor() {
      super();
      this.init();
    }

    init() {
      this.coords = [`1.0`, `1.1`, `1.2`, `0.1`];
      this.rotatePosition = 0;
      this.rotateCoords = [
  			[`-0.-1`, `+1.-0`, `+2.+1`, `-0.+1`],
  			[`-2.+1`, `-1.+0`, `-0.-1`, `-0.+1`],
  			[`+1.+1`, `-0.-0`, `-1.-1`, `+1.-1`],
  			[`+1.-1`, `+0.+0`, `-1.+1`, `-1.-1`]
      ];
    }
  }

  const figures = [
    Square,
    Line,
    Zeka,
    ZekaReverse,
    Leka,
    LekaReverse,
    Troyka
  ];

  const initState = Object.freeze({
    rows: 20,
    cells: 10,
    speed: 0,
    score: 0
  });

  let currentState = null;

  let model = {
    figures,
    initState,
    currentState,
    paused: false,
    HIGH_SCORES_LENGTH: 10,
    HIGH_SCORES_NAME: `HighScores`,
    get rows() {
      return this.currentState.rows;
    },
    get cells() {
      return this.currentState.cells;
    },
    get lines() {
      return this.currentState.lines;
    },
    get score() {
      return this.currentState.score;
    },
    set score(score) {
      this.currentState.score = score;
    },
    get speed() {
      return this.currentState.speed;
    },
    set speed(num) {
      this.currentState.speed = num;
    },

    init() {
      this.currentState = Object.assign({}, this.initState);
      this.generateLines();
      this.gameInProgress = true;
    },

    startGame() {
      view.hideOverlay();
      model.generateFigure();
      controller.activate();
    },

    gameOver() {
      // тут нужен переход на экран конца игры
      // но пока можно просто перезапускать игру
      // значит нужно запустить метод перезапуска игры
  //    alert(`Game over! \nВы набрали: ${this.score} очков.`);

      this.gameInProgress = false;
      controller.deactivate();

      // записываем highScores
      this.handleHighScore();

      // переключаем экран и там уже выводим таблицу
      // создаём оверлей
      view.showOverlay(`score`);

      // пишем в оверлей таблицу
      view.renderScreen(`screenScore`, document.querySelector(`.overlay__score`));

      // выводим таблицу highScores
      // Этот метод нужно перенести в экран
    },

    handleHighScore() {
  //    utils.getCookie
  //    utils.setCookie

      // Получить пред результат

      let currentScore = this.score;

  //    let prevScore = utils.getCookie(`score1`);
  // //    Если текущий больше - обновить
  //    if (!prevScore || prevScore < currentScore) {
  //
  //      utils.setCookie(`score1`, currentScore, {expires: 1 * 365 * 24 * 60 * 60});
  //    }
  //
  // //     setCookie('key2', "", {expires: 1 * 365 * 24 * 60 * 60}); кука на год
  //
  //    this.record = utils.getCookie(`score1`);


      // сравнить текущий результат со всеми в массиве рекордов
      this.compareHighScore();

      //    Если текущий больше - обновить
      //    if (!prevScore || prevScore < currentScore) {
  //
  //      utils.setCookie(`score1`, currentScore, {expires: 1 * 365 * 24 * 60 * 60});
  //    }
  //
  // //     setCookie('key2', "", {expires: 1 * 365 * 24 * 60 * 60}); кука на год
  //
  //    this.record = utils.getCookie(`score1`);
    },

    deleteHighScore() {
      // удаляем таблицу рекордов
      utils.deleteCookie(this.HIGH_SCORES_NAME);
    },

    compareHighScore() {
      // получить массив рекордов
      let score = this.score;
      let prevScores = this.getHighScoresArray();
      this.record = prevScores;
  //    console.log(prevScores);


      // если массив пуст - создать новый массив и записать текущее значение и имя пользователя
      if (!prevScores) {
        prevScores = [this.createHighScore()];
      }
      // если массив короче определённого значения - просто добавляем в него рекорд
  //    и сортируем массив
      else if (prevScores.length < this.HIGH_SCORES_LENGTH) {
        prevScores.push(this.createHighScore());
        prevScores.sort((a, b) => b.score - a.score);
      }
      // если массив есть - перебираем его и ищем куда вставить текущее значение
      // если
      else {
        // находим первый результат, который меньше текущего
        let position = false;

        prevScores.some((item, i) => {
          if (score > item.score) {
            position = i;
            return true;
          }
        });
        console.log(position);

        if (position === false) {
          return prevScores;
        }

        prevScores.splice(position, 0, this.createHighScore());
        prevScores.length = this.HIGH_SCORES_LENGTH;
      }

      this.record = prevScores;
      this.setHighScoresArray(prevScores);
    },

    createHighScore() {
      let name = this.enterUserName();
      return {name, score: this.score};
    },

    enterUserName() {
      let name = prompt(`Введите своё имя:`, ``);
      return name;
    },

    setHighScoresArray(arr) {
      console.log(arr);

      arr = JSON.stringify(arr);
  //     Преобразование массива в строку:
  //    > JSON.stringify([1, 2])
  //    *returns* '[1, 2]'
  //
  //    Затем мы можем сделать его печеньем:
  //    > $.cookie('cookie', '[1, 2]')
  //
  //    И затем проанализируйте его:
  //    > JSON.parse($.cookie('cookie'))
  //    *returns* [1, 2]
      utils.setCookie(this.HIGH_SCORES_NAME, arr, {expires: 1 * 365 * 24 * 60 * 60});
    },


    getHighScoresArray() {
      let cookie = utils.getCookie(this.HIGH_SCORES_NAME);
  //    console.log(cookie);
      if (cookie) {
        return JSON.parse(cookie);
      } else {
        return null;
      }
    },


    generateLines() {
      let lines = [];
      for (let i = 0; i < this.currentState.rows; i++) {
        let arr = new Array(this.currentState.cells);
        arr.fill(0);
        lines.push(arr);
      }
  //    console.log(lines);
      this.currentState.lines = lines;
    },

    splitCoords(coords) {
      let itemPos = coords.split(`.`);
      let itemRow = +itemPos[0];
      let itemCell = +itemPos[1];
      return {row: itemRow, cell: itemCell};
    },


    pickRandomFigure() {
  //		console.log(this.figures.length);
      let rand = utils.randomInteger(0, this.figures.length - 1);

      return new this.figures[rand]();
    },


    // эта функция должна выбирать одну рандомную фигуру
    generateFigure() {
      // let figure = pickRandomFigure()
  //    if (this.figure) {
  //      this.figure.destroy();
  //    }

      // если игра закончилась, ничего не создавать
      if (!this.gameInProgress) {
        return;
      }
  //    debugger;

      if (this.nextFigure) {
        this.figure = this.nextFigure;
      } else {
        this.figure = this.pickRandomFigure();
      }

      this.nextFigure = this.pickRandomFigure();

  //    console.log(`Эта фигура: `, this.figure);
  //    console.log(`След фигура: `, this.nextFigure);

  //    let coords = this.figure.coords;
  //    console.log(coords);
      let center = this.currentState.cells / 2 - 1;
  //    console.log(center);
  //    figure.currentCoords =;
      this.figure.currentCoords = this.figure.calculateRealCoords(`0.${center}`);
  //    console.log(this.figure.currentCoords);

      this.figure.drawFigure();

      // отрисовать следующую фигуру в окне след фигуры
  //    console.log(this.nextFigure);
      if (!this.gameInProgress) {
        return;
      }

      this.nextFigure.drawNextFigure();

      // запускает таймер движения фигуры
      this.figure.startMoving();
    },


    fire(location) {
      let coords = this.splitCoords(location);
      let row = coords.row;
      let column = coords.cell;

      this.lines[row][column] = 1;
  //		console.log(this.lines);
      view.displayHit(location);
      if (this.isFullLine(row)) {
        this.score++;
        console.log(`Score: ` + this.score);
  //      this.deleteLine(row);

        this.linesToDelete.push(row);
  //      console.log(this.lines);
      }
    },

  //  addToMasonry(pixel) {
  //    console.log(pixel);
  //  },

    isFullLine(row) {
      for (let i = 0; i < this.lines[row].length; i++) {
        if (!this.lines[row][i]) {
          return false;
        }
      }

      return true;
    },

    deleteLine(row) {
  //    debugger;
      console.log(`удаляем линию ` + row);
      do {
        this.lines[row] = this.lines[row - 1];
        row--;
      } while (row >= 1);
  //    this.lines[0] = [0, 0, 0, 0, 0, 0, 0];
      this.lines[0] = new Array(model.cells).fill(0);
    }
  };

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

}());

//# sourceMappingURL=main.js.map
