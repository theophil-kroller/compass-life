# Compass 0.5.77.59.30 — Extended Mobile & Daily Dozen

Ausgangspunkt: GitHub Commit `9cb81a2433641b5058194f040c4f8a5cb4a9aa9d`, Workflow #262 erfolgreich.

## Upload

Die Verzeichnisse `client/` und `tests/` mit den im ZIP enthaltenen Pfaden nach `main` hochladen. Bestehende `client/vite.config.js` ersetzen. **Keine Skripte lokal ausführen.** Keine D1-Migration, kein Vault-Reset. Die alten `.28`- und `.29`-Bridges sowie ihre Tests nicht überschreiben.

## Funktionsumfang

- **Fokus-Modus:** vorherige Oberfläche und Menüstruktur bleiben unangetastet. Die neue Schnellnavigation wird hier nicht erzeugt, das Daily-Dozen-Panel nicht gerendert.
- **Erweiterter Modus auf Mobilgeräten (bis 700px):** Heute, Inbox, Menschen, Finanzen, Insights und „Mehr“ direkt erreichbar. „Mehr“ öffnet die bisherige Navigation, die eingeblendete Schnellleiste bleibt erreichbar. Die alte, doppelte Insights-Kategorieleiste wird nur in diesem Modus ausgeblendet.
- **Life Balance, erweitert:** zusätzliche neunte Dimension „Ernährung · dokumentiert“ mit dynamischer Radar-Geometrie. Für die Achse zählen nur protokollierte, dem Daily Dozen belegbar zuordenbare Ernährungsportionen (ohne Bewegung), und nur bei mindestens 3/7 beziehungsweise 8/30 Tagen mit Einträgen. Unbekannte Mengen werden nicht nachgetragen.
- **Daily Dozen:** offizielle 12 Kategorien inkl. Bewegung als Referenz, Tagesansicht mit nachgewiesenen Portionsmengen; nicht dokumentierte Kategorien sind **keine Aussage, dass nichts gegessen wurde**. Noch keine automatische Garmin-Bewegungsbuchung. Die Auswertung ist kein Anti-Aging- oder Gesundheits-Score.
- **Kontaktprofile:** bleiben aus Datenschutzgründen nur dann geräteübergreifend verfügbar, wenn vorhandener E2EE-Kontaktabgleich ausdrücklich aktiviert wurde. Dieser Patch macht keine automatische Übertragung.
- Versionsanzeige im ausgeführten Quellcode: `0.5.77.59.30`. Eine bereits installierte PWA kann bis zum Service-Worker-Update vorübergehend einen alten Stand anzeigen.

## Qualität / Einschränkungen

- 5 neue gezielte Tests bestanden; Syntaxprüfung der JavaScript-Dateien und eines transformierten `main.js`-Fixtures bestanden.
- Source-Anker gegen GitHub-Stand #262 geprüft; Radar-Transformation der echten GitHub-Datei syntaktisch geprüft.
- **Keine Aussage**, dass die vollständige GitHub-Suite oder der Produktions-Build bereits erfolgreich gelaufen sind. Den vollständigen Ergebnisstatus liefert erst der GitHub-Workflow nach Upload.

Quellen: https://nutritionfacts.org/daily-dozen/  und  https://nutritionfacts.org/topics/daily-dozen/
