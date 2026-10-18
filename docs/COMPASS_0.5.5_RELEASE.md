# Compass 0.5.5 – Guided Weekly Review & Smart Tags

**Stand:** 18.10.2026, Quellcode-Beta. **97 automatisierte Tests erfolgreich.** Android wurde in diesem Build nicht verändert. Die tatsächliche Web-Produktionskompilierung findet nach dem Upload in GitHub Actions statt; Vite ist hier nicht lokal installiert.

## Neu in Compass

- **Geführter Weekly Review**, ohne Sprünge zu anderen Reitern: Gedanken sammeln, Inbox klären, rückblickender und kommender Google Kalender, Next Actions, Waiting For, sämtliche aktiven Projekte mit Review-Intervallen, projektlose Einzelaktionen, Someday und Abschluss.
- Im Review direkt Aktionen erfassen/bearbeiten, erledigen und Projektreviews markieren. Projektlose Einzelaktionen sind zulässig; keine künstliche Deadline.
- **Review-Fortschritt geräteübergreifend:** kleine versionierte D1-Metadatentabelle mit Konflikterkennung, kein blindes Überschreiben. Die eigentlichen Aufgaben und Projektbearbeitungen bleiben in der bisherigen Task-/Projekt-Cloudsynchronisation.
- **Smart Tags** als Vorschlagsliste in den bestehenden Tag-Eingabefeldern: Personentags werden priorisiert, Namen und Teilnamen gefunden, zuletzt lokal genutzte Tags berücksichtigt, Enter/Pfeiltasten zur Auswahl. Bestehende Kommalisten bleiben kompatibel.
- **Menschen:** Personentag sichtbar und bearbeitbar, optional weitere Namensvarianten, nach Name übereinstimmende Google-Termine in bevorstehend/vergangen getrennt. Vergangene Termine gelten nicht automatisch als tatsächlich stattgefundene Kontakte. Nur lesender Kalender.

## Installation, bitte in dieser Reihenfolge

1. Compass → System & Sync: **verschlüsselten Tresor exportieren**; bestehende Browserdaten nicht löschen.
2. **Remote D1**: Neue additive Migration `worker/migrations/0012_weekly_review.sql` in Cloudflare `compass-db` ausführen. Sie legt lediglich `weekly_review_progress` an. **Bestehende Migrationen nicht erneut blind ausführen.**
3. `Compass_0.5.5_GITHUB_PATCH.zip` entpacken, alle Dateien mit **exakter Ordnerstruktur** im GitHub-Repo `theophil-kroller/compass-life` auf `main` hochladen. Falls das Portal ganze Ordner nicht erhält, in jeweilige GitHub-Verzeichnisse navigieren.
4. GitHub Actions → `Deploy Compass Web` muss grün sein. **Kein Android-APK-Build nötig**: Es wurde keine Android-Datei geändert.
5. Cloudflare Worker mit Wrangler aus dem aktualisierten Repository separat veröffentlichen: `npm run deploy:api`. GitHub Pages allein aktualisiert D1/Worker nicht.
6. Unter `https://compass-api.theophil-tiger.workers.dev/api/health` verifizieren: `apiVersion:11`, `release:"0.5.5"`, `schema.ready:true`.
7. PC und Samsung-PWA: bestehenden Tresor entsperren und synchronisieren. Review öffnen und einen Schritt abschließen; am zweiten Gerät nochmals synchronisieren. Bei gleichzeitiger Änderung wird ein Konflikt angezeigt.

## Grenzen

- Personenkontakte (Name, Aliase, Geburtstage, Notizen und lokale „zuletzt benutzt“-Tag-Reihenfolge) liegen wie zuvor im **lokalen verschlüsselten Tresor**; dieser Build synchronisiert sie noch nicht als Cloud-Personendaten. Aufgaben mit Personentags werden synchronisiert, wenn die betreffende Aufgabe bereits Cloud-Sync nutzt.
- Google-Termine bleiben browser-/sitzungsabhängig. Kalenderzugriff nur lesend, keine Bestätigung von tatsächlichen Treffen.
- Projekt-Review-Frequenzen gelten nur für die ausführliche Einzelprüfung; alle aktiven Projekte bleiben im Review sichtbar.
- Noch kein direkter Garmin-Connect-FIT-/JSON-Import. Garmin-Datenexporte können später als separate Ergänzung zu Health Connect importiert werden, **nach Prüfung einer echten Beispieldatei**, ohne Duplikate zu erzeugen.
- KI-Automatik zur Auswahl von Next Actions ist nicht Bestandteil dieses Builds; der Review unterstützt die Entscheidung des Nutzers.
- npm/Node-Tests sind grün; der lokale Web-Produktionsbuild ist mangels installiertem Vite **noch nicht bestätigt**. GitHub Actions ist entscheidend.
