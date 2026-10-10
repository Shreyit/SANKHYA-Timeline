// Renders data-driven blocks (stats, event photographs, committee…) from data.js.
import { gsap, ScrollTrigger, SplitText } from '../core/gsap.js';
import { $, $$, reduce, finePointer, esc, pad2 } from '../core/env.js';
import { fest, marquee, recap, committee, culture } from '../data.js';
import { motifSvg } from '../brand/motifs.js';

/* ── Render content from data.js ───────────────────────
   Every block is guarded: index.html and recap.html share this bundle but
   each page only includes the sections it needs. */
export function render() {
  const year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  const theme = $('[data-fest-theme]');
  if (theme) theme.textContent = `${fest.theme} / ${fest.edition}`;

  const mq = $('[data-marquee]');
  if (mq) {
    const group = marquee.map((m) => `<span class="marquee__item">${esc(m)}</span>${motifSvg(4, 'marquee__sep')}`).join('');
    mq.innerHTML = `<div class="marquee__group">${group}</div><div class="marquee__group">${group}</div>`;
  }

  const cultureEl = $('[data-culture]');
  if (cultureEl) cultureEl.innerHTML = culture.map((item, i) => `
    <article class="culture-card" data-fade>
      <div class="culture-card__top"><span class="label">${pad2(i + 1)} / ${esc(item.label)}</span>${motifSvg(item.motif, 'culture-card__motif')}</div>
      <h3>${esc(item.title).replace('\n', '<br>')}</h3>
      <p>${esc(item.text)}</p>
    </article>`).join('');

  const quote = $('.recap__quote');
  if (quote) quote.textContent = `“${recap.quote}”`;
  const rdates = $('[data-recap-dates]');
  if (rdates) rdates.textContent = `${recap.dates} · TISS Mumbai`;

  const statsEl = $('[data-stats]');
  if (statsEl) statsEl.innerHTML = recap.stats.map((s) => `
    <div class="stat" data-fade>
      <span class="stat__n" data-odometer="${s.n}" aria-label="${s.n}">${odometerDigits(s.n)}</span>
      <span class="label">${esc(s.label)}</span>
    </div>`).join('');

  const film = $('[data-film-gallery]');
  if (film) {
    const photos = recap.photos || [];
    film.hidden = photos.length === 0;
    $('[data-film-track]', film).innerHTML = photos.map((photo) => `
      <li class="filmstrip__frame" data-film-frame>
        <figure>
          <div class="filmstrip__photo">
            <img src="${esc(photo.src)}" ${photo.srcset ? `srcset="${esc(photo.srcset)}"` : ''}
              sizes="(max-width: 767px) 86vw, (max-width: 1200px) 76vw, 960px"
              width="${Number(photo.width) || 1600}" height="${Number(photo.height) || 900}"
              alt="${esc(photo.alt)}" loading="lazy" decoding="async" />
          </div>
        </figure>
      </li>`).join('');
    $('[data-film-position]', film).textContent = `01 / ${pad2(photos.length)}`;
    $('[data-film-controls]', film).hidden = photos.length < 2;
  }

  const committeeEl = $('[data-committee]');

  const mail = '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="3.5" width="12" height="9" rx="1.5"/><path d="m2.5 4.5 5.5 4 5.5-4"/></svg>';
  const phone = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5.5 2.5h-2a1 1 0 0 0-1 1C2.5 9 7 13.5 12.5 13.5a1 1 0 0 0 1-1v-2l-2.5-1-1.2 1.2A7 7 0 0 1 5.3 6.2L6.5 5z"/></svg>';
  if (committeeEl) committeeEl.innerHTML = committee.map((m, i) => `
    <li>
      <span class="no">${pad2(i + 1)}</span>
      <span class="field">${esc(m.field)}</span>
      <span class="who"><b>${m.name ? esc(m.name) : 'To be announced'}</b><span>${esc(m.role)}</span></span>
      <span class="reach">
        <a class="icon-btn" ${m.email ? `href="mailto:${esc(m.email)}" data-cursor="${esc(m.email)}"` : 'aria-disabled="true" data-cursor="Email TBA"'} aria-label="Email ${esc(m.field)}">${mail}</a>
        <a class="icon-btn" ${m.phone ? `href="tel:${esc(m.phone)}" data-cursor="Call ${esc(m.phone)}"` : 'aria-disabled="true" data-cursor="Number TBA"'} aria-label="Call ${esc(m.field)}">${phone}</a>
      </span>
    </li>`).join('');

  // Registration: styled as the primary CTA with a "soon" badge until the backend is live.
  $$('[data-register]').forEach((a) => {
    if (fest.registrationOpen) { a.href = fest.registerUrl; a.dataset.cursor = 'Register'; return; }
    a.classList.add('is-soon');
    a.insertAdjacentHTML('beforeend', '<span class="sr-only"> (opens soon)</span>');
  });
}

function odometerDigits(n) {
  return String(n).padStart(2, '0').split('').map(() =>
    `<span class="digit" aria-hidden="true">${Array.from({ length: 10 }, (_, d) => `<span>${d}</span>`).join('')}</span>`).join('');
}
