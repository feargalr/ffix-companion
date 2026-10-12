import { defineArea, ref } from '../define';
import { PICKUP, STORY } from './common';

export default defineArea(
  {
    id: 'pinnacle-rocks',
    disc: 2,
    order: 9,
    location: 'Pinnacle Rocks',
    visit: 'The Hero’s Story',
    chapter: 'Alexandria',
    summary:
      'Strange rock formations and an old man with a story in five fragments. Find all five to move on. There are three chests and a Moogle along the way.',
    party: 'Zidane, Vivi, Garnet',
    partyIds: ['zidane', 'vivi', 'garnet'],
    spoilerLevel: 1,
    departure: {
      trigger: 'Jumping down after the old man’s scene',
      consequence: 'PSNProfiles lists this visit’s chests as Disc 2 only.',
    },
    tips: [
      'The fragments can be collected in any order. Give them back as Beginning, Cooperation, Silence, then Human or Hero (GameFAQs).',
      'Give the Peridot reward to Dagger. Her summons matter more as the game goes on.',
      'The Elixir and Phoenix Down chests from Disc 1 are at the start of this area, if you missed them.',
    ],
  },
  {
    missability: 'permanent',
    missableKind: 'pickup',
    priority: 'optional',
    lastOpportunity: 'Before jumping down to leave',
    sources: PICKUP,
  },
  [
    {
      slug: 'monty-letter',
      name: "Mognet: deliver Mosh's letter to Monty",
      category: 'mognet',
      spot: 'First screen — Monty',
      description: 'Hand over the letter from Alexandria Castle. After the story scenes, check again for a letter from Stiltzkin.',
      requires: [ref(2, 'alexandria-castle-escape', 'mosh-letter-to-monty')],
      missableKind: 'opportunity',
      priority: 'important',
      sources: STORY,
    },
    { slug: 'mythril-vest', name: 'Mythril Vest', category: 'treasure', spot: 'First screen — below Monty', description: 'Chest at the bottom of the area where you regain control.' },
    { slug: 'the-ogre', name: 'The Ogre', category: 'treasure', spot: 'Second screen — ground level', description: 'Chest on the ground. Talk to the old man nearby first if he appears.' },
    { slug: 'mythril-armlet', name: 'Mythril Armlet', category: 'treasure', spot: 'Screen with the cave-like exit', description: 'Near the exit, use the field icon to jump across to the chest.' },
    {
      slug: 'peridot',
      name: 'Peridot (from the old man)',
      category: 'key-item',
      spot: 'Exit',
      description: 'Return all five fragments of the story. The reward teaches Dagger a summon.',
      mandatory: true,
      missability: 'none',
      sources: [...PICKUP, 'jegged'],
    },
  ],
);
