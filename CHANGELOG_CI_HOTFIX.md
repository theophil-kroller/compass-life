## CI Hotfix für Compass 0.5.76.1

- Gefühlswelt-Test unterstützt zusätzliche Berührungs-Schaltfläche und prüft weiterhin den Einbau des Gefühl-Views.
- Energieziel-Test vergleicht die UI-Versionsnummer mit package.json statt alte Versionen festzuschreiben.
- Ernährungs-UI-Test nutzt ebenfalls package.json für die aktuelle Versionsnummer.
- Keine Änderung am produktiven Quellcode.

Auslöser: 3 nicht mehr aktuelle Test-Assertions bei 795 Tests.
