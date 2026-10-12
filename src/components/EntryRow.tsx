import { ChevronDown, Eye, Lock, MapPin, Gift, AlertTriangle, Info, Link2, Users, Clapperboard, Gem } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { ChecklistEntry } from '../types/game';
import { ENTRY_BY_ID, AREA_BY_ID } from '../data';
import { CATEGORY_LABEL, KIND_EXPLAINER, MISSABILITY_LABEL } from '../lib/labels';
import { progressStore } from '../lib/progress';
import { href } from '../lib/router';
import { CheckBox, MissableBadge } from './ui';
import { OfficialImg } from './OfficialImage';
import { PRIORITY_LABEL, UNIQUENESS_LABEL, rewardUniqueness, warningPriority } from '../lib/priority';
import { SOURCE_SHORT } from '../lib/labels';

interface Props {
  entry: ChecklistEntry;
  done: boolean;
  /** Another option in the same exclusive group was chosen. */
  excluded: boolean;
  completed: Record<string, number>;
  spoilersAllowed: boolean;
  highlight?: boolean;
  /** Show which area this entry belongs to (search, warnings in other areas). */
  showArea?: boolean;
}

export function EntryRow({ entry, done, excluded, completed, spoilersAllowed, highlight, showArea }: Props) {
  const [open, setOpen] = useState(!!highlight);
  const [revealed, setRevealed] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const detailsId = `details-${entry.id}`;

  useEffect(() => {
    if (highlight && ref.current) {
      setOpen(true);
      ref.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, [highlight]);

  const unmetRequires = (entry.requires ?? []).filter((r) => !(r in completed));
  const groupmates = entry.exclusiveGroup
    ? [...ENTRY_BY_ID.values()].filter((e) => e.exclusiveGroup === entry.exclusiveGroup && e.id !== entry.id)
    : [];
  const area = AREA_BY_ID.get(entry.areaId);
  const showSpoiler = entry.spoilerText && (spoilersAllowed || revealed);

  return (
    <li
      ref={ref}
      id={`entry-${entry.id}`}
      className={`rounded-lg transition-colors ${highlight ? 'anim-glint ring-2 ring-gold/70' : ''} ${
        done ? 'bg-night/25' : 'bg-night/0'
      }`}
    >
      <div className="flex items-start gap-1">
        <CheckBox checked={done} onChange={(v) => progressStore.setDone(entry.id, v)} label={entry.name} />
        <button
          type="button"
          className="flex min-h-11 flex-1 items-center gap-2 py-1.5 pr-2 text-left"
          aria-expanded={open}
          aria-controls={detailsId}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="min-w-0 flex-1">
            <span
              className={`block text-[15px] leading-snug font-medium transition-colors ${
                done ? 'text-ink-3 line-through decoration-ink-3/60' : excluded ? 'text-ink-3' : 'text-ink'
              }`}
            >
              {entry.name}
            </span>
            <span className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12px] text-ink-3">
              <span>{CATEGORY_LABEL[entry.category]}</span>
              {entry.spot && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="truncate">{showArea && area ? `${area.location} · ${entry.spot}` : entry.spot}</span>
                </>
              )}
              {entry.mandatory && <span className="ff-chip bg-panel-2/60 text-ink-2">Story</span>}
              {!done && !excluded && <MissableBadge missability={entry.missability} kind={entry.missableKind} />}
              {excluded && <span className="ff-chip bg-night/60 text-ink-3 ring-1 ring-silver/20">Other choice made</span>}
              {entry.verification === 'single-source' && (
                <span className="ff-chip bg-night/60 text-ink-3 ring-1 ring-silver/20" title="Stated by one source only">
                  1 source
                </span>
              )}
              {entry.verification === 'conflicting' && (
                <span className="ff-chip bg-night/60 text-[#f5d7a8] ring-1 ring-amber/30" title="Sources disagree — see details">
                  Sources disagree
                </span>
              )}
              {entry.verification === 'unverified' && (
                <span className="ff-chip bg-night/60 text-ink-3 ring-1 ring-silver/20">Unverified</span>
              )}
            </span>
          </span>
          <ChevronDown
            className={`size-5 shrink-0 text-ink-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
      </div>

      {open && (
        <div id={detailsId} className="anim-fade-up space-y-2.5 pr-3 pb-3 pl-12 text-[14px] leading-relaxed text-ink-2">
          <p>{entry.description}</p>
          {entry.image && <OfficialImg imageId={entry.image.imageId} alt={entry.image.alt} className="w-full max-w-[266px] rounded-md" />}
          {entry.ateTrigger && (
            <Detail icon={<Clapperboard className="size-4" />} label="How it plays">
              {entry.ateTrigger === 'selectable'
                ? 'Choose it from the ATE prompt when it appears.'
                : entry.ateTrigger === 'automatic'
                  ? 'Plays automatically — nothing to select.'
                  : 'Plays automatically, but only if its prerequisites were met first.'}
            </Detail>
          )}
          {entry.locationDetails && (
            <Detail icon={<MapPin className="size-4" />} label="Where">
              {entry.locationDetails}
            </Detail>
          )}
          {entry.reward && (
            <Detail icon={<Gift className="size-4 text-gold" />} label="Reward">
              {entry.reward}
            </Detail>
          )}
          {(entry.requirements?.length || entry.requires?.length) && (
            <Detail icon={<Lock className="size-4" />} label="Requires">
              <ul className="space-y-0.5">
                {entry.requirements?.map((r) => <li key={r}>{r}</li>)}
                {entry.requires?.map((r) => {
                  const dep = ENTRY_BY_ID.get(r);
                  if (!dep) return null;
                  const met = r in completed;
                  return (
                    <li key={r}>
                      <a
                        className="underline decoration-silver/40 underline-offset-2 hover:text-ink"
                        href={href({ name: 'area', areaId: dep.areaId, entryId: dep.id })}
                      >
                        {dep.name}
                      </a>{' '}
                      <span className={met ? 'text-jade' : 'text-amber'}>{met ? '(done)' : '(not yet)'}</span>
                    </li>
                  );
                })}
              </ul>
            </Detail>
          )}
          {groupmates.length > 0 && (
            <Detail icon={<Users className="size-4 text-amber" />} label="Only one possible">
              Mutually exclusive with {groupmates.map((g) => g.name).join(' / ')}. Progress counts this group once.
            </Detail>
          )}
          {entry.missability !== 'none' && (
            <Detail
              icon={<AlertTriangle className={`size-4 ${entry.missability === 'permanent' ? 'text-crimson' : 'text-amber'}`} />}
              label={MISSABILITY_LABEL[entry.missability]}
            >
              {entry.lastOpportunity && <span className="block">Last chance: {entry.lastOpportunity}.</span>}
              <span className="block text-ink-3">Warning level: {PRIORITY_LABEL[warningPriority(entry)]}.</span>
              {entry.missableKind && entry.missability !== 'unconfirmed' && (
                <span className="block text-ink-3">{KIND_EXPLAINER[entry.missableKind]}</span>
              )}
              {entry.missability === 'unconfirmed' && (
                <span className="block text-ink-3">
                  None of the sources say whether this can be collected on a later visit, so get it now to be safe.
                </span>
              )}
            </Detail>
          )}
          {rewardUniqueness(entry) && entry.missability !== 'none' && (
            <Detail icon={<Gem className="size-4" />} label="Reward">
              {UNIQUENESS_LABEL[rewardUniqueness(entry)!]}
            </Detail>
          )}
          {entry.caveats?.map((c) => (
            <Detail key={c} icon={<Info className="size-4" />} label="Note">
              {c}
            </Detail>
          ))}
          {entry.spoilerText &&
            (showSpoiler ? (
              <Detail icon={<Eye className="size-4 text-gold" />} label="Spoiler">
                {entry.spoilerText}
              </Detail>
            ) : (
              <button type="button" className="ff-btn-ghost min-h-9 text-[13px]" onClick={() => setRevealed(true)}>
                <Eye className="size-4" /> Reveal spoiler
              </button>
            ))}
          {unmetRequires.length > 0 && !done && (
            <p className="text-[12px] text-amber">You can still tick this. Prerequisites are guidance, not locks.</p>
          )}
          <p className="flex items-center gap-1 text-[11px] text-ink-3">
            <Link2 className="size-3" aria-hidden="true" />
            {VERIFICATION_TEXT[entry.verification]}: {entry.sources.map((s) => SOURCE_SHORT[s]).join(', ')}
          </p>
        </div>
      )}
      {showArea && (
        <a
          href={href({ name: 'area', areaId: entry.areaId, entryId: entry.id })}
          className="mb-1 ml-12 inline-flex min-h-9 items-center gap-1 text-[12px] font-semibold text-gold-2 hover:underline"
        >
          Open in checklist →
        </a>
      )}
    </li>
  );
}

const VERIFICATION_TEXT = {
  verified: 'Cross-checked',
  'single-source': 'Single source',
  conflicting: 'Sources disagree',
  unverified: 'Unverified',
} as const;

function Detail({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <span className="mt-0.5 shrink-0 text-ink-3">{icon}</span>
      <div className="min-w-0">
        <span className="block text-[11px] font-semibold tracking-wider text-ink-3 uppercase">{label}</span>
        <div>{children}</div>
      </div>
    </div>
  );
}
