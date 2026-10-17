# Compass 0.4.0 — echte Tagesplanung, Deadlines, Garmin-Cache & Offline-Sicherheit

## Was funktioniert (nach Deployment)

- **PWA / Heute:** Aufgaben mit Titel, optionaler Notiz, geplanter Tag, separater harter Deadline und Kategorie erstellen, bearbeiten, abhaken, archivieren.
- **Forecast:** Überfällige und kommende Fristen der nächsten 14 Tage. Keine synthetischen Termine.
- **PWA lokal:** Alle Aufgaben und Änderungen bleiben AES-GCM-verschlüsselt im entsperrbaren IndexedDB-Vault. Läuft auch offline; keine Cloudpflicht fürs Erfassen.
- **Cloud:** Eigenständige Aufgaben-Tabelle in D1, nur für den angemeldeten Eigentümer. Versionierte Änderungen verhindern stilles Überschreiben. Konflikte benötigen manuelle Entscheidung.
- **Watch:** Per gekoppeltem Watch-Token Read-only-Abgleich der Heute-Liste und Deadlines; die letzte erfolgreich geladene Planung ist lokal abrufbar.
- **Ausfallsicherheit:** Kein Netzwerkzwang für laufende Fokuszeit oder Speicherung; manuelle Sync-Anfragen laufen asynchron, Watch gibt nach 15 s die SYNC-Ansicht frei. BACK darf sie sofort verlassen. PWA-Anfragen haben 12-s-Zeitlimit.
- **Uhr-Aufzeichnungen:** lokal gespeichert; Upload weiterhin über Watch-ID idempotent. Keine Daten werden wegen eines fehlgeschlagenen Sync-Versuchs gelöscht.

## WICHTIG – Reihenfolge für GitHub und Cloudflare

1. **Backup anlegen:** Vor produktiven Daten die verschlüsselten Compass-Vaults sichern (System → Verschlüsseltes Backup exportieren). Die vorhandenen Daten werden nicht überschrieben.
2. **Migration VOR dem neuen Worker:** In Cloudflare → D1 → `compass-db` → Console die SQL-Anweisungen aus `worker/migrations/0004_planning_tasks.sql` ausführen. Dies legt ausschließlich die neue Tabelle/Indizes an; bestehende Tabellen werden nicht verändert. Alternativ Wrangler: `npx wrangler d1 migrations apply compass-db --remote` im `worker`-Verzeichnis. Falls andere Migrationen fehlen, in korrekter Reihenfolge ausführen.
3. Den **Repo-PATCH** im GitHub Repository `theophil-kroller/compass-life` auf `main` hochladen: relative Ordnerpfade erhalten, keine zusätzlichen Oberordner, keine .env-Dateien hochladen.
4. GitHub Pages Workflow (`Deploy Compass Web`) auf grün prüfen. Separat auf Cloudflare beim Worker **`compass-api`** nachsehen, ob der neueste GitHub-Commit wirklich deployed wurde. Bei Bedarf dort erneut deployen. Der Pages-Workflow deployed NICHT den Worker.
5. Im Browser öffnen: `https://compass-api.theophil-tiger.workers.dev/api/health`. Nach dem neuen Worker sollte `{...,"apiVersion":2,"planning":true}` erscheinen. Fehlt das, läuft noch die alte Worker-Version.
6. Auf Laptop/Android Compass neu laden, Vault entsperren, Google-Verbindung aktivieren. Unter **Heute** reale Aufgaben mit geplantem Tag und optionaler Deadline erfassen. Unter **Forecast** erscheinen überfällige und künftige Fristen.
7. Auf dem zweiten Gerät dieselbe Google-Sitzung mit eigenem lokalen Vault entsperren und den Sync abwarten. Beim Bearbeiten desselben Eintrags auf beiden Geräten entsteht ein sichtbar lösbarer Konflikt, kein stiller Überschreibvorgang.

## Garmin auf fēnix 7S testen (Windows)

