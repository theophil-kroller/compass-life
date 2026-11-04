## 0.5.91.21 (2026-11-04)
- Fitdays+ Smart-Tape-Ansicht auf eine Silhouette und einen ausgewählten Trend reduziert; Kennzahlen optional.
- Confirmed-Set-Tageszuordnung in Coach-Historie, Muskelkarte und Regenerationsauswertung korrigiert (Workout kann mehrere Kalendertage umfassen).
- Keine Datenmigration, GitHub-Pages-Hotfix 0.5.91.20.1 bleibt erhalten.

## 0.5.91.20 · WHR-Referenzskala, anthropometrische Ratios und proportionale Körperfigur (04.11.2026)

- WHR-Referenzgrafik direkt unter „Weitere Kennzahlen“, mit sichtbarem Wertmarker und expliziten weiblichen/männlichen Orientierungsgrenzen statt bloßem Text.
- Dynamische Smart-Tape-Körpersilhouette aus zusammengehörenden Messungen: echte Umfänge plus offen dokumentierte Annahmen für Frontalbreiten, anklickbare Regionen und vorhandene rechte Verlaufsansicht.
- Neue Messkennzahlen: WHtR (NICE), Schulter/Taille, Brust/Taille, Schulter/Hüfte, BMI bei dokumentierter Größe/Gewicht, Seitenunterschiede. Keine fingierten „V-Taper-Idealwerte“.
- Hardcodierte Körpergröße von 184 cm aus Insights entfernt; jetzt nur aus persönlichen Einstellungen, damit kein falscher „Maßstab“ entsteht.
- Keine automatische Veränderung der Coach-Progression. Details in `RELEASE_0.5.91.20.md`.

## 0.5.91.19 · WHR-Referenz & Smart-Tape-/Fitdays-Kennzahlenbrücke (04.11.2026)

- Fehlendes `Waist-to-hip ratio · WHR` unter Insights → Körper behoben: alte Fitdays-„Other indicators“ lesen nun auch im Tresor bestätigte, paarige Fitdays+-Smart-Tape-Umfänge. Priorität nach tatsächlichem Messdatum; gleiche Zeitquelle und Methode, keine Vermischung von historischen Waagen-Schätzwerten.
- Angezeigt werden Verhältnis (3 Nachkommastellen), Messdatum, Quelle, Umfangsrechnung, ggf. Verlauf und WHO/NLM-Orientierung für Männer 0,90 / Frauen 0,85. Referenzeinordnung keine Diagnose und kein unmittelbarer Muskelzuwachsbeweis.
- Auch ohne Waagendatensätze wird vorhandener Tape-WHR-Wert angezeigt. Nur im Chat hochgeladene CSVs bleiben aus Datenschutzgründen ausdrücklich **nicht** automatisch in der App gespeichert.
- 21 gezielte Tests bestanden, 33/33 Deployment-Checks. Keine Datenmigration, unveränderte Coach-Progression und bestehende historische Daten. Source ZIP; GitHub Actions muss echten Produktionsbuild bestätigen.
- Details: `RELEASE_0.5.91.19.md`, `PATCH_INSTALL_0.5.91.19.md`.

## 0.5.91.18 · Fitdays+ Smart Tape Live-Import & interaktive Körperübersicht (04.11.2026)

- Echten Fitdays+-Umfangsexport verifiziert: `.csv`-Dateiname ist intern ein Excel-XLS/BIFF-Container, mit zwölf Umfangsspalten und lokalem Zeitstempel. Der Health Import Hub erkennt und importiert die Inhalte statt sie fälschlich als reinen CSV-Text zu lesen.
- Alle Messstellen über den bestehenden verschlüsselten `nutritionJournal.bodyMeasures88`-Speicher, kein Doppelimport und keine neue Datenbank. Bestehende Fitdays-Waagen- und Garmin-Importe bleiben kompatibel.
- **Insights → Körper:** anklickbare Körperkarte links, Detailverlauf rechts (mobil darunter) mit echten Messpunkten, Umfängen, Änderung gegenüber vorheriger Messung und Baseline-Vergleich. Bei erstem Messwert keine erfundene Wachstumsbehauptung. Schulter/Taille und Taille/Hüfte aus echten Messwerten.
- Private Nutzermessungen werden nicht in die Quellarchive aufgenommen; zum Befüllen der App den Fitdays+-Export selbst im Health Import Hub importieren. Kein automatisches Verstellen von Coach-Trainingslasten.
- Gezielte Tests 24/24; Deployment-Prüfungen 33/33. Historische Vollsuite in dieser Umgebung nach 120 Sekunden unterbrochen; kein vollständiges Testergebnis behauptet. Vite-Produktionsbuild erfordert GitHub Actions.
- Installationsanleitung und Details: `PATCH_INSTALL_0.5.91.18.md`, `RELEASE_0.5.91.18.md`.

