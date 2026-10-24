# Installation – Compass 0.5.77.36

1. Prüfen: Die App zeigt 0.5.77.35 (oder das GitHub-Repository enthält die .35-Bridge).
2. Das ZIP **entpacken**. Die im ZIP enthaltene Ordnerstruktur ist das Wurzelverzeichnis deines GitHub-Repositories `theophil-kroller/compass-life`.
3. Alle Dateien und ihre Ordnerstruktur in GitHub hochladen. Bestehende `client/vite.config.js` ersetzen; alle .36-JavaScript- und CSS-Dateien neu hinzufügen.
4. Commit auf `main`, GitHub Actions Deployment prüfen. Browser ggf. mit Hard-Reload öffnen. Versionsanzeige sollte `0.5.77.36` lauten.
5. Unter Ernährungsschnellerfassung einmal vor/nach 11 bzw. 15 Uhr Kategorien überprüfen; dein Handy zeigt seine lokale Uhrzeit. Bei der Kachel **Mein Smoothie** einen Eintrag speichern, im Tagebuch öffnen, Gramm einzelner Zutaten anpassen.
6. Unter Insights → Ernährung → Pflanzenstoffe die drei Stoffklassen und ihre Quellennachweise prüfen. Werte sind Literaturreferenzen, keine unmittelbare gemessene antioxidative Körperwirkung.

**Sicherheit:** Nicht die älteren `.27`–`.35` Builds erneut hochladen. Bei Deploy-Fehler zunächst GitHub Actions Log prüfen und nicht blind ältere Source-Dateien ersetzen. Keine Vollkopie privater Vault-Daten hochladen.
