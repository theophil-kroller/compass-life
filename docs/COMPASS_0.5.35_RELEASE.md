# Compass 0.5.35 — UX-Konsolidierung

## Datenquellen

Die bisherige sechsteilige Zahlenreihe wird zugunsten von drei kompakten Statuskarten und einer eindeutigen Dateiimport-Aktion ersetzt. Seltene Exportanleitungen, Löschfunktionen und Altimport-Hinweise stehen in Details. Health Connect hat einen getrennten Bereich mit Aktualisieren und aufgeklappten Geräte-/Widget-Rechten; die bereits vorhandenen Aktionen werden nicht entfernt. Der Hinweis zur unverschlüsselten Health-Connect-Cloudübertragung bleibt erhalten.

## Personen, Ordner, Inspector

Der Menschenbereich belegt im Desktop die Spalten im Verhältnis 1:2. Neue Kontakte sind über einen aufgeklappten Hinzufügen-Bereich möglich. Ordner bekommen optionale, serverseitig auf Whitelist geprüfte SVG-Icons; Migration 0015 persistiert `planning_projects.folder_icon`. Der Task-Inspector benutzt zurückhaltende Grauflächen für Datumsgruppen bei weißen nativen `type=date`-Feldern und deutschen Sprachhinweisen. Native Browser-Lokalisierung beeinflusst die sichtbare Datumsdarstellung weiterhin.

## Betrieb

**Migration 0015 vor Worker-Update**, dann Client. 388/388 Tests. Die produktive Vite-Kompilierung und visuelle Liveprüfung fehlen in dieser Laufzeit.
