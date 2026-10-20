# Compass 0.5.52 – Jahres-Schlafverteilung & verschlüsselter Geräteabgleich

## Schlaf / Insights

- Im bestehenden 12-Monats-Bereich wechseln die Pfeile zwischen **Monat → Woche → Tag**; alternativ direkt über kleine Umschalter.
- **Monat:** ein Boxplot und die tatsächlich gemessenen Einzelpunkte je Monat (Median, IQR, beobachtetes Minimum und Maximum).
- **Woche:** entsprechend feinere Verteilungen je Kalenderwoche im **selben Jahresfenster**.
- **Tag:** Einzelpunkte aller erfassten Nächte desselben Jahreszeitraums, statt Monatsmittelwerte. Punkte können für die Nacht-Detailansicht angeklickt werden.
- Skalierung in Stunden & Minuten. Fehlende Tage werden nicht als Nullstunden oder künstliche Messungen gezählt; die erfasste Anzahl steht im Diagramm.
- Kompakte Darstellung, Monats-Heatmap bleibt einklappbar; die übrigen Health-/Finanz-/GTD-Ansichten bleiben bestehen.

## Geräteabgleich / Fehler invalid-payload

- Verschlüsselter Health-/Finance-Mirror unterstützt große historische Datenpakete nun per **mehrteiligem E2EE-Transport**.
- Das Frontend verschlüsselt zuerst vollständig im Browser, teilt dann **nur Base64-Ciphertext** in begrenzte Pakete, versendet diese sequenziell und bestätigt erst nach vollständigem Upload.
- Der Worker veröffentlicht den neuen Snapshot erst nach Vollständigkeitsprüfung und Versionsvergleich (optimistic CAS). Bis dahin bleibt die bisherige Cloud-Version erhalten.
- Empfänger laden alle Teile und entschlüsseln ausschließlich lokal. Alte Teile werden wegen paralleler Downloads nicht sofort beim Commit gelöscht.
- Kleine bestehende Mirror-Snapshots nutzen weiterhin den bisherigen Transport.
- Feste Grenzen schützen vor übergroßen Paketen; falls diese überschritten werden, bleibt der lokale Vault unverändert und eine verständliche Fehlermeldung wird angezeigt.

## Installation

**Neue D1-Migration: `0017_private_device_chunks.sql`.** Erst D1-Migration anwenden, **dann Worker 0.5.52 deployen**, danach Pages-Frontend aktualisieren. Ein reiner Frontend-Upload behebt `invalid-payload` nicht.

Die Ursache des konkreten Bildschirmfehlers wurde nicht anhand eines live abgegriffenen Sync-Pakets verifiziert. Das alte `invalid-payload`-Limit war jedoch reproduzierbar im Worker-Code; die Erweiterung behebt die Größenbeschränkung für Pakete innerhalb der neuen sicheren Obergrenze. Andere Ursachen bleiben möglich.

Keine bestehenden Vault-, Garmin- oder Finanzdaten werden durch dieses Update migriert oder gelöscht. Vor dem Cloud-Deployment wird ein lokales Vault-Backup empfohlen.

## Qualitätsprüfung

- Automatisierte Tests: **553/553 bestanden**, inklusive neuer Jahresgruppen und D1-/Chunk-Commit-Tests.
- Worker JavaScript-Syntaxcheck bestanden.
- End-to-End-Cloudflare-D1-Deployment und Live-Abgleich mit echten historischen Garmin-Daten sind noch nicht durchgeführt; vor produktivem Einsatz überprüfen.
