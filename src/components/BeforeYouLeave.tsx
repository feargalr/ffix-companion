import { DoorOpen, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import type { Area, ChecklistEntry } from '../types/game';
import { ALL_ENTRIES, AREA_BY_ID } from '../data';
import { beforeYouLeave } from '../lib/missables';
import { missableBadge } from '../lib/labels';
import { href } from '../lib/router';
import type { Completed } from '../lib/stats';

export function BeforeYouLeave({ area, completed }: { area: Area; completed: Completed }) {
  const w = beforeYouLeave(area, ALL_ENTRIES, completed);
  const [showSoft, setShowSoft] = useState(false);
  const clear = w.count === 0;

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

      {clear ? (
        <p className="mt-2 text-[14px] text-ink">
          {area.departure
            ? 'Nothing permanently missable is left here. You’re clear to move on.'
            : 'No missable content in this area.'}
        </p>
      ) : (
        <>
          <p className="mt-3 text-[15px] font-semibold text-[#ffc2c8]">
            {w.count} missable {w.count === 1 ? 'opportunity' : 'opportunities'} remaining
          </p>
          {area.departure && (
            <p className="text-[12px] text-ink-3">Closes at: {area.departure.trigger}.</p>
          )}
          <WarnList entries={[...w.permanent, ...w.conditional]} areaId={area.id} />
        </>
      )}

      {(w.unconfirmed.length > 0 || w.temporary.length > 0) && (
        <div className="mt-3 border-t border-silver/20 pt-3">
          <button
            type="button"
            className="text-[13px] font-medium text-amber underline decoration-amber/40 underline-offset-2"
            aria-expanded={showSoft}
            onClick={() => setShowSoft((s) => !s)}
          >
            {showSoft ? 'Hide' : 'Show'} {w.unconfirmed.length + w.temporary.length} lower-risk item
            {w.unconfirmed.length + w.temporary.length === 1 ? '' : 's'}
          </button>
          {showSoft && (
            <>
              {w.unconfirmed.length > 0 && (
                <>
                  <p className="mt-2 text-[12px] text-ink-3">
                    Revisit unconfirmed: sources don’t say whether these are still available later.
                  </p>
                  <WarnList entries={w.unconfirmed} areaId={area.id} />
                </>
              )}
              {w.temporary.length > 0 && (
                <>
                  <p className="mt-2 text-[12px] text-ink-3">Returns later: these become available again on a later disc.</p>
                  <WarnList entries={w.temporary} areaId={area.id} />
                </>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}

function WarnList({ entries, areaId }: { entries: ChecklistEntry[]; areaId: string }) {
  return (
    <ul className="mt-2 space-y-1">
      {entries.map((e) => {
        const elsewhere = e.areaId !== areaId ? AREA_BY_ID.get(e.areaId) : undefined;
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
                </span>
              </span>
              <span className="shrink-0 text-[11px] font-semibold text-ink-3">{missableBadge(e.missability, e.missableKind)}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
