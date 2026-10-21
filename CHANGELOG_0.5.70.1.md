# Compass 0.5.70.1 – Journal-Sync und mobile Quick Actions (Hotfix)

## Behebung
- Zeitjournal, Arbeitszeit, Ernährung und Miracle-Morning-Journal lösen nach verschlüsselter Vault-Speicherung sofort einen dedizierten Cloud-Abgleich aus, statt erst beim verzögerten Planungssync.
- Beim Öffnen der Arbeitszeit-Schnellerfassung wird der Journal-Stand aus der Cloud abgefragt; beim Zurückkehren in die App (visibilitychange) und nach einer Offline-Unterbrechung ebenso.
- Änderst du während eines laufenden Abgleichs noch etwas, wird danach erneut synchronisiert. Parallele Journal-Synchronisierungsanfragen benutzen denselben laufenden Auftrag.
- Die Anzeige „Planung + privater Geräteabgleich“ wird durch einen differenzierten Journal-Status ersetzt. „Journal abgeglichen“ erscheint nur nach bestätigtem E2EE-Abgleich; sonst „Journal lokal“ oder „Journal gleicht ab“.
- Mobile obere Symbolleiste ist wie die linke Navigation seitlich scrollbar (Icons bleiben kompakt). Quick Panels passen sich der Smartphone-Breite an und bleiben im sichtbaren Bildschirm.
- Überflüssige Anleitungssätze im Arbeitszeit- und Habit-Popover entfernt.

## Sicherheit, Synchronisierungsgrenzen
- Cloudflare Worker/D1 sieht weiterhin ausschließlich Ciphertext für das Journal (bestehender Worker mit Journal-API und Migration 0018 vorausgesetzt).
- Sofortabgleich funktioniert bei **entsperrtem Tresor**, gültiger Compass-Anmeldung, vorhandener privater Geräteverbindung und Online-Zustand.
- Bei **gesperrtem Tresor** werden Ereignisse zunächst nur verschlüsselt auf dem jeweiligen Gerät vorgemerkt; ihre Cloud-Synchronisierung beginnt erst nach Entsperren. Sofort-Cross-Device bei gesperrtem Tresor wäre eine gesonderte eingeschränkte Schlüsselarchitektur und ist noch nicht Bestandteil dieses Builds.
- Ohne konfigurierten privaten Geräteabgleich auf beiden Geräten bleibt Journal lokal. Ein grüner globaler Cloud-Indikator beweist für sich keinen Journal-Abgleich.
- Die tatsächliche Synchronisierung zwischen zwei persönlichen Geräten konnte in dieser Testumgebung nicht live verifiziert werden. Prüfen: Beim Handy eingestempelt → bestätigten Sync abwarten → Laptop-Quick Tool öffnen → Uhrzeit und Kategorie vergleichen → am Laptop ausstempeln → am Handy erneutes Öffnen.
- Kein Vault-Reset und keine neue D1-Migration.

## Tests
- Bisherige 713 Node-Tests bleiben grün, fünf neue statische Kontrolltests für den sofortigen Journal-Pfad und mobiles Layout hinzugefügt.
- JavaScript-Syntax geprüft. Vite-Produktionsbuild und echte Browserabnahme hier nicht durchgeführt (Abhängigkeiten nicht installiert).
