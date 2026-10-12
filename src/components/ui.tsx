import { Check } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Missability, MissableKind } from '../types/game';
import { missableBadge } from '../lib/labels';

export function ProgressBar({ pct, tone = 'blue', label }: { pct: number; tone?: 'blue' | 'gold'; label?: string }) {
  const fill =
    tone === 'gold'
      ? 'linear-gradient(90deg, #c99a3a, #e9c46a 60%, #f6dc9b)'
      : 'linear-gradient(90deg, #3a6cc0, #6fa0e6 70%, #a9c8f5)';
  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full bg-night/70 ring-1 ring-silver/30"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-label={label}
    >
      <div
        className="h-full rounded-full transition-[width] duration-500 ease-out"
        style={{ width: `${pct}%`, background: fill }}
      />
    </div>
  );
}

export function ProgressRing({ pct, size = 44, stroke = 4 }: { pct: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const complete = pct >= 100;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="rgb(8 15 40 / 0.6)" stroke="rgb(170 187 209 / 0.25)" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={complete ? '#e9c46a' : '#6fa0e6'}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct / 100)}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 500ms ease-out' }}
      />
      {complete ? (
        <path
          d={`M${size * 0.32} ${size * 0.52} l${size * 0.12} ${size * 0.12} l${size * 0.24} -${size * 0.26}`}
          fill="none"
          stroke="#e9c46a"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          fill="#f5f7ff"
          fontSize={size * 0.27}
          fontWeight={600}
          className="tabular"
        >
          {pct}
        </text>
      )}
    </svg>
  );
}

const BADGE_TONE: Record<Missability, string> = {
  permanent: 'bg-crimson/20 text-[#ffb3ba] ring-1 ring-crimson/60',
  conditional: 'bg-amber/15 text-[#ffd09a] ring-1 ring-amber/55',
  unconfirmed: 'bg-amber/10 text-[#f5d7a8] ring-1 ring-amber/35',
  temporary: 'bg-highlight/20 text-ink-2 ring-1 ring-highlight/50',
  none: '',
};

export function MissableBadge({ missability, kind }: { missability: Missability; kind?: MissableKind }) {
  const text = missableBadge(missability, kind);
  if (!text) return null;
  return <span className={`ff-chip ${BADGE_TONE[missability]}`}>{text}</span>;
}

export function Chip({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`ff-chip bg-night/50 text-ink-2 ring-1 ring-silver/30 ${className}`}>{children}</span>;
}

/** The classic gloved pointer, drawn from scratch. */
export function Pointer({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 16" className={className} aria-hidden="true">
      <path
        d="M1.5 6.2h10.2l-1.6-2.4c-.5-.8.5-1.7 1.3-1.1l4.7 3.3h3.6c1.8 0 2.8 1.2 2.8 2.6v1.2c0 1.6-1.2 2.9-2.9 2.9h-6.9c-1.1 0-2-.7-2.3-1.7H1.5c-.8 0-1.3-.6-1.3-1.4v-2c0-.8.5-1.4 1.3-1.4z"
        fill="#f5f7ff"
        stroke="#5c6f93"
        strokeWidth="1"
      />
      <path d="M14 9.4h4.5M14 11.3h3.8" stroke="#8ea0c2" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  );
}

export function CheckBox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
      className="group grid size-11 shrink-0 place-items-center rounded-lg"
    >
      <span
        className={`grid size-7 place-items-center rounded-md border-2 transition-colors duration-200 ${
          checked
            ? 'anim-glint border-gold bg-linear-to-b from-gold-2 to-gold'
            : 'border-silver/80 bg-night/60 group-hover:border-ink'
        }`}
      >
        {checked && <Check className="anim-pop size-5 text-[#2a1d00]" strokeWidth={3.5} />}
      </span>
    </button>
  );
}

/** Ornamental divider: two silver rules meeting at a gold diamond. */
export function Ornament({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 12" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="orn-l" x1="0" x2="1">
          <stop offset="0" stopColor="#aabbd1" stopOpacity="0" />
          <stop offset="1" stopColor="#aabbd1" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="orn-r" x1="1" x2="0">
          <stop offset="0" stopColor="#aabbd1" stopOpacity="0" />
          <stop offset="1" stopColor="#aabbd1" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <rect x="0" y="5.5" width="104" height="1" fill="url(#orn-l)" />
      <rect x="136" y="5.5" width="104" height="1" fill="url(#orn-r)" />
      <path d="M120 0.5 L125.5 6 L120 11.5 L114.5 6 Z" fill="#e9c46a" />
      <path d="M109 6 L111.5 3.5 L114 6 L111.5 8.5 Z M126 6 L128.5 3.5 L131 6 L128.5 8.5 Z" fill="#aabbd1" />
    </svg>
  );
}

export function SectionHeading({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="mb-2 flex items-end justify-between gap-3 px-1">
      <h2 className="ff-title text-[15px] font-semibold text-gold-2 uppercase">{children}</h2>
      {right}
    </div>
  );
}