## 0.5.91.17 · Makko-Ho-Tagesstatus, Arbeitszeit-Nachtrag & zwei neue Gerichte (04.11.2026)

- Makko-Ho/Habit-Schnellansicht: vormals datumslose 'doneToday'-Caches sind nicht mehr tagesübergreifend gültig. Nur heutige, datierte Häkchen zählen; Abschluss bestätigt den richtigen Tag statt einen bereits erledigten Habit erneut umzuschalten.
- Arbeitszeit-Schnellerfassung: Aufklappbarer Formularbereich 'Vergessen einzustempeln?' (Datum + Startuhrzeit + optionales Ende). Start ohne Ende läuft als rückwirkend gestarteter Timer; mit Ende wird das vorhandene verschlüsselte Zeitjournal genutzt, dort bearbeitbar. Schutz vor ungültigen Zeiten und Überschneidungen; kein erfundenes Arbeitszeitende und keine Änderung am Excel-Import.
- Zwei neue, wiederverwendbare Speisen im Ernährungsmenü: gedämpfte Kartoffeln mit Ingwer, Knoblauch, Chili, Sellerie, Karotten, Sojasauce, Ahornsirup und Sichuanpfeffer (351 kcal, Annahmen) sowie gekochter schwarzer Vollkornreis (238 kcal je angenommene 180 g). Grammangaben einzeln editierbar; Quellen und geschätzte Makro-/Mikronährstoffe; Anti-Aging Eight und beide Daily-Dozen-Ansichten berücksichtigen die dokumentierten Zutaten ohne Doppelzählung.
- Bioaktive Bestandteile qualitativ vermerkt (z. B. Anthocyane, Gingerole, Capsaicinoide, Sanshoole); Konzentrationen ausdrücklich unbekannt. Keine automatische Buchung ins Tagebuch und keine Migration.
- Tests 0.5.91.17: 10 neue Regressionstests erfolgreich, 33/33 Deployment-Prüfungen. Vollsuite-Abgleich gegen Originalversion 0.5.91.16: 35 verbleibende historische Fehler gegenüber 37 in der unveränderten Basis 0.5.91.16; keine neuen Fehlertests. Vite-Bundle nur nach Installation von Dependencies kompiliert.

## 0.5.91.16 · Workbook UX: optionaler Hantelaufbau; Zotter und Bio-Hanfproteinriegel

Siehe RELEASE_0.5.91.16.md.

## 0.5.91.15 · Equipment-aware V-Taper Progression

- Konfigurierbares Scheibeninventar, reale Gewichtsstufen (auch für zwei identische Hanteln), unknown Griffgewicht.
- RIR-/Recovery-gesteuerte reale Gewichtsvorschläge statt pauschaler +2 kg.
- Mobile Inline-SVG-Scheibenvisualisierung im Coach und geführten Workout; +/- springt durch verfügbare Stufen.
- Alte Trainings-/StrongLifts-Daten unverändert. Tests: 2002/2037, 35 historische Fehler, 33/33 Deployment; Vite lokal nicht verfügbar.

## 0.5.91.14 · Automatische Trainingszyklen & adaptiver Review (02.11.2026)

