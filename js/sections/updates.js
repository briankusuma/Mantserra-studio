export function initUpdates(root, { gsap }) {
  const viewport = root?.querySelector('[data-updates-viewport]');
  const track = viewport?.querySelector('[data-updates-track]');
  if (!track) return () => {};

  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
    viewport.classList.add('updates__viewport--pinned');
    viewport.scrollLeft = 0;
    const tween = gsap.fromTo(track, { x: 0 }, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: viewport,
        start: 'top 24px',
        end: () => `+=${Math.max(1, distance())}`,
        pin: true,
        pinSpacing: true,
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    const onFocus = event => {
      const card = event.target.closest('.updates__story');
      if (!card || !track.contains(card)) return;
      const trigger = tween.scrollTrigger;
      const offset = Math.min(distance(), Math.max(0, card.offsetLeft - track.offsetLeft));
      viewport.scrollLeft = 0;
      trigger.scroll(trigger.start + offset);
      trigger.update();
    };
    track.addEventListener('focusin', onFocus);
    return () => {
      track.removeEventListener('focusin', onFocus);
      viewport.classList.remove('updates__viewport--pinned');
    };
  });

  return () => media.revert();
}
