# Compass Life 0.5.77.54 — GTD First · On-Demand Analytics

**Basis:** GitHub `main`, Commit `cb7d7cf0b3d0108362ad1cc3722cc3fbc2f42922`, erfolgreiches Actions-Deployment #215, Compass 0.5.77.53.

## Architektur
- Finance-Überblick und Finance-Detaildashboard werden mit `import()` erst bei tatsächlichem Öffnen des Finanzbereichs geladen.
- Die fünf rendererlastigen Insights-Modulgruppen (Schlaf/Allgemein, Wellness, Fitness, Produktivität, Explore) werden erst nach Öffnen von Insights importiert.
- Deren kleine Navigationsmetadaten sind ausgelagert (`lazy-routes-v57754.js`); dadurch bleibt die normale GTD-Navigation ohne Renderermodule nutzbar.
- Gemeinsamer On-Demand-Loader mit deduplizierten Imports, Fortschritt aus tatsächlich fertig geladenen Modulen, Wiederholen bei Ladefehlern und einmaliger Initialisierung je App-Lauf.
- Die Ladeansicht zeigt die Anzahl geladener Modulgruppen und eine daran gekoppelte Fortschrittsanzeige. Sie wartet **nicht künstlich** auf einen Timer.
- Kein Prefetch dieser Analysen durch die neuen Loader. Bereits geladene Module bleiben während der Sitzung erhalten.

## GTD und Sperrbildschirm
- Locked State besitzt eine vollflächige dunkelgrüne Shell mit Passwortfeld; keine normale Insights-/Finanzoberfläche und keine Dummy-Aufgaben im Hintergrund.
- Nach Entsperren öffnet standardmäßig **Heute**, außer ein explizites Deep Link / Quick Capture fordert anderes an.
- Cloud-Sync löst beim **Beginn** keinen vollständigen Render mehr aus. Die Abschlussaktualisierung bleibt zur Sicherstellung frischer Konflikt-/Planungsdaten erhalten.
- Beim Aufruf von Insights werden nicht mehr unmittelbar drei unabhängige Remote-Refreshes gestartet, die die frisch aufgebaute Seite mehrfach ersetzen könnten. Bereits im Tresor verfügbare Daten können direkt dargestellt werden. Explizite Quellen-Aktualisierungen bleiben nutzbar.
- Keine Änderung an Aufgabenaktionen, GTD-Fachlogik, Vault-Verschlüsselung, Worker, D1 oder Synchronisationsprotokoll.

## Einschränkungen und Folgearbeit
- Die `main.js`, einige gemeinsam verwendete Analyse-Utilities und `style.css` werden noch initial mitgeladen. Dies ist **Phase 1** der Code-Splitting- und Performance-Sanierung, nicht vollständige Modularisierung.
- VitePWA/Workbox kann bei der PWA-Installation Assets für Offline-Nutzung vorab cachen. Der neue Code löst die Analyseberechnungen dennoch erst bei Bedarf aus.
- Auch am **Ende** der Cloud-Synchronisation können noch große UI-Neuzeichnungen entstehen; diese werden im GTD-Performance-Folge-Build gezielt ersetzt, sobald Datenänderungen zuverlässig identifizierbar sind.
- Produktive Ladezeit/INP muss mit Nutzer-Vault auf Windows/Android gemessen werden. `30/30` lokale Regressionstests bestanden; ein GitHub-Actions-Produktionsbuild ist erst nach Upload prüfbar.
