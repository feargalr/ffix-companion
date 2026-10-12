import { defineArea, ref } from '../define';
import { PICKUP, STEAL, STORY } from './common';

export default defineArea(
  {
    id: 'gargan-roo',
    disc: 2,
    order: 4,
    location: 'Gargan Roo',
    visit: 'Under Treno',
    chapter: 'The Road to Treno',
    summary: 'An old underground transit line beneath Treno, with two chests, a Moogle and a boss with a weapon worth stealing.',
    party: 'Dagger, Steiner, Marcus',
    partyIds: ['garnet', 'steiner'],
    spoilerLevel: 1,
    departure: {
      trigger: 'Boarding the Gargant after the boss',
      consequence: 'GameFAQs lists Gargan Roo as an area you cannot revisit, so its chests and the boss steals are gone after this.',
    },
    tips: [
      'GameFAQs calls this one of the best grinding spots in the game. Marcus’s stats carry over to a character you meet later.',
      'Remove Add-Ons and robes before the boss if Zidane’s party will need them.',
    ],
  },
  {
    missability: 'permanent',
    missableKind: 'pickup',
    lastOpportunity: 'Before boarding the Gargant',
    priority: 'optional',
    sources: [...PICKUP, 'jegged'],
  },
  [
    {
      slug: 'mochos-letter',
      name: "Mognet: deliver Nazna's letter to Mochos",
      category: 'mognet',
      spot: 'Entrance — Mochos',
      description: 'Hand over the letter from Summit Station.',
      requires: [ref(2, 'summit-station', 'nazna-letter-to-mochos')],
      missableKind: 'opportunity',
      priority: 'important',
      sources: STORY,
    },
    { slug: 'chain-plate', name: 'Chain Plate', category: 'treasure', spot: 'South-west platform', description: 'The southern chest on the platform south-west of the entrance.' },
    { slug: 'phoenix-down', name: 'Phoenix Down', category: 'treasure', spot: 'South-west platform', description: 'The northern chest on the same platform, by the lever.' },
    {
      slug: 'steal-ralvurahva-bone-wrist',
      name: 'Bone Wrist (steal)',
      category: 'steal',
      spot: 'Boss: Ralvurahva',
      description: 'Common steal.',
      missableKind: 'steal',
      lastOpportunity: 'Before the boss escapes',
      sources: STEAL,
    },
    {
      slug: 'steal-ralvurahva-mythril-fork',
      name: 'Mythril Fork (steal)',
      category: 'steal',
      spot: 'Boss: Ralvurahva',
      description: 'Uncommon steal. The boss escapes when its HP runs out, so there are no spoils to collect afterwards.',
      missableKind: 'steal',
      priority: 'important',
      lastOpportunity: 'Before the boss escapes',
      caveats: ['A later boss on Disc 2 also has a Mythril Fork to steal.'],
      sources: STEAL,
    },
  ],
);
