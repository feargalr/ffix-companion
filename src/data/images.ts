import type { CharacterId } from '../types/game';

/**
 * Official FINAL FANTASY IX imagery used under Square Enix's published
 * FFIX copyright conditions (著作物利用許諾条件, revised 13 Jan 2021):
 * https://www.jp.square-enix.com/ff9/conditions.html
 *
 * Permitted material category (1): text, information, images and video
 * published on the official FFIX site. Conditions honoured here: no
 * commercial use, the copyright notice below is shown on every page that
 * displays these images, no excessive modification, no advertising, no
 * removal of notices, not combined with non-FFIX content, and removal on
 * request. Every file is listed in docs/DISC1_AUDIT.md (Images).
 */
export const SQUARE_ENIX_NOTICE = [
  '© 2000, 2019 SQUARE ENIX CO., LTD. All Rights Reserved.',
  'LOGO ILLUSTRATION:© 2000 YOSHITAKA AMANO',
];

export const CONDITIONS_URL = 'https://www.jp.square-enix.com/ff9/conditions.html';

export interface OfficialImage {
  /** Path under public/, resolved against BASE_URL at runtime. */
  file: string;
  width: number;
  height: number;
  sourceUrl: string;
  sourcePage: string;
  /** What was done to the original: kept minimal per the conditions. */
  modification: string;
}

const CHAR = (id: string, src: string, w: number, h: number): OfficialImage => ({
  file: `images/official/char-${id}.webp`,
  width: w,
  height: h,
  sourceUrl: `https://www.jp.square-enix.com/ff9/characters/images/${src}_cg.png`,
  sourcePage: 'https://www.jp.square-enix.com/ff9/characters/',
  modification: 'Transparent margins trimmed, scaled to 240 px tall, converted to WebP. No other changes.',
});

const SHOT = (id: string, src: string): OfficialImage => ({
  file: `images/official/loc-${id}.webp`,
  width: 266,
  height: 183,
  sourceUrl: `https://www.jp.square-enix.com/ff9/system/images/${src}.jpg`,
  sourcePage: 'https://www.jp.square-enix.com/ff9/system/',
  modification: 'Converted to WebP at the original size. No cropping or edits.',
});

export const CHARACTER_IMAGES: Record<CharacterId, OfficialImage> = {
  zidane: CHAR('zidane', 'zidane', 182, 240),
  vivi: CHAR('vivi', 'vivi', 202, 240),
  garnet: CHAR('garnet', 'garnet', 169, 240),
  steiner: CHAR('steiner', 'steiner', 209, 240),
  freya: CHAR('freya', 'freija', 218, 240),
  quina: CHAR('quina', 'quina', 276, 240),
};

export const CHARACTER_NAMES: Record<CharacterId, string> = {
  zidane: 'Zidane',
  vivi: 'Vivi',
  garnet: 'Garnet',
  steiner: 'Steiner',
  freya: 'Freya',
  quina: 'Quina',
};

export const LOCATION_IMAGES: Record<string, OfficialImage> = {
  'prima-vista-stage': SHOT('prima-vista-stage', 'other_thumb_01'),
  'sword-fight': SHOT('sword-fight', 'other_thumb_09'),
  'dali-field': SHOT('dali-field', 'ate_thumb_01'),
  'evil-forest-crash-site': SHOT('evil-forest-crash-site', 'ate_thumb_02'),
};

export const ALL_IMAGES: OfficialImage[] = [
  ...Object.values(CHARACTER_IMAGES),
  ...Object.values(LOCATION_IMAGES),
];
