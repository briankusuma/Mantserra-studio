export function initTickets(root) {
  const dialog = root.querySelector('[data-ticket-dialog]');
  if (!dialog) return () => {};
  const events = new AbortController();
  let opener = null;
  for (const button of root.querySelectorAll('[data-ticket-open]')) {
    button.addEventListener('click', () => {
      opener = button;
      const isExperience = button.dataset.ticketEvent === 'experience';
      dialog.querySelector('[data-ticket-name]').textContent = isExperience ? 'Simmons' : 'Brookly';
      dialog.querySelector('[data-ticket-subtitle]').textContent = isExperience ? 'Wellington' : 'Simmons Concert';
      dialog.querySelector('[data-ticket-date]').textContent = isExperience ? '24 MAR' : '16 APR';
      dialog.querySelector('[data-ticket-time-row]').hidden = isExperience;
      dialog.querySelector('[data-ticket-price-row]').hidden = isExperience;
      dialog.querySelector('[data-ticket-location-row]').hidden = !isExperience;
      dialog.showModal();
    }, { signal: events.signal });
  }
  dialog.querySelector('[data-ticket-close]').addEventListener('click', () => dialog.close(), { signal: events.signal });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  }, { signal: events.signal });
  dialog.addEventListener('close', () => opener?.focus(), { signal: events.signal });
  return () => {
    events.abort();
    if (dialog.open) dialog.close();
    opener = null;
  };
}
