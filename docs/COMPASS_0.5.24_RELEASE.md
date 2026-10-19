# Compass 0.5.24 – People & Relationships

**Basis:** 0.5.23. Keine Worker-, D1-, Vault-Kryptografie- oder Sync-Protokolländerungen.

## Neu

- **Bestätigter Kontaktverlauf:** Je Person Kontaktart (Treffen, Anruf, Nachricht, Video, Sonstiges), Datum und optionale kurze Notiz speichern. Kontakte stehen chronologisch im Personenbereich, Einträge können nach Bestätigung gelöscht werden.
- **Letzter Kontakt:** Anzeige nur aus selbst bestätigten Kontakteinträgen. Ein Google-Kalendertermin, eine Inbox-Notiz oder eine Aufgabe wird **nicht** automatisch als Kontakt gewertet.
- **Freiwilliges Relationship Review:** Pro Kontakt ausschaltbar (Standard: aus) oder mit Intervallen von 14/30/60/90/180/365 Tagen. Hinweise im Personenbereich und im vorhandenen Schritt „Waiting For & Agendas“ des Wochenreviews. Nur nach bereits bestätigtem Kontakt; keine Push-Erinnerung und kein sozialer Score.
- **Personen-Agendas:** Offene, getaggte Aufgaben und noch ungeklärte Inbox-Einträge werden in einer kompakten Übersicht vor den administrativen Feldern gezeigt. Ein neuer Agendapunkt wird wie zuvor als explizite, synchronisierte Next Action erfasst; ungeklärte Inbox-Einträge bleiben getrennt.
- **Kontakteinstellungen:** Geburtstage, Personen-Tags, Kalender-Namensvarianten und persönliche Notizen bleiben wie zuvor funktionsfähig.

## Daten & Datenschutz

- Kontaktverlauf und freiwilliges Intervall werden **nur im verschlüsselten lokalen Browser-Vault** unter `state.people` gespeichert. Sie gehen in ein verschlüsseltes Vault-Backup ein. Sie werden **nicht** über die derzeitige D1-/Worker-Synchronisierung auf andere Geräte übertragen.
- Aufgaben und Projekte behalten ihr bisheriges Sync-Verhalten. Kalender bleibt browserlokal und read-only.
- Kein automatischer Kontaktimport, keine Annahme aus Kalendereinladungen und kein Zugriff auf das Telefonadressbuch.
- Es wird kein Kontaktinhalt in Repository, ZIP, Demo oder Telemetrie gespeichert.

## Prüfung

- `npm run check`: Node-Tests, inklusive gezielter Tests für Datumsvalidierung, Zukunftssperre, Review-Opt-in, Dubletten, UI-Integration, plus Worker-Checks.
- Browserseitiger Produktionsbuild muss nach dem Upload in GitHub Actions bestätigt werden, falls die npm-Abhängigkeiten lokal nicht verfügbar sind.

## Installation

1. **Verschlüsseltes Vault-Backup erstellen** (auch bei reinen Frontend-Updates).
2. `Compass_0.5.24_GITHUB_PATCH.zip` auf vorhandenes 0.5.23-Repository anwenden. Das FULL_SOURCE-ZIP ist nur zum vollständigen Abgleich/Neuaufbau gedacht.
3. In GitHub Actions den Pages-Produktionsbuild prüfen und die Menschen-Ansicht im echten Browser testen (insbesondere Kontakt hinzufügen, löschen, Review ein-/ausschalten, Wochenreview und Aufgaben-Tags).
4. Keine D1-Migration und kein Worker-Deploy erforderlich.
