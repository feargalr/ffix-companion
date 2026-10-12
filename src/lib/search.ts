import type { Area, ChecklistEntry, Missability } from '../types/game';
import { CATEGORY_LABEL, SECTION_OF, type SectionId } from './labels';
import type { Completed } from './stats';

export interface SearchFilters {
  areaId?: string;
  section?: SectionId;
  missability?: Missability | 'missable'; // 'missable' = permanent or conditional
  status?: 'done' | 'todo';
}

export interface SearchResult {
  entry: ChecklistEntry;
  area: Area;
  score: number;
}

export interface AreaHit {
  area: Area;
  score: number;
}

/** Lowercase, strip accents and punctuation so "Qu's" matches "qus" and "qu s". */
export function normalise(s: string): string {
  return s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’`]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

interface Indexed {
  entry: ChecklistEntry;
  area: Area;
  name: string;
  body: string;
}

export function buildIndex(areas: Area[]): Indexed[] {
  return areas.flatMap((area) =>
    area.entries.map((entry) => ({
      entry,
      area,
      name: normalise(entry.name),
      body: normalise(
        [
          entry.spot,
          entry.description,
          entry.locationDetails,
          entry.reward,
          CATEGORY_LABEL[entry.category],
          area.location,
          area.visit,
          ...(entry.caveats ?? []),
        ]
          .filter(Boolean)
          .join(' '),
      ),
    })),
  );
}

function matchesFilters(e: ChecklistEntry, f: SearchFilters, completed: Completed) {
  if (f.areaId && e.areaId !== f.areaId) return false;
  if (f.section && SECTION_OF[e.category] !== f.section) return false;
  if (f.missability) {
    if (f.missability === 'missable') {
      if (e.missability !== 'permanent' && e.missability !== 'conditional') return false;
    } else if (e.missability !== f.missability) return false;
  }
  if (f.status === 'done' && !(e.id in completed)) return false;
  if (f.status === 'todo' && e.id in completed) return false;
  return true;
}

/**
 * Every query token must appear in the name or body. Name hits (especially
 * whole-word or prefix hits) rank higher. An empty query with filters set
 * lists everything matching the filters in play order.
 */
export function search(
  index: Indexed[],
  query: string,
  filters: SearchFilters,
  completed: Completed,
  limit = 200,
): SearchResult[] {
  const tokens = normalise(query).split(' ').filter(Boolean);
  const out: SearchResult[] = [];
  index.forEach((row, order) => {
    if (!matchesFilters(row.entry, filters, completed)) return;
    let score = 0;
    for (const t of tokens) {
      const inName = row.name.includes(t);
      if (!inName && !row.body.includes(t)) return;
      if (inName) {
        score += 10;
        if (row.name.startsWith(t)) score += 5;
        if (new RegExp(`\\b${t}\\b`).test(row.name)) score += 3;
      } else score += 2;
    }
    // Stable play-order tiebreak via a tiny fractional penalty.
    out.push({ entry: row.entry, area: row.area, score: score - order / 100000 });
  });
  if (tokens.length) out.sort((a, b) => b.score - a.score);
  return out.slice(0, limit);
}

/** Areas whose name matches the query, for "jump to area" suggestions. */
export function searchAreas(areas: Area[], query: string): AreaHit[] {
  const tokens = normalise(query).split(' ').filter(Boolean);
  if (!tokens.length) return [];
  return areas
    .map((area) => {
      const hay = normalise(`${area.location} ${area.visit} ${area.chapter}`);
      if (!tokens.every((t) => hay.includes(t))) return null;
      return { area, score: tokens.length };
    })
    .filter((x): x is AreaHit => x !== null);
}
