# 0.5.77.56 – GTD Workspace Redesign

Entwicklungsziel: Things-artige Ruhe mit OmniFocus-artigem Inspector und unveränderter GTD-Tiefe.

**Umgesetzt**
- Today neu geordnet: Aufgaben dominant, Quick Capture und Termine sichtbar, Zusatzplanung zusammengefaltet.
- Empfehlungen: Berechnung ausschließlich auf explizite Benutzeraktion, danach statisches Ergebnis bis zur manuellen Neuberechnung.
- Fokusmodus: kompaktes Zielscheiben-Symbol (Focus grün, Extended grau).
- Erfassung von Gefühlen und Ernährung auch im Focus-Modus ohne Insights-Aufruf.
- Bestehende Inspector-Teilaktualisierung und Task-Checkbox-Logik bleiben erhalten.
- Angepasste Testkette für bestehenden Vite-Bridge-Mechanismus.

**Sicherheit und Daten**: keine Änderungen an Tresor-Schlüsseln, PBKDF2, D1, Cloud-Sync oder bestehenden Datensätzen.

**Status**: 45/45 lokale Tests bestanden. GitHub Actions Build noch nicht bestätigt.

**Architekturgrenze**: Der große gemeinsame `main.js`-Startcode ist noch nicht in separate produktive Module überführt. Dieser Build optimiert den Heute-Renderpfad, nicht die vollständige Vault-Entschlüsselung. Weitere Verbesserungen müssen sich an neuen Messwerten orientieren und dürfen kein neues Feature-Wachstum auslösen.
