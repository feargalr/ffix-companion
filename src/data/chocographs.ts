import type { DiscNumber } from '../types/game';

/**
 * Chocograph log. Each Chocograph has two independent milestones: digging it
 * up in a Hot & Cold area, and finding its treasure on the world map. Both
 * IDs are permanent progress keys.
 *
 * `treasureId` points at a checklist entry when the treasure is reachable
 * within the discs already in the app. For treasures that only become
 * reachable on a later disc, the ID is *reserved*: the Chocograph log can
 * already record it, and the future disc's data must define an entry with
 * exactly this ID so the tick carries over.
 */
export interface ChocographInfo {
  number: number | 'piece' | 'set';
  name: string;
  /** Hot & Cold dig entry. Absent for the Mist Ocean row, which is assembled from pieces. */
  digId?: string;
  /** Treasure entry or reserved ID. Absent for pieces, whose reward is the assembled set. */
  treasureId?: string;
  /** What digging it up needs, when more than Choco and a game of Hot & Cold. */
  digNeeds?: 'Reef';
  /** Earliest disc on which the treasure can realistically be reached. */
  treasureFromDisc: DiscNumber;
  /** Choco ability needed to reach the treasure ('Field' = none). */
  treasureAbility: 'Field' | 'Reef' | 'Mountain' | 'Sea' | 'Sky';
  treasureLocation: string;
  /** Chocobo tracks to start from, when they differ from the treasure spot. */
  treasureTracks?: string;
  /** What else is needed beyond the ability (story, vehicle). */
  treasureNote?: string;
  reward: string;
}

