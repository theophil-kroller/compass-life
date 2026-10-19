# Compass 0.5.22.1 – Garmin Activities.csv & sieben Lebensbereiche

**Basis:** 0.5.22. Nur Client und Tests, keine Änderung an Cloudflare Worker, D1 oder Kryptografie.

## Garmin Connect: Aktivitäten exportieren

1. Öffne https://connect.garmin.com/app/activities und exportiere deine Aktivitätsliste als CSV (z. B. `Activities.csv`).
2. In Compass: Wochenreview → Datenquellen aktualisieren → Garmin / Fitdays importieren; alternativ Insights → Datenquellen.
3. Vorschau prüfen: Die Datei muss **Garmin-Trainingssessions** erkennen, nicht Fitdays-Körpermessungen. Anschließend bestätigen.
4. Nach dem Import: Insights → Aktivitäten → „Importierte Trainingsaktivitäten“ und „Sport & Freizeit“.

Die Garmin-Activities-CSV wird anhand der **Spalten** `Activity Type`, `Date`, `Title`, `Distance`, `Time` erkannt, nicht blind nur anhand des Dateinamens. Fitdays-CSV und -XLS bleiben separat. Der Parser unterstützt korrekt zitierte CSV-Felder und Zeitdauern, übernimmt nur belegte Sessions und dedupliziert mehrfach importierte Aktivitäten mit stabilen IDs.

**Dateninterpretation:** Ein Garmin-Activities-CSV-Zeitstempel enthält keine Zeitzone. Die Uhrzeit wird deshalb als lokale Angabe ohne implizite UTC-Konvertierung dargestellt. Die Zahlen der Spalte „Distance“ tragen keine explizite Einheit; der Parser behandelt sie für diese Exportform vorläufig als Kilometer. Falls dein Garmin-Connect-Profil Meilen exportiert, darf diese Streckenangabe nicht als verlässlicher Kilometerwert verwendet werden. Ein Export mit dokumentierter Einheit oder FIT-Datei ist vorzuziehen. FIT- und CSV-Dateien derselben Aktivität können unterschiedliche Zeitbasen verwenden und daher unter Umständen **nicht automatisch miteinander abgeglichen** werden. Keine GPS-Routen, keine Einzelprodukte, keine Rohdateien im Vault.

## Lebensziele und Demartinis sieben Bereiche

Unter Planen → Projekte → Lebensziele & Projekte können bestehende und neue Lebensziele freiwillig einem der sieben Bereiche zugeordnet werden: mental, beruflich, finanziell, familiär, sozial, körperlich und spirituell. Die Compass-Aufgaben-/Projektbereiche (z. B. Forschung, Lehre) werden dadurch **nicht ersetzt**. Die Funktion ist eine optionale Orientierung am Modell „Master Planning for Life“, kein Werte- oder Balance-Score; vorhandene Ziele bleiben ohne Zuordnung gültig. Daten bleiben lokal verschlüsselt, geräteübergreifende Synchronisation der Ziele ist noch nicht implementiert.

Quelle zum Rahmenmodell: https://drdemartini.com/blog/seven-areas-to-empower

## Qualität und Grenzen

- `npm run check`: 286 Tests bestanden; einschließlich sechs neuer Tests für echte CSV-Formaterkennung, Wiederimport, Sportzuordnung und optionale Lebensbereiche.
- Produktionsbuild in dieser Umgebung nicht ausführbar (`vite: not found`). GitHub Actions muss `npm run build` ausführen; reale Browser- und Android-Abnahme ausstehend.
- Kein echter Garmin API-Zugriff erforderlich: Datei bleibt auf dem Gerät, sofern sie in der installierten Compass-PWA eingelesen wird.
- Vor Update: verschlüsseltes Vault-Backup erstellen. Nach dem Update bestehende Imports und Aufgaben prüfen.
