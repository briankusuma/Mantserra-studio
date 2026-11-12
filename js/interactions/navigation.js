export function initNavigation(root) {
  const toggle = root?.querySelector('[data-menu-toggle]');
  const navigation = root?.querySelector('[data-navigation]');
  if (!toggle || !navigation) return () => {};

  const events = new AbortController();
  const media = window.matchMedia('(max-width: 760px)');

  function setOpen(open, restoreFocus = false) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Close' : 'Menu';
    navigation.hidden = media.matches && !open;
    if (restoreFocus) toggle.focus();
  }

  function syncViewport() {
    if (navigation.contains(document.activeElement) && media.matches) {
      toggle.focus();
    }
    setOpen(false);
  }

  toggle.hidden = false;
  syncViewport();
  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  }, { signal: events.signal });
  root.addEventListener('keydown', event => {
    if (event.key === 'Escape' && media.matches) setOpen(false, true);
  }, { signal: events.signal });
  navigation.addEventListener('click', event => {
    if (event.target.closest('a[href]') && media.matches) setOpen(false, true);
  }, { signal: events.signal });
  media.addEventListener('change', syncViewport);

  return () => {
    events.abort();
    media.removeEventListener('change', syncViewport);
    toggle.hidden = true;
    navigation.hidden = false;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = 'Menu';
  };
}
