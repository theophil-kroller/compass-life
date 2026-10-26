# Compass Life 0.5.77.59.40.3 – Deploy-Fix zu GitHub Actions #280

Basis: bereits hochgeladener Build 0.5.77.59.40.3, Commit 82d168f.

Das Deployment wurde beim Schritt `npm run check` gestoppt, weil zwei ältere
Integrationstests die frühere Client-Version 0.5.77.59.40.2 fest erwarteten.

Die zwei korrigierten Tests lesen nun die im vollständigen Transformationslauf
tatsächlich erzeugte Client-Version und vergleichen sie mit dem Lockscreen-Build.
Dadurch bleibt die Prüfung streng und künftige Buildwechsel sind nicht mehr
an eine veraltete Testkonstante gebunden.

Nur Tests geändert. App, Worker, Vault, D1, CSS und die Standortfunktion sind
bytegleich zu Build 0.5.77.59.40.3. Kein Versionssprung.

Verifiziert: `npm run check`: 1516/1516 grün, Worker-Syntax erfolgreich.
Das tatsächliche GitHub-Deployment bleibt nach dem Upload zu prüfen.
