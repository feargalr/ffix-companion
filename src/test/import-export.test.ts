import { describe, expect, it } from 'vitest';
import { buildExport, exportFilename, parseImport } from '../lib/importExport';
import { emptyState } from '../lib/progress';

const known = new Set(['d1.a.one', 'd1.a.two']);

describe('import / export', () => {
  it('round-trips progress', () => {
    const state = { ...emptyState(), completed: { 'd1.a.one': 123 }, lastAreaId: 'dali' };
    const res = parseImport(JSON.stringify(buildExport(state)), known);
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.state.completed).toEqual({ 'd1.a.one': 123 });
      expect(res.state.lastAreaId).toBe('dali');
      expect(res.knownCount).toBe(1);
    }
  });

  it('names the file with the date', () => {
    expect(exportFilename(new Date('2026-10-12T00:00:00Z'))).toBe('ffix-progress-2026-10-12.json');
  });

  it('rejects invalid JSON', () => {
    expect(parseImport('{nope', known)).toMatchObject({ ok: false });
  });

  it('rejects files from other apps', () => {
    expect(parseImport(JSON.stringify({ app: 'other', version: 1, state: {} }), known)).toMatchObject({ ok: false });
  });

  it('rejects exports from a newer schema', () => {
    const res = parseImport(JSON.stringify({ app: 'ffix-companion', version: 99, state: {} }), known);
    expect(res.ok).toBe(false);
  });

  it('rejects a malformed completed list', () => {
    const res = parseImport(JSON.stringify({ app: 'ffix-companion', version: 1, state: { completed: ['a'] } }), known);
    expect(res.ok).toBe(false);
  });

  it('keeps but reports unknown IDs', () => {
    const file = buildExport({ ...emptyState(), completed: { 'd1.a.one': 1, 'd2.future.x': 2 } });
    const res = parseImport(JSON.stringify(file), known);
    expect(res.ok && res.unknownIds).toEqual(['d2.future.x']);
    expect(res.ok && res.state.completed['d2.future.x']).toBe(2);
  });
});
