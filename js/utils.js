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
};

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


export default {
  randomInteger,
  nextIndexInArray,
  getCookie,
  setCookie,
  deleteCookie,
	debounce,
	throttle
};
