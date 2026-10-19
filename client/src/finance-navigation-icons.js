/** Compass 0.5.18: local monochrome Lucide-like pictograms, no icon library or network. */
const symbols={
 'layers':'<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 10h18M10 10v10"/>',
 'sync':'<path d="M20 8a8 8 0 0 0-14-2L4 8m0-4v4h4M4 16a8 8 0 0 0 14 2l2-2m0 4v-4h-4"/>',
 'trendingUp':'<path d="m3 17 6-6 4 4 8-9M15 6h6v6"/>',
 'activity':'<circle cx="7" cy="12" r="3"/><circle cx="17" cy="7" r="3"/><path d="M3 20h18M13 19v-6m4 6v-3"/>',
 'chart':'<path d="M4 20V4M4 20h17"/><path d="m7 15 4-4 3 2 6-7"/><path d="M15 6h5v5"/>',
 'calendar':'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M8 15h3m3 0h3"/>',
 'target':'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
 'map':'<path d="M3 5 9 3l6 2 6-2v16l-6 2-6-2-6 2zM9 3v16M15 5v16"/>',
 'folder':'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M3 7V5a2 2 0 0 1 2-2h5l2 4"/>',
 'git-merge':'<circle cx="6" cy="4" r="2"/><circle cx="6" cy="20" r="2"/><circle cx="18" cy="13" r="2"/><path d="M6 6v12M6 7c0 6 12 0 12 4"/>',
 'aperture':'<circle cx="12" cy="12" r="9"/><path d="m12 3 4 7-4 7-8-1m12-6 5 4m-15 2 3 5m7-11-9 0"/>',
 'list':'<path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
 'checkSquare':'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="m8 12 3 3 5-6"/>'
};
export function financeNavIcon(icon='layers'){
 const safe=Object.hasOwn(symbols,icon)?icon:'layers';
 return `<span class="fin-nav-icon fin-nav-${safe}" aria-hidden="true"><svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${symbols[safe]}</svg></span>`;
}
