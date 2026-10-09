import { gsap } from '../core/gsap.js';
import { reduce } from '../core/env.js';
import { stopScroll, startScroll } from '../core/scroll.js';

const HANDOFF = 'sankhya-page-smoke';
const pagePath = (path) => path.replace(/index\.html$/, '');

// Keep real document navigation, including URL fragments and browser history.
// A short session handoff paints the incoming curtain before its JS boots.
export function initPageTransitions() {
  const layer = document.querySelector('.page-smoke');
  if (!layer) return;
  const veil = layer.querySelector('.page-smoke__veil');
  const near = layer.querySelector('.page-smoke__plume--near');
  const far = layer.querySelector('.page-smoke__plume--far');
  const html = document.documentElement;
  let leaving = false, animation = null, recovery = 0;

  const reset = () => {
    clearTimeout(recovery);
    animation?.kill();
    gsap.set([veil, near, far], { clearProps: 'all' });
    layer.classList.remove('is-active');
    html.classList.remove('smoke-entering', 'smoke-leaving');
    leaving = false;
    startScroll();
  };

  if (reduce) reset();
  else if (html.classList.contains('smoke-entering')) {
    animation = gsap.timeline({ onComplete: reset })
      .to(veil, { opacity: 0, duration: .75, ease: 'power3.out' }, 0)
      .to(near, { xPercent: -8, yPercent: -5, scale: 1.15, opacity: 0, duration: .9, ease: 'power3.out' }, 0)
      .to(far, { xPercent: 10, yPercent: 5, scale: 1.18, opacity: 0, duration: .9, ease: 'power3.out' }, .04);
  }

  // BFCache can restore the outgoing document with its curtain still present.
  window.addEventListener('pageshow', (event) => { if (event.persisted) reset(); });
  window.addEventListener('pagehide', () => clearTimeout(recovery));

  document.addEventListener('click', (event) => {
    if (reduce || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || !/\/(?:index\.html|recap\.html)?$/.test(url.pathname)) return;
    if (pagePath(url.pathname) === pagePath(location.pathname)) return;
    event.preventDefault();
    if (leaving) return;
    leaving = true;
    animation?.kill();
    html.classList.remove('smoke-entering');
    html.classList.add('smoke-leaving');
    layer.classList.add('is-active');
    stopScroll();
    gsap.set(veil, { opacity: 0 });
    gsap.set(near, { xPercent: -12, yPercent: 14, scale: .94, opacity: 0 });
    gsap.set(far, { xPercent: 14, yPercent: -10, scale: 1.18, opacity: 0 });
    animation = gsap.timeline({
      onComplete: () => {
        try { sessionStorage.setItem(HANDOFF, JSON.stringify({ to: url.pathname, at: Date.now() })); } catch { /* navigation still works in private mode */ }
        // Recover if navigation is cancelled or the destination never loads.
        recovery = setTimeout(reset, 2400);
        try { location.assign(url.href); } catch { reset(); }
      },
    })
      .to(near, { xPercent: 0, yPercent: 0, scale: 1.08, opacity: .86, duration: .6, ease: 'power3.inOut' }, 0)
      .to(far, { xPercent: 0, yPercent: 0, scale: 1.08, opacity: .52, duration: .58, ease: 'power3.inOut' }, .02)
      .to(veil, { opacity: 1, duration: .4, ease: 'power2.inOut' }, .16);
  });
}
