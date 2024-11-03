import Canvas from "./util/Canvas";
import loadingAnimation from "./loading";
import patcher from "./max/TAS_main.rnbopat.export.json";

import { random } from "./util/random_util";
import { setVideoStream, captureImages } from "./imageCapture";
import { init_RNBO } from "./rnbo_setup";

const systemWorker = new Worker(new URL("./worker.js", import.meta.url));

const startButton = document.getElementById("start");
const display = document.getElementById("display");
const offscreenCanvas = display.transferControlToOffscreen();

const video = setVideoStream(document.getElementById("viewFinder")); //set up video
const device = init_RNBO(patcher, () => {
  startButton.style.display = "block";

  // device.onMessage((e) => {
  //   if (e.tag == "out3") {
  //     if (e.payload[1] == 0) return;
  //     switch (e.payload[0]) {
  //       case 0:
  //         systemWorker.postMessage({
  //           method: "animation",
  //           length: e.payload[1],
  //           type: "clip",
  //         });
  //         break;
  //       case 1:
  //         systemWorker.postMessage({
  //           method: "animation",
  //           length: e.payload[1],
  //           type: "spray",
  //         });
  //         break;
  //       case 2:
  //         systemWorker.postMessage({
  //           method: "animation",
  //           length: e.payload[1],
  //           type: "smudge",
  //         });
  //         break;
  //       case 3:
  //         systemWorker.postMessage({
  //           method: "animation",
  //           length: e.payload[1],
  //           type: "layer",
  //         });
  //         break;
  //       case 4:
  //         systemWorker.postMessage({
  //           method: "animation",
  //           length: e.payload[1],
  //           type: "squiggle",
  //         });
  //         break;
  //       case 5:
  //         systemWorker.postMessage({
  //           method: "animation",
  //           length: e.payload[1],
  //           type: "worm",
  //         });
  //         break;
  //       case 6:
  //         systemWorker.postMessage({
  //           method: "animation",
  //           length: e.payload[1],
  //           type: "line",
  //         });
  //         break;
  //       default:
  //         console.log(e.payload);
  //     }
  //   }
  // });
});

startButton.onclick = () => {
  document.getElementById("cover").style.display = "none"; //hide cover page
  document.getElementById("videoContainer").style.display = "block"; //show video

  //init loading animation
  const loading = new Canvas(
    document.getElementById("loading"),
    video.videoWidth,
    video.videoHeight
  );
  loadingAnimation.start(loading, 0.25); //start animation

  console.log("starting audio recording");
  device.sendMessage("in3", [1]); // start audio recording
  setTimeout(() => {
    loadingAnimation.stop();
    loading.hideCanvas();
    video.style.display = "none";
    document.getElementById("loadText").style.display = "block";
  }, 999);

  captureImages(1000, 10, video, 4, systemWorker, () => {
    //show main canvas
    display.style.display = "block";
  }).then((imgs) => {
    //start the main canvas
    systemWorker.postMessage(
      {
        method: "setup",
        canvas: offscreenCanvas,
        width: imgs[0].width,
        height: imgs[1].height,
      },
      [offscreenCanvas]
    );
    loadingAnimation.stop();
    loading.hideCanvas();
    document.getElementById("loadText").style.display = "none";
  });
};

display.onclick = () => {
  systemWorker.postMessage({
    method: "animation",
    length: random(0.2, 4),
    type: "cutter",
  });
};
