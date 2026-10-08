// Nav: menu toggle, hide-on-scroll, pill-nav indicator, anchors, toast.
import { gsap, ScrollTrigger, SplitText } from '../core/gsap.js';
import { $, $$, reduce, finePointer, esc, pad2 } from '../core/env.js';
import { fest } from '../data.js';
import { scrollToTarget } from '../core/scroll.js';

let toastTimer;
function toast() {
  const el = $('[data-toast]');
  if (!el) return;
  el.textContent = `→ Registrations open soon. Follow ${fest.instagramHandle} for the drop.`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.textContent = ''; }, 5000);
}

/* ── Nav ─────────────────────────────────────────────── */
const toggle = $('.nav__toggle');
const menu = $('#menu');
function closeMenu() {
  if (!menu || menu.hidden) return;
  menu.hidden = true;
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open menu');
}
export function initNav() {
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    const open = menu.hidden;
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open && !reduce) gsap.from('.menu a', { yPercent: 60, opacity: 0, stagger: 0.06, duration: 0.6, ease: 'expo.out' });
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  const nav = $('[data-nav]');
  let lastY = 0;
  ScrollTrigger.create({
    onUpdate: (self) => {
      const y = self.scroll();
      const hide = y > 400 && y > lastY && menu.hidden;
      gsap.to(nav, { yPercent: hide ? -160 : 0, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
      lastY = y;
    },
  });
  // cursor + recap palette swap (recap page only)
  if ($('#recap')) ScrollTrigger.create({ trigger: '#recap', start: 'top 50%', end: 'bottom 50%', toggleClass: { targets: document.body, className: 'in-recap' } });
}

/* ── Pill nav: sliding indicator follows hover, rests on the section in view ── */
export function initPillNav() {
  const nav = $('[data-pill-nav]');
  const ind = $('.pill-nav__ind', nav);
  const links = $$('.pill-nav__link', nav);
  let active = -1;
  let placed = false;

  const moveTo = (i, animate = true) => {
    const el = links[i];
    if (!el) return;
    const vars = { x: el.offsetLeft, width: el.offsetWidth, opacity: 1 };
    if (animate && placed && !reduce) gsap.to(ind, { ...vars, duration: 0.45, ease: 'power3.out', overwrite: 'auto' });
    else gsap.set(ind, vars);
    placed = true;
  };
  const rest = () => {
    if (active >= 0) moveTo(active);
    else gsap.to(ind, { opacity: 0, duration: 0.2, overwrite: 'auto' });
  };
  const setActive = (i) => {
    if (i === active) return;
    active = i;
    links.forEach((l, j) => (j === i ? l.setAttribute('aria-current', 'true') : l.removeAttribute('aria-current')));
    if (!nav.matches(':hover')) rest();
  };

  links.forEach((l, i) => {
    l.addEventListener('mouseenter', () => moveTo(i));
    l.addEventListener('focus', () => moveTo(i));
    l.addEventListener('blur', rest);
  });
  // scroll-spy: the most specific section spanning the viewport middle wins
  // (#sponsors sits inside #lineup, so check from the last link backwards).
  // Links to other pages (recap.html) get no spy — index stays null.
  let spies = [];
  spies = links.map((l) => {
    const href = l.getAttribute('href');
    if (!href || !href.startsWith('#')) return null;
    const t = href === '#top' ? document.body : $(href);
    if (!t || t === document.body) return null;
    return ScrollTrigger.create({
      trigger: t, start: 'top 50%', end: 'bottom 50%',
      onToggle: () => setActive(spies.findLastIndex((x) => x && x.isActive)),
    });
  });
  nav.addEventListener('mouseleave', rest);
  gsap.set(ind, { opacity: 0 });
  document.fonts.ready.then(() => active >= 0 && moveTo(active, false));
  new ResizeObserver(() => active >= 0 && moveTo(active, false)).observe(nav);
}

/* ── In-page anchors: smooth scroll + close menu + "registration soon" toast ── */
export function initAnchors() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    const target = id === '#top' ? 0 : $(id);
    if (target === null) return;
    e.preventDefault();
    closeMenu();
    scrollToTarget(target, { offset: id === '#top' ? 0 : -24 });
    if (a.matches('[data-register].is-soon')) toast();
  });
}

/* ── Nav firms up once the page has scrolled ── */
export function initNavState() {
  const nav = $('[data-nav]');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
