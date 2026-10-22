Compass 0.5.76.1 · kcal-Presets + Kontaktefilter

Basis: aktueller GitHub-Stand 0.5.76.1 (letzter erfolgreicher Deploy #154).
GitHub: entpacken und beide Dateien unter client/src/ ersetzen. Keine Skripte, keine Datenbankmigration.

Alle konkret benannten vordefinierten Speisen und Getränke haben eine Defaultportion und eine vorläufige kcal-Bandbreite; bisherige Einträge ohne Portionsangabe nutzen die Defaultportion. Die angezeigte Zahl "ohne Schätzung" kann für "Anderes", ältere eigene Lebensmittel oder nicht interpretierbare manuelle Mengen erhalten bleiben. Das ist absichtlich kein frei erfundener kcal-Wert.

Bei Berührung & Nähe werden im Dropdown nur Kontakte mit relationKind family/partner/friend angeboten. Kontakte mit fehlender Kategorie erscheinen erst nach Zuordnung unter Menschen. Historische bereits gespeicherte Einträge werden nicht gelöscht.

Die vorliegenden Änderungen wurden mit node --check geprüft, kein kompletter Produktionsbuild durchgeführt.
