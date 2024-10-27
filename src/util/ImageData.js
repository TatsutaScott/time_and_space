class ImageData {
  constructor(bitmap, pixels) {
    this.width = bitmap.width;
    this.height = bitmap.height;
    this.image = bitmap;
    this.pixels = pixels;
  }
}

ImageData.prototype.get = function (x, y) {
  const index = (x + y * this.width) * 4;
  return [
    this.pixels[index + 0],
    this.pixels[index + 1],
    this.pixels[index + 2],
    this.pixels[index + 3],
  ];
};

export default ImageData;
