import { random } from "../util/random_util";
import Vector from "../util/Vector";

class Smudge {
  constructor(imgs, sPos, dPos, dim, length, direction) {
    this.img = random(imgs);
    this.dim = dim;
    this.life = length * 30;
    this.direction = direction;
    this.length = length * 30;
    this.sPos = sPos;
    this.dPos = dPos;
    this.print();
  }

  static random(imgs, length) {
    const w = imgs[0].width;
    const h = imgs[0].height;
    const horizontal = random(0, 1) < 0.5;
    const dim = horizontal
      ? new Vector(random(1, 10), random(1, h))
      : new Vector(random(1, w), random(1, 10));

    const sPos = new Vector(random(0, w - dim.x), random(0, h - dim.y));
    const dPos = new Vector(random(0, w - dim.x), random(0, h - dim.y));

    const posNeg = random(0, 1) < 0.5 ? -1 : 1;
    const direction = horizontal
      ? new Vector(posNeg, 0)
      : new Vector(0, posNeg);

    return new Smudge(imgs, sPos, dPos, dim, length, direction);
  }
}

Smudge.prototype.print = function () {
  console.log(`
dimensions: 
    width: ${this.dim.x.toFixed(2)}
    height: ${this.dim.y.toFixed(2)}
position: 
    source: (${this.sPos.x.toFixed(2)}, ${this.sPos.y.toFixed(2)})
    destination: (${this.dPos.x.toFixed(2)}, ${this.dPos.y.toFixed(2)})
direction: (${this.direction.x}, ${this.direction.y})
life: ${this.life}
length: ${this.length}
`);
};

Smudge.prototype.animate = function (canvas) {
  const offset = Vector.mult(this.direction, this.dim);
  offset.mult(this.length - this.life);
  console.log(offset);

  canvas.image(
    this.img,
    this.sPos.x,
    this.sPos.y,
    this.dim.x,
    this.dim.y,
    this.dPos.x + offset.x,
    this.dPos.y + offset.y,
    this.dim.x,
    this.dim.y
  );
  console.log(this.dPos.x + offset.x, this.dPos.y + offset.y);
};

Smudge.prototype.update = function () {
  this.life--;
};

export default Smudge;
