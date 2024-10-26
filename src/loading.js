import { TAU, map } from "./util/math_util";
import { arc } from "./util/shape_util";

const loadingAnimation = {
  step: 0,
  loop: 0,
  start: function (device) {
    device.background("lightgray");

    for (let i = 0; i < 4; i++) {
      const length = map(
        Math.sin(this.step * 0.25),
        -1,
        1,
        TAU * 0.05,
        TAU * 0.5
      );
      const angle = this.step * (1 - i * 0.25);
      const arc_path = arc(
        device.center.x,
        device.center.y,
        30 + i * 10,
        angle,
        length
      );
      device.shape(arc_path, null, "black");
    }
    this.step += 0.1;
    this.loop = requestAnimationFrame(() => this.start(device));
  },
  stop: function () {
    cancelAnimationFrame(this.loop);
  },
};

export default loadingAnimation;
