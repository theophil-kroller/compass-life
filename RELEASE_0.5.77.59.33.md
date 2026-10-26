# Compass Life 0.5.77.59.33 – People Recovery & Fast Family Today

Basis: GitHub Actions Workflow #267, Commit `0888b6c47c7b36a7834a86b7770e150283e99751` (erfolgreich).

## Änderungen
- Menschen: Wenn auf diesem Gerät keine Profile vorhanden sind, wird die genaue Stufe der freiwilligen Ende-zu-Ende-verschlüsselten Kontakt-Synchronisierung dargestellt. Sofort erreichbare Schaltflächen für Einrichtung, Freigabe oder erneuten Abgleich. Nichts wird automatisch zur Cloud freigegeben.
- Menschen: Beim bewussten Öffnen der Seite wird bei bereits freigegebener verschlüsselter Übertragung und leerem lokalem Verzeichnis optional einmal im Hintergrund synchronisiert; niemals beim Start oder Öffnen von „Heute“.
- Familie/Heute: bis zu zwei kompakte Impulse; Kalender-Titel werden einmal nach Personenpräfix indiziert statt für jeden Personenkontakt alle Termine erneut zu durchlaufen. Keine zusätzlichen Google-Kalender-API-Aufrufe.
- Sichtbare App- und Lockscreen-Version: 0.5.77.59.33.
- Fokus-Modus und Desktop-Kontaktdaten werden nicht verändert.

## Kontakte auf das Handy übertragen
1. Auf dem Desktop mit den vorhandenen Kontakten den lokalen Vault entsperren. In **System & Synchronisation** den Ende-zu-Ende-verschlüsselten Geräteabgleich einrichten (falls noch nicht eingerichtet), dann **Kontaktprofile geräteübergreifend → Kontaktsynchronisierung aktivieren** und **Kontaktprofile jetzt abgleichen** wählen.
2. Auf dem Handy im selben Compass-Konto und entsperrten Vault den Geräteabgleich mit **derselben persönlichen Synchronisierungs-Passphrase** einrichten. Im Bereich **Menschen** die nun angebotene Kontaktfreigabe ausdrücklich aktivieren und **Kontakte jetzt abgleichen** antippen.
3. Falls auf beiden Geräten bereits der E2EE-Abgleich eingerichtet ist: Nur die Kontaktfreigabe auf **beiden** Geräten prüfen und dort synchronisieren. Keine Kontaktprofile doppelt neu anlegen. Bei fehlendem Schlüssel nicht den Vault löschen, sondern den ursprünglichen Schlüssel aus der eigenen Einrichtung verwenden.
4. Cloudflare sieht nur verschlüsselte Daten. Die Kontaktsynchronisierung ist kein Bestandteil des gewöhnlichen Inbox-/Aufgabenabgleichs.

## Grenzen
- Dieser Patch enthält **keine** Kontaktdaten aus deinem persönlichen Desktop-Tresor. Ohne ausdrückliche E2EE-Freigabe auf beiden Geräten kann er dortige Kontaktprofile nicht abrufen.
- Der Family Radar synchronisiert Regeln/Entscheidungen zwischen Geräten weiterhin nicht vollständig. Freie Lernzeitfenster/Forecast-Markierung sind noch offen.
- Keine neuen D1-Migrationen, keine Änderungen an Google-Kalender-Einträgen.

## Tests
- `npm run check`: 1437 Tests, 1437 bestanden; Worker-JavaScript-Syntax geprüft.
- `npm run build`: lokal nicht möglich (`vite: not found`; der Quellcode-Snapshot enthält keine `node_modules`). Die vollständig integrierte Vite-Produktion und der GitHub-Deploy müssen noch auf Actions nach Upload bestätigt werden.
- Patch und Full Source stammen aus denselben aktualisierten Dateien und wurden per SHA-256 verglichen.

## Installation
- **PATCH_READY_UPLOAD.zip** in seiner vorhandenen Ordnerstruktur nach `main` hochladen, vorhandene Dateien ersetzen. **Nicht gleichzeitig den Full Source darüber hochladen.**
- **FULL_SOURCE_READY.zip** ist der komplette Quellcode-Snapshot derselben Version für Backup/Rollback und den späteren vollständigen Produktionsbuild.