- Vorhandene Garmin-/Coach-Trainingshistorie bestimmt den Start eines sechs Wochen langen V-Taper-Blocks; manuelle Erstaktivierung entfällt.
- Synchronisierte, archivierungsfähige Zyklus-Metadaten und konservative Migration der alten lokalen Einstellung; keine Veränderung bestätigter Sessions.
- Pause, Verlängerung, Deload, Startdatum und neuer Block als optionale Aktionen im kompakten Coach-Detailbereich. StrongLifts verwendet dieselbe Historie.
- Review A/B/C/D nach sechs Wochen mit bestätigten Sätzen, Trainingstagen, RIR, Volumen, dokumentierter Progression und wiederverwendeter Plateauauswertung; fehlende Werte bleiben unbekannt, keine automatische Programmänderung.
- 15 neue Tests bestanden, 9/9 angepasste Altzyklustests, 33/33 Deployment-Tests. Gesamtsuite 1988/2023, 35 bereits vorhandene Fehler. Lokaler Vite-Produktionsbuild wegen nicht auflösbarer npm-Registry nicht ausführbar. Siehe `RELEASE_0.5.91.14.md`.

## 0.5.91.13 · Korrektur: Krautroulade mit Räuchertofu (02.11.2026)

- Der vorherige „Gemüse-Tofu-Strudel“ war tatsächlich eine **Krautroulade mit Räuchertofu**. Stable foodId bleibt erhalten, damit bestehende Einträge nicht dupliziert werden.
- Teig-/Blätterteig-Annahme vollständig entfernt, generisches Kraut- und Räuchertofuprofil ergänzt. Öl und Würzung nur als explizite, editierbare Schätzung; bei fehlendem Rezept keine unbekannten zusätzlichen Gemüsesorten unterstellen.
- Daily Dozen berücksichtigt **Kreuzblütler (Kraut)** und **Soja/Hülsenfrüchte (Räuchertofu)**; kein zweifaches Zählen von Kraut als weiteres Gemüse; keine Fermentations-/Vollkorngutschrift.
- Energie und Nährstoffe werden aus den korrigierten Zutatengramm berechnet. Es wird nichts automatisch als gegessen verbucht. Siehe `RELEASE_0.5.91.13.md`.

## 0.5.91.12 · Bio-Skyr, Bio-Magertopfen, Topfentorte & scharfer Gemüse-Tofu-Strudel (02.11.2026)

- Vier neue Speisen im bestehenden Compass-Ernährungsmenü (zwei Frühstücksprodukte, Snack-Torte, Gemüse-Tofu-Mahlzeit) als editierbare Rezept-/Etikett-Zutatenprofile.
- SPAR free from Bio-Skyr (250 g) und Bio-Magertopfen (250 g) mit den fotografierten Etikettenwerten; nicht deklarierte Mikronährstoffe als generische Schätzungen markiert und fehlende Werte unbekannt.
- Ein Stück Topfentorte (geschätzt 160 g) und koreanisch inspirierter scharfer Gemüse-Tofu-Strudel (geschätzt 288 g) mit vorsichtiger Zutaten-, Makro- und Mikroschätzung; Gewichte sowie Rezepte unbekannt und editierbar.
- Daily Dozen: Tofu- und Gemüsemenge des Strudels nur vorläufig; keine Pflanzengutschrift für Milchprodukte/Torte, kein erfundenes Vollkorn/Beeren/Kreuzblütler oder fermentierte Lebensmittel.
- Anti-Aging Eight: dokumentierte Proteinmenge aus allen vier Speisen und nur passende pflanzliche Nahrungsindikatoren; keine Behauptung von Proteinrestriktion, Postbiotika oder Verjüngung.
- Keine Vorabeintragung für 03.11.2026 und keine Änderungen am verschlüsselten Ernährungsjournal oder an vorhandenen Rezepten.
- Vollständige Tests: 1968/2003, gleiche 35 historischen Fehler wie 0.5.91.11; 33/33 Deployment-Tests, acht neue Tests erfolgreich. Vite-Produktionsbuild lokal blockiert (vite: not found).
- Details: `RELEASE_0.5.91.12.md`.

## 0.5.91.11 · IronMaxx Mixed Berries Proteinshake

