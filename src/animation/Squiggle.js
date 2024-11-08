import { random, noise } from "../util/random_util";
import { map } from "../util/math_util";
import Vector from "../util/Vector";

class Squiggle {
  constructor(imgs, dim, sPos, dPos, length, dist, density = 5) {
    this.img = random(imgs);
    this.dim = dim;
    this.sPos = sPos;
    this.dPos = dPos;
    this.length = length * 30;
    this.life = length * 30;
    this.count = 0;
    this.dist = dist;
    this.density = density;
    this.noiseOffset = random(0, 10000);
    this.print();
  }

  static random(canvas, imgs, length) {
    const dim = new Vector(
      random(imgs[0].width * 0.01, imgs[0].width * 0.4),
      random(imgs[0].width * 0.01, imgs[0].width * 0.4)
    );
    const sPos = new Vector(
      random(0, imgs[0].width - dim.x),
      random(0, imgs[0].height - dim.y)
    );
    const dPos = new Vector(
      random(0, canvas.width - dim.x),
      random(0, canvas.height - dim.y)
    );
    const density = Math.floor(random(10, 30));
    const dist = random(0, 1);
    return new Squiggle(imgs, dim, sPos, dPos, length, dist, density);
  }
}

Squiggle.prototype.print = function () {
  console.log(
    `dimensions: 
    width: ${this.dim.x.toFixed(2)}
    height: ${this.dim.y.toFixed(2)}
position: 
    source: (${this.sPos.x.toFixed(2)}, ${this.sPos.y.toFixed(2)})
    destination: (${this.dPos.x.toFixed(2)}, ${this.dPos.y.toFixed(2)})
life: ${this.life}
length: ${this.length}
`
  );
};

Squiggle.prototype.animate = function (canvas) {
  for (let i = 0; i < this.density; i++) {
    const step = map(this.count, 0, this.length * this.density, 0, this.dist);
    this.sPos.set(
      noise(step * 0.5, 0 + this.noiseOffset) * this.img.width,
      noise(step * 0.5, 0.5 + this.noiseOffset) * this.img.width
    );
    this.dPos.set(
      noise(step, 0, 0.1 + this.noiseOffset) * canvas.width,
      noise(step, 0.5, 0.7 + this.noiseOffset) * canvas.height
    );
    canvas.image(
      this.img.image,
      this.sPos.x,
      this.sPos.y,
      this.dim.x,
      this.dim.y,
      this.dPos.x,
      this.dPos.y,
      this.dim.x,
      this.dim.y
    );
    this.count++;
  }
};

Squiggle.prototype.update = function () {
  this.life--;
};

export default Squiggle;
