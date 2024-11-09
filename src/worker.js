import Canvas from "./util/Canvas";
import ImageData from "./util/ImageData";
import AnimationQueue from "./animation/AnimationQueue";

import Clip from "./animation/Clip";
import Smudge from "./animation/Smudge";
import Worm from "./animation/Worm";
import Squiggle from "./animation/Squiggle";
import Spray from "./animation/Spray";
import Layer from "./animation/Layer";
import Line from "./animation/Line";
import Scrap from "./animation/Scrap";

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
    canvas.save();
    canvas.ctx.filter = "blur(8px)";
    canvas.image(
      images[images.length - 1].image,
      0,
      0,
      canvas.width,
      canvas.height
    );
    canvas.restore();
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
  randomAnimation: (e) => {
    queue.add(random(animations)(canvas, random(filtered), e.data.length));
  },
  playback: () => {
    queue.add(Clip.full(canvas, images, 4000));
  },
  animation: (e) => {
    if (filtered[0]) {
      queue.add(
        animations[e.data.type](canvas, random(filtered), e.data.length / 1000)
      );
    }
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
  line: Line.random,
  scrap: Scrap.random,
};
