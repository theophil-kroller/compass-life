# Compass 0.5.91.9 · Lehr- und Event-Vorbereitungsradar

Basis: Compass 0.5.91.8, GitHub `1d372841c643be7cd88e9c7f5d2ac69f528537d5`.

- **Kalendererkennung:** Jeder Titel mit eigenständigem Kürzel `kro` innerhalb einer Klammer zählt als eigene Unterrichtseinheit, auch mit weiteren Kürzeln `(kro, xy)`, `(xy/kro)`, `(xy; kro)`. Keine weitere Themenzuordnung erforderlich.
- **Zusätzliche Events:** Business Model Workshop und Final Pitch erhalten eigene Vorbereitungsart (Workshop bzw. Moderation), auch ohne `(kro)`.
- **Countdown:** In `Heute` und `Forecast`, standardmäßig 21 Tage Vorlauf für Unterricht/Workshop und 35 Tage für Final Pitch. Nur lokal vorhandene verschlüsselt gesicherte Google-Termine; keine zusätzliche API-Abfrage.
- **GTD-Projekt:** Ausschließlich auf ausdrücklichen Klick, mit vier editierbaren Vorbereitungsaufgaben, Deadline entsprechend dem Kalendereintrag und Quellverknüpfung. Bestehender Ordner `Lehre` wird wiederverwendet, sofern vorhanden.
- **Idempotenz:** Ein Termin erzeugt maximal ein aktives GTD-Projekt; vorhandene Verknüpfungen zeigen „Projekt öffnen“. Mehrfachkopien aus Kalendern werden bei gleichem Titel und Beginn zusammengeführt.
- **Später:** Drei Tage aufschieben; Entscheidung im bisherigen verschlüsselten Journal geräteübergreifend per Version-/Zeitstempel zusammengeführt.
- **Datenschutz und Performance:** Read-only Kalender, keine Schreibrechte oder Hintergrund-API, keine zweite Planungsdatenbank; kompakter Today-Bereich. Keine bereits gespeicherten Aufgaben verändert.
- **Grenzen:** Erinnerungen erscheinen beim Öffnen der App und nach Kalender-Synchronisation, keine externen Push-Mitteilungen. Termine außerhalb der synchronisierten Kalenderdaten können nicht erkannt werden.

## Qualitätsstand

- 10/10 neue Funktionstests bestanden, inklusive `(kro)` zusammen mit anderen Kürzeln, Kalenderspiegelungen und idempotenter Projektanlage.
- 33/33 Deployment-Tests bestanden; Importgraph, Worker-Syntax und Release-Brücke geprüft.
- Gesamtsuite: 1.945/1.980 bestanden; unverändert 35 historische Fehler.
- Echtes `vite build` lokal nicht ausführbar (`vite: not found`; Paketregistrierung aus dieser Umgebung nicht erreichbar). GitHub Actions muss den Produktionsbuild prüfen.
