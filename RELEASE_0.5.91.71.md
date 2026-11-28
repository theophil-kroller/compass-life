# Compass Life 0.5.91.71 · Cloud-Tresorwiederherstellung

## Ziel
Auf einem Gerät ohne lokale IndexedDB-Tresordaten kann eine vorhandene verschlüsselte Cloud-Tresorsicherung nach Eingabe der gewohnten Tresor-Passphrase ohne Google-Anmeldung geladen werden. Die Passphrase bleibt im Browser.

## Änderungen
- Vollständiger Ciphertext-Tresor (einschließlich verschlüsseltem GTD-Journal, Erfassungs-Schlüsseln und Entwürfen) als versionierte Cloud-Sicherung. **Keine Google-Sitzung/Tokens im Backup**.
- Upload nur über die bereits authentifizierte Compass-Cloud-Sitzung auf einem funktionsfähigen Gerät; anschließend bei aktiver Sitzung regelmäßige Sicherungen. Cloud-Backup-Aktion und letzter bestätigter Sicherungszeitpunkt in System → Lokaler Tresor.
- Wiederherstellung: Passwort → passwortbasierte, lokal abgeleitete 256-Bit-Kennung → Download der verschlüsselten Teile → SHA-256-Integritätsprüfung → AES-GCM-Passphrase-Test **vor** dem Import → Import in leeren Tresor.
- Weder Passphrase noch Klartext verlassen das Gerät. Cloudflare D1 hält die letzten drei vollständig hochgeladenen verschlüsselten Fassungen; abgebrochene Uploads werden bereinigt.
- Ein wiederhergestellter Tresor übernimmt auf neuen Geräten nicht versehentlich die Schreibrolle („Hauptgerät“) des bisherigen Computers im privaten Geräteabgleich.

## Einschränkung der ERSTEN Wiederherstellung (wichtig)
Dies kann **keinen** bereits verschwundenen Handy-Tresor wiederfinden, solange noch **kein vollständiger Cloud-Tresor hochgeladen wurde**. Auf einem funktionsfähigen Computer muss nach Bereitstellung der Worker-Migration einmal eine vollständige Cloud-Sicherung ausgelöst und mit „erfolgreich gesichert“ bestätigt werden. Erst **danach** funktioniert die Ein-Passwort-Wiederherstellung am Handy. Eine ZIP-Datei wird nicht direkt als Android-App installiert: Die PWA wird nach GitHub-Pages-Deployment über die bestehende URL aktualisiert.

## Installation (Reihenfolge entscheidend)
1. Neue SQL-Migration `worker/migrations/0021_vault_recovery.sql` ausführen: `npm run db:remote` im Projektroot (Cloudflare-Wrangler-Zugang erforderlich). Diese Migration fügt nur neue Tabellen hinzu und löscht keine bestehenden Tresordaten.
2. Den aktualisierten Worker mit `npm run deploy:api` veröffentlichen (Cloudflare-Zugang erforderlich). GitHub Pages deployt **nur das Web-Frontend**, nicht automatisch den Cloudflare-Worker.
3. Das Web-Frontend aus diesem Release in GitHub aktualisieren und den bestehenden Pages-Workflow ausführen.
4. **Am Computer** den bestehenden Tresor mit der bekannten Passphrase entsperren, Cloud-Sitzung prüfen und unter System → Lokaler Tresor → „Jetzt verschlüsselt in Cloud sichern“ eine bestätigte Sicherung erzeugen. Das geschieht anschließend auch automatisch bei aktiver Cloud-Sitzung.
5. **Am Samsung** dieselbe Compass-URL/PWA öffnen: Falls kein lokaler Tresor erkannt wird, „Sicher aus Cloud wiederherstellen“ und das gewohnte Tresor-Passwort eingeben. Kein Google-Login für den Download. Für spätere Bearbeitungs-Synchronisierung ist ggf. die gewöhnliche Google-Sitzung einmalig erneut zu verbinden, denn Authentifizierungs-Tokens werden ausdrücklich nicht in den Cloud-Tresor exportiert.

## Sicherheitsgrenzen
- Die Passwort-basierte Kennung ist ein **Zugriffsgeheimnis**: Wer die Tresor-Passphrase errät, könnte den verschlüsselten Cloud-Backup-Blob abrufen und offline angreifen. Verwende eine starke, einzigartige Passphrase; keine Wiederverwendung anderer Passwörter. Cloudflare erfährt die Passphrase nicht.
- Die Methode ist nicht gleichbedeutend mit einer durch Google authentifizierten Cloud-Speicherberechtigung. Sie ist bewusst für den gewünschten „nur Passwort“-Wiederherstellungsablauf implementiert.
- Browser-Daten nicht löschen, bis die erste Cloud-Sicherung am PC erfolgreich bestätigt und auf dem Samsung die Wiederherstellung abgeschlossen ist.
- Cloud-Backup-Verfügbarkeit hängt von Internet, Cloudflare-D1- und Worker-Deployment, dem aktuellen Sitzungstoken für Upload und einer erfolgreichen vollständigen Übertragung ab. Bei Cloudfehlern bleiben lokale Daten unberührt.
- Limit: ca. 18 MB serialisierte, bereits verschlüsselte Tresordaten pro Sicherung; darüber bleibt der manuelle lokale JSON-Export nötig.
- Bei verteilten Geräten können unterschiedliche Stände bestehen; die letzten drei vollständigen verschlüsselten Versionen bleiben abrufbar. Dies ersetzt nicht eine unabhängige Offline-Sicherung.

## Qualität
Neue Tests mit SQLite in-memory: KDF, Passwort-unabhängige Speicherung, versionierter Upload/Download, Chunk-Integrität, falsche Passphrase. Vollständiger Testlauf 2422 bestanden / 67 frühere Fehler (identisch zu 0.5.91.70). Importgraph und Node-Syntax überprüft. Vite-Produktionsbuild nicht lokal ausgeführt (Abhängigkeiten nicht installiert); GitHub Actions prüft diesen beim Deployment.
