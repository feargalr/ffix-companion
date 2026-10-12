import type { Area, Category, ChecklistEntry, Missability, MissableKind, SourceId } from '../types/game';
import { SOURCES } from '../data/sources';

/**
 * Data integrity checks shared by `npm run validate` and the test suite.
 * Errors break the build; warnings are surfaced in the content report.
 */

export interface ValidationIssue {
  level: 'error' | 'warning';
  where: string;
  message: string;
}

const CATEGORIES: Category[] = [
  'treasure',
  'hidden-item',
  'card',
  'key-item',
  'ate',
  'steal',
  'equipment',
  'sidequest',
  'minigame',
  'optional-event',
  'mognet',
  'blue-magic',
  'chocograph',
];
const MISSABILITY: Missability[] = ['permanent', 'temporary', 'none', 'conditional', 'unconfirmed'];
const KINDS: MissableKind[] = ['unique', 'pickup', 'steal', 'event', 'opportunity'];
const SOURCE_IDS = Object.keys(SOURCES) as SourceId[];
const VERIFICATION = ['verified', 'single-source', 'conflicting', 'unverified'];
const PRIORITIES = ['critical', 'important', 'optional'];
const ID_RE = /^d[1-4]\.[a-z0-9-]+\.[a-z0-9-]+$/;
const AREA_ID_RE = /^[a-z0-9-]+$/;

