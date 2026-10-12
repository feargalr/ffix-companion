import type { SourceId } from '../../types/game';
import { defineArea } from '../define';
import { PICKUP, STEAL, STORY } from './common';

const SRC: SourceId[] = [...PICKUP, 'jegged'];

export default defineArea(
  {
    id: 'fossil-roo',
    disc: 2,
    order: 12,
    location: 'Fossil Roo',
    visit: 'The Tunnel',
    chapter: 'To the Outer Continent',
    summary:
      'A maze of Gargant routes under the sea, switched by water pumps. It has five treasures, Stiltzkin, a Moogle hidden in a wall, and a mining spot with a rare ring.',
    party: 'Zidane, Vivi, Garnet, Quina',
    partyIds: ['zidane', 'vivi', 'garnet', 'quina'],
    spoilerLevel: 1,
    departure: {
      trigger: 'Riding the final Gargant to the exit',
      consequence:
        'The inner tunnels can’t be re-entered. Their treasures, the mining spot and Stiltzkin’s 555-Gil deal are gone for good (GameFAQs, Jegged, PSNProfiles).',
    },
    tips: [
      'The armoured monster that chases you at the start can’t really be beaten. Outrun it past the swinging axes.',
      'Water switches decide where the Gargants go. Switch No. 2 opens the Fairy Earrings and Ether, No. 4 the Lamia’s Tiara, and No. 3 the way out.',
      'New Blue Magic: Feather Circle teaches LV4 Holy, and Griffins are a second chance at White Wind.',
      'Give Zidane Man Eater before the early boss.',
    ],
  },
  {
    missability: 'permanent',
    missableKind: 'pickup',
    priority: 'optional',
    lastOpportunity: 'Before riding the final Gargant out',
    sources: SRC,
  },
  [
    { slug: 'elixir', name: 'Elixir', category: 'hidden-item', spot: 'Entrance — the dark gate', description: 'After the boss, run back to the gate you passed at the start and search it.' },
    { slug: 'steal-lani-ether', name: 'Ether (steal)', category: 'steal', spot: 'Boss: Lani', description: 'Common steal.', missableKind: 'steal', lastOpportunity: 'Before Lani is defeated', sources: STEAL },
    { slug: 'steal-lani-gladius', name: 'Gladius (steal)', category: 'steal', spot: 'Boss: Lani', description: 'Uncommon steal and a good weapon for Zidane.', missableKind: 'steal', lastOpportunity: 'Before Lani is defeated', sources: STEAL },
    {
      slug: 'steal-lani-coral-sword',
      name: 'Coral Sword (steal)',
      category: 'steal',
      spot: 'Boss: Lani',
      description: 'Rare steal. She targets Dagger heavily; Magic Hammer to drain her MP makes the fight much safer.',
      missableKind: 'steal',
      priority: 'important',
      lastOpportunity: 'Before Lani is defeated',
      sources: STEAL,
    },
    {
      slug: 'stiltzkin-555',
      name: "Stiltzkin's deal (555 Gil)",
      category: 'equipment',
      spot: 'Near Reaches — by the Moogle',
      description: 'Stiltzkin is just south of the first miner. Buy his bundle.',
      reward: 'Ether, Remedy, Phoenix Pinion',
      missability: 'permanent',
      missableKind: 'opportunity',
      rewardUniqueness: 'replaceable',
      priority: 'important',
      lastOpportunity: 'Before riding the final Gargant out',
      caveats: ['The third of eight deals needed for the Ribbon.'],
      sources: ['jegged', 'jegged-missables', 'gamefaqs-bover'],
    },
    { slug: 'fairy-earrings', name: 'Fairy Earrings', category: 'treasure', spot: 'Near Reaches', description: 'Take the Gargant path near the Moogle.' },
    { slug: 'ether', name: 'Ether', category: 'treasure', spot: 'Near Reaches — upper path', description: 'After flipping switch No. 1 and riding back, take the stairs and follow the upper path.' },
    { slug: 'lamias-tiara', name: "Lamia's Tiara", category: 'treasure', spot: 'Central Caverns', description: 'Flip switch No. 4, ride the Gargant in the room to its right, and run right to the dead end.' },
    {
      slug: 'kuppo-letter',
      name: "Free Kuppo and take his letter to Kupo",
      category: 'mognet',
      spot: 'Far Reaches — the miner’s wall',
      description: 'Give the miner a Potion so he lets you dig, then dig at the odd-looking wall on the upper level. A Moogle is trapped behind it. He asks you to carry a letter home.',
      missableKind: 'opportunity',
      priority: 'important',
      sources: STORY,
    },
    {
      slug: 'madains-ring',
      name: "Madain's Ring (mining)",
      category: 'minigame',
      spot: 'Far Reaches — mining spot',
      description: 'Dig at the central column. You usually get Potions, Ore or nothing; a Madain’s Ring is a very rare find. Leave the screen and return to reset the spots.',
      reward: "Madain's Ring",
      missableKind: 'opportunity',
      rewardUniqueness: 'replaceable',
      caveats: ['Madain’s Rings can also be synthesised in the Black Mage Village later, so this is optional.'],
      sources: ['gamefaqs-bover', 'psnprofiles-treasure', 'steam-guide'],
    },
    { slug: 'survival-vest', name: 'Survival Vest', category: 'hidden-item', spot: 'Far Reaches — south-east storage', description: 'Leave the mining area to the south-east and examine the wood pile.' },
  ],
);
