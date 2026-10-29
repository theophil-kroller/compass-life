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
import { compass5928VtaperLuxBridge } from './compass5928-vtaper-lux-bridge.js';
import { compass5929BreakfastBridge } from './compass5929-breakfast-bridge.js';
import { compass5930MobileLongevityBridge } from './compass5930-mobile-longevity-bridge.js';
import { compass5931FamilyRadarBridge } from './compass5931-family-radar-bridge.js';
import { compass5932FoodDesktopBridge } from './compass5932-food-desktop-bridge.js';
import { compass5933PeopleFamilyBridge } from './compass5933-people-family-bridge.js';
import { compass5934CoachBridge } from './compass5934-coach-release-bridge.js';
import { compass5935CycleReleaseBridge } from './compass5935-cycle-release-bridge.js';
import { compass5936CalendarAccessRelease } from './compass5936-calendar-access-release.js';
import { compass5937FamilyPlanningRelease } from './compass5937-family-planning-release.js';
import { compass59371FamilyShortcutsRelease } from './compass59371-family-shortcuts-release.js';
import { compass5938ExperienceRelease } from './compass5938-experience-release.js';
import { compass5939LocationContextRelease } from './compass5939-location-context-release.js';
import { compass5940ContextNextRelease } from './compass5940-context-next-release.js';
import { compass59401NavigationRelease } from './compass59401-navigation-release.js';
import { compass59402LocationPickerRelease } from './compass59402-location-picker-release.js';
import { compass59403LocationPickerCompactRelease } from './compass59403-location-picker-compact-release.js';
import { compass59404NutritionBridge } from './compass59404-nutrition-bridge.js';
import { compass59405WorkoutResumeRelease } from './compass59405-workout-resume-release.js';
import { compass59406RirContextRelease } from './compass59406-rir-context-release.js';
import { compass59407PlateauRelease } from './compass59407-plateau-release.js';
import { compass59408ProjectsExperimentsRelease } from './compass59408-projects-experiments-release.js';
import { compass59409WorkspaceRelease } from './compass59409-workspace-release.js';
import { compass594010ProjectSyncRecoveryRelease } from './compass594010-project-sync-recovery-release.js';
import { compass594011FoodsRelease } from './compass594011-foods-release.js';
import { compass594012LocationDiscoveryRelease } from './compass594012-location-discovery-release.js';
import { compass594013FlaxRelease } from './compass594013-flax-release.js';
import { compass594014FlaxTileRelease } from './compass594014-flax-tile-release.js';
import { compass594015SmoothieEnergyRelease } from './compass594015-smoothie-energy-release.js';
import { compass594016FoodBasicsRelease } from './compass594016FoodBasicsRelease.js';
import { compass594017NutritionFocusRelease } from './compass594017-nutrition-focus-release.js';
import { compass594018LifeReportRelease } from './compass594018-life-report-release.js';
import { compass594019AnnualRelease } from './compass594019-annual-release.js';
import { compass594020AnnualWorkmapRelease } from './compass594020-annual-workmap-hotfix.js';
import { compass594021AnnualPrintFix } from './compass594021-annual-print-fix.js';
import { compass594022AnnualPremiumReport } from './compass594022-annual-premium-report.js';
import { compass594023AnnualChartAtlas } from './compass594023-annual-chart-atlas.js';
import { compass594024AnnualKnowledge } from './compass594024-annual-knowledge.js';
import { compass594025EditorialAnnual } from './compass594025-editorial-annual.js';
import { compass5940251SolarCoverHotfix } from './compass5940251-solar-cover-hotfix.js';
import { compass5940252PersonalPatterns } from './compass5940252-personal-patterns.js';
import { compass5940253PwaDeployFix } from './compass5940253-pwa-deploy-fix.js';
import { compass5940254FinancePatternsPrint } from './compass5940254-finance-patterns-print.js';

