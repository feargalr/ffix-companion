/**
 * Game-content schema. Content lives in src/data and is kept separate from
 * application logic. Entry IDs are persisted in localStorage, so once an ID
 * ships it must never change — rename the entry, not the ID.
 */

export type DiscNumber = 1 | 2 | 3 | 4;

export type Category =
  | 'treasure' // chest or visible pickup
  | 'hidden-item' // field-icon pickup with no chest
  | 'card' // Tetra Master card pickup or gift
  | 'key-item'
  | 'ate' // Active Time Event
  | 'steal' // steal from a boss or one-off enemy
  | 'equipment' // purchase / synthesis worth doing here
  | 'sidequest'
  | 'minigame'
  | 'optional-event'
  | 'mognet' // letter delivery / pickup
  | 'blue-magic' // Quina's Eat targets
  | 'chocograph';

/**
 * - permanent: the opportunity closes for good at a known story point.
 * - temporary: closes for a while but returns later in the game.
 * - none: remains available (or is not flagged as missable by any source).
 * - conditional: depends on a choice, prerequisite or mutually exclusive outcome.
 * - unconfirmed: sources don't say whether you can come back. Treated as a soft warning.
 */
export type Missability = 'permanent' | 'temporary' | 'none' | 'conditional' | 'unconfirmed';

/**
 * What exactly is lost if a permanent/conditional entry is missed. Lets the UI
 * distinguish a unique item from a common pickup whose chest simply disappears.
 */
export type MissableKind =
  | 'unique' // unique or strictly limited item (Moonstone, key items, Stiltzkin deals)
  | 'pickup' // this pickup is lost, but the item itself is common / obtainable elsewhere
  | 'steal' // a one-time steal opportunity from a boss
  | 'event' // an event or scene with no unique item
  | 'opportunity'; // sidequest step, letter, reward chance

/**
 * - verified: confirmed by two or more independent sources.
 * - single-source: stated by one authoritative source and not contradicted.
 * - conflicting: sources disagree on a material detail (see caveats).
 * - unverified: not yet checked — shown with a flag in the UI.
 */
export type Verification = 'verified' | 'single-source' | 'conflicting' | 'unverified';

export type SourceId =
  | 'jegged'
  | 'jegged-missables'
  | 'gamefaqs-bover'
  | 'gamefaqs-vinheim'
  | 'gamefaqs-chocobo-fishy'
  | 'gamefaqs-chocograph-redscarlet'
  | 'steam-guide'
  | 'steam-ate-guide'
  | 'psnprofiles-treasure'
  | 'ff-wiki';

/**
 * How loud a Before You Leave warning should be. Derived from missability and
 * missableKind when not set explicitly (see lib/priority.ts) — set it by hand
 * when the consequence matters more or less than the category suggests.
 */
export type WarningPriority = 'critical' | 'important' | 'optional';

/** Is the reward itself replaceable, separate from whether this chance is? */
export type RewardUniqueness = 'unique' | 'limited' | 'replaceable' | 'none' | 'unconfirmed';

/** ATEs: chosen from the ATE prompt, or played automatically. */
export type AteTrigger = 'selectable' | 'automatic' | 'automatic-conditional';

export interface EntryImage {
  /** Key into src/data/images.ts, which records source, licence and attribution. */
  imageId: string;
  alt: string;
}

export type CharacterId = 'zidane' | 'vivi' | 'garnet' | 'steiner' | 'freya' | 'quina';

export interface ChecklistEntry {
  /** Stable, unique, never-reused identifier: d{disc}.{area-slug}.{entry-slug} */
  id: string;
  name: string;
  category: Category;
  areaId: string;
  /** Sub-location within the area (e.g. "Main Street"). */
  spot?: string;
  /** One-line explanation shown when expanded. */
  description: string;
  /** Exact location / how to reach it. */
  locationDetails?: string;
  requirements?: string[];
  reward?: string;
  missability: Missability;
  missableKind?: MissableKind;
  /** Human-readable last chance, e.g. "Before boarding the cargo ship in Dali". */
  lastOpportunity?: string;
  /**
   * Area whose departure closes this entry, when that differs from the entry's
   * own area (e.g. Ice Cavern pickups close when you leave Dali). The entry is
   * then also listed in that area's "Before You Leave" warning.
   */
  closesWithArea?: string;
  /**
   * The deadline falls on a disc that isn't in the app yet (e.g. "buy before
   * Cleyra on Disc 2"). Shown under "Deadlines ahead" rather than in this
   * area's Before You Leave list.
   */
  closesOnLaterDisc?: boolean;
  /** Warning level in Before You Leave; derived when omitted. */
  priority?: WarningPriority;
  rewardUniqueness?: RewardUniqueness;
  /** ATEs only. */
  ateTrigger?: AteTrigger;
  /** Chocograph bookkeeping: which Chocograph and which half of it. */
  chocograph?: { number: number | 'piece'; role: 'dig' | 'treasure' };
  /**
   * The entry moved to a different area after its ID shipped. The ID keeps
   * its original area prefix so saved progress still matches.
   */
  legacyId?: boolean;
  /** Extra notes: alternate sources of the item, gotchas, platform notes. */
  caveats?: string[];
  /** Set when watching/doing this is forced by the story. */
  mandatory?: boolean;
  /** Entry IDs that must be completed first (ATE chains, etc.). */
  requires?: string[];
  /**
   * Entries sharing a group are mutually exclusive (only one is possible per
   * playthrough). Progress treats the group as a single unit.
   */
  exclusiveGroup?: string;
  /** Reward repeats (e.g. steals from common enemies). */
  repeatable?: boolean;
  /** 0 = safe, 1 = mild (names a future place/character), 2 = plot spoiler. */
  spoilerLevel?: 0 | 1 | 2;
  /** Text revealed only when spoilers are allowed. */
  spoilerText?: string;
  verification: Verification;
  sources: SourceId[];
  image?: EntryImage;
}

export interface AreaDeparture {
  /** The story action that closes the area's missables. */
  trigger: string;
  /** What becomes unavailable. */
  consequence: string;
}

export interface Area {
  id: string;
  disc: DiscNumber;
  /** Chronological position within the disc (1-based, unique per disc). */
  order: number;
  /** Place name (shared across visits). */
  location: string;
  /** Distinguishes visits — e.g. "Vivi's Arrival". */
  visit: string;
  /** Story chapter label shown on the Journey screen. */
  chapter: string;
  summary: string;
  /** Who you control here, if notable. */
  party?: string;
  /** Characters whose official portraits are shown next to the party line. */
  partyIds?: CharacterId[];
  /** Party members who may not have joined yet (optional recruits); shown dimmed. */
  partyOptionalIds?: CharacterId[];
  /** Spoiler-free recommended ATE viewing order for areas with several ATEs. */
  ateGuide?: { kind: 'select' | 'auto' | 'note'; text: string }[];
  /** Optional small location thumbnail. */
  image?: EntryImage;
  /** Optional areas can be skipped entirely. */
  optional?: boolean;
  departure?: AreaDeparture;
  /** Short practical tips that aren't checklist entries. */
  tips?: string[];
  spoilerLevel?: 0 | 1 | 2;
  entries: ChecklistEntry[];
}

export interface Disc {
  number: DiscNumber;
  title: string;
  areas: Area[];
  /** Whether content for this disc is present yet. */
  available: boolean;
}

export interface Source {
  id: SourceId;
  title: string;
  author: string;
  url: string;
  note: string;
}
