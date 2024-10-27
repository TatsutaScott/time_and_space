import IMG from "./util/IMG";
import { random } from "./util/random_util";

const systemWorker = new Worker(new URL("./worker.js", import.meta.url));

const video = document.getElementById("viewFinder");
const startButton = document.getElementById("start");
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

startButton.onclick = () => {
  IMG.captureImages(video, 4000, 8).then((imgs) => {
    console.log(imgs);
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
