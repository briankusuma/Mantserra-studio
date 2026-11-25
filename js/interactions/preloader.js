// Preloader · Figma 4118:806 — ticket back on black, flip to front, then the hero scene arrives.
import { SplitText } from '../core/animation.js';

const MIN_HOLD = 1400;
const MAX_WAIT = 4000;

const wait = (ms, signal) => new Promise(resolve => {
  const timer = setTimeout(resolve, ms);
  signal.addEventListener('abort', () => clearTimeout(timer), { once: true });
});

export function initPreloader(root, { gsap, requestRefresh, setScrollLocked }) {
  const html = document.documentElement;
  if (!html.classList.contains('is-preloading')) return () => {};

  const header = root.querySelector('[data-header]');
  const hero = root.querySelector('[data-hero]');
  const stage = hero?.querySelector('[data-ticket-tilt]');
  const surface = stage?.querySelector('[data-ticket-tilt-surface]');
  const rotor = stage?.querySelector('[data-ticket-flip-surface]');
  const front = stage?.querySelector('[data-ticket-front]');
  const back = stage?.querySelector('[data-ticket-back]');
  const background = hero?.querySelector('.hero__background');
  const photo = hero?.querySelector('.hero__photo');
  const introduction = hero?.querySelector('.hero__introduction');
  const title = hero?.querySelector('.hero__title');
  const smallCopy = hero ? [...hero.querySelectorAll('.hero__caption, .hero__legal')] : [];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduce || !surface || !rotor || !front || !back || !background) {
    html.classList.remove('is-preloading');
    return () => {};
  }

  const events = new AbortController();
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    html.classList.remove('is-preloading');
    delete html.dataset.preloader;
    front.hidden = false;
    back.hidden = true;
    setScrollLocked(false);
    requestRefresh();
  };

  html.dataset.preloader = 'running';
  setScrollLocked(true);
  window.scrollTo(0, 0);
  front.hidden = true;
  back.hidden = false;

  // Centre the stage in the viewport; its own box is never transformed.
  const centreOffset = () => {
    const box = stage.getBoundingClientRect();
    return Math.round(window.innerHeight / 2 - (box.top + box.height / 2));
  };

  const context = gsap.context(() => {
    gsap.fromTo(surface, { y: centreOffset, opacity: 0, scale: .94 }, {
      y: centreOffset,
      opacity: 1,
      scale: 1,
      duration: .9,
      ease: 'power3.out',
    });
  });

  const assets = Promise.all([
    photo?.decode?.().catch(() => {}),
    document.fonts?.ready,
  ]);

  void (async () => {
    await Promise.all([
      Promise.race([assets, wait(MAX_WAIT, events.signal)]),
      wait(MIN_HOLD, events.signal),
    ]);
    if (events.signal.aborted) return;

    context.add(() => {
      // Line masks (SplitText 3.13+). Fonts are ready here, so lines are final;
      // the context revert restores the original markup once the intro ends.
      const introLines = introduction
        ? SplitText.create(introduction, { type: 'lines', mask: 'lines', linesClass: 'hero-line' }).lines
        : [];
      const titleWords = title
        ? SplitText.create(title, { type: 'lines,words', mask: 'lines', linesClass: 'hero-line', wordsClass: 'hero-word' }).words
        : [];

      gsap.timeline({
        onComplete: () => {
          // Every end value equals the CSS state, so reverting leaves no jump.
          context.revert();
          finish();
        },
      })
        .to(rotor, { rotationY: 90, duration: .4, ease: 'power2.in' })
        // Swap faces edge-on. No tweens are created inside callbacks, so the
        // context revert below unwinds cleanly to the CSS state.
        .call(() => {
          back.hidden = true;
          front.hidden = false;
        })
        .fromTo(rotor, { rotationY: -90 }, { rotationY: 0, duration: .6, ease: 'power3.out', immediateRender: false })
        .addLabel('scene', '+=.35')
        .fromTo(background, { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 1.6, ease: 'power2.out' }, 'scene')
        .to(surface, { y: 0, duration: 1.2, ease: 'power3.inOut' }, 'scene')
        .fromTo([header].filter(Boolean), { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: .9, ease: 'power3.out' }, 'scene+=.6')
        .from(introLines, { yPercent: 120, duration: 1.1, stagger: .1, ease: 'expo.out' }, 'scene+=.7')
        .from(titleWords, { yPercent: 120, duration: 1.2, stagger: .12, ease: 'expo.out' }, 'scene+=.85')
        .from(smallCopy, { opacity: 0, y: 12, duration: .9, stagger: .08, ease: 'power3.out' }, 'scene+=1.15')
        // Inline from-states now hold the scene hidden; release the CSS gate.
        .call(() => html.classList.remove('is-preloading'), null, 'scene');
    });
  })();

  return () => {
    events.abort();
    context.revert();
    finish();
  };
}
