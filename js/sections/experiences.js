export function initExperiences(root, { requestRefresh }) {
  if (!root) return () => {};
  const events = new AbortController();
  const filters = root.querySelector('[data-filters]');
  const gallery = root.querySelector('[data-experience-gallery]');
  const status = root.querySelector('[data-filter-status]');
  if (!filters || !gallery) return () => {};
  const originalCards = [...gallery.children];
  const options = [...filters.querySelectorAll('[data-category]')];
  const initialSelection = options.find(option => option.getAttribute('aria-pressed') === 'true');

  filters.addEventListener('click', click => {
    const button = click.target.closest('[data-category]');
    if (!button || !filters.contains(button)) return;
    for (const option of options) {
      const selected = option === button;
      option.setAttribute('aria-pressed', String(selected));
      option.classList.toggle('pill--active', selected);
    }
    const previous = [...gallery.children];
    const shuffled = [...previous];
    for (let index = shuffled.length - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }
    // A click always changes the order, even if the shuffle returns the same sequence.
    if (shuffled.length > 1 && shuffled.every((card, index) => card === previous[index])) {
      shuffled.push(shuffled.shift());
    }
    gallery.append(...shuffled);
    if (status) status.textContent = `${button.textContent.trim()}: ${shuffled.length} cards, order shuffled.`;
    requestRefresh();
  }, { signal: events.signal });

  return () => {
    events.abort();
    gallery.append(...originalCards);
    for (const option of options) {
      const selected = option === initialSelection;
      option.setAttribute('aria-pressed', String(selected));
      option.classList.toggle('pill--active', selected);
    }
    if (status) status.textContent = '';
  };
}
