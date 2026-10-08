# 04 — Animation Recipes

Copy-paste implementations of the motion vocabulary in `03-MOTION-SYSTEM.md`.
GSAP (incl. SplitText & ScrollTrigger) is free for commercial use since v3.13.

```bash
npm i gsap @gsap/react lenis motion
```

---

## 0. Setup: Lenis smooth scroll + GSAP (React / Next.js)

```tsx
// app/providers/SmoothScroll.tsx
'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); };
  }, []);
  return <>{children}</>;
}
```

---

## 1. Mask line reveal (headlines)

```tsx
'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
gsap.registerPlugin(SplitText, ScrollTrigger, useGSAP);

export function RevealHeading({ children, as: Tag = 'h2', className = '' }: any) {
  const ref = useRef<HTMLHeadingElement>(null);
  useGSAP(() => {
    SplitText.create(ref.current!, {
      type: 'lines',
      mask: 'lines',          // wraps each line in overflow:hidden
      autoSplit: true,        // re-splits on resize / font load
      onSplit(self) {
        return gsap.from(self.lines, {
          yPercent: 110, duration: 1, ease: 'expo.out', stagger: 0.08,
          scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
        });
      },
    });
  }, { scope: ref });
  return <Tag ref={ref} className={className}>{children}</Tag>;
}
```

Variant — **per-character** (hero only): `type: 'chars'`, `stagger: 0.02`, `duration: 0.8`.

---

## 2. Fade-up (body, cards) — Framer Motion

```tsx
import { motion } from 'motion/react';
const ease = [0.16, 1, 0.3, 1] as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show:  (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.8, ease, delay: i * 0.08 } }),
};

<motion.div variants={fadeUp} initial="hidden" whileInView="show"
  viewport={{ once: true, margin: '-10% 0px' }} custom={index} />
```

Stagger a group:
```tsx
<motion.ul initial="hidden" whileInView="show" viewport={{ once: true }}
  variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
  {items.map(it => <motion.li key={it} variants={fadeUp}>{it}</motion.li>)}
</motion.ul>
```

---

## 3. Clip image reveal + inner scale

```tsx
useGSAP(() => {
  gsap.utils.toArray<HTMLElement>('[data-reveal-img]').forEach((el) => {
    const img = el.querySelector('img');
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 80%', once: true } });
    tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' },
                  { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power4.inOut' })
      .fromTo(img, { scale: 1.2 }, { scale: 1, duration: 1.6, ease: 'expo.out' }, 0);
  });
});
```
```html
<figure data-reveal-img class="overflow-hidden rounded-[20px]"><img src="..." alt="..." /></figure>
```

---

## 4. Parallax image

```tsx
useGSAP(() => {
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((wrap) => {
    gsap.fromTo(wrap.querySelector('img'), { yPercent: -10 }, {
      yPercent: 10, ease: 'none',
      scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
});
```
Image must be ~120% height of its `overflow:hidden` wrapper.

---

## 5. Velocity-reactive marquee

```tsx
'use client';
import { motion, useScroll, useVelocity, useSpring, useTransform,
         useMotionValue, useAnimationFrame, wrap } from 'motion/react';
import { useRef } from 'react';

export function Marquee({ children, baseVelocity = -2 }: any) {
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(vel, [0, 1000], [0, 4], { clamp: false });
  const dir = useRef(1);
  const pos = useTransform(x, (v) => `${wrap(-25, -50, v)}%`);

  useAnimationFrame((_, delta) => {
    let move = dir.current * baseVelocity * (delta / 1000);
    if (factor.get() < 0) dir.current = -1; else if (factor.get() > 0) dir.current = 1;
    move += dir.current * move * factor.get();
    x.set(x.get() + move);
  });

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div className="flex gap-12" style={{ x: pos }}>
        {[0,1,2,3].map(i => <span key={i} className="flex gap-12 shrink-0">{children}</span>)}
      </motion.div>
    </div>
  );
}
```
Pure-CSS fallback: duplicate content, `@keyframes marquee { to { transform: translateX(-50%) } }`, `animation: marquee 30s linear infinite`, pause on hover.

---

## 6. Magnetic button

```tsx
'use client';
import { useRef } from 'react';
import gsap from 'gsap';

export function Magnetic({ children, strength = 0.35 }: any) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    gsap.to(ref.current, {
      x: (e.clientX - (r.left + r.width / 2)) * strength,
      y: (e.clientY - (r.top + r.height / 2)) * strength,
      duration: 0.6, ease: 'power3.out',
    });
  };
  const leave = () => gsap.to(ref.current, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' });
  return <div ref={ref} onMouseMove={move} onMouseLeave={leave} className="inline-block">{children}</div>;
}
```
(Elastic is allowed *only* on the magnetic snap-back.) Disable on touch devices.

