import type { Source, SourceId } from '../types/game';

export const SOURCES: Record<SourceId, Source> = {
  jegged: {
    id: 'jegged',
    title: 'Final Fantasy IX Walkthrough',
    author: 'Jegged.com',
    url: 'https://jegged.com/Games/Final-Fantasy-IX/',
    note: 'Area-by-area walkthrough used to locate treasure, ATEs and boss steals.',
  },
  'jegged-missables': {
    id: 'jegged-missables',
    title: 'Missable Items and Events',
    author: 'Jegged.com',
    url: 'https://jegged.com/Games/Final-Fantasy-IX/Tips-and-Tricks/Missable-Items-and-Events.html',
    note: 'One-time areas, Stiltzkin stops and other missables.',
  },
  'gamefaqs-bover': {
    id: 'gamefaqs-bover',
    title: 'Final Fantasy IX Guide & Walkthrough (incl. Missable Item Walkthrough)',
    author: 'bover_87 on GameFAQs',
    url: 'https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/71891/missable-item-walkthrough',
    note: 'Used to check missable deadlines, ATE prerequisites, Mognet, Kupo Nuts, Stellazzio and Chocographs.',
  },
  'gamefaqs-vinheim': {
    id: 'gamefaqs-vinheim',
    title: 'Final Fantasy IX Guide and Walkthrough',
    author: 'vinheim on GameFAQs',
    url: 'https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/67953',
    note: 'Fourth independent walkthrough. Its per-area item lists were compared with every Disc 1 area.',
  },
  'gamefaqs-chocobo-fishy': {
    id: 'gamefaqs-chocobo-fishy',
    title: 'Chocobo-Related Sidequests Guide',
    author: 'Fishy071 on GameFAQs',
    url: 'https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/42402',
    note: 'Chocograph dig sites, treasure locations, abilities and rewards, by disc.',
  },
  'gamefaqs-chocograph-redscarlet': {
    id: 'gamefaqs-chocograph-redscarlet',
    title: 'Chocograph Locations in Chronological Order',
    author: 'Red Scarlet on GameFAQs',
    url: 'https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/10330',
    note: 'Second Chocograph source: dig order and treasure contents.',
  },
  'steam-guide': {
    id: 'steam-guide',
    title: 'FINAL FANTASY IX 100% Achievement Guide',
    author: 'lylat & ponkberry on Steam Community',
    url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=665159772',
    note: 'Cross-check for pickup lists and ATE names. Achievement goals are not used as Switch objectives.',
  },
  'steam-ate-guide': {
    id: 'steam-ate-guide',
    title: 'Active Time Events (ATEs)',
    author: 'karinms on Steam Community',
    url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=665189459',
    note: 'Dedicated ATE list with trigger conditions; bold entries are forced scenes.',
  },
  'psnprofiles-treasure': {
    id: 'psnprofiles-treasure',
    title: 'Rank S Treasure Hunter Guide',
    author: 'ARB1992 on PSNProfiles',
    url: 'https://psnprofiles.com/guide/8130-final-fantasy-ix-rank-s-treasure-hunter-guide',
    note: 'Lists every pickup by the discs on which it can be collected. Used for revisit windows.',
  },
  'ff-wiki': {
    id: 'ff-wiki',
    title: 'Chocograph',
    author: 'Final Fantasy Wiki (Fandom)',
    url: 'https://finalfantasy.fandom.com/wiki/Chocograph',
    note: 'Chocograph list and Chocograph Piece requirements.',
  },
};

/**
 * Where in each source an area is covered. Used to build the machine-readable
 * evidence record (npm run report). Sections are the pages actually read
 * during the October 2026 audit.
 */
