import Vector from "../util/Vector";
import { random, noise } from "../util/random_util";

class Scrap {
  constructor(imgs, points, radius, length) {
    this.img = random(imgs);
    this.points = points;
    this.radius = radius;
    this.length = Math.floor(length * 30);
    this.life = Math.floor(length * 30);
    this.print();
  }

  static random(imgs, length) {
    const points = Math.floor(random(4, 100));
    const radius = new Vector(random(10, 50), random(50, 200));
    return new Scrap(imgs, points, radius, length);
  }
}

Scrap.prototype.print = function () {
  console.log(
    `type: cutter
radius:
    lo: ${this.radius.x}
    hi: ${this.radius.y}
points: ${this.points}
life: ${this.life}`
  );
};

Scrap.prototype.animate = function (canvas) {
  const numPoints = 80;
  const centerX = random(0, canvas.width);
  const centerY = random(0, canvas.height);
  const nOff = random(0, 12); //noise offset
  const r = random(this.radius.x, this.radius.y);
  const clipPath = new Path2D();
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const radius =
      noise(Math.cos(angle + nOff), Math.sin(angle + nOff), nOff) * r;
    const v = Vector.fromAngle(angle).mult(radius);
    if (i == 0) {
      clipPath.moveTo(centerX + v.x, centerY + v.y);
    } else {
      clipPath.lineTo(centerX + v.x, centerY + v.y);
    }
  }
  clipPath.closePath();
  canvas.ctx.save();
  canvas.ctx.clip(clipPath);
  canvas.image(this.img.image, 0, 0);
  canvas.ctx.restore();
};

Scrap.prototype.update = function () {
  this.life--;
};

export default Scrap;
