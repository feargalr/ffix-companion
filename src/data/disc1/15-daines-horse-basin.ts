import type { SourceId } from '../../types/game';
import { defineArea } from '../define';

const CHOCO: SourceId[] = ['gamefaqs-chocobo-fishy', 'gamefaqs-chocograph-redscarlet', 'gamefaqs-bover'];

export default defineArea(
  {
    id: 'daines-horse-basin',
    disc: 1,
    order: 15,
    location: 'Mist Continent — Daines-horse Basin',
    visit: 'Approaching Burmecia',
    chapter: 'The Road to Burmecia',
    optional: true,
    summary:
      'The rainy plain beyond the Grotto. There is a second Burmecian Arch with two chests, a Chocograph that upgrades your Chocobo, and more Chocograph treasure once Choco can cross shallow water.',
    party: 'Zidane, Vivi, Freya (+ recruit)',
    partyIds: ['zidane', 'vivi', 'freya'],
    partyOptionalIds: ['quina'],
    tips: [
      'Chocobo tracks are on the beach west of the nearby desert.',
      'Healing Shore teaches Choco Reef, so he can cross shallow water. That opens the Bird’s-Eye Lagoon and Small Beach treasures back in Lindblum territory.',
      'The treasures are grouped here because this is where you get Reef, even though two of them are back in Lindblum territory.',
      "Many players do these Chocographs after Atla gives them a Kupo Nut in Burmecia. Then one trip covers the Kupo Nut delivery, frog catching and the Chocographs.",
    ],
  },
  { missability: 'none' },
  [
    {
      slug: 'arch-hi-potion',
      name: 'Hi-Potion',
      category: 'treasure',
      spot: 'Burmecian Arch (North Gate, east edge)',
      description: 'Chest at the "other" Burmecian arch on the eastern edge of the basin.',
      sources: ['jegged', 'gamefaqs-bover', 'gamefaqs-vinheim', 'steam-guide'],
    },
    {
      slug: 'arch-tent',
      name: 'Tent',
      category: 'treasure',
      spot: 'Burmecian Arch (North Gate, east edge)',
      description: 'Second chest at the same arch.',
      sources: ['jegged', 'gamefaqs-bover', 'steam-guide'],
    },
    // Chocograph treasures. The Chocographs themselves are dug up in
    // Chocobo's Forest (see Lindblum Kingdom).
    {
      slug: 'chocograph-healing-shore-treasure',
      name: 'Healing Shore treasure (Reef ability)',
      category: 'chocograph',
      chocograph: { number: 4, role: 'treasure' },
      spot: 'Beach west of Burmecia and Cleyra',
      description:
        'Use the Chocobo tracks on this side of the continent, then dig on the beach shown in the Chocograph. Choco learns Reef, so he can walk through shallow water.',
      reward: 'Reef ability',
      requires: ['d1.daines-horse-basin.chocograph-healing-shore'],
      caveats: [
        'Sources name the beach differently ("Metalark Shores" in GameFAQs, "Esistern Coast" in Fishy071’s guide). All three place it on the coast west of Burmecia.',
      ],
      sources: CHOCO,
    },
    {
      slug: 'chocograph-birds-eye-lagoon-treasure',
      name: "Bird's-Eye Lagoon treasure",
      category: 'chocograph',
      chocograph: { number: 10, role: 'treasure' },
      spot: "Lindblum territory — island west of Qu's Marsh",
      description:
        'Needs Reef. Leave the beach west of Qu’s Marsh (Tuhanda Shores) and ride through the shallows to the larger island.',
      reward: '8 Potion, 4 Phoenix Down, 3 Ether, Magician Robe',
      requires: [
        'd1.daines-horse-basin.chocograph-birds-eye-lagoon',
        'd1.daines-horse-basin.chocograph-healing-shore-treasure',
      ],
      caveats: ['Only the treasure needs Reef. The Chocograph itself can be dug up any time in Chocobo’s Forest.'],
      sources: CHOCO,
    },
    {
      slug: 'chocograph-small-beach-treasure',
      name: 'Small Beach treasure',
      category: 'chocograph',
      chocograph: { number: 11, role: 'treasure' },
      spot: 'Lindblum territory — Lanshake Island',
      description: 'Needs Reef. The small island with a beach in the bay east of Lindblum. Reach it from the shore below Lindblum Plateau.',
      reward: '4 Remedy, 2 Elixir, 8 Rising Sun, Oak Staff',
      requires: [
        'd1.daines-horse-basin.chocograph-small-beach',
        'd1.daines-horse-basin.chocograph-healing-shore-treasure',
      ],
      caveats: ['Only the treasure needs Reef. The Chocograph itself can be dug up any time in Chocobo’s Forest.'],
      sources: CHOCO,
    },
    {
      slug: 'chocograph-piece-2',
      name: 'Dig up Chocograph Piece 2 (needs Reef)',
      category: 'chocograph',
      chocograph: { number: 'piece', role: 'dig' },
      spot: "Back in Chocobo's Forest — Hot & Cold",
      description:
        'Once Choco has Reef from the Healing Shore treasure, a second Chocograph Piece can turn up in Chocobo’s Forest. Keep playing Hot & Cold until Mene says there is nothing left to find.',
      requires: ['d1.lindblum-kingdom.chocograph-piece-1', 'd1.daines-horse-basin.chocograph-healing-shore-treasure'],
      caveats: [
        'The Final Fantasy Wiki lists Piece 2 as available after Reef, and GameFAQs (bover_87) says the first two pieces are found in the Forest. GameFAQs board players report two pieces from the Forest on Disc 1.',
        'Fishy071’s and Red Scarlet’s guides show only one piece from the Forest on Disc 1, but their route digs everything before getting Reef. They then find the next piece in Chocobo’s Lagoon, which pieces can also come from.',
      ],
      sources: ['ff-wiki', 'gamefaqs-bover'],
    },
    {
      slug: 'blu-night',
      name: 'Blue Magic: Night (eat Nymph)',
      category: 'blue-magic',
      spot: 'Daines-horse Basin',
      description: 'Puts everyone to sleep, friend and foe alike. Mainly for completion.',
      requires: ['d1.lindblum-kingdom.recruit-quina'],
      spoilerLevel: 1,
    },
  ],
);
