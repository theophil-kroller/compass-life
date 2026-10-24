# Compass Life 0.5.77.53 · Finance Premium UX / Fast Overview / Sleep Chart-first

**Basis:** `main` GitHub-Commit `2a80b182659b27ce3ea4c6c50e42566c39301d53` — GitHub Actions Deploy #214 erfolgreich (Compass 0.5.77.52).

## Premium-Finanzüberblick (neu)

- Die Finanzseite „Überblick“ verwendet einen eigenen schlanken Renderpfad. Der bisherige umfangreiche `financeDashboardView` wird in dieser Ansicht **nicht** ausgeführt; die übrigen Finanz-Unterbereiche benutzen die bisherigen Ansichten unverändert.
- Oben: vier tatsächliche, auf bestätigten Daten beruhende Kennzahlen. Sichtbar: Einnahmen, Konsumausgaben, deskriptiver Geldfluss und ungeklärte Beträge.
- Direkt darunter: großformatige monatliche Einnahmen-/Ausgaben-Grafik, daneben die fünf größten bestätigten Ausgabenkategorien.
- Danach: bestehende dokumentierte Vermögensübersicht sowie direkte Links zu Buchungen, Prüfen, Portfolio und Visual Lab.
- Zeit- und Kontofilter nutzen die bestehenden IDs `finance-period` und `finance-account`, damit die bisherigen Formular-Handler funktionieren.
- Korrekte Transferbehandlung: Interne Eigenüberträge werden **nicht** als Einkommen oder Konsum verbucht. Ungeklärte Beträge erscheinen getrennt; Rückerstattungen gehen in den deskriptiven Geldfluss ein, nicht in reguläre Einnahmen.
- Monatliche Werte werden nur für tatsächlich vorhandene Buchungsmonate dargestellt; fehlende Importe werden nicht durch künstliche Nullwerte ersetzt.

## Performance

- Buchungsaggregation in einem einfachen linearen Durchlauf, ohne teure Sankey-/Forecast-/Exotik-Grafiken vor dem ersten sichtbaren Finanzüberblick zu berechnen.
- Isolierter lokaler Regressionstest mit 25.000 Transaktionen: rund 72–95 ms für die Aggregation, abhängig vom konkreten lokalen Lauf; Grenzwert im CI-Test 2.500 ms als Regressionsschutz.
- Dies misst **nicht** Initial-Bundle-Download, Vault-Entschlüsselung, Netzwerk, Browser-Layout oder das ganze Rendern; diese Aspekte müssen in einem späteren Performance-Audit gesondert gemessen werden.
- Kein externer Datenaufruf in der neuen Finanzübersicht; alle Daten kommen aus dem vorhandenen lokalen Zustand.

## Sleep Chart-first – zusätzliche Korrektur

- Wegen UX-Feedback: Die tatsächlichen Wochen-Schlafphasen und der Schlafdauer-Zeitverlauf erscheinen jetzt **vor** Wochen- und Monatsdurchschnitten sowie Erklärungstext.
- Box-/Dot-Plot der Schlafphasen-Verteilung wird sichtbar statt standardmäßig eingeklappt.
- Die bisherigen Schlafformeln, einzelne Messwerte, Detailnavigation, Zeiträume und Disclaimer bleiben erhalten.

## Sicherheit / Kompatibilität

- `Heute`, Inbox, Aufgaben, Kalender, Inspector, Tresor, Worker, D1 und Sync bleiben funktional unverändert.
- Keine Datenbank-Migration, kein Schreiben von Finanzdaten durch die neue Übersicht.
- Guarded Vite-Pretransform: `.53` wird nach `.52` angewendet; fehlende Anker brechen den Build ab statt still eine falsche Integration zu erzeugen.
- Ältere Testketten `.50`, `.51`, `.52` an den vollständigen Vite-Plugin-Pfad angepasst.

## Tests

- **24/24 lokal:** Tests für `.50`, `.51`, `.52` und `.53` bestanden, inklusive der neuen Performance-/Buchungs-/Sleep-Regressionen.
- Der lokale Test benutzt für zwei schwergewichtige, unverändert referenzierte Finance-Module kleine Test-Stubs; deshalb ist dies kein vollständiger Vite-Produktionsbuild.
- **Der GitHub Actions Workflow muss nach dem Upload separat `npm run check` und `npm run build` bestehen.**

## Weiterer Premium-UX-Fokus

- Nächster Fokus `.54`: Intelligence-Cockpit mit echten Diagrammen statt reinen Linkkarten.
- Längerfristige Performance-Baustellen: echtes Modul-Splitting, Lazy Loading tiefer Finanzdiagramme, Daten-Memoisierung mit sauberer Invalidierung, Messung echter Browser-Lade-/Interaktionszeiten.
