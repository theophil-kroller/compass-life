# Compass 0.5.46 – Local Finance AI / intelligente Stapelprüfung

## Bedienung

In **Finanzen → Werkzeuge → Prüfen** steht die kleine Karte **Intelligente Stapelprüfung**. Sie zeigt ohne Netzwerkzugriff Vorschläge aus bereits von dir bestätigten Buchungen an. Der Vorschlag ist nur dann möglich, wenn Zahlungspartner, Richtung und genügend aussagekräftige Wörter aus dem Verwendungszweck übereinstimmen. Unklare Sammelhändler (z. B. Klarna, PayPal, Amazon), Transfers, Bargeld und Flatex-Trades werden nicht stillschweigend einer Konsumkategorie zugeordnet.

- **Übernehmen** bestätigt die angezeigte Gruppe nach zusätzlicher Rückfrage.
- **Bestätigte Muster gesammelt übernehmen** übernimmt nur aktuell sichtbare, regelbasiert belegte Vorschläge und verlangt eine Bestätigung.
- **Mit lokalem LM-Studio-Modell prüfen** übergibt nach ausdrücklicher Zustimmung höchstens 12 ausgewählte unbestätigte Buchungen an `http://127.0.0.1:1234`. Compass liest zuerst die Liste lokaler Modelle und verwendet das erste verfügbare Modell.
- **Nächste 12 prüfen** ermöglicht die schrittweise Prüfung weiterer Buchungen. Modellvorschläge bleiben flüchtig, bis du sie ausdrücklich bestätigst.

Die Modellantwort wird strikt auf bestehende Compass-Kategorien und die passende Zahlungsrichtung geprüft. Vorschläge zu Transfers, Bargeld, unklarer Kategorie oder ungültigen Datensätzen werden verworfen. **Es gibt keine automatischen Änderungen, keine Kaufsignale und keinen Geldtransfer.**

## Voraussetzungen für optionale lokale KI

1. LM Studio selbst installieren und ein geeignetes **lokales** Modell laden.
2. In LM Studio den lokalen OpenAI-kompatiblen Server auf `127.0.0.1:1234` starten und Browser/CORS-Zugriff ermöglichen. Einzelne Browser blockieren lokale HTTP-Anfragen von einer HTTPS-Webseite (Private-Network-Access/Mixed-Content); dann bleibt die Offline-Stapelprüfung verfügbar.
3. Die KI-Schaltfläche bewusst anklicken und die Datenfreigabe an die lokale Anwendung bestätigen.

**Datenschutz:** Die Anfrage enthält Händlernamen und gekürzte Verwendungszwecke. Erkennbare IBANs, E-Mail-Adressen und lange Referenznummern werden vor der lokalen Übermittlung entfernt oder maskiert. Freitext kann trotzdem personenbezogene Angaben enthalten – vor der Aktivierung bitte beachten. Es gibt keinen neuen Worker-/Cloud-Endpunkt und keine Übermittlung an einen externen KI-Anbieter durch Compass. Der Nutzer ist für die Konfiguration seines lokal laufenden Modells verantwortlich.

## Grenzen

- Ähnlichkeit zu bestätigten Buchungen ist keine Gewissheit. Die Bestätigung geschieht **immer** durch den Nutzer.
- Multidimensionale Labels (z. B. *Apotheke* als wirtschaftlicher Zweck und *Kind* als Begünstigter) sind in diesem Build noch nicht enthalten. Das soll später als getrennte Tags/Lebensbereiche ergänzt werden.
- Noch nicht erkannte Gegenseiten von Transfers müssen wie bisher im Transferabgleich bestätigt werden.
- LM Studio muss bereits installiert sein. Es ist **kein** KI-Modell in diesem Release enthalten, und es werden keine Modelle im Hintergrund heruntergeladen.
- Keine Datenbankmigration, keine neue Cloudflare-Worker-Route und kein Eingriff in bestehende Kalender- oder GTD-Funktionen.

## Prüfstand

`node --test tests/*.test.mjs`: 465/465 erfolgreich, darunter 6 neue Modultests (Musterabgleich, Datenschutz, ungültige KI-Vorschläge, Transfers, Integration). JavaScript-Syntaxprüfungen für Client und Worker erfolgreich. Die Produktionskompilierung über Vite konnte hier mangels installierter NPM-Abhängigkeiten nicht abgeschlossen werden; visuelle Browser-/LM-Studio-Live-Abnahme ausstehend.
