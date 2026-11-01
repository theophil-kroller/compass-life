# Compass 0.5.91.3 · Finanzüberblick: belegte Kontostände und letzter Kalendermonat

Ausgangsbasis: 0.5.91.2, GitHub-Commit `069a577e29d7eb06902cfc28902eacb4c348e864`.

## Ergänzungen

- **Konten & Salden zuerst:** Jede aus importierten Transaktionen bekannte Bankkontoquelle wird auf der Premium-Finanzübersicht mit Konto-Bezeichnung, letzter vorhandener Buchung und dem jüngsten explizit bestätigten Bank-Saldo (inkl. Saldo-Stichtag) dargestellt. Weitere manuell bestätigte Bank-Snapshots ohne zuordenbare Buchungsquelle werden separat aufgelistet. Nicht vorhandene Bank-Salden werden nicht durch Buchungssummen ersetzt und nicht als null angezeigt.
- **Saldo pflegen, ohne die Startseite zu verlassen:** Kompaktes Eingabeformular nutzt den bestehenden verschlüsselten `financeWealthSnapshots`-Speicher und den bestehenden `finance-wealth-add`-Handler; keine parallele Kontostandsdatenbank. Konto-Namen werden als Vorschläge aus dem bestehenden Account-Register angeboten.
- **Monat auf einen Blick:** Einnahmen, Rückerstattungen, Konsumausgaben und beobachteter Geldfluss für den ausgewählten Monat bzw. standardmäßig den letzten abgeschlossenen Kalendermonat. Eigenüberträge, Bargeldabhebungen und ungeklärte Vorgänge sind keine automatischen Konsumausgaben.
- **Zeitraum „Letzter Monat“:** Echter vorheriger Kalendermonat inklusive seines letzten Tages, etwa 01.10.–31.10.2026 am 01.11.2026; auch im älteren Finanz-Detail-Dashboard. Jahres- und Schaltmonatwechsel getestet.
- **Responsive UI:** Zweispaltige Konten-/Monatsübersicht auf Desktop, einspaltig auf Mobilgeräten. Die bisherigen Kategorien, Diagramme und Buchungsprüfungen bleiben bestehen.

## Grenzen und Datenqualität

- Kein Echtzeitabruf von Bank-APIs, keine Schätzung aktueller Salden aus unvollständigen Buchungshistorien. `Letzte Buchung` ist nicht das tatsächliche Import-/Synchronisationsdatum.
- Freie manuelle Kontobezeichnungen werden nur bei genauer Übereinstimmung mit der importierten Kontobezeichnung verknüpft; nicht eindeutig zuordenbare Stände erscheinen als separate datierte Positionen. Summen sind unvollständig, sofern Salden fehlen oder einzelne Konten nicht aktualisiert wurden.
- Diese Version führt keine automatischen Saldenimporte aus Konto-CSV-Dateien ein.

## Qualitätssicherung

- 8/8 neue gezielte Tests (`tests/compass-05913-finance-balances-period.test.mjs`).
- 33/33 Deployment-Tests.
- Gesamtsuite: 1.898/1.933 bestanden; unverändert 35 historische Fehlertests.
- Modulgraph und Worker-Check bestanden.
- Lokaler Vite-Build: `vite: not found` (Abhängigkeiten in Build-Umgebung nicht installiert); CI muss den Produktionsbuild bestätigen.
