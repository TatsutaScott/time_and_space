import Canvas from "./util/Canvas";
import ImageData from "./util/ImageData";
import AnimationQueue from "./animation/AnimationQueue";

import Clip from "./animation/Clip";
import Smudge from "./animation/Smudge";
import Worm from "./animation/Worm";
import Squiggle from "./animation/Squiggle";
import Spray from "./animation/Spray";
import Layer from "./animation/Layer";

import { random } from "./util/random_util";

// GLOBAL VARIABLES _________________________________
let canvas,
  drawLoop,
  images = [],
  filtered = [];
const queue = new AnimationQueue();

// MESSAGE HANDLING AND ROUTING ______________________
onmessage = (e) => workerMethods[e.data.method](e);
const workerMethods = {
  setup: (e) => {
    canvas = new Canvas(e.data.canvas, e.data.width, e.data.height);
    canvas.background("white");
    // canvas.image(images[images.length - 1].image, 0, 0);
    drawLoop = requestAnimationFrame(draw);
  },
  loadImage: (e) => {
    const img = new ImageData(e.data.bitmap, e.data.pixels);
    images.push(img);
    console.log("image loaded");
  },
  loadFiltered: (e) => {
    if (!Array.isArray(filtered[e.data.arr])) {
      filtered[e.data.arr] = [];
    }
    const img = new ImageData(e.data.bitmap, e.data.pixels);
    filtered[e.data.arr].push(img);
    console.log("filtered image loaded");
  },
  random: (e) => {
    queue.add(random(animations)(random(filtered), e.data.length));
  },
  animation: (e) => {
    queue.add(animations[e.data.type](random(filtered), e.data.length));
  },
};

// FUNCTIONS ________________________________________

function draw() {
  queue.update(canvas);
  drawLoop = setTimeout(() => requestAnimationFrame(draw), 1000 / 30);
}

const animations = {
  clip: Clip.random,
  smudge: Smudge.random,
  worm: Worm.random,
  squiggle: Squiggle.random,
  spray: Spray.random,
  layer: Layer.random,
};
