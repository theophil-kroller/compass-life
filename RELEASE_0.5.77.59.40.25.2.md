# Compass 0.5.77.59.40.25.2 – Personal Patterns Print Atlas

Basis: .40.25.1 Solar Cover Deploy Fix.

Neues Reportkapitel **Was ist bei mir üblich?** unmittelbar nach dem Einnahmen-/Ausgaben-Jahresvergleich. Druckfähige, großformatige Ausgabenkorridor-Grafiken in einer 2-Spalten-Anordnung auf separaten A4-Seiten. Die Berechnungen verwenden exakt `financeCategorySeries()` aus Compass: Referenzmonate, Mittelwert, 20.–80. Perzentil, laufender Monatswert, gegebenenfalls vorsichtige Monatsprognose, und Trend. Kategorie-Auswahl aus echten Buchungen, keine künstlichen Kategorien.

Die Seiten erscheinen nur bei explizitem `settings.finance === true`. Interne Transfers, ungeklärte Buchungen und Investitionskäufe werden nicht in Konsumausgaben eingerechnet. Historische Referenz ist stets am Enddatum des ausgewählten Reports verankert – nicht am heutigen Browserdatum.

Abnahme: `npm test` und `npm run check` sowie HTML/PDF mit synthetischen Daten. Druckprüfung im echten Windows-Browser nach Upload ausstehend.
