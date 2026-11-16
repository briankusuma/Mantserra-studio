export function initTicketTilt(root, { gsap }) {
  const stages = root?.querySelectorAll('[data-ticket-tilt]');
  if (!stages?.length) return () => {};

  const media = gsap.matchMedia();
  media.add({
    reduce: '(prefers-reduced-motion: reduce)',
    mouse: '(hover: hover) and (pointer: fine)',
    always: '(min-width: 0px)',
  }, context => {
    const events = new AbortController();
    const resets = [];
    const { reduce, mouse } = context.conditions;

    for (const stage of stages) {
      const surface = stage.querySelector('[data-ticket-tilt-surface]');
      const rotor = stage.querySelector('[data-ticket-flip-surface]');
      const toggle = stage.querySelector('[data-ticket-flip]');
      const front = stage.querySelector('[data-ticket-front]');
      const back = stage.querySelector('[data-ticket-back]');
      if (!surface || !rotor || !toggle || !front || !back) continue;

      let flipped = false;
      let busy = false;
      let pointerStart = null;
      const originalLabel = toggle.getAttribute('aria-label');
      toggle.hidden = false;
      const tooltip = document.createElement('span');
      tooltip.className = 'ticket-cursor-tooltip';
      tooltip.setAttribute('aria-hidden', 'true');
      tooltip.textContent = 'Click to explore';
      toggle.append(tooltip);
      gsap.set(surface, { transformPerspective: 1100, transformOrigin: '50% 50%' });
      gsap.set(rotor, { transformPerspective: 1100, transformOrigin: '50% 50%' });

      const showFace = () => {
        front.hidden = flipped;
        back.hidden = !flipped;
        toggle.setAttribute('aria-pressed', String(flipped));
        tooltip.textContent = flipped ? 'Click to return' : 'Click to explore';
        toggle.setAttribute('aria-label', flipped ? originalLabel.replace('Show ticket details', 'Show ticket front') : originalLabel);
      };

      // Swap faces edge-on: this keeps the live backdrop blur working on the front.
      const flip = gsap.timeline({ paused: true })
        .to(rotor, { rotationY: 90, duration: .34, ease: 'power2.in' })
        .call(() => {
          flipped = !flipped;
          showFace();
          gsap.set(rotor, { rotationY: -90 });
        })
        .to(rotor, { rotationY: 0, duration: .5, ease: 'power3.out' })
        .call(() => { busy = false; });

      const listenerOptions = { signal: events.signal };
      const resetTooltip = () => {
        delete toggle.dataset.tooltipActive;
      };
      if (mouse) {
        const options = { duration: reduce ? 0 : .18, ease: 'power3.out' };
        const moveX = gsap.quickTo(tooltip, 'left', options);
        const moveY = gsap.quickTo(tooltip, 'top', options);
        const trackTooltip = event => {
          if (event.pointerType !== 'mouse') return;
          const bounds = toggle.getBoundingClientRect();
          if (!bounds.width || !bounds.height) return;
          const x = (event.clientX - bounds.left) / bounds.width * toggle.clientWidth;
          const y = (event.clientY - bounds.top) / bounds.height * toggle.clientHeight;
          const entering = !toggle.hasAttribute('data-tooltip-active');
          // Start at the pointer; never animate in from a default card position.
          moveX(x, entering ? x : undefined);
          moveY(y, entering ? y : undefined);
          toggle.dataset.tooltipActive = '';
        };
        toggle.addEventListener('pointerenter', trackTooltip, listenerOptions);
        toggle.addEventListener('pointermove', trackTooltip, listenerOptions);
        toggle.addEventListener('pointerleave', resetTooltip, listenerOptions);
        toggle.addEventListener('pointercancel', resetTooltip, listenerOptions);
        window.addEventListener('blur', resetTooltip, listenerOptions);
      }
      toggle.addEventListener('pointerdown', event => {
        pointerStart = { x: event.clientX, y: event.clientY };
      }, listenerOptions);
      toggle.addEventListener('pointercancel', () => { pointerStart = null; }, listenerOptions);
      toggle.addEventListener('click', event => {
        if (event.detail && pointerStart && Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > 6) return;
        pointerStart = null;
        if (busy) return;
        if (reduce) {
          flipped = !flipped;
          showFace();
          return;
        }
        busy = true;
        flip.restart();
      }, listenerOptions);

      if (mouse && !reduce) {
        const options = { duration: .65, ease: 'power3.out' };
        const rotateX = gsap.quickTo(surface, 'rotationX', options);
        const rotateY = gsap.quickTo(surface, 'rotationY', options);
        const scale = gsap.quickTo(surface, 'scale', options);
        const track = event => {
          if (event.pointerType !== 'mouse') return;
          // Measure the stationary stage to avoid feedback from the rotating surface.
          const bounds = stage.getBoundingClientRect();
          if (!bounds.width || !bounds.height) return;
          const x = gsap.utils.clamp(0, 1, (event.clientX - bounds.left) / bounds.width);
          const y = gsap.utils.clamp(0, 1, (event.clientY - bounds.top) / bounds.height);
          rotateX((.5 - y) * 24);
          rotateY((x - .5) * 24);
          scale(1.04);
        };
        const reset = () => {
          rotateX(0);
          rotateY(0);
          scale(1);
        };
        stage.addEventListener('pointerenter', track, listenerOptions);
        stage.addEventListener('pointermove', track, listenerOptions);
        stage.addEventListener('pointerleave', reset, listenerOptions);
        stage.addEventListener('pointercancel', reset, listenerOptions);
        window.addEventListener('blur', reset, listenerOptions);
      }

      resets.push(() => {
        front.hidden = false;
        back.hidden = true;
        toggle.hidden = true;
        toggle.setAttribute('aria-pressed', 'false');
        toggle.setAttribute('aria-label', originalLabel);
        tooltip.remove();
        resetTooltip();
      });
    }

    return () => {
      events.abort();
      for (const reset of resets) reset();
    };
  });

  return () => media.revert();
}
