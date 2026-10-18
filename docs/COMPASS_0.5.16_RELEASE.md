# Compass 0.5.16 · Maps, Sports & Review Import Desk

Basis: main 0.5.15. Keine Worker-Migration; Finanz-/Standortdaten bleiben im lokalen Vault.

## Änderungen
- Offline-Karte mit Natural-Earth-Ländergrenzen statt schematischer Kontinent-Polygone; Presets Welt, Europa, Österreich, China und Australien, Zoom +/-.
- Länder und ausgewählte Stadtregionen werden ohne API anhand der Koordinaten mit **ungefähren** Namen versehen. Eigene Ortsnamen haben Vorrang. Es werden ausdrücklich keine genauen Adressen behauptet.
- Aktivitäten in Stunden und Einheiten gruppiert; Kilometer ausschließlich aus explizit vorhandenen Garmin-Session-Distanzen oder manuellen Distanzfeldern. Eigene Aktivitätstitel werden regelbasiert kategorisiert, überprüfbar im Activity-Inspector.
- Im bestehenden Abschluss-Schritt des Weekly Review: Garmin/Fitdays, Google Timeline und Bank-CSV mit Dateiauswahl, Vorschau, Importbestätigung und kompaktem Exportweg. Verknüpfungen zu weiteren Quellen. Der gespeicherte Review-Fortschritt bleibt kompatibel.

## Einschränkungen
- Keine GPS-Routen, keine automatische Adressauflösung, keine externen Kartenkacheln. Die Offline-Geodaten sind grob (Natural Earth 110m). Länder- und Stadtregionen sind nur Schätzungen.
- Keine Einheit darf doppelt gezählt werden: FIT-Training hat bei sehr nahen persönlichen Einträgen Vorrang, ansonsten nicht automatisch zusammenführen.
- Garmin-Tagesmonitoring (Schritte) ist kein separates Training; fehlende Distanzen bleiben leer.
- Noch keine Importintegration für Kraken/flatex oder weitere Banken (separate spätere Builds).
- Portfoliografiken und Finance Visual Dashboard geplant für 0.5.17+.

## Prüfen
1. Vor Deployment AES-GCM Vault-Backup.
2. Unter Orte die fünf Regionspresets testen, Zoom +/−, manuelle Namensvergabe.
3. Unter Insights → Aktivität Garmin-FIT-Sessions und eigene Aktivitäten nach Sportarten prüfen; optional Kilometer im Inspector pflegen.
4. Wochenreview → Abschluss → Datenquellen: Pro Datei eine Vorschau öffnen, bestätigen oder verwerfen; keine Cloud-Übertragung.
5. Lokal `npm install && npm test && npm run build`.
