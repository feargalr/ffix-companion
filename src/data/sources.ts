import type { Source, SourceId } from '../types/game';

export const SOURCES: Record<SourceId, Source> = {
  jegged: {
    id: 'jegged',
    title: 'Final Fantasy IX Walkthrough',
    author: 'Jegged.com',
    url: 'https://jegged.com/Games/Final-Fantasy-IX/',
    note: 'Area-by-area walkthrough used to locate treasure, ATEs and boss steals.',
  },
  'gamefaqs-bover': {
    id: 'gamefaqs-bover',
    title: 'Final Fantasy IX Guide & Walkthrough (incl. Missable Item Walkthrough)',
    author: 'bover_87 on GameFAQs',
    url: 'https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/71891/missable-item-walkthrough',
    note: 'Used to check missable deadlines, ATE prerequisites and the Mognet letter chain.',
  },
  'steam-guide': {
    id: 'steam-guide',
    title: 'FINAL FANTASY IX 100% Achievement Guide',
    author: 'lylat & ponkberry on Steam Community',
    url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=665159772',
    note: 'Third cross-check for pickup lists and ATE names. Achievement goals are not used as Switch objectives.',
  },
};
