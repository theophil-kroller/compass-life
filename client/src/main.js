import {capacityForecast,capacitySettings} from './capacity-engine-v44.js';
import {deadlineIntelligence} from './deadline-intelligence-v45.js';
import {proactivePlan} from './proactive-planner-v47.js';
import {dayPlanBlocks,dayCandidates,dayDropTargets,placeDayBlock,updateDayBlock,dayPlanStatus} from './daily-planning-v48.js';
import {needsDateDecision} from './urgency-intelligence-v48.js';
import {exportProjectPlan,parseProjectPlan,projectImportPreview,applyProjectPlan} from './project-exchange-v45.js';
import {technicalSettings,TECHNICAL_TOGGLES,wireTechnicalCrosshair} from './kraken-technical-v40.js';
import {parseCaptureLines,parseAiCaptureJson,capturePreview,captureInboxRecord,CAPTURE_KINDS} from './capture-triage-v26.js';
import {moveProjectHierarchy,moveTaskHierarchy,cloneProjectTemplate,taskDescendants,isTemplateProject} from './project-workspace-v27.js';
import {inboxTaskDraft} from './inbox-promotion-v27.js';
import {inboxTodayTaskDraft} from './inbox-today-v557.js';
import {buildLifeBalanceRadar,buildLifeBalanceHistory,lifeBalanceRadarView,validateBalanceGoals} from './life-balance-radar-v563.js';
import {inspectorDateShift,inspectorTitle} from './inspector-v559.js';
import {inboxFlagged,visibleInboxTags,setInboxFlag} from './inbox-flags-v27.js';
import {inboxOrdered,inboxMove,inboxNudge} from './inbox-order-v34.js';
import {FOLDER_ICONS,folderIcon} from './folder-icons-v35.js';
import {CONTACT_TYPES,CONTACT_REVIEW_DAYS,contactTypeLabel,addContactEntry,contactSummary,contactReviewQueue,updateContactReviewDays} from './people-relationships-v24.js';
import {FEELINGS,feelingWord,newFeelingDraft,chooseFeeling,intensityFor,validatedCheckin,appendCheckin,feelingOverlay,feelingInsights,feelingReview} from './feeling-wheel-v565.js';
import {personalConnections,personalConnectionsView} from './personal-connections-v566.js';
import {relationshipMapView,MAP567,closenessAt} from './relationship-map-v567.js';
import {RELATION_KINDS,GENDER_MARKERS,CADENCE_DAYS,preference,contactImpulse,impulseQueue,pauseContact,mapPosition,mapDrop,safePersonDetails,relatedProjectIds,contactWeight} from './relationship-radar-v564.js';
import {REVIEW_STEPS,newReview,validReview,reviewQueue,projectReviewSummary,nextReviewStep,reviewedStep} from './guided-review.js';
import {linkedPersonTasks,linkedPersonInbox} from './person-links.js';
import {projectHealth,waitingReview,repeatedTask} from './gtd-intelligence-v23.js';
import {validateLifeGoal,lifeGoals,lifeGoalProgress,smartDailyChoices,energyModes,timeModes,LIFE_AREAS,lifeAreaLabel} from './life-intelligence-v22.js';
import {fetchPublicEurQuotes} from './kraken-public-market-v22.js';
import {fetchKrakenHistory} from './kraken-history-v39.js';
import {matchesEventCategories,toggleEventCategory,selectedCategoryLabel} from './discovery-category-filter.js';
import {wireSmartTags,rememberTag} from './smart-tags.js';
import {personCalendarEvents} from './people-matching.js';
import './style.css';
import {allRecoveryIdeas,scoreRecoveryIdeas,recoveryWeather,validRecoveryIdea} from './recovery-ideas.js';
import {assertCompatibleWorker} from './health-check.js';
import {parseEventImport,upcomingImportedEvents,discoveryPromptRegional,discoveryPromptTravel,eventKey,eventAppearance as discoveryAppearance,EVENT_CATEGORIES,eventArea,eventCountry} from './event-import.js';
import {eventState,queueEvent,queueEventPreference,removeEvents,prunePastEvents,pendingEventBatch,acknowledgeEventBatch,mergeEventSnapshot,resolveEventConflict} from './event-sync.js';
import {healthViewModel,healthBars,healthTime,healthObservation} from './health-visual.js';
import {inspectHealthFiles,commitHealthImport,missingGarminDays} from './health-import.js';
import {healthImportCoverage} from './health-import-diagnostics-v492.js';
import {healthDataCoverage,healthCoverageMarkup,importFilePeriod} from './health-data-coverage-v494.js';
import {planHealthQueue,healthBatchResult} from './health-import-queue-v493.js';
import {importedHealthDashboard,healthSourcesView,healthBodyView,healthConnectActivityView} from './health-dashboard.js';
import {financeViewModel,financeReviewGroups,previewBankFiles,categorizeTransaction,merchantKey,validCategory,safeMerchantRule,classifyBankTransaction,updateBankSuggestions} from './finance-core.js';
import {financeDashboardView,FINANCE_TABS,FINANCE_GROUPS,financeGroupForPane} from './finance-dashboard.js';
import {cashflowDateOK,validateCashflowSettings,validatedPlanEvent,cashflowMonth} from './finance-cashflow-v560.js';
import {financeAssistantPatterns,financeAssistantView,financeAssistEligible,askLocalFinanceModel,applyFinanceAssistantGroup} from './finance-local-assistant-v46.js';
import {fetchTwelveDataQuote} from './finance-market-v36.js';
import {fetchFlatexMarketHistory} from './flatex-market-history-v41.js';
import {putBudgetEntry,putSavingsGoal,validateSavingsGoal,flexBudgetModel} from './finance-flex-budget-v30.js';
import {PRIVATE_KINDS,privateSection,privateChanged,applyPrivateSection,newSalt,syncKeyFromPhrase,encryptSection,decryptSection} from './private-device-sync-v30.js';
import {privateMirrorNeedsChunks,privateMirrorParts,joinMirrorParts} from './private-device-chunks-v552.js';
import {financeMerchantEdit} from './finance-merchant-editor.js';
import {addWealthSnapshot} from './finance-wealth-consolidation.js';
import {addHoldingSnapshot} from './finance-holdings-v19.js';
import {parseFlatexPositionsCsv,putFlatexSnapshot} from './finance-flatex-positions-v37.js';
import {validateWealthPlan,addWealthGoal} from './finance-wealth-planning-v20.js';
import {validateKrakenSnapshot,mergeKrakenSnapshot,updateKrakenQuotes,krakenWealthSummary} from './finance-kraken.js';
import {createFinanceTrip,tripDelete,tripCandidateRows,travelAttributable} from './finance-travel.js';
import {validatePrivateFinancePack} from './finance-private-rules.js';
import {financeSearchTransactions} from './finance-analytics.js';
import {financePeriodInfo} from './finance-visual-model.js';
import {transferCandidates,accountMatches} from './finance-revolut.js';
import {exploreDays,exploreView,EXPLORE_FIELDS} from './insights-explorer.js';
import {INSIGHT_TABS,INSIGHT_PERIODS,buildSleepInsights,insightsSleepView,insightsPlannedView} from './insights.js';
import {healthFindings,rankHealthFindingsLocally} from './health-intelligence-v551.js';
import {inspectWorktimeFile,mergeWorktime,worktimeView,worktimeImportPanel} from './worktime-v553.js';
import {markSuccessfulImport} from './import-status-v558.js';
import {worktimeYearComparisonView} from './worktime-multiyear-v555.js';
import {recoveryCandidates,recoveryEvidence,recoveryView} from './recovery-timeoff-v554.js';
import {conferenceEntries,conferenceRadarView,conferenceProjectPlan,newConference,setConferenceStatus,RADAR_TOPICS,RADAR_REGIONS,RADAR_FOCI} from './conference-radar-v555.js';
import {insightsStressView,insightsEnergyView} from './insights-wellness.js';
import {fitnessInsightsView} from './insights-fitness.js';
import {buildProductivityInsights,productivityInsightsView} from './insights-productivity.js';
import {inspectTimelineFiles,manualPlaceVisit,mergePlaces,placesInsightsView} from './insights-places.js';
import {reviewImportHub} from './review-import-hub.js';
import {smartImportHubView,inspectSmartFiles,collectFolderFiles,committedSmartImport,recheckHealthArchiveEntries,smartImportGroups,SMART_IMPORT_KINDS,SMART_IMPORT_SOURCES} from './smart-import-hub-v49.js';
import {sportsInsightsView,sportsPeriodWindow,sportsShiftAnchor,SPORTS_MODES} from './sports-insights.js';
import {registerSW} from 'virtual:pwa-register';
import * as vault from './vault.js';
import {request,nextBatch,applyResult,mergePulled,sameItemContent,pruneIdenticalConflicts} from './sync.js';
import {DEFAULT_CALENDAR_RULES,CALENDAR_CATEGORIES,effectiveCalendarRules,classifyCalendarEvent,validCalendarRule,validCalendarOverride,visibleCalendarEventsForDay,isRoutineCalendarBlock} from './calendar-rules.js';
import {ACTIVITY_CATEGORIES,isoLocal,validActivityEdit,validManualActivity,projectActivities,activeActivities,activityStats,timelineItems} from './activity-management.js';
import {OCCASION_STEPS,OCCASION_LEAD_DAYS,daysUntil,occasionStepKey,occasionTaskTag,relatedOccasionTask,occasionTask,validCustomStep,shiftDay} from './occasion-planning.js';
import {occasionsWithPeople,validPersonBirthday} from './people-occasions.js';
import {contextChoices,filterContextTasks} from './context-perspectives.js';
import {prepareTasks,TASK_CATEGORIES,CATEGORY_LABELS,validLocalTask,taskPlain,sameTask,localDate,tasksForDay,dueTasks,mergeTaskSnapshot,parseTags,dateIsValid,advanceTaskCounter,nextActions,isActionAvailable,isTemplateTask,flaggedTasks,heldTasks,projectTasks,validProject,projectPlain,sameProject,mergeProjectSnapshot,agendaForEvent,projectNeedsReview,contextsFor,blockedByProject,dreamRecords,inboxRecords,childProjects,projectDescendantIds,validProjectParent,validTaskParent,hierarchicalProjectTasks,taskChildren,ordered} from './tasks.js';

registerSW({immediate:true});
const COMPASS_CLIENT_VERSION='0.5.67.2';
const app=document.getElementById('app');
let config={apiUrl:'',googleClientId:''};
let state=null, hasVault=false, authToken='', currentUser='', busy=false, notice='', error='', tab='today', lastActivity=Date.now();
let saveQueue=Promise.resolve();
let calendarMonth=new Date(new Date().getFullYear(),new Date().getMonth(),1);
let selectedDay=localDateString(new Date());
let selectedInboxId=null;
let selectedDreamId=null;
let selectedTaskId=null;
let inlineEditingTaskId=null;
let selectedProjectId=null;
let exchangePreview=null;
let exchangeRaw='';
let radarTopic='all',radarRegion='all',radarFocus='all';
let plannerExpanded=false;
let selectedForecastDay=localDateString(new Date());
let dailyPlanExpanded=true,dailyPlanPicked='',dailyPlanDuration=60,dailyPlanShowAll=false,dailyPlanShowUndated=false,dailyPlanDateTask='';
let exchangeBaseline=null;
let projectFocus=false;
const projectCollapsed=new Set();
const treeTaskCollapsed=new Set();
let treeCreateKind='',treeCreateParent=null,treeTaskParent=null;
let selectedAgendaEventId=null;
let calendarRulesOpen=false,showHiddenCalendarEvents=false;
let reviewWorkflow='next';
let reviewEditingTaskId=null,reviewProjectId=null;
let activitySelectedId=null,activityTrash=false,overviewHorizon=30,overviewWeek=0,selectedTimelineDay='',selectedPersonId=null,personOpenPointId='',peopleTab='list',relationshipMapFocus=false,relationshipMapFilter='all',quickContactType='',occasionOpen=true;
const reviewDrafts=new Map();
function captureReviewDraft(){const form=app?.querySelector('#review-commit-form');if(form?.dataset.id)reviewDrafts.set(form.dataset.id,Object.fromEntries(new FormData(form).entries()));}
let showCalendarBlocks=false;
let showCaptureDetails=false;
let contextFilter='';
let recoveryIdeaMinutes=180,recoveryIdeaEnergy='medium',recoveryIdeaRange='trip';
let syncResyncRequested=false;
let syncTimer=null, lastSyncAt=0;
const SYNC_INTERVAL_MS=15*60*1000;
const CHANGE_DEBOUNCE_MS=7000;
function scheduleSync(delay=CHANGE_DEBOUNCE_MS) {
  if(!state||!authToken||!navigator.onLine||document.visibilityState==='hidden')return;
  clearTimeout(syncTimer);
  syncTimer=setTimeout(()=>{syncTimer=null;syncNow().catch(()=>{});},delay);
}
async function resumeSession(){
  if(!state)return;
  try {
    const session=await vault.loadSession();
    if(!session)return;
    authToken=session.token;currentUser=session.email;
    render();
    reloadWatchSessions().catch(()=>{});
    reloadHealth().catch(()=>{});
    reloadWidgetDevices().catch(()=>{});
    if(!navigator.onLine)return;
    const who=await request(config.apiUrl,authToken,'/api/me');
    currentUser=who.email;render();
    await syncNow();
  }catch(ex){
    if(ex.status===401){authToken='';currentUser='';await vault.clearSession();toast('Compass-Sitzung abgelaufen. Bitte einmalig mit Google anmelden.');}
    else {error='Verbindung derzeit nicht erreichbar. Lokale Erfassung bleibt möglich.';render();}
  }
}

let feelingOverlayOpen=false,feelingDraft=newFeelingDraft(),feelingDays=30,connectionEmotion='anger',connectionDays=30;
let captureOverlayOpen=false;
// Keep unsent captures in memory across unrelated UI renders (sync, weather, etc.).
// Never put plaintext capture drafts into localStorage/sessionStorage.
let captureDraft={title:'',note:'',noteOpen:false};
let dashboardCaptureDraft='';
let captureNeedsInitialFocus=false;
let captureSkipNextSnapshot=false;
function snapshotCaptureDraft(){
 const focused=document.activeElement;
 let focus=null;
 if(!captureSkipNextSnapshot){
  const form=app.querySelector('#capture-modal-form');
  if(form){
   captureDraft={title:form.elements.title?.value??captureDraft.title,
    note:form.elements.note?.value??captureDraft.note,
    noteOpen:!!form.querySelector('.optional-capture')?.open};
   if(focused?.id==='capture-modal-input'||focused?.id==='capture-modal-note'){
    focus={id:focused.id,start:focused.selectionStart,end:focused.selectionEnd};
   }
  }
  const dashboard=app.querySelector('#capture-form textarea[name="title"]');
  if(dashboard){dashboardCaptureDraft=dashboard.value;
   if(focused===dashboard)focus={id:'capture',start:dashboard.selectionStart,end:dashboard.selectionEnd};}
 }else{captureSkipNextSnapshot=false;}
 return focus;
}
function restoreCaptureDraft(focus){
 const modal=app.querySelector('#capture-modal-form');
 if(modal){
  modal.elements.title.value=captureDraft.title;
  modal.elements.note.value=captureDraft.note;
  const noteDetails=modal.querySelector('.optional-capture');
  if(noteDetails)noteDetails.open=captureDraft.noteOpen||!!captureDraft.note;
 }
 const dashboard=app.querySelector('#capture-form textarea[name="title"]');
 if(dashboard)dashboard.value=dashboardCaptureDraft;
 if(focus?.id&&app.querySelector('#'+focus.id)){
  requestAnimationFrame(()=>{
   const field=app.querySelector('#'+focus.id);
   if(!field)return;
   field.focus({preventScroll:true});
   if(Number.isInteger(focus.start)&&Number.isInteger(focus.end))field.setSelectionRange(focus.start,focus.end);
  });
 }else if(captureOverlayOpen&&captureNeedsInitialFocus){
  requestAnimationFrame(()=>app.querySelector('#capture-modal-input')?.focus({preventScroll:true}));
 }
 captureNeedsInitialFocus=false;
}
let captureAfterUnlock=false;
let inboxQuery='';
let captureBulkOpen=false,captureBulkMode='lines',captureBulkRaw='',captureBulkPreview=null;
const bootSearch=new URLSearchParams(location.search);
const bootCapture=bootSearch.get('capture')==='1';
const bootView=bootSearch.get('view');
if(['today','inbox','review','forecast','overview','someday','activity','people','progress','recovery','insights','finance','projects','templates','next','flagged','hold'].includes(bootView))tab=bootView;
if(bootView==='health'||bootView==='places')tab='insights';
if(bootCapture){captureAfterUnlock=true;tab='inbox';}

let watchPairCode='', watchPairExpires='', watchSessions=[], watchDevices=[], watchError='';
let healthDays=[],healthDevices=[],healthPairCode='',healthError='',healthLastUpdated='';
let widgetPairCode='',widgetDevices=[],widgetConnectError='';
let healthSpan=7,healthDetailsOpen=false,healthDevicesOpen=false;
let importHealthSpan=90,selectedGarminNight='',healthFilePreview=null,healthFileReading=false;
let insightWellnessDay='';let insightStressGranularity='week',insightBodyComposition='composition';
let sportsMode='all',sportsAnchor=localDate(),sportsMetric='time',sportsSelected='';
let financeCycleSelected='';
let financeMarketQuote=null;
let balancePeriod=7,balanceHistoryCount=2,balanceSelectedAxis=null;
let insightTab=bootView==='places'?'places':bootView==='health'?'sources':'sleep',insightPeriod=bootView==='places'?'all':'28',insightNight='',insightYearMode='month',insightWeekAnchor='',workYear=new Date().getFullYear(),workThreshold=45,workCompareMode='month',workPreview=null,timeoffKind='za',timeoffOpen=false,healthAiOrder=[],healthAiStatus='',financePane='Überblick';
// Non-sensitive presentation only. Deep links always override the last-view preference.
const calmLastView=(()=>{try{return JSON.parse(sessionStorage.getItem('compass.calm.lastView')||'null');}catch{return null;}})();
if(!bootView&&!bootCapture&&calmLastView&&['today','inbox','review','forecast','overview','someday','activity','people','progress','recovery','insights','finance','projects','templates','next','flagged','hold'].includes(calmLastView.tab))tab=calmLastView.tab;
if(!bootView&&!bootCapture&&calmLastView?.insight&&INSIGHT_TABS.some(v=>v.id===calmLastView.insight))insightTab=calmLastView.insight;
if(!bootView&&!bootCapture&&calmLastView?.finance&&FINANCE_TABS.some(v=>v.title===calmLastView.finance))financePane=calmLastView.finance;
let calmNavGroup=['projects','overview','next','forecast','radar','flagged','hold','someday'].includes(tab)?'plan':tab==='insights'||tab==='activity'||tab==='progress'||tab==='recovery'?'insights':tab==='finance'?'finance':'';
let financeSankeyFocus='all',financeMerchantSelected='';
let financePaceCompare='previous',financeBudgetMonth=new Date().toLocaleDateString('sv-SE').slice(0,7);
let financeAiSuggestions=[],financeAiOffset=0;
let financeWhatIf=null,financeWhatIfDraft=null,financePeriod='last12',financeForecastScenario='basis',financeAccount='all',financePreview=null,krakenPreview=null,financeBusy=false,financeReviewPage=0,financeCategorySelected='';
let krakenBridgeToken='',krakenBridgeBusy=false,krakenLocalCheckedAt=0;
let krakenPublicBusy=false,krakenPublicAttempt=0;
let krakenChartAsset='',krakenChartPeriod='1m',krakenChartBusy=false,krakenChartError='',krakenChartData=null,krakenChartSettings=technicalSettings();
let flatexChartIsin='',flatexChartTicker='',flatexChartPeriod='1y',flatexChartBusy=false,flatexChartError='',flatexChartData=null,flatexChartSettings=technicalSettings();
let flatexPositionSort='market',flatexPositionDescending=true;
let financePortfolioTab='overview',financePortfolioMarket='flatex';
let financeOverviewSankeyOpen=false;
let financeVisualMode='hierarchy',financeCompareMode='month_year',financeMerchantCategory='Lebensmittel';
let financeLedgerQuery='',financeLedgerFilter='all',financeLedgerPage=0;
let financeTripSelected='',financeTripQuery='',financeTripMode='suggested',financeTripPage=0;
let exploreX='sleepMinutes',exploreY='workMinutes',exploreLag=0;
let smartHubEntries=[],smartHubBusy=false,smartHubNotice='',smartHubStage=null;
let healthImportJob=null,healthImportStop=false,healthImportIssues=[];
let smartHubScanSource='';
const smartHubFolders={health:null,finance:null};
const smartHubFolderStatus={};
/** A single explicit folder consent triggers local classification; "Prüfen" rescans on demand.
 * No OS background access, no automatic import or cloud upload. */
async function scanSmartFolder(id){
 const handle=smartHubFolders[id];if(!handle||smartHubBusy)return;
 try{
  const permission=typeof handle.queryPermission==='function'?await handle.queryPermission({mode:'read'}):'granted';
  if(permission!=='granted'){smartHubNotice='Ordnerzugriff abgelaufen. Bitte erneut freigeben.';smartHubFolders[id]=null;delete smartHubFolderStatus[id];render();return;}
  smartHubBusy=true;smartHubNotice='Ordner wird lokal geprüft …';render();
  const scan=await collectFolderFiles(handle);
  smartHubEntries=await inspectSmartFiles(scan.files,state?.smartImportHistory||[]);
  smartHubScanSource=id;
  smartHubNotice=`${scan.files.length} Dateien aus ${handle.name} geprüft.${scan.warnings.length?' '+scan.warnings.join(' · '):''}`;
 }catch(ex){smartHubNotice='Ordnerprüfung: '+String(ex.message||ex);}
 finally{smartHubBusy=false;render();}
}

let placesPreview=null,placesImportBusy=false,selectedPlaceKey='',placesMapRegion='world',placesMapZoom=1,placesListLimit=25;
let discoveryRange='week',discoveryCity='all',discoveryArea='all',discoveryCategory='all',discoveryCategories=null,discoveryCategoriesOpen=false,discoveryImportOpen=false,discoveryWeekOffset=0,discoveryImportPreview=null;
const discoveryExpandedDays=new Set();
// Calendar OAuth is independent from Compass login; token stays in RAM only.
let calendarToken='', calendarExpires=0, calendarEvents=[], calendarStatus='Nicht verbunden', calendarBusy=false;
let calendarUpdatedAt=0,calendarCoverage=null;
const CAL_SCOPE='https://www.googleapis.com/auth/calendar.events.readonly';
function calendarDate(e){
 const value=e?.start?.dateTime;
 if(value){try{return localDateString(new Date(value));}catch{}}
 return (e?.start?.date||'').slice(0,10);
}
function dailyCalendar(day){return calendarEvents.filter(e=>calendarDate(e)===day&&e.status!=='cancelled').sort((a,b)=>(a.start?.dateTime||a.start?.date||'').localeCompare(b.start?.dateTime||b.start?.date||''));}
function calendarTime(e){
 const t=e?.start?.dateTime;
 if(!t)return 'Ganztägig';
 try{return new Intl.DateTimeFormat('de-AT',{hour:'2-digit',minute:'2-digit'}).format(new Date(t));}catch{return 'Termin';}
}
function visibleCalendarEvents(day){return visibleCalendarEventsForDay(calendarEvents,day,effectiveCalendarRules(state),state?.calendarOverrides||{},showHiddenCalendarEvents,showCalendarBlocks);}
function isRoutineBlock(e){return isRoutineCalendarBlock(e);}
function eventAppearance(e){return classifyCalendarEvent(e,effectiveCalendarRules(state),state?.calendarOverrides||{});}
function recoveryEvents(day){return visibleCalendarEvents(day).filter(e=>eventAppearance(e).category==='Erholung');}
function agendaEvent(e){const matched=agendaForEvent(state,e);return matched.length?`<span class="agenda-count">${ico('list',13)} ${matched.length} Agenda</span>`:'';}
function calendarCardRows(day){
 const ev=visibleCalendarEvents(day);
 return ev.length?`<div class="compass-calendar-list">${ev.map(e=>`<button type="button" class="compass-calendar-event calendar-clickable" data-action="agenda-open" data-id="${h(e.id)}"><span class="compass-calendar-hour">${h(calendarTime(e))}</span><span class="event-emoji" aria-hidden="true">${h(eventAppearance(e).emoji)}</span><strong>${h(eventAppearance(e).displayTitle||'Termin')}</strong>${agendaEvent(e)}${ico('arrow',14)}</button>`).join('')}</div>`
  :'<div class="appointments-empty"><span>Keine relevanten Termine für diesen Tag.</span></div>';
}
function calendarFilterToggle(){return `<div class="calendar-controls"><button type="button" class="secondary-btn calendar-filter-toggle" data-action="calendar-toggle-blocks">${ico(showCalendarBlocks?'eye':'eyeOff',15)} ${showCalendarBlocks?'Zeitblöcke ausblenden':'Zeitblöcke einblenden'}</button><button type="button" class="secondary-btn" data-action="calendar-toggle-hidden">${showHiddenCalendarEvents?'Ausgeblendete verbergen':'Ausgeblendete zeigen'}</button><button type="button" class="secondary-btn" data-action="calendar-rules-toggle">${ico('pencil',14)} Kalenderregeln</button></div>${calendarRulesPanel()}`;}
function categorySelect(name,selected='Neutral'){return `<select name="${name}">${CALENDAR_CATEGORIES.map(c=>`<option value="${h(c)}" ${c===selected?'selected':''}>${h(c)}</option>`).join('')}</select>`;}
function calendarRulesPanel(){if(!calendarRulesOpen||!state)return '';
 const rules=effectiveCalendarRules(state);
 return `<section class="calendar-rules-panel" aria-label="Kalender-Klassifizierungsregeln"><div class="work-heading"><span>Symbole und Erholungskategorien bearbeiten</span><button type="button" class="secondary-btn" data-action="calendar-rules-toggle">Schließen</button></div><p class="muted-line">Regeln werden in dieser Reihenfolge geprüft (erster Treffer gewinnt). Die Begriffe beziehen sich ausschließlich auf den Termintitel. Diese Einstellungen bleiben verschlüsselt in deinem lokalen Compass-Tresor.</p>
 <div class="calendar-rule-list">${rules.map((r,i)=>`<form class="calendar-rule-form" data-id="${h(r.id)}"><div class="rule-heading"><label><input type="checkbox" name="enabled" ${r.enabled?'checked':''}/> Aktiv</label><strong>${i+1}. ${h(r.label)}</strong><div class="rule-move"><button type="button" class="secondary-btn" data-action="calendar-rule-up" data-id="${h(r.id)}" ${i===0?'disabled':''} aria-label="Priorität erhöhen">↑</button><button type="button" class="secondary-btn" data-action="calendar-rule-down" data-id="${h(r.id)}" ${i===rules.length-1?'disabled':''} aria-label="Priorität senken">↓</button></div></div><div class="rule-fields"><label>Regelname<input name="label" required maxlength="70" value="${h(r.label)}"/></label><label>Symbol<input name="emoji" maxlength="16" required value="${h(r.emoji)}" aria-label="Emoji"/></label><label>Kategorie${categorySelect('category',r.category)}</label><label>Begriffe (Komma getrennt)<input name="terms" maxlength="500" required value="${h(r.terms)}"/></label><label>Ausschlüsse (optional)<input name="exclude" maxlength="300" value="${h(r.exclude||'')}"/></label></div><div class="rule-actions"><button class="primary-btn" type="submit">Regel speichern</button><button type="button" class="secondary-btn" data-action="calendar-rule-delete" data-id="${h(r.id)}">Entfernen</button></div></form>`).join('')}</div><div class="rule-toolbar"><button type="button" class="secondary-btn" data-action="calendar-rule-add">Neue Regel</button><button type="button" class="secondary-btn" data-action="calendar-rules-reset">Standardregeln wiederherstellen</button></div></section>`;
}
function eventAgendaPanel(){
 const event=calendarEvents.find(e=>e.id===selectedAgendaEventId);
 if(!event||!state)return '';
 const notes=agendaForEvent(state,event);
 const title=String(event.summary||'');
 const look=eventAppearance(event),over=state.calendarOverrides?.[event.id]||{};
 const person=title.match(/\b(?:mit|bei)\s+([\p{Lu}][\p{L}-]{2,})/u);
 const suggested=/\buko\b/i.test(title)?'uko':person?person[1].toLocaleLowerCase('de'):(title.match(/[\p{L}\p{N}]{3,}/u)?.[0]?.toLocaleLowerCase('de')||'');
 const externalUrl=typeof event.htmlLink==='string'&&/^https:\/\/(?:calendar\.google\.com\/|www\.google\.com\/calendar\/)/.test(event.htmlLink)?event.htmlLink:'';
 return `<section id="agenda-details" tabindex="-1" class="work-card agenda-panel" aria-label="Kalendertermin und persönliches Overlay"><div class="work-heading"><span>${h(look.emoji)} Kalendertermin</span><button type="button" class="secondary-btn" data-action="agenda-close">Schließen</button></div>
 <h3>${h(title||'Termin')}</h3><p class="muted-line">${h(calendarDate(event))} · ${h(calendarTime(event))} · Google Calendar (nur lesen) ${externalUrl?`· <a href="${h(externalUrl)}" target="_blank" rel="noopener noreferrer">In Google Calendar bearbeiten ↗</a>`:''}</p>
 <form id="calendar-overlay-form" data-id="${h(event.id)}" class="calendar-overlay-form"><div class="work-heading"><span>Compass-Overlay (nur lokal)</span></div><label>Eigener Anzeigetitel<input name="title" value="${h(over.title||'')}" maxlength="180" placeholder="Originaltitel beibehalten"/></label><div class="overlay-fields"><label>Kategorie${categorySelect('category',over.category||look.category)}</label><label>Symbol<input name="emoji" aria-label="Terminsymbol" maxlength="16" value="${h(over.emoji||look.emoji)}"/></label></div><label class="flag-check"><input type="checkbox" name="hidden" ${look.hidden?'checked':''}/> In Compass ausblenden</label><div class="rule-actions"><button type="submit" class="primary-btn">Overlay speichern</button><button type="button" class="secondary-btn" data-action="calendar-overlay-reset" data-id="${h(event.id)}">Automatische Zuordnung</button></div><small>Nur Anzeige in Compass; der originale Google-Termin wird nicht verändert. Für alle ähnlichen Termine ändere die Kalenderregeln.</small></form>
 <div class="work-heading"><span>${ico('users',19)} Gesprächsvorbereitung</span></div>
 ${notes.length?`<div class="agenda-items">${notes.map(x=>`<div class="agenda-item">${ico('checkSquare',16)} <span>${h(x.title)}</span><small>${x.tags?.map(t=>'#'+h(t)).join(' ')||''}</small></div>`).join('')}</div>`:'<p class="muted-line">Noch keine offenen Gesprächspunkte mit passenden Tags.</p>'}
 <form id="agenda-note-form" class="project-form"><input type="hidden" name="tag" value="${h(suggested)}"><label>Neuen Agendapunkt notieren<input name="title" required maxlength="180" placeholder="Was möchte ich besprechen?"/></label><button type="submit" class="primary-btn">${ico('plus',16)} Agendapunkt hinzufügen</button></form>
 <p class="form-hint">Tag-Vorschlag: #${h(suggested)}. Keine Kalendereinträge werden verändert.</p></section>`;
}
function calendarConnectUI(){
 if(calendarBusy)return '<span class="calendar-connection">Google Calendar wird geladen …</span>';
 return calendarToken&&Date.now()<calendarExpires
  ?`<button type="button" class="secondary-btn" data-action="calendar-refresh">${ico('sync',15)} Kalender aktualisieren</button>`
  :`<button type="button" class="secondary-btn" data-action="calendar-connect">${ico('calendar',15)} Google Calendar verbinden (nur lesen)</button>`;
}
async function fetchCalendar(){
 if(!calendarToken||Date.now()>=calendarExpires)throw new Error('Kalenderfreigabe abgelaufen. Bitte erneut verbinden.');
 if(calendarBusy)return;
 calendarBusy=true;calendarStatus='Lädt …';render();
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),18000);
 try{
   const start=new Date();start.setHours(0,0,0,0);start.setDate(start.getDate()-90);
   const end=new Date();end.setHours(0,0,0,0);end.setDate(end.getDate()+90);
   const url=new URL('https://www.googleapis.com/calendar/v3/calendars/primary/events');
   url.searchParams.set('timeMin',start.toISOString());url.searchParams.set('timeMax',end.toISOString());
   url.searchParams.set('singleEvents','true');url.searchParams.set('orderBy','startTime');
   url.searchParams.set('maxResults','200');
   const loaded=[];let pageToken='';
   for(let page=0;page<5;page++){
     if(pageToken)url.searchParams.set('pageToken',pageToken);else url.searchParams.delete('pageToken');
     const response=await fetch(url,{headers:{Authorization:`Bearer ${calendarToken}`},signal:controller.signal,cache:'no-store'});
     if(!response.ok)throw new Error(response.status===403?'Google Calendar API oder Berechtigung fehlt. Bitte Calendar API im Google-Cloud-Projekt aktivieren.':`Google Calendar: HTTP ${response.status}`);
     const data=await response.json();
     loaded.push(...(Array.isArray(data.items)?data.items.filter(x=>x&&x.start):[]));
     pageToken=data.nextPageToken||'';if(!pageToken)break;
   }
   calendarEvents=loaded;
   calendarCoverage={complete:!pageToken,start:[start.getFullYear(),String(start.getMonth()+1).padStart(2,'0'),String(start.getDate()).padStart(2,'0')].join('-'),end:[end.getFullYear(),String(end.getMonth()+1).padStart(2,'0'),String(end.getDate()).padStart(2,'0')].join('-')};
   calendarUpdatedAt=Date.now();calendarStatus=`${calendarEvents.length} Kalendertermine geladen${pageToken?' (mehr vorhanden; Zeitraum unvollständig)':''}`;
 }catch(ex){calendarStatus=ex.name==='AbortError'?'Kalenderanfrage hat zu lange gedauert.':ex.message;}
 finally{clearTimeout(timeout);calendarBusy=false;render();}
}
async function connectCalendar(){
 await ensureGoogle();
 if(!window.google?.accounts?.oauth2?.initTokenClient)throw new Error('Google Calendar-Anmeldung derzeit nicht verfügbar.');
 const client=window.google.accounts.oauth2.initTokenClient({client_id:config.googleClientId,scope:CAL_SCOPE,callback:async result=>{
   if(result.error||!result.access_token){calendarStatus='Keine Calendar-Freigabe erteilt.';render();return;}
   calendarToken=result.access_token;
   calendarExpires=Date.now()+Math.max(0,Number(result.expires_in||3600)-60)*1000;
   await fetchCalendar();
 }});
 client.requestAccessToken({prompt:'consent'});
}
function watchOverview(){
 const sessions=activeActivities(watchSessions,state);
 const today=localDate();const monday=new Date(today+'T12:00:00');monday.setDate(monday.getDate()-((monday.getDay()+6)%7));const weekStart=localDate(monday);
 const rows=[['Heute',sessions.filter(x=>x.startedAt.slice(0,10)===today)],['Diese Woche',sessions.filter(x=>x.startedAt.slice(0,10)>=weekStart)],['Erfasst',sessions]];
 return `<div class="compass-tracking-grid">${rows.map(([label,items])=>`<div class="tracking-period"><span>${label}</span><strong>${(items.reduce((a,x)=>a+x.durationMinutes,0)/60).toLocaleString('de-AT',{maximumFractionDigits:1})} h</strong><small>${items.reduce((a,x)=>a+(x.pomodoros||0),0)} Pomodoros · ${items.length} Sessions</small></div>`).join('')}</div><p class="stats-caption">Garmin: letzte maximal 50 Sessions plus manuelle Einträge; Änderungen am Rohdatensatz bleiben getrennt. Schlafdaten sind nicht angebunden.</p>`;
}

let weather={status:'idle',city:'Graz',temperature:null,label:''};
function persist() {
  const snapshot=structuredClone(state);
  saveQueue=saveQueue.catch(()=>{}).then(()=>vault.save(snapshot));
  return saveQueue;
}
const h=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const date=s=>s?new Date(s).toLocaleString('de-AT',{dateStyle:'medium',timeStyle:'short'}):'–';
const configured=()=>config.apiUrl.startsWith('https://')&&!config.apiUrl.includes('YOUR_')&&
  config.googleClientId.endsWith('.apps.googleusercontent.com')&&!config.googleClientId.includes('REPLACE');
function toast(s,isError=false) {if(isError){error=s;notice='';}else{notice=s;error='';}render();}
function download(filename,obj) {
  const blob=new Blob([JSON.stringify(obj,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;a.click();
  setTimeout(()=>URL.revokeObjectURL(url),3000);
}
async function mutate(fn) {
  if(!state)throw new Error('Der Tresor muss entsperrt sein.');
  prepareTasks(state);
  const previous=structuredClone(state);
  try {
    fn(state);
    if(privateChanged(previous,state)){
      if(state.privateDeviceMirror?.mode==='receiver')throw Error('Finanz- und importierte Sportdaten sind auf diesem Gerät im Lesemodus. Bitte Änderungen am Hauptgerät durchführen.');
      if(state.privateDeviceMirror?.mode==='source')state.privateDeviceMirror.dirty=true;
    }
    await persist();
  }catch(ex){state=previous;render();throw new Error(`Lokales Speichern fehlgeschlagen: ${ex.message}`);}
  render();
  if(busy)syncResyncRequested=true;
  else scheduleSync();
}
async function addCapture(title,note=''){
  const cleanTitle=String(title||'').trim();const cleanNote=String(note||'').trim();
  if(!cleanTitle||cleanTitle.length>1000)throw new Error('Bitte einen Gedanken mit maximal 1.000 Zeichen eingeben.');
  if(cleanNote.length>10000)throw new Error('Die Notiz ist zu lang (max. 10.000 Zeichen).');
  await mutate(s=>{
    const r={id:crypto.randomUUID(),title:cleanTitle,note:cleanNote,tags:[],deleted:false,updatedAt:stamp()};
    s.records[r.id]=r;s.pending.push(makeMutation(r));s.history.push({type:'captured',at:stamp(),id:r.id});
  });
}

const stamp=()=>new Date().toISOString();
function makeMutation(record) {
  return {id:record.id,mutationId:crypto.randomUUID(),baseVersion:0,title:record.title,
    note:record.note,deleted:record.deleted,tags:record.tags||[]};
}
// The dashboard is the permanent future-state information architecture.
// Locked and not-yet-implemented modules display neutral, inert states.
const symbol = {
  home:'<path d="m3 10 9-7 9 7"/><path d="M5 9v12h14V9"/><path d="M9 21v-7h6v7"/>',
  inbox:'<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 13h5l2 3h4l2-3h5"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  activity:'<path d="M3 17V9m6 8V5m6 12v-7m6 7V3"/>',
  people:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
  checkSquare:'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="m8 12 3 3 5-6"/>',
  compass:'<circle cx="12" cy="12" r="9"/><path d="m16.6 7.4-2.5 6.7-6.7 2.5 2.5-6.7z"/>',
  spark:'<path d="m12 2 2.8 7.2L22 12l-7.2 2.8L12 22l-2.8-7.2L2 12l7.2-2.8z"/>',
  pencil:'<path d="m15 5 4 4M4 20l4.5-1 11-11a2.8 2.8 0 0 0-4-4l-11 11z"/>',
  eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff:'<path d="m3 3 18 18M2 12s4-7 10-7 10 7 10 7c-.6 1-1.3 1.9-2.2 2.8M7 18.5A12 12 0 0 1 2 12"/>',
  folder:'<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10H3z"/>',
  search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M12 2v2m0 16v2M4.9 4.9l1.5 1.5m11.2 11.2 1.5 1.5M2 12h2m16 0h2M4.9 19.1l1.5-1.5M17.6 6.4l1.5-1.5"/>',
  arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
  arrowLeft:'<path d="M19 12H5m6-6-6 6 6 6"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  cloud:'<path d="M8 18H6a4 4 0 0 1-.3-8 6.7 6.7 0 0 1 13 .2A4 4 0 0 1 18 18H8z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/>',
  layers:'<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 10h16M10 4v16"/>',
  moon:'<path d="M20.5 14.2a8.6 8.6 0 0 1-10.7-10.7 9 9 0 1 0 10.7 10.7z"/>',
  shield:'<path d="M12 2 4 5v6c0 5 3.4 8.7 8 11 4.6-2.3 8-6 8-11V5z"/><path d="m8.5 12 2.3 2.3 4.7-4.8"/>',
  sync:'<path d="M20 8a8 8 0 0 0-14-2L4 8m0-4v4h4M4 16a8 8 0 0 0 14 2l2-2m0 4v-4h-4"/>',
  flag:'<path d="M5 3v19M5 4h14l-3 5 3 5H5"/>',
  pause:'<circle cx="12" cy="12" r="9"/><path d="M9 8v8M15 8v8"/>',
  list:'<path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
  book:'<path d="M12 7a8 8 0 0 0-9-2v14a8 8 0 0 1 9 2M12 7a8 8 0 0 1 9-2v14a8 8 0 0 0-9 2M12 7v14"/>',
  bookmark:'<path d="M5 3h14v18l-7-5-7 5z"/>',
  suitcase:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M9 7V4h6v3M3 12h18"/>',
  bolt:'<path d="m13 2-9 12h7l-1 8 10-13h-7z"/>',
  chevronDown:'<path d="m6 9 6 6 6-6"/>',
  bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>'
};
function ico(name, size=19) {return `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">${symbol[name]||symbol.compass}</svg>`;}
const rows=()=>inboxRecords(state);
const disabledButton=(label='Öffnen')=>`<button class="ghost-cta" type="button" disabled aria-label="${h(label)} – noch nicht freigeschaltet">${h(label)} ${ico('arrow',13)}</button>`;
function navItem(id,label,iconName,{disabled=false,count=null}={}) {
 const attr=disabled?'disabled aria-disabled="true" title="Noch nicht freigeschaltet"':`data-tab="${id}"`;
 // Projects keeps a native deep-link fallback. If JavaScript navigation ever fails,
 // the browser can still open the projects route instead of leaving a dead item.
 const tag=id==='projects'&&!disabled?'a':'button';
 const link=tag==='a'?`href="?view=projects"`: 'type="button"';
 return `<${tag} ${link} class="nav-item ${tab===id?'is-active':''} ${disabled?'is-disabled':''}" ${attr}>
  ${ico(iconName,19)}<span>${h(label)}</span>${count!==null?`<span class="nav-count">${count}</span>`:''}</${tag}>`;
}
function chrome(content){
 const num=rows().length;
 const today=new Intl.DateTimeFormat('de-AT',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date());
 const title=tab==='today'&&selectedDay!==localDateString(new Date())?new Intl.DateTimeFormat('de-AT',{weekday:'long',day:'numeric',month:'long'}).format(new Date(`${selectedDay}T12:00:00`)):(({today:'Heute',forecast:'Forecast',radar:'Konferenzen',projects:'Projekte',templates:'Vorlagen',next:'Next Actions',flagged:'Flagged',hold:'On Hold',someday:'Dreams',review:'Wochenreview',overview:'Übersicht',inbox:'Inbox',system:'System & Synchronisation',activity:'Aktivitäten',people:'Menschen',progress:'Fortschritt',recovery:'Erholung',health:'Gesundheit',insights:'Insights',finance:'Finanzen'})[tab]||'Heute');
 const sub=({activity:'Sessions bearbeiten, zuordnen und verwalten.',people:'Gespräche, offene Punkte und Kontakte.',progress:'Fortschritt bei Projekten und Tätigkeiten.',recovery:'Aktive Erholung und freie Zeit im Blick.',health:'Schlaf, HRV und Körperzusammensetzung – Garmin und Fitdays an einem Ort.',insights:'Personal Analytics · Muster in Schlaf, Energie und Produktivität erkennen.',today:'Was heute wirklich zählt.',forecast:'Termine, Fristen und Agenden auf einer Zeitachse.',radar:'Forschungsmöglichkeiten und verifizierbare Einreichfristen.',projects:'Ergebnisse verfolgen, nächste Schritte verbinden.',next:'Alle ausführbaren nächsten Schritte, auch ohne Datum.',flagged:'Bewusst hervorgehobene Aufgaben.',hold:'Bewusst pausiert oder auf Rückmeldung wartend.',someday:'Someday / Maybe · Ein Raum für Ideen ohne Verpflichtung.',review:'Gedanken klären, Verpflichtungen prüfen und bewusst wählen.',overview:'Alle Lebensbereiche auf einen Blick.',inbox:'Alles erfassen. Später in Ruhe klären.',system:'Deine Geräteverbindung und Datensicherheit.'})[tab]||'';
 return `<div class="shell"><aside class="sidebar" aria-label="Navigation">
 <div class="brand"><span class="brand-icon">${ico('compass',24)}</span><span class="brand-name">Compass<small>Personal Life Manager · ${COMPASS_CLIENT_VERSION}</small></span></div>
 <nav class="side-nav calm-side-nav" aria-label="Hauptnavigation">
 ${navItem('today','Heute','sun')}
 ${navItem('inbox','Inbox','inbox',{count:num})}
 <div class="calm-nav-group">
 <button type="button" class="calm-group-toggle ${calmNavGroup==='plan'?'is-open':''}" data-action="calm-nav-group" data-id="plan" aria-expanded="${calmNavGroup==='plan'}" aria-controls="calm-nav-plan">${ico('folder',19)}<span>Planen</span>${ico('arrow',14)}</button>
 ${calmNavGroup==='plan'?`<div class="calm-subitems" id="calm-nav-plan">
 <button type="button" class="calm-mobile-nav-back" data-action="calm-nav-group" data-id="plan" aria-label="Zur Hauptnavigation zurück">${ico('arrow',15)}<span>Menü</span></button>
 ${navItem('overview','Übersicht','layers')}
 ${navItem('next','Next Actions','target')}
 ${navItem('projects','Projekte','folder')}
 ${navItem('templates','Vorlagen','bookmark')}
 ${navItem('forecast','Kalender & Forecast','calendar')}
 ${navItem('radar','Konferenzen','book')}
 ${navItem('flagged','Flagged','flag')}
 ${navItem('hold','On Hold','pause')}
 ${navItem('someday','Dreams · Someday','spark')}
 </div>`:''}
 </div>
 ${navItem('people','Menschen','people')}
 <div class="calm-nav-group">
 <button type="button" class="calm-group-toggle ${calmNavGroup==='insights'?'is-open':''}" data-action="calm-nav-group" data-id="insights" aria-expanded="${calmNavGroup==='insights'}" aria-controls="calm-nav-insights">${ico('layers',19)}<span>Insights</span>${ico('arrow',14)}</button>
 ${calmNavGroup==='insights'?`<div class="calm-subitems" id="calm-nav-insights">
 <button type="button" class="calm-mobile-nav-back" data-action="calm-nav-group" data-id="insights" aria-label="Zur Hauptnavigation zurück">${ico('arrow',15)}<span>Menü</span></button>
 <button type="button" class="nav-item ${tab==='insights'&&['sleep','energy','stress','body'].includes(insightTab)?'is-active':''}" data-action="calm-insight-view" data-id="sleep">${ico('moon',19)}<span>Gesundheit</span></button>
 ${navItem('activity','Aktivitäten','activity')}
 ${navItem('recovery','Erholung','heart')}
 <button type="button" class="nav-item ${tab==='insights'&&insightTab==='places'?'is-active':''}" data-action="calm-insight-view" data-id="places">${ico('compass',19)}<span>Orte & Weltkarte</span></button>
 ${navItem('progress','Fortschritt','target')}
 <button type="button" class="nav-item ${tab==='insights'&&insightTab==='balance'?'is-active':''}" data-action="calm-insight-view" data-id="balance">${ico('compass',19)}<span>Life Balance Radar</span></button>
 <button type="button" class="nav-item ${tab==='insights'&&insightTab==='focus'?'is-active':''}" data-action="calm-insight-view" data-id="focus">${ico('target',19)}<span>Produktivität</span></button>
 <button type="button" class="nav-item ${tab==='insights'&&insightTab==='worktime'?'is-active':''}" data-action="calm-insight-view" data-id="worktime">${ico('clock',19)}<span>Arbeitszeit</span></button>
 <button type="button" class="nav-item ${tab==='insights'&&insightTab==='explore'?'is-active':''}" data-action="calm-insight-view" data-id="explore">${ico('spark',19)}<span>Explore</span></button>
 <button type="button" class="nav-item ${tab==='insights'&&insightTab==='sources'?'is-active':''}" data-action="calm-insight-view" data-id="sources">${ico('settings',19)}<span>Datenquellen</span></button>
 </div>`:''}
 </div>
 <div class="calm-nav-group">
 <button type="button" class="calm-group-toggle ${calmNavGroup==='finance'?'is-open':''}" data-action="calm-nav-group" data-id="finance" aria-expanded="${calmNavGroup==='finance'}" aria-controls="calm-nav-finance">${ico('folder',19)}<span>Finanzen</span>${ico('arrow',14)}</button>
 ${calmNavGroup==='finance'?`<div class="calm-subitems" id="calm-nav-finance">
 <button type="button" class="calm-mobile-nav-back" data-action="calm-nav-group" data-id="finance" aria-label="Zur Hauptnavigation zurück">${ico('arrow',15)}<span>Menü</span></button>
 ${FINANCE_GROUPS.map(group=>`<button type="button" class="nav-item fin43-side-item ${tab==='finance'&&financeGroupForPane(financePane).title===group.title?'is-active':''}" data-action="calm-finance-group" data-id="${h(group.title)}" aria-current="${tab==='finance'&&financeGroupForPane(financePane).title===group.title?'page':'false'}">${ico(({Überblick:'layers',Ausgaben:'activity',Vermögen:'folder',Planung:'target',Werkzeuge:'settings'})[group.title],17)}<span>${h(group.title)}</span></button>`).join('')}
 </div>`:''}</div>
 ${navItem('review','Wochenreview','sync')}
 <div class="nav-separator"></div>
 ${navItem('system','Einstellungen','settings')}
 </nav><div class="sidebar-foot">${ico('shield',16)} <span>Dein persönlicher Arbeitsraum</span></div>
 </aside><main class="workspace"><div class="utility-bar">
 <button type="button" class="search-shell capture-shortcut" data-action="capture-focus" title="Zur Schnellerfassung">${ico('search',17)}<span>Schnell erfassen ...</span><kbd>Ctrl / ⌘ K</kbd></button>
 <div class="utility-right"><button class="fw65-top-trigger" type="button" data-action="feeling-open" aria-label="Feeling Wheel öffnen – Gefühl erfassen" title="Wie fühlst du dich gerade? · Feeling Wheel" aria-haspopup="dialog"><span class="fw65-top-wheel" aria-hidden="true">✦</span><span class="fw65-top-caption">Gefühl</span></button><button class="icon-utility" type="button" data-action="smart49-open" title="Smart Import Hub öffnen" aria-label="Dateien zentral importieren">${ico('upload',18)}</button>${weather.status==='loaded'?`<button class="weather-quick" type="button" data-action="weather-city" title="Wetterstandort ändern">${ico('sun',15)} <span>${h(weather.city)} · ${h(weather.temperature)} °C · ${h(weather.label)}</span></button>`:`<button class="weather-quick" type="button" data-action="weather-load" title="Wetter für Graz abrufen">${ico('sun',15)} <span>${weather.status==='loading'?'Wetter lädt …':'Wetter · Graz'}</span></button>`}
 <span class="connection"><span class="connection-dot ${state?(authToken?'green':'amber'):'gray'}"></span><span>${state?(authToken?(state.privateDeviceMirror?'Planung + privater Geräteabgleich':'Planung synchronisiert · Importe lokal'):'Nur lokal · kein Sync'):'Tresor gesperrt'}</span></span>
 <span class="avatar" aria-label="Persönlicher Arbeitsbereich">${ico('compass',18)}</span>${state?`<button class="icon-utility" type="button" data-action="lock" title="Tresor sperren" aria-label="Tresor sperren">${ico('lock',19)}</button>`:''}</div></div>
 <div class="content ${tab==='today'||tab==='forecast'?'content-work':tab==='finance'?'content-finance':''}">
 <div class="page-intro page-intro-compact"><h1>${h(title)}</h1><span class="page-compact-info">${h(today)}</span></div>
 ${notice&&!((tab==='finance'||tab==='insights')&&notice==='Synchronisiert. Alle verfügbaren Änderungen abgeglichen.')?`<div role="status" class="alert good ${tab==='finance'?'fin31-sync-status':''}">${h(notice)}</div>`:''}${error?`<div role="alert" class="alert bad">${h(error)}</div>`:''}
 ${content}<footer>Compass · Private Beta · Lokal verschlüsselt ${ico('shield',13)}</footer></div></main>${state?`<button class="capture-fab" type="button" data-action="capture-focus" aria-label="Schnellerfassung öffnen" title="Gedanken erfassen">${ico('plus',23)}</button>`:``}${state&&captureOverlayOpen?captureOverlay():``}${state&&feelingOverlayOpen?feelingOverlay(feelingDraft,state.feelingCheckins||[]):``}</div>`;
}

function moduleCard({name,iconName,sub='',action='',body='',cls='',active=false}){
 return `<section class="module-card ${cls} ${active?'module-active':'module-inactive'}" aria-label="${h(name)}">
 <div class="module-head"><div class="module-title">${ico(iconName,21)}<h2>${h(name)}</h2></div>${action?disabledButton(action):''}</div>
 ${sub?`<p class="module-subtitle">${h(sub)}</p>`:''}${body}</section>`;
}
const placeholder=(text='Noch keine Einträge')=>`<div class="empty-minimal"><span class="empty-circle">${ico('plus',17)}</span><span>${h(text)}</span></div>`;
function inboxPreview(){
 const list=rows().slice(0,3);
 return moduleCard({name:'Inbox',iconName:'inbox',cls:'inbox-preview',active:true,sub:list.length?`${rows().length} offene Einträge`:'Dein Eingang ist leer.',body:list.length?`<div class="compact-items">${list.map(r=>`<div class="compact-item"><span class="tiny-square"></span><span>${h(r.title)}</span></div>`).join('')}</div>`:placeholder('Alles erfasst – nichts wartet.' )})
   .replace('</section>',`<button class="text-link" type="button" data-tab="inbox">Inbox öffnen ${ico('arrow',14)}</button></section>`);
}
function captureCard(locked=false){
 return `<section class="module-card module-active capture-card"><div class="module-head"><div class="module-title">${ico('pencil',21)}<h2>Schnellerfassung</h2></div></div>
 <p class="module-subtitle">Ein Gedanke. Ein verlässlicher Ort.</p>
 <form id="capture-form"><label class="sr-only" for="capture">Gedanke erfassen</label><textarea id="capture" name="title" maxlength="1000" required rows="3" placeholder="Was möchtest du festhalten?" ${locked?'disabled':''}></textarea>
 <div class="capture-bottom"><span>Inbox · zunächst ungeordnet</span><button type="submit" class="primary-btn" ${locked?'disabled':''}>Erfassen ${ico('arrow',16)}</button></div></form></section>`;
}
function dashboardCards(locked=false){
 const todayCards=tasksForDay(state,localDateString(new Date()));
 const skeleton='<div class="skeleton-lines"><div></div><div></div><div></div></div>';
 return `<div class="dashboard-grid">
 ${moduleCard({name:'Heute',iconName:'sun',cls:'grid-today',active:true,sub:'Deine Tagesübersicht',body:todayCards.length?`<div class="dashboard-today-tasks">${todayCards.slice(0,4).map(t=>`<div>${ico(t.completed?'check':'checkSquare',16)} <span>${h(t.title)}</span></div>`).join('')}</div><small class="stats-caption">${todayCards.filter(t=>t.completed).length} / ${todayCards.length} erledigt</small>`:`<div class="today-placeholder">${ico('calendar',28)}<span>Keine Aufgaben für heute geplant</span><small>Geplante Aufgaben findest du unter Heute.</small></div>`}).replace('</section>',`<button class="text-link" type="button" data-tab="today">Heute öffnen ${ico('arrow',14)}</button></section>`)}
 ${moduleCard({name:'Nächste Aktionen',iconName:'target',cls:'grid-next',active:true,sub:'Ausführbar, ohne künstliche Deadline',body:nextActions(state).length?taskList(nextActions(state).slice(0,3),'dashboard')+'<button class="text-link" type="button" data-tab="next">Alle Next Actions '+ico('arrow',14)+'</button>':placeholder('Noch keine nächsten Schritte erfasst.')})}
 ${captureCard(locked)}
 ${inboxPreview()}
 ${moduleCard({name:'Wochenreview',iconName:'sync',cls:'grid-review',active:true,sub:'Klarheit gewinnen. Regelmäßig.',body:`<div class="review-steps review-steps-icon"><div>${ico('inbox',16)} Eingang klären</div><div>${ico('checkSquare',16)} Nächste Schritte</div><div>${ico('calendar',16)} Fristen prüfen</div></div><button class="text-link" type="button" data-tab="review">Wochenreview öffnen ${ico('arrow',14)}</button>`})}
 ${moduleCard({name:'Projekte',iconName:'folder',cls:'grid-projects',active:true,sub:'Aktive Ergebnisse und nächste Schritte',body:`<div class="project-summary"><strong>${Object.values(state?.projects||{}).filter(p=>p.status==='active').length}</strong><span>aktive Projekte</span><small>${Object.values(state?.projects||{}).filter(p=>p.status==='active'&&!nextActions(state).some(t=>t.projectId===p.id)).length} ohne nächste Aktion</small></div><button type="button" class="text-link" data-tab="projects">Projekte öffnen ${ico('arrow',14)}</button>`})}
 ${moduleCard({name:'Kalender & Fokus',iconName:'calendar',cls:'grid-calendar',active:true,sub:'Deine Termine (Google, nur lesend)',body:calendarToken?calendarCardRows(localDateString(new Date())):calendarConnectUI()})}

 ${moduleCard({name:'Menschen',iconName:'people',cls:'grid-people',active:true,sub:'Gespräche & Agenden',body:`<div class="project-summary"><strong>${Object.keys(state?.people||{}).length}</strong><span>Kontakte im Tresor</span></div><button type="button" class="text-link" data-tab="people">Menschen öffnen ${ico('arrow',14)}</button>`})}
 ${moduleCard({name:'Activity Tracking',iconName:'activity',cls:'grid-activity',active:true,sub:'Garmin · Fokuszeit · Pomodoro',body:watchOverview()}).replace('</section>',`<button class="text-link" type="button" data-tab="activity">Aktivitäten ansehen ${ico('arrow',14)}</button></section>`)}
 </div>`;
}
function localDateString(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
const dayFormat=d=>new Intl.DateTimeFormat('de-AT',{weekday:'short',day:'numeric'}).format(d);
function miniCalendar(){
 const first=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth(),1);
 const start=new Date(first);start.setDate(1-((first.getDay()+6)%7));
 const now=localDateString(new Date());
 const cells=Array.from({length:42},(_,i)=>{const d=new Date(start);d.setDate(start.getDate()+i);const key=localDateString(d);
  return `<button type="button" data-action="select-day" data-id="${key}" class="cal-cell ${d.getMonth()!==first.getMonth()?'outside':''} ${key===now?'today-mark':''} ${key===selectedDay?'selected':''}" aria-label="${h(dayFormat(d))}" aria-pressed="${key===selectedDay}">${d.getDate()}</button>`;}).join('');
 const month=new Intl.DateTimeFormat('de-AT',{month:'long',year:'numeric'}).format(first);
 const days=['Mo','Di','Mi','Do','Fr','Sa','So'].map(x=>`<span>${x}</span>`).join('');
 return `<section class="mini-month" aria-label="Monatskalender"><div class="month-head"><strong>${h(month)}</strong><div><button type="button" class="month-arrow" data-action="month-prev" title="Vorheriger Monat" aria-label="Vorheriger Monat">‹</button><button type="button" class="month-arrow" data-action="month-next" title="Nächster Monat" aria-label="Nächster Monat">›</button></div></div><div class="cal-weekdays">${days}</div><div class="cal-cells">${cells}</div></section>`;
}
function calendarRail(){
 const shown=new Date(`${selectedDay}T12:00:00`);
 return `<aside class="date-rail" aria-label="Kalender und Tagesnavigation">${miniCalendar()}
 <div class="rail-metrics"><button type="button" data-action="reset-today" class="rail-metric"><strong>Heute</strong><small>${h(new Intl.DateTimeFormat('de-AT',{day:'2-digit',month:'2-digit'}).format(new Date()))}</small></button><span class="rail-metric rail-inert"><strong>Offen</strong><small>–</small></span></div>
 <div class="rail-caption">Nächste 7 Tage</div><div class="rail-days">${Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()+i);return `<button class="rail-day ${localDateString(d)===selectedDay?'on':''}" type="button" data-action="select-day" data-id="${localDateString(d)}"><span>${h(dayFormat(d))}</span><small>–</small></button>`;}).join('')}</div><p class="rail-footnote">Kalendereinträge erscheinen nach der Google-Verbindung. Aufgaben bleiben in Compass.</p></aside>`;
}
function datesPreview(){return `<div class="date-prototype"><div>${ico('calendar',16)}<span>Wunschtermin</span><span class="date-value">–</span></div><div>${ico('flag',16)}<span>Harte Deadline</span><span class="date-value">–</span></div><div>${ico('clock',16)}<span>Frühestens ab</span><span class="date-value">–</span></div></div>`;}
function lifeGoalsPanel(){
 const goals=lifeGoals(state),projects=Object.values(state?.projects||{}).filter(p=>p.kind!=='folder'&&!p.isTemplate&&p.status==='active');
 return `<details class="work-card v22-goals" aria-label="Lebensziele und Projekte"><summary>${ico('target',18)} Lebensziele & Projekte <small>· ${goals.filter(g=>g.status==='active').length} aktiv · lokal verschlüsselt</small></summary>
 <p class="muted-line">Ein Ziel beschreibt ein längerfristiges Ergebnis. Projektzuordnungen schaffen einen nachvollziehbaren Bezug zu vorhandenen Next Actions; Projekt- und Aufgaben-Daten bleiben unverändert.</p><details class="v221-life-areas"><summary>Die sieben Lebensbereiche nach John Demartini · optional</summary><p class="muted-line">Zusätzlicher Blick auf deine Ziele: mental, beruflich, finanziell, familiär, sozial, körperlich und spirituell. Kein Balance-Score und keine Pflicht, in jedem Bereich Ziele anzulegen.</p><div class="v221-areas-grid">${LIFE_AREAS.map(([key,label])=>`<div class="v221-area"><span>${h(label)}</span><strong>${goals.filter(g=>g.lifeArea===key).length}</strong></div>`).join('')}</div><small>Freiwillige Orientierung nach Demartinis „Master Planning for Life“. Deine bisherigen Compass-Bereiche wie Forschung oder Lehre bleiben erhalten.</small></details>
 ${goals.map(goal=>{const prog=lifeGoalProgress(state,goal);return `<article class="v22-goal"><div><strong>${h(goal.title)}</strong><small>${h(goal.area)}${goal.lifeArea?' · '+h(lifeAreaLabel(goal.lifeArea)):''} · ${goal.status==='active'?'Aktiv':goal.status==='paused'?'Pausiert':'Erreicht'}${goal.targetDate?' · Zieltermin '+h(goal.targetDate):''}</small>${goal.outcome?`<p>${h(goal.outcome)}</p>`:''}<small>${prog.projects} verknüpfte Projekte · ${prog.completed} von ${prog.taskCount} Aufgaben erledigt${prog.missingProjects?' · '+prog.missingProjects+' Projekte nicht mehr vorhanden':''}</small></div><div class="v22-goal-actions"><label class="v221-area-select">7 Lebensbereiche <select id="life-area-${h(goal.id)}" aria-label="Demartini-Lebensbereich für ${h(goal.title)}"><option value="">Ohne Zuordnung</option>${LIFE_AREAS.map(([key,label])=>`<option value="${key}" ${goal.lifeArea===key?'selected':''}>${h(label)}</option>`).join('')}</select></label><button type="button" class="secondary-btn" data-action="life-goal-area" data-id="${h(goal.id)}">Zuordnen</button>${goal.projectIds.map(id=>state?.projects?.[id]?`<button type="button" class="secondary-btn" data-action="life-goal-project-open" data-id="${h(id)}">${h(state.projects[id].title)} ↗</button>`:'').join('')}
 <select id="life-goal-project-${h(goal.id)}" aria-label="Projekt zu Ziel hinzufügen"><option value="">Projekt verbinden …</option>${projects.filter(p=>!goal.projectIds.includes(p.id)).map(p=>`<option value="${h(p.id)}">${h(p.title)}</option>`).join('')}</select><button type="button" class="secondary-btn" data-action="life-goal-link" data-id="${h(goal.id)}">Verbinden</button><button type="button" class="secondary-btn" data-action="life-goal-toggle" data-id="${h(goal.id)}">${goal.status==='active'?'Pausieren':'Aktivieren'}</button><button type="button" class="secondary-btn" data-action="life-goal-remove" data-id="${h(goal.id)}">Entfernen</button></div></article>`;}).join('')||'<p class="muted-line">Noch kein Lebensziel definiert. Beginne mit einem konkreten Ergebnis, das dir persönlich wichtig ist.</p>'}
 <details class="calm-create"><summary>${ico('plus',15)} Lebensziel anlegen</summary><form id="life-goal-form" class="v22-goal-form"><label>Zielname<input name="title" required maxlength="120" placeholder="Was möchte ich erreichen?"/></label><label>Gewünschtes Ergebnis<textarea name="outcome" maxlength="600" rows="2" placeholder="Woran erkenne ich den Fortschritt?"></textarea></label><label>Compass-Bereich<select name="area">${categoryOptions()}</select></label><label>7 Lebensbereiche (optional)<select name="lifeArea"><option value="">Ohne Zuordnung</option>${LIFE_AREAS.map(([key,label])=>`<option value="${key}">${h(label)}</option>`).join('')}</select></label><label>Erstes Projekt (optional)<select name="projectId">${projectOptions()}</select></label><label>Zieldatum (optional, keine Deadline)<input name="targetDate" type="date"/></label><button type="submit" class="primary-btn">Ziel speichern</button></form></details></details>`;
}
function localCapacity(startDay=localDateString(new Date()),days=14){
 return capacityForecast({events:calendarEvents,connected:!!(calendarToken&&Date.now()<calendarExpires),coverage:calendarCoverage,updatedAt:calendarUpdatedAt,now:new Date(),startDay,days,settings:state?.uiPreferences?.capacity||{}});
}
function compactCapacityHint(day=selectedDay){
 const model=localCapacity(day,1);
 if(model.status!=='ready')return `<div class="capacity-hint capacity-muted">${ico('clock',14)} <span>Freie Kalenderzeit ${model.status==='disconnected'?'unbekannt · Kalender verbinden':model.status==='stale'?'unbekannt · Kalender aktualisieren':'unbekannt · Kalender unvollständig'}</span><button type="button" class="capacity-link" data-tab="forecast">Forecast ↗</button></div>`;
 const d=model.days[0];return `<div class="capacity-hint">${ico('clock',14)} <span>${d.slots.length} Zeitfenster · ${capacityDuration(d.minutes)} innerhalb deines Arbeitsfensters</span><button type="button" class="capacity-link" data-tab="forecast">Prüfen ↗</button></div>`;
}
function capacityDuration(minutes){return minutes>=60?`${Math.floor(minutes/60)} h${minutes%60?' '+(minutes%60)+' min':''}`:`${minutes} min`;}
function capacityTime(ms){return new Intl.DateTimeFormat('de-AT',{hour:'2-digit',minute:'2-digit'}).format(new Date(ms));}
function capacityPanel(){
 const m=localCapacity(localDateString(new Date()),14),p=capacitySettings(state?.uiPreferences?.capacity||{});
 const status=m.status==='disconnected'?'Google Calendar verbinden':m.status==='partial'?'Kalenderabfrage ist unvollständig':m.status==='stale'?'Kalenderdaten aktualisieren':'Freie Fenster im Arbeitsrahmen (Work zählt als verfügbar)';
 const settings=`<details class="capacity-settings"><summary>Arbeitsfenster anpassen</summary><form id="capacity-settings-form" class="capacity-setting-form"><label>Ab <select name="startHour">${Array.from({length:14},(_,i)=>i+5).map(n=>`<option value="${n}" ${p.startHour===n?'selected':''}>${String(n).padStart(2,'0')}:00</option>`).join('')}</select></label><label>Bis <select name="endHour">${Array.from({length:18},(_,i)=>i+6).map(n=>`<option value="${n}" ${p.endHour===n?'selected':''}>${String(n).padStart(2,'0')}:00</option>`).join('')}</select></label><label>Puffer <select name="bufferMinutes">${[0,5,10,15,20,30].map(n=>`<option value="${n}" ${p.bufferMinutes===n?'selected':''}>${n} Min.</option>`).join('')}</select></label><label>Min. Fenster <select name="minSlotMinutes">${[15,20,30,45,60,90,120].map(n=>`<option value="${n}" ${p.minSlotMinutes===n?'selected':''}>${n} Min.</option>`).join('')}</select></label><label class="capacity-weekends"><input type="checkbox" name="weekends" ${p.weekends?'checked':''}/> Wochenenden</label><label>Verfügbarkeitsblöcke (exakte Titel)<input name="availabilityTitles" type="text" maxlength="200" value="${h(p.availabilityTitles)}" placeholder="Work, Deep Work" /></label><button type="submit" class="secondary-btn">Übernehmen</button></form></details>`;
 if(m.status!=='ready')return `<section class="capacity-forecast" aria-label="Kalenderkapazität"><div class="capacity-title">${ico('clock',17)} Freie Zeit · 14 Tage <small>nicht berechenbar</small></div><p class="muted-line">${h(status)}. Keine freien Stunden werden aus fehlenden Terminen abgeleitet.</p>${settings}</section>`;
 const useful=m.days.filter(d=>!d.off);
 const max=Math.max(1,...useful.map(d=>d.minutes));
 return `<section class="capacity-forecast" aria-label="Kalenderkapazität"><div class="capacity-title">${ico('clock',17)} Freie Zeit · nächste 14 Tage <strong>${capacityDuration(m.totalMinutes)}</strong></div><p class="muted-line">${h(status)} · ${p.startHour}–${p.endHour} Uhr · ${p.bufferMinutes} Min. Puffer je Termin · ${m.slots.length} mögliche Fenster</p><div class="capacity-days">${useful.map(d=>`<button type="button" class="capacity-day ${d.day===selectedForecastDay?'capacity-day-active':''}" data-action="daily-plan-day" data-id="${h(d.day)}" aria-pressed="${d.day===selectedForecastDay}" title="${h(d.day)}: ${capacityDuration(d.minutes)} in ${d.slots.length} Fenstern – Tagesplanung öffnen"><small>${h(new Intl.DateTimeFormat('de-AT',{weekday:'short',day:'numeric'}).format(new Date(d.day+'T12:00:00')))}</small><span class="capacity-track"><i style="width:${Math.round(100*d.minutes/max)}%"></i></span><strong>${capacityDuration(d.minutes)}</strong></button>`).join('')}</div>${settings}<p class="capacity-foot">Planungshilfe, keine Reservierung. Berücksichtigt nur den primären Google-Kalender und ein selbst gewähltes Arbeitsfenster. Ganztägige belegte Termine sperren den Tag. Exakt benannte Verfügbarkeitsblöcke (z. B. Work) blockieren nicht; andere ausgeblendete Termine blockieren weiterhin. Private Zeit, Wege und weitere Kalender können fehlen.</p></section>`;
}
function deadlineCompact({inForecast=false}={}){
 const model=localCapacity(localDateString(new Date()),14);
 const d=deadlineIntelligence(state,model);
 if(d.status==='unavailable')return ''; // capacity panel already explains missing calendar
 const risks=d.items.filter(x=>['conflict','overdue','tight'].includes(x.status));
 const unknown=d.unknown;
 if(!risks.length&&!unknown)return ''; // quiet by default
 const label=risks.some(x=>['conflict','overdue'].includes(x.status))?'Fristen & Kapazität prüfen':'Planung überprüfen';
 const detail=risks.slice(0,8).map(x=>`<button type="button" data-action="task-select" data-id="${h(x.task.id)}" class="deadline-item"><strong>${h(x.task.title)}</strong><span>${h(x.due)} · ${capacityDuration(x.minutes)} Restaufwand · ${x.status==='overdue'?'Frist überschritten':x.status==='conflict'?'Mehr Aufwand als freie Zeit':x.status==='tight'?'Wenig Puffer':'Prüfen'}${x.latestStart?' · rechnerisch spätestens '+capacityTime(x.latestStart)+' beginnen':''}</span></button>`).join('');
 return `<details class="deadline-insight ${risks.some(x=>x.status==='conflict'||x.status==='overdue')?'deadline-risk':''}" ${inForecast?'':'data-compact="true"'}><summary>${ico('flag',14)} ${h(label)} <span>${risks.length?risks.length+' mögliche Engpässe':''}${unknown?(risks.length?' · ':'')+unknown+' Aufgaben ohne Zeitschätzung':''}</span></summary><div class="deadline-details">${detail}${unknown?`<p class="muted-line">${unknown} Aufgaben mit Frist haben keine verlässliche Aufwandsschätzung und fehlen in der Kapazitätsrechnung.</p>${d.unknownTasks.slice(0,5).map(x=>`<button type="button" data-action="task-select" data-id="${h(x.task.id)}" class="deadline-item"><strong>${h(x.task.title)}</strong><span>${h(x.due)} · Aufwand fehlt</span></button>`).join('')}`:''}<p class="muted-line">${h(d.caveat)} Soft Deadlines sind keine harten Fristen. Prognose nur innerhalb der vollständigen Kalenderabdeckung; keine Termine werden angelegt.</p></div></details>`;
}
/** Preview only. The planner neither reserves slots nor alters deadlines. */
function proactivePlannerPanel(){
 const forecast=localCapacity(localDateString(new Date()),14);
 if(forecast.status!=='ready')return ''; // Capacity panel already explains unavailable data.
 const plan=proactivePlan(state,forecast);
 const risks=plan.shortfalls.length,unknown=plan.unknownCount||0;
 const title=risks?`${risks} Frist${risks===1?'':'en'} mit Zeitengpass`:
  plan.blocks.length?`${plan.blocks.length} mögliche Arbeitsblöcke`:'Keine passenden Aufgaben mit Aufwandsschätzung';
 const manual=dayPlanBlocks(state);
 const shown=plan.blocks.filter(b=>!manual.some(x=>x.start<b.end&&b.start<x.end)).slice(0,10);
 const rows=shown.map(b=>{
  const date=new Intl.DateTimeFormat('de-AT',{weekday:'short',day:'numeric',month:'short'}).format(new Date(b.day+'T12:00:00'));
  return `<div class="v47-plan-row"><div class="v47-plan-when"><strong>${h(date)}</strong><small>${capacityTime(b.start)}–${capacityTime(b.end)} · ${b.minutes} min</small></div><button class="v47-plan-task" type="button" data-action="task-select" data-id="${h(b.task.id)}"><strong>${h(b.task.title)}</strong><small>${h(b.reason)}${b.remainingAfter?' · Teilblock':''}</small></button><button class="v47-plan-mark" data-action="planner-mark" data-id="${h(b.task.id)}" data-day="${h(b.day)}" type="button" title="Nur als Wunschtermin vormerken, keine Kalenderreservierung">Vormerken</button></div>`;
 }).join('');
 const warnings=plan.shortfalls.slice(0,4).map(x=>`<button class="v47-plan-warning" type="button" data-action="task-select" data-id="${h(x.task.id)}">${ico('flag',12)} ${h(x.task.title)} · ${x.reason==='overdue'?'Frist überschritten':capacityDuration(x.remaining)+' nicht eingeplant'}</button>`).join('');
 return `<details id="v47-plan" class="v47-planner" ${plannerExpanded?'open':''}><summary>${ico('calendar',15)} Planvorschlag · ${h(title)} <span>${unknown?unknown+' ohne Aufwand · ':''}14 Tage</span></summary><div class="v47-plan-content">${warnings}${unknown?`<p class="muted-line">${unknown} weitere Aufgaben mit Frist benötigen eine Aufwandsschätzung.</p>`:''}${rows||'<p class="muted-line">Kein passender Block mit verlässlicher Aufwandsschätzung. Du kannst die Aufgaben im Inspector ergänzen.</p>'}${plan.blocks.length>shown.length?`<p class="muted-line">${plan.blocks.length-shown.length} weitere Blöcke nicht angezeigt. Du kannst Aufgaben priorisieren oder Aufwandsschätzungen anpassen.</p>`:''}<p class="v47-plan-note">Nur Vorschläge innerhalb erfasster Zeitfenster. <strong>Vormerken</strong> setzt ausschließlich den Wunschtag (Planned), keine harte Frist oder Kalenderreservierung. Work gilt als verfügbare Arbeitszeit; Meetings bleiben blockiert. ${h(plan.caveat)}</p></div></details>`;
}
/** 0.5.48: quiet, user-approved daily plan; suggestions remain real GTD Next Actions. */
function dailyPlanPanel(){
 const today=localDateString(new Date()),t=new Date(today+'T12:00:00');t.setDate(t.getDate()+1);const tomorrow=localDateString(t);
 const range=localCapacity(today,14),day=range.days.some(d=>d.day===selectedForecastDay)?selectedForecastDay:today;
 const saved=dayPlanBlocks(state,day),status=dayPlanStatus(state,day,new Date(),range);
 const canEdit=range.status==='ready'&&day>=today;
 const allCandidates=dayCandidates(state,day,150,{forecast:range});
 const undated=allCandidates.filter(x=>needsDateDecision(state,x.task));
 const visibleCandidates=dailyPlanShowUndated?undated:allCandidates;
 const candidates=visibleCandidates.slice(0,dailyPlanShowAll?75:10);
 const selected=allCandidates.find(x=>x.task.id===dailyPlanPicked);
 const entries=dayDropTargets(range,day);
 const takenAt=ms=>saved.find(b=>ms>=b.start&&ms<b.end);
 const timeOf=ms=>capacityTime(ms);
 const taskButton=x=>{
  const t=x.task;
  const remaining=x.minutes===null?'Aufwand offen':`${x.minutes} min Rest`;
  const reason=x.due&&x.due<=day?'Frist heute/überfällig':t.plannedDate===day?'Für diesen Tag vorgemerkt':x.due?'Frist '+x.due:t.flagged?'Markiert':'Next Action';
  const urgency=x.urgency;
  const score=urgency.score===null?'':`<span class="v48-urgency v48-urgency-${h(urgency.tone)}" title="${h(urgency.detail)}" aria-label="Dringlichkeit: ${h(urgency.label)}. ${h(urgency.detail)}">${urgency.atRisk?'Gefährdet':urgency.score}</span>`;
  const askDate=needsDateDecision(state,t);
  const dateButton=askDate?`<button type="button" class="v48-date-nudge" data-action="daily-plan-date-edit" data-id="${h(t.id)}" title="Wunschtag oder echte Frist festlegen">Datum prüfen</button>`:'';
  const inlineDate=dailyPlanDateTask===t.id?`<form class="v48-date-form" data-id="${h(t.id)}"><label>Art <select name="dateKind"><option value="plannedDate">Wunschtag (unverbindlich)</option><option value="dueDate">Harte Deadline</option></select></label><label>Datum <input required type="date" name="dateValue" /></label><button type="submit" class="v48-date-save">Speichern</button><button type="button" class="v48-date-cancel" data-action="daily-plan-date-edit" data-id="${h(t.id)}">Abbrechen</button></form>`:'';
  return `<div class="v48-candidate-wrap"><div class="v48-candidate v48-candidate-${h(urgency.tone)} ${dailyPlanPicked===t.id?'v48-picked':''}" draggable="${canEdit}" data-day-drag="${h(t.id)}"><button class="v48-pick" type="button" data-action="daily-plan-pick" data-id="${h(t.id)}" aria-pressed="${dailyPlanPicked===t.id}"><span class="v48-task-title"><strong>${h(t.title)}</strong>${score}</span><small>${h(reason)} · ${h(remaining)}${x.scheduled?' · '+x.scheduled+' min im Tagesplan':''}</small></button>${dateButton}<button type="button" class="v48-task-details" data-action="task-select" data-id="${h(t.id)}" title="Aufgabe bearbeiten" aria-label="Details zu ${h(t.title)}">${ico('arrow',13)}</button></div>${inlineDate}</div>`;
 };
 const slotted=new Set();
 const targets=entries.map(x=>{
  const occupied=takenAt(x.start);
  if(occupied){if(slotted.has(occupied.id))return '';
   slotted.add(occupied.id);
   const task=state?.tasks?.[occupied.taskId];
   return `<div class="v48-slot v48-booked" draggable="${canEdit&&!occupied.done&&!task?.completed}" data-day-drag="${h(occupied.taskId)}" data-day-move="${h(occupied.id)}"><span class="v48-time">${timeOf(occupied.start)}–${timeOf(occupied.end)}</span><span class="v48-slot-task"><strong>${h(task?.title||'Aufgabe nicht gefunden')}</strong><small>${occupied.done||task?.completed?'Erledigt':occupied.estimateUnknown?'Aufwand vorläufig':'Geplant'} · ${occupied.minutes} min</small></span><button type="button" data-action="daily-plan-done" data-id="${h(occupied.id)}" aria-label="Arbeitsblock als erledigt markieren" title="${occupied.done?'Erledigung zurücknehmen':'Arbeitsblock erledigt'}" class="v48-done ${occupied.done||task?.completed?'done':''}">${ico('checkSquare',14)}</button><button type="button" data-action="daily-plan-remove" data-id="${h(occupied.id)}" class="v48-remove" title="Block entfernen" aria-label="Block entfernen">×</button></div>`;
  }
  return `<button type="button" class="v48-slot v48-empty" data-day-drop="${x.start}" data-action="daily-plan-place" data-step="${x.start}" aria-label="Aufgabe um ${timeOf(x.start)} hier einplanen" ${canEdit?'':'disabled'}><span class="v48-time">${timeOf(x.start)}</span><span>＋ ${dailyPlanPicked?'Hier einplanen':'frei'}</span></button>`;
 }).join('');
 const blocksOutsideTargets=saved.filter(b=>!slotted.has(b.id)).map(b=>{
  const t=state?.tasks?.[b.taskId];
  return `<div class="v48-saved-note">${timeOf(b.start)} · ${h(t?.title||'Aufgabe entfernt')} · ${b.minutes} min ${b.done||t?.completed?'✓ erledigt':'· noch offen'} <button data-action="daily-plan-done" data-id="${h(b.id)}" type="button">${b.done?'Rückgängig':'Erledigt'}</button><button data-action="daily-plan-remove" data-id="${h(b.id)}" type="button">Entfernen</button></div>`;
 }).join('');
 const display=day===today?'Heute':day===tomorrow?'Morgen':new Intl.DateTimeFormat('de-AT',{weekday:'short',day:'numeric',month:'short'}).format(new Date(day+'T12:00:00'));
 const chosen=selected?.task.title||'Aufgabe auswählen';
 const noAvailability=range.status!=='ready'?`Kalender nicht vollständig/frisch geladen. Bereits geplante Blöcke bleiben sichtbar; neue Plätze sind gesperrt.`:(range.days.find(x=>x.day===day)?.off?'Dieser Tag liegt außerhalb deiner eingestellten Arbeitszeiten.':'Keine freien Zeitfenster im gewählten Arbeitsrahmen.');
 return `<details id="v48-daily-plan" class="v48-day-plan" ${dailyPlanExpanded?'open':''}><summary>${ico('calendar',15)} Tagesplanung · ${h(display)} <span>${status.blocks?`${status.done}/${status.blocks} Blöcke erledigt · `:''}${h(status.label)}</span></summary>
 <div class="v48-content"><div class="v48-topline"><div class="v48-switch"><button type="button" data-action="daily-plan-day" data-id="${today}" class="${day===today?'on':''}">Heute</button><button type="button" data-action="daily-plan-day" data-id="${tomorrow}" class="${day===tomorrow?'on':''}">Morgen</button>${day!==today&&day!==tomorrow?`<span>${h(display)}</span>`:''}</div><span class="v48-progress">${status.plannedMinutes?`${capacityDuration(status.completeMinutes)} / ${capacityDuration(status.plannedMinutes)} erledigt`:'Noch nichts eingeplant'}</span></div>
 <div class="v48-grid"><div class="v48-candidates"><div class="v48-col-head"><strong>Passende To-dos</strong><small>Nur ausführbare Next Actions</small></div><p class="v48-legend" aria-label="Dringlichkeitsstufen"><span class="v48-dot v48-dot-green"></span>Spielraum <span class="v48-dot v48-dot-yellow"></span>Bald <span class="v48-dot v48-dot-orange"></span>Dringend <span class="v48-dot v48-dot-red"></span>Sofort <span class="v48-dot v48-dot-risk"></span>Gefährdet</p>${undated.length?`<button type="button" class="v48-date-summary ${dailyPlanShowUndated?'selected':''}" data-action="daily-plan-undated" aria-pressed="${dailyPlanShowUndated}">${ico('calendar',12)} ${undated.length} ohne Termin · ${dailyPlanShowUndated?'Alle Aufgaben zeigen':'Datum prüfen'}</button>`:''}${candidates.map(taskButton).join('')||'<p class="muted-line">Keine weiteren ausführbaren Aufgaben. Someday/Maybe und Waiting For werden nicht vorgeschlagen.</p>'}${!dailyPlanShowAll&&visibleCandidates.length>10?'<button data-action="daily-plan-more" type="button" class="v48-show-more">Weitere Aufgaben anzeigen</button>':''}</div>
 <div class="v48-slots"><div class="v48-col-head"><strong>Freie Zeitfenster</strong><label>Blocklänge <select id="v48-duration">${[30,45,60,90,120].map(n=>`<option value="${n}" ${dailyPlanDuration===n?'selected':''}>${n} min</option>`).join('')}</select></label></div>${range.status==='ready'&&entries.length?targets:'<p class="muted-line">'+h(noAvailability)+'</p>'}${blocksOutsideTargets}</div></div>
 <p class="v48-foot">Aufgabe links anklicken oder hineinziehen, rechts im freien Slot ablegen. Mobil: Aufgabe wählen, dann Zeitfenster tippen. <strong>${h(chosen)}</strong>. Die Zeitblöcke werden nur in deinem verschlüsselten lokalen Tresor gespeichert, nicht bei Google reserviert. Nicht erledigte Blöcke müssen abends bestätigt oder neu geplant werden.</p></div></details>`;
}
function dailyStatusNudge(day=selectedDay){
 const s=dayPlanStatus(state,day,new Date(),localCapacity(localDateString(new Date()),14));
 if(!s.blocks)return '';
 return `<div class="v48-today-status">${ico('checkSquare',13)} <span>Tagesplan: ${s.done}/${s.blocks} erledigt · ${h(s.label)}${s.dueOpen?' · '+s.dueOpen+' offene Fristen':''}</span><button data-tab="forecast" class="capacity-link" type="button">Plan ansehen ↗</button></div>`;
}
function nextRealisticBlock(){
 const f=localCapacity(localDateString(new Date()),14);
 if(f.status!=='ready')return '';
 const plan=proactivePlan(state,f);
 const manual=dayPlanBlocks(state);
 const first=plan.blocks.find(x=>x.day===selectedDay&&!manual.some(m=>m.start<x.end&&x.start<m.end));
 if(!first)return '';
 return `<div class="v47-today-nudge">${ico('clock',13)} <span>Passendes Fenster heute: ${capacityTime(first.start)} · ${first.minutes} min · ${h(first.task.title)}</span><button type="button" data-tab="forecast" class="capacity-link">Plan ↗</button></div>`;
}
function todaySmartPanel(){
 const settings=state?.uiPreferences||{},energy=energyModes.includes(settings.dailyEnergy)?settings.dailyEnergy:'offen';
 const minutes=timeModes.includes(settings.dailyMinutes)?settings.dailyMinutes:60,context=String(settings.dailyContext||'');
 const contexts=contextChoices(nextActions(state)).filter(c=>!c.value.startsWith('energy-')&&!c.value.startsWith('attention-'));
 const recommendation=smartDailyChoices(state,{day:selectedDay,minutes,energy,context});
 return `<section class="work-card v22-daily" aria-label="Begründete Next-Action-Empfehlungen"><div class="work-heading"><span>${ico('spark',18)} Was passt jetzt?</span><span class="quiet-tag">Maximal 3 Vorschläge</span></div>
 ${compactCapacityHint()}
 ${dailyStatusNudge()}
 ${nextRealisticBlock()}
 ${deadlineCompact()}
 <div class="v22-daily-filters"><label>Zeitbudget<select id="v22-day-minutes">${timeModes.map(n=>`<option value="${n}" ${n===minutes?'selected':''}>${n} Min.</option>`).join('')}</select></label><label>Gefühlte Energie<select id="v22-day-energy">${energyModes.map(e=>`<option value="${e}" ${e===energy?'selected':''}>${e==='offen'?'Nicht angegeben':e==='low'?'Wenig':e==='medium'?'Mittel':'Viel'}</option>`).join('')}</select></label><label>Kontext<select id="v22-day-context"><option value="">Alle Kontexte</option>${contexts.map(c=>`<option value="${h(c.value)}" ${context===c.value?'selected':''}>${h(c.label)}</option>`).join('')}</select></label></div>
 <p class="fin-disclaimer">Aus deinen verfügbaren Next Actions. Zeitbudget und Energie gibst du selbst an; Garmin wird nicht als geistige Leistungsfähigkeit interpretiert.${calendarToken?' Die Zeitslots werden separat berechnet; das Zeitbudget hier bleibt deine persönliche Auswahl.':' Kalender nicht verbunden; tatsächliche freie Zeit unbekannt.'}</p>
 <div class="v22-recommendations">${recommendation.items.map((r,i)=>`<button type="button" class="v22-recommendation" data-action="task-select" data-id="${h(r.task.id)}"><span>${i+1}</span><strong>${h(r.task.title)}</strong><small>${h(r.reasons.slice(0,3).join(' · '))}</small></button>`).join('')||'<p class="muted-line">Keine passende ausführbare Aufgabe für diese Zeit-/Kontextwahl. Du kannst den Filter lockern oder eine bestehende Aufgabe prüfen.</p>'}</div>
 ${recommendation.skippedTime||recommendation.skippedContext?`<small>${recommendation.skippedTime} zu lang geschätzte · ${recommendation.skippedContext} außerhalb des gewählten Kontexts</small>`:''}
 <p class="muted-line">Keine automatische Umplanung und keine neu erzeugten Fristen. Empfehlungen sind begründete Vorschläge.</p></section>`;
}
function todayWork(locked=false){
 const selected=localDateString(new Date())===selectedDay;
 return `<div class="today-layout">${calendarRail()}<div class="today-center">
 <section class="work-card appointments"><div class="work-heading"><span>${ico('calendar',18)} Termine ${selected?'heute':h(dayFormat(new Date(`${selectedDay}T12:00:00`)))}</span><span class="quiet-tag">${h(calendarStatus)}</span></div>
 ${calendarToken?calendarCardRows(selectedDay)+calendarFilterToggle():calendarConnectUI()}</section>${eventAgendaPanel()}
 <section class="work-card today-tasks"><div class="work-heading"><span>${ico('list',18)} Meine Aufgaben ${selected?'für heute':'für diesen Tag'}</span><span class="quiet-tag">${tasksForDay(state,selectedDay).filter(t=>t.completed).length} / ${tasksForDay(state,selectedDay).length} erledigt</span></div>
 ${taskList(tasksForDay(state,selectedDay), 'day')}
 ${state?`<details class="calm-create"><summary>${ico('plus',15)} Neue Aufgabe hinzufügen</summary>${taskCreateForm(selectedDay)}</details>`:''}
 <div class="capture-inline"><form id="capture-form"><label class="sr-only" for="capture">Schnell in die Inbox erfassen</label><input id="capture" name="title" maxlength="1000" required placeholder="Gedanken sofort in der Inbox festhalten …" ${locked?'disabled':''}/><button type="submit" class="primary-btn" ${locked?'disabled':''}>${ico('plus',17)} Erfassen</button></form><small>Inbox bleibt ein eigener Eingang; eine Aufgabe erhält bewusst ein Datum.</small></div></section>
 <div class="below-today"><section class="work-card deadline-card"><div class="work-heading"><span>${ico('flag',18)} Fristen & Vorausschau</span><span class="quiet-tag">–</span></div><div class="preview-empty-small">${dueTasks(state,4).map(t=>`<div class="deadline-inline"><strong>${h(t.dueDate)}</strong> ${h(t.title)}</div>`).join('')||'Noch keine offenen Deadlines erfasst.'}</div></section>
 <section class="work-card review-card"><div class="work-heading"><span>${ico('sync',18)} Review</span><span class="quiet-tag">–</span></div><div class="preview-empty-small">${gtdTodaySummary()}</div></section></div>
 </div><aside class="inspector-rail" aria-label="Aufgabendetails und Personen-Kontext">${todaySmartPanel()}<section class="work-card inspector-card"><div class="work-heading"><span>${ico('checkSquare',18)} Aufgabendetails</span><span class="quiet-tag">Planung</span></div>
 ${taskEditor()}
 <div class="inspector-other"><span>Projekt</span><b>–</b><span>Kontext</span><b>–</b><span>Personen</span><b>–</b><span>Aufwand</span><b>–</b></div></section>
 <section class="work-card person-preview"><div class="work-heading"><span>${ico('people',18)} Offene Gesprächsthemen</span><span class="quiet-tag">–</span></div><div class="preview-empty-small">Person auswählen → alle offenen Agenda-Punkte sehen. Personen-Agendas folgen im GTD-Ausbau.</div></section>
 <button type="button" class="overview-nudge" data-tab="overview">${ico('layers',17)} Große Übersicht ansehen ${ico('arrow',14)}</button></aside></div>`;
}
function radarScreen(){
 const forecast=localCapacity(localDate(),30);
 return chrome(conferenceRadarView(conferenceEntries(state),{topic:radarTopic,region:radarRegion,focus:radarFocus,today:localDate(),forecast,state}));
}
function forecastScreen(){
 const list=dueTasks(state,600),planned=Object.values(state?.tasks||{}).filter(t=>!t.archived&&!state.projects?.[t.projectId]?.isTemplate&&!t.completed&&t.plannedDate),today=localDate();
 const days=Array.from({length:14},(_,i)=>{const d=new Date(today+'T12:00:00');d.setDate(d.getDate()+i);return localDate(d);});
 const overdue=list.filter(t=>t.dueDate<today);
 const dayContent=day=>{
  const tasks=list.filter(t=>t.dueDate===day);const plannedTasks=planned.filter(t=>t.plannedDate===day&&t.dueDate!==day);
  const ev=calendarToken?visibleCalendarEvents(day):[];
  if(!tasks.length&&!plannedTasks.length&&!ev.length)return '';
  const combined=[...tasks.map(t=>({type:'task',sort:'0',obj:t})),...plannedTasks.map(t=>({type:'planned',sort:'0b',obj:t})),...ev.map(e=>({type:'event',sort:e.start?.dateTime||'1',obj:e}))].sort((a,b)=>a.sort.localeCompare(b.sort));
  return `<div class="forecast-date-group"><h3>${h(new Intl.DateTimeFormat('de-AT',{weekday:'long',day:'numeric',month:'long'}).format(new Date(day+'T12:00:00')))}</h3><div class="timeline-day">${combined.map(x=>x.type==='task'?`<div class="timeline-item deadline-event">${ico('flag',19)}<div><strong>${h(x.obj.title)}</strong><small>Compass · harte Deadline · ${h(CATEGORY_LABELS[x.obj.category]||x.obj.category)}</small></div><button type="button" class="secondary-btn" data-action="task-select" data-id="${h(x.obj.id)}">Details</button></div>`:x.type==='planned'?`<div class="timeline-item planned-event">${ico('calendar',19)}<div><strong>${h(x.obj.title)}</strong><small>Compass · Planned (Wunschtermin, keine Deadline)</small></div><button type="button" class="secondary-btn" data-action="task-select" data-id="${h(x.obj.id)}">Details</button></div>`:`<button type="button" class="timeline-item calendar-event" data-action="agenda-open" data-id="${h(x.obj.id)}"><span class="forecast-event-emoji">${h(eventAppearance(x.obj).emoji)}</span><div><strong>${h(eventAppearance(x.obj).displayTitle||'Kalendertermin')}</strong><small>Google Calendar · ${h(eventAppearance(x.obj).category)} · ${h(calendarTime(x.obj))}${x.obj.start?.date?' · Ganztagsmarker':''}${eventAppearance(x.obj).hidden?' · ausgeblendet':''}</small></div>${agendaEvent(x.obj)}${ico('arrow',15)}</button>`).join('')}</div></div>`;
 };
 return chrome(`<div class="forecast-layout">${calendarRail()}<section class="forecast-full work-card"><div class="work-heading"><span>${ico('calendar',21)} Forecast · Deadlines, Planung & Termine</span><span class="quiet-tag">14 Tage</span></div>
 ${capacityPanel()}
 ${dailyPlanPanel()}
 ${proactivePlannerPanel()}
 ${recoveryView(recoveryCandidates(state,localCapacity(localDate(),14),{kind:timeoffKind,today:localDate()}),recoveryEvidence(state?.workTime||{},state?.healthImports?.garminNights||[],localDate(),workThreshold),{kind:timeoffKind,open:timeoffOpen})}
 ${deadlineCompact({inForecast:true})}
 <div class="forecast-tools">${calendarToken?calendarFilterToggle():calendarConnectUI()}<span class="muted-line">${list.length} offene Deadlines · ${planned.length} geplante Aufgaben · ${days.reduce((sum,d)=>sum+recoveryEvents(d).length,0)} Erholungstermine · Google Calendar nur lesend</span></div>
 ${overdue.length?`<div class="forecast-date-overdue"><strong>Überfällig</strong>${taskList(overdue,'forecast')}</div>`:''}
 ${days.map(dayContent).join('')||'<div class="task-empty">Keine Termine oder Fristen für die kommenden 14 Tage.</div>'}
 <p class="rail-footnote">Ganztägig markierte Fristen blockieren nicht automatisch deinen ganzen Tag. Zeitblöcke können ausgeblendet werden.</p></section><aside class="forecast-inspector">${eventAgendaPanel()}<section class="work-card task-inspector"><div class="work-heading"><span>${ico('checkSquare',18)} Aufgabe bearbeiten</span></div>${taskEditor()}</section></aside></div>`);
}
function projectOptions(selected=''){
 const options=['<option value="">Kein Projekt</option>'];
 const visit=(parent,depth)=>{for(const proj of childProjects(state,parent)){
  if(proj.kind==='project'&&!proj.isTemplate&&(proj.status!=='completed'||proj.id===selected))options.push(`<option value="${h(proj.id)}" ${selected===proj.id?'selected':''}>${'  '.repeat(depth)}${h(proj.title)}</option>`);
  if(depth<15)visit(proj.id,depth+1);
 }};visit(null,0);return options.join('');
}
function projectParentOptions(selected='',excludeId=''){
 const blocked=excludeId?new Set([excludeId,...projectDescendantIds(state,excludeId)]):new Set();
 const roots=['<option value="">Oberste Ebene</option>'];
 const walk=(parent,depth)=>{for(const proj of childProjects(state,parent)){
  if(blocked.has(proj.id))continue;
  roots.push(`<option value="${h(proj.id)}" ${proj.id===selected?'selected':''}>${'  '.repeat(depth)}${proj.kind==='folder'?'▸ ':''}${h(proj.title)}</option>`);
  if(depth<15)walk(proj.id,depth+1);
 }};
 walk(null,0);return roots.join('');
}
function taskParentOptions(projectId,selected='',self=''){
 const blocked=new Set([self]);const visit=(id)=>{for(const t of Object.values(state?.tasks||{}).filter(t=>t.parentTaskId===id)){if(blocked.has(t.id))continue;blocked.add(t.id);visit(t.id);}};
 if(self)visit(self);
 return '<option value="">Hauptebene</option>'+hierarchicalProjectTasks(state,projectId).filter(t=>!blocked.has(t.id)&&!t.completed).map(t=>`<option value="${h(t.id)}" ${selected===t.id?'selected':''}>${'  '.repeat(Math.min(t.depth,8))}${h(t.title)}</option>`).join('');
}
function dateButtons(field){return `<div class="date-shortcuts" data-date-target="${field}"><button type="button" data-action="date-adjust" data-field="${field}" data-offset="day">+1d</button><button type="button" data-action="date-adjust" data-field="${field}" data-offset="week">+1w</button><button type="button" data-action="date-adjust" data-field="${field}" data-offset="month">+1m</button><button type="button" data-action="date-clear" data-field="${field}">Löschen</button></div>`;}
function dateControl(field,label,value='',hint=''){return `<label class="date-control">${label}<input name="${field}" type="date" lang="de-AT" aria-label="${h(label)} (Tag, Monat, Jahr)" value="${h(value||'')}">${dateButtons(field)}${hint?`<small>${h(hint)}</small>`:''}</label>`;}
// Inspector 2.0: one shared date row for every task inspector.
// The native date input remains available; +1m uses calendar-month arithmetic.
function compactInspectorDate(field,label,value='',hint=''){
 return `<div class="v559-date-row"><span class="v559-date-label">${h(label)}</span><input type="date" lang="de-AT" name="${field}" value="${h(value||'')}" aria-label="${h(label)}" title="${h(hint||label)}"/><div class="v559-date-tools">${[['day','+1d'],['week','+1w'],['month','+1m']].map(([key,text])=>`<button type="button" data-action="date-adjust" data-field="${field}" data-offset="${key}" title="${h(label)} um ${text} verschieben">${text}</button>`).join('')}<button type="button" class="v559-date-clear" data-action="date-clear" data-field="${field}" aria-label="${h(label)} löschen" title="Datum entfernen">×</button></div></div>`;
}
function inlineTaskTitle(t,content,selectAction='task-select'){
 const editing=inlineEditingTaskId===t.id;
 return `<span class="v559-title-cell" data-task-id="${h(t.id)}">${editing?`<span class="v559-rename-editor" data-task-id="${h(t.id)}"><input class="v559-rename-input" type="text" maxlength="180" required value="${h(t.title)}" aria-label="Aufgabentitel direkt bearbeiten"/><button type="button" data-action="task-rename-save" data-id="${h(t.id)}" aria-label="Titel speichern" title="Titel speichern (Enter)">✓</button><button type="button" data-action="task-rename-cancel" data-id="${h(t.id)}" aria-label="Bearbeitung abbrechen" title="Abbrechen (Escape)">×</button></span>`:`<button class="${selectAction==='tree-task-select'?'tree-label':'task-title-button'} ${t.completed&&selectAction==='tree-task-select'?'tree-done':''}" type="button" data-action="${selectAction}" data-id="${h(t.id)}">${content}</button><button type="button" class="v559-title-pencil" data-action="task-rename-start" data-id="${h(t.id)}" aria-label="${h(t.title)} umbenennen" title="Titel direkt bearbeiten">${ico('pencil',14)}</button>`}</span>`;
}
function moveOrder(state,collection,id,direction){
 const current=state[collection][id];if(!current)return false;
 const peers=collection==='projects'?childProjects(state,current.parentId||null):taskChildren(state,current.projectId,current.parentTaskId||null);
 const index=peers.findIndex(x=>x.id===id),other=peers[index+direction];if(!other)return false;
 const changed=[peers[index],other];
 // Normalize all sibling ordering once to avoid tie ambiguity in older projects.
 peers.forEach((entry,i)=>{state[collection][entry.id].sortOrder=(i+1)*100;});
 state[collection][changed[0].id].sortOrder=(index+direction+1)*100;
 state[collection][changed[1].id].sortOrder=(index+1)*100;
 const pending=collection==='projects'?'projectPending':'taskPending';
 peers.forEach(entry=>{state[pending][entry.id]=true;});
 return true;
}
function categoryOptions(selected='Allgemein'){
 return TASK_CATEGORIES.map(c=>`<option value="${h(c)}" ${c===selected?'selected':''}>${h(CATEGORY_LABELS[c]||c)}</option>`).join('');
}
function workflowOptions(selected='next'){
 return [['next','Next Action'],['waiting','Waiting For'],['hold','On Hold']].map(([value,label])=>`<option value="${value}" ${selected===value?'selected':''}>${label}</option>`).join('');
}
function taskCreateForm(defaultDay='',defaultProject='',defaultParent=''){
 return `<form class="task-create-form" id="task-create-form"><div class="task-form-title"><strong>Neue Aufgabe</strong><span>Ohne künstliche Deadline</span></div><input name="title" aria-label="Aufgabentitel" maxlength="180" required placeholder="Was ist der nächste konkrete Schritt?"/><details class="tree-advanced"><summary>Weitere Einstellungen</summary><div class="task-field-grid">
 ${dateControl('plannedDate','Planned · Wunschtermin',defaultDay,'Für Heute / Forecast; keine Frist')}
 ${dateControl('dueDate','Due · harte Deadline')}
 ${dateControl('deferUntil','Defer · frühestens ab','','Bis dahin keine Next Action')}
 <label>Duration · Minuten<input name="estimateMinutes" type="number" min="5" max="1440" step="5" placeholder="optional"/></label><label>Stückzahl · Ziel (optional)<input name="progressTarget" type="number" min="1" max="100000" step="1" placeholder="z. B. 36 Prüfungen"/></label>
 <label>Bereich<select name="category">${categoryOptions()}</select></label><label>GTD-Status<select name="workflow">${workflowOptions()}</select></label>
 <label>Projekt<select name="projectId">${projectOptions(defaultProject)}</select></label>${defaultProject?`<label>Unteraufgabe von<select name="parentTaskId">${taskParentOptions(defaultProject,defaultParent)}</select></label>`:''}
 <label>Agenda-Tags<input name="tags" data-smart-tags placeholder="UKO, Martin" maxlength="300"/></label>
 <label>Kontext-Tags<input name="contextTags" data-smart-tags placeholder="büro, laptop" maxlength="300"/></label>
 <label class="flag-check"><input type="checkbox" name="flagged"/> Flagged</label></div></details><button class="primary-btn" type="submit">${ico('plus',16)} Hinzufügen</button></form>`;
}
function taskProgressInline(t){
 const target=t?.progressTarget;
 if(!Number.isSafeInteger(target)||target<=0)return '';
 const current=t.progressCurrent??0,complete=current>=target,locked=!!t.completed||!!state?.projects?.[t.projectId]?.isTemplate;
 return `<span class="v42-task-progress" title="${current} von ${target} Stück bearbeitet${complete?' · Ziel erreicht':''}"><span class="v42-progress-meter"><span class="v42-progress-count">${current}/${target}</span><progress max="${target}" value="${Math.max(0,Math.min(target,current))}" aria-label="${h(t.title)}: ${current} von ${target} Stück"></progress></span><button type="button" data-action="task-progress-plus" data-id="${h(t.id)}" class="v42-progress-plus" aria-label="Bei ${h(t.title)} ein Stück hinzufügen" title="Ein Stück korrigiert (+1)" ${locked||complete?'disabled':''}>+1</button></span>`;
}
function taskList(items,scope,hideEmpty=false){
 const nextScope=scope==='next';
 return items.length?`<div class="task-list ${nextScope?'next38-list':''}" data-scope="${h(scope)}">${items.map((t,i)=>`<div class="task-row ${nextScope?'next38-row':''} ${selectedTaskId===t.id?'is-selected':''} ${t.completed?'completed':''}" ${nextScope?`data-next-row="${h(t.id)}"`:''}>${nextScope?`<span class="next38-drag" draggable="true" data-next-drag="${h(t.id)}" role="img" aria-label="${h(t.title)} zum Sortieren ziehen" title="Ziehen zum Sortieren, alternativ Pfeiltasten">⠿</span>`:''}<button type="button" class="task-check" data-action="task-toggle" data-id="${h(t.id)}" aria-label="${t.completed?'Wieder öffnen':'Erledigen'}">${t.completed?'✓':'○'}</button><button type="button" class="flag-button ${t.flagged?'is-flagged':''}" data-action="task-flag" data-id="${h(t.id)}" title="Flagged umschalten">${ico('flag',17)}</button>${inlineTaskTitle(t,`<span ${Number.isInteger(t.depth)?`style="padding-left:${Math.min(t.depth,8)*17}px"`:''}><strong>${t.depth?'↳ ':''}${h(t.title)}</strong><small>${h(CATEGORY_LABELS[t.category]||t.category)}${t.dueDate?' · Deadline '+h(t.dueDate):''}${t.workflow==='waiting'?' · Waiting For':t.workflow==='hold'?' · On Hold':''}${t.deferUntil&&t.deferUntil>localDate()?' · ab '+h(t.deferUntil):''}${t.estimateMinutes?' · '+t.estimateMinutes+' min':''}${(t.contextTags||[]).length?' · @'+h(t.contextTags.join(' @')):''}${state?.taskPending?.[t.id]?' · Lokal gespeichert':''}${nextScope&&t.plannedDate===localDate()?' · Für heute vorgemerkt':''}</small>${t.tags?.length?`<span class="task-tags">${t.tags.map(tag=>'<i>#'+h(tag)+'</i>').join('')}</span>`:''}</span>`)}${taskProgressInline(t)}${nextScope?`<button type="button" class="next38-today ${t.plannedDate===localDate()?'is-planned':''}" data-action="next-plan-today" data-id="${h(t.id)}" aria-pressed="${t.plannedDate===localDate()}" title="${t.plannedDate===localDate()?'Heute-Vormerkung entfernen':'Ohne Fälligkeitsdatum für heute vormerken'}">${ico('calendar',14)} <span>${t.plannedDate===localDate()?'Heute ✓':'Heute'}</span></button><span class="next38-move"><button type="button" data-action="next-move-up" data-id="${h(t.id)}" aria-label="${h(t.title)} nach oben" title="Nach oben" ${i===0?'disabled':''}>↑</button><button type="button" data-action="next-move-down" data-id="${h(t.id)}" aria-label="${h(t.title)} nach unten" title="Nach unten" ${i===items.length-1?'disabled':''}>↓</button></span>`:''}${state?.taskConflicts?.[t.id]?'<span class="task-conflict-pill">Konflikt</span>':''}</div>`).join('')}</div>`:hideEmpty?'':`<div class="task-empty">Keine passenden Aufgaben.</div>`;
}
function taskEditor(){const t=state?.tasks?.[selectedTaskId];if(!t||t.archived)return '<div class="task-empty">Wähle eine Aufgabe, um ihre Details zu bearbeiten.</div>';
 const progress=t.progressTarget!=null&&Number.isSafeInteger(t.progressTarget)&&t.progressTarget>0;
 const current=t.progressCurrent??0,locked=!!t.completed||!!state?.projects?.[t.projectId]?.isTemplate;
 return `<form id="task-edit-form" data-id="${h(t.id)}" class="task-edit-form v559-inspector-form">
 <div class="v559-progress-row"><span>Stückfortschritt</span><span class="v559-progress-actions">${progress?`<strong>${current}/${t.progressTarget}</strong><button type="button" data-action="task-progress-minus" data-id="${h(t.id)}" ${locked||current<=0?'disabled':''} aria-label="Ein Stück zurücknehmen">−1</button><button type="button" data-action="task-progress-plus" data-id="${h(t.id)}" ${locked||current>=t.progressTarget?'disabled':''} aria-label="Ein Stück hinzufügen">+1</button>`:'<small>Kein Zählziel</small>'}</span></div>
 <div class="v559-main-dates" aria-label="Aufgabenplanung">${compactInspectorDate('deferUntil','Defer',t.deferUntil,'Frühestens verfügbar; keine Deadline')}${compactInspectorDate('plannedDate','Geplant',t.plannedDate,'Gewünschter Planungstag; keine Deadline')}${compactInspectorDate('dueDate','Due',t.dueDate,'Tatsächliche Fälligkeit')}</div>
 <div class="v559-compact-field"><label for="v559-task-duration">${ico('clock',15)} Dauer (Min.)</label><input id="v559-task-duration" name="estimateMinutes" type="number" min="5" max="1440" step="5" value="${t.estimateMinutes??''}" placeholder="Optional"/></div>
 <div class="v559-compact-field"><label for="v559-task-context">${ico('tag',15)} Kontexte</label><input id="v559-task-context" name="contextTags" data-smart-tags maxlength="300" value="${h((t.contextTags||[]).join(', '))}" placeholder="@büro, @laptop"/></div>
 <details class="v559-note" ${t.note?'open':''}><summary>${ico('pencil',15)} Notiz ${t.note?`<span class="v559-note-preview">${h(t.note.slice(0,42))}${t.note.length>42?'…':''}</span>`:'<span class="v559-note-preview">Hinzufügen</span>'}</summary><textarea name="note" maxlength="3000" rows="3" placeholder="Optional">${h(t.note||'')}</textarea></details>
 <details class="v42-progress-editor v559-progress-options"><summary>${ico('settings',14)} Fortschrittsziel festlegen ${progress?'· '+current+'/'+t.progressTarget:''}</summary><div class="v42-progress-edit-grid"><label>Gesamtzahl (Max.)<input name="progressTarget" type="number" min="1" max="100000" step="1" value="${t.progressTarget??''}" placeholder="z. B. 36"/></label><label>Bereits erledigt<input name="progressCurrent" type="number" min="0" max="${t.progressTarget??100000}" step="1" value="${current}"/></label></div><small class="v42-progress-help">Fortschritt zählt Stücke, schließt die Aufgabe aber nicht automatisch ab.</small></details>
 <details class="inspector-extra v559-metadata"><summary>${ico('settings',14)} Titel, Projekt & GTD-Status</summary><div class="v559-meta-fields"><label>Titel<input required name="title" maxlength="180" value="${h(t.title)}"/></label><label>Projekt<select name="projectId">${projectOptions(t.projectId)}</select></label><label>GTD-Status<select name="workflow">${workflowOptions(t.workflow)}</select></label><label>Bereich<select name="category">${categoryOptions(t.category)}</select></label>${t.projectId?`<label>Unteraufgabe von<select name="parentTaskId">${taskParentOptions(t.projectId,t.parentTaskId,t.id)}</select></label>`:''}<label>Agenda-Tags<input name="tags" data-smart-tags maxlength="300" value="${h((t.tags||[]).join(', '))}" placeholder="UKO, Martin"/></label><label class="flag-check"><input type="checkbox" name="flagged" ${t.flagged?'checked':''}/> Flagged</label></div></details>
 <div class="task-edit-actions v559-sticky-actions"><button class="primary-btn" type="submit">Speichern</button><button class="secondary-btn" type="button" data-action="task-archive" data-id="${h(t.id)}">Archivieren</button>${t.completed?`<button type="button" class="secondary-btn" data-action="gtd-repeat-task" data-id="${h(t.id)}">${ico('sync',15)} Erneut anlegen</button>`:''}</div></form>${state.taskConflicts?.[t.id]?`<div class="task-conflict"><strong>Änderungskonflikt</strong><p>Die Aufgabe wurde auf einem anderen Gerät bearbeitet. Beide Fassungen bleiben erhalten.</p><button type="button" data-action="task-conflict-local" data-id="${h(t.id)}">Meine Änderungen übernehmen</button><button type="button" data-action="task-conflict-remote" data-id="${h(t.id)}">Cloud-Version übernehmen</button></div>`:''}`;
}

function gtdTodaySummary(){
 const hlt=projectHealth(state),waiting=waitingReview(state);
 return `<div class="gtd-quick-overview"><span>${hlt.dueReviews} Projekt-Reviews fällig</span><span>${hlt.withoutAction} Projekte ohne nächste Aktion</span><span>${waiting.attention} Waiting For zur Durchsicht</span></div><button type="button" class="text-link" data-tab="review">Wochenreview öffnen →</button><small>Hinweise aus vorhandenen Daten; keine automatisch erzeugten Termine.</small>`;
}
function gtdProjectHealthPanel(){
 const health=projectHealth(state);
 return `<details class="gtd-health"><summary>${ico('activity',16)} Projektgesundheit · ${health.dueReviews} Review(s) fällig</summary>
 <div class="gtd-health-stats"><span>${health.active} aktiv</span><span>${health.withoutAction} ohne Next Action</span><span>${health.lateProjects} Projektfristen überschritten</span></div>
 ${health.items.slice(0,18).map(x=>`<div class="gtd-health-row"><span><strong>${h(x.project.title)}</strong><small>${h(x.warnings.join(' · ')||`Review in ${x.daysUntilReview} Tagen`)}</small></span><button type="button" class="secondary-btn" data-action="gtd-review-project" data-id="${h(x.project.id)}">Öffnen</button></div>`).join('')||'<p class="muted-line">Noch keine aktiven Projekte.</p>'}
 <p class="muted-line">Reviewdatum und Intervall sind synchronisiert. Eine fehlende Next Action bedeutet nicht automatisch, dass etwas überfällig ist.</p></details>`;
}
function workflowScreen(which){
 const titles={next:'Next Actions',flagged:'Flagged',hold:'On Hold & Waiting For'};
 const tasks=which==='next'?inboxOrdered(nextActions(state),state?.uiPreferences?.nextActionManualOrder||[]):which==='flagged'?flaggedTasks(state):heldTasks(state);
 const shown=which==='next'?filterContextTasks(tasks,contextFilter):tasks;
 const availableContexts=contextChoices(tasks);
 const waiting=which==='hold'?shown.filter(t=>t.workflow==='waiting'):[];
 const paused=which==='hold'?shown.filter(t=>t.workflow==='hold'):[];
 const blocked=which==='hold'?blockedByProject(state):[];
 const pausedProjects=which==='hold'?Object.values(state?.projects||{}).filter(p=>p.status==='hold'):[];
 const flaggedInbox=which==='flagged'?inboxRecords(state).filter(inboxFlagged):[];
 const perspectiveItems=which==='hold'?[...shown,...blocked]:[...shown,...flaggedInbox];
 if(!perspectiveItems.some(t=>t.id===selectedTaskId))selectedTaskId=null;
 const noActions=which==='next'&&!shown.length?`<div class="task-empty perspective-empty"><strong>${contextFilter?'Für diesen Kontext ist gerade nichts verfügbar.':'Keine verfügbaren Next Actions.'}</strong><p>Prüfe die Inbox, kläre deine nächsten Schritte im Review oder lege eine konkrete Aufgabe an. Verschobene und pausierte Aufgaben erscheinen hier nicht.</p><button type="button" class="secondary-btn" data-tab="review">Inbox im Review klären</button> <button type="button" class="secondary-btn" data-tab="inbox">Inbox öffnen</button></div>`:'';
 return chrome(`<div class="workflow-layout"><section class="work-card"><div class="work-heading"><span>${ico(which==='flagged'?'flag':which==='hold'?'pause':'target',20)} ${titles[which]}</span><span class="quiet-tag">${perspectiveItems.length} offen</span></div>
 ${which==='next'?`<p class="next38-hint">${ico('list',14)} Reihenfolge mit ⠿ oder ↑ ↓ ändern · <strong>Heute</strong> plant eine Aufgabe für heute, ohne eine Fälligkeit zu setzen. Die Sortierung bleibt auf diesem Gerät.</p>`:''}
 ${which==='next'?`<div class="context-filter"><label>Aktueller Kontext <select id="context-filter"><option value="">Alle verfügbaren Next Actions</option>${availableContexts.map(c=>`<option value="${h(c.value)}" ${contextFilter===c.value?'selected':''}>${c.group?'▸ ':''}${h(c.label)}</option>`).join('')}</select></label></div>`:''}
 ${which==='flagged'?'<p class="muted-line">Markierte Aufgaben und ungeklärte Inbox-Einträge. Flaggen dienen zum Hervorheben, nicht als Deadline.</p>':''}
 ${which==='hold'?`<div class="held-sections"><div class="gtd-waiting-hint">${ico('clock',16)} <span>${waitingReview(state).attention} Waiting-For-Einträge seit mindestens 7 Tagen nicht bearbeitet. Das ist ein Review-Hinweis, keine Deadline.</span></div><h3>Waiting For · ${waiting.length}</h3>${taskList(waiting,'waiting')}<h3>On Hold · ${paused.length}</h3>${taskList(paused,'paused')}<h3>Durch pausierte Projekte zurückgestellt · ${blocked.length}</h3>${taskList(blocked,'project-hold')}<h3>Pausierte Projekte · ${pausedProjects.length}</h3>${pausedProjects.length?pausedProjects.map(p=>`<button type="button" class="held-project-link" data-action="hold-open-project" data-id="${h(p.id)}">${ico('folder',15)} ${h(p.title)} ${ico('arrow',13)}</button>`).join(''):'<p class="muted-line">Keine Projekte pausiert.</p>'}</div>`:`${taskList(shown,which,which==='next'||which==='flagged'&&flaggedInbox.length>0)}${noActions}${which==='flagged'&&flaggedInbox.length?`<div class="flagged-inbox-section"><h3>Markierte Inbox-Einträge · ${flaggedInbox.length}</h3>${flaggedInbox.map(r=>`<div class="flagged-inbox-row"><button type="button" data-action="inbox-flag" data-id="${h(r.id)}" class="inbox-row-flag is-flagged" aria-label="Flagge entfernen" aria-pressed="true">${ico('flag',16)}</button><button type="button" class="flagged-inbox-open" data-action="select-inbox" data-id="${h(r.id)}">${h(r.title)}<small>Inbox · noch ungeklärt</small></button></div>`).join('')}</div>`:''}${which==='flagged'?`<details class="calm-create calm-flag-picker"><summary>${ico('flag',15)} Bestehende Aufgabe markieren</summary>${Object.values(state?.tasks||{}).filter(t=>!t.archived&&!state.projects?.[t.projectId]?.isTemplate&&!t.completed&&!t.flagged).slice(0,80).map(t=>`<button type="button" class="calm-flag-option" data-action="flag-existing" data-id="${h(t.id)}">${ico('flag',14)} ${h(t.title)}</button>`).join('')||'<p class="muted-line">Keine weiteren offenen Aufgaben.</p>'}</details>`:`<details class="calm-create"><summary>${ico('plus',15)} Neue Aufgabe hinzufügen</summary>${taskCreateForm('')}</details>`}`}
 </section><aside class="work-card"><div class="work-heading"><span>${ico('pencil',18)} Aufgabendetails</span></div>${taskEditor()}</aside></div>`);
}
function treeTaskRows(projectId,parentTaskId=null,depth=0,visited=new Set()){
 if(depth>15)return '';
 return taskChildren(state,projectId,parentTaskId).filter(t=>!visited.has(t.id)).map(t=>{
  visited.add(t.id);
  const hasChildren=taskChildren(state,projectId,t.id).length>0,collapsed=treeTaskCollapsed.has(t.id);
  const due=t.dueDate&&t.dueDate<=localDate()?`<span class="tree-critical">${h(t.dueDate)}</span>`:t.dueDate?`<span class="tree-muted">${h(t.dueDate)}</span>`:'';
  return `<div class="tree-entry tree-task" data-drag-type="task" data-drag-id="${h(t.id)}"><div class="tree-line tree-drop-target ${selectedTaskId===t.id?'selected':''}" data-drop-type="task" data-drop-id="${h(t.id)}" style="--depth:${depth+1}">
   ${hasChildren?`<button type="button" class="tree-expander" data-action="tree-task-toggle" data-id="${h(t.id)}" aria-label="Unteraufgaben ${collapsed?'anzeigen':'verbergen'}" aria-expanded="${!collapsed}">${collapsed?'▸':'▾'}</button>`:'<span class="tree-expander-space"></span>'}
   <span class="tree-drag-handle" draggable="true" data-drag-type="task" data-drag-id="${h(t.id)}" title="Ziehen zum Verschieben" aria-label="Aufgabe ziehen">⋮⋮</span>
   <button type="button" class="task-check" data-action="task-toggle" data-id="${h(t.id)}" aria-label="${t.completed?'Wieder öffnen':'Erledigen'}">${t.completed?'✓':'○'}</button>
   ${inlineTaskTitle(t,`<span>${h(t.title)}</span>${due}`,'tree-task-select')}
   ${taskProgressInline(t)}
   ${!t.completed&&!isTemplateTask(state,t)?`<button type="button" class="tree-today-check ${t.plannedDate===localDate()?'is-planned':''}" data-action="tree-plan-today" data-id="${h(t.id)}" aria-pressed="${t.plannedDate===localDate()}" aria-label="${h(t.title)}: ${t.plannedDate===localDate()?'Aus Heute entfernen':'Für Heute auswählen'}" title="${t.plannedDate===localDate()?'Aus Heute entfernen':'Für Heute auswählen – keine Deadline'}" ${!isActionAvailable(state,t,localDate())&&t.plannedDate!==localDate()?'disabled':''}><span class="tree-today-box" aria-hidden="true">${t.plannedDate===localDate()?'✓':''}</span><span>Heute</span></button>`:''}
   <button type="button" class="tree-flag-toggle ${t.flagged?'is-flagged':''}" data-action="task-flag" data-id="${h(t.id)}" aria-label="${t.flagged?'Flagge entfernen':'Flagge setzen'}" aria-pressed="${!!t.flagged}" title="${t.flagged?'Flagge entfernen':'Flagge setzen'}">${ico('flag',15)}</button>
   <button type="button" class="tree-inline-add" data-action="tree-add-subtask" data-id="${h(t.id)}" title="Unteraufgabe hinzufügen" aria-label="Unteraufgabe hinzufügen">${ico('plus',15)}</button>
  </div>${collapsed?'':treeTaskRows(projectId,t.id,depth+1,visited)}</div>`;
 }).join('');
}
function folderIconPicker(project){
 const current=folderIcon(project);
 return `<fieldset class="folder-icon-field"><legend>Ordnersymbol</legend><div class="folder-icon-choices" role="radiogroup" aria-label="Ordnersymbol auswählen">${FOLDER_ICONS.map(([key,label])=>`<label title="${h(label)}"><input type="radio" name="folderIcon" value="${key}" ${current===key?'checked':''}/><span>${ico(key,19)}<small>${h(label)}</small></span></label>`).join('')}</div><small>Optional. Das Standardsymbol bleibt ohne Änderung erhalten.</small></fieldset>`;
}
function treeProjectRows(parentId=null,depth=0,visited=new Set()){
 if(depth>15)return '';
 // Older/imported records may reference a parent which no longer exists. Keep
 // those projects accessible instead of making the entire tree look empty.
 const candidates=parentId===null?[
   ...childProjects(state,null),
   ...Object.values(state?.projects||{}).filter(p=>p.parentId&&(!state.projects?.[p.parentId]||p.parentId===p.id||state.projects[p.parentId]?.isTemplate))
 ]:childProjects(state,parentId);
 return candidates.filter(p=>!p.isTemplate&&!visited.has(p.id)).map(p=>{
  visited.add(p.id);
  const children=childProjects(state,p.id).filter(c=>!c.isTemplate),taskRoots=p.kind==='project'?taskChildren(state,p.id,null):[];
  const expand=children.length||taskRoots.length,collapsed=projectCollapsed.has(p.id);
  return `<div class="tree-entry tree-project" data-drag-type="project" data-drag-id="${h(p.id)}"><div class="tree-line tree-drop-target ${p.kind==='folder'?'fin43-folder-row':'fin43-project-row'} ${selectedProjectId===p.id&&!selectedTaskId?'selected':''}" data-drop-type="project" data-drop-id="${h(p.id)}" style="--depth:${depth}">
   ${expand?`<button type="button" class="tree-expander" data-action="project-toggle-expand" data-id="${h(p.id)}" aria-expanded="${!collapsed}" aria-label="${collapsed?'Aufklappen':'Zuklappen'}">${collapsed?'▸':'▾'}</button>`:'<span class="tree-expander-space"></span>'}
   <span class="tree-drag-handle" draggable="true" data-drag-type="project" data-drag-id="${h(p.id)}" title="Ziehen zum Verschieben" aria-label="Projekt oder Ordner ziehen">⋮⋮</span>
   ${p.kind==='folder'?`<button class="tree-node-icon tree-folder-icon" type="button" data-action="folder-icon-open" data-id="${h(p.id)}" title="Ordnersymbol ändern" aria-label="Symbol für ${h(p.title)} ändern">${ico(folderIcon(p),17)}</button>`:`<span class="tree-node-icon">${ico('list',17)}</span>`}
   <button type="button" class="tree-label" data-action="project-select" data-id="${h(p.id)}"><span>${h(p.title)}</span>${p.status==='hold'?'<span class="tree-muted">Pausiert</span>':''}</button>
   <button type="button" class="tree-inline-add" data-action="${p.kind==='folder'?'tree-add-project':'tree-add-task'}" data-id="${h(p.id)}" aria-label="${p.kind==='folder'?'Projekt hinzufügen':'Aufgabe hinzufügen'}" title="Hinzufügen">${ico('plus',15)}</button>
  </div>${collapsed?'':`<div>${treeProjectRows(p.id,depth+1,visited)}${p.kind==='project'?treeTaskRows(p.id,null,depth+1):''}</div>`}</div>`;
 }).join('');
}
function treeTaskDestinationOptions(task){
 const descendants=new Set([task.id,...taskDescendants(state,task.id)]);
 const choices=['<option value="">Ziel wählen …</option>'];
 for(const p of Object.values(state.projects||{}).filter(p=>p.kind==='project'&&!p.isTemplate)){
  choices.push(`<option value="project:${h(p.id)}">${h(p.title)} · Hauptaufgabe</option>`);
  for(const t of hierarchicalProjectTasks(state,p.id).filter(x=>!descendants.has(x.id)&&!x.archived))choices.push(`<option value="task:${h(t.id)}">${h(p.title)} / ${'· '.repeat(Math.min(4,t.depth+1))}${h(t.title)}</option>`);
 }
 return choices.join('');
}
function projectExchangePanel(){
 const preview=exchangePreview?projectImportPreview(state,exchangePreview):null;
 const options=Object.values(state?.projects||{}).filter(p=>!p.isTemplate).sort((a,b)=>a.title.localeCompare(b.title,'de'));
 return `<details class="tree-secondary project-exchange" id="project-exchange-details" ${preview?'open':''}><summary>${ico('upload',15)} Projektplan mit ChatGPT austauschen</summary>
 <div class="exchange-contents"><p class="muted-line">Lokal als JSON exportieren, in ChatGPT überarbeiten und nach einer Vorschau importieren. Keine automatische Freigabe von Projektdaten.</p>
 <div class="exchange-actions"><label>Exportbereich<select id="project-exchange-scope"><option value="">Alle Ordner & Projekte</option>${options.map(x=>`<option value="${h(x.id)}" ${x.id===selectedProjectId?'selected':''}>${h(x.title)}</option>`).join('')}</select></label><button type="button" class="secondary-btn" data-action="project-exchange-export">JSON exportieren</button></div>
 <form id="project-exchange-preview-form" class="exchange-input"><label>Compass-Projektdatei<input name="file" type="file" accept=".json,application/json"/></label><label>Oder JSON von ChatGPT einfügen<textarea name="json" rows="3" maxlength="1048576" placeholder='{"format":"compass-project-exchange","version":1,...}'>${h(exchangeRaw)}</textarea></label><button type="submit" class="secondary-btn">Importvorschau öffnen</button></form>
 ${preview?`<form id="project-exchange-commit" class="exchange-preview"><strong>${preview.projects.length} Projekte / Ordner · ${preview.tasks.length} Aufgaben</strong><p class="muted-line">${preview.creates} neu · ${preview.updates} bestehende IDs · ${preview.similar} ähnliche Titel. Wähle die Projektgruppen aus. Nicht ausgewählte Gruppen und ihre Unterpunkte werden übersprungen.</p>
 <div class="exchange-preview-list">${preview.projects.map(p=>`<label><input type="checkbox" name="project" value="${h(p.key)}" ${p.exists||p.sameTitle?'':'checked'}/> <strong>${h(p.title)}</strong><small>${p.exists?'Bestehende ID · nur mit Update':p.sameTitle?'Ähnlicher Titel – Duplikat prüfen':'Neu'} · ${preview.tasks.filter(t=>t.projectKey===p.key).length} Aufgaben</small></label>`).join('')}</div>
 <label class="exchange-update-check"><input type="checkbox" name="updateExisting"/> Bestehende Projekte und Aufgaben mit übereinstimmender ID ausdrücklich aktualisieren</label>
 <p class="muted-line">Ein Import ist ein lokaler Änderungsvorgang. Bitte vorher ein verschlüsseltes Vault-Backup erstellen. Ein ChatGPT-Entwurf kann Zeitaufwände nur schätzen; prüfe Fristen vor dem Bestätigen.</p>
 <div class="exchange-actions"><button type="submit" class="primary-btn">Ausgewählte Projekte übernehmen</button><button type="button" class="secondary-btn" data-action="project-exchange-cancel">Verwerfen</button></div></form>`:''}
 </div></details>`;
}
function projectScreen(){
 const templates=tab==='templates';
 const projects=Object.values(state?.projects||{});
 const current=selectedProjectId&&state?.projects?.[selectedProjectId]||null;
 if(current&&Boolean(current.isTemplate)!==templates){selectedProjectId=null;selectedTaskId=null;}
 const active=projects.filter(p=>p.kind==='project'&&!p.isTemplate&&p.status==='active').length;
 const templateProjects=projects.filter(isTemplateProject).sort((a,b)=>a.title.localeCompare(b.title,'de'));
 const selection=selectedProjectId&&state.projects?.[selectedProjectId]||null;
 const selectedTask=selectedTaskId&&state.tasks?.[selectedTaskId]||null;
 const settings=selection?`<details class="project-properties" open><summary>${selection.kind==='folder'?'Ordner':'Projekt'} bearbeiten</summary><form id="project-edit-form" class="task-edit-form" data-id="${h(selection.id)}">${compactInspectorDate('dueDate','Projekt-Deadline',selection.dueDate)}<details class="v559-project-metadata"><summary>Projektangaben bearbeiten</summary><div class="v559-meta-fields"><label>Name<input name="title" required maxlength="140" value="${h(selection.title)}"/></label><label>Ergebnis<textarea name="outcome" rows="2" maxlength="800">${h(selection.outcome||'')}</textarea></label><label>Bereich<select name="category">${categoryOptions(selection.category)}</select></label><label>Status<select name="status">${[['active','Aktiv'],['hold','On Hold'],['completed','Abgeschlossen']].map(([v,l])=>`<option value="${v}" ${selection.status===v?'selected':''}>${l}</option>`).join('')}</select></label>${selection.kind==='folder'?folderIconPicker(selection):''}<label>Art<select name="kind"><option value="project" ${selection.kind!=='folder'?'selected':''}>Projekt</option><option value="folder" ${selection.kind==='folder'?'selected':''}>Ordner</option></select></label><label>Typ<select name="projectType">${[['parallel','Parallel'],['sequential','Sequential'],['single','Single Actions']].map(([v,l])=>`<option value="${v}" ${(selection.projectType||'parallel')===v?'selected':''}>${l}</option>`).join('')}</select></label><label>Übergeordnet<select name="parentId">${projectParentOptions(selection.parentId,selection.id)}</select></label>${selection.kind==='project'?`<label class="template-property"><input type="checkbox" name="isTemplate" ${selection.isTemplate?'checked':''}/> Als wiederverwendbare Vorlage verwenden</label>`:''}</div></details><label>Review alle Tage<input name="reviewIntervalDays" type="number" min="1" max="90" value="${selection.reviewIntervalDays||7}"/></label><div class="project-edit-actions"><button class="primary-btn" type="submit">Speichern</button><button type="button" class="secondary-btn" data-action="project-reviewed" data-id="${h(selection.id)}">Jetzt geprüft</button></div></form></details>`:'';
 return chrome(`<div class="tree-workspace ${selectedTask||selection?'has-inspector':''}"><section class="work-card tree-work-card"><div class="tree-toolbar"><strong>${templates?'Vorlagen':`${active} aktive Projekte`}</strong><div class="tree-toolbar-actions">${templates?'':`<button type="button" class="secondary-btn" data-action="tree-add-folder">${ico('plus',15)} Ordner</button><button type="button" class="secondary-btn" data-action="tree-add-project">${ico('plus',15)} Projekt</button>`}</div></div>
 ${templates?`${templateProjects.length?templateProjects.map(p=>`<div class="tree-line template-line ${selection?.id===p.id?'selected':''}"><span class="tree-node-icon">${ico('bookmark',17)}</span><button type="button" class="tree-label" data-action="project-select" data-id="${h(p.id)}"><span>${h(p.title)}</span><span class="tree-muted">${projectTasks(state,p.id).length} Einträge</span></button><button type="button" class="secondary-btn" data-action="tree-template-use" data-id="${h(p.id)}">Neue Liste</button></div>${selection?.id===p.id?`<div class="template-task-summary">${treeTaskRows(p.id)}</div>`:''}`).join(''):'<div class="tree-empty">Noch keine Vorlagen. Öffne ein Projekt und aktiviere in dessen Einstellungen „Als Vorlage verwenden“.</div>'}`:`<div class="unified-tree" role="tree" aria-label="Ordner, Projekte und Aufgaben">${treeProjectRows()||'<div class="tree-empty">Noch keine Projekte. Lege dein erstes Projekt oder einen Ordner an.</div>'}<div class="tree-root-drop" data-drop-type="project-root" data-drop-id="">${ico('folder',14)} Auf oberste Ebene ziehen</div></div>`}
 ${treeCreateKind?`<details open class="tree-quick-create"><summary>${treeCreateKind==='task'?'Neue Aufgabe':treeCreateKind==='folder'?'Neuer Ordner':'Neues Projekt'}<button type="button" class="tree-close" data-action="tree-create-close" aria-label="Schließen">×</button></summary>${treeCreateKind==='task'?taskCreateForm('',treeCreateParent||'',treeTaskParent||''):`<form class="project-form" id="project-create-form"><label>Name<input required autofocus name="title" maxlength="140" placeholder="${treeCreateKind==='folder'?'Ordnername':'Projektname'}"/></label><input type="hidden" name="kind" value="${treeCreateKind}"/><label>Unterhalb von<select name="parentId">${projectParentOptions(treeCreateParent||'')}</select></label><details class="tree-advanced"><summary>Weitere Einstellungen</summary><label>Typ<select name="projectType"><option value="parallel">Parallel</option><option value="sequential">Sequential</option><option value="single">Single Actions</option></select></label><label>Ergebnis<input name="outcome" maxlength="800" placeholder="Optional"/></label></details><button class="primary-btn" type="submit">Anlegen</button></form>`}</details>`:''}
 ${templates?'':projectExchangePanel()}
 ${templates?'':`<details class="tree-secondary"><summary>Lebensziele & Projektgesundheit</summary>${lifeGoalsPanel()}${gtdProjectHealthPanel()}</details>`}</section>
 ${(selection||selectedTask)?`<aside class="work-card tree-inspector"><div class="tree-inspector-header"><strong>${selectedTask?'Aufgabendetails':selection?.title||'Details'}</strong><button class="tree-close" type="button" data-action="tree-inspector-close" title="Schließen" aria-label="Details schließen">×</button></div>${selectedTask?`${taskEditor()}<form id="tree-move-task-form" class="tree-move-form" data-id="${h(selectedTask.id)}"><label>Verschieben nach<select name="target" required>${treeTaskDestinationOptions(selectedTask)}</select></label><button type="submit" class="secondary-btn">Verschieben</button></form>`:settings}${selection?.isTemplate?`<button type="button" class="primary-btn" data-action="tree-template-use" data-id="${h(selection.id)}">Neue Liste aus Vorlage</button>`:''}</aside>`:''}</div>`);
}
const DREAM_CATEGORIES=[['lernen','Lernen & Weiterbilden','book'],['lesen','Lesen & Entdecken','bookmark'],['erleben','Erleben & Ausprobieren','suitcase'],['ideen','Projekte & Ideen','spark']];
function dreamCategory(r){return DREAM_CATEGORIES.find(([key])=>(r.tags||[]).includes('dream-'+key))?.[0]||'ideen';}
function somedayScreen(){
 const dreams=dreamRecords(state);
 const current=dreams.find(r=>r.id===selectedDreamId)||dreams[0]||null;
 return chrome(`<div class="dream-layout"><section class="dream-intro work-card"><div class="dream-lead"><span class="dream-symbol">${ico('spark',31)}</span><div><p class="dream-one-liner">Ideen bewusst aufheben, ohne sie zur Verpflichtung zu machen.</p></div></div>
 <form id="dream-create-form" class="dream-capture-shell"><input name="title" type="text" required maxlength="1000" placeholder="Neue Idee, Wunsch oder Inspiration …" aria-label="Someday / Maybe erfassen"/><select name="category" aria-label="Dreams-Kategorie">${DREAM_CATEGORIES.map(([key,title])=>`<option value="${key}">${h(title)}</option>`).join('')}</select><button type="submit" class="primary-btn">${ico('plus',16)} Sammeln</button></form>
 <p class="dream-caption">Diese Ideen werden mit dem Tag #dreams geräteübergreifend synchronisiert und erscheinen nicht mehr in der Inbox.</p></section>
 <div class="dream-grid">${DREAM_CATEGORIES.map(([key,title,iconName])=>{const entries=dreams.filter(r=>dreamCategory(r)===key);return `<section class="dream-category work-card"><div class="work-heading"><span>${ico(iconName,19)} ${h(title)}</span><span class="quiet-tag">${entries.length}</span></div>${entries.length?`<div class="dream-list">${entries.map(r=>`<button type="button" class="dream-item ${current?.id===r.id?'is-current':''}" data-action="dream-select" data-id="${h(r.id)}">${ico('spark',14)}<span>${h(r.title)}</span>${ico('arrow',13)}</button>`).join('')}</div>`:'<div class="dream-empty">Noch nichts gesammelt</div>'}</section>`}).join('')}</div>
 <section class="work-card dream-review"><div class="work-heading"><span>${ico('sync',18)} Dreams durchsehen</span><span class="quiet-tag">${dreams.length} Ideen</span></div>${current?`<form id="dream-edit-form" data-id="${h(current.id)}" class="dream-edit-form"><label>Gedanke<input name="title" required maxlength="1000" value="${h(current.title)}"/></label><label>Notizen<textarea name="note" rows="3" maxlength="10000">${h(current.note||'')}</textarea></label><label>Kategorie<select name="category">${DREAM_CATEGORIES.map(([key,title])=>`<option value="${key}" ${dreamCategory(current)===key?'selected':''}>${h(title)}</option>`).join('')}</select></label><button type="submit" class="primary-btn">Änderungen speichern</button><button type="button" class="secondary-btn" data-action="dream-to-inbox" data-id="${h(current.id)}">Zurück in die Inbox</button><button type="button" class="secondary-btn" data-action="dream-to-next" data-id="${h(current.id)}">Als Next Action aktivieren</button></form>`:'<p class="muted-line">Noch keine Dreams vorhanden. Du kannst hier jederzeit eine Idee aufnehmen.</p>'}</section></div>`);
}
function weatherCondition(code){if(code===0)return 'Klar';if(code<=3)return 'Bewölkt';if(code<=48)return 'Nebel';if(code<=67)return 'Regen';if(code<=77)return 'Schnee';if(code<=82)return 'Schauer';return 'Gewitter';}
async function loadWeather(city){
 weather={...weather,city,status:'loading'};render();
 try{const geo=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=de&format=json`).then(r=>{if(!r.ok)throw new Error('Ort nicht gefunden');return r.json()});
  const g=geo.results?.[0];if(!g)throw new Error('Ort nicht gefunden');
  const url=`https://api.open-meteo.com/v1/forecast?latitude=${g.latitude}&longitude=${g.longitude}&current=temperature_2m,weather_code&timezone=auto`;
  const data=await fetch(url).then(r=>{if(!r.ok)throw new Error('Wetterdienst nicht erreichbar');return r.json()});
  if(typeof data.current?.temperature_2m!=='number')throw new Error('Keine Wetterdaten');
  weather={city:g.name,status:'loaded',temperature:Math.round(data.current.temperature_2m),label:weatherCondition(data.current.weather_code)};
  render();
 }catch(ex){weather={city,status:'idle',temperature:null,label:''};toast(`Wetter konnte nicht geladen werden: ${ex.message}`,true);}
}
function vaultScreen(){
 tab=['inbox','forecast','overview','someday','review','activity','projects','templates','next','flagged','hold'].includes(tab)?'today':tab;
 return chrome(`<section class="vault-compact" aria-label="Lokalen Tresor einrichten"><div class="vault-copy"><span class="vault-icon">${ico('lock',18)}</span><div><h2>${hasVault?'Tresor entsperren':'Lokalen Tresor einrichten'}</h2><p>${hasVault?'Deine Daten bleiben verborgen, bis du sie entsperrst.':'Einmalig eine Passphrase festlegen; deine lokalen Daten werden verschlüsselt gespeichert.'}</p></div></div>
 <form class="vault-form" id="vault-form" autocomplete="off"><label class="sr-only" for="passphrase">Passphrase</label><input id="passphrase" name="passphrase" type="password" required minlength="12" placeholder="Passphrase (mindestens 12 Zeichen)" autocomplete="off" />
 ${!hasVault?'<label class="sr-only" for="passphrase-repeat">Passphrase wiederholen</label><input id="passphrase-repeat" name="repeat" type="password" minlength="12" required autocomplete="off" placeholder="Passphrase wiederholen"/>':''}
 <button class="primary-btn" type="submit">${hasVault?'Entsperren':'Einrichten'} ${ico('arrow',15)}</button>
 ${!hasVault?'<label class="restore-label" for="encrypted-import">Verschlüsseltes Backup importieren</label><input id="encrypted-import" type="file" accept="application/json"/>':''}</form></section>${todayWork(true)}`);
}
function todayScreen(){return chrome(`${occasionPanel()}${todayWork()}`);}
function homeScreen(){
 const k=state?.krakenPortfolio,valuation=k?.balances?krakenWealthSummary(k):null;
 const kraken=valuation?`<section class="work-card compass-kraken-home"><div><span class="page-overline">WEALTH / KRAKEN</span><strong>${valuation.covered?((valuation.totalEur).toLocaleString('de-AT',{style:'currency',currency:'EUR'})):'Noch nicht bewertet'}</strong><small>${valuation.complete?'Kraken Spot · EUR-Marktwert':'Nur teilweise bewertete Kraken-Positionen · keine Gesamtvermögenssumme'}</small></div><button type="button" data-tab="finance" class="secondary-btn">Finanz-Dashboard öffnen →</button></section>`:'';
 return chrome(`<div class="dashboard-timeline">${timelinePanel()}</div>${occasionPanel()}<details class="calm-overview-extra"><summary>${ico('layers',16)} Weitere Übersichten anzeigen</summary>${dashboardCards()}${kraken}</details>`);
}

function captureOverlay(){
 return `<div class="capture-modal-layer" data-action="capture-close-backdrop">
 <section class="capture-modal" role="dialog" aria-modal="true" aria-labelledby="capture-modal-title" tabindex="-1">
 <div class="capture-modal-heading"><div><p class="capture-eyebrow">QUICK CAPTURE · INBOX</p><h2 id="capture-modal-title">Aus dem Kopf. In Compass.</h2></div><button type="button" class="capture-modal-close" data-action="capture-close" aria-label="Schnellerfassung schließen">${ico('plus',20)}</button></div>
 <form id="capture-modal-form"><label for="capture-modal-input" class="sr-only">Neuer Gedanke</label>
 <textarea autofocus id="capture-modal-input" name="title" rows="3" maxlength="1000" required placeholder="Was möchtest du nicht vergessen?"></textarea>
 <details class="optional-capture"><summary>${ico('plus',15)} Notiz oder Link ergänzen <span>optional</span></summary><label for="capture-modal-note" class="sr-only">Zusätzliche Notiz</label><textarea id="capture-modal-note" name="note" maxlength="10000" rows="3" placeholder="Zusätzliche Informationen …"></textarea></details>
 <div class="capture-modal-foot"><span>${ico('lock',14)} Verschlüsselt und offline gespeichert</span><button class="primary-btn" type="submit">In Inbox erfassen ${ico('arrow',15)}</button></div></form>
 <p class="capture-modal-hint">Kein Projekt, keine Deadline · Entwurf bleibt beim Schließen bis zur Erfassung erhalten · Esc zum Schließen</p><button type="button" class="capture-bulk-shortcut" data-action="capture-bulk-open">Mehrere Folgepunkte erfassen →</button></section></div>`;
}
function captureBulkPanel(){
 const proposals=captureBulkPreview||[];
 return `<details class="capture-bulk-section" id="capture-bulk-details" ${captureBulkOpen?'open':''}>
 <summary>${ico('list',16)} Mehrere Folgepunkte erfassen <small>optional · keine Meetingprotokolle</small></summary>
 <p class="muted-line">Kopiere nur konkrete Folgepunkte aus deiner fortlaufenden Notizliste hierher. Keine Notion-Verbindung und keine automatische Aufgabenerstellung. Alle Vorschläge werden erst nach deiner Bestätigung zu Inbox-Einträgen.</p>
 <form id="capture-bulk-form" class="capture-bulk-form">
 <label>Format<select name="mode"><option value="lines" ${captureBulkMode==='lines'?'selected':''}>Stichpunkte / Meeting-Ergebnisse</option><option value="json" ${captureBulkMode==='json'?'selected':''}>Strukturierter lokaler KI-Entwurf (JSON)</option></select></label>
 <label>Folgepunkte<textarea name="text" rows="6" maxlength="40000" placeholder="- [Aktion] Termin vereinbaren\n- [Waiting] Rückmeldung zu Entwurf abwarten\n- [Agenda] Thema beim nächsten Gespräch ansprechen">${h(captureBulkRaw)}</textarea></label>
 <div class="capture-bulk-buttons"><button type="submit" class="secondary-btn">Vorschau prüfen</button><small>Keine Daten werden für die Vorschau übertragen.</small></div></form>
 ${proposals.length?`<form id="capture-bulk-confirm" class="capture-bulk-preview"><strong>${proposals.length} Vorschläge · ${proposals.filter(p=>p.duplicate).length} mögliche Dubletten</strong><p class="muted-line">Titel und Typ vor dem Import ändern. Unmarkierte Zeilen werden nicht gespeichert. Alle ausgewählten Ergebnisse gelangen ausschließlich in die Inbox.</p>
 ${proposals.map((p,i)=>`<div class="capture-bulk-row"><label class="capture-bulk-select"><input type="checkbox" name="chosen" value="${i}" ${p.duplicate?'':'checked'}/> Übernehmen ${p.duplicate?'<span class="capture-bulk-dupe">Mögliche Dublette</span>':''}</label><label>Text<input name="title-${i}" maxlength="180" value="${h(p.title)}"/></label><label>Vorschlag<select name="kind-${i}">${CAPTURE_KINDS.map(k=>`<option value="${h(k)}" ${k===p.kind?'selected':''}>${h(k)}</option>`).join('')}</select></label></div>`).join('')}
 <button type="submit" class="primary-btn">Ausgewählte Einträge in Inbox übernehmen</button><button type="button" class="secondary-btn" data-action="capture-bulk-clear">Verwerfen</button></form>`:''}
 </details>`;
}
function inboxScreen(){
 const fullList=inboxOrdered(rows(),state?.uiPreferences?.inboxManualOrder||[]);
 const query=inboxQuery.trim().toLocaleLowerCase('de');
 const list=query?fullList.filter(r=>`${r.title} ${r.note||''} ${visibleInboxTags(r).join(' ')}`.toLocaleLowerCase('de').includes(query)):fullList;
 const current=list.find(r=>r.id===selectedInboxId)||list[0]||null;
 return chrome(`<div class="inbox-mvp-layout"><section class="module-card module-active inbox-mvp-card">
 <div class="inbox-mvp-head"><div><h2>Offene Eingänge <span class="count">${fullList.length}</span></h2></div><button type="button" class="primary-btn" data-action="capture-focus">${ico('plus',17)} Erfassen</button></div>
 ${captureBulkPanel()}
 <div class="inbox-search-box">${ico('search',17)}<input id="inbox-query" type="search" placeholder="Einträge durchsuchen …" value="${h(inboxQuery)}" autocomplete="off" aria-label="Inbox durchsuchen"/></div>
 <div class="inbox-mvp-list" aria-label="Manuell sortierbare Inbox-Einträge">
 ${list.length?list.map((r,i)=>`<div class="inbox-row-wrap fin34-sortable" data-inbox-row="${h(r.id)}"><span class="inbox-drag-handle" draggable="${!query}" data-inbox-drag="${h(r.id)}" role="img" aria-label="${h(r.title)} verschieben" title="Anfassen und ziehen · alternativ Pfeiltasten rechts">⠿</span><button type="button" class="inbox-row-flag ${inboxFlagged(r)?'is-flagged':''}" data-action="inbox-flag" data-id="${h(r.id)}" aria-label="${inboxFlagged(r)?'Flagge entfernen':'Flagge setzen'}" aria-pressed="${inboxFlagged(r)}" title="${inboxFlagged(r)?'Flagge entfernen':'Flagge setzen'}">${ico('flag',16)}</button><button type="button" class="inbox-mvp-row ${current?.id===r.id?'is-current':''}" data-action="select-inbox" data-id="${h(r.id)}"><span class="inbox-list-mark">${ico('inbox',16)}</span><span class="inbox-list-copy"><strong>${h(r.title)}</strong>${r.note?`<small class="item-preview">${h(r.note)}</small>`:''}<small>${date(r.updatedAt)}${visibleInboxTags(r).length?' · '+visibleInboxTags(r).map(x=>'#'+h(x)).join(' '):''}</small></span><span class="inbox-list-sync ${state.pending.some(p=>p.id===r.id)?'needs-sync':''}" title="${state.pending.some(p=>p.id===r.id)?'Noch nicht synchronisiert':'Keine lokalen Änderungen ausstehend'}">${state.pending.some(p=>p.id===r.id)?ico('cloud',14):ico('check',14)}</span></button><button type="button" class="inbox-quick-today" data-action="inbox-plan-today" data-id="${h(r.id)}" title="Als Next Action für heute übernehmen · aus der Inbox entfernen · keine Deadline" aria-label="${h(r.title)} als Next Action für heute übernehmen und aus der Inbox entfernen">${ico('calendar',14)} <span>Heute</span></button><span class="inbox-reorder-controls"><button type="button" data-action="inbox-move-up" data-id="${h(r.id)}" aria-label="${h(r.title)} nach oben" title="Nach oben" ${i===0||query?'disabled':''}>↑</button><button type="button" data-action="inbox-move-down" data-id="${h(r.id)}" aria-label="${h(r.title)} nach unten" title="Nach unten" ${i===list.length-1||query?'disabled':''}>↓</button></span></div>`).join(''):
 `<div class="inbox-mvp-empty">${ico(query?'search':'inbox',32)}<strong>${query?'Keine passenden Einträge':'Dein Kopf darf leerer werden.'}</strong><span>${query?'Versuche einen anderen Suchbegriff.':'Halte hier alles fest, was dir im Alltag begegnet.'}</span></div>`}
 </div><div class="inbox-mvp-bottom"><span>${state.pending.length} ausstehende Änderungen</span><button type="button" class="review-link" data-tab="review">Wochenreview ${ico('arrow',14)}</button></div></section>
 <aside class="module-card module-active inbox-mvp-detail">${current?
 `<div class="inbox-detail-top"><span class="capture-eyebrow">INSPECTOR</span><span class="inbox-detail-date">${date(current.updatedAt)}</span><button class="inbox-inspector-flag ${inboxFlagged(current)?'is-flagged':''}" data-action="inbox-flag" data-id="${h(current.id)}" type="button" aria-pressed="${inboxFlagged(current)}" aria-label="${inboxFlagged(current)?'Flagge entfernen':'Flagge setzen'}" title="Flagged umschalten">${ico('flag',17)}</button></div>
 <form id="inbox-edit-form" data-id="${h(current.id)}" class="inbox-quiet-inspector">
 <label for="inbox-edit-title">Titel</label><textarea id="inbox-edit-title" name="title" maxlength="1000" rows="2" required>${h(current.title)}</textarea>
 
 <p class="inbox-project-hint">Mit „Als Aufgabe übernehmen“ wird der Eintrag einem Projekt zugeordnet und aus der Inbox entfernt. Ohne Projekt bleibt er eine Einzelaktion.</p>
 <label for="inbox-edit-note">Notiz</label><textarea id="inbox-edit-note" name="note" maxlength="10000" rows="3" placeholder="Optional">${h(current.note||'')}</textarea>
 <details class="inbox-inspector-extra v559-inbox-metadata"><summary>Projekt & GTD-Status</summary><div class="inbox-promote-fields"><label for="inbox-project-select">Projekt<select id="inbox-project-select" name="projectId">${projectOptions()}</select></label><label for="inbox-workflow-select">Status<select id="inbox-workflow-select" name="workflow"><option value="next">Next Action</option><option value="waiting">Waiting For</option><option value="hold">On Hold</option></select></label></div></details><details class="inbox-inspector-extra"><summary>Weitere Angaben</summary><label for="inbox-edit-tags">Personen / Agenda-Tags</label><input id="inbox-edit-tags" name="tags" data-smart-tags value="${h(visibleInboxTags(current).join(', '))}" placeholder="UKO, Martin"/></details>
 <div class="inbox-detail-actions"><button type="submit" name="intent" value="promote" class="primary-btn">${ico('arrow',15)} Als Aufgabe übernehmen</button><button type="submit" name="intent" value="save" class="secondary-btn">Notiz speichern</button><button type="button" class="secondary-btn" data-action="remove" data-id="${h(current.id)}">Archivieren</button></div>
 </form>`:
 `<div class="inbox-mvp-empty detail-empty">${ico('pencil',32)}<strong>Ein Gedanke genügt.</strong><span>Öffne die Schnellerfassung und halte fest, was dich beschäftigt.</span></div>`}</aside></div>`);
}

function clarifyControls(currentId=null){
 const saved=(currentId&&state?.reviewMeta?.[currentId])||{};
 const energy=[['low','Wenig',1],['medium','Mittel',2],['high','Viel',3]];
 const attentions=[['routine','Routine','sync'],['clarity','Geistige Klarheit','sun'],['deep','Tiefes Denken','book']];
 return `<div class="clarify-options" aria-label="Klärung und Energie"><div class="clarify-choice"><h3>Wohin gehört es?</h3><div class="choice-row">${[['next','Next Action'],['waiting','Waiting For'],['hold','On Hold'],['dreams','Dreams']].map(([value,label])=>`<button type="button" data-action="review-clarify:${value}" data-id="${h(currentId||'')}" class="choice-pill ${reviewWorkflow===value?'chosen':''}" aria-pressed="${reviewWorkflow===value}" ${currentId?'':'disabled'}>${label}</button>`).join('')}<span class="muted-line">Weitere Ziele können als Projekte oder Ideen angelegt werden.</span></div></div>
 <div class="clarify-choice"><h3>Wie viel Energie braucht es?</h3><div class="choice-row review-energy-choices">${energy.map(([key,label,level])=>`<button type="button" class="review-choice review-energy-${key} ${saved.energy===key?'chosen':''}" aria-pressed="${saved.energy===key}" data-action="review-energy:${key}" data-id="${h(currentId||'')}" ${currentId?'':'disabled'}><span class="mini-battery battery-${level}"><i></i></span>${label}</button>`).join('')}</div></div>
 <div class="clarify-choice"><h3>Welche Art von Aufmerksamkeit?</h3><div class="choice-row">${attentions.map(([key,label,icon])=>`<button type="button" class="review-choice review-attention ${saved.attention===key?'chosen':''}" aria-pressed="${saved.attention===key}" data-action="review-attention:${key}" data-id="${h(currentId||'')}" ${currentId?'':'disabled'}>${ico(icon,15)} ${label}</button>`).join('')}</div></div>
 <small class="review-local-caption">Energie und Aufmerksamkeit werden verschlüsselt in diesem lokalen Tresor gespeichert. Die Synchronisierung dieser Review-Merkmale auf andere Geräte folgt später.</small>
 <p class="muted-line">Projekt, Defer, Planned, Due und Duration kannst du direkt unterhalb der Klärung festlegen.</p>
 </div>`;
}
function reviewTaskRow(t,mode='next'){
 return `<div class="assistant-task"><div><strong>${h(t.title)}</strong><small>${h(t.projectId?projectLabel(t.projectId):'Einzelaktion')}${t.dueDate?' · Due '+h(t.dueDate):''}${t.workflow==='waiting'?' · Waiting For':''}</small></div><div class="assistant-actions"><button type="button" class="secondary-btn" data-action="assistant-task-edit" data-id="${h(t.id)}">Bearbeiten</button><button type="button" class="secondary-btn" data-action="assistant-task-done" data-id="${h(t.id)}">Erledigt</button></div></div>`;
}
function reviewInlineEditor(){
 const t=state?.tasks?.[reviewEditingTaskId];if(!t||t.archived)return '';
 return `<form id="review-inline-task" data-id="${h(t.id)}" class="assistant-inline-form"><div class="work-heading"><span>${ico('pencil',16)} Aufgabe bearbeiten</span><button type="button" class="secondary-btn" data-action="assistant-task-cancel">Schließen</button></div><label>Titel<input name="title" required maxlength="180" value="${h(t.title)}"/></label><label>Notiz<textarea name="note" maxlength="3000" rows="2">${h(t.note||'')}</textarea></label><div class="assistant-form-grid"><label>Status<select name="workflow">${workflowOptions(t.workflow)}</select></label><label>Projekt<select name="projectId">${projectOptions(t.projectId)}</select></label>${compactInspectorDate('deferUntil','Defer',t.deferUntil)}${compactInspectorDate('plannedDate','Geplant',t.plannedDate)}${compactInspectorDate('dueDate','Due',t.dueDate)}<label>Agenda-Tags<input data-smart-tags name="tags" maxlength="300" value="${h((t.tags||[]).join(', '))}"/></label></div><button type="submit" class="primary-btn">Aufgabe speichern</button></form>`;
}
function reviewQuickAction(defaultProject=null){
 return `<form id="review-quick-action" class="assistant-quick-action"><label>Nächste Aktion direkt hier erfassen<input name="title" required maxlength="180" placeholder="Konkreter, ausführbarer nächster Schritt …"/></label><div class="assistant-form-grid"><label>Projekt<select name="projectId">${projectOptions(defaultProject)}</select></label><label>Status<select name="workflow">${workflowOptions('next')}</select></label><label>Personen- / Agenda-Tags<input name="tags" data-smart-tags maxlength="300" placeholder="Tag eingeben …"/></label></div><button class="secondary-btn" type="submit">${ico('plus',14)} Aktion anlegen</button></form>`;
}
function reviewCalendarEntries(events,kind){
 if(!calendarToken)return `<p class="muted-line">Google Kalender ist noch nicht verbunden. Du kannst diesen Schritt trotzdem bewusst abschließen oder später erneut prüfen. Kalender-Zugriff bleibt nur lesend.</p>${reviewQuickAction()}`;
 return `${events.length?events.slice(0,35).map(e=>`<div class="assistant-task"><div><strong>${h(e.summary||'Kalendertermin')}</strong><small>${h(String(e.reviewDay))} · ${h(calendarTime(e))}${e.status==='tentative'?' · vorläufig':''}</small></div><span class="quiet-tag">${kind==='past'?'Vergangen':'Geplant'}</span></div>`).join(''):'<p class="muted-line">Keine passenden Kalendertermine in diesem Zeitfenster.</p>'}<p class="muted-line">Vergangene Termine sind keine bestätigten Treffen. Bei Nachbereitung oder Vorbereitung direkt eine Aktion anlegen.</p>${reviewQuickAction()}`;
}
function reviewStepBody(step,queue){
 if(step==='collect')return `<div class="assistant-help"><strong>Was ist noch im Kopf?</strong><p>Erfasse einzelne Gedanken schnell, bevor du die Inbox klärst. Auch Papiernotizen und Nachrichten-Postfächer bewusst berücksichtigen.</p></div><form id="review-capture" class="assistant-quick-action"><label>Gedanke, Erinnerung oder Zusage<input name="title" maxlength="1000" required placeholder="Was beschäftigt dich gerade?"/></label><button class="primary-btn" type="submit">Zur Inbox hinzufügen</button></form>`;
 if(step==='inbox'){
  const list=queue.inbox,current=list.find(r=>r.id===selectedInboxId)||list[0]||null;const draft=current?reviewDrafts.get(current.id)||{}:{};
  return `<div class="assistant-kpi">${list.length} ungeklärte Einträge</div><div class="review-cards-layout"><nav class="review-inbox-list">${list.map(r=>`<button type="button" class="review-inbox-item ${r.id===current?.id?'selected':''}" data-action="review-select" data-id="${h(r.id)}"><strong>${h(r.title)}</strong></button>`).join('')||'<p class="muted-line">Inbox leer – dieser Teil ist abgeschlossen.</p>'}</nav><div class="review-detail">${current?`<strong>${h(current.title)}</strong><p class="review-item-note">${h(current.note||'')}</p>${clarifyControls(current.id)}<form id="review-commit-form" data-id="${h(current.id)}"><div class="review-plan-fields"><label>Projekt<select name="projectId">${projectOptions(draft.projectId)}</select></label><label>Bereich<select name="category">${categoryOptions(draft.category||'Allgemein')}</select></label>${compactInspectorDate('deferUntil','Defer',draft.deferUntil)}${compactInspectorDate('plannedDate','Geplant',draft.plannedDate)}${compactInspectorDate('dueDate','Due',draft.dueDate)}<label>Aufwand in Minuten<input type="number" name="estimateMinutes" min="5" max="1440" step="5" value="${h(draft.estimateMinutes||'')}"/></label></div><button class="primary-btn" type="submit">Als ${h(({next:'Next Action',waiting:'Waiting For',hold:'On Hold',dreams:'Dream'})[reviewWorkflow])} übernehmen</button></form><button type="button" class="secondary-btn assistant-remove" data-action="assistant-inbox-remove" data-id="${h(current.id)}">Eintrag archivieren</button>`:'<p class="muted-line">Die Inbox ist vollständig geklärt.</p>'}</div></div>`;
 }
 if(step==='calendar-past')return reviewCalendarEntries(queue.calendarPast,'past');
 if(step==='calendar-future')return reviewCalendarEntries(queue.calendarFuture,'future');
 if(step==='next')return `<div class="assistant-kpi">${queue.next.length} ausführbare Next Actions</div><p class="muted-line">Prüfe konkrete nächste Schritte. Aufgaben lassen sich hier bearbeiten oder als erledigt markieren.</p>${queue.next.slice(0,35).map(t=>reviewTaskRow(t)).join('')||'<p class="muted-line">Keine verfügbaren Next Actions.</p>'}${reviewInlineEditor()}${reviewQuickAction()}`;
 if(step==='waiting')return `<div class="assistant-kpi">${queue.waiting.length} offene Waiting For</div>${impulseQueue(state?.people||{},localDate()).length?`<section class="people-review-queue"><strong>${ico('people',16)} Freiwillige Kontaktimpulse</strong><p class="muted-line">Nur ausdrücklich aktivierte Intervalle und selbst dokumentierte Kontakte. Keine fälligen Verpflichtungen.</p>${impulseQueue(state.people,localDate()).map(x=>`<button type="button" class="people-review-entry" data-action="person-review-open" data-id="${h(x.person.id)}">${h(x.person.name)} · letzter Kontakt ${h(x.last.day)} · ${x.daysSince} Tage ${ico('arrow',14)}</button>`).join('')}</section>`:''}<p class="muted-line">${waitingReview(state).attention} seit mindestens 7 Tagen nicht bearbeitet. Dies sind Hinweise zur Durchsicht, keine behaupteten überfälligen Zusagen.</p>${queue.waiting.map(t=>`<div class="gtd-waiting-review">${reviewTaskRow(t,'waiting')}<small>Letzte Bearbeitung: ${h(t.updatedAt?String(t.updatedAt).slice(0,10):'unbekannt')}</small></div>`).join('')||'<p class="muted-line">Keine offenen Waiting For.</p>'}${reviewInlineEditor()}${reviewQuickAction()}`;
 if(step==='projects'){
  const review=state.weeklyReview,project=queue.projects.find(p=>p.id===reviewProjectId)||queue.due.find(p=>!review.inspectedProjects.includes(p.id))||queue.projects.find(p=>!review.inspectedProjects.includes(p.id))||queue.projects[0];
  const sum=project?projectReviewSummary(project,state):null;
  const remaining=queue.due.filter(p=>!review.inspectedProjects.includes(p.id));
  return `<div class="assistant-project-stats"><strong>${queue.projects.length} aktive Projekte</strong><span>${queue.due.length} fällig · ${remaining.length} noch unbestätigt</span></div>
   <div class="assistant-project-layout"><div class="assistant-project-queue">${queue.projects.map(p=>`<button type="button" data-action="assistant-project-select" data-id="${h(p.id)}" class="assistant-project-entry ${project?.id===p.id?'selected':''}"><span>${h(p.title)}</span><small>${projectNeedsReview(p)?'Review fällig':`Intervall ${p.reviewIntervalDays||7} Tage`}${projectHealth(state).items.find(x=>x.project.id===p.id)?.hasNoAction?' · Keine Next Action':''}${review.inspectedProjects.includes(p.id)?' · ✓ geprüft':''}</small></button>`).join('')||'<p class="muted-line">Keine aktiven Projekte.</p>'}</div>
   <div class="assistant-project-focus">${project?`<h3>${h(project.title)}</h3><p class="muted-line">${h(project.outcome||'Noch kein gewünschtes Ergebnis hinterlegt.')}</p><div class="assistant-project-kpis"><span>${sum.tasks.length} offene Schritte</span><span>${sum.available.length} verfügbar</span><span>Review alle ${sum.interval} Tage</span></div>${!sum.available.length?'<p class="project-warning">Keine ausführbare Next Action – solltest du einen nächsten Schritt definieren?</p>':''}
   ${sum.tasks.slice(0,25).map(t=>reviewTaskRow(t)).join('')||'<p class="muted-line">Noch keine Aufgaben.</p>'}${reviewInlineEditor()}${reviewQuickAction(project.id)}<div class="assistant-project-footer"><button type="button" class="primary-btn" data-action="assistant-project-reviewed" data-id="${h(project.id)}">${ico('check',16)} Projekt geprüft</button><small>Das tatsächliche Reviewdatum wird im Projekt gespeichert und synchronisiert.</small></div>`:''}</div></div>`;
 }
 if(step==='unassigned')return `<div class="assistant-kpi">${queue.unassigned.length} offene projektlose Aufgaben</div><p class="muted-line">Einzelaktionen dürfen ohne Projekt bleiben. Prüfe nur, ob etwas tatsächlich mehrere Schritte erfordert.</p>${queue.unassigned.slice(0,60).map(t=>reviewTaskRow(t)).join('')||'<p class="muted-line">Keine offenen Einzelaktionen.</p>'}${reviewInlineEditor()}${reviewQuickAction()}`;
 if(step==='someday')return `<p class="muted-line">Was davon möchtest du weiter aufheben? Was kann aktiv werden?</p>${queue.dreams.slice(0,50).map(r=>`<div class="assistant-task"><strong>${h(r.title)}</strong><button type="button" class="secondary-btn" data-action="assistant-dream-activate" data-id="${h(r.id)}">In Inbox</button></div>`).join('')||'<p class="muted-line">Keine Someday-Ideen vorhanden.</p>'}<form id="review-capture" class="assistant-quick-action"><label>Neue Möglichkeit festhalten<input name="title" maxlength="1000" required placeholder="Was wäre interessant?"/></label><button type="submit" class="secondary-btn">In Inbox erfassen</button></form>`;
 const health=state?.healthImports||{},healthDates=[...(health.garminNights||[]),...(health.garminHrv||[])];
 const missing=missingGarminDays(healthDates,localDate());
 const healthText=!healthDates.length?'Noch keine Garmin-Daten importiert.':missing.length?`${missing.length} Tage nach dem letzten Garmin-Import vorgeschlagen (${missing[0]} bis ${missing.at(-1)}).`:'Keine offenen Tage nach dem letzten Garmin-Import erkannt.';

 const healthReview=reviewImportHub({state,healthFilePreview,placesPreview,financePreview,healthText});
 const emotionalReview=feelingReview(state.feelingCheckins||[],localDate());
 return `<div class="assistant-finish"><h3>Was ist jetzt noch offen?</h3><div class="assistant-finish-grid"><span><strong>${queue.inbox.length}</strong> Inbox</span><span><strong>${queue.due.length}</strong> fällige Projekte</span><span><strong>${queue.waiting.length}</strong> Waiting For</span><span><strong>${queue.unassigned.length}</strong> Einzelaktionen</span></div><label>Gedanken zum Abschluss<textarea id="review-end-notes" maxlength="1200" rows="3" placeholder="Was ist jetzt klarer? Was soll beim nächsten Review wieder auftauchen?">${h(state.weeklyReview?.notes||'')}</textarea></label><p class="muted-line">Du kannst den Review vollständig oder bewusst teilweise abschließen. Ein vollständiger Schritt bedeutet „durchgesehen“, nicht zwingend „alles erledigt“.</p>${emotionalReview}<p class="pc66-review-bridge"><button type="button" class="secondary-btn" data-action="insights-tab" data-id="connections">Gefühle & Alltag gemeinsam betrachten ↗</button> <small>Freiwillige, deskriptive Auswertung – keine Pflicht im Weekly Review.</small></p>${healthReview}</div>`;
}
function reviewScreen(){
 if(!validReview(state.weeklyReview)){state.weeklyReview=newReview();state.reviewVersion=state.reviewVersion||0;}
 const q=reviewQueue(state,calendarEvents,localDate()),r=state.weeklyReview;
 const index=r.step,step=REVIEW_STEPS[index],done=r.done.length,progress=Math.round(100*done/REVIEW_STEPS.length);
 return chrome(`<div class="assistant-review">
  <header class="assistant-review-head work-card"><div><span class="page-overline">GTD · WEEKLY REVIEW</span><h2>Dein System durchsehen.</h2><p class="muted-line">Ein Bereich nach dem anderen – ohne Reiterwechsel. Fortschritt wird gespeichert.</p></div><div><strong>${done} / ${REVIEW_STEPS.length}</strong><small> Bereiche geprüft</small><div class="assistant-progress"><span style="width:${progress}%"></span></div><button type="button" class="secondary-btn" data-action="assistant-new">Neuen Review starten</button></div></header>
  ${state.reviewConflict?`<div class="project-warning"><strong>Review-Konflikt auf anderem Gerät.</strong><p>Wähle bewusst, welche Version gilt.</p><button type="button" class="secondary-btn" data-action="assistant-resolve-remote">Cloud übernehmen</button><button type="button" class="secondary-btn" data-action="assistant-resolve-local">Meine Version behalten</button></div>`:''}
  ${r.completedAt?`<div class="assistant-completed work-card"><strong>Letzter Review abgeschlossen: ${h(new Date(r.completedAt).toLocaleDateString('de-AT'))}</strong><p>Du kannst die Schritte nachsehen oder einen neuen Durchgang beginnen.</p></div>`:''}
  <div class="assistant-review-grid"><nav class="work-card assistant-steps" aria-label="Review-Bereiche">${REVIEW_STEPS.map((s,i)=>`<button type="button" class="assistant-step ${i===index?'is-selected':''}" data-action="assistant-step" data-id="${i}" aria-current="${i===index?'step':'false'}"><span>${r.done.includes(s.id)?ico('check',15):ico(({collect:'inbox',inbox:'inbox','calendar-past':'calendar','calendar-future':'calendar',next:'target',waiting:'people',projects:'folder',unassigned:'list',someday:'spark',finish:'checkSquare'})[s.id]||'target',15)}<small>${i+1}</small></span><span><strong>${h(s.title)}</strong><small>${h(s.phase)}</small></span></button>`).join('')}</nav>
  <section class="work-card assistant-current"><div class="assistant-stage-header"><small>${h(step.phase)} · Schritt ${index+1} / ${REVIEW_STEPS.length}</small><h2>${h(step.title)}</h2><p>${h(step.help)}</p></div>${reviewStepBody(step.id,q)}<div class="assistant-review-footer"><button type="button" class="secondary-btn" data-action="assistant-back" ${index===0?'disabled':''}>← Zurück</button><button type="button" class="secondary-btn" data-action="assistant-next" ${index===REVIEW_STEPS.length-1?'disabled':''}>Überspringen</button><button type="button" class="primary-btn" data-action="assistant-complete-step">${index===REVIEW_STEPS.length-1?'Review abschließen':'Diesen Bereich geprüft →'}</button></div></section></div>
 </div>`);
}
// Opt-in E2EE device mirror. The Worker cannot read the records or derive this device's key.
// Source device is authoritative. Receiver is an offline-capable read-only mirror.
async function mirrorGet(kind){
 let record;try{record=(await request(config.apiUrl,authToken,`/api/private-device/${kind}`)).record;}catch(ex){if(ex.status===404)throw Error('Cloud-Worker zu alt: bitte zuerst die neue D1-Migration und Worker-Version installieren.');throw ex;}
 if(record?.chunked){
  if(!Number.isInteger(record.chunkCount)||record.chunkCount<2||record.chunkCount>180||!/^[0-9a-f-]{36}$/.test(record.chunkId||''))throw Error('Geräteabgleich: ungültiges Transferverzeichnis.');
  const chunks=[];
  for(let index=0;index<record.chunkCount;index++){
   const payload=await request(config.apiUrl,authToken,`/api/private-device/${kind}/parts?transferId=${record.chunkId}&partIndex=${index}`);
   chunks.push(payload.part);
  }
  record={...record,ciphertext:joinMirrorParts(chunks,record.chunkCount)};
 }
 return record;
}
async function mirrorPublishEncrypted(kind,encrypted,salt,baseVersion){
 if(!privateMirrorNeedsChunks(encrypted.ciphertext)){
  try{return await request(config.apiUrl,authToken,`/api/private-device/${kind}`,{method:'POST',body:JSON.stringify({...encrypted,salt,baseVersion})});}
  catch(ex){if(String(ex.message).includes('invalid-payload'))throw Error('Cloud-Worker lehnt das verschlüsselte Datenformat ab. Bitte Worker und D1-Migration 0017 aktualisieren.');throw ex;}
 }
 const transferId=crypto.randomUUID(),parts=privateMirrorParts(encrypted.ciphertext);
 for(let index=0;index<parts.length;index++){
  try{await request(config.apiUrl,authToken,`/api/private-device/${kind}/parts`,{method:'POST',body:JSON.stringify({transferId,partIndex:index,part:parts[index]})});}
  catch(ex){if(ex.status===404)throw Error('Für große Gesundheitsimporte fehlen noch Worker 0.5.52 und D1-Migration 0017. Lokale Daten sind sicher.');throw ex;}
 }
 return request(config.apiUrl,authToken,`/api/private-device/${kind}/commit`,{method:'POST',body:JSON.stringify({transferId,partCount:parts.length,baseVersion,salt,iv:encrypted.iv,compressed:encrypted.compressed})});
}
async function publishPrivateMirror(){
 const configMirror=state?.privateDeviceMirror;
 if(!configMirror||configMirror.mode!=='source'||!configMirror.dirty)return;
 for(const kind of PRIVATE_KINDS){
   const remote=await mirrorGet(kind);
   if(remote){
     if(remote.salt!==configMirror.salt)throw Error('Geräte-Sync: In der Cloud liegt bereits ein anderer Schlüssel. Keine Daten überschrieben.');
     await decryptSection(configMirror.key,kind,remote);
     if(configMirror.versions?.[kind] && remote.version!==configMirror.versions[kind])throw Error('Geräte-Sync: Cloud wurde zwischenzeitlich geändert. Keine Daten überschrieben.');
   }
   const encrypted=await encryptSection(configMirror.key,kind,privateSection(state,kind));
   const saved=await mirrorPublishEncrypted(kind,encrypted,configMirror.salt,remote?.version||0);
   configMirror.versions??={};configMirror.versions[kind]=saved.version;
   await persist();
 }
 configMirror.dirty=false;configMirror.lastAt=new Date().toISOString();await persist();
}
async function receivePrivateMirror(force=false){
 const configMirror=state?.privateDeviceMirror;if(!configMirror||configMirror.mode!=='receiver')return;
 let changed=false;
 for(const kind of PRIVATE_KINDS){
   const remote=await mirrorGet(kind);if(!remote)continue;
   if(remote.salt!==configMirror.salt)throw Error('Geräte-Sync: Schlüssel wurde in der Cloud geändert. Keine lokalen Daten überschrieben.');
   if(!force&&remote.version===(configMirror.versions?.[kind]||0))continue;
   const data=await decryptSection(configMirror.key,kind,remote);
   state=applyPrivateSection(state,kind,data);
   configMirror.versions??={};configMirror.versions[kind]=remote.version;changed=true;
 }
 if(changed){configMirror.lastAt=new Date().toISOString();await persist();render();}
}
async function setupPrivateMirror(mode,phrase){
 if(!authToken)throw Error('Zuerst mit deinem Compass-Google-Konto anmelden.');
 if(!['source','receiver'].includes(mode))throw Error('Gerätetyp auswählen.');
 const [finance,health]=await Promise.all(PRIVATE_KINDS.map(mirrorGet));
 const remote=finance||health;
 if(mode==='receiver'&&!remote)throw Error('Noch keine Daten in der Cloud. Zuerst am Hauptgerät aktivieren und senden.');
 // A second source must not silently overwrite the existing primary device.
 if(mode==='source'&&remote)throw Error('Cloud-Daten existieren bereits. Dieses Gerät zunächst als Empfangsgerät einrichten.');
 if(mode==='receiver'&&((state.financeTransactions?.length||0)>0||Object.values(state.healthImports||{}).some(v=>Array.isArray(v)&&v.length>0))){
   if(!confirm('Auf diesem Gerät liegen bereits lokale Finanz- oder Garmin-Importe. Das Hauptgerät wird für diese Daten maßgeblich; vorhandene Kopien werden durch dessen Stand ersetzt. Vorher ein verschlüsseltes Vault-Backup erstellen. Fortfahren?'))throw Error('Einrichtung abgebrochen, lokale Daten unverändert.');
 }
 const salt=remote?.salt||newSalt();const key=await syncKeyFromPhrase(phrase,salt);
 if(remote)await decryptSection(key,finance?'finance':'health',remote);
 state.privateDeviceMirror={mode,key,salt,versions:{},dirty:mode==='source',lastAt:null};
 await persist();if(mode==='source')await publishPrivateMirror();else await receivePrivateMirror(true);
 render();
}
function privateMirrorSettings(){
 const mirror=state.privateDeviceMirror;
 const loaded=state.healthImports?.garminSessions?.length||0,finance=state.financeTransactions?.length||0;
 return `<section class="work-card private-device-sync" aria-label="Privater Geräteabgleich"><div class="work-heading"><span>${ico('sync',18)} Finanz- & Garmin-Daten auf mehreren Geräten</span><span class="quiet-tag">Ende-zu-Ende verschlüsselt · freiwillig</span></div>
 <p class="muted-line">Aktuell in diesem Tresor: ${finance.toLocaleString('de-AT')} Bankbuchungen und ${loaded.toLocaleString('de-AT')} importierte Garmin-Einheiten. Planung/Inbox synchronisieren bereits separat; importierte Daten erst mit diesem optionalen Geräteabgleich.</p>
 ${mirror?`<div class="ux-settings-row"><div><strong>${mirror.mode==='source'?'Hauptgerät · sendet verschlüsselte Daten':'Empfangsgerät · lokaler Offline-Spiegel'}</strong><small>${mirror.lastAt?'Letzter erfolgreicher Abgleich: '+h(date(mirror.lastAt)):'Noch kein erfolgreicher Abgleich'} · Cloudflare speichert nur Ciphertext</small></div><button type="button" class="secondary-btn" data-action="private-mirror-refresh" ${!authToken||busy?'disabled':''}>Jetzt abgleichen</button></div><button type="button" class="secondary-btn" data-action="private-mirror-disconnect">Auf diesem Gerät deaktivieren</button>${mirror.mode==='source'?'<button type="button" class="secondary-btn" data-action="private-mirror-cloud-delete">Verschlüsselte Cloud-Kopien löschen</button>':''}`:
 `<form id="private-device-sync-setup" class="private-device-form"><label>Gerätetyp <select name="mode"><option value="source">Hauptgerät (Computer) · Daten senden</option><option value="receiver">Handy / Zweitgerät · Daten empfangen</option></select></label><label>Eigene Synchronisierungs-Passphrase (mind. 16 Zeichen) <input type="password" name="phrase" minlength="16" maxlength="200" required autocomplete="new-password" placeholder="Auf beiden Geräten dieselbe Passphrase"/></label><button class="primary-btn" type="submit" ${!authToken?'disabled':''}>Verschlüsselten Geräteabgleich aktivieren</button></form>`}
 <details><summary>Datenschutz und Funktionsumfang</summary><p class="small-muted">Nur Bankdaten einschließlich Korrekturen, finanzielle Ziele und lokale Garmin/Fitdays-Importe sowie manuelle Aktivitäten. Cloudflare sieht verschlüsselten Inhalt, Zeitpunkte und die Datenpaketgröße; keine Klartexte und keine Passphrase. Der Schlüssel liegt nur im verschlüsselten lokalen Tresor. Änderungen an diesen Bereichen erfolgen am Hauptgerät; andere Geräte erhalten eine schreibgeschützte Kopie. Beim Abgleich bleibt eine lokale Offline-Kopie erhalten. Verlierst du die Sync-Passphrase auf beiden Geräten und die eingerichteten Tresore, kann niemand Cloud-Daten entschlüsseln. Kein automatisches Zusammenführen widersprüchlicher Finanzkorrekturen.</p></details></section>`;
}
function systemScreen(){
 return chrome(`${smartImportHubView({state,entries:smartHubEntries,history:state?.smartImportHistory||[],folderStatus:smartHubFolderStatus,notice:smartHubNotice,busy:smartHubBusy,source:smartHubScanSource,storedCoverage:healthDataCoverage(state?.healthImports||{},localDate()),healthPreview:smartHubStage?.kind==='health'?healthFilePreview:null,healthJob:healthImportJob})}<div class="system-grid"><section class="module-card module-active"><div class="module-head"><div class="module-title">${ico('cloud',22)}<h2>Cloud-Verbindung</h2></div></div><p class="module-subtitle">GitHub Pages · Cloudflare Worker · D1</p>
 <div class="connection-detail"><span class="connection-dot ${configured()?'green':'amber'}"></span><span>${configured()?'Konfiguration hinterlegt':'Google-Anmeldung noch nicht konfiguriert'}</span></div>
 <p class="small-muted">${configured()?'API: '+h(config.apiUrl):'In client/public/runtime-config.json sind noch Konfigurationswerte zu ergänzen.'}</p><p class="small-muted">Frontend: Compass ${COMPASS_CLIENT_VERSION} · benötigt Worker-API 11 oder neuer.</p>
 <div id="google-button" class="google-button"></div><p class="small-muted">${authToken?'Compass-Sitzung aktiv: '+h(currentUser)+' · bleibt nach erneutem Tresor-Entsperren erhalten.':'Google-Anmeldung einmalig verknüpfen; danach wird die Compass-Sitzung verschlüsselt im Tresor gespeichert.'}</p><p class="small-muted">Planung automatisch: nach Änderungen und bei geöffneter App regelmäßig. Bank- und Garmin-Importe werden erst mit aktiviertem privaten Geräteabgleich übertragen.</p>
 <div class="system-actions"><button class="primary-btn" data-action="sync" ${!authToken||busy?'disabled':''}>${busy?'Synchronisiere …':'Jetzt synchronisieren'} ${ico('sync',16)}</button><button class="secondary-btn" data-action="logout" ${!authToken?'disabled':''}>Google trennen</button></div>
 <div class="mini-stats"><div><span>Wartende Änderungen</span><strong>${state.pending.length}</strong></div><div><span>Konflikte</span><strong>${state.conflicts.length}</strong></div><div><span>Sync-Cursor</span><strong>${state.cursor}</strong></div></div></section>
 <section class="module-card module-active"><div class="module-head"><div class="module-title">${ico('shield',22)}<h2>Lokaler Tresor</h2></div></div><p class="module-subtitle">Verschlüsselt und offline nutzbar.</p>
 <div class="security-line">${ico('check',17)} AES-256-GCM verschlüsselte Speicherung</div><div class="security-line">${ico('check',17)} Passphrase bleibt auf deinem Gerät</div><div class="security-line">${ico('check',17)} Keine privaten Aufgaben in GitHub</div>
 <button class="secondary-btn full" data-action="export-encrypted">Verschlüsseltes Backup herunterladen</button><button class="secondary-btn full" data-action="export-json">Klartext-JSON exportieren</button><p class="small-muted">Klartext-Exporte enthalten unverschlüsselte private Inhalte.</p></section></div>
 ${privateMirrorSettings()}
 <section class="work-card ux-settings" aria-label="Darstellung anpassen"><div class="work-heading"><span>${ico('settings',18)} Darstellung & Bedienung</span><span class="quiet-tag">Nur auf diesem Gerät</span></div>
 <p class="muted-line">Diese Einstellungen werden verschlüsselt in deinem lokalen Tresor gespeichert.</p>
 <div class="ux-settings-row"><div><strong>Weitere Ansichten dauerhaft öffnen</strong><small>Flagged, On Hold, Dreams und Aktivitäten in der Navigation anzeigen.</small></div><button type="button" class="secondary-btn" data-action="nav-more">${state?.uiPreferences?.advancedNav?'Ausblenden':'Einblenden'}</button></div>
 <div class="ux-settings-row"><div><strong>Erholungsideen</strong><small>Eigene Vorschläge und Filter findest du unter Erholung. Sie werden nicht ungefragt zu Aufgaben.</small></div><button type="button" class="secondary-btn" data-tab="recovery">Erholung öffnen</button></div>
 </section>
 ${state.conflicts.length?`<section class="module-card module-active"><div class="module-head"><div class="module-title">${ico('sync',21)}<h2>Synchronisationskonflikte (${state.conflicts.length})</h2></div></div><p class="module-subtitle">Wähle bewusst die gewünschte Fassung.</p>${state.conflicts.map(c=>`<div class="conflict"><p><strong>Lokal:</strong> ${h(c.local?.title||'(gelöscht)')}</p><p><strong>Cloud:</strong> ${h(c.remote?.title||'(fehlt)')}</p>${c.local?.note||c.remote?.note?`<p class="small-muted"><strong>Notiz lokal:</strong> ${h(c.local?.note||'(leer)')} · <strong>Cloud:</strong> ${h(c.remote?.note||'(leer)')}</p>`:''}<div class="system-actions"><button class="secondary-btn" data-action="resolve-remote" data-id="${h(c.id)}">Cloud übernehmen</button><button class="primary-btn" data-action="resolve-local" data-id="${h(c.id)}">Meine Version behalten</button></div></div>`).join('')}</section>`:''}`);
}
function projectLabel(projectId){return state?.projects?.[projectId]?.title||'Ohne Projekt';}
function personTag(name){return String(name||'').normalize('NFKC').toLocaleLowerCase('de').trim().replace(/[^\p{L}\p{N} _-]/gu,'').slice(0,32);}
function allOccasions(){return occasionsWithPeople(calendarEvents,eventAppearance,state?.people||{},localDate(),OCCASION_LEAD_DAYS);}
function occasionStatus(occasion,step){
 const existing=relatedOccasionTask(state,occasion,step);
 if(existing)return {kind:'accepted',task:existing};
 const key=occasionStepKey(occasion,step);
 return {kind:state?.occasionChoices?.[key]==='dismissed'?'dismissed':'pending'};
}
function occasionPanel(){
 const occasions=allOccasions();
 if(!occasions.length)return '';
 const visible=occasions.filter(o=>{
  const steps=[...OCCASION_STEPS[o.kind],...(state?.customOccasionSteps?.[o.id]||[]).filter(validCustomStep)];
  return steps.some(st=>occasionStatus(o,st).kind!=='pending'||daysUntil(localDate(),o.date)<=st.daysBefore);
 });
 if(!visible.length)return '';
 const first=visible.slice(0,7);
 return `<section class="work-card occasion-panel" aria-label="Anlässe und Vorbereitungen"><div class="work-heading"><span>${ico('bell',18)} Anstehende Anlässe</span><button type="button" class="secondary-btn" data-action="occasion-toggle">${occasionOpen?'Einklappen':'Anzeigen'}</button></div>
 ${occasionOpen?`${first.map(o=>{
  const distance=daysUntil(localDate(),o.date);
  const steps=[...OCCASION_STEPS[o.kind],...(state?.customOccasionSteps?.[o.id]||[]).filter(validCustomStep)];
  return `<div class="occasion-entry"><div class="occasion-entry-head"><span class="occasion-emoji">${h(o.emoji)}</span><div><strong>${h(o.title)}</strong><small>${h(o.date)} · ${distance===0?'Heute':`in ${distance} Tagen`} ${o.source==='calendar'?'· Google Kalender':o.source==='people'?'· Menschen':'· jährlich'}</small></div><button type="button" class="secondary-btn" data-action="occasion-custom" data-id="${h(o.id)}">+ Eigener Schritt</button></div>
  <div class="occasion-suggestions">${steps.map(st=>{const status=occasionStatus(o,st),active=distance<=st.daysBefore;
   if(status.kind==='pending'&&!active)return '';
   return `<div class="occasion-suggestion ${status.kind!=='pending'?'occasion-quiet':''}"><span>${h(st.label)}<small>${status.kind==='accepted'?'Als Aufgabe übernommen':status.kind==='dismissed'?'Für diesen Anlass ausgeblendet':`Sinnvoll bis ${h((()=>{const d=new Date(o.date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()-st.deadlineBefore);return d.toISOString().slice(0,10)})())}`}</small></span><div>${status.kind==='pending'?`<button type="button" class="primary-btn" data-action="occasion-accept" data-id="${h(o.id)}" data-step="${h(st.id)}">Übernehmen</button><button type="button" class="secondary-btn" data-action="occasion-dismiss" data-id="${h(o.id)}" data-step="${h(st.id)}">Nicht nötig</button>`:status.kind==='dismissed'?`<button type="button" class="secondary-btn" data-action="occasion-reset" data-id="${h(o.id)}" data-step="${h(st.id)}">Wieder anzeigen</button>`:`<button type="button" class="secondary-btn" data-action="task-view" data-id="${h(status.task.id)}">Aufgabe ansehen</button>`}</div></div>`;
  }).join('')}</div></div>`;
 }).join('')}<small class="occasion-footnote">Vorschläge erzeugen keine Aufgaben ohne deine Zustimmung. Feiertage werden jährlich berechnet, Geburtstage aus „Menschen“ oder Google Kalender erkannt. Keine Push-Benachrichtigung bei geschlossener App.</small>`:`<p class="muted-line">${visible.length} Anlässe mit offenen Vorbereitungen</p>`}</section>`;
}
function timelinePanel(){
 const today=localDate();const windowEnd=shiftDay(today,overviewHorizon-1);
 const maxWeek=Math.max(0,Math.ceil(overviewHorizon/7)-1);
 overviewWeek=Math.min(overviewWeek,maxWeek);
 const first=shiftDay(today,overviewWeek*7);
 const count=Math.min(7,overviewHorizon-overviewWeek*7);
 const days=Array.from({length:count},(_,i)=>shiftDay(first,i));
 const entries=timelineItems(state,calendarEvents,first,days[days.length-1],eventAppearance).filter(x=>x.date>=first&&x.date<=days[days.length-1]);
 const grouped=new Map(days.map(d=>[d,[]]));for(const x of entries)grouped.get(x.date)?.push(x);
 const selected=days.includes(selectedTimelineDay)?selectedTimelineDay:(entries[0]?.date||days[0]);
 const list=grouped.get(selected)||[],labels={due:'Deadline',planned:'Geplant',milestone:'Meilenstein',calendar:'Kalender'};
 const period=d=>new Intl.DateTimeFormat('de-AT',{day:'2-digit',month:'short'}).format(new Date(`${d}T12:00:00`));
 const dayName=d=>new Intl.DateTimeFormat('de-AT',{weekday:'short'}).format(new Date(`${d}T12:00:00`));
 return `<section class="work-card overview-timeline"><div class="work-heading"><span>${ico('layers',19)} Timeline · Projekte, Meilensteine & Termine</span><div class="timeline-horizon">${[14,30,90].map(n=>`<button type="button" data-action="timeline-horizon" data-id="${n}" class="secondary-btn ${overviewHorizon===n?'is-chosen':''}">${n} Tage</button>`).join('')}</div></div>
 <div class="timeline-week-nav"><div><strong>Woche ${overviewWeek+1}</strong><span> · ${h(period(first))}–${h(period(days[days.length-1]))}</span></div><div class="timeline-week-arrows"><button type="button" class="secondary-btn" data-action="timeline-week-prev" aria-label="Vorherige Woche" ${overviewWeek===0?'disabled':''}>${ico('arrowLeft',16)} Vorherige</button><button type="button" class="secondary-btn" data-action="timeline-week-next" aria-label="Nächste Woche" ${overviewWeek>=maxWeek?'disabled':''}>Nächste ${ico('arrow',16)}</button></div></div>
 <div class="timeline-axis" role="group" aria-label="Zeitstrahl, Woche ${overviewWeek+1}">
 ${days.map(d=>{const items=grouped.get(d)||[];return `<button type="button" class="timeline-axis-day ${d===selected?'selected':''} ${d===today?'is-today':''}" data-action="timeline-day" data-id="${h(d)}" aria-pressed="${d===selected}" aria-label="${h(dayName(d))} ${h(period(d))}, ${items.length} Ereignisse"><span class="timeline-axis-date">${h(dayName(d))} <strong>${h(period(d))}</strong></span><span class="timeline-axis-dot ${items.length?'has-events':''}"></span><span class="timeline-axis-count">${items.length?`${items.length} ${items.length===1?'Eintrag':'Einträge'}`:'–'}</span></button>`;}).join('')}
 </div>
 <div class="timeline-selected-detail"><div class="work-heading"><span>${ico('calendar',17)} ${h(dayName(selected))}, ${h(period(selected))}</span><span class="quiet-tag">${list.length} Einträge</span></div>
 ${list.length?`<div class="timeline-detail-grid">${list.map(x=>`<button type="button" class="timeline-detail-card type-${h(x.type)}" ${x.type==='calendar'?`data-action="agenda-open" data-id="${h(x.id)}"`:`data-action="${x.type==='milestone'?'timeline-project':'task-view'}" data-id="${h(x.id)}"`}><span class="branch-icon">${h(x.icon||(x.type==='milestone'?'◆':x.type==='due'?'⚑':'•'))}</span><span><strong>${h(x.title)}</strong><small>${h(labels[x.type]||x.type)}${x.projectId&&state?.projects?.[x.projectId]?` · ${h(projectLabel(x.projectId))}`:''}</small></span></button>`).join('')}</div>`:'<p class="timeline-day-empty">An diesem Tag gibt es im gewählten Zeitraum keine Einträge. Wähle einen anderen Punkt auf dem Zeitstrahl.</p>'}
 </div>
 <small class="occasion-footnote">${h(period(today))} bis ${h(period(windowEnd))} · Google Calendar nur lesend. Projekt-Meilensteine nutzen die Projekt-Deadline.</small></section>`;
}
function peopleMapMarkup(people,selected){
 const inspector=selected?`${relationshipInspectorMarkup(selected,state?.projects||{},localDate())}
 <section class="rel567-log"><h3>Kontakt dokumentieren</h3><div class="relationship-contact-quick">${CONTACT_TYPES.filter(([kind])=>['meeting','call','video','message','email'].includes(kind)).map(([kind,label])=>`<button type="button" data-action="person-quick-log" data-id="${h(selected.id)}" data-kind="${h(kind)}">${kind==='meeting'?'☕':kind==='call'?'☎':kind==='video'?'▣':kind==='message'?'💬':'✉'} ${h(label)}</button>`).join('')}</div>
 <form id="person-contact-form" class="compact-stack" data-id="${h(selected.id)}"><label>Datum<input type="date" name="day" max="${h(localDate())}" value="${h(localDate())}" required></label><label>Kontaktart<select name="type">${CONTACT_TYPES.map(([key,label])=>`<option value="${h(key)}" ${quickContactType===key?'selected':''}>${h(label)}</option>`).join('')}</select></label><label>Notiz (optional)<input name="note" maxlength="1200" placeholder="Was möchte ich behalten?"></label><button type="submit" class="secondary-btn">Kontakt bestätigen</button></form></section>`:'';
 return relationshipMapView(people,selected,{focus:relationshipMapFocus,filter:relationshipMapFilter,today:localDate(),projects:state?.projects||{},inspector});
}

function relationshipInspectorMarkup(person,projects,today){
 const p=preference(person),impulse=contactImpulse(person,today);
 const linked=relatedProjectIds(person,projects);
 const usable=Object.values(projects||{}).filter(x=>x&&!x.isTemplate&&x.kind!=='folder'&&x.status!=='completed').sort((a,b)=>a.title.localeCompare(b.title,'de'));
 return `<section class="relationship-profile"><div class="work-heading"><span>♡ Relationship Radar</span><button type="button" class="relationship-pause ${p.paused?'is-paused':''}" data-action="person-pause-toggle" data-id="${h(person.id)}" title="${p.paused?'Kontaktimpulse fortsetzen':'Kontaktimpulse pausieren'}" aria-label="${p.paused?'Kontaktimpulse fortsetzen':'Kontaktimpulse pausieren'}">${p.paused?'▶ Play':'⏸ Pause'}</button></div>
 <form id="relationship-preferences-form" data-id="${h(person.id)}" class="relationship-pref-form">
 <div class="relationship-inline-fields"><label>Beziehungsart<select name="relationKind">${RELATION_KINDS.map(([key,label])=>`<option value="${key}" ${p.kind===key?'selected':''}>${label}</option>`).join('')}</select></label><label>Darstellung auf Karte<select name="genderMarker">${GENDER_MARKERS.map(([key,label])=>`<option value="${key}" ${p.gender===key?'selected':''}>${label}</option>`).join('')}</select></label></div>
 <label for="rel-closeness">Persönliche Nähe <strong id="rel-closeness-value">${p.closeness}/100</strong></label><div class="relationship-slider-line"><span aria-hidden="true">❄️</span><input id="rel-closeness" class="relationship-closeness-slider" type="range" name="closeness" min="0" max="100" step="1" value="${p.closeness}" aria-label="Persönliche Nähe"/><span aria-hidden="true">❤️</span></div>
 <label for="rel-cadence">Gewünschter Kontaktrhythmus <strong id="rel-cadence-value">${p.cadence?`${p.cadence} Tage`:'Nach Bedarf'}</strong></label><div class="relationship-slider-line"><span aria-hidden="true">💬</span><input id="rel-cadence" class="relationship-cadence-slider" type="range" name="cadenceIndex" min="0" max="8" step="1" value="${Math.max(0,CADENCE_DAYS.indexOf(p.cadence))}" aria-label="Kontaktrhythmus"/><span aria-hidden="true">🗓️</span></div>
 <div class="relationship-score-line"><span>${p.paused?'⏸ Kontaktimpulse pausiert':impulse.hasHistory&&p.cadence?`Kontaktimpuls ${impulse.score}/100 · letzter Kontakt ${impulse.daysSince} Tage her`:'Noch kein automatischer Kontaktimpuls'}</span><button type="submit" class="secondary-btn">Speichern</button></div><small>Der Rhythmus ist ein Wunsch, keine Verpflichtung. Treffen (5), Video (4), Telefon (3), Chat (2), E-Mail (1): unterschiedliche Kontaktgewichte, keine Bewertung der Beziehung.</small></form>
 <details class="relationship-personal" ${person.personalDetailsOpen?'open':''}><summary>Persönliches & Gemeinsamkeiten</summary><form id="relationship-details-form" data-id="${h(person.id)}" class="compact-stack"><label>Partner:in (falls bekannt)<input name="partnerName" maxlength="400" value="${h(person.partnerName||'')}"/></label><label>Kinder / Familie (optional)<input name="childrenInfo" maxlength="400" value="${h(person.childrenInfo||'')}" placeholder="Namen oder Merkpunkte"/></label><label>Gemeinsame Hobbys<input name="sharedHobbies" maxlength="400" value="${h(person.sharedHobbies||'')}"/></label><label>Wichtige Ereignisse<textarea name="importantEvents" rows="2" maxlength="1200">${h(person.importantEvents||'')}</textarea></label><label>Fürs nächste Catch-up merken<textarea name="catchUpNotes" rows="2" maxlength="1200">${h(person.catchUpNotes||'')}</textarea></label><button type="submit" class="secondary-btn">Merkpunkte speichern</button></form></details>
 <div class="relationship-projects"><div class="work-heading"><span>Verbundene Projekte</span><span class="quiet-tag">${linked.length}</span></div>${linked.map(id=>`<div class="relationship-project-row"><button type="button" data-action="person-project-open" data-id="${h(id)}">${h(projects[id].title)} ↗</button><button type="button" class="secondary-btn" data-action="person-project-unlink" data-id="${h(id)}" title="Verknüpfung lösen">×</button></div>`).join('')||'<p class="muted-line">Noch keine gemeinsamen Projekte verknüpft.</p>'}<form id="person-project-link-form" data-id="${h(person.id)}" class="relationship-project-link"><select name="projectId" aria-label="Projekt verknüpfen"><option value="">Projekt auswählen …</option>${usable.filter(x=>!linked.includes(x.id)).map(x=>`<option value="${h(x.id)}">${h(x.title)}</option>`).join('')}</select><button type="submit" class="secondary-btn">Verbinden</button></form><form id="person-project-create-form" data-id="${h(person.id)}" class="relationship-project-link"><input name="title" maxlength="140" placeholder="Neues Projekt, z. B. Urlaub gemeinsam planen" aria-label="Neues Projekt anlegen"/><button type="submit" class="secondary-btn">Projekt anlegen</button></form></div></section>`;
}
function peopleScreen(){
 const people=Object.values(state?.people||{}).sort((a,b)=>a.name.localeCompare(b.name,'de'));
 const selected=people.find(p=>p.id===selectedPersonId)||people[0];
 const taskListFor=p=>linkedPersonTasks(state?.tasks,p);
 const inboxFor=p=>linkedPersonInbox(rows(),p);
 const related=selected?taskListFor(selected):[];
 const relatedInbox=selected?inboxFor(selected):[];
 const waiting=related.filter(t=>t.workflow==='waiting').length;
 const personEvents=selected?personCalendarEvents(calendarEvents,selected,localDate()):{upcoming:[],past:[]};
 const contact=selected?contactSummary(selected,localDate()):null;
 const contactLabel=contact?.last?new Date(contact.last.day+'T12:00:00').toLocaleDateString('de-AT'):'Noch kein bestätigter Kontakt';
 return chrome(`<nav class="relationship-tabs" aria-label="Menschen-Ansichten"><button type="button" data-action="people-tab" data-id="list" class="${peopleTab==='list'?'is-active':''}">☷ Kontakte</button><button type="button" data-action="people-tab" data-id="map" class="${peopleTab==='map'?'is-active':''}">◎ Beziehungslandkarte</button></nav><div class="people-grid ${peopleTab==='map'?'map-active':''}">${peopleTab==='map'?peopleMapMarkup(people,selected):`<section class="work-card"><div class="work-heading"><span>${ico('people',18)} Kontakte & Gesprächspunkte</span><span class="quiet-tag">${people.length}</span></div><details class="people-add-person"><summary>${ico('plus',14)} Person hinzufügen</summary><form id="person-create-form" class="compact-stack"><label>Name<input name="name" maxlength="80" required placeholder="Name hinzufügen" /></label><button type="submit" class="primary-btn">Hinzufügen</button></form></details><div class="people-list">${people.map(p=>`<button type="button" data-action="person-select" data-id="${h(p.id)}" class="people-item ${selected?.id===p.id?'selected':''}"><strong>${h(p.name)}</strong><small>${taskListFor(p).length} Aufgaben · ${inboxFor(p).length} Inbox${contactSummary(p,localDate()).last?' · zuletzt '+h(contactSummary(p,localDate()).last.day):''}${p.birthdayMonthDay?` · 🎂 ${h(p.birthdayMonthDay.slice(3))}.${h(p.birthdayMonthDay.slice(0,2))}.`:""}</small></button><div class="people-quick-actions"><button type="button" data-action="person-quick-log" data-id="${h(p.id)}" data-kind="call" title="Telefonat dokumentieren" aria-label="Telefonat mit ${h(p.name)} dokumentieren">☎</button><button type="button" data-action="person-quick-log" data-id="${h(p.id)}" data-kind="meeting" title="Persönliches Treffen dokumentieren" aria-label="Treffen mit ${h(p.name)} dokumentieren">☕</button><button type="button" data-action="person-quick-log" data-id="${h(p.id)}" data-kind="email" title="E-Mail dokumentieren" aria-label="E-Mail mit ${h(p.name)} dokumentieren">✉</button></div>`).join('')||'<p class="muted-line">Noch keine Kontakte. Personen und Notizen bleiben in deinem verschlüsselten lokalen Tresor.</p>'}</div></section>`}
 <section class="work-card"><div class="work-heading"><span>${ico('list',18)} ${selected?h(selected.name):'Gesprächsvorbereitung'}</span>${selected?`<button class="secondary-btn" type="button" data-action="person-remove" data-id="${h(selected.id)}">Entfernen</button>`:''}</div>${selected?`<p class="muted-line">${related.length} offene Aufgaben · ${relatedInbox.length} noch in der Inbox · ${waiting} Waiting For</p>
 ${relationshipInspectorMarkup(selected,state?.projects||{},localDate())}
 <section class="people-agenda-first"><div class="work-heading"><span>${ico('list',17)} Jetzt zu besprechen</span><span class="quiet-tag">${related.length} Aufgaben · ${relatedInbox.length} Inbox</span></div><div class="people-agendas">${related.map(t=>`<div class="person-point-row"><button type="button" class="person-quick-check" data-action="person-task-done" data-id="${h(t.id)}" aria-label="${h(t.title)} als erledigt markieren" title="Aufgabe erledigen" ${state?.taskConflicts?.[t.id]?'disabled':''}>${ico('check',15)}</button><details class="person-point" data-point="task" data-id="${h(t.id)}" ${personOpenPointId===t.id?'open':''}><summary><span class="person-point-symbol">${ico('checkSquare',16)}</span><span class="person-point-title"><strong>${h(t.title)}</strong><small>${h(t.workflow==='waiting'?'Waiting For':'Aufgabe / Agenda')}${state?.taskPending?.[t.id]?' · Lokal gespeichert':''}</small></span>${ico('chevronDown',15)}</summary><form class="person-point-form" data-kind="task" data-id="${h(t.id)}"><label>Notiz zu diesem Punkt<textarea name="note" maxlength="3000" rows="3" placeholder="Was haben wir besprochen?">${h(t.note||'')}</textarea></label>${state?.taskConflicts?.[t.id]?'<p class="person-point-warning">Bearbeitungskonflikt: Bitte zuerst in der Aufgabenansicht auflösen.</p>':''}<div class="person-point-actions"><button type="submit" name="intent" value="save" class="secondary-btn" ${state?.taskConflicts?.[t.id]?'disabled':''}>Notiz speichern</button><button type="submit" name="intent" value="done" class="primary-btn" ${state?.taskConflicts?.[t.id]?'disabled':''}>${ico('check',15)} Erledigt</button></div></form></details></div>`).join('')||'<p class="muted-line">Keine offenen Aufgaben mit diesem Personentag.</p>'}</div>${relatedInbox.length?`<section class="people-linked-inbox"><h3>${ico('inbox',16)} Noch in der Inbox · ${relatedInbox.length}</h3>${relatedInbox.map(r=>`<details class="person-point" data-point="inbox" data-id="${h(r.id)}" ${personOpenPointId===r.id?'open':''}><summary><span class="person-point-symbol">${ico('inbox',16)}</span><span class="person-point-title"><strong>${h(r.title)}</strong><small>Noch zu klären · kein erledigbarer Task</small></span>${ico('chevronDown',15)}</summary><form class="person-point-form" data-kind="inbox" data-id="${h(r.id)}"><label>Gesprächsnotiz<textarea name="note" maxlength="10000" rows="3" placeholder="Was ist dazu besprochen worden?">${h(r.note||'')}</textarea></label><div class="person-point-actions"><button type="submit" name="intent" value="save" class="secondary-btn">Notiz speichern</button><button type="submit" name="intent" value="discussed" class="primary-btn">${ico('check',15)} Besprochen &amp; archivieren</button></div><small>Archivieren ist keine Erledigung einer Aufgabe. Später kannst du aus der Inbox bei Bedarf eine Next Action erstellen.</small></form></details>`).join('')}</section>`:''}<form id="person-agenda-form" data-id="${h(selected.id)}" class="people-agenda-capture"><label>Gesprächsthema ergänzen<input name="title" required maxlength="180" placeholder="Was möchte ich mit dieser Person besprechen?"/></label><button type="submit" class="secondary-btn">${ico('plus',15)} Hinzufügen</button></form></section>
 <section class="people-relationship-card"><div class="work-heading"><span>${ico('people',17)} Kontaktverlauf</span><span class="quiet-tag">${contact?.items.length||0} bestätigt</span></div><div class="people-last-contact"><strong>${h(contactLabel)}</strong><small>${contact?.daysSince!==null?`${contact.daysSince} Tage seit dem letzten dokumentierten Kontakt`:'Noch keine Kontakte dokumentiert'}</small></div>
 ${contactImpulse(selected,localDate()).due?`<p class="people-contact-reminder">${ico('calendar',15)} Freiwilliger Kontaktimpuls: ${contact.daysSince} Tage seit dem letzten bestätigten Kontakt. Keine Verpflichtung.</p>`:''}
 <div class="relationship-contact-quick"><button type="button" data-action="person-quick-log" data-id="${h(selected.id)}" data-kind="meeting">☕ Treffen</button><button type="button" data-action="person-quick-log" data-id="${h(selected.id)}" data-kind="call">☎ Telefonat</button><button type="button" data-action="person-quick-log" data-id="${h(selected.id)}" data-kind="video">▣ Video</button><button type="button" data-action="person-quick-log" data-id="${h(selected.id)}" data-kind="message">💬 Nachricht</button><button type="button" data-action="person-quick-log" data-id="${h(selected.id)}" data-kind="email">✉ E-Mail</button></div>${quickContactType?`<p class="relationship-log-hint">${h(contactTypeLabel(quickContactType))} gewählt – Datum und Notiz prüfen, dann ausdrücklich bestätigen.</p>`:''}<form id="person-contact-form" class="compact-stack" data-id="${h(selected.id)}"><div class="people-contact-fields"><label>Kontaktdatum<input name="day" type="date" required max="${h(localDate())}" value="${h(localDate())}"/></label><label>Art<select name="type">${CONTACT_TYPES.map(([value,label])=>`<option value="${h(value)}" ${quickContactType===value?'selected':''}>${h(label)}</option>`).join('')}</select></label></div><label>Kurze Notiz (optional)<input name="note" maxlength="1200" placeholder="Was möchte ich behalten?"/></label><button class="secondary-btn" type="submit">${ico('check',15)} Kontakt festhalten</button></form>
 <div class="people-contact-log">${contact?.items.slice(0,8).map(entry=>`<div class="people-contact-row"><div><strong>${h(entry.day)} · ${h(contactTypeLabel(entry.type))}</strong><small>Kontaktgewicht: ${contactWeight(entry.type)} / 5</small>${entry.note?`<small>${h(entry.note)}</small>`:''}</div><button type="button" class="people-delete-entry" data-action="person-contact-delete" data-id="${h(entry.id)}" aria-label="Kontakteintrag vom ${h(entry.day)} entfernen" title="Eintrag löschen">${ico('x',15)}</button></div>`).join('')||'<p class="muted-line">Hier erscheinen ausschließlich Kontakte, die du selbst bestätigst. Kalendertermine gelten nicht automatisch als Treffen.</p>'}${(contact?.items.length||0)>8?`<details><summary>Alle ${contact.items.length} Kontakte</summary>${contact.items.slice(8).map(entry=>`<div class="people-contact-row"><div><strong>${h(entry.day)} · ${h(contactTypeLabel(entry.type))}</strong><small>Kontaktgewicht: ${contactWeight(entry.type)} / 5</small>${entry.note?`<small>${h(entry.note)}</small>`:''}</div><button type="button" data-action="person-contact-delete" data-id="${h(entry.id)}" aria-label="Kontakteintrag entfernen">${ico('x',15)}</button></div>`).join('')}</details>`:''}</div>
 <p class="muted-line">Kontaktimpulse werden über den Rhythmus im Relationship Radar gesteuert, ausschließlich anhand selbst bestätigter Kontakte.</p></section>
 <div class="people-calendar"><div class="work-heading"><span>${ico('calendar',16)} Gemeinsame Google-Termine</span><span class="quiet-tag">${personEvents.upcoming.length} kommende</span></div>${personEvents.upcoming.slice(0,5).map(e=>`<div class="person-calendar-event"><strong>${h(e.summary||'Termin')}</strong><small>${h(String(e.start?.dateTime||e.start?.date||'').slice(0,16).replace('T',' · '))} · geplant</small></div>`).join('')||'<p class="muted-line">Keine zugeordneten künftigen Kalendertermine.</p>'}${personEvents.past.length?`<details><summary>${personEvents.past.length} vergangene Termine</summary>${personEvents.past.slice(0,6).map(e=>`<div class="person-calendar-event"><strong>${h(e.summary||'Termin')}</strong><small>${h(String(e.start?.dateTime||e.start?.date||'').slice(0,16).replace('T',' · '))} · Durchführung nicht bestätigt</small></div>`).join('')}</details>`:''}<small class="muted-line">Google Kalender wird nur im angemeldeten Browser gelesen. Vergangene Termine sind kein bestätigter Kontakt.</small></div>

 <details class="people-admin-details"><summary>Weitere Kontaktangaben und Einstellungen</summary> <form id="person-tag-form" class="compact-stack" data-id="${h(selected.id)}"><label>Personen-Tag<input name="tag" data-smart-tags maxlength="50" value="${h(selected.tag)}" required/></label><label>Namensvarianten für Kalender (optional)<input name="aliases" maxlength="200" value="${h(selected.aliases||'')}" placeholder="Spitzname, Kurzform …"/></label><button class="secondary-btn" type="submit">Zuordnung speichern</button><small>Das Tag verbindet offene Aufgaben und ungeklärte Inbox-Einträge mit dieser Person. Die Inbox-Einträge werden nicht automatisch zu Aufgaben. Kalendertermine werden anhand des Namens oder der angegebenen Varianten erkannt.</small></form>
 <form id="person-birthday-form" data-id="${h(selected.id)}" class="compact-stack person-birthday-form"><div class="work-heading"><span>${ico('calendar',16)} Geburtstag</span><span class="quiet-tag">${selected.birthdayMonthDay?`${h(selected.birthdayMonthDay.slice(3))}.${h(selected.birthdayMonthDay.slice(0,2))}.${selected.birthdayYear||''}`:'Nicht eingetragen'}</span></div>
 <div class="birthday-fields"><label>Tag<select name="day"><option value="">–</option>${Array.from({length:31},(_,i)=>i+1).map(n=>`<option value="${n}" ${Number(selected.birthdayMonthDay?.slice(3))===n?'selected':''}>${n}</option>`).join('')}</select></label><label>Monat<select name="month"><option value="">–</option>${Array.from({length:12},(_,i)=>i+1).map(n=>`<option value="${n}" ${Number(selected.birthdayMonthDay?.slice(0,2))===n?'selected':''}>${new Intl.DateTimeFormat('de-AT',{month:'long'}).format(new Date(2000,n-1,1))}</option>`).join('')}</select></label><label>Geburtsjahr (optional)<input type="number" name="year" min="1850" max="${new Date().getFullYear()}" placeholder="Unbekannt" value="${h(selected.birthdayYear??'')}"/></label></div>
 <div class="birthday-actions"><button type="submit" class="secondary-btn">Geburtstag speichern</button><button type="button" class="secondary-btn" data-action="person-birthday-clear" data-id="${h(selected.id)}" ${selected.birthdayMonthDay?'':'disabled'}>Entfernen</button></div>
 <small>Gespeichert im verschlüsselten Tresor auf diesem Gerät. Geburtstage erscheinen in der Anlassvorbereitung und werden mit gleichen Google-Kalendergeburtstagen zusammengeführt.</small></form>
 <form id="person-note-form" data-id="${h(selected.id)}" class="compact-stack"><label>Notizen zur Person<textarea name="note" rows="3" maxlength="1500">${h(selected.note||'')}</textarea></label><button type="submit" class="secondary-btn">Notiz speichern</button></form></details>`:'<p class="muted-line">Wähle eine Person, um gemeinsame Themen und nächste Schritte zu verwalten.</p>'}</section></div>`);
}
function financeScreen(){return chrome(financeDashboardView(state,financePane,financePeriod,financePreview,financeReviewPage,{paceCompare:financePaceCompare,budgetMonth:financeBudgetMonth,query:financeLedgerQuery,filter:financeLedgerFilter,page:financeLedgerPage,tripSelected:financeTripSelected,tripQuery:financeTripQuery,tripMode:financeTripMode,tripPage:financeTripPage,categorySelected:financeCategorySelected,account:financeAccount,visualMode:financeVisualMode,compareMode:financeCompareMode,merchantCategory:financeMerchantCategory,sankeyFocus:financeSankeyFocus,sankeyExpanded:financeOverviewSankeyOpen,merchantSelected:financeMerchantSelected,cycleSelected:financeCycleSelected,forecastScenario:financeForecastScenario,financeWhatIf,financeWhatIfDraft,financeAiSuggestions,krakenPreview,krakenBridgeBusy,krakenPublicBusy,krakenChartAsset,krakenChartPeriod,krakenChartBusy,krakenChartError,krakenChartData,krakenChartSettings,marketQuote:financeMarketQuote,portfolioTab:financePortfolioTab,portfolioMarket:financePortfolioMarket,flatexSort:{key:flatexPositionSort,descending:flatexPositionDescending},flatexChart:{isin:flatexChartIsin,ticker:flatexChartTicker,period:flatexChartPeriod,busy:flatexChartBusy,error:flatexChartError,data:flatexChartData,settings:flatexChartSettings}}));}

const KRAKEN_BRIDGE_URL='http://127.0.0.1:18757';
const krakenBridgeRequest=async(path,method='GET',body=null)=>{
 const response=await fetch(KRAKEN_BRIDGE_URL+path,{method,headers:{Authorization:'Bearer '+krakenBridgeToken,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,cache:'no-store',mode:'cors'});
 if(!response.ok)throw Error('Lokaler Connector nicht erreichbar oder Kopplungscode/Origin stimmt nicht.');
 return response.json();
};
async function refreshPublicKrakenPrices(manual=false){
 if(!state?.krakenPortfolio?.balances||krakenPublicBusy)return;
 if(!navigator.onLine){if(manual)toast('Offline: keine Live-Kurse abrufbar.',true);return;}
 krakenPublicBusy=true;krakenPublicAttempt=Date.now();
 if(manual)render();
 try{
  const assets=Object.entries(state.krakenPortfolio.balances).filter(([,v])=>Number(v)>0).map(([asset])=>asset);
  if(assets.length>70)throw Error('Zu viele Währungen für den öffentlichen Kursabruf.');
  const reply=await fetchPublicEurQuotes(assets);
  if(!Object.keys(reply.quotesEur).length)throw Error('Keine passenden Kraken-EUR-Märkte mit Live-Kursdaten erreicht.');
  let n=0,total=0;
  await mutate(s=>{s.krakenPortfolio=updateKrakenQuotes(s.krakenPortfolio,reply);const summary=krakenWealthSummary(s.krakenPortfolio);n=summary.covered;total=summary.total;});
  if(manual)toast(`Öffentliche Kraken-Kurse aktualisiert: ${n}/${total} Positionen in EUR bewertbar.`);
 }catch(e){if(manual)toast('Live-Kurse: '+e.message,true);}finally{krakenPublicBusy=false;render();}
}
async function loadKrakenCoinChart(asset,period='1m'){
 if(!state?.krakenPortfolio?.balances||!Object.hasOwn(state.krakenPortfolio.balances,asset))return;
 krakenChartAsset=asset;krakenChartPeriod=period;krakenChartBusy=true;krakenChartError='';krakenChartData=null;render();
 try{
  const data=await fetchKrakenHistory(config.apiUrl,asset,period);
  if(krakenChartAsset===asset&&krakenChartPeriod===period)krakenChartData=data;
 }catch(e){if(krakenChartAsset===asset&&krakenChartPeriod===period)krakenChartError=e.message||'Historische Kurse nicht verfügbar.';}
 finally{if(krakenChartAsset===asset&&krakenChartPeriod===period){krakenChartBusy=false;render();}}
}
async function syncKrakenBridge(automatic=false){
 if(!state||krakenBridgeBusy||!krakenBridgeToken)return;
 krakenBridgeBusy=true;
 if(tab==='finance'&&financePane==='Portfolio')render();
 try{
  await krakenBridgeRequest('/sync','POST');
  let result=null;
  for(let i=0;i<200;i++){
   await new Promise(resolve=>setTimeout(resolve,3000));
   if(!state)throw Error('Vault ist gesperrt; Vorgang abgebrochen.');
   const status=await krakenBridgeRequest('/result');
   if(status.status==='failed')throw Error(status.error||'Kraken-Synchronisation fehlgeschlagen.');
   if(status.status==='ready'){result=status.snapshot;break;}
  }
  if(!result)throw Error('Kraken-Synchronisation dauert zu lange. Bitte später erneut versuchen.');
  const snapshot=validateKrakenSnapshot(result);
  krakenLocalCheckedAt=Date.now();
  if(automatic){
    await mutate(s=>{s.krakenPortfolio=mergeKrakenSnapshot(s.krakenPortfolio,snapshot);});
    toast('Kraken-Portfolio lokal aktualisiert.');
  }else{
    krakenPreview=snapshot;
    toast('Kraken-Daten lokal abgeholt. Vorschau im Portfolio prüfen und übernehmen.');
  }
 }catch(ex){toast('Lokale Kraken-Verbindung: '+ex.message,true);}
 finally{krakenBridgeBusy=false;if(state)render();}
}
function maybeAutoSyncKraken(){
 if(!state||tab!=='finance'||financePane!=='Portfolio'||!krakenBridgeToken||krakenBridgeBusy||document.visibilityState!=='visible'||state?.uiPreferences?.krakenAutoSync!==true)return;
 const last=Date.parse(state.krakenPortfolio?.generatedAt||'')||0;
 if(Date.now()-Math.max(last,krakenLocalCheckedAt)<12*3600*1000)return;
 syncKrakenBridge(true).catch(()=>{});
}
function maybeAutoRefreshPublicKraken(){
 if(!state||tab!=='finance'||financePane!=='Portfolio'||!state?.krakenPortfolio?.balances||document.visibilityState!=='visible'||state?.uiPreferences?.krakenPublicAuto===false||krakenPublicBusy)return;
 if(Date.now()-krakenPublicAttempt<15*60*1000)return;
 refreshPublicKrakenPrices(false).catch(()=>{});
}
if(typeof setInterval==='function')setInterval(maybeAutoRefreshPublicKraken,60*1000);
if(typeof setInterval==='function')setInterval(maybeAutoSyncKraken,15*60*1000);
if(typeof document.addEventListener==='function')document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){maybeAutoSyncKraken();maybeAutoRefreshPublicKraken();}});
function insightsScreen(){
 const tabDef=INSIGHT_TABS.find(t=>t.id===insightTab)||INSIGHT_TABS[0];
 const today=localDate();
 const model=buildSleepInsights(state?.healthImports||{},today,insightPeriod);
 const healthIds=['sleep','energy','stress','body'];
 const healthMode=healthIds.includes(insightTab);
 const compactInsights=[['balance','Balance Radar','compass'],['feelings','Gefühle','heart'],['connections','Zusammenhänge','spark'],['sleep','Gesundheit','heart'],['activity','Aktivität','activity'],['places','Orte','compass'],['focus','Produktivität','target'],['worktime','Arbeitszeit','clock'],['explore','Explore','spark']];
 const tabs=compactInsights.map(([id,label,icon])=>`<button type="button" class="calm-insight-tab ${(id==='sleep'?healthMode:insightTab===id)?'selected':''}" data-action="insights-tab" data-id="${id}" aria-pressed="${id==='sleep'?healthMode:insightTab===id}">${ico(icon,16)}<span>${label}</span></button>`).join('');
 const healthChoices=healthMode?`<div class="calm-health-icons" role="group" aria-label="Gesundheitsauswertung">${[['sleep','Schlaf','moon'],['energy','Body Battery','bolt'],['stress','Stress','activity'],['body','Körper','layers']].map(([key,label,icon])=>`<button type="button" class="calm-health-icon ${insightTab===key?'selected':''}" data-action="insights-tab" data-id="${key}" aria-label="${label}" title="${label}" aria-pressed="${insightTab===key}">${ico(icon,19)}<span class="calm-icon-tooltip" aria-hidden="true">${label}</span></button>`).join('')}<span class="calm-active-health-label">${h(tabDef.label)}</span></div>`:'';
 const periods=INSIGHT_PERIODS.map(([v,label])=>`<button type="button" class="insight-period ${insightPeriod===v?'selected':''}" data-action="insights-period" data-id="${h(v)}" aria-pressed="${insightPeriod===v}">${h(label)}</button>`).join('');
 const dataCount=(state?.healthImports?.garminNights?.length||0)+(state?.healthImports?.garminHrv?.length||0)+(state?.healthImports?.fitdays?.length||0)+(state?.healthImports?.garminWellness?.length||0)+(state?.healthImports?.garminFitness?.length||0)+(state?.healthImports?.garminSessions?.length||0);
 const content=insightTab==='connections'?personalConnectionsView(personalConnections(state,{today,days:connectionDays,emotionId:connectionEmotion,healthDays})):insightTab==='feelings'?feelingInsights(state?.feelingCheckins||[],today,feelingDays):insightTab==='balance'?lifeBalanceRadarView(buildLifeBalanceRadar(state,{today,period:balancePeriod,healthDays}),{history:buildLifeBalanceHistory(state,{today,period:balancePeriod,healthDays,count:balanceHistoryCount}),activeAxis:balanceSelectedAxis}):insightTab==='focus'?productivityInsightsView(buildProductivityInsights({imported:state?.healthImports||{},activities:activeActivities(watchSessions,state),calendarEvents,rules:effectiveCalendarRules(state),overrides:state?.calendarOverrides||{},calendarCoverage,today,period:insightPeriod}),activeActivities(watchSessions,state),calendarStatus,Boolean(calendarToken&&Date.now()<calendarExpires)):insightTab==='sleep'?insightsSleepView(model,insightNight,ico,today,state?.healthImports||{},{order:healthAiOrder,status:healthAiStatus},insightYearMode,insightWeekAnchor):insightTab==='worktime'?worktimeView(state?.workTime||{},workYear,workThreshold,workPreview,today,false)+worktimeYearComparisonView(state?.workTime?.days||[],today,workCompareMode)+worktimeImportPanel(state?.workTime||{},workPreview):insightTab==='stress'?insightsStressView(state?.healthImports,insightPeriod,today,insightWellnessDay,insightStressGranularity):insightTab==='energy'?insightsEnergyView(state?.healthImports,insightPeriod,today,insightWellnessDay):insightTab==='body'?healthBodyView(state?.healthImports||{},insightPeriod,insightBodyComposition):insightTab==='activity'?fitnessInsightsView(state?.healthImports||{},healthDays,insightPeriod,today,activeActivities(watchSessions,state),{mode:sportsMode,anchor:sportsAnchor,metric:sportsMetric,selected:sportsSelected,label:sportsPeriodWindow(sportsMode,sportsAnchor,today).label,today}):insightTab==='sources'?healthSummaryPanel('sources'):insightTab==='places'?placesInsightsView({visits:state?.placesVisits||[],mapRegion:placesMapRegion,mapZoom:placesMapZoom,listLimit:placesListLimit,labels:state?.placesLabels||{},nights:state?.healthImports?.garminNights||[],range:model.range,selected:selectedPlaceKey,preview:placesPreview}):insightTab==='explore'?exploreView(exploreDays({imported:state?.healthImports||{},activities:activeActivities(watchSessions,state),calendarEvents,rules:effectiveCalendarRules(state),overrides:state?.calendarOverrides||{},calendarCoverage,today,period:insightPeriod}),exploreX,exploreY,exploreLag):insightsPlannedView(insightTab,state?.healthImports||{},healthDays,activeActivities(watchSessions,state));
 return chrome(`<div class="insight-workspace" aria-label="Compass Insights · Personal Analytics">
 <div class="calm-insight-toolbar" aria-label="Mobile Insights-Navigation"><nav class="calm-insights-nav" aria-label="Insights-Kategorien">${tabs}</nav><button type="button" class="calm-source-action" data-action="insights-tab" data-id="sources" title="Garmin und Fitdays importieren">${ico('settings',16)}<span>Datenquellen</span></button></div>
 <div class="insight-view-header ${insightTab==='sources'?'insight-source-heading':''}"><div class="insight-heading-main"><div><div class="insight-kicker">${h(tabDef.label.toUpperCase())} / ${insightTab==='sources'?'VERWALTUNG':'ANALYSE'}</div><h2>${h(tabDef.subtitle)}</h2></div>${healthChoices}</div>${['sleep','body','stress','energy','focus','places','explore'].includes(insightTab)?`<div class="insight-periods" aria-label="Zeitraum auswählen">${periods}</div>`:''}</div>
 ${insightTab==='feelings'?`<div class="fw65-periods" role="group" aria-label="Gefühlsverlauf Zeitraum"><button data-action="feeling-period" data-id="7" class="${feelingDays===7?'selected':''}">7 Tage</button><button data-action="feeling-period" data-id="30" class="${feelingDays===30?'selected':''}">30 Tage</button><button data-action="feeling-period" data-id="90" class="${feelingDays===90?'selected':''}">90 Tage</button></div>`:''}${content}

 </div>`);
}
function progressScreen(){
 const projects=Object.values(state?.projects||{}).filter(p=>p.kind!=='folder'&&!p.isTemplate&&p.status==='active');
 const today=localDate(),earlier=new Date(today+'T12:00:00');earlier.setDate(earlier.getDate()-6);const begin=localDate(earlier);
 const stats=activityStats(activeActivities(watchSessions,state),begin,today);
 return chrome(`<div class="progress-view"><section class="work-card"><div class="work-heading"><span>${ico('activity',18)} Aktivitäten der letzten 7 Tage</span></div><div class="metrics-row"><div><strong>${stats.count}</strong><small>Sessions</small></div><div><strong>${(stats.minutes/60).toLocaleString('de-AT',{maximumFractionDigits:1})} h</strong><small>erfasste Zeit</small></div><div><strong>${stats.pomodoros}</strong><small>Pomodoros</small></div></div><button type="button" class="text-link" data-tab="activity">Sessions verwalten ${ico('arrow',14)}</button></section><section class="work-card"><div class="work-heading"><span>${ico('folder',18)} Projektfortschritt</span><span class="quiet-tag">${projects.length} aktiv</span></div>${projects.length?projects.map(p=>{const tasks=projectTasks(state,p.id);const completed=tasks.filter(x=>x.completed).length;return `<button type="button" class="progress-project" data-action="timeline-project" data-id="${h(p.id)}"><span class="progress-project-head"><strong class="progress-project-name">${h(p.title)}</strong><span class="progress-project-count" aria-label="${completed} von ${tasks.length} Schritten erledigt">${completed}/${tasks.length}</span></span><div class="progress-track" aria-hidden="true"><span style="width:${tasks.length?Math.round(completed/tasks.length*100):0}%"></span></div></button>`;}).join(''):'<p class="muted-line">Noch keine aktiven Projekte.</p>'}</section></div>`);
}
function healthSummaryPanel(mode='full'){
 const today=localDate(),vm=healthViewModel(healthDays,today,healthSpan);const s=vm.stats;
 const label=(key)=>key==='steps'?'Schritte':key==='sleepMinutes'?'Schlaf':'Training';
 const fmt=(key,v)=>v===null?'–':key==='steps'?Number(v).toLocaleString('de-AT'):key==='sleepMinutes'?healthTime(v):`${v} min`;
 const chart=(key,cls)=>{const bars=healthBars(vm.points,key);return `<div class="health-chart health-chart-${cls}" role="img" aria-label="${label(key)} in den letzten ${healthSpan} Tagen">${bars.map((b,i)=>`<div class="health-chart-slot" title="${h(b.day)}: ${h(b.label)}"><div class="health-chart-rail">${b.value===null?'<span class="health-chart-unknown" aria-hidden="true">·</span>':`<span class="health-chart-bar" style="height:${b.height}%"></span>`}</div><span class="health-chart-date">${h(new Intl.DateTimeFormat('de-AT',{weekday:'short',day:'numeric'}).format(new Date(b.day+'T12:00:00Z')))}</span></div>`).join('')}</div>`;};
 const cards=[['steps','steps','🚶','Bewegung'],['sleepMinutes','sleep','🌙','Schlaf'],['exerciseMinutes','exercise','🏃','Training']].map(([key,cls,emoji,title])=>`<article class="health-visual-card"><div class="health-card-title"><span class="health-card-icon" aria-hidden="true">${emoji}</span><strong>${title}</strong></div><span class="health-card-number">${fmt(key,s[key].average)}</span><span class="health-card-sub">Ø je erfasstem Tag · ${s[key].count}/${healthSpan} Messwerte</span>${chart(key,cls)}</article>`).join('');
 const rows=[...healthDays].sort((a,b)=>b.day.localeCompare(a.day)).slice(0,30);
 const storedHealth=healthImportCoverage(state?.healthImports||{}),previewHealth=healthFilePreview?healthImportCoverage(healthFilePreview):null;
 const showCoverage=r=>r.count?`${h(r.last)} · ${r.count.toLocaleString('de-AT')} Werte`:'keine gültigen Messwerte';
 return `${mode==='sources'?healthSourcesView(state?.healthImports):importedHealthDashboard(state?.healthImports,importHealthSpan,selectedGarminNight)}
 ${mode==='sources'?healthCoverageMarkup(healthDataCoverage(state?.healthImports||{},today)):''}
 ${mode==='sources'&&healthImportIssues.length?`<details class="health493-issues health-import-preview"><summary>${healthImportIssues.length} Importhinweise · betroffene Archive anzeigen</summary><div>${healthImportIssues.slice(0,60).map(msg=>`<p class="muted-line">${h(msg)}</p>`).join('')}</div></details>`:''}
 ${healthImportJob?`<section class="health-import-preview health493-job" role="status"><strong>Gesundheitsimport · ${healthImportJob.done}/${healthImportJob.total}</strong><progress max="${healthImportJob.total}" value="${healthImportJob.done}"></progress><p>${h(healthImportJob.message)}</p><button type="button" class="secondary-btn" data-action="health-import-stop" ${healthImportStop?'disabled':''}>Nach diesem Stapel stoppen</button></section>`:''}
 ${healthFilePreview&&!healthImportJob?`<section class="health-import-preview"><strong>Importvorschau · noch nicht gespeichert</strong><p>${healthFilePreview.processed} Datei(en) gelesen · ${healthFilePreview.fitdays.length} Fitdays-Messungen · ${healthFilePreview.garminNights.length} Garmin-Nächte · ${healthFilePreview.garminHrv.length} HRV-Tage · ${(healthFilePreview.garminWellness||[]).length} Stress-/Energie-Messpunkte · ${(healthFilePreview.garminFitness||[]).length} Garmin-Aktivitätstage · ${(healthFilePreview.garminSessions||[]).length} Trainingssessions.</p><p class="health492-coverage"><strong>Stress: ${showCoverage(previewHealth.stress)}</strong> · Body Battery: ${showCoverage(previewHealth.battery)} · Schlaf bis ${previewHealth.nights.last?h(previewHealth.nights.last):'–'}</p>${!previewHealth.stress.count?'<p class="muted-line">Achtung: Diese Vorschau enthält keine gültigen Stresswerte. Der Import ergänzt deshalb das Stressdiagramm nicht.</p>':''}${healthFilePreview.errors.length?`<details><summary>${healthFilePreview.errors.length} nicht lesbare Dateien anzeigen</summary><p class="error">${healthFilePreview.errors.slice(0,30).map(h).join('<br>')}${healthFilePreview.errors.length>30?'<br>Weitere Fehler im Stapel vorhanden.':''}</p></details>`:''}<div class="health-import-preview-actions"><button type="button" class="primary-btn" data-action="health-import-confirm">${smartHubStage?.kind==='health'?`Alle ${smartHubStage.entries.length} Archive übernehmen`:'Messwerte speichern'}</button><button type="button" class="secondary-btn" data-action="health-import-cancel">Verwerfen</button></div><small>Originaldateien werden weder gespeichert noch zur Cloud übertragen.</small></section>`:''}
 ${mode==='sources'?`<section class="work-card health-panel health-source-connection" aria-label="Health Connect"><div class="health-source-connection-head"><div><strong>${ico('activity',17)} Health Connect</strong><p>${healthDays.length} geladene Tageswerte · Cloud-Verbindung · maximal 90 Tage geladen</p></div><button type="button" class="secondary-btn" data-action="health-refresh" ${!authToken?'disabled':''}>${ico('sync',14)} Aktualisieren</button></div>${healthError?`<p class="error">${h(healthError)}</p>`:''}<details class="health-source-advanced"><summary>Geräte, Widget und Zugriffsrechte verwalten</summary>`:` <section class="work-card health-panel" aria-label="Gesundheitsüberblick"><div class="work-heading"><span>${ico('activity',18)} Gesundheit · Dein Überblick</span><button class="secondary-btn" data-action="health-refresh" ${!authToken?'disabled':''}>${ico('refresh',14)} Aktualisieren</button></div>
 <div class="health-hero"><div><span class="eyebrow">LETZTE ${healthSpan} TAGE</span><h3>Bewegung, Schlaf und Training</h3><p>Deine tatsächlichen Health-Connect-Messwerte. Fehlende Daten bleiben als Lücken sichtbar.</p></div><div class="health-span"><button class="secondary-btn ${healthSpan===7?'is-chosen':''}" data-action="health-range" data-id="7" aria-pressed="${healthSpan===7}">7 Tage</button><button class="secondary-btn ${healthSpan===30?'is-chosen':''}" data-action="health-range" data-id="30" aria-pressed="${healthSpan===30}">30 Tage</button></div></div>
 <div class="health-visual-grid">${cards}</div>
 <div class="health-observation"><span aria-hidden="true">✦</span><div><strong>Was die Daten zeigen</strong><p>${h(healthObservation(vm))}</p></div></div>
 ${healthError?`<p class="error">${h(healthError)}</p>`:''}
 <details class="health-details" ${healthDetailsOpen?'open':''} id="health-day-details"><summary>Tageswerte ansehen <span>${rows.length} gespeicherte Tage</span></summary><div class="health-days-list">${rows.map(d=>`<div class="health-day"><strong>${h(new Intl.DateTimeFormat('de-AT',{weekday:'short',day:'2-digit',month:'short'}).format(new Date(d.day+'T12:00:00Z')))}</strong><span>${d.steps===null?'–':Number(d.steps).toLocaleString('de-AT')} Schritte</span><span>${healthTime(d.sleepMinutes)} Schlaf</span><span>${d.exerciseMinutes??'–'} min Sport</span></div>`).join('')}</div></details>
`}
 <div class="widget-connect-panel"><div><strong>📱 Android-Widget · Heute auf einen Blick</strong><p>Die Widgets zeigen Fokus-Aufgaben oder die Veranstaltungen der nächsten sieben Tage. Keine Gesundheitsdaten im Homescreen. Dafür ist ein eigener, jederzeit widerrufbarer Lesezugang erforderlich. Keine Tresor-Passphrase im Widget.</p></div><button type="button" class="secondary-btn" data-action="widget-pair" ${!authToken?'disabled':''}>Widget-Kopplungscode erzeugen</button>${widgetPairCode?`<strong class="watch-code">${h(widgetPairCode)}</strong>`:''}${widgetConnectError?`<p class="error">${h(widgetConnectError)}</p>`:''}${widgetDevices.map(d=>`<div class="watch-session"><span>${h(d.label)} · ${h(d.createdAt.slice(0,10))}</span><button type="button" class="secondary-btn" data-action="widget-revoke" data-id="${h(d.deviceHash)}">Widerrufen</button></div>`).join('')}</div>
 <details class="health-details" ${healthDevicesOpen?'open':''} id="health-device-details"><summary>Health Connect & Datenschutz <span>Verbindung verwalten</span></summary><div class="health-pair-panel"><p>Im Android-Companion die Berechtigungen erteilen und einen einmaligen Code eingeben.</p><button type="button" class="secondary-btn" data-action="health-pair" ${!authToken?'disabled':''}>Health-Connect-Kopplungscode erzeugen</button> ${healthPairCode?`<strong class="watch-code">${h(healthPairCode)}</strong>`:''}${healthDevices.map(d=>`<div class="watch-session"><span>${h(d.label)}</span><button class="secondary-btn" data-action="health-revoke" data-id="${h(d.deviceHash)}">Trennen</button></div>`).join('')}<button type="button" class="secondary-btn" data-action="health-delete-all">Gesundheitsdaten aus der Cloud löschen</button><small>Der freiwillige tägliche automatische Abgleich wird im Android-Companion aktiviert. Die Werte sind zugriffsgeschützt in Cloudflare D1 gespeichert, aber nicht Ende-zu-Ende-verschlüsselt. Keine medizinische Bewertung.</small></div></details>${mode==='sources'?'</details>':''}</section>`;
}
function isoWeekNumber(d){const a=new Date(d);a.setUTCDate(a.getUTCDate()+4-(a.getUTCDay()||7));const y=new Date(Date.UTC(a.getUTCFullYear(),0,1));return Math.ceil((((a-y)/86400000)+1)/7);}
function discoveryPanel(){
 const today=localDate(),all=upcomingImportedEvents(state?.discoveredEvents,today);
 const monday=new Date(today+'T12:00:00Z');monday.setUTCDate(monday.getUTCDate()-((monday.getUTCDay()+6)%7)+7*discoveryWeekOffset);const mondayStr=monday.toISOString().slice(0,10);const sunday=new Date(monday);sunday.setUTCDate(monday.getUTCDate()+6);const sundayStr=sunday.toISOString().slice(0,10);
 const fmtWeek=d=>new Intl.DateTimeFormat('de-AT',{day:'numeric',month:'short'}).format(d);
 const preferences=state?.eventPreferences||{},fav=all.filter(e=>preferences[eventKey(e)]==='saved').length,hide=all.filter(e=>preferences[eventKey(e)]==='hidden').length;
 const filter=(e)=>{const status=preferences[eventKey(e)]||'open';if(discoveryRange==='saved'&&status!=='saved')return false;if(discoveryRange==='hidden'&&status!=='hidden')return false;if(!['saved','hidden'].includes(discoveryRange)&&status==='hidden')return false;
  if(discoveryCity!=='all'&&e.city!==discoveryCity)return false;if(discoveryArea!=='all'){const area=eventArea(e);if(discoveryArea==='austria'?!['graz','vienna','austria'].includes(area):discoveryArea==='europe'?!['graz','vienna','austria','europe'].includes(area):area!==discoveryArea)return false;}if(!matchesEventCategories(e.category,discoveryCategories))return false;
  const d=new Date(today+'T12:00:00Z'),wd=d.getUTCDay();if(discoveryRange==='today')return e.date===today;
  if(discoveryRange==='week'){d.setUTCDate(d.getUTCDate()+7);return e.date<=d.toISOString().slice(0,10);}
  if(discoveryRange==='weekend'){d.setUTCDate(d.getUTCDate()+(6-wd+7)%7);const sat=d.toISOString().slice(0,10);d.setUTCDate(d.getUTCDate()+1);return e.date>=sat&&e.date<=d.toISOString().slice(0,10);}
  if(discoveryRange==='all')return (e.endDate||e.date)>=mondayStr&&e.date<=sundayStr;
  return true;};
 const events=all.filter(filter).slice(0,100),groups=new Map();for(const e of events){if(!groups.has(e.date))groups.set(e.date,[]);groups.get(e.date).push(e);}
 const eventCard=e=>{const key=eventKey(e),[emoji,tone]=discoveryAppearance(e.category),status=preferences[key]||'open';const desc=e.description||`${e.category} im ${e.venue||e.city}. Genauere Informationen zum Programm stehen auf der Veranstalterseite.`;
 return `<article class="discovery-card discovery-${tone}"><div class="discovery-art" aria-hidden="true">${e.imageUrl?`<img src="${h(e.imageUrl)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer"/>`:""}<span class="discovery-art-fallback">${emoji}</span></div><div class="discovery-copy"><span class="discovery-type">${h(e.category)} · ${h(e.city)}${eventCountry(e)?` · ${h(eventCountry(e))}`:""}</span><h4>${h(e.title)}</h4><p>${h(desc)}</p><small>${h(e.venue)} · ${h(e.city)} · Termin und Details vor Besuch prüfen</small></div><div class="discovery-card-actions"><button type="button" class="secondary-btn ${status==='saved'?'is-chosen':''}" data-action="discovery-save" data-id="${h(key)}" aria-label="${status==='saved'?'Von Merkliste entfernen':'Zur Merkliste hinzufügen'}">${status==='saved'?'♥ Gemerkt':'♡ Merken'}</button><button type="button" class="text-link" data-action="discovery-hide" data-id="${h(key)}">${status==='hidden'?'Einblenden':'Ausblenden'}</button><a href="${h(e.sourceUrl)}" class="text-link" target="_blank" rel="noopener noreferrer">Details ↗</a></div></article>`;};
 const ranges=[['today','Heute'],['week','7 Tage'],['weekend','Wochenende'],['all','Alle'],['saved',`♥ Merkliste (${fav})`],['hidden',`Ausgeblendet (${hide})`]];
 const cities=[...new Set(all.map(x=>x.city))].sort();
 return `<section class="work-card discovery-panel"><div class="work-heading"><span>${ico('calendar',18)} Entdecken · Freizeit in deiner Nähe</span><span class="quiet-tag">${all.length} Veranstaltungen · ${fav} gemerkt</span></div>
 <p class="muted-line">Aus importierten Recherchen – keine Live-Verfügbarkeit. Die Programmbeschreibung wird nur angezeigt, wenn sie im Import enthalten ist.</p>
 <div class="discovery-tabs">${ranges.map(([value,title])=>`<button class="discovery-tab ${discoveryRange===value?'selected':''}" data-action="discovery-range" data-id="${value}" aria-pressed="${discoveryRange===value}">${h(title)}</button>`).join('')}</div>
 ${discoveryRange==='all'?`<div class="discovery-week-pager"><button type="button" class="secondary-btn" data-action="discovery-week-prev" ${discoveryWeekOffset===0?'disabled':''}>← Zurück</button><strong>${h(fmtWeek(monday))} – ${h(fmtWeek(sunday))} · KW ${isoWeekNumber(monday)}</strong><button type="button" class="secondary-btn" data-action="discovery-week-next">Weiter →</button><button type="button" class="text-link" data-action="discovery-week-today">Diese Woche</button></div>`:''}
 <div class="discovery-filters"><label>Region<select data-discovery-filter="area"><option value="all" ${discoveryArea==='all'?'selected':''}>Überall</option><option value="graz" ${discoveryArea==='graz'?'selected':''}>Graz & Umgebung</option><option value="vienna" ${discoveryArea==='vienna'?'selected':''}>Wien</option><option value="austria" ${discoveryArea==='austria'?'selected':''}>Österreich</option><option value="europe" ${discoveryArea==='europe'?'selected':''}>Europa</option></select></label><label>Stadt<select data-discovery-filter="city"><option value="all">Alle Städte</option>${cities.map(c=>`<option value="${h(c)}" ${discoveryCity===c?'selected':''}>${h(c)}</option>`).join('')}</select></label><details class="discovery-multiselect" ${discoveryCategoriesOpen?'open':''}><summary>Interessen · ${h(selectedCategoryLabel(discoveryCategories,EVENT_CATEGORIES))} ${ico('arrow',12)}</summary><div class="discovery-multiselect-list"><button type="button" class="text-link" data-action="discovery-cat-all">Alle Kategorien anzeigen</button>${EVENT_CATEGORIES.map(c=>`<label><input type="checkbox" data-discovery-category="${h(c)}" ${matchesEventCategories(c,discoveryCategories)?'checked':''}/> ${h(discoveryAppearance(c)[0])} ${h(c)}</label>`).join('')}</div></details><button class="secondary-btn" type="button" data-action="discovery-import-toggle">${discoveryImportOpen?'Import schließen':'＋ Veranstaltungen importieren'}</button></div>
 ${discoveryImportOpen?`<div class="discovery-import-drawer"><div class="discovery-actions"><button type="button" class="secondary-btn" data-action="discovery-prompt-regional">Recherche: Graz, Wien & Österreich</button><button type="button" class="secondary-btn" data-action="discovery-prompt-travel">Recherche: Tanz & Bujinkan Europa</button><button type="button" class="secondary-btn" data-action="discovery-clear">Importierte Events entfernen</button></div><form id="discovery-import-form" class="compact-stack"><label>Veranstaltungs-JSON<textarea name="events" rows="5" maxlength="200000" placeholder='{"events":[{"title":"...","date":"2026-11-01","city":"Graz","venue":"...","category":"Theater","description":"...","sourceUrl":"https://...","imageUrl":"https://...","country":"Österreich"}]}' required></textarea></label><button class="primary-btn" type="submit">Import prüfen</button></form>${discoveryImportPreview?`<div class="discovery-import-preview"><strong>${discoveryImportPreview.total} erkannt · ${discoveryImportPreview.added.length} neu · ${discoveryImportPreview.duplicates} Dubletten</strong><p>Die neuen Veranstaltungen werden erst nach deiner Bestätigung in den lokalen Tresor übernommen und mit deiner Compass-Cloud synchronisiert.</p><button class="primary-btn" type="button" data-action="discovery-import-confirm">${discoveryImportPreview.added.length} importieren</button><button class="secondary-btn" type="button" data-action="discovery-import-cancel">Abbrechen</button></div>`:""}<small>JSON mit Markdown-Codeblock und typischen KI-URL-Fehlern wird bereinigt. Bei Fehlern zeigen wir den Eintrag.</small></div>`:''}
 ${Object.keys(state?.eventConflicts||{}).length?`<div class="discovery-conflicts"><strong>${Object.keys(state.eventConflicts).length} Event-Konflikte zwischen Geräten</strong><p>Wähle je Veranstaltung die Cloud-Version oder deine lokale Bearbeitung.</p>${Object.entries(state.eventConflicts).slice(0,12).map(([k,c])=>`<div class="discovery-conflict-row"><span>${h(c.remote?.event?.title||k.split("|")[0])}</span><button class="secondary-btn" data-action="discovery-conflict-cloud" data-id="${h(k)}">Cloud</button><button class="secondary-btn" data-action="discovery-conflict-local" data-id="${h(k)}">Lokal</button></div>`).join("")}</div>`:""}
 <div class="discovery-day-groups">${[...groups].map(([date,items])=>{const shown=discoveryExpandedDays.has(date)?items:items.slice(0,3);return `<section class="discovery-day"><div class="discovery-day-head"><h3>${h(new Intl.DateTimeFormat('de-AT',{weekday:'long',day:'numeric',month:'long'}).format(new Date(date+'T12:00:00Z')))}</h3><span>${items.length} ${items.length===1?'Idee':'Ideen'}</span></div>${shown.map(eventCard).join('')}${items.length>3?`<button type="button" class="text-link discovery-more" data-action="discovery-more" data-id="${date}">${discoveryExpandedDays.has(date)?'Weniger anzeigen':`Weitere ${items.length-3} anzeigen`}</button>`:''}</section>`;}).join('')||'<p class="discovery-empty">Hier ist gerade nichts vorgemerkt. Ändere den Zeitraum oder die Filter, um andere Vorschläge zu sehen.</p>'}</div>
 </section>`;
}

function recoveryScreen(){
 const today=localDate(),endDate=new Date(today+'T12:00:00');endDate.setDate(endDate.getDate()+30);const end=localDate(endDate);
 const cal=calendarEvents.filter(e=>e.status!=='cancelled'&&calendarDate(e)>=today&&calendarDate(e)<=end&&eventAppearance(e).category==='Erholung'&&!eventAppearance(e).hidden);
 const acts=activeActivities(watchSessions,state).filter(x=>x.category==='Erholung').slice(0,25);
 const d=new Date(today+'T12:00:00');d.setDate(d.getDate()-6);const week=activityStats(activeActivities(watchSessions,state),localDate(d),today);
 const work=activeActivities(watchSessions,state).filter(x=>x.category==='Arbeit'&&x.startedAt.slice(0,10)>=localDate(d)).reduce((sum,x)=>sum+x.durationMinutes,0);
 const currentWeather=weather.status==='loaded'?recoveryWeather(weather.label):'unknown';
 const ideas=scoreRecoveryIdeas(allRecoveryIdeas(state),{weather:currentWeather,minutes:recoveryIdeaMinutes,energy:recoveryIdeaEnergy,range:recoveryIdeaRange});
 const weatherText=weather.status==='loaded'?`${weather.city}: ${weather.temperature} °C · ${weather.label}`:'Wetter noch nicht geladen';
 return chrome(`${discoveryPanel()}<section class="work-card recovery-idea-hub" aria-label="Freizeit bewusst planen">
 <div class="work-heading"><span>${ico('heart',20)} Zeit für dich</span><button class="secondary-btn" type="button" data-action="weather-load">${weather.status==='loaded'?'Wetter aktualisieren':'Wetter abrufen'}</button></div>
 <div class="recovery-glance"><div><span>Erfasste Arbeit · 7 Tage</span><strong>${(work/60).toLocaleString('de-AT',{maximumFractionDigits:1})} h</strong></div><div><span>Erfasste Erholung · 7 Tage</span><strong>${(week.recoveryMinutes/60).toLocaleString('de-AT',{maximumFractionDigits:1})} h</strong></div><div><span>Wetter · aktuell</span><strong>${h(weather.status==='loaded'?weather.label:'Nicht geladen')}</strong></div></div>
 <p class="muted-line">${work>0?'Die Erfassung zeigt nur protokollierte Zeiten, keine vollständige Arbeitsbelastung.':''} Diese Ideen sind freiwillige Inspirationen – keine Bewertung deiner Gesundheit. ${h(weatherText)}. Der Wetterfilter verwendet derzeit das aktuelle Stadtwetter, keine Wochenendprognose.</p>
 <div class="recovery-filter-row"><label>Zeitbudget<select id="recovery-idea-minutes" data-recovery-filter="minutes"><option value="60" ${recoveryIdeaMinutes===60?'selected':''}>Bis 1 Stunde</option><option value="180" ${recoveryIdeaMinutes===180?'selected':''}>Bis 3 Stunden</option><option value="360" ${recoveryIdeaMinutes===360?'selected':''}>Bis 6 Stunden</option><option value="1440" ${recoveryIdeaMinutes===1440?'selected':''}>Ganzer Tag</option></select></label>
 <label>Energie<select id="recovery-idea-energy" data-recovery-filter="energy"><option value="low" ${recoveryIdeaEnergy==='low'?'selected':''}>Wenig</option><option value="medium" ${recoveryIdeaEnergy==='medium'?'selected':''}>Mittel</option><option value="high" ${recoveryIdeaEnergy==='high'?'selected':''}>Viel</option></select></label>
 <label>Entfernung<select id="recovery-idea-range" data-recovery-filter="range"><option value="home" ${recoveryIdeaRange==='home'?'selected':''}>Zuhause</option><option value="near" ${recoveryIdeaRange==='near'?'selected':''}>In der Nähe</option><option value="trip" ${recoveryIdeaRange==='trip'?'selected':''}>Auch Ausflüge</option></select></label></div>
 <div class="recovery-ideas-grid">${ideas.length?ideas.map(i=>`<div class="recovery-idea"><span class="recovery-idea-emoji">${h(i.emoji)}</span><div><strong>${h(i.title)}</strong><small>${i.minutes} min · ${i.range==='home'?'Zuhause':i.range==='near'?'In der Nähe':'Ausflug'} · ${i.weather==='sun'?'☀️':i.weather==='rain'?'🌧️':'🌤️'}</small></div><button type="button" class="secondary-btn" data-action="recovery-idea-capture" data-id="${h(i.id)}" aria-label="${h(i.title)} in Inbox übernehmen">+ Inbox</button><button type="button" class="recovery-remove" data-action="${i.id.startsWith('idea-')?'recovery-idea-remove':'recovery-idea-hide'}" data-id="${h(i.id)}" aria-label="${i.id.startsWith('idea-')?'Idee entfernen':'Starteridee ausblenden'}">×</button></div>`).join(''):'<p class="muted-line">Für diese Auswahl gibt es noch keine passenden Ideen. Erhöhe das Zeitbudget oder ändere den Energiefilter.</p>'}</div>
 ${(state?.hiddenStarterIdeas||[]).length?`<button type="button" class="text-link" data-action="recovery-ideas-reset">Ausgeblendete Starterideen wiederherstellen (${state.hiddenStarterIdeas.length})</button>`:''}
 <form id="recovery-idea-form" class="recovery-add-form"><label>Eigene Freizeitidee<input name="title" required maxlength="90" placeholder="z. B. Ausflug zum See"/></label><label>Symbol<input name="emoji" maxlength="12" value="🌿" aria-label="Emoji für Idee"/></label><label>Dauer (Min.)<input name="minutes" type="number" min="15" max="1440" value="120" required/></label>
 <label>Wetter<select name="weather"><option value="any">Jedes Wetter</option><option value="sun">Sonnig</option><option value="rain">Regen</option></select></label><label>Energie<select name="energy"><option value="low">Wenig</option><option value="medium" selected>Mittel</option><option value="high">Viel</option></select></label><label>Entfernung<select name="range"><option value="home">Zuhause</option><option value="near" selected>In der Nähe</option><option value="trip">Ausflug</option></select></label><button type="submit" class="primary-btn">${ico('plus',15)} Idee speichern</button></form>
 </section>
 <div class="recovery-view"><section class="work-card"><div class="work-heading"><span>${ico('calendar',19)} Geplante Erholung · 30 Tage</span><span class="quiet-tag">${cal.length} Termine</span></div>${cal.length?cal.map(e=>`<button type="button" class="recovery-row" data-action="agenda-open" data-id="${h(e.id)}"><span>${h(eventAppearance(e).emoji)}</span><strong>${h(eventAppearance(e).displayTitle)}</strong><small>${h(calendarDate(e))}</small></button>`).join(''):`<p class="muted-line">${calendarToken?'Keine erkannten Erholungstermine in den nächsten 30 Tagen.':'Verbinde Google Calendar, um Erholungstermine anzuzeigen.'}</p>`}${calendarToken?calendarFilterToggle():calendarConnectUI()}</section>
 <section class="work-card"><div class="work-heading"><span>${ico('activity',19)} Erlebte Erholung</span><span class="quiet-tag">${acts.length} Aktivitäten</span></div>${acts.map(a=>`<button type="button" class="recovery-row" data-action="activity-open" data-id="${h(a.id)}"><span>🌿</span><strong>${h(a.title)}</strong><small>${h(a.startedAt.slice(0,10))} · ${a.durationMinutes} min</small></button>`).join('')||'<p class="muted-line">Du kannst in Aktivitäten eine Garmin-Session oder eine manuelle Aktivität als Erholung kennzeichnen.</p>'}<button type="button" class="text-link" data-tab="activity">Aktivitäten bearbeiten ${ico('arrow',14)}</button></section></div>`);
}

function activityScreen(){
 const all=projectActivities(watchSessions,state),rows=all.filter(a=>a.deleted===activityTrash);
 const chosen=rows.find(a=>a.id===activitySelectedId)||rows[0]||null;
 const projectOpts=`<option value="">Ohne Projekt</option>${Object.values(state?.projects||{}).filter(p=>p.kind!=='folder').map(p=>`<option value="${h(p.id)}" ${p.id===chosen?.projectId?'selected':''}>${h(p.title)}</option>`).join('')}`;
 const choices=ACTIVITY_CATEGORIES.map(c=>`<option value="${h(c)}" ${chosen?.category===c?'selected':''}>${h(c)}</option>`).join('');
 return chrome(`<div class="activity-summary-insights">${sportsInsightsView(state?.healthImports?.garminSessions||[],activeActivities(watchSessions,state),sportsPeriodWindow(sportsMode,sportsAnchor,localDate()),{mode:sportsMode,anchor:sportsAnchor,metric:sportsMetric,selected:sportsSelected,label:sportsPeriodWindow(sportsMode,sportsAnchor,localDate()).label,today:localDate()})}</div><div class="activity-layout"><section class="work-card"><div class="work-heading"><span>${ico('activity',18)} Aktivitätsverwaltung</span><div class="activity-actions"><button type="button" class="secondary-btn" data-action="activity-new">+ Manuell</button><button type="button" class="secondary-btn" data-action="watch-refresh" ${!authToken?'disabled':''}>Garmin aktualisieren</button></div></div>
 <p class="muted-line">Korrigieren, verschieben, Projekt zuordnen, wiederherstellen oder endgültig entfernen. Messwerte der Garmin bleiben bei redaktionellen Änderungen unverändert.</p><div class="activity-tabs"><button type="button" class="secondary-btn ${!activityTrash?'is-chosen':''}" data-action="activity-tab" data-id="active">Aktiv (${all.filter(a=>!a.deleted).length})</button><button type="button" class="secondary-btn ${activityTrash?'is-chosen':''}" data-action="activity-tab" data-id="trash">Papierkorb (${all.filter(a=>a.deleted).length})</button></div>
 <div class="activity-list">${rows.map(a=>`<button type="button" data-action="activity-open" data-id="${h(a.id)}" class="activity-row ${chosen?.id===a.id?'selected':''}"><strong>${h(a.title)} <small>· ${h(a.source)}</small></strong><span>${h(a.startedAt.replace('T',' · '))} · ${a.durationMinutes} min · ${h(projectLabel(a.projectId))}</span></button>`).join('')||'<p class="muted-line">Keine Aktivitäten in dieser Ansicht.</p>'}</div></section>
 <section class="work-card"><div class="work-heading"><span>${ico('pencil',18)} Session-Inspector</span></div>${chosen?`<form id="activity-edit-form" data-id="${h(chosen.id)}" class="compact-stack"><label>Titel<input name="title" required maxlength="100" value="${h(chosen.title)}"/></label><label>Art<select name="category">${choices}</select></label><label>Datum und Uhrzeit<input name="startedAt" type="datetime-local" required value="${h(chosen.startedAt)}"/></label><label>Dauer in Minuten<input name="durationMinutes" type="number" required min="1" max="1440" value="${chosen.durationMinutes}"/></label><label>Projekt<select name="projectId">${projectOpts}</select></label><label>Strecke (km, optional)<input name="distanceKm" type="number" min="0" max="999.99" step="0.01" value="${chosen.distanceKm??''}"/></label><label>Notiz<textarea name="note" maxlength="1000" rows="3">${h(chosen.note||'')}</textarea></label><p class="muted-line">Quelle: ${h(chosen.source)}${chosen.source==='Garmin'?' · Messwerte bleiben erhalten':''}</p><div class="activity-actions"><button type="submit" class="primary-btn">Änderungen speichern</button><button type="button" class="secondary-btn" data-action="${chosen.deleted?'activity-restore':'activity-trash'}" data-id="${h(chosen.id)}">${chosen.deleted?'Wiederherstellen':'In Papierkorb'}</button>${chosen.deleted?`<button type="button" class="danger-btn" data-action="activity-purge" data-id="${h(chosen.id)}">Endgültig löschen</button>`:''}</div></form>`:'<p class="muted-line">Wähle eine Session oder lege eine manuelle Aktivität an.</p>'}
 <div class="watch-pair-block"><h3>Garmin fēnix 7S</h3><p class="muted-line">Kopplung und Geräteverwaltung bleiben getrennt von der Session-Bearbeitung.</p>${watchPairCode?`<strong class="watch-code">${h(watchPairCode)}</strong>`:''}<button type="button" class="secondary-btn" data-action="watch-pair" ${!authToken?'disabled':''}>Kopplungscode erstellen</button>${watchDevices.map(d=>`<div class="watch-session"><span>${h(d.label)}</span><button type="button" class="secondary-btn" data-action="watch-revoke" data-id="${h(d.deviceHash)}">Trennen</button></div>`).join('')}${watchError?`<p class="watch-error">${h(watchError)}</p>`:''}</div></section></div>`);
}
async function reloadWidgetDevices(){
 if(!authToken)return;
 try{const data=await request(config.apiUrl,authToken,'/api/widget/devices');widgetDevices=data.devices||[];widgetConnectError='';render();}
 catch(ex){widgetConnectError='Widget-Geräte konnten nicht geladen werden: '+ex.message;}
}
async function reloadHealth(){
 if(!authToken||!config.apiUrl)return;
 try{const [values,devices]=await Promise.all([request(config.apiUrl,authToken,'/api/health/days?days=90'),request(config.apiUrl,authToken,'/api/health/devices')]);healthDays=values.days||[];healthDevices=devices.devices||[];healthError='';healthLastUpdated=Date.now();render();}
 catch(ex){healthError=ex.status===404?'Health-Worker 0.5.1 noch nicht veröffentlicht.':ex.message;render();}
}
async function reloadWatchSessions(){
 if(!authToken)return;
 try{const [data,dev]=await Promise.all([request(config.apiUrl,authToken,'/api/watch/sessions'),request(config.apiUrl,authToken,'/api/watch/devices')]);watchSessions=data.sessions||[];watchDevices=dev.devices||[];watchError='';render();}
 catch(ex){watchError='Uhr-Daten derzeit nicht erreichbar ('+ex.message+').';render();}
}
function render(){
 const feelingFocused=feelingOverlayOpen&&typeof document!=='undefined'&&document.activeElement?.closest?.('#fw65-dialog')?{id:document.activeElement.id||'',name:document.activeElement.dataset?.id||'',intensity:document.activeElement.dataset?.feelingIntensity||'',start:document.activeElement.selectionStart,end:document.activeElement.selectionEnd}:null;
 const captureFocus=snapshotCaptureDraft();
 if(!state){feelingOverlayOpen=false;feelingDraft=newFeelingDraft();captureOverlayOpen=false;captureDraft={title:'',note:'',noteOpen:false};dashboardCaptureDraft='';app.innerHTML=vaultScreen();bind();return;}
 try{sessionStorage.setItem('compass.calm.lastView',JSON.stringify({tab,insight:insightTab,finance:financePane}));}catch{}
 let html;
 try{html=tab==='activity'?activityScreen():tab==='people'?peopleScreen():tab==='progress'?progressScreen():tab==='finance'?financeScreen():tab==='insights'?insightsScreen():tab==='recovery'?recoveryScreen():tab==='system'?systemScreen():tab==='inbox'?inboxScreen():tab==='overview'?homeScreen():tab==='forecast'?forecastScreen():tab==='radar'?radarScreen():tab==='someday'?somedayScreen():tab==='review'?reviewScreen():['projects','templates'].includes(tab)?projectScreen():['next','flagged','hold'].includes(tab)?workflowScreen(tab):todayScreen();}
 catch(ex){if(tab!=='projects'&&tab!=='templates')throw ex;
   console.error('Compass Projektnavigation: Anzeige fehlgeschlagen',ex);
   // A broken older project hierarchy must never leave the sidebar inert.
   // Keep the navigation visible and offer a safe way to inspect the next action.
   const rows=Object.values(state?.projects||{}).filter(p=>p&&!p.isTemplate).slice(0,200);
   html=chrome(`<section class="work-card" role="alert"><h2>Projektansicht eingeschränkt</h2><p>Beim Darstellen der Projekte ist ein Fehler aufgetreten. Deine Projektdaten wurden nicht verändert.</p><p>${rows.length} Projekte/Ordner gefunden.</p><button type="button" class="secondary-btn" data-tab="next">Next Actions öffnen</button></section>`);
 }
 app.innerHTML=html;bind();restoreCaptureDraft(captureFocus);
 if(feelingFocused){let field=feelingFocused.id?app.querySelector('#'+feelingFocused.id):null;if(!field&&feelingFocused.name)field=app.querySelector('.fw65-emotion[data-id="'+feelingFocused.name+'"]');if(field?.focus){field.focus({preventScroll:true});if(Number.isInteger(feelingFocused.start)&&Number.isInteger(feelingFocused.end)&&typeof field.setSelectionRange==='function')try{field.setSelectionRange(feelingFocused.start,feelingFocused.end);}catch{}}}
 if(tab==='finance'&&financePane==='Portfolio'&&state?.uiPreferences?.krakenPublicAuto!==false&&state?.krakenPortfolio?.balances&&document.visibilityState==='visible'&&Date.now()-krakenPublicAttempt>15*60*1000&&!krakenPublicBusy){
   requestAnimationFrame(()=>refreshPublicKrakenPrices(false));
 }
 if(tab==='system'&&configured()&&!authToken)renderGoogleButton();
}
function bind() {
 const recPanel=app.querySelector('#rec554-panel');if(recPanel)recPanel.addEventListener('toggle',()=>{if(recPanel.isConnected)timeoffOpen=recPanel.open;});
 const plannerElement=app.querySelector('#v47-plan');if(plannerElement)plannerElement.addEventListener('toggle',()=>{plannerExpanded=plannerElement.open;});
 if(state)wireSmartTags(app,()=>state);
 if(tab==='finance'&&financePane==='Portfolio'&&krakenChartData?.candles?.length)app.querySelectorAll('.fin39-price-card .fin40-terminal').forEach(el=>wireTechnicalCrosshair(el,krakenChartData.candles,krakenChartSettings));
 if(tab==='finance'&&financePane==='Portfolio'&&flatexChartData?.candles?.length)app.querySelectorAll('.fin41-market-card .fin40-terminal').forEach(el=>wireTechnicalCrosshair(el,flatexChartData.candles,{...flatexChartSettings,currency:flatexChartData.currency}));
  app.querySelectorAll('[data-tab]').forEach(el=>el.onclick=ev=>{ev?.preventDefault?.();const target=el.dataset.tab;if(!target)return;tab=target;calmNavGroup=['overview','projects','templates','next','forecast','radar','flagged','hold','someday'].includes(tab)?'plan':['insights','activity','progress','recovery'].includes(tab)?'insights':'';if(tab==='finance')calmNavGroup='finance';if(tab==='health'){tab='insights';insightTab='sources';}if(tab==='places'){tab='insights';insightTab='places';insightPeriod='all';}notice='';error='';render();if((tab==='activity'||tab==='overview'||tab==='progress'||tab==='recovery'||tab==='insights')&&authToken)reloadWatchSessions().catch(()=>{});if((tab==='progress'||tab==='recovery'||tab==='insights')&&authToken){reloadHealth().catch(()=>{});reloadWidgetDevices().catch(()=>{});}});
  const balanceGoalsForm=app.querySelector('#lbr63-goals-form');
  if(balanceGoalsForm)balanceGoalsForm.onsubmit=async ev=>{ev.preventDefault();try{const fd=new FormData(balanceGoalsForm);const values=validateBalanceGoals({sleepMinutes:Number(fd.get('sleepHours'))*60,stepsDaily:Number(fd.get('stepsDaily')),weeklyHours:Number(fd.get('weeklyHours')),weightKg:String(fd.get('weightKg')||''),bodyFatTargetPct:String(fd.get('bodyFatTargetPct')||'')});await mutate(s=>{s.lifeBalanceGoals=values;});toast('Persönliche Richtwerte im Vault gespeichert.');}catch(ex){toast(ex.message,true);}};
  const vaultForm=app.querySelector('#vault-form');if(vaultForm)vaultForm.onsubmit=async ev=>{
    ev.preventDefault();const form=new FormData(vaultForm),p=String(form.get('passphrase')||'');
    try {if(hasVault){state=await vault.unlock(p);}else {if(p!==form.get('repeat'))throw new Error('Die Passphrasen stimmen nicht überein.');state=await vault.create(p);hasVault=true;}
      prepareTasks(state);eventState(state);prunePastEvents(state,localDate());await persist();
      if(captureAfterUnlock){captureOverlayOpen=true;captureAfterUnlock=false;}toast('Lokaler Tresor bereit.');
      resumeSession().catch(()=>{});}catch(ex){toast(ex.message,true);}
  };

  const privateSetup=app.querySelector('#private-device-sync-setup');if(privateSetup)privateSetup.onsubmit=async ev=>{
    ev.preventDefault();const values=new FormData(privateSetup),phrase=String(values.get('phrase')||'');
    try{await setupPrivateMirror(String(values.get('mode')||''),phrase);toast('Privater Geräteabgleich aktiviert. Die Daten sind jetzt auf diesem Gerät verfügbar.');}
    catch(ex){toast(ex.message,true);}
  };
  // All Review actions operate inside the assistant; no navigation to other tabs.
  const reviewCapture=app.querySelector('#review-capture');if(reviewCapture)reviewCapture.onsubmit=async ev=>{ev.preventDefault();const title=String(new FormData(reviewCapture).get('title')||'').trim();if(!title)return;await addCapture(title,'');toast('In die Inbox aufgenommen.');};
  const reviewQuick=app.querySelector('#review-quick-action');if(reviewQuick)reviewQuick.onsubmit=async ev=>{
    ev.preventDefault();const fd=new FormData(reviewQuick),title=String(fd.get('title')||'').trim(),projectId=fd.get('projectId')||null,workflow=fd.get('workflow')||'next';
    const t={id:crypto.randomUUID(),title,note:'',category:'Allgemein',workflow,completed:false,archived:false,flagged:false,plannedDate:null,dueDate:null,deferUntil:null,estimateMinutes:null,projectId,parentTaskId:null,sortOrder:0,tags:parseTags(fd.get('tags')),contextTags:[],updatedAt:stamp()};
    if(!validLocalTask(t)||projectId&&!state.projects?.[projectId]){toast('Aktion prüfen.',true);return;}
    await mutate(s=>{s.tasks[t.id]=t;s.taskPending[t.id]=true;for(const tag of t.tags)rememberTag(s,tag);});toast('Aktion gespeichert – Review bleibt geöffnet.');
  };
  const reviewInline=app.querySelector('#review-inline-task');if(reviewInline)reviewInline.onsubmit=async ev=>{
    ev.preventDefault();const fd=new FormData(reviewInline),id=reviewInline.dataset.id,original=state?.tasks?.[id];if(!original)return;
    const projectId=fd.get('projectId')||null;
    const t={...original,title:String(fd.get('title')||'').trim(),note:String(fd.get('note')||'').trim(),workflow:fd.get('workflow')||'next',projectId,parentTaskId:projectId===original.projectId?original.parentTaskId:null,plannedDate:fd.get('plannedDate')||null,dueDate:fd.get('dueDate')||null,deferUntil:fd.get('deferUntil')||null,tags:parseTags(fd.get('tags')),updatedAt:stamp()};
    if(!validLocalTask(t)||!validTaskParent(state,id,t.projectId,t.parentTaskId)||projectId&&!state.projects?.[projectId]){toast('Aufgabenfelder oder Hierarchie prüfen.',true);return;}
    if(projectId!==original.projectId&&Object.values(state.tasks).some(child=>!child.archived&&child.parentTaskId===id)){toast('Unteraufgaben zuerst umziehen, bevor du das Projekt änderst.',true);return;}
    await mutate(s=>{s.tasks[id]=t;s.taskPending[id]=true;for(const tag of t.tags)rememberTag(s,tag);});reviewEditingTaskId=null;toast('Aufgabe im Review aktualisiert.');
  };
  const reviewCommit=app.querySelector('#review-commit-form');if(reviewCommit){reviewCommit.oninput=captureReviewDraft;reviewCommit.onchange=captureReviewDraft;reviewCommit.onsubmit=async ev=>{
    ev.preventDefault();const id=reviewCommit.dataset.id,r=state?.records?.[id];if(!r||r.deleted)return;
    const d=new FormData(reviewCommit),workflow=reviewWorkflow;
    if(workflow==='dreams'){
      await mutate(s=>{const record=s.records[id];record.tags=parseTags(['dreams','dream-ideen',...(record.tags||[]).filter(t=>t!=='dreams'&&!t.startsWith('dream-'))]);record.updatedAt=stamp();s.pending.push(makeMutation(record));});
      selectedInboxId=null;selectedDreamId=id;reviewWorkflow='next';reviewDrafts.delete(id);toast('In Dreams übernommen.');return;
    }
    if(r.title.length>180){toast('Bitte den Inbox-Titel vor der Übernahme auf maximal 180 Zeichen kürzen.',true);return;}
    const meta=state.reviewMeta?.[id]||{};
    const contextTags=parseTags([...(meta.energy?['energy-'+meta.energy]:[]),...(meta.attention?['attention-'+meta.attention]:[])]);
    const task={id:crypto.randomUUID(),title:r.title,note:(r.note||'').slice(0,3000),plannedDate:d.get('plannedDate')||null,dueDate:d.get('dueDate')||null,deferUntil:d.get('deferUntil')||null,estimateMinutes:d.get('estimateMinutes')?Number(d.get('estimateMinutes')):null,category:d.get('category')||'Allgemein',workflow,flagged:inboxFlagged(r),completed:false,archived:false,projectId:d.get('projectId')||null,parentTaskId:null,sortOrder:0,tags:parseTags(visibleInboxTags(r)),contextTags,updatedAt:stamp()};
    if(!validLocalTask(task)||task.projectId&&!state.projects?.[task.projectId]){toast('Prüfe das Projekt und die Datumsfelder.',true);return;}
    await mutate(s=>{s.tasks[task.id]=task;s.taskPending[task.id]=true;s.records[id].deleted=true;s.records[id].updatedAt=stamp();s.pending.push(makeMutation(s.records[id]));delete s.reviewMeta?.[id];});
    selectedInboxId=null;selectedTaskId=task.id;reviewWorkflow='next';reviewDrafts.delete(id);toast('Inbox-Eintrag geklärt und als Aufgabe gespeichert.');
  };}
  const overlayForm=app.querySelector('#calendar-overlay-form');if(overlayForm)overlayForm.onsubmit=async ev=>{
    ev.preventDefault();const id=overlayForm.dataset.id;const d=new FormData(overlayForm);
    const next={title:String(d.get('title')||'').trim(),category:String(d.get('category')||''),emoji:String(d.get('emoji')||'').trim(),hidden:d.has('hidden')};
    if(!validCalendarOverride(next)){toast('Overlay-Felder prüfen.',true);return;}
    await mutate(s=>{s.calendarOverrides??={};s.calendarOverrides[id]=next;});toast('Compass-Overlay gespeichert. Der Google-Termin bleibt unverändert.');
  };
  app.querySelectorAll('.calendar-rule-form').forEach(form=>form.onsubmit=async ev=>{
    ev.preventDefault();const id=form.dataset.id;const fd=new FormData(form);
    const rule={id,label:String(fd.get('label')||'').trim(),emoji:String(fd.get('emoji')||'').trim(),category:String(fd.get('category')||'Neutral'),terms:String(fd.get('terms')||'').trim(),exclude:String(fd.get('exclude')||'').trim(),enabled:fd.has('enabled')};
    if(!validCalendarRule(rule)){toast('Bitte die Regel-Felder prüfen.',true);return;}
    await mutate(s=>{s.calendarRules=effectiveCalendarRules(s).map(r=>r.id===id?rule:r);});toast('Kalenderregel gespeichert.');
  });
  const activityForm=app.querySelector('#activity-edit-form');if(activityForm)activityForm.onsubmit=async ev=>{
    ev.preventDefault();const id=activityForm.dataset.id;const d=new FormData(activityForm);
    const data={title:String(d.get('title')||'').trim(),category:String(d.get('category')||''),startedAt:String(d.get('startedAt')||''),durationMinutes:Number(d.get('durationMinutes')),distanceKm:String(d.get('distanceKm')||'').trim()===''?null:Number(d.get('distanceKm')),note:String(d.get('note')||''),projectId:String(d.get('projectId')||'')};
    if(!validActivityEdit(data)||data.projectId&&!state?.projects?.[data.projectId]){toast('Prüfe Titel, Zeitpunkt, Dauer und Projekt.',true);return;}
    await mutate(s=>{if(id.startsWith('manual-')){s.manualActivities[id]={...s.manualActivities[id],...data};}else{s.activityEdits??={};s.activityEdits[id]={...(s.activityEdits[id]||{}),...data};}});toast('Änderungen im verschlüsselten Tresor gespeichert.');
  };
  const personForm=app.querySelector('#person-create-form');if(personForm)personForm.onsubmit=async ev=>{ev.preventDefault();const name=String(new FormData(personForm).get('name')||'').trim(),tag=personTag(name);if(!name||!tag){toast('Bitte einen gültigen Namen eingeben.',true);return;}if(Object.values(state.people||{}).some(p=>p.tag===tag)){toast('Kontakt bereits vorhanden.',true);return;}const id=crypto.randomUUID();await mutate(s=>{s.people??={};s.people[id]={id,name,tag,note:''};});selectedPersonId=id;render();};
  const personTagForm=app.querySelector('#person-tag-form');if(personTagForm)personTagForm.onsubmit=async ev=>{
    ev.preventDefault();const id=personTagForm.dataset.id,p=state?.people?.[id];if(!p)return;
    const data=new FormData(personTagForm),tag=parseTags([String(data.get('tag')||'').replace(/^#/, '')])[0],aliases=String(data.get('aliases')||'').trim();
    if(!tag||tag.length>50||aliases.length>200){toast('Bitte gültiges Personen-Tag verwenden.',true);return;}
    if(Object.values(state.people).some(x=>x.id!==id&&x.tag===tag)){toast('Tag wird bereits von einer anderen Person verwendet.',true);return;}
    await mutate(s=>{s.people[id].tag=tag;s.people[id].aliases=aliases;rememberTag(s,tag);});toast('Zuordnung gespeichert. Bestehende Aufgaben-Tags werden nicht verändert.');
  };
  const personBirthday=app.querySelector('#person-birthday-form');if(personBirthday)personBirthday.onsubmit=async ev=>{
    ev.preventDefault();const id=personBirthday.dataset.id;if(!state?.people?.[id])return;
    const fd=new FormData(personBirthday),day=Number(fd.get('day')||0),month=Number(fd.get('month')||0);
    const md=day&&month?`${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`:'';
    const raw=String(fd.get('year')||'').trim(),year=raw===''?null:Number(raw);
    if((day&&!month)||(month&&!day)||!validPersonBirthday(md,year)){toast('Bitte ein gültiges Datum und optional ein Geburtsjahr angeben.',true);return;}
    await mutate(s=>{s.people[id].birthdayMonthDay=md;s.people[id].birthdayYear=year;});toast('Geburtstag im lokalen Tresor gespeichert.');
  };
  const preferencesForm=app.querySelector('#relationship-preferences-form');
  if(preferencesForm){
    const near=preferencesForm.querySelector('#rel-closeness'),cad=preferencesForm.querySelector('#rel-cadence');
    if(near)near.oninput=()=>{const value=preferencesForm.querySelector('#rel-closeness-value');if(value)value.textContent=near.value+'/100';};
    if(cad)cad.oninput=()=>{const value=preferencesForm.querySelector('#rel-cadence-value'),days=CADENCE_DAYS[Number(cad.value)];if(value)value.textContent=days?days+' Tage':'Nach Bedarf';};
    preferencesForm.onsubmit=async ev=>{ev.preventDefault();const id=preferencesForm.dataset.id;if(!state?.people?.[id])return;
      const fd=new FormData(preferencesForm),closeness=Number(fd.get('closeness')),cadence=CADENCE_DAYS[Number(fd.get('cadenceIndex'))];
      if(!Number.isInteger(closeness)||closeness<0||closeness>100||cadence===undefined)return toast('Kontaktpräferenzen prüfen.',true);
      await mutate(s=>{Object.assign(s.people[id],{closeness,contactCadenceDays:cadence,relationKind:String(fd.get('relationKind')||'other'),genderMarker:String(fd.get('genderMarker')||'')});});toast('Beziehungseinstellungen gespeichert.');};
  }
  const detailForm=app.querySelector('#relationship-details-form');if(detailForm)detailForm.onsubmit=async ev=>{ev.preventDefault();const id=detailForm.dataset.id;if(!state?.people?.[id])return;try{const data=safePersonDetails(Object.fromEntries(new FormData(detailForm)));await mutate(s=>{Object.assign(s.people[id],data);});toast('Merkpunkte gespeichert.');}catch(ex){toast(ex.message,true);}};
  const projectLink=app.querySelector('#person-project-link-form');if(projectLink)projectLink.onsubmit=async ev=>{ev.preventDefault();const id=projectLink.dataset.id,projectId=String(new FormData(projectLink).get('projectId')||'');if(!state?.people?.[id]||!state.projects?.[projectId])return;await mutate(s=>{const p=s.people[id];p.relatedProjectIds=[...new Set([...(p.relatedProjectIds||[]),projectId])];});toast('Projekt verknüpft.');};
  const personProjectCreate=app.querySelector('#person-project-create-form');if(personProjectCreate)personProjectCreate.onsubmit=async ev=>{ev.preventDefault();const id=personProjectCreate.dataset.id,title=String(new FormData(personProjectCreate).get('title')||'').trim();if(!state?.people?.[id]||!title||title.length>140)return toast('Projektname prüfen.',true);
    const project={id:crypto.randomUUID(),title,outcome:'',category:'Allgemein',status:'active',dueDate:null,reviewIntervalDays:7,reviewedAt:null,kind:'project',folderIcon:null,isTemplate:false,projectType:'parallel',parentId:null,sortOrder:0};if(!validProject(project))return toast('Ungültiges Projekt.',true);
    await mutate(s=>{s.projects[project.id]=project;s.projectPending[project.id]=true;s.people[id].relatedProjectIds=[...new Set([...(s.people[id].relatedProjectIds||[]),project.id])];});toast('Projekt angelegt und mit Person verbunden.');};
  const relationshipMap=app.querySelector('#relationship-map');if(relationshipMap&&typeof relationshipMap.addEventListener==='function'){
    let dragging=null,moved=false;
    const point=e=>{const rect=relationshipMap.getBoundingClientRect(),scale=Math.min(rect.width/MAP567.width,rect.height/MAP567.height)||1;
      const ox=(rect.width-MAP567.width*scale)/2,oy=(rect.height-MAP567.height*scale)/2;
      return {x:(e.clientX-rect.left-ox)/scale,y:(e.clientY-rect.top-oy)/scale};};
    relationshipMap.addEventListener('pointerdown',ev=>{const node=ev.target.closest?.('[data-person-node]');if(!node)return;dragging={id:node.dataset.personNode,node,startX:ev.clientX,startY:ev.clientY};moved=false;try{node.setPointerCapture(ev.pointerId);}catch{}});
    relationshipMap.addEventListener('pointermove',ev=>{if(!dragging)return;const q=point(ev);if(Math.hypot(ev.clientX-dragging.startX,ev.clientY-dragging.startY)>5)moved=true;
      if(moved){const dx=q.x-MAP567.cx,dy=q.y-MAP567.cy,r=Math.min(MAP567.max,Math.max(MAP567.min,Math.hypot(dx,dy))),f=r/(Math.hypot(dx,dy)||1);
       dragging.node.setAttribute('transform',`translate(${(MAP567.cx+dx*f).toFixed(1)} ${(MAP567.cy+dy*f).toFixed(1)})`);}});
    relationshipMap.addEventListener('pointercancel',()=>{dragging=null;moved=false;render();});
    relationshipMap.addEventListener('pointerup',async ev=>{if(!dragging)return;const {id}=dragging,wasMoved=moved;dragging=null;moved=false;if(!state?.people?.[id])return;
      if(wasMoved){const q=point(ev),next=mapDrop(state.people[id],q.x,q.y,MAP567.cx,MAP567.max,MAP567.min);await mutate(s=>{s.people[id].closeness=closenessAt(q.x,q.y);s.people[id].mapAngleDeg=next.mapAngleDeg;});}
      selectedPersonId=id;render();});
    relationshipMap.addEventListener('keydown',async ev=>{const node=ev.target.closest?.('[data-person-node]');if(!node||!state?.people?.[node.dataset.personNode])return;
      if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();selectedPersonId=node.dataset.personNode;render();return;}
      if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(ev.key)){ev.preventDefault();const id=node.dataset.personNode,p=state.people[id],v=preference(p).closeness+(ev.key==='ArrowUp'||ev.key==='ArrowRight'?(ev.shiftKey?5:1):-(ev.shiftKey?5:1));
       await mutate(s=>{s.people[id].closeness=Math.max(0,Math.min(100,v));});selectedPersonId=id;render();app.querySelector(`[data-person-node="${id}"]`)?.focus?.();}
    });
  }
  const focusOverlay=app.querySelector('.rel567-overlay');if(focusOverlay){focusOverlay.addEventListener('keydown',ev=>{
    if(ev.key==='Escape'){ev.preventDefault();relationshipMapFocus=false;render();return;}
    if(ev.key==='Tab'){const controls=[...focusOverlay.querySelectorAll('button,input,select,textarea,[tabindex]')].filter(el=>!el.disabled&&el.getAttribute('tabindex')!=='-1');if(!controls.length)return;
      const first=controls[0],last=controls[controls.length-1];if(ev.shiftKey&&(document.activeElement===first||document.activeElement===focusOverlay)){ev.preventDefault();last.focus();}
      else if(!ev.shiftKey&&document.activeElement===last){ev.preventDefault();first.focus();}
    }
   });}

  const contactForm=app.querySelector('#person-contact-form');if(contactForm)contactForm.onsubmit=async ev=>{
    ev.preventDefault();const id=contactForm.dataset.id;if(!state?.people?.[id])return;
    const fd=new FormData(contactForm),entry={id:crypto.randomUUID(),day:String(fd.get('day')||''),type:String(fd.get('type')||''),note:String(fd.get('note')||'').trim()};
    try {await mutate(s=>{s.people[id]=addContactEntry(s.people[id],entry,localDate()).person;});quickContactType='';toast('Bestätigter Kontakt im lokalen Tresor gespeichert.');}
    catch(ex){toast(ex.message,true);}
  };
  const reviewDaysForm=app.querySelector('#person-review-days-form');if(reviewDaysForm)reviewDaysForm.onsubmit=async ev=>{
    ev.preventDefault();const id=reviewDaysForm.dataset.id;if(!state?.people?.[id])return;
    try{await mutate(s=>{s.people[id]=updateContactReviewDays(s.people[id],new FormData(reviewDaysForm).get('days'));});toast('Kontaktwiedervorlage aktualisiert.');}
    catch(ex){toast(ex.message,true);}
  };
  const personNote=app.querySelector('#person-note-form');if(personNote)personNote.onsubmit=async ev=>{ev.preventDefault();const id=personNote.dataset.id, note=String(new FormData(personNote).get('note')||'');if(!state?.people?.[id])return;await mutate(s=>{s.people[id].note=note;});toast('Persönliche Notiz gespeichert.');};
  app.querySelectorAll('details.person-point').forEach(el=>{el.ontoggle=()=>{if(el.open)personOpenPointId=el.dataset.id;else if(personOpenPointId===el.dataset.id)personOpenPointId='';};});
  app.querySelectorAll('.person-point-form').forEach(form=>{form.onsubmit=async ev=>{
    ev.preventDefault();const id=form.dataset.id,kind=form.dataset.kind,intent=ev.submitter?.value||'save',note=String(new FormData(form).get('note')||'').trim();personOpenPointId=(intent==='done'||intent==='discussed')?'':id;
    if(kind==='task'){
      const original=state?.tasks?.[id];if(!original||original.archived||original.completed)return;
      if(state?.taskConflicts?.[id]){toast('Bitte zuerst den Aufgaben-Konflikt auflösen.',true);return;}
      if(note.length>3000){toast('Notiz darf höchstens 3.000 Zeichen haben.',true);return;}
      const next={...original,note,completed:intent==='done'?true:original.completed,updatedAt:stamp()};
      if(!validLocalTask(next)){toast('Aufgabe konnte nicht gespeichert werden.',true);return;}
      await mutate(s=>{s.tasks[id].note=note;if(intent==='done')s.tasks[id].completed=true;s.tasks[id].updatedAt=next.updatedAt;s.taskPending[id]=true;});
      toast(intent==='done'?'Aufgabe erledigt – Gesprächsnotiz gespeichert.':'Notiz zur Aufgabe gespeichert.');return;
    }
    if(kind==='inbox'){
      const original=state?.records?.[id];if(!original||original.deleted)return;
      if(note.length>10000){toast('Notiz darf höchstens 10.000 Zeichen haben.',true);return;}
      await mutate(s=>{const r=s.records[id];r.note=note;if(intent==='discussed')r.deleted=true;r.updatedAt=stamp();s.pending.push(makeMutation(r));});
      toast(intent==='discussed'?'Gesprächspunkt besprochen und archiviert.':'Gesprächsnotiz in Inbox gespeichert.');
    }
  };});
  const personAgenda=app.querySelector('#person-agenda-form');if(personAgenda)personAgenda.onsubmit=async ev=>{ev.preventDefault();const person=state?.people?.[personAgenda.dataset.id];if(!person)return;const title=String(new FormData(personAgenda).get('title')||'').trim();if(!title||title.length>180){toast('Bitte einen kurzen Agendapunkt eingeben.',true);return;}const t={id:crypto.randomUUID(),title,note:'Gesprächsthema mit '+person.name,category:'Allgemein',workflow:'next',completed:false,archived:false,flagged:false,plannedDate:null,dueDate:null,deferUntil:null,estimateMinutes:null,projectId:null,parentTaskId:null,sortOrder:0,tags:parseTags([person.tag]),contextTags:[],updatedAt:stamp()};await mutate(s=>{s.tasks[t.id]=t;s.taskPending[t.id]=true;rememberTag(s,person.tag);});toast('Agenda-Schritt als Next Action angelegt.');};
  const importField=app.querySelector('#encrypted-import');if(importField)importField.onchange=async ev=>{
    try {const obj=JSON.parse(await ev.target.files[0].text());await vault.importEncrypted(obj);hasVault=true;toast('Backup importiert. Jetzt mit der ursprünglichen Passphrase entsperren.');}
    catch(ex){toast(ex.message,true);}
  };
  app.querySelectorAll('#capture-form, #capture-modal-form').forEach(form=>form.onsubmit=async ev=>{
    ev.preventDefault();
    const submit=form.querySelector('[type=submit]');if(submit)submit.disabled=true;
    try {const data=new FormData(form);await addCapture(data.get('title'),data.get('note'));captureOverlayOpen=false;
      captureDraft={title:'',note:'',noteOpen:false};dashboardCaptureDraft='';captureSkipNextSnapshot=true;
      notice='Sicher in deiner Inbox gespeichert'+(authToken?' · Cloud-Abgleich vorgemerkt':' · nur auf diesem Gerät')+'.';error='';render();
    }catch(ex){if(submit)submit.disabled=false;toast(ex.message,true);}
  });
  const bulkDetails=app.querySelector('#capture-bulk-details');if(bulkDetails)bulkDetails.ontoggle=()=>{captureBulkOpen=bulkDetails.open;};
  const bulkForm=app.querySelector('#capture-bulk-form');if(bulkForm)bulkForm.onsubmit=ev=>{
    ev.preventDefault();const fd=new FormData(bulkForm);captureBulkRaw=String(fd.get('text')||'');captureBulkMode=String(fd.get('mode')||'lines');
    try {captureBulkPreview=capturePreview(captureBulkMode==='json'?parseAiCaptureJson(captureBulkRaw):parseCaptureLines(captureBulkRaw),Object.values(state.records||{}));
      if(!captureBulkPreview.length){toast('Keine Folgepunkte erkannt. Verwende Stichpunkte oder ausdrücklich bezeichnete Punkte.',true);return;}
      captureBulkOpen=true;render();}
    catch(ex){toast(ex.message,true);}
  };
  const bulkConfirm=app.querySelector('#capture-bulk-confirm');if(bulkConfirm)bulkConfirm.onsubmit=async ev=>{
    ev.preventDefault();const fd=new FormData(bulkConfirm),indices=fd.getAll('chosen').map(Number),selected=[];
    for(const i of indices){const base=captureBulkPreview?.[i];if(!base)continue;
      const title=String(fd.get('title-'+i)||'').trim(),kind=String(fd.get('kind-'+i)||'Ungeklärt');
      if(title.length<3||title.length>180||!CAPTURE_KINDS.includes(kind)){toast('Bitte Texte und Vorschlagsarten prüfen.',true);return;}
      selected.push({...base,title,kind});
    }
    if(!selected.length){toast('Bitte mindestens einen Vorschlag auswählen.',true);return;}
    let added=0,skipped=0;
    try {await mutate(s=>{
      const existing=new Set(Object.values(s.records||{}).filter(r=>!r.deleted).map(r=>r.title.trim().toLocaleLowerCase('de').normalize('NFKC').replace(/\s+/g,' ')));
      for(const item of selected){const key=item.title.trim().toLocaleLowerCase('de').normalize('NFKC').replace(/\s+/g,' ');
        if(existing.has(key)){skipped++;continue;}
        const rec=captureInboxRecord(item,{id:crypto.randomUUID(),updatedAt:stamp()});s.records[rec.id]=rec;s.pending.push(makeMutation(rec));s.history.push({type:'captured',at:rec.updatedAt,id:rec.id});
        for(const tag of rec.tags)rememberTag(s,tag);
        existing.add(key);added++;
      }
    });captureBulkPreview=null;captureBulkRaw='';captureBulkOpen=false;toast(`${added} Folgepunkte in Inbox gespeichert${skipped?' · '+skipped+' Dubletten ausgelassen':''}. Im Review einzeln klären.`);}
    catch(ex){toast(ex.message,true);}
  };
  const taskForm=app.querySelector('#task-create-form');if(taskForm)taskForm.onsubmit=async ev=>{
    ev.preventDefault();const fd=new FormData(taskForm);
    const t={id:crypto.randomUUID(),title:String(fd.get('title')||'').trim(),note:'',plannedDate:fd.get('plannedDate')||null,dueDate:fd.get('dueDate')||null,category:fd.get('category')||'Allgemein',completed:false,archived:false,workflow:fd.get('workflow')||'next',flagged:fd.has('flagged'),projectId:fd.get('projectId')||null,parentTaskId:fd.get('parentTaskId')||null,sortOrder:0,tags:parseTags(fd.get('tags')),deferUntil:fd.get('deferUntil')||null,contextTags:parseTags(fd.get('contextTags')),estimateMinutes:fd.get('estimateMinutes')?Number(fd.get('estimateMinutes')):null,progressTarget:fd.get('progressTarget')?Number(fd.get('progressTarget')):null,progressCurrent:0,updatedAt:stamp()};
    if(!validLocalTask(t)||!validTaskParent(state,t.id,t.projectId,t.parentTaskId)){toast('Aufgabenfelder bzw. Hierarchie prüfen.',true);return;}
    t.sortOrder=Math.min(1000000,100+Math.max(0,...taskChildren(state,t.projectId,t.parentTaskId).map(x=>x.sortOrder||0)));
    await mutate(s=>{prepareTasks(s);s.tasks[t.id]=t;s.taskPending[t.id]=true;for(const tag of [...t.tags,...t.contextTags])rememberTag(s,tag);});selectedTaskId=t.id;selectedProjectId=t.projectId;treeCreateKind='';treeCreateParent=null;treeTaskParent=null;toast('Aufgabe lokal gespeichert.');
  };
  const taskEditForm=app.querySelector('#task-edit-form');if(taskEditForm)taskEditForm.onsubmit=async ev=>{
    ev.preventDefault();const id=taskEditForm.dataset.id,fd=new FormData(taskEditForm);const existing=state.tasks[id];if(!existing)return;
    const t={...existing,title:String(fd.get('title')||'').trim(),note:String(fd.get('note')||'').trim(),plannedDate:fd.get('plannedDate')||null,dueDate:fd.get('dueDate')||null,category:fd.get('category')||'Allgemein',workflow:fd.get('workflow')||'next',flagged:fd.has('flagged'),projectId:fd.get('projectId')||null,parentTaskId:(fd.get('projectId')===existing.projectId?fd.get('parentTaskId')||null:null),tags:parseTags(fd.get('tags')),deferUntil:fd.get('deferUntil')||null,contextTags:parseTags(fd.get('contextTags')),estimateMinutes:fd.get('estimateMinutes')?Number(fd.get('estimateMinutes')):null,progressTarget:fd.get('progressTarget')?Number(fd.get('progressTarget')):null,progressCurrent:fd.get('progressTarget')?Number(fd.get('progressCurrent')||0):0,updatedAt:stamp()};
    if(!validLocalTask(t)||!validTaskParent(state,id,t.projectId,t.parentTaskId)){toast('Aufgabenfelder bzw. Hierarchie prüfen.',true);return;}
    if(t.projectId!==existing.projectId&&Object.values(state.tasks).some(child=>!child.archived&&child.parentTaskId===id)){toast('Unteraufgaben zuerst einzeln verschieben, bevor du das Projekt dieser Aufgabe wechselst.',true);return;}
    await mutate(s=>{s.tasks[id]=t;s.taskPending[id]=true;for(const tag of [...t.tags,...t.contextTags])rememberTag(s,tag);});toast('Aufgabe aktualisiert.');
  };
  const lifeGoalForm=app.querySelector('#life-goal-form');if(lifeGoalForm)lifeGoalForm.onsubmit=async ev=>{
    ev.preventDefault();const fd=new FormData(lifeGoalForm),projectId=String(fd.get('projectId')||'');
    const goal={id:crypto.randomUUID(),title:String(fd.get('title')||'').trim(),outcome:String(fd.get('outcome')||'').trim(),area:String(fd.get('area')||'Allgemein'),lifeArea:String(fd.get('lifeArea')||''),status:'active',targetDate:String(fd.get('targetDate')||'')||null,projectIds:projectId?[projectId]:[]};
    if(!validateLifeGoal(goal)||projectId&&!state.projects?.[projectId]||lifeGoals(state).length>=40){toast('Zielangaben prüfen (maximal 40 Ziele).',true);return;}
    await mutate(s=>{s.lifeGoals??=[];s.lifeGoals.push(goal);});toast('Lebensziel im lokalen Vault gespeichert.');
  };
  for(const [id,check,normalize] of [['v22-day-minutes',v=>timeModes.includes(Number(v)),v=>Number(v)],['v22-day-energy',v=>energyModes.includes(v),v=>v],['v22-day-context',v=>v.length<=60,v=>v]]){
    const ctrl=app.querySelector('#'+id);if(ctrl)ctrl.onchange=async()=>{
      if(!check(ctrl.value))return;const key=id==='v22-day-minutes'?'dailyMinutes':id==='v22-day-energy'?'dailyEnergy':'dailyContext';
      await mutate(s=>{s.uiPreferences??={};s.uiPreferences[key]=normalize(ctrl.value);});
    };
  }
  for(const [selector,name,allowed] of [['#radar555-topic','topic',['all',...RADAR_TOPICS]],['#radar555-region','region',['all',...RADAR_REGIONS]],['#radar555-focus','focus',['all',...RADAR_FOCI]]]){
    const control=app.querySelector(selector);if(control)control.onchange=()=>{if(!allowed.includes(control.value))return;if(name==='topic')radarTopic=control.value;else if(name==='region')radarRegion=control.value;else radarFocus=control.value;render();};
  }
  const radarForm=app.querySelector('#radar555-form');if(radarForm)radarForm.onsubmit=async ev=>{
    ev.preventDefault();const v=new FormData(radarForm);
    try{const item=newConference({title:v.get('title'),source:v.get('source'),location:v.get('location'),region:v.get('region'),topics:[String(v.get('topic'))],deadline:v.get('deadline'),note:v.get('note')},'cfp-'+crypto.randomUUID());
      await mutate(s=>{s.conferenceRadar??=[];s.conferenceRadar.push(item);});toast('Call im lokalen Tresor vorgemerkt. Quelle und Frist bitte vor Einreichung prüfen.');
    }catch(ex){toast('Call nicht gespeichert: '+ex.message,true);}
  };
  const capacityForm=app.querySelector('#capacity-settings-form');if(capacityForm)capacityForm.onsubmit=async ev=>{
    ev.preventDefault();const fd=new FormData(capacityForm);
    const p=capacitySettings({startHour:Number(fd.get('startHour')),endHour:Number(fd.get('endHour')),bufferMinutes:Number(fd.get('bufferMinutes')),minSlotMinutes:Number(fd.get('minSlotMinutes')),weekends:fd.has('weekends'),availabilityTitles:String(fd.get('availabilityTitles')||'')});
    if(Number(fd.get('endHour'))<=Number(fd.get('startHour'))){toast('Ende muss nach dem Beginn liegen.',true);return;}
    await mutate(s=>{s.uiPreferences??={};s.uiPreferences.capacity=p;});toast('Arbeitsfenster lokal gespeichert. Keine Kalendertermine verändert.');
  };
  const exchangeForm=app.querySelector('#project-exchange-preview-form');if(exchangeForm)exchangeForm.onsubmit=async ev=>{
    ev.preventDefault();const fd=new FormData(exchangeForm);let raw=String(fd.get('json')||'').trim();const file=fd.get('file');
    try{
      if(file?.size){if(file.size>1024*1024)throw Error('Datei zu groß (max. 1 MB).');raw=await file.text();}
      if(!raw)throw Error('Bitte JSON-Datei wählen oder Text einfügen.');
      exchangePreview=parseProjectPlan(raw);exchangeBaseline={};for(const item of [...exchangePreview.projects,...exchangePreview.tasks]){const existing=item.id&&(state.projects?.[item.id]||state.tasks?.[item.id]);if(existing)exchangeBaseline[item.id]=JSON.stringify(existing);}exchangeRaw='';toast('Projektvorschau geprüft. Noch keine Daten verändert.');
    }catch(ex){exchangeRaw=raw.slice(0,1024*1024);toast('Importvorschau: '+ex.message,true);}
  };
  const exchangeCommit=app.querySelector('#project-exchange-commit');if(exchangeCommit)exchangeCommit.onsubmit=async ev=>{
    ev.preventDefault();if(!exchangePreview)return;
    const fd=new FormData(exchangeCommit),keys=fd.getAll('project').map(String),updateExisting=fd.has('updateExisting');
    if(!keys.length){toast('Bitte mindestens ein Projekt auswählen.',true);return;}
    const plan=exchangePreview;
    try{
      let result;
      await mutate(s=>{
        result=applyProjectPlan(s,plan,{selectedProjectKeys:keys,updateExisting,idFactory:()=>crypto.randomUUID(),baseline:exchangeBaseline});
        // Mutate only after the full plan passes validation; preserve other Vault sections.
        s.projects=result.state.projects;s.tasks=result.state.tasks;
        s.projectPending=result.state.projectPending;s.taskPending=result.state.taskPending;
        if(smartHubStage?.kind==='project')s.smartImportHistory=committedSmartImport(s.smartImportHistory,smartHubStage.entries,'project');markSuccessfulImport(s,'project');
      });
      if(smartHubStage?.kind==='project'){for(const e of smartHubStage.entries)e.duplicate=true;smartHubStage=null;}exchangePreview=null;exchangeBaseline=null;selectedTaskId=null;toast(`${result.projects} Projekte und ${result.tasks} Aufgaben übernommen. Bestehendes nur nach deiner Auswahl geändert.`);
    }catch(ex){toast('Import nicht durchgeführt: '+ex.message,true);}
  };
  const projectCreate=app.querySelector('#project-create-form');if(projectCreate)projectCreate.onsubmit=async ev=>{
    ev.preventDefault();const d=new FormData(projectCreate);const project={id:crypto.randomUUID(),title:String(d.get('title')||'').trim(),outcome:String(d.get('outcome')||'').trim(),category:d.get('category')||'Allgemein',status:'active',dueDate:null,reviewIntervalDays:Number(d.get('reviewIntervalDays')||7),reviewedAt:null,kind:d.get('kind')||'project',folderIcon:d.get('kind')==='folder'?'folder':null,isTemplate:false,projectType:d.get('projectType')||'parallel',parentId:d.get('parentId')||null,sortOrder:0};
    if(!validProject(project)||!validProjectParent(state,project.id,project.parentId)){toast('Projektangaben bzw. Ordnerhierarchie prüfen.',true);return;}
    project.sortOrder=Math.min(1000000,100+Math.max(0,...childProjects(state,project.parentId).map(x=>x.sortOrder||0)));
    await mutate(s=>{s.projects[project.id]=project;s.projectPending[project.id]=true;});selectedProjectId=project.id;treeCreateKind='';treeCreateParent=null;treeTaskParent=null;render();
  };
  const projectEdit=app.querySelector('#project-edit-form');if(projectEdit)projectEdit.onsubmit=async ev=>{
    ev.preventDefault();const id=projectEdit.dataset.id;const d=new FormData(projectEdit);const project={...state.projects[id],title:String(d.get('title')||'').trim(),outcome:String(d.get('outcome')||'').trim(),category:d.get('category')||'Allgemein',status:d.get('status')||'active',dueDate:d.get('dueDate')||null,reviewIntervalDays:Number(d.get('reviewIntervalDays')||7),kind:d.get('kind')||'project',folderIcon:d.get('kind')==='folder'?(d.get('folderIcon')||'folder'):null,isTemplate:d.has('isTemplate'),projectType:d.get('projectType')||'parallel',parentId:d.get('parentId')||null};
    if(!validProject(project)||!validProjectParent(state,id,project.parentId)){toast('Projektangaben bzw. Ordnerhierarchie prüfen.',true);return;}
    if(project.kind==='folder'&&state.projects[id].kind!=='folder'&&projectTasks(state,id).length){toast('Ein Projekt mit Aufgaben kann nicht in einen Ordner umgewandelt werden.',true);return;}
    await mutate(s=>{s.projects[id]=project;s.projectPending[id]=true;});toast('Projekt gespeichert.');
  };
  const agendaForm=app.querySelector('#agenda-note-form');if(agendaForm)agendaForm.onsubmit=async ev=>{
    ev.preventDefault();const d=new FormData(agendaForm);const t={id:crypto.randomUUID(),title:String(d.get('title')||'').trim(),note:'',category:'Meeting',plannedDate:null,dueDate:null,workflow:'next',flagged:false,projectId:null,tags:parseTags([d.get('tag')]),completed:false,archived:false};
    if(!validLocalTask(t)){toast('Agendapunkt prüfen.',true);return;}
    await mutate(s=>{s.tasks[t.id]=t;s.taskPending[t.id]=true;});toast('Agendapunkt für das Meeting angelegt.');
  };
  const dreamCreate=app.querySelector('#dream-create-form');if(dreamCreate)dreamCreate.onsubmit=async ev=>{
    ev.preventDefault();const data=new FormData(dreamCreate),title=String(data.get('title')||'').trim(),category=String(data.get('category')||'ideen');
    if(!title||title.length>1000||!DREAM_CATEGORIES.some(([key])=>key===category)){toast('Dreams-Eingabe prüfen.',true);return;}
    const id=crypto.randomUUID();await mutate(s=>{const r={id,title,note:'',tags:['dreams','dream-'+category],deleted:false,updatedAt:stamp()};s.records[id]=r;s.pending.push(makeMutation(r));s.history.push({type:'dream-captured',at:stamp(),id});});selectedDreamId=id;toast('Idee in Dreams gespeichert.');
  };
  const dreamEdit=app.querySelector('#dream-edit-form');if(dreamEdit)dreamEdit.onsubmit=async ev=>{
    ev.preventDefault();const id=dreamEdit.dataset.id,fd=new FormData(dreamEdit);const title=String(fd.get('title')||'').trim(),note=String(fd.get('note')||'').trim(),category=String(fd.get('category')||'ideen');
    if(!title||title.length>1000||note.length>10000||!DREAM_CATEGORIES.some(([key])=>key===category)){toast('Dreams-Felder prüfen.',true);return;}
    await mutate(s=>{const r=s.records[id];if(!r||r.deleted)return;r.title=title;r.note=note;r.tags=parseTags(['dreams','dream-'+category,...(r.tags||[]).filter(t=>t!=='dreams'&&!t.startsWith('dream-'))]);r.updatedAt=stamp();s.pending.push(makeMutation(r));});toast('Dream aktualisiert.');
  };
  const editForm=app.querySelector('#inbox-edit-form');if(editForm)editForm.onsubmit=async ev=>{
    ev.preventDefault();const id=editForm.dataset.id;const form=new FormData(editForm);
    const title=String(form.get('title')||'').trim(),note=String(form.get('note')||'').trim(),tags=parseTags(form.get('tags'));
    if(!title||title.length>1000||note.length>10000){toast('Bitte Titel und Notizlänge prüfen.',true);return;}
    const existing=state.records[id];if(!existing||existing.deleted)return;
    const intent=ev.submitter?.value||'save';
    if(intent==='promote'){
      try{
        const task=inboxTaskDraft(state,id,{title,note,tags,projectId:form.get('projectId'),workflow:form.get('workflow')},crypto.randomUUID(),stamp());
        await mutate(s=>{if(!s.records[id]||s.records[id].deleted)throw new Error('Inbox-Eintrag wurde bereits geklärt.');
          s.tasks[task.id]=task;s.taskPending[task.id]=true;
          s.records[id].deleted=true;s.records[id].updatedAt=stamp();s.pending.push(makeMutation(s.records[id]));
          for(const tag of task.tags)rememberTag(s,tag);
        });
        selectedInboxId=null;selectedTaskId=task.id;toast('Eintrag als Aufgabe übernommen und aus der Inbox entfernt.');
      }catch(ex){toast(ex.message,true);}
      return;
    }
    let savedTags;try{savedTags=setInboxFlag(tags,inboxFlagged(existing));}catch(ex){toast(ex.message,true);return;}
    if(existing.title===title&&(existing.note||'')===note&&JSON.stringify(existing.tags||[])===JSON.stringify(savedTags)){notice='Keine Änderungen.';render();return;}
    try{await mutate(s=>{const r=s.records[id];r.title=title;r.note=note;r.tags=savedTags;r.updatedAt=stamp();s.pending.push(makeMutation(r));});notice='Änderungen lokal gespeichert.';render();}
    catch(ex){toast(ex.message,true);}
  };
  const cfilter=app.querySelector('#context-filter');if(cfilter)cfilter.onchange=ev=>{contextFilter=ev.target.value;render();};
  const search=app.querySelector('#inbox-query');if(search)search.oninput=ev=>{
    const v=ev.target.value;const caret=ev.target.selectionStart??v.length;inboxQuery=v;render();
    const field=app.querySelector('#inbox-query');if(field){field.focus();try{field.setSelectionRange(caret,caret);}catch{}}
  };
  app.querySelectorAll('[data-recovery-filter]').forEach(el=>el.onchange=()=>{
    if(el.dataset.recoveryFilter==='minutes')recoveryIdeaMinutes=Number(el.value);
    if(el.dataset.recoveryFilter==='energy')recoveryIdeaEnergy=el.value;
    if(el.dataset.recoveryFilter==='range')recoveryIdeaRange=el.value;
    render();
  });
  const discoveryForm=app.querySelector('#discovery-import-form');if(discoveryForm)discoveryForm.onsubmit=async ev=>{ev.preventDefault();try{
    const raw=String(new FormData(discoveryForm).get('events')||'');const result=parseEventImport(raw,state?.discoveredEvents||[]);
    discoveryImportPreview=result;render();
   }catch(ex){toast('Import: '+ex.message,true);}};
  for(const key of ['health-day-details','health-device-details']){const el=app.querySelector('#'+key);if(el)el.ontoggle=()=>{if(key==='health-day-details')healthDetailsOpen=el.open;else healthDevicesOpen=el.open;};}
  app.querySelectorAll('[data-discovery-filter]').forEach(el=>el.onchange=()=>{if(el.dataset.discoveryFilter==='city')discoveryCity=el.value;else if(el.dataset.discoveryFilter==='area')discoveryArea=el.value;else discoveryCategory=el.value;render();});
  app.querySelectorAll('[data-discovery-category]').forEach(el=>el.onchange=()=>{discoveryCategories=toggleEventCategory(discoveryCategories,el.dataset.discoveryCategory,el.checked,EVENT_CATEGORIES);discoveryCategoriesOpen=true;render();});
  app.querySelectorAll('.discovery-art img').forEach(img=>{img.onerror=()=>img.remove();});
  const recoveryForm=app.querySelector('#recovery-idea-form');if(recoveryForm)recoveryForm.onsubmit=async ev=>{
    ev.preventDefault();const data=new FormData(recoveryForm);
    const i={id:'idea-'+crypto.randomUUID(),title:String(data.get('title')||'').trim(),emoji:String(data.get('emoji')||'🌿').trim()||'🌿',minutes:Number(data.get('minutes')),weather:String(data.get('weather')||'any'),energy:String(data.get('energy')||'medium'),range:String(data.get('range')||'near')};
    if(!validRecoveryIdea(i)){toast('Bitte Idee, Symbol, Dauer und Kategorien prüfen.',true);return;}
    await mutate(s=>{s.recoveryIdeas??=[];s.recoveryIdeas.push(i);});toast('Freizeitidee im lokalen Tresor gespeichert.');
  };
  const quoteForm=app.querySelector('#finance-quote-form');if(quoteForm)quoteForm.onsubmit=async ev=>{
    ev.preventDefault();if(busy)return;
    const fd=new FormData(quoteForm);const symbol=String(fd.get('symbol')||'');const key=String(fd.get('key')||'');
    quoteForm.reset();financeMarketQuote=null;
    try{const q=await fetchTwelveDataQuote(symbol,key);financeMarketQuote=q;toast('Letzter verfügbarer Kurs abgerufen (Quelle & Zeitpunkt beachten).');}
    catch(ex){toast('Kursabfrage: '+ex.message,true);}finally{render();}
  };
  const hubFileInput=app.querySelector('#smart49-files');
  async function addSmartFiles(files){
    if(smartHubBusy||!files?.length)return;
    smartHubBusy=true;smartHubNotice='Dateien werden lokal untersucht …';
    try{smartHubEntries=await inspectSmartFiles([...files],state?.smartImportHistory||[]);smartHubScanSource='dateien';
      smartHubNotice=`${smartHubEntries.length} Dateien erkannt. Prüfe die Zuordnung und öffne die Importvorschau.`;
    }catch(ex){smartHubNotice='Fehler bei der Dateiprüfung: '+ex.message;}
    finally{smartHubBusy=false;render();}
  }
  if(hubFileInput)hubFileInput.onchange=()=>addSmartFiles(hubFileInput.files);
  const hubDrop=app.querySelector('#smart49-drop');if(hubDrop){
    hubDrop.addEventListener('dragover',ev=>{ev.preventDefault();hubDrop.classList.add('is-dragover');});
    hubDrop.addEventListener('dragleave',()=>hubDrop.classList.remove('is-dragover'));
    hubDrop.addEventListener('drop',ev=>{ev.preventDefault();hubDrop.classList.remove('is-dragover');addSmartFiles(ev.dataTransfer?.files);});
  }
  app.querySelectorAll('[data-smart49-group]').forEach(select=>{select.onchange=()=>{
    const groups=smartImportGroups(smartHubEntries);const group=groups[Number(select.dataset.smart49Group)];
    if(!group||group.duplicate||!SMART_IMPORT_KINDS[select.value])return;
    for(const index of group.indexes){const entry=smartHubEntries[index];if(!entry||entry.duplicate)continue;
      entry.kind=select.value;entry.confidence='manual';entry.reason='Gemeinsame Zuordnung – Zielparser prüft das tatsächliche Dateiformat';}
    smartHubNotice=`${group.indexes.length} gleichartige Dateien gemeinsam zugeordnet. Import erst nach Vorschau und Bestätigung.`;
    render();
  };});
  app.querySelectorAll('[data-smart49-kind]').forEach(select=>{select.onchange=()=>{
    const entry=smartHubEntries[Number(select.dataset.smart49Kind)];if(!entry||entry.duplicate)return;
    entry.kind=select.value;entry.reason='Manuell gewählter Importtyp – Zielparser validiert den Inhalt';entry.confidence='manual';render();
  };});
  const financeInput=app.querySelector('#finance-files');if(financeInput)financeInput.onchange=async()=>{
    if(financeBusy||!financeInput.files?.length)return;
    financeBusy=true;financePreview=null;
    try{const files=[...financeInput.files];if(files.length>80)throw new Error('Bitte höchstens 80 Dateien gleichzeitig auswählen.');
      const items=[];for(const f of files){if(f.size>8_000_000)throw new Error('Eine Bankdatei ist größer als 8 MB.');const bytes=await f.arrayBuffer();let text;try{text=new TextDecoder('utf-8',{fatal:true}).decode(bytes);}catch{text=new TextDecoder('windows-1252').decode(bytes);}items.push({name:f.name,text});}
      financePreview=previewBankFiles(items,state?.financeTransactions||[],state?.financeRules||[],state?.financePrivateRules||[]);
      toast(`Bankimport: ${financePreview.rows.length} neue Buchungen · ${financePreview.duplicates} Duplikate · ${financePreview.review} zur Prüfung.`);
    }catch(e){toast('Bankimport: '+e.message,true);}finally{financeBusy=false;}
  };
   const autoKraken=app.querySelector('#finance-kraken-auto-sync');if(autoKraken)autoKraken.onchange=async()=>{
     const enabled=autoKraken.checked;
     await mutate(s=>{s.uiPreferences??={};s.uiPreferences.krakenAutoSync=enabled;});
     toast(enabled?'Automatische lokale Kraken-Aktualisierung aktiviert (maximal alle 12 Stunden).':'Automatische Kraken-Aktualisierung ausgeschaltet.');
     if(enabled)maybeAutoSyncKraken();
   };
  const krakenInput=app.querySelector('#finance-kraken-file');if(krakenInput)krakenInput.onchange=async()=>{
    const file=krakenInput.files?.[0];if(!file)return;
    try{
      if(file.size>12_000_000)throw Error('Kraken-Export zu groß (maximal 12 MB).');
      krakenPreview=validateKrakenSnapshot(JSON.parse(await file.text()));
      toast(`Kraken-API-Export erkannt: ${krakenPreview.ledgers.length} Ledger-Einträge, ${krakenPreview.trades.length} Trades. Bitte Vorschau bestätigen.`);render();
    }catch(e){krakenPreview=null;toast('Kraken-Import: '+e.message,true);render();}
  };
  const privateRulesInput=app.querySelector('#finance-private-rules-file');if(privateRulesInput)privateRulesInput.onchange=async()=>{
    try{const f=privateRulesInput.files?.[0];if(!f)return;if(f.size>200_000)throw Error('Private Regeldatei ist zu groß.');
      const incoming=validatePrivateFinancePack(JSON.parse(await f.text()),validCategory);if(!incoming.length)throw Error('Keine Regeln in der Datei.');
      if(!confirm(`${incoming.length} private Regeln in deinem lokalen Tresor speichern und nicht manuell bestätigte Buchungen neu bewerten?`))return;
      let changed=0;await mutate(s=>{s.financePrivateRules=incoming;s.financeTransactions=(s.financeTransactions||[]).map(t=>{
        if(t.sourceFileType==='flatex'||t.source==='user'||t.confidence==='confirmed'||t.source==='own-rule')return t;
        const proposed=classifyBankTransaction(t,s.financeRules||[],incoming);
        if(proposed.category!==t.category||proposed.flow!==t.flow||proposed.needsReview!==t.needsReview)changed++;
        return {...t,...proposed};
      });});financeReviewPage=0;financeLedgerPage=0;toast(`${incoming.length} private Regeln gespeichert; ${changed} Buchungen neu zugeordnet.`);
    }catch(e){toast('Private Regeln: '+e.message,true);}finally{render();}
  };
  const tripCreate=app.querySelector('#finance-trip-create');if(tripCreate)tripCreate.onsubmit=async ev=>{
    ev.preventDefault();const data=new FormData(tripCreate);
    try{const t=createFinanceTrip({id:`trip-${crypto.randomUUID()}`,name:data.get('name'),start:data.get('start'),end:data.get('end')});
      await mutate(s=>{s.financeTrips??=[];if(s.financeTrips.length>=100)throw new Error('Maximal 100 Reisen in diesem Tresor.');s.financeTrips.push(t);});
      financeTripSelected=t.id;financeTripPage=0;toast('Reise im verschlüsselten Tresor angelegt. Bitte Buchungen ausdrücklich zuordnen.');
    }catch(ex){toast(ex.message,true);}
  };
  const tripQuery=app.querySelector('#finance-trip-query');if(tripQuery)tripQuery.onchange=()=>{financeTripQuery=tripQuery.value.slice(0,100);financeTripPage=0;render();};
  const tripMode=app.querySelector('#finance-trip-mode');if(tripMode)tripMode.onchange=()=>{financeTripMode=tripMode.value==='all'?'all':'suggested';financeTripPage=0;render();};
  const merchantCategory=app.querySelector('#finance-merchant-category');if(merchantCategory)merchantCategory.onchange=()=>{financeMerchantCategory=merchantCategory.value;render();};
  const budgetMonthPicker=app.querySelector('#finance-budget-month');if(budgetMonthPicker)budgetMonthPicker.onchange=()=>{if(/^\d{4}-(0[1-9]|1[0-2])$/.test(budgetMonthPicker.value)){financeBudgetMonth=budgetMonthPicker.value;render();}};
  const budgetForm=app.querySelector('#finance-flex-budget-form');if(budgetForm)budgetForm.onsubmit=async ev=>{ev.preventDefault();const d=new FormData(budgetForm),limit=Number(d.get('limit'));
    try{if(!Number.isFinite(limit)||limit<=0||limit>1e9)throw Error('Bitte einen gültigen Budgetbetrag eingeben.');const entry={category:String(d.get('category')||''),group:String(d.get('group')||''),limitCents:Math.round(limit*100)};
      await mutate(s=>{s.financeFlexBudgets=putBudgetEntry(s.financeFlexBudgets||[],entry);});toast('Budget im lokalen Vault gespeichert.');}
    catch(ex){toast(ex.message,true);}
  };
  const savingsForm=app.querySelector('#finance-savings-goal-form');if(savingsForm)savingsForm.onsubmit=async ev=>{ev.preventDefault();const d=new FormData(savingsForm),target=Number(d.get('target')),saved=Number(d.get('saved'));
    try{if(!Number.isFinite(target)||target<=0||target>1e9||!Number.isFinite(saved)||saved<0||saved>1e9)throw Error('Ungültige Zielbeträge.');
      const goal=validateSavingsGoal({id:'saving-'+crypto.randomUUID(),title:String(d.get('title')||''),kind:String(d.get('kind')||''),targetCents:Math.round(target*100),savedCents:Math.round(saved*100),targetDay:String(d.get('targetDay')||''),updatedDay:new Date().toLocaleDateString('sv-SE')});
      await mutate(s=>{s.financeSavingsGoals=putSavingsGoal(s.financeSavingsGoals||[],goal);});toast('Sparziel im lokalen Vault angelegt.');}
    catch(ex){toast(ex.message,true);}
  };
  app.querySelectorAll('form[data-finance-goal-update]').forEach(form=>form.onsubmit=async ev=>{ev.preventDefault();const id=form.dataset.financeGoalUpdate,value=Number(new FormData(form).get('saved'));
    try{if(!Number.isFinite(value)||value<0||value>1e9)throw Error('Ungültiger EUR-Wert.');await mutate(s=>{const old=(s.financeSavingsGoals||[]).find(g=>g.id===id);if(!old)throw Error('Ziel nicht mehr vorhanden.');s.financeSavingsGoals=putSavingsGoal(s.financeSavingsGoals,{...old,savedCents:Math.round(value*100),updatedDay:new Date().toLocaleDateString('sv-SE')});});toast('Bestätigter Fortschritt gespeichert.');}catch(ex){toast(ex.message,true);}
  });
  const flatexHistoryForm=app.querySelector('#finance-flatex-chart-form');if(flatexHistoryForm)flatexHistoryForm.onsubmit=async ev=>{
    ev.preventDefault();if(flatexChartBusy)return;
    const data=new FormData(flatexHistoryForm),ticker=String(data.get('symbol')||''),key=String(data.get('key')||'');
    const isin=flatexChartIsin,period=flatexChartPeriod;
    // Clear password in the form before any page rerender; no key enters Compass state or Vault.
    const password=flatexHistoryForm.querySelector('[name="key"]');if(password)password.value='';
    flatexChartBusy=true;flatexChartError='';flatexChartData=null;flatexChartTicker=ticker;render();
    try{const out=await fetchFlatexMarketHistory(ticker,key,period);if(flatexChartIsin===isin&&flatexChartPeriod===period)flatexChartData=out;}
    catch(e){if(flatexChartIsin===isin&&flatexChartPeriod===period)flatexChartError=e.message||'Kursdienst nicht verfügbar.';}
    finally{if(flatexChartIsin===isin&&flatexChartPeriod===period){flatexChartBusy=false;render();}}
  };
  const flatexSortSelector=app.querySelector('#finance-flatex-positions-sort');if(flatexSortSelector)flatexSortSelector.onchange=()=>{flatexPositionSort=flatexSortSelector.value;render();};
  const flatexPositionsFile=app.querySelector('#finance-flatex-positions-file');if(flatexPositionsFile)flatexPositionsFile.onchange=async()=>{
    const file=flatexPositionsFile.files?.[0];if(!file)return;
    try{
      if(file.size>1000000)throw Error('Depotdatei zu groß.');
      const snap=parseFlatexPositionsCsv(await file.text());
      if(!confirm(`flatex-Momentaufnahme vom ${snap.day} mit ${snap.positions.length} Zeilen lokal übernehmen? Eine gleich datierte Aufnahme wird ersetzt, nicht doppelt angelegt.`))return;
      await mutate(s=>{s.financeFlatexSnapshots=putFlatexSnapshot(s.financeFlatexSnapshots||[],snap);});
      toast('flatex-Bestandsübersicht lokal im verschlüsselten Vault gespeichert.');
    }catch(ex){toast(ex.message,true);}
  };
  const holdingForm=app.querySelector('#finance-holding-add');if(holdingForm)holdingForm.onsubmit=async ev=>{
    ev.preventDefault();const d=new FormData(holdingForm),price=Number(d.get('price'));
    if(!Number.isFinite(price)||price<0||price>1e9){toast('Bitte gültigen EUR-Kurs eingeben.',true);return;}
    const entry={day:String(d.get('day')||''),name:String(d.get('name')||''),symbol:String(d.get('symbol')||''),kind:String(d.get('kind')||''),quantity:String(d.get('quantity')||''),priceCents:Math.round(price*100)};
    try{await mutate(s=>{s.financeHoldings=addHoldingSnapshot(s.financeHoldings||[],entry);});toast('Wertpapierposition lokal im Vault gespeichert.');}
    catch(ex){toast(ex.message,true);}
  };
  const planningForm=app.querySelector('#finance-wealth-plan-form');if(planningForm)planningForm.onsubmit=async ev=>{
    ev.preventDefault();const fd=new FormData(planningForm);
    const cents=name=>{const v=Number(fd.get(name));if(!Number.isFinite(v)||v<0||v>1e6)throw Error('Ungültiger EUR-Monatswert.');return Math.round(v*100);};
    try{const plan=validateWealthPlan({monthlyLivingCents:cents('living'),monthlyPassiveCents:cents('passive'),monthlyContributionCents:cents('contribution'),annualReturnBps:Math.round(Number(fd.get('return'))*100),annualInflationBps:Math.round(Number(fd.get('inflation'))*100),horizonYears:Number(fd.get('horizon'))});
      await mutate(s=>{s.financeWealthPlan=plan;});toast('Planungsannahmen im verschlüsselten Vault gespeichert.');
    }catch(ex){toast(ex.message,true);}
  };
  const wealthGoalForm=app.querySelector('#finance-wealth-goal-form');if(wealthGoalForm)wealthGoalForm.onsubmit=async ev=>{
    ev.preventDefault();const fd=new FormData(wealthGoalForm),target=Number(fd.get('target'));
    if(!Number.isFinite(target)||target<=0||target>1e9){toast('Bitte gültigen Zielbetrag eingeben.',true);return;}
    const goal={id:'goal-'+crypto.randomUUID(),label:String(fd.get('label')||''),kind:String(fd.get('kind')||''),targetCents:Math.round(target*100),targetDay:String(fd.get('day')||'')};
    try{await mutate(s=>{s.financeWealthGoals=addWealthGoal(s.financeWealthGoals||[],goal);});toast('Vermögensziel im verschlüsselten Vault gespeichert.');}
    catch(ex){toast(ex.message,true);}
  };
  const wealthForm=app.querySelector('#finance-wealth-add');if(wealthForm)wealthForm.onsubmit=async ev=>{
    ev.preventDefault();const d=new FormData(wealthForm),amount=Number(d.get('amount'));
    if(!Number.isFinite(amount)||amount<0||amount>1e9){toast('Bitte gültigen EUR-Betrag angeben.',true);return;}
    const entry={type:String(d.get('type')||''),label:String(d.get('label')||''),day:String(d.get('day')||''),cents:Math.round(amount*100)};
    try{await mutate(s=>{s.financeWealthSnapshots=addWealthSnapshot(s.financeWealthSnapshots||[],entry);});toast('Bewertungsstand im lokalen Vault gespeichert.');}
    catch(ex){toast(ex.message,true);}
  };
  const merchantForm=app.querySelector('#finance-merchant-bulk-form');
  if(merchantForm)merchantForm.onsubmit=async ev=>{
    ev.preventDefault();const data=new FormData(merchantForm);
    const chosen=data.getAll('transaction').map(String);
    const clearAlias=ev.submitter?.value==='yes';
    if(!chosen.length)return toast('Bitte mindestens eine Buchung auswählen.',true);
    const displayName=String(data.get('displayName')||'').trim(),category=String(data.get('category')||'');
    try{let count=0;await mutate(s=>{const updated=financeMerchantEdit(s.financeTransactions||[],chosen,{displayName,category,clearAlias});s.financeTransactions=updated.rows;count=updated.changed;});
      financeMerchantSelected=clearAlias?'':displayName;
      toast(`${count} Buchung(en) geändert. Das Sankey wurde neu zusammengefasst.`);
    }catch(ex){toast(ex.message,true);}
  };
  const overviewSankey=app.querySelector('#finance-overview-sankey');if(overviewSankey)overviewSankey.addEventListener('toggle',()=>{if(overviewSankey.isConnected)financeOverviewSankeyOpen=overviewSankey.open;});
  const deepFocus=app.querySelector('#finance-sankey-focus');if(deepFocus)deepFocus.onchange=()=>{financeSankeyFocus=deepFocus.value;render();};
   const paceCompareEl=app.querySelector('#finance-pace-compare');if(paceCompareEl)paceCompareEl.onchange=()=>{financePaceCompare=paceCompareEl.value==='average3'?'average3':'previous';render();};
  const finAccount=app.querySelector('#finance-account');if(finAccount)finAccount.onchange=()=>{financeAccount=finAccount.value;financeReviewPage=0;financeLedgerPage=0;render();};
  app.querySelectorAll('[data-finance-cost-class]').forEach(select=>select.onchange=async()=>{const key=select.dataset.financeCostClass,value=select.value;if(!key)return;try{const {checkedCostClass}=await import('./finance-essentials-v43.js');checkedCostClass(key,value);await mutate(s=>{s.financeCostClasses??={};s.financeCostClasses[key]=value;});toast('Kostenart gespeichert.');}catch(ex){toast(ex.message,true);}render();});
  const finPeriod=app.querySelector('#finance-period');if(finPeriod)finPeriod.onchange=()=>{financePeriod=finPeriod.value;financeReviewPage=0;financeLedgerPage=0;render();};
  const scenarioSelector=app.querySelector('#finance-forecast-scenario');if(scenarioSelector)scenarioSelector.onchange=()=>{financeForecastScenario=scenarioSelector.value;render();};
  const cashflowSettings=app.querySelector('#finance-560-settings');if(cashflowSettings)cashflowSettings.onsubmit=async ev=>{
    ev.preventDefault();const fd=new FormData(cashflowSettings);
    try{
      const openingRaw=String(fd.get('opening')||'').trim();const opening=openingRaw===''?null:Math.round(Number(openingRaw)*100);
      const buffer=Math.round(Number(fd.get('buffer'))*100),asOf=String(fd.get('asOf')||'');
      if(openingRaw!==''&&!/^\d+(?:\.\d{1,2})?$/.test(openingRaw))throw Error('Gültigen verfügbaren Anfangsbestand in EUR eingeben.');
      if(!/^\d+(?:\.\d{1,2})?$/.test(String(fd.get('buffer')||'')))throw Error('Gültigen Sicherheitspuffer in EUR eingeben.');
      const settings=validateCashflowSettings({openingCents:opening,bufferCents:buffer,asOf},localDate());
      await mutate(s=>{s.financeCashflowSettings=settings;});toast('Anfangsbestand und Puffer verschlüsselt gespeichert.');
    }catch(ex){toast(ex.message,true);}
  };
  const whatIfForm=app.querySelector('#finance-560-what-if');if(whatIfForm){
    whatIfForm.querySelectorAll('input').forEach(input=>input.addEventListener('input',()=>{const fd=new FormData(whatIfForm);financeWhatIfDraft={label:String(fd.get('label')||''),amount:String(fd.get('amount')||''),day:String(fd.get('day')||'')};}));
    whatIfForm.onsubmit=ev=>{
    ev.preventDefault();const fd=new FormData(whatIfForm),value=String(fd.get('amount')||''),day=String(fd.get('day')||''),label=String(fd.get('label')||'').trim();
    const amount=Math.round(Number(value)*100);
    if(!/^\d+(?:\.\d{1,2})?$/.test(value)||amount<=0||amount>100_000_000_00||!cashflowDateOK(day)||day<localDate()||day>=cashflowMonth(localDate(),12)+'-01'||!label||label.length>100){toast('Betrag, Beschreibung und Datum innerhalb der nächsten 12 Monate prüfen.',true);return;}
    financeWhatIf={label,day,cents:amount};financeWhatIfDraft=null;render();
    };
  }
  const cashflowEventForm=app.querySelector('#finance-560-event');if(cashflowEventForm)cashflowEventForm.onsubmit=async ev=>{
    ev.preventDefault();const fd=new FormData(cashflowEventForm),value=String(fd.get('amount')||'');
    if(!/^\d+(?:\.\d{1,2})?$/.test(value)){toast('Ungültiger EUR-Betrag.',true);return;}
    try{
      const event=validatedPlanEvent({id:'plan-'+crypto.randomUUID(),kind:String(fd.get('kind')),day:String(fd.get('day')),label:String(fd.get('label')||''),amountCents:Math.round(Number(value)*100)});
      if(event.day<localDate()||event.day>=cashflowMonth(localDate(),12)+'-01')throw Error('Nur Planposten der nächsten 12 Monate übernehmen.');
      await mutate(s=>{s.financePlannedCashflows??=[];if(s.financePlannedCashflows.length>=200)throw Error('Maximal 200 geplante Zahlungen.');s.financePlannedCashflows.push(event);});toast('Einmalige geplante Zahlung im verschlüsselten Vault erfasst.');
    }catch(ex){toast(ex.message,true);}
  };

  const finSearch=app.querySelector('#finance-ledger-query');if(finSearch)finSearch.onchange=()=>{financeLedgerQuery=finSearch.value.slice(0,100);financeLedgerPage=0;render();};
  const finFilter=app.querySelector('#finance-ledger-filter');if(finFilter)finFilter.onchange=()=>{financeLedgerFilter=finFilter.value;financeLedgerPage=0;render();};
  app.querySelectorAll('form[data-finance-edit]').forEach(form=>form.onsubmit=async ev=>{ev.preventDefault();const id=form.dataset.financeEdit;const data=new FormData(form),category=String(data.get('category')||''),flow=String(data.get('flow')||'');if(!validCategory(category)||category==='Prüfen / Noch ungeklärt')return toast('Bitte eine konkrete Kategorie auswählen.',true);try{let affected=0;const remember=data.get('remember')==='yes';
    await mutate(s=>{s.financeTransactions??=[];s.financeRules??=[];const i=s.financeTransactions.findIndex(t=>t.id===id);if(i<0)throw Error('Buchung nicht mehr vorhanden.');
      const old=s.financeTransactions[i],key=merchantKey(old.merchant);const rule=remember&&safeMerchantRule(old.merchant);const alias=String(data.get('merchantDisplayName')||'').normalize('NFKC').replace(/\s+/g,' ').trim();if(alias.length>90)throw Error('Anzeigename zu lang.');
      if(rule){for(let j=0;j<s.financeTransactions.length;j++){const t=s.financeTransactions[j];if(j===i||(merchantKey(t.merchant)===key&&(t.amountCents>0)===(old.amountCents>0)&&t.source!=='user'&&t.confidence!=='confirmed')){
        s.financeTransactions[j]=categorizeTransaction(j===i?{...t,merchantDisplayName:alias||undefined}:t,category,flow);affected++;}}}
      else{s.financeTransactions[i]=categorizeTransaction({...old,merchantDisplayName:alias||undefined},category,flow);affected++;}
      if(rule){s.financeRules=s.financeRules.filter(r=>r.merchantKey!==key);s.financeRules.push({merchantKey:key,category,flow});}
    });toast(`${affected} Buchung(en) bestätigt oder korrigiert${remember?' · Händlerregel gespeichert':''}.`);
  }catch(e){toast(e.message,true);}});
  for(const [id,set] of [['explore-x',v=>exploreX=v],['explore-y',v=>exploreY=v],['explore-lag',v=>exploreLag=Number(v)]]){
    const select=app.querySelector('#'+id);if(select)select.onchange=()=>{set(select.value);render();};
  }
  app.querySelectorAll('form[data-finance-confirm]').forEach(form=>form.onsubmit=async ev=>{
    ev.preventDefault();const id=form.dataset.financeConfirm,old=(state.financeTransactions||[]).find(t=>t.id===id);if(!old||!old.needsReview)return;
    const fd=new FormData(form),category=String(fd.get('category')||''),flow=String(fd.get('flow')||''),remember=fd.get('remember')==='yes',applyAll=fd.get('applyAll')==='yes';
    if(!validCategory(category)||category==='Prüfen / Noch ungeklärt')return toast('Bitte eine konkrete Kategorie auswählen.',true);
    try{let approved=0;await mutate(s=>{s.financeTransactions??=[];s.financeRules??=[];
      const key=merchantKey(old.merchant);
      const same=t=>merchantKey(t.merchant)===key&&(t.amountCents>0)===(old.amountCents>0)&&t.flow===old.flow;
      for(let i=0;i<s.financeTransactions.length;i++){
        const t=s.financeTransactions[i];if(!t.needsReview||!(t.id===id||(applyAll&&same(t))))continue;
        s.financeTransactions[i]=categorizeTransaction(t,category,flow);approved++;
      }
      if(remember&&key&&safeMerchantRule(old.merchant)){s.financeRules=s.financeRules.filter(r=>r.merchantKey!==key);s.financeRules.push({merchantKey:key,category,flow});}
    });const count=financeReviewGroups(state.financeTransactions).length;
      financeReviewPage=Math.min(financeReviewPage,Math.max(0,Math.ceil(count/15)-1));toast(`${approved} Buchung(en) bestätigt`+(remember?' · Regel für künftige Buchungen gespeichert':'')+'.');
    }catch(e){toast(e.message,true);}
  });
  const healthUpload=app.querySelector('#health-import-input');
  if(healthUpload)healthUpload.onchange=async()=>{
    if(!healthUpload.files?.length||healthFileReading)return;
    healthFileReading=true;healthFilePreview=null;
    try{const preview=await inspectHealthFiles([...healthUpload.files]);
      if(!preview.processed)throw Error(preview.errors.join('\n')||'Keine unterstützten Dateien.');
      healthFilePreview=preview;toast(`Importvorschau: ${preview.fitdays.length} Fitdays, ${preview.garminNights.length} Nächte, ${(preview.garminWellness||[]).length} Stress-/Energiewerte.`);
    }catch(ex){toast('Import konnte nicht gelesen werden: '+ex.message,true);}
    finally{healthFileReading=false;}
  };
  const selectedNight=app.querySelector('#health-night-select');if(selectedNight)selectedNight.onchange=()=>{selectedGarminNight=selectedNight.value;render();};
  const placesInput=app.querySelector('#places-import-input');if(placesInput)placesInput.onchange=async()=>{
    if(!placesInput.files?.length||placesImportBusy)return;
    placesImportBusy=true;placesPreview=null;
    try{placesPreview=await inspectTimelineFiles([...placesInput.files]);toast(`${placesPreview.visits.length} Standort-Aufenthalte erkannt. Vorschau prüfen.`);}
    catch(ex){toast('Timeline-Import: '+ex.message,true);}
    finally{placesImportBusy=false;render();}
  };
  const placeForm=app.querySelector('#place-label-form');if(placeForm)placeForm.onsubmit=async ev=>{
    ev.preventDefault();const key=placeForm.dataset.key,title=String(new FormData(placeForm).get('name')||'').trim();
    if(title.length>100)return toast('Ortsname zu lang.',true);
    await mutate(s=>{s.placesLabels??={};if(title)s.placesLabels[key]=title;else delete s.placesLabels[key];});toast('Ortsbezeichnung lokal gespeichert.');
  };
  const placeManual=app.querySelector('#places-manual-form');if(placeManual)placeManual.onsubmit=async ev=>{
    ev.preventDefault();try{const fd=new FormData(placeManual);const row=manualPlaceVisit(Object.fromEntries(fd.entries()));
      await mutate(s=>{const m=mergePlaces(s.placesVisits||[],[row]);s.placesVisits=m.visits;});
      selectedPlaceKey='';toast('Aufenthalt im lokalen Tresor gespeichert.');
    }catch(ex){toast(ex.message,true);}
  };
  const calmHealthSelect=app.querySelector('#calm-health-view');if(calmHealthSelect)calmHealthSelect.onchange=()=>{if(['sleep','energy','stress','body'].includes(calmHealthSelect.value)){insightTab=calmHealthSelect.value;render();}};
  const workFile=app.querySelector('#work553-file');if(workFile)workFile.onchange=async()=>{
  if(!workFile.files?.length)return;
  // A manual replacement must not register a previously staged Smart Hub file.
  if(smartHubStage?.kind==='worktime')smartHubStage=null;
  try{workPreview=await inspectWorktimeFile(workFile.files[0],{today:localDate(),nowMinutes:new Date().getHours()*60+new Date().getMinutes()});toast(`${workPreview.days.length} Arbeitszeittage erkannt. Bitte Vorschau prüfen und übernehmen.`);}
  catch(ex){workPreview=null;toast(`Excel-Import: ${ex.message}`,true);}
 };
 const workVacationForm=app.querySelector('#work553-vacation-form');if(workVacationForm)workVacationForm.onsubmit=async ev=>{
  ev.preventDefault();const f=new FormData(workVacationForm),h=Number(f.get('balanceHours')),asOf=String(f.get('asOf')||'');
  if(!Number.isFinite(h)||h<0||h>10000||!/^(20\d{2})-(\d{2})-(\d{2})$/.test(asOf)){toast('Bitte gültigen Urlaubssaldo und Stichtag eingeben.',true);return;}
  await mutate(s=>{s.workTime={...(s.workTime||{}),vacation:{balanceHours:h,asOf,hoursPerDay:8}};});toast('Urlaubsguthaben als Stichtagswert gespeichert.');
 };
 const workThresholdEl=app.querySelector('#work553-threshold');if(workThresholdEl)workThresholdEl.onchange=()=>{workThreshold=Number(workThresholdEl.value)||45;render();};
 const insightSelect=app.querySelector('#insights-night-select');if(insightSelect)insightSelect.onchange=()=>{insightNight=insightSelect.value;render();};
  const wellnessSelect=app.querySelector('#insights-wellness-select');if(wellnessSelect)wellnessSelect.onchange=()=>{insightWellnessDay=wellnessSelect.value;render();};
  const taskMoveForm=app.querySelector('#tree-move-task-form');if(taskMoveForm)taskMoveForm.onsubmit=async ev=>{
    ev.preventDefault();const taskId=taskMoveForm.dataset.id,to=String(new FormData(taskMoveForm).get('target')||'');const [type,targetId]=to.split(':');
    if(!['project','task'].includes(type)||!targetId)return;
    try{await mutate(s=>moveTaskHierarchy(s,taskId,type,targetId,'inside'));selectedProjectId=state.tasks[taskId].projectId;toast('Aufgabe mit Unteraufgaben verschoben.');}catch(ex){toast(ex.message,true);}
  };
  let dragData=null;
  app.querySelectorAll('.tree-drag-handle[draggable="true"]').forEach(el=>el.ondragstart=ev=>{
    dragData={type:el.dataset.dragType,id:el.dataset.dragId};ev.dataTransfer.effectAllowed='move';ev.dataTransfer.setData('text/plain',dragData.type+':'+dragData.id);
  });
  app.querySelectorAll('.tree-drop-target,.tree-root-drop').forEach(el=>{
    el.ondragover=ev=>{if(!dragData)return;
      const targetType=el.dataset.dropType;
      if(dragData.type==='project'&&!['project','project-root'].includes(targetType)||dragData.type==='task'&&!['project','task'].includes(targetType))return;
      ev.preventDefault();ev.dataTransfer.dropEffect='move';el.classList.add('tree-drop-hover');};
    el.ondragleave=ev=>{if(!el.contains(ev.relatedTarget))el.classList.remove('tree-drop-hover');};
    el.ondrop=async ev=>{ev.preventDefault();el.classList.remove('tree-drop-hover');const payload=dragData;dragData=null;if(!payload)return;
      const targetType=el.dataset.dropType,targetId=el.dataset.dropId||null,rect=el.getBoundingClientRect(),ratio=(ev.clientY-rect.top)/(rect.height||1);
      const where=targetType==='project-root'||payload.type==='task'&&targetType==='project'?'inside':ratio<0.23?'before':ratio>0.77?'after':'inside';
      try{if(payload.type==='project')await mutate(s=>moveProjectHierarchy(s,payload.id,targetId,where));
        else await mutate(s=>moveTaskHierarchy(s,payload.id,targetType,targetId,where));
        if(payload.type==='project')selectedProjectId=payload.id;
        else {selectedProjectId=state.tasks[payload.id].projectId;selectedTaskId=payload.id;}
      }catch(ex){toast('Verschieben: '+ex.message,true);}
    };
  });
  // Drag-and-drop is attached to handles only: clicking the row still opens the inspector.
  let draggedInboxId='';
  // Next Actions: personal display order is a device-local preference, never project sortOrder.
  let draggedNextId='';
  const nextFullList=()=>nextActions(state);
  app.querySelectorAll('[data-next-drag]').forEach(handle=>{
    handle.addEventListener('dragstart',ev=>{
      draggedNextId=handle.dataset.nextDrag;
      ev.dataTransfer.effectAllowed='move';ev.dataTransfer.setData('text/plain',draggedNextId);
      handle.closest('[data-next-row]')?.classList.add('next38-dragging');
    });
    handle.addEventListener('dragend',()=>{
      draggedNextId='';app.querySelectorAll('.next38-dragging,.next38-over').forEach(el=>el.classList.remove('next38-dragging','next38-over'));
    });
  });
  app.querySelectorAll('[data-next-row]').forEach(row=>{
    row.addEventListener('dragover',ev=>{
      if(!draggedNextId||draggedNextId===row.dataset.nextRow)return;
      ev.preventDefault();ev.dataTransfer.dropEffect='move';row.classList.add('next38-over');
    });
    row.addEventListener('dragleave',ev=>{if(!row.contains(ev.relatedTarget))row.classList.remove('next38-over');});
    row.addEventListener('drop',async ev=>{
      row.classList.remove('next38-over');
      if(!draggedNextId||draggedNextId===row.dataset.nextRow)return;
      ev.preventDefault();
      const rect=row.getBoundingClientRect(),after=ev.clientY>rect.top+rect.height/2;
      const updated=inboxMove(state?.uiPreferences?.nextActionManualOrder||[],nextFullList(),draggedNextId,row.dataset.nextRow,after);
      draggedNextId='';
      if(updated)try{await mutate(s=>{s.uiPreferences??={};s.uiPreferences.nextActionManualOrder=updated;});}catch(ex){toast(ex.message,true);}
    });
  });
  app.querySelectorAll('[data-inbox-drag]').forEach(handle=>{
    handle.addEventListener('dragstart',ev=>{
      if(inboxQuery.trim()){ev.preventDefault();return;}
      draggedInboxId=handle.dataset.inboxDrag;
      ev.dataTransfer.effectAllowed='move';ev.dataTransfer.setData('text/plain',draggedInboxId);
      handle.closest('[data-inbox-row]')?.classList.add('inbox-dragging');
    });
    handle.addEventListener('dragend',()=>{
      draggedInboxId='';app.querySelectorAll('.inbox-dragging,.inbox-drag-over').forEach(el=>el.classList.remove('inbox-dragging','inbox-drag-over'));
    });
  });
  app.querySelectorAll('[data-inbox-row]').forEach(row=>{
    row.addEventListener('dragover',ev=>{
      if(!draggedInboxId||inboxQuery.trim()||draggedInboxId===row.dataset.inboxRow)return;
      ev.preventDefault();ev.dataTransfer.dropEffect='move';row.classList.add('inbox-drag-over');
    });
    row.addEventListener('dragleave',ev=>{if(!row.contains(ev.relatedTarget))row.classList.remove('inbox-drag-over');});
    row.addEventListener('drop',async ev=>{
      row.classList.remove('inbox-drag-over');
      if(!draggedInboxId||inboxQuery.trim()||draggedInboxId===row.dataset.inboxRow)return;
      ev.preventDefault();
      const box=row.getBoundingClientRect(),after=ev.clientY>box.top+box.height/2;
      const next=inboxMove(state?.uiPreferences?.inboxManualOrder||[],rows(),draggedInboxId,row.dataset.inboxRow,after);
      draggedInboxId='';
      if(next)try{await mutate(s=>{s.uiPreferences??={};s.uiPreferences.inboxManualOrder=next;});}catch(ex){toast(ex.message,true);}
    });
  });
  app.querySelectorAll('.v559-rename-input').forEach(field=>field.onkeydown=ev=>{
    const id=field.closest('[data-task-id]')?.dataset.taskId;
    if(ev.key==='Enter'){ev.preventDefault();if(id)runAction('task-rename-save',id);}
    if(ev.key==='Escape'){ev.preventDefault();inlineEditingTaskId=null;render();}
  });
  const feelingNote=app.querySelector('#fw65-note');if(feelingNote)feelingNote.oninput=()=>{feelingDraft.note=feelingNote.value;};
  app.querySelectorAll('[data-feeling-intensity]').forEach(el=>el.oninput=()=>{
    try{feelingDraft=intensityFor(feelingDraft,el.dataset.feelingIntensity,Number(el.value));
      const card=el.closest('.fw65-intensity'),def=FEELINGS.find(x=>x.id===el.dataset.feelingIntensity);
      if(card){const name=card.querySelector('.fw65-word');if(name)name.textContent=feelingWord(def.id,Number(el.value));const value=card.querySelector('.fw65-intensity-head strong');if(value)value.textContent=el.value+'/10';card.querySelectorAll('.fw65-words span').forEach((node,i)=>node.classList.toggle('active',i===Math.floor((el.value-1)/2)));}
    }catch{}
  });
  app.querySelectorAll('.fw65-emotion').forEach(el=>{el.onmouseenter=()=>{const def=FEELINGS.find(x=>x.id===el.dataset.id),hint=app.querySelector('#fw65-hint');if(def&&hint)hint.textContent=def.label+' · '+def.description;};el.onmouseleave=()=>{const hint=app.querySelector('#fw65-hint');if(hint)hint.textContent='Wähle ein oder mehrere Gefühle.';};});
  app.querySelectorAll('[data-action]').forEach(el=>el.onclick=ev=>{
    if(el.dataset.action==='capture-close-backdrop'&&ev.target!==el)return;
    if(el.dataset.action==='date-adjust'||el.dataset.action==='date-clear'){
      const field=el.closest('form')?.querySelector(`[name="${el.dataset.field}"]`);
      if(!field)return;
      if(el.dataset.action==='date-clear')field.value='';
      else {const next=inspectorDateShift(field.value,el.dataset.offset,localDate());if(next)field.value=next;}
      field.focus();return;
    }
    if(el.dataset.action==='person-quick-log')quickContactType=el.dataset.kind||'call';
    runAction(el.dataset.action,el.dataset.id,el.dataset.step,el.dataset.day);
  });
  app.querySelectorAll('.v48-date-form').forEach(form=>form.onsubmit=async ev=>{
    ev.preventDefault();
    const taskId=form.dataset.id,task=state?.tasks?.[taskId];
    const fd=new FormData(form),kind=String(fd.get('dateKind')||''),value=String(fd.get('dateValue')||'');
    if(!task||!isActionAvailable(state,task,selectedForecastDay)||state?.taskConflicts?.[taskId])return toast('Aufgabe nicht mehr verfügbar.',true);
    if(!['plannedDate','dueDate'].includes(kind)||!value||!dateIsValid(value))return toast('Bitte ein gültiges Datum auswählen.',true);
    if(task[kind]&&task[kind]!==value&&!confirm('Das bestehende Datum ersetzen?'))return;
    try{
      await mutate(s=>{s.tasks[taskId][kind]=value;s.tasks[taskId].updatedAt=stamp();s.taskPending[taskId]=true;});
      dailyPlanDateTask='';dailyPlanExpanded=true;
      toast(kind==='dueDate'?'Echte Deadline festgelegt.':'Wunschtag vorgemerkt – keine harte Deadline.');
    }catch(ex){toast(ex.message,true);}
  });
  const planDetails=app.querySelector('#v48-daily-plan');
  if(planDetails)planDetails.addEventListener('toggle',()=>{dailyPlanExpanded=planDetails.open;});
  const planDuration=app.querySelector('#v48-duration');
  if(planDuration)planDuration.onchange=()=>{dailyPlanDuration=Number(planDuration.value);};
  let dragItem=null;
  app.querySelectorAll('[data-day-drag]').forEach(el=>{
    el.addEventListener('dragstart',ev=>{
      dragItem={taskId:el.dataset.dayDrag,moveId:el.dataset.dayMove||null};
      ev.dataTransfer.effectAllowed='move';ev.dataTransfer.setData('text/plain',dragItem.taskId);
      el.classList.add('v48-dragging');
    });
    el.addEventListener('dragend',()=>{dragItem=null;app.querySelectorAll('.v48-dragging,.v48-hover').forEach(x=>x.classList.remove('v48-dragging','v48-hover'));});
  });
  app.querySelectorAll('[data-day-drop]').forEach(el=>{
    el.addEventListener('dragover',ev=>{if(!dragItem)return;ev.preventDefault();ev.dataTransfer.dropEffect='move';el.classList.add('v48-hover');});
    el.addEventListener('dragleave',()=>el.classList.remove('v48-hover'));
    el.addEventListener('drop',async ev=>{
      ev.preventDefault();el.classList.remove('v48-hover');const item=dragItem;dragItem=null;
      if(!item)return;
      try{await placeInDailyPlan(item.taskId,Number(el.dataset.dayDrop),item.moveId);}catch(ex){toast(ex.message,true);}
    });
  });
}
async function placeInDailyPlan(taskId,start,moveId=null){
 const from=localDateString(new Date()),forecast=localCapacity(from,14);
 const day=selectedForecastDay;
 const remaining=state?.tasks?.[taskId]?dayCandidates(state,day,150,{forecast}).find(x=>x.task.id===taskId)?.minutes:null;
 const minutes=moveId?dayPlanBlocks(state).find(x=>x.id===moveId)?.minutes:remaining==null?Math.min(dailyPlanDuration,30):Math.min(dailyPlanDuration,remaining);
 if(!Number.isSafeInteger(minutes)||minutes<5)throw Error('Aufwand bitte zuerst prüfen.');
 const entries=placeDayBlock(state,forecast,{taskId,day,start,minutes,moveId},{idFactory:()=>crypto.randomUUID()});
 dailyPlanPicked='';dailyPlanExpanded=true;
 await mutate(s=>{s.uiPreferences??={};s.uiPreferences.dailyPlanBlocks=entries;});
 toast('Arbeitsblock im lokalen Tagesplan gespeichert – kein Google-Termin erstellt.');
}
async function runAction(action,id,stepId=null,plannerDay=null) {
 if(action==='feeling-open'){captureOverlayOpen=false;feelingOverlayOpen=true;render();app.querySelector('#fw65-dialog .fw65-emotion')?.focus({preventScroll:true});return;}
 if(action==='feeling-close'){feelingOverlayOpen=false;render();app.querySelector('.fw65-top-trigger')?.focus({preventScroll:true});return;}
 if(action==='feeling-toggle'){try{feelingDraft=chooseFeeling(feelingDraft,id);render();}catch(ex){toast(ex.message,true);}return;}
 if(action==='connection-emotion'){if(FEELINGS.some(e=>e.id===id)){connectionEmotion=id;render();}return;}
 if(action==='connection-period'){if(['7','30','90'].includes(id)){connectionDays=Number(id);render();}return;}
 if(action==='feeling-period'){if(['7','30','90'].includes(id)){feelingDays=Number(id);render();}return;}
 if(action==='feeling-open-history'){feelingOverlayOpen=false;tab='insights';insightTab='feelings';calmNavGroup='insights';render();return;}
 if(action==='feeling-save'){try{const entry=validatedCheckin(feelingDraft,{id:crypto.randomUUID(),at:stamp(),day:localDate()});await mutate(s=>appendCheckin(s,entry));feelingDraft=newFeelingDraft();feelingOverlayOpen=false;toast('Emotionaler Check-in sicher im lokalen Vault gespeichert.');}catch(ex){toast(ex.message,true);}return;}
 if(action==='balance-select'){if(id===''||['sleep','activity','gtd','finance','people','body','recovery','work'].includes(id)){balanceSelectedAxis=id||null;render();}return;}
 if(action==='balance-history'){if(['0','1','2'].includes(id)){balanceHistoryCount=Number(id);render();}return;}
 if(action==='balance-period'){if(['7','30'].includes(id)){balancePeriod=Number(id);render();}return;}
 if(action==='balance-open'){tab='insights';insightTab='balance';calmNavGroup='insights';render();if(authToken){reloadHealth().catch(()=>{});reloadWatchSessions().catch(()=>{});}return;}
 if(action==='balance-drill'){if(!['insights','people','finance','review'].includes(id))return;tab=id;if(id==='insights'&&INSIGHT_TABS.some(t=>t.id===stepId))insightTab=stepId;if(id==='finance')financePane='Prognose';calmNavGroup=id==='insights'?'insights':id==='finance'?'finance':'';render();return;}
  lastActivity=Date.now();
  try {
    if(['radar555-save','radar555-ignore','radar555-restore'].includes(action)){
      const entry=conferenceEntries(state).find(x=>x.id===id);if(!entry)return;
      const status=action==='radar555-ignore'?'ignorieren':action==='radar555-restore'?'neu':entry.status==='merken'?'neu':'merken';
      await mutate(s=>{s.conferenceRadar=setConferenceStatus(s,id,status);});return;
    }
    if(action==='radar555-project'){
      const entry=conferenceEntries(state).find(x=>x.id===id);if(!entry)return;
      const duplicate=Object.values(state.projects||{}).some(p=>p.title===`CFP · ${entry.title}`.slice(0,140));
      if(duplicate&&!confirm('Ein gleichnamiges Konferenzprojekt existiert bereits. Trotzdem einen weiteren Entwurf zur Prüfung öffnen?'))return;
      exchangePreview=conferenceProjectPlan(entry);exchangeBaseline={};exchangeRaw='';
      tab='projects';calmNavGroup='plan';toast('Konferenzprojekt als Vorschau vorbereitet. Bitte Arbeitsschritte und Schätzungen prüfen – noch nichts gespeichert.');
      const el=app.querySelector('#project-exchange-details');if(el){el.open=true;el.scrollIntoView?.({block:'nearest'});}return;
    }
    if(action==='rec554-kind'){if(id==='za'||id==='vacation'){timeoffKind=id;timeoffOpen=true;render();}return;}
    if(action==='daily-plan-day'){
      const range=localCapacity(localDateString(new Date()),14);
      if(!range.days.some(d=>d.day===id))return;
      selectedForecastDay=id;dailyPlanPicked='';dailyPlanDateTask='';dailyPlanShowUndated=false;dailyPlanShowAll=false;dailyPlanExpanded=true;render();return;
    }
    if(action==='daily-plan-undated'){dailyPlanShowUndated=!dailyPlanShowUndated;dailyPlanShowAll=false;dailyPlanDateTask='';dailyPlanExpanded=true;render();return;}
    if(action==='daily-plan-date-edit'){
      if(!state?.tasks?.[id]||!isActionAvailable(state,state.tasks[id],selectedForecastDay))return toast('Aufgabe nicht mehr verfügbar.',true);
      dailyPlanDateTask=dailyPlanDateTask===id?'':id;
      dailyPlanExpanded=true;render();return;
    }
    if(action==='daily-plan-more'){dailyPlanShowAll=true;dailyPlanExpanded=true;render();return;}
    if(action==='daily-plan-pick'){
      if(!dayCandidates(state,selectedForecastDay,150,{forecast:localCapacity(localDateString(new Date()),14)}).some(x=>x.task.id===id))return toast('Aufgabe ist nicht mehr verfügbar.',true);
      dailyPlanPicked=dailyPlanPicked===id?'':id;dailyPlanExpanded=true;render();return;
    }
    if(action==='daily-plan-place'){
      if(!dailyPlanPicked)return toast('Zuerst links eine ausführbare Aufgabe auswählen.');
      await placeInDailyPlan(dailyPlanPicked,Number(stepId));return;
    }
    if(action==='daily-plan-done'||action==='daily-plan-remove'){
      const existing=dayPlanBlocks(state).find(b=>b.id===id);
      if(!existing)return toast('Arbeitsblock nicht mehr vorhanden.',true);
      const entries=updateDayBlock(state,id,action==='daily-plan-done'?'toggleDone':'remove');
      dailyPlanExpanded=true;
      await mutate(s=>{s.uiPreferences??={};s.uiPreferences.dailyPlanBlocks=entries;});
      toast(action==='daily-plan-done'?'Arbeitsblock-Status aktualisiert; Aufgabe bleibt unverändert.':'Arbeitsblock entfernt; Aufgabe bleibt bestehen.');return;
    }
    if(action==='next-move-up'||action==='next-move-down'){
      const full=nextActions(state),visible=inboxOrdered(full,state?.uiPreferences?.nextActionManualOrder||[]).filter(t=>!contextFilter||(t.contextTags||[]).includes(contextFilter));
      const index=visible.findIndex(t=>t.id===id),other=visible[index+(action==='next-move-up'?-1:1)];
      if(index<0||!other)return;
      const updated=inboxMove(state?.uiPreferences?.nextActionManualOrder||[],full,id,other.id,action==='next-move-down');
      if(updated)await mutate(s=>{s.uiPreferences??={};s.uiPreferences.nextActionManualOrder=updated;});return;
    }
    if(action==='planner-mark'){
      // Recompute rather than trusting DOM attributes; the calendar or task may have changed.
      const day=typeof plannerDay==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(plannerDay)?plannerDay:null;
      const current=state?.tasks?.[id],forecast=localCapacity(localDateString(new Date()),14);
      if(!current||!day||forecast.status!=='ready'||state?.taskConflicts?.[id])return toast('Planvorschlag nicht mehr verfügbar. Forecast neu öffnen.',true);
      const plan=proactivePlan(state,forecast);
      if(!plan.blocks.some(b=>b.task.id===id&&b.day===day))return toast('Dieses Zeitfenster ist nicht mehr verfügbar.',true);
      if(current.plannedDate===day)return toast('Aufgabe ist für diesen Tag bereits vorgemerkt.');
      if(current.plannedDate&&!confirm(`Den Wunschtermin ${current.plannedDate} durch ${day} ersetzen? Die harte Deadline bleibt unverändert.`))return;
      plannerExpanded=true;
      await mutate(s=>{s.tasks[id].plannedDate=day;s.tasks[id].updatedAt=stamp();s.taskPending[id]=true;});
      toast('Wunschtag vorgemerkt. Kein Kalendertermin angelegt und keine Deadline verändert.');return;
    }
    if(action==='next-plan-today'||action==='tree-plan-today'){
      const current=state?.tasks?.[id];
      if(!current||current.archived||current.completed||state?.taskConflicts?.[id]||(!isActionAvailable(state,current,localDate())&&current.plannedDate!==localDate()))return;
      const today=localDate();
      if(current.plannedDate&&current.plannedDate!==today&&!confirm(`Die Aufgabe ist für ${current.plannedDate} geplant. Auf heute ändern? Die Fälligkeit bleibt unverändert.`))return;
      const setDate=current.plannedDate===today?null:today;
      await mutate(s=>{s.tasks[id].plannedDate=setDate;s.tasks[id].updatedAt=stamp();s.taskPending[id]=true;});
      toast(setDate?'Für heute vorgemerkt – ohne neue Deadline.':current.dueDate===today?'Heute-Vormerkung entfernt. Wegen der heutigen Deadline bleibt die Aufgabe unter Heute sichtbar.':'Heute-Vormerkung entfernt.');return;
    }
    if(action==='inbox-plan-today'){
      // Inbox captures are not tasks: promoting for today must be atomic and
      // idempotent, otherwise the same capture would be shown twice.
      const record=state?.records?.[id];
      if(!record||record.deleted||record.tags?.includes('dreams'))return toast('Inbox-Eintrag ist nicht mehr verfügbar.',true);
      try{
        const today=localDate();
        const task=inboxTodayTaskDraft(state,id,crypto.randomUUID(),today,stamp());
        await mutate(s=>{
          const original=s.records?.[id];
          if(!original||original.deleted||s.tasks[task.id])throw new Error('Dieser Eingang wurde bereits verarbeitet. Bitte Ansicht aktualisieren.');
          s.tasks[task.id]=task;s.taskPending[task.id]=true;
          original.deleted=true;original.updatedAt=stamp();s.pending.push(makeMutation(original));
          for(const tag of task.tags)rememberTag(s,tag);
        });
        selectedInboxId=null;
        toast('Für heute als Next Action vorgemerkt und aus der Inbox entfernt. Keine Deadline gesetzt.');
      }catch(ex){toast(ex.message,true);}
      return;
    }
    if(action==='inbox-move-up'||action==='inbox-move-down'){
      if(inboxQuery.trim())return;
      const next=inboxNudge(state?.uiPreferences?.inboxManualOrder||[],rows(),id,action==='inbox-move-up'?-1:1);
      if(next)await mutate(s=>{s.uiPreferences??={};s.uiPreferences.inboxManualOrder=next;});return;
    }
    if(action==='private-mirror-refresh'){if(!authToken)throw Error('Bitte zuerst anmelden.');if(state?.privateDeviceMirror?.mode==='source'){state.privateDeviceMirror.dirty=true;await persist();await publishPrivateMirror();}else if(state?.privateDeviceMirror?.mode==='receiver')await receivePrivateMirror(true);toast('Verschlüsselter Geräteabgleich abgeschlossen.');return;}
    if(action==='private-mirror-cloud-delete'){
      if(state?.privateDeviceMirror?.mode!=='source'||!authToken)throw Error('Cloud-Kopien nur vom Hauptgerät löschen.');
      if(!confirm('Wirklich alle verschlüsselten Finanz- und Garmin-Kopien aus der Compass-Cloud löschen? Lokale Daten auf bereits verbundenen Geräten bleiben erhalten.'))return;
      for(const kind of PRIVATE_KINDS)await request(config.apiUrl,authToken,`/api/private-device/${kind}`,{method:'DELETE'});
      delete state.privateDeviceMirror;await persist();toast('Cloud-Kopien gelöscht. Lokale Tresordaten bleiben erhalten.');return;
    }
    if(action==='private-mirror-disconnect'){if(!confirm('Geräteabgleich nur auf diesem Gerät deaktivieren? Lokale Daten bleiben erhalten. Verschlüsselte Cloud-Kopien werden dabei NICHT gelöscht.'))return;delete state.privateDeviceMirror;await persist();toast('Geräteabgleich auf diesem Gerät deaktiviert.');return;}
    if(action==='health551-local-summary'){
      const model=buildSleepInsights(state?.healthImports||{},localDate(),'all');
      const findings=healthFindings({nights:model.allNights,imported:state?.healthImports||{},today:localDate()});
      if(!findings.length)return toast('Noch keine vergleichbaren Erkenntnisse für die lokale KI.',true);
      if(!confirm('Nur die angezeigten aggregierten Beobachtungen an LM Studio auf diesem Gerät (127.0.0.1) senden? Keine Rohmesswerte oder Kalendereinträge. Das Modell ordnet nur geprüfte Hinweise; es kann keine Gesundheitsdiagnose erstellen.'))return;
      healthAiStatus='Lokales Modell prüft die Reihenfolge …';render();
      try{healthAiOrder=await rankHealthFindingsLocally(findings);healthAiStatus='Die lokale KI hat vorhandene Hinweise nach Relevanz sortiert. Keine zusätzlichen medizinischen Aussagen.';}
      catch(ex){healthAiStatus='Lokale KI derzeit nicht verfügbar: '+String(ex?.message||ex).slice(0,120)+'. Die berechneten Hinweise bleiben sichtbar.';}
      render();return;
    }
    if(action==='insights-night-day'){if(!/^\d{4}-\d{2}-\d{2}$/.test(id||''))return;const model=buildSleepInsights(state?.healthImports||{},localDate(),'all');if(model.nights.some(x=>x.day===id)){insightNight=id;render();}return;}
    if(action==='insights-wellness-day'){if(!/^\d{4}-\d{2}-\d{2}$/.test(id||''))return;const items=(state?.healthImports?.garminWellness||[]);if(items.some(x=>String(x.at||'').slice(0,10)===id)){insightWellnessDay=id;render();}return;}
    if(action==='insights-stress-granularity'){if(['day','week'].includes(id)){insightStressGranularity=id;render();}return;}
    if(action==='insights-body-composition'){if(['composition','water','stacked'].includes(id)){insightBodyComposition=id;render();}return;}
    if(action==='review-import-open'){if(id==='hub'){tab='system';calmNavGroup='';render();requestAnimationFrame(()=>app.querySelector('#smart-import-hub')?.scrollIntoView({behavior:'smooth',block:'start'}));return;}if(id==='worktime'){tab='insights';insightTab='worktime';calmNavGroup='insights';render();return;}if(id==='health'){tab='insights';insightTab='sources';}else if(id==='places'){tab='insights';insightTab='places';insightPeriod='all';}else if(id==='finance'){tab='finance';financePane='Buchungen';}else if(id==='kraken'){tab='finance';financePane='Portfolio';}render();return;}
     if(action==='finance-budget-month'){if(/^\d{4}-(0[1-9]|1[0-2])$/.test(id)){financeBudgetMonth=id;render();}return;}
    if(action==='finance-budget-edit'){const entry=(state.financeFlexBudgets||[]).find(x=>x.category===id);if(!entry)return;const el=app.querySelector('#finance-budget-editor');if(el)el.open=true;const cat=app.querySelector('#finance-budget-category'),group=app.querySelector('#finance-budget-group'),amount=app.querySelector('#finance-flex-budget-form input[name="limit"]');if(cat)cat.value=entry.category;if(group)group.value=entry.group;if(amount)amount.value=(entry.limitCents/100).toFixed(2);el?.scrollIntoView({block:'nearest',behavior:'smooth'});return;}
    if(action==='finance-budget-remove'){if(!(state.financeFlexBudgets||[]).some(x=>x.category===id)||!confirm('Dieses Budget entfernen? Bankbuchungen bleiben unverändert.'))return;await mutate(s=>{s.financeFlexBudgets=(s.financeFlexBudgets||[]).filter(x=>x.category!==id);});toast('Budget entfernt.');return;}
    if(action==='finance-goal-remove'){if(!(state.financeSavingsGoals||[]).some(x=>x.id===id)||!confirm('Dieses Sparziel entfernen? Konten und Buchungen bleiben unverändert.'))return;await mutate(s=>{s.financeSavingsGoals=(s.financeSavingsGoals||[]).filter(x=>x.id!==id);});toast('Sparziel entfernt.');return;}
    if(action==='finance-wealth-goal-remove'){if(!(state.financeWealthGoals||[]).some(x=>x.id===id))return;if(!confirm('Dieses Vermögensziel entfernen? Bestandswerte bleiben unverändert.'))return;await mutate(s=>{s.financeWealthGoals=(s.financeWealthGoals||[]).filter(x=>x.id!==id);});toast('Ziel entfernt.');return;}
    if(action==='assistant-new'){
      if(!confirm('Neuen Wochenreview starten? Der bisherige Durchgang wird als Fortschrittsstand ersetzt; die geprüften Projekte behalten ihre Reviewdaten.'))return;
      reviewEditingTaskId=null;reviewProjectId=null;await mutate(s=>{s.weeklyReview=newReview();s.reviewPending=true;});return;
    }
    if(action==='assistant-step'||action==='assistant-back'||action==='assistant-next'){
      captureReviewDraft();const index=action==='assistant-step'?Number(id):action==='assistant-back'?Math.max(0,state.weeklyReview.step-1):Math.min(REVIEW_STEPS.length-1,state.weeklyReview.step+1);
      if(!Number.isInteger(index)||index<0||index>=REVIEW_STEPS.length)return;
      reviewEditingTaskId=null;await mutate(s=>{s.weeklyReview=nextReviewStep(s.weeklyReview,index);s.reviewPending=true;});return;
    }
    if(action==='assistant-complete-step'){
      const current=REVIEW_STEPS[state.weeklyReview.step];if(!current)return;
      const queue=reviewQueue(state,calendarEvents,localDate());
      if(current.id==='inbox'&&queue.inbox.length&&!confirm(`${queue.inbox.length} Inbox-Einträge sind noch offen. Diesen Bereich trotzdem als durchgesehen markieren?`))return;
      if(current.id==='projects'&&queue.due.some(p=>!state.weeklyReview.inspectedProjects.includes(p.id))&&!confirm('Nicht alle fälligen Projekte wurden geprüft. Trotzdem fortfahren?'))return;
      const notes=String(app.querySelector('#review-end-notes')?.value||'').slice(0,1200);
      await mutate(s=>{s.weeklyReview=reviewedStep(s.weeklyReview,current.id);if(current.id==='finish'){s.weeklyReview.completedAt=stamp();s.weeklyReview.notes=notes;}s.reviewPending=true;});return;
    }
    if(action==='assistant-project-select'){if(!state.projects?.[id])return;reviewProjectId=id;reviewEditingTaskId=null;render();return;}
    if(action==='assistant-project-reviewed'){
      if(!state.projects?.[id])return;
      await mutate(s=>{s.projects[id].reviewedAt=stamp();s.projectPending[id]=true;s.weeklyReview.inspectedProjects=[...new Set([...s.weeklyReview.inspectedProjects,id])];s.weeklyReview.updatedAt=stamp();s.reviewPending=true;});reviewProjectId=null;toast('Projekt geprüft. Nächstes Projekt direkt hier.');return;
    }
    if(action==='assistant-task-edit'){if(!state.tasks?.[id])return;reviewEditingTaskId=id;render();return;}
    if(action==='assistant-task-cancel'){reviewEditingTaskId=null;render();return;}
    if(action==='assistant-task-done'){
      if(!state.tasks?.[id])return;await mutate(s=>{s.tasks[id].completed=true;s.tasks[id].updatedAt=stamp();s.taskPending[id]=true;});reviewEditingTaskId=null;return;
    }
    if(action==='assistant-inbox-remove'){
      if(!state.records?.[id]||!confirm('Inbox-Eintrag archivieren?'))return;
      await mutate(s=>{s.records[id].deleted=true;s.records[id].updatedAt=stamp();s.pending.push(makeMutation(s.records[id]));});return;
    }
    if(action==='assistant-dream-activate'){
      if(!state.records?.[id])return;await mutate(s=>{const r=s.records[id];r.tags=parseTags((r.tags||[]).filter(t=>t!=='dreams'&&!t.startsWith('dream-')));r.updatedAt=stamp();s.pending.push(makeMutation(r));});toast('Idee für die Inbox aktiviert.');return;
    }
    if(action==='assistant-resolve-remote'||action==='assistant-resolve-local'){
      const c=state.reviewConflict;if(!c)return;
      await mutate(s=>{if(action.endsWith('remote')){s.weeklyReview=c.progress;s.reviewVersion=c.version;s.reviewPending=false;}else{s.reviewVersion=c.version;s.reviewPending=true;}s.reviewConflict=null;});return;
    }
    if(action==='health-range'){healthSpan=id==='30'?30:7;render();return;}
    if(action==='discovery-cat-all'){discoveryCategories=null;discoveryCategoriesOpen=true;render();return;}
    if(action==='discovery-week-prev'){discoveryWeekOffset=Math.max(0,discoveryWeekOffset-1);render();return;}
    if(action==='discovery-week-next'){discoveryWeekOffset=Math.min(80,discoveryWeekOffset+1);render();return;}
    if(action==='discovery-week-today'){discoveryWeekOffset=0;render();return;}
    if(action==='discovery-import-cancel'){discoveryImportPreview=null;render();return;}
    if(action==='discovery-import-confirm'){if(!discoveryImportPreview)return;const preview=discoveryImportPreview;await mutate(st=>{for(const e of preview.added)queueEvent(st,e);});discoveryImportPreview=null;discoveryImportOpen=false;toast(`${preview.added.length} Veranstaltungen übernommen – Cloud-Sync läuft im Hintergrund.`);return;}
    if(action==='discovery-conflict-cloud'||action==='discovery-conflict-local'){await mutate(st=>resolveEventConflict(st,id,action.endsWith('cloud')?'cloud':'local'));return;}
    if(action==='discovery-range'){if(['today','week','weekend','all','saved','hidden'].includes(id))discoveryRange=id;render();return;}
    if(action==='discovery-import-toggle'){discoveryImportOpen=!discoveryImportOpen;discoveryImportPreview=null;render();return;}
    if(action==='discovery-more'){if(discoveryExpandedDays.has(id))discoveryExpandedDays.delete(id);else discoveryExpandedDays.add(id);render();return;}
    if(action==='discovery-save'||action==='discovery-hide'){const entry=state?.discoveredEvents?.find(e=>eventKey(e)===id);if(!entry)return;await mutate(st=>{st.eventPreferences??={};const prev=st.eventPreferences[id]||'open';const next=action==='discovery-save'?(prev==='saved'?'open':'saved'):(prev==='hidden'?'open':'hidden');queueEventPreference(st,id,next);});return;}
    if(action==='smart49-open'){
      tab='system';calmNavGroup='';render();requestAnimationFrame(()=>app.querySelector('#smart-import-hub')?.scrollIntoView({behavior:'smooth',block:'start'}));return;
    }
    if(action==='smart49-reset'){if(smartHubBusy)return;smartHubEntries=[];smartHubStage=null;smartHubScanSource='';smartHubNotice='Dateiliste geleert. Originaldateien sind unverändert.';render();return;}
    if(action==='smart49-health-backfill'){if(smartHubBusy)return;smartHubEntries=recheckHealthArchiveEntries(smartHubEntries);smartHubNotice='Gesundheitsarchive können erneut geprüft werden. Bereits gespeicherte Messwerte werden beim Zusammenführen nicht verdoppelt.';render();return;}
    if(action==='smart49-pick-folder'){
      if(!SMART_IMPORT_SOURCES.some(x=>x.id===id))return;
      if(typeof window.showDirectoryPicker!=='function'){toast('Ordnerzugriff ist in diesem Browser nicht verfügbar. Bitte Dateien auswählen oder Chromium/Edge auf HTTPS verwenden.',true);return;}
      try{const folder=await window.showDirectoryPicker({id:'compass-smart49-'+id,mode:'read'});
        smartHubFolders[id]=folder;smartHubFolderStatus[id]='Freigegeben: '+folder.name+' · nur solange die App geöffnet ist';
        // Selecting a folder is enough: scan immediately, no second "Prüfen" click.
        await scanSmartFolder(id);
      }catch(ex){if(ex.name!=='AbortError')toast('Ordnerauswahl: '+ex.message,true);}return;
    }
    if(action==='smart49-rescan-folder'){await scanSmartFolder(id);return;}
    if(action==='smart49-preview-kind'){
      if(smartHubBusy||!SMART_IMPORT_KINDS[id]||id==='unknown')return;
      const group=smartHubEntries.filter(e=>e.kind===id&&!e.duplicate);if(!group.length)return;
      try{
        if(id==='bank'){
          if(group.length>80)throw Error('Bankimport unterstützt höchstens 80 Dateien je Vorschau.');
          const items=[];for(const e of group){if(e.size>8_000_000)throw Error('Bankdatei über 8 MB: '+e.name);
            const bytes=await e.file.arrayBuffer();let txt;try{txt=new TextDecoder('utf-8',{fatal:true}).decode(bytes);}catch{txt=new TextDecoder('windows-1252').decode(bytes);}items.push({name:e.name,text:txt});}
          const preview=previewBankFiles(items,state?.financeTransactions||[],state?.financeRules||[],state?.financePrivateRules||[]);
          if(!preview.rows.length){smartHubNotice='Bankvorschau: keine neuen Buchungen ('+preview.duplicates+' Duplikate).';render();return;}
          financePreview=preview;financePane='Prüfen';tab='finance';calmNavGroup='finance';
        }else if(id==='health'){
          // Inspect only a representative, newest-first sample. After ONE explicit
          // confirmation, process every remaining archive in small, saved batches.
          const queue=planHealthQueue(group);
          const sample=queue.batches[0];
          const preview=await inspectHealthFiles(sample.map(e=>e.file));
          if(!preview.processed)throw Error(`Keines der ersten ${sample.length} Archive enthält lesbare Messungen. ${preview.errors.slice(0,2).join(' · ')}`);
          const coverage=healthImportCoverage(preview);
          healthFilePreview=preview;
          healthImportJob=null;healthImportIssues=[];
          smartHubStage={kind:'health',entries:queue.ordered,firstBatch:sample};
          smartHubNotice=`Vorschau: ${sample.length} von ${queue.total} Dateien geprüft · Stress bis ${coverage.stress.last||'kein Wert'} · Schlaf bis ${coverage.nights.last||'kein Wert'}. Nach einer Bestätigung werden ALLE ${queue.total} Archive schrittweise verarbeitet und gespeichert.`;
          // Keep the preview in the Import Hub: no confusing navigation round-trip.
          tab='system';calmNavGroup='';
        }else if(id==='worktime'){
          if(group.length!==1)throw Error('Arbeitszeit-Excel bitte einzeln prüfen.');
          workPreview=await inspectWorktimeFile(group[0].file,{today:localDate(),nowMinutes:new Date().getHours()*60+new Date().getMinutes()});
          if(!workPreview.days.length)throw Error('Keine abgeschlossenen Zeiterfassungstage gefunden.');
          tab='insights';insightTab='worktime';calmNavGroup='insights';
        }else if(id==='places'){
          if(group.length>12)throw Error('Maximal zwölf Timeline-Dateien pro Vorschau.');
          placesPreview=await inspectTimelineFiles(group.map(x=>x.file));if(!placesPreview.visits.length)throw Error('Keine Standort-Aufenthalte erkannt.');
          tab='insights';insightTab='places';calmNavGroup='insights';
        }else if(id==='project'){
          if(group.length!==1)throw Error('Projektpläne bitte einzeln prüfen, damit bestehende Projekte nicht unbeabsichtigt zusammengeführt werden.');
          if(group[0].size>1024*1024)throw Error('Projektdatei ist größer als 1 MB.');
          exchangePreview=parseProjectPlan(await group[0].file.text());exchangeBaseline={};
          for(const item of [...exchangePreview.projects,...exchangePreview.tasks]){const existing=item.id&&(state.projects?.[item.id]||state.tasks?.[item.id]);if(existing)exchangeBaseline[item.id]=JSON.stringify(existing);}
          tab='projects';calmNavGroup='plan';
        }else if(id==='kraken'){
          if(group.length!==1||group[0].size>12_000_000)throw Error('Bitte eine Kraken-JSON-Datei bis 12 MB auswählen.');
          krakenPreview=validateKrakenSnapshot(JSON.parse(await group[0].file.text()));
          tab='finance';financePane='Portfolio';financePortfolioTab='settings';calmNavGroup='finance';
        }else if(id==='flatex'){
          if(group.length!==1||group[0].size>1_000_000)throw Error('Bitte eine flatex-CSV bis 1 MB auswählen.');
          const snap=parseFlatexPositionsCsv(await group[0].file.text());
          if(!confirm(`flatex-Depotstand ${snap.day} mit ${snap.positions.length} Positionen übernehmen?`))return;
          await mutate(st=>{st.financeFlatexSnapshots=putFlatexSnapshot(st.financeFlatexSnapshots||[],snap);
            st.smartImportHistory=committedSmartImport(st.smartImportHistory,group,'flatex');markSuccessfulImport(st,'flatex');});
          smartHubEntries.forEach(e=>{if(group.includes(e))e.duplicate=true;});
          smartHubStage=null;smartHubNotice='flatex-Depotstand übernommen.';toast(smartHubNotice);return;
        }
        if(id!=='health')smartHubStage={kind:id,entries:group};
        if(id!=='health')smartHubNotice=`${group.length} ${SMART_IMPORT_KINDS[id]}-Datei(en) zur bestehenden Importvorschau übergeben.`;
        render();
        requestAnimationFrame(()=>{
          const selector=({bank:'#finance-import-manager',health:'#smart49-health-review',worktime:'.work553-preview',places:'.places-import-preview',project:'#project-exchange-details',kraken:'.fin41-portfolio-panel'})[id];
          (selector&&app.querySelector(selector))?.scrollIntoView?.({behavior:'smooth',block:'start'});
        });
      }catch(ex){toast('Smart Import: '+ex.message,true);}return;
    }
    if(action==='calm-finance-group'){const group=FINANCE_GROUPS.find(g=>g.title===id);if(group){tab='finance';calmNavGroup='finance';financePane=group.panes[0];financeReviewPage=0;financeLedgerPage=0;render();}return;}
    if(action==='calm-finance-view'){if(FINANCE_TABS.some(p=>p.title===id)){tab='finance';calmNavGroup='finance';financePane=id;financeReviewPage=0;financeLedgerPage=0;render();}return;}
    if(action==='calm-nav-group'){calmNavGroup=calmNavGroup===id?'':id;render();return;}
    if(action==='calm-insight-view'){if(INSIGHT_TABS.some(t=>t.id===id)){tab='insights';calmNavGroup='insights';insightTab=id;if(id==='places')insightPeriod='all';render();if(authToken){reloadWatchSessions().catch(()=>{});reloadHealth().catch(()=>{});}}return;}
    if(action==='nav-more'){await mutate(s=>{s.uiPreferences??={};s.uiPreferences.advancedNav=!(s.uiPreferences.advancedNav===true);});return;}
    if(action==='recovery-idea-remove'){if(!String(id).startsWith('idea-'))return;await mutate(s=>{s.recoveryIdeas=(s.recoveryIdeas||[]).filter(i=>i.id!==id);});return;}
    if(action==='recovery-idea-hide'){if(!String(id).startsWith('starter-'))return;await mutate(s=>{s.hiddenStarterIdeas=[...new Set([...(s.hiddenStarterIdeas||[]),id])];});return;}
    if(action==='recovery-ideas-reset'){await mutate(s=>{s.hiddenStarterIdeas=[];});return;}
    if(action==='recovery-idea-capture'){
      const idea=allRecoveryIdeas(state).find(i=>i.id===id);if(!idea)return;
      await addCapture(idea.title,'Freizeitidee aus Erholung. Zeitpunkt erst bei konkreter Planung festlegen.');
      tab='inbox';toast('Idee in die Inbox übernommen. Noch nicht terminiert.');return;
    }
    if(action.startsWith('review-clarify:')){
      if(!state?.records?.[id]||state.records[id].deleted)return;
      const choice=action.split(':')[1];if(!['next','waiting','hold','dreams'].includes(choice))return;
      captureReviewDraft();reviewWorkflow=choice;render();return;
    }
    if(action==='review-select'){if(!state?.records?.[id]||state.records[id].deleted)return;captureReviewDraft();selectedInboxId=id;reviewWorkflow='next';render();return;}
    if(action==='review-project-open'){if(!state?.projects?.[id])return;reviewProjectId=id;render();return;}
    if(action.startsWith('review-energy:') || action.startsWith('review-attention:')){
       const [key,val]=action.split(':');
       if(!state?.records?.[id] || state.records[id].deleted)return;
       const options=key==='review-energy'?['low','medium','high']:['routine','clarity','deep'];
       if(!options.includes(val))return;
       captureReviewDraft();await mutate(s=>{
         s.reviewMeta=s.reviewMeta||{};
         const old=s.reviewMeta[id]||{};
         s.reviewMeta[id]={...old,[key==='review-energy'?'energy':'attention']:val};
       });
       return;
    }
    if(action==='dream-select'){if(!state?.records?.[id])return;selectedDreamId=id;render();return;}
    if(action==='dream-to-inbox'){
      if(!state?.records?.[id])return;
      await mutate(s=>{const r=s.records[id];r.tags=(r.tags||[]).filter(t=>t!=='dreams'&&!t.startsWith('dream-'));r.updatedAt=stamp();s.pending.push(makeMutation(r));});selectedDreamId=null;selectedInboxId=id;tab='inbox';toast('Idee liegt wieder in der Inbox.');return;
    }
    if(action==='dream-to-next'){
      const r=state?.records?.[id];if(!r||r.deleted||!r.tags?.includes('dreams'))return;
      if(r.title.length>180){toast('Bitte Titel vor der Aktivierung auf höchstens 180 Zeichen kürzen.',true);return;}
      const t={id:crypto.randomUUID(),title:r.title,note:(r.note||'').slice(0,3000),plannedDate:null,dueDate:null,category:'Allgemein',completed:false,archived:false,workflow:'next',flagged:false,projectId:null,tags:parseTags((r.tags||[]).filter(x=>x!=='dreams'&&!x.startsWith('dream-'))),contextTags:[],deferUntil:null,estimateMinutes:null,updatedAt:stamp()};
      if(!validLocalTask(t)){toast('Eintrag konnte nicht aktiviert werden.',true);return;}
      await mutate(s=>{s.tasks[t.id]=t;s.taskPending[t.id]=true;const dream=s.records[id];dream.deleted=true;dream.updatedAt=stamp();s.pending.push(makeMutation(dream));});selectedDreamId=null;selectedTaskId=t.id;tab='next';toast('Dream als Next Action aktiviert.');return;
    }
    if(action==='task-view'){const t=state?.tasks?.[id];if(!t)return;selectedTaskId=id;selectedDay=t.dueDate||t.plannedDate||localDate();tab='today';render();return;}
    if(action==='timeline-horizon'){const n=Number(id);if([14,30,90].includes(n)){overviewHorizon=n;overviewWeek=0;selectedTimelineDay='';render();}return;}
    if(action==='timeline-week-next'||action==='timeline-week-prev'){overviewWeek=Math.max(0,Math.min(Math.ceil(overviewHorizon/7)-1,overviewWeek+(action==='timeline-week-next'?1:-1)));selectedTimelineDay='';render();return;}
    if(action==='timeline-day'){const today=localDate(),first=shiftDay(today,overviewWeek*7),last=shiftDay(first,Math.min(7,overviewHorizon-overviewWeek*7)-1);if(id>=first&&id<=last){selectedTimelineDay=id;render();}return;}
    if(action==='timeline-project'){if(state?.projects?.[id]){selectedProjectId=id;tab='projects';render();}return;}
    if(action==='person-task-done'){
      const t=state?.tasks?.[id];if(!t||t.completed||t.archived)return;
      if(state?.taskConflicts?.[id]){toast('Bitte zuerst den Aufgaben-Konflikt auflösen.',true);return;}
      const noteField=[...app.querySelectorAll('.person-point-form[data-kind="task"]')].find(f=>f.dataset.id===id)?.querySelector('textarea');
      const note=noteField?noteField.value.trim():String(t.note||'');
      if(note.length>3000){toast('Notiz darf höchstens 3.000 Zeichen haben.',true);return;}
      await mutate(s=>{s.tasks[id].note=note;s.tasks[id].completed=true;s.tasks[id].updatedAt=stamp();s.taskPending[id]=true;});
      toast('Aufgabe erledigt.');return;
    }
    if(action==='people-tab'){if(['list','map'].includes(id)){peopleTab=id;relationshipMapFocus=false;render();}return;}
    if(action==='rel567-focus'){relationshipMapFocus=!relationshipMapFocus;render();app.querySelector('.rel567-overlay')?.focus?.();return;}
    if(action==='rel567-filter'){if(['all','family','friend','colleague','partner','impulse','project'].includes(id)){relationshipMapFilter=id;render();}return;}
    if(action==='person-quick-log'){if(!state?.people?.[id])return;selectedPersonId=id;quickContactType=quickContactType||'call';render();const form=app.querySelector('#person-contact-form');form?.querySelector('[name="note"]')?.focus?.();return;}
    if(action==='person-pause-toggle'){if(!state?.people?.[id])return;await mutate(s=>{s.people[id]=pauseContact(s.people[id],s.people[id].contactPaused!==true,localDate());});toast(state.people[id].contactPaused?'Kontaktimpulse pausiert.':'Kontaktimpulse wieder aktiv.');return;}
    if(action==='person-project-open'){if(!state?.projects?.[id])return;selectedProjectId=id;tab='projects';render();return;}
    if(action==='person-project-unlink'){if(!state?.people?.[selectedPersonId])return;await mutate(s=>{s.people[selectedPersonId].relatedProjectIds=(s.people[selectedPersonId].relatedProjectIds||[]).filter(x=>x!==id);});toast('Projektverknüpfung gelöst.');return;}
    if(action==='person-select'){selectedPersonId=id;personOpenPointId='';quickContactType='';render();return;}
    if(action==='person-contact-delete'){
      const person=state?.people?.[selectedPersonId]||Object.values(state?.people||{}).find(p=>p.contactLog?.some(x=>x.id===id));
      if(!person?.contactLog?.some(x=>x.id===id)||!confirm('Diesen dokumentierten Kontakt entfernen?'))return;
      await mutate(s=>{s.people[person.id].contactLog=s.people[person.id].contactLog.filter(x=>x.id!==id);});return;
    }
    if(action==='person-review-open'){if(state?.people?.[id]){selectedPersonId=id;tab='people';render();}return;}
    if(action==='person-birthday-clear'){if(!state?.people?.[id])return;await mutate(s=>{s.people[id].birthdayMonthDay='';s.people[id].birthdayYear=null;});toast('Geburtstag aus dem Kontakt entfernt.');return;}
    if(action==='person-remove'){if(!state?.people?.[id]||!confirm('Kontakt und lokale Notiz entfernen? Bereits angelegte Aufgaben bleiben erhalten.'))return;await mutate(s=>{delete s.people[id];});selectedPersonId=null;return;}
    if(action==='person-inbox-open'){if(!state?.records?.[id])return;selectedInboxId=id;tab='inbox';render();return;}
    if(action==='person-task-open'){if(state?.tasks?.[id]){selectedTaskId=id;tab='next';render();}return;}
    if(action==='activity-new'){
      const title=prompt('Neue Aktivität: Titel');if(title===null)return;if(!title.trim()||title.trim().length>100){toast('Titel muss zwischen 1 und 100 Zeichen haben.',true);return;}
      const id='manual-'+crypto.randomUUID(),item={id,title:title.trim(),category:'Freizeit',startedAt:isoLocal(Date.now()/1000),durationMinutes:30,distanceKm:null,note:'',projectId:'',deleted:false};
      await mutate(s=>{s.manualActivities??={};s.manualActivities[id]=item;});activitySelectedId=id;activityTrash=false;render();return;
    }
    if(action==='activity-tab'){activityTrash=id==='trash';activitySelectedId=null;render();return;}
    if(action==='activity-open'){activitySelectedId=id;tab='activity';render();return;}
    if(action==='activity-trash'||action==='activity-restore'){
      const entry=projectActivities(watchSessions,state).find(x=>x.id===id);if(!entry)return;
      await mutate(s=>{if(id.startsWith('manual-')){if(!s.manualActivities?.[id])return;s.manualActivities[id].deleted=action==='activity-trash';}else{s.activityEdits??={};s.activityEdits[id]={...(s.activityEdits[id]||{}),deleted:action==='activity-trash'};}});activitySelectedId=null;return;
    }
    if(action==='activity-purge'){
      const entry=projectActivities(watchSessions,state).find(x=>x.id===id);if(!entry||!entry.deleted)return;
      if(!confirm('Diese Session endgültig und unwiderruflich löschen? Garmin-Messwerte werden dabei ebenfalls serverseitig gelöscht.'))return;
      if(entry.source==='Garmin'){
        if(!authToken){toast('Zum endgültigen Löschen einer Garmin-Session zuerst mit Compass verbinden. Bis dahin im Papierkorb belassen.',true);return;}
        try{await request(config.apiUrl,authToken,'/api/watch/sessions/purge',{method:'POST',body:JSON.stringify({sessionId:id})});}
        catch(ex){toast('Serverseitiges Löschen fehlgeschlagen. Session bleibt im Papierkorb: '+ex.message,true);return;}
        await mutate(s=>{s.activityEdits??={};s.activityEdits[id]={purged:true};});watchSessions=watchSessions.filter(x=>x.id!==id);
      }else{await mutate(s=>{delete s.manualActivities[id];});}
      activitySelectedId=null;toast('Session endgültig entfernt.');return;
    }
    if(action==='life-goal-project-open'){if(!state?.projects?.[id])return;selectedProjectId=id;selectedTaskId=null;tab='projects';render();return;}
    if(action==='life-goal-link'){
      const select=app.querySelector('#life-goal-project-'+id),projectId=String(select?.value||'');
      if(!state?.projects?.[projectId]||!lifeGoals(state).some(g=>g.id===id))return toast('Projekt auswählen.',true);
      await mutate(s=>{const g=s.lifeGoals.find(x=>x.id===id);if(g&&!g.projectIds.includes(projectId)&&g.projectIds.length<30)g.projectIds.push(projectId);});return;
    }
    if(action==='life-goal-area'){
      const area=String(app.querySelector('#life-area-'+id)?.value||'');
      if(area&&!LIFE_AREAS.some(([key])=>key===area))return toast('Lebensbereich nicht bekannt.',true);
      await mutate(s=>{const goal=(s.lifeGoals||[]).find(x=>x.id===id);if(goal)goal.lifeArea=area;});return;
    }
    if(action==='life-goal-toggle'){await mutate(s=>{const g=(s.lifeGoals||[]).find(x=>x.id===id);if(g)g.status=g.status==='active'?'paused':'active';});return;}
    if(action==='life-goal-remove'){
      if(!confirm('Dieses Ziel aus Compass entfernen? Verknüpfte Projekte und Aufgaben bleiben unverändert.'))return;
      await mutate(s=>{s.lifeGoals=(s.lifeGoals||[]).filter(g=>g.id!==id);});return;
    }
    if(action==='occasion-toggle'){occasionOpen=!occasionOpen;render();return;}
    if(['occasion-accept','occasion-dismiss','occasion-reset','occasion-custom'].includes(action)){
      const occasion=allOccasions().find(o=>o.id===id);if(!occasion)return;
      if(action==='occasion-custom'){
        const title=prompt(`Zusätzliche Vorbereitung für ${occasion.title}:`);if(title===null)return;
        if(!title.trim()||title.trim().length>100){toast('Bitte 1–100 Zeichen eingeben.',true);return;}
        const step={id:'custom-'+crypto.randomUUID(),label:title.trim(),daysBefore:Math.max(0,Math.min(70,daysUntil(localDate(),occasion.date))),deadlineBefore:0,minutes:15};
        await mutate(s=>{s.customOccasionSteps??={};s.customOccasionSteps[occasion.id]??=[];s.customOccasionSteps[occasion.id].push(step);});return;
      }
      const step=[...OCCASION_STEPS[occasion.kind],...(state?.customOccasionSteps?.[occasion.id]||[]).filter(validCustomStep)].find(st=>st.id===stepId);if(!step)return;
      const key=occasionStepKey(occasion,step);
      if(action==='occasion-reset'||action==='occasion-dismiss'){await mutate(s=>{s.occasionChoices??={};if(action==='occasion-dismiss')s.occasionChoices[key]='dismissed';else delete s.occasionChoices[key];});return;}
      if(relatedOccasionTask(state,occasion,step)){toast('Dieser Vorbereitungsschritt ist bereits als Aufgabe vorhanden.');return;}
      const task=occasionTask(step,occasion,crypto.randomUUID());if(!validLocalTask(task)){toast('Vorbereitung kann nicht als Aufgabe gespeichert werden.',true);return;}
      await mutate(s=>{s.tasks[task.id]=task;s.taskPending[task.id]=true;s.occasionChoices??={};s.occasionChoices[key]='accepted';});toast('Vorbereitung als reguläre Compass-Aufgabe übernommen.');return;
    }
    if(action==='hold-open-project'){if(!state?.projects?.[id])return;selectedProjectId=id;selectedTaskId=null;tab='projects';render();return;}
    if(action==='calendar-toggle-blocks'){showCalendarBlocks=!showCalendarBlocks;render();return;}
    if(action==='calendar-toggle-hidden'){showHiddenCalendarEvents=!showHiddenCalendarEvents;render();return;}
    if(action==='calendar-rules-toggle'){calendarRulesOpen=!calendarRulesOpen;render();return;}
    if(action==='calendar-overlay-reset'){if(!state?.calendarOverrides?.[id])return;await mutate(s=>{delete s.calendarOverrides[id];});toast('Automatische Zuordnung wiederhergestellt.');return;}
    if(action==='calendar-rule-add'){
      const id='custom-'+crypto.randomUUID();const rule={id,label:'Neue Aktivität',emoji:'✨',category:'Erholung',terms:'neuer begriff',exclude:'',enabled:false};
      await mutate(s=>{s.calendarRules=[...effectiveCalendarRules(s),rule];});return;
    }
    if(action==='calendar-rules-reset'){if(!confirm('Alle bearbeiteten Regeln auf die Standardliste zurücksetzen? Persönliche Termin-Overlays bleiben erhalten.'))return;await mutate(s=>{s.calendarRules=DEFAULT_CALENDAR_RULES.map(r=>({...r}));});return;}
    if(action==='calendar-rule-delete'){if(!confirm('Diese Klassifizierungsregel entfernen?'))return;await mutate(s=>{s.calendarRules=effectiveCalendarRules(s).filter(r=>r.id!==id);});return;}
    if(action==='calendar-rule-up'||action==='calendar-rule-down'){
      await mutate(s=>{const rules=effectiveCalendarRules(s).map(r=>({...r}));const i=rules.findIndex(r=>r.id===id),j=i+(action==='calendar-rule-up'?-1:1);if(i>=0&&j>=0&&j<rules.length){[rules[i],rules[j]]=[rules[j],rules[i]];s.calendarRules=rules;}});return;
    }

    if(action==='agenda-open'){const e=calendarEvents.find(x=>x.id===id);if(e){selectedDay=calendarDate(e);tab='today';}selectedAgendaEventId=id;render();requestAnimationFrame(()=>{const panel=app.querySelector('#agenda-details');if(panel){panel.focus({preventScroll:true});panel.scrollIntoView({block:'nearest',behavior:'smooth'});}});return;}
    if(action==='agenda-close'){selectedAgendaEventId=null;render();return;}
    if(action==='folder-icon-open'){if(state?.projects?.[id]?.kind!=='folder')return;selectedTaskId=null;selectedProjectId=id;render();const e=app.querySelector('.project-properties');if(e){e.open=true;e.scrollIntoView?.({block:'nearest'});}return;}
    if(action==='tree-inspector-close'){selectedTaskId=null;selectedProjectId=null;render();return;}
    if(action==='tree-create-close'){treeCreateKind='';treeCreateParent=null;treeTaskParent=null;render();return;}
    if(action==='tree-add-folder'||action==='tree-add-project'||action==='tree-add-task'||action==='tree-add-subtask'){
      treeCreateKind=action==='tree-add-folder'?'folder':action==='tree-add-project'?'project':'task';
      treeTaskParent=action==='tree-add-subtask'?id:null;
      treeCreateParent=treeTaskParent?state.tasks?.[treeTaskParent]?.projectId:((action==='tree-add-project'||action==='tree-add-task')?id:null);
      if(action==='tree-add-subtask')treeTaskCollapsed.delete(id);
      if(treeCreateParent)projectCollapsed.delete(treeCreateParent);
      render();requestAnimationFrame(()=>app.querySelector('#project-create-form [name="title"],#task-create-form [name="title"]')?.focus());return;
    }
    if(action==='tree-task-toggle'){if(treeTaskCollapsed.has(id))treeTaskCollapsed.delete(id);else treeTaskCollapsed.add(id);render();return;}
    if(action==='tree-task-select'){const t=state.tasks?.[id];if(!t)return;selectedTaskId=id;selectedProjectId=t.projectId;render();return;}
    if(action==='tree-template-use'){
      if(!state.projects?.[id]?.isTemplate)return;
      const name=prompt('Name der neuen Liste',state.projects[id].title+' – '+localDate());if(name===null)return;
      try{let created;await mutate(s=>{created=cloneProjectTemplate(s,id,()=>crypto.randomUUID(),name);});selectedProjectId=created.project.id;selectedTaskId=null;tab='projects';calmNavGroup='plan';projectCollapsed.delete(created.project.id);toast('Neue Liste aus der Vorlage erstellt. Die Vorlage bleibt unverändert.');}catch(ex){toast(ex.message,true);}return;
    }
    if(action==='project-focus-toggle'){projectFocus=!projectFocus;render();return;}
    if(action==='project-toggle-expand'){if(projectCollapsed.has(id))projectCollapsed.delete(id);else projectCollapsed.add(id);render();return;}
    if(action==='task-add-subtask'){
      const t=state?.tasks?.[id];if(!t||!t.projectId)return;
      selectedProjectId=t.projectId;tab='projects';render();
      const input=app.querySelector('#task-create-form [name="parentTaskId"]');if(input)input.value=id;
      app.querySelector('#task-create-form [name="title"]')?.focus();return;
    }
    if(action==='task-move-up'||action==='task-move-down'){
      if(!state?.tasks?.[id])return;
      await mutate(s=>moveOrder(s,'tasks',id,action==='task-move-up'?-1:1));return;
    }
    if(action==='gtd-review-project'){
      if(!state?.projects?.[id])return;
      selectedProjectId=id;selectedTaskId=null;tab='projects';calmNavGroup='plan';render();return;
    }
    if(action==='gtd-repeat-task'){
      const original=state?.tasks?.[id];if(!original?.completed||original.archived)return;
      if(!confirm('Neue Next Action aus dieser abgeschlossenen Aufgabe erstellen? Alte Planned-, Due- und Defer-Daten werden bewusst nicht übernommen.'))return;
      const newId=crypto.randomUUID();
      try{
        const copy=repeatedTask(original,newId,stamp());
        copy.sortOrder=Math.min(1000000,100+Math.max(0,...taskChildren(state,copy.projectId,null).map(x=>x.sortOrder||0)));
        await mutate(s=>{s.tasks[newId]=copy;s.taskPending[newId]=true;});selectedTaskId=newId;toast('Neue Next Action angelegt. Eine automatische Wiederholung wurde nicht eingerichtet.');
      }catch(ex){toast(ex.message,true);}return;
    }
    if(action==='project-select'){
      const p=state?.projects?.[id];if(!p)return;
      // The title must both navigate to the inspector and reveal a collapsed project's children.
      // Today's task toggle is a separate control and must never intercept navigation.
      projectCollapsed.delete(id);selectedProjectId=id;selectedTaskId=null;
      if(p.isTemplate)tab='templates';else if(tab==='templates')tab='projects';
      render();const details=app.querySelector('.project-properties');if(details)details.open=true;return;
    }
    if(action==='project-reviewed'){if(!state?.projects?.[id])return;await mutate(s=>{s.projects[id].reviewedAt=stamp();s.projectPending[id]=true;});toast('Projekt-Review dokumentiert.');return;}
    if(action==='project-conflict-local'||action==='project-conflict-remote'){
      const conflict=state?.projectConflicts[id];if(!conflict)return;
      await mutate(s=>{if(action==='project-conflict-remote'&&conflict.remote){s.projects[id]=conflict.remote;s.projectVersions[id]=conflict.remote.version;delete s.projectPending[id];}
        else {s.projectVersions[id]=conflict.remote?.version||0;s.projectPending[id]=true;}delete s.projectConflicts[id];});return;
    }
    if(action==='calendar-connect'){await connectCalendar();return;}
    if(action==='calendar-refresh'){await fetchCalendar();return;}
    if(action==='project-exchange-export'){
      try{const root=app.querySelector('#project-exchange-scope')?.value||null;const plan=exportProjectPlan(state,root);download(`Compass_Projektplan_${localDate()}.json`,plan);toast('JSON lokal exportiert. Teile mit ChatGPT nur die Daten, die du besprechen möchtest.');}catch(ex){toast(ex.message,true);}return;
    }
    if(action==='project-exchange-cancel'){if(smartHubStage?.kind==='project')smartHubStage=null;exchangePreview=null;exchangeBaseline=null;exchangeRaw='';render();return;}
    if(action==='capture-bulk-open'){captureOverlayOpen=false;captureBulkOpen=true;tab='inbox';render();return;}
    if(action==='capture-bulk-clear'){captureBulkPreview=null;captureBulkRaw='';captureBulkOpen=false;render();return;}
    if(action==='capture-focus'){
      if(!state){captureAfterUnlock=true;document.querySelector('#passphrase')?.focus();return;}
      captureNeedsInitialFocus=!captureOverlayOpen;
      captureOverlayOpen=true;render();return;
    }
    if(action==='capture-close'||action==='capture-close-backdrop'){captureOverlayOpen=false;render();return;}
    if(action==='select-day'){if(!/^\d{4}-\d{2}-\d{2}$/.test(id||''))return;selectedDay=id;calendarMonth=new Date(`${id}T12:00:00`);render();return;}
    if(action==='reset-today'){selectedDay=localDateString(new Date());calendarMonth=new Date();render();return;}
    if(action==='month-prev'||action==='month-next'){calendarMonth=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()+(action==='month-next'?1:-1),1);render();return;}
    if(action==='weather-load'){await loadWeather(weather.city||'Graz');return;}
    if(action==='weather-city'){const city=prompt('Stadt für Wetteranzeige',weather.city);if(city?.trim())await loadWeather(city.trim().slice(0,100));return;}
    if(action==='finance-open-import'){if(financePane==='Portfolio'){financePortfolioTab='settings';render();}const el=app.querySelector('#finance-import-manager');if(el){el.open=true;el.scrollIntoView?.({behavior:'smooth',block:'start'});}return;}
    if(action==='finance-ai-next'){const available=(state?.financeTransactions||[]).filter(t=>accountMatches(t,financeAccount)&&financeAssistEligible(t)).length;financeAiOffset=available?((financeAiOffset+12)%available):0;financeAiSuggestions=[];toast(`Nächster KI-Prüfstapel ab Buchung ${financeAiOffset+1}. Jetzt lokale Modellprüfung starten.`);return;}
    if(action==='finance-ai-local'){
      if(!state?.financeTransactions?.length)return;
      if(!confirm('Maximal 12 unbestätigte Buchungen ausschließlich an dein lokal laufendes LM Studio (127.0.0.1) senden? Texte werden gekürzt und typische Kontoreferenzen maskiert. Keine automatische Übernahme.'))return;
      try{financeAiSuggestions=await askLocalFinanceModel((state.financeTransactions||[]).filter(t=>accountMatches(t,financeAccount)),fetch,financeAiOffset);toast(`${financeAiSuggestions.length} lokale Modellvorschläge zur Prüfung bereit. Keine Buchung geändert.`);}
      catch(ex){toast('Lokale KI nicht erreichbar: '+ex.message+'. LM Studio starten, Modell laden und lokalen API-Server mit CORS aktivieren.',true);}
      return;
    }
    if(action==='finance-ai-apply'||action==='finance-ai-all'){
      const current=financeAssistantView((state?.financeTransactions||[]).filter(t=>accountMatches(t,financeAccount)),financeAiSuggestions).suggestions;
      const selected=action==='finance-ai-all'?financeAssistantPatterns((state?.financeTransactions||[]).filter(t=>accountMatches(t,financeAccount)),30):[current[Number(id)]];
      if(!selected.length||selected.some(x=>!x))return;
      const n=selected.reduce((a,x)=>a+x.ids.length,0);
      if(!confirm(`${n} Buchung(en) gemäß Vorschlag bestätigen? Buchungskategorien werden dadurch als von dir bestätigt gespeichert. Keine automatische Händlerregel.`))return;
      try{await mutate(s=>{let rows=s.financeTransactions||[];for(const item of selected){rows=applyFinanceAssistantGroup(rows,item).rows;}s.financeTransactions=rows;});financeAiSuggestions=[];financeAiOffset=0;financeReviewPage=0;toast(`${n} Buchung(en) bestätigt. Andere Vorgänge unverändert.`);}
      catch(ex){toast('Stapelprüfung: '+ex.message,true);}
      return;
    }
    if(action==='finance-reclassify'){
      let result={changed:0,closed:0,review:0};
      try{await mutate(s=>{s.financeTransactions??=[];result=updateBankSuggestions(s.financeTransactions,s.financeRules||[],(t,r)=>classifyBankTransaction(t,r,s.financePrivateRules||[]));s.financeTransactions=result.rows;});
        financeReviewPage=0;financeLedgerPage=0;toast(`${result.changed} Zuordnungen verbessert · ${result.closed} Fälle abgeschlossen · ${result.review} weiter zur Prüfung. Manuelle Bestätigungen bleiben erhalten.`);
      }catch(e){toast('Vorklassifizierung: '+e.message,true);}return;
    }
    if(action==='finance-cycle-inspect'){financeCycleSelected=id;render();app.querySelector('.fin32-cycle-detail')?.scrollIntoView?.({behavior:'smooth',block:'nearest'});return;}
    if(action==='finance-cycle-clear'){financeCycleSelected='';render();return;}
    if(action==='finance-viz-mode'){financeVisualMode=id;render();return;}
    if(action==='finance-merchant-select'){financeMerchantSelected=id;render();app.querySelector('.fin-merchant-inspector')?.scrollIntoView?.({behavior:'smooth',block:'nearest'});return;}
    if(action==='finance-merchant-close'){financeMerchantSelected='';render();return;}
    if(action==='finance-subcategory-select'){financePane='Buchungen';financeLedgerQuery=id;financeLedgerFilter='all';financeLedgerPage=0;render();return;}
    if(action==='finance-day-select'){financePane='Buchungen';financeLedgerQuery=id;financeLedgerFilter='all';financeLedgerPage=0;render();return;}
    if(action==='finance-category-select'){financeCategorySelected=id;financePane='Ausgaben';render();return;}
    if(action==='finance-category-clear'){financeCategorySelected='';render();return;}
    if(action==='finance-go-ledger'){financePane='Buchungen';financeLedgerQuery=financeCategorySelected;financeLedgerFilter='all';financeLedgerPage=0;render();return;}
    if(action==='finance-account-pick'){financePane='Buchungen';financeAccount=id;financeLedgerPage=0;render();return;}
    if(action==='finance-560-commit-scenario'){
      if(!financeWhatIf)return;
      try{
        const event=validatedPlanEvent({id:'plan-'+crypto.randomUUID(),kind:'expense',day:financeWhatIf.day,label:financeWhatIf.label,amountCents:financeWhatIf.cents});
        if(event.day<localDate()||event.day>=cashflowMonth(localDate(),12)+'-01')throw Error('Szenario ist abgelaufen oder außerhalb des Planungszeitraums.');
        if(!confirm(`Die zusätzliche Ausgabe „${event.label}“ in Höhe von ${(Math.abs(event.cents)/100).toFixed(2)} EUR am ${event.day} als PLANUNG übernehmen? Es findet KEINE Zahlung statt.`))return;
        await mutate(s=>{s.financePlannedCashflows??=[];if(s.financePlannedCashflows.length>=200)throw Error('Maximal 200 geplante Zahlungen.');s.financePlannedCashflows.push(event);});
        financeWhatIf=null;financeWhatIfDraft=null;toast('Szenario in die Finanzplanung übernommen – keine Bankbuchung erzeugt.');
      }catch(ex){toast(ex.message,true);}return;
    }
    if(action==='finance-560-remove-event'){
      if(!(state?.financePlannedCashflows||[]).some(e=>e.id===id))return;
      if(!confirm('Diesen einmaligen Planposten entfernen? Bankbuchungen bleiben unverändert.'))return;
      await mutate(s=>{s.financePlannedCashflows=(s.financePlannedCashflows||[]).filter(e=>e.id!==id);});toast('Planposten entfernt.');return;
    }
    if(action==='finance-pane'){if(FINANCE_TABS.some(p=>p.title===id)){financePane=id;financeReviewPage=0;financeLedgerPage=0;render();}return;}
    if(action==='finance-trip-select'){
      if((state?.financeTrips||[]).some(t=>t.id===id)){financeTripSelected=id;financeTripPage=0;financeTripQuery='';render();}return;
    }
    if(action==='finance-trip-add'||action==='finance-trip-unassign'||action==='finance-trip-exclude'){
      const trip=(state?.financeTrips||[]).find(t=>t.id===financeTripSelected)||(state?.financeTrips||[])[0];
      const t=(state?.financeTransactions||[]).find(t=>t.id===id);
      if(!trip||!t||!travelAttributable(t))return;
      if(action==='finance-trip-add'&&state?.financeTripAssignments?.[id]&&state.financeTripAssignments[id]!==trip.id){toast('Diese Buchung gehört bereits zu einer anderen Reise. Bitte dort zuerst entfernen.',true);return;}
      await mutate(s=>{s.financeTripAssignments??={};s.financeTripExcluded??={};
        if(action==='finance-trip-add'){s.financeTripAssignments[id]=trip.id;delete s.financeTripExcluded[`${trip.id}|${id}`];}
        if(action==='finance-trip-unassign'){if(s.financeTripAssignments[id]===trip.id)delete s.financeTripAssignments[id];}
        if(action==='finance-trip-exclude')s.financeTripExcluded[`${trip.id}|${id}`]=true;
      });
      toast(action==='finance-trip-add'?'Buchung dieser Reise zugeordnet.':action==='finance-trip-exclude'?'Vorschlag für diese Reise ausgeblendet.':'Reisezuordnung aufgehoben.');return;
    }
    if(action==='finance-trip-show-excluded'){
      const trip=(state?.financeTrips||[]).find(t=>t.id===financeTripSelected)||(state?.financeTrips||[])[0];if(!trip)return;
      await mutate(s=>{s.financeTripExcluded??={};for(const k of Object.keys(s.financeTripExcluded))if(k.startsWith(`${trip.id}|`))delete s.financeTripExcluded[k];});toast('Vorschläge wieder eingeblendet.');return;
    }
    if(action==='finance-trip-prev'||action==='finance-trip-next'){
      const trip=(state?.financeTrips||[]).find(t=>t.id===financeTripSelected)||(state?.financeTrips||[])[0];if(!trip)return;
      const count=tripCandidateRows(state.financeTransactions||[],trip,state.financeTripAssignments||{},state.financeTripExcluded||{},financeTripQuery,financeTripMode).length;
      financeTripPage=Math.max(0,Math.min(Math.max(0,Math.ceil(count/20)-1),financeTripPage+(action==='finance-trip-next'?1:-1)));render();return;
    }
    if(action==='finance-trip-delete'){
      const trip=(state?.financeTrips||[]).find(t=>t.id===id);if(!trip)return;
      if(!confirm(`Reise „${trip.name}“ löschen? Die Bankbuchungen und Kategorien bleiben erhalten. Nur die Reisezuordnungen werden entfernt.`))return;
      await mutate(s=>{s.financeTrips=(s.financeTrips||[]).filter(t=>t.id!==id);
        const clean=tripDelete(id,s.financeTripAssignments||{},s.financeTripExcluded||{});
        s.financeTripAssignments=clean.links;s.financeTripExcluded=clean.exclusions;});
      financeTripSelected='';financeTripPage=0;toast('Reise gelöscht. Bankbuchungen bleiben unverändert.');return;
    }


    if(action==='finance-recurring-fixed'||action==='finance-recurring-clear'||action==='finance-recurring-exclude'){
      if(!id||id.length>90)return;
      const value=action==='finance-recurring-fixed'?'fixed':action==='finance-recurring-exclude'?'exclude':null;
      await mutate(s=>{s.financeRecurringRules??={};if(value)s.financeRecurringRules[id]=value;else delete s.financeRecurringRules[id];});
      toast(value==='fixed'?'Als wiederkehrende Kosten bestätigt.':value==='exclude'?'Von Fixkostenvorschlägen ausgeschlossen.':'Bestätigung aufgehoben.');return;
    }
    if(action==='finance-ledger-prev'||action==='finance-ledger-next'){
      const accountRows=(state?.financeTransactions||[]).filter(t=>accountMatches(t,financeAccount));
      const result=financeSearchTransactions(financePeriodInfo(accountRows,financePeriod).rows,{query:financeLedgerQuery,filter:financeLedgerFilter,period:'all',page:financeLedgerPage});
      financeLedgerPage=Math.max(0,Math.min(result.pages-1,financeLedgerPage+(action==='finance-ledger-next'?1:-1)));render();return;
    }
    if(action==='finance-transfer-confirm'){
      const [aId,bId]=String(id||'').split('|');if(!aId||!bId)return;
      const candidate=transferCandidates(state?.financeTransactions||[],1000).find(x=>x.aId===aId&&x.bId===bId);
      if(!candidate)return toast('Dieses Transferpaar ist nicht mehr verfügbar.',true);
      if(!confirm(`Diese beiden Gegenbuchungen (${candidate.accounts.join(' ↔ ')}, ${(candidate.amountCents/100).toFixed(2)} EUR) als internen Transfer bestätigen? Beide bleiben für den Kontoverlauf erhalten, zählen aber weder als Einkommen noch Konsum.`))return;
      await mutate(s=>{const a=s.financeTransactions.find(x=>x.id===aId),b=s.financeTransactions.find(x=>x.id===bId);
       if(!a||!b||a.linkedTransferId||b.linkedTransferId||a.amountCents!==-b.amountCents)throw Error('Transferpaar hat sich verändert.');
       for(const [entry,other] of [[a,b],[b,a]])Object.assign(entry,{category:'Transfer / Eigene Konten',flow:'transfer',needsReview:false,confidence:'confirmed',source:'user',linkedTransferId:other.id,ruleReason:'Von dir bestätigter interner Transfer'});
      });toast('Interner Transfer bestätigt – keine doppelten Ausgaben.');return;
    }
    if(action==='finance-portfolio-market'){if(['flatex','kraken'].includes(id)){financePortfolioMarket=id;render();}return;}
    if(action==='finance-portfolio-tab'){if(['overview','positions','analysis','development','settings'].includes(id)){financePortfolioTab=id;render();}return;}
    if(action==='finance-flatex-sort-direction'){flatexPositionDescending=!flatexPositionDescending;render();return;}
    if(action==='finance-flatex-chart-select'){
      const snapshot=state?.financeFlatexSnapshots||[];
      const holdings=snapshot.find(x=>x.positions?.some(p=>p.isin===id))?.positions||[];
      if(holdings.some(p=>p.isin===id&&p.kind!=='CASH')){
        financePortfolioTab='analysis';financePortfolioMarket='flatex';flatexChartIsin=id;flatexChartTicker='';flatexChartData=null;flatexChartError='';flatexChartBusy=false;render();
        app.querySelector('#fin41-flatex-market')?.scrollIntoView({block:'nearest',behavior:'smooth'});
      }
      return;
    }
    if(action==='finance-flatex-chart-toggle'){
      if(id==='mode')flatexChartSettings={...flatexChartSettings,mode:flatexChartSettings.mode==='candles'?'line':'candles'};
      else if(TECHNICAL_TOGGLES.includes(id))flatexChartSettings={...flatexChartSettings,[id]:!flatexChartSettings[id]};
      render();return;
    }
    if(action==='finance-flatex-chart-zoom'){
      if(['all','120','60'].includes(id))flatexChartSettings={...flatexChartSettings,zoom:id};
      render();return;
    }
    if(action==='finance-flatex-chart-period'){
      if(['1m','3m','1y','2y','3y','5y','10y','max'].includes(id)){flatexChartPeriod=id;flatexChartData=null;flatexChartError='';render();}
      return;
    }
    if(action==='finance-kraken-chart-select'){
      if(Object.hasOwn(state?.krakenPortfolio?.balances||{},id)){
        financePortfolioTab='analysis';financePortfolioMarket='kraken';
        const period=['3y','5y','10y','max'].includes(krakenChartPeriod)&&!['BTC','XXBT','XBT'].includes(id.toUpperCase())?'1m':krakenChartPeriod;
        await loadKrakenCoinChart(id,period);
      }
      return;
    }
    if(action==='finance-kraken-chart-toggle'){
      if(id==='mode')krakenChartSettings={...krakenChartSettings,mode:krakenChartSettings.mode==='candles'?'line':'candles'};
      else if(TECHNICAL_TOGGLES.includes(id))krakenChartSettings={...krakenChartSettings,[id]:!krakenChartSettings[id]};
      render();return;
    }
    if(action==='finance-kraken-chart-zoom'){
      if(['all','120','60'].includes(id))krakenChartSettings={...krakenChartSettings,zoom:id};
      render();return;
    }
    if(action==='finance-kraken-chart-period'){
      if(krakenChartAsset&&['1d','7d','1m','3m','1y','2y','3y','5y','10y','max'].includes(id))await loadKrakenCoinChart(krakenChartAsset,id);
      return;
    }
    if(action==='finance-kraken-public-quotes'){
      await refreshPublicKrakenPrices(true);return;
    }
    if(action==='finance-kraken-public-auto'){
      const checked=Boolean(app.querySelector('#finance-kraken-public-auto')?.checked);
      await mutate(s=>{s.uiPreferences??={};s.uiPreferences.krakenPublicAuto=checked;});
      if(checked)await refreshPublicKrakenPrices(false);
      return;
    }
    if(action==='finance-kraken-bridge-sync'){
      const input=app.querySelector('#finance-kraken-bridge-token');
      const candidate=String(input?.value||'').trim();
      if(candidate){if(!/^[A-Za-z0-9_-]{28,128}$/.test(candidate)){toast('Ungültiger Kopplungscode.',true);return;}krakenBridgeToken=candidate;}
      if(!krakenBridgeToken){toast('Bitte zuerst den Kopplungscode aus dem lokalen Terminal eingeben.',true);return;}
      await syncKrakenBridge(false);return;
    }
    if(action==='finance-kraken-refresh-quotes'){
      const candidate=String(app.querySelector('#finance-kraken-bridge-token')?.value||'').trim();
      if(candidate){if(!/^[A-Za-z0-9_-]{28,128}$/.test(candidate)){toast('Kopplungscode prüfen.',true);return;}krakenBridgeToken=candidate;}
      if(!krakenBridgeToken){toast('Bitte den Kopplungscode des gestarteten lokalen Kraken-Connectors eingeben.',true);return;}
      if(!state?.krakenPortfolio?.balances){toast('Zuerst Kraken-Bestände importieren.',true);return;}
      krakenBridgeBusy=true;render();
      try{const assets=Object.entries(state.krakenPortfolio.balances).filter(([,value])=>Number(value)>0).map(([asset])=>asset);
        if(assets.length>70)throw Error('Zu viele Währungen für einen Kursabruf.');
        const rates=await krakenBridgeRequest('/quotes','POST',{assets});
        let coverage=0,total=0;
        await mutate(s=>{s.krakenPortfolio=updateKrakenQuotes(s.krakenPortfolio,rates);const value=krakenWealthSummary(s.krakenPortfolio);coverage=value.covered;total=value.total;});
        toast(`EUR-Bewertung aktualisiert: ${coverage} von ${total} Kraken-Positionen bepreist.`);
      }catch(err){toast('Kraken-EUR-Kurse: '+err.message,true);}finally{krakenBridgeBusy=false;render();}return;
    }
    if(action==='finance-kraken-cancel'){if(smartHubStage?.kind==='kraken')smartHubStage=null;krakenPreview=null;render();return;}
    if(action==='finance-kraken-confirm'){
      if(!krakenPreview)return;
      try{const incoming=krakenPreview;await mutate(s=>{s.krakenPortfolio=mergeKrakenSnapshot(s.krakenPortfolio,incoming);if(smartHubStage?.kind==='kraken')s.smartImportHistory=committedSmartImport(s.smartImportHistory,smartHubStage.entries,'kraken');markSuccessfulImport(s,'kraken');});if(smartHubStage?.kind==='kraken'){for(const e of smartHubStage.entries)e.duplicate=true;smartHubStage=null;}krakenPreview=null;toast('Kraken-Daten verschlüsselt im lokalen Tresor gespeichert. Bitte die unverschlüsselte JSON-Datei entfernen.');}
      catch(e){toast(e.message,true);}return;
    }
    if(action==='finance-kraken-delete'){
      if(!confirm('Alle lokal importierten Kraken-Bestände und Kraken-Historieneinträge aus dem Compass-Tresor löschen? Bankbuchungen bleiben erhalten.'))return;
      await mutate(s=>{delete s.krakenPortfolio;});krakenPreview=null;toast('Kraken-Importdaten lokal entfernt.');return;
    }
    if(action==='finance-import-cancel'){if(smartHubStage?.kind==='bank')smartHubStage=null;financePreview=null;render();return;}
    if(action==='finance-import-confirm'){
      if(!financePreview?.rows.length)return;
      try{let added=0,duplicates=0;await mutate(s=>{s.financeTransactions??=[];const seen=new Set(s.financeTransactions.map(t=>t.id));for(const t of financePreview.rows){if(seen.has(t.id)){duplicates++;continue;}s.financeTransactions.push(t);seen.add(t.id);added++;}if(smartHubStage?.kind==='bank')s.smartImportHistory=committedSmartImport(s.smartImportHistory,smartHubStage.entries,'bank');markSuccessfulImport(s,'bank');});
        financePreview=null;financePane='Prüfen';financeReviewPage=0;if(smartHubStage?.kind==='bank'){for(const e of smartHubStage.entries)e.duplicate=true;smartHubStage=null;}toast(`${added} Buchungen lokal übernommen. ${duplicates} weitere Duplikate ausgelassen. Unsichere Zahlungen bitte prüfen.`);
      }catch(e){toast(e.message,true);}return;
    }
    if(action==='finance-review-prev'||action==='finance-review-next'){
      const total=financeReviewGroups(state?.financeTransactions||[]).length;
      financeReviewPage=Math.max(0,Math.min(Math.max(0,Math.ceil(total/15)-1),financeReviewPage+(action==='finance-review-next'?1:-1)));render();return;
    }
    if(action==='places-more'){placesListLimit=Math.min(50000,placesListLimit+25);render();return;}
     if(action==='places-map-region'){if(['world','europe','austria','china','australia'].includes(id)){placesMapRegion=id;placesMapZoom=1;render();}return;}
     if(action==='places-map-zoom'){placesMapZoom=Math.max(1,Math.min(5,placesMapZoom+(id==='in'?1:id==='out'?-1:0)));render();return;}
     if(action==='places-select'){selectedPlaceKey=id;render();return;}
    if(action==='places-import-cancel'){if(smartHubStage?.kind==='places')smartHubStage=null;placesPreview=null;render();return;}
    if(action==='places-import-confirm'){
      if(!placesPreview?.visits.length)return;
      try{const incoming=placesPreview.visits;let count=0;
        await mutate(s=>{const m=mergePlaces(s.placesVisits||[],incoming);s.placesVisits=m.visits;count=m.added;if(smartHubStage?.kind==='places'&&!placesPreview?.warnings?.length)s.smartImportHistory=committedSmartImport(s.smartImportHistory,smartHubStage.entries,'places');markSuccessfulImport(s,'places');});
        if(smartHubStage?.kind==='places'){if(!placesPreview?.warnings?.length)for(const e of smartHubStage.entries)e.duplicate=true;smartHubStage=null;}placesPreview=null;selectedPlaceKey='';toast(`${count} neue Aufenthalte lokal gespeichert. Bestehende Einträge wurden nicht verdoppelt.`);
      }catch(ex){toast('Standortimport: '+ex.message,true);}return;
    }
    if(action==='places-clear'){
      if(!confirm('Alle lokalen Aufenthalte und Ortsbezeichnungen unwiderruflich aus diesem Tresor entfernen? Andere Daten bleiben erhalten.'))return;
      await mutate(s=>{delete s.placesVisits;delete s.placesLabels;});
      placesPreview=null;selectedPlaceKey='';toast('Alle lokalen Standortdaten gelöscht.');return;
    }
    if(action==='open-worldmap'){tab='insights';insightTab='places';insightPeriod='all';selectedPlaceKey='';render();return;}
    if(action==='insights-tab'){if(INSIGHT_TABS.some(t=>t.id===id)){tab='insights';calmNavGroup='insights';if(id==='places'&&insightTab!=='places')insightPeriod='all';insightTab=id;render();if(id==='focus'&&authToken){reloadWatchSessions().catch(()=>{});}}return;}
    if(action==='sports-mode'){if(SPORTS_MODES.some(([v])=>v===id)){sportsMode=id;sportsAnchor=localDate();render();}return;}
    if(action==='sports-shift'){if(['-1','1'].includes(id)&&sportsMode!=='all'){sportsAnchor=sportsShiftAnchor(sportsMode,sportsAnchor,Number(id),localDate());render();}return;}
    if(action==='sports-metric'){if(['time','count','distance'].includes(id)){sportsMetric=id;render();}return;}
    if(action==='sports-select'){if(['running','cycling','walking','hiking','ski','swimming','paddling','dancing','disc','martial','sauna','other'].includes(id)){sportsSelected=sportsSelected===id?'':id;render();}return;}
    if(action==='worktime-compare-mode'){if(id==='month'||id==='week'){workCompareMode=id;render();}return;}
    if(action==='worktime-year'){const n=Number(id);if(Number.isInteger(n)&&n>=2023&&n<=new Date().getFullYear()+1){workYear=n;render();}return;}
    if(action==='worktime-confirm'){if(!workPreview)return;const preview=workPreview;await mutate(s=>{s.workTime=mergeWorktime(s.workTime||{},preview);markSuccessfulImport(s,'worktime');if(smartHubStage?.kind==='worktime')s.smartImportHistory=committedSmartImport(s.smartImportHistory,smartHubStage.entries,'worktime');if(!s.workTime.vacation)s.workTime.vacation={balanceHours:192,asOf:'2026-10-20',hoursPerDay:8};});if(smartHubStage?.kind==='worktime'){for(const e of smartHubStage.entries)e.duplicate=true;smartHubStage=null;}workPreview=null;toast(`${preview.days.length} Arbeitszeittage übernommen. Überzeit: ${preview.lastBalance?.hours?.toFixed(2)||'–'} h.`);return;}
    if(action==='insights-week-shift'){
      if(!['-7','7','today'].includes(id))return;
      const today=localDate();const base=insightWeekAnchor||today;
      const shifted=id==='today'?today:new Date(Date.parse(base+'T12:00:00Z')+Number(id)*86400000).toISOString().slice(0,10);
      insightWeekAnchor=shifted>today?today:shifted;render();return;
    }
    if(action==='insights-year-mode'){if(['month','week','day'].includes(id)){insightYearMode=id;render();}return;}
    if(action==='insights-period'){if(INSIGHT_PERIODS.some(([v])=>v===id)){insightPeriod=id;render();}return;}
    if(action==='import-health-range'){importHealthSpan=id==='all'?'all':Number(id)||90;render();return;}
    if(action==='health-import-stop'){if(healthImportJob){healthImportStop=true;healthImportJob.message='Wird nach dem aktuellen Stapel angehalten …';render();}return;}
    if(action==='health-import-cancel'){if(smartHubBusy)return;if(smartHubStage?.kind==='health')smartHubStage=null;healthFilePreview=null;healthImportJob=null;render();return;}
    if(action==='health-import-confirm'){
      if(!healthFilePreview||smartHubBusy)return;
      const staged=healthFilePreview;
      if(smartHubStage?.kind==='health'){
        const queue=planHealthQueue(smartHubStage.entries);
        // Keep the exact first batch from preview; later batches are read lazily.
        const batches=queue.batches;
        if(!batches.length){toast('Keine offenen Archive zur Verarbeitung.');return;}
        smartHubBusy=true;healthImportStop=false;
        healthImportJob={total:queue.total,done:0,ok:0,partial:0,failed:0,batches:0,message:'Archive werden lokal verarbeitet …'};
        let errorMessage='';
        render();
        for(let index=0;index<batches.length;index++){
          if(healthImportStop)break;
          const batch=batches[index];
          let preview;
          try{
            preview=index===0?staged:await inspectHealthFiles(batch.map(e=>e.file));
            const report=healthBatchResult(batch,preview);
            // Persist a complete batch before registering any file hash. A file
            // that fails or is partly decoded is NOT marked complete.
            if(preview.processed){await mutate(s=>{
              commitHealthImport(s,preview);
              if(report.accepted.length)s.smartImportHistory=committedSmartImport(s.smartImportHistory,report.accepted,'health');
            });}
            for(const e of report.accepted)e.duplicate=true;
            healthImportJob.done+=batch.length;
            healthImportJob.ok+=report.accepted.length;
            healthImportJob.partial+=report.partial.length;
            healthImportJob.failed+=report.failed.length;
            if(report.errors.length)healthImportIssues.push(...report.errors.slice(0,25));
            healthImportJob.batches++;
            healthImportJob.message=`${healthImportJob.done} von ${healthImportJob.total} Archiven geprüft · ${healthImportJob.ok} erfolgreich gespeichert · ${healthImportJob.partial+healthImportJob.failed} erneut zu prüfen`;
          }catch(ex){errorMessage=String(ex.message||ex);healthImportIssues.push(`Stapel ${index+1}: ${errorMessage}`);healthImportJob.message=`Beim Stapel ${index+1} angehalten: ${errorMessage}`;break;}
          render();
          // Allow the Stop control and progress display to respond between batches.
          await new Promise(resolve=>setTimeout(resolve,0));
        }
        smartHubBusy=false;
        const c=healthImportCoverage(state?.healthImports||{});
        const remaining=smartHubEntries.filter(e=>e.kind==='health'&&!e.duplicate).length;
        smartHubNotice=`Gesundheitsimport${healthImportStop?' angehalten':''}: ${healthImportJob.ok} Archive vollständig verarbeitet, ${healthImportJob.partial+healthImportJob.failed} mit Fehlern, ${remaining} noch offen. Im Vault: Stress ${c.stress.first||'–'} bis ${c.stress.last||'–'}, Schlaf ${c.nights.first||'–'} bis ${c.nights.last||'–'}.${errorMessage?` Fehler: ${errorMessage}`:''}`;
        healthImportJob=null;healthFilePreview=null;smartHubStage=null;insightWellnessDay='';
        toast(smartHubNotice,Boolean(errorMessage));return;
      }
      try{let result=null;await mutate(s=>{const before=healthImportCoverage(s.healthImports||{});commitHealthImport(s,staged);const after=healthImportCoverage(s.healthImports||{});result={addedStress:after.stress.count-before.stress.count,latestStress:after.stress.last};});healthFilePreview=null;insightWellnessDay='';toast(`Gesundheitsimport bestätigt: ${result.addedStress} neue Stresspunkte · im Vault bis ${result.latestStress||'–'}.`);}
      catch(ex){toast(ex.message,true);}return;
    }
    if(action==='health-import-clear'){
      if(!confirm('Alle lokal importierten Garmin- und Fitdays-Messungen auf diesem Gerät löschen? Health-Connect-Daten in der Cloud bleiben unverändert.'))return;
      await mutate(s=>{delete s.healthImports;});selectedGarminNight='';healthFilePreview=null;toast('Lokale Garmin- und Fitdays-Daten gelöscht.');return;
    }
    if(action==='lock'){feelingOverlayOpen=false;feelingDraft=newFeelingDraft();captureDraft={title:'',note:'',noteOpen:false};dashboardCaptureDraft='';smartHubEntries=[];smartHubStage=null;smartHubFolders.health=null;smartHubFolders.finance=null;delete smartHubFolderStatus.health;delete smartHubFolderStatus.finance;healthFilePreview=null;selectedGarminNight='';clearTimeout(syncTimer);calendarToken='';calendarEvents=[];calendarExpires=0;healthDays=[];healthDevices=[];healthPairCode='';healthError='';widgetPairCode='';widgetDevices=[];vault.lock();state=null;authToken='';currentUser='';notice='';error='';render();return;}
    if(action==='widget-pair'){if(!authToken)return;try{const out=await request(config.apiUrl,authToken,'/api/widget/pair/start',{method:'POST'});widgetPairCode=out.code;widgetConnectError='';render();}catch(ex){widgetConnectError=ex.message;render();}return;}
    if(action==='widget-revoke'){if(!authToken||!confirm('Widget-Gerät wirklich trennen? Der Widget-Zugang wird sofort ungültig.'))return;try{await request(config.apiUrl,authToken,'/api/widget/device/revoke',{method:'POST',body:JSON.stringify({deviceHash:id})});await reloadWidgetDevices();}catch(ex){widgetConnectError=ex.message;render();}return;}
    if(action==='health-pair'){
      try{const result=await request(config.apiUrl,authToken,'/api/health/pair/start',{method:'POST'});healthPairCode=result.code;healthError='';render();}
      catch(ex){healthError=ex.message;render();}return;
    }
    if(action==='health-refresh'){await reloadHealth();return;}
    if(action==='health-delete-all'){if(!authToken||!confirm('Alle in Cloudflare gespeicherten Gesundheits-Tageswerte unwiderruflich löschen? Auf dem Samsung bleiben die ursprünglichen Health-Connect-Daten erhalten.'))return;try{await request(config.apiUrl,authToken,'/api/health/data/delete',{method:'POST'});await reloadHealth();toast('Gespeicherte Gesundheitsdaten gelöscht.');}catch(ex){toast(ex.message,true);}return;}
    if(action==='health-revoke'){
      if(!confirm('Health-Connect-Gerät wirklich trennen? Bereits gespeicherte Tageswerte bleiben im Dashboard.'))return;
      try{await request(config.apiUrl,authToken,'/api/health/device/revoke',{method:'POST',body:JSON.stringify({deviceHash:id})});await reloadHealth();}catch(ex){healthError=ex.message;render();}return;
    }
    if(action==='discovery-prompt-regional'||action==='discovery-prompt-travel'){
      try{await navigator.clipboard.writeText(action.endsWith('regional')?discoveryPromptRegional:discoveryPromptTravel);toast('Rechercheprompt kopiert.');}catch{toast('Kopieren nicht möglich.',true);}return;
    }
    if(action==='discovery-clear'){
      if(!confirm('Alle importierten Veranstaltungen geräteübergreifend entfernen? Dies kann nicht rückgängig gemacht werden.'))return;
      await mutate(st=>removeEvents(st));toast('Löschung wird mit deiner Compass-Cloud synchronisiert.');return;
    }
    if(action==='discovery-capture'){
      const entry=state?.discoveredEvents?.find(e=>eventKey(e)===id);if(!entry)return;
      await addCapture(entry.title,`${entry.date} · ${entry.venue}, ${entry.city}\nQuelle: ${entry.sourceUrl}`);toast('Veranstaltung in der Inbox vorgemerkt.');return;
    }
    if(action==='watch-pair'){
      try{const d=await request(config.apiUrl,authToken,'/api/watch/pair/start',{method:'POST'});watchPairCode=d.code;watchPairExpires=d.expiresAt;watchError='';render();}
      catch(ex){watchError='Kopplung derzeit nicht bereit: '+ex.message;render();}return;
    }
    if(action==='watch-refresh'){await reloadWatchSessions();return;}
    if(action==='watch-revoke'){
      if(!confirm('Uhr wirklich trennen? Noch nicht synchronisierte Sessions bleiben lokal auf der Uhr, lassen sich aber erst nach erneuter Kopplung hochladen.'))return;
      try{await request(config.apiUrl,authToken,'/api/watch/device/revoke',{method:'POST',body:JSON.stringify({deviceHash:id})});await reloadWatchSessions();}
      catch(ex){watchError='Gerät konnte nicht getrennt werden: '+ex.message;render();}return;
    }
    if(action==='sync'){await syncNow();return;}
    if(action==='logout'){
      const previous=authToken;authToken='';currentUser='';calendarToken='';calendarEvents=[];calendarExpires=0;healthDays=[];healthDevices=[];healthPairCode='';healthError='';widgetPairCode='';widgetDevices=[];clearTimeout(syncTimer);
      await vault.clearSession();
      try {if(previous)await request(config.apiUrl,previous,'/api/session',{method:'DELETE'});
        toast('Compass-Sitzung auf diesem Gerät beendet. Lokale Daten bleiben geschützt.');}
      catch {toast('Lokal abgemeldet. Serverseitiger Widerruf gerade nicht erreichbar – bitte bei Gelegenheit erneut verbinden und abmelden.',true);}
      return;
    }
    if(action==='task-rename-start'){
      if(!state?.tasks?.[id]||state.tasks[id].archived||state.projects?.[state.tasks[id].projectId]?.isTemplate)return;
      if(state.taskConflicts?.[id]){toast('Zuerst den Änderungskonflikt dieser Aufgabe klären.',true);return;}
      inlineEditingTaskId=id;render();requestAnimationFrame(()=>{const field=app.querySelector('.v559-rename-input');field?.focus();field?.select();});return;
    }
    if(action==='task-rename-cancel'){inlineEditingTaskId=null;render();return;}
    if(action==='task-rename-save'){
      const existing=state?.tasks?.[id];const editor=[...app.querySelectorAll('.v559-rename-editor')].find(el=>el.dataset.taskId===id);
      const title=inspectorTitle(editor?.querySelector('input')?.value);
      if(!existing||existing.archived||state.projects?.[existing.projectId]?.isTemplate)return;
      if(state.taskConflicts?.[id]){toast('Zuerst den Änderungskonflikt dieser Aufgabe klären.',true);return;}
      if(!title){toast('Titel muss zwischen 1 und 180 Zeichen lang sein.',true);editor?.querySelector('input')?.focus();return;}
      if(title!==existing.title){await mutate(s=>{s.tasks[id].title=title;s.tasks[id].updatedAt=stamp();s.taskPending[id]=true;});}
      inlineEditingTaskId=null;render();return;
    }
    if(action==='task-select'){if(!state?.tasks?.[id])return;selectedTaskId=id;render();return;}
    if(action==='flag-existing'){if(!state?.tasks?.[id])return;await mutate(s=>{s.tasks[id].flagged=true;s.taskPending??={};s.taskPending[id]=true;});return;}
    if(action==='inbox-flag'){const r=state?.records?.[id];if(!r||r.deleted||r.tags?.includes('dreams'))return;let tags;try{tags=setInboxFlag(r.tags,!inboxFlagged(r));}catch(ex){toast(ex.message,true);return;}selectedInboxId=id;await mutate(s=>{const record=s.records[id];record.tags=tags;record.updatedAt=stamp();s.pending.push(makeMutation(record));});return;}
    if(action==='task-progress-plus'||action==='task-progress-minus'){
      const t=state?.tasks?.[id];if(!t||t.archived||t.completed||state.projects?.[t.projectId]?.isTemplate)return;
      const next=advanceTaskCounter(t,action==='task-progress-plus'?1:-1);
      if(next===null||next===(t.progressCurrent??0))return;
      await mutate(s=>{s.tasks[id].progressCurrent=next;s.tasks[id].updatedAt=stamp();s.taskPending[id]=true;});
      if(next===t.progressTarget)toast('Stückziel erreicht! Die Aufgabe bleibt offen, bis du sie abschließt.');
      return;
    }
    if(action==='task-flag'){if(!state?.tasks?.[id])return;await mutate(s=>{s.tasks[id].flagged=!s.tasks[id].flagged;s.taskPending[id]=true;});return;}
    if(action==='task-toggle'){if(!state?.tasks?.[id])return;if(state.projects?.[state.tasks[id].projectId]?.isTemplate){toast('Vorlage bleibt unverändert. Erstelle eine neue Liste daraus.');return;}await mutate(s=>{s.tasks[id].completed=!s.tasks[id].completed;s.tasks[id].updatedAt=stamp();s.taskPending[id]=true;});return;}
    if(action==='task-archive'){if(!confirm('Aufgabe archivieren?'))return;await mutate(s=>{s.tasks[id].archived=true;s.tasks[id].updatedAt=stamp();s.taskPending[id]=true;});selectedTaskId=null;return;}
    if(action==='task-conflict-local'||action==='task-conflict-remote'){
       const conflict=state.taskConflicts[id];if(!conflict)return;
       await mutate(s=>{if(action==='task-conflict-remote'&&conflict.remote){s.tasks[id]=conflict.remote;s.taskVersions[id]=conflict.remote.version;delete s.taskPending[id];}
         else{s.taskVersions[id]=conflict.remote?.version||0;s.taskPending[id]=true;}
         delete s.taskConflicts[id];});return;
    }
    if(action==='select-inbox'){if(!state?.records[id]||state.records[id].deleted)return;selectedInboxId=id;tab='inbox';render();return;}
    if(action==='edit'){
      const current=state.records[id];if(!current||current.deleted)return;
      const value=prompt('Inbox-Eintrag bearbeiten',current.title);if(value===null)return;
      if(!value.trim()||value.trim().length>1000){toast('1–1000 Zeichen erforderlich.',true);return;}
      await mutate(s=>{const r=s.records[id];r.title=value.trim();r.updatedAt=stamp();s.pending.push(makeMutation(r));});return;
    }
    if(action==='remove'){
      if(!confirm('Diesen Inbox-Eintrag archivieren?'))return;
      await mutate(s=>{const r=s.records[id];r.deleted=true;r.updatedAt=stamp();s.pending.push(makeMutation(r));});return;
    }
    if(action==='export-encrypted'){download(`compass-vault-${new Date().toISOString().slice(0,10)}.json`,await vault.exportEncrypted());toast('Verschlüsseltes Backup erstellt.');return;}
    if(action==='export-json'){if(!confirm('Klartext-Export erstellen? Die Datei ist NICHT verschlüsselt.'))return;download('compass-export-unencrypted.json',state);toast('JSON-Export erstellt. Sicher aufbewahren.');return;}
    if(action==='resolve-remote'||action==='resolve-local'){
      const c=state.conflicts.find(x=>x.id===id);if(!c)return;
      await mutate(s=>{
        s.conflicts=s.conflicts.filter(x=>x.id!==id);
        if(action==='resolve-remote') {
          if(c.remote){s.records[id]={id,title:c.remote.title,note:c.remote.note,tags:c.remote.tags||[],deleted:c.remote.deleted,updatedAt:c.remote.updatedAt};s.serverVersions[id]=c.remote.version;}
          else {delete s.records[id];delete s.serverVersions[id];}
        }else {
          s.serverVersions[id]=c.remote?.version||0;
          if(sameItemContent(s.records[id],c.remote)) {
            s.pending=s.pending.filter(x=>x.id!==id);
          }else {s.pending.push(makeMutation(s.records[id]));}
        }
      });toast('Konfliktentscheidung gespeichert.');return;
    }
  }catch(ex){toast(ex.message,true);}
}
let googleScriptPromise=null;
async function ensureGoogle() {
  if(window.google?.accounts?.id)return;
  if(!googleScriptPromise)googleScriptPromise=new Promise((resolve,reject)=>{
    const script=document.createElement('script');script.src='https://accounts.google.com/gsi/client';script.async=true;
    script.onload=resolve;script.onerror=()=>reject(new Error('Google Sign-In konnte nicht geladen werden.'));document.head.append(script);
  });
  await googleScriptPromise;
}
async function renderGoogleButton() {
  try {
    await ensureGoogle();
    const root=document.getElementById('google-button');if(!root||authToken)return;
    window.google.accounts.id.initialize({client_id:config.googleClientId,callback:async response=>{
      try {
        // Exchange the short-lived Google ID token for a revocable 30-day Compass session.
        const session=await request(config.apiUrl,response.credential,'/api/session',{method:'POST'});
        await vault.saveSession(session);
        authToken=session.token;currentUser=session.email;
        toast('Compass verbunden. Die Anmeldung bleibt im verschlüsselten Tresor gespeichert.');
        await syncNow();
      }catch(ex){authToken='';currentUser='';toast(ex.status===401?'Dieses Google-Konto ist nicht freigeschaltet.':ex.message,true);}
    },auto_select:false});
    window.google.accounts.id.renderButton(root,{theme:'outline',size:'large',type:'standard',text:'signin_with',shape:'rectangular'});
  }catch(ex){toast(ex.message,true);}
}
async function syncProjects(){
 prepareTasks(state);
 for(const id of Object.keys(state.projectPending).sort((a,b)=>{const depth=id=>{let n=0,c=state.projects[id],seen=new Set();while(c?.parentId&&n<50&&!seen.has(c.id)){seen.add(c.id);c=state.projects[c.parentId];n++;}return n;};return depth(a)-depth(b);}).slice(0,75)){
  if(state.projectConflicts[id])continue;
  const project=state.projects[id];if(!project){delete state.projectPending[id];continue;}
  const before=JSON.stringify(projectPlain(project));
  try{
   const data=await request(config.apiUrl,authToken,'/api/projects',{method:'POST',body:JSON.stringify({...projectPlain(project),baseVersion:state.projectVersions[id]||0})});
   if(data.project){state.projectVersions[id]=data.project.version;if(before===JSON.stringify(projectPlain(state.projects[id]))){state.projects[id]=data.project;delete state.projectPending[id];}}
  }catch(ex){
   if(ex.status!==409)throw ex;
   const remote=(await request(config.apiUrl,authToken,'/api/projects')).projects?.find(p=>p.id===id)||null;
   if(remote&&sameProject(project,remote)){state.projectVersions[id]=remote.version;if(before===JSON.stringify(projectPlain(state.projects[id]))){state.projects[id]=remote;delete state.projectPending[id];}}
   else {state.projectConflicts[id]={remote};delete state.projectPending[id];}
  }
  await persist();
 }
 const data=await request(config.apiUrl,authToken,'/api/projects');
 mergeProjectSnapshot(state,data.projects||[]);await persist();
}
async function syncTasks(){
  prepareTasks(state);
  // Keep local task mutations until the server confirms them.
  for(const id of Object.keys(state.taskPending).sort((a,b)=>{const depth=id=>{let n=0,c=state.tasks[id],seen=new Set();while(c?.parentTaskId&&n<50&&!seen.has(c.id)){seen.add(c.id);c=state.tasks[c.parentTaskId];n++;}return n;};return depth(a)-depth(b);}).slice(0,75)){
    if(state.taskConflicts[id])continue;
    const task=state.tasks[id];if(!task){delete state.taskPending[id];continue;}
    const before=JSON.stringify(taskPlain(task));
    try{
      const data=await request(config.apiUrl,authToken,'/api/tasks',{method:'POST',body:JSON.stringify({...taskPlain(task),baseVersion:state.taskVersions[id]||0})});
      if(data.task){state.taskVersions[id]=data.task.version;if(before===JSON.stringify(taskPlain(state.tasks[id]))){state.tasks[id]=data.task;delete state.taskPending[id];}}
    }catch(ex){
      if(ex.status!==409)throw ex;
      const snapshot=await request(config.apiUrl,authToken,'/api/tasks');const remote=(snapshot.tasks||[]).find(t=>t.id===id)||null;
      if(remote&&sameTask(task,remote)){state.taskVersions[id]=remote.version;if(before===JSON.stringify(taskPlain(state.tasks[id]))){state.tasks[id]=remote;delete state.taskPending[id];}}
      else{state.taskConflicts[id]={remote};delete state.taskPending[id];}
    }
    await persist();
  }
  const snapshot=await request(config.apiUrl,authToken,'/api/tasks');
  mergeTaskSnapshot(state,snapshot.tasks||[]);await persist();
}
async function syncEvents(){
 eventState(state);
 // Pull first so a previously imported catalog is not re-uploaded as a duplicate on a second device.
 const initial=await request(config.apiUrl,authToken,'/api/events');
 mergeEventSnapshot(state,initial.events||[]);
 // Existing 0.5.2 event imports are promoted to the new durable sync queue exactly once.
 for(const e of state.discoveredEvents){const k=eventKey(e);if(state.eventVersions[k]===undefined&&!state.eventPending[k]&&!state.eventConflicts[k])state.eventPending[k]=true;}
 await persist();
 let rounds=0;
 while(Object.keys(state.eventPending).length&&rounds++<100){
  const batch=pendingEventBatch(state,25);if(!batch.length)break;
  const result=await request(config.apiUrl,authToken,'/api/events/batch',{method:'POST',body:JSON.stringify({events:batch})});
  acknowledgeEventBatch(state,batch,result);await persist();
 }
 const remote=await request(config.apiUrl,authToken,'/api/events');
 mergeEventSnapshot(state,remote.events||[]);
 prunePastEvents(state,localDate());await persist();
}
async function syncReview(){
  const remote=await request(config.apiUrl,authToken,'/api/review');
  // On a new device, load the existing cloud review instead of creating a competing copy.
  const local=state.weeklyReview;
  if(!validReview(local)||(!state.reviewPending&&!state.reviewVersion&&local.done.length===0&&!local.completedAt&&remote.progress)){
    if(remote.progress&&validReview(remote.progress)){state.weeklyReview=remote.progress;state.reviewVersion=remote.version;state.reviewPending=false;state.reviewConflict=null;await persist();render();}
    return;
  }
  if(!state.reviewPending){
    if(remote.version>(state.reviewVersion||0)&&remote.progress&&validReview(remote.progress)){
      state.weeklyReview=remote.progress;state.reviewVersion=remote.version;state.reviewConflict=null;await persist();render();
    }return;
  }
  if(state.reviewConflict)return;
  if(remote.version!==(state.reviewVersion||0)){
    state.reviewConflict={progress:remote.progress,version:remote.version};await persist();render();return;
  }
  const before=JSON.stringify(local);
  try{
    const saved=await request(config.apiUrl,authToken,'/api/review',{method:'POST',body:JSON.stringify({progress:local,baseVersion:state.reviewVersion||0})});
    state.reviewVersion=saved.version;
    if(JSON.stringify(state.weeklyReview)===before)state.reviewPending=false;
    await persist();
  }catch(ex){if(ex.status===409){const latest=await request(config.apiUrl,authToken,'/api/review');state.reviewConflict={progress:latest.progress,version:latest.version};await persist();render();return;}throw ex;}
}
async function syncNow() {
  if(!state||!authToken||busy||!navigator.onLine)return;
  clearTimeout(syncTimer);syncTimer=null;
  busy=true;render();
  try {
    const health=await request(config.apiUrl,authToken,'/api/health');
    assertCompatibleWorker(health);
    const stale=prunePastEvents(state,localDate());if(stale)await persist();
    // No concurrent writes while in flight: mutations queue before a request starts.
    let rounds=0;
    while(state.pending.length&&rounds++<100) {
      const batch=nextBatch(state.pending,25).map(m=>({...m,baseVersion:state.serverVersions[m.id]||0}));
      const data=await request(config.apiUrl,authToken,'/api/sync/push',{
        method:'POST',body:JSON.stringify({mutations:batch})});
      let processed=false;
      for(const result of data.results||[]) {
        if(result.status==='error'||result.status==='rejected')throw new Error('Mutation konnte nicht geschrieben werden.');
        if(result.status==='applied'||result.status==='duplicate'||result.status==='conflict')processed=true;
        applyResult(state,result);
      }
      await persist();
      if(!processed)break;
    }
    let fetches=0;
    while(fetches++<100) {
      const data=await request(config.apiUrl,authToken,`/api/sync/pull?cursor=${state.cursor}`);
      mergePulled(state,data.changes||[]);state.cursor=data.cursor;
      await persist();
      if(!data.hasMore)break;
    }
    const fixed=pruneIdenticalConflicts(state);if(fixed)await persist();
    await syncProjects();
    await syncTasks();
    await syncEvents();
    await syncReview();
    if(state?.privateDeviceMirror?.mode==='source')await publishPrivateMirror();
    else if(state?.privateDeviceMirror?.mode==='receiver')await receivePrivateMirror();
    lastSyncAt=Date.now();
    notice=state.conflicts.length?'Synchronisiert – bitte Konflikte prüfen.':'Synchronisiert. Alle verfügbaren Änderungen abgeglichen.';
    error='';
  }catch(ex){
    syncResyncRequested=false;
    error=ex.status===401?'Google-Sitzung abgelaufen. Bitte erneut anmelden.':`Synchronisation: ${ex.message}`;
    if(ex.status===401){authToken='';currentUser='';await vault.clearSession().catch(()=>{});}
  }finally{
    busy=false;render();
    const retry=syncResyncRequested&&Boolean(state?.pending.length||Object.keys(state?.taskPending||{}).length||Object.keys(state?.projectPending||{}).length||Object.keys(state?.eventPending||{}).length||state?.reviewPending)&&Boolean(authToken)&&navigator.onLine&&!error;
    syncResyncRequested=false;
    if(retry)scheduleSync(0);
  }
}
document.addEventListener('keydown',ev=>{
  const target=ev.target;
  if((ev.key==='Enter'||ev.key===' ')&&target?.matches?.('.fin32-cycle-hit,.fin32-pattern-card')){ev.preventDefault();runAction(target.dataset.action,target.dataset.id);return;}
  if((ev.key==='Enter'||ev.key===' ')&&target?.matches?.('.lbr672-chart-node')){ev.preventDefault();runAction('balance-select',target.dataset.id);return;}
  const typing=target instanceof HTMLElement && (['INPUT','TEXTAREA','SELECT'].includes(target.tagName)||target.isContentEditable);
  if((ev.ctrlKey||ev.metaKey)&&ev.key.toLowerCase()==='k'){
    ev.preventDefault();runAction('capture-focus');return;
  }
  if(ev.key==='Tab'&&feelingOverlayOpen){const modal=app.querySelector('#fw65-dialog');const focusables=[...(modal?.querySelectorAll('button:not([disabled]),input:not([disabled]),textarea:not([disabled])')||[])];if(focusables.length){const i=focusables.indexOf(document.activeElement);if(ev.shiftKey&&(i<=0)){ev.preventDefault();focusables.at(-1).focus();}else if(!ev.shiftKey&&(i===focusables.length-1||i===-1)){ev.preventDefault();focusables[0].focus();}}return;}
  if(ev.key==='Escape'&&feelingOverlayOpen){ev.preventDefault();feelingOverlayOpen=false;render();return;}
  if(ev.key==='Escape'&&captureOverlayOpen){ev.preventDefault();captureOverlayOpen=false;render();return;}
  if(!typing&&!ev.ctrlKey&&!ev.altKey&&!ev.metaKey&&ev.key.toLowerCase()==='n'&&state){ev.preventDefault();runAction('capture-focus');}
});
window.addEventListener('online',()=>{render();if(authToken)scheduleSync(0);});
document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='visible'&&authToken&&state&&
    (state.pending.length||Object.keys(state.taskPending||{}).length||Object.keys(state.eventPending||{}).length||state.reviewPending||Date.now()-lastSyncAt>=SYNC_INTERVAL_MS))scheduleSync(1000);
});
setInterval(()=>{
  if(state&&authToken&&navigator.onLine&&document.visibilityState==='visible'&&
     Date.now()-lastSyncAt>=SYNC_INTERVAL_MS&&!busy)scheduleSync(0);
},60000);
window.addEventListener('offline',render);
for(const e of ['pointerdown','keydown','touchstart'])document.addEventListener(e,()=>{lastActivity=Date.now();},{passive:true});
setInterval(()=>{if(state&&Date.now()-lastActivity>15*60*1000){feelingOverlayOpen=false;feelingDraft=newFeelingDraft();smartHubEntries=[];smartHubStage=null;smartHubFolders.health=null;smartHubFolders.finance=null;delete smartHubFolderStatus.health;delete smartHubFolderStatus.finance;clearTimeout(syncTimer);vault.lock();state=null;authToken='';currentUser='';calendarToken='';calendarEvents=[];calendarExpires=0;notice='Nach 15 Minuten Inaktivität automatisch gesperrt.';render();}},60000);
(async()=>{
  try{config=await fetch(`${import.meta.env.BASE_URL}runtime-config.json`,{cache:'no-store'}).then(r=>r.json());}
  catch{config={};}
  hasVault=await vault.exists();if(bootCapture&&hasVault){captureAfterUnlock=true;}render();if(bootCapture)history.replaceState(null,'',location.pathname);
})().catch(ex=>{app.innerHTML=`<div class="fatal">Lokaler Speicher nicht verfügbar: ${h(ex.message)}. Bitte einen sicheren Browserkontext verwenden.</div>`;});
