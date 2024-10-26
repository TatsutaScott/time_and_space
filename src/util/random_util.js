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
  } else if (typeof a === "object" && a !== null) {
    const random_key =
      Object.keys(a)[(Math.random() * Object.keys(a).length) | 0];
    return a[random_key];
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

// Pretty much completely stolen from p5. ty processing people <3
// http://mrl.nyu.edu/~perlin/noise/
// http://mrl.nyu.edu/~perlin/paper445.pdf
// See: https://github.com/shiffman/The-Nature-of-Code-Examples-p5.js/blob/main/introduction/Noise1D/noise.js

const PERLIN_YWRAPB = 4;
const PERLIN_YWRAP = 1 << PERLIN_YWRAPB;
const PERLIN_ZWRAPB = 8;
const PERLIN_ZWRAP = 1 << PERLIN_ZWRAPB;
const PERLIN_SIZE = 4095;

let perlin_octaves = 4; // default to medium smooth
let perlin_amp_falloff = 0.5; // 50% reduction/octave

const scaled_cosine = (i) => 0.5 * (1 - Math.cos(i * Math.PI));

let perlin; // will be initialized lazily by noise() or noiseSeed()

/**
 * Returns random numbers that can be tuned to feel more organic. The values
 * returned will always be between 0 and 1.
 *
 * @method noise
 * @param  {Number}  x - x-coordinate in noise space.
 * @param  {Number} [y] - y-coordinate in noise space.
 * @param  {Number} [z] - z-coordinate in noise space.
 * @return {Number} Perlin noise value at specified coordinates.
 */

export function noise(x, y = 0, z = 0) {
  // if there's no perlin Array instantiate a new one
  if (!perlin) {
    perlin = new Array(PERLIN_SIZE + 1);
    for (let i = 0; i < PERLIN_SIZE + 1; i++) {
      perlin[i] = Math.random();
    }
  }

  // make sure coordinate values are positive
  x = Math.abs(x);
  y = Math.abs(y);
  z = Math.abs(z);

  // find the integer component of the coordinates
  let xi = Math.floor(x),
    yi = Math.floor(y),
    zi = Math.floor(z);

  // find the leftover fractional component of the coordinates
  let xf = x - xi,
    yf = y - yi,
    zf = z - zi;

  let rxf, ryf;

  let r = 0;
  let ampl = 0.5;

  let n1, n2, n3;

  for (let o = 0; o < perlin_octaves; o++) {
    let of = xi + (yi << PERLIN_YWRAPB) + (zi << PERLIN_ZWRAPB);

    rxf = scaled_cosine(xf);
    ryf = scaled_cosine(yf);

    n1 = perlin[of & PERLIN_SIZE];
    n1 += rxf * (perlin[(of + 1) & PERLIN_SIZE] - n1);
    n2 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
    n2 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n2);
    n1 += ryf * (n2 - n1);

    of += PERLIN_ZWRAP;
    n2 = perlin[of & PERLIN_SIZE];
    n2 += rxf * (perlin[(of + 1) & PERLIN_SIZE] - n2);
    n3 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
    n3 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n3);
    n2 += ryf * (n3 - n2);

    n1 += scaled_cosine(zf) * (n2 - n1);

    r += n1 * ampl;
    ampl *= perlin_amp_falloff;
    xi <<= 1;
    xf *= 2;
    yi <<= 1;
    yf *= 2;
    zi <<= 1;
    zf *= 2;

    if (xf >= 1.0) {
      xi++;
      xf--;
    }
    if (yf >= 1.0) {
      yi++;
      yf--;
    }
    if (zf >= 1.0) {
      zi++;
      zf--;
    }
  }
  return r;
}

/**
 * Adjusts the character of the noise produced by the noise() function.
 *
 * Perlin noise values are created by adding layers of noise together. The
 * noise layers, called octaves, are similar to harmonics in music. Lower
 * octaves contribute more to the output signal. They define the overall
 * intensity of the noise. Higher octaves create finer-grained details.
 *
 * By default, noise values are created by combining four octaves. Each higher
 * octave contributes half as much (50% less) compared to its predecessor.
 * `noiseDetail()` changes the number of octaves and the falloff amount. For
 * example, calling `noiseDetail(6, 0.25)` ensures that
 * <a href="#/p5/noise">noise()</a> will use six octaves. Each higher octave
 * will contribute 25% as much (75% less) compared to its predecessor. Falloff
 * values between 0 and 1 are valid. However, falloff values greater than 0.5
 * might result in noise values greater than 1.
 *
 * @method noiseDetail
 * @param {Number} lod number of octaves to be used by the noise.
 * @param {Number} falloff falloff factor for each octave.
 */

export function noiseDetail(lod, falloff) {
  if (lod > 0) perlin_octaves = lod;
  if (falloff > 0) perlin_amp_falloff = falloff;
}

/**
 * Sets the seed value for noise(). By default, noise()</a> produces different results each time
 * a sketch is run. Calling `noiseSeed()` with a constant
 * argument, such as `noiseSeed(99)`, makes <a href="#/p5/noise">noise()</a>
 * produce the same results each time a sketch is run.
 *
 * @method noiseSeed
 * @param {Number} seed - seed value.
 */
export function noiseSeed(seed) {
  // Linear Congruential Generator (Variant of a Lehman Generator)
  const lcg = (() => {
    // Set to values from http://en.wikipedia.org/wiki/Numerical_Recipes
    // m is basically chosen to be large (as it is the max period) and for its relationships to a and c
    const m = 4294967296;
    // a - 1 should be divisible by m's prime factors
    const a = 1664525;
    // c and m should be co-prime
    const c = 1013904223;
    let seed, z;
    return {
      setSeed(val) {
        // pick a random seed if val is undefined or null
        // the >>> 0 casts the seed to an unsigned 32-bit integer
        z = seed = (val == null ? Math.random() * m : val) >>> 0;
      },
      getSeed() {
        return seed;
      },
      rand() {
        // define the recurrence relationship
        z = (a * z + c) % m;
        // return a float in [0, 1)
        // if z = m then z / m = 0 therefore (z % m) / m < 1 always
        return z / m;
      },
    };
  })();

  lcg.setSeed(seed);
  perlin = new Array(PERLIN_SIZE + 1);
  for (let i = 0; i < PERLIN_SIZE + 1; i++) {
    perlin[i] = lcg.rand();
  }
}
