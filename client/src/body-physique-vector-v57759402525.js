/** Crisp, fully scalable schematic physique comparison; NOT an anatomical scan.
 * Progressive geometry describes broad silhouette trends; body-fat percentage does
 * not uniquely determine waist, chest, fat distribution, or muscular definition.
 */
export function bodyPhysiqueSvg(percent,{label='Illustrativer Körpervergleich'}={}){
 const pct=Math.max(6,Math.min(45,Number(percent)||23.5)),f=(pct-10)/22;
 const spread=Math.max(0,Math.min(1.7,f)),shoulder=82+2*Math.min(1,spread),waist=49+25*spread,hip=53+18*spread;
 const belly=1.8+8.5*spread,pec=12+5*spread;
 const line=pct<=15?0.53:pct<=19?0.19:0;
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const skin='#d3a17d';
 return `<svg xmlns="http://www.w3.org/2000/svg" class="cbody25-vector" viewBox="0 0 240 390" role="img" aria-label="${esc(label)}: ungefähr ${pct.toLocaleString('de-AT',{maximumFractionDigits:1})} Prozent Körperfett, schematische Silhouette"><defs><linearGradient id="cbv25-skin" x1="0" x2="1"><stop stop-color="#9d6750"/><stop offset=".18" stop-color="#c68e70"/><stop offset=".48" stop-color="#ebc09b"/><stop offset=".8" stop-color="#c89173"/><stop offset="1" stop-color="#8b5543"/></linearGradient><linearGradient id="cbv25-cloth" x1="0" x2="1"><stop stop-color="#121e2e"/><stop offset=".5" stop-color="#283648"/><stop offset="1" stop-color="#101923"/></linearGradient></defs><ellipse cx="120" cy="378" rx="78" ry="7" fill="#304e47" opacity=".07"/>
 <g stroke="#97654c" stroke-width="1.1" stroke-linejoin="round">
 <path d="M105 278 Q100 318 100 369 L87 370 Q81 333 79 287 L69 241 Q84 225 107 227 L119 265Z" fill="url(#cbv25-skin)"/><path d="M135 278 Q140 318 140 369 L153 370 Q159 333 161 287 L171 241 Q156 225 133 227 L121 265Z" fill="url(#cbv25-skin)"/>
 <path d="M${120-shoulder} 95 Q${110-shoulder} 108 ${93-shoulder/2} 146 L${76-waist/7} 222 Q${68-waist/8} 255 80 277 L94 276 Q108 234 ${110-waist/8} 205 L${110-waist/8} 148 Z" fill="url(#cbv25-skin)"/>
 <path d="M${120+shoulder} 95 Q${130+shoulder} 108 ${147+shoulder/2} 146 L${164+waist/7} 222 Q${172+waist/8} 255 160 277 L146 276 Q132 234 ${130+waist/8} 205 L${130+waist/8} 148 Z" fill="url(#cbv25-skin)"/>
 <path d="M${120-shoulder} 89 Q${120-shoulder+20} 83 102 76 L104 67 L136 67 L138 76 Q${120+shoulder-20} 83 ${120+shoulder} 89 Q${120+shoulder+9} 99 ${120+shoulder-11} 126 L${120+waist/2+belly} 230 Q${120+hip/2} 261 120 257 Q${120-hip/2} 261 ${120-waist/2-belly} 230 L${120-shoulder+11} 126 Q${120-shoulder-9} 99 ${120-shoulder} 89Z" fill="url(#cbv25-skin)"/>
 </g><path d="M103 75 Q120 83 137 75 L139 86 Q120 94 101 86 Z" fill="#a96e53" opacity=".5"/>
 <path d="M102 75 Q120 95 138 75" fill="none" stroke="#a7745c" stroke-width="1.8"/>
 <path d="M${120-shoulder+12} 104 Q${120-shoulder/2} ${111+pec} 117 123 Q120 128 122 123 Q${120+shoulder/2} ${111+pec} ${120+shoulder-12} 104" fill="none" stroke="#945d48" stroke-width="${pct<20?2:1.3}" opacity="${pct<20?.37:.17}"/>
 ${line>0?`<g stroke="#a36b50" fill="none" stroke-width="1.5" opacity="${line}"><path d="M120 134 L120 216"/><path d="M107 150 Q120 155 133 150 M107 171 Q120 176 133 171 M109 193 Q120 198 131 193"/><path d="M104 145 Q98 168 104 189 M136 145 Q142 168 136 189"/></g>`:''}
 <path d="M120 184 Q${120+belly*.65} 208 120 230" stroke="#996852" fill="none" stroke-width="${1+spread*.8}" opacity=".12"/>
 <path d="M${120-waist/2-belly+3} 231 Q120 247 ${120+waist/2+belly-3} 231 L${120+hip/2} 274 Q120 293 ${120-hip/2} 274 Z" fill="url(#cbv25-cloth)" stroke="#1d2a35" stroke-width="1.8"/>
 <path d="M120 252 L120 282 M${120-hip/2+8} 244 Q120 252 ${120+hip/2-8} 244" stroke="#8896a1" opacity=".28" fill="none"/>
 <ellipse cx="120" cy="40" rx="25" ry="31" fill="url(#cbv25-skin)" stroke="#9f6a4c" stroke-width="1.2"/><path d="M95 40 Q94 10 119 9 Q145 8 145 43 Q140 22 124 23 Q112 21 97 34Z" fill="#544137"/><ellipse cx="126" cy="8" rx="12" ry="7" fill="#554238"/>
 <path d="M102 41 Q111 37 117 40 M124 40 Q132 37 138 41" stroke="#674c40" stroke-width="1.4" fill="none"/><path d="M119 44 L117 54 L123 55 M113 63 Q120 67 127 63" stroke="#9c715a" stroke-width="1" fill="none"/>
 <path d="M85 369 L99 369 L101 375 Q92 379 82 373Z M141 369 L155 369 L158 373 Q148 379 139 375Z" fill="#b07d60"/><path d="M102 66 Q120 73 138 66" fill="none" stroke="#634a40" stroke-width="1" opacity=".45"/>
 </svg>`;
}
