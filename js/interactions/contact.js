export function initContact(root) {
  if (!root) return () => {};
  const events = new AbortController();
  root.addEventListener('submit', event => {
    event.preventDefault();
    root.querySelector('[data-contact-status]').textContent = 'Sign-ups are not open yet. Your email has not been sent.';
  }, { signal: events.signal });
  return () => events.abort();
}
