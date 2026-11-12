# Compass Life 0.5.91.44 · V-Taper Nutrition Coach

Baseline: Compass Life **0.5.91.43** Full Source (`Compass_Life_0.5.91.43_OVERLAY_UPPER_BODY_COACH_FULL_SOURCE.zip`). Keine Änderung am verschlüsselten persönlichen Tresor; kein GitHub-Schreibzugriff ausgeführt.

## Neues Ernährungsfenster innerhalb von Insights → Körper

- **Am Ende des V-Taper-Dashboards vor dem bisherigen Body-/Fitdays-Detailbereich**: Navy-Gold-Sektion „Unterstützt deine Ernährung den V-Taper?“.
- 4 Kennzahlen: Ø erfasste Energieaufnahme (kcal/Tag), Ø geschätztes Energiedefizit (kcal/Tag), Ø erfasstes Protein (g/Tag) und robuster Gewichtstrend (kg/Woche).
- Umschaltbare Auswertung über **7, 14 und 42 Tage**; die 42-Tage-Ansicht verwendet den Start des aktiven Krafttrainingsblocks, sofern dieser höchstens 41 Tage zurückliegt. Die übrigen Ansichten sind rollierend; Standard ist **14 Tage**.
- Die Werte stammen aus dem vorhandenen verschlüsselten Ernährungstagebuch (`nutritionTrendsIndex`), der Fitdays-Gewichtshistorie und der bisherigen individuellen Energiebedarfsberechnung. Die optionalen Garmin-Nettoaktivitätsanpassungen relativ zum üblichen Trainingsniveau werden nur verwendet, wenn der bestehende Energieziel-Modus aktiviert ist und dessen Aktivitätsdaten ausreichend sind.
- Bekanntes bzw. geschätztes kcal und Protein werden als *quantifizierbar* berücksichtigt. Ein fehlender Vitaminwert macht eine Kalorienbilanz **nicht** unvollständig. Fehlende kcal-/Proteinwerte eines Eintrags werden separat ausgewiesen, nicht als null behandelt. Auch ein quantifizierter Tag ist nicht zwangsläufig ein nachweislich vollständig protokollierter Tag.
- Bewusst **keine Tageswarnung** bei einmaligem Überschreiten eines Ziels, kein „Straftraining“ und keine Kompensation. Coaching-Aussagen beruhen auf mindestens mehreren Tagen sowie einem robusten, wiederholten Gewichtstrend.
- Proteinorientierung etwa 1,6–2,0 g/kg Körpergewicht bzw. bestehendes individuelles Protein-Ziel. Bei über mehrere Tage niedrigem Proteindurchschnitt ein konkreter, vegetarischer Lebensmittelvorschlag mit berechneten kcal und Protein direkt aus dem vorhandenen Produktkatalog. Vorschläge buchen **nichts** automatisch.
- Native aufklappbare Tagesansichten mit Balken für kcal und Protein, Angaben zur Zahl quantifizierter Tage und erläuterter Rechengrundlage. Kein neues Journal, keine Speicherung abgeleiteter Diagnosen.

## Grenzen und Transparenz

- Kalorienaufnahme ist aus Lebensmittel-/Portionsangaben geschätzt, keine kalorimetrische Messung.
- Das Tagesdefizit wird nur angezeigt, wenn das bestehende Modell für Gesamtenergieverbrauch (`personalEnergyEstimate`) aus Fitdays und Konfiguration einen Wert ermitteln kann; sonst bleibt es `–`.
- Der Gewichtstrend basiert auf mindestens fünf bzw. sieben über mehrere Tage verteilten Messungen und einem robusten Median der paarweisen Trends, nicht auf einer einzelnen morgendlichen Wägung.
- Keine automatische Anpassung von Kalorienziel oder Trainingssätzen in diesem Release. Die Ernährungsanalyse liefert transparente Orientierung für spätere echte adaptive 6-Wochen-Entscheidungen.

## Prüfung

- Neue gezielte Funktionstests + bisherige Dashboard-/Overlay-Tests: **20 bestanden**.
- `npm run check:deploy`: **33/33 bestanden**.
- `npm test`: **2.240 bestanden / 66 fehlgeschlagen**. Namen der 66 Altfehler sind identisch mit der 0.5.91.43-Baseline; keine neuen Testfehler.
- `npm run build`: **nicht lokal ausführbar** (`vite: not found`, Dependency in dieser Laufzeit nicht installiert). Bitte erfolgreiche GitHub-Actions-Produktionskompilierung vor dem Einsatz prüfen.
- ZIP-Inhalts- und CRC-Prüfungen vor Übergabe durchgeführt.

## Installation

**Patch nur über 0.5.91.43** in Repository-Root entpacken und alle Unterordner beibehalten. Bei einer anderen Version den Full Source verwenden. Weder Patch noch Full Source enthalten persönliche Tresor-/Ernährungsdaten.
