import { defineArea, ref } from '../define';
import { ATE, PICKUP, STORY } from './common';

const A = 'lindblum-occupied';

export default defineArea(
  {
    id: A,
    disc: 2,
    order: 10,
    location: 'Lindblum',
    visit: 'Under Occupation',
    chapter: 'Alexandria',
    summary:
      'Lindblum after the attack. There is new stock in every shop, a handful of pickups, Moogle letters, and one ATE you must choose to see before leaving.',
    party: 'Zidane, Vivi, Garnet',
    partyIds: ['zidane', 'vivi', 'garnet'],
    spoilerLevel: 2,
    departure: {
      trigger: 'Agreeing to set out with the man by the fountain in the shopping plaza',
      consequence:
        'You can’t come back into Lindblum for a long time. PSNProfiles lists these pickups as Disc 2 only, and GameFAQs lists the Chain Mail purchases as last-chance here.',
    },
    ateGuide: [
      { kind: 'select', text: 'After meeting Cid, explore the Business District: “The Third Jewel”. Watch it before you agree to set out.' },
      { kind: 'auto', text: 'When you agree to leave: “Brahne’s Fleet Arrives”, then “Gwok-gwok! How Infuriating!” play by themselves.' },
    ],
    tips: [
      'The Synthesis Shop’s Exploda (for Zidane) and Barette (teaches Dagger Cura) are the new items worth making.',
      'If you’re short on Gil for Chain Mail, sell Ethers or fight outside Hunter’s Gate.',
      'A soldier in the square before the shops asks you to pass a message to Justin by the air-cab station. It’s just dialogue.',
    ],
  },
  {
    missability: 'permanent',
    missableKind: 'pickup',
    priority: 'optional',
    lastOpportunity: 'Before agreeing to set out (Disc 2 only)',
    sources: PICKUP,
  },
  [
    { slug: 'gil-3000', name: '3,000 Gil', category: 'key-item', spot: 'Shopping plaza (story)', description: 'Handed to you during the first scene in the plaza.', mandatory: true, missability: 'none' },
    {
      slug: 'ate-third-jewel',
      name: 'ATE: The Third Jewel',
      category: 'ate',
      ateTrigger: 'selectable',
      spot: 'Business District',
      description: 'Offered while you explore after meeting Cid.',
      missability: 'permanent',
      missableKind: 'event',
      priority: 'important',
      lastOpportunity: 'Before agreeing to set out',
      sources: ATE,
    },
    { slug: 'ate-brahnes-fleet', name: 'ATE: Brahne’s Fleet Arrives', category: 'ate', ateTrigger: 'automatic', spot: 'Shopping plaza', description: 'Plays when you agree to leave.', mandatory: true, missability: 'none', sources: ATE },
    { slug: 'ate-gwok-gwok', name: 'ATE: Gwok-gwok! How Infuriating!', category: 'ate', ateTrigger: 'automatic', spot: 'Base Level', description: 'Plays automatically on the way out.', mandatory: true, missability: 'none', sources: ATE },
    { slug: 'gon-phoenix-pinion', name: 'Phoenix Pinion', category: 'treasure', spot: 'Business District — Card Freak Gon’s house', description: 'Chest in the house on the north side of the square.' },
    { slug: 'gon-ether', name: 'Ether', category: 'treasure', spot: 'Business District — Card Freak Gon’s house', description: 'Second chest in the same house.' },
    { slug: 'lindblum-card', name: 'Lindblum Card', category: 'card', spot: 'Business District — by the blocked church alley', description: 'Near the debris blocking the way to the church.' },
    {
      slug: 'moodon-letter',
      name: "Mognet: deliver Serino's letter to Moodon",
      category: 'mognet',
      spot: 'Inn — Moodon',
      description: 'Hand over the letter from the Red Rose, then take Moodon’s letter for Moonte. Read Ruby’s letter too.',
      requires: [ref(2, 'alexandria-castle-escape', 'serino-letter')],
      missableKind: 'opportunity',
      priority: 'important',
      sources: STORY,
    },
    { slug: 'ore', name: 'Ore', category: 'treasure', spot: 'Theater District — Michael’s studio', description: 'Chest in the house across from the air-cab station.' },
    { slug: 'hideout-gil-340', name: '340 Gil', category: 'treasure', spot: 'Tantalus hideout', description: 'One of three Gil chests.' },
    { slug: 'hideout-gil-993', name: '993 Gil', category: 'treasure', spot: 'Tantalus hideout', description: 'Second Gil chest.' },
    { slug: 'hideout-gil-262', name: '262 Gil', category: 'treasure', spot: 'Tantalus hideout', description: 'Third Gil chest.' },
    {
      slug: 'buy-chain-mail',
      name: 'Own at least 15 Chain Mail',
      category: 'equipment',
      spot: "Dragoo's Weapon Shop",
      description: 'Mostly for synthesis later. Power Belts count towards the total, up to 12 of them.',
      missability: 'permanent',
      missableKind: 'opportunity',
      priority: 'optional',
      lastOpportunity: 'Before going to Dragon’s Gate',
      verification: 'single-source',
      sources: ['gamefaqs-bover'],
    },
  ],
);
