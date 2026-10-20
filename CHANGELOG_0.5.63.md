# Compass 0.5.63 — Life Balance Radar mit Zeitspuren

**Basis:** Compass 0.5.62 FULL SOURCE. Keine neue D1-Migration, keine Änderung an der Vault-Verschlüsselung.

## Neue Funktion

- Premium-Radar in der heutigen Übersicht und unter **Insights → Life Balance Radar**.
- Acht Dimensionen: Schlaf, Aktivität, GTD-Klarheit, Finanzen, Kontakte, Körper, Erholung und Arbeitsbalance.
- Zeitraum umschaltbar zwischen 7 und 30 Tagen.
- **Zeitspuren:** aktuelle Periode in Türkis, unmittelbar vorherige Periode in Violett, vorvorherige Periode in Gold. Umschaltbar: *Aus* (nur aktuell), *2* (aktuell + vorher), *3* (alle drei). Bei 7 Tagen sind es aufeinanderfolgende 7-Tage-Fenster; bei 30 Tagen aufeinanderfolgende 30-Tage-Fenster.
- Transparente Überlagerung, gedämpfte historische gestrichelte Konturen, Farblegende mit Periodendaten. SVG-Tooltip an Messpunkten zeigt Zeitraum, Dimension, Wert und zugrunde liegende Daten.
- Nur tatsächlich vorhandene Messdaten. Fehlende Achsen bleiben offen; es gibt keine erfundenen Nullwerte oder Polygon-Interpolation über fehlende Punkte.
- Persönliche Referenzwerte für Schlafdauer, Schritte, Arbeitszeit und optional Gewicht; Ziele werden im bestehenden verschlüsselten lokalen Vault gespeichert. Dimensionen führen zur passenden Detailseite.

## Wichtige methodische Einschränkungen

- **Historische Konturen nur aus datierten Quellen:** Schlaf, Schritte/Aktivität, Body Battery, Arbeitszeiterfassung und Fitdays-Gewicht (sofern Zielwert gesetzt und Messung aktuell genug).
- GTD, Kontakte und Finanzprognose sind gegenwärtige Zustände bzw. Schätzungen; ohne echte historische Snapshots werden sie für zurückliegende Zeiträume **nicht rückwirkend errechnet**.
- Body Battery ist ein Garmin-Geräteindikator, keine Diagnose. Körperachse misst nur Nähe zum **freiwilligen Gewichtsziel**, keine Gesundheit. GTD misst lediglich organisatorische Hygiene. Finanzwerte sind Liquiditätsmodelle, keine Zusagen.
- 7- und 30-Tage-Fenster können wegen unterschiedlicher Quellenabdeckung verschieden viele gültige Messungen haben. Die Farblegende zeigt die vorhandene Abdeckung je Periode.
- Kein globaler Gesundheitsscore, keine automatische kausale Interpretation, keine Cloud-Verarbeitung durch das Radar.

## Prüfungen

- **632/632 automatisierte Node-Tests erfolgreich**, einschließlich Historienfenster, Lückenbehandlung, User-Controls und bestehender Regressionstests.
- JavaScript-Syntaxprüfungen und Cloudflare-Worker-Syntaxprüfung erfolgreich.
- **Offen:** Produktions-Vite-Kompilierung (`vite` war in der Ausführungsumgebung nicht installiert), reale Browser-/Mobile-Abnahme und Prüfung mit bestehenden Vault-Daten.

## Folgende Builds gemäß Roadmap

- 0.5.64: Relationship Radar / Menschen-Inspector mit Nähe-Gradient, Kontaktrhythmus und Pause/Play.
- 0.5.65: global erreichbares Feeling Wheel mit lokalem Gefühls-Check-in.
