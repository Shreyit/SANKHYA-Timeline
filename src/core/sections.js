// Section tracker: one source of truth for "which part of the page is the
// reader on". Fires a `section:change` event on window with { key, el } —
// the mascot, analytics or anything else can listen without new ScrollTriggers.
import { ScrollTrigger } from './gsap.js';

let current = null;
export const currentSection = () => current;

/**
 * @param parts  [{ key, el }] in page order. When parts nest (e.g. #sponsors
 *               inside #lineup), the later, more specific one wins.
 */
export function watchSections(parts) {
  const live = parts.filter((p) => p.el);
  const triggers = [];
  const pick = () => {
    const idx = triggers.findLastIndex((t) => t.isActive);
    const next = idx >= 0 ? live[idx] : null;
    if (next?.key === current?.key) return;
    current = next;
    window.dispatchEvent(new CustomEvent('section:change', { detail: next }));
  };
  live.forEach((p) => triggers.push(ScrollTrigger.create({ trigger: p.el, start: 'top 55%', end: 'bottom 45%', onToggle: pick })));
  pick();
}
