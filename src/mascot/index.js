// Floating mascot: a small 3D Sanku in the bottom-right corner that reacts to
// where you are on the page and offers a tip (and sometimes an action) for it.
//
// - Section-aware: listens to core/sections.js (`section:change`).
// - Tips pop up once per section, then stay out of the way. "Hide tips" turns
//   auto-popups off (remembered); tapping Sanku always shows / cycles tips.
// - three.js is loaded only when the browser is idle, so it never delays the
//   page's first paint; the dock shows a static placeholder until then.
// - Rendering pauses while the tab is hidden or the dock is collapsed.
import { gsap } from '../core/gsap.js';
import { $, reduce, finePointer } from '../core/env.js';
import { watchSections } from '../core/sections.js';
import { SECTIONS } from './tips.js';

const QUIET_KEY = 'sanku-quiet';
const AUTO_HIDE_MS = 9000;

const store = {
  get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
};

export function initMascot() {
  const parts = SECTIONS.map((s) => ({ ...s, el: $(s.selector) })).filter((s) => s.el);
  if (!parts.length) return;

  const dock = document.createElement('aside');
  dock.className = 'mascot';
  dock.setAttribute('aria-label', 'Sanku, your Sankhya guide');
  dock.innerHTML = `
    <div class="mascot__bubble" id="mascot-bubble" role="status" aria-live="polite" hidden>
      <p class="mascot__kicker"><span class="dot"></span><span data-kicker></span></p>
      <p class="mascot__text" data-text></p>
      <div class="mascot__actions">
        <a class="mascot__cta" data-cta hidden></a>
        <button class="mascot__btn" type="button" data-next>Next tip</button>
        <button class="mascot__btn mascot__btn--quiet" type="button" data-quiet>Hide tips</button>
      </div>
    </div>
    <button class="mascot__stage" type="button" aria-controls="mascot-bubble" aria-expanded="false" data-cursor="Ask Sanku">
      <canvas class="mascot__canvas" aria-hidden="true"></canvas>
      <span class="mascot__fallback" aria-hidden="true"><i></i></span>
      <span class="sr-only">Sanku — show a tip about this part of the page</span>
    </button>`;
  document.body.appendChild(dock);

  const bubble = $('[data-text]', dock).parentElement;
  const stage = $('.mascot__stage', dock);
  const ui = { kicker: $('[data-kicker]', dock), text: $('[data-text]', dock), cta: $('[data-cta]', dock) };
  let section = null, tipIndex = 0, hideTimer = 0, sanku = null;
  let quiet = store.get(QUIET_KEY) === '1';
  const seen = new Set();

  const show = (auto = false) => {
    if (!section) return;
    const tip = section.tips[tipIndex % section.tips.length];
    ui.kicker.textContent = section.label;
    ui.text.textContent = tip;
    if (section.cta) {
      ui.cta.hidden = false;
      ui.cta.textContent = section.cta.label;
      ui.cta.href = section.cta.href;
      const external = /^https?:/.test(section.cta.href);
      ui.cta.target = external ? '_blank' : '';
      ui.cta.rel = external ? 'noopener' : '';
    } else ui.cta.hidden = true;
    $('[data-next]', dock).hidden = section.tips.length < 2;
    $('[data-quiet]', dock).textContent = quiet ? 'Auto-tips off' : 'Hide tips';

    const opening = bubble.hidden;
    bubble.hidden = false;
    stage.setAttribute('aria-expanded', 'true');
    if (opening && !reduce) gsap.fromTo(bubble, { opacity: 0, y: 10, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'expo.out', transformOrigin: '90% 100%' });
    clearTimeout(hideTimer);
    if (auto) hideTimer = setTimeout(hide, AUTO_HIDE_MS);
  };
  const hide = () => {
    clearTimeout(hideTimer);
    if (bubble.hidden) return;
    stage.setAttribute('aria-expanded', 'false');
    if (reduce) { bubble.hidden = true; return; }
    gsap.to(bubble, { opacity: 0, y: 8, duration: 0.25, ease: 'power2.in', onComplete: () => { bubble.hidden = true; } });
  };

  // ── reacting to the page
  window.addEventListener('section:change', (e) => {
    const next = e.detail && SECTIONS.find((s) => s.key === e.detail.key);
    if (!next || next === section) return;
    section = next; tipIndex = 0;
    sanku?.react(next.mood);
    dock.dataset.mood = next.mood;
    if (!bubble.hidden) show();                       // already open → follow along
    else if (!quiet && !seen.has(next.key)) show(true);  // first visit → one gentle popup
    seen.add(next.key);
  });

  // ── controls
  stage.addEventListener('click', () => {
    if (bubble.hidden) show();
    else { tipIndex++; show(); }
    sanku?.spin();
  });
  $('[data-next]', dock).addEventListener('click', () => { tipIndex++; show(); sanku?.hop(); });
  $('[data-quiet]', dock).addEventListener('click', () => {
    quiet = !quiet;
    store.set(QUIET_KEY, quiet ? '1' : '0');
    if (quiet) hide(); else show();
  });
  bubble.addEventListener('pointerenter', () => clearTimeout(hideTimer));   // reading → don't vanish
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hide(); });

  watchSections(parts);

  // ── the 3D character, loaded when the browser is idle
  const boot = async () => {
    let createSanku;
    try { ({ createSanku } = await import('./scene.js')); } catch { return; }
    try { sanku = createSanku($('.mascot__canvas', dock), { reduce }); } catch { return; }  // no WebGL → keep fallback
    dock.classList.add('is-3d');
    if (section) sanku.react(section.mood);

    if (finePointer) {
      window.addEventListener('pointermove', (e) => {
        const r = stage.getBoundingClientRect();
        sanku.lookAt((e.clientX - (r.left + r.width / 2)) / (window.innerWidth * 0.5), (e.clientY - (r.top + r.height / 2)) / (window.innerHeight * 0.5));
      }, { passive: true });
      stage.addEventListener('pointerenter', () => sanku.squash(true));
      stage.addEventListener('pointerleave', () => sanku.squash(false));
    }
    // lean with the scroll direction / speed
    let lastY = window.scrollY, idle = 0;
    window.addEventListener('scroll', () => {
      const v = window.scrollY - lastY; lastY = window.scrollY;
      sanku.lean(v * 0.01);
      clearTimeout(idle); idle = setTimeout(() => sanku.lean(0), 160);
    }, { passive: true });
    document.addEventListener('visibilitychange', () => sanku.setActive(!document.hidden));
  };
  const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1200));
  idle(boot, { timeout: 2500 });

  // entrance
  if (!reduce) gsap.from(dock, { y: 40, opacity: 0, duration: 0.9, ease: 'expo.out', delay: 1.2 });
}
