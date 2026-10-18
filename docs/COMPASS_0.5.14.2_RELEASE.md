# Compass 0.5.14.2 — Private Finanzregeln & Orte/Weltkarte sichtbar

## Was geändert wurde

### Finanzen
- Raiffeisen-Kategorien: `Familie / Kinderreisen` und `Familie / Schul- & Kurskosten` ergänzen den bisherigen Unterhalt.
- Import einer privaten lokalen **JSON-Zuordnungsdatei** direkt im Finanzbereich. Echte Namen/Bankempfänger **nicht** im öffentlichen GitHub-Repository oder im FULL-SOURCE-ZIP.
- Reihenfolge der Entscheidung: manuell bestätigte Kategorien und zuvor vom Nutzer erstellte Regeln bleiben bestehen; anschließend private Empfängerregeln (präziser Verwendungszweck vor Empfängerstandard), dann allgemeine Händlerregeln.
- Wenn die persönliche Datei ausgewählt wird, werden bereits gespeicherte, nicht manuell bestätigte Buchungen sofort neu klassifiziert. Keine erneuten Raiffeisen-CSV-Uploads nötig.
- Monatliche neue CSV-Uploads wenden die gespeicherten privaten Regeln automatisch an.
- Die benutzerbezogene Datei ist ein **separater privater Download**: `Compass_PRIVATE_FINANCE_RULES.json`. Nicht nach GitHub hochladen oder in ein Repo committen. Sie enthält private Namen; nach Import im lokalen verschlüsselten Vault speichern und die Datei sicher aufbewahren bzw. löschen.
- `Payward Ireland Ltd.` ist Kraken/Transfer. Das Land Irland allein ist kein Kraken-Indikator.

### Orte & Weltkarte
- Ein direkter Einstieg `Orte & Weltkarte` ist in der Hauptnavigation sichtbar.
- Der Tab öffnet standardmäßig den gesamten Zeitraum, sodass bereits importierte historische Aufenthalte nicht durch den vorher globalen 4-Wochen-Filter verschwinden.
- Wenn noch keine Timeline-Aufenthalte vorhanden sind, ist die schematische Weltkarte weiterhin sichtbar; davor erklärt ein Hinweis die fehlende Datenquelle und den Timeline-Import.
- **Es gibt in den bisherigen Raiffeisen-, Garmin- und Fitdays-Dateien keinen Google-Maps-Timeline-Export.** Geo-Aufenthalte werden daher nicht automatisch nachgeladen. Zum Import: Auf Android Google Maps → Profilbild → Meine Zeitachse → Menü → Einstellungen und Datenschutz → Zeitachsendaten exportieren (je nach App-Version etwas anders). In Compass `Orte & Weltkarte` → `Timeline-JSON oder ZIP auswählen` → Vorschau → `Import übernehmen`.
- Importiert werden ausschließlich vorhandene Besuchs-/Aufenthaltsintervalle; keine aus GPS-Aktivitäten abgeleiteten Schlaforte, kein Tracking, keine Cloud-Synchronisation und kein öffentliches Geocoding.

## Update Schritt für Schritt
1. Vorher verschlüsseltes Vault-Backup erstellen.
2. `Compass_0.5.14.2_GITHUB_PATCH.zip` entpacken und den **Inhalt des ZIP mit den relativen Pfaden** in GitHub `theophil-kroller/compass-life`, Branch `main` hochladen.
3. GitHub Actions → `Deploy Compass Web` muss den Web-Build erfolgreich abschließen. Ein lokaler Produktionsbuild kann in der aktuellen Umgebung mangels installierter `vite`-Abhängigkeit nicht bestätigt werden.
4. Compass/PWA aktualisieren, Vault entsperren.
5. Unter `Finanzen` → `Private JSON-Regeln einlesen` die Datei `Compass_PRIVATE_FINANCE_RULES.json` vom **separaten** Download wählen und bestätigen. Die App klassifiziert existierende nicht-manualisierte Buchungen sofort neu. Die private Datei nie nach GitHub hochladen.
6. In `Finanzen → Buchungen` Einträge ggf. korrigieren.
7. Direkt über die Hauptnavigation `Orte & Weltkarte` öffnen. Zum Anzeigen von Markern erst den Google-Timeline-Export importieren. Es ist **kein** Garmin-Re-Import erforderlich.

## Daten & Release Grenzen
- Dieses Update verändert weder `worker/` noch die D1-Migrationen noch Android-Quellcode; keine Android-APK erforderlich.
- Alle privaten Regeln bleiben verschlüsselt lokal im Vault. Private JSON-Datei wird nicht Teil des öffentlichen Quellcodes.
- Vorliegende Tests: 175/175 grün inklusive Finanzregel- und Ortsregressionstests, JavaScript-Syntaxchecks grün.
- Einen realen Google-Timeline-Export des Nutzers gibt es aktuell nicht; Parser- und Ansichtschecks erfolgten mit synthetischen Timeline-Daten.
- Weltkarte ist derzeit eine datenschutzfreundliche, **schematische Vektorkarte**, noch kein detaillierter Straßen-/Länderkartendienst.
