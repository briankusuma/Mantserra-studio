import { SplitText } from '../core/animation.js';

// Scroll-triggered mask reveals, matching the hero entrance.
// [data-text-reveal]: live text split into masked lines (SplitText 3.13+).
// [data-mask-reveal]: outlined SVG headings rise as one block inside their clip.
// Elements inside [data-artist-scene] belong to that scene on wide screens
// (js/sections/artist.js) and only use these reveals below it.
const reveal = { duration: 1.1, ease: 'expo.out' };
const trigger = element => ({ trigger: element, start: 'top 88%', once: true });
const MOTION = '(prefers-reduced-motion: no-preference)';
const BELOW_ARTIST_SCENE = `(max-width: 1023px) and ${MOTION}`;

export function initTextReveal(root, { gsap }) {
  const all = [...root.querySelectorAll('[data-text-reveal], [data-mask-reveal]')];
  if (!all.length) return () => {};
  const inScene = element => Boolean(element.closest('[data-artist-scene]'));

  const animate = elements => {
    for (const element of elements) {
      if (element.hasAttribute('data-mask-reveal')) {
        const visual = element.querySelector('.art-heading__visual');
        if (visual) gsap.from(visual, { ...reveal, duration: 1.3, yPercent: 105, scrollTrigger: trigger(element) });
        continue;
      }
      // autoSplit re-splits after font load or a width change; returning the
      // tween lets SplitText hand its progress to the replacement.
      SplitText.create(element, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'reveal-line',
        autoSplit: true,
        onSplit: self => gsap.from(self.lines, {
          ...reveal,
          yPercent: 120,
          stagger: .08,
          scrollTrigger: trigger(element),
          // Back to plain markup once played: fewer nodes, native reflow.
          // revert() also disconnects autoSplit, so it never replays.
          onComplete: () => self.revert(),
        }),
      });
    }
  };

  // Separate queries so crossing the scene breakpoint never replays the rest.
  const media = gsap.matchMedia();
  media.add(MOTION, () => animate(all.filter(element => !inScene(element))));
  media.add(BELOW_ARTIST_SCENE, () => animate(all.filter(inScene)));

  return () => media.revert();
}
