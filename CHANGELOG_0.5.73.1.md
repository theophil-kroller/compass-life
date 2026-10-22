# Compass Life 0.5.73.1 – Hotfix: Habits geräteübergreifend abgleichen

Basis: Compass 0.5.73. Ein gezielter Sync-Fix; **keine neue Kalender-Cloud-Synchronisation in diesem Hotfix**.

- Die Habits (`habitsQuick.items` und `habitsQuick.completions`) werden in das vorhandene Ende-zu-Ende-verschlüsselte private Journal aufgenommen.
- Abhaken am Handy wird nach Cloud-Abgleich am Desktop sichtbar und umgekehrt, sofern die beiden Geräte mit demselben Account und demselben Geräteabgleich-Schlüssel verbunden sind.
- Rücknahmen bleiben als `done:false` mit Bearbeitungszeitpunkt gespeichert, statt den Eintrag einfach zu löschen; das verhindert Wiedererscheinen durch einen veralteten Gerätestand.
- Unabhängige Offline-Einträge werden nach Habit-ID und lokalem Datum zusammengeführt; Zeitstempel entscheiden bei widersprüchlichen Änderungen desselben Tages.
- Gewohnheiten und benutzerdefinierte Habit-Namen werden als Mengen zusammengeführt.
- Der Status des privaten Journal-Abgleichs erscheint nun auch auf der Habits-Insights-Seite, inklusive manuellem Sync-Button und Einrichtungshinweis.
- Historische Miracle-Morning-Checkmarks werden nur angelegt, falls noch kein expliziter Eintrag für diesen Tag besteht; ein absichtliches Entfernen bleibt erhalten.
- Keine Datenbankmigration, kein Worker-Update.

## Wichtige Voraussetzungen

1. Auf **beiden Geräten** auf 0.5.73.1 aktualisieren. Ältere Clients kennen das Habits-Feld in Cloud-Journal noch nicht und können es in einer Race-Bedingung wieder verwerfen.
2. Derselbe Compass-Benutzer und derselbe **verschlüsselte Geräteabgleich-Schlüssel** auf Handy und Desktop.
3. Zum Synchronisieren online und auf beiden Geräten mit aktivem Compass-Cloud-Login. Gesperrt vorgemerkte Habit-Häkchen werden erst nach Entsperren des betreffenden Gerätes in die lokale Datenbank übernommen und anschließend synchronisiert.
4. Vor dem Update optional auf beiden Geräten ein verschlüsseltes Tresor-Backup exportieren; die lokalen vorhandenen Habits werden nicht gelöscht.

Die geplante Kalenderhistorie, zukünftige Termine und deren geräteübergreifender Abgleich gehören zum separaten 0.5.74-Arbeitspaket; diese Funktion ist in 0.5.73.1 nicht enthalten.
