# Compass 0.5.57 — Inbox Quick Today

Basis: **Compass 0.5.56**. Keine D1-Migration, keine Schemaänderungen, kein Zurücksetzen des Vaults.

## Neu: heute direkt aus der Inbox

- Jede Inbox-Zeile hat rechts einen kleinen, zugänglichen Button **Heute**. Auf kleinen Bildschirmen erscheint das Kalendersymbol mit vollständigem Accessibility-Label und Tooltip.
- Ein Klick wandelt den Eingang als **Next Action** mit `plannedDate=lokaler heutiger Tag` um. Sie erscheint dadurch unmittelbar in **Heute** und **Next Actions**.
- Der Inbox-Eintrag wird in derselben verschlüsselten lokalen Transaktion als verarbeitet markiert (Tombstone); er bleibt nicht als Dublette in der Inbox. Es wird **keine Deadline**, kein Kalendertermin und keine künstliche Wiedervorlage angelegt.
- Titel, Notiz, Tags und Flagge werden über die vorhandene Inbox-Promotion-Logik unverändert übernommen; der Status lautet Next Action und das Projekt bleibt zunächst leer. Projektzuordnung ist weiterhin über den Inspector möglich.
- Ungültige Tagesangaben oder Inbox-Inhalte außerhalb der Task-Limits (Titel >180, Notiz >3.000 Zeichen) lösen eine Meldung aus; es werden keine Daten abgeschnitten oder geändert.
- Die Promotion schützt gegen doppelte Verarbeitung desselben Eintrags (erfolgreiche Konvertierung + Tombstone atomar) und nutzt die bestehenden verschlüsselten Vault-/Sync-Queues.

## Unverändert

- Projektansicht-Fix, Fortschrittsbalken, Projekttitel und Conference Radar mit 32 Einträgen aus 0.5.56 sind vollständig enthalten.
- Keine automatische Konvertierung anderer Inbox-Einträge. Keine Änderung an der Heute-Planungslogik oder an D1.

## Prüfstand

- **591/591** automatisierte Node-Tests bestanden (588 bisherige + 3 neue), darunter Tests für die Konvertierung, Metadaten, Invalid-Einträge und Inbox-Zeile.
- Worker-Syntaxprüfung erfolgreich.
- Vite-Produktionsbuild und Live-Browser-/PWA-Abnahme hier nicht durchgeführt (Node-Abhängigkeiten nicht installiert). Nach Deployment im echten Vault prüfen.
