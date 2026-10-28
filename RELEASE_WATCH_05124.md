# Compass Web / Watch Bridge 0.5.12.4

* Projekt-Einkaufsartikel werden nach Projekt-/Ordnerzuordnung aus normalen GTD-Next-Actions ausgeschlossen; Tasks bleiben in der jeweiligen Einkaufsliste vorhanden.
* Mobil: Kurzlinks für Archiv und Papierkorb in der Projektnavigation, nutzen die bestehende sichere Projekt-Lebenszykluslogik.
* Watch Bridge: Wahl einer aktiven konkreten Einkaufsliste (List-ID), deduplizierte Titelanzeige pro Liste, serverseitige Zuordnung beim versionierten Abhaken und keine Vermischung mit Vorlagen.
* Kinder-Schularbeiten aus dem vorhandenen lokalen Google-Kalenderarchiv für das 10-Tage-Fenster mit `N:` an Garmin übertragen; kein neuer Google-Import. Für die Freigabe muss die Compass-Web-App online entsperrt und der Auszug veröffentlicht werden.
* Optional: Personen-Liste für die Garmin. Opt-in bei Menschen, standardmäßig aus. Höchstens 24 Namen mit bis zu vier offenen Agendatitel; niemals private Notizen. Die reduzierten Daten werden kurzzeitig als lesbares JSON in der authentifizierten Cloudflare-Datenbank zwischengespeichert. Zustimmung kann widerrufen werden; danach ist für das Leeren des Uhrensnapshots eine erneute erfolgreiche Synchronisation nötig.
* GitHub-Pages-Deployment allein aktualisiert Cloudflare nicht. Worker-Code separat deployen. Keine neue D1-Migration erforderlich.
* Lokal erfolgreich: 1568/1568 Web-Tests und 11/11 gezielte Watch-Bridge-Tests; keine erfolgreiche Live-Synchronisation behauptet.
