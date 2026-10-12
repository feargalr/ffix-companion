import { Download, Info, RotateCcw, Upload, ShieldAlert, Clock } from 'lucide-react';
import { useRef, useState } from 'react';
import { ALL_AREAS, ALL_ENTRIES, ENTRY_BY_ID, AREA_BY_ID } from '../data';
import { buildExport, exportFilename, parseImport } from '../lib/importExport';
import { laterDiscDeadlines } from '../lib/missables';
import { progressStore, useProgress, type ProgressState } from '../lib/progress';
import { href } from '../lib/router';
import { areaProgress, missableProgress, progressOf, sectionProgress } from '../lib/stats';
import { ProgressBar, ProgressRing, SectionHeading } from '../components/ui';

const KNOWN_IDS = new Set(ENTRY_BY_ID.keys());

export function ProgressPage() {
  const state = useProgress();
  const { completed } = state;
  const overall = progressOf(ALL_ENTRIES, completed);
  const bySection = sectionProgress(ALL_ENTRIES, completed);
  const missables = missableProgress(ALL_ENTRIES, completed);
  const deadlines = laterDiscDeadlines(ALL_ENTRIES, completed);

  return (
    <div className="space-y-6">
      <header className="pt-safe px-1 pt-4">
        <h1 className="ff-title text-[22px] font-semibold text-ink">Progress</h1>
        <p className="text-[13px] text-ink-3">Disc 1 completion and settings.</p>
      </header>

      <section className="ff-window p-4" aria-label="Disc 1 overview">
        <div className="flex items-center gap-4">
          <ProgressRing pct={overall.pct} size={84} stroke={6} />
          <dl className="grid flex-1 grid-cols-3 gap-2 text-center">
            <Big label="Total" value={overall.total} />
            <Big label="Done" value={overall.done} />
            <Big label="Left" value={overall.total - overall.done} />
          </dl>
        </div>
        <div className="mt-4 space-y-3">
          <Row label="Treasure & items" t={bySection.items} />
          <Row label="Active Time Events" t={bySection.ate} />
          <Row label="Boss steals" t={bySection.steals} />
          <Row label="Optional activities" t={bySection.activities} />
          <Row label="Shopping" t={bySection.shopping} />
          <Row label="Missable opportunities done" t={missables} gold />
        </div>
      </section>

      {deadlines.length > 0 && (
        <section aria-label="Deadlines ahead">
          <SectionHeading>Deadlines ahead</SectionHeading>
          <ul className="ff-window-quiet divide-y divide-silver/15">
            {deadlines.map((e) => (
              <li key={e.id}>
                <a
                  href={href({ name: 'area', areaId: e.areaId, entryId: e.id })}
                  className="flex min-h-12 items-center gap-3 px-4 py-2"
                >
                  <Clock className="size-4 shrink-0 text-amber" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] text-ink">{e.name}</span>
                    <span className="block text-[12px] text-ink-3">{e.lastOpportunity}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-label="Progress by area">
        <SectionHeading>By area</SectionHeading>
        <ul className="ff-window-quiet divide-y divide-silver/15">
          {ALL_AREAS.map((a) => {
            const p = areaProgress(a, completed);
            return (
              <li key={a.id}>
                <a href={href({ name: 'area', areaId: a.id })} className="block px-4 py-2.5 hover:bg-panel-2/30">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="truncate text-[14px] text-ink">
                      {a.order}. {a.location}
                    </span>
                    <span className="tabular shrink-0 text-[12px] text-ink-2">
                      {p.done}/{p.total}
                    </span>
                  </span>
                  <span className="mt-1.5 block">
                    <ProgressBar pct={p.pct} tone={p.pct === 100 ? 'gold' : 'blue'} label={`${a.location} completion`} />
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </section>

      <Settings state={state} />
      <DataManagement state={state} />

      <a href={href({ name: 'about' })} className="ff-btn-ghost w-full">
        <Info className="size-4" aria-hidden="true" /> About, sources & accuracy
      </a>
    </div>
  );
}

function Settings({ state }: { state: ProgressState }) {
  return (
    <section aria-label="Settings">
      <SectionHeading>Settings</SectionHeading>
      <div className="ff-window-quiet divide-y divide-silver/15">
        <Toggle
          label="Spoiler protection"
          description="Hide the details of areas you haven’t reached yet and keep spoiler notes folded away. You can always open any area."
          checked={state.settings.spoilers === 'safe'}
          onChange={(on) => progressStore.updateSettings({ spoilers: on ? 'safe' : 'all' })}
        />
        <Toggle
          label="Show incomplete only"
          description="Hide ticked entries in area checklists."
          checked={state.settings.hideCompleted}
          onChange={(on) => progressStore.updateSettings({ hideCompleted: on })}
        />
      </div>
    </section>
  );
}

function DataManagement({ state }: { state: ProgressState }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<{ tone: 'ok' | 'err'; text: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [pending, setPending] = useState<{ state: ProgressState; summary: string } | null>(null);

  const doExport = () => {
    const blob = new Blob([JSON.stringify(buildExport(state), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = exportFilename();
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMsg({ tone: 'ok', text: 'Progress exported. Keep the file somewhere safe.' });
  };

  const onFile = async (file: File) => {
    const result = parseImport(await file.text(), KNOWN_IDS);
    if (!result.ok) {
      setPending(null);
      setMsg({ tone: 'err', text: result.error });
      return;
    }
    const extra = result.unknownIds.length
      ? ` ${result.unknownIds.length} entr${result.unknownIds.length === 1 ? 'y is' : 'ies are'} from content this version doesn't have; they'll be kept.`
      : '';
    setMsg(null);
    setPending({
      state: result.state,
      summary: `This file has ${result.knownCount} completed entr${result.knownCount === 1 ? 'y' : 'ies'}.${extra} Importing replaces your current progress.`,
    });
  };

  const lastArea = state.lastAreaId ? AREA_BY_ID.get(state.lastAreaId) : undefined;

  return (
    <section aria-label="Your data">
      <SectionHeading>Your data</SectionHeading>
      <div className="ff-window-quiet space-y-3 p-4">
        <p className="flex gap-2 text-[13px] leading-relaxed text-ink-2">
          <ShieldAlert className="mt-0.5 size-4 shrink-0 text-amber" aria-hidden="true" />
          <span>
            Progress is stored only on this device, in this browser’s local storage. Clearing browser data, using private
            browsing, or switching browsers or devices will lose it. iOS may also clear data for sites you haven’t visited
            in a while. Export a backup now and then.
          </span>
        </p>
        <p className="text-[12px] text-ink-3">
          {Object.keys(state.completed).length} entries ticked{lastArea ? ` · last area: ${lastArea.location}` : ''}
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" className="ff-btn" onClick={doExport}>
            <Download className="size-4" aria-hidden="true" /> Export
          </button>
          <button type="button" className="ff-btn" onClick={() => fileRef.current?.click()}>
            <Upload className="size-4" aria-hidden="true" /> Import
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          aria-label="Import progress file"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void onFile(f);
            e.target.value = '';
          }}
        />

        {pending && (
          <div role="alertdialog" aria-label="Confirm import" className="rounded-lg bg-night/60 p-3 ring-1 ring-amber/50">
            <p className="text-[13px] text-ink">{pending.summary}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" className="ff-btn-ghost" onClick={() => setPending(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="ff-btn-gold"
                onClick={() => {
                  progressStore.replace(pending.state);
                  setPending(null);
                  setMsg({ tone: 'ok', text: 'Progress imported.' });
                }}
              >
                Replace progress
              </button>
            </div>
          </div>
        )}

        {!confirmReset ? (
          <button type="button" className="ff-btn-ghost w-full text-[#ffb3ba]" onClick={() => setConfirmReset(true)}>
            <RotateCcw className="size-4" aria-hidden="true" /> Reset all progress…
          </button>
        ) : (
          <div role="alertdialog" aria-label="Confirm reset" className="rounded-lg bg-crimson/10 p-3 ring-1 ring-crimson/60">
            <p className="text-[13px] text-ink">
              This clears every tick, your current area and your settings on this device. It can’t be undone unless you
              have an export.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" className="ff-btn-ghost" onClick={() => setConfirmReset(false)}>
                Keep progress
              </button>
              <button
                type="button"
                className="ff-btn border-crimson bg-none text-ink"
                style={{ background: 'linear-gradient(180deg, #b0475a, #7d2a3d)' }}
                onClick={() => {
                  progressStore.reset();
                  setConfirmReset(false);
                  setMsg({ tone: 'ok', text: 'Progress reset.' });
                }}
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {msg && (
          <p role="status" className={`text-[13px] ${msg.tone === 'ok' ? 'text-jade' : 'text-[#ffb3ba]'}`}>
            {msg.text}
          </p>
        )}
      </div>
    </section>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center gap-3 px-4 py-3 text-left"
    >
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-medium text-ink">{label}</span>
        <span className="block text-[12px] leading-snug text-ink-3">{description}</span>
      </span>
      <span
        className={`relative h-7 w-12 shrink-0 rounded-full ring-1 transition-colors ${
          checked ? 'bg-gold/80 ring-gold-2' : 'bg-night/70 ring-silver/50'
        }`}
        aria-hidden="true"
      >
        <span
          className={`absolute top-1 size-5 rounded-full bg-ink shadow transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </span>
    </button>
  );
}

function Big({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold tracking-wide text-ink-3 uppercase">{label}</dt>
      <dd className="tabular text-[22px] font-semibold text-ink">{value}</dd>
    </div>
  );
}

function Row({ label, t, gold }: { label: string; t: { done: number; total: number; pct: number }; gold?: boolean }) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-[13px]">
        <span className="text-ink-2">{label}</span>
        <span className="tabular text-ink">
          {t.done}/{t.total} <span className="text-ink-3">({t.pct}%)</span>
        </span>
      </div>
      <ProgressBar pct={t.pct} tone={gold ? 'gold' : 'blue'} label={label} />
    </div>
  );
}
