import { AlertTriangle, ChevronRight, Play } from 'lucide-react';
import { ALL_AREAS, ALL_ENTRIES, AREA_INDEX, DISCS, getArea } from '../data';
import { useProgress } from '../lib/progress';
import { href } from '../lib/router';
import { isAreaRevealed } from '../lib/spoilers';
import { areaProgress, outstandingMissables, progressOf } from '../lib/stats';
import { beforeYouLeave } from '../lib/missables';
import { Ornament, Pointer, ProgressBar, ProgressRing } from '../components/ui';

export function JourneyPage() {
  const state = useProgress();
  const { completed } = state;
  const disc = DISCS[0];
  const overall = progressOf(ALL_ENTRIES, completed);
  const current = getArea(state.lastAreaId);
  // Only count missables you have reached so far; future areas aren't "outstanding" yet.
  const reachedIdx = current ? AREA_INDEX.get(current.id)! : -1;
  const outstanding = outstandingMissables(
    ALL_ENTRIES.filter((e) => AREA_INDEX.get(e.areaId)! <= reachedIdx),
    completed,
  );
  const continueTo = current ?? ALL_AREAS[0];

  // Group areas by chapter, preserving order.
  const chapters: { title: string; areas: typeof disc.areas }[] = [];
  for (const a of disc.areas) {
    const last = chapters[chapters.length - 1];
    if (last?.title === a.chapter) last.areas.push(a);
    else chapters.push({ title: a.chapter, areas: [a] });
  }

  return (
    <div className="space-y-5">
      <header className="pt-safe px-1 pt-6 text-center">
        <p className="ff-title text-[11px] tracking-[0.45em] text-ink-3 uppercase">Final Fantasy</p>
        <h1 className="ff-title mt-1 text-[40px] leading-none font-bold text-ink">IX</h1>
        <p className="ff-title mt-2 text-[15px] text-gold-2">Adventure Companion</p>
        <Ornament className="mx-auto mt-4 w-60" />
      </header>

      <section className="ff-window p-4" aria-labelledby="current-progress">
        <h2 id="current-progress" className="sr-only">
          Current progress
        </h2>
        <div className="flex items-center gap-4">
          <ProgressRing pct={overall.pct} size={64} stroke={5} />
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold tracking-wider text-ink-3 uppercase">
              Disc {current?.disc ?? 1} · {current?.chapter ?? 'Not started'}
            </p>
            <p className="truncate text-[16px] font-semibold text-ink">
              {current ? `${current.location}` : 'Choose your starting area'}
            </p>
            {current && <p className="truncate text-[13px] text-ink-2">{current.visit}</p>}
          </div>
        </div>
        <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
          <Stat label="Completed" value={overall.done} />
          <Stat label="Remaining" value={overall.total - overall.done} />
          <Stat label="Missables" value={outstanding.length} warn={outstanding.length > 0} />
        </dl>
        <p className="mt-1.5 text-center text-[11px] text-ink-3">
          Missables = permanently missable entries not yet ticked, up to your current area.
        </p>
        <a href={href({ name: 'area', areaId: continueTo.id })} className="ff-btn-gold mt-4 w-full text-[16px]">
          <Play className="size-4 fill-current" aria-hidden="true" />
          {current ? 'Continue Adventure' : 'Begin Adventure'}
        </a>
      </section>

      <nav aria-label="Discs" className="grid grid-cols-4 gap-2">
        {DISCS.map((d) => (
          <span
            key={d.number}
            aria-current={d.number === 1 ? 'true' : undefined}
            className={`ff-chip min-h-9 justify-center text-[12px] ${
              d.available ? 'bg-gold/20 text-gold-2 ring-1 ring-gold/60' : 'bg-night/50 text-ink-3 ring-1 ring-silver/20'
            }`}
          >
            {d.title}
            {!d.available && <span className="sr-only"> (coming later)</span>}
          </span>
        ))}
      </nav>

      {chapters.map((ch) => (
        <section key={ch.title} aria-label={ch.title}>
          <h2 className="ff-title mb-2 px-1 text-[13px] font-semibold tracking-widest text-gold-2 uppercase">{ch.title}</h2>
          <ol className="ff-window-quiet divide-y divide-silver/15 overflow-hidden">
            {ch.areas.map((a) => {
              const idx = AREA_INDEX.get(a.id)!;
              const revealed = isAreaRevealed(idx, state);
              const p = areaProgress(a, completed);
              const missLeft = beforeYouLeave(a, ALL_ENTRIES, completed).count;
              const isCurrent = a.id === current?.id;
              return (
                <li key={a.id}>
                  <a
                    href={href({ name: 'area', areaId: a.id })}
                    aria-current={isCurrent ? 'location' : undefined}
                    className={`flex min-h-16 items-center gap-3 px-3 py-2.5 transition-colors hover:bg-panel-2/40 ${
                      isCurrent ? 'bg-panel-2/40' : ''
                    }`}
                  >
                    <span className="flex w-5 justify-center">
                      {isCurrent ? (
                        <Pointer className="anim-pointer w-5" />
                      ) : (
                        <span className="tabular text-[12px] text-ink-3">{a.order}</span>
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-medium text-ink">{a.location}</span>
                      <span className="block truncate text-[12px] text-ink-3">
                        {revealed ? a.visit : 'Details hidden until you get closer'}
                        {a.optional && revealed ? ' · Optional' : ''}
                      </span>
                    </span>
                    {missLeft > 0 && revealed && (
                      <span
                        className="ff-chip bg-crimson/20 text-[#ffb3ba] ring-1 ring-crimson/50"
                        title={`${missLeft} missable remaining`}
                      >
                        <AlertTriangle className="size-3" aria-hidden="true" />
                        {missLeft}
                        <span className="sr-only"> missable remaining</span>
                      </span>
                    )}
                    <ProgressRing pct={p.pct} size={38} stroke={3.5} />
                    <ChevronRight className="size-4 text-ink-3" aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ol>
        </section>
      ))}

      <div className="ff-window-quiet p-4">
        <p className="text-[13px] font-semibold text-ink">Disc 1 overall</p>
        <div className="mt-2">
          <ProgressBar pct={overall.pct} label="Disc 1 completion" />
        </div>
        <p className="mt-2 text-[12px] text-ink-3">
          Discs 2–4 aren’t in the app yet. Your progress is saved on this device and will carry over when they’re added.
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value, warn }: { label: string; value: number; warn?: boolean }) {
  return (
    <div className="rounded-lg bg-night/45 px-2 py-2 ring-1 ring-silver/20">
      <dt className="text-[11px] font-semibold tracking-wide text-ink-3 uppercase">{label}</dt>
      <dd className={`tabular text-[20px] font-semibold ${warn ? 'text-[#ffb3ba]' : 'text-ink'}`}>{value}</dd>
    </div>
  );
}
