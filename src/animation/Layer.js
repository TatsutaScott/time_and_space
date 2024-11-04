import { random, noise } from "../util/random_util";
import { map } from "../util/math_util";

class Layer {
  constructor(imgs, length, start, end, center) {
    this.imgs = imgs;
    this.length = length * 30;
    this.life = length * 30;
    this.start = start;
    this.end = end;
    this.center = center;
    this.half = Math.floor(random(0, 2));
    this.noiseOff;
    this.print();
  }

  static random(canvas, imgs, length) {
    const start = random(0, canvas.height);
    const end = random(start, canvas.height);
    const center = random(0, canvas.width);
    return new Layer(imgs, length, start, end, center);
  }
}

Layer.prototype.print = function () {
  console.log(`
type: Layer
start:${this.start.toFixed(2)}
end: ${this.end.toFixed(2)}
half: ${this.half}
life: ${this.life}
length: ${this.length}
`);
};

Layer.prototype.animate = function (canvas) {
  const totalH = this.end - this.start;
  const layerH = totalH / this.length;
  const layerY = this.start + layerH * (this.length - this.life);
  for (let destY = layerY; destY < layerY + layerH; destY++) {
    const srcY =
      noise(map(destY, this.start, this.end, 0, 0.95), 0, this.noiseOff) *
      this.imgs[0].height;
    const img =
      this.imgs[
        Math.floor(
          noise(map(destY, this.start, this.end, 0, 0.75), 0.5, this.noiseOff) *
            this.imgs.length
        )
      ];
    this.layer(canvas, img, destY, srcY, 1, this.half);
  }
};

Layer.prototype.layer = function (canvas, img, destY, srcY, h, half) {
  const w = img.width;
  canvas.save();
  canvas.ctx.globalAlpha = 1;
  canvas.image(
    img.image,
    (half * w) / 2,
    srcY,
    w / 2,
    h,
    this.center,
    destY,
    w / 2,
    h
  );
  canvas.scale(-1, 1);
  canvas.image(
    img.image,
    (half * w) / 2,
    srcY,
    w / 2,
    h,
    -this.center,
    destY,
    w / 2,
    h
  );
  canvas.restore();
};

Layer.prototype.update = function () {
  this.life--;
};

export default Layer;
