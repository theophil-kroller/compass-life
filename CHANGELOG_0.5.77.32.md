# Compass 0.5.77.32 — Nutrition Mobile & Strength Editor

Basis: bereits installierter Stand **0.5.77.31**. Keine Neuinstallation früherer Nutrition- oder Garmin-Patches.

## Ernährung / Mobil
- Schnelle Lebensmittelkacheln sind ganz oben im Ernährungs-Popup; Energieinformation und individuelle Mahlzeitenbeschreibung folgen darunter.
- Während die Ernährungseingabe offen ist, wird der Dialog bei allgemeinen Hintergrund-Render-Aufrufen nicht neu erzeugt. Dadurch bleiben Scrollposition, Fokus und laufende Eingaben beim Synchronisieren erhalten und umfangreiche unnötige Neudarstellungen entfallen.
- Scrollbarer Dialog mit `overscroll-behavior: contain` und Touch-Optimierung.

## Greger als primäre Orientierung
- Im Bereich **Ernährung → Fettqualität** ersetzen Dr. Michael Gregers Daily Dozen und seine Optimum Nutrient Recommendations die vorherige DGE/ÖGE-Orientierungskarte.
- Explizite Unterscheidung: täglicher Leinsamen und Nüsse/Samen laut Daily Dozen, sowie die als „consider“ formulierte Empfehlung über 250 mg EPA/DHA aus Hefe/Algen.
- Direkte Links zu NutritionFacts.org. Keine erfundenen Zahlen oder künstliche Ernährungspflichten.

## Krafttraining / Übungen ergänzen
- Eigenständiger Katalog von **33** Übungen (keine 1:1-Kopie der Garmin-Datenbank), mit Haupt- und unterstützend beanspruchten Muskeln.
- Jede erkannte Krafttrainingseinheit aus Activities.csv kann direkt in Compass geöffnet und bearbeitet werden. Ein zusätzliches Einzel-FIT ist **nicht erforderlich**.
- Pro Satz: Übung, Wiederholungen und verwendetes Zusatzgewicht in kg; zusätzliche Sätze per Plus-Schaltfläche.
- Unbekannte Daten bleiben leer, statt als 0 angezeigt zu werden. Optional explizite 0 kg für Körpergewichtsübungen.
- Nach dem Speichern aktualisieren sich die bestehende Muskelkarte, der Trainingsrhythmus und die dokumentierte Trainingsbelastung.
- Daten werden als separate lokale Annotation im verschlüsselten Vault gespeichert. Garmin-Quelldaten bleiben unverändert. Spätere CSV-/FIT-Imports werden anhand der Startzeit zugeordnet und führen nicht zu Doppelzählung.
- Eine Liste der noch offenen Übungszuordnungen erscheint im Krafttrainingsmodul. Diese ist die Nachbearbeitungsaufforderung nach neu importierten Trainings.

## Qualitätsstatus
- 8 neue automatisierte Tests bestanden, darunter Reimport, Gewichts-Korrektur, fehlende Daten, Eingabevalidierung, Escape von HTML sowie Integrationsanker.
- Zusätzlicher Integrationstest: Zusammengeführte drei CSV-Sätze ergeben 2 Brust- und 1 Rückensatz und das richtige Gewichtsvolumen; Muskelkarte zeigt die Daten.
- `node --check` bestanden. Ein kompletter Vite-Produktionsbuild und ein End-to-End-Test am echten Mobilgerät wurden hier nicht ausgeführt.

## Bekannte Grenze
- Die manuellen Übungsannotation werden lokal im verschlüsselten Compass-Vault gespeichert. Geräteübergreifende Journal-Synchronisation dieser **neuen** Datenstruktur ist noch nicht abgesichert; daher möglichst auf dem Hauptgerät bearbeiten und vor Plattformwechsel ein Vault-Backup anfertigen.
