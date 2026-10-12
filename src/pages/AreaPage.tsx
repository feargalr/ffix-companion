import { AlertTriangle, ChevronLeft, ChevronRight, Eye, EyeOff, Lightbulb, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ALL_AREAS, ALL_ENTRIES, AREA_INDEX, getArea } from '../data';
import { SECTIONS } from '../lib/labels';
import { beforeYouLeave } from '../lib/missables';
import { progressStore, useProgress } from '../lib/progress';
import { href } from '../lib/router';
import { isAreaRevealed } from '../lib/spoilers';
import { areaProgress } from '../lib/stats';
import { BeforeYouLeave } from '../components/BeforeYouLeave';
import { ChecklistSection } from '../components/ChecklistSection';
import { ProgressBar } from '../components/ui';
import { SplitNotice } from '../components/ChocographLog';
import { OfficialImg, PartyPortraits } from '../components/OfficialImage';

export function AreaPage({ areaId, entryId }: { areaId: string; entryId?: string }) {
  const state = useProgress();
  const area = getArea(areaId);
  const index = area ? AREA_INDEX.get(area.id)! : -1;
  const [revealAnyway, setRevealAnyway] = useState(false);
  const [tipsOpen, setTipsOpen] = useState(false);

  // Opening an area makes it the "current" area and pushes the spoiler horizon,
  // but only when the area was already revealed — peeking doesn't count.
  const revealed = area ? isAreaRevealed(index, state) || revealAnyway : false;
  useEffect(() => {
    if (area && revealed) progressStore.visitArea(area.id, index);
  }, [area, index, revealed]);

  // Local state (spoiler peek, tips) resets per area because App keys this
  // component by areaId.
  useEffect(() => {
    if (!entryId) window.scrollTo({ top: 0 });
  }, [areaId, entryId]);

  if (!area) {
    return (
      <div className="ff-window mt-8 p-6 text-center">
        <p className="text-ink">That area doesn’t exist.</p>
        <a className="ff-btn mt-4" href={href({ name: 'journey' })}>
          Back to Journey
        </a>
      </div>
    );
  }

  const prev = ALL_AREAS[index - 1];
  const next = ALL_AREAS[index + 1];
  const p = areaProgress(area, state.completed);
  const warn = beforeYouLeave(area, ALL_ENTRIES, state.completed);
  const spoilersAllowed = state.settings.spoilers === 'all';

  return (
    <div className="space-y-4">
      <header className="pt-safe sticky top-0 z-20 -mx-4 border-b border-silver/30 px-4 pb-3"
        style={{ background: 'linear-gradient(180deg, rgb(11 21 52 / 0.97), rgb(11 21 52 / 0.92))', backdropFilter: 'blur(8px)' }}
      >
        <div className="flex items-center gap-2">
          <AreaNavButton to={prev?.id} dir="prev" />
          <div className="min-w-0 flex-1 text-center">
            <p className="text-[11px] font-semibold tracking-wider text-ink-3 uppercase">
              Disc {area.disc} · {area.chapter}
            </p>
            <h1 className="ff-title truncate text-[19px] leading-tight font-semibold text-ink">{area.location}</h1>
            <p className="truncate text-[13px] text-gold-2">{revealed ? area.visit : '—'}</p>
          </div>
          <AreaNavButton to={next?.id} dir="next" />
        </div>
        <div className="mt-2 flex items-center gap-3">
          <ProgressBar pct={p.pct} tone={p.pct === 100 ? 'gold' : 'blue'} label={`${area.location} completion`} />
          <span className="tabular shrink-0 text-[13px] font-semibold text-ink-2">
            {p.done} / {p.total}
          </span>
        </div>
      </header>

      {!revealed ? (
        <div className="ff-window p-5 text-center">
          <EyeOff className="mx-auto size-6 text-ink-3" aria-hidden="true" />
          <p className="mt-2 text-[15px] text-ink">This area is further ahead than you’ve been.</p>
          <p className="mt-1 text-[13px] text-ink-2">
            Its checklist may hint at upcoming story events. You can turn off spoiler protection in Progress → Settings.
          </p>
          <button type="button" className="ff-btn mt-4" onClick={() => setRevealAnyway(true)}>
            <Eye className="size-4" aria-hidden="true" /> Show anyway
          </button>
        </div>
      ) : (
        <>
          <div className="flex gap-3 px-1">
            <div className="min-w-0 flex-1 space-y-2">
              <p className="text-[14px] leading-relaxed text-ink-2">{area.summary}</p>
              {area.party && (
                <p className="text-[12px] text-ink-3">
                  <span className="font-semibold">Party:</span> {area.party}
                </p>
              )}
              {area.partyIds && <PartyPortraits ids={area.partyIds} />}
            </div>
            {area.image && (
              <OfficialImg imageId={area.image.imageId} alt={area.image.alt} className="w-28 shrink-0 self-start rounded-md sm:w-36" />
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              role="switch"
              aria-checked={state.settings.hideCompleted}
              onClick={() => progressStore.updateSettings({ hideCompleted: !state.settings.hideCompleted })}
              className="ff-btn-ghost min-h-10 text-[13px]"
            >
              {state.settings.hideCompleted ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              {state.settings.hideCompleted ? 'Showing incomplete only' : 'Show incomplete only'}
            </button>
            {warn.count > 0 && (
              <a href="#before-you-leave" onClick={jumpToWarning} className="ff-chip min-h-10 bg-crimson/20 px-3 text-[13px] text-[#ffb3ba] ring-1 ring-crimson/50">
                <AlertTriangle className="size-4" aria-hidden="true" />
                {warn.count} missable left
              </a>
            )}
          </div>

          {area.tips && area.tips.length > 0 && (
            <div className="ff-window-quiet">
              <button
                type="button"
                aria-expanded={tipsOpen}
                onClick={() => setTipsOpen((o) => !o)}
                className="flex min-h-11 w-full items-center gap-2 px-4 text-left"
              >
                <Lightbulb className="size-4 text-gold" aria-hidden="true" />
                <span className="flex-1 text-[14px] font-semibold text-ink">Field notes</span>
                <ChevronDown
                  className={`size-5 text-ink-3 transition-transform ${tipsOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>
              {tipsOpen && (
                <ul className="anim-fade-up list-disc space-y-1.5 px-4 pb-4 pl-9 text-[14px] leading-relaxed text-ink-2 marker:text-gold/70">
                  {area.tips.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {area.entries.some((e) => e.chocograph) && (
            <div className="ff-window-quiet">
              <SplitNotice state={state} />
              <p className="px-4 py-3 text-[13px] text-ink-2">
                Digging up a Chocograph and finding its treasure are ticked separately. The{' '}
                <a className="text-gold-2 underline" href={href({ name: 'progress' })}>
                  Chocograph log
                </a>{' '}
                shows every Chocograph you can dig up on Disc 1, including treasures you can’t reach yet.
              </p>
            </div>
          )}

          {SECTIONS.map((s) => {
            const entries = area.entries.filter((e) => s.categories.includes(e.category));
            if (!entries.length) return null;
            const key = `${area.id}:${s.id}`;
            return (
              <ChecklistSection
                key={key}
                sectionKey={key}
                title={s.title}
                entries={entries}
                completed={state.completed}
                collapsed={!!state.collapsed[key]}
                hideCompleted={state.settings.hideCompleted}
                spoilersAllowed={spoilersAllowed}
                highlightId={entryId}
              />
            );
          })}

          <BeforeYouLeave area={area} completed={state.completed} />

          <div className="grid grid-cols-2 gap-2">
            {prev ? (
              <a href={href({ name: 'area', areaId: prev.id })} className="ff-btn-ghost justify-start text-left text-[13px]">
                <ChevronLeft className="size-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{prev.location}</span>
              </a>
            ) : (
              <span />
            )}
            {next && (
              <a href={href({ name: 'area', areaId: next.id })} className="ff-btn-ghost justify-end text-right text-[13px]">
                <span className="truncate">{isAreaRevealed(index + 1, state) ? next.location : 'Next area'}</span>
                <ChevronRight className="size-4 shrink-0" aria-hidden="true" />
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function jumpToWarning(e: React.MouseEvent) {
  // Keep the hash route intact; scroll instead of navigating.
  e.preventDefault();
  document.getElementById('before-you-leave')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function AreaNavButton({ to, dir }: { to?: string; dir: 'prev' | 'next' }) {
  const Icon = dir === 'prev' ? ChevronLeft : ChevronRight;
  const label = dir === 'prev' ? 'Previous area' : 'Next area';
  if (!to) return <span className="size-11 shrink-0" aria-hidden="true" />;
  return (
    <a
      href={href({ name: 'area', areaId: to })}
      aria-label={label}
      className="grid size-11 shrink-0 place-items-center rounded-lg border border-silver/40 bg-panel/60 text-ink-2 hover:text-ink"
    >
      <Icon className="size-5" aria-hidden="true" />
    </a>
  );
}
