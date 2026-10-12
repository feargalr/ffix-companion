import { defineArea } from '../define';

export default defineArea(
  {
    id: 'nolrich-heights',
    disc: 1,
    order: 7,
    location: 'Mist Continent — Nolrich Heights',
    visit: 'Outside the Ice Cavern',
    chapter: 'Into the Mist',
    optional: true,
    summary:
      'The plateau between the Ice Cavern and Dali. Your first Friendly Monster lives here. South Gate is nearby but stays closed for now.',
    party: 'Zidane, Steiner, Vivi, Dagger',
    tips: [
      'South Gate (Bohden Gate) is locked without a Gate Pass. Wait a few seconds after talking to the guard and a shop girl appears. She sells basic items and offers a rest for 100 Gil.',
      'Dali is a short walk north-west of the Ice Cavern exit.',
    ],
  },
  { missability: 'none' },
  [
    {
      slug: 'friendly-mu',
      name: 'Friendly Monster: Mu',
      category: 'sidequest',
      spot: 'Nolrich Heights plains',
      description:
        "A friendly Mu can appear in random battles on the plains. Don't attack it. Give it an Ore and it rewards you.",
      reward: 'Potion + 10 AP',
      requirements: ['1 Ore (one is in the Lindblum Theater District if you have none yet)'],
      caveats: [
        'Friendly Monsters are not missable. You can do this later, when the AP is more useful.',
        'Jegged places this Mu around the South Gate approach; GameFAQs says the plains of Nolrich Heights.',
      ],
    },
  ],
);
