# Compass Web 0.5.77.59.40.23 — Ars Vivendi Insight Atlas

## Ziel
Ausbau des Premium-Jahresberichts um weitere vorhandene Compass-Datenmodelle; neue statische SVG-Druckvisualisierungen ersetzen keine interaktiven Dashboard-Funktionen.

## Neue Reportstrecken
- Schlafphasen: gemessene Tief-, REM- und Leichtschlafanteile für die letzten sieben vollständig dokumentierten Nächte.
- Garmin Body Battery: dokumentierte tägliche Hoch-/Tiefpunkte; keine Interpolation.
- Garmin Stress: vier Intensitätsbereiche auf Basis gültiger Messpunkte und explizit als Messpunktverteilung bezeichnet.
- Sport/Freizeit: Aktivitäten in Stunden nach Disziplin und monatlicher Verlauf. Garmin- und manuelle Aktivitäten werden soweit identifizierbar dedupliziert.
- Essen & Fasten: Ereignisse nach Uhrzeit und dokumentierte Pausen bei unmittelbar aufeinanderfolgenden Tagen; keine Behauptung lückenloser Fastenfenster.
- Vitamine/Mineralstoffe: bekannte Teilsummen und getrennte Messdatenabdeckung; Balken stellen ausschließlich Abdeckung dar, nicht vergleichbare Nährstoffmengen.
- Matcha: Catechine, Koffein und andere deklarierte Inhaltsstoffe aus vorhandenen Ernährungsmodellen; Hersteller-Mindestwert/Schätzung bleibt gekennzeichnet.

## Bestehende Kapitel
Detaillierte Anatomie, Finanzatlas, Beziehungen, Gefühle, Ortskarte, Daily Dozen, Schlaf-/HRV-Jahresverlauf etc. unverändert.

## Qualität
- Alle sechs neuen Atlasbereiche sind rein lokal und ohne externe Datenübermittlung.
- Keine Nullersetzung fehlender Messungen.
- Keine Auswertung privater Finanzen/Beziehungen/Gefühle/Orte ohne Freigabe.
- ZIP-Differenzprüfung gegen 0.5.77.59.40.22.
- Vollständige Node-Regressionssuite und Print-PDF-Layouttest dokumentieren.

## Offene Abnahmen
- Echte Vite/Build-Pipeline von GitHub Actions und Browser-/Drucktest auf Windows müssen bestätigt werden.
- Ein im Browser gerendertes Dashboard kann interaktive Spezialfunktionen enthalten; der Jahresbericht verwendet statische, druckbare Ableitungen desselben Datenmodells.
- Der Bericht ist weiterhin ein ausbaufähiges Premium-Produkt; der volle wissenschaftlich-redaktionelle Ausbau samt Faktenvalidierung der lokalen KI ist nicht abgeschlossen.
