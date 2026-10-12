import type { Area, Category, ChecklistEntry, Missability, MissableKind, SourceId } from '../types/game';

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
const SOURCES: SourceId[] = ['jegged', 'gamefaqs-bover', 'steam-guide'];
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
      if (!e.id.startsWith(`d${a.disc}.${a.id}.`)) err(where, 'ID prefix does not match its disc/area.');
      if (!e.name?.trim()) err(where, 'Missing name.');
      if (!e.description?.trim()) err(where, 'Missing description.');
      if (!CATEGORIES.includes(e.category)) err(where, `Unknown category "${e.category}".`);
      if (!MISSABILITY.includes(e.missability)) err(where, `Unknown missability "${e.missability}".`);
      if (e.missableKind && !KINDS.includes(e.missableKind)) err(where, `Unknown missableKind "${e.missableKind}".`);
      if (!e.sources?.length) err(where, 'At least one source is required.');
      for (const s of e.sources ?? []) if (!SOURCES.includes(s)) err(where, `Unknown source "${s}".`);

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
