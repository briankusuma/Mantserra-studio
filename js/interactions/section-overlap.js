export function initSectionOverlaps(root, { gsap }) {
  const sections = [...root.querySelectorAll('[data-section-overlay]')];
  if (!sections.length) return () => {};

  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    for (const section of sections) {
      const previous = section.previousElementSibling;
      if (!previous) continue;
      // The foreground section stays untransformed, preserving nested fixed pins.
      gsap.fromTo(previous, { y: 0 }, {
        y: () => Math.round(window.innerHeight * .32),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'top top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    }
  });

  return () => media.revert();
}
