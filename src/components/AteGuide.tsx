import { ChevronDown, Clapperboard } from 'lucide-react';
import { useState } from 'react';
import type { Area } from '../types/game';

const KIND = {
  select: { label: 'Select', className: 'bg-highlight/25 text-ink ring-highlight/60' },
  auto: { label: 'Automatic', className: 'bg-night/60 text-ink-2 ring-silver/30' },
  note: { label: 'Then', className: 'bg-transparent text-ink-3 ring-silver/20' },
} as const;

/** Compact, spoiler-free ATE viewing order for areas with chained ATEs. */
export function AteGuide({ steps }: { steps: NonNullable<Area['ateGuide']> }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="ff-window-quiet">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-11 w-full items-center gap-2 px-4 text-left"
      >
        <Clapperboard className="size-4 text-gold" aria-hidden="true" />
        <span className="flex-1 text-[14px] font-semibold text-ink">ATE viewing order</span>
        <ChevronDown className={`size-5 text-ink-3 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open && (
        <div className="anim-fade-up px-4 pb-4">
          <p className="mb-2 text-[12px] text-ink-3">
            “Select” ATEs are chosen from the ATE prompt; you usually need to change screens before the next one is offered.
            “Automatic” scenes play by themselves.
          </p>
          <ol className="space-y-2">
            {steps.map((s, i) => (
              <li key={i} className="flex gap-2 text-[14px] leading-snug text-ink-2">
                <span className={`ff-chip mt-0.5 h-fit shrink-0 ring-1 ${KIND[s.kind].className}`}>{KIND[s.kind].label}</span>
                <span>{s.text}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
