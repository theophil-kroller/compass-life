# Compass 0.5.67.2 – Financial Health & erklärbarer Life Balance Radar

**Basis:** Compass 0.5.67.1. **Keine neue D1-Migration**, keine Änderung oder Neuinitialisierung bestehender Vault-Daten.

## Änderungen

1. **Life Balance Radar nur unter Insights:** Das doppelte Radar-Widget aus der Planungs-/Startübersicht wurde entfernt. Alle acht Achsen bleiben unter **Insights → Life Balance Radar** erhalten.
2. **Erklärung rechts statt Seiten-Scrollen:** Radarachse, Datenpunkt oder Dimensions-Chip anklicken → rechts erscheint ein eigener Inspector mit Score, Zeitraum, Originalmesswerten, Datenbasis, Berechnungsregel und Datenqualitäts-Hinweisen. Die Detailnavigation bleibt als separate Aktion erhalten. Schließen mit `×`. Mobile Darstellung unterhalb der Grafik, ohne horizontale Überläufe. Innerhalb des Inspectors wird bei viel Text nur sein eigener Inhalt gescrollt.
3. **Finanzieller Gesundheitsindikator:** Eine eigene, nachvollziehbare Berechnung trennt laufende Einkommen und Konsumausgaben von bestätigten Eigenüberträgen, Sparen, Depot- und Kryptotransfers. Dadurch wird die Finanzachse nicht mehr durch Kapitalverschiebungen fälschlich auf 0 gedrückt.
4. **Cashflow / Reserve / Vermögen getrennt:** Cashflow-Teilscore aus bis zu zwölf geeigneten abgeschlossenen Monaten. Optional wird eine *heute* bestätigte Liquiditätsreserve als zweiter Indikator berücksichtigt. Die Vermögensentwicklung wird nur für vollständig vergleichbare Bewertungsstichtage angezeigt und **nicht** als Liquidität oder Rendite in den Score hineingerechnet.
5. **Transparente Finanzberechnung:** Im Inspector sichtbar: durchschnittliche Monats-Einnahmen und laufende Ausgaben, die verwendeten Monate, ausgenommene Transfers, ungeprüfte/unklare Buchungen sowie der Score-Rechenweg.
6. **Kontakte 0/4 → 100 korrigiert:** Die Beschriftung zeigt nun korrekt „4 von 4 im gewünschten Kontaktrhythmus · 0 Kontaktimpulse fällig“, sofern kein Impuls fällig ist. Die Kennzahl bewertet die Rhythmusabdeckung, **nicht** den Wert von Beziehungen.
7. **Richtwerte und weitere Dimensionen:** Erklärungen für Schlaf, Schritte/Aktivität, GTD, Körper, Erholung und Arbeitsbalance ergänzt; fehlende Datengrundlagen bleiben fehlend statt künstlich geschätzt.

## Methode, Interpretation und Grenzen

- **Cashflow-Score:** `clamp(60 + 100 × (Einnahmen − laufende Ausgaben) / Einnahmen, 0, 100)`; mindestens zwei abgeschlossene Monate mit Ein- und Ausgängen. Konservativ als vorläufig markiert bei geringer Datenabdeckung oder ungeprüften/unklaren Buchungen. Anders als die ältere steile Formel bedeutet ein moderates Defizit nicht automatisch Score 0.
- **Reserve-Score:** Nach *manuell bestätigtem* aktuellem EUR-Bankbestand (Stichtag = heute) `clamp(100 × Reservemonate / 6, 0, 100)`. Ohne bestätigten aktuellen Bestand **kein** Reserve-Score.
- **Kombination:** Bei beiden verfügbaren Signalen 80 % Cashflow + 20 % Reserve, ansonsten nur der Cashflow-Score. Vermögensentwicklung ist eine eigene beobachtete Information, kein Score-Beitrag.
- Der Score ist **keine Bonitätsbewertung, keine Vermögensbilanz und keine Gewähr für taggenaue Zahlungsfähigkeit**. Auch die aktuelle Bankhistorie kann mangelhafte Kategorisierungen enthalten. Bitte im neuen Inspector die ausgeschlossenen Transfers und ungeprüften Buchungen prüfen. Angaben werden nur lokal berechnet.
- Kein historischer Finanzscore wird nachträglich frei erfunden; die alten Zeitspuren von GTD, Kontakten und Finanzen bleiben ohne historisierte Messungen bewusst offen.

## Teststatus

- **676 / 676 automatisierte Node-Tests bestanden**, davon 4 neue Regressionstests zu Finanztransfers, Reservestichtagen, Kontaktinterpretation, rechtsseitiger Erklärung und Entfernung des Doppelwidgets.
- JavaScript-Syntaxprüfungen bestanden (Client, Radar, Finance-Evidence, Worker).
- **Vite-Produktionsbuild nicht geprüft:** `vite` ist in der Ausführungsumgebung nicht installiert. Kein Live-Browsertest und keine Abnahme mit verschlüsselten Nutzerdaten durchgeführt.
