# Compass Life 0.5.77.59.40.8 – Projektlebenszyklus und N-of-1-Coach

**Basis:** Full Source 0.5.77.59.40.7. Keine Änderung am lokalen Verschlüsselungsschema und keine D1-Migration.

## Projekte und Ordner

- Am Ende von **Ordner & Projekte** stehen farblich abgesetzte Schaltflächen **Archiv** und **Papierkorb**.
- **Archivieren** über den Projektinspektor setzt einen eigenständig synchronisierten Projektstatus `archived`.
- **Papierkorb** verschiebt ein Projekt/Ordner zunächst nach `trash`. Ein enthaltener Unterbaum und zugehörige Aufgaben bleiben bestehen und werden aus der aktiven Baumdarstellung und dem GTD-Arbeitsvorrat ausgeblendet.
- **Wiederherstellen** setzt Archivierte auf `completed` und Papierkorb-Einträge auf `active`. Die Projekt-ID und die Aufgaben bleiben erhalten.
- **Endgültig löschen** ist bewusst **nur für leere Papierkorb-Projekte/Ordner** möglich. Vorher müssen Aufgaben und Unterprojekte verschoben bzw. anders behandelt werden. Beim bestätigten Löschen werden Titel, Ergebnis, Termin und Elternreferenz entfernt. Die technische ID verbleibt als unbenutzbare Synchronisationssperre (`deleted`), damit alte Geräte das Projekt nicht wiederbeleben können; dies ist daher technisch keine vollständige physische Löschung sämtlicher Metadaten.
- Erneutes oder mehrfaches Klicken auf „Anlegen“ verhindert Doppelanlagen: Sperre während des Speicherns und Gleichnamigkeitskontrolle innerhalb desselben Elternordners.
- Einkaufslisten verwenden ein Warenkorbsymbol; Checklisten ein Checklistensymbol, soweit die Standardsymbole nicht bewusst abweichend gewählt wurden.

## Wissenschaftlich zurückhaltender N-of-1-Coach

- V-Taper / Rücken- und Schulterübungen: Ein vorgeschlagener Strategieversuch wird ausdrücklich gestartet, nicht stillschweigend angeordnet.
- Baseline: mindestens zwei vorausgehende vollständige Trainingstage mit vergleichbarer Last.
- Auswertung: mindestens drei vergleichbare Folgetrainings über mindestens 14 Tage, gleiche Last. Wiederholungen, tatsächliche Pausen und RIR werden soweit dokumentiert verglichen.
- Mangelhafte Pausenmessung oder abweichende Last erzeugt keinen angeblich belastbaren Effekt.
- Versuche werden im verschlüsselten lokalen Tresor gespeichert; Abschluss friert eine kurze Befundinterpretation ein.
- Bei ausbleibendem Fortschritt kann der Coach die nächste einzelne Strategie vorschlagen, bei unzureichenden Daten zuerst bessere Messung. Fitdays-Segmente bleiben explorative Trends, kein hypertrophiespezifischer Beweis.

## Deployment (WICHTIG)

Die neue Zustandsverwaltung **erfordert ein Update des Cloudflare Workers** (`worker/src/projects.js`), sonst lehnt der ältere Worker die Statuswerte `archived`, `trash` und `deleted` ab. GitHub Pages deployt **nur die Web-App**. Bitte zuerst den Worker deployen (aus dem aktualisierten Repo, z. B. `npm install` und `npm run deploy:api`) und anschließend auf GitHub Pages den neuen Web-Build bereitstellen. Ohne API-Update bleibt die lokale Änderung gespeichert, aber die Projekt-Cloudsynchronisierung schlägt fehl. Kein SQL-Migrationslauf erforderlich.

## Prüfung

- `npm run check`: **1553/1553 Tests grün** (Node-Tests sowie Worker-Syntax).
- Vollständige Vite-Quelltext-Transformationskette und finale JS-Syntax geprüft.
- `npm run build` konnte hier nicht abgeschlossen werden, weil die im ZIP nicht enthaltenen Vite-Abhängigkeiten nicht lokal installiert sind (`vite: not found`). Nach Upload müssen die GitHub Actions einschließlich `npm run build` erfolgreich abschließen.
- Keine Live-Mobil-, Cloudflare- oder geräteübergreifenden Synchronisationstests behauptet.
