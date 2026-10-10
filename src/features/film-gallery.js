// A compact archive reel: vertical scroll advances the strip on desktop;
// touch, short screens and reduced motion use the native horizontal carousel.
import { gsap } from '../core/gsap.js';
import { scrollToTarget } from '../core/scroll.js';
import { $, $$, pad2 } from '../core/env.js';
import { recap } from '../data.js';

export function initFilmGallery() {
  const section = $('[data-film-gallery]');
  if (!section || section.hidden) return;
  const viewport = $('[data-film-viewport]', section);
  const track = $('[data-film-track]', section);
  const frames = $$('[data-film-frame]', section);
  if (!frames.length) return;
  const previous = $('[data-film-prev]', section);
  const next = $('[data-film-next]', section);
  const position = $('[data-film-position]', section);
  const hint = $('[data-film-hint]', section);
  const status = $('[data-film-status]', section);
  const title = $('[data-film-event-title]', section);
  const meta = $('[data-film-event-meta]', section);
  const kind = $('[data-film-event-kind]', section);
  const description = $('[data-film-event-description]', section);
  const result = $('[data-film-event-result]', section);
  const error = $('[data-film-error]', section);
  const unavailable = new Set();
  const details = recap.photos.map((photo) => {
    const event = recap.events.find((event) => event.id === photo.eventId);
    return {
      title: event?.name || photo.title,
      meta: [event?.day || photo.day, event?.cat].filter(Boolean).join(' · '),
      kind: event?.kind || photo.caption || '',
      description: event?.blurb || photo.description || '',
      result: event?.result || '',
    };
  });
  const container = section.closest('.container');
  let active = -1, centers = [], distance = 0, viewportMiddle = 0, tween = null;

  const select = (index) => {
    index = gsap.utils.clamp(0, frames.length - 1, index);
    if (index === active) return;
    active = index;
    position.textContent = `${pad2(index + 1)} / ${pad2(frames.length)}`;
    previous.disabled = index === 0;
    next.disabled = index === frames.length - 1;
    const event = details[index];
    title.textContent = event.title;
    meta.textContent = event.meta;
    kind.textContent = event.kind;
    description.textContent = event.description;
    result.textContent = event.result;
    result.hidden = !event.result;
    error.hidden = !unavailable.has(index);
  };
  const nearest = (x) => {
    const middle = viewportMiddle + x;
    let nearestIndex = 0;
    centers.forEach((center, i) => {
      if (Math.abs(center - middle) < Math.abs(centers[nearestIndex] - middle)) nearestIndex = i;
    });
    select(nearestIndex);
  };
  const measure = (width = viewport.clientWidth) => {
    viewportMiddle = width / 2;
    centers = frames.map((frame) => {
      // Both the ribbon and photo aperture repeat every 720px. Their shared
      // phase is local to the track, so scrolling needs no mask updates.
      frame.style.setProperty('--film-aperture-x', `${-frame.offsetLeft}px`);
      return frame.offsetLeft + frame.offsetWidth / 2;
    });
    const style = getComputedStyle(track);
    const contentWidth = frames.reduce((sum, frame) => sum + parseFloat(getComputedStyle(frame).width), 0)
      + parseFloat(style.columnGap) * (frames.length - 1)
      + parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    distance = Math.max(0, contentWidth - width);
  };
  const goTo = (index) => {
    index = gsap.utils.clamp(0, frames.length - 1, index);
    const left = Math.max(0, centers[index] - viewport.clientWidth / 2);
    if (tween?.scrollTrigger && distance > 0) {
      const trigger = tween.scrollTrigger;
      scrollToTarget(trigger.start + Math.min(1, left / distance) * (trigger.end - trigger.start), { offset: 0, duration: .55 });
    } else {
      viewport.scrollTo({ left, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
    status.textContent = `Photograph ${index + 1} of ${frames.length}. ${details[index].title}.`;
  };

  previous.addEventListener('click', () => goTo(active - 1));
  next.addEventListener('click', () => goTo(active + 1));
  viewport.addEventListener('keydown', (event) => {
    const key = event.key;
    if (frames.length < 2 || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(key)) return;
    event.preventDefault();
    goTo(key === 'Home' ? 0 : key === 'End' ? frames.length - 1 : active + (key === 'ArrowRight' ? 1 : -1));
  });
  viewport.addEventListener('scroll', () => { if (!tween) nearest(viewport.scrollLeft); }, { passive: true });

  frames.forEach((frame, index) => {
    const img = $('img', frame);
    const failed = () => {
      img.hidden = true;
      unavailable.add(index);
      if (active === index) error.hidden = false;
    };
    img.addEventListener('error', failed);
    if (img.complete && !img.naturalWidth) failed();
  });
  select(0);

  const media = gsap.matchMedia();
  media.add({
    desktop: '(min-width: 768px) and (min-height: 800px)',
    motion: '(prefers-reduced-motion: no-preference)',
  }, (context) => {
    const animated = context.conditions.desktop && context.conditions.motion;
    section.classList.toggle('is-reeling', animated);
    hint.textContent = animated ? 'Scroll to roll the film' : frames.length > 1 ? 'Swipe through the frames' : 'A frame from the archive';

    if (animated) {
      viewport.scrollLeft = 0;
      const layout = () => {
        // During refresh the pin still has its previous fixed width. Measure
        // the responsive container instead, before ScrollTrigger reverts it.
        const style = getComputedStyle(container);
        const width = container.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
        section.style.setProperty('--film-leader', `${Math.round(width * .34)}px`);
        measure(width);
      };
      layout();
      // Pin the panel, move only its child. A short, bounded scroll distance
      // keeps future photo collections from turning into a long vertical page.
      tween = gsap.fromTo(track, { x: 0 }, {
        x: () => -distance, ease: 'none',
        onUpdate() { nearest(distance * this.progress()); },
        scrollTrigger: {
          id: 'recap-filmstrip', trigger: section, start: 'top 96px',
          end: () => `+=${Math.min(Math.max(420, distance * .7), innerHeight * 1.6)}`,
          pin: true, scrub: .45, anticipatePin: 1,
          invalidateOnRefresh: true, refreshPriority: 1,
          onRefreshInit: layout,
        },
      });
    } else {
      section.style.removeProperty('--film-leader');
      measure();
      // Center the actual first frame; no duplicated or placeholder photos.
      viewport.scrollLeft = Math.max(0, centers[0] - viewport.clientWidth / 2);
      nearest(viewport.scrollLeft);
    }
    return () => {
      tween = null;
      section.classList.remove('is-reeling');
      section.style.removeProperty('--film-leader');
    };
  });

  // Native carousel metrics also follow resize without creating another clock.
  new ResizeObserver(() => { if (!tween) { measure(); nearest(viewport.scrollLeft); } }).observe(viewport);
}