export const CHOCOGRAPHS: ChocographInfo[] = [
  {
    number: 1,
    name: 'Streamside',
    digId: 'd1.lindblum-kingdom.chocograph-1',
    treasureId: 'd1.lindblum-kingdom.chocograph-1-treasure',
    treasureFromDisc: 1,
    treasureAbility: 'Field',
    treasureLocation: 'King Ed Plains, where the stream by Chocobo’s Forest meets the sea',
    reward: '2 Elixir, 3 Hi-Potion, 4 Ether, 2 Germinas Boots',
  },
  {
    number: 2,
    name: 'Between Mountains',
    digId: 'd1.lindblum-kingdom.chocograph-2',
    treasureId: 'd1.lindblum-kingdom.chocograph-2-treasure',
    treasureFromDisc: 1,
    treasureAbility: 'Field',
    treasureLocation: 'Eunorus Plains coast, north-west of Lindblum',
    reward: '5 Potion, 5 Hi-Potion, 2 Tent, 2 Cotton Robe',
  },
  {
    number: 3,
    name: 'Uncultivated Land',
    digId: 'd1.lindblum-kingdom.chocograph-uncultivated-land',
    treasureId: 'd3.chocographs-disc3.uncultivated-land-treasure',
    treasureFromDisc: 3,
    treasureAbility: 'Field',
    treasureLocation: 'Marshy patch on the east bank of the river north of Treno, just east of the Evil Forest (Zamo Basin)',
    treasureTracks:
      'Tracks in Zamo Basin beside the marsh, reachable only by airship; with the Mountain ability, tracks on King Ed Plains or Edgecry Coast work too',
    treasureNote: 'Needs an airship (Disc 3) or the Mountain ability. No special ability is needed to dig.',
    reward: '10 Antidote, Jade Armlet, 3 Wing Edge, Cargo Ship Card',
  },
  {
    number: 4,
    name: 'Healing Shore',
    digId: 'd1.daines-horse-basin.chocograph-healing-shore',
    treasureId: 'd1.daines-horse-basin.chocograph-healing-shore-treasure',
    treasureFromDisc: 1,
    treasureAbility: 'Field',
    treasureLocation: 'Beach west of Burmecia and Cleyra',
    reward: 'Reef ability (Choco can cross shallow water)',
  },
  {
    number: 5,
    name: 'Abandoned Beach',
    digId: 'd1.lindblum-kingdom.chocograph-abandoned-beach',
    treasureId: 'd2.chocographs-disc2.abandoned-beach-treasure',
    treasureFromDisc: 2,
    treasureAbility: 'Field',
    treasureLocation: 'Gegalrich Shores, Outer Continent',
    treasureNote: 'Reachable once the story takes you to the Outer Continent.',
    reward: '9 Phoenix Pinion, 5 Phoenix Down, 12 Peridot, Diamond Gloves',
  },
  {
    number: 6,
    name: 'Cold Field',
    digId: 'd1.lindblum-kingdom.chocograph-cold-field',
    treasureId: 'd3.chocographs-disc3.cold-field-treasure',
    treasureFromDisc: 3,
    treasureAbility: 'Field',
    treasureLocation: 'Quelmiera Shores, Lost Continent (near Esto Gaza)',
    treasureNote: 'Needs a ship or airship to reach the Lost Continent.',
    reward: '5 Echo Screen, 7 Hi-Potion, 3 Tent, Theater Ship Card',
  },
  {
    number: 8,
    name: 'Faraway Lagoon',
    digId: 'd1.lindblum-kingdom.chocograph-faraway-lagoon',
    treasureId: 'd3.chocographs-disc3.faraway-lagoon-treasure',
    treasureFromDisc: 3,
    treasureAbility: 'Reef',
    treasureLocation: 'Reef off the north-west Forgotten Continent',
    treasureNote: 'Needs Reef plus a way to the Forgotten Continent.',
    reward: '37 Potion, 6 Magic Tag, Shield Armor, Gaia Gear',
  },
  {
    number: 10,
    name: "Bird's-Eye Lagoon",
    digId: 'd1.daines-horse-basin.chocograph-birds-eye-lagoon',
    treasureId: 'd1.daines-horse-basin.chocograph-birds-eye-lagoon-treasure',
    treasureFromDisc: 1,
    treasureAbility: 'Reef',
    treasureLocation: "Island west of Qu's Marsh (Mist Continent)",
    reward: '8 Potion, 4 Phoenix Down, 3 Ether, Magician Robe',
  },
  {
    number: 11,
    name: 'Small Beach',
    digId: 'd1.daines-horse-basin.chocograph-small-beach',
    treasureId: 'd1.daines-horse-basin.chocograph-small-beach-treasure',
    treasureFromDisc: 1,
    treasureAbility: 'Reef',
    treasureLocation: 'Lanshake Island, in the bay east of Lindblum',
    reward: '4 Remedy, 2 Elixir, 8 Rising Sun, Oak Staff',
  },
  {
    number: 'piece',
    name: 'Chocograph Piece 1',
    digId: 'd1.lindblum-kingdom.chocograph-piece-1',
    treasureFromDisc: 3,
    treasureAbility: 'Sea',
    treasureLocation: 'Assembled with the other five into the Mist Ocean Chocograph',
    reward: 'One of six pieces of the Mist Ocean Chocograph',
  },
  {
    number: 'piece',
    name: 'Chocograph Piece 2',
    digId: 'd1.daines-horse-basin.chocograph-piece-2',
    digNeeds: 'Reef',
    treasureFromDisc: 3,
    treasureAbility: 'Sea',
    treasureLocation: 'Assembled with the other five into the Mist Ocean Chocograph',
    reward: 'One of six pieces of the Mist Ocean Chocograph',
  },
  {
    number: 'set',
    name: 'Mist Ocean (all six pieces)',
    // Reserved ID kept from the first audit, when it hung off the single piece row.
    treasureId: 'd3.chocographs-disc3.mist-ocean-treasure',
    treasureFromDisc: 3,
    treasureAbility: 'Sea',
    treasureLocation: 'Small islands off the north-east Mist Continent',
    treasureNote: 'The last pieces need the Mountain and Sea abilities and a late-game airship.',
    reward: 'A further Choco upgrade',
  },
];
