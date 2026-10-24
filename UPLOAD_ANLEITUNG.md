# Compass Life 0.5.77.49 – Patch hochladen

**Ziel:** `theophil-kroller/compass-life`, Branch `main`.
**Voraussetzung:** Die Quellcode-Dateien von 0.5.77.48 sind auf `main` (Commit `184e8b0`). Der GitHub-Deploy #209 ist zwar fehlgeschlagen, aber die Dateien liegen bereits im Repository. Bitte **nicht** auf dem vorherigen erfolgreichen Deploy #208 ansetzen.

Das ZIP enthält **fertige Projektdateien in den korrekten Ordnern**. Kein Apply-Skript und kein manuelles Patchen von Textzeilen.

## Ersetzen

1. `client/vite.config.js`
2. `tests/compass-057747-capacity.test.mjs`
3. `tests/compass-057748-calendar-packets.test.mjs`

## Neu hinzufügen

1. `client/compass749-bridge.js`
2. `client/src/body-transformation-v57749.js`
3. `client/src/body-transformation-v57749.css`
4. `client/src/capacity-preserve-v57749.js`
5. `tests/compass-057749-body-transformation.test.mjs`

Optionale Dokumentationsdateien: `CHANGELOG_0.5.77.49.md`, `UPLOAD_ANLEITUNG.md`.

**Anleitung:** ZIP entpacken, den Inhalt mit identischer Ordnerstruktur ins GitHub-Repository hochladen; die drei bestehenden Dateien ersetzen. Beim Commit startet „Deploy Compass Web“. `npm run check` und anschließend `npm run build` müssen erfolgreich sein. Erst danach erscheint die Version 0.5.77.49.

## Funktionstest danach

- **Insights → Gesundheit → Körper**: Oben die neue Dashboard-Sektion sehen; Bereich 7/28/90/365 Tage oder „Alles“ wählen, Messpunkte und Quellenstand prüfen.
- Garmin-Krafttraining und Ernährungsdaten müssen nur dann angezeigt werden, wenn sie bereits im Tresor importiert/protokolliert sind; keine leeren Tage als Nullen auffüllen.
- **Insights → Fristen & Kapazität**: Arbeitspaket bei Aufgabe eingeben, speichern; Fokusstundenbudget ändern und speichern; danach kontrollieren, ob Arbeitspaket erhalten bleibt.
- Mit aktuellem, vollständig verfügbarem Kalender soll kein vorgeschlagener Arbeitsblock einen bereits belegten Zeitraum mit eingestelltem Puffer überschneiden.

**Grenzen:** Nur Quellpatch, kein separater vollständiger Build. Aus diesem Chat heraus wurde kein neuer Commit auf GitHub gepusht; der Patch ist zum eigenen Upload gedacht.
