// import Vector from "./util/Vector";
// import { random } from "./util/random_util";
// import { limit } from "./util/math_util";
// import { p5Color } from "./util/color_util";
import Vector from "../util/Vector";
import { random } from "../util/random_util";
import { line } from "../util/shape_util";
import { isValid } from "../util/misc_util";

class Line {
  constructor(img, start, end, direction, length) {
    this.img = img;
    this.start = start;
    this.end = end;
    this.direction = direction;
    this.length = Math.floor(length * 30);
    this.life = Math.floor(length * 30);
    this.print();
  }

  static random(canvas, imgs, length) {
    const w = canvas.width;
    const h = canvas.height;
    const start = new Vector(random(0, w), random(0, h));
    const end = new Vector(random(0, w), random(0, h));
    const direction = Vector.random();
    return new Line(random(imgs), start, end, direction, length);
  }
}

Line.prototype.print = function () {
  console.log(
    `type: Line
start:(${this.start.x}, ${this.start.y})
end: (${this.end.x}, ${this.end.y})
direction: (${this.direction.x}, ${this.direction.y})
life: ${this.life}`
  );
};

Line.prototype.animate = function (canvas) {
  const offVec = Vector.mult(this.direction, this.length - this.life);
  const offStart = Vector.add(this.start, offVec);
  const offEnd = Vector.add(this.end, offVec);
  offStart.floor();
  offEnd.floor();
  const startColor = this.img.get(offStart.x, offStart.y);
  const endColor = this.img.get(offEnd.x, offEnd.y);

  if (isValid(startColor) && isValid(endColor)) {
    const gradient = canvas.gradient({
      start: offStart,
      end: offEnd,
      colors: [
        {
          pos: 0,
          color: `rgb(${startColor[0]} ${startColor[1]} ${startColor[2]} / ${
            startColor[3] / 255
          })`,
        },
        {
          pos: 1,
          color: `rgb(${endColor[0]} ${endColor[1]} ${endColor[2]} / ${
            endColor[3] / 255
          })`,
        },
      ],
    });

    canvas.shape(
      line(offStart.x, offStart.y, offEnd.x, offEnd.y),
      null,
      gradient
    );
  }
};

Line.prototype.update = function () {
  this.life--;
};

export default Line;
