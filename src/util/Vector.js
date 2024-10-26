/** Class representing a 2 dimensional vector */
class Vector {
  /** Make a new Vector
   * @param {number} x - the x coordinate of the vector
   * @param {number} y - the y coordinate of the vector
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * @static generates a vector with a random angle and given length
   * @param {number} length - the length of the vector (Default: 1)
   * @returns {Vector}
   */
  static random(length = 1) {
    const theta = Math.random() * Math.PI * 2; // picks a random number between 0 and 2π
    const x = length * Math.cos(theta); // find the x value using the cosine of theta and scale by length
    const y = length * Math.sin(theta); // find the y value using the sine of theta and scale by length
    return new Vector(x, y);
  }

  /**
   * @static generates a vector based on an angle
   * @param {number} theta - angle to make vector from (in radians)
   * @returns {Vec}
   */
  static fromAngle(theta) {
    const x = Math.cos(theta); // find the x value using the cosine of theta
    const y = Math.sin(theta); // find the y value using the sine of theta
    return new Vector(x, y);
  }

  /**
   * @static gives the distance between two points/vectors
   * @param {Vector} vector1 - first vector
   * @param {Vector} vector2 - second vector
   * @returns {Vector}  distance between the two vectors
   */
  static distance(vector1, vector2) {
    const differenceVector = Vector.sub(vector2, vector1); // subtracts one from the other to find vector between the two
    const distance = differenceVector.magnitude(); // calculates magnitude of the difference vector
    return distance;
  }

  /**
   * @static adds together two vectors and returns their sum as a vector
   * @param {Vector} vector1 - First vector
   * @param {Vector} vector2 - second vector
   * @returns {Vector}
   */
  static add(vector1, vector2) {
    const x = vector1.x + vector2.x; // combine the x values
    const y = vector1.y + vector2.y; // combine the y values
    return new Vector(x, y);
  }

  /**
   * @static subtracts one vector from another and returns the output as a vector
   * @param {Vector} vector1 - first vector
   * @param {Vector} vector2 - second vector
   * @returns {Vector}
   */
  static sub(vector1, vector2) {
    const x = vector1.x - vector2.x; //subtract x values
    const y = vector1.y - vector2.y; // subtract y values
    return new Vector(x, y);
  }

  /**
   * @static multiplys 2 vectors or 1 vector and a number without modifying the inputs
   * @param {Vector} vector1 - first vector
   * @param {Vector | number} b - second vector or number
   * @returns
   */
  static mult(vector1, b) {
    if (typeof vector1 == "object" && typeof b == "number") {
      const x = vector1.x * b;
      const y = vector1.y * b;
      return new Vector(x, y);
    } else if (typeof vector1 == "object" && typeof b == "object") {
      const x = vector1.x * b.x;
      const y = vector1.y * b.y;
      return new Vector(x, y);
    }
  }

  /**
   * @static generates a vector that is created by linearly interpolating between two vectors. (0 is vector 1 and 1 is vector 2)
   * @param {Vector} vector1 - first vector
   * @param {Vector} vector2 - second vector
   * @param {number} interpVal - amount of interpolation
   * @returns {Vector}
   */
  static interpolate(vector1, vector2, interpVal) {
    const x = map(interpVal, 0, 1, vector1.x, vector2.x); // uses the map function to interpolate x value
    const y = map(interpVal, 0, 1, vector1.y, vector2.y); // uses the map function to interpolate y value
    return new Vector(x, y);
  }

  /**
   * @static calculates the point at which 2 lines intersect. lines are defined in the arguments as two pairs of vectors.
   * @param {Vector} v1 - first vector in the first line
   * @param {Vector} v2 - second vector in the first line
   * @param {Vector} v3 - first vector in the second line
   * @param {Vector} v4 - second vector in the second line
   * @returns {Vector} vector representing the point of intersection between the two vectors
   */

  static findIntersection(v1, v2, v3, v4) {
    // Check if none of the lines are of length 0
    if ((v1.x === v2.x && v1.y === v2.y) || (v3.x === v4.x && v3.y === v4.y)) {
      return false;
    }

    const denominator =
      (v4.y - v3.y) * (v2.x - v1.x) - (v4.x - v3.x) * (y2 - v1.y); // calculate the denominator for U

    // Lines are parallel if the denominator is 0
    if (denominator === 0) {
      return false;
    }

    //calculate the line segments
    const ua =
      ((v4.x - v3.x) * (v1.y - v3.y) - (v4.y - v3.y) * (v1.x - v3.x)) /
      denominator;
    const ub =
      ((v2.x - v1.x) * (v1.y - v3.y) - (v2.y - v1.y) * (v1.x - v3.x)) /
      denominator;

    // is the intersection along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
      return false;
    }

