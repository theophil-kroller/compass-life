# 0.5.45 – Smoke-Test nach Deployment

- Projekte: Bestehende Hierarchie, Symbole, Aufgabeneditor, Next Actions weiterhin sichtbar; neue Austauschfunktion eingeklappt.
- JSON exportieren; keine automatischen externen Requests. Datei enthält nur die ausgewählten Projekte und ihre offenen sowie erledigten, nicht archivierten Aufgaben.
- Dokument an ChatGPT geben und veränderte Datei importieren: Vorschau mit Zählung; keine Änderungen ohne explizite Auswahl. IDs nicht verändern, wenn bestehende Einträge bearbeitet werden sollen.
- Ohne Update-Checkbox bleiben vorhandene IDs unverändert; bei gesetzter Checkbox ändern sich nur ausgewählte Gruppen. Andere lokale Änderungen seit der Vorschau verhindern den Import.
- Kapazitätsforecast bei fehlendem/veraltetem Kalender: keine erfundenen Stunden, kein falscher Entwarnungshinweis.
- Hard-Deadline mit Aufwandsschätzung: Warnung wenn Aufwand die tatsächlich verfügbaren 14-Tage-Slots übersteigt. Soft-Planned wird nicht zur harten Frist.
- Stückzähler (z.B. Prüfungen): Restarbeit proportional zu noch offenen Stückzahlen. Schon auf Ziel stehende Aufgabe bleibt offen, bis Nutzer sie abschließt.
- Bei ausreichend freier Zeit keine permanente Warnkarte; Forecast und Heute bleiben kompakt.
- Mobile: Details klappbar, Importvorschau ohne horizontale Überläufe.
- Synchronisations-Konflikte bei zwei Geräten nach Bulk-Import bewusst prüfen.
