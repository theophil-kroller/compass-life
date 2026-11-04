# Compass Life 0.5.91.19 – WHR: Smart-Tape-/Waagenbrücke & Referenzeinordnung

**Basis:** `theophil-kroller/compass-life`, `main`, Version `0.5.91.18`, Commit `c3bdb69695c1a82d52539390a59d542d75908e44` (04.11.2026).

## Problem und Ursachen

Die **alte** Fitdays-Anzeige unter `Insights → Körper → Weitere Kennzahlen → Waist-to-hip ratio · WHR` verwendete ausschließlich `healthImports.fitdays[].whr/waistCm/hipCm`. Der neue Fitdays+-Smart-Tape-Import aus Version 0.5.91.18 speichert dagegen tatsächlich gemessene Umfänge verschlüsselt in `nutritionJournal.bodyMeasures88`. Daher konnte der Smart-Tape-Bereich die WHR anzeigen, während die ältere Fitdays-Karte trotz importierter Umfänge `–` zeigte. Zusätzlich gilt: Eine lediglich im Chat hochgeladene Fitdays+-Datei wird *nicht* automatisch in den persönlichen Compass-Tresor importiert.

## Korrektur

- Im bestehenden Körper-Insights-Rendering wird die Smart-Tape-Messreihe aus `bodyMeasurementDashboardModel(state).waistHip` direkt als read-only Eingabe an `fitdaysInterpretationView` übergeben. **Kein zweiter Speicher; kein Überschreiben oder Vermischen von Fitdays-Waagenmessungen.**
- Die alte Kennzahlenkarte und die aufklappbare WHR-Gauge zeigen den **zuletzt tatsächlich verfügbaren** WHR-Wert aus Smart Tape oder Waage. Bei einem gleich datierten Wert werden die direkt gemessenen Smart-Tape-Umfänge gegenüber der Waagen-Schätzung bevorzugt. Das Datum und die Herkunft werden explizit angegeben. Ohne Waagendaten kann ein vorhandener Tape-Wert trotzdem angezeigt werden.
- Die Tape-WHR wird aus tatsächlich paarigen Messungen **am selben Zeitstempel**, aus **derselben Quelle und Methode**, errechnet. Als fragwürdig markierte Messwerte werden nicht für eine WHR verwendet. Übernommene Originalmessungen bleiben unverändert.
- Die detaillierte Karte zeigt `Taille ÷ Hüfte`, Ursprung und letzte Messung, sowie nur bei mindestens zwei Messungen **derselben Quelle** einen Verlauf. Kein künstlicher Trend aus einer anderen Messmethode.
- Gesundheitsbezogene Referenz: WHO/NLM-Orientierungswerte für Erwachsene (Männer 0,90; Frauen 0,85). Wenn in den freiwilligen Energie-Einstellungen der Formelfaktor (`formulaSex`) konfiguriert ist, erscheint die passende Referenzeinordnung. **Ohne Angabe** werden beide Referenzgrenzen genannt; es erfolgt keine heimliche Annahme. Werte darüber sind **Risikomarker, keine Diagnose und kein V-Taper-Ästhetikziel**. Die Referenz für Männer ≧0,90 ist ein Hinweis auf potenziell erhöhte zentrale Fettverteilung, nicht allein ein Krankheitsnachweis.
- Die reale Messdatei und konkrete persönliche Umfänge werden **nicht in den Quellarchiven gespeichert**. Ausschließlich synthetische Testmessungen sind enthalten.
- Es werden keine Änderungen an Coach-Progression, Garmin-Importen, verschlüsselten Journaldaten oder Cloud-Schema vorgenommen.

## Installation und Tests

1. Patch nur auf Stand 0.5.91.18 anwenden; Quellpfade relativ zur Repository-Wurzel nach GitHub hochladen. Alternativ Full-Source-ZIP vollständig verwenden.
2. In Compass einmalig im Health Import Hub den Fitdays+-Smart-Tape-Export auswählen und **Import bestätigen**, falls noch nicht erfolgt. Ein Upload hier im Chat speichert keine Daten in Compass.
3. Insights → Körper öffnen, Zeitraum mit Messdatum wählen und Kennzahl unter „Weitere Kennzahlen“ prüfen. Der aus dem tatsächlich importierten Tape-Datensatz berechnete Wert samt Referenzhinweis sollte erscheinen, wenn der zugrunde liegende Messwert bereits im Tresor ist.
4. `node --test tests/compass-059119-whr-smarttape-bridge.test.mjs tests/compass-059118-fitdays-plus-smart-tape.test.mjs tests/compass-40-25-17-fitdays-interpretation.test.mjs`: 21/21 erfolgreich.
5. `npm run check:deploy`: 33/33 bestanden (Release-Tests und Importgraph).
6. **Keine lokale Vite-Produktion-Kompilierung** möglich: npm-Abhängigkeiten einschließlich Vite fehlen; GitHub Actions nach Upload prüfen.

**Quellen der Referenzeinordnung:** WHO Expert Consultation on Waist Circumference and Waist-Hip Ratio (2008, veröffentlicht 2011); NLM MeSH „Waist-Hip Ratio“; NICE NG246, Waist-to-Height-Ratio als ergänzende, hier nicht implementierte Messgröße.
