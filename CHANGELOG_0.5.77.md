# Compass 0.5.77 — Erholungs- & Event-Recherche

Basis: Compass 0.5.76.1 (FULL SOURCE 0.5.76 plus alle Folgekorrekturen aus 0.5.76.1).

## Neu

- Entdecken / Erholung: direkte, nebeneinander stehende Interessen-Filterchips statt scrollbar verstecktem Checkbox-Dropdown. 10 Filtergruppen, einschließlich Alternative Workshops.
- 10 manuelle Recherche-Buttons: vollständiges Kinoprogramm; Kino/Kabarett; Konzert/Musical; Oper/Theater/Ballett; Tanz/Festivals; Museum/Ausstellung/Kultur; Passivsport; Aktivsport/Bujinkan; Wintersport; Alternative Events/Workshops.
- Kinoprogramm: alle belegbaren aktuellen Filmtitel statt nur Highlights; reguläres Kino und Programmkinos/Arthouse, Dokumentar- und Bergfilmfestivals (u.a. Mountainfilm, Anderswo/Anderstwo). Für nachgewiesene Vorführungszeiten sind Kinovorführungen nach Stadt, Kino und Uhrzeit unterscheidbar.
- Bühne: Graz UND Wien; Zouk und Kizomba Festivals europaweit und mit längerer Vorschau.
- Alternativ-Suche: Schwelle, Shibari/Kinbaku, Tantra, Körperarbeit, Cesta/Petr und ISTA School of Temple Arts.
- Wintersport: nur offizielle Saison- bzw. Betriebsangaben, statt vermeintlichem Live-Status. BMX/MTB mit Augenmerk auf geeignete Kinder-/Jugendteilnahme.
- Klick auf Recherchebutton kopiert den recherchierbaren Prompt; falls Clipboard-Zugriff blockiert ist, ist der Prompt im Importbereich manuell kopierbar. Kein automatischer OpenAI-API-Aufruf.
- Die aus ChatGPT eingefügten JSON-Ergebnisse bleiben weiterhin explizit zweistufig: **Import prüfen → Import bestätigen**.
- Bis zu 2.000 Eventeinträge und 4 MB JSON pro Import; wegen Modell-Ausgabelimits empfehlen die Promptvorlagen Teillieferungen mit höchstens 250 Einträgen pro Antwort.
- Erneute Importe aktualisieren vorhandene Veranstaltungen und das Feld `lastImportedAt` ohne Löschung ihrer Merkliste/Statusinformationen. Pro Recherchebutton zeigt Compass den jüngsten Import; pro Eventkarte das letzte bestätigte Importdatum. Bei alten Einträgen ohne Zeitstempel wird dies transparent angegeben.
- Worker-Lesegrenze für Discovery-Events von 1.500 auf 5.000 angehoben; keine D1-Migration nötig.

## Daten & Abwärtskompatibilität

- Bisherige Schlüssel für alle vorhandenen Veranstaltungen bleiben stabil. Lediglich neue Kinovorführungen mit `startTime` erhalten einen zusätzlichen kompakten Kino-/Uhrzeit-Schlüssel. Ohne `startTime` wird das Legacy-Dublettenverhalten beibehalten.
- Metadaten für den letzten Import werden im Eventobjekt gespeichert und mit der vorhandenen Eventsynchronisierung übertragen. Die Recherchegruppen-Historie wird zusätzlich im lokalen Tresor hinterlegt; auf anderen Geräten kann sie aus synchronisierten Events rekonstruiert werden.
- Keine Löschung oder Migration bestehender Vault-, Finanz-, Gesundheits- oder Kontaktinformationen.

## Verifikation

- `npm test`: alle 802 Tests bestanden.
- `npm run check -w worker`: bestanden.
- `node --check` für betroffene JavaScript-Module: bestanden.
- `npm run build -w client`: lokal nicht ausführbar, da `vite`/Node-Dependencies in dieser Umgebung nicht installiert sind. Produktionsbuild ist durch GitHub Actions zu verifizieren.
- Kein Live-Browser-/Cloudflare-Deployment in dieser Sitzung durchgeführt.
