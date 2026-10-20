# Compass 0.5.60 — Financial Forecast & Sonderzahlungs-Check

Basis: Compass 0.5.59. Keine neue D1-Migration; alle neuen Planungsdaten bleiben im bestehenden verschlüsselten lokalen Vault und werden im privaten Geräteabgleich wie andere Vault-Daten berücksichtigt.

## Neu

1. **12-Monats-Cashflow unter Finanzen → Planung → Prognose.** Kompakte Kennzahlen, Verlaufsdiagramm und nachvollziehbare Monatstabelle mit durchschnittlichen historischen Bankzuflüssen, geschätzten Abflüssen und bewusst geplanten Einmalzahlungen.
2. **„Kann ich mir das leisten?“** Betrag, Datum und Zweck einer ungeplanten Ausgabe eingeben. Compass vergleicht den modellierten Verlauf und den niedrigsten Monatsendbestand mit dem selbst gewählten Sicherheitspuffer. Die Frage verändert zunächst keine Daten. Ein separat bestätigter Button übernimmt sie als einmaligen Planposten; es wird keine Bankbuchung erzeugt und keine Überweisung ausgelöst.
3. **Manuell bestätigter liquider Anfangsbestand** mit Tagesstichtag und individueller Rücklage. Nur ein am aktuellen Tag bestätigter Stand wird für absolute Salden genutzt. Ist er veraltet oder fehlt er, zeigt die Projektion ausschließlich Differenzen; keine erfundenen Kontostände.
4. **Geplante Sonderausgaben und -einnahmen** mit Datum, Betrag, Bezeichnung, Löschfunktion und unveränderter Bankhistorie. Auch private Überweisungen zählen als Liquiditätsabgang; bestätigte Eigenüberträge und Kreditkartenabrechnungen werden nicht doppelt extrapoliert.
5. **Konservative Prognose für den laufenden Monat:** künftige Ausgaben anteilig schätzen, aber keine weitere automatische Einnahme annehmen, weil das Monatsgehalt bereits im bestätigten Anfangsbestand stecken kann.
6. Der bisherige historische Drei-Monats-Konsumforecast bleibt unter einem aufklappbaren Abschnitt erreichbar.
7. Eingaben im Was-wäre-wenn-Formular werden während normaler UI-Neuzeichnungen im flüchtigen Speicher gehalten, damit sie bei Hintergrund-Updates nicht verloren gehen.

## Grenzen der Aussagekraft

- Die Daten aus Bankimporten zeigen nicht notwendigerweise alle Bankkonten, zukünftige Verträge oder tatsächlich fällige Zahlungen. Aus einzelnen Monaten mit Buchungen lässt sich keine vollständige Kontenabdeckung belegen.
- Die ersten zwölf Monate sind ein **bedingtes Monatsmodell** und keine taggenaue Liquiditätsrechnung. Monatsendbestände können untermonatliche Engpässe verbergen.
- Wiederkehrende Zahlungen werden zunächst aus einem Durchschnitt der letzten bis zu sechs vollen Monate geschätzt. Neue Sonderzahlungen werden nur auf Wunsch zusätzlich geplant; bereits im historischen Monatsdurchschnitt enthaltene Kosten dürfen nicht noch einmal als Zusatzposten übernommen werden.
- Für Auslandsüberweisungen können Wechselkurse, Gebühren, Verzögerungen und Überweisungsbedingungen fehlen. Keine Zahlungsfähigkeitsgarantie und keine Anlageberatung.
- Freie Sprachfragen und ein verifizierter Abgleich aller bevorstehenden Vertragsfälligkeiten sind **noch nicht** implementiert; der aktuelle Check ist eine strukturierte Eingabe mit erklärter Unsicherheit.

## Tests

- 611/611 automatisierte Node-Tests bestanden, einschließlich sieben neuer Szenario-/Datenqualitätstests.
- Syntaxprüfungen der geänderten JS-Module und des Workers erfolgreich.
- Produktions-Vite-Kompilierung und echter Browser-/Vault-Test in dieser Umgebung nicht verifiziert; `vite` nicht installiert. GitHub Actions führt nach Deployment `npm install`, `npm run check` und `npm run build` aus.
