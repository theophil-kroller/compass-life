# Compass Life 0.5.77.55.1 — Deployment Hotfix & echte Menü-Ladepunkte

**Basis:** 0.5.77.55 liegt auf GitHub `main`, aber Actions-Lauf #217 scheiterte beim Produktionsbuild; #216 (.54) ist letzter erfolgreich deployter Stand.

- Korrigiert den Vite-Buildfehler: `.55` erwartete eine `shell` und ein Branding aus der Zeit vor `.51`. Die tatsächliche `.51`-Markenstruktur wird nun unverändert weiterverwendet.
- Ein Klick auf den Oberpunkt **Insights** oder **Finanzen** öffnet unmittelbar dessen Startansicht. Die bestehende `.54`-Ladeanzeige startet beim ersten Aufruf auf diesem Klick; keine Verzögerung bis zum zusätzlichen Klick auf `Überblick`.
- Focus/Extended, GTD-Tagesansicht und lokale Aufgabenmutationen unverändert.
- Schnelleres Entsperren bei unverändertem Tresor: Kein vollständiges Neuversionieren/Verschlüsseln aller Daten direkt nach jedem Unlock. Ein verschlüsselter Startzustand wird weiterhin gespeichert, wenn ältere fehlende Datenstrukturen ergänzt oder veraltete Veranstaltungen entfernt wurden. Wiederherstellungs- und nachfolgende Nutzerdatenänderungen bleiben zuverlässig über die bestehenden Speicherpfade abgesichert.
- Präzisere Laufzeitdiagnose: `Tresor: Entschlüsseln`, `Tresor: Entwürfe laden`, `Tresor: Startzustand speichern`. Diese opt-in Messwerte helfen, den beobachteten Unlock-Overhead zu lokalisieren; die AES-GCM-Verschlüsselung bleibt unverändert; nur ein redundanter Schreibvorgang entfällt, wenn nichts geändert wurde.
- Keinerlei Änderungen an persönlichen Daten, Worker, D1 oder Vault-Format.

**Wichtig:** Der vom Nutzer bereitgestellte Export ist ausdrücklich aus 0.5.77.54; er enthält keine Unlock- oder Today-Messungen. Die Performance-Analyse ist daher noch nicht ausreichend, um die genaue Ursache der längeren Entsperrzeit zu behaupten.
