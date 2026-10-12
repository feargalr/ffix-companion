import { useEffect } from 'react';
import { BottomNav } from './components/BottomNav';
import { UpdatePrompt } from './components/UpdatePrompt';
import { AREA_BY_ID } from './data';
import { useRoute } from './lib/router';
import { AboutPage } from './pages/AboutPage';
import { AreaPage } from './pages/AreaPage';
import { JourneyPage } from './pages/JourneyPage';
import { ProgressPage } from './pages/ProgressPage';
import { SearchPage } from './pages/SearchPage';

export default function App() {
  const route = useRoute();

  const pageTitle =
    route.name === 'area'
      ? AREA_BY_ID.get(route.areaId)?.location
      : route.name === 'journey'
        ? undefined
        : route.name[0].toUpperCase() + route.name.slice(1);

  useEffect(() => {
    document.title = pageTitle ? `${pageTitle} · FFIX Companion` : 'FFIX Adventure Companion';
  }, [pageTitle]);

  // Area pages manage their own scroll (deep links scroll to an entry).
  useEffect(() => {
    if (route.name !== 'area') window.scrollTo({ top: 0 });
  }, [route.name]);

  return (
    <>
      {/* A button, not an anchor: "#main" would be read as a route by the hash router. */}
      <button
        type="button"
        onClick={() => document.getElementById('main')?.focus()}
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-panel focus:p-2"
      >
        Skip to content
      </button>
      <main id="main" tabIndex={-1} className="pb-safe-nav mx-auto max-w-xl px-4 outline-none">
        {route.name === 'journey' && <JourneyPage />}
        {route.name === 'area' && <AreaPage key={route.areaId} areaId={route.areaId} entryId={route.entryId} />}
        {route.name === 'search' && <SearchPage key={route.q ?? ''} initialQuery={route.q} />}
        {route.name === 'progress' && <ProgressPage />}
        {route.name === 'about' && <AboutPage />}
      </main>
      <BottomNav route={route} />
      <UpdatePrompt />
    </>
  );
}
