import { defineArea } from '../define';

export default defineArea(
  {
    id: 'prima-vista-heist',
    disc: 1,
    order: 1,
    location: 'M.S. Prima Vista',
    visit: 'Planning the Heist',
    chapter: 'Opening',
    summary:
      'The opening scene aboard the theatre ship. Two small pickups in the dark room and your first boss steals.',
    party: 'Zidane, Blank, Cinna, Marcus',
    partyIds: ['zidane'],
    departure: {
      trigger: 'Defeating the Masked Man and finishing the briefing',
      consequence: 'The game moves to Alexandria. You never return to this room before the ship is wrecked.',
    },
    tips: [
      'Grab both pickups before lighting the candle on the table — lighting it starts the briefing.',
      "Steal everything before you defeat the boss. All four party members have Steal here, and taking one item doesn't stop you stealing the rest.",
    ],
  },
  {
    missability: 'permanent',
    missableKind: 'pickup',
    lastOpportunity: 'Before lighting the candle',
    sources: ['jegged', 'gamefaqs-bover', 'gamefaqs-vinheim', 'steam-guide'],
  },
  [
    {
      slug: 'gil-47',
      name: '47 Gil',
      category: 'hidden-item',
      spot: 'Dark room (closet)',
      description: 'A small Gil cache hidden in the closet at the back of the dark room.',
      locationDetails: 'Walk into the closet area at the back and check the left wall.',
    },
    {
      slug: 'potion',
      name: 'Potion',
      category: 'hidden-item',
      spot: 'Dark room (closet)',
      description: 'A Potion tucked against the opposite wall of the same closet.',
      locationDetails: 'Closet at the back of the room, right-hand wall.',
    },
    {
      slug: 'steal-potion',
      name: 'Potion (steal)',
      category: 'steal',
      spot: 'Boss: Masked Man',
      description: "The Masked Man's common steal.",
      missableKind: 'steal',
      lastOpportunity: 'Before the Masked Man is defeated',
      caveats: ['Common item — losing it costs nothing but treasure completeness.'],
      sources: ['jegged', 'gamefaqs-bover'],
    },
    {
      slug: 'steal-wrist',
      name: 'Wrist (steal)',
      category: 'steal',
      spot: 'Boss: Masked Man',
      description: 'Uncommon steal. Vivi can equip it as soon as you control him in Alexandria.',
      missableKind: 'steal',
      lastOpportunity: 'Before the Masked Man is defeated',
      caveats: ['Wrists are sold in shops from Dali onward.'],
      sources: ['jegged', 'gamefaqs-bover'],
    },
    {
      slug: 'steal-mage-masher',
      name: 'Mage Masher (steal)',
      category: 'steal',
      spot: 'Boss: Masked Man',
      description:
        "Rare steal and a straight upgrade over Zidane's starting dagger. Worth the patience.",
      missableKind: 'steal',
      lastOpportunity: 'Before the Masked Man is defeated',
      caveats: [
        'Not unique: another Mage Masher is in the Ice Cavern and Dali sells them. Having one early helps the Baku fight.',
      ],
      sources: ['jegged', 'gamefaqs-bover'],
    },
  ],
);
