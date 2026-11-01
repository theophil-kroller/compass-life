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
