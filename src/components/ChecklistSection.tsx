import { ChevronDown } from 'lucide-react';
import type { ChecklistEntry } from '../types/game';
import { ALL_ENTRIES } from '../data';
import { progressStore } from '../lib/progress';
import { isExcluded, progressOf, type Completed } from '../lib/stats';
import { EntryRow } from './EntryRow';

interface Props {
  sectionKey: string;
  title: string;
  entries: ChecklistEntry[];
  completed: Completed;
  collapsed: boolean;
  hideCompleted: boolean;
  spoilersAllowed: boolean;
  highlightId?: string;
}

export function ChecklistSection({
  sectionKey,
  title,
  entries,
  completed,
  collapsed,
  hideCompleted,
  spoilersAllowed,
  highlightId,
}: Props) {
  const t = progressOf(entries, completed);
  const complete = t.done === t.total;
  // A highlighted entry always forces its section open.
  const forcedOpen = !!highlightId && entries.some((e) => e.id === highlightId);
  const isCollapsed = collapsed && !forcedOpen;
  const visible = entries.filter(
    (e) => !hideCompleted || !(e.id in completed) || e.id === highlightId,
  );
  const panelId = `section-${sectionKey}`;

  return (
    <section className="ff-window overflow-hidden" aria-label={title}>
      <h2>
        <button
          type="button"
          aria-expanded={!isCollapsed}
          aria-controls={panelId}
          onClick={() => progressStore.setCollapsed(sectionKey, !isCollapsed)}
          className="flex min-h-12 w-full items-center gap-3 px-4 py-2 text-left"
        >
          <span className={`ff-title flex-1 text-[15px] font-semibold ${complete ? 'text-gold-2' : 'text-ink'}`}>
            {title}
          </span>
          <span className={`tabular text-[13px] font-semibold ${complete ? 'text-gold' : 'text-ink-2'}`}>
            {t.done}/{t.total}
          </span>
          <ChevronDown
            className={`size-5 text-ink-3 transition-transform duration-200 ${isCollapsed ? '-rotate-90' : ''}`}
            aria-hidden="true"
          />
        </button>
      </h2>
      {!isCollapsed && (
        <div id={panelId} className="border-t border-silver/25 px-1.5 py-1.5">
          {visible.length === 0 ? (
            <p className="px-3 py-3 text-[13px] text-ink-3">All done here. Completed entries are hidden.</p>
          ) : (
            <ul className="divide-y divide-silver/10">
              {visible.map((e) => (
                <EntryRow
                  key={e.id}
                  entry={e}
                  done={e.id in completed}
                  excluded={isExcluded(e, completed, ALL_ENTRIES)}
                  completed={completed}
                  spoilersAllowed={spoilersAllowed}
                  highlight={e.id === highlightId}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
