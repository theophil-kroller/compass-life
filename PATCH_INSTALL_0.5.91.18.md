# Compass Life 0.5.91.18 · Patch-Anwendung

1. **Grundstand prüfen:** GitHub `theophil-kroller/compass-life` → `main`, Version 0.5.91.17, Ausgangs-Commit `4878948460728faf9a2108ac8fc6c0c51c0ce4ff`.
2. Patch-ZIP entpacken und die enthaltenen Pfade relativ zur **Repository-Wurzel** hochladen, gleichnamige Dateien ersetzen. Keine Datenbankdateien oder echten Körpermessungen im Patch.
3. GitHub Actions abwarten und prüfen, ob der echte Vite-Produktionsbuild/Deploy erfolgreich ist.
4. Compass entsperren → **Smart Import Hub / Health Import Hub** → Datei aus Fitdays+ auswählen. Obwohl die Datei `.csv` heißt, wird der darin enthaltene Excel-XLS-Container erkannt. Vorschau: 12 Messwerte pro vollständigem Messzeitpunkt. Import bestätigen.
5. **Insights → Körper** öffnen. Region auf der Silhouette bzw. in der Bereichsliste auswählen; Details rechts (mobil unterhalb), wiederholte Messungen als Punkte im zeitlichen Verlauf.

Alternative: Full-Source-ZIP statt Patch vollständig verwenden. Keine automatische Übertragung der hier im Chat hochgeladenen Datei in deinen Compass-Tresor. Weitere Details unter `RELEASE_0.5.91.18.md`.
