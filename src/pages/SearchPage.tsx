import { MapPin, Search, X } from 'lucide-react';
import { useDeferredValue, useMemo, useState } from 'react';
import type { Missability } from '../types/game';
import { ALL_AREAS, ALL_ENTRIES, AREA_INDEX } from '../data';
import { SECTIONS, type SectionId } from '../lib/labels';
import { useProgress } from '../lib/progress';
import { href } from '../lib/router';
import { buildIndex, search, searchAreas, type SearchFilters } from '../lib/search';
import { isAreaRevealed } from '../lib/spoilers';
import { isExcluded } from '../lib/stats';
import { EntryRow } from '../components/EntryRow';

const INDEX = buildIndex(ALL_AREAS);

const MISS_OPTIONS: { value: SearchFilters['missability'] | ''; label: string }[] = [
  { value: '', label: 'Any' },
  { value: 'missable', label: 'Missable' },
  { value: 'permanent' as Missability, label: 'Permanent' },
  { value: 'conditional' as Missability, label: 'Conditional' },
  { value: 'unconfirmed' as Missability, label: 'Unconfirmed' },
  { value: 'none' as Missability, label: 'Not missable' },
];

export function SearchPage({ initialQuery = '' }: { initialQuery?: string }) {
  const state = useProgress();
  const [q, setQ] = useState(initialQuery);
  const [areaId, setAreaId] = useState('');
  const [section, setSection] = useState<SectionId | ''>('');
  const [miss, setMiss] = useState<SearchFilters['missability'] | ''>('');
  const [status, setStatus] = useState<'' | 'todo' | 'done'>('');
  const [includeAhead, setIncludeAhead] = useState(false);
  const deferredQ = useDeferredValue(q);

  const spoilersOff = state.settings.spoilers === 'all';
  const hasQuery = deferredQ.trim().length > 0;
  const hasFilter = !!(areaId || section || miss || status);

  const { results, hiddenAhead } = useMemo(() => {
    if (!hasQuery && !hasFilter) return { results: [], hiddenAhead: 0 };
    const filters: SearchFilters = {
      areaId: areaId || undefined,
      section: section || undefined,
      missability: miss || undefined,
      status: status || undefined,
    };
    const all = search(INDEX, deferredQ, filters, state.completed);
    if (spoilersOff || includeAhead) return { results: all, hiddenAhead: 0 };
    const visible = all.filter((r) => isAreaRevealed(AREA_INDEX.get(r.area.id)!, state));
    return { results: visible, hiddenAhead: all.length - visible.length };
  }, [deferredQ, areaId, section, miss, status, state, includeAhead, spoilersOff, hasQuery, hasFilter]);

  const areaHits = hasQuery ? searchAreas(ALL_AREAS, deferredQ) : [];

  return (
    <div className="space-y-4">
      <header className="pt-safe px-1 pt-4">
        <h1 className="ff-title text-[22px] font-semibold text-ink">Search</h1>
        <p className="text-[13px] text-ink-3">Search items, ATEs, sidequests and places across Disc 1. Works offline.</p>
      </header>

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-ink-3" aria-hidden="true" />
        <input
          type="search"
          inputMode="search"
          autoComplete="off"
          enterKeyHint="search"
          aria-label="Search the Disc 1 checklist"
          placeholder="Moonstone, jump rope, Stiltzkin…"
          className="ff-input pr-10 pl-10"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {q && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setQ('')}
            className="absolute top-1/2 right-1 grid size-10 -translate-y-1/2 place-items-center text-ink-3 hover:text-ink"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Select label="Area" value={areaId} onChange={setAreaId}>
          <option value="">All areas</option>
          {ALL_AREAS.map((a) => (
            <option key={a.id} value={a.id}>
              {a.order}. {a.location}
              {isAreaRevealed(AREA_INDEX.get(a.id)!, state) ? ` — ${a.visit}` : ''}
            </option>
          ))}
        </Select>
        <Select label="Type" value={section} onChange={(v) => setSection(v as SectionId | '')}>
          <option value="">All types</option>
          {SECTIONS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </Select>
        <Select label="Missable" value={miss ?? ''} onChange={(v) => setMiss(v as SearchFilters['missability'] | '')}>
          {MISS_OPTIONS.map((o) => (
            <option key={o.label} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
        <Select label="Status" value={status} onChange={(v) => setStatus(v as '' | 'todo' | 'done')}>
          <option value="">Any status</option>
          <option value="todo">Incomplete</option>
          <option value="done">Completed</option>
        </Select>
      </div>

      {areaHits.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {areaHits.map(({ area }) => (
            <a
              key={area.id}
              href={href({ name: 'area', areaId: area.id })}
              className="ff-chip min-h-9 bg-panel-2/60 px-3 text-[13px] text-ink ring-1 ring-silver/50"
            >
              <MapPin className="size-3.5 text-gold" aria-hidden="true" />
              {area.location}
              {isAreaRevealed(AREA_INDEX.get(area.id)!, state) ? ` · ${area.visit}` : ''}
            </a>
          ))}
        </div>
      )}

      {(hasQuery || hasFilter) && (
        <p className="px-1 text-[13px] text-ink-3" aria-live="polite">
          {results.length} result{results.length === 1 ? '' : 's'}
          {hiddenAhead > 0 && (
            <>
              {' '}· {hiddenAhead} more in areas ahead of you{' '}
              <button type="button" className="font-semibold text-amber underline" onClick={() => setIncludeAhead(true)}>
                show them
              </button>
            </>
          )}
        </p>
      )}

      {results.length > 0 && (
        <ul className="ff-window-quiet divide-y divide-silver/10 px-1.5 py-1.5">
          {results.map(({ entry }) => (
            <EntryRow
              key={entry.id}
              entry={entry}
              done={entry.id in state.completed}
              excluded={isExcluded(entry, state.completed, ALL_ENTRIES)}
              completed={state.completed}
              spoilersAllowed={spoilersOff}
              showArea
            />
          ))}
        </ul>
      )}

      {!hasQuery && !hasFilter && (
        <div className="ff-window-quiet p-4 text-[13px] leading-relaxed text-ink-2">
          <p className="font-semibold text-ink">Try:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {['Moonstone', 'Jump rope', 'Stiltzkin', 'Alexandria', 'Gizamaluke', 'Mognet', 'Chocograph'].map((s) => (
              <button
                key={s}
                type="button"
                className="ff-chip min-h-9 bg-night/50 px-3 text-[13px] text-ink-2 ring-1 ring-silver/30 hover:text-ink"
                onClick={() => setQ(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block px-1 text-[11px] font-semibold tracking-wider text-ink-3 uppercase">{label}</span>
      <select className="ff-input appearance-none text-[14px]" value={value} onChange={(e) => onChange(e.target.value)}>
        {children}
      </select>
    </label>
  );
}
