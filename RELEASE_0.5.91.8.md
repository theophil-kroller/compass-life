# Compass 0.5.91.8 · Ein Coach-Trainingsjournal + vorbereitetes Fitdays+ Smart Tape

**Basis:** GitHub `main`, Version **0.5.91.7**, Commit `76737d13e21723558019f11d28c723aa454c2303`, Stand 01.11.2026. Keine produktive Datenmigration.

## Krafttraining: vorhandene dokumentierte Daten überall verwenden

In **Insights → Körper** nutzt Body Transformation jetzt dieselbe bereits vorhandene, rein lesende Zusammenführung `strengthPeriod(state,{range:'all',today}).sessions` wie der Krafttraining-/Muscle-Map-Bereich. Zuvor wurde an dieser Stelle nur `strengthSummariesWithFit(state)` (Garmin FIT/CSV ohne bestätigte Coach-Sätze) übergeben.

- Bestätigte und Übungen zugeordnete Coach-Sätze aus `strengthGuidedSessions` werden in der Körpertransformations-Ansicht als dokumentierte Sätze gezählt. Gewicht/Wiederholungen bleiben erhalten und werden in der vorhandenen Muscle Map ausgewertet.
- Garmin-Sessions bleiben als Trainingsereignisse erhalten. Coach/FIT/CSV werden bereits in `strengthPeriod` sitzungsbezogen zusammengeführt; kein zweiter Trainingsspeicher.
- Rein geplante/unbestätigte Sätze zählen nicht; nicht vorhandene Satzdaten sind unbekannt statt 0.
- Überschneidungen werden nach der bestehenden Matching-Logik behandelt (zeitlicher Abstand und übereinstimmende Übung/Reps/Last). Nur belegte Paare werden zusammengefasst; ohne eindeutigen Abgleich bleibt die Datenqualität offen.
- Die Änderung betrifft nur den Body-Insights-Aufruf und die Beschriftung; die Originaldaten im Coach/Vault/Garmin werden nicht überschrieben.

## Smart Tape: nur Vorbereitung, kein Fitdays+-Import

Neues isoliertes Modul `client/src/body-measurements-v05918.js`, zukünftige CSS `client/src/body-measurements-v05918.css`. **Nicht im produktiven Hauptbundle referenziert.**

- Vorhandenen, bereits verschlüsselt synchronisierten Journal-Speicher `nutritionJournal.bodyMeasures88` wiederverwenden; bestehende ältere Coach-Zeilen (`shoulderCm`, `waistCm`) bleiben auslesbar.
- Kanonische zwölf Messregionen: Schulter, Brust, Taille, Hüfte, Hals, Oberarme links/rechts, Oberschenkel links/rechts, Waden links/rechts, Kopf. Regionen werden als Datenkatalog verwaltet und lassen sich ohne Speicherschemaänderung ergänzen.
- Pro Messung: ID, Region, cm-Wert, Originalwert/-einheit (cm oder in), genauer Zeitpunkt, Quelle, Importbatch, Messmethode/-protokoll, Zeitstempel, Qualitätsstatus, Löschmarker. Mehrere Messungen am selben Kalendertag sind möglich.
- Validierung der Einheiten, Zahlenwerte, Messzeitpunkte, plausibler regionsbezogener Grenzen; idempotente Duplikaterkennung selbst bei geändertem Import-Batch; Änderung und Löschmarker bleiben nachvollziehbar.
- Vorbereiteter, rein lesender Body-Measurement-Dashboard-Renderer mit Dot-Plots, cm-/%-Veränderungen, individuellen Trends (nur ab ausreichender Messhistorie) und am selben Tag gemessener Schulter-/Taillen-Ratio ohne idealtypische Normwerte. Modell-Zeiträume: 1/7/28/90/365 Tage und Gesamtzeit.
- Vorbereitung von Erkennungsheuristiken für Dateicontainer und konfigurierbaren, **erst nach Prüfung einer Originaldatei** verifizierten Feldzuordnungen. Keine Annahmen zu Fitdays+-Spalten oder verfügbarem Exportformat; kein Bluetooth-/Cloud-Zugriff.
- Ein späteres Coach-Evidence-Interface kann Messwertdaten, bestehende Fitdays-BIA-Daten und die bereits vorhandene Trainingszusammenfassung als gemeinsame Datenquellen lesen, aktiviert derzeit aber **keine** Trainingsanpassungen, Prognosen, Deloads oder Progressionsregeln.

### Bewusst deaktiviert (Feature-Flags = false)

1. Produktiver Fitdays+-Smart-Tape-Import (`importFitdaysSmartTape` wirft ausdrücklich einen Fehler).
2. Dashboard in der Benutzeroberfläche und automatische Hintergrundanalyse.
3. Smart-Tape- bzw. neue manuelle Körperregionen-Eingabemaske (bestehende Coach-Taille-/Schultereingabe bleibt unverändert).
4. Adaptive V-Taper-Trainingsvorschläge aus Umfangsmessungen und Umfangs-Forecasts.

Diese Funktionen werden erst nach einer echten Fitdays+-Datei, sicherem Spaltenmapping und ausreichender vergleichbarer Messhistorie freigeschaltet. Keine neuen erfundenen Rohdaten und keine automatische Übertragung sensibler Körperwerte.

## Qualitätssicherung

- Neue gezielte Tests: **8/8 bestanden**, ausschließlich synthetische Fixture-Messungen.
- `npm run check:deploy`: **33/33 bestanden** (Importgraph + Worker-Typprüfung + Deployment-Tests).
- `npm test`: **1.935/1.970 bestanden**, exakt **35 bereits historische Fehlertests** aus 0.5.91.7, keine neue Regression.
- `npm run build`: `vite: not found`; erforderliche npm-Abhängigkeiten in der isolierten Build-Umgebung nicht installiert. Ein erfolgreicher lokaler Vite-Produktionsbuild darf **nicht** behauptet werden. Das GitHub-Actions-Deployment ist nach Upload separat zu prüfen.
- Patch- und Full-Source-ZIP enthalten Quelltext, keinen vorgefertigten Produktionsbundle. Der Patch ist ausschließlich auf **0.5.91.7** anzuwenden.
