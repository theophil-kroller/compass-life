# Compass 0.5.61 — Payment Patterns & Daily Cashflow

Basis: Compass 0.5.60. **Keine D1-Migration, kein Vault-Reset.** Neue Erkenntnisse werden aus vorhandenen verschlüsselten Bankbuchungen lokal abgeleitet; keine automatische Änderung der Finanztransaktionen.

## Neu

1. **Gehaltsmuster mit integrierten Sonderzahlungen:** Regelmäßige Gehaltsüberweisungen werden anhand bestätigter Bankkategorien/Buchungstexte und eines stabilen Zahlungspartners erkannt. Ein höherer Betrag in einzelnen Monaten wird als mögliches saisonales Gehaltsmuster innerhalb **derselben Überweisung** ausgewiesen, nicht als zusätzliche Buchung. Eine Schätzung des normalen Gehaltsanteils wird aus den unteren beobachteten Beträgen gewonnen; saisonale Mehrbeträge zählen **nicht** automatisch als verfügbare Liquidität.
2. **Wiederkehrende Fixkosten:** Regelmäßige Zahlungen an denselben Empfänger werden nach Monatsrhythmus, Buchungstag, Kategorie und Betragsentwicklung zusammengeführt. Für Miete/Betriebskosten ist der letzte beobachtete Betrag der Schätzwert, nicht der über Jahre verwässerte Durchschnitt. Entsprechend bestätigte Überweisungen an die Hausverwaltung können als Fixkosten erkannt werden; Eigenüberträge und Kreditkartenabrechnungen nicht.
3. **Tagesgenaue Modellrechnung:** Wenn genügend bestätigte Gehalts-/Fixkostenmuster vorliegen, simuliert Compass erwartete Ein- und Ausgänge nach geschätzten Tagen. Der Was-wäre-wenn-Check berücksichtigt den **niedrigsten Zwischenstand zwischen Zahlungsereignissen**, nicht bloß das Monatsende. Zum Schutz vor einer zu positiven Aussage fallen variable Restkosten konservativ früh im Monat an.
4. **45-Tage-Verlauf und Musterliste:** Die Finanzprognose zeigt einen kompakten Tagesverlauf mit optionalem Sonderzahlungs-Szenario, erkannte Zahlungspartner, nächsten erwarteten Termin, angesetzten Betrag und beobachtete saisonale Gehaltsabweichungen.
5. **Gegen Doppelzählung:** Im laufenden Monat bereits importierte Buchungen desselben Zahlungspartners werden nicht erneut als prognostizierte Fixkosten/Gehälter eingetragen. Manuell bestätigte zusätzliche Planposten und simulierte Sonderausgaben bleiben separat.
6. **Konservativer Rückfall:** Sind Empfänger und Buchungsrhythmen nicht hinreichend belegt, bleibt das ausdrücklich als *Monatsmodell* gekennzeichnete Modell 0.5.60 verfügbar. Wird zumindest das reguläre Gehalt erkannt, wird sein Grundbetrag statt eines durch Sonderzahlungen erhöhten historischen Gehaltsdurchschnitts angesetzt.

## Grenzen

- **Taggenau bedeutet modellierte Zahlungstage, keine garantierten Fälligkeiten.** Wochenendverschiebungen werden vorsichtig geschätzt; feiertagsbedingte Abweichungen und Banklaufzeiten sind nicht vollständig abbildbar.
- Ohne heute bestätigten liquiden Anfangsbestand gibt es keine belastbare Aussage, ob eine Zahlung leistbar ist. Fehlende Konten, offene Bankklassifikationen, ausländische Zahlungsgebühren und nachträgliche Änderungen können das Ergebnis verfälschen.
- Jahreszeitliche höhere Gehaltsbestandteile werden nur als **historisch beobachtete Kandidaten** gezeigt. Auch ein in zwei Vorjahren beobachtetes Muster ist kein Anspruch auf die nächste Sonderzahlung. Der Forecast berücksichtigt daher nur die vorsichtige Gehaltsbasis.
- Supermarkt-, Restaurant- und ähnliche Konsumtransaktionen werden nicht allein durch gleiche Abbuchungstage zu Abos erklärt. Daueraufträge ohne klaren Zahlungspartner oder unbestätigte Klassifikation verbleiben in den variablen Kosten.
- Die erste Version schätzt variable Ausgaben monatlich; nicht jeder einzelne zukünftige Einkauf und nicht jede Vertragsfälligkeit ist aus den vorhandenen Exporten rekonstruierbar.
- Gespeicherte Finanzplanposten und Kontostände werden nicht automatisch geändert. Alle Berechnungen bleiben lokal.

## Prüfstand

- **622/622** Node-Regressionstests bestanden, darunter 11 neue Tests zu Gehaltsanteilen, Fixkosten, Restkosten, Doppelzählung und untermonatlichem Liquiditätstief.
- Worker- und Client-JavaScript-Syntax erfolgreich.
- **Nicht verifiziert:** Vite-Produktionskompilierung (Abhängigkeit `vite` in der Arbeitsumgebung nicht installiert) und Live-Abnahme mit realem verschlüsseltem Vault und Bankimporten. Der GitHub-Workflow muss `npm run check` und `npm run build` erfolgreich abschließen.
