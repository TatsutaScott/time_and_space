import Vector from "../util/Vector";
import { map } from "../util/math_util";
import { random } from "../util/random_util";
import { easingArray } from "../util/easing_util";
// import { p5Color } from "./util/color_util";

class Spray {
  constructor(img, length, sPos, sDim, dPos, dDim, density) {
    this.img = img;
    this.length = length * 30;
    this.life = length * 30;
    this.sPos = sPos;
    this.sDim = sDim;
    this.dPos = dPos;
    this.dDim = dDim;
    this.density = density;
    this.ease = random(easingArray);
    this.print();
  }

  static random(imgs, length) {
    const w = imgs[0].width;
    const h = imgs[0].height;
    const sDim = random(100, 200);
    const dDim = random(100, 200);

    const sPos = new Vector(random(sDim, w - sDim), random(sDim, h - sDim));
    const dPos = new Vector(random(dDim, w - dDim), random(dDim, h - dDim));
    const density = random(500, 5000, true);

    return new Spray(random(imgs), length, sPos, sDim, dPos, dDim, density);
  }
}

Spray.prototype.print = function () {
  console.log(`
type: Spray
dimensions: 
    source: ${this.sDim.toFixed(2)}
    destination: ${this.dDim.toFixed(2)}
position: 
    source: (${this.sPos.x.toFixed(2)}, ${this.sPos.y.toFixed(2)})
    destination: (${this.dPos.x.toFixed(2)}, ${this.dPos.y.toFixed(2)})
density: ${this.density}
easing function: ${this.ease}
life: ${this.life}
length: ${this.length}
`);
};

Spray.prototype.animate = function (p5) {
  for (let i = 0; i < this.density; i++) {
    const radius = random(0, this.dDim);
    const dest = Vector.random(radius).add(this.dPos.x, this.dPos.y);
    dest.floor();

    const source = dest.map(
      new Vector(this.dPos.x, this.dPos.y),
      new Vector(this.dPos.x + this.dDim, this.dPos.y + this.dDim),
      new Vector(this.sPos.x, this.sPos.y),
      new Vector(this.sPos.x + this.sDim, this.sPos.y + this.sDim)
    );
    source.floor();

    const c = p5Color.get(this.img, source.x, source.y);
    const alpha = map(this.ease(radius / this.dDim), 0, 1, 255, 0);
    p5.stroke(c[0], c[1], c[2], alpha);
    p5.point(dest.x, dest.y);
  }
};

Spray.prototype.update = function () {
  this.life--;
};

export default Spray;
