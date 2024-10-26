import { random, noise, noiseSeed } from "./util/random_util";
import { map } from "./util/math_util";

class Layer {
  constructor(imgs, length, start, end) {
    this.imgs = imgs;
    this.length = length * 30;
    this.life = length * 30;
    this.start = start;
    this.end = end;
    this.half = Math.floor(random(0, 2));
    this.noiseOff;
    this.print();
  }

  static random(imgs, length) {
    const start = random(0, imgs[0].height);
    const end = random(start, imgs[0].height);
    return new Layer(imgs, length, start, end);
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

Layer.prototype.animate = function (p5) {
  const totalH = this.end - this.start;
  const layerH = totalH / this.length;
  const layerY = this.start + layerH * (this.length - this.life);
  for (let destY = layerY; destY < layerY + layerH; destY++) {
    const srcY =
      noise(map(destY, this.start, this.end, 0, 0.95), 0) * this.imgs[0].height;
    const img =
      this.imgs[
        Math.floor(
          noise(map(destY, this.start, this.end, 0, 0.75), 0.5) *
            this.imgs.length
        )
      ];
    this.layer(p5, img, destY, srcY, 1, this.half);
  }
};

Layer.prototype.layer = function (p5, img, destY, srcY, h, half) {
  const w = img.width;
  p5.push();
  p5.image(img, 0, destY, w / 2, h, (half * w) / 2, srcY, w / 2, h);
  p5.scale(-1, 1);
  p5.image(img, -w, destY, w / 2, h, (half * w) / 2, srcY, w / 2, h);
  p5.pop();
};

Layer.prototype.update = function () {
  this.life--;
};

export default Layer;