    // Return a object with the x and y coordinates of the intersection
    const x = v1.x + ua * (v2.x - v1.x);
    const y = v1.y + ua * (v2.y - v1.y);

    return Vector(x, y);
  }

  /**
   * Maps the vector between a lower boundary and and upper boundary
   * @param {Vector} vector - vector to be mapped
   * @param {Vector} inLo - lower input boundary
   * @param {Vector} inHi - upper input boundary
   * @param {Vector} outLo - lower output boundary
   * @param {Vector} outHi - upper output boundary
   * @returns {Vector} mapped Vector
   */
  static map(vector, inLo, inHi, outLo, outHi) {
    const x = map(vector.x, inLo.x, inHi.x, outLo.x, outHi.x);
    const y = map(vector.y, inLo.y, inHi.y, outLo.y, outHi.y);
    return new Vector(x, y);
  }
}

/**
 * Makes a copy of the vector
 * @returns {Vector}
 */
Vector.prototype.copy = function () {
  return new Vector(this.x, this.y); // make a new vector with the x and y coordinates of the current vec
};

/**
 * Rotates the vector by a given angle
 * @param {number} theta - angle to rotate by (in radians)
 * @returns {this}
 */
Vector.prototype.rotate = function (theta) {
  const newHeading = this.heading() + theta; // gets the current angle and offsets it by theta
  const magnitude = this.magnitude(); // gets the current magnitude of the vector
  this.x = Math.cos(newHeading) * magnitude; // generates new angle's x and scales by vector's magnitude
  this.y = Math.sin(newHeading) * magnitude; // generates new angle's y and scales by vector's magnitude
  return this;
};

/**
 * Calculates the angle of the vector
 * @returns {number} the angle that the vector points
 */
Vector.prototype.heading = function () {
  return Math.atan2(this.y, this.x); // calculates the heading by taking the arctangent of x and y
};

/**
 * Adds a vector to the vector calling the method. Accepts either 1 vector argument, or 2 number arguments that serve as a vector.
 * @param {Vector | number} a - either a vector or the x value of a vector to be added
 * @param {number} b - y value of a vector to be added
 * @returns {this}
 */
Vector.prototype.add = function (a, b) {
  if (arguments.length === 1 && typeof a === "object") {
    // if there is only one argument then run with a as a vector
    this.x += a.x; // add on the x value
    this.y += a.y; // add on the y value
  } else if (typeof a === "number" && typeof b === "number") {
    // if there are two number arguments run as if a and b made up a vector
    this.x += a; // add on the x value
    this.y += b; // add on the y value
  } else {
    // throw an error if the arguments don't match the expected arguments
    throw new Error("Vec.add arguments error");
  }
  return this;
};

/**
 * Subtracts a vector for the vector calling the method. Accepts either 1 vector argument, or 2 number arguments that serve as a vector.
 * @param {Vector | number} a - either a vector or the x value of a vector to be subtracted
 * @param {number} b - y value of a vector to be subtracted
 * @returns {Vector}
 */
Vector.prototype.sub = function (a, b) {
  if (arguments.length === 1 && typeof a === "object") {
    // if there is only one argument then run with a as a vector
    this.x -= a.x; // subtract x value
    this.y -= a.y; // subtract y value
  } else if (typeof a === "number" && typeof b === "number") {
    // if there are two number arguments run as if a and b made up a vector
    this.x -= a; // subtract x value
    this.y -= b; // subtract y value
  } else {
    // throw an error if the arguments don't match the expected arguments
    throw new Error("Vec.sub arguments error");
  }
  return this;
};

/**
 * Multiplies the vector calling the method by another vector. Accepts either 1 vector argument, or 2 number arguments that serve as a vector.
 * @param {Vector | number} a - either a vector or the x value of a vector to multiply by
 * @param {number} b - y value of a vector to multiply by
 * @returns {Vector}
 */
Vector.prototype.mult = function (a, b) {
  if (arguments.length === 1 && typeof a === "object") {
    // if there is only one argument then run with a as a vector
    this.x *= a.x; // multiply x values
    this.y *= a.y; // multiply y values
  } else if (arguments.length === 1 && typeof a === "number") {
    // if there is only one argument then run with a as a scaler value
    this.x *= a; // multiply by a
    this.y *= a; // multiply by a
  } else if (typeof a === "number" && typeof b === "number") {
    // if there are two number arguments run as if a and b made up a vector
    this.x *= a; // multiply x values
    this.y *= b; // multiply y values
  } else {
    // throw an error if the arguments don't match the expected arguments
    throw new Error("Vector.mult arguments error");
  }
  return this;
};

