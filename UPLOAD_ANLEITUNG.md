# Compass 0.5.77.59.8 – Freizeitplanung & Life-Balance-Start

**Basis:** GitHub `theophil-kroller/compass-life`, commit `d49aa2bcc97987044c91a22041b718eb7e057728` (25.10.2026).

## Dateien hochladen (Pfade ab Repository-Hauptverzeichnis)

1. `client/src/insights-navigation-v57750.js` – vorhandene Datei ersetzen.
2. `client/compass7593-ux-bridge.js` – vorhandene Datei ersetzen.
3. `tests/compass-0577593-ux.test.mjs` – vorhandene Datei ersetzen.
4. `tests/compass-0577598-navigation.test.mjs` – neue Datei hinzufügen.

**Nicht ersetzen:** `client/vite.config.js`, `client/src/main.js` oder Vault-/Datenbankdateien. Vite-Bridge-Reihenfolge und gespeicherte Daten bleiben unverändert.

## Funktion

- **Planen → Freizeit & Erholung:** Die bestehende Freizeitideen-/Veranstaltungsseite ist aus der Insights-Navigation entfernt und im Planen-Untermenü erreichbar. Alte Einträge und Buttons werden nicht geändert.
- **Insights → Übersicht & Intelligence:** Standardmäßig **Life Balance** mit vorhandenem Radar und Drill-downs. Der redundante Cockpit-Untertab wird nicht mehr angeboten. Wochenkompass, Kapazität, Zusammenhänge und Explore bleiben sichtbar.
- **Insights-Kategorie direkt anklicken:** Öffnet jetzt ebenfalls Life Balance, statt das alte Cockpit zu aktivieren.
- **Focus/Extended:** Compass startet nach Entsperren weiterhin in Focus. Wer ausdrücklich die umfassendere Freizeitplanungsseite öffnet, wechselt für die Sitzung automatisch in Extended; beim nächsten regulären Entsperren beginnt Compass wieder in Focus.
- Historische interne Recovery-Kennungen bleiben zur Rückwärtskompatibilität akzeptiert.

## Verifikation

- 10 lokale Node-Tests bestanden, inklusive Syntax-Checks der neuen Navigations- und Bridge-Dateien.
- Ein vollständiger `npm run check` und `npm run build` des Repositorys ist hier nicht gelaufen, weil nicht alle Repository-Dateien im lokalen Container vorliegen. Bitte nach Upload den Actions-Job `Deploy Compass Web` abwarten und bei einer Fehlermeldung die Logs prüfen.
- Sichtbare Versionsanzeige ist weiterhin `0.5.77.58.2`, weil deren historische Transformation nicht verändert wird.