- Originaletikett 30-g-Portion + 300 ml Wasser als editierbares persönliches Getränkerezept.
- 119 kcal, 22 g Eiweiß, 1,4 g Kohlenhydrate, 2,4 g Fett und 1,3 g Salz je Glas; Natrium circa 520 mg aus Salz rechnerisch abgeleitet. Zucker <0,5 g ist keine exakte 0; nicht deklarierte Vitamine und Mineralien bleiben unbekannt.
- Daily Dozen führt den Wasseranteil als Getränk, nicht das Beerenaroma als Früchte; Anti-Aging Eight berücksichtigt die erfasste Proteinmenge ohne Erfolgsbehauptungen.
- Kein neuer Speicher, keine Rückwirkung auf bestehende Tagebucheinträge. Siehe `RELEASE_0.5.91.11.md`.

## 0.5.91.10 · Selbstgebackener Mohnkuchen und Basmatireis mit Linsendal & Brokkoli

- Zwei neue persönliche Speisen im vorhandenen Ernährungsmenü mit einzeln editierbaren Zutaten, Makro-/Mikronährstoff-Schätzungen, Tagestrends und Daily-Dozen-/Anti-Aging-Einordnung; siehe `RELEASE_0.5.91.10.md`.
- Ungewogene Stück-/Tellergrößen und nicht belegte Zutaten klar als Schätzungen; kein automatischer Daily-Dozen-Samenpunkt für unbekannte Mohnmenge, weißer Reis kein Vollkorn.

## 0.5.91.9 · Lehr- und Event-Vorbereitungsradar

- `(kro)` inkl. kombinierter Lehrendenkürzel, Business Model Workshop und Final Pitch: Countdown und GTD-Projektvorschläge. Siehe `RELEASE_0.5.91.9.md`.

## 0.5.91.8 · Coach-Sätze vereinheitlicht; Smart Tape vorbereitet (Import AUS)

- Body Transformation verwendet jetzt die bestehenden bestätigten Coach-Sätze über die gleiche Coach-/Garmin-Session-Zusammenführung wie die Muscle Map.
- Fitdays+ Smart-Tape-Modell (12 Regionen, cm/in, Dot-Plots, Ratio, synthetische Tests) auf dem bestehenden Coach-Messwertspeicher vorbereitet; Import/UI/Adaptive Vorschläge deaktiviert.
- Testergebnisse und Grenzen: `RELEASE_0.5.91.8.md`.

## 0.5.91.7 · Mein Ofenkartoffel-Gericht mit editierbarer Suppenschüssel-Portion

- Persönliches Mahlzeit-Rezept mit Bio-Kartoffeln samt Schale, Olivenöl, schwarzem Sesam, Chiliflocken und Salz; Ölmenge für beide Übergüsse zusammen.
- Generische Makro-/Mikronährstoffschätzung, individuelle Zutatengrammangaben, Portionenskalierung und vorsichtiges Daily-Dozen-Zutaten-Mapping.
- Details und Tests: `RELEASE_0.5.91.7.md`.

## 0.5.91.6 · Bankimport-Dubletten und Einnahmen-Transparenz

- Sprachübergreifende Referenzprüfung verhindert doppelte Gehaltseingänge aus unterschiedlich formatierten Bank-CSV-Dateien.
- Bereits gespeicherte eindeutige Dubletten nur einmal zählen (Cashflow, Kategorien, Kontostände); Originale behalten und bei Fehlzuordnung einzeln freigeben.
- Doppelschutz in Importvorschau und Bestätigungszeitpunkt; keine unsichere Kombination allein nach Datum/Betrag. Tests und Grenzen: `RELEASE_0.5.91.6.md`.

## 0.5.91.5 · Finanzprüfung & Buchungs-Nachweis

- „Auswahl bestätigen“ verarbeitet jetzt auch wirtschaftlich offene Buchungen, die im verschlüsselten Original noch kein `needsReview` tragen.
- Einzel- und Sammelbestätigungen validieren Vorzeichen, Art und Kategorie und zeigen Fehler direkt im Formular an.
- Monatswerte für Einnahmen, Rückerstattungen, Konsumausgaben sowie Netto-Cashflow sind aufklappbar und führen die Buchungen / Berechnungen auf.
- Relevante Kategorien für Bank-Eingänge / -Ausgänge getrennt; keine automatische Zuordnung positiver Buchungen zu Konsum.
- Keine Änderung an gespeicherten Finanzdaten ohne aktive Bestätigung. Siehe RELEASE_0.5.91.5.md.

