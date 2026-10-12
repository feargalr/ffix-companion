import { defineArea } from '../define';

export default defineArea(
  {
    id: 'gunitas-basin',
    disc: 1,
    order: 5,
    location: 'Mist Continent — Gunitas Basin',
    visit: 'First Steps on the World Map',
    chapter: 'Into the Mist',
    summary:
      'Your first time on the world map. There is a short optional detour to Melda Arch (North Gate) for two chests before heading to the Ice Cavern.',
    party: 'Zidane, Steiner, Vivi, Garnet',
    partyIds: ['zidane', 'steiner', 'vivi', 'garnet'],
    tips: [
      "The Moogle's Flute lets you call Moguo on the world map to save or use a Tent.",
      "Equip Garnet before you set off. She joins with very little gear.",
      'Vivi’s MP is tight until Dali. Save Fire for groups.',
    ],
  },
  {
    missability: 'none',
    sources: ['jegged', 'gamefaqs-bover'],
  },
  [
    {
      slug: 'ate-mogster-lesson-1',
      name: 'ATE: Teach Me, Mogster! Lesson 1',
      category: 'ate',
      spot: 'Forest exit (story)',
      description:
        'Forced tutorial ATE with two Moogles in a swamp. Ask about anything you like, then choose "Nothing" to carry on.',
      mandatory: true,
      ateTrigger: 'automatic',
      sources: ['gamefaqs-bover', 'steam-guide', 'steam-ate-guide'],
    },
    {
      slug: 'melda-arch-eye-drops',
      name: 'Eye Drops',
      category: 'treasure',
      spot: 'Melda Arch (North Gate)',
      description: 'Chest on the right-hand side, beyond the fence by the gate.',
      locationDetails: 'Head west from the forest exit and look for the stone arch.',
    },
    {
      slug: 'melda-arch-potion',
      name: 'Potion',
      category: 'treasure',
      spot: 'Melda Arch (North Gate)',
      description: 'Second chest beside the first one, near the fence.',
      caveats: ['A voice behind the gate sells Potions. Examine the gate, listen, then call out.'],
    },
    {
      slug: 'ragtime-mouse',
      name: 'Ragtime Mouse quiz (optional)',
      category: 'sidequest',
      spot: 'World-map forests',
      description:
        'From now on, random encounters in world-map forests can spawn the Ragtime Mouse, who asks true/false questions. Correct answers pay Gil and items.',
      caveats: [
        'Sources say he can be found later in the game too, so there is no rush.',
        'Individual questions are not tracked here. Check this off when you have met him on Disc 1, if you like.',
      ],
      sources: ['gamefaqs-bover', 'gamefaqs-vinheim'],
    },
  ],
);
