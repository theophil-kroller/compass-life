# Compass 0.5.70.4 — Synchronisierung des laufenden Arbeitszeit-Timers

## Behoben

- **Laufender Timer verschwindet auf dem zweiten Gerät:** Die Journal-Zusammenführung hat bis 0.5.70.3 jeweils die Uhr mit dem neuesten `updatedAt` übernommen. War das ein leerer Status auf dem Laptop, konnte er einen laufenden Handy-Timer überschreiben, obwohl kein Stopp-Ereignis existierte.
- Die Zusammenführung wertet nun **offene Starts und abgeschlossene Zeitintervalle getrennt** aus. Ein Start bleibt offen, solange kein abgeschlossenes Zeitintervall mit demselben Start vorhanden ist.
- Tatsächlich ausgestempelte Intervalle schließen den zugehörigen Start auch dann, wenn ein anderes Gerät noch einen veralteten offenen Status anzeigt.
- Die Zusammenführung bleibt symmetrisch und wiederholbar, erhält ältere Arbeitsintervalle sowie Gefühls- und Ernährungseinträge.

## Umfang

- Korrektur in `client/src/personal-journal-v5692.js` und Versionserhöhung auf `0.5.70.4`.
- Keine neue D1-Migration, keine Änderung am Cloudflare Worker, keine Änderung am Verschlüsselungsformat.
- **734/734 automatisierte Tests** bestanden, davon sechs zusätzliche Tests zum offenen Timer und zu echten Stopps.

## Einschränkungen

- Der Fix kann einen Timer nur dann wiederherstellen, wenn auf mindestens einem Gerät oder in der verschlüsselten Cloud-Kopie noch der offene `activeStart` vorhanden ist. Bereits auf **allen** Geräten und in der Cloud überschriebene Startzeitpunkte lassen sich nicht automatisch rekonstruieren.
- Ein echtes geräteübergreifendes Browser-Ende-zu-Ende-Experiment ist in der Entwicklungsumgebung nicht durchgeführt worden.
- Bei gesperrtem Tresor werden Erfassungen weiterhin lokal verschlüsselt vorgemerkt und erst nach dem Entsperren zur Cloud übertragen.
