import { gsap, ScrollTrigger } from './animation.js';
import { SmoothScroll } from './smooth-scroll.js';
import { features } from './config.js';
import { initNavigation } from '../interactions/navigation.js';
import { initExperiences } from '../sections/experiences.js';
import { initSchedule } from '../sections/schedule.js';
import { initTickets } from '../interactions/tickets.js';
import { initContact } from '../interactions/contact.js';
import { initMotion } from '../interactions/reveal.js';

export class LandingPage {
  constructor(root) {
    this.root = root;
    this.events = null;
    this.media = null;
    this.refreshPending = false;
    this.requestRefresh = this.requestRefresh.bind(this);
    this.flushRefresh = this.flushRefresh.bind(this);
  }

  init() {
    if (this.events) return;
    this.events = new AbortController();
    this.destroyNavigation = initNavigation(this.root.querySelector('[data-header]'));
    const services = { requestRefresh: this.requestRefresh, gsap };
    this.cleanups = [
      initExperiences(this.root.querySelector('[data-experiences]'), services),
      initSchedule(this.root.querySelector('[data-schedule]'), services),
      initTickets(this.root),
      initContact(this.root.querySelector('[data-contact]')),
      initMotion(this.root, services),
    ];
    this.media = gsap.matchMedia();
    this.media.add('(prefers-reduced-motion: no-preference)', () => {
      if (!features.smoothScroll) return;
      const scroll = new SmoothScroll();
      scroll.init();
      return () => scroll.destroy();
    });

    if (document.readyState === 'complete') {
      this.requestRefresh();
    } else {
      window.addEventListener('load', this.requestRefresh, {
        once: true,
        signal: this.events.signal,
      });
    }
    void this.refreshAfterFonts(this.events.signal);
  }

  async refreshAfterFonts(signal) {
    await document.fonts.ready;
    if (!signal.aborted) this.requestRefresh();
  }

  requestRefresh() {
    if (!this.events || this.refreshPending) return;
    this.refreshPending = true;
    gsap.ticker.add(this.flushRefresh, true);
  }

  flushRefresh() {
    this.refreshPending = false;
    if (this.events) ScrollTrigger.refresh();
  }

  destroy() {
    for (const cleanup of (this.cleanups ?? []).reverse()) cleanup();
    this.cleanups = [];
    this.destroyNavigation?.();
    this.destroyNavigation = null;
    this.events?.abort();
    this.events = null;
    gsap.ticker.remove(this.flushRefresh);
    this.refreshPending = false;
    this.media?.revert();
    this.media = null;
  }
}
