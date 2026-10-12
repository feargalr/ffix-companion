import { defineArea, ref } from '../define';

export default defineArea(
  {
    id: 'mist-continent-zidane',
    disc: 2,
    order: 5,
    location: 'Mist Continent',
    visit: 'Before Cleyra',
    chapter: 'Cleyra',
    optional: true,
    summary:
      'Zidane’s party is free to roam before heading into the sandstorm. Two quick errands are worth doing first: one Kupo Nut delivery and more frog catching.',
    party: 'Zidane, Vivi, Freya',
    partyIds: ['zidane', 'vivi', 'freya'],
    partyOptionalIds: ['quina'],
    spoilerLevel: 1,
    departure: {
      trigger: 'Entering the whirlwind to Cleyra',
      consequence: 'Inside Cleyra’s Trunk you are handed another Kupo Nut, which you can’t take if you are still carrying one.',
    },
    tips: [
      'Equip Zidane’s party with anything Dagger and Steiner bought in Treno.',
      'Cleyra is the whirlwind west of Burmecia. Save before you go in.',
    ],
  },
  { missability: 'none', sources: ['gamefaqs-bover'] },
  [
    {
      slug: 'kupo-nut-delivery-nazna',
      name: 'Kupo Nut delivery: Nazna’s nut to Moguta',
      category: 'sidequest',
      spot: "Gizamaluke's Grotto — Moguta",
      description:
        'Take the Kupo Nut from Summit Station back to Moguta. You can only carry one nut, and Monev hands you another inside Cleyra’s Trunk.',
      reward: 'Random item',
      requires: [ref(2, 'summit-station', 'nazna-letter')],
      missability: 'permanent',
      missableKind: 'opportunity',
      priority: 'important',
      lastOpportunity: 'Before you meet Monev in Cleyra’s Trunk',
      caveats: [
        'GameFAQs’ Kupo Nut page lists the fixed Disc 2 reward (an Elixir) as only available after Cleyra, so this first Disc 2 delivery gives a random item.',
      ],
      sources: ['gamefaqs-bover', 'jegged'],
    },
    {
      slug: 'frog-catching-3',
      name: 'Frog catching (third visit)',
      category: 'sidequest',
      spot: "Qu's Marsh",
      description: 'Catch more frogs, but leave a male, a female and any Golden Frog so the pond refills.',
      requires: ['d1.lindblum-kingdom.recruit-quina'],
      verification: 'single-source',
    },
  ],
);
