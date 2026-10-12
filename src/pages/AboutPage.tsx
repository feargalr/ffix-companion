import { ArrowLeft, ExternalLink } from 'lucide-react';
import { SOURCES } from '../data/sources';
import { ALL_IMAGES, CONDITIONS_URL } from '../data/images';
import { SquareEnixNotice } from '../components/OfficialImage';
import { ALL_ENTRIES } from '../data';
import { href } from '../lib/router';
import { SectionHeading } from '../components/ui';

export function AboutPage() {
  const single = ALL_ENTRIES.filter((e) => e.verification === 'single-source').length;
  const conflicting = ALL_ENTRIES.filter((e) => e.verification === 'conflicting').length;
  const unconfirmed = ALL_ENTRIES.filter((e) => e.missability === 'unconfirmed').length;
  return (
    <div className="space-y-6">
      <header className="pt-safe flex items-center gap-2 px-1 pt-4">
        <a href={href({ name: 'progress' })} aria-label="Back to Progress" className="grid size-11 place-items-center text-ink-2">
          <ArrowLeft className="size-5" />
        </a>
        <h1 className="ff-title text-[22px] font-semibold text-ink">About</h1>
      </header>

      <section className="ff-window-quiet space-y-3 p-4 text-[14px] leading-relaxed text-ink-2">
        <p>
          An area-by-area completionist checklist for <em>Final Fantasy IX</em>, built for the Nintendo Switch release
          (which also runs on Switch 2). Every description here is written from scratch from checked facts. No guide text,
          screenshots or game assets are reproduced.
        </p>
        <p>
          This is an unofficial fan project. It isn’t affiliated with or endorsed by Square Enix. FINAL FANTASY is a
          registered trademark of Square Enix Holdings Co., Ltd.
        </p>
        <p>
          Free and non-commercial. The code and original writing are shared under the PolyForm Noncommercial License
          1.0.0.
        </p>
      </section>

      <section aria-label="Legend">
        <SectionHeading>How missables are labelled</SectionHeading>
        <dl className="ff-window-quiet space-y-3 p-4 text-[13px] leading-relaxed">
          <Term t="Missable · Unique" tone="text-[#ffb3ba]">
            A unique or strictly limited item or reward (Moonstone, key items, Stiltzkin’s deals) that’s gone for good after
            a story point.
          </Term>
          <Term t="One-time pickup / steal" tone="text-[#ffb3ba]">
            That chest, pickup or boss steal disappears, but the item itself is common or available elsewhere. The notes
            say where.
          </Term>
          <Term t="Missable event" tone="text-[#ffb3ba]">An ATE or scene with no unique reward.</Term>
          <Term t="Conditional" tone="text-[#ffd09a]">
            Depends on a choice, an order of actions, or mutually exclusive outcomes (e.g. the Festival prize).
          </Term>
          <Term t="Collect now (revisit unconfirmed)" tone="text-[#f5d7a8]">
            None of the sources say whether you can return for it. Shown as a lower-risk warning.
          </Term>
          <Term t="Returns later" tone="text-ink-2">
            Unavailable for a while, but it comes back on a later disc.
          </Term>
        </dl>
      </section>

      <section aria-label="Accuracy">
        <SectionHeading>Accuracy</SectionHeading>
        <div className="ff-window-quiet space-y-2 p-4 text-[13px] leading-relaxed text-ink-2">
          <p>
            Disc 1 has {ALL_ENTRIES.length} entries, audited in October 2026 against four walkthroughs plus dedicated ATE
            and Chocograph guides. {single} rest on a single source (“1 source”), and on {conflicting} the sources
            disagree (“Sources disagree”, explained in the entry’s notes). {unconfirmed} entries are marked “Collect now”
            because no source says whether they can still be collected later.
          </p>
          <p>
            Warnings are ranked by consequence. <strong className="text-[#ffb3ba]">Critical</strong> means a unique reward
            or a choice with lasting effects. <strong className="text-[#ffd09a]">Important</strong> covers missable ATEs,
            Stiltzkin, letters and key steals. Ordinary pickups are kept as lower priority.
          </p>
        </div>
      </section>

      <section aria-label="Nintendo Switch notes">
        <SectionHeading>Nintendo Switch notes</SectionHeading>
        <ul className="ff-window-quiet list-disc space-y-2 p-4 pl-8 text-[13px] leading-relaxed text-ink-2 marker:text-gold/70">
          <li>
            The Switch version has no achievement system. Steam/PlayStation/Xbox achievements are only mentioned for
            context and are never counted as checklist goals.
          </li>
          <li>
            Button names in the sources follow PlayStation layouts. On Switch, “confirm” is the A button by default.
          </li>
          <li>
            GameFAQs notes that the modern ports (Steam, PS4, mobile) have more forgiving sword-fight timing than the
            original PlayStation release. The Switch release is built on the same modern port.
          </li>
          <li>
            The modern ports have optional boosters (such as high speed and no encounters). They don’t change what can be
            collected, though turning off encounters also stops friendly monsters and Ragtime Mouse from appearing.
          </li>
        </ul>
      </section>

      <section aria-label="Images">
        <SectionHeading>Images</SectionHeading>
        <div className="ff-window-quiet space-y-2 p-4 text-[13px] leading-relaxed text-ink-2">
          <p>
            Character art and the four location screenshots come from the official Japanese FINAL FANTASY IX website.
            They are used under Square Enix’s published{' '}
            <a className="text-gold-2 underline" href={CONDITIONS_URL} target="_blank" rel="noreferrer">
              FFIX usage conditions
            </a>{' '}
            for non-commercial fan use: unaltered apart from trimming, resizing and format conversion, with the notice
            below, and removed on request.
          </p>
          <ul className="space-y-1 text-[12px] text-ink-3">
            {ALL_IMAGES.map((img) => (
              <li key={img.file}>
                <a className="underline" href={img.sourceUrl} target="_blank" rel="noreferrer">
                  {img.file.split('/').pop()}
                </a>{' '}
                — {img.modification}
              </li>
            ))}
          </ul>
          <SquareEnixNotice />
        </div>
      </section>

      <section aria-label="Sources">
        <SectionHeading>Sources</SectionHeading>
        <ul className="space-y-2">
          {Object.values(SOURCES).map((s) => (
            <li key={s.id} className="ff-window-quiet p-4">
              <a href={s.url} target="_blank" rel="noreferrer" className="flex items-start gap-2 text-[14px] font-semibold text-gold-2">
                <span className="flex-1">{s.title}</span>
                <ExternalLink className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              </a>
              <p className="text-[12px] text-ink-3">{s.author}</p>
              <p className="mt-1 text-[13px] text-ink-2">{s.note}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Term({ t, tone, children }: { t: string; tone: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className={`font-semibold ${tone}`}>{t}</dt>
      <dd className="text-ink-2">{children}</dd>
    </div>
  );
}
