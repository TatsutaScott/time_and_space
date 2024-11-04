import Vector from "../util/Vector";
import { random } from "../util/random_util";
import { easingArray } from "../util/ease_util";
import { point } from "../util/shape_util";
import { wrap } from "../util/math_util";

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

  static random(canvas, imgs, length) {
    const sDim = random(imgs[0].width * 0.1, imgs[0].width * 0.25);
    const dDim = random(canvas.width * 0.1, canvas.width * 0.25);

    const sPos = new Vector(
      random(sDim, imgs[0].width - sDim),
      random(sDim, imgs[0].height - sDim)
    );
    const dPos = new Vector(
      random(dDim, canvas.width - dDim),
      random(dDim, canvas.height - dDim)
    );
    const density = random(50, 750, true);

    return new Spray(random(imgs), length, sPos, sDim, dPos, dDim, density);
  }
}

Spray.prototype.print = function () {
  console.log(
    `type: Spray
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
`
  );
};

Spray.prototype.animate = function (canvas) {
  for (let i = 0; i < this.density; i++) {
    const radius = random(0, this.dDim);
    const dest = Vector.random(radius).add(this.dPos.x, this.dPos.y);
    const source = dest.map(
      new Vector(this.dPos.x, this.dPos.y),
      new Vector(this.dPos.x + this.dDim, this.dPos.y + this.dDim),
      new Vector(this.sPos.x, this.sPos.y),
      new Vector(this.sPos.x + this.sDim, this.sPos.y + this.sDim)
    );
    source.floor();

    const c = this.img.get(source.x, source.y);
    const alpha = wrap(this.ease(radius / this.dDim) * (c[3] / 255), 0, 1);
    const fill = `rgb(${c[0]} ${c[1]} ${c[2]} / ${alpha})`;
    canvas.shape(point(dest.x, dest.y, 1), fill, null);
  }
};

Spray.prototype.update = function () {
  this.life--;
};

export default Spray;
