/**
 * depending on the arguments, either picks a random float between two numbers, or a random entry in an array
 * @param {number | array} a - either the lower boundary for the random range or an array
 * @param {number} b - the upper boundary for the random range
 * @returns {number | *} depending on the arguments, either a nubmer or an entry in the array
 */
export const random = (a, b) => {
  if (typeof a == "number" && typeof b == "number") {
    const lo = Math.min(a, b);
    const hi = Math.max(a, b);
    const range = hi - lo;
    return Math.random() * range + lo;
  } else if (Array.isArray(a)) {
    return a[Math.floor(Math.random() * a.length)];
  } else {
    throw new Error("random() arguments error");
  }
};

/**
 * Takes an array and shuffles the order of its content
 * @param {array} array - array to be shuffled
 * @returns {array}
 */

export const shuffle = (array) => {
  let rand, temp;
  let index = arr.length;

  while (index > 1) {
    rand = random(0, 1) * index;
    temp = array[--index];
    array[index] = array[rand];
    array[rand] = temp;
  }

  return array;
};
