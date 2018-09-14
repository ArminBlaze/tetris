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

export default {
  randomInteger,
  nextIndexInArray
};
