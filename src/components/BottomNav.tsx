import { BarChart3, ListChecks, Map, Search } from 'lucide-react';
import { ALL_AREAS } from '../data';
import { useProgress } from '../lib/progress';
import { href, type Route } from '../lib/router';

export function BottomNav({ route }: { route: Route }) {
  const { lastAreaId } = useProgress();
  const areaId = lastAreaId ?? ALL_AREAS[0].id;
  const items = [
    { key: 'journey', label: 'Journey', icon: Map, to: href({ name: 'journey' }), active: route.name === 'journey' },
    {
      key: 'area',
      label: 'Checklist',
      icon: ListChecks,
      to: href({ name: 'area', areaId }),
      active: route.name === 'area',
    },
    { key: 'search', label: 'Search', icon: Search, to: href({ name: 'search' }), active: route.name === 'search' },
    {
      key: 'progress',
      label: 'Progress',
      icon: BarChart3,
      to: href({ name: 'progress' }),
      active: route.name === 'progress' || route.name === 'about',
    },
  ];
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-silver/50"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
        background: 'linear-gradient(180deg, rgb(29 60 128 / 0.96) 0%, rgb(13 26 64 / 0.98) 100%)',
        boxShadow: '0 -8px 24px -8px rgb(0 0 0 / 0.7), inset 0 1px 0 rgb(255 255 255 / 0.12)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <ul className="mx-auto grid max-w-xl grid-cols-4">
        {items.map(({ key, label, icon: Icon, to, active }) => (
          <li key={key}>
            <a
              href={to}
              aria-current={active ? 'page' : undefined}
              className={`relative flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold tracking-wide transition-colors ${
                active ? 'text-gold-2' : 'text-ink-3 hover:text-ink'
              }`}
            >
              {active && (
                <span className="absolute top-0 h-0.5 w-10 rounded-full bg-gold shadow-[0_0_8px_rgb(233_196_106/0.8)]" />
              )}
              <Icon className="size-[22px]" strokeWidth={active ? 2.4 : 2} aria-hidden="true" />
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
