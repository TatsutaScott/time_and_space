import Canvas from "./util/Canvas";
import IMG from "./util/IMG";
import AnimationQueue from "./animation/AnimationQueue";

import Clip from "./animation/Clip";
import Smudge from "./animation/Smudge";
import Worm from "./animation/Worm";
import Squiggle from "./animation/Squiggle";
import Spray from "./animation/Spray";
import Layer from "./animation/Layer";

const systemWorker = new Worker(new URL("./worker.js", import.meta.url));

const display = document.getElementById("display");
const offscreenCanvas = display.transferControlToOffscreen();

let drawLoop;
const urls = [];
for (let i = 1; i <= 20; i++) {
  urls.push(`/assets/imgs/frame (${i}).jpg`);
}

systemWorker.postMessage(
  {
    method: "setup",
    canvas: offscreenCanvas,
  },
  [offscreenCanvas]
);

IMG.loadImages(urls).then((imgs) => {
  for (let i of imgs) {
    systemWorker.postMessage(
      {
        method: "loadImage",
        bitmap: i.image,
        pixels: i.pixels,
      },
      [i.image]
    );
  }
});

// const container = document.getElementById("canvasContainer");
// const TAP = new Canvas(container, 100, 100);
// const queue = new AnimationQueue();

// let images, drawLoop;
// const urls = [];
// for (let i = 1; i <= 20; i++) {
//   urls.push(`/assets/imgs/frame (${i}).jpg`);
// }

// IMG.loadImages(urls).then((imgs) => {
//   images = imgs;
//   TAP.setDimensions(imgs[0].width, imgs[0].height);
//   drawLoop = requestAnimationFrame(draw);
// });

// function draw() {
//   queue.update(TAP);
//   drawLoop = setTimeout(() => requestAnimationFrame(draw), 1000 / 30);
// }

// container.onclick = () => {
//   queue.add(Layer.random(images, 1));
// };

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// const video = document.getElementById("viewFinder");
// const startButton = document.getElementById("start");
// const utilCanvas = document.createElement("canvas");
// const utilCtx = utilCanvas.getContext("2d");
// let capturedImages = [];

// //set video stream to show on video element
// navigator.mediaDevices
//   .getUserMedia({ video: true })
//   .then((stream) => {
//     video.srcObject = stream;
//   })
//   .catch((err) => {
//     console.error("Error accessing camera:", err);
//   });

// // capture a set of images from the user camera
// function collectImages(time, num) {
//   capturedImages = []; // Clear previous captures
//   let count = 0;

//   const captureImgs = setInterval(() => {
//     if (count >= num) {
//       clearInterval(captureImgs);
//       console.log("Capture complete. Number of images:", capturedImages.length);
//       return 5;
//     }
//     // Capture the current frame
//     utilCtx.drawImage(video, 0, 0, utilCanvas.width, utilCanvas.height);
//     capturedImages.push(utilCanvas.toDataURL()); // Save image as base64 data URL

//     count++;
//   }, time / num);
// }

// startButton.onclick = () => {
//   const goof = collectImages(4000, 8);
// };

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// import Canvas from "./util/Canvas";
// import loadingAnimation from "./loading";

// import RNBO_device from "./util/rnbo_util";
// import patcher from "./max/TAS_main.rnbopat.export.json";

// const device = new RNBO_device();
// device.init(patcher).then(() => {
//   device.getInput();
//   console.log("RNBO device loaded successfully");

//   device.onMessage((e) => {
//     switch (e.tag) {
//       case "out3":
//         if (e.payload == "1111") {
//           console.log("audio recorded successfully");
//           device.sendMessage("in3", [0]); // turn off recording

//           console.log("initiating main patch");
//           device.sendMessage("in4", [1]); // start main patch

//           loadingAnimation.stop();
//         }
//         break;
//       default:
//     }
//   });
// });

// const start_button = document.getElementById("startBtn");
// const cover_page = document.getElementById("cover");
// const canvasContainer = document.getElementById("canvasContainer");

// start_button.onclick = () => {
//   console.log("starting recording");
//   device.sendMessage("in3", [1]);
//   cover_page.style.display = "none";
//   canvasContainer.style.display = "block";
//   TAP.fullScreen();
//   loadingAnimation.start(TAP);
// };

// const TAP = new Canvas(document.getElementById("canvasContainer"), 100, 100);

////////////////////////////////
////////////////////////////////
