import {capacityForecast,capacitySettings} from './capacity-engine-v44.js';
import {familyEvents,familySuggestions,familyRules,familyPersonPanel,familyTodayPanel,familyTodayObservations,familyAccept,familyAcceptProject,familyChoose} from './family-radar-v5775931.js';
import {todayBirthdayHighlights,todayBirthdayPanel} from './today-birthdays-v5775940255.js';
import './today-birthdays-v5775940255.css';
import './family-radar-v5775931.css';
import {familyForecastEntries37,familyForecastPanel37,familyStudySlots37,familyCreateStudy37} from './family-planning-v5775937.js';
import './family-planning-v5775937.css';
import {balancePerspective38} from './life-balance-perspectives-v5775938.js';
import {inspirationRatingModal,inspirationInsightsView,inspirationEntry,addInspirationEntry} from './task-inspiration-v57759402523.js';
import './task-inspiration-v57759402523.css';
import './compass-25-23-radar.css';
import './life-balance-perspectives-v5775938.css';
import {locationContextPanel39,locationSettings39,zone39,classifyPosition39,contextTasks39,effectiveContext39} from './location-context-v5775939.js';
import './location-context-v5775939.css';
import {contextNextPanel40,dismissTask40,MINUTES40,ENERGY40} from './context-next-v5775940.js';
import './context-next-v5775940.css';
import './compass59401-navigation-fixes.css';
import {locationCycle46,nextLocationContext46} from './location-cycle-v57759406.js';
import './location-cycle-v57759406.css';
import {syncProjectWithTrash410} from './project-sync-recovery-v577594010.js';
import {todayOrdered49,todayMove49,taskLifecycleView49,taskLife49,TASK_TRASH_TAG49,TASK_PURGED_TAG49} from './compass-workspace-v57759409.js';
import './compass-workspace-v57759409.css';
import {duplicateProject48,visibleInProjectTree48,projectVaultPanel48,canPurgeProject48,childCount48,taskCount48,redactProject48,projectIcon48} from './project-lifecycle-v57759408.js';
import './project-lifecycle-v57759408.css';
import {coachTrialStart48,coachTrialFinish48} from './strength-nof1-v57759408.js';
import {deadlineIntelligence} from './deadline-intelligence-v45.js';
import {proactivePlan} from './proactive-planner-v47.js';
import {dayPlanBlocks,dayCandidates,dayDropTargets,placeDayBlock,updateDayBlock,dayPlanStatus} from './daily-planning-v48.js';
import {yesterdayIntentions,previousLocalDay} from './yesterday-intentions-v57710.js';
import {suggestedFollowupDates,nextAustrianWorkday,isAustrianWorkday,austrianPublicHoliday,waitingSourceId,visibleWaitingNote,retainWaitingLink,currentFollowupFor,makeWaitingFollowup,waitingFollowupsDue,postponeWaitingFollowup} from './waiting-followup-v57715.js';
import {taskFriction,stripTaskFriction,taskNoteWithFriction,OVERCOMING,EFFORT,BLOCKERS} from './task-friction-v57715.js';
import './waiting-followup-v57715.css';
import './stress-day-timeline-v57710.css';
import {needsDateDecision} from './urgency-intelligence-v48.js';
import {exportProjectPlan,parseProjectPlan,projectImportPreview,applyProjectPlan} from './project-exchange-v45.js';
import {technicalSettings,TECHNICAL_TOGGLES,wireTechnicalCrosshair} from './kraken-technical-v40.js';
import {parseCaptureLines,parseAiCaptureJson,capturePreview,captureInboxRecord,CAPTURE_KINDS} from './capture-triage-v26.js';
import {moveProjectHierarchy,moveTaskHierarchy,cloneProjectTemplate,taskDescendants,isTemplateProject} from './project-workspace-v27.js';
import {isShoppingTemplate,isShoppingList,shoppingLists,shoppingProgress,instantiateShoppingList,archiveShoppingList,restoreShoppingList} from './shopping-lists-v57713.js';
import './watch-mobile-project-05124.css';
import './watch-people-privacy-05124.css';
import './shopping-lists-v57713.css';
import {inboxTaskDraft} from './inbox-promotion-v27.js';
import {inboxTodayTaskDraft} from './inbox-today-v557.js';
import {parseOutlookFlags,outlookCandidates,outlookTask,outlookInboxRecord,chooseOutlookItems,outlookBridgeUrl} from './outlook-bridge-v57724.js';
import './outlook-bridge-v57724.css';
import {dailyDozen5930,dailyDozen5930View} from './daily-dozen-v5775930.js';
import './daily-dozen-v5775930.css';
import './mobile-direct-v5775930.css';
import {buildLifeBalanceRadar,buildLifeBalanceHistory,lifeBalanceRadarView,validateBalanceGoals} from './life-balance-radar-v563.js';
import {inspectorDateShift,inspectorTitle} from './inspector-v559.js';
import {createEditDraftGuard,EDIT_DRAFT_VAULT_KEY} from './edit-draft-guard-v57716.js';
import './edit-draft-guard-v57716.css';
import {inboxFlagged,visibleInboxTags,setInboxFlag} from './inbox-flags-v27.js';
import {inboxOrdered,inboxMove,inboxNudge} from './inbox-order-v34.js';
import {FOLDER_ICONS,folderIcon} from './folder-icons-v35.js';
import {CONTACT_TYPES,CONTACT_REVIEW_DAYS,CONTACT_INITIATORS,contactInitiatorLabel,contactTypeLabel,addContactEntry,contactSummary,contactReviewQueue,updateContactReviewDays} from './people-relationships-v24.js';
import {FEELINGS,feelingWord,newFeelingDraft,chooseFeeling,intensityFor,validatedCheckin,appendCheckin,replaceCheckin,draftFromCheckin,setFeelingDetail,toggleFeelingObservation,feelingOverlay,feelingInsights,feelingReview} from './feeling-wheel-v565.js';
import {renderFeelingNetwork,toggleNetworkTerm} from './feeling-network-v5705.js';
import {personalConnections,personalConnectionsView} from './personal-connections-v566.js';
import {morningConnections,morningConnectionsView} from './morning-connections-v572.js';
import './morning-connections-v572.css';
import {relationshipMapView,MAP567,closenessAt} from './relationship-map-v567.js';
import {CONTACT_MODES,careMode,relationshipReview,activeCare} from './relationship-intelligence-v568.js';
import {deadlineSuggestions,contactSuggestions} from './calendar-intelligence-v568.js';
import {RELATION_KINDS,GENDER_MARKERS,CADENCE_DAYS,preference,contactImpulse,impulseQueue,pauseContact,mapPosition,mapDrop,safePersonDetails,relatedProjectIds,contactWeight} from './relationship-radar-v564.js';
import {REVIEW_STEPS,newReview,validReview,reviewQueue,projectReviewSummary,nextReviewStep,reviewedStep} from './guided-review.js';
import {buildPersonAgendaIndex,sortPeopleByOpenItems} from './people-agenda-index-v57717.js';
import {colleaguesForWatch,schoolDeadlinesForWatch} from './watch-projection-v5125.js';
import {PEOPLE_SCOPES,peopleInScope,peopleScopeCounts} from './people-scope-v57720.js';
import {peopleRecoveryPanel5933} from './people-mobile-recovery-v5775933.js';
import './people-mobile-recovery-v5775933.css';
import {mergePeopleDirectory,markChangedPeople} from './people-sync-v57719.js';
import {createPerformanceTrace} from './performance-trace-v57719.js';
import {planningCheckpoint,restorePlanningCheckpoint,afterPlanningPaint} from './fast-planning-v57721.js';
import {gtdCheckpoint,paintGtdProgress} from './fast-gtd-actions-v5775940256.js';
import {gtdDelta,createCoreIdlePolicy} from './core-first-v5775940257.js';
import {reviewCheckpoint,restoreReviewCheckpoint,createTodayPanelMemo} from './core-performance-v5775940258.js';
import {calendarBirthdayCandidates,familyWorkerSnapshot,createDeferredFamilyCache} from './today-core-deferred-v5775940259.js';
import {focusActivityTypeChoices} from './activity-management.js';
import {timeProgressMarkup,projectTimeText} from './focus-productivity-v57759402510.js';
import './focus-productivity-v57759402510.css';
import './mobile-planning-v57719.css';
import './performance-trace-v57719.css';
import {buildPlanTreeIndex} from './plan-tree-index-v57717.js';
import {projectHealth,waitingReview,repeatedTask} from './gtd-intelligence-v23.js';
import {validateLifeGoal,lifeGoals,lifeGoalProgress,smartDailyChoices,energyModes,timeModes,LIFE_AREAS,lifeAreaLabel} from './life-intelligence-v22.js';
import {fetchPublicEurQuotes} from './kraken-public-market-v22.js';
import {fetchKrakenHistory} from './kraken-history-v39.js';
import {matchesEventCategories,toggleEventCategory,selectedCategoryLabel} from './discovery-category-filter.js';
import {DISCOVERY_FILTER_GROUPS,DISCOVERY_RESEARCH_BUTTONS,researchPrompt,researchButton,filterGroup,isResearchGroup,formatResearchDate} from './discovery-research-v577.js';
import {researchRefreshStates,researchReminders,researchReminderText,recordResearchImport} from './discovery-freshness-v5777.js';
import './discovery-freshness-v5777.css';
import './discovery-research-v577.css';
import {groupCinemaScreenings,cinemaOverview,cinemaSearch,cinemaCoverageWarning,meaningfulFilmDescription} from './cinema-program-v5772.js';
import {cinemaDayShift,cinemaForDay,cinemaEnrichmentPrompt,isCinemaDetailsJSON,parseCinemaDetailsImport,enrichCinemaEvent} from './cinema-details-v5773.js';
import {lookupPosterBatch,applyPosterToEvent,validPosterSuggestion,verifyPosterImage,verifyPosterLookupResult} from './cinema-poster-lookup-v5774.js';
import './cinema-poster-lookup-v5775.css';
import './cinema-details-v5773.css';
import './cinema-program-v5772.css';
import {wireSmartTags,rememberTag} from './smart-tags.js';
import {personCalendarEvents} from './people-matching.js';
import './people-agenda-v57717.css';
import './people-scope-v57720.css';
import './style.css';
import './quick-utility-colors-v57759402514.css';
import {allRecoveryIdeas,scoreRecoveryIdeas,recoveryWeather,validRecoveryIdea} from './recovery-ideas.js';
import {assertCompatibleWorker} from './health-check.js';
import {parseEventImport,upcomingImportedEvents,discoveryPromptRegional,discoveryPromptTravel,eventKey,eventAppearance as discoveryAppearance,EVENT_CATEGORIES,eventArea,eventCountry} from './event-import.js';
import {eventState,queueEvent,queueEventPreference,removeEvents,removeCinemaEvents,isCinemaEvent,prunePastEvents,pendingEventBatch,acknowledgeEventBatch,mergeEventSnapshot,resolveEventConflict} from './event-sync.js';
import {discoveryDisplayDay412,discoveryOverlaps412,discoveryOngoingLabel412} from './discovery-current-day-v577594012.js';
import {healthViewModel,healthBars,healthTime,healthObservation} from './health-visual.js';
import {inspectHealthFiles,commitHealthImport,missingGarminDays} from './health-import.js';
import {healthImportCoverage} from './health-import-diagnostics-v492.js';
import {healthDataCoverage,healthCoverageMarkup,importFilePeriod} from './health-data-coverage-v494.js';
import {planHealthQueue,healthBatchResult} from './health-import-queue-v493.js';
import {importedHealthDashboard,healthSourcesView,healthBodyView,healthConnectActivityView} from './health-dashboard.js';
import {financeViewModel,financeReviewGroups,previewBankFiles,categorizeTransaction,merchantKey,validCategory,safeMerchantRule,classifyBankTransaction,updateBankSuggestions} from './finance-core.js';
import {FINANCE_TABS,FINANCE_GROUPS,financeGroupForPane,INSIGHT_TABS,INSIGHT_PERIODS} from './lazy-routes-v57754.js';
import {createOnDemandRouteLoader} from './on-demand-v57754.js';
import './on-demand-v57754.css';
import './fast-today-v57755.css';
import './occasion-compact-v577552.css';
import './gtd-workspace-v57756.css';
import './extended-amber-v0578.css';
import './mobile-workflow-v57757.css';
import './project-workspace-v57758.css';
let financeDashboardView,financePremiumOverviewView;
import {cashflowDateOK,validateCashflowSettings,validatedPlanEvent,cashflowMonth} from './finance-cashflow-v560.js';
import {financeAssistantPatterns,financeAssistantView,financeAssistEligible,askLocalFinanceModel,applyFinanceAssistantGroup} from './finance-local-assistant-v46.js';
import {fetchTwelveDataQuote} from './finance-market-v36.js';
import {fetchFlatexMarketHistory} from './flatex-market-history-v41.js';
import {putBudgetEntry,putSavingsGoal,validateSavingsGoal,flexBudgetModel} from './finance-flex-budget-v30.js';
import {PRIVATE_KINDS,privateSection,privateChanged,applyPrivateSection,newSalt,syncKeyFromPhrase,encryptSection,decryptSection} from './private-device-sync-v30.js';
import {applyCalendarWindow,visibleCachedCalendar,calendarFetchWindows,shiftCalendarDay,normalizeCalendarArchive} from './calendar-cache-v574.js';
import {privateMirrorNeedsChunks,privateMirrorParts,joinMirrorParts} from './private-device-chunks-v552.js';
import {queueFinanceMobileDecision,applyQueuedFinanceDecisions} from './finance-mobile-decisions-v0579.js';
import {financeQuickNavView} from './finance-mobile-nav-v0579.js';
import {mobileFinanceReviewView,mobileFinanceReviewRows} from './finance-mobile-review-v0579.js';
import './finance-mobile-v0579.css';
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
let exploreDays,exploreView;
let buildSleepInsights,insightsSleepView,insightsPlannedView;
import {healthFindings,rankHealthFindingsLocally} from './health-intelligence-v551.js';
import {inspectWorktimeFile,mergeWorktime,worktimeView,worktimeImportPanel} from './worktime-v553.js';
import {MORNING_STEPS,MORNING_PRESETS,defaultMorningConfig,normalizeMorningConfig,ensureMorning,newMorningSession,morningSafeMeta,morningFromSafeMeta,transitionMorning,elapsedStepSeconds,storeMorningSession,morningHubView,morningOverlayView} from './miracle-morning-v570.js';
import {morningIntelligenceHeader,morningCreateView,morningInsightsView,addMorningAffirmation,removeMorningAffirmation,saveMorningVision,removeMorningVision,putMorningNote,removeMorningNote,sessionToMorningNote} from './morning-intelligence-v571.js';
import {nutritionHistoryView} from './nutrition-history-v577.js';
import {nutritionWorkspace4017} from './nutrition-focus-v577594017.js';
import './nutrition-focus-v577594017.css';
import './nutrition-entry-inspector-v0581.css';
import {dreamJournalView,putDreamEntry,deleteDreamEntry,DREAM_KINDS} from './dream-journal-v57743.js';
import {RECEIPT_GPT_PROMPT,parseReceiptJSONList,receiptInboxView,putReceipts,deleteReceipt} from './receipt-gpt-v57743.js';
import {setReceiptCategory} from './receipt-categories-v57745.js';
import {weeklyIntelligenceView} from './weekly-intelligence-v57746.js';
import {capacityGuardianView,capacityGuardianTeaser,saveCapacitySettings} from './capacity-guardian-v57747.js';
import './capacity-guardian-v57747.css';
import {capacityCalendarView,saveWorkPacketSettings,effectiveCapacityState748} from './capacity-calendar-v57748.js';
import './capacity-calendar-v57748.css';
import {bodyTransformationView} from './body-transformation-v57749.js';
import {fitdaysInterpretationView} from './fitdays-interpretation-v57759402517.js';
import {COMPASS_VISIBLE_RELEASE} from './compass-release-v57759402519.js';
import './fitdays-interpretation-v57759402517.css';
import './body-comparison-v57759402524.css';
import './body-fat-visual-v57759402522.css';
import {saveCapacitySettings749} from './capacity-preserve-v57749.js';
import {nutritionTrendsIndex} from './nutrition-trends-v57726.js';
import {strengthSummariesWithFit} from './strength-insights-v57728.js';
import './body-transformation-v57749.css';
import {lifeWeeksView,lifeYearRange,lifeWeekCells,lifeAgeAt,calendarLifeCandidates,putLifeEvent,deleteLifeEvent,LIFE_EVENT_CATEGORIES} from './life-weeks-v0582.js';
import './life-weeks-v0582.css';
import {INSIGHTS750_EXTERNAL,insights750Allowed,insights750Group,insights750Sidebar,insights750PrimaryTabs,insights750Subtabs,insights750Cockpit} from './insights-navigation-v57750.js';
import './insights-navigation-v57750.css';
import './premium-ui-v57751.css';
import './chart-first-v57752.css';

import './finance-premium-v57753.css';
import './weekly-intelligence-v57746.css';
import './receipt-categories-v57745.css';
import './dream-journal-v57743.css';
import './receipt-gpt-v57743.css';
import {nutritionTimingView,nutritionTimingSelectedMarkup,shiftNutritionTimingPeriod} from './nutrition-timing-v57725.js';
import './nutrition-timing-v57725.css';
import {nutritionTrendsView,shiftNutritionTrendsPeriod} from './nutrition-trends-v57726.js';
import './nutrition-trends-v57726.css';
import {nutritionConnectionsView} from './nutrition-connections-v57727.js';
import './nutrition-connections-v57727.css';
import {putStrengthAnnotation,strengthSetRow} from './strength-editor-v57732.js';
import './strength-editor-v57732.css';
import {dailyDozenView,setDailyDozen,shiftDailyDozenDate} from './daily-dozen-v57733.js';
import './nutrition-guidance-v57733.css';
import {antiAgingEightView} from './anti-aging-eight-v57734.js';
import './anti-aging-eight-v57734.css';
import './strength-visual-v57735.css';
import './touch-insights-v57735.css';
import {nutritionPhytoView} from './nutrition-phyto-v57736.js';
import {readSmoothieForm} from './nutrition-smart-smoothie-v57736.js';
import './nutrition-phyto-v57736.css';
import {readPersonalRecipe,PERSONAL_RECIPE_IDS} from './personal-recipes-v57737.js';
import './strength-recipes-v57737.css';
import './nutrition-missing-pill-v577371.css';
import {wireStrengthRecentDefaults} from './strength-recent-defaults-v577371.js';
import './strength-recent-defaults-v577371.css';
import './strength-premium-v57738.css';
import './compass741.css';
import {mountPremiumAnatomy} from './strength-premium-v57738.js';
import {nutritionFatView} from './nutrition-fat-quality-v57731.js';
import './nutrition-fat-quality-v57731.css';
import {strengthInsightsView} from './strength-insights-full-repair-v57759402511.js';
import './strength-insights-v57728.css';
import {nutritionIntelligenceView} from './nutrition-intelligence-v57712.js';
import {recognizeMeal,saveMeal,gptMealPrompt,importMealJSON,mealPreviewMarkup,mealMacroMarkup,mealComposerMarkup} from './meal-compose-v57723.js';
import {normalizedMacroPreferences} from './macro-goals-v57723.js';
import './meal-compose-v57723.css';
import {taskSupportPrompt} from './task-gpt-handoff-v57712.js';
import {TOUCH_KINDS,touchHistoryView,putTouch,deleteTouch,touchQuickView,touchPersonSummary} from './touch-journal-v577.js';
import {peopleWithTouchMeetings,personWithTouchMeetings} from './touch-contact-projection-v0578.js';
import './nutrition-touch-v577.css';
import {TIME_AREAS,FOOD_PRESETS,timeCategoryOptions,timeLabel,ensureJournal,validTimeEntry,timeEntries,putTimeEntry,deleteTimeEntry,addNutrition,addCustomFood,nutritionFoods,nutritionKcalEstimate,nutritionEntries,timeJournalView,nutritionQuickView,nutritionInsightsView,nutritionEntryInspectorView,mergeJournalData} from './personal-journal-v5692.js';
import './mensa-catalog-v57759402512.css';
import {mensaOffer,mensaConsumed,mensaTodayButton,logMensaMeal} from './mensa-journal-v57759402512.js';
import {energyGoalSettings,dayEnergyStatus} from './energy-goal-v575.js';
import {quickEnergyMeter} from './nutrition-quick-meter-v576.js';
import {mergeHabitQuick} from './habit-device-sync-v5731.js';
import {putHabitTimeSession,habitTimeInsightsView} from './habit-time-v57759402525.js';
import './habit-time-v57759402525.css';
import {markSuccessfulImport} from './import-status-v558.js';
import {worktimeYearComparisonView} from './worktime-multiyear-v555.js';
import {recoveryCandidates,recoveryEvidence,recoveryView} from './recovery-timeoff-v554.js';
import {conferenceEntries,conferenceRadarView,conferenceProjectPlan,newConference,setConferenceStatus,RADAR_TOPICS,RADAR_REGIONS,RADAR_FOCI} from './conference-radar-v555.js';
let insightsStressView,insightsEnergyView;
let fitnessInsightsView;
let buildProductivityInsights,productivityInsightsView;
import {inspectTimelineFiles,manualPlaceVisit,mergePlaces,placesInsightsView} from './insights-places.js';
import {reportSetupView,reportDocument,reportEvidence,reportRecommendations,rankEvidenceLocally} from './life-report-v577594018.js';
import './life-report-v577594018.css';
import {annualDocument,annualSetupView} from './life-annual-v577594019.js';
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
import {prepareTasks,TASK_CATEGORIES,CATEGORY_LABELS,validLocalTask,taskPlain,sameTask,localDate,tasksForDay,dueTasks,mergeTaskSnapshot,parseTags,dateIsValid,advanceTaskCounter,nextActions,isActionAvailable,isTemplateTask,flaggedTasks,heldTasks,projectTasks,validProject,projectPlain,sameProject,mergeProjectSnapshot,agendaForEvent,projectNeedsReview,contextsFor,blockedByProject,isDreamRecord,dreamRecords,inboxRecords,childProjects,projectDescendantIds,validProjectParent,validTaskParent,hierarchicalProjectTasks,taskChildren,ordered} from './tasks.js';




registerSW({immediate:true});
const COMPASS_CLIENT_VERSION='0.5.82';
const app=document.getElementById('app');
const COMPASS55_MODE_KEY='compass.ui.focus.v57755';
let compass55Mode=(()=>{try{return localStorage.getItem(COMPASS55_MODE_KEY)==='extended'?'extended':'focus';}catch{return 'focus';}})();

const compass54Loader=createOnDemandRouteLoader({
 finance:[['overview',()=>import('./finance-premium-v57753.js')],['details',()=>import('./finance-dashboard.js')]],
 insights:[['sleep',()=>import('./insights.js')],['wellness',()=>import('./insights-wellness.js')],['fitness',()=>import('./insights-fitness.js')],['productivity',()=>import('./insights-productivity.js')],['explore',()=>import('./insights-explorer.js')]]
},(kind,status)=>{
 const track=app.querySelector('[data-compass54-track="'+kind+'"]');
 if(track){const percent=status.total?Math.round(status.completed/status.total*100):0;track.style.width=percent+'%';track.parentElement?.setAttribute('aria-valuenow',String(percent));}
 const progress=app.querySelector('[data-compass54-progress="'+kind+'"]');
 if(progress)progress.textContent=status.completed+' / '+status.total+' Module geladen';
});
function compass54Ready(kind){return compass54Loader.get(kind)?.status==='ready'&& (kind==='finance'?typeof financeDashboardView==='function'&&typeof financePremiumOverviewView==='function':typeof insightsSleepView==='function'&&typeof insightsEnergyView==='function');}
function compass54Load(kind){
 return compass54Loader.ensure(kind).then(modules=>{
  if(kind==='finance'){
   financePremiumOverviewView=modules.overview.financePremiumOverviewView;
   financeDashboardView=modules.details.financeDashboardView;
  } else {
   ({buildSleepInsights,insightsSleepView,insightsPlannedView}=modules.sleep);
   ({insightsStressView,insightsEnergyView}=modules.wellness);
   ({fitnessInsightsView}=modules.fitness);
   ({buildProductivityInsights,productivityInsightsView}=modules.productivity);
   ({exploreDays,exploreView}=modules.explore);
  }
  if(state&&tab===kind)render();
 }).catch(err=>{
  console.error('Compass Modul konnte nicht vorbereitet werden',kind,err);
  if(state&&tab===kind)render();
 });
}
function compass54LoadingScreen(kind){
 const info=compass54Loader.get(kind),title=kind==='finance'?'Finanzen':'Insights';
 if(info.status==='idle'){
  const start=()=>{if(state&&tab===kind)compass54Load(kind);};
  if(typeof requestAnimationFrame==='function')requestAnimationFrame(start);else queueMicrotask(start);
 }
 const progress=info.total?Math.round(info.completed/info.total*100):0;
 const failed=info.status==='failed';
 return chrome(`<section class="compass54-load" aria-label="${title} werden vorbereitet" aria-live="polite">
  <h2>${failed?title+' konnte nicht geöffnet werden':'Compass bereitet '+title+' vor'}</h2>
  <p>${failed?'Die Module konnten nicht geladen werden. Prüfe die Verbindung und versuche es erneut.':'Compass is preparing your data for a fast experience. Das GTD-Arbeitssystem bleibt davon unabhängig.'}</p>
  ${failed?'':`<div class="compass54-load-track" role="progressbar" aria-label="Modul-Fortschritt" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}"><span class="compass54-load-fill" data-compass54-track="${kind}" style="width:${progress}%"></span></div><div class="compass54-load-status" data-compass54-progress="${kind}">${info.completed} / ${info.total} Module geladen</div>`}
  ${failed?'<button type="button" class="secondary-btn" data-action="compass54-retry">Erneut versuchen</button>':''}
 </section>`);
}

let config={apiUrl:'',googleClientId:''};
let state=null, hasVault=false, authToken='', currentUser='', busy=false, notice='', error='', tab='today', lastActivity=Date.now();
let saveQueue=Promise.resolve();
let calendarMonth=new Date(new Date().getFullYear(),new Date().getMonth(),1);
let selectedDay=localDateString(new Date());
let lastObservedLocalDay=selectedDay;
let manuallyChosenDay=false;
function refreshCurrentDayIfNeeded(){
 const today=localDateString(new Date());if(today===lastObservedLocalDay)return false;
 if(!manuallyChosenDay&&selectedDay===lastObservedLocalDay){selectedDay=today;calendarMonth=new Date(today+'T12:00:00');todayInspectorOpen=false;}
 lastObservedLocalDay=today;
 return true;
}
if(typeof document!=='undefined'){
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&refreshCurrentDayIfNeeded()&&state)render();});
 window.addEventListener('focus',()=>{if(refreshCurrentDayIfNeeded()&&state)render();});
 if(typeof setInterval==='function')setInterval(()=>{if(refreshCurrentDayIfNeeded()&&state)render();},60000);
}

const performanceTrace=createPerformanceTrace();
try{performanceTrace.setEnabled(localStorage.getItem('compass.perf.v57719')==='on');}catch{}
function performancePanel(){
 const rows=performanceTrace.summary().slice(0,18);
 return `<section class="work-card perf719" aria-label="Laufzeitmessung"><div class="work-heading"><span>${ico('clock',18)} Laufzeitmessung · Gerät</span><span class="quiet-tag">Nur lokal · kein Aufgabeninhalt</span></div>
 <p class="muted-line">Misst Browseraktionen, Bildschirmaufbau, Tresorspeicherung und Abgleiche auf diesem Gerät. Standardmäßig deaktiviert. Keine Inhalte, Namen oder Aufgabentitel werden erfasst.</p>
 <div class="system-actions"><button type="button" class="secondary-btn" data-action="perf719-toggle">${performanceTrace.enabled?'Messung beenden':'Messung starten'}</button><button type="button" class="secondary-btn" data-action="perf719-export" ${!performanceTrace.entries().length?'disabled':''}>Messwerte exportieren</button><button type="button" class="secondary-btn" data-action="perf719-clear" ${!performanceTrace.entries().length?'disabled':''}>Messwerte löschen</button></div>
 <small>${performanceTrace.enabled?'Messung aktiv':'Messung aus'} · ${performanceTrace.entries().length} Messungen im Arbeitsspeicher · bei Neuladen verworfen</small>
 ${rows.length?`<div class="perf719-table"><div><strong>Vorgang / Ansicht</strong><strong>Anzahl</strong><strong>Ø ms</strong><strong>Max. ms</strong></div>${rows.map(r=>`<div><span>${h(r.label)}</span><span>${r.count}</span><span>${r.avg}</span><span>${r.max}</span></div>`).join('')}</div>`:'<p class="muted-line">Noch keine Messungen. Messung starten und Heute, Inbox, Planen oder Menschen benutzen.</p>'}</section>`;
}
let selectedInboxId=null;
let selectedDreamId=null;
let selectedTaskId=null;
let todayInspectorOpen=false;
let inlineEditingTaskId=null;
let selectedProjectId=null;
let projectVaultView48="",projectCreating48=false;
let shoppingSelectedId='',shoppingArchiveOpen=false;
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
let activitySelectedId=null,activityTrash=false,activityReviewFlow=false,overviewHorizon=30,overviewWeek=0,selectedTimelineDay='',selectedPersonId=null,personOpenPointId='',peopleTab='list',peopleScope='all',peopleRadarExpanded=false,peopleShowAll=false,relationshipMapFocus=false,relationshipMapFilter='all',quickContactType='',occasionOpen=true;
const reviewDrafts=new Map();
function captureReviewDraft(){const form=app?.querySelector('#review-commit-form');if(form?.dataset.id)reviewDrafts.set(form.dataset.id,Object.fromEntries(new FormData(form).entries()));}
let showCalendarBlocks=false;
let showCaptureDetails=false;
let contextFilter='';
let recoveryIdeaMinutes=180,recoveryIdeaEnergy='medium',recoveryIdeaRange='trip';
let syncResyncRequested=false;
let syncTimer=null, lastSyncAt=0;
const SYNC_INTERVAL_MS=15*60*1000;
const CHANGE_DEBOUNCE_MS=12000;
const coreIdlePolicy=createCoreIdlePolicy({quietMs:10000,maxDelayMs:120000});
coreIdlePolicy.noteActivity(Date.now());
let coreCompactionTimer=null,coreCompactionDue=false;
function scheduleCoreCompaction(){
 coreCompactionDue=true;clearTimeout(coreCompactionTimer);
 coreCompactionTimer=setTimeout(async()=>{
  coreCompactionTimer=null;
  if(!state||document.visibilityState==='hidden'||Date.now()-lastActivity<10000){
   if(state&&document.visibilityState==='visible')scheduleCoreCompaction();return;
  }
  try{await persist();coreCompactionDue=false;}catch(ex){console.warn('Compass local checkpoint postponed',ex);scheduleCoreCompaction();}
 },14000);
}
function scheduleSync(delay=CHANGE_DEBOUNCE_MS) {
  if(!state||!authToken||!navigator.onLine||document.visibilityState==='hidden')return;
  coreIdlePolicy.beginWait(Date.now());
  clearTimeout(syncTimer);
  syncTimer=setTimeout(()=>{
   syncTimer=null;
   const editor=document.activeElement?.closest?.('form');
   const editing=!!(editor&&['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName));
   if(!coreIdlePolicy.maySync(Date.now(),{visible:document.visibilityState==='visible',online:navigator.onLine,editing})){
    scheduleSync(Math.max(editing?2000:250,coreIdlePolicy.nextDelay(Date.now())));return;
   }
   coreIdlePolicy.reset();syncNow({silent:true}).catch(()=>{});
  },Math.max(0,delay));
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
    scheduleSync();scheduleJournalSync(12000);scheduleWatchCalendarSnapshot();
  }catch(ex){
    if(ex.status===401){authToken='';currentUser='';await vault.clearSession();toast('Compass-Sitzung abgelaufen. Bitte einmalig mit Google anmelden.');}
    else {error='Verbindung derzeit nicht erreichbar. Lokale Erfassung bleibt möglich.';render();}
  }
}




// The feeling vocabulary is public app code; only saving private check-ins
// requires the one-time setup of the vault's write-only capture key.
const FEELING_MODE_KEY='compass.feeling.inputMode.v5706';
function rememberedFeelingInputMode(){
 try{return localStorage.getItem(FEELING_MODE_KEY)==='words'?'words':'wheel';}catch{return 'wheel';}
}
function chooseFeelingInputMode(mode){
 feelingInputMode=mode==='words'?'words':'wheel';
 try{localStorage.setItem(FEELING_MODE_KEY,feelingInputMode);}catch{}
}
let feelingInputMode=rememberedFeelingInputMode();
let feelingOverlayOpen=false,feelingSaving=false,feelingDraft=newFeelingDraft(),feelingDays=30,feelingView='overview',feelingSelectedId='',feelingHistoryLimit=30,feelingEditingId='',connectionEmotion='anger',connectionDays=30;
let worktimeQuickOpen=false,habitQuickOpen=false,habitDraftTitle='';
let touchPeriod=30,touchEditingId='',touchQuickOpen=false,touchDefaultPersonId='';
let mealComposeText='',mealComposeModel=null;
let mensaApi=null,mensaLoadPending=null,mensaImportDraft=null,mensaMessage='';
let nutritionQuickOpen=false, timeJournalPeriod=7,timeJournalEditId='',timeJournalShowForm=false,nutritionPeriod=30,nutritionEditId='',nutritionView712='journal',nutritionTimingMode725='week',nutritionTimingAnchor725=localDateString(new Date()),nutritionTimingSelected725='',nutritionTrendsMode726='week',nutritionTrendsAnchor726=localDateString(new Date()),nutritionTrendsMetric726='protein',nutritionDay712=localDateString(new Date()),nutritionProduct712='matcha-powder',foodQueuedCount=0,journalSyncStatus='lokal',journalSyncBusy=false;
let nutritionConnInput727='lastMeal',nutritionConnOutcome727='sleep',nutritionConnRange727='90';
let strengthRange728='28',strengthSide728='front',strengthActivity737='combined';
let nutritionFatDays731='30',nutritionFatMetric731='saturated',strengthEditId732='',dailyDozenDay733=localDateString(new Date()),antiAgingDay734=localDateString(new Date()),phytoPeriod736=30;
let dreamDays743=30,dreamEditingId743='',dreamKind743='all',receiptDraft743=null,receiptMonth745=localDateString(new Date()).slice(0,7);
let lastAutoResume743=0;
// Device resume: read E2EE journal automatically without touching data on the other device.
function automaticJournalResume743(){
 if(!state?.privateDeviceMirror?.key||!authToken||!navigator.onLine||journalSyncBusy||journalSyncInFlight)return;
 if(typeof document!=='undefined'&&document.visibilityState==='hidden')return;
 if(Date.now()-lastAutoResume743<25000)return;
 if(document.activeElement?.closest?.('#dream743-form, #receipts743-form, #str732-form'))return;
 lastAutoResume743=Date.now();scheduleJournalSync(0);
}
if(typeof window!=='undefined'){
 window.addEventListener('focus',automaticJournalResume743,{passive:true});
 window.addEventListener('online',automaticJournalResume743,{passive:true});
}
if(typeof document!=='undefined')document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')automaticJournalResume743();});
let weeklyOffset746=0;
let journalSyncTimer=null,journalSyncInFlight=null,journalRevision=0,journalLastConfirmedAt=0;
function journalFingerprint(s){return JSON.stringify([s?.quickWorktime||null,s?.timeJournal||null,s?.nutritionJournal||null,s?.touchJournal||null,s?.strengthJournal||null,s?.dreamJournal||null,s?.receiptJournal||null,s?.mensaCatalog||null,s?.miracleMorning||null,s?.feelingCheckins||null,s?.habitsQuick||null,s?.calendarArchive?.updatedAt||null,s?.familyRadar||null,s?.taskInspiration||null,s?.habitTimeSessions||null,s?.makkoHoSessions||null,s?.strengthGuidedSessions||null,s?.financeMobileDecisions||null,s?.lifeWeekEvents||null,s?.peopleSyncEnabled?{people:s.people||{},deleted:s.peopleDeleted||{}}:null]);}
function scheduleJournalSync(delay=0){
 clearTimeout(journalSyncTimer);journalSyncTimer=null;
 if(!state||!authToken||!state.privateDeviceMirror?.key||!navigator.onLine)return;
 journalSyncTimer=setTimeout(()=>{journalSyncTimer=null;if(Date.now()-lastActivity<10000&&document.visibilityState==='visible'){scheduleJournalSync(10000);return;}syncPersonalJournal().catch(ex=>{console.warn('Journal-Abgleich ausstehend:',ex.message);});},Math.max(delay,10000));
}




let worktimeSelectedCategory='work';
const MORNING_PUBLIC_KEY='compass.morning.public.v570';
let morningPlayerOpen=false,morningSettingsOpen=false,morningSession=null,morningConfig=null,morningSaving=false;
let morningTab='routine',morningPeriod=30,morningJournalEditingId='',morningJournalDraft=null,morningAutoSaveTimer=null;
let morningSavingDraft=false,morningDraftSavePromise=null;
function readMorningPublic(){try{const raw=JSON.parse(localStorage.getItem(MORNING_PUBLIC_KEY)||'null');return {durations:raw?.durations||null,session:morningFromSafeMeta(raw?.session)};}catch{return {durations:null,session:null};}}
const morningInitial=readMorningPublic();
morningSession=morningInitial.session;
function morningPublicWrite(){
 if(!morningConfig)return;
 try{const data={durations:Object.fromEntries(MORNING_STEPS.map(step=>[step.id,morningConfig.durations[step.id]])),session:morningSession&&!morningSession.finishedAt?morningSafeMeta(morningSession):null};localStorage.setItem(MORNING_PUBLIC_KEY,JSON.stringify(data));}catch{}
}
function morningActiveConfig(){return state?ensureMorning(state).config:normalizeMorningConfig({durations:readMorningPublic().durations||defaultMorningConfig().durations});}
function morningRestoreConfig(){if(state){morningConfig=ensureMorning(state).config;morningPublicWrite();}else{morningConfig=morningActiveConfig();}}
function morningSaveNoteFromScreen(){const field=app.querySelector('#mm570-journal');if(field&&morningSession)morningSession.note=field.value.slice(0,4000);}
async function morningFlushDraft(){
 clearTimeout(morningAutoSaveTimer);morningAutoSaveTimer=null;
 if(!state)return;
 // Every request queues a fresh snapshot, including edits made during a previous save.
 const previous=morningDraftSavePromise;
 const save=async()=>{
  if(previous)await previous.catch(()=>{});
  await persist();
  const status=app.querySelector('#mm571-autosave-status');
  if(status)status.textContent='Lokal verschlüsselt gespeichert';
 };
 const promise=save().catch(ex=>{
  const status=app.querySelector('#mm571-autosave-status');
  if(status)status.textContent='Speichern fehlgeschlagen – bitte erneut versuchen';
  console.warn('Morning-Journal:',ex.message);throw ex;
 });
 morningDraftSavePromise=promise;
 try{await promise;}finally{if(morningDraftSavePromise===promise)morningDraftSavePromise=null;}
}
function morningScheduleDraftSave(){clearTimeout(morningAutoSaveTimer);morningAutoSaveTimer=setTimeout(()=>morningFlushDraft().catch(console.warn),500);}
async function morningJournalBlur(){
 await morningFlushDraft();
 if(state?.privateDeviceMirror?.key&&authToken){journalRevision++;journalSyncStatus='lokal';scheduleJournalSync(0);}
}
function morningCloseOverlay(){morningSaveNoteFromScreen();morningPlayerOpen=false;morningPublicWrite();}
async function morningBeforeLock(){await morningFlushDraft();morningSaveNoteFromScreen();if(state&&morningSession&&!morningSession.finishedAt&&morningSession.note){ensureMorning(state).draft=structuredClone(morningSession);try{await persist();}catch{}}if(morningSession)morningSession.note='';morningConfig=normalizeMorningConfig({durations:readMorningPublic().durations||defaultMorningConfig().durations});}
function morningRenderOverlay(){if(!morningPlayerOpen||!morningSession)return '';const goals=state?lifeGoals(state):[];const goal=goals.find(g=>g.id===morningConfig.goalId);return morningOverlayView(morningSession,morningConfig,{locked:!state,goalTitle:goal?.title||'',goalTitles:Object.fromEntries(goals.map(g=>[g.id,g.title]))});}
function morningTimerRefresh(){if(!morningPlayerOpen||!morningSession)return;const active=MORNING_STEPS[morningSession.stepIndex],limit=Number(morningSession.durations?.[active.id]||active.minutes)*60;const remaining=Math.max(0,limit-elapsedStepSeconds(morningSession));const node=app.querySelector('[data-mm570-remaining]');if(node)node.textContent=String(Math.floor(remaining/60)).padStart(2,'0')+':'+String(Math.ceil(remaining%60)).padStart(2,'0');}
if(typeof setInterval==='function')setInterval(morningTimerRefresh,1000);




const QUICK_PUBLIC_KEY='compass.quick.public.v569';
const DEFAULT_HABITS=[
  {id:'vocal-image',title:'Vocal Image',slot:'Morgen',active:true},
  {id:'hakka-5',title:'5 Hakka Übungen',slot:'Abend',active:true},
  {id:'wim-hof',title:'Wim-Hof Atempraxis',slot:'Abend',active:true}
];
let quickPublic=readQuickPublic();
let captureOverlayOpen=false;
let sealedCaptureAvailable=false,contactSaveStatus='',contactSaving=false,contactDraftSaveTimer=null;
function savedContactDraft(personId){const draft=state?.contactDrafts?.[personId]||{};return {day:draft.day||localDate(),type:draft.type||quickContactType||'meeting',note:String(draft.note||''),initiator:draft.initiator||'unknown'};}
function contactInitiatorOptions(selected='unknown'){return CONTACT_INITIATORS.map(([v,label])=>`<option value="${v}" ${selected===v?'selected':''}>${label}</option>`).join('');}
let journalRemoteActiveStart='',journalLastReadAt=0,journalRemoteVersion=0,journalLastError='';
let contactSettingsOpen=false,calendarSuggestionsOpen=true;
let peopleScrollRestoration=null;
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
// The Outlook token stays only in this tab's memory and is forgotten on vault lock.
// No Outlook endpoint is contacted unless the user explicitly connects.
let outlook724Token='',outlook724Port=8765,outlook724Preview=[],outlook724Status='',outlook724Busy=false,outlook724Connected=false,outlook724Open=false,outlook724LastFetch=0;
function outlook724Markup(){
 const seen=state?.outlookBridgeImported||{};
 const pending=outlook724Preview.filter(x=>!seen[x.id]);
 return `<details class="work-card outlook724" id="outlook724-details" ${outlook724Open||outlook724Connected||outlook724Preview.length?'open':''}><summary>✉️ Outlook · markierte E-Mails <small>lokal · optional</small></summary>
 <p class="outlook724-intro">Klassisches Outlook für Windows: markierte Nachrichten lokal lesen und anschließend als Inbox-Eintrag, Next Action oder Waiting For übernehmen. <strong>Keine Mail wird geändert.</strong></p>
 <div class="outlook724-config"><label class="outlook724-port">Port<input type="number" id="outlook724-port" value="${outlook724Port}" min="1024" max="65535" /></label><label>Lokaler Bridge-Schlüssel<input id="outlook724-key" type="password" placeholder="Schlüssel aus Windows-Konsole" value="${h(outlook724Token)}" autocomplete="off" spellcheck="false"/></label></div>
 <div class="outlook724-actions"><button type="button" class="secondary-btn" data-action="outlook724-fetch" ${outlook724Busy?'disabled':''}>${outlook724Busy?'Verbinde …':'Lokal abrufen'}</button><label class="secondary-btn" for="outlook724-file">JSON-Datei einlesen</label><input type="file" id="outlook724-file" accept=".json,application/json" class="outlook724-hidden"/></div>
 <p class="outlook724-status" role="status">${h(outlook724Status||'Die Brücke wird nur nach Eingabe des Schlüssels aktiviert. Beim verbundenen, geöffneten Inbox-Bereich wird gelegentlich lokal aktualisiert.')}</p>
 <p class="outlook724-security">Datenschutz: Nur Betreff und technische Prüfsumme werden lokal eingelesen, weder Mailtext noch Anhang. Bei bestätigter Übernahme können die Aufgabentitel über den normalen Compass-Cloud-Abgleich synchronisiert werden. Auf einem TU-Graz-Gerät bitte die geltenden IT- und Vertraulichkeitsregeln beachten.</p>
 ${pending.length?`<form id="outlook724-confirm" class="outlook724-preview"><strong>${pending.length} noch nicht übernommene Markierungen</strong><p class="muted-line">Titel und GTD-Typ vor Übernahme prüfen. Outlook-Nachverfolgung ist keine harte Deadline. Die Daten bleiben zunächst nur in der Vorschau.</p>${pending.map(x=>`<div class="outlook724-row"><input type="checkbox" name="selected" value="${x.id}" checked aria-label="Nachricht übernehmen"/><div class="outlook724-fields"><label>Aufgabentitel<input name="title-${x.id}" value="${h(x.title)}" required maxlength="180"/></label><label>Ziel<select name="kind-${x.id}"><option value="next">Next Action · keine Deadline</option><option value="inbox">Inbox · später klären</option><option value="waiting">Waiting For · keine künstliche Frist</option></select></label>${x.flagDueDate?`<small>Outlook-Nachverfolgung: ${h(x.flagDueDate)} · wird nicht als Deadline übernommen</small>`:''}</div></div>`).join('')}<button type="submit" class="primary-btn">Ausgewählte Einträge übernehmen</button><button type="button" class="secondary-btn" data-action="outlook724-clear">Vorschau verwerfen</button></form>`:''}
 </details>`;
}
async function outlook724Fetch(auto=false){
 if(!state||outlook724Busy||!outlook724Token)return;
 if(auto&&(tab!=='inbox'||document.visibilityState!=='visible'||app.querySelector('#outlook724-confirm')||document.activeElement?.closest?.('form')))return;
 outlook724Busy=true;
 try{
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),6500);
  let response;
  try{response=await fetch(outlookBridgeUrl(outlook724Port),{headers:{'X-Compass-Bridge-Key':outlook724Token},mode:'cors',cache:'no-store',signal:controller.signal});}
  finally{clearTimeout(timeout);}
  if(!response.ok)throw Error('Lokale Brücke antwortet mit HTTP '+response.status);
  const rows=outlookCandidates(await response.json(),state.outlookBridgeImported||{});
  const unseen=rows.filter(x=>!x.alreadyImported);
  const changed=outlook724Preview.map(x=>x.id).join('|')!==unseen.map(x=>x.id).join('|');
  outlook724Connected=true;outlook724LastFetch=Date.now();
  outlook724Status=unseen.length?`${unseen.length} markierte Nachrichten zur Prüfung bereit.`:'Keine neuen Markierungen gefunden. Bereits übernommene E-Mails bleiben in Compass.';
  if(!auto||changed){outlook724Preview=unseen;if(tab==='inbox')render();}
 }catch(ex){outlook724Connected=false;outlook724Status='Outlook nicht erreichbar: '+(ex.name==='AbortError'?'Zeitüberschreitung':ex.message)+'. Alternativ die JSON-Datei exportieren und hier auswählen.';if(!auto&&tab==='inbox')render();}
 finally{outlook724Busy=false;}
}
if(typeof setInterval==='function')setInterval(()=>{if(state&&outlook724Connected&&outlook724Token&&Date.now()-outlook724LastFetch>90000)outlook724Fetch(true).catch(()=>{});},30000);

let captureBulkOpen=false,captureBulkMode='lines',captureBulkRaw='',captureBulkPreview=null;
const bootSearch=new URLSearchParams(location.search);
const bootCapture=bootSearch.get('capture')==='1';
const bootView=bootSearch.get('view');
if(['today','inbox','review','forecast','overview','someday','activity','people','progress','recovery','insights','finance','projects','templates','shopping','next','flagged','hold'].includes(bootView))tab=bootView;
if(bootView==='health'||bootView==='places')tab='insights';
if(bootCapture){captureAfterUnlock=true;tab='inbox';}




let watchPairCode='', watchPairExpires='', watchSessions=[], watchDevices=[], watchError='';
let healthDays=[],healthDevices=[],healthPairCode='',healthError='',healthLastUpdated='';
let widgetPairCode='',widgetDevices=[],widgetConnectError='';
let healthSpan=7,healthDetailsOpen=false,healthDevicesOpen=false;
let importHealthSpan=90,selectedGarminNight='',healthFilePreview=null,healthFileReading=false;
let insightWellnessDay='';let insightStressPage=0;let insightStressGranularity='week',insightBodyComposition='composition';
let sportsMode='all',sportsAnchor=localDate(),sportsMetric='time',sportsSelected='';
let financeCycleSelected='';
let financeMarketQuote=null;
let balancePeriod=7,balanceHistoryCount=2,balanceSelectedAxis=null;
let inspirationRatingTask23=null;
let insightTab=bootView==='places'?'places':bootView==='health'?'sources':'sleep',insightPeriod=bootView==='places'?'all':'28',insightNight='',insightYearMode='month',insightYearAnchor='',insightWeekAnchor='',workYear=new Date().getFullYear(),workThreshold=45,workCompareMode='month',workPreview=null,timeoffKind='za',timeoffOpen=false,healthAiOrder=[],healthAiStatus='',financePane='Überblick';
// Non-sensitive presentation only. Deep links always override the last-view preference.
const calmLastView=(()=>{try{return JSON.parse(sessionStorage.getItem('compass.calm.lastView')||'null');}catch{return null;}})();
if(!bootView&&!bootCapture&&calmLastView&&['today','inbox','review','forecast','overview','someday','activity','people','progress','recovery','insights','finance','projects','templates','shopping','next','flagged','hold'].includes(calmLastView.tab))tab=calmLastView.tab;
if(!bootView&&!bootCapture&&calmLastView?.insight&&(calmLastView.insight==='touch'||INSIGHT_TABS.some(v=>v.id===calmLastView.insight)))insightTab=calmLastView.insight;
if(!bootView&&!bootCapture&&calmLastView?.finance&&FINANCE_TABS.some(v=>v.title===calmLastView.finance))financePane=calmLastView.finance;
let lifeWeeksAge=null,lifeWeeksWeek=null,lifeWeeksBonus=false,lifeWeeksStar=false,lifeWeeksDraft={},lifeWeeksCalendarQuery='',lifeWeeksCalendarHistory=[],lifeWeeksCalendarLoading=false;
let lifeReportSettings={period:'year',finance:false,places:false,people:false,feelings:false,rankedIds:[],aiStatus:''};
let calmNavGroup=['shopping','templates','projects','overview','next','forecast','radar','flagged','hold','someday','recovery'].includes(tab)?'plan':tab==='insights'||tab==='activity'||tab==='progress'?'insights':tab==='finance'?'finance':'';
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
let discoveryRange='week',discoveryCity='all',discoveryArea='all',discoveryCategory='all',discoveryCategories=null,discoveryCategoriesOpen=false,discoveryImportOpen=false,discoveryWeekOffset=0,discoveryImportPreview=null,discoverySelectedResearch='',discoveryPromptText='',discoveryImportDraft='',discoveryImportError='';
let discoveryDisplayMode='events', discoveryCinemaQuery='', discoveryFilmLimit=36, discoveryCinemaPeriod='day', discoveryCinemaDay=localDate(), discoveryCinemaStyle='poster', discoveryEnrichOffset=0;
let posterLookupBusy=false,posterLookupResult=null,posterLookupOffset=0,posterLookupSelected=new Set(),posterManualKey='';
let posterLookupProgress='';
const brokenPosterUrls=new Set();
const discoveryExpandedFilms=new Set();
const discoveryExpandedDays=new Set();
// Calendar OAuth is independent from Compass login; token stays in RAM only.
let calendarToken='', calendarExpires=0, calendarEvents=[], calendarStatus='Nicht verbunden', calendarBusy=false;
let calendarUpdatedAt=0,calendarCoverage=null;
let calendarIndex=null,calendarIndexedArray=null;
function restoreCalendarFromVault(st){
 const archive=normalizeCalendarArchive(st?.calendarArchive);
 calendarEvents=visibleCachedCalendar(archive);calendarIndex=null;calendarIndexedArray=null;
 calendarUpdatedAt=Date.parse(archive.updatedAt)||0;calendarCoverage=archive.completed?{complete:true,start:archive.start,end:archive.end}:null;
 if(archive.completed||calendarEvents.length)calendarStatus=`${calendarEvents.length} gespeicherte Termine · ${calendarUpdatedAt?'Stand '+new Date(calendarUpdatedAt).toLocaleDateString('de-AT'):'Aktualisierungsdatum unbekannt'}`;
 scheduleWatchCalendarSnapshot();
}
// 0.5.12: Only an owner-approved, bounded projection of the ALREADY saved
// encrypted Compass Calendar is placed on Cloudflare for the paired Garmin.
// No Google token, location, descriptions or attendee metadata is transmitted.
let watchCalendarUploadTimer=null,watchCalendarLastKey='';
function scheduleWatchCalendarSnapshot(){
 clearTimeout(watchCalendarUploadTimer);
 if(!state||!authToken||!navigator.onLine)return;
 watchCalendarUploadTimer=setTimeout(()=>uploadWatchCalendarSnapshot().catch(()=>{}),1500);
}
async function uploadWatchCalendarSnapshot(){
 if(!state||!authToken||!config.apiUrl||!navigator.onLine)return;
 const day=localDate(), archive=normalizeCalendarArchive(state.calendarArchive);
 const tz=Intl.DateTimeFormat().resolvedOptions().timeZone||'Europe/Vienna';
 const local=new Intl.DateTimeFormat('sv-SE',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
 const parts=dt=>{
   const d=new Date(dt);if(!Number.isFinite(d.getTime()))return null;
   const p=Object.fromEntries(local.formatToParts(d).filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));
   return {day:`${p.year}-${p.month}-${p.day}`,time:`${p.hour}:${p.minute}`};
 };
 // CompassWatch is a compact 12-hour meeting dial, not a time-sheet.
 // Skip generic busy/work blocks and appointments shorter than one hour.
 const isGenericWatchSlot=title=>/^(?:work|working|work block|work time|arbeit|arbeitszeit|arbeitsblock|fokus|focus|focus time|fokuszeit|busy|beschäftigt|blocked|blockiert)$/i.test(String(title||'').trim().replace(/\s+/g,' '));
 const events=[];
 const allCalendar=visibleCachedCalendar(archive);
 const familyDeadlines=schoolDeadlinesForWatch(allCalendar,day,dt=>parts(dt)?.day||'');
 for(const event of visibleCachedCalendar(archive)){
   // All-day records are deliberately excluded from the clock ring.
   if(event.transparency==='transparent'||!event.start?.dateTime||!event.end?.dateTime)continue;
   const a=parts(event.start.dateTime),b=parts(event.end.dateTime);
   if(!a||!b||a.day!==day||b.day!==day||b.time<=a.time)continue;
   const title=String(event.summary||'').trim();
   const minutes=t=>Number(t.slice(0,2))*60+Number(t.slice(3,5));
   if(!title||isGenericWatchSlot(title)||minutes(b.time)-minutes(a.time)<60)continue;
   events.push({start:a.time,end:b.time,title:title.slice(0,64)});
   // Keep scanning the calendar for future family examinations after today's 24 event slots.
 }
 events.sort((a,b)=>a.start.localeCompare(b.start));
 // Automatically publish only work-colleague agendas from the unlocked vault.
 // No notes, emails, contact history, private relationship records or other people.
 const agendaIndex=buildPersonAgendaIndex(Object.values(state.people||{}),state.tasks,rows(),state.projects);
 const people=colleaguesForWatch(Object.values(state.people||{}),agendaIndex,events,day,new Date().getHours()*60+new Date().getMinutes());
 const payload={day,events:events.slice(0,24),familyDeadlines,shoppingProjectId:shoppingSelectedId||null,people};
 const key=JSON.stringify(payload);
 if(watchCalendarLastKey===key)return;
 await request(config.apiUrl,authToken,'/api/watch/calendar-snapshot',{method:'POST',body:JSON.stringify(payload)});
 watchCalendarLastKey=key;
}
function indexedCalendarDay(day){
 if(calendarIndexedArray!==calendarEvents){calendarIndex=new Map();calendarIndexedArray=calendarEvents;
  for(const event of calendarEvents){const date=calendarDate(event);if(!calendarIndex.has(date))calendarIndex.set(date,[]);calendarIndex.get(date).push(event);}
  for(const items of calendarIndex.values())items.sort((a,b)=>(a.start?.dateTime||a.start?.date||'').localeCompare(b.start?.dateTime||b.start?.date||''));
 }
 return calendarIndex.get(day)||[];
}
const CAL_SCOPE='https://www.googleapis.com/auth/calendar.events.readonly';
function calendarDate(e){
 const value=e?.start?.dateTime;
 if(value){try{return localDateString(new Date(value));}catch{}}
 return (e?.start?.date||'').slice(0,10);
}
function dailyCalendar(day){return indexedCalendarDay(day);}
function calendarTime(e){
 const t=e?.start?.dateTime;
 if(!t)return 'Ganztägig';
 try{return new Intl.DateTimeFormat('de-AT',{hour:'2-digit',minute:'2-digit'}).format(new Date(t));}catch{return 'Termin';}
}
function visibleCalendarEvents(day){return visibleCalendarEventsForDay(indexedCalendarDay(day),day,effectiveCalendarRules(state),state?.calendarOverrides||{},showHiddenCalendarEvents,showCalendarBlocks);}
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
function calendarAccess36(){
 // Showing saved events must not depend on the short-lived Google OAuth token.
 // Keep this local to main.js because older UI test harnesses load render
 // functions without module imports. Never cache a Google access token.
 const tokenValid=Boolean(calendarToken)&&Date.now()<calendarExpires;
 const archive=state?.calendarArchive;
 const cached=archive?.completed===true||calendarEvents.length>0;
 const updatedAt=typeof archive?.updatedAt==='string'&&Number.isFinite(Date.parse(archive.updatedAt))?archive.updatedAt:'';
 return {tokenValid,cached,canDisplay:tokenValid||cached,updatedAt,count:calendarEvents.length};
}
function calendarReadable36(){return calendarAccess36().canDisplay;}
function cachedCalendarControls36(){
 const access=calendarAccess36();
 if(!access.cached||access.tokenValid)return '';
 const date=access.updatedAt?new Date(access.updatedAt).toLocaleDateString('de-AT'):'unbekannt';
 return `<div class="calendar-cache-info" role="note"><small>🔒 Termine aus deinem verschlüsselten Tresor · Stand ${h(date)}. Google-Freigabe nur zum Aktualisieren nötig.</small>${calendarConnectUI()}</div>`;
}
function calendarRowsOrConnect36(day,{filters=true}={}){
 if(!calendarReadable36())return calendarConnectUI();
 return calendarCardRows(day)+(filters?calendarFilterToggle():'')+cachedCalendarControls36();
}
function calendarConnectUI(){
 if(calendarBusy)return '<span class="calendar-connection">Google Calendar wird geladen …</span>';
 return calendarToken&&Date.now()<calendarExpires
  ?`<button type="button" class="secondary-btn" data-action="calendar-refresh">${ico('sync',15)} Kalender aktualisieren</button>`
  :`<button type="button" class="secondary-btn" data-action="calendar-connect">${ico('calendar',15)} ${calendarAccess36().cached?'Optional aktualisieren':'Google Calendar verbinden'} (Google-Freigabe)</button>`;
}
async function fetchGoogleCalendarWindow(startDay,endDay,signal){
 const url=new URL('https://www.googleapis.com/calendar/v3/calendars/primary/events');
 url.searchParams.set('timeMin',`${startDay}T00:00:00Z`);
 url.searchParams.set('timeMax',`${endDay}T00:00:00Z`);
 url.searchParams.set('singleEvents','true');url.searchParams.set('maxResults','2500');
 const rows=[];let token='';
 // Page all results; partial pages must never replace a complete archive.
 for(let page=0;page<40;page++){
  if(token)url.searchParams.set('pageToken',token);else url.searchParams.delete('pageToken');
  const resp=await fetch(url,{headers:{Authorization:`Bearer ${calendarToken}`},cache:'no-store',signal});
  if(!resp.ok)throw new Error(resp.status===403?'Google Calendar verweigert den Abruf. Berechtigung prüfen.':`Google Calendar HTTP ${resp.status}`);
  const data=await resp.json();rows.push(...(Array.isArray(data.items)?data.items:[]));
  token=data.nextPageToken||'';if(!token)return rows;
 }
 throw new Error('Kalender hat zu viele Seiten: Import unvollständig, kein Überschreiben.');
}
async function fetchCalendar(){
 if(!state)return toast('Zum Speichern des Kalenders bitte zuerst den Tresor entsperren.',true);
 if(!calendarToken||Date.now()>=calendarExpires)throw new Error('Kalenderfreigabe abgelaufen. Gespeicherte Termine bleiben verfügbar.');
 if(calendarBusy)return;
 calendarBusy=true;calendarStatus='Kalender wird abgeglichen …';render();
 const controller=new AbortController();
 try{
  const today=localDate(),windows=calendarFetchWindows(state.calendarArchive,state.healthImports||{},today);
  let updated=state.calendarArchive||null;
  for(let i=0;i<windows.length;i++){
   if(Date.now()>=calendarExpires)throw new Error('Google-Zugriff abgelaufen. Erneute Freigabe für weitere Aktualisierung nötig.');
   const w=windows[i];calendarStatus=`Kalender: Abschnitt ${i+1}/${windows.length} …`;
   const rows=await fetchGoogleCalendarWindow(w.start,w.end,controller.signal);
   updated=applyCalendarWindow(updated,rows,{start:w.start,end:w.end,seenAt:stamp()});
   // A partial initial history remains incomplete until ALL windows succeed.
   updated.completed=Boolean(state.calendarArchive?.completed);
   await mutate(st=>{st.calendarArchive=updated;});
  }
  if(windows.length){updated={...updated,completed:true};await mutate(st=>{st.calendarArchive=updated;});}
  restoreCalendarFromVault(state);
  if(!windows.length)calendarStatus='Kalender vollständig aus dem Tresor verfügbar.';
  else calendarStatus=`${calendarEvents.length} Termine verschlüsselt gesichert · ${windows.length} Zeitfenster überprüft`;
 }catch(ex){restoreCalendarFromVault(state);calendarStatus='Kalenderabgleich unvollständig · gespeicherte Termine bleiben erhalten: '+String(ex.message||ex);}
 finally{calendarBusy=false;render();}
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
 client.requestAccessToken({prompt:state?.calendarArchive?.completed?'':'consent'});
}
function watchOverview(){
 const sessions=activeActivities(watchSessions,state);
 const today=localDate();const monday=new Date(today+'T12:00:00');monday.setDate(monday.getDate()-((monday.getDay()+6)%7));const weekStart=localDate(monday);
 const rows=[['Heute',sessions.filter(x=>x.startedAt.slice(0,10)===today)],['Diese Woche',sessions.filter(x=>x.startedAt.slice(0,10)>=weekStart)],['Erfasst',sessions]];
 return `<div class="compass-tracking-grid">${rows.map(([label,items])=>`<div class="tracking-period"><span>${label}</span><strong>${(items.reduce((a,x)=>a+x.durationMinutes,0)/60).toLocaleString('de-AT',{maximumFractionDigits:1})} h</strong><small>${items.reduce((a,x)=>a+(x.pomodoros||0),0)} Pomodoros · ${items.length} Sessions</small></div>`).join('')}</div><p class="stats-caption">Garmin: aktuell abgerufene Sessions plus manuelle Einträge; Änderungen am Rohdatensatz bleiben getrennt. Schlafdaten sind nicht angebunden.</p>`;
}




let weather={status:'idle',city:'Graz',temperature:null,label:''};
function persist() {
  const measurement=performanceTrace.start();
  const snapshot=structuredClone(state);
  saveQueue=saveQueue.catch(()=>{}).then(()=>vault.save(snapshot)).finally(()=>performanceTrace.end('Tresor speichern',tab,measurement));
  return saveQueue;
}
const h=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const date=s=>s?new Date(s).toLocaleString('de-AT',{dateStyle:'medium',timeStyle:'short'}):'–';
const configured=()=>config.apiUrl.startsWith('https://')&&!config.apiUrl.includes('YOUR_')&&
  config.googleClientId.endsWith('.apps.googleusercontent.com')&&!config.googleClientId.includes('REPLACE');
// Sample 1 in 4 input events when profiling is enabled, avoiding observer overhead while typing.
let sampledEditorInput=0;
// Draft protection is deliberately local to the encrypted Vault; nothing is sent to the Worker.
const editDraftGuard=createEditDraftGuard({root:app,getState:()=>state,
 getContext:()=>({tab,treeCreateParent,treeTaskParent,selectedProjectId,selectedDay}),
 persist:drafts=>vault.saveEditDrafts(drafts),
 traceInputStart:()=>++sampledEditorInput%4===0?performanceTrace.start():null,
 traceInputEnd:(formId,started)=>{
  if(started==null)return;
  const name=formId==='task-create-form'&&tab==='templates'?'Eingabe: Vorlagenitem':
    formId==='task-create-form'?'Eingabe: Neue Aufgabe':
    formId==='project-create-form'?'Eingabe: Neues Projekt':
    formId==='project-edit-form'?'Eingabe: Projekt bearbeiten':'Eingabe: Aufgaben-Inspector';
  if(typeof requestAnimationFrame==='function')requestAnimationFrame(()=>requestAnimationFrame(()=>performanceTrace.end(name,tab,started)));
  else performanceTrace.end(name,tab,started);
 }});
function editRenderSignature(){return [tab,selectedProjectId||'',selectedTaskId||'',treeCreateKind||'',treeCreateParent||'',treeTaskParent||'',selectedDay||'',todayInspectorOpen?'1':'0'].join('|');}
let lastEditRenderSignature='';
function toast(s,isError=false) {if(isError){error=s;notice='';}else{notice=s;error='';}render();}
function download(filename,obj) {
  const blob=new Blob([JSON.stringify(obj,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;a.click();
  setTimeout(()=>URL.revokeObjectURL(url),3000);
}
let fastGtdMutationRevision=0;
let coreTodayDataRevision=0;
const coreTodayFamilyMemo=createTodayPanelMemo();
const core259FamilyCache=createDeferredFamilyCache();
let core259FamilyKey=null;
const core259FamilyKeyNow=()=>[coreTodayDataRevision,journalRevision,state?.people,state?.familyRadar,calendarEvents,calendarEvents.length,calendarUpdatedAt,state?.calendarRules,state?.calendarOverrides,showHiddenCalendarEvents,localDate()];
function core259FamilyAfterPaint(){
 if(tab!=='today'||!state||document.visibilityState==='hidden')return;
 const key=core259FamilyKeyNow();
 if(!core259FamilyKey||!key.every((x,i)=>x===core259FamilyKey[i]))return;
 if(core259FamilyCache.peek(key)!==null||core259FamilyCache.isPending(key))return;
 const input=familyWorkerSnapshot(calendarEvents,state.people||{},state,localDate(),e=>eventAppearance(e),showHiddenCalendarEvents);
 const started=performanceTrace.start();
 core259FamilyCache.schedule(key,input,html=>{
  performanceTrace.end('Heute: Familienradar Worker fertig',tab,started);
  if(!state||tab!=='today'||!key.every((x,i)=>x===core259FamilyKeyNow()[i]))return;
  const host=app.querySelector('[data-core259-family]');if(!host)return;
  host.innerHTML=html;
  host.querySelectorAll('[data-action]').forEach(el=>{el.onclick=ev=>{ev.preventDefault();runAction(el.dataset.action,el.dataset.id,el.dataset.step,el.dataset.day);};});
 },{workerFactory:()=>new Worker(new URL('./today-family-worker-v5775940259.js',import.meta.url),{type:'module'})});
}
async function mutate(fn,committedEditForm=null,skipFinalRender=false,options=null) {
  let draftBackup=null;
  if(!state)throw new Error('Der Tresor muss entsperrt sein.');
  prepareTasks(state);
  // Fast path only for audited create handlers which replace planning entries.
  // A finance mirror can change other state, so it always uses full rollback.
  const fastGtd=options?.fastGtd===true&&tab!=='people';
  const fastReview=options?.fastReview===true&&tab==='review';
  const fastPlanning=fastReview||fastGtd||options?.fastPlanning===true&&!['source','receiver'].includes(state.privateDeviceMirror?.mode)&&tab!=='people';
  const actionStart=fastGtd?performanceTrace.start():null;
  const gtdTicket=fastGtd?++fastGtdMutationRevision:0;
  let gtdDurableWrite=null;
  const previous=fastReview?reviewCheckpoint(state,{singleProjectId:options?.singleProjectId||null}):fastGtd?gtdCheckpoint(state,{singleTaskId:options?.singleTaskId||null}):fastPlanning?planningCheckpoint(state):structuredClone(state);
  // Journal fingerprinting serializes years of personal data. Without journal mirror
  // credentials there is no remote journal change to detect during task editing.
  const trackJournal=!!(state.privateDeviceMirror?.key&&authToken)&&!fastPlanning;
  const journalBefore=trackJournal?journalFingerprint(state):null;
  try {
    fn(state);invalidateDerivedInsights();
    if(!fastPlanning)coreTodayDataRevision++;
    if(tab==='people'&&state.peopleSyncEnabled===true){
      state.peopleDeleted=markChangedPeople(previous.people||{},state.people||{},state.peopleDeleted||{},stamp());
    }
    // Expensive finance / health JSON comparisons are only needed when encrypted mirroring is active.
    if(!fastGtd&&['source','receiver'].includes(state.privateDeviceMirror?.mode)&&privateChanged(previous,state)){
      if(state.privateDeviceMirror?.mode==='receiver')throw Error('Finanz- und importierte Sportdaten sind auf diesem Gerät im Lesemodus. Bitte Änderungen am Hauptgerät durchführen.');
      if(state.privateDeviceMirror?.mode==='source')state.privateDeviceMirror.dirty=true;
    }
    if(committedEditForm)draftBackup=editDraftGuard.commit(committedEditForm);
    // New project/template items appear immediately, rather than after >1 s
    // re-encryption. No success notification or remote sync before durability.
    if(fastPlanning){
      options?.onApplied?.();
      if(options?.fastTodayVisual!==true&&!options?.inlineGtd)render();
      // The small encrypted journal begins BEFORE the paint wait; UI and disk
      // writes run concurrently, but sync starts only after local durability.
      gtdDurableWrite=vault.appendCoreGtdDelta(gtdDelta(previous,state));
      await afterPlanningPaint();
      if(fastGtd)performanceTrace.end('GTD Aktion bis Paint',tab,actionStart);
    }
    if(fastPlanning){
      const durStart=performanceTrace.start();
      await gtdDurableWrite;
      performanceTrace.end('GTD Journal sicher',tab,durStart);
      scheduleCoreCompaction();
    }else await persist();
    if(!fastPlanning)syncQuickPublicFromState();
    if(trackJournal){
      if(journalFingerprint(state)!==journalBefore){journalRevision++;journalSyncStatus='lokal';if(state.privateDeviceMirror?.key&&authToken&&navigator.onLine)scheduleJournalSync(12000);}
    }
  }catch(ex){
      // A failed earlier save must not discard a later in-flight +1 or move.
      if(!fastGtd||gtdTicket===fastGtdMutationRevision){
        if(fastReview){restoreReviewCheckpoint(state,previous);options?.onFailed?.();}
        else if(fastPlanning){restorePlanningCheckpoint(state,previous);options?.onFailed?.();}else state=previous;
      }
      if(draftBackup)editDraftGuard.rollback(draftBackup);render();
      throw new Error(`Lokales Speichern fehlgeschlagen: ${ex.message}`);
    }
  if(!skipFinalRender)render();
  scheduleWatchCalendarSnapshot();
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
  cart:'<circle cx="9" cy="20" r="1"/><circle cx="19" cy="20" r="1"/><path d="M2 3h2l3 12h13l2-9H5M8 17h12"/>',
  archive:'<rect x="3" y="3" width="18" height="5" rx="1"/><path d="M5 8v13h14V8M10 13h4"/>',
  trash:'<path d="M3 6h18M9 6V4h6v2M6 6l1 15h10l1-15M10 10v7M14 10v7"/>',
  suitcase:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M9 7V4h6v3M3 12h18"/>',
  bolt:'<path d="m13 2-9 12h7l-1 8 10-13h-7z"/>',
  chevronDown:'<path d="m6 9 6 6 6-6"/>',
  bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  food:'<path d="M4 2v8a3 3 0 0 0 6 0V2M7 2v20M17 2c-4 3-4 9 0 12h2V2M19 14v8"/>',
  play:'<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4z"/>',
  stop:'<circle cx="12" cy="12" r="9"/><rect x="9" y="9" width="6" height="6" rx="1"/>'
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
function shopping741QuickButton(){
 const active=shoppingLists(state).filter(p=>p.status==='active');
 if(!active.length)return `<button type="button" class="quick-utility-button shopping741-quick" data-action="shopping741-open" title="Einkaufslisten und Kassenbons öffnen" aria-label="Einkaufslisten und Kassenbons öffnen"><span class="shopping741-symbol" aria-hidden="true">🛒</span><span class="quick-utility-label">Einkauf</span></button>`;
 const selected=active.find(p=>p.id===shoppingSelectedId)||active[0];
 const progress=shoppingProgress(state,selected.id);
 return `<button type="button" class="quick-utility-button shopping741-quick" data-action="shopping741-open" data-id="${h(selected.id)}" title="Aktive Einkaufsliste: ${h(selected.title)} (${progress.done}/${progress.total})" aria-label="Einkaufsliste öffnen: ${h(selected.title)}"><span class="shopping741-symbol" aria-hidden="true">🛒</span><span class="quick-utility-label">Einkauf</span><small class="shopping741-count">${progress.remaining}</small></button>`;
}
let cm930MobileMenuOpen=false;
let familyStudyEventId37='';
let balancePerspectiveChoice38='all';
function ctx42BindHover(){
 const menu=app.querySelector('.ctx42-menu');if(!menu)return;
 // PWA on Android uses the summary's native tap toggle; desktop uses hover.
 if(window.matchMedia?.('(hover: hover) and (pointer: fine)')?.matches){
  menu.addEventListener('pointerenter',()=>{menu.open=true;});
  menu.addEventListener('pointerleave',ev=>{if(!menu.contains(ev.relatedTarget))menu.open=false;});
 }
 menu.addEventListener('focusout',ev=>{if(!menu.contains(ev.relatedTarget))menu.open=false;});
}
let ctx39Running=false,ctx39LastAttempt=0;
async function ctx39LocateAndSave(zoneKind=null,radius=300,{silent=false}={}){
 if(!state||ctx39Running)return;
 if(!navigator.geolocation||!window.isSecureContext){if(!silent)toast('Standort benötigt eine sichere HTTPS-Verbindung und Browser-Freigabe.',true);return;}
 ctx39Running=true;ctx39LastAttempt=Date.now();
 try{
  const fix=await new Promise((resolve,reject)=>navigator.geolocation.getCurrentPosition(
   p=>resolve({latitude:p.coords.latitude,longitude:p.coords.longitude,accuracy:p.coords.accuracy}),reject,
   {enableHighAccuracy:false,maximumAge:60000,timeout:9000}));
  if(!state)return;
  if(zoneKind){
   if(fix.accuracy>radius/2)throw Error('Ort auf ±'+Math.round(fix.accuracy)+' m ungenau. Bitte draußen oder mit genauerem GPS erneut erfassen.');
   const saved=zone39(fix,radius,new Date().toISOString());
   await mutate(s=>{s.locationContext39??={};s.locationContext39.zones??={};s.locationContext39.zones[zoneKind]=saved;});
   if(!silent)toast((zoneKind==='home'?'Zuhause':'Arbeit')+' lokal verschlüsselt als Ortszone gespeichert.');
  }else{
   const result=classifyPosition39(fix,locationSettings39(state).zones);
   await mutate(s=>{s.locationContext39??={};s.locationContext39.mode='auto';s.locationContext39.last={kind:result.kind,reason:result.reason,accuracy:Math.round(fix.accuracy),checkedAt:new Date().toISOString()};});
   if(!silent)toast(result.kind==='unknown'?'Standort nicht eindeutig. Bitte Ortszonen und GPS-Genauigkeit prüfen.':'Kontext auf diesem Gerät erkannt.');
  }
 }catch(ex){if(!silent)toast(ex.code===1?'Standortzugriff nicht erteilt. Du kannst den Kontext manuell wählen.':'Standort: '+(ex.message||'nicht verfügbar'),true);}
 finally{ctx39Running=false;}
}
function ctx39ScheduleAuto(){
 // Render is a pure fast path. Check a permission that was ALREADY granted and
 // never open a permission prompt, keep a GPS watcher or poll in background.
 if(ctx39Running||Date.now()-ctx39LastAttempt<30*60*1000)return;
 const cfg=locationSettings39(state);
 if(cfg.mode!=='auto'||!Object.keys(cfg.zones).length||document.visibilityState==='hidden'||!navigator.permissions?.query)return;
 ctx39LastAttempt=Date.now();
 try{Promise.resolve(navigator.permissions.query({name:'geolocation'})).then(p=>{
  if(p?.state==='granted'&&state&&tab==='today'&&locationSettings39(state).mode==='auto')ctx39LocateAndSave(null,300,{silent:true});
 }).catch(()=>{});}catch{}
}
let familyRadarJumpPersonId401=null;
function chrome(content){
 if(state&&tab==='forecast'){
  const today=localDate();
  const entries=familyForecastEntries37(calendarEvents,state.people||{},state,{today});
  content=familyForecastPanel37(entries,calendarEvents,state,{selectedId:familyStudyEventId37,coverage:calendarCoverage,updatedAt:calendarUpdatedAt,now:new Date(),today})+content;
 }
 // Family radar reuses the cached Google Calendar and person records. No extra API call.
 if(state&&(tab==='people'||tab==='today')){
  const familyPeople=state.people||{};
  const familyNow=localDate();
  let familyVisible=null, familyProposals=null;
  if(tab==='today'){
   const familyStarted=performanceTrace.start();
   const birthdayStarted=performanceTrace.start();
   const birthdays=todayBirthdayHighlights(calendarBirthdayCandidates(calendarEvents,familyNow,7),e=>eventAppearance(e),familyPeople,familyNow);
   performanceTrace.end('Heute: Geburtstage sofort',tab,birthdayStarted);
   const key=core259FamilyKeyNow();core259FamilyKey=key;
   const fromWorker=core259FamilyCache.peek(key);
   content=todayBirthdayPanel(birthdays)+'<div data-core259-family style="display:contents">'+(fromWorker??'')+'</div>'+content;
   performanceTrace.end('Heute: Familien- und Geburtstagsradar',tab,familyStarted);
  }else{
   familyVisible=calendarEvents.filter(e=>e.status!=='cancelled'&&String(e.summary||'').includes(':')&&(!eventAppearance(e).hidden||showHiddenCalendarEvents));
   familyProposals=familySuggestions(familyVisible,familyPeople,state,{today:familyNow});
  }
  if(tab==='people'&&familyRadarJumpPersonId401){
   const options=peopleInScope(Object.values(familyPeople),peopleScope);
   const familySelected=options.find(p=>p.id===selectedPersonId)||options[0];
   if(familySelected&&familySelected.id===familyRadarJumpPersonId401){
    const familySettings=familyRules(state,familySelected);
    if(familySettings.enabled||familySelected.relationKind==='family')content=familyPersonPanel(familySettings.enabled?familyEvents(familyVisible,familySelected,{today:familyNow}):[],familyProposals,familySelected,familySettings,state?.familyRadar?.availability?.[familySelected.id]||{})+content;
   }
  }
 }
 if(tab==='shopping')content=compass57ShopTabs()+content;
 const num=Object.values(state?.records||{}).reduce((n,r)=>n+(!r.deleted&&!isDreamRecord(r)?1:0),0);
 const today=new Intl.DateTimeFormat('de-AT',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date());
 const title=tab==='today'&&selectedDay!==localDateString(new Date())?new Intl.DateTimeFormat('de-AT',{weekday:'long',day:'numeric',month:'long'}).format(new Date(`${selectedDay}T12:00:00`)):(({today:'Heute',forecast:'Forecast',radar:'Konferenzen',projects:'Projekte',templates:'Vorlagen',shopping:'Einkaufslisten',next:'Next Actions',flagged:'Flagged',hold:'On Hold',someday:'Dreams',review:'Wochenreview',overview:'Übersicht',inbox:'Inbox',system:'System & Synchronisation',activity:'Aktivitäten',people:'Menschen',progress:'Fortschritt',recovery:'Erholung',health:'Gesundheit',insights:'Insights',finance:'Finanzen'})[tab]||'Heute');
 const sub=({activity:'Sessions bearbeiten, zuordnen und verwalten.',people:'Gespräche, offene Punkte und Kontakte.',progress:'Fortschritt bei Projekten und Tätigkeiten.',recovery:'Aktive Erholung und freie Zeit im Blick.',health:'Schlaf, HRV und Körperzusammensetzung – Garmin und Fitdays an einem Ort.',insights:'Personal Analytics · Muster in Schlaf, Energie und Produktivität erkennen.',today:'Was heute wirklich zählt.',forecast:'Termine, Fristen und Agenden auf einer Zeitachse.',radar:'Forschungsmöglichkeiten und verifizierbare Einreichfristen.',projects:'Ergebnisse verfolgen, nächste Schritte verbinden.',shopping:'Einkäufe direkt abhaken und danach archivieren.',next:'Alle ausführbaren nächsten Schritte, auch ohne Datum.',flagged:'Bewusst hervorgehobene Aufgaben.',hold:'Bewusst pausiert oder auf Rückmeldung wartend.',someday:'Someday / Maybe · Ein Raum für Ideen ohne Verpflichtung.',review:'Gedanken klären, Verpflichtungen prüfen und bewusst wählen.',overview:'Alle Lebensbereiche auf einen Blick.',inbox:'Alles erfassen. Später in Ruhe klären.',system:'Deine Geräteverbindung und Datensicherheit.'})[tab]||'';
 return `<div class="shell premium751 compass55-${compass55Mode}"><aside class="sidebar" data-cm930-mode="${compass55Mode}" data-cm930-menu-open="${cm930MobileMenuOpen?'true':'false'}" aria-label="Navigation">
 <div class="brand"><span class="brand-icon premium751-brandmark"><img src="${import.meta.env.BASE_URL}icon-192.png" width="38" height="38" alt="" decoding="async"/></span><span class="brand-name">Compass<small>Personal Life Manager · ${COMPASS_VISIBLE_RELEASE}</small></span></div>
 
 <div class="compass57-mobile-mode"><div class="compass55-mode-switch compass56-mode-switch" role="group" aria-label="Anzeigemodus"><button type="button" data-action="compass55-mode" data-id="${compass55Mode==='focus'?'extended':'focus'}" class="compass56-mode-button ${compass55Mode==='focus'?'is-active':''}" aria-label="${compass55Mode==='focus'?'Focus aktiv. Zu Extended wechseln':'Extended aktiv. Zu Focus wechseln'}" aria-pressed="${compass55Mode==='focus'}" title="${compass55Mode==='focus'?'Focus (zu Extended wechseln)':'Extended (zu Focus wechseln)'}"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.25"/><circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none"/></svg></button></div></div>
 ${compass55Mode==='extended'?`<nav class="cm930-direct" aria-label="Schnellnavigation">
  <button type="button" data-tab="today" aria-label="Heute" class="${tab==='today'?'active':''}">${ico('sun',18)}<span>Heute</span></button>
  <button type="button" data-tab="inbox" aria-label="Inbox" class="${tab==='inbox'?'active':''}">${ico('inbox',18)}<span>Inbox</span></button>
  <button type="button" data-tab="people" aria-label="Menschen" class="${tab==='people'?'active':''}">${ico('people',18)}<span>Menschen</span></button>
  <button type="button" data-tab="finance" aria-label="Finanzen" class="${tab==='finance'?'active':''}">${ico('folder',18)}<span>Finanzen</span></button>
  <button type="button" data-tab="insights" aria-label="Insights" class="${tab==='insights'?'active':''}">${ico('layers',18)}<span>Insights</span></button>
  <button type="button" data-action="cm930-menu-toggle" aria-expanded="${cm930MobileMenuOpen}" aria-label="Weiteres Menü">${ico('menu',18)}<span>Mehr</span></button>
 </nav>`:''}<nav class="side-nav calm-side-nav" aria-label="Hauptnavigation">
 ${navItem('today','Heute','sun')}
 ${navItem('inbox','Inbox','inbox',{count:num})}
 <div class="calm-nav-group">
 <button type="button" class="calm-group-toggle ${calmNavGroup==='plan'?'is-open':''}" data-action="calm-nav-group" data-id="plan" aria-expanded="${calmNavGroup==='plan'}" aria-controls="calm-nav-plan">${ico('folder',19)}<span>Planen</span>${ico('arrow',14)}</button>
 ${calmNavGroup==='plan'?`<div class="calm-subitems" id="calm-nav-plan">
 <button type="button" class="calm-mobile-nav-back" data-action="calm-nav-group" data-id="plan" aria-label="Zur Hauptnavigation zurück">${ico('arrow',15)}<span>Menü</span></button>
 ${navItem('next','Next Actions','target')}
 ${navItem('projects','Projekte','folder')}
 ${navItem('forecast','Kalender & Forecast','calendar')}
 ${navItem('recovery','Freizeit & Erholung','heart')}
 ${navItem('shopping','Einkaufslisten','list')}
 <details class="plan610-more" ${['overview','templates','radar','flagged','hold','someday'].includes(tab)?'open':''}><summary>Weitere Planung</summary>
 ${navItem('flagged','Flagged','flag')}
 ${navItem('hold','On Hold','pause')}
 ${navItem('someday','Dreams · Someday','spark')}
 ${navItem('templates','Vorlagen','bookmark')}
 ${navItem('radar','Konferenzen','book')}
 ${navItem('overview','Übersicht','layers')}
 </details>
 </div>`:''}
 </div>
 ${navItem('people','Menschen','people')}
 <div class="calm-nav-group compass55-extended-only">
 <button type="button" class="calm-group-toggle ${calmNavGroup==='insights'?'is-open':''}" data-action="calm-nav-group" data-id="insights" aria-expanded="${calmNavGroup==='insights'}" aria-controls="calm-nav-insights">${ico('layers',19)}<span>Insights</span>${ico('arrow',14)}</button>
 ${calmNavGroup==='insights'?`<div class="calm-subitems" id="calm-nav-insights">
 <button type="button" class="calm-mobile-nav-back" data-action="calm-nav-group" data-id="insights" aria-label="Zur Hauptnavigation zurück">${ico('arrow',15)}<span>Menü</span></button>
 ${insights750Sidebar(tab,insightTab,ico)}
 </div>`:''}
 </div>
 <div class="calm-nav-group compass55-extended-only">
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
 <div class="utility-right"><div class="compass57-desktop-mode"><div class="compass55-mode-switch compass56-mode-switch" role="group" aria-label="Anzeigemodus"><button type="button" data-action="compass55-mode" data-id="${compass55Mode==='focus'?'extended':'focus'}" class="compass56-mode-button ${compass55Mode==='focus'?'is-active':''}" aria-label="${compass55Mode==='focus'?'Focus aktiv. Zu Extended wechseln':'Extended aktiv. Zu Focus wechseln'}" aria-pressed="${compass55Mode==='focus'}" title="${compass55Mode==='focus'?'Focus (zu Extended wechseln)':'Extended (zu Focus wechseln)'}"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.25"/><circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none"/></svg></button></div></div><button class="fw65-top-trigger" type="button" data-action="feeling-open" aria-label="Feeling Wheel öffnen – Gefühl erfassen" title="Wie fühlst du dich gerade? · Feeling Wheel" aria-haspopup="dialog"><span class="fw65-top-wheel" aria-hidden="true">✦</span><span class="fw65-top-caption">Gefühl</span></button>${shopping741QuickButton()}<button type="button" class="quick-utility-button dream743-quick" data-action="dream743-open" title="Traumwelt · schnelle Erfassung" aria-label="Nachttraum, Tagtraum oder Fantasie erfassen">🌙<span class="quick-utility-label">Traum</span></button>${worktimeQuickButton()}${habitQuickButton()}<button type="button" class="quick-utility-button pj92-food-trigger" data-action="pj92-food-open" title="Ernährung schnell erfassen" aria-label="Ernährung erfassen" aria-haspopup="dialog">${ico('food',18)}<span class="quick-utility-label">Ernährung</span></button><button type="button" class="quick-utility-button t577-top-trigger" data-action="t577-open" aria-label="Berührung & Nähe erfassen" title="Berührung & Nähe erfassen" aria-haspopup="dialog">🫂<span class="quick-utility-label">Nähe</span></button><button class="icon-utility" type="button" data-action="smart49-open" title="Smart Import Hub öffnen" aria-label="Dateien zentral importieren">${ico('upload',18)}</button>${weather.status==='loaded'?`<button class="weather-quick" type="button" data-action="weather-city" title="Wetterstandort ändern">${ico('sun',15)} <span>${h(weather.city)} · ${h(weather.temperature)} °C · ${h(weather.label)}</span></button>`:`<button class="weather-quick" type="button" data-action="weather-load" title="Wetter für Graz abrufen">${ico('sun',15)} <span>${weather.status==='loading'?'Wetter lädt …':'Wetter · Graz'}</span></button>`}
 <span class="connection"><span class="connection-dot ${state?(authToken?'green':'amber'):'gray'}"></span><span>${state?(authToken?(state.privateDeviceMirror?.key?(journalSyncStatus==='ok'?'Journal auf diesem Gerät abgeglichen':journalSyncStatus==='abgleich'?'Journal gleicht ab':'Journal lokal'):'Cloud verbunden · Journal nur lokal'):'Nur lokal · kein Sync'):'Tresor gesperrt'}</span></span>
 <span class="avatar" aria-label="Persönlicher Arbeitsbereich">${ico('compass',18)}</span>${state?`<button class="icon-utility" type="button" data-action="lock" title="Tresor sperren" aria-label="Tresor sperren">${ico('lock',19)}</button>`:''}</div></div>
 <div class="content ${tab==='today'||tab==='forecast'?'content-work':tab==='finance'?'content-finance':''}">
 <h1 class="sr-only">${h(title)}</h1>${tab==='today'?`<div class="ctx42-date-row"><nav class="daynav38" aria-label="Tag auswählen"><button type="button" data-action="daynav38" data-id="previous" title="Vorheriger Tag" aria-label="Vorheriger Tag">‹</button><button type="button" data-action="daynav38" data-id="today" title="Zu Heute springen" aria-label="Heute anzeigen">${h(title)}</button><button type="button" data-action="daynav38" data-id="next" title="Nächster Tag" aria-label="Nächster Tag">›</button></nav>${locationCycle46(state)}</div>`:''}
 ${notice&&!((tab==='finance'||tab==='insights')&&notice==='Synchronisiert. Alle verfügbaren Änderungen abgeglichen.')?`<div role="status" class="alert good ${tab==='finance'?'fin31-sync-status':''}">${h(notice)}</div>`:''}${error?`<div role="alert" class="alert bad">${h(error)}</div>`:''}
 ${content}<footer>Compass · Private Beta · Lokal verschlüsselt · Build ${COMPASS_VISIBLE_RELEASE} ${ico('shield',13)}</footer></div></main>${state||hasVault&&sealedCaptureAvailable?`<button class="capture-fab" type="button" data-action="capture-focus" aria-label="Schnellerfassung öffnen" title="Gedanken erfassen">${ico('plus',23)}</button>`:``}${captureOverlayOpen?captureOverlay():``}${inspirationRatingTask23?inspirationRatingModal(inspirationRatingTask23):''}${feelingOverlayOpen?feelingOverlay(feelingDraft,state?.feelingCheckins||[],{inputMode:feelingInputMode,captureReady:true}):``}${worktimeQuickOpen?worktimeQuickOverlay():``}${habitQuickOpen?habitQuickOverlay():``}${nutritionQuickOpen?nutritionQuickOverlay():``}${touchQuickOpen?touchQuickOverlay():``}${morningPlayerOpen?morningRenderOverlay():``}</div>`;
}




function moduleCard({name,iconName,sub='',action='',body='',cls='',active=false}){
 return `<section class="module-card ${cls} ${active?'module-active':'module-inactive'}" aria-label="${h(name)}">
 <div class="module-head"><div class="module-title">${ico(iconName,21)}<h2>${h(name)}</h2></div>${action?disabledButton(action):''}</div>
 ${sub?`<p class="module-subtitle">${h(sub)}</p>`:''}${body}</section>`;
}
const placeholder=(text='Noch keine Einträge')=>`<div class="empty-minimal"><span class="empty-circle">${ico('plus',17)}</span><span>${h(text)}</span></div>`;




function defaultHabitItems(){return DEFAULT_HABITS.map(item=>({...item}));}
function normalizeQuickPublic(raw){
 const safe=raw&&typeof raw==='object'?raw:{};
 const habitMap=new Map(defaultHabitItems().map(item=>[item.id,{...item}]));
 for(const item of Array.isArray(safe.habits)?safe.habits:[]){
  if(!item||!item.id)continue;
  habitMap.set(item.id,{id:String(item.id),title:String(item.title||item.id),slot:String(item.slot||''),active:item.active!==false});
 }
 const doneToday=[...new Set((Array.isArray(safe.doneToday)?safe.doneToday:[]).map(String))];
 const sessions=(Array.isArray(safe.worktime?.sessions)?safe.worktime.sessions:[])
   .filter(item=>item&&item.start)
   .slice(-12)
   .map(item=>({id:String(item.id||crypto.randomUUID()),start:String(item.start),end:item.end?String(item.end):'',category:item.category||'work',updatedAt:item.updatedAt||item.end||''}));
 return {habits:[...habitMap.values()].filter(item=>item.active!==false),doneToday,worktime:{activeStart:safe.worktime?.activeStart?String(safe.worktime.activeStart):'',activeCategory:safe.worktime?.activeCategory||'work',updatedAt:safe.worktime?.updatedAt||'',sessions}};
}
function readQuickPublic(){
 try{return normalizeQuickPublic(JSON.parse(localStorage.getItem(QUICK_PUBLIC_KEY)||'null'));}
 catch{return normalizeQuickPublic(null);}
}
function writeQuickPublic(){try{localStorage.setItem(QUICK_PUBLIC_KEY,JSON.stringify(quickPublic));}catch{}}
function publicHabitItems(){return normalizeQuickPublic(quickPublic).habits;}
function ensureHabitState(target){
 if(!target.habitsQuick||typeof target.habitsQuick!=='object')target.habitsQuick={items:defaultHabitItems(),completions:[]};
 if(!Array.isArray(target.habitsQuick.items))target.habitsQuick.items=defaultHabitItems();
 if(!Array.isArray(target.habitsQuick.completions))target.habitsQuick.completions=[];
 const existing=new Set(target.habitsQuick.items.map(item=>item?.id).filter(Boolean));
 for(const item of defaultHabitItems())if(!existing.has(item.id))target.habitsQuick.items.push(item);
 target.habitsQuick.items=target.habitsQuick.items.filter(item=>item&&item.id).map(item=>({id:String(item.id),title:String(item.title||item.id),slot:String(item.slot||''),active:item.active!==false}));
 // Preserve historical events AND explicit unchecked tombstones. Never invent a fresh timestamp during normalization.
  target.habitsQuick=mergeHabitQuick(target.habitsQuick,{});
 return target.habitsQuick;
}
function ensureWorktimeState(target){
 if(!target.quickWorktime||typeof target.quickWorktime!=='object')target.quickWorktime={sessions:[],activeStart:''};
 if(!Array.isArray(target.quickWorktime.sessions))target.quickWorktime.sessions=[];
 target.quickWorktime.sessions=target.quickWorktime.sessions.filter(item=>item&&item.start&&item.end).map(item=>({id:String(item.id||crypto.randomUUID()),start:String(item.start),end:String(item.end),category:String(item.category||'work'),updatedAt:String(item.updatedAt||item.end)}));
 target.quickWorktime.activeStart=target.quickWorktime.activeStart?String(target.quickWorktime.activeStart):'';
 return target.quickWorktime;
}
function habitItems(target){return target?(ensureHabitState(target).items.filter(item=>item.active!==false)):publicHabitItems();}
function habitIsDone(target,habitId,day=localDate()){return target?(ensureHabitState(target).completions.some(item=>item.habitId===habitId&&item.day===day&&item.done!==false)):(quickPublic.doneToday||[]).includes(habitId);}
function todayHabitIds(target,day=localDate()){return habitItems(target).filter(item=>habitIsDone(target,item.id,day)).map(item=>item.id);}
function setHabitDoneState(target,habitId,day=localDate(),done=true,doneAt=stamp()){
 const habits=ensureHabitState(target);const idx=habits.completions.findIndex(item=>item.habitId===habitId&&item.day===day);
 // Both checking and unchecking must be persisted: deleting a check would let another device restore it.
  const row={habitId,day,done:done===true,doneAt};if(idx>=0)habits.completions[idx]=row;else habits.completions.push(row);
}
function toggleHabitDoneState(target,habitId,day=localDate()){const next=!habitIsDone(target,habitId,day);setHabitDoneState(target,habitId,day,next);return next;}
function habitStreak(target,habitId,anchor=localDate()){
 let count=0;let cursor=new Date(anchor+'T12:00:00');
 for(let i=0;i<365;i+=1){const day=localDateString(cursor);if(!habitIsDone(target,habitId,day))break;count+=1;cursor.setDate(cursor.getDate()-1);}return count;
}
function habitDoneLastDays(target,habitId,days=14,anchor=localDate()){
 const end=new Date(anchor+'T12:00:00');const dots=[];
 for(let offset=days-1;offset>=0;offset-=1){const current=new Date(end);current.setDate(end.getDate()-offset);const day=localDateString(current);dots.push({day,done:habitIsDone(target,habitId,day)});}return dots;
}
function worktimeSource(target){if(target){const box=ensureWorktimeState(target);return {activeStart:box.activeStart||'',activeCategory:box.activeCategory||'work',updatedAt:box.updatedAt||'',sessions:box.sessions||[]};}return normalizeQuickPublic(quickPublic).worktime;}
function isWorktimeActive(target){return !!worktimeSource(target).activeStart;}
function worktimeSessionsForDay(target,day=localDate()){
 const source=worktimeSource(target);const rows=[];
 for(const item of source.sessions||[]){if(localDateString(new Date(item.start))===day||localDateString(new Date(item.end))===day)rows.push({...item});}
 if(source.activeStart&&localDateString(new Date(source.activeStart))===day)rows.push({id:'active-'+day,start:source.activeStart,end:''});
 return rows.sort((a,b)=>String(a.start).localeCompare(String(b.start)));
}
function worktimeMinutesForDay(target,day=localDate()){
 return worktimeSessionsForDay(target,day).reduce((sum,item)=>{const start=new Date(item.start).getTime();const end=item.end?new Date(item.end).getTime():Date.now();if(!Number.isFinite(start)||!Number.isFinite(end)||end<=start)return sum;return sum+Math.round((end-start)/60000);},0);
}
function formatTimeShort(value){return value?new Date(value).toLocaleTimeString('de-AT',{hour:'2-digit',minute:'2-digit'}):'–';}
function formatMinutesCompact(minutes){const total=Math.max(0,Math.round(Number(minutes)||0));const hours=Math.floor(total/60),mins=total%60;return hours?mins?hours+' h '+String(mins).padStart(2,'0')+' min':hours+' h':mins+' min';}
function applyWorktimeEvent(target,entry){
 const box=ensureWorktimeState(target);const at=entry?.at||stamp();
 if(entry?.type==='start'){if(!box.activeStart){box.activeStart=at;box.activeCategory=entry.category||'work';box.updatedAt=at;}return;}
 if(entry?.type==='stop'&&box.activeStart){if(new Date(at).getTime()>new Date(box.activeStart).getTime())box.sessions.push({id:entry.id||crypto.randomUUID(),start:box.activeStart,end:at,category:box.activeCategory||'work',updatedAt:at});box.activeStart='';box.updatedAt=at;}
}
function applyHabitEvent(target,entry){
 if(!entry?.habitId)return;const habits=ensureHabitState(target);
 if(!habits.items.some(item=>item.id===entry.habitId))habits.items.push({id:String(entry.habitId),title:String(entry.title||entry.habitId),slot:String(entry.slot||''),active:true});
 setHabitDoneState(target,String(entry.habitId),String(entry.day||localDate()),entry.done!==false,entry.at||stamp());
}
function syncQuickPublicFromState(){
 if(!state)return;const habits=habitItems(state).map(item=>({id:item.id,title:item.title,slot:item.slot||'',active:item.active!==false}));
 quickPublic={habits,doneToday:todayHabitIds(state),worktime:{activeStart:worktimeSource(state).activeStart||'',activeCategory:worktimeSource(state).activeCategory||'work',updatedAt:worktimeSource(state).updatedAt||'',sessions:worktimeSessionsForDay(state).filter(item=>item.end).map(item=>({id:item.id,start:item.start,end:item.end,category:item.category||'work'})).slice(-12)}};
 writeQuickPublic();
}
function syncQuickPublicHabit(habitId,done){
 const set=new Set(quickPublic.doneToday||[]);if(done)set.add(habitId);else set.delete(habitId);quickPublic={...normalizeQuickPublic(quickPublic),doneToday:[...set]};writeQuickPublic();
}
function syncQuickPublicWorktime(entry){
 const normalized=normalizeQuickPublic(quickPublic);const at=entry?.at||stamp();
 if(entry?.type==='start'){normalized.worktime.activeStart=normalized.worktime.activeStart||at;normalized.worktime.activeCategory=entry.category||'work';normalized.worktime.updatedAt=at;}
 else if(entry?.type==='stop'&&normalized.worktime.activeStart){normalized.worktime.sessions=[...normalized.worktime.sessions,{id:entry.id||crypto.randomUUID(),start:normalized.worktime.activeStart,end:at,category:normalized.worktime.activeCategory||'work',updatedAt:at}].slice(-12);normalized.worktime.activeStart='';normalized.worktime.updatedAt=at;}
 quickPublic=normalized;writeQuickPublic();
}
function worktimeQuickButton(){
 const active=isWorktimeActive(state);const title=active?'Arbeitszeit erfassen · Timer läuft':'Arbeitszeit erfassen';return `<button class="quick-utility-button pj92-work-quick ${active?'is-active':''}" type="button" data-action="worktime-quick-open" title="${title}" aria-label="${title}" aria-haspopup="dialog">${ico('clock',18)}<span class="quick-utility-label">Arbeit</span>${active?'<small class="pj92-work-status">●</small>':''}</button>`;
}
function habitQuickButton(){
 const items=habitItems(state),done=todayHabitIds(state).length;const complete=Boolean(items.length&&done===items.length);const title=items.length?`Habits abhaken · ${done} von ${items.length} erledigt`:'Habits abhaken';return `<button class="quick-utility-button pj92-habit-quick ${complete?'is-complete':''}" type="button" data-action="habit-quick-open" title="${title}" aria-label="${title}" aria-haspopup="dialog"><span class="pj92-habit-glyph" aria-hidden="true">💪</span><span class="quick-utility-label">Habits</span>${items.length?'<small class="pj92-habit-count">'+done+'/'+items.length+'</small>':''}</button>`;
}
function worktimeQuickOverlay(){
 const source=worktimeSource(state);const active=!!source.activeStart;const sessions=worktimeSessionsForDay(state);const total=worktimeMinutesForDay(state);
 return `<div class="quick-panel-backdrop" data-action="worktime-quick-close-backdrop"><section class="quick-panel" role="dialog" aria-modal="true" aria-labelledby="worktime-quick-title"><div class="quick-panel-head"><div><p class="capture-eyebrow">ARBEITSZEIT · SCHNELLERFASSUNG</p><h2 id="worktime-quick-title">Ein- und ausstempeln</h2></div><button type="button" class="capture-modal-close" data-action="worktime-quick-close" aria-label="Arbeitszeit schließen">${ico('x',18)}</button></div><label class="pj92-quick-category">Bereich <select id="pj92-current-category">${timeCategoryOptions(active?source.activeCategory||'work':worktimeSelectedCategory)}</select></label><div class="work569-actions"><button type="button" class="work569-action is-play" data-action="worktime-quick-start">${ico('play',24)}<span>Play</span></button><button type="button" class="work569-action is-stop" data-action="worktime-quick-stop">${ico('stop',24)}<span>Stopp</span></button></div><div class="work569-status ${active?'is-active':''}"><strong>${active?'Eingestempelt':'Nicht eingestempelt'}</strong><span>${active&&source.activeStart?'Seit '+formatTimeShort(source.activeStart):'Heute '+formatMinutesCompact(total)}</span></div><div class="work569-day"><div class="work569-day-head"><strong>Heute</strong><span>${formatMinutesCompact(total)}</span></div>${sessions.length?'<div class="work569-intervals">'+sessions.map(item=>'<div><span>'+formatTimeShort(item.start)+' – '+(item.end?formatTimeShort(item.end):'läuft')+'</span><strong>'+(item.end?formatMinutesCompact(Math.round((new Date(item.end).getTime()-new Date(item.start).getTime())/60000)):'aktiv')+'</strong></div>').join('')+'</div>':'<p class="muted-line">Noch kein Arbeitsblock erfasst.</p>'}</div><p class="quick-panel-hint">${state?(journalSyncStatus==='ok'?'Cloud-Abgleich dieses Geräts bestätigt ✓':journalSyncStatus==='abgleich'?'Synchronisierung läuft …':journalSyncStatus==='fehler'?'Abgleich fehlgeschlagen · lokal gesichert':'Lokal gesichert · Abgleich ausstehend'):'Auf diesem Gerät verschlüsselt vorgemerkt'}</p>${state?`<div class="journal-diagnostics"><small>Gerät: ${state.privateDeviceMirror?.key?(state.privateDeviceMirror.mode==='source'?'Hauptgerät':'Zweitgerät'):'Privater Geräteabgleich nicht eingerichtet'} · ${authToken?'angemeldet als '+h(currentUser||'unbekannt'):'nicht angemeldet'}</small><small>Cloud-Prüfung: ${journalLastReadAt?formatTimeShort(new Date(journalLastReadAt).toISOString())+' · Version '+journalRemoteVersion:'noch nicht erfolgt'}${journalRemoteActiveStart?' · Cloud-Timer seit '+formatTimeShort(journalRemoteActiveStart):' · kein aktiver Cloud-Timer bestätigt'}</small>${journalLastError?`<small class="journal-diagnostics-error">${h(journalLastError)}</small>`:''}<button type="button" class="secondary-btn" data-action="pj92-sync-now">Jetzt abgleichen</button></div>`:''}</section></div>`;
}
async function storeStrengthGuidedSession(session){
 if(!state||!session?.id||session.source!=='compass-guided-v5920')return;
 await mutate(st=>{
   const previous=Array.isArray(st.strengthGuidedSessions)?st.strengthGuidedSessions:[];
   const at=previous.findIndex(item=>item.id===session.id);
   const updated={...session};
   if(at<0)st.strengthGuidedSessions=[...previous,updated].slice(-150);
   else {const next=previous.slice();next[at]=updated;st.strengthGuidedSessions=next;}
 },null,true);
}
function habitQuickOverlay(){
 const items=habitItems(state);const doneSet=new Set(todayHabitIds(state));
 return `<div class="quick-panel-backdrop" data-action="habit-quick-close-backdrop"><section class="quick-panel" role="dialog" aria-modal="true" aria-labelledby="habit-quick-title"><div class="quick-panel-head"><div><p class="capture-eyebrow">HABITS · HEUTE ERLEDIGT</p><h2 id="habit-quick-title">Gewohnheiten abhaken</h2></div><button type="button" class="capture-modal-close" data-action="habit-quick-close" aria-label="Habits schließen">${ico('x',18)}</button></div><div class="habit569-summary"><strong>${doneSet.size}/${items.length}</strong><span>heute erledigt</span></div><div class="habit569-list">${items.map(item=>{const done=doneSet.has(item.id);const lockedDone=!state&&done;return item.id==='wim-hof'?'<button type="button" class="habit569-item wh621-trigger '+(done?'is-done':'')+'" data-action="wim-hof-start" aria-label="Wim-Hof-Player öffnen"><span><strong>▶ Wim-Hof · Atemroutine</strong><small>Morgen oder Abend · Audio-Player</small></span><span class="habit569-check">'+(done?'✓':'▶')+'</span></button>':item.id==='hakka-5'?'<button type="button" class="habit569-item makko610-trigger '+(done?'is-done':'')+'" data-action="makko-guide-start" aria-label="Makko-Ho Übungsfolge starten"><span><strong>▶ Makko-Ho · Meridian-Stretches</strong><small>6 geführte Übungen mit Timer</small></span><span class="habit569-check">'+(done?'✓':'▶')+'</span></button>':'<button type="button" class="habit569-item '+(done?'is-done':'')+'" data-action="habit-toggle" data-id="'+h(item.id)+'" '+(lockedDone?'disabled':'')+'><span><strong>'+h(item.title)+'</strong>'+(item.slot?'<small>'+h(item.slot)+'</small>':'')+'</span><span class="habit569-check">'+(done?'✓':'')+'</span></button>';}).join('')}</div><div class="quick-panel-row" style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px"><button type="button" class="primary-btn" data-action="mm570-open" style="min-width:0">🌅 Miracle Morning</button><button type="button" class="primary-btn" data-action="strength-coach-open" style="min-width:0">💪 Coach</button></div><div class="quick-panel-row"><button type="button" class="secondary-btn" data-action="habit-open-insights">Insights öffnen</button></div>${state?'':'<p class="quick-panel-hint">Verschlüsselt vorgemerkt</p>'}</section></div>`;
}
function nutritionQuickOverlay(){
 return `<div class="quick-panel-backdrop" data-action="pj92-food-close-backdrop"><section class="quick-panel pj92-food-panel" role="dialog" aria-modal="true" aria-labelledby="pj92-food-title"><div class="quick-panel-head"><div><p class="capture-eyebrow">ERNÄHRUNG · EIN TIPP GENÜGT</p><h2 id="pj92-food-title">Was gab es gerade?</h2></div><button type="button" class="capture-modal-close" data-action="pj92-food-close" aria-label="Ernährung schließen">${ico('x',18)}</button></div>${nutritionQuickView(state)}${quickEnergyMeter(state)}${state?mealComposerMarkup(mealComposeText,mealComposeModel):''}<button type="button" data-action="pj92-food-insights" class="secondary-btn">Ernährungstagebuch ansehen →</button>${!state?'<small>Ohne Entsperren: Einträge bleiben bis zum nächsten Entsperren nur auf diesem Gerät gespeichert.</small>':''}</section></div>`;
}
function touchQuickOverlay(){
 if(!state)return '';
 return `<div class="quick-panel-backdrop t577-overlay-backdrop" data-action="t577-capture-cancel"><section class="quick-panel t577-capture-panel" role="dialog" aria-modal="true" aria-labelledby="t577-capture-title"><div class="quick-panel-head"><div><p class="capture-eyebrow">BERÜHRUNG & NÄHE</p><h2 id="t577-capture-title">Was gab es?</h2></div><button type="button" class="capture-modal-close" data-action="t577-capture-cancel" aria-label="Schließen">${ico('x',18)}</button></div>${touchQuickView(state,{personId:touchDefaultPersonId})}<button type="button" class="secondary-btn" data-action="t577-show-history">Chronik öffnen →</button></section></div>`;
}
function journalSyncPanel(){const ready=Boolean(state?.privateDeviceMirror?.key&&authToken);return `<section class="work-card pj92-sync-status"><span>${ico('sync',16)} Habits, Zeitjournal, Ernährung & Kalender: ${ready?journalSyncStatus==='ok'?'verschlüsselt abgeglichen ✓':journalSyncStatus==='abgleich'?'Abgleich läuft …':journalSyncStatus==='fehler'?'Abgleich fehlgeschlagen – erneut versuchen':'lokal gespeichert · Abgleich ausstehend':'nur lokal – Geräteabgleich einrichten'}</span>${ready?'<button type="button" class="secondary-btn" data-action="pj92-sync-now">Jetzt abgleichen</button>':'<button type="button" class="secondary-btn" data-tab="system">Geräteabgleich einrichten</button>'}</section>`;}
function quickWorktimeInsights(){
 const sessions=worktimeSessionsForDay(state);const total=worktimeMinutesForDay(state);const weekTotal=[0,1,2,3,4,5,6].reduce((sum,offset)=>{const d=new Date(localDate()+'T12:00:00');d.setDate(d.getDate()-offset);return sum+worktimeMinutesForDay(state,localDateString(d));},0);
 return `<section class="work-card work569-insight-card"><div class="work-heading"><span>${ico('clock',18)} Tatsächliche Arbeitszeit</span><button type="button" class="secondary-btn" data-action="pj92-open-timejournal">Zeitjournal öffnen →</button></div><div class="work569-insight-grid"><div><small>Heute</small><strong>${formatMinutesCompact(total)}</strong></div><div><small>7 Tage</small><strong>${formatMinutesCompact(weekTotal)}</strong></div><div><small>Status</small><strong>${isWorktimeActive(state)?'Eingestempelt':'Nicht aktiv'}</strong></div></div>${sessions.length?'<div class="work569-intervals">'+sessions.map(item=>'<div><span>'+formatTimeShort(item.start)+' – '+(item.end?formatTimeShort(item.end):'läuft')+'</span><strong>'+(item.end?formatMinutesCompact(Math.round((new Date(item.end).getTime()-new Date(item.start).getTime())/60000)):'aktiv')+'</strong></div>').join('')+'</div>':'<p class="muted-line">Heute noch keine Arbeitsblöcke gestempelt.</p>'}</section>`;
}
function makkoTimeInsights(st){
 const rows=(Array.isArray(st?.makkoHoSessions)?st.makkoHoSessions:[]).filter(x=>x&&Number(x.totalSeconds)>0&&Array.isArray(x.holds));
 if(!rows.length)return '<section class="work-card"><div class="work-heading"><span>🌸 Makko-Ho · Übungszeit</span></div><p class="muted-line">Nach deiner ersten Übung erscheinen hier die tatsächlich gehaltenen Zeiten und dein Verlauf.</p></section>';
 const sorted=[...rows].sort((a,b)=>String(a.finishedAt||'').localeCompare(String(b.finishedAt||'')));
 const complete=sorted.filter(x=>x.completed);
 const latest=sorted[sorted.length-1];
 const today=new Date();today.setHours(12,0,0,0);
 const dates=Array.from({length:14},(_,i)=>{const d=new Date(today);d.setDate(d.getDate()-(13-i));return localDateString(d);});
 const values=dates.map(day=>sorted.filter(x=>x.day===day).reduce((n,x)=>n+Math.round(Number(x.totalSeconds)||0),0));
 const recent=values.slice(-7).reduce((a,b)=>a+b,0);
 const earlier=values.slice(0,7).reduce((a,b)=>a+b,0);
 const max=Math.max(60,...values);
 const mins=n=>Math.round(n/60*10)/10;
 const dots=dates.map((d,i)=>'<div title="'+h(d)+' · '+values[i]+' Sekunden" style="display:flex;flex-direction:column;align-items:center;gap:4px;flex:1;min-width:0"><div style="height:48px;display:flex;align-items:flex-end"><span style="display:block;width:10px;height:'+Math.max(3,Math.round(values[i]/max*46))+'px;border-radius:8px;background:'+(values[i]?'#40846b':'#dce7de')+'"></span></div><small style="font-size:9px;color:#6f8076">'+d.slice(8)+'</small></div>').join('');
 const parts=latest.holds.map(row=>'<div style="display:flex;justify-content:space-between;gap:12px;padding:4px 0;border-bottom:1px solid #e6eee8"><span>'+h(({metal:'ZENKUTSU',earth:'KOKYŪ',fire:'KOKAN',water:'ASHI',innerfire:'KOSA',wood:'SOKUHO'})[row.pose]||row.pose)+(row.side?' · '+(row.side==='left'?'links':'rechts'):'')+'</span><strong>'+Math.max(0,Math.round(row.seconds))+' s</strong></div>').join('');
 return '<section class="work-card" aria-label="Makko-Ho Fortschritt"><div class="work-heading"><span>🌸 Makko-Ho · Übungszeit</span><small>'+complete.length+' vollständig · '+sorted.length+' erfasst</small></div><div class="habit569-kpis"><div><small>Letzte Session</small><strong>'+mins(latest.totalSeconds)+' min</strong></div><div><small>Letzte 7 Tage</small><strong>'+mins(recent)+' min</strong></div><div><small>Vorige 7 Tage</small><strong>'+mins(earlier)+' min</strong></div></div><div style="margin:14px 0;display:flex;align-items:end;gap:5px;min-height:68px" aria-label="14 Tage Haltezeit in Sekunden">'+dots+'</div><details><summary>Letzte Session · Zeiten pro Haltung</summary><div style="margin-top:10px;font-size:13px">'+parts+'</div></details><p class="muted-line" style="margin-top:8px">Nur aktive Haltezeit; Pausen zählen nicht. Vorzeitig beendete Sessions sind gesondert erfasst.</p></section>';
}
function habitInsightsView(){
 const items=habitItems(state);const done=todayHabitIds(state).length;const avg14=items.length?Math.round(items.reduce((sum,item)=>sum+habitDoneLastDays(state,item.id,14).filter(dot=>dot.done).length,0)/(items.length*14)*100):0;
 return `<div class="habit569-page"><div class="mm571-root">${morningIntelligenceHeader(morningTab)}${morningTab==='create'?morningCreateView(state,{goals:lifeGoals(state),journalEditingId:morningJournalEditingId,journalDraft:morningJournalDraft}):morningTab==='insights'?morningInsightsView(state,{days:morningPeriod}):morningHubView(state,{settings:morningSettingsOpen,goals:lifeGoals(state)})}${morningTab==='insights'?morningConnectionsView(morningConnections(state,{today:localDate(),days:morningPeriod})):''}</div>${journalSyncPanel()}${habitTimeInsightsView(state,{anchor:localDate(),days:30})}${makkoTimeInsights(state)}<section class="work-card"><div class="work-heading"><span>${ico('checkSquare',18)} Habit Tracker</span><button type="button" class="secondary-btn" data-action="habit-quick-open">Heute abhaken</button></div><p class="muted-line">Einfach, schnell und motivierend. Ein Häkchen pro Habit genügt.</p><div class="habit569-kpis"><div><small>Heute</small><strong>${done}/${items.length}</strong></div><div><small>14-Tage-Konsistenz</small><strong>${avg14}%</strong></div><div><small>Aktive Habits</small><strong>${items.length}</strong></div></div></section><section class="work-card"><div class="work-heading"><span>Deine Habits</span><span class="quiet-tag">${items.length}</span></div><div class="habit569-cards">${items.map(item=>{const streak=habitStreak(state,item.id);const dots=habitDoneLastDays(state,item.id,14);const doneToday=habitIsDone(state,item.id);return '<article class="habit569-card"><div class="habit569-card-head"><div><strong>'+h(item.id==='hakka-5'?'Makko-Ho · 6 Meridian-Stretches':item.title)+'</strong>'+(item.slot?'<small>'+h(item.slot)+'</small>':'')+'</div><button type="button" class="secondary-btn" data-action="'+(item.id==='hakka-5'?'makko-guide-start':item.id==='wim-hof'?'wim-hof-start':'habit-toggle')+'" data-id="'+h(item.id)+'">'+(item.id==='hakka-5'?'▶ Übungen starten':item.id==='wim-hof'?'▶ Atemroutine starten':doneToday?'Heute erledigt ✓':'Heute abhaken')+'</button></div><div class="habit569-stats"><span>Streak <strong>'+(streak||0)+'</strong></span><span>14 Tage <strong>'+dots.filter(dot=>dot.done).length+'/14</strong></span></div><div class="habit569-dots">'+dots.map(dot=>'<span class="'+(dot.done?'is-done':'')+'" title="'+h(dot.day)+'"></span>').join('')+'</div></article>';}).join('')}</div></section><section class="work-card"><div class="work-heading"><span>Neues Habit hinzufügen</span></div><form id="habit69-new-form" class="habit569-form"><label>Titel<input type="text" name="title" maxlength="80" placeholder="z. B. Journaling" value="${h(habitDraftTitle)}" required/></label><label>Zeitfenster<select name="slot"><option value="Morgen">Morgen</option><option value="Mittag">Mittag</option><option value="Abend">Abend</option><option value="Flexibel">Flexibel</option></select></label><button type="submit" class="primary-btn">Habit hinzufügen</button></form></section></div>`;
}
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
 ${moduleCard({name:'Kalender & Fokus',iconName:'calendar',cls:'grid-calendar',active:true,sub:'Deine Termine (Google, nur lesend)',body:calendarRowsOrConnect36(localDateString(new Date()),{filters:false})})}




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
 return capacityForecast({events:calendarEvents,connected:!!(calendarToken&&Date.now()<calendarExpires)||Boolean(state?.calendarArchive?.completed),coverage:calendarCoverage,updatedAt:calendarUpdatedAt,now:new Date(),startDay,days,settings:state?.uiPreferences?.capacity||{}});
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
function researchRefreshPanel(mode='today'){
 const reminders=researchReminders(state,localDate());
 if(!reminders.length)return '';
 const preview=mode==='today'?reminders.slice(0,2):reminders;
 return `<section class="work-card research-refresh-panel" aria-label="Recherche-Wiedervorlagen">
  <div class="work-heading"><span>${ico('calendar',17)} ${mode==='review'?'Freizeit-Recherchen aktualisieren':'Freizeitprogramme überprüfen'}</span><span class="quiet-tag">${reminders.length} Wiedervorlagen</span></div>
  <p class="muted-line">Aus dem letzten Import und der Programmabdeckung berechnet. Keine automatisch angelegte Deadline.</p>
  <div class="research-refresh-list">${preview.map(item=>`<div class="research-refresh-item"><span class="research-refresh-emoji">${h(item.icon)}</span><div><strong>${h(item.label)}</strong><small>${h(researchReminderText(item))} · Letzter Import ${h(formatResearchDate(item.updatedAt))}${item.coverageEnd?' · Letzter recherchierter Veranstaltungstag '+h(item.coverageEnd):''}</small></div><button class="secondary-btn" type="button" data-action="discovery-research-open" data-id="${h(item.id)}">Prompt öffnen →</button></div>`).join('')}</div>
  ${mode==='today'&&reminders.length>preview.length?`<button class="text-link" type="button" data-tab="review">Weitere ${reminders.length-preview.length} im Weekly Review ansehen →</button>`:''}
 </section>`;
}

function yesterday710Panel(day){
 if(day!==localDate()||!state)return '';
 const open=yesterdayIntentions(state,day);
 if(!open.length)return '';
 return `<section class="yesterday710-panel" aria-label="Gestern geplant und noch offen"><header><strong>↶ Gestern geplant · noch offen</strong><small>${open.length} ${open.length===1?'Aufgabe':'Aufgaben'} vom ${h(previousLocalDay(day))}</small></header>
 <p>Nur gestern vorgemerkt, heute nicht automatisch übertragen. Wähle selbst, was du erneut einplanst. Morgen verschwindet dieser Hinweis.</p>
 <div class="yesterday710-list">${open.slice(0,12).map(({task:t,canPlan})=>`<div class="yesterday710-row"><span><span class="yesterday710-label">Gestern</span> ${h(t.title)}</span><button class="text-link" type="button" data-action="task-select" data-id="${h(t.id)}">Ansehen</button>${canPlan?`<button class="secondary-btn" type="button" data-action="yesterday710-plan-today" data-id="${h(t.id)}">Heute +</button>`:''}</div>`).join('')}</div>
 ${open.length>12?`<small>Weitere ${open.length-12} Aufgaben unter Next Actions mit Kennzeichnung „Gestern geplant“.</small>`:''}</section>`;
}
function compass55InspectorContent(){return `${todayInspectorOpen&&state?.tasks?.[selectedTaskId]&&!state.tasks[selectedTaskId].archived?`<section class="work-card inspector-card today-focus-inspector"><div class="work-heading"><span>${ico('checkSquare',18)} Aufgabe bearbeiten</span><button type="button" class="today-inspector-close" data-action="today-inspector-close" title="Inspector schließen" aria-label="Inspector schließen – Was passt jetzt? anzeigen">${ico('x',17)}</button></div>${taskEditor()}</section>`:(compass56RecommendationMarkup&&compass56RecommendationDay===selectedDay?compass56RecommendationPanel():compass56RecommendationButton())}`;}
let ctx40Expanded=false;
function todayWork(locked=false){
 const selected=localDateString(new Date())===selectedDay;
 const dayTasks=tasksForDay(state,selectedDay).filter(t=>!waitingSourceId(t));
 return `${ctx40Expanded&&selectedDay===localDate()?contextNextPanel40(state,{day:selectedDay,context:effectiveContext39(state).kind}):""}<div class="today-layout premium751-today">${calendarRail()}<div class="today-center">
 <section class="work-card appointments"><div class="work-heading"><span>${ico('calendar',18)} Termine ${selected?'heute':h(dayFormat(new Date(`${selectedDay}T12:00:00`)))}</span><span class="quiet-tag">${h(calendarStatus)}</span></div>
 ${calendarRowsOrConnect36(selectedDay)}</section>${eventAgendaPanel()}${selectedDay===localDate()?researchRefreshPanel('today'): ''}
 <section class="work-card today-tasks"><div class="work-heading"><span>${ico('list',18)} Meine Aufgaben ${selected?'für heute':'für diesen Tag'}</span><span class="quiet-tag">${dayTasks.filter(t=>t.completed).length} / ${dayTasks.length} erledigt</span></div>
 ${yesterday710Panel(selectedDay)}
 ${waiting715TodayPanel(selectedDay)}
 ${taskList(dayTasks, 'day')}
 ${state?`<details class="calm-create"><summary>${ico('plus',15)} Neue Aufgabe hinzufügen</summary>${taskCreateForm(selectedDay)}</details>`:''}
 <div class="capture-inline"><form id="capture-form"><label class="sr-only" for="capture">Schnell in die Inbox erfassen</label><input id="capture" name="title" maxlength="1000" required placeholder="Gedanken sofort in der Inbox festhalten …" ${locked?'disabled':''}/><button type="submit" class="primary-btn" ${locked?'disabled':''}>${ico('plus',17)} Erfassen</button></form><small>Inbox bleibt ein eigener Eingang; eine Aufgabe erhält bewusst ein Datum.</small></div></section>
 <div class="below-today"><section class="work-card deadline-card"><div class="work-heading"><span>${ico('flag',18)} Fristen & Vorausschau</span><span class="quiet-tag">–</span></div><div class="preview-empty-small">${dueTasks(state,4).map(t=>`<div class="deadline-inline"><strong>${h(t.dueDate)}</strong> ${h(t.title)}</div>`).join('')||'Noch keine offenen Deadlines erfasst.'}</div></section>
 <section class="work-card review-card"><div class="work-heading"><span>${ico('sync',18)} Review</span><span class="quiet-tag">–</span></div><div class="preview-empty-small">${gtdTodaySummary()}</div></section></div>
 </div><aside class="inspector-rail today-context-rail" aria-label="${todayInspectorOpen?'Aufgaben-Inspector':'Was passt jetzt?'}">${compass55InspectorContent()}</aside></div>`;
}
function radarScreen(){
 const forecast=localCapacity(localDate(),30);
 return chrome(conferenceRadarView(conferenceEntries(state),{topic:radarTopic,region:radarRegion,focus:radarFocus,today:localDate(),forecast,state}));
}
let forecastInspectorOpen401=false;
function forecastScreen(){
 const list=dueTasks(state,600),planned=Object.values(state?.tasks||{}).filter(t=>!t.archived&&!state.projects?.[t.projectId]?.isTemplate&&!t.completed&&t.plannedDate),today=localDate();
 const days=Array.from({length:14},(_,i)=>{const d=new Date(today+'T12:00:00');d.setDate(d.getDate()+i);return localDate(d);});
 const overdue=list.filter(t=>t.dueDate<today);
 const dayContent=day=>{
  const tasks=list.filter(t=>t.dueDate===day);const plannedTasks=planned.filter(t=>t.plannedDate===day&&t.dueDate!==day);
  const ev=calendarReadable36()?visibleCalendarEvents(day):[];
  if(!tasks.length&&!plannedTasks.length&&!ev.length)return '';
  const combined=[...tasks.map(t=>({type:'task',sort:'0',obj:t})),...plannedTasks.map(t=>({type:'planned',sort:'0b',obj:t})),...ev.map(e=>({type:'event',sort:e.start?.dateTime||'1',obj:e}))].sort((a,b)=>a.sort.localeCompare(b.sort));
  return `<div class="forecast-date-group"><h3>${h(new Intl.DateTimeFormat('de-AT',{weekday:'long',day:'numeric',month:'long'}).format(new Date(day+'T12:00:00')))}</h3><div class="timeline-day">${combined.map(x=>x.type==='task'?`<div class="timeline-item deadline-event">${ico('flag',19)}<div><strong>${h(x.obj.title)}</strong><small>Compass · harte Deadline · ${h(CATEGORY_LABELS[x.obj.category]||x.obj.category)}</small></div><button type="button" class="secondary-btn" data-action="task-select" data-id="${h(x.obj.id)}">Details</button></div>`:x.type==='planned'?`<div class="timeline-item planned-event">${ico('calendar',19)}<div><strong>${h(x.obj.title)}</strong><small>Compass · Planned (Wunschtermin, keine Deadline)</small></div><button type="button" class="secondary-btn" data-action="task-select" data-id="${h(x.obj.id)}">Details</button></div>`:`<button type="button" class="timeline-item calendar-event" data-action="agenda-open" data-id="${h(x.obj.id)}"><span class="forecast-event-emoji">${h(eventAppearance(x.obj).emoji)}</span><div><strong>${h(eventAppearance(x.obj).displayTitle||'Kalendertermin')}</strong><small>Google Calendar · ${h(eventAppearance(x.obj).category)} · ${h(calendarTime(x.obj))}${x.obj.start?.date?' · Ganztagsmarker':''}${eventAppearance(x.obj).hidden?' · ausgeblendet':''}</small></div>${agendaEvent(x.obj)}${ico('arrow',15)}</button>`).join('')}</div></div>`;
 };
 return chrome(`${calendarDeadlinePanel()}<div class="forecast-layout ${forecastInspectorOpen401?"forecast-inspector-open":"forecast-inspector-closed"}">${calendarRail()}<section class="forecast-full work-card"><div class="work-heading"><span>${ico('calendar',21)} Forecast · Deadlines, Planung & Termine</span><span class="quiet-tag">14 Tage</span></div>
 ${capacityPanel()}
 ${dailyPlanPanel()}
 ${proactivePlannerPanel()}
 ${recoveryView(recoveryCandidates(state,localCapacity(localDate(),14),{kind:timeoffKind,today:localDate()}),recoveryEvidence(state?.workTime||{},state?.healthImports?.garminNights||[],localDate(),workThreshold),{kind:timeoffKind,open:timeoffOpen})}
 ${deadlineCompact({inForecast:true})}
 <div class="forecast-tools">${calendarReadable36()?calendarFilterToggle()+cachedCalendarControls36():calendarConnectUI()}<span class="muted-line">${list.length} offene Deadlines · ${planned.length} geplante Aufgaben · ${days.reduce((sum,d)=>sum+recoveryEvents(d).length,0)} Erholungstermine · Google Calendar nur lesend</span></div>
 ${overdue.length?`<div class="forecast-date-overdue"><strong>Überfällig</strong>${taskList(overdue,'forecast')}</div>`:''}
 ${days.map(dayContent).join('')||'<div class="task-empty">Keine Termine oder Fristen für die kommenden 14 Tage.</div>'}
 <p class="rail-footnote">Ganztägig markierte Fristen blockieren nicht automatisch deinen ganzen Tag. Zeitblöcke können ausgeblendet werden.</p></section><aside class="forecast-inspector">${eventAgendaPanel()}<section class="work-card task-inspector"><div class="work-heading"><span>${ico('checkSquare',18)} Aufgabe bearbeiten</span><button type="button" class="forecast-inspector-close" data-action="forecast-inspector-close" title="Aufgabe bearbeiten schließen" aria-label="Aufgabe bearbeiten schließen">${ico('x',17)}</button></div>${taskEditor()}</section></aside></div>`);
}
function projectOptions(selected=''){
 const options=['<option value="">Kein Projekt</option>'];
 const visit=(parent,depth)=>{for(const proj of childProjects(state,parent)){
  if(proj.kind==='project'&&visibleInProjectTree48(state,proj)&&(!proj.isTemplate||proj.id===selected)&&(proj.status!=='completed'||proj.id===selected))options.push(`<option value="${h(proj.id)}" ${selected===proj.id?'selected':''}>${'  '.repeat(depth)}${h(proj.title)}</option>`);
  if(depth<15)visit(proj.id,depth+1);
 }};visit(null,0);if(selected&&state.projects?.[selected]?.isTemplate&&!options.some(x=>x.includes('value="'+h(selected)+'"')))options.push(`<option value="${h(selected)}" selected>${h(state.projects[selected].title)} · Vorlage</option>`);return options.join('');
}
function projectParentOptions(selected='',excludeId=''){
 const blocked=excludeId?new Set([excludeId,...projectDescendantIds(state,excludeId)]):new Set();
 const roots=['<option value="">Oberste Ebene</option>'];
 const walk=(parent,depth)=>{for(const proj of childProjects(state,parent)){
  if(blocked.has(proj.id)||!visibleInProjectTree48(state,proj))continue;
  roots.push(`<option value="${h(proj.id)}" ${proj.id===selected?'selected':''}>${'  '.repeat(depth)}${proj.kind==='folder'?'▸ ':''}${h(proj.title)}</option>`);
  if(depth<15)walk(proj.id,depth+1);
 }};
 walk(null,0);return roots.join('');
}
function taskParentOptions(projectId,selected='',self=''){
 const blocked=new Set([self]);const visit=(id)=>{for(const t of Object.values(state?.tasks||{}).filter(t=>t.parentTaskId===id)){if(blocked.has(t.id))continue;blocked.add(t.id);visit(t.id);}};
 if(self)visit(self);
 return '<option value="">Hauptebene</option>'+hierarchicalProjectTasks(state,projectId).filter(t=>!blocked.has(t.id)&&!t.completed).map(t=>`<option value="${h(t.id)}" ${selected===t.id?'selected':''}>${'  '.repeat(Math.min(t.depth,8))}${h(t.title)}</option>`).join('');
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
 ${defaultProject&&state?.projects?.[defaultProject]?.isTemplate?`<label class="shopping-template-context">Vorlage: <strong>${h(state.projects[defaultProject].title)}</strong></label><input type="hidden" name="projectId" value="${h(defaultProject)}"/>`:`<label>Projekt<select name="projectId">${projectOptions(defaultProject)}</select></label>`}${defaultProject?`<label>Unteraufgabe von<select name="parentTaskId">${taskParentOptions(defaultProject,defaultParent)}</select></label>`:''}
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
 const yesterdayIds=nextScope?new Set(yesterdayIntentions(state,localDate()).map(x=>x.task.id)):new Set();
 return items.length?`<div class="task-list ${nextScope?'next38-list':''}" data-scope="${h(scope)}">${items.map((t,i)=>`<div class="task-row ${nextScope?'next38-row':''} ${selectedTaskId===t.id?'is-selected':''} ${t.completed?'completed':''}" ${nextScope?`data-next-row="${h(t.id)}"`:''}>${scope==='day'?`<span class="p49-today-move"><button type="button" data-action="p49-today-up" data-id="${h(t.id)}" title="Nach oben" aria-label="${h(t.title)} nach oben" ${i===0||t.completed?'disabled':''}>↑</button><button type="button" data-action="p49-today-down" data-id="${h(t.id)}" title="Nach unten" aria-label="${h(t.title)} nach unten" ${i===items.length-1||t.completed?'disabled':''}>↓</button></span>`:''}${nextScope?`<span class="next38-drag" draggable="true" data-next-drag="${h(t.id)}" role="img" aria-label="${h(t.title)} zum Sortieren ziehen" title="Ziehen zum Sortieren, alternativ Pfeiltasten">⠿</span>`:''}<button type="button" class="task-check" data-action="task-toggle" data-id="${h(t.id)}" aria-label="${t.completed?'Wieder öffnen':'Erledigen'}">${t.completed?'✓':''}</button><button type="button" class="flag-button ${t.flagged?'is-flagged':''}" data-action="task-flag" data-id="${h(t.id)}" title="Flagged umschalten">${ico('flag',17)}</button>${inlineTaskTitle(t,`<span ${Number.isInteger(t.depth)?`style="padding-left:${Math.min(t.depth,8)*17}px"`:''}><strong>${t.depth?'↳ ':''}${h(t.title)}</strong><small>${h(CATEGORY_LABELS[t.category]||t.category)}${t.dueDate?' · Deadline '+h(t.dueDate):''}${t.workflow==='waiting'?' · Waiting For':t.workflow==='hold'?' · On Hold':''}${t.deferUntil&&t.deferUntil>localDate()?' · ab '+h(t.deferUntil):''}${t.estimateMinutes?' · '+t.estimateMinutes+' min':''}${(t.contextTags||[]).length?' · @'+h(t.contextTags.join(' @')):''}${state?.taskPending?.[t.id]?' · Lokal gespeichert':''}${nextScope&&t.plannedDate===localDate()?' · Für heute vorgemerkt':''}</small>${nextScope&&yesterdayIds.has(t.id)?'<span class="yesterday710-label">↶ Gestern geplant</span>':''}${t.tags?.length?`<span class="task-tags">${t.tags.map(tag=>'<i>#'+h(tag)+'</i>').join('')}</span>`:''}</span>`)}${taskProgressInline(t)}${nextScope?`<button type="button" class="next38-today ${t.plannedDate===localDate()?'is-planned':''}" data-action="next-plan-today" data-id="${h(t.id)}" aria-pressed="${t.plannedDate===localDate()}" title="${t.plannedDate===localDate()?'Heute-Vormerkung entfernen':'Ohne Fälligkeitsdatum für heute vormerken'}">${ico('calendar',14)} <span>${t.plannedDate===localDate()?'Heute ✓':'Heute'}</span></button><span class="next38-move"><button type="button" data-action="next-move-up" data-id="${h(t.id)}" aria-label="${h(t.title)} nach oben" title="Nach oben" ${i===0?'disabled':''}>↑</button><button type="button" data-action="next-move-down" data-id="${h(t.id)}" aria-label="${h(t.title)} nach unten" title="Nach unten" ${i===items.length-1?'disabled':''}>↓</button></span>`:''}${state?.taskConflicts?.[t.id]?'<span class="task-conflict-pill">Konflikt</span>':''}</div>`).join('')}</div>`:hideEmpty?'':`<div class="task-empty">Keine passenden Aufgaben.</div>`;
}
function waitingSourceAction(t){
 const origin=state?.tasks?.[waitingSourceId(t)];
 return origin&&!origin.archived?`<div class="wf715-source"><span>↳ Verknüpft mit abgeschlossener Aufgabe</span><button type="button" class="text-link" data-action="wf715-open-origin" data-id="${h(origin.id)}">${h(origin.title)} ↗</button></div>`:'';
}
function waitingFollowupInspector(t){
 const current=currentFollowupFor(state,t.id);
 if(current)return `<section class="wf715-inspector wf715-existing" aria-label="Auf Antwort warten"><strong>📨 Antwort-Wiedervorlage vorhanden</strong><span>${h(current.title)} · prüfen ab ${h(current.plannedDate)}</span><button type="button" class="secondary-btn" data-action="task-select" data-id="${h(current.id)}">Waiting For öffnen →</button></section>`;
 const day=localDate(),suggestions=suggestedFollowupDates(day),defaultDate=suggestions[2].date;
 return `<section class="wf715-inspector" aria-label="Auf Antwort warten"><details><summary>✉️ Auf Antwort warten · Wiedervorlage erstellen</summary><p>Deine E-Mail ist abgeschickt. Die Ausgangsaufgabe bleibt erledigt; die Rückmeldung wird separat unter Waiting For geführt und ab dem Prüftag in „Heute“ angezeigt.</p>
 <form id="wf715-create" data-id="${h(t.id)}"><label>Worauf wartest du?<input name="title" maxlength="180" value="${h(('Rückmeldung zu: '+t.title).slice(0,180))}" required></label>
 <span class="wf715-suggestions-label">Prüftermin wählen (Österreich, ohne Wochenenden und gesetzliche Feiertage)</span>
 <div class="wf715-suggestions">${suggestions.map((o,i)=>`<button type="button" class="wf715-suggest ${i===2?'is-active':''}" data-action="wf715-suggest" data-day="${h(o.date)}">${h(o.label)} <small>${h(o.date)}</small></button>`).join('')}</div>
 <label>Prüfen ab<input type="date" name="checkDate" value="${h(defaultDate)}" required></label><small>Keine Deadline für die Gegenseite. Falls du manuell ein Wochenende oder einen Feiertag wählst, verschiebt Compass auf den nächsten Werktag.</small>
 <button type="submit" class="primary-btn">${ico('clock',15)} Als Waiting For vormerken</button></form></details></section>`;
}
function waiting715TodayPanel(day){
 if(day!==localDate())return '';
 const due=waitingFollowupsDue(state,day);
 if(!due.length)return '';
 return `<section class="wf715-today" aria-label="Antworten nachfassen"><header><strong>📨 Auf Antworten warten · heute prüfen</strong><small>${due.length} ${due.length===1?'Wiedervorlage':'Wiedervorlagen'}</small></header>
 <p>Der Prüftag ist erreicht. Falls die Antwort noch aussteht, kannst du nachfassen oder den Termin verschieben. Nichts wird automatisch als erledigt markiert.</p>
 ${due.map(t=>`<div class="wf715-row"><div><strong>${h(t.title)}</strong><small>${t.plannedDate<day?'Seit '+h(t.plannedDate)+' offen':'Heute prüfen'} · Waiting For</small></div><div class="wf715-row-actions"><button class="secondary-btn" type="button" data-action="task-select" data-id="${h(t.id)}">Details</button><button class="secondary-btn" type="button" data-action="wf715-postpone" data-id="${h(t.id)}">+5 Werktage</button><button class="secondary-btn" type="button" data-action="wf715-complete" data-id="${h(t.id)}">Antwort da ✓</button></div></div>`).join('')}</section>`;
}
function taskEditor(){const t=state?.tasks?.[selectedTaskId];if(!t||t.archived)return '<div class="task-empty">Wähle eine Aufgabe, um ihre Details zu bearbeiten.</div>';
 const progress=t.progressTarget!=null&&Number.isSafeInteger(t.progressTarget)&&t.progressTarget>0;
 const current=t.progressCurrent??0,template=isTemplateTask(state,t),locked=!!t.completed||template,friction=taskFriction(t.note),taskMemo=stripTaskFriction(visibleWaitingNote(t.note));
 return `${template?'<p class="shopping-master-help">Dieser Eintrag gehört zur bearbeitbaren Vorlage. Änderungen gelten für künftige Kopien, nicht für bereits erstellte Einkaufslisten.</p>':''}<div class="task-gpt712" ${template?'hidden':''}><button type="button" class="task-gpt712-copy" data-action="task-gpt712-copy" data-id="${h(t.id)}" title="Gesprächseinstieg für ChatGPT kopieren">✦ GPT-Hilfe für diese Aufgabe</button><a href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer" title="ChatGPT in neuem Tab öffnen">ChatGPT ↗</a><small>Nur auf Klick: Gesprächsprompt mit Aufgabentitel und vorhandener Notiz kopieren. Nichts wird automatisch gesendet.</small></div>${!template&&t.completed?waitingFollowupInspector(t):t.workflow==='waiting'?waitingSourceAction(t):''}<form id="task-edit-form" data-id="${h(t.id)}" class="task-edit-form v559-inspector-form">
 ${template?`<label class="shopping713-master-title">Vorlageneintrag bearbeiten<input name="title" maxlength="180" required value="${h(t.title)}"/></label>`: ''}
 <div class="v559-progress-row"><span>Stückfortschritt</span><span class="v559-progress-actions">${progress?`<strong>${current}/${t.progressTarget}</strong><button type="button" data-action="task-progress-minus" data-id="${h(t.id)}" ${locked||current<=0?'disabled':''} aria-label="Ein Stück zurücknehmen">−1</button><button type="button" data-action="task-progress-plus" data-id="${h(t.id)}" ${locked||current>=t.progressTarget?'disabled':''} aria-label="Ein Stück hinzufügen">+1</button>`:'<small>Kein Zählziel</small>'}</span></div>
 <div class="v559-main-dates" aria-label="Aufgabenplanung">${compactInspectorDate('deferUntil','Defer',t.deferUntil,'Frühestens verfügbar; keine Deadline')}${compactInspectorDate('plannedDate','Geplant',t.plannedDate,'Gewünschter Planungstag; keine Deadline')}${compactInspectorDate('dueDate','Due',t.dueDate,'Tatsächliche Fälligkeit')}</div>
 <div class="v559-compact-field"><label for="v559-task-duration">${ico('clock',15)} Dauer (Min.)</label><input id="v559-task-duration" name="estimateMinutes" type="number" min="5" max="1440" step="5" value="${t.estimateMinutes??''}" placeholder="Optional"/></div>
 <div class="v559-compact-field"><label for="v559-task-context">${ico('tag',15)} Kontexte</label><input id="v559-task-context" name="contextTags" data-smart-tags maxlength="300" value="${h((t.contextTags||[]).join(', '))}" placeholder="@büro, @laptop"/></div>
 <details class="v559-note" ${taskMemo?'open':''}><summary>${ico('pencil',15)} Notiz ${taskMemo?`<span class="v559-note-preview">${h(taskMemo.slice(0,42))}${taskMemo.length>42?'…':''}</span>`:'<span class="v559-note-preview">Hinzufügen</span>'}</summary><textarea name="note" maxlength="3000" rows="3" placeholder="Optional">${h(taskMemo)}</textarea></details>
 <details class="tf715-reflection" ${friction.overcoming||friction.effort||friction.blocker?'open':''}><summary>🪨 Überwindung & Energie ${friction.overcoming==='high'?'· hohe Hürde':''}</summary>
 <p>Eine Aufgabe kann wenig Zeit brauchen und trotzdem schwer anzufangen sein. Freiwillige Selbsteinschätzung; kein Dringlichkeitsscore.</p>
 <div class="tf715-fields"><label>Überwindungsgrenze<select name="taskOvercoming">${OVERCOMING.map(([value,label])=>`<option value="${value}" ${friction.overcoming===value?'selected':''}>${h(label)}</option>`).join('')}</select></label><label>Energieaufwand<select name="taskEffort">${EFFORT.map(([value,label])=>`<option value="${value}" ${friction.effort===value?'selected':''}>${h(label)}</option>`).join('')}</select></label></div>
 <label>Was macht den Einstieg schwierig? (optional)<select name="taskBlocker">${BLOCKERS.map(([value,label])=>`<option value="${value}" ${friction.blocker===value?'selected':''}>${h(label)}</option>`).join('')}</select></label>
 <small>Nur du vergibst diese Einschätzung. Sie wird mit der Aufgabennotiz gespeichert und wie diese synchronisiert. Die GPT-Hilfe berücksichtigt sie erst, wenn du den Prompt bewusst kopierst.</small>
 </details>
 <details class="v42-progress-editor v559-progress-options"><summary>${ico('settings',14)} Fortschrittsziel festlegen ${progress?'· '+current+'/'+t.progressTarget:''}</summary><div class="v42-progress-edit-grid"><label>Gesamtzahl (Max.)<input name="progressTarget" type="number" min="1" max="100000" step="1" value="${t.progressTarget??''}" placeholder="z. B. 36"/></label><label>Bereits erledigt<input name="progressCurrent" type="number" min="0" max="${t.progressTarget??100000}" step="1" value="${current}"/></label></div><small class="v42-progress-help">Fortschritt zählt Stücke, schließt die Aufgabe aber nicht automatisch ab.</small></details>
 <details class="inspector-extra v559-metadata"><summary>${ico('settings',14)} Titel, Projekt & GTD-Status</summary><div class="v559-meta-fields">${template?'':`<label>Titel<input required name="title" maxlength="180" value="${h(t.title)}"/></label>`}<label>Projekt<select name="projectId">${projectOptions(t.projectId)}</select></label><label>GTD-Status<select name="workflow">${workflowOptions(t.workflow)}</select></label><label>Bereich<select name="category">${categoryOptions(t.category)}</select></label>${t.projectId?`<label>Unteraufgabe von<select name="parentTaskId">${taskParentOptions(t.projectId,t.parentTaskId,t.id)}</select></label>`:''}<label>Agenda-Tags<input name="tags" data-smart-tags maxlength="300" value="${h((t.tags||[]).join(', '))}" placeholder="UKO, Martin"/></label><label class="flag-check"><input type="checkbox" name="flagged" ${t.flagged?'checked':''}/> Flagged</label></div></details>
 <div class="task-edit-actions v559-sticky-actions"><button class="primary-btn" type="submit">Speichern</button><button class="secondary-btn" type="button" data-action="task-archive" data-id="${h(t.id)}">${template?'Aus Vorlage entfernen':'Archivieren'}</button>${!template?`<button type="button" class="secondary-btn p49-trash-button" data-action="task49-trash" data-id="${h(t.id)}">${ico('trash',14)} Papierkorb</button>`:''}${t.completed?`<button type="button" class="secondary-btn" data-action="gtd-repeat-task" data-id="${h(t.id)}">${ico('sync',15)} Erneut anlegen</button>`:''}</div></form>${state.taskConflicts?.[t.id]?`<div class="task-conflict"><strong>Änderungskonflikt</strong><p>Die Aufgabe wurde auf einem anderen Gerät bearbeitet. Beide Fassungen bleiben erhalten.</p><button type="button" data-action="task-conflict-local" data-id="${h(t.id)}">Meine Änderungen übernehmen</button><button type="button" data-action="task-conflict-remote" data-id="${h(t.id)}">Cloud-Version übernehmen</button></div>`:''}`;
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
function treeTaskRows(projectId,parentTaskId=null,depth=0,visited=new Set(),index=buildPlanTreeIndex(state)){
 if(depth>15)return '';
 return index.taskChildren(projectId,parentTaskId).filter(t=>!visited.has(t.id)).map(t=>{
  visited.add(t.id);
  const hasChildren=index.taskChildren(projectId,t.id).length>0,collapsed=treeTaskCollapsed.has(t.id);
  const due=t.dueDate&&t.dueDate<=localDate()?`<span class="tree-critical">${h(t.dueDate)}</span>`:t.dueDate?`<span class="tree-muted">${h(t.dueDate)}</span>`:'';
  return `<div class="tree-entry tree-task" data-drag-type="task" data-drag-id="${h(t.id)}"><div class="tree-line tree-drop-target ${selectedTaskId===t.id?'selected':''}" data-drop-type="task" data-drop-id="${h(t.id)}" style="--depth:${depth+1}">
   ${hasChildren?`<button type="button" class="tree-expander" data-action="tree-task-toggle" data-id="${h(t.id)}" aria-label="Unteraufgaben ${collapsed?'anzeigen':'verbergen'}" aria-expanded="${!collapsed}">${collapsed?'▸':'▾'}</button>`:'<span class="tree-expander-space"></span>'}
   <span class="tree-drag-handle" draggable="true" data-drag-type="task" data-drag-id="${h(t.id)}" title="Ziehen zum Verschieben" aria-label="Aufgabe ziehen">⋮⋮</span>
   ${isTemplateTask(state,t)?`<span class="shopping-master-icon" title="Vorlagen-Eintrag, kein abzuhakender Einkauf">◇</span>`:`<button type="button" class="task-check" data-action="task-toggle" data-id="${h(t.id)}" aria-label="${t.completed?'Wieder öffnen':'Erledigen'}">${t.completed?'✓':''}</button>`}
   ${inlineTaskTitle(t,`<span>${h(t.title)}</span>${due}`,'tree-task-select')}
   ${taskProgressInline(t)}
   ${!t.completed&&!isTemplateTask(state,t)?`<button type="button" class="tree-today-check ${t.plannedDate===localDate()?'is-planned':''}" data-action="tree-plan-today" data-id="${h(t.id)}" aria-pressed="${t.plannedDate===localDate()}" aria-label="${h(t.title)}: ${t.plannedDate===localDate()?'Aus Heute entfernen':'Für Heute auswählen'}" title="${t.plannedDate===localDate()?'Aus Heute entfernen':'Für Heute auswählen – keine Deadline'}" ${!isActionAvailable(state,t,localDate())&&t.plannedDate!==localDate()?'disabled':''}><span class="tree-today-box" aria-hidden="true">${t.plannedDate===localDate()?'✓':''}</span><span>Heute</span></button>`:''}
   <button type="button" ${isTemplateTask(state,t)?'disabled':''} class="tree-flag-toggle ${t.flagged?'is-flagged':''}" data-action="task-flag" data-id="${h(t.id)}" aria-label="${t.flagged?'Flagge entfernen':'Flagge setzen'}" aria-pressed="${!!t.flagged}" title="${t.flagged?'Flagge entfernen':'Flagge setzen'}">${ico('flag',15)}</button>
   ${!isTemplateTask(state,t)?`<span class="p49-task-row-actions"><button type="button" data-action="task-archive" data-id="${h(t.id)}" title="Aufgabe archivieren" aria-label="${h(t.title)} archivieren">${ico('archive',13)}</button><button type="button" data-action="task49-trash" data-id="${h(t.id)}" title="Aufgabe in Papierkorb" aria-label="${h(t.title)} in Papierkorb">${ico('trash',13)}</button></span>`:''}
   <button type="button" class="tree-inline-add" data-action="tree-add-subtask" data-id="${h(t.id)}" title="Unteraufgabe hinzufügen" aria-label="Unteraufgabe hinzufügen">${ico('plus',15)}</button>
  </div>${collapsed?'':treeTaskRows(projectId,t.id,depth+1,visited,index)}</div>`;
 }).join('');
}
function folderIconPicker(project){
 const current=folderIcon(project);
 return `<fieldset class="folder-icon-field"><legend>Ordnersymbol</legend><div class="folder-icon-choices" role="radiogroup" aria-label="Ordnersymbol auswählen">${FOLDER_ICONS.map(([key,label])=>`<label title="${h(label)}"><input type="radio" name="folderIcon" value="${key}" ${current===key?'checked':''}/><span>${ico(key,19)}<small>${h(label)}</small></span></label>`).join('')}</div><small>Optional. Das Standardsymbol bleibt ohne Änderung erhalten.</small></fieldset>`;
}
function treeProjectRows(parentId=null,depth=0,visited=new Set(),index=buildPlanTreeIndex(state)){
 if(depth>15)return '';
 // Older/imported records may reference a parent which no longer exists. Keep
 // those projects accessible instead of making the entire tree look empty.
 const candidates=parentId===null?[...index.projectChildren(null),...index.orphans]:index.projectChildren(parentId);
 return candidates.filter(p=>!p.isTemplate&&!visited.has(p.id)&&visibleInProjectTree48(state,p)&&!(isShoppingList(state,p)&&p.status==='completed')).map(p=>{
  visited.add(p.id);
  const children=index.projectChildren(p.id).filter(c=>!c.isTemplate),taskRoots=p.kind==='project'?index.taskChildren(p.id,null):[];
  const expand=children.length||taskRoots.length,collapsed=projectCollapsed.has(p.id);
  return `<div class="tree-entry tree-project" data-drag-type="project" data-drag-id="${h(p.id)}"><div class="tree-line tree-drop-target ${p.kind==='folder'?'fin43-folder-row':'fin43-project-row'} ${selectedProjectId===p.id&&!selectedTaskId?'selected':''}" data-drop-type="project" data-drop-id="${h(p.id)}" style="--depth:${depth}">
   ${expand?`<button type="button" class="tree-expander" data-action="project-toggle-expand" data-id="${h(p.id)}" aria-expanded="${!collapsed}" aria-label="${collapsed?'Aufklappen':'Zuklappen'}">${collapsed?'▸':'▾'}</button>`:'<span class="tree-expander-space"></span>'}
   <span class="tree-drag-handle" draggable="true" data-drag-type="project" data-drag-id="${h(p.id)}" title="Ziehen zum Verschieben" aria-label="Projekt oder Ordner ziehen">⋮⋮</span>
   ${p.kind==='folder'?`<button class="tree-node-icon tree-folder-icon" type="button" data-action="folder-icon-open" data-id="${h(p.id)}" title="Ordnersymbol ändern" aria-label="Symbol für ${h(p.title)} ändern">${ico(projectIcon48(p)==='folder'?folderIcon(p):projectIcon48(p),17)}</button>`:`<span class="tree-node-icon">${ico(projectIcon48(p),17)}</span>`}
   <button type="button" class="tree-label" data-action="project-select" data-id="${h(p.id)}"><span>${h(p.title)}</span>${p.status==='hold'?'<span class="tree-muted">Pausiert</span>':''}</button>
   <button type="button" class="tree-inline-add" data-action="${p.kind==='folder'?'tree-add-project':'tree-add-task'}" data-id="${h(p.id)}" aria-label="${p.kind==='folder'?'Projekt hinzufügen':'Aufgabe hinzufügen'}" title="Hinzufügen">${ico('plus',15)}</button>
  </div>${collapsed?'':`<div>${treeProjectRows(p.id,depth+1,visited,index)}${p.kind==='project'?treeTaskRows(p.id,null,depth+1,new Set(),index):''}</div>`}</div>`;
 }).join('');
}
function treeTaskDestinationOptions(task){
 const descendants=new Set([task.id,...taskDescendants(state,task.id)]);
 const choices=['<option value="">Ziel wählen …</option>'];
 for(const p of Object.values(state.projects||{}).filter(p=>p.kind==='project'&&!p.isTemplate&&visibleInProjectTree48(state,p))){
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

let compass57ShoppingTab='list';
function compass57ShopTabs(){
 return '<div class="compass57-shopping-tabs" role="tablist" aria-label="Einkaufen"><button type="button" role="tab" aria-selected="'+(compass57ShoppingTab==='list')+'" class="'+(compass57ShoppingTab==='list'?'selected':'')+'" data-action="compass57-shop-tab" data-id="list">Einkaufsliste</button><button type="button" role="tab" aria-selected="'+(compass57ShoppingTab==='stats')+'" class="'+(compass57ShoppingTab==='stats'?'selected':'')+'" data-action="compass57-shop-tab" data-id="stats">Statistik & Rechnungsimport</button></div>';
}
function compass57ShopStatistics(){
 // A deliberately narrow statistic: only already classified grocery expenses.
 // Transfers, refunds, pending classifications and unrelated shopping categories
 // must never be attributed to a grocery trip. The list path never calls this.
 const month=localDate().slice(0,7),entries=[];
 for(const t of Array.isArray(state?.financeTransactions)?state.financeTransactions:[]){
  if(!t||t.needsReview||t.flow!=='expense'||!Number.isSafeInteger(t.amountCents)||t.amountCents>=0||!String(t.day||'').startsWith(month))continue;
  if(!/^(lebensmittel|supermarkt|eink[aä]ufe?)(?:\s|\/|$)/i.test(String(t.category||'')))continue;
  entries.push(t);
 }
 const cents=entries.reduce((sum,t)=>sum-t.amountCents,0);
 const euro=n=>(n/100).toLocaleString('de-AT',{style:'currency',currency:'EUR'});
 const label=new Intl.DateTimeFormat('de-AT',{month:'long',year:'numeric'}).format(new Date(month+'-15T12:00:00'));
 return receiptInboxView(state,{draft:receiptDraft743,month:receiptMonth745})+'<section class="work-card compass57-shopping-stats"><div class="work-heading"><span>Lebensmittel · '+h(label)+'</span></div><div class="compass57-stats-head"><strong>'+h(euro(cents))+'</strong><span>'+entries.length+' zugeordnete Buchungen</span></div>'+
  '<div class="compass57-stats-actions"><button type="button" class="primary-btn" data-action="smart49-open">'+ico('upload',16)+' Rechnung importieren</button><button type="button" class="secondary-btn" data-action="compass57-finance-details">Finanzen öffnen</button></div>'+
  '<small class="compass57-stats-note">Nur klassifizierte Lebensmittelausgaben. Fehlende, noch ungeklärte oder bar bezahlte Einkäufe können fehlen.</small></section>';
}

function shoppingScreen(){
 if(compass57ShoppingTab==='stats')return chrome(compass57ShopStatistics());
 const templates=Object.values(state?.projects||{}).filter(isShoppingTemplate).sort((a,b)=>a.title.localeCompare(b.title,'de'));
 const active=shoppingLists(state),archived=shoppingLists(state,{archived:true});
 const selected=active.find(p=>p.id===shoppingSelectedId)||active[0]||null;
 if(selected&&shoppingSelectedId!==selected.id){shoppingSelectedId=selected.id;scheduleWatchCalendarSnapshot();}
 const progress=selected?shoppingProgress(state,selected.id):null;
 const all=selected?projectTasks(state,selected.id).sort((a,b)=>(a.sortOrder??0)-(b.sortOrder??0)||a.title.localeCompare(b.title,'de')):[];
 return chrome(`<div class="shopping713-shell"><section class="work-card shopping713-overview"><div class="shopping713-header"><div><h2>🛒 Meine Einkaufslisten</h2><p class="muted-line">Aus deiner bearbeitbaren Vorlage entsteht bei jedem Einkauf eine neue, unabhängige Checkliste.</p></div><button type="button" class="primary-btn" data-action="shopping713-create" ${templates.length?'':'disabled'}>${ico('plus',15)} Neue Einkaufsliste</button></div>
 ${!templates.length?'<p class="muted-line">Lege unter Vorlagen zuerst eine „Einkaufsliste“ an. Danach kannst du hier Kopien zum Einkaufen erstellen.</p>':''}
 ${active.length?`<div class="shopping713-chooser">${active.map(p=>{const m=shoppingProgress(state,p.id);return `<button type="button" data-action="shopping713-select" data-id="${h(p.id)}" class="shopping713-choice ${p.id===selected?.id?'active':''}"><strong>${h(p.title)}</strong><small>${m.done}/${m.total} erledigt</small></button>`;}).join('')}</div>`:'<p class="shopping713-empty">Keine aktive Einkaufsliste. Deine Vorlage bleibt unter „Vorlagen“ verfügbar.</p>'}
 ${selected?`<div class="shopping713-list"><div class="shopping713-list-header"><div><h3>${h(selected.title)}</h3><span>${progress.done} von ${progress.total} eingekauft</span></div><button type="button" class="secondary-btn" data-action="shopping713-edit-list" data-id="${h(selected.id)}">Liste bearbeiten</button></div><div class="shopping713-progress" role="progressbar" aria-valuemin="0" aria-valuemax="${Math.max(1,progress.total)}" aria-valuenow="${progress.done}" aria-label="Einkaufsfortschritt"><span style="width:${progress.total?Math.round(progress.done/progress.total*100):0}%"></span></div>
 <div class="shopping713-items">${all.map(t=>`<button type="button" class="shopping713-item ${t.completed?'done':''}" data-action="shopping713-check" data-id="${h(t.id)}" aria-pressed="${!!t.completed}"><span class="shopping713-check" aria-hidden="true">${t.completed?'✓':''}</span><span>${h(t.title)}${t.note?`<small>${h(t.note.slice(0,110))}</small>`:''}</span></button>`).join('')||'<p class="muted-line">Diese Liste hat noch keine Einträge. Über „Liste bearbeiten“ kannst du welche hinzufügen.</p>'}</div>
 <div class="shopping713-bottom"><span class="muted-line">Die Vorlage wird beim Abhaken nicht verändert.</span><button type="button" class="primary-btn" data-action="shopping713-archive" data-id="${h(selected.id)}">${ico('checkSquare',16)} Einkauf archivieren</button></div></div>`:''}
 <details class="shopping713-archive" ${shoppingArchiveOpen?'open':''}><summary>Archivierte Einkaufslisten (${archived.length})</summary>${archived.map(p=>{const m=shoppingProgress(state,p.id);return `<div class="shopping713-archive-row"><span><strong>${h(p.title)}</strong><small>${m.done}/${m.total} erledigt</small></span><button class="secondary-btn" type="button" data-action="shopping713-restore" data-id="${h(p.id)}">Wieder öffnen</button></div>`;}).join('')||'<p class="muted-line">Noch keine archivierten Einkaufslisten.</p>'}</details>
 ${templates.length?`<button class="text-link" type="button" data-action="shopping713-open-master" data-id="${h(templates[0].id)}">Vorlage bearbeiten →</button>`:''}
 </section></div>`);
}

// A project outline is never the left navigation: folders/projects are separate from tasks.
const compass58Expanded=new Set();
const compass58Collapsed=new Set();
let compass58InspectorHidden=true;
let compass58ToolsOpen=false;
function compass58VisibleChildren(index,parent=null){
 const items=parent===null?[...index.projectChildren(null),...index.orphans]:index.projectChildren(parent);
 return [...new Map(items.filter(p=>p&&!p.isTemplate&&visibleInProjectTree48(state,p)&&!(isShoppingList(state,p)&&p.status==='completed')).map(p=>[p.id,p])).values()];
}
function compass58OnSelectedPath(projectId){
 let id=selectedProjectId;const visited=new Set();
 for(let depth=0;id&&depth<20&&!visited.has(id);depth++){
  if(id===projectId)return true;
  visited.add(id);id=state.projects?.[id]?.parentId||'';
 }
 return false;
}
function compass58Navigator(index,parent=null,depth=0,visited=new Set()){
 if(depth>15)return '';
 return compass58VisibleChildren(index,parent).filter(p=>!visited.has(p.id)).map(p=>{
  visited.add(p.id);
  const children=compass58VisibleChildren(index,p.id),hasChildren=children.length>0;
  const open=!compass58Collapsed.has(p.id)&&(compass58Expanded.has(p.id)||compass58OnSelectedPath(p.id));
  const selected=selectedProjectId===p.id;
  const label=p.kind==='folder'?'Ordner':'Projekt';
  return '<div class="compass58-nav-entry tree-entry tree-project" data-drag-type="project" data-drag-id="'+h(p.id)+'">'+
    '<div class="compass58-nav-row tree-drop-target '+(selected?'selected':'')+'" data-drop-type="project" data-drop-id="'+h(p.id)+'" style="--level:'+Math.min(depth,9)+'">'+
      (hasChildren?'<button type="button" class="compass58-caret" data-action="compass58-folder-expand" data-id="'+h(p.id)+'" aria-label="'+h(p.title)+(open?' zuklappen':' aufklappen')+'" aria-expanded="'+open+'">'+(open?'▾':'▸')+'</button>':'<span class="compass58-caret-spacer"></span>')+
      '<span class="compass58-grip tree-drag-handle" draggable="true" data-drag-type="project" data-drag-id="'+h(p.id)+'" title="Projekt verschieben" aria-label="Projekt verschieben">⋮⋮</span>'+
      '<button type="button" class="compass58-nav-item" data-action="project-select" data-id="'+h(p.id)+'" aria-label="'+h(label)+': '+h(p.title)+'" '+(selected?'aria-current="true"':'')+'>'+ico(p.kind==='folder'?folderIcon(p):'list',17)+'<span>'+h(p.title)+'</span>'+(p.status==='hold'?'<small>Pause</small>':'')+'</button>'+
    '</div>'+(hasChildren&&open?'<div class="compass58-nav-children">'+compass58Navigator(index,p.id,depth+1,visited)+'</div>':'')+'</div>';
 }).join('');
}
function compass58CreatePanel(){
 if(!treeCreateKind)return '';
 const parent=treeCreateParent||'';
 return '<section class="work-card compass58-create">'+
   '<div class="compass58-create-head"><strong>'+(treeCreateKind==='task'?'Neue Aufgabe':treeCreateKind==='folder'?'Neuer Ordner':'Neues Projekt')+'</strong><button type="button" data-action="tree-create-close" aria-label="Schließen">×</button></div>'+
   (treeCreateKind==='task'?taskCreateForm('',parent,treeTaskParent||''):
    '<form class="project-form" id="project-create-form"><label>Name<input required autofocus name="title" maxlength="140"/></label>'+ 
    '<input type="hidden" name="kind" value="'+h(treeCreateKind)+'"/><label>Unterhalb von<select name="parentId">'+projectParentOptions(parent)+'</select></label>'+ 
    '<details><summary>Weitere Einstellungen</summary><label>Typ<select name="projectType"><option value="parallel">Parallel</option><option value="sequential">Sequential</option><option value="single">Single Actions</option></select></label><label>Ergebnis<input name="outcome" maxlength="800"/></label></details>'+ 
    '<button class="primary-btn" type="submit">Anlegen</button></form>')+'</section>';
}
function compass49VaultNavigation(){
 return '<nav class="p49-vault-nav" aria-label="Archiv und Papierkorb"><button type="button" data-action="p48-view-archive" aria-pressed="'+(projectVaultView48==='archived')+'">'+ico('archive',15)+' Archiv</button><button type="button" data-action="p48-view-trash" aria-pressed="'+(projectVaultView48==='trash')+'">'+ico('trash',15)+' Papierkorb</button>'+(projectVaultView48?'<button type="button" data-action="p48-close">'+ico('arrow',14)+' Projekte</button>':'')+'</nav>';
}
function compass58ProjectLayout({treeIndex,selection,selectedTask,settings,active}){
 const tree=compass58Navigator(treeIndex)||'<p class="compass58-muted">Noch keine Ordner oder Projekte</p>';
 const ownTask=selectedTask&&selection?.kind==='project'&&selectedTask.projectId===selection.id?selectedTask:null;
 const children=selection?compass58VisibleChildren(treeIndex,selection.id):compass58VisibleChildren(treeIndex);
 const tasks=selection?.kind==='project'?treeTaskRows(selection.id,null,0,new Set(),treeIndex):'';
 const rootCount=selection?.kind==='project'?treeIndex.counts.get(selection.id)||0:children.length;
 const name=projectVaultView48?(projectVaultView48==='archived'?'Archiv':'Papierkorb'):(selection?.title||'Projekte');
 const content=projectVaultView48?(projectVaultPanel48(state,projectVaultView48,ico)+taskLifecycleView49(state,projectVaultView48,ico,h)):selection?.kind==='project'? 
   '<div class="compass58-outline tree-work-card unified-tree" role="tree" aria-label="Aufgaben von '+h(name)+'">'+(tasks||'<p class="compass58-empty">Noch keine Aufgaben</p>')+'</div>':
   '<div class="compass58-collection">'+(children.map(p=>'<button type="button" class="compass58-project-tile" data-action="project-select" data-id="'+h(p.id)+'">'+ico(p.kind==='folder'?folderIcon(p):'list',18)+'<span>'+h(p.title)+'</span>'+ico('arrow',15)+'</button>').join('')||'<p class="compass58-empty">Noch keine Projekte in diesem Ordner</p>')+'</div>';
 const inspector=projectVaultView48?'':compass58InspectorHidden?'':(ownTask?'<div class="compass58-inspector-fields">'+taskEditor()+'<form id="tree-move-task-form" class="tree-move-form" data-id="'+h(ownTask.id)+'"><label>Verschieben nach<select name="target" required>'+treeTaskDestinationOptions(ownTask)+'</select></label><button type="submit" class="secondary-btn">Verschieben</button></form></div>':(selection?'<div class="p48-inspector-actions"><button type="button" data-action="p48-archive" data-id="'+h(selection.id)+'">'+ico('archive',15)+' Archivieren</button><button type="button" class="p48-trash" data-action="p48-trash" data-id="'+h(selection.id)+'">'+ico('trash',15)+' Papierkorb</button></div>':'')+settings);
 const selectedDetails=!!(selection||ownTask)&&!compass58InspectorHidden;
 const inspectorMarkup=selectedDetails?'<aside class="compass58-inspector work-card tree-inspector" aria-label="'+(ownTask?'Aufgaben-Inspector':'Projekt-Inspector')+'">'+
  '<div class="tree-inspector-header"><strong>'+h(ownTask?'Aufgabendetails':selection?.title||'Details')+'</strong><button type="button" class="tree-close" data-action="tree-inspector-close" aria-label="Inspector schließen" title="Inspector schließen">×</button></div>'+inspector+'</aside>':'';
 return chrome('<div class="compass58-workspace '+(selectedDetails?'has-inspector':'')+'">'+
  '<aside class="compass58-sidebar" aria-label="Ordner und Projekte"><div class="compass58-sidebar-heading"><strong>Ordner & Projekte</strong><button type="button" data-action="tree-add-folder" aria-label="Ordner hinzufügen" title="Ordner hinzufügen">'+ico('plus',16)+'</button></div><div class="compass58-sidebar-list">'+tree+'</div>'+compass49VaultNavigation()+'</aside>'+ 
  '<section class="compass58-center"><div class="compass58-heading"><div><h2>'+h(name)+'</h2><span>'+rootCount+' '+(selection?.kind==='project'?'Einträge':'Projekte / Ordner')+'</span></div><div class="compass58-heading-actions">'+
   (selection?.kind==='project'?'<button type="button" data-action="tree-add-task" data-id="'+h(selection.id)+'" aria-label="Aufgabe hinzufügen" title="Aufgabe hinzufügen">'+ico('plus',18)+'</button>':'<button type="button" data-action="tree-add-project" data-id="'+h(selection?.id||'')+'" aria-label="Projekt hinzufügen" title="Projekt hinzufügen">'+ico('plus',18)+'</button>')+
   (selection?'<button type="button" data-action="compass58-inspector-toggle" aria-label="Inspector '+(selectedDetails?'schließen':'öffnen')+'" title="Inspector">'+ico('layers',18)+'</button>':'')+'</div></div>'+ 
   '<details class="compass58-mobile-explorer"><summary>'+ico('folder',17)+' Ordner & Projekte</summary><div class="compass58-mobile-tree">'+tree+compass49VaultNavigation()+'</div></details>'+ 
   compass58CreatePanel()+content+ 
   '<button type="button" class="compass58-tools-button" data-action="compass58-tools" aria-expanded="'+compass58ToolsOpen+'">'+ico('settings',15)+' Projektwerkzeuge</button>'+ 
   (compass58ToolsOpen?'<section class="compass58-extra">'+projectExchangePanel()+'<details class="tree-secondary"><summary>Lebensziele & Projektgesundheit</summary>'+lifeGoalsPanel()+gtdProjectHealthPanel()+'</details></section>':'')+
   '</section>'+inspectorMarkup+'</div>');
}

function projectScreen(){
 const templates=tab==='templates';
 const projects=Object.values(state?.projects||{});
 const treeIndex=buildPlanTreeIndex(state);
 const current=selectedProjectId&&state?.projects?.[selectedProjectId]||null;
 if(current&&Boolean(current.isTemplate)!==templates){selectedProjectId=null;selectedTaskId=null;}
 const active=projects.filter(p=>p.kind==='project'&&!p.isTemplate&&p.status==='active').length;
 const templateProjects=projects.filter(isTemplateProject).sort((a,b)=>a.title.localeCompare(b.title,'de'));
 const selection=!projectVaultView48&&selectedProjectId&&state.projects?.[selectedProjectId]||null;
 const selectedTask=selectedTaskId&&state.tasks?.[selectedTaskId]||null;
 const settings=(selection&&(templates||!compass58InspectorHidden))?`<details class="project-properties" open><summary>${selection.kind==='folder'?'Ordner':'Projekt'} bearbeiten</summary><form id="project-edit-form" class="task-edit-form" data-id="${h(selection.id)}">${compactInspectorDate('dueDate','Projekt-Deadline',selection.dueDate)}<details class="v559-project-metadata"><summary>Projektangaben bearbeiten</summary><div class="v559-meta-fields"><label>Name<input name="title" required maxlength="140" value="${h(selection.title)}"/></label><label>Ergebnis<textarea name="outcome" rows="2" maxlength="800">${h(selection.outcome||'')}</textarea></label><label>Bereich<select name="category">${categoryOptions(selection.category)}</select></label><label>Status<select name="status">${[['active','Aktiv'],['hold','On Hold'],['completed','Abgeschlossen']].map(([v,l])=>`<option value="${v}" ${selection.status===v?'selected':''}>${l}</option>`).join('')}</select></label>${selection.kind==='folder'?folderIconPicker(selection):''}<label>Art<select name="kind"><option value="project" ${selection.kind!=='folder'?'selected':''}>Projekt</option><option value="folder" ${selection.kind==='folder'?'selected':''}>Ordner</option></select></label><label>Typ<select name="projectType">${[['parallel','Parallel'],['sequential','Sequential'],['single','Single Actions']].map(([v,l])=>`<option value="${v}" ${(selection.projectType||'parallel')===v?'selected':''}>${l}</option>`).join('')}</select></label><label>Übergeordnet<select name="parentId">${projectParentOptions(selection.parentId,selection.id)}</select></label>${selection.kind==='project'?`<label class="template-property"><input type="checkbox" name="isTemplate" ${selection.isTemplate?'checked':''}/> Als wiederverwendbare Vorlage verwenden</label>`:''}</div></details><label>Review alle Tage<input name="reviewIntervalDays" type="number" min="1" max="90" value="${selection.reviewIntervalDays||7}"/></label><div class="project-edit-actions"><button class="primary-btn" type="submit">Speichern</button><button type="button" class="secondary-btn" data-action="project-reviewed" data-id="${h(selection.id)}">Jetzt geprüft</button></div></form></details>`:'';
 if(!templates)return compass58ProjectLayout({treeIndex,selection,selectedTask,settings,active});
 return chrome(`<div class="tree-workspace ${selectedTask||selection?'has-inspector':''}"><section class="work-card tree-work-card"><div class="tree-toolbar"><strong>${templates?'Vorlagen':`${active} aktive Projekte`}</strong><div class="tree-toolbar-actions">${templates?'':`<div class="mobile-lifecycle-links"><button type="button" data-action="p48-view-archive">${ico('archive',15)} Archiv</button><button type="button" data-action="p48-view-trash">${ico('trash',15)} Papierkorb</button></div><button type="button" class="secondary-btn" data-action="tree-add-folder">${ico('plus',15)} Ordner</button><button type="button" class="secondary-btn" data-action="tree-add-project">${ico('plus',15)} Projekt</button>`}</div></div>
 ${templates?`<p class="shopping-master-help">Vorlage = dauerhaft bearbeitbare Stammliste. Eine neue Liste ist eine unabhängige Kopie zum Abhaken.</p>${templateProjects.length?templateProjects.map(p=>`<div class="tree-line template-line ${selection?.id===p.id?'selected':''}"><span class="tree-node-icon">${ico('bookmark',17)}</span><button type="button" class="tree-label" data-action="project-select" data-id="${h(p.id)}"><span>${h(p.title)}</span><span class="tree-muted">${treeIndex.counts.get(p.id)||0} Einträge</span></button><button type="button" class="secondary-btn" data-action="tree-template-add-task" data-id="${h(p.id)}">+ Eintrag</button><button type="button" class="secondary-btn" data-action="tree-template-use" data-id="${h(p.id)}">Neue Liste</button></div>${selection?.id===p.id?`<div class="template-task-summary">${treeTaskRows(p.id,null,0,new Set(),treeIndex)}</div>`:''}`).join(''):'<div class="tree-empty">Noch keine Vorlagen. Öffne ein Projekt und aktiviere in dessen Einstellungen „Als Vorlage verwenden“.</div>'}`:`<div class="unified-tree" role="tree" aria-label="Ordner, Projekte und Aufgaben">${projectVaultView48?projectVaultPanel48(state,projectVaultView48,ico):(treeProjectRows(null,0,new Set(),treeIndex)||'<div class="tree-empty">Noch keine Projekte. Lege dein erstes Projekt oder einen Ordner an.</div>')}${!projectVaultView48?`<div class="tree-root-drop" data-drop-type="project-root" data-drop-id="">${ico('folder',14)} Auf oberste Ebene ziehen</div>`:''}<div class="p48-destinations"><button type="button" data-action="p48-view-archive" aria-pressed="${projectVaultView48==='archived'}">${ico('archive',16)} Archiv</button><button type="button" class="p48-trash" data-action="p48-view-trash" aria-pressed="${projectVaultView48==='trash'}">${ico('trash',16)} Papierkorb</button></div></div>`}
 ${treeCreateKind?`<details open class="tree-quick-create"><summary>${treeCreateKind==='task'?'Neue Aufgabe':treeCreateKind==='folder'?'Neuer Ordner':'Neues Projekt'}<button type="button" class="tree-close" data-action="tree-create-close" aria-label="Schließen">×</button></summary>${treeCreateKind==='task'?taskCreateForm('',treeCreateParent||'',treeTaskParent||''):`<form class="project-form" id="project-create-form"><label>Name<input required autofocus name="title" maxlength="140" placeholder="${treeCreateKind==='folder'?'Ordnername':'Projektname'}"/></label><input type="hidden" name="kind" value="${treeCreateKind}"/><label>Unterhalb von<select name="parentId">${projectParentOptions(treeCreateParent||'')}</select></label><details class="tree-advanced"><summary>Weitere Einstellungen</summary><label>Typ<select name="projectType"><option value="parallel">Parallel</option><option value="sequential">Sequential</option><option value="single">Single Actions</option></select></label><label>Ergebnis<input name="outcome" maxlength="800" placeholder="Optional"/></label></details><button class="primary-btn" type="submit">Anlegen</button></form>`}</details>`:''}
 ${templates?'':projectExchangePanel()}
 ${templates?'':`<details class="tree-secondary"><summary>Lebensziele & Projektgesundheit</summary>${lifeGoalsPanel()}${gtdProjectHealthPanel()}</details>`}</section>
 ${(selection||selectedTask)?`<aside class="work-card tree-inspector"><div class="tree-inspector-header"><strong>${selectedTask?'Aufgabendetails':selection?.title||'Details'}</strong><button class="tree-close" type="button" data-action="tree-inspector-close" title="Schließen" aria-label="Details schließen">×</button></div>${selectedTask?`${taskEditor()}<form id="tree-move-task-form" class="tree-move-form" data-id="${h(selectedTask.id)}"><label>Verschieben nach<select name="target" required>${treeTaskDestinationOptions(selectedTask)}</select></label><button type="submit" class="secondary-btn">Verschieben</button></form>`:settings}${selection?`<div class="p48-inspector-actions"><button type="button" data-action="p48-archive" data-id="${h(selection.id)}">${ico('archive',15)} Archivieren</button><button type="button" class="p48-trash" data-action="p48-trash" data-id="${h(selection.id)}">${ico('trash',15)} Papierkorb</button></div>`:''}${selection?.isTemplate?`<button type="button" class="primary-btn" data-action="tree-template-use" data-id="${h(selection.id)}">Neue Liste aus Vorlage</button>`:''}</aside>`:''}</div>`);
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
function calendarContactPanel(person){
 if(!calendarReadable36()||!person)return '';
 const suggestions=contactSuggestions(calendarEvents,{[person.id]:person},localDate(),state?.calendarSuggestionDismissed||{}).slice(0,5);
 if(!suggestions.length)return '';
 return `<section class="work-card v568-calendar-hints"><h3>📅 Mögliche Treffen bestätigen</h3><p class="muted-line">Kalendertermine belegen nicht, dass ein Treffen tatsächlich stattgefunden hat.</p>${suggestions.map(s=>`<div class="v568-suggestion"><div><strong>${h(s.title)}</strong><small>${h(s.day)} · ${h(s.personName)}</small></div><div><button type="button" class="secondary-btn" data-action="calendar-contact-confirm" data-id="${h(s.id)}" data-person="${h(s.personId)}">Hat stattgefunden ✓</button><button type="button" data-action="calendar-contact-dismiss" data-id="${h(s.id)}">Ignorieren</button></div></div>`).join('')}</section>`;
}
function calendarDeadlinePanel(){
 if(!state||!calendarReadable36())return '';
 const suggestions=deadlineSuggestions(calendarEvents,state.projects||{},state.calendarSuggestionDismissed||{},localDate());
 if(!suggestions.length)return '';
 return `<section class="work-card v568-calendar-hints"><div class="work-heading"><span>🎓 Prüfung & Deadlines aus Google Kalender</span><span class="quiet-tag">${suggestions.length} Vorschläge</span></div><p class="muted-line">Kein passendes Vorbereitungsprojekt erkannt. Kalendertermine sind unverbindliche Hinweise – bitte prüfen.</p>${suggestions.slice(0,5).map(s=>`<div class="v568-suggestion"><div><strong>${h(s.title)}</strong><small>${h(s.day)} · Noch kein passendes aktives Projekt erkannt</small></div><div><button type="button" class="primary-btn" data-action="calendar-deadline-create" data-id="${h(s.id)}">Vorbereitungsprojekt anlegen</button><button type="button" class="secondary-btn" data-action="calendar-deadline-dismiss" data-id="${h(s.id)}">Passt nicht</button></div></div>`).join('')}<small>Automatische Textzuordnung kann ähnliche Projekte übersehen. Vor dem Anlegen bestehende Projekte prüfen.</small></section>`;
}
function vaultScreen(){
 return `<main class="compass54-lock" aria-label="Compass Tresor entsperren">
 <section class="compass54-lock-card"><img class="compass54-mark" src="${import.meta.env.BASE_URL}icon-192.png" alt="" width="68" height="68"/>
 <h1>${hasVault?'Willkommen zurück':'Compass einrichten'}</h1><p>${hasVault?'Dein persönlicher Arbeitsraum ist geschützt.':'Deine Daten bleiben lokal verschlüsselt. Richte eine Passphrase ein.'}</p>
 ${notice?`<div class="alert" role="status">${h(notice)}</div>`:''}
 ${error?`<div class="alert bad" role="alert">${h(error)}</div>`:''}
 <form id="vault-form" autocomplete="on"><label class="sr-only" for="passphrase">Passphrase</label><input id="passphrase" name="passphrase" type="password" required minlength="12" autocomplete="current-password" placeholder="Passphrase" />
 ${!hasVault?`<label class="sr-only" for="passphrase-repeat">Passphrase wiederholen</label><input id="passphrase-repeat" name="repeat" type="password" required minlength="12" autocomplete="new-password" placeholder="Passphrase wiederholen"/>`:''}
 <button type="submit" class="primary-btn">${hasVault?'Entsperren':'Tresor erstellen'}</button>
 ${!hasVault?`<label class="restore-label" for="encrypted-import">Verschlüsseltes Backup wiederherstellen</label><input id="encrypted-import" type="file" accept="application/json"/>`:''}
 </form><small class="compass54-lock-foot">Compass · Relaxed Control · Lokal verschlüsselt</small></section></main>`;
}

// Only the requested Intelligence runs. A rendered recommendation remains a snapshot.
let compass56RecommendationMarkup='';
let compass56RecommendationDay='';
let compass56PlanningOpen=false;
function compass56RecommendationButton(){
 return '<section class="compass56-inspector-peek"><button type="button" class="compass56-smart-button" data-action="compass56-recommend" title="Empfehlungen jetzt berechnen">'+ico('spark',17)+' Empfehlungen berechnen</button></section>';
}
function compass56RecommendationPanel(){
 return '<div class="compass56-recommend-result"><div class="compass56-recommend-actions"><button type="button" data-action="compass56-recommend" title="Vorschläge neu berechnen">↻</button><button type="button" data-action="compass56-recommend-close" aria-label="Vorschläge schließen" title="Schließen">×</button></div>'+compass56RecommendationMarkup+'</div>';
}
function compass56TodayWorkspace(){
 const day=selectedDay,actual=day===localDateString(new Date());
 const tasks=todayOrdered49(tasksForDay(state,day).filter(t=>!waitingSourceId(t)));
 const formatted=new Intl.DateTimeFormat('de-AT',{weekday:'short',day:'numeric',month:'long'}).format(new Date(day+'T12:00:00'));
 const completed=tasks.filter(t=>t.completed).length;
 return `<div class="today-layout compass56-today">
  ${calendarRail()}
  <div class="today-center compass56-main">
   <section class="work-card today-tasks compass56-primary" aria-label="Tagesaufgaben">
    <div class="work-heading compass56-title"><div><span class="compass56-title-main">${actual?'Heute':h(formatted)}</span><small>${h(formatted)}</small></div><span class="quiet-tag">${completed} / ${tasks.length} erledigt</span></div>
    ${taskList(tasks,'day')}
    <details class="calm-create compass56-add"><summary>${ico('plus',15)} Aufgabe hinzufügen</summary>${taskCreateForm(day)}</details>
    <div class="capture-inline compass56-capture"><form id="capture-form"><label class="sr-only" for="capture">In die Inbox erfassen</label><input id="capture" name="title" maxlength="1000" required placeholder="Zur Inbox hinzufügen …"/><button type="submit" class="primary-btn" aria-label="In Inbox erfassen" title="In Inbox erfassen">${ico('plus',17)}</button></form></div>
   </section>
   <section class="work-card appointments compass56-calendar"><div class="work-heading"><span>${ico('calendar',18)} Termine</span><button type="button" class="compass56-link" data-tab="forecast">Forecast ${ico('arrow',14)}</button></div>
     ${calendarToken?calendarCardRows(day):calendarConnectUI()}</section>
   ${compass56PlanningOpen?`<section class="compass56-extra" aria-label="Weitere Tagesplanung">
      ${yesterday710Panel(day)}${waiting715TodayPanel(day)}${calendarDeadlinePanel()}${occasionPanel()}${eventAgendaPanel()}${actual?researchRefreshPanel('today'):''}
      <div class="compass56-slim-review">${gtdTodaySummary()}</div>
   </section>`:''}
   <button type="button" class="compass56-expand" data-action="compass56-planning" aria-expanded="${compass56PlanningOpen}">${compass56PlanningOpen?'Weniger anzeigen':'Weitere Planung'} ${ico(compass56PlanningOpen?'arrow':'plus',14)}</button>
  </div>
  <aside class="inspector-rail today-context-rail" aria-label="${todayInspectorOpen?'Aufgaben-Inspector':'Empfehlungen'}">${compass55InspectorContent()}</aside>
 </div>`;
}


// Menu catalog module + GPT prompt are loaded ONLY after entering Insights → Ernährung.
function ensureMensaForNutrition(){
 if(mensaApi||mensaLoadPending||!state||tab!=='insights'||insightTab!=='nutrition')return;
 mensaLoadPending=import('./mensa-catalog-v57759402512.js').then(async mod=>{
  mensaApi=mod;
  if(!state.mensaCatalog?.seedImported){
   await mutate(st=>{mod.installMensaSeed(st);},null,true);
  }
  if(state?.privateDeviceMirror?.key&&authToken&&navigator.onLine){
   // Only the Nutrition workspace initiates the on-demand Mensa catalogue refresh.
   await syncPersonalJournal().catch(ex=>{mensaMessage='Journal-Abgleich nicht bestätigt: '+ex.message;});
  }
  if(state&&tab==='insights'&&insightTab==='nutrition')render();
 }).catch(ex=>{mensaMessage='Mensa-Katalog konnte nicht geladen werden: '+ex.message;render();}).finally(()=>{mensaLoadPending=null;});
}
const mensaLocalDay=()=>localDateString(new Date());
function mensaQuickStatus(){
 const day=mensaLocalDay(),offer=mensaOffer(state,day),eaten=mensaConsumed(state,day);
 return {day,offer,eaten};
}
function mensaTodayCompact(){return state?mensaTodayButton(state,new Date()):'';}
function todayScreen(){const coreStarted=performanceTrace.start();const workspace=compass56TodayWorkspace();performanceTrace.end('Heute: Aufgaben und Kalender',tab,coreStarted);
   const chromeStarted=performanceTrace.start();const html=chrome(mensaTodayCompact()+workspace);performanceTrace.end('Heute: Shell und Hinweise',tab,chromeStarted);return html;}
function homeScreen(){
 const k=state?.krakenPortfolio,valuation=k?.balances?krakenWealthSummary(k):null;
 const kraken=valuation?`<section class="work-card compass-kraken-home"><div><span class="page-overline">WEALTH / KRAKEN</span><strong>${valuation.covered?((valuation.totalEur).toLocaleString('de-AT',{style:'currency',currency:'EUR'})):'Noch nicht bewertet'}</strong><small>${valuation.complete?'Kraken Spot · EUR-Marktwert':'Nur teilweise bewertete Kraken-Positionen · keine Gesamtvermögenssumme'}</small></div><button type="button" data-tab="finance" class="secondary-btn">Finanz-Dashboard öffnen →</button></section>`:'';
 return chrome(`<div class="dashboard-timeline">${timelinePanel()}</div>${occasionPanel()}<details class="calm-overview-extra"><summary>${ico('layers',16)} Weitere Übersichten anzeigen</summary>${dashboardCards()}${kraken}</details>`);
}




function captureOverlay(){
 return `<div class="capture-modal-layer" data-action="capture-close-backdrop">
 <section class="capture-modal" role="dialog" aria-modal="true" aria-labelledby="capture-modal-title" tabindex="-1">
 <div class="capture-modal-heading"><div><p class="capture-eyebrow">${state?'QUICK CAPTURE · INBOX':'VERSCHLÜSSELTER EINGANG · TRESOR GESPERRT'}</p><h2 id="capture-modal-title">Aus dem Kopf. In Compass.</h2></div><button type="button" class="capture-modal-close" data-action="capture-close" aria-label="Schnellerfassung schließen">${ico('plus',20)}</button></div>
 <form id="capture-modal-form"><label for="capture-modal-input" class="sr-only">Neuer Gedanke</label>
 <textarea autofocus id="capture-modal-input" name="title" rows="3" maxlength="1000" required placeholder="Was möchtest du nicht vergessen?"></textarea>
 <details class="optional-capture"><summary>${ico('plus',15)} Notiz oder Link ergänzen <span>optional</span></summary><label for="capture-modal-note" class="sr-only">Zusätzliche Notiz</label><textarea id="capture-modal-note" name="note" maxlength="10000" rows="3" placeholder="Zusätzliche Informationen …"></textarea></details>
 <div class="capture-modal-foot"><span>${ico('lock',14)} ${state?'Im Tresor':'Sealed Capture · verschlüsselt, nur nach Entsperren lesbar'}</span><button class="primary-btn" type="submit">In Inbox erfassen ${ico('arrow',15)}</button></div></form>
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
 const pendingIds=new Set((state?.pending||[]).map(m=>m.id));
 const query=inboxQuery.trim().toLocaleLowerCase('de');
 const list=query?fullList.filter(r=>`${r.title} ${r.note||''} ${visibleInboxTags(r).join(' ')}`.toLocaleLowerCase('de').includes(query)):fullList;
 const current=list.find(r=>r.id===selectedInboxId)||list[0]||null;
 return chrome(`<div class="inbox-mvp-layout"><section class="module-card module-active inbox-mvp-card">
 <div class="inbox-mvp-head"><div><h2>Offene Eingänge <span class="count">${fullList.length}</span></h2></div><button type="button" class="primary-btn" data-action="capture-focus">${ico('plus',17)} Erfassen</button></div>
 ${outlook724Markup()}
 ${captureBulkPanel()}
 <div class="inbox-search-box">${ico('search',17)}<input id="inbox-query" type="search" placeholder="Einträge durchsuchen …" value="${h(inboxQuery)}" autocomplete="off" aria-label="Inbox durchsuchen"/></div>
 <div class="inbox-mvp-list" aria-label="Manuell sortierbare Inbox-Einträge">
 ${list.length?list.map((r,i)=>`<div class="inbox-row-wrap fin34-sortable" data-inbox-row="${h(r.id)}"><span class="inbox-drag-handle" draggable="${!query}" data-inbox-drag="${h(r.id)}" role="img" aria-label="${h(r.title)} verschieben" title="Anfassen und ziehen · alternativ Pfeiltasten rechts">⠿</span><button type="button" class="inbox-row-flag ${inboxFlagged(r)?'is-flagged':''}" data-action="inbox-flag" data-id="${h(r.id)}" aria-label="${inboxFlagged(r)?'Flagge entfernen':'Flagge setzen'}" aria-pressed="${inboxFlagged(r)}" title="${inboxFlagged(r)?'Flagge entfernen':'Flagge setzen'}">${ico('flag',16)}</button><button type="button" class="inbox-mvp-row ${current?.id===r.id?'is-current':''}" data-action="select-inbox" data-id="${h(r.id)}"><span class="inbox-list-mark">${ico('inbox',16)}</span><span class="inbox-list-copy"><strong>${h(r.title)}</strong>${r.note?`<small class="item-preview">${h(r.note)}</small>`:''}<small>${date(r.updatedAt)}${visibleInboxTags(r).length?' · '+visibleInboxTags(r).map(x=>'#'+h(x)).join(' '):''}</small></span><span class="inbox-list-sync ${pendingIds.has(r.id)?'needs-sync':''}" title="${pendingIds.has(r.id)?'Noch nicht synchronisiert':'Keine lokalen Änderungen ausstehend'}">${pendingIds.has(r.id)?ico('cloud',14):ico('check',14)}</span></button><button type="button" class="inbox-quick-today" data-action="inbox-plan-today" data-id="${h(r.id)}" title="Als Next Action für heute übernehmen · aus der Inbox entfernen · keine Deadline" aria-label="${h(r.title)} als Next Action für heute übernehmen und aus der Inbox entfernen">${ico('calendar',14)} <span>Heute</span></button><span class="inbox-reorder-controls"><button type="button" data-action="inbox-move-up" data-id="${h(r.id)}" aria-label="${h(r.title)} nach oben" title="Nach oben" ${i===0||query?'disabled':''}>↑</button><button type="button" data-action="inbox-move-down" data-id="${h(r.id)}" aria-label="${h(r.title)} nach unten" title="Nach unten" ${i===list.length-1||query?'disabled':''}>↓</button></span></div>`).join(''):
 `<div class="inbox-mvp-empty">${ico(query?'search':'inbox',32)}<strong>${query?'Keine passenden Einträge':'Dein Kopf darf leerer werden.'}</strong><span>${query?'Versuche einen anderen Suchbegriff.':'Halte hier alles fest, was dir im Alltag begegnet.'}</span></div>`}
 </div><div class="inbox-mvp-bottom"><span>${state.pending.length} ausstehende Änderungen</span><button type="button" class="review-link" data-tab="review">Wochenreview ${ico('arrow',14)}</button></div></section>
 <aside class="module-card module-active inbox-mvp-detail">${current?
 `<div class="inbox-detail-top"><span class="capture-eyebrow">INSPECTOR</span><span class="inbox-detail-date">${date(current.updatedAt)}</span><button class="inbox-inspector-flag ${inboxFlagged(current)?'is-flagged':''}" data-action="inbox-flag" data-id="${h(current.id)}" type="button" aria-pressed="${inboxFlagged(current)}" aria-label="${inboxFlagged(current)?'Flagge entfernen':'Flagge setzen'}" title="Flagged umschalten">${ico('flag',17)}</button></div>
 <form id="inbox-edit-form" data-id="${h(current.id)}" class="inbox-quiet-inspector">
 <label for="inbox-edit-title">Titel</label><textarea id="inbox-edit-title" name="title" maxlength="1000" rows="2" required>${h(current.title)}</textarea>
 
 <p class="inbox-project-hint">Mit „Als Aufgabe übernehmen“ wird der Eintrag einem Projekt zugeordnet und aus der Inbox entfernt. Ohne Projekt bleibt er eine Einzelaktion.</p>
 <label for="inbox-edit-note">Notiz</label><textarea id="inbox-edit-note" name="note" maxlength="10000" rows="3" placeholder="Optional">${h(current.note||'')}</textarea>
 <details class="inbox-inspector-extra v559-inbox-metadata"><summary>Projekt & GTD-Status</summary><div class="inbox-promote-fields"><label for="inbox-project-select">Projekt<select id="inbox-project-select" name="projectId">${projectOptions()}</select></label><label for="inbox-workflow-select">Status<select id="inbox-workflow-select" name="workflow"><option value="next">Next Action</option><option value="waiting">Waiting For</option><option value="hold">On Hold</option></select></label></div></details><details class="inbox-inspector-extra"><summary>Weitere Angaben</summary><label for="inbox-edit-tags">Personen / Agenda-Tags</label><input id="inbox-edit-tags" name="tags" data-smart-tags value="${h(visibleInboxTags(current).join(', '))}" placeholder="UKO, Martin"/></details>
 <div class="compass58-dream-route"><label for="compass58-dream-category">Someday / Maybe · Kategorie<select id="compass58-dream-category" name="dreamCategory">${DREAM_CATEGORIES.map(([key,title])=>`<option value="${key}">${h(title)}</option>`).join('')}</select></label><button type="submit" class="secondary-btn" name="intent" value="dream">${ico('spark',16)} Zu Dreams</button></div>
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
 if(!calendarReadable36())return `<p class="muted-line">Google Kalender ist noch nicht verbunden. Du kannst diesen Schritt trotzdem bewusst abschließen oder später erneut prüfen. Kalender-Zugriff bleibt nur lesend.</p>${reviewQuickAction()}`;
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
 if(step==='waiting')return `<div class="assistant-kpi">${queue.waiting.length} offene Waiting For</div>${impulseQueue(peopleWithTouchMeetings(state?.people||{},state),localDate()).length?`<section class="people-review-queue"><strong>${ico('people',16)} Freiwillige Kontaktimpulse</strong><p class="muted-line">Nur ausdrücklich aktivierte Intervalle und selbst dokumentierte Kontakte. Keine fälligen Verpflichtungen.</p>${impulseQueue(peopleWithTouchMeetings(state.people,state),localDate()).map(x=>`<button type="button" class="people-review-entry" data-action="person-review-open" data-id="${h(x.person.id)}">${h(x.person.name)} · letzter Kontakt ${h(x.last.day)} · ${x.daysSince} Tage ${ico('arrow',14)}</button>`).join('')}</section>`:''}<p class="muted-line">${waitingReview(state).attention} seit mindestens 7 Tagen nicht bearbeitet. Dies sind Hinweise zur Durchsicht, keine behaupteten überfälligen Zusagen.</p>${queue.waiting.map(t=>`<div class="gtd-waiting-review">${reviewTaskRow(t,'waiting')}<small>Letzte Bearbeitung: ${h(t.updatedAt?String(t.updatedAt).slice(0,10):'unbekannt')}</small></div>`).join('')||'<p class="muted-line">Keine offenen Waiting For.</p>'}${reviewInlineEditor()}${reviewQuickAction()}`;
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
  ${researchRefreshPanel('review')}
  ${r.completedAt?`<div class="assistant-completed work-card"><strong>Letzter Review abgeschlossen: ${h(new Date(r.completedAt).toLocaleDateString('de-AT'))}</strong><p>Du kannst die Schritte nachsehen oder einen neuen Durchgang beginnen.</p></div>`:''}
  <div class="assistant-review-grid"><nav class="work-card assistant-steps" aria-label="Review-Bereiche">${REVIEW_STEPS.map((s,i)=>`<button type="button" class="assistant-step ${i===index?'is-selected':''}" data-action="assistant-step" data-id="${i}" aria-current="${i===index?'step':'false'}"><span>${r.done.includes(s.id)?ico('check',15):ico(({collect:'inbox',inbox:'inbox','calendar-past':'calendar','calendar-future':'calendar',next:'target',waiting:'people',projects:'folder',unassigned:'list',someday:'spark',finish:'checkSquare'})[s.id]||'target',15)}<small>${i+1}</small></span><span><strong>${h(s.title)}</strong><small>${h(s.phase)}</small></span></button>`).join('')}</nav>
  <section class="work-card assistant-current"><div class="assistant-stage-header"><small>${h(step.phase)} · Schritt ${index+1} / ${REVIEW_STEPS.length}</small><h2>${h(step.title)}</h2><p>${h(step.help)}</p></div>${reviewStepBody(step.id,q)}<div class="assistant-review-footer"><button type="button" class="secondary-btn" data-action="assistant-back" ${index===0?'disabled':''}>← Zurück</button><button type="button" class="secondary-btn" data-action="assistant-next" ${index===REVIEW_STEPS.length-1?'disabled':''}>Überspringen</button><button type="button" class="primary-btn" data-action="assistant-complete-step">${index===REVIEW_STEPS.length-1?'Review abschließen':'Diesen Bereich geprüft →'}</button></div></section></div>
 </div>`);
}
// Opt-in E2EE device mirror. The Worker cannot read the records or derive this device's key.
// Source device is authoritative. Receiver is an offline-capable read-only mirror.
function journalSyncPayload(st){const copy=ensureJournal(st);return {quickWorktime:copy.quickWorktime||{},timeJournal:copy.timeJournal,nutritionJournal:copy.nutritionJournal,touchJournal:copy.touchJournal||{entries:[]},strengthJournal:st.strengthJournal||{annotations:[]},dreamJournal:st.dreamJournal||{entries:[]},receiptJournal:st.receiptJournal||{entries:[]},mensaCatalog:st.mensaCatalog||{schemaVersion:1,entries:[]},miracleMorning:ensureMorning(st),feelingCheckins:Array.isArray(st?.feelingCheckins)?st.feelingCheckins:[],habitsQuick:ensureHabitState(st),calendarArchive:st.calendarArchive||null,taskInspiration:st.taskInspiration||[],habitTimeSessions:st.habitTimeSessions||[],makkoHoSessions:st.makkoHoSessions||[],strengthGuidedSessions:st.strengthGuidedSessions||[],financeMobileDecisions:st.financeMobileDecisions||[],lifeWeekEvents:st.lifeWeekEvents||[],...(st.familyRadar?{familyRadar:st.familyRadar}:{}),...(st.peopleSyncEnabled===true?{people:st.people||{},peopleDeleted:st.peopleDeleted||{}}:{})};}
function applyJournalPayload(st,payload){const m=mergeJournalData(journalSyncPayload(st),payload);st.quickWorktime=m.quickWorktime;st.timeJournal=m.timeJournal;st.nutritionJournal=m.nutritionJournal;st.touchJournal=m.touchJournal;st.strengthJournal=m.strengthJournal;st.dreamJournal=m.dreamJournal;st.receiptJournal=m.receiptJournal;st.mensaCatalog=m.mensaCatalog;st.feelingCheckins=m.feelingCheckins;st.taskInspiration=m.taskInspiration||[];st.habitTimeSessions=m.habitTimeSessions||[];st.makkoHoSessions=m.makkoHoSessions||[];st.strengthGuidedSessions=m.strengthGuidedSessions||[];st.financeMobileDecisions=m.financeMobileDecisions||[];st.lifeWeekEvents=m.lifeWeekEvents||[];if(st.peopleSyncEnabled===true&&m.people){st.people=m.people;st.peopleDeleted=m.peopleDeleted||{};}if(m.habitsQuick)st.habitsQuick=m.habitsQuick;if(m.calendarArchive){st.calendarArchive=m.calendarArchive;restoreCalendarFromVault(st);}if(m.familyRadar)st.familyRadar=m.familyRadar;if(m.miracleMorning){st.miracleMorning=m.miracleMorning;for(const session of m.miracleMorning.sessions||[]){if(!session.finishedAt||!session.steps?.some(x=>!x.skipped))continue;const habits=ensureHabitState(st);if(!habits.items.some(h=>h.id==='miracle-morning'))habits.items.push({id:'miracle-morning',title:'Miracle Morning',slot:'Morgen',active:true});const day=session.day||session.finishedAt.slice(0,10);if(!habits.completions.some(c=>c.habitId==='miracle-morning'&&c.day===day))setHabitDoneState(st,'miracle-morning',day,true,session.finishedAt);}}}
async function syncPersonalJournal(){
 // One E2EE journal flight per device. Mutations during flight queue an immediate
 // follow-up instead of being hidden by a generic "synced" status.
 if(journalSyncInFlight)return journalSyncInFlight;
 if(!state||!authToken||!state.privateDeviceMirror?.key||!navigator.onLine){journalSyncStatus='lokal';return false;}
 const startRevision=journalRevision, journalMeasurement=performanceTrace.start();
 journalSyncInFlight=(async()=>{
  journalSyncBusy=true;journalSyncStatus='abgleich';render();
  const cfg=state.privateDeviceMirror;
  try{
   for(let attempt=0;attempt<4;attempt++){
    const remote=await mirrorGet('journal');
    if(remote&&remote.salt!==cfg.salt)throw Error('Anderer Synchronisierungsschlüssel – Journal nicht verändert.');
    const remoteData=remote?await decryptSection(cfg.key,'journal',remote):{};
    journalLastReadAt=Date.now();journalRemoteActiveStart=remoteData.quickWorktime?.activeStart||'';journalRemoteVersion=Number(remote?.version||0);journalLastError='';
    let merged=mergeJournalData(journalSyncPayload(state),remoteData);
    if(JSON.stringify(merged)!==JSON.stringify(journalSyncPayload(state))){
     applyJournalPayload(state,merged);await persist();syncQuickPublicFromState();render();
    }
    // Receiver decisions are immutable encrypted journal commands, not finance-mirror writes.
    // Only the primary device applies a decision after validating its exact base snapshot.
    if(state?.privateDeviceMirror?.mode==='source'){
     const outcome=applyQueuedFinanceDecisions(state);
     if(outcome.handled){
      if(outcome.applied)state.privateDeviceMirror.dirty=true;
      await persist();
      if(outcome.applied)await publishPrivateMirror();
      merged=mergeJournalData(journalSyncPayload(state),remoteData);
      render();
     }
    }
    // If the encrypted cloud snapshot already contains this data, a GET is sufficient.
    if(remote&&JSON.stringify(merged)===JSON.stringify(mergeJournalData(remoteData,{}))){
      journalLastConfirmedAt=Date.now();journalRemoteActiveStart=merged.quickWorktime?.activeStart||'';journalSyncStatus='ok';return true;
    }
    const encrypted=await encryptSection(cfg.key,'journal',merged);
    try{
      const published=await mirrorPublishEncrypted('journal',encrypted,cfg.salt,remote?.version||0);
      // Verify the actual server snapshot. A successful POST is not evidence that
      // another device can read this exact journal payload yet.
      const checked=await mirrorGet('journal');
      journalLastReadAt=Date.now();journalRemoteVersion=Number(checked?.version||0);
      if(!checked||checked.salt!==cfg.salt||journalRemoteVersion<Number(published.version||0))throw Error('Journal-Upload noch nicht aus der Cloud lesbar. Eintrag bleibt lokal erhalten.');
      const checkedData=await decryptSection(cfg.key,'journal',checked);
      journalRemoteActiveStart=checkedData.quickWorktime?.activeStart||'';
      const cloudHasLocal=JSON.stringify(mergeJournalData(checkedData,merged))===JSON.stringify(mergeJournalData(checkedData,{}));
      if(!cloudHasLocal){
       // Another device won a race. Keep local data, refetch/merge in a new pass.
       if(attempt<3)continue;
       throw Error('Cloud enthält noch nicht alle lokalen Journaländerungen. Erneut abgleichen.');
      }
      // Cloud confirmation is based on the roundtrip, not on the optimistic write.
      journalLastConfirmedAt=Date.now();journalSyncStatus='ok';return true;
    }catch(ex){if(ex.status!==409)throw ex;}
   }
   throw Error('Journal wurde gleichzeitig geändert. Bitte erneut abgleichen.');
  }catch(ex){journalSyncStatus='fehler';journalLastError=ex.message;throw ex;}
  finally{
   journalSyncBusy=false;
   journalSyncInFlight=null;
   if(journalRevision!==startRevision){journalSyncStatus='lokal';scheduleJournalSync(0);}
   render();performanceTrace.end('Journal-Abgleich',tab,journalMeasurement);
  }
 })();
 return journalSyncInFlight;
}
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
 return `<section class="work-card private-device-sync" aria-label="Privater Geräteabgleich"><div class="work-heading"><span>${ico('sync',18)} Geräteabgleich · Finanzen, Garmin, Habits, Zeit & Ernährung</span><span class="quiet-tag">Ende-zu-Ende verschlüsselt · freiwillig</span></div>
 <p class="muted-line">Aktuell in diesem Tresor: ${finance.toLocaleString('de-AT')} Bankbuchungen und ${loaded.toLocaleString('de-AT')} importierte Garmin-Einheiten. Planung/Inbox synchronisieren bereits separat; importierte Daten erst mit diesem optionalen Geräteabgleich.</p>
 ${mirror?`<div class="ux-settings-row"><div><strong>${mirror.mode==='source'?'Hauptgerät · sendet verschlüsselte Daten':'Empfangsgerät · lokaler Offline-Spiegel'}</strong><small>${mirror.lastAt?'Letzter erfolgreicher Abgleich: '+h(date(mirror.lastAt)):'Noch kein erfolgreicher Abgleich'} · Cloudflare speichert nur Ciphertext</small></div><button type="button" class="secondary-btn" data-action="private-mirror-refresh" ${!authToken||busy?'disabled':''}>Jetzt abgleichen</button></div><button type="button" class="secondary-btn" data-action="private-mirror-disconnect">Auf diesem Gerät deaktivieren</button>${mirror.mode==='source'?'<button type="button" class="secondary-btn" data-action="private-mirror-cloud-delete">Verschlüsselte Cloud-Kopien löschen</button>':''}`:
 `<form id="private-device-sync-setup" class="private-device-form"><label>Gerätetyp <select name="mode"><option value="source">Hauptgerät (Computer) · Daten senden</option><option value="receiver">Handy / Zweitgerät · Daten empfangen</option></select></label><label>Eigene Synchronisierungs-Passphrase (mind. 16 Zeichen) <input type="password" name="phrase" minlength="16" maxlength="200" required autocomplete="new-password" placeholder="Auf beiden Geräten dieselbe Passphrase"/></label><button class="primary-btn" type="submit" ${!authToken?'disabled':''}>Verschlüsselten Geräteabgleich aktivieren</button></form>`}
 <details><summary>Datenschutz und Funktionsumfang</summary><p class="small-muted">Nur Bankdaten einschließlich Korrekturen, finanzielle Ziele und lokale Garmin/Fitdays-Importe sowie manuelle Aktivitäten. Cloudflare sieht verschlüsselten Inhalt, Zeitpunkte und die Datenpaketgröße; keine Klartexte und keine Passphrase. Der Schlüssel liegt nur im verschlüsselten lokalen Tresor. Änderungen an diesen Bereichen erfolgen am Hauptgerät; andere Geräte erhalten eine schreibgeschützte Kopie. Beim Abgleich bleibt eine lokale Offline-Kopie erhalten. Verlierst du die Sync-Passphrase auf beiden Geräten und die eingerichteten Tresore, kann niemand Cloud-Daten entschlüsseln. Kein automatisches Zusammenführen widersprüchlicher Finanzkorrekturen.</p></details></section>`;
}
function systemScreen(){
 return chrome(`${smartImportHubView({state,entries:smartHubEntries,history:state?.smartImportHistory||[],folderStatus:smartHubFolderStatus,notice:smartHubNotice,busy:smartHubBusy,source:smartHubScanSource,storedCoverage:healthDataCoverage(state?.healthImports||{},localDate()),healthPreview:smartHubStage?.kind==='health'?healthFilePreview:null,healthJob:healthImportJob})}<div class="system-grid"><section class="module-card module-active"><div class="module-head"><div class="module-title">${ico('cloud',22)}<h2>Cloud-Verbindung</h2></div></div><p class="module-subtitle">GitHub Pages · Cloudflare Worker · D1</p>
 <div class="connection-detail"><span class="connection-dot ${configured()?'green':'amber'}"></span><span>${configured()?'Konfiguration hinterlegt':'Google-Anmeldung noch nicht konfiguriert'}</span></div>
 <p class="small-muted">${configured()?'API: '+h(config.apiUrl):'In client/public/runtime-config.json sind noch Konfigurationswerte zu ergänzen.'}</p><p class="small-muted">Frontend: Compass ${COMPASS_VISIBLE_RELEASE} · benötigt Worker-API 11 oder neuer.</p>
 <div id="google-button" class="google-button"></div><p class="small-muted">${authToken?'Compass-Sitzung aktiv: '+h(currentUser)+' · bleibt nach erneutem Tresor-Entsperren erhalten.':'Google-Anmeldung einmalig verknüpfen; danach wird die Compass-Sitzung verschlüsselt im Tresor gespeichert.'}</p><p class="small-muted">Planung automatisch: nach Änderungen und bei geöffneter App regelmäßig. Bank- und Garmin-Importe werden erst mit aktiviertem privaten Geräteabgleich übertragen.</p>
 <div class="system-actions"><button class="primary-btn" data-action="sync" ${!authToken||busy?'disabled':''}>${busy?'Synchronisiere …':'Jetzt synchronisieren'} ${ico('sync',16)}</button><button class="secondary-btn" data-action="logout" ${!authToken?'disabled':''}>Google trennen</button></div>
 <div class="mini-stats"><div><span>Wartende Änderungen</span><strong>${state.pending.length}</strong></div><div><span>Konflikte</span><strong>${state.conflicts.length}</strong></div><div><span>Sync-Cursor</span><strong>${state.cursor}</strong></div></div></section>
 <section class="module-card module-active"><div class="module-head"><div class="module-title">${ico('shield',22)}<h2>Lokaler Tresor</h2></div></div><p class="module-subtitle">Verschlüsselt und offline nutzbar.</p>
 <div class="security-line">${ico('check',17)} AES-256-GCM verschlüsselte Speicherung</div><div class="security-line">${ico('check',17)} Passphrase bleibt auf deinem Gerät</div><div class="security-line">${ico('check',17)} Keine privaten Aufgaben in GitHub</div>
 <button class="secondary-btn full" data-action="export-encrypted">Verschlüsseltes Backup herunterladen</button><button class="secondary-btn full" data-action="export-json">Klartext-JSON exportieren</button><p class="small-muted">Klartext-Exporte enthalten unverschlüsselte private Inhalte.</p></section></div>
 ${privateMirrorSettings()}
 <section class="work-card people-sync719"><div class="work-heading"><span>${ico('people',18)} Kontaktprofile geräteübergreifend</span><span class="quiet-tag">E2EE · ausdrücklich aktivieren</span></div>
 <p class="muted-line">Bisher wurden Kontakte einschließlich Beziehungslandkarte nur im lokalen Tresor gespeichert. Die normale Projekt-/Inbox-Synchronisierung überträgt keine Kontakte. Mit diesem Schalter werden Kontakte und persönliche Notizen über den bereits eingerichteten, Ende-zu-Ende-verschlüsselten Journalabgleich zusammengeführt. Bitte auf <strong>beiden Geräten</strong> aktivieren. Eine leere Liste überschreibt keine vorhandenen Kontakte.</p>
 <p class="small-muted">Auf diesem Gerät: <strong>${Object.keys(state?.people||{}).length}</strong> Kontaktprofile · Journalabgleich: ${state?.privateDeviceMirror?.key?'eingerichtet':'nicht eingerichtet'} · Profile: ${state?.peopleSyncEnabled?'freigegeben':'nur lokal'}</p>
 <div class="system-actions"><button type="button" class="secondary-btn" data-action="people-sync719-toggle" ${!state?.privateDeviceMirror?.key?'disabled':''}>${state?.peopleSyncEnabled?'Kontaktsynchronisierung ausschalten':'Kontaktsynchronisierung aktivieren'}</button>${state?.peopleSyncEnabled?`<button type="button" class="secondary-btn" data-action="people-sync719-now" ${!authToken?'disabled':''}>Kontaktprofile jetzt abgleichen</button>`:''}</div>
 ${!state?.privateDeviceMirror?.key?'<small>Vorher oben den verschlüsselten Geräteabgleich mit derselben Passphrase auf PC und Handy einrichten. Bis dahin bleiben alle Kontakte lokal und unverändert.</small>':''}</section>
 ${performancePanel()}
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
   return `<div class="occasion-suggestion ${status.kind!=='pending'?'occasion-quiet':''}"><span class="occasion55-copy">${h(st.label)}<small class="occasion55-date">${status.kind==='accepted'?'Als Aufgabe übernommen':status.kind==='dismissed'?'Für diesen Anlass ausgeblendet':`Sinnvoll bis ${h((()=>{const d=new Date(o.date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()-st.deadlineBefore);return d.toISOString().slice(0,10)})())}`}</small></span><div class="occasion55-actions">${status.kind==='pending'?`<button type="button" class="primary-btn" data-action="occasion-accept" data-id="${h(o.id)}" data-step="${h(st.id)}" aria-label="Als Aufgabe übernehmen" title="Übernehmen">✓</button><button type="button" class="secondary-btn" data-action="occasion-dismiss" data-id="${h(o.id)}" data-step="${h(st.id)}" aria-label="Vorschlag ausblenden" title="Nicht nötig">×</button>`:status.kind==='dismissed'?`<button type="button" class="secondary-btn" data-action="occasion-reset" data-id="${h(o.id)}" data-step="${h(st.id)}">Wieder anzeigen</button>`:`<button type="button" class="secondary-btn" data-action="task-view" data-id="${h(status.task.id)}">Aufgabe ansehen</button>`}</div></div>`;
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
 <form id="person-contact-form" class="compact-stack" data-id="${h(selected.id)}"><label>Datum<input type="date" name="day" max="${h(localDate())}" value="${h(savedContactDraft(selected.id).day)}" required></label><label>Kontaktart<select name="type">${CONTACT_TYPES.map(([key,label])=>`<option value="${h(key)}" ${savedContactDraft(selected.id).type===key?'selected':''}>${h(label)}</option>`).join('')}</select></label><label>Wer hat initiiert?<select name="initiator">${contactInitiatorOptions(savedContactDraft(selected.id).initiator)}</select></label><label>Notiz (optional)<input name="note" maxlength="1200" value="${h(savedContactDraft(selected.id).note)}" placeholder="Was möchte ich behalten?"></label><small class="contact-draft-confirmation">Entwurf wird im verschlüsselten Tresor gespeichert.</small><button type="submit" class="secondary-btn" ${contactSaving?'disabled':''}>${contactSaving?'Speichert …':'Kontakt bestätigen'}</button></form>${contactSaveStatus?`<p class="contact-save-confirmation" role="status">${h(contactSaveStatus)}</p>`:''}</section>`:'';
 return relationshipMapView(people,selected,{focus:relationshipMapFocus,filter:relationshipMapFilter,today:localDate(),projects:state?.projects||{},inspector});
}




function relationshipInspectorMarkup(person,projects,today){
 const p=preference(person),impulse=contactImpulse(personWithTouchMeetings(person,state),today);
 const linked=relatedProjectIds(person,projects);
 const usable=Object.values(projects||{}).filter(x=>x&&!x.isTemplate&&x.kind!=='folder'&&x.status!=='completed').sort((a,b)=>a.title.localeCompare(b.title,'de'));
 return `<section class="relationship-profile"><div class="work-heading"><span>♡ Relationship Radar</span><button type="button" class="relationship-pause ${p.paused?'is-paused':''}" data-action="person-pause-toggle" data-id="${h(person.id)}" title="${p.paused?'Kontaktimpulse fortsetzen':'Kontaktimpulse pausieren'}" aria-label="${p.paused?'Kontaktimpulse fortsetzen':'Kontaktimpulse pausieren'}">${p.paused?'▶ Play':'⏸ Pause'}</button></div>
 <form id="relationship-preferences-form" data-id="${h(person.id)}" class="relationship-pref-form">
 <div class="relationship-inline-fields"><label>Beziehungsart<select name="relationKind">${RELATION_KINDS.map(([key,label])=>`<option value="${key}" ${p.kind===key?'selected':''}>${label}</option>`).join('')}</select></label><label>Darstellung auf Karte<select name="genderMarker">${GENDER_MARKERS.map(([key,label])=>`<option value="${key}" ${p.gender===key?'selected':''}>${label}</option>`).join('')}</select></label></div>
 <label for="rel-closeness">Persönliche Nähe <strong id="rel-closeness-value">${p.closeness}/100</strong></label><div class="relationship-slider-line"><span aria-hidden="true">❄️</span><input id="rel-closeness" class="relationship-closeness-slider" type="range" name="closeness" min="0" max="100" step="1" value="${p.closeness}" aria-label="Persönliche Nähe"/><span aria-hidden="true">❤️</span></div>
<label for="rel-cadence">Gewünschter Kontaktrhythmus <strong id="rel-cadence-value">${p.cadence?`${p.cadence} Tage`:'Nach Bedarf'}</strong></label><div class="relationship-slider-line"><span aria-hidden="true">💬</span><input id="rel-cadence" class="relationship-cadence-slider" type="range" name="cadenceIndex" min="0" max="8" step="1" value="${Math.max(0,CADENCE_DAYS.indexOf(p.cadence))}" aria-label="Kontaktrhythmus"/><span aria-hidden="true">🗓️</span></div>
 <div class="relationship-score-line"><span>${p.paused?'⏸ Kontaktimpulse pausiert':impulse.hasHistory&&p.cadence?`Kontaktimpuls ${impulse.score}/100 · letzter Kontakt ${impulse.daysSince} Tage her`:'Noch kein automatischer Kontaktimpuls'}</span><button type="submit" class="secondary-btn">Speichern</button></div><small>Der Rhythmus ist ein Wunsch, keine Verpflichtung. Treffen (5), Video (4), Telefon (3), Chat (2), E-Mail (1): unterschiedliche Kontaktgewichte, keine Bewertung der Beziehung.</small></form>
 <details class="contact-care-settings" ${contactSettingsOpen?'open':''}><summary>⚙ Erweiterte Kontaktpflege</summary><form id="contact-care-form" data-id="${h(person.id)}"><label>Kontaktmodus<select name="mode">${CONTACT_MODES.map(([key,label])=>`<option value="${key}" ${careMode(person)===key?'selected':''}>${label}</option>`).join('')}</select></label><label class="contact-care-checkbox"><input type="checkbox" name="sharesHousehold" ${person.sharesHousehold?'checked':''}/> Lebt mit mir im selben Haushalt</label><small>Gemeinsamer Haushalt aktiviert automatisch Alltagskontakt. Bei Kollegen mit regelmäßigem Kontakt kannst du Alltagskontakt auswählen. Nähe bleibt unabhängig davon.</small><button type="submit" class="secondary-btn">Kontaktmodus speichern</button></form></details>
 <details class="relationship-personal" ${person.personalDetailsOpen?'open':''}><summary>Persönliches & Gemeinsamkeiten${person.homeCity||person.homeCountry?` · ${h([person.homeCity,person.homeCountry].filter(Boolean).join(' · '))}`:''}</summary><form id="relationship-details-form" data-id="${h(person.id)}" class="compact-stack"><label>Partner:in (falls bekannt)<input name="partnerName" maxlength="400" value="${h(person.partnerName||'')}"/></label><label>Kinder / Familie (optional)<input name="childrenInfo" maxlength="400" value="${h(person.childrenInfo||'')}" placeholder="Namen oder Merkpunkte"/></label><div class="person-homebase-fields"><label>Homebase · Ort<input name="homeCity" maxlength="120" value="${h(person.homeCity||'')}" placeholder="z. B. Graz" autocomplete="off"/></label><label>Land<input name="homeCountry" maxlength="120" value="${h(person.homeCountry||'')}" placeholder="z. B. Österreich" autocomplete="off"/></label></div><label>Gemeinsame Hobbys<input name="sharedHobbies" maxlength="400" value="${h(person.sharedHobbies||'')}"/></label><label>Wichtige Ereignisse<textarea name="importantEvents" rows="2" maxlength="1200">${h(person.importantEvents||'')}</textarea></label><label>Fürs nächste Catch-up merken<textarea name="catchUpNotes" rows="2" maxlength="1200">${h(person.catchUpNotes||'')}</textarea></label><button type="submit" class="secondary-btn">Merkpunkte speichern</button></form></details>
 <div class="relationship-projects"><div class="work-heading"><span>Verbundene Projekte</span><span class="quiet-tag">${linked.length}</span></div>${linked.map(id=>`<div class="relationship-project-row"><button type="button" data-action="person-project-open" data-id="${h(id)}">${h(projects[id].title)} ↗</button><button type="button" class="secondary-btn" data-action="person-project-unlink" data-id="${h(id)}" title="Verknüpfung lösen">×</button></div>`).join('')||'<p class="muted-line">Noch keine gemeinsamen Projekte verknüpft.</p>'}<form id="person-project-link-form" data-id="${h(person.id)}" class="relationship-project-link"><select name="projectId" aria-label="Projekt verknüpfen"><option value="">Projekt auswählen …</option>${usable.filter(x=>!linked.includes(x.id)).map(x=>`<option value="${h(x.id)}">${h(x.title)}</option>`).join('')}</select><button type="submit" class="secondary-btn">Verbinden</button></form><form id="person-project-create-form" data-id="${h(person.id)}" class="relationship-project-link"><input name="title" maxlength="140" placeholder="Neues Projekt, z. B. Urlaub gemeinsam planen" aria-label="Neues Projekt anlegen"/><button type="submit" class="secondary-btn">Projekt anlegen</button></form></div></section>`;
}
function peopleScreen(){
 // One pass over tasks/Inbox for all contacts, instead of O(people × tasks × inbox).
 const index=buildPersonAgendaIndex(Object.values(state?.people||{}),state?.tasks,rows(),state?.projects);
 const allPeople=Object.values(peopleWithTouchMeetings(state?.people||{},state));
 const counts=peopleScopeCounts(allPeople);
 const people=sortPeopleByOpenItems(peopleInScope(allPeople,peopleScope),index);
 if(!counts.all&&peopleTab==='map')peopleTab='list';
 const selected=people.find(p=>p.id===selectedPersonId)||people[0];
 const taskListFor=p=>index.get(p.id)?.tasks||[];
 const inboxFor=p=>index.get(p.id)?.inbox||[];
 const related=selected?taskListFor(selected):[];
 const relatedInbox=selected?inboxFor(selected):[];
 const waiting=related.filter(t=>t.workflow==='waiting').length;
 const contactSummaries=new Map(people.map(p=>[p.id,contactSummary(p,localDate())]));
 const visiblePeople=peopleShowAll?people:people.slice(0,80);
 const personEvents=selected?personCalendarEvents(calendarEvents,selected,localDate()):{upcoming:[],past:[]};
 const contact=selected?contactSummaries.get(selected.id):null;
 const contactLabel=contact?.last?new Date(contact.last.day+'T12:00:00').toLocaleDateString('de-AT'):'Noch kein bestätigter Kontakt';
 const touchSummary=selected&&peopleRadarExpanded?touchPersonSummary(state,selected.id):{count:0,latest:null,suggestions:[]};
 return chrome(`${!counts.all?`<section class="work-card people-sync719-alert" role="status"><strong>Auf diesem Gerät sind keine Kontaktprofile im lokalen Tresor gespeichert.</strong>${typeof peopleRecoveryPanel5933==='function'?peopleRecoveryPanel5933({count:counts.all,mirrorReady:!!state?.privateDeviceMirror?.key,enabled:state?.peopleSyncEnabled===true,authenticated:!!authToken,online:navigator.onLine,syncStatus:journalSyncStatus}):'<p>Bitte den verschlüsselten Kontaktabgleich prüfen.</p>'}</section>`:''}${selected?`<section class="p717-task-strip" aria-label="Offene Punkte zu ${h(selected.name)}"><div><strong>📋 ${h(selected.name)}</strong><small>${related.length} offene Aufgaben · ${relatedInbox.length} offene Inbox-Punkte · ${waiting} Waiting For</small></div><span class="p717-task-strip-count">${related.length+relatedInbox.length} offen</span></section>`:''}<nav class="people-scope720" aria-label="Kontaktbereich auswählen">${PEOPLE_SCOPES.map(([value,label])=>`<button type="button" data-action="people-scope720" data-id="${value}" aria-pressed="${peopleScope===value}" class="${peopleScope===value?'is-active':''}">${h(label)} <span>${counts[value]}</span></button>`).join('')}</nav>${counts.all&&!people.length?'<p class="people-scope720-empty">In diesem Bereich sind noch keine Kontakte. Du kannst die Beziehungsart einer Person unter „Beziehung & Nähe“ ändern.</p>':''}<nav class="relationship-tabs" aria-label="Menschen-Ansichten"><button type="button" data-action="people-tab" data-id="list" class="${peopleTab==='list'?'is-active':''}">☷ Kontakte</button><button type="button" data-action="people-tab" data-id="map" class="${peopleTab==='map'?'is-active':''}">◎ Beziehungslandkarte</button></nav><div class="people-grid ${peopleTab==='map'?'map-active':''}">${peopleTab==='map'?(people.length?peopleMapMarkup(people,selected):'<section class="work-card people-scope720-empty">Hier gibt es keine Kontakte für die Beziehungslandkarte. Wähle „Alle“ oder einen anderen Bereich.</section>'):`<section class="work-card"><div class="work-heading"><span>${ico('people',18)} Menschen · offene To-dos zuerst</span><span class="quiet-tag">${people.length}</span></div><details class="people-add-person"><summary>${ico('plus',14)} Person hinzufügen</summary><form id="person-create-form" class="compact-stack"><label>Name<input name="name" maxlength="80" required placeholder="Name hinzufügen" /></label><button type="submit" class="primary-btn">Hinzufügen</button></form></details><div class="people-list">${visiblePeople.map(p=>`<button type="button" data-action="person-select" data-id="${h(p.id)}" class="people-item ${selected?.id===p.id?'selected':''}"><strong>${h(p.name)}</strong><small>${taskListFor(p).length} Aufgaben · ${inboxFor(p).length} Inbox${contactSummaries.get(p.id)?.last?' · zuletzt '+h(contactSummaries.get(p.id).last.day):''}${p.birthdayMonthDay?` · 🎂 ${h(p.birthdayMonthDay.slice(3))}.${h(p.birthdayMonthDay.slice(0,2))}.`:""}</small></button><div class="people-quick-actions"><button type="button" data-action="person-quick-log" data-id="${h(p.id)}" data-kind="call" title="Telefonat dokumentieren" aria-label="Telefonat mit ${h(p.name)} dokumentieren">☎</button><button type="button" data-action="person-quick-log" data-id="${h(p.id)}" data-kind="meeting" title="Persönliches Treffen dokumentieren" aria-label="Treffen mit ${h(p.name)} dokumentieren">☕</button><button type="button" data-action="person-quick-log" data-id="${h(p.id)}" data-kind="email" title="E-Mail dokumentieren" aria-label="E-Mail mit ${h(p.name)} dokumentieren">✉</button></div>`).join('')||'<p class="muted-line">In dieser Auswahl gibt es keine Kontakte. Wechsle zwischen Arbeitskollegen und Privat.</p>'}</div>${people.length>visiblePeople.length?`<button type="button" class="secondary-btn p717-more-people" data-action="people-show-all">Alle ${people.length} Kontakte anzeigen</button>`:peopleShowAll&&people.length>80?`<button type="button" class="secondary-btn p717-more-people" data-action="people-show-less">Nur erste 80 anzeigen</button>`:''}</section>`}
 <section class="work-card"><div class="work-heading"><span>${ico('list',18)} ${selected?h(selected.name):'Gesprächsvorbereitung'}</span>${selected?`<button class="secondary-btn" type="button" data-action="person-remove" data-id="${h(selected.id)}">Entfernen</button>`:''}</div>${selected?`<p class="muted-line">${related.length} offene Aufgaben · ${relatedInbox.length} noch in der Inbox · ${waiting} Waiting For</p>
 <section class="people-agenda-first"><div class="work-heading"><span>${ico('list',17)} Offene To-dos & Gesprächspunkte</span><span class="quiet-tag">${related.length} Aufgaben · ${relatedInbox.length} Inbox</span></div><div class="people-agendas">${related.map(t=>`<div class="person-point-row"><button type="button" class="person-quick-check" data-action="person-task-done" data-id="${h(t.id)}" aria-label="${h(t.title)} als erledigt markieren" title="Aufgabe erledigen" ${state?.taskConflicts?.[t.id]?'disabled':''}>${ico('check',15)}</button><details class="person-point" data-point="task" data-id="${h(t.id)}" ${personOpenPointId===t.id?'open':''}><summary><span class="person-point-symbol">${ico('checkSquare',16)}</span><span class="person-point-title"><strong>${h(t.title)}</strong><small>${h(t.workflow==='waiting'?'Waiting For':'Aufgabe / Agenda')}${state?.taskPending?.[t.id]?' · Lokal gespeichert':''}</small></span>${ico('chevronDown',15)}</summary><form class="person-point-form" data-kind="task" data-id="${h(t.id)}"><label>Notiz zu diesem Punkt<textarea name="note" maxlength="3000" rows="3" placeholder="Was haben wir besprochen?">${h(t.note||'')}</textarea></label>${state?.taskConflicts?.[t.id]?'<p class="person-point-warning">Bearbeitungskonflikt: Bitte zuerst in der Aufgabenansicht auflösen.</p>':''}<div class="person-point-actions"><button type="submit" name="intent" value="save" class="secondary-btn" ${state?.taskConflicts?.[t.id]?'disabled':''}>Notiz speichern</button><button type="submit" name="intent" value="done" class="primary-btn" ${state?.taskConflicts?.[t.id]?'disabled':''}>${ico('check',15)} Erledigt</button></div></form></details></div>`).join('')||'<p class="muted-line">Keine offenen Aufgaben mit diesem Personentag.</p>'}</div>${relatedInbox.length?`<section class="people-linked-inbox"><h3>${ico('inbox',16)} Noch in der Inbox · ${relatedInbox.length}</h3>${relatedInbox.map(r=>`<details class="person-point" data-point="inbox" data-id="${h(r.id)}" ${personOpenPointId===r.id?'open':''}><summary><span class="person-point-symbol">${ico('inbox',16)}</span><span class="person-point-title"><strong>${h(r.title)}</strong><small>Noch zu klären · kein erledigbarer Task</small></span>${ico('chevronDown',15)}</summary><form class="person-point-form" data-kind="inbox" data-id="${h(r.id)}"><label>Gesprächsnotiz<textarea name="note" maxlength="10000" rows="3" placeholder="Was ist dazu besprochen worden?">${h(r.note||'')}</textarea></label><div class="person-point-actions"><button type="submit" name="intent" value="save" class="secondary-btn">Notiz speichern</button><button type="submit" name="intent" value="discussed" class="primary-btn">${ico('check',15)} Besprochen &amp; archivieren</button></div><small>Archivieren ist keine Erledigung einer Aufgabe. Später kannst du aus der Inbox bei Bedarf eine Next Action erstellen.</small></form></details>`).join('')}</section>`:''}<form id="person-agenda-form" data-id="${h(selected.id)}" class="people-agenda-capture"><label>Gesprächsthema ergänzen<input name="title" required maxlength="180" placeholder="Was möchte ich mit dieser Person besprechen?"/></label><button type="submit" class="secondary-btn">${ico('plus',15)} Hinzufügen</button></form></section>
 <section class="p717-optional-relationship"><button type="button" class="secondary-btn p717-radar-toggle" data-action="people-radar-toggle" aria-expanded="${peopleRadarExpanded}">${ico('people',16)} Beziehung & Nähe ${peopleRadarExpanded?'ausblenden':'anzeigen'} ${ico('chevronDown',15)}</button>${peopleRadarExpanded?`<div class="p717-relationship-panel">${relationshipInspectorMarkup(selected,state?.projects||{},localDate())}<section class="t577-person-strip"><span>${touchSummary.count} Begegnungen erfasst${touchSummary.latest?' · zuletzt '+h(new Date(touchSummary.latest).toLocaleDateString('de-AT')):''}</span><button type="button" class="secondary-btn" data-action="t577-for-person" data-id="${h(selected.id)}">+ Nähe erfassen</button></section></div>`:''}</section>
 <section class="people-relationship-card"><div class="work-heading"><span>${ico('people',17)} Kontaktverlauf</span><span class="quiet-tag">${contact?.items.length||0} bestätigt</span></div><div class="people-last-contact"><strong>${h(contactLabel)}</strong><small>${contact?.daysSince!==null?`${contact.daysSince} Tage seit dem letzten dokumentierten Kontakt`:'Noch keine Kontakte dokumentiert'}</small></div>
 ${activeCare(selected)&&contactImpulse(selected,localDate()).due?`<p class="people-contact-reminder">${ico('calendar',15)} Freiwilliger Kontaktimpuls: ${contact.daysSince} Tage seit dem letzten bestätigten Kontakt. Keine Verpflichtung.</p>`:''}
 <div class="relationship-contact-quick"><button type="button" data-action="person-quick-log" data-id="${h(selected.id)}" data-kind="meeting">☕ Treffen</button><button type="button" data-action="person-quick-log" data-id="${h(selected.id)}" data-kind="call">☎ Telefonat</button><button type="button" data-action="person-quick-log" data-id="${h(selected.id)}" data-kind="video">▣ Video</button><button type="button" data-action="person-quick-log" data-id="${h(selected.id)}" data-kind="message">💬 Nachricht</button><button type="button" data-action="person-quick-log" data-id="${h(selected.id)}" data-kind="email">✉ E-Mail</button></div>${quickContactType?`<p class="relationship-log-hint">${h(contactTypeLabel(quickContactType))} gewählt – Datum und Notiz prüfen, dann ausdrücklich bestätigen.</p>`:''}<form id="person-contact-form" class="compact-stack" data-id="${h(selected.id)}"><div class="people-contact-fields"><label>Kontaktdatum<input name="day" type="date" required max="${h(localDate())}" value="${h(savedContactDraft(selected.id).day)}"/></label><label>Art<select name="type">${CONTACT_TYPES.map(([value,label])=>`<option value="${h(value)}" ${savedContactDraft(selected.id).type===value?'selected':''}>${h(label)}</option>`).join('')}</select></label></div><label>Wer hat den Kontakt initiiert?<select name="initiator">${contactInitiatorOptions(savedContactDraft(selected.id).initiator)}</select></label><label>Kurze Notiz (optional)<input name="note" maxlength="1200" value="${h(savedContactDraft(selected.id).note)}" placeholder="Was möchte ich behalten?"/></label><small class="contact-draft-confirmation">Entwurf wird verschlüsselt gesichert.</small><button class="secondary-btn" type="submit" ${contactSaving?'disabled':''}>${contactSaving?'Speichert …':ico('check',15)+' Kontakt festhalten'}</button></form>${contactSaveStatus?`<p class="contact-save-confirmation" role="status">${h(contactSaveStatus)}</p>`:''}
 <div class="people-contact-log">${contact?.items.slice(0,8).map(entry=>`<div class="people-contact-row"><div><strong>${h(entry.day)} · ${h(contactTypeLabel(entry.type))}</strong><small>${h(contactInitiatorLabel(entry.initiator))} · Kontaktgewicht: ${contactWeight(entry.type)} / 5</small>${entry.note?`<small>${h(entry.note)}</small>`:''}</div>${String(entry.id||'').startsWith('touch-derived:')?'<small class="muted-line" title="Im Berührungstracker bearbeiten oder löschen">Aus Berührungstracker</small>':`<button type="button" class="people-delete-entry" data-action="person-contact-delete" data-id="${h(entry.id)}" aria-label="Kontakteintrag vom ${h(entry.day)} entfernen" title="Eintrag löschen">${ico('x',15)}</button>`}</div>`).join('')||'<p class="muted-line">Hier erscheinen ausschließlich Kontakte, die du selbst bestätigst. Kalendertermine gelten nicht automatisch als Treffen.</p>'}${(contact?.items.length||0)>8?`<details><summary>Alle ${contact.items.length} Kontakte</summary>${contact.items.slice(8).map(entry=>`<div class="people-contact-row"><div><strong>${h(entry.day)} · ${h(contactTypeLabel(entry.type))}</strong><small>${h(contactInitiatorLabel(entry.initiator))} · Kontaktgewicht: ${contactWeight(entry.type)} / 5</small>${entry.note?`<small>${h(entry.note)}</small>`:''}</div>${String(entry.id||'').startsWith('touch-derived:')?'<small class="muted-line">Aus Berührungstracker</small>':`<button type="button" data-action="person-contact-delete" data-id="${h(entry.id)}" aria-label="Kontakteintrag entfernen">${ico('x',15)}</button>`}</div>`).join('')}</details>`:''}</div>
 <p class="muted-line">Kontaktimpulse werden über den Rhythmus im Relationship Radar gesteuert, ausschließlich anhand selbst bestätigter Kontakte.</p></section>
 <div class="people-calendar"><div class="work-heading"><span>${ico('calendar',16)} Gemeinsame Google-Termine</span><span class="quiet-tag">${personEvents.upcoming.length} kommende</span></div>${personEvents.upcoming.slice(0,5).map(e=>`<div class="person-calendar-event"><strong>${h(e.summary||'Termin')}</strong><small>${h(String(e.start?.dateTime||e.start?.date||'').slice(0,16).replace('T',' · '))} · geplant</small></div>`).join('')||'<p class="muted-line">Keine zugeordneten künftigen Kalendertermine.</p>'}${personEvents.past.length?`<details><summary>${personEvents.past.length} vergangene Termine</summary>${personEvents.past.slice(0,6).map(e=>`<div class="person-calendar-event"><strong>${h(e.summary||'Termin')}</strong><small>${h(String(e.start?.dateTime||e.start?.date||'').slice(0,16).replace('T',' · '))} · Durchführung nicht bestätigt</small></div>`).join('')}</details>`:''}<small class="muted-line">Google Kalender wird nur im angemeldeten Browser gelesen. Vergangene Termine sind kein bestätigter Kontakt.</small></div>




 ${calendarContactPanel(selected)}
 <details class="people-admin-details"><summary>Weitere Kontaktangaben und Einstellungen</summary> <form id="person-tag-form" class="compact-stack" data-id="${h(selected.id)}"><label>Personen-Tag<input name="tag" data-smart-tags maxlength="50" value="${h(selected.tag)}" required/></label><label>Namensvarianten für Kalender (optional)<input name="aliases" maxlength="200" value="${h(selected.aliases||'')}" placeholder="Spitzname, Kurzform …"/></label><button class="secondary-btn" type="submit">Zuordnung speichern</button><small>Das Tag verbindet offene Aufgaben und ungeklärte Inbox-Einträge mit dieser Person. Die Inbox-Einträge werden nicht automatisch zu Aufgaben. Kalendertermine werden anhand des Namens oder der angegebenen Varianten erkannt.</small></form>
 <form id="person-birthday-form" data-id="${h(selected.id)}" class="compact-stack person-birthday-form"><div class="work-heading"><span>${ico('calendar',16)} Geburtstag</span><span class="quiet-tag">${selected.birthdayMonthDay?`${h(selected.birthdayMonthDay.slice(3))}.${h(selected.birthdayMonthDay.slice(0,2))}.${selected.birthdayYear||''}`:'Nicht eingetragen'}</span></div>
 <div class="birthday-fields"><label>Tag<select name="day"><option value="">–</option>${Array.from({length:31},(_,i)=>i+1).map(n=>`<option value="${n}" ${Number(selected.birthdayMonthDay?.slice(3))===n?'selected':''}>${n}</option>`).join('')}</select></label><label>Monat<select name="month"><option value="">–</option>${Array.from({length:12},(_,i)=>i+1).map(n=>`<option value="${n}" ${Number(selected.birthdayMonthDay?.slice(0,2))===n?'selected':''}>${new Intl.DateTimeFormat('de-AT',{month:'long'}).format(new Date(2000,n-1,1))}</option>`).join('')}</select></label><label>Geburtsjahr (optional)<input type="number" name="year" min="1850" max="${new Date().getFullYear()}" placeholder="Unbekannt" value="${h(selected.birthdayYear??'')}"/></label></div>
 <div class="birthday-actions"><button type="submit" class="secondary-btn">Geburtstag speichern</button><button type="button" class="secondary-btn" data-action="person-birthday-clear" data-id="${h(selected.id)}" ${selected.birthdayMonthDay?'':'disabled'}>Entfernen</button></div>
 <small>Gespeichert im verschlüsselten Tresor auf diesem Gerät. Geburtstage erscheinen in der Anlassvorbereitung und werden mit gleichen Google-Kalendergeburtstagen zusammengeführt.</small></form>
 <form id="person-note-form" data-id="${h(selected.id)}" class="compact-stack"><label>Notizen zur Person<textarea name="note" rows="3" maxlength="1500">${h(selected.note||'')}</textarea></label><button type="submit" class="secondary-btn">Notiz speichern</button></form></details>`:'<p class="muted-line">Wähle eine Person, um gemeinsame Themen und nächste Schritte zu verwalten.</p>'}</section></div>`);
}
function financeScreen(){if(!compass54Ready('finance'))return compass54LoadingScreen('finance');const quickNav=financeQuickNavView(state,financePane);if(financePane==='Überblick')return chrome(quickNav+financePremiumOverviewView(state,{period:financePeriod,account:financeAccount,today:localDate()}));if(financePane==='Prüfen'&&typeof window!=='undefined'&&window.matchMedia?.('(max-width: 760px)')?.matches)return chrome(quickNav+mobileFinanceReviewView(state,{account:financeAccount,page:financeReviewPage}));return chrome(quickNav+(state?.privateDeviceMirror?.mode==='receiver'&&financePane==='Prüfen'?'<div class="fin79-receiver-explain"><strong>Zuordnung am Zweitgerät</strong>Deine Auswahl wird lokal verschlüsselt vorgemerkt. Das Hauptgerät prüft und übernimmt sie beim nächsten Abgleich. Bis dahin bleibt die Buchung in der Liste offen.</div>':'')+financeDashboardView(state,financePane,financePeriod,financePreview,financeReviewPage,{paceCompare:financePaceCompare,budgetMonth:financeBudgetMonth,query:financeLedgerQuery,filter:financeLedgerFilter,page:financeLedgerPage,tripSelected:financeTripSelected,tripQuery:financeTripQuery,tripMode:financeTripMode,tripPage:financeTripPage,categorySelected:financeCategorySelected,account:financeAccount,visualMode:financeVisualMode,compareMode:financeCompareMode,merchantCategory:financeMerchantCategory,sankeyFocus:financeSankeyFocus,sankeyExpanded:financeOverviewSankeyOpen,merchantSelected:financeMerchantSelected,cycleSelected:financeCycleSelected,forecastScenario:financeForecastScenario,financeWhatIf,financeWhatIfDraft,financeAiSuggestions,krakenPreview,krakenBridgeBusy,krakenPublicBusy,krakenChartAsset,krakenChartPeriod,krakenChartBusy,krakenChartError,krakenChartData,krakenChartSettings,marketQuote:financeMarketQuote,portfolioTab:financePortfolioTab,portfolioMarket:financePortfolioMarket,flatexSort:{key:flatexPositionSort,descending:flatexPositionDescending},flatexChart:{isin:flatexChartIsin,ticker:flatexChartTicker,period:flatexChartPeriod,busy:flatexChartBusy,error:flatexChartError,data:flatexChartData,settings:flatexChartSettings}}));}




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
let insights750Last=Object.create(null);
 function insights750GroupFor750(target){return ['intelligence','health','life','time','sources'].find(key=>insights750Group(key)?.tabs.some(([id])=>id===target))||null;}
 let sleepMemo={data:null,period:'',today:'',value:null};
function cachedSleepInsights(data,today,period){
 if(sleepMemo.data===data&&sleepMemo.today===today&&sleepMemo.period===period)return sleepMemo.value;
 const value=buildSleepInsights(data,today,period);sleepMemo={data,period,today,value};return value;
}
function invalidateDerivedInsights(){sleepMemo.data=null;sleepMemo.value=null;}
function insightsScreen(){if(insightTab==='nutrition')queueMicrotask(ensureMensaForNutrition);if(insightTab!=='dreamworld'&&!compass54Ready('insights'))return compass54LoadingScreen('insights');
 const tabDef=insightTab==='lifeweeks'?{label:'My Life in Weeks',subtitle:'Ars Vivendi · Lebenschronik'}:insightTab==='report'?{label:'Ars Vivendi',subtitle:'Compass Life Report'}:insightTab==='intelligence'?{label:'Intelligence-Cockpit',subtitle:'Übersichten, Muster und nächste Schritte'}:insightTab==='capacity'?{label:'Fristen & Kapazität',subtitle:'Aktueller GTD-Stand · bewusst geschätzte Arbeitskapazität'}:insightTab==='weekly'?{label:'Wochenkompass',subtitle:'Letzte vollständig vergangene Tage · Datenstand je Quelle'}:insightTab==='dreamworld'?{label:'Traumwelt',subtitle:'Nachtträume, Tagträume und Fantasien'}:insightTab==='touch'?{label:'Berührung & Nähe',subtitle:'Freiwillig dokumentierte körperliche Nähe'}:(INSIGHT_TABS.find(t=>t.id===insightTab)||INSIGHT_TABS[0]);
 const today=localDate();
 const model=(insightTab==='sleep'||insightTab==='places')?cachedSleepInsights(state?.healthImports||{},today,insightPeriod):null;
 const healthIds=['sleep','energy','stress','body'];
 const healthMode=healthIds.includes(insightTab);
 const compactInsights=[['capacity','Fristen','target'],['weekly','Wochenkompass','calendar'],['dreamworld','Traumwelt','moon'],['balance','Balance Radar','compass'],['feelings','Gefühlswelt','heart'],['timejournal','Zeitjournal','clock'],['nutrition','Ernährung','food'],['touch','Berührung','heart'],['habits','Habits','checkSquare'],['connections','Zusammenhänge','spark'],['sleep','Gesundheit','heart'],['activity','Aktivität','activity'],['strength','Krafttraining','activity'],['places','Orte','compass'],['focus','Produktivität','target'],['worktime','Arbeitszeit','clock'],['explore','Explore','spark'],['report','Life Report','layers']];
 const tabs=insights750PrimaryTabs(tab,insightTab,ico);
 const healthChoices=false&&healthMode?`<div class="calm-health-icons" role="group" aria-label="Gesundheitsauswertung">${[['sleep','Schlaf','moon'],['energy','Body Battery','bolt'],['stress','Stress','activity'],['body','Körper','layers']].map(([key,label,icon])=>`<button type="button" class="calm-health-icon ${insightTab===key?'selected':''}" data-action="insights-tab" data-id="${key}" aria-label="${label}" title="${label}" aria-pressed="${insightTab===key}">${ico(icon,19)}<span class="calm-icon-tooltip" aria-hidden="true">${label}</span></button>`).join('')}<span class="calm-active-health-label">${h(tabDef.label)}</span></div>`:'';
 const periods=INSIGHT_PERIODS.map(([v,label])=>`<button type="button" class="insight-period ${insightPeriod===v?'selected':''}" data-action="insights-period" data-id="${h(v)}" aria-pressed="${insightPeriod===v}">${h(label)}</button>`).join('');
 const dataCount=(state?.healthImports?.garminNights?.length||0)+(state?.healthImports?.garminHrv?.length||0)+(state?.healthImports?.fitdays?.length||0)+(state?.healthImports?.garminWellness?.length||0)+(state?.healthImports?.garminFitness?.length||0)+(state?.healthImports?.garminSessions?.length||0);
 const content=insightTab==='lifeweeks'?lifeWeeksView(state,{today,selectedAge:lifeWeeksAge,selectedWeek:lifeWeeksWeek,draft:lifeWeeksDraft,bonus:lifeWeeksBonus,star:lifeWeeksStar,calendar:calendarEvents,calendarResults:lifeWeeksCalendarHistory,calendarQuery:lifeWeeksCalendarQuery,calendarConnected:Boolean(calendarToken&&Date.now()<calendarExpires),calendarLoading:lifeWeeksCalendarLoading}):insightTab==='report'?annualSetupView(state,{...lifeReportSettings,now:today}):insightTab==='intelligence'?insights750Cockpit(state,{today:localDate()}):insightTab==='capacity'?capacityGuardianView(effectiveCapacityState748(state),{today:localDate()})+capacityCalendarView(state,{today:localDate(),now:new Date(),calendarEvents,calendarCoverage,calendarUpdatedAt,calendarConnected:!!(calendarToken&&Date.now()<calendarExpires)||Boolean(state?.calendarArchive?.completed)}):insightTab==='weekly'?weeklyIntelligenceView(state,{today:localDate(),offset:weeklyOffset746})+capacityGuardianTeaser(state,{today:localDate()}):insightTab==='dreamworld'?dreamJournalView(state,{days:dreamDays743,editingId:dreamEditingId743,kind:dreamKind743}):insightTab==='connections'?personalConnectionsView(personalConnections(state,{today,days:connectionDays,emotionId:connectionEmotion,healthDays})):insightTab==='feelings'?`<div style="margin-bottom:12px"><button type="button" class="t577-tab-shortcut" data-action="t577-open">🫂 Berührung & Nähe erfassen →</button></div>`+feelingInsights(state?.feelingCheckins||[],today,feelingDays,{view:feelingView,selectedId:feelingSelectedId,limit:feelingHistoryLimit}):insightTab==='habits'?habitInsightsView():insightTab==='timejournal'?timeJournalView(state,{period:timeJournalPeriod,editingId:timeJournalEditId,showForm:timeJournalShowForm,watchActivities:activeActivities(watchSessions,state)})+journalSyncPanel():insightTab==='nutrition'?nutritionWorkspace4017(state,{
   day:today,view:nutritionView712,editingId:nutritionEditId,
   renderJournal:()=>nutritionInsightsView(state,{period:nutritionPeriod}),
   renderEditor:()=>nutritionEntryInspectorView(state,{editingId:nutritionEditId}),
   renderHistory:()=>nutritionHistoryView(state,{period:nutritionPeriod}),
   renderManualDozen:()=>dailyDozenView(state,{day:dailyDozenDay733,today:localDate()}),
   renderSync:()=>journalSyncPanel(),
   renderMensa:()=>mensaApi?mensaApi.mensaCatalogPanel(state,{draft:mensaImportDraft,day:today,status:mensaMessage}):'<p>Mensa-Datenbank wird geladen …</p>',
   renderSection:kind=>kind==='daily-dozen'?dailyDozen5930View(dailyDozen5930(state,{day:today}))
    :kind==='nutrients'?nutritionIntelligenceView(state,{day:nutritionDay712,detail:nutritionProduct712})
    :kind==='timing'?nutritionTimingView(state,{mode:nutritionTimingMode725,anchor:nutritionTimingAnchor725,selectedId:nutritionTimingSelected725})
    :kind==='trends'?nutritionTrendsView(state,{mode:nutritionTrendsMode726,anchor:nutritionTrendsAnchor726,metric:nutritionTrendsMetric726})
    :kind==='connections'?nutritionConnectionsView(state,{input:nutritionConnInput727,outcome:nutritionConnOutcome727,range:nutritionConnRange727,today:localDate(),healthDays})
    :kind==='fats'?nutritionFatView(state,{days:nutritionFatDays731,metric:nutritionFatMetric731,today:localDate()})
    :kind==='anti-aging'?antiAgingEightView(state,{day:antiAgingDay734,today:localDate()})
    :kind==='phyto'?nutritionPhytoView(state,{period:phytoPeriod736,today:localDate()})
    :''
  }):insightTab==='touch'?touchHistoryView(state,{period:touchPeriod,editingId:touchEditingId})+journalSyncPanel():insightTab==='balance'?(compass55Mode==='extended'?balancePerspective38(state,{today,period:balancePeriod,healthDays,choice:balancePerspectiveChoice38,activeAxis:balanceSelectedAxis,history:balanceHistoryCount}):lifeBalanceRadarView(buildLifeBalanceRadar(state,{today,period:balancePeriod,healthDays}),{history:buildLifeBalanceHistory(state,{today,period:balancePeriod,healthDays,count:balanceHistoryCount}),activeAxis:balanceSelectedAxis}))+(compass55Mode==='extended'?dailyDozen5930View(dailyDozen5930(state,{day:today})): ''):insightTab==='focus'?productivityInsightsView(buildProductivityInsights({imported:state?.healthImports||{},activities:activeActivities(watchSessions,state),calendarEvents,rules:effectiveCalendarRules(state),overrides:state?.calendarOverrides||{},calendarCoverage,today,period:insightPeriod}),activeActivities(watchSessions,state),calendarStatus,Boolean(calendarToken&&Date.now()<calendarExpires))+inspirationInsightsView(state):insightTab==='sleep'?insightsSleepView(model,insightNight,ico,today,state?.healthImports||{},{order:healthAiOrder,status:healthAiStatus},insightYearMode,insightWeekAnchor,insightYearAnchor):insightTab==='worktime'?quickWorktimeInsights()+worktimeView(state?.workTime||{},workYear,workThreshold,workPreview,today,false)+worktimeYearComparisonView(state?.workTime?.days||[],today,workCompareMode)+worktimeImportPanel(state?.workTime||{},workPreview):insightTab==='stress'?insightsStressView(state?.healthImports,insightPeriod,today,insightWellnessDay,insightStressGranularity,14,insightStressPage,{calendarEvents,calendarCoverage,calendarConnected:Boolean(calendarToken&&Date.now()<calendarExpires),activities:activeActivities(watchSessions,state),timeRows:timeEntries(state),rules:effectiveCalendarRules(state),overrides:state?.calendarOverrides||{}}):insightTab==='energy'?insightsEnergyView(state?.healthImports,insightPeriod,today,insightWellnessDay):insightTab==='body'?fitdaysInterpretationView(state?.healthImports?.fitdays||[],{today:localDate(),range:insightPeriod,heightCm:184,targetWeightKg:state?.nutritionJournal?.energyGoal?.targetWeightKg??null})+bodyTransformationView(state,{today:localDate(),range:insightPeriod,nutritionIndex:nutritionTrendsIndex(state),strengthSessions:strengthSummariesWithFit(state)})+healthBodyView(state?.healthImports||{},insightPeriod,insightBodyComposition):insightTab==='strength'?strengthInsightsView(state,{range:strengthRange728,side:strengthSide728,today,editingId:strengthEditId732,activity:strengthActivity737}):insightTab==='activity'?fitnessInsightsView(state?.healthImports||{},healthDays,insightPeriod,today,activeActivities(watchSessions,state),{mode:sportsMode,anchor:sportsAnchor,metric:sportsMetric,selected:sportsSelected,label:sportsPeriodWindow(sportsMode,sportsAnchor,today).label,today}):insightTab==='sources'?healthSummaryPanel('sources'):insightTab==='places'?placesInsightsView({visits:state?.placesVisits||[],mapRegion:placesMapRegion,mapZoom:placesMapZoom,listLimit:placesListLimit,labels:state?.placesLabels||{},nights:state?.healthImports?.garminNights||[],range:model.range,selected:selectedPlaceKey,preview:placesPreview}):insightTab==='explore'?exploreView(exploreDays({imported:state?.healthImports||{},activities:activeActivities(watchSessions,state),calendarEvents,rules:effectiveCalendarRules(state),overrides:state?.calendarOverrides||{},calendarCoverage,today,period:insightPeriod}),exploreX,exploreY,exploreLag):insightsPlannedView(insightTab,state?.healthImports||{},healthDays,activeActivities(watchSessions,state));
 return chrome(`<div class="insight-workspace cf52-insight cf52-${insightTab}" aria-label="Compass Insights · Personal Analytics">
 <div class="calm-insight-toolbar" aria-label="Mobile Insights-Navigation"><nav class="calm-insights-nav" aria-label="Insights-Kategorien">${tabs}</nav><button type="button" class="calm-source-action" data-action="insights-tab" data-id="sources" title="Garmin und Fitdays importieren">${ico('settings',16)}<span>Datenquellen</span></button></div>
 ${insights750Subtabs(tab,insightTab)}
 <div class="insight-view-header ${insightTab==='sources'?'insight-source-heading':''} ${insightTab==='nutrition'?'nf4017-hide-heading':''}"><div class="insight-heading-main"><div><div class="insight-kicker">${h(tabDef.label.toUpperCase())} / ${insightTab==='sources'?'VERWALTUNG':'ANALYSE'}</div><h2>${h(tabDef.subtitle)}</h2></div>${healthChoices}</div>${['sleep','body','stress','energy','focus','places','explore'].includes(insightTab)?`<div class="insight-periods" aria-label="Zeitraum auswählen">${periods}</div>`:''}</div>
 ${insightTab==='feelings'?`<div class="fw65-periods" role="group" aria-label="Gefühlsverlauf Zeitraum"><button data-action="feeling-period" data-id="7" class="${feelingDays===7?'selected':''}">7 Tage</button><button data-action="feeling-period" data-id="30" class="${feelingDays===30?'selected':''}">30 Tage</button><button data-action="feeling-period" data-id="90" class="${feelingDays===90?'selected':''}">90 Tage</button></div>`:''}${content}




 </div>`);
}
function progressScreen(){
 const projects=Object.values(state?.projects||{}).filter(p=>p.kind!=='folder'&&!p.isTemplate&&p.status==='active');
 const today=localDate(),earlier=new Date(today+'T12:00:00');earlier.setDate(earlier.getDate()-6);const begin=localDate(earlier);
 const stats=activityStats(activeActivities(watchSessions,state),begin,today);
 const focusTimeProgress=timeProgressMarkup(activeActivities(watchSessions,state),begin,today);
 return chrome(`<div class="compass593-external-insights" aria-label="Zeit und Produktivität">${insights750Subtabs('progress',insightTab)}</div><div class="progress-view"><section class="work-card"><div class="work-heading"><span>${ico('activity',18)} Aktivitäten der letzten 7 Tage</span></div><div class="metrics-row"><div><strong>${stats.count}</strong><small>Sessions</small></div><div><strong>${(stats.minutes/60).toLocaleString('de-AT',{maximumFractionDigits:1})} h</strong><small>erfasste Zeit</small></div><div><strong>${stats.pomodoros}</strong><small>Pomodoros</small></div></div><button type="button" class="text-link" data-tab="activity">Sessions verwalten ${ico('arrow',14)}</button>${focusTimeProgress}</section><section class="work-card"><div class="work-heading"><span>${ico('folder',18)} Projektfortschritt</span><span class="quiet-tag">${projects.length} aktiv</span></div>${projects.length?projects.map(p=>{const tasks=projectTasks(state,p.id);const completed=tasks.filter(x=>x.completed).length;return `<button type="button" class="progress-project" data-action="timeline-project" data-id="${h(p.id)}"><span class="progress-project-head"><strong class="progress-project-name">${h(p.title)}</strong><span class="progress-project-count" aria-label="${completed} von ${tasks.length} Schritten erledigt">${completed}/${tasks.length}</span></span><div class="progress-track" aria-hidden="true"><span style="width:${tasks.length?Math.round(completed/tasks.length*100):0}%"></span></div><small class="c4010-project-time">${h(projectTimeText(activeActivities(watchSessions,state),p.id))}</small></button>`;}).join(''):'<p class="muted-line">Noch keine aktiven Projekte.</p>'}</section></div>`);
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
  if(discoveryCity!=='all'&&e.city!==discoveryCity)return false;if(discoveryArea!=='all'){const area=eventArea(e);if(discoveryArea==='austria'?!['graz','vienna','austria'].includes(area):discoveryArea==='europe'?!['graz','vienna','austria','europe'].includes(area):area!==discoveryArea)return false;}if(!matchesEventCategories(e.category,discoveryCategories))return false;if(discoveryDisplayMode==='cinema')return true;
  const d=new Date(today+'T12:00:00Z'),wd=d.getUTCDay();if(discoveryRange==='today')return discoveryDisplayDay412(e,today)===today;
  if(discoveryRange==='week'){d.setUTCDate(d.getUTCDate()+7);return e.date<=d.toISOString().slice(0,10);}
  if(discoveryRange==='weekend'){d.setUTCDate(d.getUTCDate()+(6-wd+7)%7);const sat=d.toISOString().slice(0,10);d.setUTCDate(d.getUTCDate()+1);return discoveryOverlaps412(e,sat,d.toISOString().slice(0,10));}
  if(discoveryRange==='calendar')return discoveryOverlaps412(e,mondayStr,sundayStr);
  return true;};
 const events=all.filter(filter),groups=new Map();for(const e of events){const displayDay=discoveryDisplayDay412(e,today);if(!groups.has(displayDay))groups.set(displayDay,[]);groups.get(displayDay).push(e);}
 const allCinema=cinemaOverview(all);
 const cinemaStored=(state?.discoveredEvents||[]).filter(isCinemaEvent).length;
 const catalogCinemaEvents=discoveryCinemaPeriod==='day'?cinemaForDay(events,discoveryCinemaDay):events.filter(e=>e.category==='Kino'||e.category==='Filmfestival');
 const films=groupCinemaScreenings(catalogCinemaEvents),selectedFilms=cinemaSearch(films,discoveryCinemaQuery);
 const allFilms=groupCinemaScreenings(all),missingSynopses=allFilms.filter(f=>!f.description).length,missingPosters=allFilms.filter(f=>!f.imageUrl||brokenPosterUrls.has(f.imageUrl)).length;
 const cinemaDateLabel=new Intl.DateTimeFormat('de-AT',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date(discoveryCinemaDay+'T12:00:00Z'));
 const cabaretEvents=events.filter(e=>e.category==='Kabarett');
 const cinemaWarning=cinemaCoverageWarning(cinemaOverview(events));
 const previewFilmCards=discoveryImportPreview?.kind!=='film-details'&&discoveryImportPreview ? groupCinemaScreenings([...(discoveryImportPreview.added||[]),...(discoveryImportPreview.refreshed||[])]) : [];
 const previewPosters=previewFilmCards.filter(f=>f.imageUrl).length,previewSynopses=previewFilmCards.filter(f=>f.description).length;
 const manualFilm=posterManualKey?allFilms.find(f=>f.key===posterManualKey):null;
 const posterReview=posterLookupResult?`<section class="discovery-poster-review" aria-live="polite">
  <div class="discovery-poster-review-head"><strong>Bildvorschläge prüfen · ${posterLookupResult.suggestions.length} ladbare Poster von ${posterLookupResult.checked} geprüften Filmen</strong><button type="button" class="text-link" data-action="discovery-poster-review-close">Schließen</button></div>
  <p>Externer Katalog: Cinemeta/Stremio · ${posterLookupResult.matched||0} passende Titel · ${posterLookupResult.unavailable?.length||0} nicht ladbare Bilder. Nur nach tatsächlich erfolgreicher Bildprüfung auswählen. Filmjahr, Motiv und Nutzungsrechte vor dem Übernehmen kontrollieren.</p>
  ${posterLookupResult.suggestions.length?`<div class="discovery-poster-suggestions">${posterLookupResult.suggestions.map(x=>`<label class="discovery-poster-suggestion"><input type="checkbox" data-discovery-poster-key="${h(x.key)}" ${posterLookupSelected.has(x.key)?'checked':''}/><img src="${h(x.imageUrl)}" data-poster-preview-key="${h(x.key)}" alt="Filmplakat für ${h(x.title)}" loading="eager" referrerpolicy="no-referrer"/><span><strong>${h(x.title)}</strong><small>Match: ${h(x.matchedTitle)} ${x.year?'('+h(x.year)+')':''}</small><a href="${h(x.sourceUrl)}" target="_blank" rel="noopener noreferrer">Quelle ↗</a></span></label>`).join('')}</div><button type="button" class="primary-btn" data-action="discovery-poster-apply" ${posterLookupSelected.size?'':'disabled'}>Ausgewählte Poster übernehmen (${posterLookupSelected.size})</button>`:'<p class="discovery-poster-alert">In diesem Durchgang war kein zuverlässig ladbares Poster dabei. Die vorhandenen Daten bleiben unverändert.</p>'}
  ${posterLookupResult.unavailable?.length?`<details class="discovery-poster-broken"><summary>${posterLookupResult.unavailable.length} Treffer mit defektem oder blockiertem Bildlink</summary><div>${posterLookupResult.unavailable.map(x=>`<div><span>${h(x.title)}</span><button type="button" class="text-link" data-action="discovery-poster-manual" data-id="${h(x.key)}">Anderen Posterlink eingeben ↗</button></div>`).join('')}</div><small>Der Katalog kann ein passendes Filmobjekt finden, obwohl das Poster nicht abrufbar ist. Ein erneuter Versuch oder eine offizielle Bildquelle kann helfen.</small></details>`:''}
  <div class="discovery-poster-review-foot"><small>${posterLookupResult.unmatched.length} Titel ohne eindeutigen Katalogtreffer${posterLookupResult.errors.length?' · '+posterLookupResult.errors.length+' Katalog-Abruffehler':''}.</small>${posterLookupResult.hasMore?`<button type="button" class="secondary-btn" data-action="discovery-poster-next" ${posterLookupBusy?'disabled':''}>Nächste Filme prüfen →</button>`:''}</div>
 </section>`:'';
 const posterManual=manualFilm?`<section class="discovery-poster-manual"><div class="discovery-poster-review-head"><strong>Poster ergänzen · ${h(manualFilm.title)}</strong><button type="button" class="text-link" data-action="discovery-poster-manual-close">Schließen</button></div><form id="discovery-poster-manual-form"><label>Direkter HTTPS-Link zum Filmposter<input type="url" name="posterUrl" required placeholder="https://…/poster.jpg" maxlength="500" value="${h(manualFilm.imageUrl||'')}"/></label><button type="submit" class="primary-btn">Bild testen & für diesen Film speichern</button></form><small>Nur echte, für die Anzeige zulässige Bild-URLs. Ein Link zur Film-Website allein genügt nicht. Die Kinos und Vorführungen bleiben bestehen.</small></section>`:'';
 const eventCard=e=>{const key=eventKey(e),[emoji,tone]=discoveryAppearance(e.category),status=preferences[key]||'open';const desc=e.description||`${e.category} im ${e.venue||e.city}. Genauere Informationen zum Programm stehen auf der Veranstalterseite.`;
 return `<article class="discovery-card discovery-${tone}"><div class="discovery-art" aria-hidden="true">${e.imageUrl?`<img src="${h(e.imageUrl)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer"/>`:""}<span class="discovery-art-fallback">${emoji}</span></div><div class="discovery-copy"><span class="discovery-type">${h(e.category)} · ${h(e.city)}${eventCountry(e)?` · ${h(eventCountry(e))}`:""}</span><h4>${h(e.title)}</h4><p>${h(desc)}</p>${discoveryOngoingLabel412(e,today)?`<small class="discovery-event-ongoing">${h(discoveryOngoingLabel412(e,today))}</small>`:''}<small>${h(e.venue)} · ${h(e.city)}${!discoveryOngoingLabel412(e,today)&&e.startTime?' · '+h(e.startTime):''} · Termin und Details vor Besuch prüfen</small><small class="discovery-import-timestamp">${e.lastImportedAt?'Zuletzt importiert: '+h(formatResearchDate(e.lastImportedAt)):'Importdatum: vor Version 0.5.77 unbekannt'}</small></div><div class="discovery-card-actions"><button type="button" class="secondary-btn ${status==='saved'?'is-chosen':''}" data-action="discovery-save" data-id="${h(key)}" aria-label="${status==='saved'?'Von Merkliste entfernen':'Zur Merkliste hinzufügen'}">${status==='saved'?'♥ Gemerkt':'♡ Merken'}</button><button type="button" class="text-link" data-action="discovery-hide" data-id="${h(key)}">${status==='hidden'?'Einblenden':'Ausblenden'}</button><a href="${h(e.sourceUrl)}" class="text-link" target="_blank" rel="noopener noreferrer">Details ↗</a></div></article>`;};
 const cinemaCard=(film)=>{
  const expanded=discoveryExpandedFilms.has(film.key),shown=expanded?film.screenings:film.screenings.slice(0,3),remaining=film.screenings.length-shown.length;
  const synopsis=film.description||'Noch keine verifizierte Inhaltsbeschreibung hinterlegt. Mit „Filmtexte & Poster recherchieren“ kannst du sie ergänzen.';
  const synopsisLink=film.synopsisSourceUrl?`<a class="discovery-film-source" href="${h(film.synopsisSourceUrl)}" target="_blank" rel="noopener noreferrer">Quelle zum Filminhalt ↗</a>`:'';
  const usablePoster=film.imageUrl&&!brokenPosterUrls.has(film.imageUrl);
  return `<article class="discovery-film-card cinema-${discoveryCinemaStyle}">
   <div class="discovery-film-poster" aria-label="${usablePoster?'Filmplakat':film.imageUrl?'Posterlink nicht ladbar':'Kein Filmposter importiert'}">${usablePoster?`<img src="${h(film.imageUrl)}" alt="Filmplakat: ${h(film.title)}" loading="lazy" decoding="async" referrerpolicy="no-referrer"/>`:'<span aria-hidden="true">🎬</span>'}</div>
   <div class="discovery-film-body"><div class="discovery-film-title"><h3>${h(film.title)}</h3><span>${film.screenings.length} ${film.screenings.length===1?'Vorführung':'Vorführungen'} · ${film.venues.length} ${film.venues.length===1?'Kino':'Kinos'}</span></div>
    <p class="discovery-film-synopsis ${film.description?'':'is-missing'}">${h(synopsis)}</p>${synopsisLink}
    ${!usablePoster?`<button type="button" class="text-link discovery-poster-add" data-action="discovery-poster-manual" data-id="${h(film.key)}">${film.imageUrl?'⚠ Posterlink defekt · ersetzen':'🖼 Posterlink ergänzen'}</button>`:''}
    <div class="discovery-film-screenings">${shown.map(e=>{
      const key=eventKey(e),status=preferences[key]||'open',when=new Intl.DateTimeFormat('de-AT',{weekday:'short',day:'2-digit',month:'2-digit'}).format(new Date(e.date+'T12:00:00Z'));
      return `<div class="discovery-film-screening"><time datetime="${h(e.date)}${e.startTime?'T'+h(e.startTime):''}">${h(when)}${e.startTime?' · '+h(e.startTime):' · Uhrzeit offen'}</time><span title="${h(e.venue)}">${h(e.venue||'Spielstätte offen')} · ${h(e.city)}</span><div class="discovery-film-actions"><button type="button" class="secondary-btn ${status==='saved'?'is-chosen':''}" data-action="discovery-save" data-id="${h(key)}" aria-label="${status==='saved'?'Vorführung aus Merkliste entfernen':'Diese Vorführung merken'}">${status==='saved'?'♥ Gemerkt':'♡ Merken'}</button><a href="${h(e.sourceUrl)}" target="_blank" rel="noopener noreferrer" class="text-link" aria-label="Spielzeit und Details zu ${h(film.title)}">Details ↗</a></div></div>`;
    }).join('')}</div>${remaining>0?`<button class="text-link discovery-film-expand" type="button" data-action="discovery-film-toggle" data-id="${h(film.key)}">Weitere ${remaining} Spielzeiten anzeigen ↓</button>`:film.screenings.length>3?`<button class="text-link discovery-film-expand" type="button" data-action="discovery-film-toggle" data-id="${h(film.key)}">Weniger Spielzeiten ↑</button>`:''}
    <small class="discovery-import-timestamp">${film.lastImportedAt?'Letzter Spielplan-Import: '+h(formatResearchDate(film.lastImportedAt)):'Spielplan-Importdatum unbekannt'} · Termine beim Kino prüfen</small>
   </div></article>`;
 };
 const ranges=[['today','Heute'],['week','7 Tage'],['weekend','Wochenende'],['calendar','Kalenderwoche'],['all','Alle Termine'],['saved',`♥ Merkliste (${fav})`],['hidden',`Ausgeblendet (${hide})`]];
 const cities=[...new Set(all.map(x=>x.city))].sort();
 return `<section class="work-card discovery-panel"><div class="work-heading"><span>${ico('calendar',18)} Entdecken · Freizeit in deiner Nähe</span><span class="quiet-tag">${all.length} Termine · ${allCinema.titles} Filmtitel · ${fav} gemerkt</span></div>
 <p class="muted-line">Aus importierten Recherchen – keine Live-Verfügbarkeit. Die Programmbeschreibung wird nur angezeigt, wenn sie im Import enthalten ist.</p>
 ${discoveryDisplayMode==='cinema'?'':`<div class="discovery-tabs">${ranges.map(([value,title])=>`<button class="discovery-tab ${discoveryRange===value?'selected':''}" data-action="discovery-range" data-id="${value}" aria-pressed="${discoveryRange===value}">${h(title)}</button>`).join('')}</div>`}
 ${discoveryRange==='calendar'?`<div class="discovery-week-pager"><button type="button" class="secondary-btn" data-action="discovery-week-prev" ${discoveryWeekOffset===0?'disabled':''}>← Zurück</button><strong>${h(fmtWeek(monday))} – ${h(fmtWeek(sunday))} · KW ${isoWeekNumber(monday)}</strong><button type="button" class="secondary-btn" data-action="discovery-week-next">Weiter →</button><button type="button" class="text-link" data-action="discovery-week-today">Diese Woche</button></div>`:''}
 <div class="discovery-research-panel" id="discovery-research-panel"><div class="discovery-research-head"><strong>🔎 Recherche für Compass</strong><small>Prompt kopieren → in ChatGPT recherchieren → JSON prüfen und importieren</small></div><div class="discovery-research-grid">${DISCOVERY_RESEARCH_BUTTONS.map(btn=>{const info=state?.discoveryResearchHistory?.[btn.id];const last=info?.at||(state?.discoveredEvents||[]).filter(e=>e.researchGroup===btn.id&&e.lastImportedAt).reduce((latest,e)=>e.lastImportedAt>latest?e.lastImportedAt:latest,'');const freshness=researchRefreshStates(state,today).find(x=>x.id===btn.id);return `<button type="button" class="discovery-research-button ${discoverySelectedResearch===btn.id?'is-selected':''} ${freshness?.status==='due'?'research-is-due':''}" data-action="discovery-prompt" data-id="${btn.id}"><span>${btn.icon} ${h(btn.label)}</span><small>${h(btn.scope)} · ${last?'Letzter Import '+h(formatResearchDate(last)):'Noch kein Import'}${freshness?.status==='due'?' · Recherche fällig':freshness?.status==='soon'?' · Bald aktualisieren':''}</small></button>`;}).join('')}</div></div>
 <div class="discovery-view-options" role="group" aria-label="Darstellung wählen"><button type="button" class="secondary-btn ${discoveryDisplayMode==='cinema'?'is-chosen':''}" data-action="discovery-view-cinema" aria-pressed="${discoveryDisplayMode==='cinema'}">🎬 Kinoprogramm · ${allCinema.titles} Filme</button><button type="button" class="secondary-btn ${discoveryDisplayMode==='events'?'is-chosen':''}" data-action="discovery-view-events" aria-pressed="${discoveryDisplayMode==='events'}">☷ Termine nach Datum</button><small>${allCinema.screenings} importierte Filmvorführungen · ${allCinema.venues} Kinos</small></div>
 <div class="discovery-filter-groups"><strong>Interessen filtern:</strong><button type="button" class="discovery-filter-chip" data-action="discovery-cat-all" aria-pressed="${discoveryCategories===null}">Alle</button>${DISCOVERY_FILTER_GROUPS.map(group=>{const active=discoveryCategories!==null&&discoveryCategories.length===group.categories.length&&group.categories.every(c=>discoveryCategories.includes(c));return `<button type="button" class="discovery-filter-chip" data-action="discovery-filter-group" data-id="${group.id}" aria-pressed="${active}">${group.icon} ${h(group.label)}</button>`;}).join('')}</div>
 <div class="discovery-filters"><label>Region<select data-discovery-filter="area"><option value="all" ${discoveryArea==='all'?'selected':''}>Überall</option><option value="graz" ${discoveryArea==='graz'?'selected':''}>Graz & Umgebung</option><option value="vienna" ${discoveryArea==='vienna'?'selected':''}>Wien</option><option value="austria" ${discoveryArea==='austria'?'selected':''}>Österreich</option><option value="europe" ${discoveryArea==='europe'?'selected':''}>Europa</option></select></label><label>Stadt<select data-discovery-filter="city"><option value="all">Alle Städte</option>${cities.map(c=>`<option value="${h(c)}" ${discoveryCity===c?'selected':''}>${h(c)}</option>`).join('')}</select></label><button class="secondary-btn" type="button" data-action="discovery-import-toggle">${discoveryImportOpen?'Import schließen':'＋ Veranstaltungen importieren'}</button></div>
 ${discoveryImportOpen?`<div class="discovery-import-drawer"><div class="discovery-actions"><button type="button" class="secondary-btn" data-action="discovery-clear-cinema" ${!cinemaStored?'disabled':''}>🎬 Nur Kinoprogramm löschen (${cinemaStored})</button><button type="button" class="secondary-btn" data-action="discovery-clear">⚠ Alle Veranstaltungen löschen</button></div>${discoveryPromptText?`<details class="discovery-prompt-preview" open><summary>Rechercheprompt ${h(discoveryPromptText.startsWith('COMPASS · FILMTEXTE')?'Filmtexte & Poster':researchButton(discoverySelectedResearch)?.label||'')} · Kopie für ChatGPT</summary><textarea readonly rows="7">${h(discoveryPromptText)}</textarea></details>`:''}<form id="discovery-import-form" class="compact-stack"><label>Veranstaltungs-JSON oder Filmtexte-JSON<textarea name="events" rows="7" maxlength="4000000" placeholder='{"events":[{"title":"...","date":"2026-11-01","city":"Graz","venue":"...","category":"Theater","description":"...","sourceUrl":"https://...","imageUrl":"https://...","country":"Österreich"}]}' required>${h(discoveryImportDraft)}</textarea></label><button class="primary-btn" type="submit">Import prüfen</button></form>${discoveryImportError?`<div id="discovery-import-feedback" class="discovery-import-error" role="alert"><strong>Import konnte nicht geprüft werden</strong><p>${h(discoveryImportError)}</p><small>Dein eingefügtes JSON bleibt erhalten. Bitte den genannten Eintrag korrigieren und erneut prüfen.</small></div>`:''}${discoveryImportPreview?discoveryImportPreview.kind==='film-details'?`<div class="discovery-import-preview"><strong>${discoveryImportPreview.entries.length} zuordenbare Filme · ${discoveryImportPreview.affected} Vorführungen aktualisierbar</strong><p><strong>${discoveryImportPreview.entries.filter(e=>e.imageUrl).length} mit Posterlink · ${discoveryImportPreview.entries.filter(e=>e.description).length} mit Filmtext</strong>. ${discoveryImportPreview.unmatched?`${discoveryImportPreview.unmatched} Titel passen nicht zu vorhandenen Filmen. `:''}${discoveryImportPreview.duplicates?`${discoveryImportPreview.duplicates} doppelte Filmtitel ausgelassen. `:''}Keine Vorführung wird gelöscht.</p>${!discoveryImportPreview.entries.some(e=>e.imageUrl)?'<p class="discovery-cinema-warning">Keine Poster-URL im JSON! Die Kurztexte werden ergänzt, aber alle Plakate bleiben unverändert. Alternativ „Poster automatisch suchen“ verwenden.</p>':''}<button class="primary-btn" type="button" data-action="discovery-import-confirm" ${!discoveryImportPreview.entries.length?'disabled':''}>${discoveryImportPreview.entries.length} Filmtexte übernehmen</button><button class="secondary-btn" type="button" data-action="discovery-import-cancel">Abbrechen</button></div>`:`<div class="discovery-import-preview"><strong>${discoveryImportPreview.total} erkannt · ${discoveryImportPreview.added.length} neu · ${discoveryImportPreview.duplicates} bekannt (werden aktualisiert)</strong>${cinemaOverview([...(discoveryImportPreview.added||[]),...(discoveryImportPreview.refreshed||[])]).screenings?`<p><b>${cinemaOverview([...(discoveryImportPreview.added||[]),...(discoveryImportPreview.refreshed||[])]).titles} verschiedene Filmtitel</b> · ${cinemaOverview([...(discoveryImportPreview.added||[]),...(discoveryImportPreview.refreshed||[])]).screenings} Vorführungen · ${cinemaOverview([...(discoveryImportPreview.added||[]),...(discoveryImportPreview.refreshed||[])]).venues} Spielstätten</p>${cinemaCoverageWarning(cinemaOverview([...(discoveryImportPreview.added||[]),...(discoveryImportPreview.refreshed||[])]))?`<p class="discovery-cinema-warning">${h(cinemaCoverageWarning(cinemaOverview([...(discoveryImportPreview.added||[]),...(discoveryImportPreview.refreshed||[])])))}</p>`:''}`:''}${previewFilmCards.length?`<p><b>Film-Metadaten prüfen:</b> ${previewPosters} von ${previewFilmCards.length} Filmtiteln mit Posterlink · ${previewSynopses} mit Inhaltsbeschreibung.</p>${previewPosters===0?'<p class="discovery-cinema-warning">Achtung: Kein Film-Posterlink im importierten JSON! Beim Übernehmen würden weiterhin nur 🎬-Platzhalter angezeigt. Bitte Recherche zuerst mit echten Bild-URLs ergänzen.</p>':''}`:''}<p>Neue Veranstaltungen werden erst nach deiner Bestätigung in den Tresor übernommen.</p><button class="primary-btn" type="button" data-action="discovery-import-confirm">${discoveryImportPreview.added.length} übernehmen · ${discoveryImportPreview.refreshed?.length||0} aktualisieren</button><button class="secondary-btn" type="button" data-action="discovery-import-cancel">Abbrechen</button></div>`:''}<small>JSON mit Markdown-Codeblock und typischen KI-URL-Fehlern wird bereinigt. Bei Fehlern zeigen wir den Eintrag.</small></div>`:''}
 ${Object.keys(state?.eventConflicts||{}).length?`<div class="discovery-conflicts"><strong>${Object.keys(state.eventConflicts).length} Event-Konflikte zwischen Geräten</strong><p>Wähle je Veranstaltung die Cloud-Version oder deine lokale Bearbeitung.</p>${Object.entries(state.eventConflicts).slice(0,12).map(([k,c])=>`<div class="discovery-conflict-row"><span>${h(c.remote?.event?.title||k.split("|")[0])}</span><button class="secondary-btn" data-action="discovery-conflict-cloud" data-id="${h(k)}">Cloud</button><button class="secondary-btn" data-action="discovery-conflict-local" data-id="${h(k)}">Lokal</button></div>`).join("")}</div>`:""}
  ${discoveryDisplayMode==='cinema'?`<section class="discovery-cinema-catalog"><div class="discovery-cinema-summary"><div><strong>${selectedFilms.length} Filme · ${catalogCinemaEvents.length} Vorführungen</strong><small>${missingSynopses} Filme ohne konkrete Inhaltsbeschreibung · ${missingPosters} ohne importiertes Poster. Bei fehlenden Angaben keine erfundenen Zusammenfassungen.</small><button type="button" class="secondary-btn discovery-film-enrich" data-action="discovery-film-enrich">🔎 Filmtexte & Poster recherchieren</button><button type="button" class="secondary-btn discovery-film-enrich" data-action="discovery-poster-all" ${posterLookupBusy||!missingPosters?'disabled':''}>${posterLookupBusy?'Poster-Suche läuft …':'🖼 Alle fehlenden Poster suchen'}</button><button type="button" class="text-link" data-action="discovery-poster-lookup" ${posterLookupBusy||!missingPosters?'disabled':''}>Nur 12 prüfen</button>${posterLookupBusy?`<small id="discovery-poster-progress" role="status" aria-live="polite">${h(posterLookupProgress||'Poster-Suche wird gestartet …')}</small>`:''}<button type="button" class="secondary-btn discovery-cinema-clear" data-action="discovery-clear-cinema" ${!cinemaStored?'disabled':''}>🎬 Nur Kino löschen (${cinemaStored})</button></div><label class="discovery-film-search-label">Film oder Kino suchen<input id="discovery-film-search" type="search" value="${h(discoveryCinemaQuery)}" placeholder="Filmtitel, Kino oder Ort" autocomplete="off"/></label></div>
 ${posterReview}${posterManual}<nav class="discovery-cinema-pager" aria-label="Kinoprogramm nach Tagen"><div class="discovery-cinema-datebar"><button type="button" class="secondary-btn" data-action="discovery-cinema-prev" ${discoveryCinemaPeriod!=='day'||discoveryCinemaDay<=today?'disabled':''} aria-label="Vorheriger Tag">←</button><strong>${discoveryCinemaPeriod==='day'?h(cinemaDateLabel):'Alle kommenden Kinotermine'}</strong><button type="button" class="secondary-btn" data-action="discovery-cinema-next" ${discoveryCinemaPeriod!=='day'?'disabled':''} aria-label="Nächster Tag">→</button></div><div class="discovery-cinema-controls"><button type="button" class="secondary-btn" data-action="discovery-cinema-today">Heute</button><button type="button" class="secondary-btn ${discoveryCinemaPeriod==='day'?'is-chosen':''}" data-action="discovery-cinema-day">Tag</button><button type="button" class="secondary-btn ${discoveryCinemaPeriod==='all'?'is-chosen':''}" data-action="discovery-cinema-all">Alle Tage</button><button type="button" class="secondary-btn ${discoveryCinemaStyle==='poster'?'is-chosen':''}" data-action="discovery-cinema-poster">▦ Poster</button><button type="button" class="secondary-btn ${discoveryCinemaStyle==='list'?'is-chosen':''}" data-action="discovery-cinema-list">☷ Liste</button></div></nav>
 ${cinemaWarning?`<p class="discovery-cinema-warning">${h(cinemaWarning)}</p>`:''}<div class="discovery-film-grid cinema-style-${discoveryCinemaStyle}">${selectedFilms.slice(0,discoveryFilmLimit).map(cinemaCard).join('')||'<p class="discovery-empty">Für diesen Tag ist noch kein Film importiert. Blättere weiter oder wechsle zu „Alle Tage“.</p>'}</div>${selectedFilms.length>discoveryFilmLimit?`<button type="button" class="secondary-btn discovery-cinema-more" data-action="discovery-cinema-more">Weitere ${Math.min(36,selectedFilms.length-discoveryFilmLimit)} Filme anzeigen (${selectedFilms.length-discoveryFilmLimit} verbleiben)</button>`:''}${cabaretEvents.filter(e=>discoveryCinemaPeriod==='all'||e.date===discoveryCinemaDay).length?`<div class="discovery-cabaret-block"><h3>🎙️ Kabarett & Stand-up</h3>${cabaretEvents.filter(e=>discoveryCinemaPeriod==='all'||e.date===discoveryCinemaDay).map(eventCard).join('')}</div>`:''}</section>`:`<div class="discovery-day-groups">${[...groups].map(([date,items])=>{const shown=discoveryExpandedDays.has(date)?items:items.slice(0,8);return `<section class="discovery-day"><div class="discovery-day-head"><h3>${h(new Intl.DateTimeFormat('de-AT',{weekday:'long',day:'numeric',month:'long'}).format(new Date(date+'T12:00:00Z')))}</h3><span>${items.length} ${items.length===1?'Termin':'Termine'}</span></div>${shown.map(eventCard).join('')}${items.length>8?`<button type="button" class="text-link discovery-more" data-action="discovery-more" data-id="${date}">${discoveryExpandedDays.has(date)?'Weniger anzeigen':`Weitere ${items.length-8} anzeigen`}</button>`:''}</section>`;}).join('')||'<p class="discovery-empty">Hier ist gerade nichts vorgemerkt. Ändere den Zeitraum oder die Filter, um andere Vorschläge zu sehen.</p>'}</div>`}
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
 <div class="recovery-view"><section class="work-card"><div class="work-heading"><span>${ico('calendar',19)} Geplante Erholung · 30 Tage</span><span class="quiet-tag">${cal.length} Termine</span></div>${cal.length?cal.map(e=>`<button type="button" class="recovery-row" data-action="agenda-open" data-id="${h(e.id)}"><span>${h(eventAppearance(e).emoji)}</span><strong>${h(eventAppearance(e).displayTitle)}</strong><small>${h(calendarDate(e))}</small></button>`).join(''):`<p class="muted-line">${calendarReadable36()?'Keine erkannten Erholungstermine in den nächsten 30 Tagen.':'Keine im Tresor gespeicherten Erholungstermine. Für aktuelle Termine Google Calendar verbinden.'}</p>`}${calendarReadable36()?calendarFilterToggle()+cachedCalendarControls36():calendarConnectUI()}</section>
 <section class="work-card"><div class="work-heading"><span>${ico('activity',19)} Erlebte Erholung</span><span class="quiet-tag">${acts.length} Aktivitäten</span></div>${acts.map(a=>`<button type="button" class="recovery-row" data-action="activity-open" data-id="${h(a.id)}"><span>🌿</span><strong>${h(a.title)}</strong><small>${h(a.startedAt.slice(0,10))} · ${a.durationMinutes} min</small></button>`).join('')||'<p class="muted-line">Du kannst in Aktivitäten eine Garmin-Session oder eine manuelle Aktivität als Erholung kennzeichnen.</p>'}<button type="button" class="text-link" data-tab="activity">Aktivitäten bearbeiten ${ico('arrow',14)}</button></section></div>`);
}




function activityScreen(){
 const all=projectActivities(watchSessions,state),rows=all.filter(a=>a.deleted===activityTrash);
 const chosen=rows.find(a=>a.id===activitySelectedId)||rows[0]||null;
 const projectOpts=`<option value="">Ohne Projekt</option>${Object.values(state?.projects||{}).filter(p=>p.kind!=='folder').map(p=>`<option value="${h(p.id)}" ${p.id===chosen?.projectId?'selected':''}>${h(p.title)}</option>`).join('')}`;
 const choices=ACTIVITY_CATEGORIES.map(c=>`<option value="${h(c)}" ${chosen?.category===c?'selected':''}>${h(c)}</option>`).join('');
 const typeChoices=focusActivityTypeChoices.map(c=>`<option value="${h(c.type)}" ${chosen?.activityType===c.type?'selected':''}>${h(c.label)}</option>`).join('');
 const pendingExams=rows.filter(a=>a.activityTypeReview).sort((a,b)=>a.startedAt.localeCompare(b.startedAt));
 const pendingQueue=pendingExams.length?`<nav class="c4011-exam-queue work-card" aria-label="Prüfungs-Sessions zur Zuordnung"><strong>${pendingExams.length} Prüfungs-Sessions zuordnen</strong><p>Wähle eine Session, anschließend im Inspector die Tätigkeit „Prüfungskorrektur“ oder „Prüfungserstellung“ und speichere.</p><div class="c4011-exam-buttons">${pendingExams.map(a=>`<button type="button" class="secondary-btn ${chosen?.id===a.id?'is-chosen':''}" data-action="activity-open" data-id="${h(a.id)}">${h(a.startedAt.slice(0,10))} · ${h(a.startedAt.slice(11,16))} · ${a.durationMinutes} Min.</button>`).join('')}</div></nav>`:'';
 return chrome(`<div class="compass593-external-insights" aria-label="Gesundheit und Körper">${insights750Subtabs('activity',insightTab)}</div>${activityReviewFlow?'':`<div class="activity-summary-insights">${sportsInsightsView(state?.healthImports?.garminSessions||[],activeActivities(watchSessions,state),sportsPeriodWindow(sportsMode,sportsAnchor,localDate()),{mode:sportsMode,anchor:sportsAnchor,metric:sportsMetric,selected:sportsSelected,label:sportsPeriodWindow(sportsMode,sportsAnchor,localDate()).label,today:localDate()})}</div>`}${pendingQueue}<div class="activity-layout"><section class="work-card"><div class="work-heading"><span>${ico('activity',18)} Aktivitätsverwaltung</span><div class="activity-actions"><button type="button" class="secondary-btn" data-action="activity-new">+ Manuell</button><button type="button" class="secondary-btn" data-action="watch-refresh" ${!authToken?'disabled':''}>Garmin aktualisieren</button></div></div>
 <p class="muted-line">Korrigieren, verschieben, Projekt zuordnen, wiederherstellen oder endgültig entfernen. Messwerte der Garmin bleiben bei redaktionellen Änderungen unverändert.</p><div class="activity-tabs"><button type="button" class="secondary-btn ${!activityTrash?'is-chosen':''}" data-action="activity-tab" data-id="active">Aktiv (${all.filter(a=>!a.deleted).length})</button><button type="button" class="secondary-btn ${activityTrash?'is-chosen':''}" data-action="activity-tab" data-id="trash">Papierkorb (${all.filter(a=>a.deleted).length})</button></div>
 <div class="activity-list">${rows.map(a=>`<button type="button" data-action="activity-open" data-id="${h(a.id)}" class="activity-row ${chosen?.id===a.id?'selected':''}"><strong>${h(a.title)} <small>· ${h(a.source)}</small></strong><span>${h(a.startedAt.replace('T',' · '))} · ${a.durationMinutes} min · ${h(projectLabel(a.projectId))}</span></button>`).join('')||'<p class="muted-line">Keine Aktivitäten in dieser Ansicht.</p>'}</div></section>
 <section class="work-card"><div class="work-heading"><span>${ico('pencil',18)} Session-Inspector</span></div>${chosen?`<form id="activity-edit-form" data-id="${h(chosen.id)}" class="compact-stack"><label>Titel<input name="title" required maxlength="100" value="${h(chosen.title)}"/></label><label>Lebensbereich<select name="category">${choices}</select></label><label>Tätigkeitsart<select name="activityType">${typeChoices}</select></label>${chosen.activityTypeReview?'<small class="c4010-review-warning">Historische Prüfungssession: Bitte Korrektur oder Prüfungsmodus bestätigen.</small>':''}<label>Datum und Uhrzeit<input name="startedAt" type="datetime-local" required value="${h(chosen.startedAt)}"/></label><label>Dauer in Minuten<input name="durationMinutes" type="number" required min="1" max="1440" value="${chosen.durationMinutes}"/></label><label>Projekt<select name="projectId">${projectOpts}</select></label><label>Strecke (km, optional)<input name="distanceKm" type="number" min="0" max="999.99" step="0.01" value="${chosen.distanceKm??''}"/></label><label>Notiz<textarea name="note" maxlength="1000" rows="3">${h(chosen.note||'')}</textarea></label><p class="muted-line">Quelle: ${h(chosen.source)}${chosen.source==='Garmin'?' · Messwerte bleiben erhalten':''}</p><div class="activity-actions"><button type="submit" class="primary-btn">Änderungen speichern</button><button type="button" class="secondary-btn" data-action="${chosen.deleted?'activity-restore':'activity-trash'}" data-id="${h(chosen.id)}">${chosen.deleted?'Wiederherstellen':'In Papierkorb'}</button>${chosen.deleted?`<button type="button" class="danger-btn" data-action="activity-purge" data-id="${h(chosen.id)}">Endgültig löschen</button>`:''}</div></form>`:'<p class="muted-line">Wähle eine Session oder lege eine manuelle Aktivität an.</p>'}
 <div class="watch-pair-block"><h3>Garmin fēnix 7S</h3><p class="muted-line">Kopplung und Geräteverwaltung bleiben getrennt von der Session-Bearbeitung.</p>${watchPairCode?`<strong class="watch-code">${h(watchPairCode)}</strong>`:''}<button type="button" class="secondary-btn" data-action="watch-pair" ${!authToken?'disabled':''}>Kopplungscode erstellen</button>${watchDevices.map(d=>`<div class="watch-session"><span>${h(d.label)}</span><button type="button" class="secondary-btn" data-action="watch-revoke" data-id="${h(d.deviceHash)}">Trennen</button></div>`).join('')}${watchError?`<p class="watch-error">${h(watchError)}</p>`:''}</div></section></div>`);
}
async function reloadWidgetDevices(){
 if(!authToken)return;
 try{const data=await request(config.apiUrl,authToken,'/api/widget/devices');widgetDevices=data.devices||[];widgetConnectError='';if(tab==='insights'&&insightTab==='sources')render();}
 catch(ex){widgetConnectError='Widget-Geräte konnten nicht geladen werden: '+ex.message;}
}
async function reloadHealth(){
 if(!authToken||!config.apiUrl)return;
 try{const [values,devices]=await Promise.all([request(config.apiUrl,authToken,'/api/health/days?days=90'),request(config.apiUrl,authToken,'/api/health/devices')]);healthDays=values.days||[];healthDevices=devices.devices||[];healthError='';healthLastUpdated=Date.now();if(['insights','progress','recovery'].includes(tab))render();}
 catch(ex){healthError=ex.status===404?'Health-Worker 0.5.1 noch nicht veröffentlicht.':ex.message;render();}
}
let watchHistoryLoading=null;
let watchHistoryComplete=false;
async function reloadWatchSessions(){
 if(!authToken)return;
 const deepHistory=['activity','progress','overview'].includes(tab)||(tab==='insights'&&['focus','timejournal'].includes(insightTab));
 if(watchHistoryLoading)return deepHistory&&!watchHistoryComplete
   ?watchHistoryLoading.then(()=>watchHistoryComplete?undefined:reloadWatchSessions())
   :watchHistoryLoading;
 const token=authToken;
 watchHistoryLoading=(async()=>{
  try{
   const [first,dev]=await Promise.all([request(config.apiUrl,token,'/api/watch/sessions?limit='+(deepHistory?200:50)),request(config.apiUrl,token,'/api/watch/devices')]);
   let all=first.sessions||[],cursor=first.nextCursor||null,pages=1;
   if(!deepHistory)cursor=null;
   const cursors=new Set();
   while(cursor&&pages<100&&token===authToken){
    if(cursors.has(cursor))throw new Error('Garmin-Historie: Cursor wiederholt');
    cursors.add(cursor);
    const page=await request(config.apiUrl,token,'/api/watch/sessions?limit=200&cursor='+encodeURIComponent(cursor));
    all.push(...page.sessions||[]);cursor=page.nextCursor||null;pages++;
   }
   if(cursor)throw new Error('Garmin-Historie über 20.000 Sessions: bitte Bericht pagination prüfen');
   if(token!==authToken)return;
   watchSessions=[...new Map(all.map(s=>[s.id,s])).values()];watchDevices=dev.devices||[];watchHistoryComplete=deepHistory;watchError='';
   if(['activity','overview','insights','recovery','progress'].includes(tab))render();
  }catch(ex){watchError='Garmin-Historie unvollständig: '+ex.message;render();}
 })();
 try{return await watchHistoryLoading;}finally{watchHistoryLoading=null;}
}
function rememberPeopleScroll(){if(tab!=='people'||!state)return null;const selectors=['.content','.people-grid','.people-list','.rel567-overlay','.rel567-map-wrap','.people-contact-log'];return {windowY:window.scrollY||0,items:selectors.map(sel=>[sel,app.querySelector(sel)?.scrollTop||0]),selected:selectedPersonId};}
function restorePeopleScroll(position){if(!position||tab!=='people'||position.selected!==selectedPersonId||typeof requestAnimationFrame!=='function')return;requestAnimationFrame(()=>{for(const [sel,value] of position.items){const el=app.querySelector(sel);if(el)el.scrollTop=value;}window.scrollTo?.({top:position.windowY,behavior:'instant'});});}
function refreshNutritionTimingPanel(){
 const section=app.querySelector('.ni725-insights');
 if(!section||!state){render();return;}
 section.outerHTML=nutritionTimingView(state,{mode:nutritionTimingMode725,anchor:nutritionTimingAnchor725,selectedId:nutritionTimingSelected725});
 const next=app.querySelector('.ni725-insights');
 next?.querySelectorAll('[data-action]').forEach(el=>{el.onclick=()=>runAction(el.dataset.action,el.dataset.id);});
 next?.querySelectorAll('.ni725-dot').forEach(dot=>{dot.onkeydown=ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();runAction('ni725-event',dot.dataset.id);}};});
}
function refreshNutritionTrendsPanel(){
 const section=app.querySelector('.ni726-root');
 if(!section||!state){render();return;}
 section.outerHTML=nutritionTrendsView(state,{mode:nutritionTrendsMode726,anchor:nutritionTrendsAnchor726,metric:nutritionTrendsMetric726});
 app.querySelector('.ni726-root')?.querySelectorAll('[data-action]').forEach(el=>{el.onclick=()=>runAction(el.dataset.action,el.dataset.id);});
}
function refreshNutritionConnectionsPanel(){
 const host=app.querySelector('.ni727-root');
 if(!host||!state){render();return;}
 host.outerHTML=nutritionConnectionsView(state,{input:nutritionConnInput727,outcome:nutritionConnOutcome727,range:nutritionConnRange727,today:localDate(),healthDays});
 const next=app.querySelector('.ni727-root');
 next?.querySelectorAll('button[data-action]').forEach(el=>{el.onclick=()=>runAction(el.dataset.action,el.dataset.id);});
 const selected=next?.querySelector('#ni727-outcome');
 if(selected)selected.onchange=()=>{nutritionConnOutcome727=selected.value;refreshNutritionConnectionsPanel();};
}
function refreshStrength728(){
 const old=app.querySelector('.str728-root');
 if(!old||!state){render();return;}
 old.outerHTML=strengthInsightsView(state,{range:strengthRange728,side:strengthSide728,today:localDate(),editingId:strengthEditId732,activity:strengthActivity737});
 void mountPremiumAnatomy(app).catch(err=>console.warn('Compass Premium-Anatomie:',err));
 app.querySelector('.str728-root')?.querySelectorAll('[data-action]').forEach(el=>{el.onclick=()=>runAction(el.dataset.action,el.dataset.id);});
 bindStrengthEditor732();
}
function refreshNutritionFatPanel731(){
 const node=app.querySelector('.ni731-root');
 if(!node||!state){render();return;}
 node.outerHTML=nutritionFatView(state,{days:nutritionFatDays731,metric:nutritionFatMetric731,today:localDate()});
 app.querySelector('.ni731-root')?.querySelectorAll('[data-action]').forEach(el=>{el.onclick=()=>runAction(el.dataset.action,el.dataset.id);});
}
function refreshPhyto736(){
 const el=app.querySelector('.phyto736-root');if(!el||!state){render();return;}
 el.outerHTML=nutritionPhytoView(state,{period:phytoPeriod736,today:localDate()});
 app.querySelector('.phyto736-root')?.querySelectorAll('[data-action]').forEach(x=>{x.onclick=()=>runAction(x.dataset.action,x.dataset.id);});
}
function refreshAntiAging734(){
 const host=app.querySelector('.aa734-root');if(!host||!state){render();return;}
 host.outerHTML=antiAgingEightView(state,{day:antiAgingDay734,today:localDate()});
 app.querySelector('.aa734-root')?.querySelectorAll('[data-action]').forEach(el=>{el.onclick=()=>runAction(el.dataset.action,el.dataset.id);});
}
function refreshDailyDozen733(){
 const section=app.querySelector('.dd733-root');if(!section||!state){render();return;}
 section.outerHTML=dailyDozenView(state,{day:dailyDozenDay733,today:localDate()});
 app.querySelector('.dd733-root')?.querySelectorAll('[data-action]').forEach(el=>{el.onclick=()=>runAction(el.dataset.action,el.dataset.id);});
}
let compass59DreamFocusPending=false;
function compass59FocusDreamField(){
 const field=app.querySelector('#dream743-form textarea[name="body"]');
 if(!field)return false;
 compass59DreamFocusPending=false;
 try{field.focus({preventScroll:true});}catch{field.focus();}
 field.scrollIntoView?.({block:'center'});
 return true;
}
function render(){
 refreshCurrentDayIfNeeded();
 if(tab!=='shopping')compass57ShoppingTab='list';
 if(state&&compass55Mode==='focus'&&((tab==='insights'&&insightTab!=='dreamworld')||['finance','activity','recovery','progress'].includes(tab))){tab='today';todayInspectorOpen=false;calmNavGroup='';}
 // Mobile modal must remain mounted while open: background sync/health reloads must
 // not reset scroll, keyboard, touch focus or rebuild hundreds of unrelated nodes.
 // Opening/closing remains explicit: nutritionQuickOpen false immediately enables render.
 if(nutritionQuickOpen&&state&&app.querySelector('.pj92-food-panel'))return;
 const renderMeasurement=performanceTrace.start();
 if(editDraftGuard.shouldDefer(editRenderSignature()===lastEditRenderSignature))return;
 const editingContact=document.activeElement?.closest?.('#person-contact-form');
 if(tab==='people'&&!contactSaving&&editingContact&&['INPUT','SELECT','TEXTAREA'].includes(document.activeElement?.tagName))return;
 // Background health/sync updates must not recreate the mobile textarea mid-dictation.
 if((tab==='insights'&&insightTab==='habits'&&document.activeElement?.id==='mm571-journal-text')||(morningPlayerOpen&&document.activeElement?.id==='mm570-journal'))return;
 const editDraftFocus=editDraftGuard.beforeRender();
 const scrollBeforeRender=rememberPeopleScroll();
 const feelingFocused=feelingOverlayOpen&&typeof document!=='undefined'&&document.activeElement?.closest?.('#fw65-dialog')?{id:document.activeElement.id||'',name:document.activeElement.dataset?.id||'',intensity:document.activeElement.dataset?.feelingIntensity||'',start:document.activeElement.selectionStart,end:document.activeElement.selectionEnd}:null;
 const insightScrollBefore=tab==='insights'&&insightTab==='feelings'?{page:window.scrollY||0,log:app.querySelector('.fw681-full-log')?.scrollTop||0,content:app.querySelector('.content')?.scrollTop||0}:null;
 const feelingScrollBefore=feelingOverlayOpen?app.querySelector('#fw65-dialog')?.scrollTop||0:0;
 const captureFocus=snapshotCaptureDraft();
 morningSaveNoteFromScreen();
 if(!state){core259FamilyCache.clear();core259FamilyKey=null;app.innerHTML=vaultScreen()+(feelingOverlayOpen?feelingOverlay({...feelingDraft,locked:true},[],{inputMode:feelingInputMode,captureReady:sealedCaptureAvailable}):'')+(nutritionQuickOpen?nutritionQuickOverlay():'')+(worktimeQuickOpen?worktimeQuickOverlay():'')+(habitQuickOpen?habitQuickOverlay():'')+(morningPlayerOpen?morningRenderOverlay():'');bind();restoreCaptureDraft(captureFocus);editDraftGuard.afterRender(editDraftFocus);lastEditRenderSignature=editRenderSignature();return;}
 try{sessionStorage.setItem('compass.calm.lastView',JSON.stringify({tab,insight:insightTab,finance:financePane}));}catch{}
 const screenMeasurement=performanceTrace.start();
 let html;
 try{html=tab==='activity'?activityScreen():tab==='people'?peopleScreen():tab==='progress'?progressScreen():tab==='finance'?financeScreen():tab==='insights'?insightsScreen():tab==='recovery'?recoveryScreen():tab==='system'?systemScreen():tab==='inbox'?inboxScreen():tab==='overview'?homeScreen():tab==='forecast'?forecastScreen():tab==='radar'?radarScreen():tab==='someday'?somedayScreen():tab==='review'?reviewScreen():tab==='shopping'?shoppingScreen():['projects','templates'].includes(tab)?projectScreen():['next','flagged','hold'].includes(tab)?workflowScreen(tab):todayScreen();}
 catch(ex){if(tab!=='projects'&&tab!=='templates')throw ex;
   console.error('Compass Projektnavigation: Anzeige fehlgeschlagen',ex);
   // A broken older project hierarchy must never leave the sidebar inert.
   // Keep the navigation visible and offer a safe way to inspect the next action.
   const rows=Object.values(state?.projects||{}).filter(p=>p&&!p.isTemplate).slice(0,200);
   html=chrome(`<section class="work-card" role="alert"><h2>Projektansicht eingeschränkt</h2><p>Beim Darstellen der Projekte ist ein Fehler aufgetreten. Deine Projektdaten wurden nicht verändert.</p><p>${rows.length} Projekte/Ordner gefunden.</p><button type="button" class="secondary-btn" data-tab="next">Next Actions öffnen</button></section>`);
 }
 performanceTrace.end('Ansicht berechnen',tab,screenMeasurement);
 const domMeasurement=performanceTrace.start();
 app.innerHTML=html;bind();if(tab==='today'&&state){ctx42BindHover();ctx39ScheduleAuto();}void mountPremiumAnatomy(app).catch(err=>console.warn('Compass Anatomiekarte konnte nicht geladen werden:',err));
 performanceTrace.end('DOM + Events',tab,domMeasurement);
 editDraftGuard.afterRender(editDraftFocus);lastEditRenderSignature=editRenderSignature();restoreCaptureDraft(captureFocus);restorePeopleScroll(scrollBeforeRender);if(insightScrollBefore){const target=app.querySelector('.fw681-full-log');if(target)target.scrollTop=insightScrollBefore.log;const content=app.querySelector('.content');if(content)content.scrollTop=insightScrollBefore.content;requestAnimationFrame(()=>window.scrollTo?.({top:insightScrollBefore.page,behavior:'instant'}));}if(feelingOverlayOpen){const modal=app.querySelector('#fw65-dialog');if(modal)modal.scrollTop=feelingScrollBefore;}
 if(feelingFocused){let field=feelingFocused.id?app.querySelector('#'+feelingFocused.id):null;if(!field&&feelingFocused.name)field=app.querySelector('.fw65-emotion[data-id="'+feelingFocused.name+'"]');if(field?.focus){field.focus({preventScroll:true});if(Number.isInteger(feelingFocused.start)&&Number.isInteger(feelingFocused.end)&&typeof field.setSelectionRange==='function')try{field.setSelectionRange(feelingFocused.start,feelingFocused.end);}catch{}}}
 if(tab==='finance'&&financePane==='Portfolio'&&state?.uiPreferences?.krakenPublicAuto!==false&&state?.krakenPortfolio?.balances&&document.visibilityState==='visible'&&Date.now()-krakenPublicAttempt>15*60*1000&&!krakenPublicBusy){
   requestAnimationFrame(()=>refreshPublicKrakenPrices(false));
 }
 if(tab==='system'&&configured()&&!authToken)renderGoogleButton();
 performanceTrace.end('Bildschirm rendern',tab,renderMeasurement);
 if(tab==='today'&&core259FamilyKey&&core259FamilyCache.peek(core259FamilyKey)===null){
   const run=()=>setTimeout(core259FamilyAfterPaint,0);
   if(typeof requestAnimationFrame==='function')requestAnimationFrame(()=>requestAnimationFrame(run));else run();
 }
 if(performanceTrace.enabled&&typeof requestAnimationFrame==='function')requestAnimationFrame(()=>requestAnimationFrame(()=>performanceTrace.end('Render bis Darstellung',tab,renderMeasurement)));
}
function bindLifeWeeks82(){
 const matrix=app.querySelector('.lw82-root');if(!matrix)return;
 matrix.onclick=ev=>{const button=ev.target?.closest?.('[data-lw82-week]');if(!button)return;const match=/^(\d+):(\d+)$/.exec(button.dataset.lw82Week||'');if(match){ev.preventDefault();runAction('lw82-week',match[1],match[2]);}};
 const form=app.querySelector('#lw82-event-form');if(form)form.onsubmit=async ev=>{
  ev.preventDefault();const data=new FormData(form);
  const entry={...lifeWeeksDraft,...Object.fromEntries(data),id:form.dataset.id||undefined,source:lifeWeeksDraft.source||'manual',calendarRef:lifeWeeksDraft.calendarRef||''};
  try{await mutate(st=>putLifeEvent(st,entry));lifeWeeksDraft={};lifeWeeksWeek=null;toast('Lebensereignis verschlüsselt gespeichert. Die betroffenen Wochen sind markiert.');}
  catch(ex){toast(ex.message,true);}
 };
 const search=app.querySelector('#lw82-calendar-filter');if(search)search.onsubmit=ev=>{ev.preventDefault();lifeWeeksCalendarQuery=String(new FormData(search).get('query')||'').slice(0,120);render();};
}
function bindStrengthEditor732(){
 const strengthForm=app.querySelector('#str732-form');
 if(strengthForm)wireStrengthRecentDefaults(strengthForm,state);
 if(strengthForm)strengthForm.onsubmit=async ev=>{
  ev.preventDefault();if(!state)return;
  const rows=[...strengthForm.querySelectorAll('[data-strength-set]')];
  const fd=new FormData(strengthForm);
  const sets=rows.map((row,i)=>({exerciseId:String(fd.get('exercise-'+i)||''),reps:fd.get('reps-'+i),weightKg:fd.get('weight-'+i)}));
  try{journalSyncStatus='lokal';await mutate(st=>putStrengthAnnotation(st,{sessionId:strengthForm.dataset.sessionId,start:strengthForm.dataset.start,sets}),null,true);
   strengthEditId732='';refreshStrength728();toast('Übungen und Gewichte lokal gespeichert · Muskelkarte aktualisiert.');
  }catch(ex){toast(ex.message,true);}
 };
}
function compass55BindWaitingForm(){
 const waitingForm=app.querySelector('#wf715-create');if(waitingForm)waitingForm.onsubmit=async ev=>{
    ev.preventDefault();const original=state?.tasks?.[waitingForm.dataset.id];if(!original?.completed)return;
    const fd=new FormData(waitingForm),title=String(fd.get('title')||'').trim(),requested=String(fd.get('checkDate')||'');
    try{
      if(currentFollowupFor(state,original.id))throw Error('Es gibt bereits eine offene Wiedervorlage für diese Aufgabe.');
      const date=nextAustrianWorkday(requested);
      if(date<localDate())throw Error('Bitte einen Prüftermin ab heute wählen.');
      const item=makeWaitingFollowup(original,{id:crypto.randomUUID(),day:date,title,now:stamp()});
      await mutate(s=>{prepareTasks(s);s.tasks[item.id]=item;s.taskPending[item.id]=true;},waitingForm);
      selectedTaskId=item.id;todayInspectorOpen=true;
      toast(date!==requested?`Wiedervorlage angelegt. Das Datum wurde wegen Wochenende/Feiertag auf ${date} verschoben.`:'Waiting-For-Wiedervorlage gespeichert. Sie erscheint ab dem Prüftag unter Heute.');
    }catch(ex){toast(ex.message,true);}
  };
  }

function compass55BindTaskEditForm(){
 const taskEditForm=app.querySelector('#task-edit-form');if(taskEditForm)taskEditForm.onsubmit=async ev=>{
    ev.preventDefault();const id=taskEditForm.dataset.id,fd=new FormData(taskEditForm);const existing=state.tasks[id];if(!existing)return;
    const t={...existing,title:String(fd.get('title')||'').trim(),note:retainWaitingLink(existing.note,taskNoteWithFriction(String(fd.get('note')||'').trim(),{overcoming:String(fd.get('taskOvercoming')||''),effort:String(fd.get('taskEffort')||''),blocker:String(fd.get('taskBlocker')||'')})),plannedDate:fd.get('plannedDate')||null,dueDate:fd.get('dueDate')||null,category:fd.get('category')||'Allgemein',workflow:fd.get('workflow')||'next',flagged:fd.has('flagged'),projectId:fd.get('projectId')||null,parentTaskId:(fd.get('projectId')===existing.projectId?fd.get('parentTaskId')||null:null),tags:parseTags(fd.get('tags')),deferUntil:fd.get('deferUntil')||null,contextTags:parseTags(fd.get('contextTags')),estimateMinutes:fd.get('estimateMinutes')?Number(fd.get('estimateMinutes')):null,progressTarget:fd.get('progressTarget')?Number(fd.get('progressTarget')):null,progressCurrent:fd.get('progressTarget')?Number(fd.get('progressCurrent')||0):0,updatedAt:stamp()};
    if(state.projects?.[existing.projectId]?.isTemplate)t.projectId=existing.projectId;
    if(!validLocalTask(t)||!validTaskParent(state,id,t.projectId,t.parentTaskId)){toast('Aufgabenfelder bzw. Hierarchie prüfen.',true);return;}
    if(t.projectId!==existing.projectId&&Object.values(state.tasks).some(child=>!child.archived&&child.parentTaskId===id)){toast('Unteraufgaben zuerst einzeln verschieben, bevor du das Projekt dieser Aufgabe wechselst.',true);return;}
    await mutate(s=>{s.tasks[id]=t;s.taskPending[id]=true;for(const tag of [...t.tags,...t.contextTags])rememberTag(s,tag);},taskEditForm,true,{fastGtd:true,fastPlanning:true,singleTaskId:id,onApplied:()=>{notice='Aufgabe aktualisiert.';error='';},onFailed:()=>{notice='';error='Aufgabe konnte nicht lokal gesichert werden.';}});
  };
  }

function compass55BindDataActions(root){
 root.querySelectorAll('[data-action]').forEach(el=>{if(el.closest('#fw705-network-results'))return;el.onclick=ev=>{
    if(['capture-close-backdrop','pj92-food-close-backdrop','worktime-quick-close-backdrop','t577-capture-cancel'].includes(el.dataset.action)&&ev.target!==el)return;
    if(el.dataset.action==='date-adjust'||el.dataset.action==='date-clear'){
      const field=el.closest('form')?.querySelector(`[name="${el.dataset.field}"]`);
      if(!field)return;
      if(el.dataset.action==='date-clear')field.value='';
      else {const next=inspectorDateShift(field.value,el.dataset.offset,localDate());if(next)field.value=next;}
      field.focus();return;
    }
    if(el.dataset.action==='person-quick-log')quickContactType=el.dataset.kind||'call';
    runAction(el.dataset.action,el.dataset.id,el.dataset.step,el.dataset.day);
  }});}

function compass55RefreshInspector(){
 if(!state||tab!=='today')return false;
 const rail=app.querySelector('.today-context-rail');if(!rail)return false;
 const measured=performanceTrace.start();
 rail.innerHTML=compass55InspectorContent();
 rail.setAttribute('aria-label',todayInspectorOpen?'Aufgaben-Inspector':'Was passt jetzt?');
 app.querySelectorAll('.today-tasks .task-row').forEach(row=>{
  const button=row.querySelector('[data-action="task-select"]');
  row.classList.toggle('is-selected',button?.dataset?.id===selectedTaskId);
 });
 compass55BindDataActions(rail);
 compass55BindWaitingForm();compass55BindTaskEditForm();
 if(state)wireSmartTags(rail,()=>state);
 performanceTrace.end('GTD: Inspector aktualisieren',tab,measured);
 return true;
}
function compass55FastTaskPaint(id){
 const measured=performanceTrace.start();
 const row=[...app.querySelectorAll('.today-tasks .task-row')].find(r=>r.querySelector('[data-action="task-toggle"]')?.dataset?.id===id);
 if(!row)return false;
 const task=state?.tasks?.[id];if(!task)return false;
 row.classList.toggle('completed',!!task.completed);
 const check=row.querySelector('[data-action="task-toggle"]');
 if(check){check.textContent=task.completed?'✓':'';check.setAttribute('aria-label',task.completed?'Wieder öffnen':'Erledigen');}
 const counter=app.querySelector('.today-tasks .work-heading .quiet-tag');
 if(counter){const match=counter.textContent.match(/(\d+)\s*\/\s*(\d+)/);if(match){
   const previouslyComplete=!task.completed;const done=Math.max(0,Math.min(Number(match[2]),Number(match[1])+(previouslyComplete?-1:1)));
   counter.textContent=done+' / '+match[2]+' erledigt';
  }}
 performanceTrace.end('GTD: Checkbox aktualisieren',tab,measured);
 return true;
}

function bind() {
 if(tab==='insights'&&insightTab==='lifeweeks')bindLifeWeeks82();
 const packetsForm748=app.querySelector('#cap748-packets-form');
 if(packetsForm748)packetsForm748.onsubmit=async event=>{
  event.preventDefault();if(!state)return;
  const fd=new FormData(packetsForm748),rows={};
  for(const task of Object.values(state.tasks||{})){
   if(!task?.id||!fd.has('packet:'+task.id+':unitMinutes'))continue;
   rows[task.id]={count:fd.get('packet:'+task.id+':count'),unitMinutes:fd.get('packet:'+task.id+':unitMinutes'),blockMinutes:fd.get('packet:'+task.id+':blockMinutes')};
  }
  try{await mutate(st=>saveWorkPacketSettings(st,rows),null,true);toast('Arbeitsblöcke im lokalen Tresor gespeichert.');}
  catch(ex){toast('Arbeitspakete: '+ex.message,true);}
 };
 const capacityForm747=app.querySelector('#cap747-form');
 if(capacityForm747)capacityForm747.onsubmit=async ev=>{
  ev.preventDefault();if(!state)return;
  const fd=new FormData(capacityForm747),estimates={};
  for(const [key,value] of fd.entries())if(key.startsWith('estimate:'))estimates[key.slice(9)]=String(value);
  try{
   const focusHours=String(fd.get('focusHours')??'').trim();
   const reservePct=String(fd.get('reservePct')??'20').trim();
   await mutate(st=>saveCapacitySettings749(st,{focusHours,reservePct,estimates}),null,true);
   toast('Fokusbudget und Aufwandsschätzungen im lokalen Tresor gespeichert.');
  }catch(ex){toast('Kapazitätsplanung: '+ex.message,true);}
 };
 const dreamShortcuts744=app.querySelectorAll('.dream743-quick,[data-action="calm-insight-view"][data-id="dreamworld"],[data-action="insights-tab"][data-id="dreamworld"]');
 dreamShortcuts744.forEach(dreamShortcut744=>dreamShortcut744.addEventListener('click',ev=>{
  ev.preventDefault();ev.stopImmediatePropagation();
  if(!state){toast('Bitte zuerst den Tresor entsperren.',true);return;}
  document.activeElement?.blur?.();
  tab='insights';insightTab='dreamworld';calmNavGroup='insights';dreamEditingId743='';
  render();
  const field=app.querySelector('#dream743-form textarea[name="body"]');
  field?.scrollIntoView?.({behavior:'auto',block:'center'});
  field?.focus?.({preventScroll:true});
 }));
 const dream743Form=app.querySelector('#dream743-form');
 if(compass59DreamFocusPending&&dream743Form)compass59FocusDreamField();
 if(dream743Form)dream743Form.onsubmit=async event=>{
  event.preventDefault();if(!state)return;
  const fd=new FormData(dream743Form);
  try{
   const at=new Date(String(fd.get('at')));
   if(!Number.isFinite(at.getTime()))throw Error('Ungültiger Zeitpunkt.');
   await mutate(st=>putDreamEntry(st,{id:String(fd.get('id')||'')||undefined,kind:String(fd.get('kind')),at:at.toISOString(),title:fd.get('title'),body:fd.get('body'),mood:String(fd.get('mood')||'unknown'),vividness:fd.get('vividness'),lucid:fd.get('lucid')==='on',tags:fd.get('tags')}));
   dreamEditingId743='';render();toast('Erinnerung verschlüsselt gespeichert.');
  }catch(ex){toast('Traumwelt: '+ex.message,true);}
 };
 const dream743KindFilter=app.querySelector('#dream743-kind-filter');if(dream743KindFilter)dream743KindFilter.onchange=()=>{dreamKind743=dream743KindFilter.value;render();};
 // Bind category correction independently of the full page form. Keep the
 // current open details panel and scroll position while updating the amounts.
 app.querySelectorAll('.receipts745-select').forEach(select=>select.onchange=async()=>{
  if(!state)return;
  const id=select.dataset.receiptId,index=Number(select.dataset.receiptIndex),category=select.value;
  select.disabled=true;
  try{
   await mutate(st=>setReceiptCategory(st,{receiptId:id,index,category}),null,true);
   const oldPanel=app.querySelector('.receipts745-categories');
   if(oldPanel){
    const html=receiptInboxView(state,{draft:receiptDraft743,month:receiptMonth745});
    const detached=document.createElement('div');detached.innerHTML=html;
    for(const part of ['.receipts745-stats','.receipts745-bars','.receipts745-explain']){
     const before=oldPanel.querySelector(part),after=detached.querySelector(part);
     if(before&&after)before.replaceWith(after);
    }
    // Reflect category changes for identical merchant/product descriptions.
    const updated=detached.querySelectorAll('.receipts745-select');
    const visible=oldPanel.querySelectorAll('.receipts745-select');
    visible.forEach((el,i)=>{if(updated[i])el.innerHTML=updated[i].innerHTML;});
   }
   toast('Warengruppe gespeichert. Gleiche Produkte werden künftig automatisch erkannt.');
  }catch(ex){toast('Produktgruppe: '+ex.message,true);render();}
  finally{if(select.isConnected)select.disabled=false;}
 });
 const receipt743Form=app.querySelector('#receipts743-form');
 if(receipt743Form)receipt743Form.onsubmit=event=>{
  event.preventDefault();try{receiptDraft743=parseReceiptJSONList(String(new FormData(receipt743Form).get('json')||''));render();toast(receiptDraft743.length+' Bon(s) erkannt. Jede Position vor dem Speichern prüfen.');}
  catch(ex){toast('Bonprüfung: '+ex.message,true);}
 };

 bindStrengthEditor732();
 const reportPeriodControl=app.querySelector('#clp-period');
 if(reportPeriodControl)reportPeriodControl.onchange=()=>{lifeReportSettings.period=reportPeriodControl.value;lifeReportSettings.rankedIds=[];render();};
 const reportFinanceControl=app.querySelector('#clp-finance');
 if(reportFinanceControl)reportFinanceControl.onchange=()=>{lifeReportSettings.finance=reportFinanceControl.checked;lifeReportSettings.rankedIds=[];render();};
 const reportPlacesControl=app.querySelector('#clp-places');
 if(reportPlacesControl)reportPlacesControl.onchange=()=>{lifeReportSettings.places=reportPlacesControl.checked;lifeReportSettings.rankedIds=[];render();};
 for(const key of ['people','feelings']){const control=app.querySelector('#clp-'+key);if(control)control.onchange=()=>{lifeReportSettings[key]=control.checked;lifeReportSettings.rankedIds=[];render();};}
 const quickCategory=app.querySelector('#pj92-current-category');if(quickCategory)quickCategory.onchange=()=>{worktimeSelectedCategory=quickCategory.value;};
 for(const [formId,habitId] of [['ht25-wim-form','wim-hof'],['ht25-vocal-form','vocal-image']]){const form=app.querySelector('#'+formId);if(form)form.onsubmit=async ev=>{ev.preventDefault();if(!state)return toast('Bitte Tresor entsperren.',true);const fd=new FormData(form);const date=String(fd.get('day')||localDate());const minutes=Number(fd.get('minutes'));if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||minutes<=0||minutes>180)return toast('Bitte gültiges Datum und 1–180 Minuten eingeben.',true);const mode=habitId==='wim-hof'?String(fd.get('mode')||'evening'):'';try{await mutate(st=>{const at=date+'T12:00:00';putHabitTimeSession(st,{habitId,at,day:date,minutes,mode,source:'manual-backfill'});setHabitDoneState(st,habitId,date,true,stamp());});toast('Einheit und Dauer verschlüsselt gespeichert.');}catch(ex){toast('Nicht gespeichert: '+ex.message,true);}};}
 const timeForm=app.querySelector('#pj92-time-form');if(timeForm)timeForm.onsubmit=async ev=>{ev.preventDefault();try{const fd=new FormData(timeForm);const conv=v=>new Date(String(v)).toISOString();const entry=validTimeEntry({id:fd.get('id')||undefined,start:conv(fd.get('start')),end:conv(fd.get('end')),category:String(fd.get('category')),title:fd.get('title'),project:fd.get('project'),updatedAt:stamp()});journalSyncStatus='lokal';await mutate(s=>putTimeEntry(s,entry));timeJournalShowForm=false;timeJournalEditId='';toast('Zeitintervall gespeichert.');}catch(ex){toast(ex.message,true);}};
 const energyGoalForm=app.querySelector('#pj575-energy-form');if(energyGoalForm)energyGoalForm.onsubmit=async ev=>{
  ev.preventDefault();try{const fd=new FormData(energyGoalForm);const old=energyGoalSettings(state?.nutritionJournal?.energyGoal);
   const settings=energyGoalSettings({...old,enabled:fd.has('enabled'),birthYear:fd.get('birthYear')||null,birthMonth:fd.get('birthMonth')||null,heightCm:fd.get('heightCm')||null,formulaSex:String(fd.get('formulaSex')||''),method:String(fd.get('method')||'auto'),activity:String(fd.get('activity')||'auto'),deficit:Number(fd.get('deficit'))||300,updatedAt:stamp()});
   journalSyncStatus='lokal';await mutate(s=>{ensureJournal(s).nutritionJournal.energyGoal=settings;});toast('Energieziel lokal verschlüsselt gespeichert.');
  }catch(ex){toast('Energieziel: '+ex.message,true);}
 };
 const mealCompose=app.querySelector('#meal723-compose-form');
 if(mealCompose){
   const field=mealCompose.querySelector('textarea[name="description"]');
   let mealInputSample=0;
   field?.addEventListener('input',()=>{
     mealComposeText=field.value.slice(0,1200);
     // Opt-in, sampled and text-free: measure two-frame visual response.
     if(performanceTrace.enabled&&++mealInputSample%8===0){
       const started=performanceTrace.start();
       if(typeof requestAnimationFrame==='function')requestAnimationFrame(()=>requestAnimationFrame(()=>performanceTrace.end('Ernährung: Tippen bis Paint',tab,started)));
     }
   });
   mealCompose.addEventListener('input',ev=>{
     const input=ev.target;if(!mealComposeModel||!input?.name?.startsWith('meal723-grams-'))return;
     const id=input.name.slice('meal723-grams-'.length),grams=Number(String(input.value).replace(',','.'));
     if(!Number.isFinite(grams)||grams<=0||grams>2000)return;
     const row=mealComposeModel.ingredients.find(x=>x.id===id);if(!row)return;
     row.grams=grams;row.assumed=false;
     const stats=mealCompose.querySelector('.meal723-macros');if(stats)stats.innerHTML=mealMacroMarkup(mealComposeModel.ingredients);
   });

   mealCompose.onsubmit=async ev=>{ev.preventDefault();if(!state)return;
     const op=ev.submitter?.dataset?.mealSave==='1'?'save':'analyze';
     mealComposeText=String(new FormData(mealCompose).get('description')||'').trim().slice(0,1200);
     if(op==='analyze'){
       const start=performanceTrace.start();mealComposeModel=recognizeMeal(mealComposeText);performanceTrace.end('Ernährung: Zutaten erkennen',tab,start);
       const host=mealCompose.querySelector('#meal723-preview');if(host)host.innerHTML=mealPreviewMarkup(mealComposeModel);
       return;
     }
     if(!mealComposeModel?.ingredients?.length)return toast('Zuerst Zutaten erkennen oder GPT-Vorschlag übernehmen.',true);
     const fd=new FormData(mealCompose);
     const rows=mealComposeModel.ingredients.map(row=>({...row,grams:String(fd.get('meal723-grams-'+row.id)||'')}));
     try{const start=performanceTrace.start();const send=ev.submitter;if(send)send.disabled=true;journalSyncStatus='lokal';await mutate(st=>saveMeal(st,{description:mealComposeText,title:mealComposeText.slice(0,80),ingredients:rows,unknown:mealComposeModel.unknown}),mealCompose);
       performanceTrace.end('Ernährung: Mahlzeit speichern',tab,start);mealComposeText='';mealComposeModel=null;nutritionQuickOpen=false;toast('🍽️ Mahlzeit verschlüsselt erfasst und als Kachel gemerkt.');
     }catch(ex){const button=mealCompose.querySelector('[data-meal-save]');if(button)button.disabled=false;toast('Mahlzeit nicht gespeichert: '+ex.message,true);}
   };
 }
 const mealJson=app.querySelector('#meal723-json-form');
 if(mealJson)mealJson.onsubmit=ev=>{ev.preventDefault();try{
   const parsed=importMealJSON(new FormData(mealJson).get('json'));
   mealComposeModel={description:mealComposeText,ingredients:parsed.ingredients,unknown:parsed.unknown,warnings:[parsed.notes||'GPT-Mengen sind Schätzungen. Bitte prüfen.']};
   const host=app.querySelector('#meal723-preview');if(host)host.innerHTML=mealPreviewMarkup(mealComposeModel);
   toast('GPT-Vorschlag übernommen. Bitte Mengen prüfen.');
  }catch(ex){toast(ex.message,true);}};
 const macroForm=app.querySelector('#meal723-macro-form');
 if(macroForm)macroForm.onsubmit=async ev=>{ev.preventDefault();if(!state)return;const fd=new FormData(macroForm);try{await mutate(st=>{ensureJournal(st).nutritionJournal.macroPrefs=normalizedMacroPreferences({mode:fd.get('mode'),enabled:fd.get('enabled')==='on',updatedAt:stamp()});});toast('Makroorientierung gespeichert.');}catch(ex){toast(ex.message,true);}};
 const foodDetail=app.querySelector('#pj92-food-detail-form');if(foodDetail)foodDetail.onsubmit=async ev=>{ev.preventDefault();try{const fd=new FormData(foodDetail);journalSyncStatus='lokal';await mutate(s=>{ensureJournal(s);const item=s.nutritionJournal.entries.find(e=>e.id===fd.get('id'));if(!item)throw Error('Eintrag fehlt.');item.at=new Date(String(fd.get('at'))).toISOString();item.amount=String(fd.get('amount')||'').slice(0,60);item.note=String(fd.get('note')||'').slice(0,500);if(item.foodId==='smoothie-personal')item.recipe=readSmoothieForm(fd);if(PERSONAL_RECIPE_IDS.includes(item.foodId))item.recipe=readPersonalRecipe(item.foodId,fd);item.updatedAt=stamp();});nutritionEditId='';render();toast('Ernährungseintrag gespeichert.');}catch(ex){toast(ex.message,true);}};
 const touchEditForm=app.querySelector('#t577-edit-form');if(touchEditForm)touchEditForm.onsubmit=async ev=>{ev.preventDefault();try{const fd=new FormData(touchEditForm);const dateValue=new Date(String(fd.get('at')));if(!Number.isFinite(dateValue.getTime()))throw Error('Ungültiges Datum.');const personId=String(fd.get('personId')||'');if(personId&&!state?.people?.[personId])throw Error('Person nicht vorhanden.');await mutate(s=>putTouch(s,{id:String(fd.get('id')),kinds:fd.getAll('kinds'),at:dateValue.toISOString(),personId,person:state?.people?.[personId]?.name||'',note:String(fd.get('note')||''),experience:String(fd.get('experience')||'')}));touchEditingId='';toast('Nähe-Eintrag verschlüsselt gespeichert.');}catch(ex){toast(ex.message,true);}};
 const touchCaptureForm=app.querySelector('#t577-capture-form');if(touchCaptureForm)touchCaptureForm.onsubmit=async ev=>{ev.preventDefault();try{
  const fd=new FormData(touchCaptureForm),personId=String(fd.get('personId')||''),when=new Date(String(fd.get('at')));
  if(personId&&!state?.people?.[personId])throw Error('Person nicht gefunden.');
  if(!Number.isFinite(when.getTime()))throw Error('Ungültiger Zeitpunkt.');
  await mutate(s=>putTouch(s,{kinds:fd.getAll('kinds'),at:when.toISOString(),personId,person:state?.people?.[personId]?.name||'',note:String(fd.get('note')||''),experience:String(fd.get('experience')||'')}));
  touchQuickOpen=false;touchDefaultPersonId=personId;toast('Begegnung gespeichert.');
 }catch(ex){toast(ex.message,true);}};
 const foodCustom=app.querySelector('#pj92-add-food-form');if(foodCustom)foodCustom.onsubmit=async ev=>{ev.preventDefault();try{const fd=new FormData(foodCustom);journalSyncStatus='lokal';await mutate(s=>addCustomFood(s,fd.get('title'),'🍴',{defaultAmount:fd.get('defaultAmount'),kcalLow:fd.get('kcalLow'),kcalHigh:fd.get('kcalHigh')}));toast('Lebensmittel hinzugefügt.');}catch(ex){toast(ex.message,true);}};




 const recPanel=app.querySelector('#rec554-panel');if(recPanel)recPanel.addEventListener('toggle',()=>{if(recPanel.isConnected)timeoffOpen=recPanel.open;});
 const plannerElement=app.querySelector('#v47-plan');if(plannerElement)plannerElement.addEventListener('toggle',()=>{plannerExpanded=plannerElement.open;});
 if(state)wireSmartTags(app,()=>state);
 if(tab==='finance'&&financePane==='Portfolio'&&krakenChartData?.candles?.length)app.querySelectorAll('.fin39-price-card .fin40-terminal').forEach(el=>wireTechnicalCrosshair(el,krakenChartData.candles,krakenChartSettings));
 if(tab==='finance'&&financePane==='Portfolio'&&flatexChartData?.candles?.length)app.querySelectorAll('.fin41-market-card .fin40-terminal').forEach(el=>wireTechnicalCrosshair(el,flatexChartData.candles,{...flatexChartSettings,currency:flatexChartData.currency}));
  app.querySelectorAll('[data-tab]').forEach(el=>el.onclick=ev=>{ev?.preventDefault?.();const target=el.dataset.tab;if(!target)return;cm930MobileMenuOpen=false;if(target==='today'){todayInspectorOpen=false;selectedDay=localDateString(new Date());calendarMonth=new Date(selectedDay+'T12:00:00');manuallyChosenDay=false;}if(target==='people'){familyRadarJumpPersonId401=null;peopleScope=state&&typeof effectiveContext39==='function'&&effectiveContext39(state).kind==='work'?'work':'all';peopleTab='list';peopleShowAll=false;selectedPersonId=null;}if(target==='forecast')forecastInspectorOpen401=false;if(target==='recovery'){compass55Mode='extended';try{localStorage.setItem(COMPASS55_MODE_KEY,'extended');}catch{}}tab=target;calmNavGroup=['overview','projects','templates','shopping','next','forecast','radar','flagged','hold','someday','recovery'].includes(tab)?'plan':['insights','activity','progress'].includes(tab)?'insights':'';if(tab==='finance')calmNavGroup='finance';if(tab==='health'){tab='insights';insightTab='sources';}if(tab==='places'){tab='insights';insightTab='places';insightPeriod='all';}notice='';error='';render();
  // Explicit navigation is allowed to refresh already-opted-in contacts, but
  // never turns on sharing or makes Today wait for an extra network request.
  if(tab==='people'&&state?.peopleSyncEnabled===true&&state?.privateDeviceMirror?.key&&authToken&&navigator.onLine&&Object.keys(state.people||{}).length===0&&journalSyncStatus!=='ok'){
    void syncPersonalJournal().catch(ex=>{journalLastError=String(ex?.message||ex);journalSyncStatus='fehler';render();});
  }
  if((tab==='activity'||tab==='overview'||tab==='progress'||tab==='recovery')&&authToken)reloadWatchSessions().catch(()=>{});if((tab==='progress'||tab==='recovery')&&authToken){reloadHealth().catch(()=>{});reloadWidgetDevices().catch(()=>{});}});
  const nutritionConnSelect=app.querySelector('#ni727-outcome');
 if(nutritionConnSelect)nutritionConnSelect.onchange=()=>{
  nutritionConnOutcome727=nutritionConnSelect.value;refreshNutritionConnectionsPanel();
 };
 const balanceGoalsForm=app.querySelector('#lbr63-goals-form');
  if(balanceGoalsForm)balanceGoalsForm.onsubmit=async ev=>{ev.preventDefault();try{const fd=new FormData(balanceGoalsForm);const values=validateBalanceGoals({sleepMinutes:Number(fd.get('sleepHours'))*60,stepsDaily:Number(fd.get('stepsDaily')),weeklyHours:Number(fd.get('weeklyHours')),weightKg:String(fd.get('weightKg')||''),bodyFatTargetPct:String(fd.get('bodyFatTargetPct')||'')});await mutate(s=>{s.lifeBalanceGoals=values;});toast('Persönliche Richtwerte im Vault gespeichert.');}catch(ex){toast(ex.message,true);}};
  const morningForm=app.querySelector('#mm570-settings-form');if(morningForm)morningForm.onsubmit=async ev=>{
    ev.preventDefault();try{const fd=new FormData(morningForm);const durations=Object.fromEntries(MORNING_STEPS.map(step=>[step.id,Number(fd.get('duration-'+step.id))]));
      const config=normalizeMorningConfig({...ensureMorning(state).config,durations,affirmations:String(fd.get('affirmations')||'').split(/\r?\n/),visualization:fd.get('visualization'),goalId:fd.get('goalId'),exercises:String(fd.get('exercises')||'').split(/\r?\n/),readingBook:fd.get('readingBook'),journalPrompt:fd.get('journalPrompt'),updatedAt:stamp()});
      journalSyncStatus='lokal';await mutate(st=>{ensureMorning(st).config=config;});morningConfig=config;morningPublicWrite();toast('Morning-Konfiguration im Tresor gespeichert.');
    }catch(ex){toast(ex.message,true);}
  };
  const mm571Affirm=app.querySelector('#mm571-affirmation-form');if(mm571Affirm)mm571Affirm.onsubmit=async ev=>{
    ev.preventDefault();const value=new FormData(mm571Affirm).get('affirmation');
    try{await mutate(st=>addMorningAffirmation(st,value));toast('Affirmation verschlüsselt gespeichert.');}catch(ex){toast(ex.message,true);}
  };
  async function compactMorningImage(file){
    if(!file?.size)return '';
    if(file.size>8*1024*1024||!['image/jpeg','image/png','image/webp'].includes(file.type))throw Error('Bitte ein JPG, PNG oder WebP unter 8 MB auswählen.');
    const bitmap=await createImageBitmap(file);
    try{
      const ratio=Math.min(1,520/Math.max(bitmap.width,bitmap.height));const canvas=document.createElement('canvas');
      canvas.width=Math.round(bitmap.width*ratio);canvas.height=Math.round(bitmap.height*ratio);
      if(!canvas.width||!canvas.height)throw Error('Bildformat ungültig.');
      canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);
      const url=canvas.toDataURL('image/jpeg',0.65);
      if(url.length>=150000)throw Error('Zielbild ist zu groß. Bitte kleineres Bild wählen.');
      return url;
    }finally{bitmap.close?.();}
  }
  const mm571Vision=app.querySelector('#mm571-vision-form');if(mm571Vision)mm571Vision.onsubmit=async ev=>{
    ev.preventDefault();const fd=new FormData(mm571Vision);
    try{const imageData=await compactMorningImage(fd.get('image'));await mutate(st=>saveMorningVision(st,{title:fd.get('title'),text:fd.get('text'),emoji:fd.get('emoji'),goalId:fd.get('goalId'),imageData}));toast('Zielkarte gespeichert.');}catch(ex){toast(ex.message,true);}
  };
  const mm571Config=app.querySelector('#mm571-config-form');if(mm571Config)mm571Config.onsubmit=async ev=>{
    ev.preventDefault();const fd=new FormData(mm571Config);
    try{await mutate(st=>{const existing=ensureMorning(st).config;st.miracleMorning.config=normalizeMorningConfig({...existing,durations:Object.fromEntries(MORNING_STEPS.map(s=>[s.id,Number(fd.get('duration-'+s.id))])),readingBook:fd.get('readingBook'),exercises:String(fd.get('exercises')||'').split(/\r?\n/),journalPrompt:fd.get('journalPrompt'),updatedAt:stamp()});});morningRestoreConfig();toast('Routine gespeichert.');}catch(ex){toast(ex.message,true);}
  };
  const morningPlayerNote=app.querySelector('#mm570-journal');if(morningPlayerNote)morningPlayerNote.oninput=()=>{
    if(!morningSession)return;morningSession.note=morningPlayerNote.value.slice(0,4000);
    if(state){ensureMorning(state).draft=structuredClone(morningSession);morningScheduleDraftSave();}
  };
  const mm571Note=app.querySelector('#mm571-journal-text');if(mm571Note){
    mm571Note.oninput=()=>{if(!state||!morningJournalEditingId)return;const text=mm571Note.value.slice(0,12000);
      const row=putMorningNote(state,{id:morningJournalEditingId,text});morningJournalDraft={...row};
      const status=app.querySelector('#mm571-autosave-status');if(status)status.textContent='Speichert …';morningScheduleDraftSave();};
    mm571Note.onblur=()=>{morningJournalBlur().catch(ex=>console.warn('Journal nachbearbeiten:',ex.message));};
  }
  const vaultForm=app.querySelector('#vault-form');if(vaultForm)vaultForm.onsubmit=async ev=>{
    ev.preventDefault();const unlockMeasurement=performanceTrace.start();const form=new FormData(vaultForm),p=String(form.get('passphrase')||'');
    try {const compass55UnlockStep=performanceTrace.start();if(hasVault){state=await vault.unlock(p);}else {if(p!==form.get('repeat'))throw new Error('Die Passphrasen stimmen nicht überein.');state=await vault.create(p);hasVault=true;}performanceTrace.end('Tresor: Entschlüsseln',tab,compass55UnlockStep);
      // Draft bytes are separate from the full Vault payload, but use the same key.
      const compass55DraftStep=performanceTrace.start();state[EDIT_DRAFT_VAULT_KEY]={...(state[EDIT_DRAFT_VAULT_KEY]||{}),...(await vault.loadEditDrafts().catch(()=>({})))};performanceTrace.end('Tresor: Entwürfe laden',tab,compass55DraftStep);
      const compass55Keys=['tasks','taskPending','taskVersions','taskConflicts','projects','projectPending','projectVersions','projectConflicts','discoveredEvents','eventPreferences','eventVersions','eventPending','eventDeleted','eventConflicts'];const compass55Missing=compass55Keys.some(key=>state[key]==null);prepareTasks(state);eventState(state);const compass55Pruned=prunePastEvents(state,localDate(),0,0);const compass55SaveStep=performanceTrace.start();if(compass55Missing||compass55Pruned>0){await persist();performanceTrace.end('Tresor: Startzustand speichern',tab,compass55SaveStep);}else{performanceTrace.end('Tresor: Startzustand unverändert',tab,compass55SaveStep);}
      let recoveryMessage='';
      try {
        await vault.setupSealedCapture();sealedCaptureAvailable=true;
        const pending=await vault.readSealedCaptures();
        if(pending.length){
          for(const capture of pending){
            if(capture.kind==='feeling'){
              const item=capture.entry;
              if(!item||item.id!==capture.id||!Array.isArray(item.items)||(!item.items.length&&!String(item.ownWords||'').trim()&&!item.networkTerms?.length)||!item.items.every(i=>FEELINGS.some(f=>f.id===i.id)&&Number.isInteger(i.intensity)&&i.intensity>=1&&i.intensity<=10))throw Error('Verschlüsselter Gefühls-Check-in ist beschädigt.');
              if(!(state.feelingCheckins||[]).some(e=>e.id===item.id))appendCheckin(state,item);
              continue;
            }
            if(capture.kind==='worktime'){applyWorktimeEvent(state,capture.entry||{});continue;}
            if(capture.kind==='habit'){applyHabitEvent(state,capture.entry||{});continue;}
            if(capture.kind==='nutrition'){if(!state.nutritionJournal?.entries?.some(e=>e.id===capture.entry?.id))addNutrition(state,capture.entry);continue;}
            if(capture.kind==='morning'){const entry=capture.entry;if(!entry?.id||!entry?.finishedAt)throw Error('Morgenroutine beschädigt.');storeMorningSession(state,entry);sessionToMorningNote(state,entry);if(entry.steps?.some(step=>!step.skipped)&&entry.finishedAt){const habits=ensureHabitState(state);if(!habits.items.some(h=>h.id==='miracle-morning'))habits.items.push({id:'miracle-morning',title:'Miracle Morning',slot:'Morgen',active:true});setHabitDoneState(state,'miracle-morning',entry.day||entry.finishedAt.slice(0,10),true,entry.finishedAt);}continue;}
            if(state.records[capture.id])continue;const record={id:capture.id,title:capture.title,note:capture.note||'',tags:[],deleted:false,updatedAt:capture.createdAt||stamp()};state.records[record.id]=record;state.pending.push(makeMutation(record));state.history.push({type:'captured',at:record.updatedAt,id:record.id});
          }
          await persist(); // Only acknowledge after durable encrypted vault write.
          await vault.acknowledgeSealedCaptures(pending.map(x=>x.id));
          recoveryMessage=` · ${pending.length} verschlüsselte Schnellnotiz(en) übernommen`;
        }
      }catch(captureError){recoveryMessage=' · Schnellerfassung prüfen: '+captureError.message;}
      morningRestoreConfig();
      if(!bootView&&!bootCapture)tab='today';
      const savedMorningDraft=state?.miracleMorning?.draft;if(morningSession&&savedMorningDraft?.id===morningSession.id&&savedMorningDraft.note){morningSession.note=savedMorningDraft.note;}
      syncQuickPublicFromState();restoreCalendarFromVault(state);
      compass55Mode='focus';
      try{localStorage.setItem(COMPASS55_MODE_KEY,'focus');}catch{}
      if(!captureAfterUnlock&&!bootView){tab='today';selectedDay=localDateString(new Date());calendarMonth=new Date(selectedDay+'T12:00:00');lastObservedLocalDay=selectedDay;manuallyChosenDay=false;todayInspectorOpen=false;calmNavGroup='';}
      if(captureAfterUnlock){captureOverlayOpen=true;captureAfterUnlock=false;}toast('Lokaler Tresor bereit'+recoveryMessage+'.');
      resumeSession().catch(()=>{});}catch(ex){toast(ex.message,true);}finally{performanceTrace.end('Tresor entsperren',tab,unlockMeasurement);}
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
   const mensaForm=app.querySelector('#mensa-import-form');if(mensaForm)mensaForm.onsubmit=ev=>{
     ev.preventDefault();if(!mensaApi)return;
     try{mensaImportDraft=mensaApi.parseMensaJSON(String(new FormData(mensaForm).get('json')||''));mensaMessage=`${mensaImportDraft.length} Menüs geprüft – noch nicht gespeichert.`;render();}
     catch(ex){toast('Mensa-JSON: '+ex.message,true);}
   };
  const activityForm=app.querySelector('#activity-edit-form');if(activityForm)activityForm.onsubmit=async ev=>{
    ev.preventDefault();const id=activityForm.dataset.id;const d=new FormData(activityForm);
    const data={title:String(d.get('title')||'').trim(),category:String(d.get('category')||''),startedAt:String(d.get('startedAt')||''),durationMinutes:Number(d.get('durationMinutes')),distanceKm:String(d.get('distanceKm')||'').trim()===''?null:Number(d.get('distanceKm')),note:String(d.get('note')||''),projectId:String(d.get('projectId')||''),activityType:String(d.get('activityType')||'')};
    if(!validActivityEdit(data)||data.projectId&&!state?.projects?.[data.projectId]){toast('Prüfe Titel, Zeitpunkt, Dauer und Projekt.',true);return;}
    const wasPending=projectActivities(watchSessions,state).some(a=>a.id===id&&a.activityTypeReview);
    await mutate(s=>{if(id.startsWith('manual-')){s.manualActivities[id]={...s.manualActivities[id],...data};}else{s.activityEdits??={};s.activityEdits[id]={...(s.activityEdits[id]||{}),...data};}});
    if(activityReviewFlow&&wasPending&&data.activityType&&data.activityType!=='Pruefungen'&&data.activityType!=='Unklassifiziert'){
      const next=activeActivities(watchSessions,state).filter(a=>a.activityTypeReview).sort((a,b)=>a.startedAt.localeCompare(b.startedAt))[0];
      if(next){activitySelectedId=next.id;render();const field=app.querySelector('#activity-edit-form select[name="activityType"]');field?.scrollIntoView({block:'center'});field?.focus({preventScroll:true});toast('Zuordnung gespeichert · nächste Prüfungs-Session geöffnet.');}
      else{activityReviewFlow=false;toast('Alle historischen Prüfungs-Sessions zugeordnet.');}
    }else toast('Änderungen im verschlüsselten Tresor gespeichert.');
  };
  const personForm=app.querySelector('#person-create-form');if(personForm)personForm.onsubmit=async ev=>{ev.preventDefault();const name=String(new FormData(personForm).get('name')||'').trim(),tag=personTag(name);if(!name||!tag){toast('Bitte einen gültigen Namen eingeben.',true);return;}if(Object.values(state.people||{}).some(p=>p.tag===tag)){toast('Kontakt bereits vorhanden.',true);return;}const id=crypto.randomUUID();await mutate(s=>{s.people??={};s.people[id]={id,name,tag,note:'',...(peopleScope==='work'?{relationKind:'colleague'}:{})};});selectedPersonId=id;render();};
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
    await mutate(s=>{s.projects[project.id]=project;s.projectPending[project.id]=true;s.people[id].relatedProjectIds=[...new Set([...(s.people[id].relatedProjectIds||[]),project.id])];},personProjectCreate);toast('Projekt angelegt und mit Person verbunden.');};
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




  const careForm=app.querySelector('#contact-care-form');if(careForm){careForm.closest('details')?.addEventListener('toggle',ev=>{contactSettingsOpen=ev.currentTarget.open;});careForm.onsubmit=async ev=>{ev.preventDefault();const id=careForm.dataset.id;const fd=new FormData(careForm);if(!state?.people?.[id])return;const mode=String(fd.get('mode')||'occasional');if(!CONTACT_MODES.some(([k])=>k===mode))return;await mutate(s=>{s.people[id].contactMode=fd.has('sharesHousehold')?'regular':mode;s.people[id].sharesHousehold=fd.has('sharesHousehold');s.people[id].contactPaused=mode==='paused';});contactSettingsOpen=true;contactSaveStatus='Kontaktmodus gespeichert ✓';render();};}
  const contactForm=app.querySelector('#person-contact-form');
  if(contactForm){
    // Keep the working copy in memory. The v57716 guard saves its own tiny
    // AES-GCM encrypted draft after an idle pause; never re-encrypt the entire
    // multi-year Vault while the user types a contact note.
    const saveDraft=()=>{const personId=contactForm.dataset.id;if(!state?.people?.[personId])return;const fd=new FormData(contactForm);state.contactDrafts??={};state.contactDrafts[personId]={day:String(fd.get('day')||localDate()),type:String(fd.get('type')||'meeting'),note:String(fd.get('note')||'').slice(0,1200),initiator:String(fd.get('initiator')||'unknown')};const msg=contactForm.querySelector('.contact-draft-confirmation');if(msg)msg.textContent='Änderung vorgemerkt · verschlüsselte Sicherung nach Schreibpause';};
    contactForm.addEventListener('input',saveDraft);
    contactForm.addEventListener('change',saveDraft);
  }
  if(contactForm)contactForm.onsubmit=async ev=>{
    ev.preventDefault();const id=contactForm.dataset.id;if(!state?.people?.[id])return;
    const fd=new FormData(contactForm),entry={id:crypto.randomUUID(),day:String(fd.get('day')||''),type:String(fd.get('type')||''),note:String(fd.get('note')||'').trim(),initiator:String(fd.get('initiator')||'unknown')};
    if(contactSaving)return;
    if((state.people[id].contactLog||[]).some(x=>x.day===entry.day&&x.type===entry.type&&(x.note||'')===entry.note&&(x.initiator||'unknown')===entry.initiator)){
      contactSaveStatus='Dieser Kontakt ist bereits dokumentiert ✓';render();return;
    }
    contactSaving=true;contactSaveStatus='Speichert …';
    const scroll=rememberPeopleScroll();
    try {clearTimeout(contactDraftSaveTimer);await mutate(s=>{s.people[id]=addContactEntry(s.people[id],entry,localDate()).person;if(s.contactDrafts)delete s.contactDrafts[id];});quickContactType='';contactSaveStatus='✓ Kontakt gespeichert – im Verlauf sichtbar';contactSaving=false;render();restorePeopleScroll(scroll);}
    catch(ex){contactSaving=false;contactSaveStatus='Speichern fehlgeschlagen · bitte erneut versuchen';render();restorePeopleScroll(scroll);const f=app.querySelector('#person-contact-form');if(f){f.elements.day.value=entry.day;f.elements.type.value=entry.type;f.elements.note.value=entry.note;f.elements.initiator.value=entry.initiator;}error=ex.message;}




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
    try {const data=new FormData(form);if(state)await addCapture(data.get('title'),data.get('note'));else await vault.appendSealedCapture(data.get('title'),data.get('note'));captureOverlayOpen=false;
      captureDraft={title:'',note:'',noteOpen:false};dashboardCaptureDraft='';captureSkipNextSnapshot=true;
      notice=state?'Sicher in deiner Inbox gespeichert'+(authToken?' · Cloud-Abgleich vorgemerkt':' · nur auf diesem Gerät')+'.':'Verschlüsselt vorgemerkt. Nach dem Entsperren gelangt der Eintrag in deine Inbox.';error='';render();
    }catch(ex){if(submit)submit.disabled=false;toast(ex.message,true);}
  });
  const outlookDetails=app.querySelector('#outlook724-details');if(outlookDetails)outlookDetails.ontoggle=()=>{outlook724Open=outlookDetails.open;};
  const outlookKey=app.querySelector('#outlook724-key');if(outlookKey)outlookKey.oninput=()=>{outlook724Token=outlookKey.value;};
  const outlookPort=app.querySelector('#outlook724-port');if(outlookPort)outlookPort.oninput=()=>{outlook724Port=Number(outlookPort.value)||8765;};
  const outlookFile=app.querySelector('#outlook724-file');if(outlookFile)outlookFile.onchange=async()=>{
    try{const file=outlookFile.files?.[0];if(!file)return;if(file.size>150000)throw Error('Datei zu groß (max. 150 KB).');
      outlook724Preview=outlookCandidates(await file.text(),state?.outlookBridgeImported||{}).filter(x=>!x.alreadyImported);
      outlook724Status=outlook724Preview.length?`${outlook724Preview.length} neue Nachrichten in der Vorschau.`:'Keine neuen markierten Nachrichten in dieser Datei.';
      render();
    }catch(ex){outlook724Status='Import fehlgeschlagen: '+ex.message;render();}
  };
  const outlookConfirm=app.querySelector('#outlook724-confirm');if(outlookConfirm)outlookConfirm.onsubmit=async ev=>{
    ev.preventDefault();
    try{
      const selected=chooseOutlookItems(outlook724Preview,new FormData(outlookConfirm),state?.outlookBridgeImported||{});
      if(!selected.length)return toast('Bitte mindestens eine neue Nachricht auswählen.',true);
      if(!confirm(`${selected.length} Outlook-Markierungen in Compass übernehmen? Die Titel werden Teil deines verschlüsselten lokalen Tresors; bei aktivem Cloud-Abgleich auch über die Aufgaben-/Inbox-Synchronisierung übertragen. Keine E-Mail wird verändert.`))return;
      const at=stamp(),prepared=selected.map(x=>({sourceId:x.id,kind:x.kind,entryId:crypto.randomUUID(),at,title:x.title}));
      await mutate(s=>{
        s.outlookBridgeImported??={};
        for(const item of prepared){
          if(s.outlookBridgeImported[item.sourceId])continue;
          const source={id:item.sourceId,title:item.title};
          if(item.kind==='inbox'){
            const record=outlookInboxRecord(source,item.entryId,item.at,item.title);
            s.records[record.id]=record;s.pending.push(makeMutation(record));s.history.push({type:'captured',at:item.at,id:record.id});
          }else{
            const task=outlookTask(source,item.entryId,item.at,item.kind,item.title);
            if(!validLocalTask(task))throw Error('Outlook-Aufgabe nicht gültig.');
            s.tasks[task.id]=task;s.taskPending[task.id]=true;
          }
          s.outlookBridgeImported[item.sourceId]={id:item.entryId,at:item.at,kind:item.kind};
        }
      });
      outlook724Preview=outlook724Preview.filter(x=>!selected.some(y=>y.id===x.id));outlook724Status=`${selected.length} Einträge übernommen · Outlook unverändert.`;render();
    }catch(ex){outlook724Status='Übernahme fehlgeschlagen: '+ex.message;render();}
  };
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
  compass55BindWaitingForm();
  const taskForm=app.querySelector('#task-create-form');if(taskForm)taskForm.onsubmit=async ev=>{
    ev.preventDefault();const fd=new FormData(taskForm);
    const t={id:crypto.randomUUID(),title:String(fd.get('title')||'').trim(),note:'',plannedDate:fd.get('plannedDate')||null,dueDate:fd.get('dueDate')||null,category:fd.get('category')||'Allgemein',completed:false,archived:false,workflow:fd.get('workflow')||'next',flagged:fd.has('flagged'),projectId:fd.get('projectId')||null,parentTaskId:fd.get('parentTaskId')||null,sortOrder:0,tags:parseTags(fd.get('tags')),deferUntil:fd.get('deferUntil')||null,contextTags:parseTags(fd.get('contextTags')),estimateMinutes:fd.get('estimateMinutes')?Number(fd.get('estimateMinutes')):null,progressTarget:fd.get('progressTarget')?Number(fd.get('progressTarget')):null,progressCurrent:0,updatedAt:stamp()};
    if(treeCreateKind==='task'&&treeCreateParent&&state.projects?.[treeCreateParent]?.isTemplate)t.projectId=treeCreateParent;
    if(!validLocalTask(t)||!validTaskParent(state,t.id,t.projectId,t.parentTaskId)||t.projectId&&!state.projects?.[t.projectId]){toast('Aufgabenfelder bzw. Hierarchie prüfen. Bitte Projektzuordnung kontrollieren.',true);return;}
    t.sortOrder=Math.min(1000000,100+Math.max(0,...taskChildren(state,t.projectId,t.parentTaskId).map(x=>x.sortOrder||0)));
    const beforeUi={selectedTaskId,selectedProjectId,treeCreateKind,treeCreateParent,treeTaskParent};
    try{
      await mutate(s=>{prepareTasks(s);s.tasks[t.id]=t;s.taskPending[t.id]=true;for(const tag of [...t.tags,...t.contextTags])rememberTag(s,tag);},taskForm,true,{
       fastPlanning:true,onApplied:()=>{selectedTaskId=t.id;selectedProjectId=t.projectId;treeCreateKind='';treeCreateParent=null;treeTaskParent=null;},
       onFailed:()=>{({selectedTaskId,selectedProjectId,treeCreateKind,treeCreateParent,treeTaskParent}=beforeUi);}
      });toast('Aufgabe lokal gespeichert.');
    }catch(ex){toast(ex.message,true);}
  };
  compass55BindTaskEditForm();
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
    ev.preventDefault();if(projectCreating48)return;const d=new FormData(projectCreate);const project={id:crypto.randomUUID(),title:String(d.get('title')||'').trim(),outcome:String(d.get('outcome')||'').trim(),category:d.get('category')||'Allgemein',status:'active',dueDate:null,reviewIntervalDays:Number(d.get('reviewIntervalDays')||7),reviewedAt:null,kind:d.get('kind')||'project',folderIcon:d.get('kind')==='folder'?'folder':null,isTemplate:false,projectType:d.get('projectType')||'parallel',parentId:d.get('parentId')||null,sortOrder:0};
    if(!validProject(project)||!validProjectParent(state,project.id,project.parentId)){toast('Projektangaben bzw. Ordnerhierarchie prüfen.',true);return;}
    const dupe=duplicateProject48(state,project);if(dupe){toast('Ein Projekt oder Ordner mit diesem Namen existiert hier bereits. Zum Anlegen eines zweiten bitte einen anderen Namen verwenden.',true);return;}
    project.sortOrder=Math.min(1000000,100+Math.max(0,...childProjects(state,project.parentId).map(x=>x.sortOrder||0)));
    const beforeUi={selectedProjectId,treeCreateKind,treeCreateParent,treeTaskParent};
    try{
      projectCreating48=true;projectCreate.querySelector('[type="submit"]').disabled=true;
      await mutate(s=>{s.projects[project.id]=project;s.projectPending[project.id]=true;},projectCreate,true,{
       fastPlanning:true,onApplied:()=>{selectedProjectId=project.id;treeCreateKind='';treeCreateParent=null;treeTaskParent=null;},
       onFailed:()=>{({selectedProjectId,treeCreateKind,treeCreateParent,treeTaskParent}=beforeUi);}
      });
    }catch(ex){toast(ex.message,true);}
    finally{projectCreating48=false;if(projectCreate.isConnected)projectCreate.querySelector('[type="submit"]').disabled=false;}
  };
  const projectEdit=app.querySelector('#project-edit-form');if(projectEdit)projectEdit.onsubmit=async ev=>{
    ev.preventDefault();const id=projectEdit.dataset.id;const d=new FormData(projectEdit);const project={...state.projects[id],title:String(d.get('title')||'').trim(),outcome:String(d.get('outcome')||'').trim(),category:d.get('category')||'Allgemein',status:d.get('status')||'active',dueDate:d.get('dueDate')||null,reviewIntervalDays:Number(d.get('reviewIntervalDays')||7),kind:d.get('kind')||'project',folderIcon:d.get('kind')==='folder'?(d.get('folderIcon')||'folder'):null,isTemplate:d.has('isTemplate'),projectType:d.get('projectType')||'parallel',parentId:d.get('parentId')||null};
    if(!validProject(project)||!validProjectParent(state,id,project.parentId)){toast('Projektangaben bzw. Ordnerhierarchie prüfen.',true);return;}
    if(project.kind==='folder'&&state.projects[id].kind!=='folder'&&projectTasks(state,id).length){toast('Ein Projekt mit Aufgaben kann nicht in einen Ordner umgewandelt werden.',true);return;}
    await mutate(s=>{s.projects[id]=project;s.projectPending[id]=true;},projectEdit);toast('Projekt gespeichert.');
  };
  const agendaForm=app.querySelector('#agenda-note-form');if(agendaForm)agendaForm.onsubmit=async ev=>{
    ev.preventDefault();const d=new FormData(agendaForm);const t={id:crypto.randomUUID(),title:String(d.get('title')||'').trim(),note:'',category:'Meeting',plannedDate:null,dueDate:null,workflow:'next',flagged:false,projectId:null,tags:parseTags([d.get('tag')]),completed:false,archived:false};
    if(!validLocalTask(t)){toast('Agendapunkt prüfen.',true);return;}
    await mutate(s=>{s.tasks[t.id]=t;s.taskPending[t.id]=true;});toast('Agendapunkt für das Meeting angelegt.');
  };
  const dreamCreate=app.querySelector('#dream-create-form');if(dreamCreate)dreamCreate.onsubmit=async ev=>{
    ev.preventDefault();const data=new FormData(dreamCreate),title=String(data.get('title')||'').trim(),category=String(data.get('category')||'ideen');
    if(!title||title.length>1000||!DREAM_CATEGORIES.some(([key])=>key===category)){toast('Dreams-Eingabe prüfen.',true);return;}
    const id=crypto.randomUUID();await mutate(s=>{const r={id,title,note:'',tags:['dreams','dream-'+category],deleted:false,updatedAt:stamp()};s.records[id]=r;s.pending.push(makeMutation(r));s.history.push({type:'dream-captured',at:stamp(),id});},dreamCreate);selectedDreamId=id;toast('Idee in Dreams gespeichert.');
  };
  const dreamEdit=app.querySelector('#dream-edit-form');if(dreamEdit)dreamEdit.onsubmit=async ev=>{
    ev.preventDefault();const id=dreamEdit.dataset.id,fd=new FormData(dreamEdit);const title=String(fd.get('title')||'').trim(),note=String(fd.get('note')||'').trim(),category=String(fd.get('category')||'ideen');
    if(!title||title.length>1000||note.length>10000||!DREAM_CATEGORIES.some(([key])=>key===category)){toast('Dreams-Felder prüfen.',true);return;}
    await mutate(s=>{const r=s.records[id];if(!r||r.deleted)return;r.title=title;r.note=note;r.tags=parseTags(['dreams','dream-'+category,...(r.tags||[]).filter(t=>t!=='dreams'&&!t.startsWith('dream-'))]);r.updatedAt=stamp();s.pending.push(makeMutation(r));},dreamEdit);toast('Dream aktualisiert.');
  };
  const editForm=app.querySelector('#inbox-edit-form');if(editForm)editForm.onsubmit=async ev=>{
    ev.preventDefault();const id=editForm.dataset.id;const form=new FormData(editForm);
    const title=String(form.get('title')||'').trim(),note=String(form.get('note')||'').trim(),tags=parseTags(form.get('tags'));
    if(!title||title.length>1000||note.length>10000){toast('Bitte Titel und Notizlänge prüfen.',true);return;}
    const existing=state.records[id];if(!existing||existing.deleted)return;
    const intent=ev.submitter?.value||'save';
    if(intent==='dream'){
      const category=String(form.get('dreamCategory')||'ideen');
      if(!DREAM_CATEGORIES.some(([key])=>key===category)){toast('Ungültige Dreams-Kategorie.',true);return;}
      try{await mutate(s=>{const record=s.records[id];if(!record||record.deleted)throw Error('Eintrag bereits geklärt.');
        record.title=title;record.note=note;record.tags=parseTags(['dreams','dream-'+category,...tags.filter(tag=>tag!=='dreams'&&!tag.startsWith('dream-'))]);
        record.updatedAt=stamp();s.pending.push(makeMutation(record));s.history.push({type:'dream-classified',at:record.updatedAt,id});
      },editForm);selectedInboxId=null;selectedDreamId=id;toast('Eintrag zu Dreams / Someday–Maybe verschoben.');}
      catch(ex){toast(ex.message,true);}
      return;
    }
    if(intent==='promote'){
      try{
        const task=inboxTaskDraft(state,id,{title,note,tags,projectId:form.get('projectId'),workflow:form.get('workflow')},crypto.randomUUID(),stamp());
        await mutate(s=>{if(!s.records[id]||s.records[id].deleted)throw new Error('Inbox-Eintrag wurde bereits geklärt.');
          s.tasks[task.id]=task;s.taskPending[task.id]=true;
          s.records[id].deleted=true;s.records[id].updatedAt=stamp();s.pending.push(makeMutation(s.records[id]));
          for(const tag of task.tags)rememberTag(s,tag);
        },editForm);
        selectedInboxId=null;selectedTaskId=task.id;toast('Eintrag als Aufgabe übernommen und aus der Inbox entfernt.');
      }catch(ex){toast(ex.message,true);}
      return;
    }
    let savedTags;try{savedTags=setInboxFlag(tags,inboxFlagged(existing));}catch(ex){toast(ex.message,true);return;}
    if(existing.title===title&&(existing.note||'')===note&&JSON.stringify(existing.tags||[])===JSON.stringify(savedTags)){notice='Keine Änderungen.';render();return;}
    try{await mutate(s=>{const r=s.records[id];r.title=title;r.note=note;r.tags=savedTags;r.updatedAt=stamp();s.pending.push(makeMutation(r));},editForm);notice='Änderungen lokal gespeichert.';render();}
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
  const discoveryForm=app.querySelector('#discovery-import-form');if(discoveryForm){
    const field=discoveryForm.elements.namedItem('events');
    if(field)field.oninput=()=>{discoveryImportDraft=field.value;discoveryImportError='';discoveryImportPreview=null;const feedback=app.querySelector('#discovery-import-feedback');if(feedback)feedback.hidden=true;};
    discoveryForm.onsubmit=async ev=>{ev.preventDefault();
      discoveryImportDraft=String(new FormData(discoveryForm).get('events')||'');
      try{
        const result=isCinemaDetailsJSON(discoveryImportDraft)?parseCinemaDetailsImport(discoveryImportDraft,state?.discoveredEvents||[]):parseEventImport(discoveryImportDraft,state?.discoveredEvents||[]);
        discoveryImportPreview=result;discoveryImportError='';render();
        requestAnimationFrame(()=>app.querySelector('.discovery-import-preview')?.scrollIntoView({block:'nearest'}));
      }catch(ex){
        discoveryImportPreview=null;discoveryImportError=String(ex.message||ex);render();
        requestAnimationFrame(()=>app.querySelector('#discovery-import-feedback')?.scrollIntoView({block:'nearest'}));
      }
    };
  }
  for(const key of ['health-day-details','health-device-details']){const el=app.querySelector('#'+key);if(el)el.ontoggle=()=>{if(key==='health-day-details')healthDetailsOpen=el.open;else healthDevicesOpen=el.open;};}
  app.querySelectorAll('[data-discovery-filter]').forEach(el=>el.onchange=()=>{if(el.dataset.discoveryFilter==='city')discoveryCity=el.value;else if(el.dataset.discoveryFilter==='area')discoveryArea=el.value;else discoveryCategory=el.value;render();});
  app.querySelectorAll('[data-discovery-category]').forEach(el=>el.onchange=()=>{discoveryCategories=toggleEventCategory(discoveryCategories,el.dataset.discoveryCategory,el.checked,EVENT_CATEGORIES);discoveryCategoriesOpen=true;render();});
  const filmSearch=app.querySelector('#discovery-film-search');if(filmSearch)filmSearch.oninput=ev=>{discoveryCinemaQuery=ev.target.value;discoveryFilmLimit=36;const caret=ev.target.selectionStart??discoveryCinemaQuery.length;render();const next=app.querySelector('#discovery-film-search');if(next){next.focus();try{next.setSelectionRange(caret,caret);}catch{}}};
  app.querySelectorAll('.discovery-film-poster img').forEach(img=>{img.onerror=()=>{if(!brokenPosterUrls.has(img.src)){brokenPosterUrls.add(img.src);render();}};});
  // A preview may fail even after the image probe (temporary hotlink block or stale CDN).
  // Do not leave a checked, broken image among the recommendations.
  app.querySelectorAll('[data-poster-preview-key]').forEach(img=>img.onerror=()=>{
   const failed=(posterLookupResult?.suggestions||[]).find(x=>x.key===img.dataset.posterPreviewKey&&x.imageUrl===img.src);
   if(!failed)return;
   brokenPosterUrls.add(failed.imageUrl);
   posterLookupSelected.delete(failed.key);
   posterLookupResult={...posterLookupResult,
    suggestions:posterLookupResult.suggestions.filter(x=>x!==failed),
    unavailable:[...(posterLookupResult.unavailable||[]),failed]};
   render();
  });
  app.querySelectorAll('[data-discovery-poster-key]').forEach(el=>el.onchange=()=>{if(el.checked)posterLookupSelected.add(el.dataset.discoveryPosterKey);else posterLookupSelected.delete(el.dataset.discoveryPosterKey);const apply=app.querySelector('[data-action=discovery-poster-apply]');if(apply){apply.textContent=`Ausgewählte Poster übernehmen (${posterLookupSelected.size})`;apply.disabled=!posterLookupSelected.size;}});
  app.querySelectorAll('.discovery-poster-suggestion img').forEach(img=>{img.onerror=()=>{img.style.opacity='.25';img.title='Bild konnte nicht geladen werden';};});
  const posterManualForm=app.querySelector('#discovery-poster-manual-form');if(posterManualForm)posterManualForm.onsubmit=async ev=>{ev.preventDefault();const filmKey=posterManualKey,film=groupCinemaScreenings(state?.discoveredEvents||[]).find(f=>f.key===filmKey),url=String(new FormData(posterManualForm).get('posterUrl')||'').trim();if(!film)return;const suggestion={key:filmKey,title:film.title,imageUrl:url,sourceUrl:url,provider:'Manuell'};if(!validPosterSuggestion(suggestion)){toast('Bitte einen gültigen direkten HTTPS-Bildlink eingeben.',true);return;}const ok=await verifyPosterImage(url);if(!ok){toast('Dieses Bild konnte im Browser nicht geladen werden. Prüfe, ob es eine direkt zugängliche Bilddatei ist.',true);return;}await mutate(st=>{for(const e of [...(st.discoveredEvents||[])]){const updated=applyPosterToEvent(e,suggestion,new Date().toISOString());if(updated!==e)queueEvent(st,updated);}});brokenPosterUrls.delete(url);posterManualKey='';toast('Poster gespeichert – alle bestehenden Vorführungen des Films aktualisiert.');};
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
    if(state?.privateDeviceMirror?.mode==='receiver'){
     // Do not modify the mirrored bank record or create unreviewed merchant rules on the phone.
     await mutate(s=>{queueFinanceMobileDecision(s,id,category,flow,new Date().toISOString(),crypto.randomUUID(),remember);});
     toast('Zuordnung verschlüsselt vorgemerkt. Auf dem Hauptgerät nach dem Abgleich wirksam.');return;
    }
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
    try{
      if(state?.privateDeviceMirror?.mode==='receiver'){
       // Expanded groups are explicit opt-in. Only the known matching book entries are queued.
       const candidateRows=applyAll?(state.financeTransactions||[]).filter(t=>t.needsReview&&merchantKey(t.merchant)===merchantKey(old.merchant)&&(t.amountCents>0)===(old.amountCents>0)&&t.flow===old.flow):[old];
       await mutate(s=>{for(const row of candidateRows)queueFinanceMobileDecision(s,row.id,category,flow,new Date().toISOString(),crypto.randomUUID(),remember);});
       toast(`${candidateRows.length} Zuordnung(en) verschlüsselt für das Hauptgerät vorgemerkt.`);return;
      }
      let approved=0;await mutate(s=>{s.financeTransactions??=[];s.financeRules??=[];
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
    try{const quick=true;
      await mutate(s=>moveTaskHierarchy(s,taskId,type,targetId,'inside'),null,quick,quick?{fastPlanning:true,fastGtd:true,onApplied:()=>{selectedProjectId=state.tasks[taskId].projectId;}}:null);
      if(!quick)selectedProjectId=state.tasks[taskId].projectId;
    }catch(ex){toast(ex.message,true);}
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
      try{const quick=true;
        const updateSelection=()=>{if(payload.type==='project')selectedProjectId=payload.id;
          else {selectedProjectId=state.tasks[payload.id].projectId;selectedTaskId=payload.id;}};
        await mutate(s=>payload.type==='project'?moveProjectHierarchy(s,payload.id,targetId,where):moveTaskHierarchy(s,payload.id,targetType,targetId,where),null,quick,
          quick?{fastPlanning:true,fastGtd:true,onApplied:updateSelection}:null);
        if(!quick){updateSelection();render();}
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
  const ownInput=app.querySelector('#fw705-search-input');if(ownInput)ownInput.oninput=()=>{
    feelingDraft.ownWords=ownInput.value;
    // Updating just the connected word cloud avoids rebuilding the input and
    // interrupting the mobile keyboard/caret after every keystroke.
    const results=app.querySelector('#fw705-network-results');if(results)results.innerHTML=renderFeelingNetwork(feelingDraft);
    const save=app.querySelector('.fw65-actions [data-action="feeling-save"]');if(save)save.disabled=(!state&&!sealedCaptureAvailable)||!(Object.keys(feelingDraft.selected||{}).length||feelingDraft.ownWords.trim()||feelingDraft.networkTerms?.length);
  };
  const netContainer=app.querySelector('#fw705-network-results');if(netContainer)netContainer.onclick=ev=>{
    const control=ev.target.closest('[data-action="feeling-network-term"]');if(!control||!netContainer.contains(control))return;
    runAction('feeling-network-term',control.dataset.id);
  };
  const feelingNote=app.querySelector('#fw65-note');if(feelingNote)feelingNote.oninput=()=>{feelingDraft.note=feelingNote.value;};
  const feelingHypothesis=app.querySelector('#fw681-hypothesis');if(feelingHypothesis)feelingHypothesis.oninput=()=>{feelingDraft.hypothesis=feelingHypothesis.value;};
  app.querySelectorAll('[data-feeling-intensity]').forEach(el=>el.oninput=()=>{
    try{feelingDraft=intensityFor(feelingDraft,el.dataset.feelingIntensity,Number(el.value));
      const card=el.closest('.fw65-intensity'),def=FEELINGS.find(x=>x.id===el.dataset.feelingIntensity);
      if(card){const name=card.querySelector('.fw65-word');if(name)name.textContent=feelingWord(def.id,Number(el.value));const value=card.querySelector('.fw65-intensity-head strong');if(value)value.textContent=el.value+'/10';card.querySelectorAll('.fw65-words span').forEach((node,i)=>node.classList.toggle('active',i===Math.floor((el.value-1)/2)));card.querySelectorAll('.fw681-scale-step').forEach((node,i)=>{node.classList.toggle('active',i===Number(el.value)-1);node.setAttribute('aria-pressed',String(i===Number(el.value)-1));});const presence=card.querySelector('.fw681-presence strong');if(presence)presence.textContent=Number(el.value)<=2?'Sehr leise wahrnehmbar':Number(el.value)<=4?'Leicht spürbar':Number(el.value)<=6?'Deutlich präsent':Number(el.value)<=8?'Nimmt viel Raum ein':'Sehr intensiv und vereinnahmend';}
    }catch{}
  });
  app.querySelectorAll('.fw65-emotion').forEach(el=>{el.onmouseenter=()=>{const def=FEELINGS.find(x=>x.id===el.dataset.id),hint=app.querySelector('#fw65-hint');if(def&&hint)hint.textContent=def.label+' · '+def.description;};el.onmouseleave=()=>{const hint=app.querySelector('#fw65-hint');if(hint)hint.textContent='Wähle ein oder mehrere Gefühle.';};});
  app.querySelectorAll('.ni725-dot').forEach(dot=>dot.onkeydown=ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();runAction('ni725-event',dot.dataset.id);}});
 compass55BindDataActions(app);
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
 if(action==='ctx46-cycle'){
  if(!state)return;
  const from=effectiveContext39(state).kind;
  const next=nextLocationContext46(from);
  await mutate(s=>{s.locationContext39??={};s.locationContext39.mode='manual';s.locationContext39.manual=next;});
  return;
 }
 if(action==='forecast-inspector-close'){forecastInspectorOpen401=false;selectedTaskId=null;render();return;}
 if(action==='ctx40-toggle'){ctx40Expanded=!ctx40Expanded;if(ctx40Expanded&&selectedDay!==localDate())selectedDay=localDate();render();return;}
 if(action==='ctx40-minutes'){
  if(!state||!MINUTES40.includes(Number(id)))return;
  await mutate(s=>{s.uiPreferences??={};s.uiPreferences.dailyMinutes=Number(id);});return;
 }
 if(action==='ctx40-energy'){
  if(!state||!ENERGY40.includes(id))return;
  await mutate(s=>{s.uiPreferences??={};s.uiPreferences.dailyEnergy=id;});return;
 }
 if(action==='ctx40-skip'){
  if(!state?.tasks?.[id])return;
  await mutate(s=>{dismissTask40(s,id,localDate());});return;
 }
 if(action==='ctx40-reset'){
  if(!state)return;
  await mutate(s=>{s.contextRecommendations40??={};s.contextRecommendations40.dismissed={};});return;
 }
 if(action==='ctx40-task'){
  if(!state?.tasks?.[id])return;
  selectedTaskId=id;todayInspectorOpen=true;render();
  if(window.matchMedia?.('(max-width:800px)')?.matches)requestAnimationFrame(()=>app.querySelector('.today-focus-inspector')?.scrollIntoView?.({behavior:'smooth',block:'start'}));
  return;
 }
 
 if(action==='ctx39-manual'){
  if(!['home','work','away','unknown'].includes(id)||!state)return;
  await mutate(s=>{s.locationContext39??={};s.locationContext39.mode='manual';s.locationContext39.manual=id;});return;
 }
 if(action==='ctx39-auto'){
  if(!state)return;
  const old=locationSettings39(state);
  if(old.mode==='auto'){await mutate(s=>{s.locationContext39??={};s.locationContext39.mode='manual';s.locationContext39.manual=old.manual;});return;}
  if(!Object.keys(old.zones).length)return toast('Bitte zuerst Zuhause oder Arbeit als Ortszone festlegen.',true);
  await mutate(s=>{s.locationContext39??={};s.locationContext39.mode='auto';});
  await ctx39LocateAndSave(null);return;
 }
 if(action==='ctx39-set-zone'){
  if(!state||!['home','work'].includes(id))return;
  const radius=Number(app.querySelector('#ctx39-radius')?.value||300);
  await ctx39LocateAndSave(id,radius);return;
 }
 if(action==='ctx39-clear-zone'){
  if(!state||!['home','work'].includes(id))return;
  await mutate(s=>{s.locationContext39??={};s.locationContext39.zones??={};delete s.locationContext39.zones[id];s.locationContext39.last=null;});return;
 }
 if(action==='ctx39-check'){if(state)await ctx39LocateAndSave(null);return;}
 if(action==='ctx39-task'){
  if(!state?.tasks?.[id])return;tab='next';calmNavGroup='plan';contextFilter='';selectedTaskId=id;render();return;
 }
 if(action==='ctx39-go'){
  if(!['next','people','forecast','insights','inbox'].includes(id))return;
  if(id==='people'){familyRadarJumpPersonId401=null;peopleScope=state&&effectiveContext39(state).kind==='work'?'work':'all';peopleTab='list';peopleShowAll=false;selectedPersonId=null;}if(id==='forecast')forecastInspectorOpen401=false;tab=id;if(id==='next'||id==='forecast')calmNavGroup='plan';
  if(id==='insights'){calmNavGroup='insights';insightTab='habits';}
  if(id==='next')contextFilter='';
  render();return;
 }
 if(action==='fr38-routine-save'){
  const person=state?.people?.[id],form=app.querySelector('#fr38-routine-form');
  if(!person||!form||form.dataset.person!==id||!familyRules(state,person).enabled)return;
  const data=new FormData(form),arrivalHour=Number(data.get('arrivalHour')),footballMinutes=Number(data.get('footballMinutes'));
  const weekdays=[...new Set(data.getAll('weekday').map(Number))].filter(n=>Number.isInteger(n)&&n>=0&&n<=6);
  if(![18,19,20,21].includes(arrivalHour)||![0,30,45,60,75].includes(footballMinutes))return toast('Bitte gültigen Abendrhythmus auswählen.',true);
  await mutate(s=>{s.familyRadar??={};s.familyRadar.availability??={};s.familyRadar.availability[id]={arrivalHour,footballMinutes,weekdays,updatedAt:stamp()};});
  toast('Abendrhythmus gespeichert; Anwesenheit bleibt bei unbekannten Tagen offen.');return;
 }
 if(action==='daynav38'){
  if(tab!=='today')return;
  const day=id==='today'?localDate():previousLocalDay(selectedDay);
  const next=id==='next'?new Date(Date.parse(selectedDay+'T12:00:00Z')+86400000).toISOString().slice(0,10):day;
  if(!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(next))return;
  selectedDay=next;manuallyChosenDay=id!=='today';todayInspectorOpen=false;calendarMonth=new Date(next+'T12:00:00');render();return;
 }
 if(action==='balance-view38'){
  if(!['all','health','life'].includes(id))return;
  balancePerspectiveChoice38=id;balanceSelectedAxis=null;render();return;
 }
 if(action==='balance38-select'){balanceSelectedAxis=id||null;render();return;}
 if(action==='fr371-plan'){
  // Existing Today projection already owns the event. Do not fetch Calendar or create a task.
  if(!state||!calendarEvents.some(e=>e.id===id&&e.status!=='cancelled'))return;
  familyStudyEventId37=id;forecastInspectorOpen401=false;tab='forecast';calmNavGroup='plan';
  render();
  requestAnimationFrame(()=>app.querySelector('.fr37-forecast')?.scrollIntoView({block:'start',behavior:'smooth'}));
  return;
 }
 if(action==='fr37-open'){familyStudyEventId37=familyStudyEventId37===id?'':id;render();return;}
 if(action==='fr37-book'){
  const today=localDate(),e=familyForecastEntries37(calendarEvents,state?.people||{},state,{today}).find(x=>x.id===id);
  const person=e&&state.people?.[e.personId];
  if(!person)return toast('Familienzuordnung nicht mehr verfügbar.',true);
  const model=familyStudySlots37(calendarEvents,e,calendarCoverage,calendarUpdatedAt,{now:new Date(),today,familyRadar:state?.familyRadar});
  const slot=model.status==='ready'&&model.slots.find(x=>x.day===plannerDay&&x.start===Number(stepId));
  if(!slot)return toast('Zeitfenster nicht mehr bestätigt. Bitte Kalender aktualisieren.',true);
  let result;
  await mutate(s=>{result=familyCreateStudy37(s,e,person,slot,{today,uuid:()=>crypto.randomUUID()});if(result.created&&!validLocalTask(result.created))throw Error('Lernaufgabe nicht gültig.');});
  toast(result.created?'Lernzeit als Aufgabe vorgemerkt – kein Kalendereintrag angelegt.':'Diese Lernzeit ist bereits vorgemerkt.');return;
 }
 if(action==='fr31-person'&&state?.people?.[id]){familyRadarJumpPersonId401=id;selectedPersonId=id;peopleTab='list';peopleScope='all';tab='people';calmNavGroup='';render();return;}
 if(action==='fr31-rules-save'){
  const person=state?.people?.[id],form=app.querySelector('#fr31-settings-form');if(!person||!form||form.dataset.person!==id)return;
  const data=new FormData(form),mathLead=Number(data.get('mathLead')),deadlineLead=Number(data.get('deadlineLead'));
  if(!Number.isInteger(mathLead)||mathLead<1||mathLead>60||!Number.isInteger(deadlineLead)||deadlineLead<1||deadlineLead>90)return toast('Bitte gültige Vorlaufzeiten eingeben.',true);
  await mutate(s=>{s.familyRadar??={};s.familyRadar.rules??={};s.familyRadar.rules[id]={role:['child','off','information'].includes(data.get('role'))?data.get('role'):'off',enabled:data.has('enabled')&&data.get('role')==='child',mathSupport:data.has('mathSupport'),mathLead,deadlineLead,otherExams:data.get('otherExams')==='support'?'support':'observe',updatedAt:stamp()};});toast('Familiäre Unterstützungsregeln gespeichert.');return;
 }
 if(['fr31-accept','fr31-project','fr31-dismiss','fr31-snooze'].includes(action)){
  if(!state)return;
  const proposals=familySuggestions(calendarEvents.filter(e=>!eventAppearance(e).hidden||showHiddenCalendarEvents),state.people||{},state,{today:localDate()});
  const chosen=proposals.find(x=>x.key===id);if(!chosen)return;
  if(action==='fr31-project'){
   if(chosen.action.kind!=='organise')return;
   const person=state.people[chosen.personId];if(!person)return;
   let created;
   await mutate(s=>{created=familyAcceptProject(s,chosen,person,{today:localDate(),uuid:()=>crypto.randomUUID()});if(created.project&&(!validProject(created.project)||!validProject(created.folder)||created.tasks.some(t=>!validLocalTask(t))))throw Error('Familien-Projektplan ungültig.');});
   toast(created.project?'Familienprojekt und vier Schritte angelegt.':'Projekt existiert bereits.');return;
  }
  if(action==='fr31-accept'){
   const person=state.people[chosen.personId];
   if(!person)return;
   let result;
   await mutate(s=>{result=familyAccept(s,chosen,person,{today:localDate(),uuid:()=>crypto.randomUUID()});if(result.created.some(t=>!validLocalTask(t)))throw Error('Familienaufgabe konnte nicht validiert werden.');});
   toast(result.created.length?(result.created.length===2?'Zwei Lernaufgaben übernommen.':'Vorbereitungsaufgabe übernommen.'):'Aufgabe bereits vorhanden.');return;
  }
  await mutate(s=>familyChoose(s,chosen.key,action==='fr31-dismiss'?'dismissed':'snoozed',localDate()));
  toast(action==='fr31-snooze'?'Familienhinweis für drei Tage zurückgestellt.':'Familienhinweis verworfen.');return;
 }
 if(action==='cm930-menu-toggle'){cm930MobileMenuOpen=!cm930MobileMenuOpen;render();return;}
 // Handle Extended navigation before the legacy action branches. Do not rewrite
 // the old calm-nav-group handler: previous bridges may already have changed it.
 // Focus mode falls through unchanged to the existing implementation.
 if(action==='calm-nav-group'&&compass55Mode==='extended'){
  calmNavGroup=calmNavGroup===id?'':id;
  cm930MobileMenuOpen=true;
  render();return;
 }
 if(action==='clp-preview'){
  if(!state)return;
  const params={...lifeReportSettings,now:localDate()};
  const facts=reportEvidence(state,params).facts;
  const guidance=reportRecommendations(state,params).map(a=>({id:a.id,text:a.observation,detail:a.suggestion}));
  const evidence=[...facts,...guidance];
  const allow=lifeReportSettings.rankedIds?.length===evidence.length&&evidence.every(f=>lifeReportSettings.rankedIds.includes(f.id));
  // Open synchronously from the user click to avoid the popup blocker.
  const reportWindow=window.open('','_blank');
  if(!reportWindow){toast('Druckvorschau blockiert. Bitte Pop-ups für Compass erlauben.',true);return;}
  try{
   reportWindow.opener=null;
   reportWindow.document.open();
   const annualAnatomy=await import('body-muscles').catch(err=>{console.warn('Premium-Anatomie nicht verfügbar:',err);return null;});
   reportWindow.document.write(annualDocument(state,{...lifeReportSettings,rankedIds:allow?lifeReportSettings.rankedIds:[],now:localDate(),anatomy:annualAnatomy}));
   reportWindow.document.close();
  }catch(ex){reportWindow.close();toast('Report konnte nicht erstellt werden: '+ex.message,true);}
  return;
 }
 if(action==='clp-ai'){
  if(!state)return;
  const params={...lifeReportSettings,now:localDate()};
  const facts=reportEvidence(state,params).facts;
  const guidance=reportRecommendations(state,params).map(a=>({id:a.id,text:a.observation,detail:a.suggestion}));
  const evidence=[...facts,...guidance];
  if(!evidence.length){lifeReportSettings.aiStatus='Noch keine belegten Beobachtungen.';render();return;}
  if(!confirm('Nur die belegten, aggregierten Beobachtungen und daraus abgeleiteten Empfehlungen an LM Studio auf diesem Gerät (127.0.0.1) senden? Die lokale KI darf priorisieren, keine neuen Fakten oder Ratschläge erzeugen.'))return;
  lifeReportSettings.aiStatus='Lokale KI prüft die Reihenfolge der vorhandenen Fakten.';render();
  try{lifeReportSettings.rankedIds=await rankEvidenceLocally(evidence);lifeReportSettings.aiStatus='Beobachtungen und Empfehlungen lokal priorisiert. Keine neuen Aussagen erzeugt.';}
  catch(ex){lifeReportSettings.rankedIds=[];lifeReportSettings.aiStatus='Lokale Priorisierung nicht verfügbar: '+ex.message+'. Regelbasierte Reihenfolge bleibt erhalten.';}
  render();return;
 }
 if(action==='clp-refresh'){
   lifeReportSettings.aiStatus='Compass-Daten werden nach bestehenden Verbindungen aktualisiert. Für Garmin/Fitdays ggf. manuell importieren.';render();
   try{if(authToken){await reloadHealth();await reloadWatchSessions();}lifeReportSettings.aiStatus='Bestehende Compass-Verbindungen geprüft. Garmin-, Fitdays-, Bank- und Timeline-Importe können weiterhin fehlen.';}
   catch(ex){lifeReportSettings.aiStatus='Nicht alle Verbindungen erreichbar: '+ex.message;}
   render();return;
 }
 if(action==='outlook724-fetch'){
  const key=app.querySelector('#outlook724-key');if(key)outlook724Token=key.value.trim();
  const port=app.querySelector('#outlook724-port');if(port)outlook724Port=Number(port.value)||8765;
  if(!outlook724Token){outlook724Status='Bitte den Bridge-Schlüssel aus der Windows-Konsole eingeben.';render();return;}
  await outlook724Fetch();return;
 }
 if(action==='outlook724-clear'){outlook724Preview=[];outlook724Status='Vorschau verworfen. In Outlook wurde nichts verändert.';render();return;}
 if(action==='perf719-toggle'){performanceTrace.setEnabled(!performanceTrace.enabled);try{localStorage.setItem('compass.perf.v57719',performanceTrace.enabled?'on':'off');}catch{}render();return;}
 if(action==='perf719-clear'){performanceTrace.clear();render();return;}
 if(action==='perf719-export'){download('compass-performance-0.5.77.23.json',{version:COMPASS_CLIENT_VERSION,measurements:performanceTrace.entries(),summary:performanceTrace.summary()});return;}
 if(action==='people-sync719-toggle'){
  if(!state?.privateDeviceMirror?.key){toast('Zuerst den verschlüsselten Geräteabgleich einrichten.',true);return;}
  if(!state.peopleSyncEnabled&&!confirm('Kontaktprofile einschließlich persönlicher Notizen werden Ende-zu-Ende verschlüsselt mit deinem verbundenen Gerät abgeglichen. Wirklich aktivieren?'))return;
  await mutate(s=>{s.peopleSyncEnabled=!s.peopleSyncEnabled;});if(state.peopleSyncEnabled&&authToken)scheduleJournalSync(0);toast(state.peopleSyncEnabled?'Kontaktsynchronisierung aktiviert. Auch auf dem anderen Gerät einschalten.':'Kontaktsynchronisierung auf diesem Gerät deaktiviert. Lokale Profile bleiben erhalten.');return;
 }
 if(action==='people-sync719-now'){if(state?.peopleSyncEnabled&&state?.privateDeviceMirror?.key&&authToken){try{await syncPersonalJournal();toast('Verschlüsselter Kontaktabgleich geprüft.');}catch(ex){toast('Kontaktsynchronisierung: '+ex.message,true);}}return;}

 if(action==='mm571-view'){if(!state)return;morningTab=['routine','create','insights'].includes(id)?id:'routine';morningSettingsOpen=false;render();return;}
 if(action==='mm571-period'){morningPeriod=[7,30,90].includes(Number(id))?Number(id):30;render();return;}
 if(action==='mm571-affirmation-remove'){
   if(!state)return;try{await mutate(st=>removeMorningAffirmation(st,Number(id)));}catch(ex){toast(ex.message,true);}return;
 }
 if(action==='mm571-vision-remove'){
   if(!state)return;try{await mutate(st=>removeMorningVision(st,id));}catch(ex){toast(ex.message,true);}return;
 }
 if(action==='mm571-note-new'){
   if(!state)return;try{const idNew=crypto.randomUUID();await mutate(st=>putMorningNote(st,{id:idNew,text:'',day:localDate()}));morningJournalEditingId=idNew;morningJournalDraft=ensureMorning(state).notes.find(n=>n.id===idNew);render();}catch(ex){toast(ex.message,true);}return;
 }
 if(action==='mm571-note-open'){const row=ensureMorning(state).notes.find(n=>n.id===id&&!n.deleted);if(!row)return;morningJournalEditingId=id;morningJournalDraft={...row};render();return;}
 if(action==='mm571-note-close'){await morningFlushDraft();morningJournalEditingId='';morningJournalDraft=null;render();scheduleJournalSync(0);return;}
 if(action==='mm571-note-delete'){
   if(!state||!confirm('Journaleintrag wirklich löschen?'))return;try{await mutate(st=>removeMorningNote(st,id));morningJournalEditingId='';morningJournalDraft=null;render();}catch(ex){toast(ex.message,true);}return;
 }
 if(action==='mm570-settings'){if(!state)return toast('Konfiguration nur bei entsperrtem Tresor.',true);morningSettingsOpen=!morningSettingsOpen;render();return;}
 if(action==='mm570-open'){
   if(!state&&!sealedCaptureAvailable)return toast('Bitte einmal entsperren, damit die verschlüsselte Schnellerfassung eingerichtet wird.',true);
   morningRestoreConfig();
   if(!morningSession||morningSession.finishedAt)morningSession=newMorningSession(id==='quick'?MORNING_PRESETS.quick:morningConfig.durations);
   morningPublicWrite();habitQuickOpen=false;nutritionQuickOpen=false;captureOverlayOpen=false;feelingOverlayOpen=false;worktimeQuickOpen=false;morningPlayerOpen=true;render();return;
 }
 if(action==='mm570-close'){morningCloseOverlay();render();return;}
 if(action==='mm570-restart'){if(!confirm('Bisherigen Ablauf verwerfen und neue Morgenroutine starten?'))return;morningSession=newMorningSession(morningConfig.durations);morningPublicWrite();render();return;}
 if(action==='mm570-go-step'){if(!morningSession)return;const i=Number(id);if(Number.isInteger(i)&&i===morningSession.stepIndex){render();}return;}
 if(action==='mm570-start'||action==='mm570-pause'||action==='mm570-finish'||action==='mm570-skip'){
   if(!morningSession||morningSaving)return;
   morningSaveNoteFromScreen();const mode=action.split('-')[1];const next=transitionMorning(morningSession,mode,stamp());
   if(next.finishedAt){morningSaving=true;try{
      if(!state){await vault.appendSealedMorning(next);}
      else{journalSyncStatus='lokal';await mutate(st=>{storeMorningSession(st,next);sessionToMorningNote(st,next);delete ensureMorning(st).draft;if(next.steps?.some(step=>!step.skipped)){const habits=ensureHabitState(st);if(!habits.items.some(h=>h.id==='miracle-morning'))habits.items.push({id:'miracle-morning',title:'Miracle Morning',slot:'Morgen',active:true});setHabitDoneState(st,'miracle-morning',next.day||next.finishedAt.slice(0,10),true,next.finishedAt);}});}
      morningSession=null;morningPlayerOpen=false;morningPublicWrite();toast(!state?'Morning verschlüsselt vorgemerkt · nach Entsperren in der Historie.':'Morning abgeschlossen und verschlüsselt gespeichert.');
   }catch(ex){toast('Morning nicht gesichert: '+ex.message,true);}finally{morningSaving=false;}return;}
   morningSession=next;morningPublicWrite();render();return;
 }




 if(action==='insights-stress-prev'){insightStressPage=Math.max(-1000,insightStressPage-1);insightWellnessDay='';render();return;}
 if(action==='insights-stress-next'){insightStressPage=Math.min(0,insightStressPage+1);insightWellnessDay='';render();return;}
 if(action==='t577-open'||action==='t577-for-person'){
  if(!state)return toast('Bitte Tresor entsperren.',true);
  touchDefaultPersonId=action==='t577-for-person'&&state.people?.[id]?id:tab==='people'&&state.people?.[selectedPersonId]?selectedPersonId:'';
  touchQuickOpen=true;nutritionQuickOpen=false;habitQuickOpen=false;worktimeQuickOpen=false;captureOverlayOpen=false;feelingOverlayOpen=false;render();return;
 }
 if(action==='t577-capture-cancel'){
  // A click inside the dialog should never close it via the backdrop handler.
   touchQuickOpen=false;render();return;
 }
 if(action==='t577-show-history'){touchQuickOpen=false;tab='insights';insightTab='touch';calmNavGroup='insights';render();return;}
 if(action==='t577-close'){touchQuickOpen=false;render();return;}
 if(action==='t577-quick'){if(!state)return toast('Bitte Tresor entsperren.',true);if(!TOUCH_KINDS.some(k=>k.id===id))return;touchQuickOpen=true;render();return;}
 if(action==='t577-period'){touchPeriod=[7,30,90].includes(Number(id))?Number(id):30;touchEditingId='';render();return;}
 if(action==='t577-edit'){touchEditingId=id;render();return;}
 if(action==='t577-cancel'){touchEditingId='';render();return;}
 if(action==='t577-delete'){if(!state||!confirm('Diesen Nähe-Eintrag entfernen?'))return;try{await mutate(s=>deleteTouch(s,id));touchEditingId='';toast('Eintrag entfernt.');}catch(ex){toast(ex.message,true);}return;}
 if(action==='pj92-food-open'){if(!state&&!sealedCaptureAvailable)return toast('Bitte zuerst einmal den Tresor entsperren.',true);nutritionQuickOpen=true;habitQuickOpen=false;worktimeQuickOpen=false;feelingOverlayOpen=false;captureOverlayOpen=false;render();return;}
 if(action==='pj92-food-close'||action==='pj92-food-close-backdrop'){nutritionQuickOpen=false;render();return;}
 if(action==='pj92-food-insights'){nutritionView712='journal';nutritionQuickOpen=false;if(!state)return toast('Zum Ansehen der Ernährungshistorie bitte Tresor entsperren.',true);tab='insights';insightTab='nutrition';calmNavGroup='insights';render();return;}
 if(action==='meal723-add-ingredient'){
  if(!mealComposeModel||!['oil','dressing'].includes(id)||mealComposeModel.ingredients.some(x=>x.id===id))return;
  mealComposeModel.ingredients.push({id,grams:id==='oil'?10:20,assumed:true});
  mealComposeModel.warnings=(mealComposeModel.warnings||[]).filter(x=>id==='oil'?!/Bratöl/.test(x):!/Dressing/.test(x));
  const host=app.querySelector('#meal723-preview');if(host)host.innerHTML=mealPreviewMarkup(mealComposeModel);
  return;
 }
 if(action==='meal723-gpt-prompt'){
  const content=app.querySelector('#meal723-compose-form textarea[name="description"]')?.value||mealComposeText;
  mealComposeText=content.slice(0,1200);
  if(!mealComposeText.trim())return toast('Bitte zuerst das Gericht beschreiben.',true);
  try{await navigator.clipboard.writeText(gptMealPrompt(mealComposeText));toast('GPT-Auftrag kopiert · bei ChatGPT einfügen.');}
  catch(ex){toast('Kopieren nicht möglich. Browser-Zwischenablage bitte erlauben.',true);}
  return;
 }
 if(action==='pj92-food-tap'&&id==='mensa-study-veggie'){
  if(!state)return toast('Bitte Tresor entsperren, damit der Study-Teller eindeutig erfasst wird.',true);
  try{const {day,offer}=mensaQuickStatus();if(!offer)return toast('Heute kein Mensa-Menü gespeichert. Unter Insights → Ernährung → Mensa recherchieren und importieren.',true);
   let result;await mutate(st=>{result=logMensaMeal(st,day);},null,true);
   nutritionQuickOpen=false;render();toast(result.added?'Study-Teller für heute erfasst.':'Study-Teller ist heute bereits erfasst.');return;
  }catch(ex){toast('Mensa-Teller: '+ex.message,true);return;}
 }
 if(action==='pj92-food-tap'){
  try{
   const isFlax=id==='spar-bio-flaxseed';
   const item={id:crypto.randomUUID(),foodId:id,at:stamp(),...(isFlax?{amount:'1 TL (3 g)',note:'Vor dem Schlucken gekaut (roh). Packungswarnung: nur zum Kochen/Backen.'}:{})};
   if(!state){await vault.appendSealedNutrition(item);foodQueuedCount++;nutritionQuickOpen=false;toast('Ernährung verschlüsselt vorgemerkt.');}
   else{journalSyncStatus='lokal';await mutate(s=>addNutrition(s,item));nutritionQuickOpen=false;
     const goal=dayEnergyStatus(state,{foods:nutritionFoods(state),estimate:nutritionKcalEstimate});
     toast(goal.message||'Ernährung erfasst.',Boolean(goal.message&&goal.status==='over'));
    }
  }catch(ex){toast(ex.message,true);}return;
 }
 if(action==='pj92-open-timejournal'){tab='insights';insightTab='timejournal';calmNavGroup='insights';render();if(state?.privateDeviceMirror?.key&&authToken)syncPersonalJournal().catch(ex=>toast('Journal-Abgleich: '+ex.message,true));return;}
 if(action==='pj92-period'){timeJournalPeriod=Number(id)||7;render();return;}
 if(action==='mensa-open-insights'){nutritionQuickOpen=false;tab='insights';insightTab='nutrition';nutritionView712='mensa';calmNavGroup='insights';render();return;}
 if(action==='mensa-eat-today'){
  if(!state)return;const {day,offer}=mensaQuickStatus();if(!offer)return toast('Noch kein Menü für heute vorhanden.',true);
  try{let outcome;
   await mutate(st=>{outcome=logMensaMeal(st,day);});toast(outcome.added?'Study-Teller für heute erfasst.':'Heute bereits erfasst.');}
  catch(ex){toast('Mensa: '+ex.message,true);}return;
 }
 if(action==='mensa-copy-prompt'){
  if(!mensaApi)return;try{await navigator.clipboard.writeText(mensaApi.MENSA_GPT_PROMPT);toast('GPT-Rechercheprompt kopiert.');}
  catch{const box=app.querySelector('#mensa-gpt-prompt');box?.select();toast('Prompt markieren und kopieren.');}return;
 }
 if(action==='mensa-cancel-import'){mensaImportDraft=null;render();return;}
 if(action==='mensa-confirm-import'){
  if(!mensaApi||!mensaImportDraft?.length)return;
  try{let result;await mutate(st=>{result=mensaApi.importMensaOffers(st,mensaImportDraft);},null,true);mensaImportDraft=null;
    mensaMessage=`${result.added} neue Menüs · ${result.updated} aktualisiert · ${result.unchanged} unverändert. Verschlüsselt gespeichert.`;render();toast(mensaMessage);}
  catch(ex){toast('Mensa-Import: '+ex.message,true);}return;
 }
 if(action==='ni712-view'){if(!['journal','nutrients','timing','trends','connections','fats','daily-dozen','anti-aging','phyto','mensa'].includes(id))return;nutritionView712=id;if(id!=='journal')nutritionEditId='';if(id==='nutrients')nutritionDay712=localDateString(new Date());render();return;}
 // Nutrition 3: independent, read-only scatter series and light-weight subpanel updates.
 if(action==='ni727-input'){
  if(!['lastMeal','kcal','protein','caffeine'].includes(id))return;
  nutritionConnInput727=id;refreshNutritionConnectionsPanel();return;
 }
 if(action==='ni727-range'){
  if(!['30','90','365','all'].includes(id))return;
  nutritionConnRange727=id;refreshNutritionConnectionsPanel();return;
 }
 // Manual muscle map: all edits local, original Garmin data never changed.
 if(action==='str732-edit'){strengthEditId732=id;refreshStrength728();app.querySelector('.str732-editor')?.scrollIntoView?.({behavior:'smooth',block:'start'});return;}
 if(action==='str732-cancel'){strengthEditId732='';refreshStrength728();return;}
 if(action==='str732-add-set'){
  const form=app.querySelector('#str732-form'),rows=form?.querySelector('.str732-rows');if(!rows)return;
  const i=rows.querySelectorAll('[data-strength-set]').length;
  if(i>=80)return toast('Maximal 80 Sätze je Training.',true);
  rows.insertAdjacentHTML('beforeend',strengthSetRow(i));
  rows.lastElementChild?.querySelector('select')?.focus({preventScroll:true});return;
 }
 // .37: cycling layer is descriptive and explicitly separate from strength sets.
 if(action==='str737-activity'){
  if(!['combined','strength','cycling','water'].includes(id))return;
  strengthActivity737=id;refreshStrength728();return;
 }
 // Strength: fast local map toggle, without re-rendering the whole GTD app.
 if(action==='str728-range'){if(!['7','28','90','365','all'].includes(id))return;strengthRange728=id;refreshStrength728();return;}
 if(action==='str728-side'){if(!['front','back'].includes(id))return;strengthSide728=id;refreshStrength728();return;}
 // Nutrition 4: localized fat-quality controls, no full app rerender.
 if(action==='ni731-period'){
  if(!['7','30','90','365','all'].includes(id))return;
  nutritionFatDays731=id;refreshNutritionFatPanel731();return;
 }
 if(action==='ni731-metric'){
  if(!['fat','saturated','mono','poly','ala','epa','dha','omega6','cholesterol','trans'].includes(id))return;
  nutritionFatMetric731=id;refreshNutritionFatPanel731();return;
 }
 // Phytochemical profiles: update only this pane, not the whole GTD app.
 if(action==='phyto736-period'){
  if(!['7','30','90'].includes(id))return;
  phytoPeriod736=Number(id);refreshPhyto736();return;
 }
 // Anti-Aging Eight .34: only replace its own panel, never scroll to top.
 if(action==='aa734-day'){
  if(!['prev','next','today'].includes(id))return;
  const today=localDate();antiAgingDay734=id==='today'?today:shiftDailyDozenDate(antiAgingDay734,id==='prev'?-1:1);
  if(antiAgingDay734>today)antiAgingDay734=today;
  refreshAntiAging734();return;
 }
 // Daily Dozen .33: save individual counters, no page rebuild / scroll jump.
 if(action==='dd733-day'){
  if(!['prev','next','today'].includes(id))return;
  const today=localDate();dailyDozenDay733=id==='today'?today:shiftDailyDozenDate(dailyDozenDay733,id==='prev'?-1:1);
  if(dailyDozenDay733>today)dailyDozenDay733=today;
  refreshDailyDozen733();return;
 }
 if(action==='dd733-step'){
  if(!state)return toast('Bitte den Tresor entsperren.',true);
  const sign=id?.slice(0,1),cat=id?.slice(1);if(!['+','-'].includes(sign))return;
  try{journalSyncStatus='lokal';await mutate(st=>setDailyDozen(st,dailyDozenDay733,cat,sign==='+'?1:-1),null,true);refreshDailyDozen733();}
  catch(ex){toast('Daily Dozen: '+ex.message,true);}return;
 }
 // Nutrition 2: redraw only the selected trend charts, never the full app for navigation.
 if(action==='ni726-mode'){if(!['week','month','all'].includes(id))return;nutritionTrendsMode726=id;nutritionTrendsAnchor726=localDateString(new Date());refreshNutritionTrendsPanel();return;}
 if(action==='ni726-shift'){if(!['prev','next'].includes(id))return;nutritionTrendsAnchor726=shiftNutritionTrendsPeriod(nutritionTrendsMode726,nutritionTrendsAnchor726,id==='prev'?-1:1);refreshNutritionTrendsPanel();return;}
 if(action==='ni726-metric'){if(!['protein','carbs','fat','fiber','sugar','saturated','salt','caffeine'].includes(id))return;nutritionTrendsMetric726=id;refreshNutritionTrendsPanel();return;}
 // Rebuild just the nutrition chart subtree, not the surrounding navigation / full vault UI.
 // Click handlers are rebound only inside the new subtree; persisted journal is untouched.
 if(action==='ni725-mode'){if(!['week','month','all'].includes(id))return;nutritionTimingMode725=id;nutritionTimingSelected725='';nutritionTimingAnchor725=localDateString(new Date());refreshNutritionTimingPanel();return;}
 if(action==='ni725-shift'){if(!['prev','next'].includes(id))return;nutritionTimingAnchor725=shiftNutritionTimingPeriod(nutritionTimingMode725,nutritionTimingAnchor725,id==='prev'?-1:1);nutritionTimingSelected725='';refreshNutritionTimingPanel();return;}
 if(action==='ni725-event'){
  nutritionTimingSelected725=id;
  // Do not re-render the 500KB main UI when only a chart dot is selected.
  app.querySelectorAll('.ni725-dot.is-selected').forEach(dot=>dot.classList.remove('is-selected'));
  app.querySelectorAll('.ni725-dot').forEach(dot=>{if(dot.dataset.id===id)dot.classList.add('is-selected');});
  const detail=app.querySelector('#ni725-selection');
  if(detail){detail.innerHTML=nutritionTimingSelectedMarkup(state,id);const edit=detail.querySelector('[data-action="ni725-edit"]');if(edit)edit.onclick=()=>runAction('ni725-edit',id);}
  return;
 }
 if(action==='ni725-edit'){nutritionEditId=id;nutritionView712='journal';render();return;}
 if(action==='ni712-day'){
  if(id==='today')nutritionDay712=localDateString(new Date());
  else if(id==='prev'||id==='next'){
   const d=new Date(nutritionDay712+'T12:00:00');if(!Number.isFinite(d.getTime()))return;
   d.setDate(d.getDate()+(id==='prev'?-1:1));nutritionDay712=localDateString(d);
  }
  render();return;
 }
 if(action==='ni712-profile'){nutritionProduct712=id;render();return;}
 if(action==='pj92-nutrition-period'){nutritionPeriod=Number(id)||30;render();return;}
 if(action==='pj92-time-add'){timeJournalEditId='';timeJournalShowForm=true;render();return;}
 if(action==='pj92-time-edit'){timeJournalEditId=id;timeJournalShowForm=true;render();return;}
 if(action==='pj92-time-cancel'){timeJournalEditId='';timeJournalShowForm=false;render();return;}
 if(action==='pj92-time-delete'){if(!state||!confirm('Dieses Zeitintervall wirklich entfernen?'))return;try{journalSyncStatus='lokal';await mutate(s=>deleteTimeEntry(s,id));timeJournalEditId='';timeJournalShowForm=false;toast('Eintrag entfernt.');}catch(ex){toast(ex.message,true);}return;}
 if(action==='pj92-nutrition-add'){nutritionQuickOpen=true;render();return;}
 if(action==='pj92-food-edit'){nutritionEditId=id;nutritionView712='journal';render();return;}
 if(action==='pj92-food-edit-cancel'){nutritionEditId='';render();return;}
 if(action==='pj92-food-delete'){if(!state||!confirm('Ernährungseintrag entfernen?'))return;try{journalSyncStatus='lokal';await mutate(s=>{ensureJournal(s);const item=s.nutritionJournal.entries.find(e=>e.id===id);if(item){item.deleted=true;item.updatedAt=stamp();}});nutritionEditId='';toast('Eintrag entfernt.');}catch(ex){toast(ex.message,true);}return;}
 if(action==='str742-sync-now'){
  if(!state?.privateDeviceMirror?.key||!authToken){toast('Trainingsabgleich benötigt einen verbundenen verschlüsselten Geräteabgleich und eine Anmeldung.',true);return;}
  try{const ok=await syncPersonalJournal();toast(ok?'Krafttraining und Journale verschlüsselt abgeglichen.':'Trainingsabgleich noch nicht möglich.',!ok);}
  catch(ex){toast('Trainingsabgleich: '+ex.message,true);}
  return;
 }
 if(action==='cap748-calendar-refresh'){
  try{if(calendarToken&&Date.now()<calendarExpires)await fetchCalendar();else await connectCalendar();}
  catch(ex){toast('Kalender: '+ex.message,true);}
  return;
 }
 if(action==='capacity747-open'){
  tab='insights';insightTab='capacity';calmNavGroup='insights';render();return;
 }
 if(action==='weekly746-shift'){
  if(!['prev','next'].includes(id))return;
  weeklyOffset746=Math.max(0,Math.min(104,weeklyOffset746+(id==='prev'?1:-1)));
  render();return;
 }
 if(action==='weekly746-current'){weeklyOffset746=0;render();return;}
 if(action==='dream743-open'){
  compass59DreamFocusPending=true;
  tab='insights';insightTab='dreamworld';calmNavGroup='insights';dreamEditingId743='';render();compass59FocusDreamField();return;
 }
 if(action==='dream743-period'){if(!['7','30','90'].includes(id))return;dreamDays743=Number(id);render();return;}
 if(action==='dream743-edit'){if(!(state?.dreamJournal?.entries||[]).some(x=>x.id===id&&!x.deleted))return;dreamEditingId743=id;tab='insights';insightTab='dreamworld';render();app.querySelector('#dream743-form')?.scrollIntoView({block:'start'});return;}
 if(action==='dream743-reset'){dreamEditingId743='';render();return;}
 if(action==='dream743-delete'){
  if(!state||!confirm('Diese Erinnerung wirklich entfernen?'))return;
  try{await mutate(st=>deleteDreamEntry(st,id));if(dreamEditingId743===id)dreamEditingId743='';toast('Erinnerung entfernt.');}catch(ex){toast(ex.message,true);}return;
 }
 if(action==='dream743-select-kind'){
  if(!['night','daydream','fantasy'].includes(id))return;
  const form=app.querySelector('#dream743-form'),sel=form?.elements?.namedItem('kind');if(sel){sel.value=id;app.querySelectorAll('.dream743-kind-row .dream743-chip').forEach(b=>b.classList.toggle('selected',b.dataset.id===id));}return;
 }
 if(action==='receipts743-copy'){
  try{await navigator.clipboard.writeText(RECEIPT_GPT_PROMPT);toast('Kassenbon-Prompt kopiert.');}
  catch(ex){const area=app.querySelector('#receipts743-prompt');if(area){area.focus();area.select();}toast('Prompt markieren und kopieren – Zwischenablage nicht verfügbar.',true);}return;
 }
 if(action==='receipts745-month'){
  if(!['prev','next'].includes(id))return;
  const [year,month]=receiptMonth745.split('-').map(Number);
  const d=new Date(Date.UTC(year,month-1+(id==='prev'?-1:1),1));
  receiptMonth745=d.toISOString().slice(0,7);render();return;
 }
 if(action==='receipts743-cancel'){receiptDraft743=null;render();return;}
 if(action==='receipts743-confirm'){
  if(!receiptDraft743||!state)return;
  try{let result;await mutate(st=>{result=putReceipts(st,receiptDraft743);});receiptDraft743=null;render();toast(result.added+' Bon(s) verschlüsselt gespeichert'+(result.skipped?' · '+result.skipped+' bereits vorhanden':'')+'. Keine Finanzbuchung angelegt.');}
  catch(ex){toast('Bonimport: '+ex.message,true);}return;
 }
 if(action==='receipts743-delete'){
  if(!state||!confirm('Diesen gespeicherten Bon entfernen?'))return;
  try{await mutate(st=>deleteReceipt(st,id));toast('Bon entfernt.');}catch(ex){toast(ex.message,true);}return;
 }
 if(action==='pj92-sync-now'){try{const ok=await syncPersonalJournal();if(ok)toast('Habits, Zeitjournal und Ernährung verschlüsselt abgeglichen.');else toast('Kein Cloud-Abgleich möglich: bitte anmelden und Geräteabgleich einrichten.',true);}catch(ex){toast(ex.message,true);}return;}




 if(action==='feeling-open'){nutritionQuickOpen=false;feelingEditingId='';captureOverlayOpen=false;worktimeQuickOpen=false;habitQuickOpen=false;feelingOverlayOpen=true;render();app.querySelector(feelingInputMode==='words'?'#fw705-search-input':'#fw65-dialog .fw65-emotion')?.focus({preventScroll:true});return;}
 if(action==='worktime-quick-open'){nutritionQuickOpen=false;if(!state&&!sealedCaptureAvailable){toast('Bitte einmal entsperren und die verschlüsselte Schnellerfassung aktivieren.',true);return;}captureOverlayOpen=false;feelingOverlayOpen=false;habitQuickOpen=false;worktimeQuickOpen=true;render();if(state?.privateDeviceMirror?.key&&authToken)syncPersonalJournal().catch(ex=>toast('Arbeitszeit-Abgleich: '+ex.message,true));return;}
 if(action==='worktime-quick-close'||action==='worktime-quick-close-backdrop'){worktimeQuickOpen=false;render();return;}
 if(action==='habit-quick-open'){nutritionQuickOpen=false;if(!state&&!sealedCaptureAvailable){toast('Bitte einmal entsperren und die verschlüsselte Schnellerfassung aktivieren.',true);return;}captureOverlayOpen=false;feelingOverlayOpen=false;worktimeQuickOpen=false;habitQuickOpen=true;render();return;}
 if(action==='habit-quick-close'||action==='habit-quick-close-backdrop'){habitQuickOpen=false;render();return;}
 if(action==='habit-open-insights'){habitQuickOpen=false;tab='insights';insightTab='habits';calmNavGroup='insights';render();return;}
 if(action==='worktime-quick-start'||action==='worktime-quick-stop'){
   const entry={type:action==='worktime-quick-start'?'start':'stop',at:stamp(),category:worktimeSelectedCategory,id:crypto.randomUUID()};
   if((entry.type==='start')===isWorktimeActive(state))return toast(entry.type==='start'?'Bereits eingestempelt.':'Es läuft aktuell kein Intervall.',true);
   try{
     if(!state){await vault.appendSealedWorktime(entry);syncQuickPublicWorktime(entry);toast(entry.type==='start'?'Arbeitszeit vorgemerkt: eingestempelt.':'Arbeitszeit vorgemerkt: ausgestempelt.');}
     else{journalSyncStatus='lokal';await mutate(s=>applyWorktimeEvent(s,entry));toast(entry.type==='start'?'Arbeitszeit gestartet.':'Arbeitszeit gestoppt.');}
   }catch(ex){toast(ex.message,true);}
   return;
 }
 if(action==='wim-hof-start'){
   if(!state)return toast('Bitte zuerst den Tresor entsperren.',true);
   habitQuickOpen=false;render();
   const mod=await import('./wim-hof-player-v5775921.js');
   await mod.openWimHofPlayer({onComplete:async session=>{
     if(!state)throw Error('Tresor wurde gesperrt – nicht gespeichert. Bitte erneut entsperren und nachtragen.');
     await mutate(st=>{const at=session.finishedAt||stamp();const day=localDateString(new Date(at));putHabitTimeSession(st,{habitId:'wim-hof',at,day,minutes:Number(session.durationSeconds)/60,mode:session.track,source:'audio-player'});setHabitDoneState(st,'wim-hof',day,true,at);});
   }});
   return;
 }
 if(action==='makko-guide-start'){
   const mod=await import('./makko-ho-guide-v5775910.js');
   mod.openMakkoGuide({
    onSession:async session=>{
      if(!state||!session||!session.totalSeconds)return;
      // Sessions are persisted inside the already encrypted Vault, never in public localStorage.
      await mutate(st=>{
       const prior=Array.isArray(st.makkoHoSessions)?st.makkoHoSessions:[];
       if(prior.some(row=>row.id===session.id))return;
       st.makkoHoSessions=[...prior,{...session,day:localDate()}].slice(-400);
      });
    },
    onFinish:async()=>{if(!habitIsDone(state,'hakka-5'))await runAction('habit-toggle','hakka-5');}
   });
   return;
 }
 if(action==='str620-guided-start'){
 if(!state)return toast('Bitte zuerst den Tresor entsperren.',true);
 habitQuickOpen=false;render();
 const coach=await import('./strength-coach-v5775910.js');
 const guide=await import('./strength-guided-v5775920.js');
 const {resumableGuidedSession,guidedPlanFromSession}=await import('./strength-workout-resume-v57759405.js');
 const unfinished=resumableGuidedSession(state);
 const plan=unfinished?guidedPlanFromSession(unfinished):coach.planNextWorkout(state,{...coach.readStrengthCoachPreferences(),today:localDate()});
 guide.openGuidedWorkout({plan,resumeSession:unfinished,onSession:storeStrengthGuidedSession});return;
 }
 if(action==='str620-prefill'){
 if(!state)return;
 const form=app.querySelector('#str732-form'),rows=form?.querySelector('.str732-rows');
 if(!form||!rows)return;
 const coach=await import('./strength-guided-v5775920.js');
 const candidates=coach.matchingGuidedSessions(state,form.dataset.start||'');
 const chosen=candidates[0];
 if(!chosen||candidates.length>1&&candidates[1].offsetMinutes-candidates[0].offsetMinutes<15)return toast('Mehrere Workouts möglich: bitte manuell zuordnen.',true);
 const sets=coach.confirmedGuidedSets(chosen);
 if(!sets.length)return toast('Noch keine bestätigten Sätze vorhanden.',true);
 if(!window.confirm('Bestätigte Compass-Übungen in dieses Garmin-Formular übernehmen? Vorhandene Eingaben werden ersetzt. Bitte Wdh. und kg danach prüfen.'))return;
 const editor=await import('./strength-editor-v57732.js');
 // Keep already known Garmin repetitions/weights when the guided log has blanks.
 const existing=[...rows.querySelectorAll('.str732-set')].map(node=>{
   const reps=node.querySelector('input[name^="reps-"]')?.value||'';
   const kg=node.querySelector('input[name^="weight-"]')?.value||'';
   return {reps:reps!==''?Number(reps):null,weightKg:kg!==''?Number(kg):null};
 });
 rows.innerHTML=sets.slice(0,80).map((set,i)=>editor.strengthSetRow(i,{...set,reps:set.reps??existing[i]?.reps??null,weightKg:set.weightKg??existing[i]?.weightKg??null})).join('');
 form.scrollIntoView({behavior:'smooth',block:'start'});
 toast('Compass-Vorschlag eingetragen. Bitte prüfen und speichern.');return;
 }
 if(action==='strength-coach-open'){
   if(!state)return toast('Für persönliche Trainingsvorschläge bitte Tresor entsperren.',true);
   const mod=await import('./strength-coach-v5775910.js');
   mod.openStrengthCoach({state,today:localDate(),onSession:storeStrengthGuidedSession,onExperiment:async data=>{
    if(data.kind==='start'){await mutate(s=>coachTrialStart48(s,{exerciseId:data.id,exerciseTitle:data.exerciseTitle,strategy:data.strategy,primary:data.primary,today:data.today}));return;}
    if(data.kind==='finish'){await mutate(s=>coachTrialFinish48(s,data.id,data.today));return;}
   }});return;
 }
 if(action==='str610-preset'){
   if(!['A','B'].includes(id))return;
   const rows=app.querySelector('#str732-form .str732-rows');if(!rows)return;
   if([...rows.querySelectorAll('input')].some(x=>String(x.value||'').trim())&&!window.confirm('Vorhandene Satzangaben durch die StrongLifts-Vorlage ersetzen?'))return;
   const mod=await import('./strength-editor-v57732.js');
   const preset=mod.STRONGLIFTS_5X5[id]||[];let index=0;
   rows.innerHTML=preset.flatMap(ex=>Array.from({length:ex.sets},()=>mod.strengthSetRow(index++,{exerciseId:ex.exerciseId,reps:ex.reps,weightKg:null}))).join('');
   rows.querySelector('select')?.focus({preventScroll:true});return;
 }
 if(action==='habit-toggle'){
   try{
     let vocalMinutes=null;if(id==='vocal-image'&&state&&!habitIsDone(state,id)){const entered=window.prompt('Vocal Image: Wie viele Minuten hast du geübt? (Optional – leer lassen = Dauer unbekannt)','30');if(entered!==null&&entered.trim()!==''){vocalMinutes=Number(entered.replace(',','.'));if(!(vocalMinutes>0&&vocalMinutes<=180))return toast('Bitte 1–180 Minuten eingeben.',true);}}
     if(!state){if((quickPublic.doneToday||[]).includes(id)){toast('Für heute bereits vorgemerkt.',true);return;}const source=publicHabitItems().find(item=>item.id===id);const entry={habitId:id,title:source?.title||id,slot:source?.slot||'',day:localDate(),done:true,at:stamp()};await vault.appendSealedHabit(entry);syncQuickPublicHabit(id,true);render();toast('Habit für heute vorgemerkt.');}
     else{let done=false;await mutate(s=>{done=toggleHabitDoneState(s,id,localDate());if(done&&vocalMinutes!==null)putHabitTimeSession(s,{habitId:'vocal-image',at:stamp(),day:localDate(),minutes:vocalMinutes,source:'manual-quick'});});habitQuickOpen=habitQuickOpen;toast(done?'Habit für heute abgehakt.':'Habit für heute wieder geöffnet.');}
   }catch(ex){toast(ex.message,true);}
   return;
 }
 if(action==='feeling-mode'){if(['wheel','words'].includes(id)){chooseFeelingInputMode(id);render();if(id==='words')app.querySelector('#fw705-search-input')?.focus({preventScroll:true});}return;}
 if(action==='feeling-network-term'){try{const modal=app.querySelector('#fw65-dialog');const scroll=modal?.scrollTop||0;feelingDraft=toggleNetworkTerm(feelingDraft,id);render();const next=app.querySelector('#fw65-dialog');if(next)next.scrollTop=scroll;}catch(ex){toast(ex.message,true);}return;}
 if(action==='feeling-close'){feelingEditingId='';feelingOverlayOpen=false;render();app.querySelector('.fw65-top-trigger')?.focus({preventScroll:true});return;}
 if(action==='feeling-toggle'){try{feelingDraft=chooseFeeling(feelingDraft,id);render();}catch(ex){toast(ex.message,true);}return;}
 if(action==='feeling-family'||action==='feeling-nuance'||action==='feeling-observation'){
   try{const modal=app.querySelector('#fw65-dialog'),scroll=modal?.scrollTop||0;
     if(action==='feeling-family')feelingDraft=setFeelingDetail(feelingDraft,id,{family:stepId});
     else if(action==='feeling-nuance')feelingDraft=setFeelingDetail(feelingDraft,id,{nuance:stepId});
     else feelingDraft=toggleFeelingObservation(feelingDraft,id,stepId);
     render();const next=app.querySelector('#fw65-dialog');if(next)next.scrollTop=scroll;
   }catch(ex){toast(ex.message,true);}return;
 }
 if(action==='feeling-intensity-step'){try{feelingDraft=intensityFor(feelingDraft,id,Number(stepId));render();}catch(ex){toast(ex.message,true);}return;}
 if(action==='feeling-view'){if(['overview','history','patterns'].includes(id)){feelingView=id;render();}return;}
 if(action==='feeling-entry-select'){if(state?.feelingCheckins?.some(e=>e.id===id)){feelingSelectedId=id;render();}return;}
 if(action==='feeling-load-more'){feelingHistoryLimit+=30;render();return;}
 if(action==='feeling-entry-edit'){const item=state?.feelingCheckins?.find(e=>e.id===id);if(!item)return;feelingEditingId=id;feelingDraft=draftFromCheckin(item);feelingInputMode=item.ownWords||item.networkTerms?.length?'words':'wheel';feelingOverlayOpen=true;render();return;}
 if(action==='connection-emotion'){if(FEELINGS.some(e=>e.id===id)){connectionEmotion=id;render();}return;}
 if(action==='connection-period'){if(['7','30','90'].includes(id)){connectionDays=Number(id);render();}return;}
 if(action==='feeling-period'){if(['7','30','90'].includes(id)){feelingDays=Number(id);render();}return;}
 if(action==='feeling-open-history'){feelingOverlayOpen=false;tab='insights';insightTab='feelings';calmNavGroup='insights';render();return;}
 if(action==='feeling-save'){
   if(feelingSaving)return;feelingSaving=true;
   try{
     const previous=feelingEditingId?state?.feelingCheckins?.find(e=>e.id===feelingEditingId):null;
     const entry=validatedCheckin(feelingDraft,{id:previous?.id||crypto.randomUUID(),at:previous?.at||stamp(),day:previous?.day||localDate()});
     if(!state){if(!sealedCaptureAvailable)throw Error('Verschlüsselter Eingangspuffer ist nicht eingerichtet.');await vault.appendSealedFeeling(entry);feelingOverlayOpen=false;feelingDraft=newFeelingDraft();toast('Gefühl verschlüsselt gesichert · nach Entsperren in der Chronik.');}
     else{if(previous){await mutate(s=>replaceCheckin(s,entry));feelingSelectedId=entry.id;}else{await mutate(s=>appendCheckin(s,entry));feelingSelectedId=entry.id;}
       feelingDraft=newFeelingDraft();feelingEditingId='';feelingOverlayOpen=false;toast(previous?'Gefühls-Check-in aktualisiert und verschlüsselt gespeichert.':'Gefühl im lokalen Vault gespeichert.');}
   }catch(ex){toast(ex.message,true);}finally{feelingSaving=false;}return;
 }
 if(action==='balance-select'){if(id===''||['sleep','activity','gtd','finance','people','body','recovery','work','nutrition930'].includes(id)){balanceSelectedAxis=id||null;render();}return;}
 if(action==='balance-history'){if(['0','1','2'].includes(id)){balanceHistoryCount=Number(id);render();}return;}
 if(action==='balance-period'){if(['7','30'].includes(id)){balancePeriod=Number(id);render();}return;}
 if(action==='balance-open'){tab='insights';insightTab='balance';calmNavGroup='insights';render();if(authToken){reloadHealth().catch(()=>{});reloadWatchSessions().catch(()=>{});}return;}
 if(action==='balance-drill'){if(!['insights','people','finance','review'].includes(id))return;tab=id;if(id==='insights'&&INSIGHT_TABS.some(t=>t.id===stepId))insightTab=stepId;if(id==='finance')financePane='Prognose';calmNavGroup=id==='insights'?'insights':id==='finance'?'finance':'';render();return;}
  lastActivity=Date.now();
  try {
    if(action==='lw82-year'||action==='lw82-previous'||action==='lw82-next'||action==='lw82-today'||action==='lw82-bonus'||action==='lw82-star'||action==='lw82-week'||action==='lw82-new'||action==='lw82-clear'||action==='lw82-edit'||action==='lw82-delete'||action==='lw82-calendar-choose'||action==='lw82-calendar-fetch'){
      if(!state)return;
      const age=Number(id);
      if(action==='lw82-bonus'){lifeWeeksBonus=!lifeWeeksBonus;if(!lifeWeeksBonus)lifeWeeksStar=false;render();return;}
      if(action==='lw82-star'){lifeWeeksStar=!lifeWeeksStar;if(lifeWeeksStar)lifeWeeksBonus=true;render();return;}
      if(action==='lw82-today'){lifeWeeksAge=lifeAgeAt(localDate());lifeWeeksWeek=lifeWeekCells(lifeWeeksAge,{today:localDate()}).find(x=>x.status==='current')?.week||null;lifeWeeksDraft={};lifeWeeksCalendarHistory=[];render();requestAnimationFrame(()=>app.querySelector('.lw82-row[data-age=\"'+lifeWeeksAge+'\"]')?.scrollIntoView?.({block:'center',behavior:'smooth'}));return;}
      if(action==='lw82-year'&&Number.isInteger(age)&&age>=0&&age<110){lifeWeeksAge=age;lifeWeeksWeek=null;lifeWeeksDraft={};lifeWeeksCalendarHistory=[];lifeWeeksCalendarQuery='';render();requestAnimationFrame(()=>app.querySelector('#lw82-detail')?.scrollIntoView?.({behavior:'smooth',block:'start'}));return;}
      if(action==='lw82-previous'||action==='lw82-next'){lifeWeeksAge=Math.min(109,Math.max(0,(lifeWeeksAge??lifeAgeAt(localDate()))+(action==='lw82-previous'?-1:1)));lifeWeeksWeek=null;lifeWeeksDraft={};lifeWeeksCalendarHistory=[];render();return;}
      if(action==='lw82-week'){const yr=Number(id),wk=Number(stepId);if(!Number.isInteger(yr)||yr<0||yr>=110)return;const cell=lifeWeekCells(yr,{today:localDate()}).find(x=>x.week===wk);if(!cell)return;lifeWeeksAge=yr;lifeWeeksWeek=wk;lifeWeeksDraft={start:cell.start,end:cell.end,category:'travel'};render();requestAnimationFrame(()=>app.querySelector('#lw82-editor')?.scrollIntoView?.({behavior:'smooth',block:'center'}));return;}
      if(action==='lw82-new'||action==='lw82-clear'){lifeWeeksDraft={};lifeWeeksWeek=null;render();if(action==='lw82-new')requestAnimationFrame(()=>app.querySelector('#lw82-editor')?.scrollIntoView?.({behavior:'smooth',block:'center'}));return;}
      if(action==='lw82-edit'){const item=(state.lifeWeekEvents||[]).find(x=>x.id===id&&!x.deleted);if(!item)return;lifeWeeksDraft={...item};lifeWeeksAge=lifeAgeAt(item.start);render();requestAnimationFrame(()=>app.querySelector('#lw82-editor')?.scrollIntoView?.({behavior:'smooth',block:'center'}));return;}
      if(action==='lw82-delete'){if(!(state.lifeWeekEvents||[]).some(x=>x.id===id&&!x.deleted))return;if(!confirm('Dieses Lebensereignis entfernen?'))return;await mutate(st=>deleteLifeEvent(st,id));lifeWeeksDraft={};render();return;}
      if(action==='lw82-calendar-choose'){const candidate=calendarLifeCandidates([...calendarEvents,...lifeWeeksCalendarHistory],lifeWeeksAge??lifeAgeAt(localDate()),{query:lifeWeeksCalendarQuery,existing:state?.lifeWeekEvents||[],onlyTravel:!lifeWeeksCalendarQuery,limit:200}).find(x=>x.id===id);if(!candidate)return;lifeWeeksDraft={title:candidate.title,start:candidate.start,end:candidate.end,category:candidate.likelyTravel?'travel':'other',location:candidate.location,source:'calendar',calendarRef:candidate.id};render();requestAnimationFrame(()=>app.querySelector('#lw82-editor')?.scrollIntoView?.({behavior:'smooth',block:'center'}));return;}
      if(action==='lw82-calendar-fetch'){
        if(!calendarToken||Date.now()>=calendarExpires){toast('Bitte Google Calendar zunächst über die bestehenden Kalender-Einstellungen verbinden. Gespeicherte Termine bleiben verfügbar.',true);return;}
        if(lifeWeeksCalendarLoading)return;lifeWeeksCalendarLoading=true;render();
        try{const range=lifeYearRange(lifeWeeksAge??lifeAgeAt(localDate()));const fresh=await fetchGoogleCalendarWindow(range.start,range.endExclusive,new AbortController().signal);lifeWeeksCalendarHistory=fresh;lifeWeeksCalendarQuery='';toast(`${fresh.length} Kalendereinträge für ${range.years} gefunden. Bitte passende Ereignisse einzeln bestätigen.`);}
        catch(ex){toast('Kalenderrecherche: '+ex.message,true);}finally{lifeWeeksCalendarLoading=false;render();}return;
      }
    }
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
    if(action==='task-gpt712-copy'){
      const t=state?.tasks?.[id];if(!t||t.archived)return toast('Aufgabe nicht verfügbar.',true);
      const p=state?.projects?.[t.projectId];const prompt=taskSupportPrompt(t,p?.title||'');
      try{await navigator.clipboard.writeText(prompt);toast('GPT-Gesprächseinstieg kopiert. ChatGPT öffnen und einfügen; Spracheingabe ist möglich.');}
      catch(ex){window.prompt('Prompt für ChatGPT — bitte kopieren:',prompt);toast('Automatisches Kopieren blockiert. Prompt manuell kopieren.',true);}
      return;
    }
    if(action==='yesterday710-plan-today'){
      const entry=yesterdayIntentions(state,localDate()).find(x=>x.task.id===id);
      if(!entry?.canPlan)return toast('Aufgabe ist nicht mehr für heute verfügbar.',true);
      await mutate(s=>{const t=s.tasks[id];if(!t||t.completed||t.archived)return;t.plannedDate=localDate();t.updatedAt=stamp();s.taskPending[id]=true;});
      toast('Für heute vorgemerkt – keine zusätzliche Deadline.');return;
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
      reviewEditingTaskId=null;reviewProjectId=null;await mutate(s=>{s.weeklyReview=newReview();s.reviewPending=true;},null,true,{fastReview:true});return;
    }
    if(action==='assistant-step'||action==='assistant-back'||action==='assistant-next'){
      captureReviewDraft();const index=action==='assistant-step'?Number(id):action==='assistant-back'?Math.max(0,state.weeklyReview.step-1):Math.min(REVIEW_STEPS.length-1,state.weeklyReview.step+1);
      if(!Number.isInteger(index)||index<0||index>=REVIEW_STEPS.length)return;
      reviewEditingTaskId=null;await mutate(s=>{s.weeklyReview=nextReviewStep(s.weeklyReview,index);s.reviewPending=true;},null,true,{fastReview:true});return;
    }
    if(action==='assistant-complete-step'){
      const current=REVIEW_STEPS[state.weeklyReview.step];if(!current)return;
      const queue=reviewQueue(state,calendarEvents,localDate());
      if(current.id==='inbox'&&queue.inbox.length&&!confirm(`${queue.inbox.length} Inbox-Einträge sind noch offen. Diesen Bereich trotzdem als durchgesehen markieren?`))return;
      if(current.id==='projects'&&queue.due.some(p=>!state.weeklyReview.inspectedProjects.includes(p.id))&&!confirm('Nicht alle fälligen Projekte wurden geprüft. Trotzdem fortfahren?'))return;
      const notes=String(app.querySelector('#review-end-notes')?.value||'').slice(0,1200);
      await mutate(s=>{s.weeklyReview=reviewedStep(s.weeklyReview,current.id);if(current.id==='finish'){s.weeklyReview.completedAt=stamp();s.weeklyReview.notes=notes;}s.reviewPending=true;},null,true,{fastReview:true});return;
    }
    if(action==='assistant-project-select'){if(!state.projects?.[id])return;reviewProjectId=id;reviewEditingTaskId=null;render();return;}
    if(action==='assistant-project-reviewed'){
      if(!state.projects?.[id])return;
      await mutate(s=>{s.projects[id].reviewedAt=stamp();s.projectPending[id]=true;s.weeklyReview.inspectedProjects=[...new Set([...s.weeklyReview.inspectedProjects,id])];s.weeklyReview.updatedAt=stamp();s.reviewPending=true;},null,true,{fastReview:true,singleProjectId:id,onApplied:()=>{reviewProjectId=null;notice='Projekt geprüft.';},onFailed:()=>{notice='';error='Projektprüfung konnte nicht lokal gesichert werden.';}});return;
    }
    if(action==='assistant-task-edit'){if(!state.tasks?.[id])return;reviewEditingTaskId=id;render();return;}
    if(action==='assistant-task-cancel'){reviewEditingTaskId=null;render();return;}
    if(action==='assistant-task-done'){
      if(!state.tasks?.[id])return;await mutate(s=>{s.tasks[id]={...s.tasks[id],completed:true,updatedAt:stamp()};s.taskPending[id]=true;},null,true,{fastGtd:true,fastPlanning:true,singleTaskId:id,onApplied:()=>{reviewEditingTaskId=null;}});return;
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
    if(action==='discovery-view-cinema'||action==='discovery-view-events'){discoveryDisplayMode=action.endsWith('cinema')?'cinema':'events';if(discoveryDisplayMode==='cinema'){discoveryCategories=['Kino','Filmfestival','Kabarett'];discoveryRange='all';discoveryCinemaDay=localDate();discoveryCinemaPeriod='day';}discoveryFilmLimit=36;render();return;}
    if(action==='discovery-cinema-next'||action==='discovery-cinema-prev'){if(discoveryCinemaPeriod!=='day')return;discoveryCinemaDay=cinemaDayShift(discoveryCinemaDay,action.endsWith('next')?1:-1);if(discoveryCinemaDay<localDate())discoveryCinemaDay=localDate();discoveryFilmLimit=36;render();return;}
    if(action==='discovery-cinema-today'){discoveryCinemaPeriod='day';discoveryCinemaDay=localDate();discoveryFilmLimit=36;render();return;}
    if(action==='discovery-cinema-day'||action==='discovery-cinema-all'){discoveryCinemaPeriod=action.endsWith('day')?'day':'all';discoveryFilmLimit=36;render();return;}
    if(action==='discovery-cinema-poster'||action==='discovery-cinema-list'){discoveryCinemaStyle=action.endsWith('poster')?'poster':'list';render();return;}
    if(action==='discovery-poster-all'){
      if(posterLookupBusy)return;
      const library=groupCinemaScreenings(upcomingImportedEvents(state?.discoveredEvents||[],localDate()))
        .filter(f=>!f.imageUrl||brokenPosterUrls.has(f.imageUrl)).map(f=>brokenPosterUrls.has(f.imageUrl)?{...f,imageUrl:''}:f);
      if(!library.length)return toast('Alle Filme haben bereits Bildlinks.');
      const max=72;posterLookupBusy=true;posterLookupProgress=`0 von ${Math.min(max,library.length)} Filmen geprüft`;
      render();
      const combined={suggestions:[],unmatched:[],unavailable:[],errors:[],checked:0,matched:0,hasMore:false,nextOffset:0};
      try{
        const cap=Math.min(max,library.length);
        for(let offset=0;offset<cap;offset+=12){
          const batch=await lookupPosterBatch(library,{offset,batchSize:Math.min(12,cap-offset)});
          const part=await verifyPosterLookupResult(batch,verifyPosterImage,4);
          combined.suggestions.push(...part.suggestions);
          combined.unmatched.push(...part.unmatched);
          combined.unavailable.push(...part.unavailable);
          combined.errors.push(...part.errors);
          combined.checked+=part.checked;combined.matched+=part.matched;
          for(const bad of part.unavailable)brokenPosterUrls.add(bad.imageUrl);
          posterLookupProgress=`${combined.checked} von ${cap} Filmen geprüft · ${combined.suggestions.length} Poster gefunden`;
          const progressNode=app.querySelector('#discovery-poster-progress');if(progressNode)progressNode.textContent=posterLookupProgress;
        }
        combined.hasMore=cap<library.length;combined.nextOffset=combined.hasMore?cap:0;
        posterLookupResult=combined;posterLookupSelected=new Set(combined.suggestions.map(x=>x.key));
        posterLookupOffset=combined.nextOffset;
        toast(`${combined.checked} Filme geprüft · ${combined.suggestions.length} ladbare Poster gefunden. Bitte die Bilder vor der Übernahme prüfen.`);
      }catch(e){
        if(combined.checked){posterLookupResult=combined;posterLookupSelected=new Set(combined.suggestions.map(x=>x.key));posterLookupOffset=combined.checked;}
        toast('Poster-Suche teilweise fehlgeschlagen: '+String(e.message||e),true);
      }finally{posterLookupBusy=false;posterLookupProgress='';render();}
      return;
    }
    if(action==='discovery-poster-lookup'||action==='discovery-poster-next'){
      if(posterLookupBusy)return;
      const library=groupCinemaScreenings(upcomingImportedEvents(state?.discoveredEvents||[],localDate()))
       .filter(f=>!f.imageUrl||brokenPosterUrls.has(f.imageUrl)).map(f=>brokenPosterUrls.has(f.imageUrl)?{...f,imageUrl:''}:f);
      if(!library.length)return toast('Alle Filme haben bereits Bildlinks.');
      posterLookupBusy=true;render();
      try{
       const candidateBatch=await lookupPosterBatch(library,{offset:posterLookupOffset,batchSize:12});
       const result=await verifyPosterLookupResult(candidateBatch,verifyPosterImage,4);
       for(const bad of result.unavailable)brokenPosterUrls.add(bad.imageUrl);
       posterLookupResult=result;
       posterLookupSelected=new Set(result.suggestions.map(x=>x.key));
       posterLookupOffset=result.nextOffset;
       toast(`${result.suggestions.length} ladbare Poster von ${result.checked} geprüften Filmen${result.unavailable.length?' · '+result.unavailable.length+' Bildlinks defekt':''}.`);
      }catch(e){toast('Poster-Suche fehlgeschlagen: '+String(e.message||e),true);}
      finally{posterLookupBusy=false;render();}
      return;
    }
    if(action==='discovery-poster-review-close'){posterLookupResult=null;posterLookupSelected.clear();render();return;}
    if(action==='discovery-poster-manual'){posterManualKey=id;render();return;}
    if(action==='discovery-poster-manual-close'){posterManualKey='';render();return;}
    if(action==='discovery-poster-apply'){const selected=(posterLookupResult?.suggestions||[]).filter(x=>posterLookupSelected.has(x.key)&&validPosterSuggestion(x));if(!selected.length)return toast('Bitte mindestens ein Poster auswählen.',true);const verified=[];for(const suggestion of selected){if(await verifyPosterImage(suggestion.imageUrl))verified.push(suggestion);else brokenPosterUrls.add(suggestion.imageUrl);}if(!verified.length)return toast('Die ausgewählten Poster-URLs konnten im Browser nicht geladen werden. Bitte anderen Link verwenden.',true);const stamp=new Date().toISOString();await mutate(st=>{for(const e of [...(st.discoveredEvents||[])]){const suggestion=verified.find(x=>x.key===String(e.title||'').normalize('NFKC').trim().toLocaleLowerCase('de-AT').replace(/\s+/g,' '));if(!suggestion)continue;const updated=applyPosterToEvent(e,suggestion,stamp);if(updated!==e)queueEvent(st,updated);}});posterLookupResult=null;posterLookupSelected.clear();posterLookupOffset=Math.max(0,posterLookupOffset-verified.length);toast(`${verified.length} Poster für bestehende Filmvorführungen übernommen.${verified.length<selected.length?' '+(selected.length-verified.length)+' Bildlinks waren nicht erreichbar.':''}`);return;}
    if(action==='discovery-film-enrich'){const allUpcoming=upcomingImportedEvents(state?.discoveredEvents||[],localDate());const batch=cinemaEnrichmentPrompt(groupCinemaScreenings(allUpcoming),discoveryEnrichOffset);if(!batch.text){toast('Alle importierten Filme haben eine Kurzbeschreibung und ein Poster.');return;}discoveryEnrichOffset=batch.next;discoveryPromptText=batch.text;discoveryImportOpen=true;discoveryImportPreview=null;let copied=false;try{await navigator.clipboard.writeText(batch.text);copied=true;}catch{}render();toast(copied?`Rechercheprompt für ${batch.count} Filme kopiert.`:'Rechercheprompt im Importfeld anzeigen und kopieren.');return;}
    if(action==='discovery-film-toggle'){if(discoveryExpandedFilms.has(id))discoveryExpandedFilms.delete(id);else discoveryExpandedFilms.add(id);render();return;}
    if(action==='discovery-cinema-more'){discoveryFilmLimit+=36;render();return;}
    if(action==='discovery-cat-all'){discoveryCategories=null;render();return;}
    if(action==='discovery-filter-group'){const group=filterGroup(id);if(!group)return;const selected=discoveryCategories!==null&&discoveryCategories.length===group.categories.length&&group.categories.every(c=>discoveryCategories.includes(c));discoveryCategories=selected?null:[...group.categories];discoveryDisplayMode=id==='cinema'&&!selected?'cinema':'events';discoveryFilmLimit=36;render();return;}
    if(action==='discovery-week-prev'){discoveryWeekOffset=Math.max(0,discoveryWeekOffset-1);render();return;}
    if(action==='discovery-week-next'){discoveryWeekOffset=Math.min(80,discoveryWeekOffset+1);render();return;}
    if(action==='discovery-week-today'){discoveryWeekOffset=0;render();return;}
    if(action==='discovery-import-cancel'){discoveryImportPreview=null;render();return;}
    if(action==='discovery-import-confirm'){if(!discoveryImportPreview)return;const preview=discoveryImportPreview;const at=new Date().toISOString();if(preview.kind==='film-details'){if(!preview.entries.length)return;const entries=new Map(preview.entries.map(x=>[x.key,x]));let count=0;await mutate(st=>{for(const e of [...st.discoveredEvents||[]]){const x=entries.get(String(e.title||'').normalize('NFKC').trim().toLocaleLowerCase('de-AT').replace(/\s+/g,' '));if(!x||!['Kino','Filmfestival'].includes(e.category))continue;queueEvent(st,enrichCinemaEvent(e,x,at));count++;}st.discoveryResearchHistory??={};st.discoveryResearchHistory['cinema-enrichment']={at,total:preview.total,updated:count};});discoveryImportPreview=null;discoveryImportDraft='';discoveryImportError='';discoveryImportOpen=false;toast(`${preview.entries.length} Filmtexte übernommen · ${count} Vorführungen ergänzt.`);return;}const group=isResearchGroup(preview.researchGroup)?preview.researchGroup:isResearchGroup(discoverySelectedResearch)?discoverySelectedResearch:'general';await mutate(st=>{for(const e of preview.added)queueEvent(st,{...e,lastImportedAt:at,researchGroup:group});for(const e of preview.refreshed||[]){const old=st.discoveredEvents.find(x=>eventKey(x)===eventKey(e));if(old){const keep=(!meaningfulFilmDescription(e.description)&&meaningfulFilmDescription(old.description));queueEvent(st,{...old,...e,...(keep?{description:old.description}:{}),...(!e.imageUrl&&old.imageUrl?{imageUrl:old.imageUrl}:{}),lastImportedAt:at,researchGroup:group});}}recordResearchImport(st,group,preview,at);});discoveryImportPreview=null;discoveryImportDraft='';discoveryImportError='';discoveryImportOpen=false;toast(`${preview.added.length} neu, ${preview.refreshed?.length||0} aktualisiert. Import-Zeitpunkt gespeichert.`);return;}
    if(action==='discovery-conflict-cloud'||action==='discovery-conflict-local'){await mutate(st=>resolveEventConflict(st,id,action.endsWith('cloud')?'cloud':'local'));return;}
    if(action==='discovery-range'){if(['today','week','weekend','calendar','all','saved','hidden'].includes(id))discoveryRange=id;render();return;}
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
    if(action==='calm-nav-group'&&id==='insights'){tab='insights';insightTab='balance';calmNavGroup='insights';render();return;}
    if(action==='calm-finance-group'){const group=FINANCE_GROUPS.find(g=>g.title===id);if(group){tab='finance';calmNavGroup='finance';financePane=group.panes[0];financeReviewPage=0;financeLedgerPage=0;render();}return;}
    if(action==='calm-finance-view'){if(FINANCE_TABS.some(p=>p.title===id)){tab='finance';calmNavGroup='finance';financePane=id;financeReviewPage=0;financeLedgerPage=0;render();}return;}
    if(action==='ins750-group'||action==='ins750-open'){
  const group=action==='ins750-group'?insights750Group(id):null;
  const target=group?(insights750Last[id]&&group.tabs.some(([key])=>key===insights750Last[id])?insights750Last[id]:group.default):id;
  if(!insights750Allowed(target))return;
  const owner=insights750GroupFor750(target);
  if(owner&&!INSIGHTS750_EXTERNAL.has(target))insights750Last[owner]=target;
  tab=INSIGHTS750_EXTERNAL.has(target)?target:'insights';
  if(tab==='insights')insightTab=target;
  calmNavGroup='insights';
  if(target==='places')insightPeriod='all';
  render();return;
 }
 if(action==='calm-nav-group'){if(id==='insights'||id==='finance'){tab=id;calmNavGroup=id;if(id==='insights')insightTab='intelligence';else{financePane='Überblick';financeReviewPage=0;financeLedgerPage=0;}render();return;}calmNavGroup=calmNavGroup===id?'':id;render();return;}
    if(action==='calm-insight-view'){if(id==='nutrition')nutritionView712='journal';if(id==='dreamworld'||id==='weekly'||id==='capacity'||INSIGHT_TABS.some(t=>t.id===id)||['touch','habits','feelings','balance','focus','worktime','timejournal','nutrition','places','explore','sources','sleep'].includes(id)){tab='insights';calmNavGroup='insights';insightTab=id;if(id==='places')insightPeriod='all';render();if(authToken){reloadWatchSessions().catch(()=>{});reloadHealth().catch(()=>{});}}return;}
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
    if(action==='task-view'){const t=state?.tasks?.[id];if(!t)return;selectedTaskId=id;selectedDay=t.dueDate||t.plannedDate||localDate();tab='today';todayInspectorOpen=true;render();return;}
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
    if(action==='people-scope720'){familyRadarJumpPersonId401=null;if(PEOPLE_SCOPES.some(([value])=>value===id)){peopleScope=id;relationshipMapFilter='all';relationshipMapFocus=false;peopleShowAll=false;selectedPersonId=null;render();}return;}
    if(action==='people-tab'){if(['list','map'].includes(id)){peopleTab=id;relationshipMapFocus=false;render();}return;}
    if(action==='people-radar-toggle'){peopleRadarExpanded=!peopleRadarExpanded;render();return;}
    if(action==='people-show-all'){peopleShowAll=true;render();return;}
    if(action==='people-show-less'){peopleShowAll=false;render();return;}
    if(action==='rel567-focus'){relationshipMapFocus=!relationshipMapFocus;render();app.querySelector('.rel567-overlay')?.focus?.();return;}
    if(action==='rel567-filter'){if(['all','family','friend','colleague','partner','impulse','project'].includes(id)){relationshipMapFilter=id;render();}return;}
    if(action==='person-quick-log'){if(!state?.people?.[id])return;contactSaveStatus='';selectedPersonId=id;quickContactType=quickContactType||'call';if(state.contactDrafts?.[id])state.contactDrafts[id].type=quickContactType;render();const form=app.querySelector('#person-contact-form');form?.querySelector('[name="note"]')?.focus?.();return;}
    if(action==='person-pause-toggle'){if(!state?.people?.[id])return;await mutate(s=>{s.people[id]=pauseContact(s.people[id],s.people[id].contactPaused!==true,localDate());s.people[id].contactMode=s.people[id].contactPaused?'paused':'intentional';});toast(state.people[id].contactPaused?'Kontaktimpulse pausiert.':'Kontaktimpulse wieder aktiv.');return;}
    if(action==='person-project-open'){if(!state?.projects?.[id])return;selectedProjectId=id;tab='projects';render();return;}
    if(action==='person-project-unlink'){if(!state?.people?.[selectedPersonId])return;await mutate(s=>{s.people[selectedPersonId].relatedProjectIds=(s.people[selectedPersonId].relatedProjectIds||[]).filter(x=>x!==id);});toast('Projektverknüpfung gelöst.');return;}
    if(action==='person-select'){familyRadarJumpPersonId401=null;contactSaveStatus='';selectedPersonId=id;personOpenPointId='';quickContactType='';render();return;}
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
    if(action==='focus-review-open'){
      const first=activeActivities(watchSessions,state).filter(a=>a.activityTypeReview).sort((a,b)=>a.startedAt.localeCompare(b.startedAt))[0];
      if(!first)return toast('Keine offenen Prüfungs-Sessions vorhanden.');
      activityReviewFlow=true;activitySelectedId=first.id;activityTrash=false;tab='activity';render();
      const field=app.querySelector('#activity-edit-form select[name="activityType"]');field?.scrollIntoView({block:'center'});field?.focus({preventScroll:true});return;
    }
    if(action==='activity-tab'){activityTrash=id==='trash';activitySelectedId=null;activityReviewFlow=false;render();return;}
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
    if(action==='tree-inspector-close'){if(tab==='projects'){compass58InspectorHidden=true;render();return;}selectedTaskId=null;selectedProjectId=null;render();return;}
    if(action==='compass58-folder-expand'){if(compass58Collapsed.has(id)){compass58Collapsed.delete(id);compass58Expanded.add(id);}else{compass58Collapsed.add(id);compass58Expanded.delete(id);}render();return;}
    if(action==='compass58-inspector-toggle'){compass58InspectorHidden=!compass58InspectorHidden;render();return;}
    if(action==='compass58-tools'){compass58ToolsOpen=!compass58ToolsOpen;render();return;}
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
    if(action==='tree-task-select'){const t=state.tasks?.[id];if(!t)return;selectedTaskId=id;selectedProjectId=t.projectId;compass58InspectorHidden=false;render();return;}
    if(action==='shopping741-open'){
   const active=shoppingLists(state).filter(p=>p.status==='active');
   if(!active.length){shoppingSelectedId='';tab='shopping';calmNavGroup='plan';render();return;}
   shoppingSelectedId=active.some(p=>p.id===id)?id:active[0].id;
   tab='shopping';calmNavGroup='plan';render();return;
  }
  if(action==='shopping713-create'){
      const template=Object.values(state.projects||{}).find(isShoppingTemplate);
      if(!template){toast('Keine Einkaufsvorlage gefunden.',true);return;}
      const name=prompt('Name der neuen Einkaufsliste',template.title+' – '+localDate());if(name===null)return;
      try{let result;await mutate(s=>{result=instantiateShoppingList(s,template.id,()=>crypto.randomUUID(),name.trim());});shoppingSelectedId=result.project.id;tab='shopping';toast('Neue Einkaufsliste aus der Vorlage erstellt.');}catch(ex){toast(ex.message,true);}return;
    }
    if(action==='compass57-shop-tab'){if(id==='list'||id==='stats'){compass57ShoppingTab=id;render();}return;}
    if(action==='compass57-finance-details'){compass55Mode='extended';try{localStorage.setItem(COMPASS55_MODE_KEY,'extended');}catch{}tab='finance';financePane='Überblick';calmNavGroup='finance';render();return;}
    if(action==='shopping713-select'){if(shoppingLists(state).some(p=>p.id===id)){shoppingSelectedId=id;scheduleWatchCalendarSnapshot();render();}return;}
    if(action==='shopping713-open-master'){if(!state.projects?.[id]?.isTemplate)return;selectedProjectId=id;selectedTaskId=null;tab='templates';calmNavGroup='plan';render();return;}
    if(action==='shopping713-edit-list'){if(!shoppingLists(state).some(p=>p.id===id))return;selectedProjectId=id;selectedTaskId=null;tab='projects';calmNavGroup='plan';projectCollapsed.delete(state.projects[id].parentId);projectCollapsed.delete(id);render();return;}
    if(action==='shopping713-check'){
      const t=state.tasks?.[id];if(!t||!shoppingLists(state).some(p=>p.id===t.projectId)||t.archived)return;
      const scrollY=window.scrollY;
      await mutate(s=>{s.tasks[id].completed=!s.tasks[id].completed;s.tasks[id].updatedAt=stamp();s.taskPending[id]=true;});
      requestAnimationFrame(()=>window.scrollTo?.({top:scrollY,behavior:'instant'}));return;
    }
    if(action==='shopping713-archive'){
      if(!shoppingLists(state).some(p=>p.id===id))return;
      const remaining=shoppingProgress(state,id).remaining;
      if(!confirm(remaining?`Diese Einkaufsliste hat noch ${remaining} offene Positionen. Trotzdem archivieren? Die Vorlage bleibt erhalten.`:'Einkauf abgeschlossen? Diese Liste archivieren (die Vorlage bleibt erhalten)?'))return;
      try{await mutate(s=>archiveShoppingList(s,id));shoppingSelectedId='';toast('Einkaufsliste archiviert. Die Vorlage bleibt unverändert.');}catch(ex){toast(ex.message,true);}return;
    }
    if(action==='shopping713-restore'){
      try{await mutate(s=>restoreShoppingList(s,id));shoppingSelectedId=id;toast('Einkaufsliste wieder geöffnet.');}catch(ex){toast(ex.message,true);}return;
    }
    if(action==='tree-template-add-task'){
      if(!state.projects?.[id]?.isTemplate)return;selectedProjectId=id;selectedTaskId=null;treeCreateKind='task';treeCreateParent=id;treeTaskParent=null;tab='templates';render();requestAnimationFrame(()=>app.querySelector('#task-create-form [name="title"]')?.focus());return;
    }
    if(action==='tree-template-use'){
      if(!state.projects?.[id]?.isTemplate)return;
      const name=prompt('Name der neuen Liste',state.projects[id].title+' – '+localDate());if(name===null)return;
      try{let created;const shopping=isShoppingTemplate(state.projects[id]);await mutate(s=>{created=shopping?instantiateShoppingList(s,id,()=>crypto.randomUUID(),name):cloneProjectTemplate(s,id,()=>crypto.randomUUID(),name);});selectedProjectId=created.project.id;selectedTaskId=null;tab=shopping?'shopping':'projects';if(shopping)shoppingSelectedId=created.project.id;calmNavGroup='plan';projectCollapsed.delete(created.project.id);toast(shopping?'Einkaufsliste erstellt. Du kannst sie hier direkt abhaken.':'Neue Liste aus der Vorlage erstellt. Die Vorlage bleibt unverändert.');}catch(ex){toast(ex.message,true);}return;
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
      const quick=true;
      await mutate(s=>moveOrder(s,'tasks',id,action==='task-move-up'?-1:1),null,quick,quick?{fastPlanning:true,fastGtd:true}:null);return;
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
      projectCollapsed.delete(id);selectedProjectId=id;selectedTaskId=null;compass58InspectorHidden=true;if(p.kind==='folder')compass58Expanded.add(id);
      if(p.isTemplate)tab='templates';else if(tab==='templates')tab='projects';
      render();const details=app.querySelector('.project-properties');if(details)details.open=true;return;
    }
    if(action==='p49-today-up'||action==='p49-today-down'){
      const delta=action==='p49-today-up'?-1:1,day=selectedDay;
      const updates=todayMove49(state,day,id,delta);
      if(!updates.length)return;
      await mutate(s=>{for(const u of updates){if(!s.tasks[u.id])continue;s.tasks[u.id].sortOrder=u.sortOrder;s.tasks[u.id].updatedAt=stamp();s.taskPending[u.id]=true;}});return;
    }
    if(action==='task49-trash'||action==='task49-restore'||action==='task49-redact'){
      const t=state?.tasks?.[id];if(!t)return;
      if(action==='task49-trash'&&!confirm('Aufgabe „'+t.title+'“ in den Papierkorb verschieben?'))return;
      if(action==='task49-redact'){
        if(taskLife49(t)!=='trash')return;
        if(Object.values(state.tasks||{}).some(x=>x?.parentTaskId===id&&!x.archived))return toast('Zuerst die Unteraufgaben verschieben oder archivieren.',true);
        if(!confirm('Inhalt dieser Aufgabe endgültig entfernen? Titel und Notiz werden überschrieben; eine technische Synchronisationssperre bleibt bestehen.'))return;
      }
      await mutate(s=>{const x=s.tasks[id];if(!x)return;
        const tags=(x.tags||[]).filter(v=>v!==TASK_TRASH_TAG49&&v!==TASK_PURGED_TAG49);
        if(action==='task49-trash')tags.push(TASK_TRASH_TAG49);
        if(action==='task49-redact')tags.push(TASK_PURGED_TAG49);
        x.tags=tags;x.archived=action!=='task49-restore';
        if(action==='task49-redact'){x.title='Entfernte Aufgabe';x.note='';x.plannedDate=null;x.dueDate=null;x.deferUntil=null;x.category='Allgemein';x.projectId=null;x.parentTaskId=null;x.contextTags=[];x.flagged=false;x.completed=true;x.estimateMinutes=null;x.progressCurrent=0;x.progressTarget=null;x.sortOrder=0;x.tags=[TASK_PURGED_TAG49];}
        x.updatedAt=stamp();s.taskPending[id]=true;
      });if(selectedTaskId===id){selectedTaskId=null;todayInspectorOpen=false;}return;
    }
    if(action==='p48-view-archive'||action==='p48-view-trash'){projectVaultView48=action==='p48-view-archive'?'archived':'trash';selectedProjectId=null;selectedTaskId=null;treeCreateKind='';render();return;}
    if(action==='p48-close'){projectVaultView48='';render();return;}
    if(action==='p48-archive'||action==='p48-trash'||action==='p48-restore'||action==='p48-purge'){
      const p=state?.projects?.[id];if(!p)return;
      if(action==='p48-archive'&&p.status==='archived'||action==='p48-trash'&&p.status==='trash')return;
      if(action==='p48-purge'){
        if(!canPurgeProject48(state,id))return toast('Endgültiges Löschen ist nur bei leeren Projekten oder Ordnern im Papierkorb erlaubt. Aufgaben und Unterprojekte zuerst verschieben.',true);
        if(!confirm('Projekt endgültig löschen? Dies kann nach Synchronisierung nicht rückgängig gemacht werden.'))return;
      }else if(action==='p48-trash'){
        if(!confirm('„'+p.title+'“ in den Papierkorb verschieben? Unterprojekte und Aufgaben bleiben erhalten.'))return;
      }
      try{await mutate(s=>{const x=s.projects[id];const next=action==='p48-archive'?'archived':action==='p48-trash'?'trash':action==='p48-purge'?'deleted':x.status==='archived'?'completed':'active';
       s.projects[id]=next==='deleted'?redactProject48(x):{...x,status:next};s.projectPending[id]=true;});
       if(selectedProjectId===id){selectedProjectId=null;selectedTaskId=null;}
       toast(action==='p48-purge'?'Projektinhalt gelöscht; eine technische ID-Sperre verhindert Wiederherstellung durch alte Geräte.':action==='p48-trash'?'In den Papierkorb verschoben.':action==='p48-archive'?'Projekt archiviert.':'Projekt wiederhergestellt.');
      }catch(ex){toast(ex.message,true);}return;
    }
    if(action==='project-reviewed'){if(!state?.projects?.[id])return;await mutate(s=>{s.projects[id].reviewedAt=stamp();s.projectPending[id]=true;});toast('Projekt-Review dokumentiert.');return;}
    if(action==='project-conflict-local'||action==='project-conflict-remote'){
      const conflict=state?.projectConflicts[id];if(!conflict)return;
      await mutate(s=>{if(action==='project-conflict-remote'&&conflict.remote){s.projects[id]=conflict.remote;s.projectVersions[id]=conflict.remote.version;delete s.projectPending[id];}
        else {s.projectVersions[id]=conflict.remote?.version||0;s.projectPending[id]=true;}delete s.projectConflicts[id];});return;
    }
    if(action==='calendar-contact-confirm'){
      const personId=[...app.querySelectorAll('[data-action="calendar-contact-confirm"]')].find(el=>el.dataset.id===id)?.dataset.person;
      const e=calendarEvents.find(x=>x.id===id),p=state?.people?.[personId];if(!e||!p)return;
      const entry={id:crypto.randomUUID(),day:calendarDate(e),type:'meeting',note:`Kalender: ${String(e.summary||'Termin').slice(0,140)}`,sourceEventId:e.id};
      if(!confirm(`Hat das Treffen „${e.summary||'Termin'}“ mit ${p.name} tatsächlich stattgefunden?`))return;
      await mutate(s=>{s.people[personId]=addContactEntry(s.people[personId],entry,localDate()).person;});contactSaveStatus='✓ Kalender-Treffen bestätigt und gespeichert';return;
    }
    if(action==='calendar-contact-dismiss'||action==='calendar-deadline-dismiss'){
      await mutate(s=>{s.calendarSuggestionDismissed??={};s.calendarSuggestionDismissed[id]=localDate();});return;
    }
    if(action==='calendar-deadline-create'){
      const e=calendarEvents.find(x=>x.id===id);if(!e||!state)return;
      const found=deadlineSuggestions([e],state.projects||{},state.calendarSuggestionDismissed||{},localDate()).length;
      if(!found)return toast('Projekt vorhanden oder Termin kein gültiger Vorschlag.',true);
      const title=String(e.summary||'Prüfungsvorbereitung').trim().slice(0,140);
      if(!confirm(`Vorbereitungsprojekt für „${title}“ am ${calendarDate(e)} anlegen? Bitte Termin und bestehende Projekte prüfen.`))return;
      const project={id:crypto.randomUUID(),title:`Vorbereitung: ${title}`.slice(0,140),outcome:`Vorbereitet für den Kalendertermin am ${calendarDate(e)}`,category:'Allgemein',status:'active',dueDate:calendarDate(e),reviewIntervalDays:7,reviewedAt:null,kind:'project',folderIcon:null,isTemplate:false,projectType:'parallel',parentId:null,sortOrder:0,calendarSourceId:id};
      if(!validProject(project))return toast('Ungültige Projektdaten.',true);
      await mutate(s=>{s.projects[project.id]=project;s.projectPending[project.id]=true;s.calendarSuggestionDismissed??={};s.calendarSuggestionDismissed[id]=localDate();});
      selectedProjectId=project.id;toast('Vorbereitungsprojekt bestätigt und angelegt. Bitte nächste Schritte ergänzen.');return;
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
      if(!state&&!sealedCaptureAvailable){captureAfterUnlock=true;document.querySelector('#passphrase')?.focus();return;}
      captureNeedsInitialFocus=!captureOverlayOpen;
      captureOverlayOpen=true;render();return;
    }
    if(action==='capture-close'||action==='capture-close-backdrop'){captureOverlayOpen=false;render();return;}
    if(action==='select-day'){if(!/^\d{4}-\d{2}-\d{2}$/.test(id||''))return;selectedDay=id;manuallyChosenDay=id!==localDateString(new Date());todayInspectorOpen=false;calendarMonth=new Date(`${id}T12:00:00`);render();return;}
    if(action==='reset-today'){selectedDay=localDateString(new Date());todayInspectorOpen=false;calendarMonth=new Date();render();return;}
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
    if(action==='compass54-retry'){if(tab==='finance'||tab==='insights'){compass54Load(tab);render();}return;}
    if(action==='compass55-mode'){
     if(id==='focus'||id==='extended'){
      compass55Mode=id;
      try{localStorage.setItem(COMPASS55_MODE_KEY,id);}catch{}
      if(id==='focus'&&(tab==='insights'||tab==='finance'||['activity','recovery','progress'].includes(tab))){tab='today';todayInspectorOpen=false;calmNavGroup='';}
      if(id==='extended'&&calmNavGroup==='')calmNavGroup='insights';
      render();
     }
     return;
    }
    if(action==='compass56-recommend'){compass56RecommendationDay=selectedDay;compass56RecommendationMarkup=todaySmartPanel();render();return;}
    if(action==='compass56-recommend-close'){compass56RecommendationMarkup='';compass56RecommendationDay='';if(!compass55RefreshInspector())render();return;}
    if(action==='compass56-planning'){compass56PlanningOpen=!compass56PlanningOpen;render();return;}
    if(action==='finance79-next'||action==='finance79-prev'){const count=mobileFinanceReviewRows(state,financeAccount).length;financeReviewPage=Math.min(Math.max(0,Math.ceil(count/10)-1),Math.max(0,financeReviewPage+(action==='finance79-next'?1:-1)));render();return;}
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
    if(action==='insights-tab'){if(id==='nutrition')nutritionView712='journal';if(id==='touch'||id==='dreamworld'||id==='weekly'||id==='capacity'||INSIGHT_TABS.some(t=>t.id===id)){tab='insights';calmNavGroup='insights';if(id==='places'&&insightTab!=='places')insightPeriod='all';insightTab=id;render();if(['focus','timejournal'].includes(id)&&authToken){reloadWatchSessions().catch(()=>{});}}return;}
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
    if(action==='insights-year-window'){
      if(!['prev','next','today'].includes(id))return;
      const today=localDate(),base=insightYearAnchor||today;
      if(id==='today'){insightYearAnchor='';render();return;}
      const yy=Number(base.slice(0,4))+(id==='prev'?-1:1),mm=Number(base.slice(5,7)),dd=Number(base.slice(8,10));
      const last=new Date(Date.UTC(yy,mm,0)).getUTCDate();
      const target=`${yy}-${String(mm).padStart(2,'0')}-${String(Math.min(dd,last)).padStart(2,'0')}`;
      // Only allow previous windows if the vault contains a measured night there.
      const all=state?.healthImports?.garminNights||[];
      const eligible=all.some(n=>/^\d{4}-\d{2}-\d{2}$/.test(n?.day||'')&&n.day<=target&&n.day<=today);
      if(id==='prev'&&!eligible)return;
      insightYearAnchor=target>=today?'':target;render();return;
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
    if(action==='lock'){await morningBeforeLock();feelingOverlayOpen=false;feelingDraft=newFeelingDraft();captureOverlayOpen=false;captureSkipNextSnapshot=true;captureDraft={title:'',note:'',noteOpen:false};dashboardCaptureDraft='';smartHubEntries=[];smartHubStage=null;smartHubFolders.health=null;smartHubFolders.finance=null;delete smartHubFolderStatus.health;delete smartHubFolderStatus.finance;healthFilePreview=null;selectedGarminNight='';clearTimeout(syncTimer);calendarToken='';calendarEvents=[];calendarExpires=0;healthDays=[];healthDevices=[];healthPairCode='';healthError='';widgetPairCode='';widgetDevices=[];await editDraftGuard.flush().catch(()=>{});await vault.flushCoreWrites().catch(()=>{});editDraftGuard.reset();vault.lock();state=null;outlook724Token='';outlook724Connected=false;outlook724Preview=[];authToken='';currentUser='';notice='';error='';render();return;}
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
    if(action==='discovery-research-open'){
      if(!researchButton(id))return;
      tab='recovery';discoverySelectedResearch=id;
      if(id==='cinema-program'){discoveryDisplayMode='cinema';discoveryCategories=['Kino','Filmfestival','Kabarett'];discoveryRange='all';discoveryCinemaPeriod='day';discoveryCinemaDay=localDate();}
      discoveryPromptText=researchPrompt(id,EVENT_CATEGORIES);
      discoveryImportOpen=true;discoveryImportPreview=null;discoveryImportError='';
      let copied=false;try{await navigator.clipboard.writeText(discoveryPromptText);copied=true;}catch{}
      render();requestAnimationFrame(()=>app.querySelector('#discovery-research-panel')?.scrollIntoView({behavior:'smooth',block:'start'}));
      toast(copied?'Aktuelle Recherche ist fällig – Prompt kopiert.':'Recherche ist fällig – Prompt unten zum Kopieren geöffnet.');
      return;
    }
    if(action==='discovery-prompt'){if(!researchButton(id))return;discoverySelectedResearch=id;if(id==='cinema-program'){discoveryDisplayMode='cinema';discoveryCategories=['Kino','Filmfestival','Kabarett'];discoveryRange='all';discoveryCinemaPeriod='day';discoveryCinemaDay=localDate();}discoveryPromptText=researchPrompt(id,EVENT_CATEGORIES);discoveryImportOpen=true;discoveryImportPreview=null;let copied=false;try{await navigator.clipboard.writeText(discoveryPromptText);copied=true;}catch{}render();toast(copied?'Rechercheprompt kopiert – in ChatGPT einfügen.':'Rechercheprompt unten anzeigen und manuell kopieren.');return;}
    if(action==='discovery-clear-cinema'){
      const cinema=(state?.discoveredEvents||[]).filter(isCinemaEvent);
      if(!cinema.length){toast('Keine importierten Kinovorführungen vorhanden.');return;}
      const marked=cinema.filter(e=>state?.eventPreferences?.[eventKey(e)]==='saved').length;
      const titles=new Set(cinema.map(e=>String(e.title||'').toLocaleLowerCase('de').trim())).size;
      if(!confirm(`Nur das Kinoprogramm löschen?\n\n${cinema.length} Vorführungen (${titles} unterschiedliche Filmtitel) werden entfernt.${marked?`\nDarunter ${marked} GEMERKTE Kinovorführungen – diese werden ebenfalls gelöscht!`:''}\n\nKabarett, Konzerte, Festivals ohne Filmbezug, Tanz, Workshops, Sport und alle anderen Bereiche bleiben erhalten. Die Löschung wird mit der Compass-Cloud synchronisiert und ist nicht rückgängig zu machen.`))return;
      const result={removed:0,saved:0};
      await mutate(st=>{Object.assign(result,removeCinemaEvents(st));st.discoveryCinemaClearedAt=new Date().toISOString();});
      discoveryImportPreview=null;discoveryCinemaQuery='';discoveryExpandedFilms.clear();
      toast(`${result.removed} Kinovorführungen (${titles} Filme) lokal gelöscht; Cloud-Abgleich ausstehend. Andere Veranstaltungen bleiben erhalten.`);return;
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
      if(title!==existing.title){await mutate(s=>{s.tasks[id].title=title;s.tasks[id].updatedAt=stamp();s.taskPending[id]=true;},null,true,{fastGtd:true,fastPlanning:true,singleTaskId:id});render();}
      inlineEditingTaskId=null;render();return;
    }
    if(action==='task-select'){if(!state?.tasks?.[id])return;if(tab==='forecast')forecastInspectorOpen401=true;selectedTaskId=id;if(tab==='today')todayInspectorOpen=true;if(!compass55RefreshInspector())render();if(tab==='today'&&window.matchMedia?.('(max-width:800px)')?.matches)requestAnimationFrame(()=>app.querySelector('.today-focus-inspector')?.scrollIntoView?.({behavior:'smooth',block:'start'}));return;}
    if(action==='today-inspector-close'){todayInspectorOpen=false;selectedTaskId=null;if(!compass55RefreshInspector())render();return;}
    if(action==='flag-existing'){if(!state?.tasks?.[id])return;await mutate(s=>{s.tasks[id].flagged=true;s.taskPending??={};s.taskPending[id]=true;});return;}
    if(action==='inbox-flag'){const r=state?.records?.[id];if(!r||r.deleted||r.tags?.includes('dreams'))return;let tags;try{tags=setInboxFlag(r.tags,!inboxFlagged(r));}catch(ex){toast(ex.message,true);return;}selectedInboxId=id;await mutate(s=>{const record=s.records[id];record.tags=tags;record.updatedAt=stamp();s.pending.push(makeMutation(record));});return;}
    if(action==='task-progress-plus'||action==='task-progress-minus'){
      const t=state?.tasks?.[id];if(!t||t.archived||t.completed||state.projects?.[t.projectId]?.isTemplate)return;
      const next=advanceTaskCounter(t,action==='task-progress-plus'?1:-1);
      if(next===null||next===(t.progressCurrent??0))return;
      const quick=tab!=='people';
      await mutate(s=>{s.tasks[id]={...s.tasks[id],progressCurrent:next,updatedAt:stamp()};s.taskPending[id]=true;},null,quick,
        quick?{fastPlanning:true,fastGtd:true,singleTaskId:id,inlineGtd:true,onApplied:()=>paintGtdProgress(app,id,state.tasks[id])}:null);
      if(next===t.progressTarget)toast('Stückziel erreicht! Die Aufgabe bleibt offen, bis du sie abschließt.');
      return;
    }
    if(action==='task-flag'){if(!state?.tasks?.[id])return;await mutate(s=>{s.tasks[id].flagged=!s.tasks[id].flagged;s.taskPending[id]=true;},null,false,{fastGtd:true,fastPlanning:true,singleTaskId:id});return;}
    if(action==='wf715-suggest'){
      const date=String(day||'');
      const field=app.querySelector('#wf715-create [name="checkDate"]');
      if(field&&isAustrianWorkday(date)){field.value=date;app.querySelectorAll('.wf715-suggest').forEach(x=>x.classList.toggle('is-active',x.dataset.day===date));}
      return;
    }
    if(action==='wf715-open-origin'){
      const t=state?.tasks?.[id];if(!t)return;selectedTaskId=id;todayInspectorOpen=true;render();return;
    }
    if(action==='wf715-postpone'){
      const task=state?.tasks?.[id];if(!task)return;
      try{const shifted=postponeWaitingFollowup(task,localDate(),5);await mutate(s=>{s.tasks[id]=shifted;s.taskPending[id]=true;});toast('Wiedervorlage um 5 österreichische Werktage verschoben.');}
      catch(ex){toast(ex.message,true);}return;
    }
    if(action==='wf715-complete'){
      const task=state?.tasks?.[id];if(!task||task.completed||!waitingSourceId(task))return;
      if(!confirm('Ist die erwartete Antwort eingetroffen? Die Waiting-For-Aufgabe wird abgeschlossen, die Ausgangsaufgabe bleibt unverändert.'))return;
      await mutate(s=>{s.tasks[id].completed=true;s.tasks[id].updatedAt=stamp();s.taskPending[id]=true;});
      toast('Rückmeldung als erledigt markiert.');return;
    }
    if(action==='inspi23-skip'){inspirationRatingTask23=null;render();return;}
    if(action==='inspi23-rate'){
      const selected=inspirationRatingTask23;if(!selected)return;
      try{
       const rated=inspirationEntry(selected,Number(id));
       // A separately encrypted personal-journal record: task sync must not strip it.
       await mutate(s=>addInspirationEntry(s,rated));
       inspirationRatingTask23=null;render();toast('Persönliche Motivationsbewertung gespeichert.');
      }catch(ex){toast('Bewertung konnte nicht gespeichert werden: '+ex.message,true);}
      return;
    }
    if(action==='task-toggle'){if(!state?.tasks?.[id])return;if(state.projects?.[state.tasks[id].projectId]?.isTemplate){toast('Vorlage bleibt unverändert. Erstelle eine neue Liste daraus.');return;}const newlyCompleted=!state.tasks[id].completed;
      const ratingCandidate=newlyCompleted?{id:state.tasks[id].id,title:state.tasks[id].title,category:state.tasks[id].category,projectId:state.tasks[id].projectId}:null;
      const fast=tab==='today'&&!['source','receiver'].includes(state.privateDeviceMirror?.mode)&&[...app.querySelectorAll('.today-tasks .task-row [data-action="task-toggle"]')].some(el=>el.dataset.id===id);
      await mutate(s=>{s.tasks[id]={...s.tasks[id],completed:!s.tasks[id].completed,updatedAt:stamp()};s.taskPending[id]=true;},null,fast,{fastGtd:true,fastPlanning:true,singleTaskId:id,...(fast?{fastTodayVisual:true,onApplied:()=>{compass55FastTaskPaint(id);if(todayInspectorOpen&&selectedTaskId===id)compass55RefreshInspector();}}:{})});
      if(newlyCompleted&&state?.tasks?.[id]?.completed){inspirationRatingTask23=ratingCandidate;render();}
      return;}
    if(action==='task-archive'){if(!confirm('Aufgabe archivieren?'))return;await mutate(s=>{s.tasks[id].archived=true;s.tasks[id].updatedAt=stamp();s.taskPending[id]=true;},null,false,{fastGtd:true,fastPlanning:true,singleTaskId:id});selectedTaskId=null;todayInspectorOpen=false;return;}
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
   const payload={...projectPlain(project),baseVersion:state.projectVersions[id]||0};
   const data=await syncProjectWithTrash410(payload,
     (p)=>request(config.apiUrl,authToken,'/api/projects',{method:'POST',body:JSON.stringify(p)}),
     async(version)=>{state.projectVersions[id]=version;await persist();},
     ()=>before===JSON.stringify(projectPlain(state.projects[id])));
   if(data.deferred)continue;
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
 if(mergeProjectSnapshot(state,data.projects||[]))await persist();
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
  if(mergeTaskSnapshot(state,snapshot.tasks||[]))await persist();
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
 prunePastEvents(state,localDate(),0,0);await persist();
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
async function syncNow({silent=false}={}) {
  if(!state||!authToken||busy||!navigator.onLine)return;
  // An automatic sync must never compete with typing a project/template item.
  // Explicit Sync clicks focus their own button and proceed normally.
  const activeEditor=document.activeElement?.closest?.('form');
  if(activeEditor&&['task-create-form','project-create-form','task-edit-form','project-edit-form','meal723-compose-form','meal723-json-form'].includes(activeEditor.id)&&
      ['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)){
    scheduleSync(12000);return;
  }
  const syncMeasurement=performanceTrace.start();
  clearTimeout(syncTimer);syncTimer=null;
  busy=true;if(!silent)render();
  try {
    const health=await request(config.apiUrl,authToken,'/api/health');
    assertCompatibleWorker(health);
    const stale=prunePastEvents(state,localDate(),0,0);if(stale)await persist();
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
      const previousCursor=state.cursor;
      mergePulled(state,data.changes||[]);state.cursor=data.cursor;
      if((data.changes||[]).length||previousCursor!==data.cursor)await persist();
      if(!data.hasMore)break;
    }
    const fixed=pruneIdenticalConflicts(state);if(fixed)await persist();
    await syncProjects();
    await syncTasks();
    await syncEvents();
    await syncReview();
    if(state?.privateDeviceMirror?.mode==='source')await publishPrivateMirror();
    else if(state?.privateDeviceMirror?.mode==='receiver')await receivePrivateMirror();
    if(state?.privateDeviceMirror?.key)await syncPersonalJournal();
    lastSyncAt=Date.now();
    notice=state.conflicts.length?'Synchronisiert – bitte Konflikte prüfen.':state.peopleSyncEnabled&&state.privateDeviceMirror?.key&&journalSyncStatus==='ok'?'Planung, Inbox und aktivierte verschlüsselte Kontaktprofile abgeglichen.':'Planung & Inbox synchronisiert · Kontakte bleiben auf diesem Gerät, sofern nicht ausdrücklich für E2EE aktiviert.';
    error='';
  }catch(ex){
    syncResyncRequested=false;
    error=ex.status===401?'Google-Sitzung abgelaufen. Bitte erneut anmelden.':`Synchronisation: ${ex.message}`;
    if(ex.status===401){authToken='';currentUser='';await vault.clearSession().catch(()=>{});}
  }finally{
    busy=false;if(!silent||error||Date.now()-lastActivity>=1500)render();performanceTrace.end('Cloud-Abgleich',tab,syncMeasurement);
    const retry=syncResyncRequested&&Boolean(state?.pending.length||Object.keys(state?.taskPending||{}).length||Object.keys(state?.projectPending||{}).length||Object.keys(state?.eventPending||{}).length||state?.reviewPending)&&Boolean(authToken)&&navigator.onLine&&!error;
    syncResyncRequested=false;
    if(retry)scheduleSync(CHANGE_DEBOUNCE_MS);
  }
}
// Opt-in, content-free interaction-to-paint measurement attached to a stable root.
if(typeof app.addEventListener==='function')for(const eventName of ['click','submit'])app.addEventListener(eventName,ev=>{
 if(!performanceTrace.enabled)return;
 const target=ev.target?.closest?.('[data-action],[data-tab],button,form');
 const candidate=eventName==='submit'?(ev.target?.id||'speichern'):(target?.dataset?.action||target?.dataset?.tab||'klick');
 const safe=/^[a-z0-9:_-]{1,44}$/i.test(candidate)?candidate:'anderes';
 const kind=eventName==='submit'?'Formular: '+safe:target?.dataset?.tab?'Navigation: '+safe:'Aktion: '+safe;
 const started=performanceTrace.start(),view=tab;
 if(typeof requestAnimationFrame==='function')requestAnimationFrame(()=>requestAnimationFrame(()=>performanceTrace.end(kind,view,started)));
},{capture:true});
document.addEventListener('keydown',ev=>{
  const target=ev.target;
  if((ev.key==='Enter'||ev.key===' ')&&target?.matches?.('.fin32-cycle-hit,.fin32-pattern-card')){ev.preventDefault();runAction(target.dataset.action,target.dataset.id);return;}
  if((ev.key==='Enter'||ev.key===' ')&&target?.matches?.('.lbr672-chart-node')){ev.preventDefault();runAction('balance-select',target.dataset.id);return;}
  const typing=target instanceof HTMLElement && (['INPUT','TEXTAREA','SELECT'].includes(target.tagName)||target.isContentEditable);
  if((ev.ctrlKey||ev.metaKey)&&ev.key.toLowerCase()==='k'){
    ev.preventDefault();runAction('capture-focus');return;
  }
  if(ev.key==='Tab'&&feelingOverlayOpen){const modal=app.querySelector('#fw65-dialog');const focusables=[...(modal?.querySelectorAll('button:not([disabled]),input:not([disabled]),textarea:not([disabled])')||[])];if(focusables.length){const i=focusables.indexOf(document.activeElement);if(ev.shiftKey&&(i<=0)){ev.preventDefault();focusables.at(-1).focus();}else if(!ev.shiftKey&&(i===focusables.length-1||i===-1)){ev.preventDefault();focusables[0].focus();}}return;}
  if(ev.key==='Escape'&&morningPlayerOpen){ev.preventDefault();morningCloseOverlay();render();return;}
  if(ev.key==='Escape'&&feelingOverlayOpen){ev.preventDefault();feelingOverlayOpen=false;render();return;}
  if(ev.key==='Escape'&&captureOverlayOpen){ev.preventDefault();captureOverlayOpen=false;render();return;}
  if(ev.key==='Escape'&&nutritionEditId&&tab==='insights'&&insightTab==='nutrition'){ev.preventDefault();nutritionEditId='';render();return;}
  if(!typing&&!ev.ctrlKey&&!ev.altKey&&!ev.metaKey&&ev.key.toLowerCase()==='n'&&state){ev.preventDefault();runAction('capture-focus');}
});
window.addEventListener('online',()=>{render();if(authToken){scheduleSync(0);scheduleJournalSync(0);}});
document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='visible')scheduleJournalSync(0);
  if(document.visibilityState==='visible'&&authToken&&state&&
    (state.pending.length||Object.keys(state.taskPending||{}).length||Object.keys(state.eventPending||{}).length||state.reviewPending||Date.now()-lastSyncAt>=SYNC_INTERVAL_MS))scheduleSync(1000);
});
setInterval(()=>{
  if(state&&authToken&&navigator.onLine&&document.visibilityState==='visible'&&
     Date.now()-lastSyncAt>=SYNC_INTERVAL_MS&&!busy)scheduleSync(0);
},60000);
document.addEventListener('compass:post-workout-nutrition-5928',e=>{
  // Never auto-log a supplement. The athlete decides whether anything was consumed.
  toast(e.detail?.message||'Workout abgeschlossen.');
 });
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&state&&tab==='today'&&core259FamilyKey){
    if(typeof requestAnimationFrame==='function')requestAnimationFrame(core259FamilyAfterPaint);else setTimeout(core259FamilyAfterPaint,0);
  }});
window.addEventListener('offline',render);
for(const e of ['pointerdown','keydown','touchstart'])document.addEventListener(e,()=>{lastActivity=Date.now();coreIdlePolicy.noteActivity(lastActivity);},{passive:true});
setInterval(async()=>{if(state&&Date.now()-lastActivity>15*60*1000&&document.documentElement.dataset.compassRoutineActive!=='yes'&&Number(document.documentElement.dataset.compassRoutineGraceUntil||0)<Date.now()){await morningBeforeLock();feelingOverlayOpen=false;feelingDraft=newFeelingDraft();captureOverlayOpen=false;captureDraft={title:'',note:'',noteOpen:false};dashboardCaptureDraft='';captureSkipNextSnapshot=true;smartHubEntries=[];smartHubStage=null;smartHubFolders.health=null;smartHubFolders.finance=null;delete smartHubFolderStatus.health;delete smartHubFolderStatus.finance;clearTimeout(syncTimer);await editDraftGuard.flush().catch(()=>{});await vault.flushCoreWrites().catch(()=>{});editDraftGuard.reset();vault.lock();state=null;authToken='';currentUser='';calendarToken='';calendarEvents=[];calendarExpires=0;notice='Nach 15 Minuten Inaktivität automatisch gesperrt.';render();}},60000);
(async()=>{
  try{config=await fetch(`${import.meta.env.BASE_URL}runtime-config.json`,{cache:'no-store'}).then(r=>r.json());}
  catch{config={};}
  hasVault=await vault.exists();sealedCaptureAvailable=hasVault?await vault.sealedCaptureReady():false;if(bootCapture&&hasVault&&sealedCaptureAvailable){captureAfterUnlock=false;captureOverlayOpen=true;captureNeedsInitialFocus=true;}render();if(bootCapture)history.replaceState(null,'',location.pathname);
})().catch(ex=>{app.innerHTML=`<div class="fatal">Lokaler Speicher nicht verfügbar: ${h(ex.message)}. Bitte einen sicheren Browserkontext verwenden.</div>`;});
