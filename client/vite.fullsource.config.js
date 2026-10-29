import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
/** Freeze-build: main-full-v57759402510.js was produced by all previous
 * transforms and verified with syntactic/integrity checks. Reapplying them
 * would double patch hooks. Historic vite.config.js remains for audit/tests. */
const base=process.env.VITE_BASE_PATH || '/';
const snapshotEntry={
 name:'compass-full-25-10-entry',enforce:'pre',
 transformIndexHtml(html){
  const oldMain='<script type="module" src="/src/main.js"></script>';
  const oldLock='<script type="module" src="/src/ars-vivendi-lock-v5775922.js"></script>';
  if(!html.includes(oldMain)||!html.includes(oldLock))throw Error('Full snapshot entry: unexpected HTML');
  return html.replace(oldMain,'<script type="module" src="/src/main-full-v57759402510.js"></script>')
    .replace(oldLock,'<script type="module" src="/src/ars-vivendi-lock-full-v5775922.js"></script>');
 }
};
export default defineConfig({base,plugins:[snapshotEntry,
VitePWA({
    registerType: 'autoUpdate',
    base,
    includeAssets: ['compass-icon.svg','icon-192.png','icon-512.png','runtime-config.json','ars-vivendi-moonlit-desktop-v5775932.webp'],
    manifest: {
      id: base,
      name: 'Compass – Personal Life Manager', short_name: 'Compass',
      description: 'Capture, clarify, review. GTD, local-first.',
      start_url: base, scope: base, display: 'standalone',
      shortcuts: [
        {name:'Schnellerfassung',short_name:'Erfassen',description:'Neuen Gedanken in Compass erfassen',url:`${base}?capture=1`,icons:[{src:`${base}icon-192.png`,sizes:'192x192',type:'image/png'}]},
        {name:'Inbox öffnen',short_name:'Inbox',description:'Deine Compass Inbox öffnen',url:`${base}?view=inbox`,icons:[{src:`${base}icon-192.png`,sizes:'192x192',type:'image/png'}]}
      ],
      theme_color: '#f7f8f6', background_color: '#f7f8f6',
      icons: [
        { src: `${base}icon-192.png`, sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
        { src: `${base}icon-512.png`, sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        { src: `${base}compass-icon.svg`, sizes: 'any', type: 'image/svg+xml', purpose: 'any' }
      ]
    },
    workbox: {
      // The annual report adds source code to the main bundle. Workbox defaults to 2 MiB,
      // which rejected the 2,098,390-byte main asset on GitHub Actions #309.
      // The limit controls offline precaching only; it does not modify user data.
      maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      navigateFallback: `${base}index.html`,
      globPatterns: ['**/*.{js,css,html,svg,png,json,webmanifest}'],
      globIgnores: ['**/*makko-ho-guide-v5775910*','**/*strength-coach-v5775910*'],
      runtimeCaching: [{
        urlPattern: /(?:makko-ho-guide|strength-coach)-v5775910[^/]*\.(?:js|css)$/,
        handler: 'CacheFirst',
        options: {cacheName:'compass-guides-on-demand-v1',cacheableResponse:{statuses:[0,200]}}
      },{
        urlPattern: /\/makko-ho-illustrations-v5775911\/(?:metal|earth|fire|water|innerfire|wood)\.webp$/,
        handler: 'CacheFirst',
        options: {cacheName:'compass-makko-art-on-demand-v5775911',cacheableResponse:{statuses:[0,200]},expiration:{maxEntries:6,maxAgeSeconds:31536000}}
      },{
        // Load V-Taper premium photos only when their exercise is opened, then reuse offline.
        urlPattern: /\/strength-visuals-v5775928\/(?:pike-pushup|decline-pushup|prone-y-raise)\.webp$/,
        handler: 'CacheFirst',
        options: {cacheName:'compass-vtaper-photos-v5928',cacheableResponse:{statuses:[0,200]},expiration:{maxEntries:3,maxAgeSeconds:31536000}}
      }],
      cleanupOutdatedCaches: true
    }
  })
],server:{port:5173,strictPort:true}});
