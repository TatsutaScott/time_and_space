/**
 * An easy short hand variable for Two PI
 * @constant
 * @type {number}
 */
export const TAU = Math.PI * 2;

/**shorthand for Math.sin() */
export const sin = (theta) => Math.sin(theta);

/**shorthand for Math.cos() */
export const cos = (theta) => Math.cos(theta);

/**
 * Converts an angle from radians to degrees
 * @param {number} radians - angle in radians
 * @returns {number} angle in degrees
 */
export const toDeg = (radians) => (radians * 180) / Math.PI;

/**
 * Converts and angle from degrees to radians
 * @param {number} degrees - angle in degrees
 * @returns {number} angle in radians
 */
export const toRad = (degrees) => (degrees * Math.PI) / 180;

/**
 * Scales a value between an input range and maps it to an output range
 * @param {number} n - number to be scaled
 * @param {number} inputLo - lower boundary for input range
 * @param {number} inputHi - upper boundary for input range
 * @param {number} outputLo - lower boundary for output range
 * @param {number} outputHi - upper boudnary for output range
 * @returns {number} scaled value
 */
export const map = (n, inputLo, inputHi, outputLo, outputHi) => {
  const inScale = (n - inputLo) / (inputHi - inputLo); // calculates where n sits in the input range and scales it to [0,1]
  const outScale = outputHi - outputLo; // calculates the size of the output range
  return inScale * outScale + outputLo; // multiplies the input ratio by the size of the output range
};

/**
 * Linearly interpolate between 2 values
 * @param {Number} ratio - value describing the transition from starting to ending value (0 - 1)
 * @param {Number} start - starting value (0)
 * @param {Number} end - ending value (1)
 * @returns {Number} interpolated value
 */
export const interp = (ratio, start, end) => {
  return map(ratio, 0, 1, start, end);
};

/**
 * Keeps a number within bounds by wrapping it around
 * @param {Number} val - value to be tested
 * @param {Number} lo - lower bound
 * @param {Number} hi - upper bound
 * @returns {Number} - wrapped value
 */
export const wrap = (val, lo, hi) => {
  return val < lo ? hi : val > hi ? lo : val;
};

/**
 * Keeps a number within bounds by limiting it
 * @param {Number} val - value to be tested
 * @param {Number} lo - lower bound
 * @param {Number} hi - upper bound
 * @returns {Number} - limited value
 */
export const limit = (val, lo, hi) => {
  return val < lo ? lo : val > hi ? hi : val;
};
