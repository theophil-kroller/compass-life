# Compass Life 0.5.91.32 – Projekt-Action-Zuordnung

## Behebung
- Eine über **+** im Projekt angelegte Action wird immer dem angeklickten Projekt zugewiesen.
- Die Projektbindung ist sichtbar und beim Erstellen nicht durch einen alten Formularentwurf oder eine frühere Lehrveranstaltung veränderbar.
- Beim Speichern wird die Projekt-ID aus dem aktuellen Klickkontext validiert. Ein veralteter Kontext wird abgewiesen, statt stillschweigend dem falschen Projekt zugeordnet zu werden.
- Für globale Aufgaben in Heute/Next Actions bleibt die Projektauswahl möglich.
- Vorlagen-Aufgaben und Unteraufgaben behalten ihre gültige Hierarchie.
- Bereits früher falsch zugeordnete Aufgaben werden **nicht** automatisch verschoben; Compass kann ihren tatsächlichen Zielkontext rückwirkend nicht rekonstruieren.

Patch-Basis: 0.5.91.31. Weder GitHub-Workflow noch Coach-Datenmodell geändert.
