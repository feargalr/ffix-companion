import { normaliseState, SCHEMA_VERSION, type ProgressState } from './progress';

export const EXPORT_APP_ID = 'ffix-companion';

export interface ExportFile {
  app: typeof EXPORT_APP_ID;
  version: number;
  exportedAt: string;
  state: ProgressState;
}

export function buildExport(state: ProgressState, now = new Date()): ExportFile {
  return { app: EXPORT_APP_ID, version: SCHEMA_VERSION, exportedAt: now.toISOString(), state };
}

export function exportFilename(now = new Date()): string {
  return `ffix-progress-${now.toISOString().slice(0, 10)}.json`;
}

export type ImportResult =
  | { ok: true; state: ProgressState; knownCount: number; unknownIds: string[] }
  | { ok: false; error: string };

const MAX_BYTES = 2_000_000;

/**
 * Validate an exported file before it replaces local progress. Unknown entry
 * IDs are kept (they may belong to a newer data version) but reported.
 */
export function parseImport(text: string, knownIds: Set<string>): ImportResult {
  if (text.length > MAX_BYTES) return { ok: false, error: 'File is too large to be a progress export.' };
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: 'This file is not valid JSON.' };
  }
  if (!raw || typeof raw !== 'object') return { ok: false, error: 'Unexpected file contents.' };
  const r = raw as Record<string, unknown>;
  if (r.app !== EXPORT_APP_ID) {
    return { ok: false, error: 'This does not look like an FFIX Companion export.' };
  }
  if (typeof r.version !== 'number' || r.version > SCHEMA_VERSION) {
    return { ok: false, error: 'This export was made by a newer version of the app. Update first, then import.' };
  }
  if (!r.state || typeof r.state !== 'object') return { ok: false, error: 'The export has no progress data.' };
  const s = r.state as Record<string, unknown>;
  if (s.completed !== undefined && (typeof s.completed !== 'object' || Array.isArray(s.completed))) {
    return { ok: false, error: 'The completed-entries list is malformed.' };
  }

  const state = normaliseState(r.state);
  const ids = Object.keys(state.completed);
  const unknownIds = ids.filter((id) => !knownIds.has(id));
  return { ok: true, state, knownCount: ids.length - unknownIds.length, unknownIds };
}
