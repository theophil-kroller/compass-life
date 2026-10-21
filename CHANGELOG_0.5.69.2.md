# Compass 0.5.69.2 – Personal Time Journal & Nutrition Quick Capture

## Zeitjournal (neuer Insights-Bereich)
- Vorhandene Play-/Stopp-Intervalle aus 0.5.69.1 werden unverändert als Quellen weiterverwendet.
- Schnellstart kann nun schon vor Play den Lebensbereich auswählen: Beruf, Privatprojekt, Familie & Beziehungen, Sport & Freizeit, Gesundheit & Erholung, Alltag oder Unklassifiziert.
- Alle Intervalle können später im Zeitjournal neu zugeordnet, mit Titel/Projekt versehen, in Start/Ende korrigiert oder entfernt werden.
- Manuelles Nachtragen (z. B. 45 Minuten Fußball, Compass-Entwicklung, Beziehungsdynamiken-Website) mit Datum/Uhrzeit.
- 7-/30-/90-Tage-Zeitverteilung nach Lebensbereichen; Chronologie; Warnung bei überlappenden Intervallen. Unbelegte Stunden gelten nicht als Null und werden nicht künstlich gefüllt.
- Die bisherige dienstliche Arbeitszeitübersicht bleibt erhalten.

## Ernährung (Schnellzugriff + Insights)
- Neues Essbesteck-Symbol in der Titelzeile. Ein Tippen auf ein Piktogramm erfasst ein Essen oder Getränk mit Zeitstempel.
- Beispiele: Matcha mit Honig, Hafermilch-Latte mit Karamellsirup, Smoothie, Tee mit Honig, Kurkuma-Latte, Mensa, Buffet, Erdnüsse, Nussmischung, getrocknete Mango, Apfel, Milchreis, Cheddar, Käsebrot, Schokoriegel, Snickers.
- Nachträgliche Bearbeitung: Zeitpunkt, freiwillige Menge/Notiz, Löschen. Weitere Lebensmittel bei entsperrtem Tresor hinzufügen.
- Insights → Ernährung mit 7-/30-/90-Tage-Häufigkeiten und chronologischer Liste. Kein erfundener Kalorien- oder Gesundheits-Score.

## Sperrmodus und Synchronisierung
- Ernährungseinträge können bei gesperrtem Tresor verschlüsselt lokal vorgemerkt werden. Sie werden erst beim Entsperren entschlüsselt in den Vault übernommen.
- Auch vorhandene gesperrte Play-/Stopp-Erfassung bleibt verwendbar; Kategorie und Start/Ende werden übertragen.
- Neues verschlüsseltes Journal in der vorhandenen Cloudflare-D1-Gerätesynchronisierung mit Versionierung und Merge nach stabilen IDs.
- Journal umfasst tatsächliche Zeitintervalle, Korrekturen, Kategorien, Projekte, Ernährung und eigene Lebensmittel. Inhalte sind vor Upload E2EE-verschlüsselt; D1 speichert nur Chiffretext.
- **Voraussetzung für geräteübergreifende Journal-Synchronisation**: Compass-Anmeldung, auf beiden Geräten aktivierter privater Geräteabgleich mit identischem Schlüssel, aktualisierter Worker UND D1-Migration 0018. Sperrmodus allein synchronisiert noch nicht; zuerst lokalen Tresor entsperren und Geräteabgleich ausführen. Ohne diese Voraussetzungen bleibt alles lokal und als „nur lokal“ gekennzeichnet.
- Gleichzeitiger Start derselben laufenden Uhr auf mehreren Geräten ist derzeit nicht als kollisionsfreie Echtzeit-Uhr implementiert. Nach dem Abgleich von Zeitjournal/Ernährung sind gespeicherte Einträge per ID zusammenführbar.

## UI
- Schnellerfassung in der Titelzeile kompakt mit Icons; die ausführlichen Labels stehen im Tooltip und sind für Screenreader zugänglich.
- Keine zusätzlichen Erfassungsbuttons auf der Startseite.

## Kompatibilität
- Ausgangsbasis 0.5.69.1; keine Vault-Zurücksetzung.
- D1-Migration **0018_personal_journal_mirror.sql erforderlich**, wenn verschlüsselte Synchronisation genutzt werden soll.
- Vollständige JS/Worker-Syntaxprüfung und 705 automatisierte Tests (einschl. Journal-Merge, Verschlüsselungs-Roundtrip und Migration) erfolgreich.
- Vite-Produktionsbuild hier nicht ausführbar: npm-Pakete sind in dieser Umgebung nicht installiert und Offline-Installation war nicht möglich. GitHub Actions baut über npm install.
