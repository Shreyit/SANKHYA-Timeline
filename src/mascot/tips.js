// What Sanku says, per part of the page. Edit freely — order = page order.
//   selector  element that marks the part (first match on the page is used)
//   label     small kicker above the tip
//   mood      'happy' | 'curious' | 'excited' | 'proud'  (drives the 3D reaction)
//   tips      cycled with "Next tip" / tapping Sanku
//   cta       optional action shown under the tip { label, href }
export const SECTIONS = [
  // ── home ─────────────────────────────────────────────
  {
    key: 'hero', selector: '.hero', label: 'Welcome', mood: 'happy',
    tips: [
      "Hi, I'm Sanku — Sankhya's sprout. Sankhya means number in Sanskrit.",
      'Move across the hero to reveal Indian folk-inspired motifs. Hover Sankhya to see its flowers and ornaments come alive.',
      "Sankhya '27 is still loading. Dates, lineup and registrations drop soon.",
    ],
    cta: { label: 'See recap', href: 'recap.html' },
  },
  {
    key: 'about', selector: '#about', label: 'About', mood: 'curious',
    tips: [
      'Sankhya is run by the School of Analytics, TISS Mumbai — culture, measured.',
      'One academic day, then two days of culturals. Bring a friend (or a whole crew).',
    ],
  },
  {
    key: 'culture', selector: '#culture', label: 'Many roots', mood: 'excited',
    tips: [
      'Different rhythms, traditions and ways of seeing. There is room for your expression at Sankhya.',
      'The lotus, paisley and rangoli-inspired details are part of our new visual identity.',
    ],
  },
  {
    key: 'lineup', selector: '#lineup', label: "'27 lineup", mood: 'curious',
    tips: [
      'Schedule, events and competitions unlock here as each one is locked in.',
      'Follow @tiss.sankhya — new modules drop there first.',
    ],
    cta: { label: 'Follow on Instagram', href: 'https://www.instagram.com/tiss.sankhya' },
  },
  {
    key: 'sponsors', selector: '#sponsors', label: 'Sponsors', mood: 'excited',
    tips: [
      'Want your brand in front of a few thousand students? Sponsor slots are open.',
      'The sponsorship team replies fastest to a short email with what you have in mind.',
    ],
    cta: { label: 'Partner with us', href: "mailto:sankhya@tiss.ac.in?subject=Sponsoring%20Sankhya%20'27" },
  },
  {
    key: 'register', selector: '#register', label: 'Registrations', mood: 'excited',
    tips: [
      'Registrations open soon — participants, delegates and audience passes in one place.',
      "Tip: competitions fill up fast. Decide your events early so you're ready on day one.",
    ],
  },
  {
    key: 'contact', selector: '#contact', label: 'Contact', mood: 'happy',
    tips: [
      "Pick the row that matches your question — it goes straight to that team's head.",
      'General questions? sankhya@tiss.ac.in reaches the whole core team.',
    ],
    cta: { label: 'Email the team', href: 'mailto:sankhya@tiss.ac.in' },
  },
  // ── recap page ───────────────────────────────────────
  {
    key: 'recap', selector: '#recap', label: 'Sankhya recap', mood: 'proud',
    tips: [
      'Welcome to the Sankhya recap — the stages, stories and moments of Circle of Life.',
      'Every event from last year lives here. Photos are being added.',
    ],
  },
  {
    key: 'stats', selector: '[data-stats]', label: 'By the numbers', mood: 'proud',
    tips: ['Hover a number — the counters roll again.', '16 sessions in three days. We counted. (Obviously.)'],
  },
  {
    key: 'events', selector: '[data-film-gallery]', label: 'Event snippets', mood: 'happy',
    tips: ['Scroll through the film on desktop, or swipe on your phone.', 'Event names and stories follow the photographs below the film.'],
  },
  {
    key: 'achievements', selector: '.achievements', label: 'Achievements', mood: 'proud',
    tips: ['Our 2026 greenhouse gas inventory was independently verified with limited assurance under ISO 14064-3:2019.', 'Open the statement to read the verification scope and technical support credits.'],
  },
  // ── both ─────────────────────────────────────────────
  {
    key: 'footer', selector: 'footer.footer', label: 'Bye for now', mood: 'happy',
    tips: ['Thanks for scrolling all the way. See you at Sankhya \'27!'],
    cta: { label: 'Back to top', href: '#top' },
  },
];
