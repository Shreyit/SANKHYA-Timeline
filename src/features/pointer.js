// Pointer layer: spotlight cards, target-lock cursor, magnetic CTA.
import { gsap, ScrollTrigger, SplitText } from '../core/gsap.js';
import { $, $$, reduce, finePointer, esc, pad2 } from '../core/env.js';
import { trackSpotlight } from '../fx/hover.js';

/* ── Pointer-tracked glass + spotlight (design-kit hover recipes 1 & 2) ── */
export function initSurfaces() {
  if (!finePointer) return;
  $$('.spot').forEach((el) => el.addEventListener('pointermove', trackSpotlight, { passive: true }));
}

/* ── Target-lock cursor (design-kit/CURSOR.md) ───────── */
export function initCursor() {
  if (!finePointer || reduce) return;
  const LOCK = 'a[href], button, summary, [role="radio"], [role="tab"], [data-cursor]';
  const TEXT = 'textarea, input, [contenteditable="true"]';
  const FREE = 28, PAD = 6;
  const box = $('.cursor-box'), dot = $('.cursor-dot'), label = $('.cursor-label');
  const m = { duration: 0.35, ease: 'power3.out' };
  const bx = gsap.quickTo(box, 'x', m), by = gsap.quickTo(box, 'y', m);
  const bw = gsap.quickTo(box, 'width', m), bh = gsap.quickTo(box, 'height', m);
  const dx = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'none' }), dy = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'none' });
  const lx = gsap.quickTo(label, 'x', { duration: 0.25, ease: 'power3.out' }), ly = gsap.quickTo(label, 'y', { duration: 0.25, ease: 'power3.out' });
  let target = null, text = '', visible = false, last = { x: -100, y: -100 };

  const radius = (el, h) => Math.max(3, Math.min((parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0) + PAD / 2, h / 2));
  const setLabel = (t) => {
    if (t === text) return;
    text = t;
    if (t) { label.textContent = t; gsap.to(label, { opacity: 1, scale: 1, duration: 0.2 }); }
    else gsap.to(label, { opacity: 0, scale: 0.9, duration: 0.15 });
  };
  const update = (x, y) => {
    dx(x); dy(y); lx(x + 16); ly(y + 18);
    if (target) {
      const r = target.getBoundingClientRect();
      const ox = (x - (r.left + r.width / 2)) * 0.08, oy = (y - (r.top + r.height / 2)) * 0.08;
      bx(r.left - PAD + ox); by(r.top - PAD + oy); bw(r.width + PAD * 2); bh(r.height + PAD * 2);
    } else { bx(x - FREE / 2); by(y - FREE / 2); bw(FREE); bh(FREE); }
  };
  window.addEventListener('pointermove', (e) => {
    last = { x: e.clientX, y: e.clientY };
    if (!visible) { visible = true; gsap.to([box, dot], { opacity: 1, duration: 0.2 }); }
    const el = e.target instanceof Element ? e.target : null;
    const overText = el?.closest(TEXT);
    const next = overText ? null : el?.closest(LOCK) || null;
    if (next !== target) {
      target = next;
      if (target) {
        const r = target.getBoundingClientRect();
        gsap.to(box, { '--r': `${radius(target, r.height + PAD * 2)}px`, opacity: target.matches(':disabled, [aria-disabled="true"]') ? 0.35 : 1, duration: 0.3 });
        gsap.to(dot, { scale: 0, duration: 0.2 });
      } else {
        gsap.to(box, { '--r': '3px', opacity: overText ? 0 : 1, duration: 0.3 });
        gsap.to(dot, { scale: overText ? 0 : 1, duration: 0.2 });
      }
    }
    setLabel(target?.closest('[data-cursor]')?.getAttribute('data-cursor') || '');
    update(last.x, last.y);
  }, { passive: true });
  gsap.ticker.add(() => { if (visible && target) update(last.x, last.y); });
  window.addEventListener('pointerdown', () => { setLabel(''); gsap.to(box, { scale: 0.94, duration: 0.1 }); });
  window.addEventListener('pointerup', () => gsap.to(box, { scale: 1, duration: 0.3 }));
  document.addEventListener('pointerout', (e) => {
    if (!e.relatedTarget) { visible = false; gsap.to([box, dot, label], { opacity: 0, duration: 0.2 }); }
  });
  gsap.set([box, dot], { x: -100, y: -100 });
  gsap.set(label, { scale: 0.9 });
}

/* ── Magnetic CTA (recipe 6) ─────────────────────────── */
export function initMagnetic() {
  if (!finePointer || reduce) return;
  $$('.magnetic').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, { x: (e.clientX - (r.left + r.width / 2)) * 0.3, y: (e.clientY - (r.top + r.height / 2)) * 0.3, duration: 0.6, ease: 'power3.out' });
    });
    el.addEventListener('pointerleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' }));
  });
}
