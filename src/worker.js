import Canvas from "./util/Canvas";
import ImageData from "./util/ImageData";
import AnimationQueue from "./animation/AnimationQueue";

import Clip from "./animation/Clip";
import Smudge from "./animation/Smudge";
import Worm from "./animation/Worm";
import Squiggle from "./animation/Squiggle";
import Spray from "./animation/Spray";
import Layer from "./animation/Layer";

// GLOBAL VARIABLES _________________________________
let canvas,
  drawLoop,
  images = [];
const queue = new AnimationQueue();

// MESSAGE HANDLING AND ROUTING ______________________
onmessage = (e) => workerMethods[e.data.method](e);

const workerMethods = {
  setup: (e) => {
    canvas = new Canvas(e.data.canvas, e.data.width, e.data.height);
    canvas.background("white");
    drawLoop = requestAnimationFrame(draw);
  },
  loadImage: (e) => {
    const img = new ImageData(e.data.bitmap, e.data.pixels);
    images.push(img);
  },
  random: (e) => {
    queue.add(Spray.random(images, e.data.length));
  },
};

// FUNCTIONS ________________________________________

function draw() {
  queue.update(canvas);
  drawLoop = setTimeout(() => requestAnimationFrame(draw), 1000 / 30);
}
