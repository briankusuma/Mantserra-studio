import { SplitText } from '../core/animation.js';

// Artist scroll scene · Figma 4187:1285 ("scroll-animation").
// While the section is pinned: the ticket waits mid-screen showing its back,
// flips to the front, the photos arrive, the ticket travels left into its slot,
// then the copy appears. Below this query the section stays static.
export const ARTIST_SCENE_QUERY = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)';

const TEXT_AT = .86;

export function initArtistScene(root, { gsap }) {
  const section = root?.querySelector('[data-artist-scene]');
  const stage = section?.querySelector('[data-ticket-tilt]');
  const surface = stage?.querySelector('[data-ticket-tilt-surface]');
  const rotor = stage?.querySelector('[data-ticket-flip-surface]');
  const front = stage?.querySelector('[data-ticket-front]');
  const back = stage?.querySelector('[data-ticket-back]');
  const photoFrame = section?.querySelector('[data-artist-photo]');
  if (!surface || !rotor || !front || !back || !photoFrame) return () => {};

  const photo = photoFrame.querySelector('img');
  const secondary = section.querySelector('.artist__secondary-photo');
  const metadata = [...section.querySelectorAll('.artist__metadata')];
  const headingVisual = section.querySelector('.artist__heading .art-heading__visual');
  const pill = section.querySelector('.artist__copy .pill');
  const copy = section.querySelector('.artist__copy p');

  const media = gsap.matchMedia();
  media.add(ARTIST_SCENE_QUERY, () => {
    const showBack = isBack => {
      front.hidden = isBack;
      back.hidden = !isBack;
    };

    // Natural (untransformed) offsets that put the ticket in the viewport centre
    // while the section is pinned to the top.
    const centre = () => {
      const box = stage.getBoundingClientRect();
      const top = box.top - section.getBoundingClientRect().top;
      return {
        x: Math.round(window.innerWidth / 2 - (box.left + box.width / 2)),
        y: Math.round((window.innerHeight - box.height) / 2 - top),
      };
    };

    // Edge-on face swap driven by scroll in both directions. quickSetter writes
    // without creating tweens, so nothing accumulates in this context.
    const flip = { progress: 0 };
    const setRotation = gsap.quickSetter(rotor, 'rotationY', 'deg');
    const renderFlip = () => {
      const p = flip.progress;
      showBack(p < .5);
      setRotation(p < .5 ? p * 180 : (p - 1) * 180);
    };

    // Copy plays as a whole once the ticket has landed, and rewinds above it.
    const text = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
      .fromTo(metadata, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .8, stagger: .06, ease: 'power3.out' }, 0)
      .fromTo(headingVisual, { yPercent: 105 }, { yPercent: 0, duration: 1.3 }, .05)
      .fromTo(pill, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .8, ease: 'power3.out' }, .3);
    let copyLines = null;
    const split = copy && SplitText.create(copy, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'reveal-line',
      autoSplit: true,
      onSplit: self => {
        copyLines = gsap.fromTo(self.lines, { yPercent: 120 }, {
          yPercent: 0, duration: 1.1, stagger: .08, ease: 'expo.out', paused: true,
        });
        return copyLines;
      },
    });
    let textShown = false;
    const setText = show => {
      if (show === textShown) return;
      textShown = show;
      if (show) {
        text.play();
        gsap.delayedCall(.35, () => textShown && copyLines?.play());
      } else {
        text.reverse();
        copyLines?.reverse();
      }
    };

    // Tilt and click-to-flip stay off until the ticket has landed.
    const sync = self => {
      section.classList.toggle('artist--staging', self.progress < 1);
      setText(self.progress >= TEXT_AT);
    };

    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * 1.8)}`,
        pin: true,
        scrub: true,
        invalidateOnRefresh: true,
        // Pins add space; refresh before triggers further down the page.
        refreshPriority: 1,
        onUpdate: sync,
        onRefresh: sync,
      },
    })
      .fromTo(surface, { x: () => centre().x, y: () => centre().y }, { x: () => centre().x, y: () => centre().y, duration: .3 }, 0)
      .fromTo(flip, { progress: 0 }, { progress: 1, duration: .3, ease: 'power1.inOut', onUpdate: renderFlip }, 0)
      .fromTo(photoFrame, { clipPath: 'inset(100% 0% 0% 0% round 8px)' }, { clipPath: 'inset(0% 0% 0% 0% round 8px)', duration: .3, ease: 'power2.out' }, .32)
      .fromTo(photo, { scale: 1.15 }, { scale: 1, duration: .4, ease: 'power2.out' }, .32)
      .fromTo(secondary, { opacity: 0, x: -16, y: 178 }, { opacity: 1, x: 0, y: 0, duration: .45, ease: 'power2.out' }, .4)
      .to(surface, { x: 0, y: 0, duration: .3, ease: 'power2.inOut' }, .55)
      .to({}, { duration: .15 });

    section.classList.add('artist--staging');
    renderFlip();

    return () => {
      split?.revert();
      section.classList.remove('artist--staging');
      showBack(false);
      setRotation(0);
    };
  });

  return () => media.revert();
}