export const AREA_SECTIONS: Record<string, Partial<Record<SourceId, string>>> = {
  'prima-vista-heist': {
    jegged: 'https://jegged.com/Games/Final-Fantasy-IX/Walkthrough/Disc-1/01-MS-Prima-Vista.html',
    'gamefaqs-bover': 'https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/71891/alexandria',
    'gamefaqs-vinheim': 'https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/67953 (Area 01: Prima Vista)',
    'steam-guide': 'https://steamcommunity.com/sharedfiles/filedetails/?id=665159772 (Alexandria)',
  },
  'alexandria-vivi': {
    'psnprofiles-treasure': 'https://psnprofiles.com/guide/8130-final-fantasy-ix-rank-s-treasure-hunter-guide (Alexandria Town Area, Disc 1 Only / Disc 3)',
    jegged: 'https://jegged.com/Games/Final-Fantasy-IX/Walkthrough/Disc-1/02-Alexandria.html',
    'gamefaqs-bover': 'https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/71891/alexandria',
    'gamefaqs-vinheim': 'https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/67953 (Area 02: Alexandria; Area 31 for the later revisit)',
    'steam-guide': 'https://steamcommunity.com/sharedfiles/filedetails/?id=665159772 (Alexandria)',
  },
  'alexandria-castle-play': {
    jegged: 'https://jegged.com/Games/Final-Fantasy-IX/Walkthrough/Disc-1/03-Alexandria-Castle.html',
    'jegged-missables': 'https://jegged.com/Games/Final-Fantasy-IX/Tips-and-Tricks/Missable-Items-and-Events.html (Sword Fight Performance)',
    'gamefaqs-bover': 'https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/71891/storyline-mini-games',
    'gamefaqs-vinheim': 'https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/67953 (Area 03: Alexandria Castle)',
    'steam-guide': 'https://steamcommunity.com/sharedfiles/filedetails/?id=665159772 (Alexandria Castle)',
  },
  'evil-forest': {
    jegged: 'https://jegged.com/Games/Final-Fantasy-IX/Walkthrough/Disc-1/04-The-Evil-Forest.html',
    'gamefaqs-bover': 'https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/71891/evil-forest',
    'gamefaqs-vinheim': 'https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/67953 (Area 04: Evil Forest)',
    'steam-guide': 'https://steamcommunity.com/sharedfiles/filedetails/?id=665159772 (Prima Vista - Evil Forest)',
    'steam-ate-guide': 'https://steamcommunity.com/sharedfiles/filedetails/?id=665189459 (Evil Forest 6)',
  },
  'gunitas-basin': {
    jegged: 'https://jegged.com/Games/Final-Fantasy-IX/Walkthrough/Disc-1/04-The-Evil-Forest.html (Gunitas Basin)',
    'gamefaqs-bover': 'https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/71891/evil-forest (Gunitas Basin)',
    'gamefaqs-vinheim': 'https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/67953 (Area 04)',
    'steam-ate-guide': 'https://steamcommunity.com/sharedfiles/filedetails/?id=665189459 (Teach Me, Mogster! Lesson 1)',
  },
  'ice-cavern': {
    'psnprofiles-treasure': 'https://psnprofiles.com/guide/8130-final-fantasy-ix-rank-s-treasure-hunter-guide (Ice Cavern (Disc 1 and 2 Only))',
    jegged: 'https://jegged.com/Games/Final-Fantasy-IX/Walkthrough/Disc-1/05-Ice-Cavern.html',
    'gamefaqs-bover': 'https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/71891/ice-cavern',
    'gamefaqs-vinheim': 'https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/67953 (Area 05: Ice Cavern)',
    'steam-guide': 'https://steamcommunity.com/sharedfiles/filedetails/?id=665159772 (Ice Cavern)',
  },
  'nolrich-heights': {
    jegged: 'https://jegged.com/Games/Final-Fantasy-IX/Walkthrough/Disc-1/05-Ice-Cavern.html (South Gate)',
    'gamefaqs-bover': 'https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/71891/ice-cavern (Nolrich Heights)',
    'gamefaqs-vinheim': 'https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/67953 (Friendly Monster Mu note)',
  },
  dali: {
    'psnprofiles-treasure': 'https://psnprofiles.com/guide/8130-final-fantasy-ix-rank-s-treasure-hunter-guide (The Village of Dali; Dali Underground (Disc 1 Only); Observatory Mountain)',
    jegged: 'https://jegged.com/Games/Final-Fantasy-IX/Walkthrough/Disc-1/06-The-Village-of-Dali.html',
    'gamefaqs-bover': 'https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/71891/village-of-dali',
    'gamefaqs-vinheim': 'https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/67953 (Area 06: Village of Dali)',
    'steam-guide': 'https://steamcommunity.com/sharedfiles/filedetails/?id=665159772 (Village of Dali)',
    'steam-ate-guide': 'https://steamcommunity.com/sharedfiles/filedetails/?id=665189459 (Dali 6)',
  },
  'cargo-ship': {
    jegged: 'https://jegged.com/Games/Final-Fantasy-IX/Walkthrough/Disc-1/07-Cargo-Ship.html',
    'gamefaqs-bover': 'https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/71891/cargo-ship',
    'gamefaqs-vinheim': 'https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/67953 (Area 07: Cargo Ship)',
  },
  lindblum: {
    'psnprofiles-treasure': 'https://psnprofiles.com/guide/8130-final-fantasy-ix-rank-s-treasure-hunter-guide (Lindblum (Disc 1 Only))',
    jegged: 'https://jegged.com/Games/Final-Fantasy-IX/Walkthrough/Disc-1/08-Lindblum.html',
    'gamefaqs-bover': 'https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/71891/lindblum',
    'gamefaqs-vinheim': 'https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/67953 (Area 08: Lindblum)',
    'steam-guide': 'https://steamcommunity.com/sharedfiles/filedetails/?id=665159772 (Lindblum)',
    'steam-ate-guide': 'https://steamcommunity.com/sharedfiles/filedetails/?id=665189459 (Lindblum 5)',
  },
  'festival-of-the-hunt': {
    'psnprofiles-treasure': 'https://psnprofiles.com/guide/8130-final-fantasy-ix-rank-s-treasure-hunter-guide (Lindblum (Disc 1 Only))',
    jegged: 'https://jegged.com/Games/Final-Fantasy-IX/Walkthrough/Disc-1/08-Lindblum.html (Festival of the Hunt)',
    'jegged-missables': 'https://jegged.com/Games/Final-Fantasy-IX/Tips-and-Tricks/Missable-Items-and-Events.html (Festival of the Hunt)',
    'gamefaqs-bover': 'https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/71891/storyline-mini-games (Festival of the Hunt)',
    'gamefaqs-vinheim': 'https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/67953 (Area 08: Festival of the Hunt)',
    'steam-guide': 'https://steamcommunity.com/sharedfiles/filedetails/?id=665159772 (Lindblum Castle / Festival)',
  },
  'lindblum-kingdom': {
    'ff-wiki': 'https://finalfantasy.fandom.com/wiki/Chocograph (Chocograph Pieces)',
    jegged: 'https://jegged.com/Games/Final-Fantasy-IX/Walkthrough/Disc-1/09-Gizamalukes-Grotto.html',
    'gamefaqs-bover': 'https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/71891/exploring-lindblum-kingdom',
    'gamefaqs-vinheim': "https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/67953 (Areas 09-10: Qu's Marsh, Chocobo's Forest)",
    'gamefaqs-chocobo-fishy': 'https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/42402 (Chocograph Treasure Hunt: Disc 1)',
    'gamefaqs-chocograph-redscarlet': 'https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/10330',
    'steam-guide': "https://steamcommunity.com/sharedfiles/filedetails/?id=665159772 (Gizamaluke's Grotto Area)",
  },
  'gizamalukes-grotto': {
    jegged: 'https://jegged.com/Games/Final-Fantasy-IX/Walkthrough/Disc-1/09-Gizamalukes-Grotto.html',
    'gamefaqs-bover': 'https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/71891/journey-to-burmecia',
    'gamefaqs-vinheim': "https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/67953 (Area 11: Gizamaluke's Grotto)",
    'steam-guide': "https://steamcommunity.com/sharedfiles/filedetails/?id=665159772 (Gizamaluke's Grotto Area)",
  },
  'south-gate': {
    jegged: 'https://jegged.com/Games/Final-Fantasy-IX/Walkthrough/Disc-1/09-Gizamalukes-Grotto.html (South Gate)',
    'gamefaqs-bover': 'https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/71891/journey-to-burmecia (Bohden Gate)',
    'gamefaqs-vinheim': 'https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/67953 (Area 12: South Gate)',
    'steam-guide': 'https://steamcommunity.com/sharedfiles/filedetails/?id=665159772 (Bohden Gate)',
  },
  'daines-horse-basin': {
    'ff-wiki': 'https://finalfantasy.fandom.com/wiki/Chocograph (Chocograph Pieces)',
    jegged: 'https://jegged.com/Games/Final-Fantasy-IX/Walkthrough/Disc-1/09-Gizamalukes-Grotto.html (Daines-horse Basin)',
    'gamefaqs-bover': 'https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/71891/journey-to-burmecia (Daines-horse Basin)',
    'gamefaqs-vinheim': 'https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/67953 (Area 12: Burmecia Arch)',
    'gamefaqs-chocobo-fishy': 'https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/42402 (Disc 1 / Disc 1 or 2)',
    'gamefaqs-chocograph-redscarlet': 'https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/10330 (Disc 1)',
    'steam-guide': 'https://steamcommunity.com/sharedfiles/filedetails/?id=665159772 (Burmecia Arch)',
  },
  burmecia: {
    'psnprofiles-treasure': 'https://psnprofiles.com/guide/8130-final-fantasy-ix-rank-s-treasure-hunter-guide (Burmecia (Discs 1, 2, 3, and 4))',
    jegged: 'https://jegged.com/Games/Final-Fantasy-IX/Walkthrough/Disc-1/10-Burmecia.html',
    'jegged-missables': 'https://jegged.com/Games/Final-Fantasy-IX/Tips-and-Tricks/Missable-Items-and-Events.html (One-Time Areas; Stiltzkin)',
    'gamefaqs-bover': 'https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/71891/burmecia (+ stellazzio, kupo-nuts, stiltzkin-shopping, mognet)',
    'gamefaqs-vinheim': 'https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/67953 (Area 13: Burmecia)',
    'steam-guide': 'https://steamcommunity.com/sharedfiles/filedetails/?id=665159772 (Burmecia)',
  },
};
