export function initRulerScroll(root, { gsap }) {
  const viewport = root?.querySelector('[data-ruler]');
  const track = viewport?.querySelector('[data-ruler-track]');
  if (!track) return () => {};

  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.fromTo(track, { x: 0 }, {
      x: () => -Math.min(640, Math.max(0, track.offsetWidth - viewport.clientWidth)),
      ease: 'none',
      scrollTrigger: {
        trigger: root,
        start: 'top bottom',
        end: 'top top',
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
  });

  return () => media.revert();
}
