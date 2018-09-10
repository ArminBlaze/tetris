const figures = {
  square: {
    coords: [`a0`, `a2`, `b0`, `b1`]
  }

};

const initState = Object.freeze({
  rows: 20,
  cells: 10,
  figures
});

let currentState;

function init() {
  currentState = Object.assign({}, initState);
  generateLines();
  console.log(`init`);
}

//lines: [
//		[0, 0, 0, 0, 0, 0, 0],
//		[0, 0, 0, 0, 0, 0, 0],
//		[0, 0, 0, 0, 0, 0, 0],
//		[0, 0, 0, 0, 0, 0, 0],
//		[0, 0, 0, 0, 0, 0, 0],
//		[0, 0, 0, 0, 0, 0, 0],
//		[0, 0, 0, 0, 0, 0, 0]
//	],

function generateLines () {
  let lines = [];
  for (let i = 0; i < currentState.rows; i++) {
    let arr = new Array(currentState.cells);
    arr.fill(0);
    lines.push(arr);
  }
  console.log(lines);
  currentState.lines = lines;
}

export default {
  init,
  get currentState() {
    return currentState;
  }
};
