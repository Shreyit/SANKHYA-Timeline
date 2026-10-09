import { mountMotifField } from './motifField.js';

export function initMotifFields() {
  const hero = document.querySelector('.hero, .recap');
  const top = document.querySelector('[data-motif-top-canvas]');
  if (hero && top) mountMotifField(hero, top);
  const footer = document.querySelector('[data-motif-foot]');
  if (footer) mountMotifField(footer, footer.querySelector('[data-motif-foot-canvas]'), { footer: true });
}
