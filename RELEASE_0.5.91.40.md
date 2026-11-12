# Compass Life 0.5.91.40 · Smart Tape Workout-Kontext

Baseline: Compass Life 0.5.91.39 Full Source (lokal geliefert, nicht GitHub main). Kein Repository-Write.

- Insights > Körper > Smart Tape: Pro Messzeitpunkt ein Häkchen „Nach Workout gemessen“.
- Speichert nur den freiwilligen Kontext in `nutritionJournal.bodyMeasureContexts140` (verschlüsselter Vault), getrennt von den Messwerten, per ID synchronisiert.
- Zugeordnete, dokumentierte Coach-/Garmin-Sätze vor dem Messzeitpunkt (maximal vier Stunden) werden qualitativ auf betroffene Umfangsbereiche abgebildet. Keine physiologische Pump-Berechnung.
- Zeiten nach der Messung werden ausgeschlossen; Sätze ohne verlässliche Zeit sind nicht beweisend.
- Markierung erscheint in der Messhistorie, Liniengrafik und als Hinweis am letzten Messwert.
- Keine erfundenen oder korrigierten Umfänge, keine automatische Anpassung des Trainingsplans.