## 0.5.91.4 · Externe Geldflüsse, Diagramm zuerst, Saldo-Brücken

- Eigenüberträge und Bargeldbewegungen bleiben aus Einnahmen, Konsum, Kategorien und Netto-Cashflow heraus. Alte grobe Kategorien ohne gesicherten wirtschaftlichen Zweck werden separat als ungeklärt ausgewiesen; gespeicherte Buchungen bleiben unverändert.
- Monatsdiagramm steht vor Kennzahlen und Kategorien; Kontostände erscheinen weiter unten. Monatschalter vor/zurück.
- Salden an gewählten Monatsstichtagen aus dem zeitlich nächsten bestätigten Snapshot und signierten Kontobuchungen vorwärts bzw. rückwärts rekonstruiert. Abgeleitete Salden explizit provisorisch; keine API-Salden vorgetäuscht.
- Gemeinsame wirtschaftliche Klassifizierung für Premium-Überblick und aggregierte Cashflow-/Ausgabenmodelle, inkl. Testfällen.

## 0.5.91.3 · Kontostände & letzter Kalendermonat

- Konten mit bestätigtem Saldo und Bewertungsdatum neben letzter Buchung; lokale Aktualisierung ohne neue Datenbank.
- Monatsbilanz des letzten abgeschlossenen Monats und neuer Filter „Letzter Monat“ in Übersicht und Finanzdetails.
- Keine geschätzten Kontostände. Tests und Grenzen: `RELEASE_0.5.91.3.md`.

## 0.5.91.2 · Happy Harvest Steinofen-Kornspitz

- 1 Stück (75 g), Produktetikett-Makros und Zutaten; konsistente Stück-/Gramm-Eingabe. Siehe RELEASE_0.5.91.2.md.

## 0.5.91 · V-Taper Training-Start Trend + 96% CI
- Datumsbasierte Kurzzeittrends seit dem dokumentierten Krafttrainingsbeginn; ältere Gewichtshistorie bleibt separat erhalten.
- 96-%-Student-t-Konfidenzbänder der linearen Mittelwert-Trends für Fitdays-/Körper-/Protein-/Trainings-Dotplots bei ausreichender Datenabdeckung; sichtbare Y-Achsen.
- Zielgewichts-Leerbalken entfernt; fehlende Garmin-Sätze sind keine 0-Sätze.
- Kein langfristiger Körperfett-Forecast ohne belastbare Daten. Siehe RELEASE_0.5.91.md.

## 0.5.90 — Schlafdaten-Korrektur, kompakte Proteinanzeige, Übungsidee, persönliche Joghurt-Rezepte
Siehe RELEASE_0.5.90.md.

## 0.5.89 · Personalised Exercise Library (2026-11-01)

Sechs optionale Übungen, zwölf KI-Start-/Endbilder als separate WebP-Dateien und Integration in den bestehenden Coach; siehe `RELEASE_0.5.89.md`.

## 0.5.88 · Integrated Coach Intelligence (2026-11-01)

Protein Intelligence, offene Einmalmahlzeiten mit GPT-JSON-Prüfung, manuell konfigurierbares StrongLifts 5×5, gemeinsames Coach-/Garmin-Belastungsmodell und datenlimitierte Fitdays-Gewichtsszenarien. Details und Prüfstatus: `RELEASE_0.5.88.md`.

# Dream Moon Quickfix · 25. Oktober 2026

- Fix: Mond-Shortcut funktioniert auch im Focus-Modus.
- Fix: Traumformular hängt nicht mehr am Vorladen aller Insights-Module.
- UX: Eingabefeld „Erinnerung“ erhält direkt Fokus.
- Bestehender Vite-Bridge wird aktualisiert; kein neuer Plugin-Eintrag, keine Datenmigration.
- Versionsanzeige bleibt 0.5.77.58.2 (Hotfix ohne neue Version).
