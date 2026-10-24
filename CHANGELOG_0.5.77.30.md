# Compass 0.5.77.30 · Krafttraining in Aktivitäten

- Neue Sportkarte **Krafttraining** unter **Insights → Aktivitäten** für erfasste Garmin Strength/Weight-Training-Einheiten und manuelle Krafttrainingseinträge.
- Korrigiert: Strength Training wurde zuvor unter **Sonstige Aktivitäten** eingeordnet.
- FIT-Sportcode `19` bleibt für Garmin-FIT-Sessions **Paddeln**; nur historische CSV-Einträge mit derselben internen Nummer werden **Krafttraining** zugeordnet.
- Kachel erhält Dauer, Einheitenzahl, Trainingstage und einen eigenen auswählbaren Filter/Verlauf. Kein Fitness-Training wird doppelt gezählt.
- **Kumulativ seit .28:** Enthält alle Änderungen aus .29 (Total Sets/Reps und Zuordnung im Muskelmodul).
- CSV enthält keine Einzelübungen oder Gewichte. Für Muskelzuordnung Original-Aktivitäts-FIT importieren.
- Für den rein visuellen Kategorienfix ist kein Reimport erforderlich; nur zur nachträglichen Ergänzung der alten, nicht eingelesenen Satzsummen sollte die Activities-CSV einmal erneut importiert werden.
- Versionskennung 0.5.77.30 über bestehende Vite-Pipeline, keine Vault-Migration.
