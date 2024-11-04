import Vector from "../util/Vector";
import { isValid } from "../util/misc_util";
import { random } from "../util/random_util";
import { line } from "../util/shape_util";
import { map } from "../util/math_util";

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

  static random(canvas, imgs, length) {
    const pos = new Vector(random(0, canvas.width), random(0, canvas.height));
    const num = random(3, 30, true);
    const dist = new Vector(random(1, 30), random(1, 30));

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

    if (isValid(sColor) && isValid(eColor)) {
      const gradient = canvas.gradient({
        start: prev,
        end: i,
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
      const linePath = line(
        map(prev.x, 0, this.img.width, 0, canvas.width),
        map(prev.y, 0, this.img.height, 0, canvas.height),
        map(i.x, 0, this.img.width, 0, canvas.width),
        map(i.y, 0, this.img.height, 0, canvas.height)
      );
      canvas.shape(linePath, null, gradient);
    }
  }
};

Worm.prototype.update = function () {
  this.life--;
};

export default Worm;
