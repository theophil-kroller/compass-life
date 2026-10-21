# Compass 0.5.68.1 – Emotional Granularity & Gefühlswelt

Basis: Compass 0.5.68. Kein Datenbank-/D1-Migrationsschritt erforderlich.

## Feeling Wheel
- Bewährtes sechsteiliges Rad und die jeweilige **fünfstufige Wortskala** bleiben erhalten (z. B. Freude: Erfreut, Fröhlich, Glücklich, Begeistert, Euphorisch).
- Ergänzende **Farbintensität 1–10**, von dezent/entsättigt zu kräftig/satt. Sie zeigt exakt den vorhandenen Intensitätswert an; es gibt keinen zweiten unabhängigen Intensitätswert.
- Zwei freiwillige Stufen je Gefühl: **Gefühlsfamilie** und **präziser Begriff** (unter anderem Optimismus → Inspiriert).
- Optional aufklappbare **Bedeutungsimpulse**, ausdrücklich als mögliche Interpretation und nicht als Diagnose formuliert.
- Optional **Meine Vermutung**, **Körperzustand**, **Bedürfnis** und **Impuls**; absichtlich keine Pflichtfelder.
- Der globale Feeling-Wheel-Knopf oben ist kleiner und zurückhaltender.

## Insights → Gefühlswelt
- **Überblick**: Häufigkeiten pro Gefühl, Anzahl freiwilliger Check-ins, dokumentierte Tage und farbiger Tagesverlauf ohne Interpolation fehlender Einträge.
- **Chronik**: nach Datum sortierte Check-ins, 30 zuerst, dann schrittweises Nachladen.
- **Muster**: beobachtete Häufigkeiten und Brücke zu bestehenden Zusammenhängen; bei kleinen Datenmengen bewusst keine automatischen Behauptungen.
- **Feeling Inspector rechts**: Eintrag auswählen, präzise Angaben betrachten, später ändern; der ursprüngliche Zeitstempel bleibt erhalten. Layout passt sich kleinen Bildschirmen an.
- Bestehende Check-ins aus 0.5.65–0.5.68 bleiben im ursprünglichen Schema lesbar und können rückwirkend um neue optionale Felder ergänzt werden. Keine rückwirkende Datenänderung.

## Gesperrter Tresor
- Gefühls-Schnellerfassung ist **ohne Entsperren** nutzbar, nachdem die in 0.5.68 eingeführte verschlüsselte Schnellerfassung einmal im entsperrten Tresor eingerichtet wurde.
- Neue Gefühlseinträge werden über denselben **RSA-OAEP + AES-GCM**-geschützten Schreib-Puffer gespeichert, nicht als Klartext im Browser. Nach Entsperren werden sie idempotent in den verschlüsselten Tresor übernommen; erst danach wird die Pufferkopie bestätigt/entfernt.
- Die bestehende Gedanken-Schnellerfassung und verschlüsselte Backup-Struktur bleiben kompatibel.

## Technische Qualität und Grenzen
- 691 von 691 automatisierten Tests bestanden; einschließlich Prüffällen für Bestandseinträge, Intensität, Gefühlsnuancen, XSS-Schutz und tatsächliche Verschlüsselung gesperrter Check-ins.
- Worker/JS-Syntaxprüfungen erfolgreich.
- **Noch nicht live geprüft:** Produktiver Vite-Build (`vite: not found`) und visuelle Browserprüfung mit echten Gerätedaten.
- **Geräteübergreifende automatische Gefühls-Synchronisierung ist noch nicht implementiert.** Die bisherige Private-Mirror-Integration deckt Finance/Health ab, nicht das Gefühlstagebuch. Es gibt weiterhin verschlüsselte Tresor-Backups. Eine sichere, konfliktbewusste Zweiwege-Synchronisierung muss gesondert folgen.
