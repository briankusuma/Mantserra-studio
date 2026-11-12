export function initMotion(root, { gsap }) {
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.from(root.querySelectorAll('.hero__introduction, .hero__signature'), {
      y: 18,
      opacity: 0,
      duration: 1,
      stagger: .12,
      ease: 'power3.out',
      clearProps: 'transform,opacity',
    });
    for (const element of root.querySelectorAll('[data-reveal]')) {
      gsap.from(element, {
        y: 24,
        opacity: .55,
        duration: .85,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: element, start: 'top 92%', once: true },
      });
    }
  });
  return () => media.revert();
}
