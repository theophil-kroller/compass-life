# Compass .40.25.21 · Dynamische Körperwerte, Schlaf, Kraftsport

Basis: GitHub Actions #332 (`46594697e413a285b09b4570f9a8f64b399b20e1`), bestehende Produktionsdateien nicht durch alte Versionen ersetzen.

- Fitdays je Messung: BMI aus Gewicht/184 cm (falls BMI fehlt), fettfreie Masse aus Gewicht und Körperfett, BMR nach Katch–McArdle (370 + 21,6 × fettfreie kg), BIA-Arm-/Bein-Muskelindex als gekennzeichnete Näherung. Gerätemesswerte haben Vorrang.
- WHR dynamisch nur aus je Messung importierter Fitdays-WHR oder importierten Taillen-/Hüftumfängen; keine frei erfundene WHR aus BMI.
- Keine persistierte Berechnung, Anzeige wird beim nächsten Import neu berechnet.
- Schlaf: Diagramme und Kennzahlen zuerst; Einordnung/Datenqualität unten als aufklappbarer Bereich.
- Aktivitäten: Kraftsport separat; Garmin CSV `sport 19` wird nur für CSV als Kraftsport erkannt, FIT `sport 19` bleibt Paddeln.
- Alle Bestandsdaten und bestehende Journale unangetastet; kein Tresor- oder Cloud-Schema geändert.

## Grenzen

Garmin Aktivitätskalorien sind nicht Ruhekalorien. Ein Garmin-RMR-Import wird durch diesen Patch nicht vorgetäuscht. Fitdays-Exporte müssen entweder WHR, Taille+Hüfte oder keine WHR liefern. Segmentalwerte sind keine validierte klinische ASMI-Messung.
