# Compass 0.5.77.42 – Geräte-Sync für Krafttraining & CI-Reparatur

**Basis:** auf GitHub bereits hochgeladener Stand 0.5.77.41, auch wenn GitHub Actions #202 abgebrochen ist.

## 1. Krafttraining: lokale Zuordnungen auf allen Geräten

Ursache: Übungen, Wiederholungen und Gewichte liegen in `state.strengthJournal.annotations`, aber dieser Datenbereich war bisher weder im verschlüsselten `journalSyncPayload` noch im `mergeJournalData` enthalten. Auch die Änderungserkennung `journalFingerprint` berücksichtigte ihn nicht.

Jetzt:
- Aufnahme des `strengthJournal` in den **bestehenden Ende-zu-Ende-verschlüsselten Geräteabgleich**.
- Merge pro Garmin-Session-ID oder Startzeit; keine destruktive Übernahme einer leeren Geräte-Kopie.
- Bei derselben Aktivität gewinnt die neuere Zuordnung, **aber leere Felder einer Geräte-Kopie löschen keine bereits vorhandenen Übungsnamen, Gewichte oder Wiederholungen**.
- Neue Funktion `mergeStrengthJournal` ist unabhängig von Garmin-Originaldaten und ändert keine FIT/CSV-Importe.
- Krafttraining bietet jetzt eine Aktion **„↻ Übungen zwischen Geräten abgleichen“**.
- Lokale Änderungen lösen wie bei Ernährung/Habits den verschlüsselten Journal-Abgleich aus, sobald eine Geräteverbindung besteht.

## 2. GitHub Actions #202

Der fehlgeschlagene Test `tests/compass-057738.test.mjs` erwartete fälschlich die **direkte Nachbarschaft** von Plugins aus 0.5.77.38, obwohl inzwischen 0.5.77.41 dazwischenliegt. Der Test prüft nun die sinnvolle **Reihenfolge** und bleibt bei späteren Zwischen-Plugins gültig.

Die gleiche robuste Reihenfolgeprüfung ist in `tests/compass-057741.test.mjs` berücksichtigt.

## Lokale Prüfung

- 23/23 aktuelle, gezielte Sync- und .41-Modultests bestanden.
- Der zuvor fehlschlagende `.38`-Regressionstest separat bestanden.
- Generierter Code des Kraftsatzeditors: Syntaxcheck bestanden.
- Für den kompletten GitHub-Workflow / Vite-Produktionsbuild fehlt hier der vollständige GitHub-Quellbaum; Erfolg darf **erst nach GitHub Actions** behauptet werden.

## Dateien

- `client/strength-sync742-bridge.js` — neu
- `client/src/strength-device-sync-v57742.js` — neu
- `client/vite.config.js` — ersetzen
- `tests/compass-057738.test.mjs` — ersetzen
- `tests/compass-057741.test.mjs` — ersetzen
- `tests/compass-057742-strength-sync.test.mjs` — neu

**Keine Datenmigration und keine Änderung an Garmin-Originaldaten erforderlich.**
