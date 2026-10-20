# Compass 0.5.62 — Konsistente Fixkosten & Zahlungspartner

Basis: 0.5.61. **Keine D1-Migration, kein Vault-Reset, keine automatische Änderung von Bankbuchungen.**

## Korrektur

1. **Zwei Ansichten, eine Bestätigungsgrundlage.** Die in `Finanzen → Fixkosten → Verträge und wiederkehrende Kosten` gespeicherten manuellen Status `fixed`/`exclude` werden im Tages-Cashflow unter `Finanzen → Planung → Prognose` berücksichtigt. Dies ist eine Einordnungsentscheidung, keine Gewähr für einen zukünftigen Buchungstermin.
2. **Betriebskosten als private Überweisung:** Ein äußerer Bankabgang kann auch mit `flow=transfer`, `category=Transfer / Private Überweisung` und dem Verwendungszweck `Betriebskosten`, `Miete`, `Mietzins` oder `Hausverwaltung` zu den regelmäßigen Wohnkosten gezählt werden. Es sind weiterhin mehrere Monatsbeobachtungen erforderlich. Verknüpfte interne Eigenüberträge sowie Transfers eigener Konten und Kreditkartenabrechnungen bleiben ausgeschlossen.
3. **Öffentliche Verkehrsmittel:** Monatliche, stabile Abbuchungen aus der Kategorie `Mobilität / Öffentliche Verkehrsmittel` gelten jetzt als regelmäßige Kandidaten und können nach entsprechender Beobachtung in die Tagesprognose aufgenommen werden (z. B. Monatsbeiträge der Wiener Linien). Variable Einzelkäufe werden nicht allein anhand des Namens als Abo betrachtet.
4. **Empfängeridentität:** Die Prognose verwendet denselben normierten ursprünglichen Händler-/Empfängerschlüssel wie der Fixkostenbereich. Ein eigener Anzeigename bleibt für die Darstellung möglich, spaltet aber die Historie nicht mehr unbeabsichtigt auf.
5. **Buchungstag und Betragsentwicklung:** Für typische Fixkosten gelten geringfügig tolerantere Datumsschwankungen. Bei ausdrücklich bestätigten Posten und unregelmäßigem Buchungstag wird konservativ ein früherer beobachteter Zahlungstag angenommen; Beträge von ausgehenden Fixkosten basieren weiterhin auf der letzten beobachteten Zahlung.
6. **Nicht prognostizierte Kandidaten werden erklärt:** Der Forecast zeigt zusätzliche erkannte oder bestätigte regelmäßige Posten, die aufgrund fehlender Aktualität, mehrfacher Buchungen im Monat oder uneindeutigem Buchungstermin noch nicht automatisch für den Tages-Cashflow eingesetzt werden. Die Kandidaten sind nicht aus den importierten Bankdaten gelöscht; aus einer Bestätigung wird kein verbindlicher Bankauftrag.
7. **Doppelzählungsschutz:** Bereits gebuchte Zahlungen im aktuellen Monat werden nicht noch einmal prognostiziert. Echte Bankabgänge, die nicht als Fixkosten erkannt werden, verbleiben im variablen Abfluss. Bestätigte interne Transfers werden nicht als eigenständige Ausgaben behandelt.

## Prüfergebnisse

- 628/628 Node-Tests erfolgreich (6 neue Regressionstests, u. a. Betriebskosten-Privatüberweisung, Wiener Linien, manuelle Bestätigung/Ausschluss, interne Überträge und Diagnoseanzeige).
- Worker-JavaScript-Syntaxprüfung erfolgreich.
- `npm run build` **nicht ausführbar**: in der Prüf-Umgebung ist das `vite`-Programm nicht installiert (`vite: not found`). Bitte im Deployment-Workflow den vollständigen Produktionsbuild prüfen.
- Keine Verifikation mit dem realen verschlüsselten Benutzer-Vault oder Bankkonto durchgeführt. Die Erkennung ist vollständig lokal und verwendet nur bereits vorhandene importierte Finanztransaktionen.

## Abnahme

- `Finanzen → Fixkosten`: Wiener Linien und Überweisungen mit Verwendungszweck Betriebskosten als Kandidaten erkennen; ggf. bestätigte Markierungen prüfen.
- `Finanzen → Planung → Prognose`: dieselben Zahlungspartner, sofern genug aktuelle Daten vorhanden; andernfalls unter den *nicht prognostizierten Kandidaten* den Grund prüfen.
- Nach der Veröffentlichung neu laden und die ursprünglichen Bankbuchungen unverändert lassen.
