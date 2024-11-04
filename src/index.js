import Canvas from "./util/Canvas";
import loadingAnimation from "./loading";
import patcher from "./max/TAS_main.rnbopat.export.json";

import { limit } from "./util/math_util";
import { setVideoStream, captureImages } from "./imageCapture";
import { init_RNBO } from "./rnbo_setup";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SETTINGS

const samplingLength = 2000;
const imgCount = 10;
const fullScreen = true;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const systemWorker = new Worker(new URL("./worker.js", import.meta.url));
const startButton = document.getElementById("start");
const display = document.getElementById("display");
const offscreenCanvas = display.transferControlToOffscreen();
const video = setVideoStream(document.getElementById("viewFinder")); //set up video
const functionList = [
  "clip",
  "spray",
  "smudge",
  "layer",
  "squiggle",
  "worm",
  "line",
  "scrap",
];

// initialize the RNBO device
const device = init_RNBO(patcher, () => {
  startButton.style.display = "block";
  // device.onMessage((e) => {
  //   if (e.tag == "out3") {
  //     if (e.payload[1] < 1) return;
  //     const funcIndex = limit(e.payload[0], 0, functionList.length - 1);
  //     const func = functionList[funcIndex];
  //     systemWorker.postMessage({
  //       method: "animation",
  //       length: e.payload[1],
  //       type: func,
  //     });
  //   }
  // });
});

// begins audio and video recording
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

  captureImages(samplingLength, imgCount, video, systemWorker, () => {
    //show main canvas
    display.style.display = "block";
  }).then((imgs) => {
    //canvas dimensions are set based on the mode
    const canvasWidth = fullScreen ? window.innerWidth : imgs[0].width;
    const canvasHeight = fullScreen ? window.innerHeight : imgs[0].height;

    //start the main canvas
    systemWorker.postMessage(
      {
        method: "setup",
        canvas: offscreenCanvas,
        width: canvasWidth,
        height: canvasHeight,
      },
      [offscreenCanvas]
    );

    //transition mode to show main display canvas
    loadingAnimation.stop();
    loading.hideCanvas();
    document.getElementById("loadText").style.display = "none";
  });
};

display.onclick = () => {
  systemWorker.postMessage({
    method: "animation",
    type: "layer",
    length: 1000,
  });
};
