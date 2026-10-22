# Compass 0.5.77.4 – Kinokatalog gezielt zurücksetzen

Ausgangsbasis: **Compass 0.5.77.3**.

## Neue Funktionen
- Neue Aktion **„🎬 Nur Kino löschen (N)“** direkt in der Kinoübersicht und **„🎬 Nur Kinoprogramm löschen (N)“** im Event-Importfeld.
- Löscht **ausschließlich Einträge mit Kategorie `Kino` oder `Filmfestival`**, einschließlich ihrer Vorführungen, Bild-/Textmetadaten und ausdrücklich auch gemerkter Kino-Termine. `Kabarett`, `Konzert`, `Musical`, `Ballett`, `Oper`, `Theater`, `Festival` (ohne Kategorie `Filmfestival`), `Tanz`, `Bujinkan`, `Tantra`, `Workshop` sowie sämtliche weiteren Bereiche bleiben erhalten.
- Eine Confirmation zeigt **exakt die Anzahl der zu löschenden Vorführungen, die unterschiedlichen Filmtitel und eventuell gemerkte Vorführungen**. Ohne Bestätigung wird nichts gelöscht.
- Die Löschung wird im lokalen verschlüsselten Vault sofort gespeichert und als **Tombstones** in die vorhandene Event-Sync-Queue eingereiht. Bestehende Versions-/Konflikteinträge werden für diesen expliziten Löschvorgang konsistent behandelt. Cloud-Übernahme erfolgt erst nach erfolgreichem Abgleich; Offline-Geräte aktualisieren beim nächsten Kontakt.
- Nach dem Zurücksetzen kann das Kinoprogramm mit dem Button **„Kinoprogramm komplett“** neu recherchiert und über das bestehende JSON-Importfeld eingespielt werden. Der Prompt fordert Poster und belegte Kurzbeschreibungen je Filmtitel ausdrücklich an.
- **Import-Vorschau mit Datenqualitätskontrolle**: Anzahl der verschiedenen Filme mit `imageUrl` und mit echter Inhaltsbeschreibung. Bei 0 Posterlinks erscheint eine deutliche Warnung *vor* dem Import.
- Automatische Löschfrist für **abgelaufene, nicht gemerkte** Kinovorführungen/Filmfestivaltermine von 14 auf **7 Tage** verkürzt. Für alle anderen Events bleiben 14 Tage; gemerkte Termine bleiben bis zu einer ausdrücklich bestätigten Löschung erhalten.

## Grenzen
- Die App lädt **kein Poster automatisch aus dem Internet**: Poster sind nur mit tatsächlich im Import vorhandener funktionierender `imageUrl` sichtbar. Ein aktueller Prompt garantiert nicht, dass für jedes Filmplakat ein zulässig verwendbarer direkter Bildlink recherchiert werden kann.
- Die Event-Cloud verwendet weiterhin Tombstones zur sicheren Geräte-Synchronisierung; das Entfernen aus der aktiven Liste bedeutet noch **keine physische Löschung aller Cloud-Metadaten**. Eine spätere generationssichere Tombstone-/Retention-Bereinigung ist ein separates Architekturthema.
- Vor der Aktion ein verschlüsseltes Vault-Backup sichern, insbesondere wenn gemerkte Vorführungen wichtig sind. Die Aktion ist nicht rückgängig zu machen.
- Es ist keine D1-Migration und kein Cloudflare-Worker-Update erforderlich. Nur Client-Dateien sind geändert.

## Tests
- `npm run check`: **823 von 823 Node-Tests bestanden**, Worker-Syntax grün.
- Produktionsbuild/visuelle Browser-Abnahme hier nicht möglich, da keine installierten Vite-Abhängigkeiten im Quellstand liegen. GitHub Actions prüfen.
