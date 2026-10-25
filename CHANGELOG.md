# Compass 0.5.77.58.2 – Fehlerkorrektur

- Build #225: Fragile Receipt-Interpolation in `compass758-bridge.js` korrigiert.
- Receipt-Darstellung bleibt exklusiv im Tab „Statistik & Rechnungsimport“; auf der Checkliste wird sie nicht gerendert.
- Projekt-Inspector bleibt standardmäßig geschlossen (Verhalten aus .58.2 unverändert).
- Zusätzlicher Regressionstest mit `month:receiptMonth745` verhindert exakt diesen Fehler.
- Keine Änderung an Speichermodell, Daten, Vault oder anderen App-Funktionen.
