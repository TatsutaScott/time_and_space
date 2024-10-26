class AnimationQueue {
  constructor() {
    this.queue = [];
  }

  add(anim) {
    this.queue.push(anim);
  }

  animate(p5) {
    this.queue.forEach((a) => a.animate(p5));
  }

  clean() {
    this.queue.forEach((a) => a.update());
    this.queue = this.queue.filter((a) => a.life > 0);
  }

  update(canvas) {
    this.animate(canvas);
    this.clean();
  }
}

export default AnimationQueue;
