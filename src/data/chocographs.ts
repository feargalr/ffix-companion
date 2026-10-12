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
  number: number | 'piece';
  name: string;
  digId: string;
  treasureId: string;
  /** Earliest disc on which the treasure can realistically be reached. */
  treasureFromDisc: DiscNumber;
  /** Choco ability needed to reach the treasure ('Field' = none). */
  treasureAbility: 'Field' | 'Reef' | 'Mountain' | 'Sea' | 'Sky';
  treasureLocation: string;
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
    treasureLocation: 'Zamo Basin, by a river north of Treno (GameFAQs: Gunitas Basin near the Evil Forest)',
    treasureNote: 'Its Chocobo tracks can only be reached with an airship or the Mountain ability.',
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
    name: 'Chocograph Piece',
    digId: 'd1.lindblum-kingdom.chocograph-piece-1',
    treasureId: 'd3.chocographs-disc3.mist-ocean-treasure',
    treasureFromDisc: 3,
    treasureAbility: 'Sea',
    treasureLocation: 'All six pieces form the Mist Ocean Chocograph',
    treasureNote: 'The remaining pieces only turn up later in the game.',
    reward: 'Completing the set leads to a further Choco upgrade',
  },
];
