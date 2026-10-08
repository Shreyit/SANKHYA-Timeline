// Renders data-driven blocks (stats, days, events, committee…) from data.js.
import { gsap, ScrollTrigger, SplitText } from '../core/gsap.js';
import { $, $$, reduce, finePointer, esc, pad2 } from '../core/env.js';
import { fest, marquee, recap, committee } from '../data.js';

/* ── Render content from data.js ───────────────────────
   Every block is guarded: index.html and recap.html share this bundle but
   each page only includes the sections it needs. */
export function render() {
  const year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  const mq = $('[data-marquee]');
  if (mq) {
    const group = marquee.map((m) => `<span class="marquee__item">${esc(m)}</span><span class="marquee__sep"></span>`).join('');
    mq.innerHTML = `<div class="marquee__group">${group}</div><div class="marquee__group">${group}</div>`;
  }

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

  const tabsEl = $('[data-tabs]');
  if (tabsEl) tabsEl.insertAdjacentHTML('beforeend', recap.days.map((d, i) => `
    <button class="tab" role="tab" id="tab-${i}" aria-controls="day-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-cursor="Show ${d.label.toLowerCase()}">${d.label} · ${d.date}</button>`).join(''));
  const daysEl = $('[data-days]');
  if (daysEl) daysEl.innerHTML = recap.days.map((d, i) => `
    <div class="day" role="tabpanel" id="day-${i}" aria-labelledby="tab-${i}" ${i ? 'hidden' : ''}>
      <div class="day__side">
        <span class="mono muted">${d.label}</span>
        <span class="day__date">${esc(d.date)}</span>
        <span class="day__theme">${esc(d.theme)}</span>
      </div>
      <ol class="slots">${d.items.map((it) => `
        <li>
          <time>${it.time}${it.end ? `<br>–${it.end}` : ''}</time>
          <div><strong>${esc(it.title)}</strong><span>${esc(it.sub)}</span>${it.body ? `<p>${esc(it.body)}</p>` : ''}</div>
        </li>`).join('')}
      </ol>
    </div>`).join('');

  const filtersEl = $('[data-filters]');
  const eventsEl = $('[data-events]');
  if (filtersEl && eventsEl) {
    const cats = ['All', ...new Set(recap.events.map((e) => e.cat))];
    filtersEl.innerHTML = cats.map((c, i) => `<button class="chip" aria-pressed="${i === 0}" data-cat="${esc(c)}" data-cursor="${c === 'All' ? 'Show all' : `Filter: ${esc(c.toLowerCase())}`}">${esc(c)}</button>`).join('');
    eventsEl.innerHTML = recap.events.map((e, i) => `
    <article class="card spot ev" data-cat="${esc(e.cat)}" data-fade>
      <div class="ev__media">
        ${e.photo
          ? `<img src="${esc(e.photo)}" alt="${esc(e.name)} at Sankhya 2026" loading="lazy" />`
          : `<div class="ev__ph"><div><b>${pad2(i + 1)}</b>photo drop soon</div></div>`}
        <span class="chip ev__tag">${esc(e.day)}</span>
      </div>
      <div class="ev__body">
        <div class="ev__row"><h4 class="ev__name">${esc(e.name)}</h4><span class="ev__kind mono">${esc(e.kind)}</span></div>
        <p class="muted">${esc(e.blurb)}</p>
        <p class="ev__result mono">${e.result ? esc(e.result) : 'Results — being archived'}</p>
      </div>
    </article>`).join('');
  }

  const achEl = $('[data-ach]');
  if (achEl) {
    const ach = [
      { k: '01', t: 'Winners wall', d: 'Podium finishes across all nine competitions.' },
      { k: '02', t: 'Standout moments', d: 'Performances and pieces the jury couldn’t stop talking about.' },
      { k: '03', t: 'By the numbers', d: 'Participants, colleges, footfall — the full 2026 dataset.' },
    ];
    achEl.innerHTML = ach.map((a) => `
    <div class="card spot" data-fade>
      <span class="chip" style="align-self:flex-start"><span class="dot dot--pulse"></span>Archiving</span>
      <span class="ach__k">${a.k}</span>
      <h4 class="h3">${a.t}</h4>
      <p class="muted">${a.d}</p>
    </div>`).join('');
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
