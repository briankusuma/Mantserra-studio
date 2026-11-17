import { initNavigation } from '../interactions/navigation.js';

// One viewport of the opening scene makes Lenis' bottom/top wrap visually continuous.
export class ScrollLoop {
  constructor(root, onResize) {
    this.root = root;
    this.onResize = onResize;
    this.preview = null;
    this.observer = null;
    this.stateObserver = null;
    this.sync = this.sync.bind(this);
  }

  init() {
    this.hero = this.root.querySelector('[data-hero]');
    this.header = this.root.querySelector('[data-header]');
    this.footer = this.root.querySelector('.site-footer');
    this.photo = this.hero?.querySelector('.hero__photo');
    if (!this.hero || !this.header || !this.footer || !this.photo) return;

    this.preview = document.createElement('div');
    this.preview.className = 'scroll-loop';
    const hero = this.hero.cloneNode(true);
    const header = this.header.cloneNode(true);
    hero.inert = true;
    hero.setAttribute('aria-hidden', 'true');
    hero.querySelectorAll('.ticket-flip-toggle').forEach(element => element.remove());
    const front = hero.querySelector('[data-ticket-front]');
    const back = hero.querySelector('[data-ticket-back]');
    const syncTicket = () => {
      if (front) front.hidden = this.hero.querySelector('[data-ticket-front]').hidden;
      if (back) back.hidden = this.hero.querySelector('[data-ticket-back]').hidden;
    };
    syncTicket();
    this.stateObserver = new MutationObserver(syncTicket);
    this.stateObserver.observe(this.hero, { subtree: true, attributes: true, attributeFilter: ['hidden'] });
    hero.querySelectorAll('.hero__introduction, .hero__signature, .ticket-motion, .ticket-motion__flip')
      .forEach(element => element.removeAttribute('style'));
    this.preview.append(header, hero);
    for (const element of this.preview.querySelectorAll('*')) {
      for (const attribute of [...element.attributes]) {
        if (attribute.name === 'id' || attribute.name === 'aria-labelledby'
          || attribute.name === 'aria-controls' || (attribute.name.startsWith('data-')
            && !['data-menu-toggle', 'data-navigation', 'data-ticket-open'].includes(attribute.name))) {
          element.removeAttribute(attribute.name);
        }
      }
    }
    const navigation = header.querySelector('[data-navigation]');
    const toggle = header.querySelector('[data-menu-toggle]');
    if (navigation && toggle) {
      navigation.id = 'scroll-loop-navigation';
      toggle.setAttribute('aria-controls', navigation.id);
    }
    this.footer.after(this.preview);
    this.cleanupNavigation = initNavigation(header);
    this.sync();
    this.observer = new ResizeObserver(this.sync);
    this.observer.observe(this.hero);
    window.addEventListener('resize', this.sync);
  }

  sync() {
    if (!this.preview) return;
    const hero = this.hero.getBoundingClientRect();
    const photo = this.photo.getBoundingClientRect();
    const geometry = [window.innerHeight, hero.height, photo.width, photo.height, photo.left - hero.left, photo.top - hero.top];
    const signature = geometry.join(',');
    if (signature === this.geometry) return;
    this.geometry = signature;
    this.preview.style.height = `${geometry[0]}px`;
    this.preview.querySelector('.hero').style.height = `${geometry[1]}px`;
    for (const [index, name] of ['width', 'height', 'left', 'top'].entries()) {
      this.footer.style.setProperty(`--seam-photo-${name}`, `${geometry[index + 2]}px`);
    }
    this.onResize();
  }

  destroy() {
    window.removeEventListener('resize', this.sync);
    this.observer?.disconnect();
    this.observer = null;
    this.stateObserver?.disconnect();
    this.stateObserver = null;
    this.cleanupNavigation?.();
    this.cleanupNavigation = null;
    this.preview?.remove();
    this.preview = null;
    this.geometry = null;
    for (const name of ['width', 'height', 'left', 'top']) {
      this.footer?.style.removeProperty(`--seam-photo-${name}`);
    }
  }
}
