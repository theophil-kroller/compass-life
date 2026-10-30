# Compass Life 0.5.77.59.40.25.23 — Motivation, Lockscreen Capture, Frühstück, Life Balance Radar

## Neuerungen

- **7 Inspiration Levels:** Auf das Abschließen einer regulären Task folgt eine **freiwillige** Skala von 1 ("I have to") bis 7 ("I love it"). „Ohne Bewertung abschließen“ lässt die Task unverändert erledigt. Die Reflexionswerte werden als separate `taskInspiration`-Journalereignisse mit taskId, Kategorie und Zeitpunkt verschlüsselt gespeichert. Auswertungen erscheinen unter Insights → Produktivität und unterscheiden niedrige (1–2) und hohe (6–7) Bewertungen. Planungsvorschläge für offene Tasks erst ab drei Bewertungen und niedrigem Durchschnitt je Kategorie; keinerlei automatische Neupriorisierung, keine Diagnosen.
- **Compass-Lockscreen-Capture:** Auf dem Ars-Vivendi-Tresorbildschirm erscheint **✎ Gedanke**. Nach einmaligem Einrichten des vorhandenen Sealed Capture werden Notizen auch ohne erneutes Entsperren asymmetrisch verschlüsselt im lokalen Eingangspuffer gesichert und nach erfolgreichem Entsperren in die Inbox überführt. Kein Klartext in LocalStorage/SessionStorage. Achtung: Dies ist der **App-interne Lockscreen**, kein Hardware-Android-Sperrbildschirm; zum Start einer PWA auf einem wirklich gesperrten Telefon kann das Betriebssystem eine Entsperrung verlangen.
- **Frühstück wiederhergestellt:** `smoothie-personal` (Mein Blaubeeren-Smoothie) und `fried-egg-personal` (Mein Spiegelei mit Olivenöl, Kala Namak, Kurkuma, Chili) sind wieder erstklassige Schnell-Erfassungskacheln. Stabile IDs sichern die Rückwärtskompatibilität. Bei neuen Einträgen wird ein editierbarer Zutatensnapshot angelegt; alte Logs und deren Grammangaben werden nicht umgeschrieben. Rezeptbasierte Energie- und Nährstoffschätzung in Tagebuch, Energieziel, Essenszeit-Grafiken und Ernährungs-Insights sowie die Zutaten-Editoren sind wieder verbunden.
- **Life Balance Radar:** Explizite 0–24/25–49/50–74/75–89/90–100-Zielnähe-Klassen, numerische Gittermarkierungen, klärende Legende und farbige Statuspunkte. Die beiden Vorperioden sind nun auch bei erweiterter "Gesamtbalance" mit ersetzter Bewegungsachse und in den anderen Perspektiven sichtbar. Für die historische Ansicht nur tatsächlich datierte Beobachtungen; keine rückwirkende Rekonstruktion des heutigen GTD-/Kontakt-/Finanzzustands.

## Datenschutz und Verträglichkeit

Keine D1-Migration. Bestehende Task-IDs, Projekte, Ernährungslogs, Verschlüsselung, Garmin, Arbeitszeit, Finanzen und lokale Vault-Daten unverändert. Neues `taskInspiration`-Feld wird in den vorhandenen optionalen E2EE-Journalabgleich integriert (per-ID Merge mit Änderungszeitpunkt). Eine reguläre Task-Vervollständigung bleibt vor dem Reflexionsdialog bereits lokal gesichert.

## Tests und Status

- Neue gezielte Tests: **6/6 bestanden**.
- Historischer gesamter Node-Testlauf: **1717/1729 erfolgreich**. 12 Fehlschläge bestehen überwiegend aus veralteten Legacy-Transformations-Tests, die inzwischen nicht mehr im eingefrorenen FULL-Snapshot enthaltene Bridge-Dateien erwarten, aus Tests mit hartkodierter Vorversion sowie einem alten .37-Transform-Anker. Nicht als vollständig regressionsfrei gewertet.
- `node --check` auf den angepassten ES-Modulen bestanden; kein laufender Browser-/Mobiltest.
- **Vite-Produktionsbuild nicht verifiziert**: Ursprüngliches Archiv enthält keine `node_modules` und kein `package-lock.json`; offline fehlen npm-Registry-Artefakte (`body-muscles`). Bitte nach dem Upload GitHub Actions „Deploy Compass Web“ prüfen.

## Testplan nach Deployment

1. Insights → Life Balance → Gesamtbalance/7 T/„3“: Aktuell plus zwei historische Zeitspuren; mit Bewegungsminuten ebenfalls sichtbare alte Konturen. Durch Gesundheits- und Lebensqualitätsperspektiven schalten. Skala und fehlende Werte kontrollieren.
2. In Heute eine Task abhaken: optional Levels 1 bis 7 oder Überspringen; Insights → Produktivität zeigt die neue Bewertung. Task erneut öffnen und erneut abschließen; keine automatische Änderung von Priorität oder Fälligkeit.
3. Compass-Tresor sperren und auf „✎ Gedanke“ tippen: Gedanken erfassen; danach entsperren und Inbox überprüfen. Bei noch nicht eingerichteter Sealed Capture erfolgt ausdrücklich kein unverschlüsseltes Speichern.
4. Ernährungskachel öffnen: Unter Frühstück „Mein Blaubeeren-Smoothie“ und „Mein Spiegelei“ erfassen; in Ernährungstagebuch Mengen, Kalorien-Referenz und Zutaten bearbeiten. Bisherige Einträge bleiben erhalten.
5. Nach Update keine Browser-/PWA-Daten, IndexedDB oder Tresor-Inhalte löschen. Bei mehreren Geräten Journal-E2EE-Sync prüfen.
