# Compass Life 0.5.84 — Lebensabschnitte, Beziehungen & geprüfter Import

**Basis:** GitHub main `346a25b5368da2de131194e93d6fbf65ff30c6d0` (0.5.83.1).

## Funktionen
- Die vorhandene Life-in-Weeks-Matrix bleibt unverändert. Beziehungen werden zusätzlich als schmale pinkfarbene Zeitbänder über die Lebenswochen gelegt; mehrere parallele Beziehungen sind möglich. Im Detailzoom werden die Zeitabschnitte mit Namen und Zeitangaben sichtbar.
- Neue Kategorien: Partnerschaft, Ausbildung/Studium, Berufsabschnitte und Ehrenamt. Eine Beziehung bzw. ein Abschnitt kann über `Ongoing` ohne Enddatum bis heute laufen.
- Im Ereignisformular lassen sich Person, Organisation und Datum mit Genauigkeitsangabe (taggenau/monatsgenau) setzen. Monatsgenaue LinkedIn-Angaben bleiben als solche gekennzeichnet.
- Sammelimport für `compass_life_events_v1`: reiner JSON-Text, Prüfung, einzelne Auswahl und erst danach verschlüsselte Übernahme. Quellenreferenzen erkennen Dubletten.
- PDF: Beziehungen und andere private Abschnitte sind standardmäßig ausgeblendet; die explizite Option »Private Beziehungen im PDF anzeigen« schließt diese auf Wunsch ein.

## Hinweise
- Kalender-Recherche zu historischen Reisen wurde **außerhalb** der App als vorgeschlagene JSON-Importdatei vorbereitet. Kein Google-Termin wird verändert; Einträge erfordern ausdrückliche Importbestätigung.
- Offen gebliebene nicht belegte Reisen wurden **nicht** mit erfundenen Zeitangaben eingetragen.
- Eine vollständige Vite-Produktionserstellung ist in dieser Umgebung ohne installierte Node-Abhängigkeiten nicht verifizierbar.
