import { defineArea } from '../define';
import { ATE, PICKUP } from './common';

export default defineArea(
  {
    id: 'madain-sari',
    disc: 2,
    order: 17,
    location: 'Madain Sari',
    visit: 'First Visit',
    chapter: 'The Outer Continent',
    summary:
      'A ruined village by the sea. It has five ATEs, a cooking scene you can influence, the second rare coffee, and a Stellazzio coin by the fountain.',
    party: 'Zidane, Vivi, Garnet, Eiko',
    partyIds: ['zidane', 'vivi', 'garnet', 'eiko'],
    spoilerLevel: 1,
    ateGuide: [
      { kind: 'select', text: 'Fountain area: “Vivi’s Feelings”.' },
      { kind: 'select', text: 'At the entrance to the Eidolon Wall: “Dagger’s Feelings”.' },
      { kind: 'auto', text: 'Back at the fountain, “Eiko’s Feelings” starts by itself and begins the cooking choices.' },
      { kind: 'select', text: 'Try to enter the kitchen, then return to the fountain: “Eiko’s Kitchen”.' },
      { kind: 'select', text: 'Speak to the Moogle at the Eidolon Wall, then to Dagger, then return: “Eiko’s Kitchen 2”.' },
      { kind: 'note', text: 'Don’t enter the kitchen as Zidane until you’ve seen them all.' },
    ],
    tips: [
      'The cooking choices change the dinner scene, not your items. Sources disagree on the best assignments (GameFAQs: Mocha digs potatoes, Chimomo helps cook, Momatose fishes; the Steam ATE guide swaps Chimomo and Momatose). Both agree: leave out the Oglop and ask Quina for advice.',
      'Morrison’s shop sells Magic Tags and Softs. Stock up for the next area.',
    ],
  },
  { missability: 'none', sources: PICKUP },
  [
    { slug: 'libra-stellazzio', name: 'Libra (Stellazzio coin)', category: 'key-item', spot: 'Fountain plaza', description: 'By the fountain’s broken piece.', rewardUniqueness: 'unique' },
    { slug: 'ate-vivis-feelings', name: 'ATE: Vivi’s Feelings', category: 'ate', ateTrigger: 'selectable', spot: 'Fountain area', description: 'Offered in the fountain area.', missability: 'permanent', missableKind: 'event', lastOpportunity: 'Before the dinner scene', sources: ATE },
    { slug: 'ate-daggers-feelings', name: 'ATE: Dagger’s Feelings', category: 'ate', ateTrigger: 'selectable', spot: 'Eidolon Wall entrance', description: 'Offered by the path to the Eidolon Wall.', missability: 'permanent', missableKind: 'event', lastOpportunity: 'Before the dinner scene', sources: ATE },
    { slug: 'ate-eikos-feelings', name: 'ATE: Eiko’s Feelings', category: 'ate', ateTrigger: 'automatic', spot: 'Fountain area', description: 'Starts by itself once you return to the fountain, and begins the cooking choices.', mandatory: true, missability: 'none', sources: ATE },
    { slug: 'ate-eikos-kitchen', name: 'ATE: Eiko’s Kitchen', category: 'ate', ateTrigger: 'selectable', spot: 'Fountain area', description: 'Try to enter the kitchen, then go back to the fountain.', missability: 'permanent', missableKind: 'event', lastOpportunity: 'Before the dinner scene', sources: ATE },
    { slug: 'ate-eikos-kitchen-2', name: 'ATE: Eiko’s Kitchen 2', category: 'ate', ateTrigger: 'selectable', spot: 'Fountain area', description: 'After visiting the Eidolon Wall with Dagger, leave and watch it.', missability: 'permanent', missableKind: 'event', lastOpportunity: 'Before the dinner scene', sources: ATE },
    { slug: 'tent', name: 'Tent', category: 'treasure', spot: 'Fountain plaza — bench', description: 'Behind the low wall south of the fountain, where Dagger was sitting.' },
    { slug: 'ore', name: 'Ore', category: 'treasure', spot: 'Dining room', description: 'Chest near where Zidane sits after dinner.' },
    { slug: 'phoenix-pinion', name: 'Phoenix Pinion', category: 'treasure', spot: 'Dining room', description: 'Chest near where Dagger sits.' },
    { slug: 'kirman-coffee', name: 'Kirman Coffee (key item)', category: 'key-item', spot: 'Kitchen', description: 'Take the pot to the kitchen, then check in front of the table facing the waterfall.', caveats: ['The second of three rare coffees for the coffee sidequest.'] },
    {
      slug: 'friendly-nymph',
      name: 'Friendly Monster: Nymph',
      category: 'sidequest',
      spot: 'Pualei Plains — forests',
      description: 'On the way to the next area. She only appears in the forests, not on open plains. Give her 3 Ore.',
      reward: 'Emerald + 30 AP',
      requirements: ['3 Ore'],
      sources: ['gamefaqs-bover', 'jegged-missables'],
    },
  ],
);
