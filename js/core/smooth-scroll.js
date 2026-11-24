import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './animation.js';
import { ScrollLoop } from './scroll-loop.js';

// Class untuk resource yang memiliki state dan lifecycle.
export class SmoothScroll {
  constructor({ root = document, requestRefresh = () => {} } = {}) {
    this.lenis = null;
    this.locked = false;
    this.loop = new ScrollLoop(root, () => {
      this.lenis?.resize();
      requestRefresh();
    });
    this.tick = (seconds) => this.lenis?.raf(seconds * 1000);
  }

  init() {
    if (this.lenis) return;
    this.loop.init();

    this.lenis = new Lenis({
      autoRaf: false,
      anchors: true,
      infinite: true,
      syncTouch: true,
    });

    if (this.locked) this.lenis.stop();
    this.lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(this.tick);
    gsap.ticker.lagSmoothing(0);
  }

  setLocked(locked) {
    this.locked = locked;
    if (!this.lenis) return;
    if (locked) this.lenis.stop();
    else this.lenis.start();
  }

  destroy() {
    if (!this.lenis) return;

    gsap.ticker.remove(this.tick);
    this.lenis.off('scroll', ScrollTrigger.update);
    this.lenis.destroy();
    this.lenis = null;
    this.loop.destroy();
  }
}
