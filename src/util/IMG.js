import ImageData from "./ImageData";

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
let viewFinder;

class IMG {
  constructor(imageElement) {
    this.width = imageElement.width;
    this.height = imageElement.height;
    this.loadData(imageElement);
  }

  static captureImages(video, length, frames) {
    console.log("Capture start");
    viewFinder = video;
    //set canvas size to match video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const images = [];
    const interval = length / frames;
    let count = 0;

    return new Promise((resolve) => {
      const captureImgs = setInterval(() => {
        if (count >= frames) {
          console.log(viewFinder);
          clearInterval(captureImgs);
          console.log("Capture complete. Number of images:", images.length);
          resolve(images); // Resolve with the array of images
        } else {
          // Capture the current frame
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          images.push(new IMG(canvas)); // Save image as an IMG object
          count++;
        }
      }, interval);
    });
  }

  static loadImages(urls) {
    return new Promise((resolve, reject) => {
      const images = [];
      let imagesLoaded = 0;

      urls.forEach((url, index) => {
        const img = new Image();
        img.src = url;

        img.onload = () => {
          images[index] = new IMG(img);
          imagesLoaded++;

          // Resolve when all images are loaded
          if (imagesLoaded === urls.length) {
            resolve(images);
          }
        };

        img.onerror = () => {
          reject(`Failed to load image at ${url}`);
        };
      });
    });
  }

  static grayscale(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    // Use the luminosity formula to calculate grayscale
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    return gray * 255;
  }
}

IMG.prototype.get = function (x, y) {
  const index = (x + y * this.width) * 4;
  return [
    this.pixels[index + 0],
    this.pixels[index + 1],
    this.pixels[index + 2],
    this.pixels[index + 3],
  ];
};

IMG.prototype.loadData = function (imageElement) {
  createImageBitmap(imageElement).then((bitmap) => {
    this.image = bitmap;
    // Set canvas size to match the image
    canvas.width = this.width;
    canvas.height = this.height;

    // Draw the image on the canvas
    ctx.drawImage(bitmap, 0, 0);

    // Get the pixel data
    this.pixels = ctx.getImageData(0, 0, this.width, this.height).data;
  });
};

IMG.prototype.copy = function (filter = (r, g, b, a) => [r, g, b, a]) {
  const imgData = ctx.createImageData(this.width, this.height); //create a blank image
  const imgPixels = imgData.data; //get the pixel array

  for (let i = 0; i < this.pixels.length; i += 4) {
    //apply the filter to each pixel
    const newPixel = filter(
      this.pixels[i + 0],
      this.pixels[i + 1],
      this.pixels[i + 2],
      this.pixels[i + 3]
    );

    //copy the filtered pixel to the new image;
    imgPixels[i + 0] = newPixel[0];
    imgPixels[i + 1] = newPixel[1];
    imgPixels[i + 2] = newPixel[2];
    imgPixels[i + 3] = newPixel[3];
  }

  const imgBitmap = createImageBitmap(imgData); //generate bitmap of the image
  return new ImageData(imgBitmap, imgData);
};

export default IMG;
