import { defineArea } from '../define';
import { PICKUP, STEAL } from './common';

export default defineArea(
  {
    id: 'madain-sari-return',
    disc: 2,
    order: 19,
    location: 'Madain Sari',
    visit: 'Return Visit',
    chapter: 'The Iifa Tree',
    summary: 'A brief return. It has two chests, gifts from the Moogles, a solo boss fight for Zidane, and a new party member.',
    party: 'Zidane (solo for the boss), then a party you choose',
    partyIds: ['zidane', 'vivi', 'eiko', 'amarant'],
    spoilerLevel: 2,
    tips: [
      'For the first time you choose your party. GameFAQs suggests giving the newcomer a spot, since he needs the AP and levels.',
      'Morrison’s shop is open, and Momatose in the dining room restores HP and MP.',
      'Make sure you have Poison Knuckles for the newcomer before leaving.',
    ],
  },
  { missability: 'none', sources: PICKUP },
  [
    { slug: 'survival-vest', name: 'Survival Vest', category: 'treasure', spot: 'Room by the fishing area (below Eiko’s porch)', description: 'Enter the room by the fishing area once the scene ends.' },
    { slug: 'phoenix-down', name: 'Phoenix Down', category: 'treasure', spot: 'Room by the fishing area', description: 'Second chest in the same room.' },
    { slug: 'moco-exploda', name: 'Exploda (from Moco)', category: 'key-item', spot: 'Eidolon Wall — Moco', description: 'Speak to Moco at the Eidolon Wall and peek inside.', mandatory: true },
    { slug: 'moco-elixir', name: 'Elixir (from Moco)', category: 'key-item', spot: 'Eidolon Wall — Moco', description: 'Given along with the Exploda.', mandatory: true },
    { slug: 'steal-scarlet-hair-ether', name: 'Ether (steal)', category: 'steal', spot: 'Boss: Scarlet Hair', description: 'Common steal. Zidane fights alone.', missability: 'permanent', missableKind: 'steal', lastOpportunity: 'Before the boss is defeated', sources: STEAL },
    {
      slug: 'steal-scarlet-hair-poison-knuckles',
      name: 'Poison Knuckles (steal)',
      category: 'steal',
      spot: 'Boss: Scarlet Hair',
      description: 'Uncommon steal. Poison Knuckles are also sold in shops.',
      missability: 'permanent',
      missableKind: 'steal',
      lastOpportunity: 'Before the boss is defeated',
      sources: STEAL,
    },
    { slug: 'memory-earring', name: 'Memory Earring (key item)', category: 'key-item', spot: 'Room under the kitchen', description: 'Return to the room under the kitchen after the fight.', mandatory: true, sources: ['gamefaqs-bover', 'gamefaqs-vinheim'] },
  ],
);
