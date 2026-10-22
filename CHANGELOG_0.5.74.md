# Compass 0.5.74 — Calendar Cache & Performance

Baseline: 0.5.73.1. Google Calendar ist weiterhin führend. Der Abgleich benötigt bei abgelaufenem Google-Zugriff erneut eine Freigabe; es werden KEINE OAuth Refresh-Tokens gespeichert.

- Verschlüsselter Kalenderbestand im lokalen Vault, inklusive des bestehenden E2EE-Geräteabgleichs über Journal-Payload.
- Historischer Abruf ab erster gültiger Garmin-Stressmessung, Zukunftsplanung 365 Tage.
- Abschnittsweise Google-API-Abfrage; nur vollständig geladene Abschnitte ersetzen Daten. Terminlöschungen als Tombstones, keine blinde Vollersetzung.
- Reduzierte Google-Datenfelder: ID, Zeit, Titel, Status und Änderungszeitpunkt. Keine Beschreibung oder Teilnehmer.
- Tagesindex für Kalenderansichten, Schlafanalyse nur bei entsprechenden Insight-Ansichten, mit Cache für unveränderte Gesundheitsdaten.
- Keine D1- oder Worker-Migration. Der Kalenderabgleich setzt ein entsperrtes Vault und einen gültigen Google-Calendar-Zugriff voraus.
- Manuelle erneute Google-Autorisierung kann nötig sein. Ein dauerhafter OAuth-Refresh-Token-Flow wird hier noch nicht eingeführt.
- Google Kalender und Compass-Tresor müssen bei beiden Geräten mit demselben Geräteabgleich-Schlüssel gekoppelt sein, damit Kalender zwischen ihnen abgeglichen wird.

## Prüfstatus
- Node Syntaxprüfungen für die neuen/geänderten Module erfolgreich.
- 5 gezielte Kalendermodultests erfolgreich; vollständige Node-Suite: 777/777 erfolgreich. Vite-Produktionsbuild und Browser- bzw. Live-Zwei-Geräte-Test noch offen.
