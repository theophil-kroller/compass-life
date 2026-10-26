# Compass Life 0.5.77.59.40.2 — 📍 Kontextschalter an der Tagesnavigation

**Basis:** Exaktes Full-Source-Paket `Compass_0.5.77.59.40.1_FULL_SOURCE_READY.zip`. Es wird weder ein älterer GitHub-Quellstand noch eine neue App erstellt.

## Bedienung

- Der Standortschalter **📍** steht unmittelbar **neben den Tagespfeilen und „Heute“** (Focus und Extended, Desktop und Smartphone).
- Am Desktop: **Maus über 📍** bewegen, Menü erscheint. Alternativ anklicken oder per Tab/Enter/Leertaste öffnen.
- Am Smartphone/PWA: **📍 antippen**. Erneutes Antippen schließt das Menü.
- Direkt wählen: **Zuhause, Arbeit, Unterwegs, Standort offen** (manuelle Auswahl). Der jeweils gewählte Kontext steht neben 📍.
- **Automatisch erkennen** ist optional; bei noch nicht erfasster Ortszone gibt es eine Aufforderung, zuerst Zuhause/Arbeit einzurichten.
- **⚙ Standorte & Radius einstellen** klappt die lokalen Ortseinstellungen aus: **Hier festlegen** am tatsächlichen Ort, Erkennungsradius 150 bis 1.500 m (Standard 300 m), bestehende Zone neu setzen/entfernen, **Standort jetzt prüfen**.
- Das Dropdown enthält weiterhin die ortsabhängigen Schnellansichten sowie **✦ Was passt jetzt?**; das Empfehlungen-Panel wird nur auf ausdrückliche Aktion berechnet.
- Die früher vorgesehene große Standort-Kontextleiste innerhalb der Heute-Karten entfällt, damit die Ansicht schlank bleibt.

## Bestehende Intelligenz bleibt unverändert

- Kontextbezogene Next Actions, Standortklassifizierung, die verschlüsselte lokale Speicherung von Home/Work-Ortszonen und die People/Work-Vorauswahl bleiben auf der `.39`/`.40`/`.40.1`-Logik.
- Die App fragt den Standort **nicht** schon beim Anzeigen des Menüs ab. Manuelles Umschalten funktioniert ohne Standortberechtigung. Die automatische Erkennung prüft bei sichtbarer App frühestens alle 30 Minuten mit **zuvor erteilter Freigabe**; keine Hintergrundüberwachung, keine Bewegungsprotokolle.
- Familien-Radar, Forecast-Inspector und alle bisherigen Module werden nicht neu entworfen.

## Qualität

- **1.512 Node-Tests** geprüft; vollständige Vite-Plugin-Quelltext-Transformationskette auf echtem `client/src/main.js` erfolgreich und JavaScript-Syntax validiert.
- Worker-Syntaxprüfung erfolgreich.
- Produktionsbuild/Live-PWA/GPS-Messung nicht lokal nachgewiesen, da die installierten Vite-Dependencies im Quellpaket nicht enthalten sind. Nach Commit Deploy-Workflow prüfen und auf dem Samsung-Gerät einen PWA-Neustart durchführen.
- Keine D1-, Worker-, Tresor- oder Google-Migration.
