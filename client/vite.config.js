import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const base = process.env.VITE_BASE_PATH || '/';
export default defineConfig({
  base,
  plugins: [VitePWA({
    registerType: 'autoUpdate',
    base,
    includeAssets: ['compass-icon.svg','icon-192.png','icon-512.png','runtime-config.json'],
    manifest: {
      id: base,
      name: 'Compass – Personal Life Manager', short_name: 'Compass',
      description: 'Capture, clarify, review. GTD, local-first.',
      start_url: base, scope: base, display: 'standalone',
      theme_color: '#183c3d', background_color: '#f6f5f0',
      icons: [
        { src: `${base}icon-192.png`, sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
        { src: `${base}icon-512.png`, sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        { src: `${base}compass-icon.svg`, sizes: 'any', type: 'image/svg+xml', purpose: 'any' }
      ]
    },
    workbox: {
      navigateFallback: `${base}index.html`,
      globPatterns: ['**/*.{js,css,html,svg,png,json,webmanifest}'],
      runtimeCaching: [],
      cleanupOutdatedCaches: true
    }
  })],
  server: {port: 5173, strictPort:true}
});
