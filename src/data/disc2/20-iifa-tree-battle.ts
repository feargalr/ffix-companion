import { defineArea } from '../define';
import { STEAL } from './common';

export default defineArea(
  {
    id: 'iifa-tree-battle',
    disc: 2,
    order: 20,
    location: 'Iifa Tree',
    visit: 'Return',
    chapter: 'The Iifa Tree',
    summary: 'The last stretch of Disc 2: a run down the outer roots against waves of enemies, ending in a series of story scenes.',
    party: 'Zidane, Vivi, Eiko, Amarant',
    partyIds: ['zidane', 'vivi', 'eiko', 'amarant'],
    spoilerLevel: 2,
    departure: {
      trigger: 'The final scenes at the bottom of the roots',
      consequence: 'Disc 2 ends.',
    },
    tips: [
      'The slugs here are undead too: Life or a Phoenix Down works wonders.',
      'Give everyone Insomniac.',
      'If you want to grind, leave at the top of the root to save. The slugs keep coming when you return.',
    ],
  },
  { missability: 'none', sources: ['gamefaqs-bover', 'jegged'] },
  [
    {
      slug: 'mocchi-stiltzkin-letter',
      name: 'Mognet: read Stiltzkin’s letter at Mocchi',
      category: 'mognet',
      spot: 'Behind the tree — Mocchi',
      description: 'Mocchi is behind the tree after the first fight. Save and read the letter.',
    },
    { slug: 'steal-mistodon-hi-potion', name: 'Hi-Potion (steal)', category: 'steal', spot: 'Mistodons (story fights)', description: 'The Mistodons here can be robbed of Hi-Potions.', repeatable: true, sources: STEAL },
    { slug: 'steal-mistodon-ore', name: 'Ore (steal)', category: 'steal', spot: 'Mistodons (story fights)', description: 'Their uncommon steal.', repeatable: true, sources: STEAL },
    { slug: 'aquamarine', name: 'Aquamarine', category: 'key-item', spot: 'Bottom of the roots (story)', description: 'Received during the scenes at the statue.', mandatory: true, sources: ['gamefaqs-bover', 'gamefaqs-vinheim', 'psnprofiles-treasure', 'jegged'] },
  ],
);
