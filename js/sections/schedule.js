export function initSchedule(root, { gsap, requestRefresh }) {
  if (!root) return () => {};
  const events = new AbortController();
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const entries = [...root.querySelectorAll('details')].map(item => ({
    item,
    summary: item.querySelector('summary'),
    panel: item.querySelector('.schedule__panel'),
    content: item.querySelector('.schedule__content'),
    name: item.getAttribute('name'),
    expanded: item.open,
    tween: null,
  })).filter(entry => entry.summary && entry.panel && entry.content);
  const context = gsap.context(() => {}, root);

  // Native exclusive groups close siblings immediately, bypassing their animation.
  for (const entry of entries) entry.item.removeAttribute('name');

  function settle(entry) {
    entry.tween?.kill();
    entry.tween = null;
    entry.item.open = entry.expanded;
    entry.panel.inert = !entry.expanded;
    context.add(() => {
      gsap.set(entry.item, { clearProps: 'height,overflow' });
      gsap.set(entry.content, { clearProps: 'opacity,transform' });
    });
  }

  function setExpanded(entry, expanded) {
    if (entry.expanded === expanded) return;
    entry.expanded = expanded;
    if (!expanded && entry.panel.contains(document.activeElement)) {
      entry.summary.focus({ preventScroll: true });
    }
    entry.panel.inert = !expanded;
    if (motion.matches) {
      settle(entry);
      requestRefresh();
      return;
    }

    // Continue from the current rendered height when the user changes direction.
    const fromHeight = entry.item.getBoundingClientRect().height;
    const wasOpen = entry.item.open;
    entry.tween?.kill();
    context.add(() => {
      entry.item.open = true;
      gsap.set(entry.item, { height: 'auto', overflow: 'hidden' });
      const toHeight = expanded
        ? entry.item.getBoundingClientRect().height
        : entry.summary.getBoundingClientRect().height
          + (parseFloat(getComputedStyle(entry.item).borderBottomWidth) || 0);
      gsap.set(entry.item, { height: fromHeight });
      if (expanded && !wasOpen) gsap.set(entry.content, { opacity: 0, y: 12 });

      entry.tween = gsap.timeline({
        onComplete: () => {
          entry.item.open = entry.expanded;
          entry.tween = null;
          gsap.set(entry.item, { clearProps: 'height,overflow' });
          gsap.set(entry.content, { clearProps: 'opacity,transform' });
          requestRefresh();
        },
      })
        .to(entry.item, { height: toHeight, duration: .7, ease: 'power3.inOut' }, 0)
        .to(entry.content, {
          opacity: expanded ? 1 : 0,
          y: expanded ? 0 : -6,
          duration: expanded ? .5 : .25,
          ease: 'power2.out',
        }, expanded ? .12 : 0);
    });
  }

  function select(entry) {
    for (const other of entries) {
      if (other !== entry) setExpanded(other, false);
    }
    setExpanded(entry, true);
  }

  for (const entry of entries) {
    entry.summary.addEventListener('click', event => {
      event.preventDefault();
      if (entry.expanded) setExpanded(entry, false);
      else select(entry);
    }, { signal: events.signal });
    // Preserve native/programmatic changes without interfering with in-flight tweens.
    entry.item.addEventListener('toggle', () => {
      if (entry.tween || entry.item.open === entry.expanded) return;
      entry.expanded = entry.item.open;
      entry.panel.inert = !entry.expanded;
      if (entry.expanded) {
        for (const other of entries) {
          if (other !== entry) setExpanded(other, false);
        }
      }
      requestRefresh();
    }, { signal: events.signal });
  }

  root.querySelector('[data-show-schedule]')?.addEventListener('click', () => {
    const current = entries.findIndex(entry => entry.expanded);
    const next = entries[(current + 1) % entries.length];
    if (!next) return;
    select(next);
    next.summary.focus({ preventScroll: true });
  }, { signal: events.signal });

  function settleAll() {
    for (const entry of entries) settle(entry);
    requestRefresh();
  }
  window.addEventListener('resize', settleAll, { signal: events.signal });
  motion.addEventListener('change', settleAll, { signal: events.signal });

  return () => {
    events.abort();
    context.revert();
    for (const entry of entries) {
      entry.item.open = entry.expanded;
      entry.panel.inert = false;
      if (entry.name !== null) entry.item.setAttribute('name', entry.name);
    }
  };
}
