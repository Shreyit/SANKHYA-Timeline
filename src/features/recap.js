// '26 recap interactions: day tabs, event filters, odometer stats.
import { gsap, ScrollTrigger, SplitText } from '../core/gsap.js';
import { $, $$, reduce, finePointer, esc, pad2 } from '../core/env.js';

/* ── Recap tabs with sliding pill + event filters ────── */
export function initTabs() {
  const list = $('[data-tabs]');
  if (!list) return;
  const ind = $('.tabs__ind', list);
  const tabs = $$('[role="tab"]', list);
  let active = 0;
  const place = (i, animate = true) => {
    const t = tabs[i];
    const vars = { x: t.offsetLeft, width: t.offsetWidth, opacity: 1 };
    animate && !reduce ? gsap.to(ind, { ...vars, duration: 0.45, ease: 'power3.out', overwrite: 'auto' }) : gsap.set(ind, vars);
  };
  const select = (i) => {
    active = i;
    tabs.forEach((t, j) => { t.setAttribute('aria-selected', String(i === j)); t.tabIndex = i === j ? 0 : -1; });
    $$('.day').forEach((d, j) => { d.hidden = i !== j; });
    place(i);
    if (!reduce) gsap.from(`#day-${i} .slots li, #day-${i} .day__side > *`, { y: 16, opacity: 0, stagger: 0.04, duration: 0.6, ease: 'expo.out' });
    ScrollTrigger.refresh();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(i));
    t.addEventListener('keydown', (e) => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      const n = (active + d + tabs.length) % tabs.length;
      select(n); tabs[n].focus();
    });
  });
  document.fonts.ready.then(() => place(0, false));
  new ResizeObserver(() => place(active, false)).observe(list);

  const chips = $$('[data-filters] .chip');
  chips.forEach((c) => c.addEventListener('click', () => {
    chips.forEach((x) => x.setAttribute('aria-pressed', String(x === c)));
    const cat = c.dataset.cat;
    const cards = $$('.ev');
    cards.forEach((card) => { card.hidden = cat !== 'All' && card.dataset.cat !== cat; });
    if (!reduce) gsap.fromTo(cards.filter((x) => !x.hidden), { y: 16, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 0.5, ease: 'expo.out' });
    ScrollTrigger.refresh();
  }));
}

/* ── Odometer stats: roll up once in view, re-roll on hover ── */
export function initOdometers() {
  $$('[data-odometer]').forEach((el) => {
    const digits = String(el.dataset.odometer).padStart(2, '0').split('').map(Number);
    const cols = $$('.digit', el);
    const set = (vals) => cols.forEach((c, i) => { c.style.transform = `translateY(${-vals[i]}em)`; });
    if (reduce) { set(digits); return; }
    set(digits.map(() => 0));
    cols.forEach((c, i) => { c.style.transitionDelay = `${i * 90}ms`; c.style.transitionDuration = '1400ms'; });
    ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => set(digits) });
    el.parentElement.addEventListener('pointerenter', () => {
      cols.forEach((c) => { c.style.transitionDuration = '700ms'; });
      set(digits.map((d) => (d + 5) % 10));
      setTimeout(() => set(digits), 180);
    });
  });
}
