// All scroll choreography (GSAP + ScrollTrigger + SplitText). Lenis feeds
// ScrollTrigger from core/scroll.js, so these stay in lockstep with smooth scroll.
import { gsap, ScrollTrigger, SplitText } from '../core/gsap.js';
import { $, $$, reduce, finePointer, esc, pad2 } from '../core/env.js';

/* ── Scroll choreography (per-page: every block guarded) ── */
export function initMotion() {
  if (reduce) return;

  // Unhide the pre-hidden intro targets in the same frame their from-tweens
  // are created below (immediateRender re-hides them) — no painted gap.
  const navEl = $('[data-nav]');
  if (navEl) gsap.set(navEl, { opacity: 1 });
  const heroBody = $('.hero .container');
  if (heroBody) gsap.set(heroBody, { opacity: 1 });

  // Marquee, reacting to scroll velocity
  const track = $('[data-marquee]');
  if (track) {
    const loop = gsap.to(track, { xPercent: -50, duration: 40, ease: 'none', repeat: -1 });
    ScrollTrigger.create({
      onUpdate: (self) => {
        const v = gsap.utils.clamp(-4, 4, self.getVelocity() / 400);
        gsap.to(loop, { timeScale: 1 + Math.abs(v), duration: 0.3, overwrite: true });
        gsap.to(loop, { timeScale: 1, duration: 1.2, delay: 0.3 });
      },
    });
  }

  // Hero intro (recipe 12) — home page only
  if ($('.hero__logo')) {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1 } });
    tl.from('[data-nav]', { y: -20, opacity: 0, duration: 0.8 })
      .from('[data-hero-label]', { y: 16, opacity: 0, stagger: 0.08 }, '-=0.6')
      .from('.hero__logo', { opacity: 0, y: 26, filter: 'blur(10px)', duration: 1.1, clearProps: 'opacity,filter,transform' }, '<0.1')
      .from('.hero__lead .line > span', { yPercent: 110, stagger: 0.1 }, '-=0.9')
      .from('.hero__sub, [data-hero-cta]', { y: 24, opacity: 0, stagger: 0.08 }, '-=0.7');
  } else if ($('[data-nav]')) {
    gsap.from('[data-nav]', { y: -20, opacity: 0, duration: 0.8, ease: 'expo.out' });
  }

  // Headline mask reveals (recipe 1)
  $$('[data-reveal]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines', mask: 'lines', autoSplit: true,
      onSplit: (self) => {
        gsap.set(el, { opacity: 1 });
        return gsap.from(self.lines, { yPercent: 110, duration: 1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
      },
    });
  });

  // Fade-ups, batched so grids stagger in reading order
  ScrollTrigger.batch('[data-fade]', {
    start: 'top 88%', once: true,
    onEnter: (els) => gsap.fromTo(els, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.08, overwrite: true }),
  });

  // About: scroll-scrubbed word highlight (home page only)
  const statement = $('[data-words]');
  if (statement) {
    SplitText.create(statement, { type: 'words', wordsClass: 'w' });
    gsap.to('.about__statement .w', {
      opacity: 1, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: statement, start: 'top 80%', end: 'bottom 45%', scrub: 1 },
    });
  }

  // Recap: slow drift of the gold glow (recap page only)
  if ($('.recap__glow')) gsap.fromTo('.recap__glow', { yPercent: -10 }, { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '#recap', start: 'top bottom', end: 'bottom top', scrub: true } });

  // Footer mark: slides in from the left like a car crossing the line
  if ($('.footer__mark')) gsap.from('.footer__mark .logo', {
    xPercent: -30, opacity: 0, duration: 1.2, ease: 'expo.out', clearProps: 'opacity,transform',
    scrollTrigger: { trigger: '.footer__mark', start: 'top 95%', once: true },
  });
}
