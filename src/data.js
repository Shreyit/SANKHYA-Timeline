// All editable site content lives here. Layout code reads from these objects,
// so updating copy, adding photos or filling in contacts never touches markup.

export const fest = {
  name: 'SANKHYA',
  edition: '2027',
  short: "'27",
  host: 'Tata Institute of Social Sciences, Mumbai',
  dept: 'School of Analytics',
  tagline: 'Where culture meets the data.',
  dates: 'March 2027 · dates to be announced',
  email: 'sankhya@tiss.ac.in',
  instagram: 'https://www.instagram.com/tiss.sankhya',
  instagramHandle: '@tiss.sankhya',
  registrationOpen: false, // flip to true + set registerUrl once the backend is live
  registerUrl: '#',
};

export const marquee = [
  'Dance', 'Music', 'Film', 'Fashion', 'Open Mic', 'Theatre',
  'Policy Hackathon', 'Treasure Hunt', 'Data Conference', 'Musical Night',
];

// ── Sankhya 2026 recap ──────────────────────────────────────────────────
// Add `photo: '/img/recap/greenscreen.jpg'` to any event to replace its placeholder,
// and `result: '1st — Team Name'` to show achievements.
export const recap = {
  title: 'Circle of Life',
  year: '2026',
  quote: 'Come and watch, as the magical circle of ideas, action, and celebration comes alive.',
  dates: 'March 14 – 16, 2026',
  // Counted from the published 2026 schedule — edit freely (footfall, colleges…).
  stats: [
    { n: 3, label: 'Days' },
    { n: 16, label: 'Sessions on the schedule' },
    { n: 9, label: 'Competitions' },
    { n: 1, label: 'Academic conference' },
  ],
  days: [
    {
      label: 'Day 01', date: 'Mar 14', theme: 'Academic',
      items: [
        { time: '10:00', end: '18:00', title: 'Conference', sub: 'Full-day academic track' },
        { time: '—', title: 'Visualising the Field', sub: 'Dashboard presentation',
          body: 'An interactive dashboard visualising Kochi fieldwork data to reveal social patterns in health, education and migration — bridging lived urban experience with data-driven analysis.' },
        { time: '—', title: 'Voices Behind the Data', sub: 'Panel discussion',
          body: 'An expert panel on the Kochi fieldwork, bridging academic theory with grassroots data to explore pathways for inclusive development.' },
      ],
    },
    {
      label: 'Day 02', date: 'Mar 15', theme: 'Competitions',
      items: [
        { time: '10:00', title: "There's No Planet B", sub: 'Shark Tank × Policy Hackathon' },
        { time: '16:00', title: 'Loop Lapeta', sub: 'Treasure Hunt' },
        { time: '18:30', title: 'SurReal', sub: 'Solo Singing Competition' },
        { time: '19:00', title: 'ResoNation', sub: 'Group Singing Competition' },
        { time: '19:30', title: 'The Loud Lounge', sub: 'Open Mic' },
        { time: '20:30', title: 'GreenScreen', sub: 'Short Film Competition' },
        { time: '21:30', title: 'Aftermovie Screening', sub: 'Day two wrap' },
      ],
    },
    {
      label: 'Day 03', date: 'Mar 16', theme: 'Culturals',
      items: [
        { time: '14:00', title: 'Waste Renaissance', sub: 'Best Out of Waste' },
        { time: '18:00', title: 'Pulse', sub: 'Solo Dance Competition' },
        { time: '19:00', title: 'Crew Sync', sub: 'Group Dance Competition' },
        { time: '19:45', title: 'The Carbon Inheritance', sub: 'Theatrical Play' },
        { time: '20:15', title: 'Re: Vogue', sub: 'Sustainable Fashion Show' },
        { time: '21:00', title: 'The Showdown', sub: 'Musical Night' },
      ],
    },
  ],
  events: [
    { name: 'GreenScreen', kind: 'Short Film', blurb: '10–12 minute short film making competition.', day: 'Day 02', cat: 'Film' },
    { name: 'SurReal', kind: 'Solo Singing', blurb: 'One voice, one stage, one shot.', day: 'Day 02', cat: 'Music' },
    { name: 'ResoNation', kind: 'Group Singing', blurb: 'Harmonies built by the whole crew.', day: 'Day 02', cat: 'Music' },
    { name: 'Crew Sync', kind: 'Group Dance', blurb: 'Choreography in perfect sync.', day: 'Day 03', cat: 'Dance' },
    { name: 'Pulse', kind: 'Solo Dance', blurb: 'A solo floor for a single rhythm.', day: 'Day 03', cat: 'Dance' },
    { name: 'The Loud Lounge', kind: 'Open Mic', blurb: 'Poetry, stand-up, stories — the mic is open.', day: 'Day 02', cat: 'Stage' },
    { name: 'Re: Vogue', kind: 'Sustainable Fashion', blurb: 'A runway built on reuse and reinvention.', day: 'Day 03', cat: 'Fashion' },
    { name: "There's No Planet B", kind: 'Policy Hackathon', blurb: 'Shark Tank meets policy design for a finite planet.', day: 'Day 02', cat: 'Academic' },
    { name: 'Visualising the Field', kind: 'Conference', blurb: 'Kochi fieldwork, turned into an interactive dashboard.', day: 'Day 01', cat: 'Academic' },
    { name: 'Waste Renaissance', kind: 'Best Out of Waste', blurb: 'Discarded material, reimagined.', day: 'Day 03', cat: 'Craft' },
    { name: 'The Carbon Inheritance', kind: 'Theatrical Play', blurb: 'A play on what we leave behind.', day: 'Day 03', cat: 'Stage' },
    { name: 'The Showdown', kind: 'Musical Night', blurb: 'The closing night, turned all the way up.', day: 'Day 03', cat: 'Music' },
  ],
};

// ── Core committee ──────────────────────────────────────────────────────
// Fill in names / phones / emails. Empty strings render as "To be announced".
export const committee = [
  { field: 'General & Overall', role: 'Convenor', name: '', email: 'sankhya@tiss.ac.in', phone: '' },
  { field: 'Events & Competitions', role: 'Events Head', name: '', email: '', phone: '' },
  { field: 'Sponsorship & Partnerships', role: 'Sponsorship Head', name: '', email: '', phone: '' },
  { field: 'Marketing & PR', role: 'PR Head', name: '', email: '', phone: '' },
  { field: 'Academic & Conference', role: 'Academic Lead', name: '', email: '', phone: '' },
  { field: 'Design & Media', role: 'Design Lead', name: '', email: '', phone: '' },
  { field: 'Hospitality & Logistics', role: 'Operations Head', name: '', email: '', phone: '' },
  { field: 'Tech & Registrations', role: 'Tech Lead', name: '', email: '', phone: '' },
];
