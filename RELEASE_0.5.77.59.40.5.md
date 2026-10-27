# Compass 0.5.77.59.40.5 – unterbrochene Workouts fortsetzen

**Basis:** `Compass_0.5.77.59.40.4_FULL_SOURCE_READY.zip` (inkl. Daily Dozen / Anti-Aging Eight Fix).

## Problem
Beim Neuladen der Compass-PWA ging der UI-Fortschritt des geführten Krafttrainings verloren. Der Coach schlug beim erneuten Öffnen einen neu sortierten Plan vor. Die bisherigen Satzbestätigungen lagen gegebenenfalls im verschlüsselten Tresor, wurden aber nicht als wiederaufnehmbares Workout angeboten.

## Korrektur
- **Training fortsetzen** direkt im Trainingscoach: letzte unvollständige geführte Session (höchstens sieben Tage alt) mit Zahl bestätigter Sätze und dem ursprünglichen Übungsnamen. **▶ Direkt starten** in der Krafttraining-Ansicht verwendet bei einer offenen Session ebenfalls diese, statt einen neuen Plan zu generieren.
- Beim Start wird ein **kompakter, unveränderter Plan-Schnappschuss** in `strengthGuidedSessions` im bestehenden verschlüsselten Vault gespeichert. Übungsreihenfolge, aktuelle Übungsposition, bestätigte Sätze, Wdh., Gewichte, RIR und laufende Satzpause werden beim Fortsetzen wiederhergestellt.
- Für bereits gespeicherte ältere unvollständige Sessions ohne `planSnapshot` wird der Plan ausschließlich aus den gespeicherten Übungszeilen rekonstruiert. Es wird keine neue Übungsreihenfolge berechnet. Unbekannte historische Gewichte bleiben unbekannt.
- Bei Satzbestätigung, Änderung von Gewicht/RIR, Navigation und Start erfolgt eine serialisierte Speicherung. Sichtbarer Zustand **Speichert … / ✓ Gesichert / ⚠ Nicht gesichert**; Antippen des Status versucht erneut zu speichern. Vorzeitiges Schließen beendet das Workout nicht und löscht keine Sätze.
- Beim tatsächlichen Trainingsabschluss wird die Session mit `completed=true` abgeschlossen, sodass sie nicht erneut als offen angezeigt wird.
- Die bestehende Geräte-Sperrvermeidung für aktive Workouts gilt auch für wiederaufgenommene Sessions.

## Schlaf, HRV und Fitdays
Der Vergleich nutzt Garmin-Nächte aus den **letzten 3 Kalendertagen (mindestens 2 gültige)** und **3–45 Tage davor (mindestens 10 gültige)**, nicht Daten erst ab dem ersten Krafttraining. Der Coach zeigt die aktuell verfügbaren Zähler und die erforderliche Referenz jetzt direkt. Fehlende Werte werden nicht interpoliert.

## Grenzen
- Nur bereits im verschlüsselten Vault **erfolgreich gespeicherte** Sätze sind nach einem Reload sicher rekonstruierbar. Ein Geräteabsturz unmittelbar vor Abschluss eines asynchronen Speichervorgangs kann die gerade vorgenommene Änderung verlieren; die Oberfläche zeigt den Speichervorgang ausdrücklich an.
- Die Wiederherstellung erfolgt im selben Geräte-Vault; sie ist keine neue Cloud-Sync-Funktion. Bestehende fehlerhafte/fehlende Daten lassen sich nicht erraten.
- Keine D1-, Worker-, Vault-Format- oder Berechtigungsmigration. Keine Geolocation-Änderung.
- Der Vite-Produktionsbuild und ein realer Android-PWA-Reloadtest stehen nach dem GitHub-Commit an; lokale automatische Node-Tests und komplette Quellcode-Transformationskette wurden geprüft.
