import Vector from "../util/Vector";
import { random } from "../util/random_util";
import { limit } from "../util/math_util";

class Clip {
  constructor(imgs, sPos, dPos, dim, start, end, length) {
    this.imgs = imgs;
    this.sPos = sPos;
    this.dPos = dPos;
    this.dim = dim;
    this.start = start;
    this.end = end;
    this.life = Math.floor(length * 30);
    this.print();
  }

  static random(canvas, imgs, length) {
    const w = canvas.width;
    const h = canvas.height;

    const dim = new Vector(random(0, w), random(0, h));
    const sPos = new Vector(random(0, w - dim.x), random(0, h - dim.y));
    const dPos = new Vector(random(0, w - dim.x), random(0, h - dim.y));
    const start = Math.floor(random(0, imgs.length, true));
    const end = Math.floor(random(start + 1, imgs.length, true));

    return new Clip(imgs, sPos, dPos, dim, start, end, length);
  }

  static full(canvas, imgs, length) {
    const sPos = new Vector(0, 0);
    const dPos = new Vector(0, 0);
    const dim = new Vector(canvas.width, canvas.height);
    const start = 0;
    const end = imgs.length - 1;
    return new Clip(imgs, sPos, dPos, dim, start, end, length);
  }
}

Clip.prototype.print = function () {
  console.log(`
type: Clip
start:${this.start}
end: ${this.end}
dimensions: 
    width: ${this.dim.x.toFixed(2)}
    height: ${this.dim.y.toFixed(2)}
position: 
    source: (${this.sPos.x.toFixed(2)}, ${this.sPos.x.toFixed(2)})
    destination: (${this.dPos.x.toFixed(2)}, ${this.dPos.x.toFixed(2)})
life: ${this.life}
`);
};

Clip.prototype.animate = function (canvas) {
  let index = (this.life % (this.end - this.start)) + this.start;
  index = limit(index, this.start, this.end);
  canvas.image(
    this.imgs[index].image,
    this.sPos.x,
    this.sPos.y,
    this.dim.x,
    this.dim.y,
    this.dPos.x,
    this.dPos.y,
    this.dim.x,
    this.dim.y
  );
};

Clip.prototype.update = function () {
  this.life--;
};

export default Clip;
