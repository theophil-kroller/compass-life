# Compass 0.5.77.28 — Strength Training & Muscle Map

**Ausgangsbasis:** GitHub-Stand mit bereits installiertem Nutrition 3 (0.5.77.27).
**Installationsform:** Nur die neuen/geänderten Dateien aus diesem ZIP hochladen, Pfade beibehalten. Keine Nutrition-3-Dateien neu installieren.

## Neu

- Neuer eigener Insights-Bereich **Krafttraining**, auch über die seitliche Navigation erreichbar.
- Local-first-Dekodierung von Garmin-Activity-FIT: Nachrichten `set` (225), `exercise_title` (264), `workout_step` (27), sowie vorhandene `session` (18) als Sitzungsgrenze. Nur aktive, tatsächlich dokumentierte Sätze; Pausen zählen nicht als Training.
- Wenn im FIT vorhanden: Übungskategorie/Name, Wiederholungen, externe Gewichtsangabe, Satzdauer und Zeitstempel.
- Vorder-/Rückseite der Muskelkarte mit 11 Muskelgruppen. **Heuristische** Zuordnung anhand der Kategorie; Hauptziel vs. unterstützende Muskulatur unterscheidbar. Unbekannte Übungen bleiben explizit unbestimmt.
- Filter: 7, 28, 90, 365 Tage oder Gesamthistorie; Trainingstage, Sätze, dokumentiertes Gewichtsvolumen, zuletzt dokumentierte Muskelgruppen.
- Punktdiagramm mit einzelnen Trainingstagen und ihrer dokumentierten Satzzahl, ohne künstliche Nullen oder gleitende Glättung.
- Vorsichtige Balancehinweise für Drücken/Ziehen, Beinvorder-/rückseite, Bizeps/Trizeps, mit passenden Übungsideen. Kein normativer Trainingsplan, keine medizinische Empfehlung.
- Trainingsjournal mit Übungsnamen, Satzanzahl, Wiederholungen und Einzelgewichten.

## Wiederholte Garmin-Imports / noch offener Kalendertag

- Historische und wiederholte FIT-Exporte werden durch stabile Sitzungsidentität zusammengeführt.
- Enthält ein späterer Export **mehr Sätze**, ersetzt er die frühere Teilfassung. Bei gleicher Satzzahl und gleicher/mehr Detailqualität werden neuere Werte (z. B. korrigiertes Gewicht) übernommen.
- Enthält eine erneute Datei weniger Sätze als die bereits eingelesene Version, bleibt zur Vermeidung von Datenverlust die vollständigere ältere Fassung erhalten. Das ist bewusst konservativ.
- Tagsüber importierte Daten werden als **vorläufige Tagesansicht** angezeigt. Nach dem nächsten Import werden zusätzliche Sätze erfasst; ein Tageswechsel erzeugt keine künstliche „Abschluss“-Transaktion.
- Die bisherigen Garmin-Tageszähler (z. B. Schritte) bleiben bei Wiederimporten nach dem bestehenden Maximalwert-Verfahren erhalten.

## Wichtige Grenzen

- Der Garmin-Activities-**CSV**-Export enthält in der Regel **keine Einzelsätze oder Übungszuordnungen**. Für die Muskelkarte werden originale FIT-Dateien aus den Einzelaktivitäten benötigt (Garmin Connect → Aktivität öffnen → „Original exportieren“ / Aktivitätsdatei `.fit`).
- Garmin Connect kann Übungsnamen auf dem Server nachträglich erkennen oder ändern. Diese Änderungen erscheinen nicht zwingend im originalen FIT-Export; Compass zeigt nur die tatsächlich importierten FIT-Informationen.
- Die Farbdarstellung bildet dokumentierte Übungssätze nach einer transparenten Zuordnungsheuristik ab. Sie misst weder Muskelaktivierung noch Muskelwachstum oder Regenerationszustand.
- Korrekturen, bei denen eine vollständige Sitzung **weniger** Sätze hat als zuvor, können ohne zusätzlichen Abschlussstatus nicht zuverlässig von unvollständigen Zwischenständen unterschieden werden. Diese Ausnahme bleibt ein möglicher Ausbaupunkt.

## Sicherheit / Kompatibilität

- Keine Cloud-API-Erweiterung, keine Migration bestehender Tresordaten. Neues optionales Feld `state.healthImports.garminStrength` mit lokal importierten FIT-Aggregaten.
- Keine Positionsdaten, Roh-GPS-Tracks oder Gerätekennungen aus den FIT-Dateien übernehmen.
- HTML-Ausgaben werden maskiert. Fehlende Zahlen sind `null`, niemals unkontrolliert eine künstliche 0.
- Der neue Build bleibt bewusst additiv: die bestehende Version 0.5.77.26 von `main.js` wird weiterhin über Nutrition3-Bridge auf .27 und danach über Strength-Bridge auf .28 eingebunden.

## Verifikation

- Node 22: `node --test tests/gtd-057728-strength-training.test.mjs` — **8/8 bestanden**.
- JavaScript Syntaxprüfungen für die drei neuen `.js`-Dateien — bestanden.
- Vite-Integrationsanker gegen den tatsächlichen GitHub-Stand geprüft — alle erforderlichen Anker vorhanden.
- Ein vollständiger Produktionsbuild (`npm run build`) und Test mit einem realen Garmin-Krafttrainings-FIT wurden in dieser Umgebung nicht ausgeführt. Eine persönliche FIT-Datei ist für die endgültige Feld- und Zuordnungsvalidierung hilfreich.
