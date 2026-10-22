# Compass Life 0.5.76 – Ernährung quick kcal meter + erotische Gefühlsnuancen

Basis: **0.5.75**. Reine Frontend-Änderungen, keine Cloudflare-Worker-Änderungen und keine D1-Migration.

## Ernährung – Schnellerfassung
- Kompakte, sofort sichtbare kcal-Bandbreite aus **tatsächlich erfassten** Mahlzeiten; daneben grün / gelb / rot / dunkelrot als rechnerische Orientierung für Abnahme-Ziel, geschätzten Erhaltungsbedarf und Überschuss.
- Bisherige kcal-Bandbreite als horizontale Unsicherheitsspanne samt Mittelmarkierung; klare Hinweise, dass ein unvollständiger Tag keine tatsächliche Energiebilanz begründet.
- Der Balken wird erst bei freiwillig eingerichtetem persönlichen Ziel aktiviert. Im gesperrten Tresor keine Zahlen oder Schätzungen im Klartext.
- Neue Schnellwahleinträge unter Frühstück: Vollkorn-Toast mit Butter & Marmelade (1 Stück, ca. 140–260 kcal), Spiegelei (1 Stück, ca. 95–160 kcal), Schwarzbrot mit Butter (1 Scheibe, ca. 140–260 kcal). Zutaten- und Portionsabhängigkeit bleibt ausdrücklich sichtbar.
- Lattella-Titel und Study-Teller-Kachel gekürzt (ohne die Portion doppelt zu zeigen).
- **Nur noch eine Scrollleiste** im Ernährungs-Popup: Gesamt-Dialog scrollt, die Kachelliste nicht zusätzlich.

## Gefühle – Zuneigung
- Unterfamilie **Erotik & Begehren** mit lustvoll, sinnlich, erotisch angezogen, begehrend und verlangend.
- Direkter Einstieg im Zuneigungs-Dialog zu „Erotik & Begehren“, ohne verborgenes Untermenü. Freitextsuche zu Lust, erotisch, Begehren liefert differenzierte Vorschläge. Ein geloggtes Gefühl ist getrennt von körperlicher Erregung und sexuellen Impulsen erfassbar.
- Alte Check-ins und ihre Begriffs-IDs bleiben unverändert lesbar; freiwillig, privat, keine normative Bewertung.

## Verifikation
- Node.js Syntaxprüfungen und automatisierte Tests. Keine Live-Migration und kein heimlicher Eingriff in persönliche Daten.
