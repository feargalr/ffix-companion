import { DoorOpen, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import type { Area, ChecklistEntry } from '../types/game';
import { ALL_ENTRIES, AREA_BY_ID } from '../data';
import { beforeYouLeave, isUncertain } from '../lib/missables';
import { missableBadge } from '../lib/labels';
import { href } from '../lib/router';
import { areaProgress, type Completed } from '../lib/stats';

export function BeforeYouLeave({ area, completed }: { area: Area; completed: Completed }) {
  const w = beforeYouLeave(area, ALL_ENTRIES, completed);
  const [showLower, setShowLower] = useState(false);
  const clear = w.count === 0;
  const p = areaProgress(area, completed);
  const left = p.total - p.done;

  return (
    <section id="before-you-leave" aria-labelledby="byl-title" className={`${clear ? 'ff-window-quiet' : 'ff-window-warn'} p-4`}>
      <div className="flex items-center gap-2">
        {clear ? (
          <ShieldCheck className="size-5 text-jade" aria-hidden="true" />
        ) : (
          <DoorOpen className="size-5 text-crimson" aria-hidden="true" />
        )}
        <h2 id="byl-title" className="ff-title text-base font-semibold text-ink">
          Before You Leave
        </h2>
      </div>

      {area.departure && <p className="mt-2 text-[13px] leading-relaxed text-ink-2">{area.departure.consequence}</p>}

      <dl className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
        <div className={`rounded-lg px-3 py-2 ring-1 ${clear ? 'bg-jade/10 ring-jade/40' : 'bg-crimson/10 ring-crimson/40'}`}>
          <dt className="font-semibold tracking-wide text-ink-3 uppercase">Safe to progress</dt>
          <dd className={`text-[14px] font-semibold ${clear ? 'text-jade' : 'text-[#ffb3ba]'}`}>
            {clear ? 'Yes' : `Not yet — ${w.count} left`}
          </dd>
        </div>
        <div className={`rounded-lg px-3 py-2 ring-1 ${left === 0 ? 'bg-gold/10 ring-gold/40' : 'bg-night/40 ring-silver/25'}`}>
          <dt className="font-semibold tracking-wide text-ink-3 uppercase">Area checklist</dt>
          <dd className={`tabular text-[14px] font-semibold ${left === 0 ? 'text-gold-2' : 'text-ink'}`}>
            {left === 0 ? '100% complete' : `${p.pct}% · ${left} to go`}
          </dd>
        </div>
      </dl>

      {clear ? (
        <p className="mt-2 text-[13px] text-ink-2">
          {left === 0
            ? 'Every entry in this area is ticked.'
            : `Nothing critical or important is left. ${left} ordinary ${left === 1 ? 'entry is' : 'entries are'} still unticked; none will cost you anything significant.`}
        </p>
      ) : (
        <>
          <p className="mt-3 text-[15px] font-semibold text-[#ffc2c8]">
            {w.count} missable {w.count === 1 ? 'opportunity' : 'opportunities'} remaining
          </p>
          {area.departure && <p className="text-[12px] text-ink-3">Closes at: {area.departure.trigger}.</p>}
          {w.critical.length > 0 && (
            <Group title="Critical" tone="text-[#ffb3ba]" entries={w.critical} areaId={area.id} />
          )}
          {w.important.length > 0 && (
            <Group title="Important" tone="text-[#ffd09a]" entries={w.important} areaId={area.id} />
          )}
        </>
      )}

      {w.lower.length > 0 && (
        <div className="mt-3 border-t border-silver/20 pt-3">
          <button
            type="button"
            className="text-[13px] font-medium text-ink-2 underline decoration-silver/40 underline-offset-2"
            aria-expanded={showLower}
            onClick={() => setShowLower((s) => !s)}
          >
            {showLower ? 'Hide' : 'Show'} {w.lower.length} lower-priority item{w.lower.length === 1 ? '' : 's'}
          </button>
          {showLower && (
            <>
              <p className="mt-2 text-[12px] text-ink-3">
                Ordinary pickups and replaceable rewards, things that come back later, and spots whose later availability
                isn’t documented.
              </p>
              <WarnList entries={w.lower} areaId={area.id} />
            </>
          )}
        </div>
      )}
    </section>
  );
}

function Group({ title, tone, entries, areaId }: { title: string; tone: string; entries: ChecklistEntry[]; areaId: string }) {
  return (
    <div className="mt-3">
      <h3 className={`text-[11px] font-semibold tracking-wider uppercase ${tone}`}>{title}</h3>
      <WarnList entries={entries} areaId={areaId} />
    </div>
  );
}

function WarnList({ entries, areaId }: { entries: ChecklistEntry[]; areaId: string }) {
  return (
    <ul className="mt-1 space-y-1">
      {entries.map((e) => {
        const elsewhere = e.areaId !== areaId ? AREA_BY_ID.get(e.areaId) : undefined;
        const badge = missableBadge(e.missability, e.missableKind);
        return (
          <li key={e.id}>
            <a
              href={href({ name: 'area', areaId: e.areaId, entryId: e.id })}
              className="flex min-h-10 items-center justify-between gap-3 rounded-md px-2 py-1.5 hover:bg-night/40"
            >
              <span className="min-w-0">
                <span className="block text-[14px] text-ink">{e.name}</span>
                <span className="block text-[12px] text-ink-3">
                  {elsewhere ? `${elsewhere.location} · ` : ''}
                  {e.lastOpportunity}
                  {isUncertain(e) && <span className="text-amber/90"> · evidence incomplete</span>}
                </span>
              </span>
              {badge && <span className="shrink-0 text-[11px] font-semibold text-ink-3">{badge}</span>}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
