import { gsap } from '../core/gsap.js';
import { reduce } from '../core/env.js';
import { stopScroll, startScroll } from '../core/scroll.js';

const HANDOFF = 'sankhya-page-transition';
const pagePath = (path) => path.replace(/index\.html$/, '');
const noop = { reveal: () => Promise.resolve() };

// One solid, composited panel. No animated blur, turbulence or full-screen SVG.
// The progress line is a decorative loading cue, not a fabricated percentage.
export function initPageTransitions() {
  const layer = document.querySelector('.page-transition');
  if (!layer) return noop;
  const html = document.documentElement;
  const caption = layer.querySelector('[data-transition-caption]');
  const content = layer.querySelector('.page-transition__content');
  const progress = layer.querySelector('.page-transition__progress span');
  const bandMotifs = [...layer.querySelectorAll('.transition-motif')];
  const currentCaption = document.body.dataset.page === 'recap' ? 'recap' : 'home';
  let leaving = false, animation = null, recovery = 0;

  const reset = () => {
    clearTimeout(recovery);
    animation?.kill();
    gsap.set([layer, content, progress, ...bandMotifs], { clearProps: 'all' });
    layer.classList.remove('is-active');
    html.classList.remove('page-entering', 'page-leaving');
    caption.textContent = currentCaption;
    leaving = false;
    startScroll();
  };

  const reveal = () => {
    if (reduce || !html.classList.contains('page-entering')) { reset(); return Promise.resolve(); }
    return new Promise((resolve) => {
      animation = gsap.timeline({ onComplete: () => { reset(); resolve(); } })
        .to(progress, { scaleX: 1, duration: .18, ease: 'power2.out' }, 0)
        .to(content, { y: -16, opacity: 0, duration: .24, ease: 'power2.in' }, .1)
        .to(layer, { yPercent: -100, duration: .5, ease: 'power3.inOut', force3D: true }, .18);
    });
  };

  // A suspended outgoing page may be restored from the browser's Back cache.
  window.addEventListener('pageshow', (event) => { if (event.persisted) reset(); });
  window.addEventListener('pagehide', () => clearTimeout(recovery));
  if (reduce) { reset(); return noop; }

  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || !/\/(?:index\.html|recap\.html)?$/.test(url.pathname)) return;
    if (pagePath(url.pathname) === pagePath(location.pathname)) return;
    event.preventDefault();
    if (leaving) return;
    leaving = true;
    animation?.kill();
    html.classList.remove('page-entering');
    html.classList.add('page-leaving');
    layer.classList.add('is-active');
    caption.textContent = url.pathname.endsWith('recap.html') ? 'recap' : 'home';
    stopScroll();
    gsap.set(layer, { y: 0, yPercent: 100, force3D: true });
    gsap.set(content, { opacity: 1, y: 0 });
    gsap.set(progress, { scaleX: 0 });
    gsap.set(bandMotifs, { y: 8, opacity: 0, rotation: -8 });
    animation = gsap.timeline({
      onComplete: () => {
        try { sessionStorage.setItem(HANDOFF, JSON.stringify({ to: url.pathname, at: Date.now() })); } catch { /* native navigation still works */ }
        recovery = setTimeout(reset, 1800);
        try { location.assign(url.href); } catch { reset(); }
      },
    })
      .to(layer, { yPercent: 0, duration: .28, ease: 'power3.inOut', force3D: true }, 0)
      .to(bandMotifs, { y: 0, opacity: 1, rotation: 0, duration: .18, stagger: .014, ease: 'power2.out', force3D: true }, .035)
      .to(progress, { scaleX: .64, duration: .28, ease: 'power2.out' }, 0);
  });

  return { reveal };
}
