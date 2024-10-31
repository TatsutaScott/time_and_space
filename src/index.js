import IMG from "./util/IMG";
import Canvas from "./util/Canvas";
import loadingAnimation from "./loading";
import RNBO_device from "./util/rnbo_util";
import patcher from "./max/TAS_main.rnbopat.export.json";

import { random } from "./util/random_util";

const systemWorker = new Worker(new URL("./worker.js", import.meta.url));

const cover_page = document.getElementById("cover");
const video = document.getElementById("viewFinder");
const startButton = document.getElementById("start");
const videoContainer = document.getElementById("videoContainer");
const display = document.getElementById("display");
const offscreenCanvas = display.transferControlToOffscreen();

//set video stream to show on video element
navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch((err) => {
    console.error("Error accessing camera:", err);
  });

const device = new RNBO_device();
device.init(patcher).then(() => {
  device.getInput();
  console.log("RNBO device loaded successfully");
  start.style.display = "block";

  device.onMessage((e) => {
    switch (e.tag) {
      case "out3":
        if (e.payload == "1111") {
          console.log("audio recorded successfully");
          device.sendMessage("in3", [0]); // turn off recording

          console.log("initiating main patch");
          device.sendMessage("in4", [1]); // start main patch

          loadingAnimation.stop();
        }
        break;
      default:
    }
  });
});

startButton.onclick = () => {
  //hide cover page
  cover_page.style.display = "none";
  videoContainer.style.display = "block";

  //init loading screen
  const loading = new Canvas(
    document.getElementById("loading"),
    video.videoWidth,
    video.videoHeight
  );
  loadingAnimation.start(loading, 4); //start animation

  console.log("starting audio recording");
  device.sendMessage("in3", [1]); // start audio recording

  //begin image capture
  IMG.captureImages(video, 4000, 20).then((imgs) => {
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

    //hide video/loading and show main canvas
    loadingAnimation.stop();
    loading.hideCanvas();
    video.style.display = "none";
    display.style.display = "block";

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