export function validateData(areas: Area[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const err = (where: string, message: string) => issues.push({ level: 'error', where, message });
  const warn = (where: string, message: string) => issues.push({ level: 'warning', where, message });

  const areaIds = new Set<string>();
  const areaOrder = new Map<string, number>();
  const entryIds = new Map<string, ChecklistEntry>();

  // ---- Areas
  const byDisc = new Map<number, Area[]>();
  areas.forEach((a, i) => {
    const where = `area ${a.id || `#${i}`}`;
    if (!a.id || !AREA_ID_RE.test(a.id)) err(where, 'Area id must be kebab-case.');
    if (areaIds.has(a.id)) err(where, 'Duplicate area id.');
    areaIds.add(a.id);
    areaOrder.set(a.id, i);
    for (const f of ['location', 'visit', 'chapter', 'summary'] as const) {
      if (!a[f]?.trim()) err(where, `Missing ${f}.`);
    }
    if (!byDisc.has(a.disc)) byDisc.set(a.disc, []);
    byDisc.get(a.disc)!.push(a);
    if (a.entries.length === 0) warn(where, 'Area has no checklist entries.');
  });
  for (const [disc, list] of byDisc) {
    list.forEach((a, i) => {
      if (a.order !== i + 1) {
        err(`area ${a.id}`, `Disc ${disc} order should be ${i + 1} (areas must be listed chronologically with contiguous order), found ${a.order}.`);
      }
    });
  }

  // ---- Entries
  for (const a of areas) {
    for (const e of a.entries) {
      const where = `entry ${e.id}`;
      if (!ID_RE.test(e.id)) err(where, 'ID must look like d1.area-id.entry-slug.');
      if (entryIds.has(e.id)) err(where, 'Duplicate entry id.');
      entryIds.set(e.id, e);
      if (e.areaId !== a.id) err(where, `areaId "${e.areaId}" does not match containing area "${a.id}".`);
      if (e.legacyId) {
        if (!e.id.startsWith(`d${a.disc}.`)) err(where, 'Legacy ID must still start with its disc.');
      } else if (!e.id.startsWith(`d${a.disc}.${a.id}.`)) {
        err(where, 'ID prefix does not match its disc/area (set legacyId if the entry moved).');
      }
      if (!e.name?.trim()) err(where, 'Missing name.');
      if (!e.description?.trim()) err(where, 'Missing description.');
      if (!CATEGORIES.includes(e.category)) err(where, `Unknown category "${e.category}".`);
      if (!MISSABILITY.includes(e.missability)) err(where, `Unknown missability "${e.missability}".`);
      if (e.missableKind && !KINDS.includes(e.missableKind)) err(where, `Unknown missableKind "${e.missableKind}".`);
      if (!e.sources?.length) err(where, 'At least one source is required.');
      for (const s of e.sources ?? []) if (!SOURCE_IDS.includes(s)) err(where, `Unknown source "${s}".`);
      if (!VERIFICATION.includes(e.verification)) err(where, `Unknown verification "${e.verification}".`);
      if (e.priority && !PRIORITIES.includes(e.priority)) err(where, `Unknown priority "${e.priority}".`);
      if (e.verification === 'conflicting' && !e.caveats?.length) {
        err(where, 'Conflicting entries must explain the conflict in caveats.');
      }
      if (e.ateTrigger && e.category !== 'ate') err(where, 'ateTrigger is only for ATEs.');
      if (e.category === 'chocograph' && !e.chocograph) err(where, 'Chocograph entries need chocograph { number, role }.');

      if ((e.missability === 'permanent' || e.missability === 'conditional') && !e.mandatory) {
        if (!e.lastOpportunity) err(where, `${e.missability} entries need lastOpportunity.`);
        if (!e.missableKind) err(where, `${e.missability} entries need missableKind.`);
      }
      if (e.missability === 'none' && e.missableKind) {
        warn(where, 'missableKind set on a non-missable entry.');
      }
      if (e.mandatory && e.missability === 'permanent') {
        warn(where, 'Mandatory entries cannot really be missed; consider missability "none".');
      }
      if (e.spoilerText && !e.spoilerLevel) err(where, 'spoilerText requires spoilerLevel > 0.');
      if (e.closesOnLaterDisc && e.closesWithArea) err(where, 'Use either closesOnLaterDisc or closesWithArea, not both.');
      if (e.verification === 'unverified') warn(where, 'Marked unverified.');
    }
  }

  // ---- Cross references (need the full id set)
  const groups = new Map<string, ChecklistEntry[]>();
  for (const e of entryIds.values()) {
    const where = `entry ${e.id}`;
    for (const r of e.requires ?? []) {
      if (!entryIds.has(r)) err(where, `requires unknown entry "${r}".`);
      if (r === e.id) err(where, 'Entry requires itself.');
      const dep = entryIds.get(r);
      if (dep && (areaOrder.get(dep.areaId) ?? 0) > (areaOrder.get(e.areaId) ?? 0)) {
        err(where, `requires "${r}", which is in a later area.`);
      }
    }
    if (e.closesWithArea) {
      if (!areaIds.has(e.closesWithArea)) err(where, `closesWithArea "${e.closesWithArea}" does not exist.`);
      else if ((areaOrder.get(e.closesWithArea) ?? 0) < (areaOrder.get(e.areaId) ?? 0)) {
        err(where, 'closesWithArea points to an earlier area.');
      }
    }
    if (e.exclusiveGroup) {
      if (!groups.has(e.exclusiveGroup)) groups.set(e.exclusiveGroup, []);
      groups.get(e.exclusiveGroup)!.push(e);
    }
  }
  for (const [g, members] of groups) {
    if (members.length < 2) err(`group ${g}`, 'Exclusive group needs at least two members.');
    if (new Set(members.map((m) => m.areaId)).size > 1) warn(`group ${g}`, 'Exclusive group spans areas.');
  }

  // ---- Dependency cycles
  const state = new Map<string, 0 | 1 | 2>();
  const visit = (id: string, path: string[]): void => {
    const s = state.get(id);
    if (s === 2) return;
    if (s === 1) {
      err(`entry ${id}`, `Dependency cycle: ${[...path, id].join(' → ')}`);
      return;
    }
    state.set(id, 1);
    for (const r of entryIds.get(id)?.requires ?? []) if (entryIds.has(r)) visit(r, [...path, id]);
    state.set(id, 2);
  };
  for (const id of entryIds.keys()) visit(id, []);

  return issues;
}

export interface ContentSummary {
  areas: number;
  entries: number;
  byVerification: Record<string, number>;
  byMissability: Record<string, number>;
}

export function summarise(areas: Area[]): ContentSummary {
  const entries = areas.flatMap((a) => a.entries);
  const count = (key: (e: ChecklistEntry) => string) =>
    entries.reduce<Record<string, number>>((acc, e) => {
      acc[key(e)] = (acc[key(e)] ?? 0) + 1;
      return acc;
    }, {});
  return {
    areas: areas.length,
    entries: entries.length,
    byVerification: count((e) => e.verification),
    byMissability: count((e) => e.missability),
  };
}

/** Cross-checks for the Chocograph log (see src/data/chocographs.ts). */
export function validateChocographs(
  chocographs: { digId: string; treasureId: string; treasureFromDisc: number; name: string }[],
  entryIds: Set<string>,
  availableDiscs: number[],
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const seen = new Set<string>();
  for (const c of chocographs) {
    const where = `chocograph ${c.name}`;
    for (const id of [c.digId, c.treasureId]) {
      if (seen.has(id)) issues.push({ level: 'error', where, message: `ID ${id} used twice.` });
      seen.add(id);
    }
    if (!entryIds.has(c.digId)) issues.push({ level: 'error', where, message: `Dig entry ${c.digId} does not exist.` });
    const treasureDisc = Number(c.treasureId.match(/^d(\d)\./)?.[1]);
    if (treasureDisc !== c.treasureFromDisc) {
      issues.push({ level: 'error', where, message: `Treasure ID disc prefix must match treasureFromDisc (${c.treasureFromDisc}).` });
    }
    if (availableDiscs.includes(c.treasureFromDisc) && !entryIds.has(c.treasureId)) {
      issues.push({ level: 'error', where, message: `Treasure entry ${c.treasureId} should exist (its disc is available).` });
    }
    if (!availableDiscs.includes(c.treasureFromDisc) && entryIds.has(c.treasureId)) {
      issues.push({ level: 'warning', where, message: 'Reserved treasure ID already has an entry; update treasureFromDisc?' });
    }
  }
  return issues;
}

/** Every referenced official image must be registered. */
export function validateImageRefs(areas: Area[], known: Set<string>): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (const a of areas) {
    if (a.image && !known.has(a.image.imageId)) {
      issues.push({ level: 'error', where: `area ${a.id}`, message: `Unknown imageId "${a.image.imageId}".` });
    }
    for (const e of a.entries) {
      if (e.image && !known.has(e.image.imageId)) {
        issues.push({ level: 'error', where: `entry ${e.id}`, message: `Unknown imageId "${e.image.imageId}".` });
      }
    }
  }
  return issues;
}
