import { useSyncExternalStore } from 'react';

/**
 * Minimal hash router. Hash routing works under any GitHub Pages subpath
 * without a 404.html redirect, and survives offline reloads in the PWA.
 */

export type Route =
  | { name: 'journey' }
  | { name: 'area'; areaId: string; entryId?: string }
  | { name: 'search'; q?: string }
  | { name: 'progress' }
  | { name: 'about' };

export function parseHash(hash: string): Route {
  const h = hash.replace(/^#\/?/, '');
  const [path, query = ''] = h.split('?');
  const params = new URLSearchParams(query);
  const parts = path.split('/').filter(Boolean).map(decodeURIComponent);
  switch (parts[0]) {
    case 'area':
      return parts[1]
        ? { name: 'area', areaId: parts[1], entryId: params.get('entry') ?? undefined }
        : { name: 'journey' };
    case 'search':
      return { name: 'search', q: params.get('q') ?? undefined };
    case 'progress':
      return { name: 'progress' };
    case 'about':
      return { name: 'about' };
    default:
      return { name: 'journey' };
  }
}

export function href(route: Route): string {
  switch (route.name) {
    case 'journey':
      return '#/';
    case 'area':
      return `#/area/${encodeURIComponent(route.areaId)}${
        route.entryId ? `?entry=${encodeURIComponent(route.entryId)}` : ''
      }`;
    case 'search':
      return route.q ? `#/search?q=${encodeURIComponent(route.q)}` : '#/search';
    case 'progress':
      return '#/progress';
    case 'about':
      return '#/about';
  }
}

export function navigate(route: Route) {
  window.location.hash = href(route);
}

function subscribe(cb: () => void) {
  window.addEventListener('hashchange', cb);
  return () => window.removeEventListener('hashchange', cb);
}

const getHash = () => window.location.hash;

export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, getHash, () => '');
  return parseHash(hash);
}
