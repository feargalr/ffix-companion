import type { VitePWAOptions } from 'vite-plugin-pwa';

/** PWA options, kept separate from vite.config.ts so tests can inspect them. */
export const pwaOptions: Partial<VitePWAOptions> = {
  // "prompt": a new deploy waits until the player taps Update, so it never
  // reloads the page mid-checklist.
  registerType: 'prompt',
  includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
  manifest: {
    name: 'FFIX Adventure Companion',
    short_name: 'FFIX Companion',
    description: 'Area-by-area completionist checklist for Final Fantasy IX: treasure, ATEs, missables and sidequests.',
    theme_color: '#0b1534',
    background_color: '#080f28',
    display: 'standalone',
    orientation: 'portrait',
    // Relative so the app works under any GitHub Pages subpath.
    start_url: '.',
    scope: '.',
    icons: [
      { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
      { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
      { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2,webmanifest}'],
    navigateFallback: 'index.html',
    cleanupOutdatedCaches: true,
  },
};
