# Compass Life 0.5.77.24 — Classic Outlook Local Bridge MVP

Basis 0.5.77.23. Keine Worker-, D1-, Tresorformat- oder Authentifizierungsänderung.

## Neue Funktionen

- **Einseitige, lokale Outlook-Bridge** als `tools/outlook_bridge.py`, nur für **klassisches Outlook unter Windows**. Lesen markierter E-Mails aus Outlook-To-Do (falls verfügbar), Inbox und Sent über `pywin32`/COM. Keine Änderungen an Outlook; keine vollständigen E-Mail-Texte oder Anhänge.
- Das Windows-Programm kann entweder eine JSON-Vorschau ausgeben oder einen lokalen Dienst unter `127.0.0.1:8765` mit **tokenbasierter Authentifizierung und einzeln freigegebener Website-Origin** starten. Schlüsselausgabe nur an der lokalen Konsole. Der Dienst ist unabhängig vom PWA-Rendering; keine blockierenden Abfragen bei gewöhnlichen Compass-Klicks.
- Inbox → aufklappbares **„✉️ Outlook · markierte E-Mails“**. Verbindungsschlüssel eingeben, lokal abrufen; alternativ JSON-Datei auswählen. Importvorschau zeigt den Betreff sowie wählbaren GTD-Typ (Inbox, Next Action, Waiting For), Titel vor Übernahme editieren. **Explizite Bestätigung**, erst dann Speicherung im vorhandenen verschlüsselten Tresor.
- Einseitige Übernahme mit `tags:['outlook']`; Importidentitäten als Prüfsummen in verschlüsseltem lokalen Tresor `state.outlookBridgeImported`. Erneutes Importieren derselben Outlook-IDs legt keine Duplikate an. Outlook-Flag-Datum wird nur in der Vorschau gezeigt; **keine automatische harte Deadline**.
- Nach erfolgreicher Verbindung werden neue Markierungen in der offenen Inbox alle rund 90 Sekunden lokal geprüft, ohne Hintergrundaufruf bei gesperrtem Tresor, anderer Compass-Ansicht oder aktiver Formularbearbeitung.
- Separater Windows-Starter `tools/start_outlook_bridge.cmd`, genaue Anleitung `INSTALLATION_0.5.77.24.txt`.

## Datenschutz / Grenzen

- `http://127.0.0.1` nur lokal, Origin-Allowlist und zeitlich flüchtiger 256-Bit-Token. Browser-Zugriff auf Loopback kann in Chrome eine gesonderte Berechtigung verlangen oder durch Unternehmensrichtlinien blockiert sein. Für diesen Fall manueller JSON-Import.
- Es werden **keine Mails verändert**, gelesen werden lediglich Betreff, Flag-Datum und lokal gehashte Kennung. **Bei bewusst bestätigter Übernahme können Betreff-Titel über den existierenden unverschlüsselten Aufgaben-/Inbox-Cloud-Abgleich synchronisiert werden.** Berufliche Geheimhaltung/IT-Vorgaben vor Verwendung überprüfen.
- Nur das aktuelle Windows-Outlook-Profil; neue Outlook-App / macOS / Android ohne COM sind nicht angebunden. Die Brücke erfasst möglicherweise nicht alle Postfachordner, je nach To-Do-Ordner des Exchange-Profils.
- Kein Mail-Deep-Link und keine automatische Rücksynchronisierung von erledigten Aufgaben nach Outlook im MVP. Beim Verschieben von Mails kann sich Outlooks `EntryID` ändern, dann kann die lokale Dublettenerkennung diese als neu einstufen.

## Qualitätssicherung

- Bestehende UI-, Vault-, Sync-, GTD- und Nutrition-Tests unverändert erfolgreich.
- Neue JS-Tests für Schema-Validierung, Duplikate, gültige GTD-Aufgaben, Loopback-URL und UI-Einwilligung.
- Python-Sicherheitstests für erlaubte Origins, Flag-Datum und Windows-Grenzen.
- Keine zusätzlichen Frontend-Abhängigkeiten; Windows benötigt optional `pywin32` und klassisches Outlook. Linux-Testumgebung hat kein reales Outlook und keinen Vite-Produktionsbuild.
