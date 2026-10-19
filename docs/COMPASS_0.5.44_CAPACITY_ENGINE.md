# Compass 0.5.44 — Capacity Engine (read-only)

## Leitprinzip
Die bestehende Oberfläche bleibt unverändert erkennbar. Auf **Heute → Was passt jetzt?** erscheint eine dezente Zeile mit erkannten Zeitfenstern oder einer ehrlichen Angabe, dass Kalenderkapazität unbekannt ist. Unter **Planen → Kalender & Forecast** ergänzt eine schmale 14-Tage-Zeitleiste die vorhandene Terminansicht. Vorschläge und Arbeitsfenster-Einstellungen sind eingeklappt.

## Was 0.5.44 wirklich berechnet
- Google-Calendar-Termine des **primären** Kalenders aus der vorhandenen, nur lesenden OAuth-Verbindung (Termintitel bleiben im Browser; keine Übertragung an Compass Worker).
- Wochenarbeitsfenster standardmäßig 09:00–17:00 Montag bis Freitag; 10 Min. Puffer vor/nach Terminen, mindestens 30 Min. pro sichtbarem Zeitfenster. Die Werte und die Einbeziehung von Wochenenden sind optional anpassbar.
- Überschneidende Kalendertermine werden zusammengeführt. Ganztägige **belegte** Termine sperren den ganzen Tag. Als frei markierte Termine werden nicht als Blocker behandelt; verborgene Kalendertermine und Routineblöcke bleiben zeitlich blockierend.
- Bereits vergangene Stunden erscheinen nicht als zukünftige Kapazität. Die Berechnung erfolgt im lokalen Browser-Zeitbereich und wird bei Ansicht neu berechnet.
- Bis zu drei freiwillige Vorschläge für ausführbare Next Actions werden anhand der schon vorhandenen GTD-Logik abgeleitet. Aufgaben ohne Schätzdauer werden als unsicher markiert. Vorschläge reservieren keine Zeitfenster und verändern keine Aufgaben.
- Bei fehlender Verbindung, unvollständigem Kalender-Paging, zu geringer Zeitabdeckung oder Kalenderdaten älter als zwei Stunden wird **keine** freie Kapazität als Fakt behauptet.

## Grenzen und nächste Ausbaustufen
Der Kalender-Zugriff gilt zunächst **nur für den primären Google-Kalender**. Andere, nicht eingebundene Kalender, Reisewege, Pausen, private Verpflichtungen sowie die Bedeutung einer Tätigkeit für die tatsächliche Energie können fehlen. Deshalb sind die Anzeigen **mögliche freie Slots innerhalb eines selbst gesetzten Arbeitsrahmens, keine garantierte Arbeitskapazität**. Es gibt noch keine Optimierung über mehrere Deadlines, keine Kapazitätsüberlast-Warnung und keine automatische Kalendererstellung. Das ist für 0.5.45 (Deadline Intelligence) und 0.5.46 (vorsichtiges Replanning) vorgesehen.

## Datenschutz und Änderungen
Keine neue D1-Migration, kein neuer Worker-Endpunkt, keine Übertragung von Kalendereinträgen an Compass. Nur die optionalen Arbeitsrahmen-Parameter werden in `state.uiPreferences.capacity` lokal verschlüsselt gespeichert. Die vorhandene Kalender-OAuth-Berechtigung bleibt `calendar.events.readonly`.

## Installation
Bei Installation auf vorhandener 0.5.43: PATCH-ZIP **mit Verzeichnisstruktur** in den Projektstamm kopieren, geänderte Dateien ersetzen, reguläres CI/Deploy starten. Bei kompletter Neuinstallation: FULL SOURCE-ZIP. Vor Deployment `npm ci`, dann `npm run check` und `npm run build`. Diese Umgebung enthält keine installierte Vite-Version; der vollständige Produktions-Build und der Browser-Live-Test konnten daher nicht abgeschlossen werden.