const base = process.env.VITE_BASE_PATH || '/';
const compassConfig=defineConfig({
  base,
  plugins: [compass5910StrengthHabitsBridge(), nutrition3Bridge(), strength728Bridge(), strength729Bridge(), strength730Bridge(), nutrition731Bridge(), strengthNutrition732Bridge(), nutritionStrength733Bridge(), nutritionLongevity734Bridge(), strengthTouch735Bridge(), nutrition736Bridge(), anatomyRecipes737Bridge(), nutritionPill577371Bridge(), strengthPremium738Bridge(), compass741Bridge(), strengthSync742Bridge(), compass743Bridge(), compass744Bridge(), compass745Bridge(), compass746Bridge(), compass747Bridge(), compass748Bridge(), compass749Bridge(), VitePWA({
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
  }),
  // Guarded 0.5.77.50 and later transforms remain adjacent after PWA.
  compass7593UxBridge(),
  compass750Bridge(), compass751Bridge(), compass752Bridge(), compass753Bridge(), compass754Bridge(), compass755Bridge(), compass756Bridge(), compass757Bridge(), compass758Bridge()],
  server: {port: 5173, strictPort:true}
});

// Register late feature transforms without modifying the legacy PWA / .50–.58
// chain. Historic CI checks intentionally require that chain to stay final.
compassConfig.plugins.push(compass5928VtaperLuxBridge(), compass5929BreakfastBridge());
compassConfig.plugins.push(compass5930MobileLongevityBridge());
compassConfig.plugins.push(compass5931FamilyRadarBridge());
compassConfig.plugins.push(compass5932FoodDesktopBridge());
compassConfig.plugins.push(compass5933PeopleFamilyBridge());
compassConfig.plugins.push(compass5934CoachBridge());
compassConfig.plugins.push(compass5935CycleReleaseBridge());
compassConfig.plugins.push(compass5936CalendarAccessRelease());
compassConfig.plugins.push(compass5937FamilyPlanningRelease());
compassConfig.plugins.push(compass59371FamilyShortcutsRelease());
compassConfig.plugins.push(compass5938ExperienceRelease());
compassConfig.plugins.push(compass5939LocationContextRelease());
compassConfig.plugins.push(compass5940ContextNextRelease());
compassConfig.plugins.push(compass59401NavigationRelease());
compassConfig.plugins.push(compass59402LocationPickerRelease());
compassConfig.plugins.push(compass59403LocationPickerCompactRelease());
compassConfig.plugins.push(compass59404NutritionBridge());
compassConfig.plugins.push(compass59405WorkoutResumeRelease());
compassConfig.plugins.push(compass59406RirContextRelease());
compassConfig.plugins.push(compass59407PlateauRelease());
compassConfig.plugins.push(compass59408ProjectsExperimentsRelease());
compassConfig.plugins.push(compass59409WorkspaceRelease());
compassConfig.plugins.push(compass594010ProjectSyncRecoveryRelease());
compassConfig.plugins.push(compass594011FoodsRelease());
compassConfig.plugins.push(compass594012LocationDiscoveryRelease());
compassConfig.plugins.push(compass594013FlaxRelease());
compassConfig.plugins.push(compass594014FlaxTileRelease());
compassConfig.plugins.push(compass594015SmoothieEnergyRelease());
compassConfig.plugins.push(compass594016FoodBasicsRelease());
compassConfig.plugins.push(compass594017NutritionFocusRelease());
compassConfig.plugins.push(compass594018LifeReportRelease());
compassConfig.plugins.push(compass594019AnnualRelease());
compassConfig.plugins.push(compass594020AnnualWorkmapRelease(),compass594021AnnualPrintFix(),compass594022AnnualPremiumReport(),compass594023AnnualChartAtlas(),compass594024AnnualKnowledge(),compass594025EditorialAnnual(),compass5940251SolarCoverHotfix(),compass5940252PersonalPatterns(),compass5940253PwaDeployFix(),compass5940254FinancePatternsPrint());
export default compassConfig;
