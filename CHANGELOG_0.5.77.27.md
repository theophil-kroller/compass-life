# Compass Life 0.5.77.27 — Nutrition Insights 3

Basis: Full Source 0.5.77.26, GitHub `theophil-kroller/compass-life`, Stand Commit `c0c5c8e3f01b7945d4a4924cd8b2728d2c8d0419`.

## Neues Modul: Ernährung × Wohlbefinden

In **Insights → Ernährung → 🔗 Zusammenhänge** stehen vier dokumentierte Ernährungsgrößen zur Verfügung:
- letzte protokollierte Kalorienaufnahme (Uhrzeit),
- dokumentierte kcal,
- Protein in g,
- Koffein in mg.

Mögliche Vergleichsgrößen: Folgende Garmin-Schlafnacht, Schritte desselben Kalendertages und Intensität jedes einzelnen dokumentierten Gefühls (Freude, Ruhe, Angst, Wut, Trauer, Zuneigung).

Pro Paar wird jeder Tag als einzelner Punkt gezeichnet; dazu kommen Anzahl verknüpfter Tage, Werteabdeckung, Unsicherheits-Markierungen und eine kontrollierbare Tabelle der Roh-Datenpaare. Ab 10 Werten und ausreichender Streuung wird Spearman ρ rein beschreibend angezeigt. Auswahl 30 / 90 / 365 Tage oder Gesamtdaten.

Fehlende Daten werden nie zu 0, Supplemente ohne kcal sind keine Mahlzeiten, und nicht dokumentierte Gefühle sind keine Intensität 0. Schätz- und Teilbilanzen erscheinen als offene Punkte. Alles ist lokal und schreibgeschützt; es gibt keine Änderungen an Vault-Struktur, Cloud-API oder Erfassungsdaten.

## Integration

Es sind **vier direkt hochladbare Dateien** für den bestehenden Source 0.5.77.26 enthalten:
- `client/src/nutrition-connections-v57727.js`
- `client/src/nutrition-connections-v57727.css`
- `client/nutrition3-bridge.js`
- `client/vite.config.js` (ersetzt die bisherige Datei)

Der kompakte, überprüfende Vite-Bridge bindet die neue Nutrition-Unterseite beim Build ein, ohne `client/src/main.js` (ca. 600 KB) selbst zu überschreiben. So werden die bestehenden 0.5.77.26-Funktionen vollständig erhalten. Die sichtbare Frontend-Versionsanzeige lautet im gebauten Bundle 0.5.77.27. Bei anderen Basisversionen bricht die Bridge absichtlich mit einer klaren Fehlermeldung ab, statt blind Code zu ersetzen.

## Prüfung

- Node-JavaScript Syntaxkontrolle: bestanden.
- Lokale Modul-Smoke-Tests: Folgennacht, Garmin-Schritte, emotionaler Tagesbezug, unvollständige Daten und Spearman-Test bestanden.
- Alle neun Quellcode-Integrationsanker gegen das Original aus GitHub geprüft.
- Vollständigen npm-Build mit Original-Repository sowie E2E-Browsertest **nicht** durchgeführt (vollständige Repository-Dateien stehen im lokalen Build-Container nicht zur Verfügung).

## Garmin Krafttraining · nächste Ausbaustufe (noch nicht Teil von Nutrition 3)

Ein Muscle-Map-Modul benötigt zusätzliche FIT-Details zu Übungen, Sätzen, Wiederholungen und Gewichten; der bisherige Importer liest nur Trainingseinheiten. Darstellung von Vorder- und Rückseite, primär/sekundär beanspruchte Muskelgruppen, Wochensummen und Trainingsbalance ist technisch möglich, sofern die Rohdaten diese Informationen liefern. Die Garmin-Belastung ist keine direkte Messung tatsächlicher Muskelaktivierung oder notwendiger Regenerationsdauer.
