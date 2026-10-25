import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { compass5910StrengthHabitsBridge } from './compass5910-strength-habits-bridge.js';
import { nutrition3Bridge } from './nutrition3-bridge.js';
import { strength728Bridge } from './strength728-bridge.js';
import { strength729Bridge } from './strength729-bridge.js';
import { strength730Bridge } from './strength730-bridge.js';
import { nutrition731Bridge } from './nutrition731-bridge.js';
import { strengthNutrition732Bridge } from './strength-nutrition732-bridge.js';
import { nutritionStrength733Bridge } from './nutrition-strength733-bridge.js';
import { nutritionLongevity734Bridge } from './nutrition-longevity734-bridge.js';
import { strengthTouch735Bridge } from './strength-touch735-bridge.js';
import { nutrition736Bridge } from './nutrition736-bridge.js';
import { anatomyRecipes737Bridge } from './anatomy-recipes737-bridge.js';
import { nutritionPill577371Bridge } from './nutrition-pill-577371-bridge.js';
import { strengthPremium738Bridge } from './strength-premium738-bridge.js';
import { compass741Bridge } from './compass741-bridge.js';
import { strengthSync742Bridge } from './strength-sync742-bridge.js';
import { compass743Bridge } from './compass743-bridge.js';
import { compass744Bridge } from './compass744-bridge.js';
import { compass745Bridge } from './compass745-bridge.js';
import { compass746Bridge } from './compass746-bridge.js';
import { compass747Bridge } from './compass747-bridge.js';
import { compass748Bridge } from './compass748-bridge.js';
import { compass749Bridge } from './compass749-bridge.js';
import { compass750Bridge } from './compass750-bridge.js';
import { compass751Bridge } from './compass751-bridge.js';
import { compass752Bridge } from './compass752-bridge.js';
import { compass753Bridge } from './compass753-bridge.js';
import { compass754Bridge } from './compass754-bridge.js';
import { compass755Bridge } from './compass755-bridge.js';
import { compass756Bridge } from './compass756-bridge.js';
import { compass7593UxBridge } from './compass7593-ux-bridge.js';
import { compass757Bridge } from './compass757-bridge.js';
import { compass758Bridge } from './compass758-bridge.js';

const base = process.env.VITE_BASE_PATH || '/';
export default defineConfig({
  base,
  plugins: [compass5910StrengthHabitsBridge(), nutrition3Bridge(), strength728Bridge(), strength729Bridge(), strength730Bridge(), nutrition731Bridge(), strengthNutrition732Bridge(), nutritionStrength733Bridge(), nutritionLongevity734Bridge(), strengthTouch735Bridge(), nutrition736Bridge(), anatomyRecipes737Bridge(), nutritionPill577371Bridge(), strengthPremium738Bridge(), compass741Bridge(), strengthSync742Bridge(), compass743Bridge(), compass744Bridge(), compass745Bridge(), compass746Bridge(), compass747Bridge(), compass748Bridge(), compass749Bridge(), VitePWA({
    registerType: 'autoUpdate',
    base,
    includeAssets: ['compass-icon.svg','icon-192.png','icon-512.png','runtime-config.json'],
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
      navigateFallback: `${base}index.html`,
      globPatterns: ['**/*.{js,css,html,svg,png,json,webmanifest}'],
      // The opt-in exercise guides must NOT preload during install/update.
      globIgnores: ['**/*makko-ho-guide-v5775910*','**/*strength-coach-v5775910*'],
      // Cache guide chunks only AFTER the user first clicks Play / Coach.
      // Subsequent use is offline-capable once those chunks have been opened.
      runtimeCaching: [{
        urlPattern: /(?:makko-ho-guide|strength-coach)-v5775910[^/]*\.(?:js|css)$/,
        handler: 'CacheFirst',
        options: {cacheName:'compass-guides-on-demand-v1',cacheableResponse:{statuses:[0,200]}}
      }],
      cleanupOutdatedCaches: true
    }
  }),
  // Guarded 0.5.77.50 transform executes before VitePWA because enforce='pre'.
  // .59.3 UX runs after the legacy PWA declaration, before the .50-.58 chain.
  // It is still a pre-transform (enforce: pre); no historical adjacency is broken.
  compass7593UxBridge(),
  compass750Bridge(), compass751Bridge(), compass752Bridge(), compass753Bridge(), compass754Bridge(), compass755Bridge(), compass756Bridge(), compass757Bridge(), compass758Bridge()],
  server: {port: 5173, strictPort:true}
});
