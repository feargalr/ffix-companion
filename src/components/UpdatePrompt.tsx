import { RefreshCw, WifiOff, X } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';

/**
 * Service-worker lifecycle UI. A new deploy is never applied mid-session
 * without asking: the player taps "Update" when convenient.
 */
export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, reg) {
      // Check for a new version hourly while the app stays open.
      if (reg) setInterval(() => void reg.update(), 60 * 60 * 1000);
    },
  });

  if (!needRefresh && !offlineReady) return null;

  return (
    <div
      role="status"
      className="anim-fade-up fixed inset-x-3 z-40 mx-auto max-w-md"
      style={{ bottom: 'calc(5rem + env(safe-area-inset-bottom))' }}
    >
      <div className="ff-window flex items-center gap-3 p-3">
        {needRefresh ? (
          <RefreshCw className="size-5 shrink-0 text-gold" aria-hidden="true" />
        ) : (
          <WifiOff className="size-5 shrink-0 text-jade" aria-hidden="true" />
        )}
        <p className="flex-1 text-[13px] text-ink">
          {needRefresh ? 'A new version is available.' : 'Ready to work offline.'}
        </p>
        {needRefresh && (
          <button type="button" className="ff-btn-gold min-h-9 px-3 text-[13px]" onClick={() => void updateServiceWorker(true)}>
            Update
          </button>
        )}
        <button
          type="button"
          aria-label="Dismiss"
          className="grid size-9 place-items-center text-ink-3"
          onClick={() => {
            setNeedRefresh(false);
            setOfflineReady(false);
          }}
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
