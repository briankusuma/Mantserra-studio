export function initSchedule(root, { requestRefresh }) {
  if (!root) return () => {};
  const events = new AbortController();
  const items = [...root.querySelectorAll('details')];
  for (const item of items) {
    item.addEventListener('toggle', () => {
      if (item.open) {
        for (const other of items) {
          if (other !== item) other.open = false;
        }
      }
      requestRefresh();
    }, { signal: events.signal });
  }
  root.querySelector('[data-show-schedule]')?.addEventListener('click', () => {
    const current = items.findIndex(item => item.open);
    const next = items[(current + 1) % items.length];
    if (!next) return;
    next.open = true;
    next.querySelector('summary').focus();
  }, { signal: events.signal });
  return () => events.abort();
}
