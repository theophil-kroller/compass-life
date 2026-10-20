# Compass 0.5.65 — Feeling Wheel & Life Balance Radar Data Integration

Basis: Compass 0.5.64. **Keine D1-Migration.**

## Feeling Wheel
- Globales, überall erreichbares Emotionsrad-Symbol in der oberen Navigation.
- Sechs Hauptemotionen mit Emojis und Kurzbeschreibung bei Hover/Fokus; mehrere Emotionen pro Check-in.
- Individuelle Intensität (1–10) mit fünf passenden beschreibenden Wörtern je Emotion; optionale Notiz.
- Mehrere lokale Check-ins pro Tag; persönliche Verlaufsauswertung unter Insights → Gefühle (7/30/90 Tage) und kurzer Rückblick im Weekly Review.
- Lokal verschlüsselte Speicherung im Vault; keine automatische externe KI-Auswertung, keine Gamification oder Negativpunkte für Gefühle.
- Overlay statt Seitenwechsel; Tastaturbedienung/Fokussteuerung, responsive Darstellung und Wiedereinstieg nach Rendern.

## Life Balance Radar: Datenlücken verbessert
- **Fitdays-Körperwerte**: Angezeigter Körperfettanteil und Gewicht aus der neuesten Messung, selbst wenn kein persönliches Ziel hinterlegt ist. Ein 0–100-Zielnähe-Score wird nur bei ausdrücklich gesetztem Körperfett- oder Gewichtsziel berechnet; der neue `bodyFatTargetPct`-Richtwert ist optional. Schätzungen einer BIA-Waage sind keine medizinische Diagnose.
- **Finanzen**: Bei mindestens drei Monaten mit auswertbaren Einnahmen und Ausgaben zeigt die Achse eine transparent definierte *historische Cashflow-Deckung*: 50 Punkte bei Ausgleich, 100 bei mindestens 20 % Überschuss, 0 bei mindestens 20 % Defizit. Der Score ist **keine** Aussage zu Vermögen oder aktueller Zahlungsfähigkeit. Für eine belastbare heutige Liquiditätsprognose bleibt der manuell bestätigte Anfangsbestand nötig; Sonderzahlungs-/Gehaltsspitzen werden nicht pauschal auf alle Monate verteilt.
- **Menschen**: Kontakte nutzen den Relationship Radar 0.5.64 (`contactCadenceDays`, Pause/Play, dokumentierte Kontakte); pausierte Kontakte werden nicht als überfällig gewertet. Kein Nähe- oder Beziehungsqualitäts-Ranking.
- **Aktivität**: Falls vorhanden wird der Health-Connect-Trainingsminuten-Mittelwert ergänzend in den Details angezeigt, aber ausdrücklich nicht mit offiziellen Garmin-Intensitätsminuten gleichgesetzt oder zusätzlich in den Schritt-Score eingerechnet.
- Historische Overlays zeigen unverändert nur echte historische Messungen. Es werden keine vergangenen Finanz-, GTD- oder Kontaktscores erfunden.

## Prüfstand
- **651/651 automatisierte Node-Tests erfolgreich**, einschließlich Datenintegrations-/Regressionstests für Körperfett, Cashflow und Kontaktpausen.
- JavaScript- und Worker-Syntaxprüfungen erfolgreich.
- Vite-Produktionskompilierung in der Arbeitsumgebung nicht ausführbar (`vite: not found`), daher muss die CI-Produktion nach Deployment geprüft werden.
- Kein visueller Live-Browsertest mit echten Vault-, Fitdays- oder Bankdaten möglich.

## Sicherheit
- Keine neuen Cloud-Schnittstellen, keine automatische Veröffentlichung persönlicher Daten.
- Kein Vault-Reset, keine D1-Migration, kein automatischer Eingriff in Bank- oder Gesundheitsdaten.
