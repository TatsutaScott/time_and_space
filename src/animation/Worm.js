import Vector from "../util/Vector";
import { isValid } from "../util/misc_util";
import { random } from "../util/random_util";
import { line } from "../util/shape_util";

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

Worm.prototype.animate = function (canvas) {
  for (let i of this.arr) {
    const prev = i.copy();
    i.add(random(-this.dist.x, this.dist.x), random(-this.dist.y, this.dist.y));
    prev.floor();
    i.floor();

    if (!i.inRange(0, 0, this.img.width, this.img.height)) continue;
    const sColor = this.img.get(prev.x, prev.y);
    const eColor = this.img.get(i.x, i.y);
    console.log(isValid(sColor), sColor);

    if (isValid(sColor) && isValid(eColor)) {
      const gradient = canvas.gradient({
        x0: prev.x,
        y0: prev.y,
        x1: i.x,
        y1: i.y,
        colors: [
          {
            pos: 0,
            color: `rgba(${sColor[0]},${sColor[1]},${sColor[2]},${sColor[3]})`,
          },
          {
            pos: 1,
            color: `rgba(${eColor[0]},${eColor[1]},${eColor[2]},${eColor[3]})`,
          },
        ],
      });
      console.log(gradient);
      canvas.shape(line(prev.x, prev.y, i.x, i.y), null, gradient);
    }
  }
};

Worm.prototype.update = function () {
  this.life--;
};

export default Worm;
