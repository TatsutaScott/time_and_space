import { TAU, map } from "./util/math_util";
import { arc } from "./util/shape_util";

const loadingAnimation = {
  step: 0,
  loop: 0,
  start: function (device, stepSize) {
    device.clear();
    device.background("rgba(255,255,255,0.2)");
    for (let i = 0; i < 4; i++) {
      const length = map(Math.sin(this.step), -1, 1, 0, TAU * 0.65);
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
    this.step += stepSize;
    setTimeout(() => {
      this.loop = requestAnimationFrame(() => this.start(device, stepSize));
    }, 1000 / 30);
  },
  stop: function () {
    cancelAnimationFrame(this.loop);
  },
};

// const loadingAnimation = {
//   step: 0,
//   loop: 0,
//   start: function (device, time) {
//     device.clear();
//     device.background("rgba(255,255,255,0.2)");
//     for (let i = 0; i < 4; i++) {
//       const length = map(
//         Math.sin(map(this.step, 0, time * 3, 0, TAU)),
//         -1,
//         1,
//         0,
//         TAU * 0.65
//       );
//       const angle = map(this.step, 0, time * 3, 0, TAU * 5) * (1 - i * 0.25);
//       const arc_path = arc(
//         device.center.x,
//         device.center.y,
//         30 + i * 10,
//         angle,
//         length
//       );
//       device.shape(arc_path, null, "black");
//     }
//     this.step += 0.1;
//     setTimeout(() => {
//       this.loop = requestAnimationFrame(() => this.start(device, time));
//     }, 1000 / 30);
//   },
//   stop: function () {
//     cancelAnimationFrame(this.loop);
//   },
// };

export default loadingAnimation;