1. Garmin Connect auf Samsung installieren/öffnen und sicherstellen, dass die fēnix 7S über Bluetooth gekoppelt ist.
2. Garmin-PATCH: `garmin/CompassWatch/source/CompassApp.mc` in deinem bestehenden Garmin-VS-Code-Projekt ersetzen.
3. In VS Code zuerst `Ctrl + F5` für den **fēnix 7S Simulator** ausführen. Prüfen, ob es `BUILD SUCCESSFUL` gibt und die Menüs reagieren. Der neue Garmin-Quellcode wurde hier NICHT vom Garmin-SDK kompiliert.
4. Für die echte Uhr in VS Code `Ctrl + Shift + P` → **Monkey C: Build for Device**, Ziel **`fenix7s`** (OHNE `_sim`), z. B. Debug. Die App muss für deine fēnix 7S signiert mit deinem eigenen privaten Developer Key kompiliert werden. **Privaten Developer Key niemals hochladen**.
5. Mit dem Garmin-USB-Kabel die Uhr an den Windows-Laptop anschließen. Die erzeugte `CompassWatch.prg` in den Geräteordner **`GARMIN/APPS`** kopieren (fēnix 7S meldet sich gewöhnlich als tragbares/MTP-Gerät). Sicher trennen und App auf der Uhr über START → Apps/Aktivitäten starten.
6. PWA → **Aktivitäten** → **Kopplungscode erstellen**. Auf der Uhr in Compass: im Auswahlbildschirm **BACK** (nicht verbunden) bzw. **UP/MENU lange halten** → Synchronisieren. Code per UP/DOWN/START eingeben.
7. Nach Kopplung: Bei geöffneter Compass-Watch-App auf der Uhr **UP/MENU lange halten** (physische Taste links in der Mitte, in der Simulator-Tastatur `M`) → **Synchronisieren**. Nach erfolgreichem Sync in den Menüs HEUTE/FORECAST die Aufgaben testen.
8. Kurz eine Aktivität starten, beenden & speichern, nochmal Synchronisieren, dann PWA → Aktivitäten → **Sessions aktualisieren**. Erst damit ist die Datenübertragung auf der echten Uhr bestätigt.

## Ausfalltest / verbindliche Zuverlässigkeit

- **Telefon ausschalten oder Bluetooth deaktivieren:** Auf der Garmin eine Session starten/pausieren/beenden. Die App muss trotz fehlender Verbindung funktionieren und die Session lokal halten.
- Aus dem Auswahlbildschirm **MENU → Synchronisieren**. Wenn die Verbindung scheitert, spätestens nach 15 Sekunden eine verständliche Meldung, kein ewiger Ladebildschirm.
- **BACK** aus SYNC bringt dich unmittelbar zur normalen Auswahl zurück. Ein verspätetes Callback darf die Uhr nicht zurück in einen blockierenden Zustand versetzen.
- Bluetooth wieder einschalten, Garmin Connect wieder öffnen, Sync erneut starten. Bereits bestätigte Sessions dürfen nicht doppelt erscheinen.

## Aktuelle Grenzen

- Im bisherigen Compass gibt es noch KEINE Google-Calendar-Integration. Die Garmin zeigt daher reale Compass-Aufgaben/Deadlines, aber noch keine externen Meetings. Auch Push-Meeting-Erinnerungen während Pomodoro sind eine spätere Funktion.
- Aufgaben bleiben auf Garmin zunächst **read-only**; abhaken/ändern erfolgt in der PWA. Konkrete Aufgaben-ID ↔ Fokus-Session-Verknüpfung noch nicht implementiert.
- Sync ist manuell über das Menü ausgelöst; keine Zusage von verlässlichem Hintergrund-Push.
- Watch ist lokal **nicht E2EE verschlüsselt**; der Worker speichert Aufgabentitel und Sensorwerte in authentifizierungsgeschützter D1, nicht mit Ende-zu-Ende-Verschlüsselung. Kein vertraulicher Klienteninhalt in Aufgaben-Titeln für die Uhr verwenden.
- Die Garmin/SDK-Kompilierung und Bluetooth-Brücke müssen auf dem echten Gerät getestet werden.
