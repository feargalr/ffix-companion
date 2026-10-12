import { Info, X } from 'lucide-react';
import { CHOCOGRAPHS } from '../data/chocographs';
import { ENTRY_BY_ID } from '../data';
import { CHOCOGRAPH_SPLIT_NOTICE, chocographStatus, needsSplitNotice } from '../lib/chocographs';
import { progressStore, type ProgressState } from '../lib/progress';
import { href } from '../lib/router';
import { CheckBox } from './ui';

/**
 * Two independent ticks per Chocograph: dug up, and treasure found. Treasure
 * IDs for later discs are reserved, so ticks recorded now carry over when
 * those discs are added.
 */
export function ChocographLog({ state }: { state: ProgressState }) {
  const { completed } = state;
  const spoilersOff = state.settings.spoilers === 'all';
  const dug = CHOCOGRAPHS.filter((c) => c.digId in completed).length;
  const found = CHOCOGRAPHS.filter((c) => c.treasureId in completed).length;

  return (
    <div className="ff-window-quiet overflow-hidden">
      <SplitNotice state={state} />
      <p className="px-4 pt-3 text-[12px] text-ink-3">
        {dug}/{CHOCOGRAPHS.length} dug up · {found}/{CHOCOGRAPHS.length} treasures found. Digging happens in Chocobo’s
        Forest; treasures are on the world map.
      </p>
      <div className="grid grid-cols-[1fr_auto_auto] items-center gap-x-1 px-2 pt-2 pb-1 text-[10px] font-semibold tracking-wider text-ink-3 uppercase">
        <span className="pl-2">Chocograph</span>
        <span className="w-11 text-center">Dug</span>
        <span className="w-11 text-center">Found</span>
      </div>
      <ul className="divide-y divide-silver/10 px-2 pb-2">
        {CHOCOGRAPHS.map((c) => {
          const status = chocographStatus(c, completed);
          const later = c.treasureFromDisc > 1;
          const label = c.number === 'piece' ? c.name : `#${c.number} ${c.name}`;
          const treasureEntry = ENTRY_BY_ID.get(c.treasureId);
          return (
            <li key={c.digId} className="grid grid-cols-[1fr_auto_auto] items-center gap-x-1 py-1">
              <span className="min-w-0 pl-2">
                <a
                  href={href({ name: 'area', areaId: ENTRY_BY_ID.get(c.digId)!.areaId, entryId: c.digId })}
                  className="block truncate text-[14px] text-ink hover:underline"
                >
                  {label}
                </a>
                <span className="block text-[11px] leading-snug text-ink-3">
                  {statusText(status, c.treasureAbility)}
                  {status.kind !== 'found' && status.kind !== 'not-dug' && (spoilersOff || !later) && (
                    <> · {c.treasureLocation}</>
                  )}
                  {status.kind === 'reachable' && treasureEntry && (
                    <>
                      {' '}
                      <a className="text-gold-2 underline" href={href({ name: 'area', areaId: treasureEntry.areaId, entryId: c.treasureId })}>
                        details
                      </a>
                    </>
                  )}
                </span>
              </span>
              <CheckBox
                checked={c.digId in completed}
                onChange={(v) => progressStore.setDone(c.digId, v)}
                label={`${label}: dug up`}
              />
              <CheckBox
                checked={c.treasureId in completed}
                onChange={(v) => progressStore.setDone(c.treasureId, v)}
                label={`${label}: treasure found`}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function statusText(s: ReturnType<typeof chocographStatus>, ability: string) {
  switch (s.kind) {
    case 'found':
      return 'Treasure found';
    case 'not-dug':
      return 'Not dug up yet';
    case 'needs-ability':
      return `Needs ${s.ability} (Healing Shore treasure)`;
    case 'later-disc':
      return `Treasure reachable from Disc ${s.disc}${ability !== 'Field' ? ` (needs ${ability})` : ''}`;
    case 'reachable':
      return 'Treasure reachable now';
  }
}

/** One-off explanation for players whose old ticks predate the split. */
export function SplitNotice({ state }: { state: ProgressState }) {
  if (!needsSplitNotice(state.completed, state.settings.dismissedNotices)) return null;
  return (
    <div role="note" className="m-3 flex gap-2 rounded-lg bg-highlight/15 p-3 text-[13px] leading-relaxed text-ink-2 ring-1 ring-highlight/40">
      <Info className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
      <p className="flex-1">
        Chocographs now have two ticks: <strong className="text-ink">dug up</strong> and{' '}
        <strong className="text-ink">treasure found</strong>. Your earlier ticks count as “dug up”. If you had also found
        a treasure, tick it again under “Found”.
      </p>
      <button
        type="button"
        aria-label="Dismiss"
        className="grid size-8 shrink-0 place-items-center text-ink-3 hover:text-ink"
        onClick={() => progressStore.dismissNotice(CHOCOGRAPH_SPLIT_NOTICE)}
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
