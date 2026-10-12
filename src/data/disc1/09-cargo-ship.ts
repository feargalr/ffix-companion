import { defineArea } from '../define';

export default defineArea(
  {
    id: 'cargo-ship',
    disc: 1,
    order: 9,
    location: 'Cargo Ship',
    visit: 'Flight to Lindblum',
    chapter: 'Into the Mist',
    summary: 'A short airship ride with one boss, Black Waltz 3. There is no treasure here, only three steals.',
    party: 'Zidane, Steiner, Vivi (Dagger sits this fight out)',
    partyIds: ['zidane', 'steiner', 'vivi'],
    departure: {
      trigger: 'Defeating Black Waltz 3',
      consequence: 'Its steals are gone. None of them are unique; Lindblum sells all three.',
    },
    tips: [
      'Vivi starts the fight in Trance. Don’t kill the Waltz before Zidane has stolen everything.',
      'Silk Shirts halve its Thundara damage.',
      'The chest on deck only gets a comment from Zidane. It holds nothing.',
    ],
  },
  {
    missability: 'permanent',
    missableKind: 'steal',
    lastOpportunity: 'Before Black Waltz 3 is defeated',
    sources: ['jegged', 'gamefaqs-bover', 'gamefaqs-vinheim'],
  },
  [
    {
      slug: 'steal-steepled-hat',
      name: 'Steepled Hat (steal)',
      category: 'steal',
      spot: 'Boss: Black Waltz 3',
      description: 'Common steal.',
    },
    {
      slug: 'steal-linen-cuirass',
      name: 'Linen Cuirass (steal)',
      category: 'steal',
      spot: 'Boss: Black Waltz 3',
      description: 'Uncommon steal.',
      caveats: ['Sold in Lindblum.'],
    },
    {
      slug: 'steal-silver-gloves',
      name: 'Silver Gloves (steal)',
      category: 'steal',
      spot: 'Boss: Black Waltz 3',
      description: 'Rare steal (about 1 in 16 per successful steal), so it can take a while.',
      caveats: [
        'Not unique. A pair sits on the bench in the Lindblum Synthesis Shop, and Lindblum’s Weapon Shop sells them.',
      ],
    },
  ],
);
