'use strict';
// Native disclosures keep navigation and login choices usable without JavaScript.
const disclosures = [...document.querySelectorAll('details.disclosure')];
function closeDisclosure(detail, focus = false) {
  detail.open = false;
  if (focus) detail.querySelector('summary').focus();
}
disclosures.forEach(detail => detail.addEventListener('toggle', () => {
  if (detail.open) disclosures.filter(other => other !== detail).forEach(other => closeDisclosure(other));
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') disclosures.filter(detail => detail.open).forEach(detail => closeDisclosure(detail, true));
});
document.addEventListener('click', event => {
  disclosures.forEach(detail => {
    if (!detail.contains(event.target) || event.target.closest('a[href]')) closeDisclosure(detail);
  });
});
const form = document.querySelector('[data-contact-form]');
if (form) {
  const config = JSON.parse(document.querySelector('#contact-config').textContent);
  const messages = JSON.parse(document.querySelector('#contact-messages').textContent);
  const button = form.querySelector('button');
  const status = form.querySelector('[role=status]');
  const originalLabel = button.textContent;
  if (config.endpoint) {
    button.disabled = false;
    button.setAttribute('aria-disabled', 'false');
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!config.endpoint || button.disabled || !form.reportValidity()) return;
    const fields = Object.fromEntries(new FormData(form));
    for (const key of ['name', 'email', 'message']) {
      if (!fields[key].trim()) { form.elements.namedItem(key).focus(); return; }
    }
    button.disabled = true;
    button.setAttribute('aria-disabled', 'true');
    button.textContent = messages.sending;
    status.textContent = '';
    try {
      const response = await fetch(config.endpoint, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...fields, locale: config.locale})
      });
      if (!response.ok) throw new Error('Contact request failed');
      status.textContent = messages.success;
      form.reset();
    } catch {
      status.textContent = messages.failure;
    } finally {
      button.disabled = false;
      button.setAttribute('aria-disabled', 'false');
      button.textContent = originalLabel;
    }
  });
}
// Entrance motion is optional; content is visible before and without JavaScript.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const entrances = [];
function cancelEntrances() { entrances.splice(0).forEach(animation => animation.cancel()); }
if (!reducedMotion.matches && Element.prototype.animate) {
  document.querySelectorAll('main > section:first-child > *').forEach((element, index) => {
    entrances.push(element.animate([{opacity: 0.85, transform: 'translateY(14px)'}, {opacity: 1, transform: 'translateY(0)'}], {
      duration: 550, delay: index * 80, easing: 'cubic-bezier(.22,1,.36,1)'
    }));
  });
}
reducedMotion.addEventListener('change', cancelEntrances);
addEventListener('pagehide', cancelEntrances);
