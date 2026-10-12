import type { SourceId } from '../../types/game';
import { defineArea } from '../define';

/**
 * This area's id and the slug below are fixed: the Chocograph log reserved
 * `d2.chocographs-disc2.abandoned-beach-treasure` before Disc 2 existed, and
 * players may already have ticked it.
 */
const CHOCO: SourceId[] = ['gamefaqs-chocobo-fishy', 'gamefaqs-chocograph-redscarlet', 'gamefaqs-bover'];

export default defineArea(
  {
    id: 'chocographs-disc2',
    disc: 2,
    order: 13,
    location: 'Outer Continent — Donna Plains & Gegalrich Shores',
    visit: 'Chocograph & Side Errands',
    chapter: 'The Outer Continent',
    optional: true,
    summary:
      'The plains around the tunnel exit. There is one Chocograph treasure to recover, a new frog pond and two Blue Magic spells, before you climb up to the town on the plateau.',
    party: 'Zidane, Vivi, Garnet, Quina',
    partyIds: ['zidane', 'vivi', 'garnet', 'quina'],
    spoilerLevel: 1,
    tips: [
      'Choco’s tracks are north of this continent’s Qu’s Marsh.',
      'New Chocographs can’t be dug up for a while, so only ones you already have can be completed here.',
      'Ragtime Mouse is still around in forests.',
    ],
  },
  { missability: 'none', sources: ['gamefaqs-bover'] },
  [
    {
      slug: 'abandoned-beach-treasure',
      name: 'Abandoned Beach treasure',
      category: 'chocograph',
      chocograph: { number: 5, role: 'treasure' },
      spot: 'Gegalrich Shores',
      description:
        'Call Choco on the tracks north of Qu’s Marsh, equip the Abandoned Beach Chocograph, and dig on the beach near the large dying forest.',
      reward: '9 Phoenix Pinion, 5 Phoenix Down, 12 Peridot, Diamond Gloves',
      requires: ['d1.lindblum-kingdom.chocograph-abandoned-beach'],
      caveats: ['If you never dug up this Chocograph on Disc 1, it can’t be found until digging becomes possible again later.'],
      sources: CHOCO,
    },
    {
      slug: 'frog-catching-5',
      name: 'Frog catching (Outer Continent pond)',
      category: 'sidequest',
      spot: "Qu's Marsh (north-east)",
      description: 'Frogs are harder to catch here because of the inlets. Keep a breeding pair and any Golden Frog.',
      verification: 'single-source',
    },
    { slug: 'blu-goblin-punch', name: 'Blue Magic: Goblin Punch (eat Goblin Mage)', category: 'blue-magic', spot: 'Plains and forests', description: 'Strong only when the target’s level matches Quina’s.', spoilerLevel: 1, sources: ['gamefaqs-bover', 'gamefaqs-vinheim'] },
    { slug: 'blu-1000-needles', name: 'Blue Magic: 1,000 Needles (eat Cactuar)', category: 'blue-magic', spot: 'Plains', description: 'Fixed 1,000 damage. Very handy while Quina is under-levelled.', spoilerLevel: 1, sources: ['gamefaqs-bover', 'gamefaqs-vinheim'] },
  ],
);
