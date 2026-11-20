# Compass Life 0.5.91.62 → 0.5.91.63

1. Einen **verschlüsselten Tresor-Export** sichern. Keine Nutzer-Datenbankdateien oder verschlüsselte Tresorinhalte ersetzen oder löschen.
2. Den **Patch ausschließlich auf Full-Source 0.5.91.62** anwenden. Inhalt des Patch-ZIPs im Repository-Stammverzeichnis an den bestehenden relativen Pfaden entpacken, geänderte Dateien überschreiben und neue hinzufügen.
3. Wenn dein Repository noch auf `0.5.91.61` steht, **nicht** nur den 0.5.91.63-Patch anwenden: zuerst 0.5.91.62 installieren oder direkt das neue **Full-Source-ZIP** als Quellbasis benutzen.
4. Änderungen committen; GitHub Actions **Deploy Compass Web** ausführen und insbesondere Vite-Build/Tests kontrollieren; dann Compass im Browser/PWA neu laden.
5. **System → Lokaler Tresor:** Inaktivitätszeit pro Gerät wählen (Standard 60 Minuten, bis zu 4 Stunden). Am Handy unabhängig einstellen. Manuelles Sperren testen.
6. **Heute / Forecast:** Prüfen, dass Google `Marketing ()` und Outlook `Marketing (GRO)` bei gleicher Terminzeit nur einmal erscheinen, echte unterschiedliche Termine jedoch erhalten bleiben.
7. **Heute / Protein:** Kleines `🌿 Daily Dozen X/24` anklicken und die Tagesdetails in **Insights → Ernährung → Daily Dozen** prüfen. Es handelt sich um bereits erfasste Portionen und Aktivitäten, nicht um einen Gesundheits-Score.

**Keine D1-Migration, kein Vault-Reset, keine Outlook-Bridge-Neuinstallation.** Die Quellarchive enthalten keinen fertigen `dist`-Ordner; der Vite-Build erfolgt beim GitHub-Deployment.
