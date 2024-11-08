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

  static random(canvas, imgs, length) {
    const points = Math.floor(random(4, 100));
    const cnvDim = Math.min(canvas.width, canvas.height);
    const radius = new Vector(
      random(cnvDim * 0.001, cnvDim * 0.05),
      random(cnvDim * 0.1, cnvDim * 0.2)
    );
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
  const disCenter = new Vector(
    random(0, canvas.width),
    random(0, canvas.height)
  );
  const srcCenter = new Vector(
    random(0, this.img.width - this.radius),
    random(0, this.img.height - this.radius)
  );
  const nOff = random(0, 12); //noise offset
  const r = random(this.radius.x, this.radius.y);
  const clipPath = new Path2D();
  for (let i = 0; i < this.points; i++) {
    const angle = (i / this.points) * Math.PI * 2;
    const radius =
      noise(Math.cos(angle + nOff), Math.sin(angle + nOff), nOff) * r;
    const v = Vector.fromAngle(angle).mult(radius);
    if (i == 0) {
      clipPath.moveTo(disCenter.x + v.x, disCenter.y + v.y);
    } else {
      clipPath.lineTo(disCenter.x + v.x, disCenter.y + v.y);
    }
  }
  clipPath.closePath();
  canvas.ctx.save();
  canvas.ctx.clip(clipPath);
  canvas.image(
    this.img.image,
    this.img.width - srcCenter.x,
    this.img.height - srcCenter.y,
    this.radius,
    this.radius,
    disCenter.x - this.radius,
    disCenter.y - this.radius,
    this.radius,
    this.radius
  );
  canvas.ctx.restore();
};

Scrap.prototype.update = function () {
  this.life--;
};

export default Scrap;
