import { defineArea } from '../define';

export default defineArea(
  {
    id: 'south-gate',
    disc: 1,
    order: 14,
    location: 'South Gate (Bohden Gate)',
    visit: "Steiner & Dagger's Detour",
    chapter: 'The Road to Burmecia',
    summary:
      'A brief interlude with the other half of the party at the gate checkpoint. There are two chests, a Moogle letter, and a puzzle to clear the crowd so you can get through.',
    party: 'Steiner, Dagger',
    partyIds: ['steiner', 'garnet'],
    spoilerLevel: 1,
    tips: [
      'To get through, talk to the furry worker cleaning the window, then the Chief Engineer, then Jobless Jeff, then comfort Part-Time Worker Mary so she moves aside.',
      'Equipment is shared with Zidane’s group. Don’t leave your best Add-Ons on Steiner or Dagger.',
      'You can see a chest on top of the wagon, but it can’t be reached yet.',
      'The Item Shop here is the last shop this pair can use for a while.',
    ],
  },
  { missability: 'none', sources: ['jegged', 'gamefaqs-bover', 'gamefaqs-vinheim', 'steam-guide'] },
  [
    {
      slug: 'multina-racket',
      name: 'Multina Racket',
      category: 'treasure',
      spot: 'Gate area — south-west',
      description: 'Chest in the south-west part of the gate area, near the worker “fixing” the gate. A good racket for Dagger.',
    },
    {
      slug: 'potion',
      name: 'Potion',
      category: 'treasure',
      spot: 'Bohden Station',
      description: 'Chest in the south-west near the station, close to the Moogle.',
    },
    {
      slug: 'grimo-letter',
      name: "Mognet: take Grimo's letter to Nazna",
      category: 'mognet',
      spot: 'Bohden Station — Grimo',
      description: 'Pick up the letter and save. Nazna is the next Moogle these two meet. Delivering it earns a Kupo Nut.',
      missability: 'permanent',
      missableKind: 'opportunity',
      lastOpportunity: 'Before riding the cable car',
      verification: 'verified',
      sources: ['gamefaqs-bover', 'gamefaqs-vinheim', 'steam-guide'],
      priority: 'important',
    },
  ],
);
