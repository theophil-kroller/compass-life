# Compass 0.5.67 — Relationship Map Premium Redesign und Finanzradar-Diagnostik

Basis: **0.5.66**. Keine D1- oder Vault-Datenmigration.

## Beziehungslandkarte

- Vollbild-Fokusansicht mit eigener Kartenfläche und integrierter Kontakt-Seitenleiste; per Schließen / Esc verlassen.
- Responsiver SVG-Canvas mit ruhigem radialen Warm-Kalt-Verlauf und fünf ausdrücklich bezeichneten Nähe-Zonen: **90–100 Sehr nah**, **75–89 Nah**, **60–74 Vertraut**, **40–59 Locker**, **0–39 Peripher**.
- Eindeutige Beziehung Nähe/Radialdistanz; 90+ liegen im innersten roten Ring. Ein Verschieben ändert genau denselben Nähe-Wert wie der Inspector; Winkel und Nähe werden im bestehenden verschlüsselten People-Vault gespeichert.
- Deterministische, tangential entzerrte Markerpositionen. Namen werden vom Marker räumlich getrennt mit klaren, seitlich angeordneten Beschriftungen und feinen Führungslinien. Kein zufälliges Neuverteilen beim Wiederöffnen.
- Geschlecht im People Inspector weiterhin **freiwillig**: männlich, weiblich, divers, ohne Angabe. Entsprechende generische, stilisierte Symbole statt erfundener Privatfotos.
- Filter für Alle, Familie, Freunde, Arbeit, Partner:in, Kontaktimpulse und Projektbezüge.
- Auswahl durch Klick, Enter/Leertaste sowie Näheänderung über Pfeiltasten (Umschalt: 5 Punkte). Fokusansicht mit Esc und Tastaturfokus-Rückführung.
- Verknüpfte Projekte, Kontaktverlauf, Pause/Play und freiwillige Merkpunkte bleiben über den bekannten People Inspector bearbeitbar.
- Die Karte im regulären Menschen-Tab ist nicht mehr auf 620 Pixel begrenzt. In der Fokusansicht steht der Karte mehr Platz zur Verfügung; kleinere Bildschirme erhalten eine verschiebbare Kartenfläche.

## Life Balance Radar / Finanzen

- Historischer EUR-Cashflow greift auf bis zu **36 zurückliegende Kalendermonate** zu und verwendet die letzten zwölf vollständig paarbaren Monate.
- Bereits zwei geeignete abgeschlossene Monate mit tatsächlichen positiven und negativen Bankbewegungen erlauben einen **ausdrücklich vorläufigen** Cashflow-Indikator; drei und mehr Monate verbessern die Grundlage.
- Ausschluss bekannter Eigenüberträge und Kapitalverschiebungen bleibt erhalten; es wird **kein** aktueller Kontostand, Liquidität oder Solvenz behauptet.
- Wenn selbst diese Voraussetzungen nicht erfüllt sind, zeigt die Radar-Erklärung jetzt die Anzahl auswertbarer Buchungen, die Anzahl passender Monate, ausgeschlossene Eigen-/Kapitaltransfers und unlesbare bzw. ungeeignete Zeilen.
- Wegen der lokalen verschlüsselten Daten konnte die Anzeige mit deinem echten Vault hier nicht abschließend geprüft werden. Bei weiterhin fehlendem Finanzscore bitte die genaue Zeile unter „Warum fehlen Werte?“ melden.

## Prüfstand

- 667 automatisierte Node-Tests bestanden (einschließlich vier neuer Integration-/Geometrie-/Finanztests).
- JavaScript- und Worker-Syntax erfolgreich.
- **Noch nicht verifiziert:** produktiver Vite-Build, tatsächliche visuelle Darstellung sowie Browserabnahme mit deinen gespeicherten Kontakten und Bankbuchungen. Der Versuch einer Headless-Browseraufnahme hing in dieser Umgebung.
- Keine neue Server- oder D1-Migration und kein Zurücksetzen lokaler Daten erforderlich.
