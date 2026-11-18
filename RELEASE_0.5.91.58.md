# Compass Life 0.5.91.58 — Gifts, Touch Analytics, Recovery & Locked Worktime

## Änderungen gegenüber 0.5.91.57

- **Geschenkplaner:** Unter `Listen / Einkaufslisten → Geschenke` ein eigener, verschlüsselter Geschenkbereich für Weihnachten, Geburtstage, Ostern und andere Anlässe. Geschenkideen mit Kontakt, Jahr, Anlass, Status (Idee, ausgewählt, gekauft, verpackt, geschenkt), Preis und Notiz. Vergangene Jahre bleiben als Geschenkhistorie einsehbar; Bearbeitung und Löschen möglich. Geschenkideen und Tombstones werden im bestehenden optionalen Ende-zu-Ende-verschlüsselten Journalabgleich zusammengeführt.
- **Proaktive Anlässe:** Das bestehende Anlass-Modul (Weihnachten, Ostern, Geburtstage) verweist direkt zum Geschenkplaner; 60 Tage vor Weihnachten erscheint eine knappe, datenbasierte Erinnerung in der Heute-Übersicht mit offenen Geschenkideen. Keine Hintergrund-Benachrichtigungen bei geschlossener App.
- **Berührung und Nähe:** In `Insights → Berührung & Nähe` eine aggregierte Wochen- und Monatsstatistik mit Personenfilter, Art-Zählung (Umarmungen, Tanzen, Küssen, gemeinsames Einschlafen, Sex/Intimität usw.), Zeitraum-Balken und Aufschlüsselung nach Personen. Bisherige Chronik und manuelle Erfassung bleiben erhalten. Nicht dokumentierte Zeiten werden nicht als echte Null-/Kontaktlosigkeit interpretiert.
- **Krafttraining:** Coach zeigt dokumentierte Trainingstage in den letzten 7 Tagen sowie einen unverbindlichen Hinweis auf Erholung/Mobilität nach intensiver Häufung oder auffälligen vorhandenen Schlaf-/HRV-Signalen. Keine automatische Last- oder Trainingsänderung; bestehender adaptiver Coach, Zyklus, StrongLifts und V-Taper bleiben unverändert.
- **Schnelles Einstempeln:** Auf dem `Ars Vivendi`-Lockscreen ein klar sichtbarer Knopf, abhängig vom bisherigen Status `Arbeitsbeginn` oder `Arbeitsende`. Verwendet den vorhandenen versiegelten Eingangspuffer: Erst nach erfolgreichem verschlüsseltem Speichern wird der vorhandene lokale öffentliche Status-Indikator aktualisiert. Ereignisse werden nach Tresorentsperrung ins Zeitjournal übernommen. Einmalige Einrichtung der verschlüsselten Schnellerfassung erforderlich. Es gibt keine automatische biometrische Entsperrung.
- **Auto-Sperre:** Unter `System → Lokaler Tresor` wahlweise 15, 30 oder 60 Minuten Inaktivität; Standard bleibt 15 Minuten. Android kann eine PWA im Hintergrund unabhängig von dieser Einstellung beenden.

## Tests

- 6 neue gezielte Tests bestanden: Geschenkliste/Historie, Validation, Tombstone-Gerätemerge, Touchaggregation pro Person, Regenerationsrhythmus, Verschlüsselungsverdrahtung.
- 33/33 Release-Tests erfolgreich; Importgraph OK (307 Module).
- Vollständige Node-Regression: 2324 bestanden, 66 bereits in 0.5.91.57 vorhandene Fehlschläge; **keine neu hinzugekommenen Fehlschläge** (Vergleich anhand der Testnamen, beide Volltests ausgeführt).
- Syntax aller geänderten .js-Dateien und ZIP-Integrität geprüft. Der Patch wurde gegen die 0.5.91.57 Full-Source entpackt und bytegenau zum Full-Source verglichen.

## Grenzen

- Kein automatischer Versand von Erinnerungen, wenn Compass geschlossen ist.
- Nicht implementiert: Fingerabdruck-Login, sofortige Multi-Device-Synchronisierung des Sperrbildschirmindikators oder automatisch ausgesetzte Trainingseinheiten.
- Vite-Produktionsbuild wurde lokal nicht ausgeführt, weil `node_modules` nicht vorliegt. GitHub Actions muss die Produktionskompilierung noch bestätigen.
