# Compass 0.4.1 – Garmin Premium, Wochenreview, Dashboard, Google Calendar

**Stand:** 17.10.2026 · Alpha-/Test-Build · nicht auf echter Garmin kompiliert/installiert.

## Installation

1. `Compass_0.4.1_GITHUB_PATCH.zip` entpacken und die Dateien **pfadgleich** ins Repository `compass-life` (Branch `main`) hochladen. Dabei auch `worker/src/tasks.js` ersetzen. Keine bestehenden SQL-Migrationen erneut ausführen.
2. GitHub Pages Build und Cloudflare Worker `compass-api` getrennt auf Erfolg prüfen. Der Worker ist für den 60-Tage-Abruf wichtig. `api/health` bleibt `apiVersion: 2, planning: true` und beweist **nicht**, welche Dateiversion deployed ist.
3. PWA neu laden (bei PWA-Cache eventuell Browser neu öffnen). Wochenreview, Übersicht, Heute und Forecast öffnen.
4. Optional: In Google Cloud **für das bisherige Projekt Compass Life** die Google Calendar API aktivieren (Google Cloud Console > APIs & Services > Library). Der vorhandene OAuth-Webclient muss die benutzte GitHub-Pages-URL als autorisierte JavaScript-Origin enthalten. Bei OAuth im Testmodus muss das verwendete Google-Konto Testnutzer sein. Anschließend in Compass auf **Google Calendar verbinden (nur lesen)** klicken und dem Kalenderzugriff zustimmen. Dieser Schritt ist unabhängig von Compass-Google-Login und erfordert **keinen** neuen Worker.
5. Lokal `Compass_Garmin_0.4.1_LOCAL_PATCH.zip` entpacken. Im bestehenden `CompassWatch`-Projekt `source/CompassApp.mc` ersetzen. Simulator schließen, dann in VS Code `Ctrl + F5` starten (oder `Monkey C: Build for Device` für `fenix7s`). Developer Key bleibt ausschließlich lokal.
6. Vor physischer Installation: Build for Device `fenix7s`, Output `.prg` prüfen, fēnix 7S per USB an Windows verbinden, die `.prg` unter `GARMIN/APPS` kopieren, Uhr sicher auswerfen. Die Uhr muss für Connect-IQ-Sideloading kompatibel verbunden sein; das Gerät selbst ist noch ungetestet.

## Garmin 0.4.1

- Hauptmenü unter UP/MENU lang (Simulator `M`): **Fokus, Heute, Deadlines, Sync**. „Timer-Modus“ entfällt aus dem Hauptmenü. Pomodoro oder freie Zeiterfassung bleibt der Standard der gewählten Kategorie.
- **Deadlines: 60 Tage** bei maximal 15 offenen Fristen; im Backend `worker/src/tasks.js` umgesetzt. Die PWA-Forecast-Ansicht bleibt weiterhin die nähere 14-Tage-Ansicht.
- **Detailansicht:** In Heute/Deadlines mit UP/DOWN durch Aufgaben, START öffnet Details, UP/DOWN scrollt lange Titel (max. 3 Textzeilen sichtbar), BACK kehrt zur Liste zurück. Datum erscheint als TT.MM.JJJJ. Dringlichkeit wird mit roten/bernsteinfarbenen/neutralen Kalender-Markern dargestellt.
- **Auto-Abgleich:** Bei erfolgreicher Erstkopplung startet ein erster Planungsabruf. Beim Öffnen der Listen startet ein stiller Nachladeversuch, wenn Daten älter als 15 Minuten sind und ein kurzer Mindestabstand zwischen Versuchen abgelaufen ist. Der alte Cache bleibt während Ausfällen erhalten.
- **Offline:** Netzwerk-Anfrage maximal 15 Sekunden; keine erzwungene Navigation bei Rückmeldung, Fokus-Timer soll weiterlaufen. Lokale Warteschlange für Sessions bleibt bei Fehler erhalten; das Verhalten muss noch auf echter Uhr und Smartphone getestet werden.
- **Typografie:** Garmins Systemfonts, auf den echten `Dc.getTextWidthInPixels()`-Schriftmetriken basierter Umbruch. Keine unrealistische Mockup-Feinschrift und keine ungeprüften zusätzlichen Bitmap-Fonts. Die Optik muss im Simulator beurteilt werden.

## PWA 0.4.1

- **Wochenreview:** Symbole für Review-Schritte. Energieklassifikation: wenig, mittel, viel mit passend gefärbtem Batterie-Füllstand. Aufmerksamkeit: Routine, geistige Klarheit, tiefes Denken – durch Anklicken auswählbar. **Diese Metadaten werden verschlüsselt nur im jeweiligen lokalen Tresor gespeichert**, noch nicht in D1 oder auf andere Geräte synchronisiert. Die übrigen GTD-Klassifizierungsbuttons sind weiterhin Platzhalter und bleiben deaktiviert.
- **Dashboard/Übersicht:** Echte Fokusstunden, abgeschlossene Pomodoros und Sessions aus den letzten maximal 50 Cloud-Watch-Sessions. Werte werden beim Öffnen der Übersicht oder der Aktivitäten-Seite aktualisiert. **Das sind keine Garmin-Connect-Gesamtdaten.**
- **Erholung:** HR und Body Battery kommen ggf. aus einzelnen Watch-Sessions. **Schlafdaten werden nicht automatisch übertragen.** Garmin Connect liefert sie unserer PWA nicht von selbst; dafür braucht es später eine gesonderte Datenquelle und Berechtigungsprüfung.
- **Google Calendar:** Optionale lesende OAuth-Berechtigung `https://www.googleapis.com/auth/calendar.events.readonly`, eigene Zustimmung. Abruf des **primären Google-Kalenders** über Google Calendar API von Browser zu Google, ohne Token in D1, ohne Token-Persistenz im Tresor. Zugriffstoken und Ereignisse liegen nur im Arbeitsspeicher; bei Sperre/Abmeldung werden sie entfernt. Abruf eines Fensters von 21 Tagen, Anzeige in Heute, Forecast und Dashboard. **Noch keine Zusammenführung mehrerer Kalender, kein Google Calendar auf Garmin, keine automatische Synchronisierung der Termine in die D1-Datenbank, kein Schreiben in Google Calendar.**

## Validierungsstand

- `node --check client/src/main.js`, `node --check worker/src/tasks.js` erfolgreich.
- `node --test tests/*.test.mjs`: 22/22 erfolgreich; neuer Regressionstest für den 60-Tage-Abruf und Unterscheidung Heute/Deadlines.
- **Nicht abgeschlossen:** `vite build` (npm-Abhängigkeiteninstallation erreicht Zeitlimit in der Buildumgebung); Garmin-Connect-IQ-Compiler und echter Geräte-/Bluetooth-Test. Dies ist Quellcode zur Abnahme, **keine als funktionsfähig zertifizierte `.prg`**.

## Zuerst testen

1. Nach Cloudflare-Deployment Garmin-Simulator mit bestehendem Pairing starten, MENU > Deadlines. Beide bisherigen Fristen sollten erscheinen; START öffnet Details. Nach dem Deployment ggf. MENU > Sync für sofortigen Test verwenden.
2. Bei Flugmodus/ohne Netzwerk muss der Cache sichtbar bleiben, und BACK darf nicht hängen.
3. PWA Übersicht öffnen: Sessions/Pomodoros nur dann >0, wenn echte Uhr-Sessions übertragen wurden.
4. In PWA Google Calendar verbinden: OAuth-Popup, Calendar API, Termine sichtbar. Bei `403` Google Cloud API und OAuth-Zustimmung prüfen.
