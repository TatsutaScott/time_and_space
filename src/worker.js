import Canvas from "./util/Canvas";
import ImageData from "./util/ImageData";

// GLOBAL VARIABLES ______________________
let canvas,
  images = [];

// MESSAGE HANDLING AND ROUTING ______________________
onmessage = (e) => workerMethods[e.data.method](e);

const workerMethods = {
  setup: (e) => {
    canvas = new Canvas(e.data.canvas, 200, 200);
    canvas.background("red");
  },
  loadImage: (e) => {
    const img = new ImageData(e.data.bitmap, e.data.pixels);
    images.push(img);
  },
};
