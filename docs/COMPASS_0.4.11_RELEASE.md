# Compass 0.4.11 – Abschlussbuild Web (GitHub-Patch)

Ausgangsbasis: **Compass 0.4.10.1** nach erfolgreichem GitHub Pages Deployment (einschließlich der Testkorrektur 0.4.10.2). Enthält **ausschließlich Client-Änderungen und Tests**. Garmin-Quellcode und Cloudflare Worker bleiben unverändert. Keine D1-Migration erforderlich.

## Enthalten

1. **Wochenreview**: Redundante große Erklärungsspalte „Dein Weekly Review“ entfernt; kompakte anklickbare Review-Navigation zu Inbox, Projekten, Next Actions, Waiting, Terminen und Dreams. Der Klärungseditor nutzt den verfügbaren Platz.
2. **Übersicht / Timeline**: Echter horizontaler Zeitstrahl für sieben aufeinanderfolgende Tage; Pfeile wechseln Woche 1, 2, 3 usw. 14-, 30- und 90-Tage-Horizont bleiben. Klick auf einen Tag zeigt nur dessen Termine, Planned, Due und Meilensteine in einem den Platz nutzenden Kartenraster. Klick auf Eintrag öffnet die bisherige Detailansicht. Bei leeren Tagen bleibt eine dezente Information, kein weißer ungenutzter Bereich.
3. **Menschen / Geburtstage**: Bei bestehenden Personen Tag + Monat und optional Geburtsjahr bearbeiten oder entfernen. Persönliche Geburtstage erscheinen auch ohne Google Calendar in der Anlassvorbereitung und werden automatisch jährlich erneut angeboten. Ein passender Kalendereintrag wird nach sicherem Namens-/Datums-Match zusammengeführt. Für Geburtstage am 29. Februar gilt in Nichtschaltjahren der 28. Februar als Erinnerungsdatum. Geschenk, Kuchen, Kerzen und Grüße werden *nur* auf Klick zu Aufgaben.
4. **Kontext-Perspektiven**: Bestehende synchronisierte Tags mit Bindestrich können ohne Schemaänderung als Kontextgruppe angezeigt werden: `arbeit-uni`, `arbeit-buero` -> `arbeit · alle`. Nur wenn mindestens zwei Unterkontexte existieren. Originale Tags bleiben erhalten; `energy-*` und `attention-*` werden nicht zu Gruppen umklassifiziert. Keine automatische Standorterfassung.
5. **Version**: Anzeige 0.4.11 unter dem Compass-Logo.

## Datenschutz und Grenzen

- Kontakt-Stammdaten einschließlich Geburtstag liegen nach wie vor **nur verschlüsselt im lokalen Browser-Tresor**. Sie werden **nicht zwischen Geräten synchronisiert**. Wenn du dieselbe Person mit Geburtstag auch auf einem anderen Gerät sehen willst, benötigst du dort den lokalen Eintrag (künftige separate, explizit gesicherte Synchronisierung). Google Calendar wird nur lesend verwendet und Ereignisse werden nicht in die D1-Datenbank kopiert.
- Anlässe werden nur angezeigt, während Compass geöffnet ist; keine Push-Benachrichtigung bei geschlossener App. Akzeptierte Vorschläge sind reguläre synchronisierte Compass-Aufgaben.
- Automatische Standorterkennung, Garmin-Touch-Bedienung, Verwerfen laufender Garmin-Sessions und das Garmin-App-Beenden sind **nicht Bestandteil dieses Web-Patches**. Garmin bleibt bis zum nächsten getrennten Uhr-Update unverändert.
- Gesundheitsdaten, Schlaf und Garmin-Connect-Gesamtdaten sind hier nicht hinzugefügt.

## Installation

1. Vor dem Upload im bisherigen Compass unter **System & Sync** ein verschlüsseltes Tresor-Backup sichern. Lokale Browserdaten und IndexedDB **nicht löschen**.
2. ZIP entpacken und seinen Inhalt **pfadgleich** in das GitHub-Repository `theophil-kroller/compass-life` auf den Branch `main` hochladen. Dateien mit gleichem Pfad ersetzen. **Die Ordnerstruktur muss erhalten bleiben**, insbesondere `client/src/people-occasions.js` und `client/src/context-perspectives.js`.
3. GitHub Actions → **Deploy Compass Web** auf **grün** prüfen. Der Workflow führt `npm install`, `npm run check` und `npm run build` aus; ein roter Lauf aktualisiert GitHub Pages nicht.
4. Compass neu öffnen; unter dem Logo muss **0.4.11** stehen. Bei PWA-Caching ggf. Service Worker unter Chrome → DevTools → Application → Service Workers aktualisieren, **ohne Website-Daten zu löschen**.
5. Kontakte testweise mit Geburtstag ergänzen; Übersicht / Zeitstrahl über „Nächste“ wechseln; Wochenreview öffnen.

### Nicht notwendig

- **Keine D1 SQL-Ausführung**.
- **Kein Wrangler-/Worker-Deployment**.
- **Keine neue Garmin-`.prg` installieren**.

## Prüfung vor Veröffentlichung

`npm run check`: **70 von 70 Tests erfolgreich**. Darunter Regressionstests für bestehende Sync-, Watch- und Projektdaten, neue Datumskonvertierung, Jahreswechsel, Leap-Year-Birthday, doppelten Kalender-/Kontakt-Geburtstag und horizontale Timeline-Navigation.

`node --check` für das geänderte `main.js` und neue Module: erfolgreich.

**Nicht abgeschlossen**: Lokaler `vite build` – Vite nicht installiert; `npm install` in dieser Laufzeit scheitert an `EAI_AGAIN` (npm-Registry nicht erreichbar). Ein produktiver Chromium-GUI-Test und ein GitHub-Pages-Deployment sind hier nicht erfolgt. **Bitte den GitHub-Actions-Lauf als Build-Gate abwarten.**
