const initState = Object.freeze({
  rows: 20,
  cells: 10
});

let currentState;

function init() {
  currentState = Object.assign({}, initState);
  console.log("init");
}

export default {
  init,
  get currentState() {
    return currentState;
  }
};