---

## 7. Text-roll hover (buttons & nav links)

```html
<a class="roll" href="#"><span data-text="Let's talk">Let's talk</span></a>
```
```css
.roll { display:inline-flex; overflow:hidden; line-height:1.2; }
.roll span { position:relative; display:block; transition: transform .5s var(--ease-out-expo); }
.roll span::after { content: attr(data-text); position:absolute; left:0; top:100%; }
.roll:hover span { transform: translateY(-100%); }
```

---

## 8. Custom cursor with label

```tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const xTo = gsap.quickTo(dot.current, 'x', { duration: 0.5, ease: 'power3' });
    const yTo = gsap.quickTo(dot.current, 'y', { duration: 0.5, ease: 'power3' });
    const onMove = (e: MouseEvent) => {
      xTo(e.clientX); yTo(e.clientY);
      const t = (e.target as HTMLElement).closest('[data-cursor]') as HTMLElement | null;
      setLabel(t?.dataset.cursor ?? '');
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);
  return (
    <div ref={dot} aria-hidden
      className={`pointer-events-none fixed left-0 top-0 z-[100] -translate-x-1/2 -translate-y-1/2
        grid place-items-center rounded-full bg-ink text-bg text-xs font-medium
        transition-[width,height] duration-500 ease-out-expo
        ${label ? 'h-24 w-24' : 'h-3 w-3'}`}>
      {label && <span>{label}</span>}
    </div>
  );
}
// Usage: <a data-cursor="View">…project card…</a>
```

---

## 9. Pinned horizontal scroll (process / gallery)

```tsx
useGSAP(() => {
  const track = trackRef.current!;
  gsap.to(track, {
    x: () => -(track.scrollWidth - window.innerWidth),
    ease: 'none',
    scrollTrigger: {
      trigger: sectionRef.current, pin: true, scrub: 1,
      end: () => `+=${track.scrollWidth - window.innerWidth}`,
      invalidateOnRefresh: true,
    },
  });
}, { scope: sectionRef });
```
On mobile (`< 768px`) swap to a native horizontal `overflow-x: auto` snap list via `gsap.matchMedia()`.

---

## 10. Curtain page transition (Next.js App Router)

```tsx
// app/template.tsx — re-mounts on every navigation
'use client';
import { motion } from 'motion/react';
const ease = [0.76, 0, 0.24, 1] as const;

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <motion.div className="fixed inset-0 z-[90] bg-ink origin-top"
        initial={{ scaleY: 1 }} animate={{ scaleY: 0 }}
        transition={{ duration: 0.9, ease, delay: 0.1 }} />
      <motion.main initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}>
        {children}
      </motion.main>
    </>
  );
}
```
For both enter *and* exit, use the View Transitions API (`document.startViewTransition`) or a router wrapper that delays navigation until the exit curtain completes.

---

## 11. Count-up stat

```tsx
useGSAP(() => {
  gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count);
    const obj = { v: 0 };
    gsap.to(obj, { v: end, duration: 1.6, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      onUpdate: () => (el.textContent = Math.round(obj.v).toLocaleString()) });
  });
});
```
```html
<span data-count="120" class="tabular-nums">0</span>+
```

---

## 12. Hero intro timeline

```tsx
useGSAP(() => {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1 } });
  tl.from('[data-nav]', { y: -20, opacity: 0, duration: 0.8 })
    .from('[data-hero-label]', { y: 20, opacity: 0 }, '-=0.6')
    // each [data-hero-line] is an overflow:hidden wrapper around one line of the headline
    .from('[data-hero-line] > *', { yPercent: 110, stagger: 0.1 }, '-=0.7')
    .from('[data-hero-sub], [data-hero-cta]', { y: 30, opacity: 0, stagger: 0.08 }, '-=0.7')
    .fromTo('[data-hero-media]', { clipPath: 'inset(20% 20% 20% 20% round 32px)', scale: 1.1 },
      { clipPath: 'inset(0% 0% 0% 0% round 20px)', scale: 1, duration: 1.4, ease: 'power4.inOut' }, '-=0.9');
}, { scope: heroRef });
```

---

## 13. Hero media that expands on scroll (signature moment)

```tsx
gsap.fromTo('[data-expand]',
  { clipPath: 'inset(10% 12% 10% 12% round 32px)' },
  { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none',
    scrollTrigger: { trigger: '[data-expand]', start: 'top 80%', end: 'top 10%', scrub: 1 } });
```

---

## 14. Grain overlay (CSS only)

```css
body::after {
  content:''; position:fixed; inset:-50%; z-index:99; pointer-events:none; opacity:.05;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
```
