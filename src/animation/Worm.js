import Vector from "../util/Vector";
// import { p5Color } from "./util/color_util";
import { isValid } from "../util/misc_util";
import { random } from "../util/random_util";

class Worm {
  constructor(imgs, length, pos, num, dist) {
    this.img = random(imgs);
    this.length = length * 30;
    this.life = length * 30;
    this.pos = pos;
    this.num = num;
    this.dist = dist;
    this.arr = [];
    for (let i = 0; i < this.num; i++) {
      this.arr.push(new Vector(this.pos.x, this.pos.y));
    }
    this.print();
  }

  static random(imgs, length) {
    const w = imgs[0].width;
    const h = imgs[0].height;

    const pos = new Vector(random(0, w), random(0, h));
    const num = random(10, 100, true);
    const dist = new Vector(random(1, 20), random(1, 20));

    return new Worm(imgs, length, pos, num, dist);
  }
}

Worm.prototype.print = function () {
  console.log(`
type: Worm
position:(${this.pos.x.toFixed(2)}, ${this.pos.y.toFixed(2)})
number of worms: ${this.num}
dist: ${this.dist}
life: ${this.life}
length: ${this.length}
`);
};

Worm.prototype.animate = function (p5) {
  for (let i of this.arr) {
    const prev = i.copy();
    i.add(random(-this.dist.x, this.dist.x), random(-this.dist.y, this.dist.y));
    prev.floor();
    i.floor();

    if (!i.inRange(0, 0, this.img.width, this.img.height)) continue;
    const sColor = p5Color.get(this.img, prev.x, prev.y);
    const eColor = p5Color.get(this.img, i.x, i.y);

    if (isValid(sColor) && isValid(eColor)) {
      const gradient = p5Color.linearGradient(p5, prev, sColor, i, eColor);
      p5.drawingContext.strokeStyle = gradient;
      p5.line(prev.x, prev.y, i.x, i.y);
    }
  }
};

Worm.prototype.update = function () {
  this.life--;
};

export default Worm;
