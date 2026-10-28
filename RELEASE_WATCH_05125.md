# Compass Web · Watch Bridge 0.5.12.5

Basis: Compass Web Watch Bridge 0.5.12.4. Zwei neue Komponenten: `client/src/watch-projection-v5125.js` und Integration in `main.js`.

- Kein zusätzlicher Google-Login, keine Cloudflare-Migration, kein neuer Worker notwendig (der 0.5.12.4-Worker akzeptiert das bestehende Datenformat).
- Bei online entsperrtem Tresor automatischer Snapshot mit Arbeitskollegen und offenen Agenda-Titeln, ohne zusätzliche Einzel-Freigabe.
- Nur `relationKind=colleague`; voller Name im Titel eines kommenden Termins ist nötig, um diesen Kollegen kalenderbezogen vorzuziehen. Kein Raten anhand eines allgemeinen "Jour fixe".
- Nathanaels ganztägige Schularbeiten im 10-Tage-Fenster werden als `N:` übertragen. Mehr Varianten der präfixierten Namensschreibweise und Schulprüfungen unterstützt.
- Änderungen im lokalen Tresor lösen nach dem Speichern einen entprellten Watch-Snapshot aus. Fehlgeschlagene Uploads werden nicht als synchronisiert markiert.
- Bestehende Einkaufsliste, Projekte und Datenbanken bleiben unverändert.

**Datenschutz:** In diesem Modus sind Namen und Agendatitel in der authentifizierten, zeitlich begrenzten Cloudflare-Datenbank lesbar (kein E2EE bis zur Uhr). Private Kontakte, Notizen, E-Mail-Adressen und Kontakthistorie werden nicht übertragen. Der bisherige explizite Freigabe-Button entfällt. Für streng vertrauliche Gesprächspunkte ist dies keine geeignete Übertragungsform.

**Installation:** Web-Patch im Repo übernehmen, Github Pages deployen, Web-App online und entsperrt öffnen. Garmin 0.5.12.5 installieren, neu starten und synchronisieren. Bestehender Worker mindestens Stand 0.5.12.4.
