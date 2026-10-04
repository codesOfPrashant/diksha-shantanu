export const wedding = {
  bride: "Diksha",
  groom: "Shantanu",
  monogram: "D & S",
  coupleShort: "ShaDi",
  dateLabel: "21 – 22 November 2026",
  dateISO: "2026-11-22T17:00:00+05:30",
  city: "Roorkee",
  state: "Uttarakhand",
  venueName: "Kailasha Resort",
  venueAddress: "Roorkee, Uttarakhand",
  mapsUrl: "https://maps.app.goo.gl/mBUghqVSQrX4vQpU7",
  venueImage: "/photos/web/venue.jpg",
  blessing: "ॐ श्री गणेशाय नमः",
  taglineHi: "आपकी उपस्थिति ही हमारा आशीर्वाद है",
  inviteLine:
    "With love and blessings from our families, we invite you to celebrate two days of colour, music, and vows.",
} as const;

export type FamilyMember = {
  role: string;
  name: string;
};

export type FamilySide = {
  id: string;
  label: string;
  labelHi: string;
  members: FamilyMember[];
};

export const families: FamilySide[] = [
  {
    id: "groom",
    label: "Groom's side",
    labelHi: "वर पक्ष",
    members: [
      { role: "Groom", name: "Shantanu Nigam" },
      { role: "Mother", name: "Smt Kusum Nigam" },
      { role: "Father", name: "Late Shri Nagendra Nigam" },
      { role: "Brother", name: "Sarthi Nigam" },
      { role: "Grandmother", name: "Smt Shakuntla Nigam" },
    ],
  },
  {
    id: "bride",
    label: "Bride's side",
    labelHi: "वधू पक्ष",
    members: [
      { role: "Bride", name: "Diksha" },
      { role: "Mother", name: "Smt Rekha" },
      { role: "Father", name: "Shri Pramod Kumar" },
      { role: "Brother", name: "Prashant Kumar" },
      { role: "Brother", name: "Ishank Kumar" },
    ],
  },
];

export type SkyPhase =
  | "dawn"
  | "noon"
  | "afternoon"
  | "goldenhour"
  | "sunset"
  | "dusk"
  | "evening"
  | "midnight"
  | "after";

export type Ceremony = {
  id: string;
  day: "21 November" | "22 November";
  time: string;
  title: string;
  titleHi: string;
  description: string;
  dressCode?: string;
  sky: SkyPhase;
  accent: string;
};

export const ceremonies: Ceremony[] = [
  {
    id: "haldi",
    day: "21 November",
    time: "1:00 PM",
    title: "Haldi",
    titleHi: "हल्दी",
    description:
      "The celebrations begin at 1 PM with turmeric, laughter, and golden light.",
    dressCode: "Yellow / Haldi colour",
    sky: "noon",
    accent: "#e4b23a",
  },
  {
    id: "mehendi",
    day: "21 November",
    time: "4:00 PM",
    title: "Mehendi",
    titleHi: "मेहंदी",
    description:
      "Henna on hands, stories in the shade, and the afternoon turning soft and green.",
    dressCode: "Mehendi / Green colour",
    sky: "afternoon",
    accent: "#5f8f63",
  },
  {
    id: "sangeet",
    day: "21 November",
    time: "6:00 PM onwards",
    title: "Sangeet",
    titleHi: "संगीत",
    description:
      "As the sun lowers, the music rises — dance with us into the evening.",
    sky: "sunset",
    accent: "#d97b4a",
  },
  {
    id: "wedding",
    day: "22 November",
    time: "5:00 PM onwards",
    title: "Wedding Celebration",
    titleHi: "विवाह उत्सव",
    description:
      "As the sun hangs low, we welcome you to celebrate Diksha and Shantanu.",
    sky: "goldenhour",
    accent: "#7a6aa8",
  },
  {
    id: "jai-mala",
    day: "22 November",
    time: "9:00 PM",
    title: "Jai Mala",
    titleHi: "जय माला",
    description:
      "Garlands are exchanged as the night deepens and the couple is welcomed as one.",
    sky: "evening",
    accent: "#e8b4c8",
  },
  {
    id: "phere",
    day: "22 November",
    time: "Midnight",
    title: "Wedding Phere",
    titleHi: "फेरे",
    description:
      "Seven circles under the stars and moon — vows written in the night sky.",
    sky: "midnight",
    accent: "#d4b87a",
  },
];

export type Track = {
  id: string;
  title: string;
  artist: string;
  src: string;
};

export const playlist: Track[] = [
  {
    id: "until-i-found-you",
    title: "Until I Found You",
    artist: "Stephen Sanchez",
    src: "/music/until-i-found-you.mp3",
  },
  {
    id: "lover",
    title: "Lover",
    artist: "Taylor Swift",
    src: "/music/lover.mp3",
  },
  {
    id: "thinking-out-loud",
    title: "Thinking Out Loud",
    artist: "Ed Sheeran",
    src: "/music/thinking-out-loud.mp3",
  },
  {
    id: "perfect",
    title: "Perfect",
    artist: "Ed Sheeran",
    src: "/music/perfect.mp3",
  },
  {
    id: "i-think-they-call-this-love",
    title: "I Think They Call This Love",
    artist: "Elliot James Reay",
    src: "/music/i-think-they-call-this-love.mp3",
  },
];

export const photos = [
  {
    src: "/photos/web/couple-1.jpeg",
    alt: "Diksha and Shantanu together",
    caption: "Us, so far",
  },
  {
    src: "/photos/web/couple-2.png",
    alt: "Diksha and Shantanu portrait",
    caption: "Always us",
  },
] as const;
