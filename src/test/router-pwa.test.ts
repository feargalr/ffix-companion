import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { href, parseHash, type Route } from '../lib/router';
import { pwaOptions } from '../../pwa.config';

describe('router', () => {
  const routes: Route[] = [
    { name: 'journey' },
    { name: 'area', areaId: 'dali' },
    { name: 'area', areaId: 'dali', entryId: 'd1.dali.inn-potion' },
    { name: 'search', q: "qu's marsh" },
    { name: 'progress' },
    { name: 'about' },
  ];
  it.each(routes)('round-trips %o', (r) => {
    expect(parseHash(href(r))).toEqual(r);
  });

  it('falls back to the journey for unknown hashes', () => {
    expect(parseHash('#/nonsense')).toEqual({ name: 'journey' });
    expect(parseHash('')).toEqual({ name: 'journey' });
  });
});

describe('PWA configuration', () => {
  const manifest = pwaOptions.manifest as Exclude<typeof pwaOptions.manifest, false | undefined>;

  it('asks before applying updates', () => {
    expect(pwaOptions.registerType).toBe('prompt');
  });

  it('uses relative start_url/scope so it works under a GitHub Pages subpath', () => {
    expect(manifest.start_url).toBe('.');
    expect(manifest.scope).toBe('.');
    expect(manifest.display).toBe('standalone');
  });

  it('ships every icon it references, including a maskable one', () => {
    for (const icon of manifest.icons ?? []) {
      expect(existsSync(resolve('public', icon.src)), icon.src).toBe(true);
    }
    expect(manifest.icons?.some((i) => i.purpose === 'maskable')).toBe(true);
    expect(existsSync(resolve('public/apple-touch-icon.png'))).toBe(true);
  });

  it('precaches fonts and the app shell for offline use', () => {
    expect(pwaOptions.workbox?.globPatterns?.join()).toMatch(/woff2/);
    expect(pwaOptions.workbox?.navigateFallback).toBe('index.html');
  });

  it('references icons via BASE_URL in index.html', () => {
    const html = readFileSync(resolve('index.html'), 'utf8');
    expect(html).toContain('%BASE_URL%apple-touch-icon.png');
    expect(html).toContain('viewport-fit=cover');
  });
});
