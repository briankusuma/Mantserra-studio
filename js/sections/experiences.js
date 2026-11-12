export function initExperiences(root, { requestRefresh }) {
  if (!root) return () => {};
  const events = new AbortController();
  const filters = root.querySelector('[data-filters]');
  const event = root.querySelector('[data-experience-event]');
  const empty = root.querySelector('[data-empty-state]');
  if (!filters || !event || !empty) return () => {};

  filters.addEventListener('click', click => {
    const button = click.target.closest('[data-category]');
    if (!button) return;
    for (const option of filters.querySelectorAll('[data-category]')) {
      const selected = option === button;
      option.setAttribute('aria-pressed', String(selected));
      option.classList.toggle('pill--active', selected);
    }
    // Sumber hanya memberi kategori Experiences untuk event ini.
    const show = ['all', 'experiences', 'categories'].includes(button.dataset.category);
    event.hidden = !show;
    empty.hidden = show;
    requestRefresh();
  }, { signal: events.signal });

  return () => events.abort();
}