/**
 * Divides the Vector by a scaler value
 * @param {number} n - scaler value to divide Vector by
 * @returns {this}
 */
Vector.prototype.div = function (n) {
  this.x /= n; // divide x value
  this.y /= n; // divide y value
  return this;
};

/**
 * Sets the current vector to the incoming vector. Accepts either 1 vector argument, or 2 number arguments that serve as a vector.
 * @param {Vector | number} a - either a vector or the x value of a vector to be set
 * @param {number} b - y value of a vector to be set
 * @returns {Vector}
 */
Vector.prototype.set = function (a, b) {
  if (arguments.length === 1 && typeof a === "object") {
    // if there is only one argument then run with a as a vector
    this.x = a.x; // set x value
    this.y = a.y; // set y value
  } else if (typeof a === "number" && typeof b === "number") {
    // if there are two number arguments run as if a and b made up a vector
    this.x = a; // set x value
    this.y = b; // set y value
  } else {
    // throw an error if the arguments don't match the expected arguments
    throw new Error("Vector.set arguments error");
  }
  return this;
};

/**
 * Calculates the magnitude or langth of a vector.
 * @returns {number}
 */
Vector.prototype.magnitude = function () {
  return Math.sqrt(this.magSq()); // uses the quake magsq method to calculate magnitude
};

/**
 * Scales the vector to a given magnitude
 * @param {number} mag - the length to set the magnitude of the vector to
 * @returns {this}
 */
Vector.prototype.setMag = function (mag) {
  return this.normalize().mult(mag); // normalizes and then multiplies to scale
};

/**
 * Normalizes the vector so that the magnitude is 1.
 * @returns {this}
 */
Vector.prototype.normalize = function () {
  return this.limit(1); // limit the magnitude of the vector to 1
};

/**
 * Calculate the magnitude squared of the vector
 * @returns {number}
 */
Vector.prototype.magSq = function () {
  return this.x * this.x + this.y * this.y; // squared magnitude
};

/**
 * Limits the magnitude of the Vector to the given magnitude
 * @param {number} mag - magnitude to limit the vector to
 * @returns {this}
 */
Vector.prototype.limit = function (mag) {
  const mSq = this.magSq(); // calculate the mag squared
  if (mSq > mag * mag) {
    // if the mag square of the vector is larger than that of the input magnitude limit
    this.div(Math.sqrt(mSq)).mult(mag); //limit to the given magnitude
  }
  return this;
};

/**
 * Maps the vector between a lower boundary and and upper boundary
 * @param {Vector} inLo - lower input boundary
 * @param {Vector} inHi - upper input boundary
 * @param {Vector} outLo - lower output boundary
 * @param {Vector} outHi - upper output boundary
 * @returns {Vector} this
 */
Vector.prototype.map = function (inLo, inHi, outLo, outHi) {
  this.x = map(this.x, inLo.x, inHi.x, outLo.x, outHi.x);
  this.y = map(this.y, inLo.y, inHi.y, outLo.y, outHi.y);
  return this;
};

/** Floors the x and y values */
Vector.prototype.floor = function () {
  this.x = Math.floor(this.x);
  this.y = Math.floor(this.y);
};

/**
 * Tests a Vector to see if it is inside a given range
 * @param {Number | Vector} a - Either the lower x bound or the lower bound vector
 * @param {Number | Vector} b - Either the lower y bound or the lower bound vector
 * @param {Number} c - upper x bound
 * @param {Number} d - upper y bound
 * @returns {boolean}
 */
Vector.prototype.inRange = function (a, b, c, d) {
  if (arguments.length == 2 && typeof a == "object" && typeof b == "object") {
    const xInRange = this.x > a.x && this.x < b.x;
    const yInRange = this.y > a.y && this.y < b.y;
    return xInRange && yInRange;
  }
  if (arguments.length == 4) {
    const xInRange = this.x > a && this.x < c;
    const yInRange = this.y > b && this.y < d;
    return xInRange && yInRange;
  }
};

/**
 * Scales a value between an input range and maps it to an output range
 * @param {number} n - number to be scaled
 * @param {number} inputLo - lower boundary for input range
 * @param {number} inputHi - upper boundary for input range
 * @param {number} outputLo - lower boundary for output range
 * @param {number} outputHi - upper boudnary for output range
 * @returns {number} scaled value
 */

const map = (n, inputLo, inputHi, outputLo, outputHi) => {
  const inScale = (n - inputLo) / (inputHi - inputLo); // calculates where n sits in the input range and scales it to [0,1]
  const outScale = outputHi - outputLo; // calculates the size of the output range
  return inScale * outScale + outputLo; // multiplies the input ratio by the size of the output range
};

export default Vector;
