# Compass 0.5.77.40 – CI- und Rendering-Reparatur

- CI-Blocker Workflow #200 repariert: Versionsbasis zwischen Root-Paket, Client-Paket und roher `main.js` erneut konsistent (`0.5.77.26`). Deployed UI wird weiterhin durch Vite auf `0.5.77.40` aktualisiert.
- Fehlenden Aufruf der dynamisch geladenen Anatomie-Komponente direkt nach dem DOM-Rendern ergänzt. Ohne ihn zeigte die Benutzeroberfläche nur den Ladeplatzhalter.
- Neuer Regressionstest für Versionskonsistenz und Initialisierung.
- Keine Änderungen an Trainingsdaten, Übungen, Muskel-Zuordnungen oder importierten FIT/CSV-Dateien.
