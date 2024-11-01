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
  loadingAnimation.start(loading, 4); //start animation

  console.log("starting audio recording");
  device.sendMessage("in3", [1]); // start audio recording

  captureImages(1000, 4, video, 4, systemWorker, () => {
    //hide video/loading
    loadingAnimation.stop();
    loading.hideCanvas();
    video.style.display = "none";

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
  });
};

display.onclick = () => {
  systemWorker.postMessage({
    method: "random",
    length: random(0.2, 4),
  });
};
