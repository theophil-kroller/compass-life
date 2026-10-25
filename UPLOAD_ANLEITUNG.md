# Compass 0.5.77.59.24 — Coach History Intelligence

## Worum geht es?

Die im geführten Coach-Player bestätigten Sätze werden bereits im **verschlüsselten lokalen Vault** unter `strengthGuidedSessions` gespeichert. Die alte Planungslogik hat diese Daten bisher nicht für die muskuläre Belastung genutzt, sondern nur zugeordnete Garmin-Sätze aus `strengthPeriod`.

**Neu:** Beide Quellen werden für die 28-Tage-Trainingsplanung zusammengeführt. Bereits eine aktuelle Coach-only-Einheit verändert die Trainingsvorschläge und Regenerationshinweise. Nicht zugeordnete Garmin-Sätze bleiben als unbekannte Daten erkennbar; es werden keine Trainingsleistungen geschätzt.

### Doppelte Workouts vermeiden

Wenn Garmin später eine zeitlich passende Einheit liefert (maximal 120 Minuten Abweichung), werden als identisch belegbare Sätze nach Übung, Wiederholungen und ggf. Gewicht genau einmal berücksichtigt. Unklare Abweichungen werden **nicht** automatisch zusammengelegt. Dabei können bei unvollständigen FIT-Daten weiterhin nicht auflösbare Überlappungen auftreten.

Wichtig: Der Garmin/FIT-Import und das bestehende Speicherungssystem werden **nicht verändert**. Die neu erfassten Coach-Sätze werden ausschließlich über die bereits vorhandene, verschlüsselte `strengthGuidedSessions`-Struktur gelesen. Es werden weder neue Datenbanktabellen noch Migrationsschritte benötigt.

### Noch offen: vollständige Übungsfoto-Bibliothek

Die geplante Ersetzung sämtlicher Strichfiguren durch echte, fachlich korrekt geprüfte Start- und Endfotos ist in diesem Patch **nicht** enthalten. Eine im Test entstandene Zeichnungsserie war nicht zuverlässig genug. Die bestehenden sieben Premium-Fotosequenzen bleiben erhalten, die übrigen alten Illustrationen bleiben vorerst unverändert. Es wurden bewusst keine privaten Portraits in das öffentliche Repository übernommen.

## GitHub Web-Upload

Bitte ZIP entpacken und diese **zwei Dateien** in GitHub hochladen:

1. `client/src/strength-coach-v5775910.js` — bestehende Datei ersetzen.
2. `tests/compass-05775924-coach-history.test.mjs` — neu hinzufügen.

Alle übrigen Dateien auf GitHub bleiben unverändert. Kein Eingriff in `vite.config.js`, `main.js`, Vault-Code, Garmin-Import, Wim-Hof, Makko-Ho oder den Ars-Vivendi-Lockscreen.

## Qualitätssicherung

30/30 gezielte Tests lokal grün: bisherige Workout- und Player-Verträge + acht neue Fälle (Coach-only, abgebrochene Einheiten, Garmin-Überschneidungen, StrongLifts A/B). Der vollständige GitHub-Actions-Lauf muss nach Upload separat erfolgreich durchlaufen.
