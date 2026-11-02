# Compass 0.5.91.14 · Automatische Trainingsblöcke und Periodisierungs-Review

**Basis:** GitHub `main` Version 0.5.91.13, Commit `c12af22adadd6657d7994c4111052fb282c35302`, abgeglichen am 2.11.2026. Keine Änderung an bestehenden Trainingssätzen, -gewichten oder Übungsbestätigungen.

## Umsetzung

- **Erkennung statt Startknopf:** `strengthPeriod(state,{range:'all'})` ist die zentrale bestehende Garmin-FIT/CSV/Coach-Datenquelle. Ohne bestätigte Coach-Sätze bzw. dokumentierte echte Garmin-Kraftaktivität bleibt der Zyklus ungestartet. Das Öffnen des Coaches ohne Training startet keinen Block.
- **Rückwirkende Historie:** Der letzte zusammenhängende Trainingsabschnitt nach mindestens 21 Tagen belegter Unterbrechung liefert einen **transparenten Startvorschlag**. Keine erfundenen Einheiten und keine automatische Zurücksetzung eines gespeicherten Blocks. Vorhandene Starttage aus dem alten lokalen Speicher werden nur bei realer Trainingshistorie und nur ohne synchronisierten Block migriert.
- **Sechs Wochen:** laufende Kalenderwoche, Blocknummer, Trainingstage, beobachtete bzw. fehlende Satzdetails; Pausentage werden bei aktiv gewählter Pause aus dem Planungsrahmen herausgerechnet. Nach sechs Wochen erscheint ein Review. Eine manuelle Verlängerung schiebt den Review auf; ein Deload wird nicht allein aufgrund des Datums ausgelöst.
- **Block-Review:** Trainingstage, tatsächliche Sessions, bekannte Sätze, Wdh., nachgewiesenes kg-Wdh.-Volumen, primäre Muskelgruppen, beobachtete Gewichts-/Wdh.-Steigerungen, erfasste RIR, ggf. Fitdays/BIA-Kontext und mögliche Plateaus. Unbekannte Messgrößen bleiben `null` bzw. explizit unbekannt.
- **A/B/C/D-Vorschläge:** Weiter steigern, Fokus prüfen, nur bei zusammenpassenden Ermüdungszeichen Entlastung erwägen, oder bei Pausen/ungenügenden Daten den Block verlängern. Vorhandene `coachPlateau47`-Logik wird für nachweislich vergleichbare Beobachtungen wiederverwendet. Keine automatische Änderung an Übungsauswahl, StrongLifts-A/B, Lasten oder Deload.
- **EINE Trainingsquelle:** StrongLifts-Gym-Sets bleiben in `strengthGuidedSessions` und damit auch im V-Taper-Zyklus. Der vorhandene Garmin/Coach-Merge vermeidet identische Paare doppelt zu zählen. Ein Trainingstag bleibt ein Tag, auch bei mehreren getrennten Sessions.
- **Geräteabgleich:** `strengthCycle` mit Starttag, Blöcken, Entscheidungen, Pausen, Verlängerungen und archivierter Evaluation wird ins vorhandene verschlüsselte `journalSyncPayload`, `journalFingerprint` und `mergeJournalData` eingehängt. Aktuelle Woche wird aus Starttag + Pause **auf jedem Gerät berechnet**, statt einen bald veralteten Zähler zu synchronisieren. Konflikte gleicher Block-IDs werden nach `updatedAt` aufgelöst. Kein neues Cloud-Backend.
- **Kompakte UI:** `V-Taper · Trainingsblock N`, `Woche N von 6`, Zähler und Review-Hinweis. Starttag anpassen, Pause, Entlastung, Verlängerung, Blockwechsel und Historie liegen im kleinen ausklappbaren Detailbereich.

## Tests und Grenzen

- Neue Tests: 15/15, davon 14 explizit für die geforderten Fallgruppen plus Integrationstest. Historische Zyklustests an die automatische Semantik angepasst: 9/9.
- Deployment-Tests inkl. Importgraph und Worker: 33/33 bestanden.
- Gesamtsuite: 1988/2023 bestanden, dieselben **35 historischen Fehler** wie 0.5.91.13, keine neuen Fehler.
- **Produktions-Vite-Build nicht lokal nachweisbar:** `npm install` scheitert an `EAI_AGAIN` der Registry `registry.npmjs.org` (`body-muscles`). `vite` ist in dieser Umgebung nicht installiert. Quellstand und ZIP werden geprüft, aber ein erfolgreicher kompiliert erzeugter Vite-`dist` wird **nicht** behauptet. Der Deploy-Workflow auf GitHub muss die Produktionskompilierung separat bestätigen.
- Live-Vaultdaten und realer Zwei-Geräte-Sync konnten nicht in der isolierten Testumgebung mit einem echten Konto überprüft werden. Getestet sind die reinen Merge-/Persistenzfunktionen.

## Installation

Patch ausschließlich über 0.5.91.13 extrahieren oder stattdessen das vollständige Quellpaket in das GitHub-Repository übernehmen. Originale `strengthGuidedSessions`/Garmin-Imports bleiben unangetastet. Keine privaten Vaultdaten in den ZIP-Dateien. Bei GitHub-Actions-Buildfehlern bitte Buildlog bereitstellen; kein Push in GitHub wurde ausgeführt.
