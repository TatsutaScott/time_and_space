import IMG from "./util/IMG";
import { easingArray } from "./util/ease_util";
import { random } from "./util/random_util";
import { map } from "./util/math_util";

export function setVideoStream(video) {
  navigator.mediaDevices
    .getUserMedia({ video: true }) //get the video strea
    .then((stream) => {
      video.srcObject = stream; //set stream to show in the video object
    })
    .catch((err) => {
      console.error("Error accessing camera:", err); //throw an error if it can't access the video stream
    });
  return video;
}

export function captureImages(time, captures, video, filters, worker, onload) {
  //begin image capture
  return IMG.captureImages(video, time, captures).then((imgs) => {
    for (let i of imgs) {
      worker.postMessage(
        {
          method: "loadImage",
          bitmap: i.image,
          pixels: i.pixels,
        },
        [i.image]
      );
    }

    // for a giver number, create a copy of the image set, but with chromakey filters applied
    filterImages(imgs, random(easingArray), true).then((filteredImgs) => {
      for (let f of filteredImgs) {
        worker.postMessage(
          {
            method: "loadFiltered",
            arr: 0,
            bitmap: f.image,
            pixels: f.pixels,
          },
          [f.image]
        );
      }
    });
    filterImages(imgs, random(easingArray), false).then((filteredImgs) => {
      for (let f of filteredImgs) {
        worker.postMessage(
          {
            method: "loadFiltered",
            arr: 1,
            bitmap: f.image,
            pixels: f.pixels,
          },
          [f.image]
        );
      }
    });
    onload();
    return imgs;
  });
}

function filterImages(images, filter, direction) {
  return new Promise((resolve, reject) => {
    // Array to hold filtered bitmap promises
    const filteredBitmaps = images.map((image) => {
      return new Promise((resolveImage, rejectImage) => {
        const filteredImage = image.copy((r, g, b, a) => {
          let gray = IMG.grayscale(r, g, b);
          if (direction) {
            gray = map(gray, 0, 255, 255, 0);
          }
          const eased = filter(gray / 255);
          return [r, g, b, eased * 255];
        });

        // Create a bitmap from the filtered canvas
        filteredImage.image
          .then((bitmap) => {
            filteredImage.image = bitmap;
            filteredImage.width = bitmap.width;
            filteredImage.height = bitmap.height;
            resolveImage(filteredImage);
          })
          .catch(rejectImage);
      });
    });

    // Wait for all bitmaps to be created and resolve the final promise
    Promise.all(filteredBitmaps).then(resolve).catch(reject);
  });
}
