# Compass 0.5.77.59.19 – Intelligent Workout Planner

## Worum geht es?

Der bereits vorhandene **✦ Trainingscoach** wird zum konkreten **nächsten Workout**:

- Ziel: V-Taper, Bauch/Abs, Kraft oder ausgeglichene Muskelbalance
- Training: Zuhause (Kurzhanteln, Verbindungsstange/Ab Wheel) oder Gym (Kabelzug/Langhantel)
- Zeitbudget: 25, 45, 65 Minuten
- Vorschläge: Übung, Satzanzahl, Wiederholungen, Satzpause und grobe Gesamtzeit
- StrongLifts **5×5 A/B** im Gym, sofern letzte eindeutig zugeordnete Einheit eine Unterscheidung zulässt. B: Kreuzheben 1×5.
- Vorsichtshinweis bei sehr jungem, tatsächlich zugeordnetem Trainingsdatum
- Dokumentierte Beteiligungen über 7 Tage inkl. Nebenbeteiligung, mit Transparenz zu nicht zugeordneten Garmin-Sätzen
- Benutzerpräferenzen (Ziel, Equipment, Zeit) bleiben auf demselben Browser/Gerät erhalten
- Der Plan kann als Text kopiert werden. Es werden keine Aufgaben, Gewichte oder Termine ohne Einwilligung erstellt.

## GitHub-Upload

In deinem Repository **theophil-kroller/compass-life** genau diese Dateien hochladen / ersetzen:

1. `client/src/strength-coach-v5775910.js` **ersetzen**
2. `client/src/strength-coach-v5775910.css` **ersetzen**
3. `tests/compass-05775919-workout-planner.test.mjs` **neu hinzufügen**

Bitte die Struktur im ZIP beibehalten. **Keine** Änderungen an `vite.config.js`, `main.js`, Worker, Vault oder Makko-Ho.

## Deployment und Qualität

- Lokale Node-Syntaxprüfung erfolgreich.
- 45 Tests der lokalen Projekt-/Test-Fixture bestanden: alte Makko-/Strength-Tests plus neuer Workout-Planner-Test.
- Chromium-Sichtprüfung bei 360 px, 390 px und 1440 px, ohne horizontalen Überlauf. Die Auswahlwerte überleben erneutes Öffnen auf demselben Gerät.
- Der vollständige GitHub-Actions-Check ist erst nach deinem Upload verfügbar. Das lokale Test-Fixture enthält nicht alle ~1.300 Tests des Repositorys.

## Wichtige Grenzen

- Der Coach ist **regelbasiert**, keine medizinische Regenerationsmessung und keine generative KI.
- Unbekannte Garmin-Übungen werden nicht als untrainierte Muskelgruppen gewertet.
- Ohne ausreichende Übungszuordnung entstehen ziel-/equipmentbasierte Vorschläge, aber keine verlässliche Muskelbalance-Auswertung.
- RPE, Verletzungen, Bewegungsqualität, Schlaf-/HRV-Erholung und persönliches Gewicht werden noch nicht als harte Entscheidungskriterien verwendet.
- Die Trainingsvorschläge ändern noch keine Garmin- oder Compass-Aufgaben/Trainingstage.

