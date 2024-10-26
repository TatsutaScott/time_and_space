/**Creates a string with the current date and time. Useful for naming downloads to keep track of time
 * @returns {String} - String with date "Year.Month.Day_Hour.Minute"
 */
export function dateString() {
  const now = new Date();

  const date_string = `${now.getFullYear()}.${
    now.getMonth() + 1
  }.${now.getDate()}`;
  const time_string = `${now.getHours()}.${now.getMinutes()}`;

  return date_string + "_" + time_string;
}

/**
 * tests an array to see if every value inside the array is valid
 * @param {Array} arr -array to be tested
 * @returns {boolean}
 */
export function isValid(arr) {
  return arr.every((v) => {
    v != NaN && v != undefined && v != false && v != null;
  });
}
