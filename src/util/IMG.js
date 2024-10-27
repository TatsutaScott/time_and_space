const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

class IMG {
  constructor(imageElement) {
    this.width = imageElement.width;
    this.height = imageElement.height;
    this.loadData(imageElement);
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

export default IMG;
