import { useSyncExternalStore } from 'react';

/**
 * Progress store backed by localStorage. Completion is keyed by stable entry
 * IDs, so content updates never reset progress. IDs that no longer exist in the
 * dataset are kept (they're harmless and may come back), just not counted.
 */

export const STORAGE_KEY = 'ffix-companion/progress/v1';
export const SCHEMA_VERSION = 1;

export type SpoilerMode = 'safe' | 'all';

export interface Settings {
  spoilers: SpoilerMode;
  hideCompleted: boolean;
  /** One-off notices the player has dismissed (e.g. data migrations). */
  dismissedNotices: string[];
}

export interface ProgressState {
  version: typeof SCHEMA_VERSION;
  /** entry id -> epoch ms when ticked */
  completed: Record<string, number>;
  lastAreaId?: string;
  /** Highest play-order index the player has opened; drives spoiler gating. */
  furthestAreaIndex: number;
  /** Collapsed section keys, e.g. "lindblum:ate" */
  collapsed: Record<string, true>;
  settings: Settings;
}

export const DEFAULT_SETTINGS: Settings = { spoilers: 'safe', hideCompleted: false, dismissedNotices: [] };

export function emptyState(): ProgressState {
  return {
    version: SCHEMA_VERSION,
    completed: {},
    furthestAreaIndex: 0,
    collapsed: {},
    settings: { ...DEFAULT_SETTINGS, dismissedNotices: [] },
  };
}

type Listener = () => void;

function safeStorage(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}

/** Coerce anything read from storage into a valid state, dropping junk. */
export function normaliseState(raw: unknown): ProgressState {
  const base = emptyState();
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Record<string, unknown>;
  if (r.completed && typeof r.completed === 'object') {
    for (const [k, v] of Object.entries(r.completed as Record<string, unknown>)) {
      if (typeof k === 'string' && k.length <= 200 && typeof v === 'number' && Number.isFinite(v)) {
        base.completed[k] = v;
      }
    }
  }
  if (typeof r.lastAreaId === 'string') base.lastAreaId = r.lastAreaId;
  if (typeof r.furthestAreaIndex === 'number' && r.furthestAreaIndex >= 0) {
    base.furthestAreaIndex = Math.floor(r.furthestAreaIndex);
  }
  if (r.collapsed && typeof r.collapsed === 'object') {
    for (const [k, v] of Object.entries(r.collapsed as Record<string, unknown>)) {
      if (v === true) base.collapsed[k] = true;
    }
  }
  if (r.settings && typeof r.settings === 'object') {
    const s = r.settings as Record<string, unknown>;
    if (s.spoilers === 'safe' || s.spoilers === 'all') base.settings.spoilers = s.spoilers;
    if (typeof s.hideCompleted === 'boolean') base.settings.hideCompleted = s.hideCompleted;
    if (Array.isArray(s.dismissedNotices)) {
      base.settings.dismissedNotices = s.dismissedNotices.filter((n): n is string => typeof n === 'string').slice(0, 50);
    }
  }
  return base;
}

export function createProgressStore(storage: Storage | null = safeStorage()) {
  let state: ProgressState = load();
  const listeners = new Set<Listener>();

  function load(): ProgressState {
    if (!storage) return emptyState();
    try {
      const text = storage.getItem(STORAGE_KEY);
      return text ? normaliseState(JSON.parse(text)) : emptyState();
    } catch {
      return emptyState();
    }
  }

  function persist() {
    if (!storage) return;
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Quota exceeded or storage blocked: keep working in memory.
    }
  }

  function set(next: ProgressState) {
    state = next;
    persist();
    listeners.forEach((l) => l());
  }

  return {
    getState: () => state,
    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    isDone: (id: string) => id in state.completed,
    setDone(id: string, done: boolean) {
      if (done === id in state.completed) return;
      const completed = { ...state.completed };
      if (done) completed[id] = Date.now();
      else delete completed[id];
      set({ ...state, completed });
    },
    toggle(id: string) {
      this.setDone(id, !(id in state.completed));
    },
    visitArea(id: string, index: number) {
      if (state.lastAreaId === id && state.furthestAreaIndex >= index) return;
      set({ ...state, lastAreaId: id, furthestAreaIndex: Math.max(state.furthestAreaIndex, index) });
    },
    setCollapsed(key: string, collapsed: boolean) {
      const next = { ...state.collapsed };
      if (collapsed) next[key] = true;
      else delete next[key];
      set({ ...state, collapsed: next });
    },
    updateSettings(patch: Partial<Settings>) {
      set({ ...state, settings: { ...state.settings, ...patch } });
    },
    dismissNotice(id: string) {
      if (state.settings.dismissedNotices.includes(id)) return;
      set({ ...state, settings: { ...state.settings, dismissedNotices: [...state.settings.dismissedNotices, id] } });
    },
    replace(next: ProgressState) {
      set(normaliseState(next));
    },
    reset() {
      set(emptyState());
    },
    /** Re-read storage (e.g. another tab changed it). */
    reload() {
      set(load());
    },
  };
}

export type ProgressStore = ReturnType<typeof createProgressStore>;

export const progressStore = createProgressStore();

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) progressStore.reload();
  });
}

export function useProgress(): ProgressState {
  return useSyncExternalStore(progressStore.subscribe, progressStore.getState, progressStore.getState);
}
