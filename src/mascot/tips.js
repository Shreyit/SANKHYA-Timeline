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
      'Hover the logo: the leaf sways, the star spins, the comet streams — and the eye follows you.',
      "Sankhya '27 is still loading. Dates, lineup and registrations drop soon.",
    ],
    cta: { label: "See how '26 went", href: 'recap.html' },
  },
  {
    key: 'about', selector: '#about', label: 'About', mood: 'curious',
    tips: [
      'Sankhya is run by the School of Analytics, TISS Mumbai — culture, measured.',
      'One academic day, then two days of culturals. Bring a friend (or a whole crew).',
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
    key: 'recap', selector: '#recap', label: "Sankhya '26", mood: 'proud',
    tips: [
      "This is Sankhya '26 — Circle of Life. Three days, March 14–16, 2026.",
      'Every event from last year lives here. Photos are being added.',
    ],
  },
  {
    key: 'stats', selector: '[data-stats]', label: 'By the numbers', mood: 'proud',
    tips: ['Hover a number — the counters roll again.', '16 sessions in three days. We counted. (Obviously.)'],
  },
  {
    key: 'days', selector: '[data-days]', label: 'The three days', mood: 'curious',
    tips: ['Switch days with the tabs — or use ← → on your keyboard.', 'Day 01 was academic: the Kochi fieldwork dashboard and a panel.'],
  },
  {
    key: 'events', selector: '[data-events]', label: 'Event snippets', mood: 'happy',
    tips: ['Filter by category with the chips above the cards.', 'GreenScreen was a full short film in 10–12 minutes. Respect.'],
  },
  {
    key: 'achievements', selector: '.achievements', label: 'Achievements', mood: 'proud',
    tips: ["Winners and standout moments are being archived. Check back after we've counted."],
  },
  // ── both ─────────────────────────────────────────────
  {
    key: 'footer', selector: 'footer.footer', label: 'Bye for now', mood: 'happy',
    tips: ['Thanks for scrolling all the way. See you at Sankhya \'27!'],
    cta: { label: 'Back to top', href: '#top' },
  },
];
