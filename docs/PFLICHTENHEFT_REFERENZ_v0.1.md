# Pflichtenheft – Personal Life Manager

**Arbeitstitel:** Compass – Personal Life & Productivity Management  
**Version:** 0.1 (Spezifikationsentwurf)  
**Stand:** 16. Oktober 2026  
**Status:** Fachliche und technische Planungsgrundlage, noch kein implementiertes Produkt  
**Betriebsmodell:** Primär persönliche Nutzung; Plattformen Windows/Browser, Android und perspektivisch Garmin fēnix 7S  
**Produktprinzip:** „Weniger im Kopf behalten. Besser entscheiden. Mehr Zeit für das, was wichtig ist.“

## 1. Auftrag, Zielbild und Abgrenzung

### 1.1 Ausgangssituation
Der Nutzer verantwortet gleichzeitig Projekte in Lehre, Forschung, wissenschaftlicher Qualifizierung, Praxis-/Softwareentwicklung sowie Familie, Beziehungen, Bewegung und privaten Vorhaben. Informationen gelangen aus Kalendern, Gesprächen, E-Mails, ChatGPT, spontanen Gedanken und anderen Quellen in den Alltag. Bisherige Task-Manager ermöglichen die Verwaltung, erzwingen aber wiederkehrende manuelle Neuorganisation. Langfristige Vorhaben verlieren dabei regelmäßig ihre nächste konkrete Handlung; Aufwand und verfügbare Zeit werden nicht hinreichend abgeglichen.

### 1.2 Zielsetzung
Compass ist ein persönliches, geräteübergreifendes Steuerungssystem auf Grundlage von **Getting Things Done (GTD)**. Es ermöglicht verlässliches Erfassen, Klären, Organisieren, Reflektieren und Ausführen; ergänzt dies durch kalendergestützte Planung, zeitbezogene Erfahrungswerte, verständliche Handlungsempfehlungen und sichtbaren Fortschritt. Das Leitmotiv ist **Relaxed Control**: nicht möglichst viele Aufgaben, sondern Vertrauen, Überblick, Fokus und bewusste Entscheidungen.

### 1.3 Erfolgsmerkmale
- Jede offene Verpflichtung hat einen verlässlichen Ort; ein Fälligkeitsdatum ist optional.
- Für jedes aktive, handlungsbereite Projekt lässt sich eine Next Action identifizieren oder bewusst dokumentieren, warum keine vorliegt.
- Der Weekly Review ist ein geführter, regelmäßig nutzbarer Workflow, keine bloße Filteransicht.
- Tagesempfehlungen berücksichtigen Kontext, Zeit, Dringlichkeit, Wichtigkeit und persönliche Autonomie und legen ihre Begründung offen.
- Kalender und Arbeitsaufwand machen Überplanung frühzeitig sichtbar.
- Projekt- und Kompetenzfortschritt ist visuell nachvollziehbar, ohne menschliche Beziehungen oder Erholung zu einer Leistungskennzahl zu degradieren.
- Smartphone, Desktop und später Garmin nutzen denselben Datenbestand; Offline-Änderungen gehen nicht unbemerkt verloren.

### 1.4 Nichtziele der ersten Version
Kein vollständiger Asana-Team-Ersatz, keine automatisierte KI-Entscheidungsinstanz, keine therapeutische oder medizinische Interpretation von Garmin-Daten, keine vollautomatische E-Mail-Versendung, keine Übernahme sämtlicher Kommunikation oder sozialer Kontakte, kein durchgehendes GPS-Tracking und kein autonomes Verändern privater Kalender ohne Bestätigung.

### 1.5 Verbindliche Prioritätsklassen
- **MUSS / P0:** Für das erste alltagstaugliche Release erforderlich.
- **SOLL / P1:** Nach P0, aber im Zielsystem fest eingeplant.
- **KANN / P2:** Optionale oder technisch gesondert zu prüfende Erweiterung.
- **SPIKE:** Kurzer, isolierter Machbarkeitstest; noch keine Zusage zur Produktintegration.

## 2. Grundlegende Fachlogik

### 2.1 GTD-Objekte
- **Inbox Item:** Ungeklärter Eingang aus Text, Sprache, Import, Teilen oder manueller Erfassung.
- **Area of Focus:** Dauerhaft verantworteter Lebensbereich, z. B. Lehre, Forschung, Familie, Gesundheit.
- **Goal/Outcome:** Erwünschtes Ergebnis auf mittlere/lange Sicht; kann Projekte und Routinen verknüpfen.
- **Project:** Ein Ergebnis, das mehr als eine Handlung erfordert; Aktiv/On Hold/Completed/Cancelled.
- **Task/Next Action:** Konkrete, ausführbare Handlung; selbstständig oder innerhalb eines Projekts.
- **Context:** Kombination aus Ort, verfügbaren Ressourcen, Person, Arbeitsmodus und Energieanforderung.
- **Agenda Item:** Gesprächs- bzw. Klärungspunkt mit Person, Meeting oder beiden.
- **Waiting For:** Delegierter/offener Punkt mit erwarteter Rückmeldung, optionalem Wiedervorlagedatum.
- **Someday/Maybe:** Nicht aktiver Wunsch oder mögliches späteres Vorhaben.
- **Defer/Available From:** Vor diesem Datum nicht relevant oder nicht ausführbar; kein Ersatz für Due Date.
- **Due Date:** Echte äußere oder selbst bewusst gesetzte Fälligkeit; niemals für Ordnung künstlich erzeugen.
- **Review Rule:** Individuelles Review-Intervall für Projekte, Agendas und längerfristige Verpflichtungen.
- **Focus Session/Time Entry:** Arbeitsabschnitt mit real erfasster Dauer und Zuordnung.

### 2.2 Trennung von Zuständen und Daten
Fälligkeit, Start-/Verfügbarkeitsdatum, geplanter Arbeitsblock, Erinnerungszeitpunkt und Review-Datum müssen getrennte Felder sein. Eine nicht fällige Aufgabe ist weder automatisch dringlich noch überfällig. Eine Aufgabe darf mehreren Kontexten zugeordnet sein. Person und Meeting sind eigenständige Entitäten und können mit denselben Agenda-Punkten verknüpft werden, ohne Daten zu duplizieren.

### 2.3 Grundsatz der Nutzerautonomie
Compass macht Vorschläge, zeigt Konflikte und erinnert bei geeigneten Reviews. Das System darf Projektstatus, externe Termine, Kontakte und Gesundheitsinterpretationen nicht stillschweigend ändern. Zeit für Erholung wird als geschützte Ressource respektiert.

## 3. Funktionale Anforderungen

### 3.1 Erfassung und Inbox
**FR-001 [P0] Quick Capture.** Freie Texteingabe auf Desktop und Android mit direkter Speicherung in der Inbox, ohne Pflichtfelder außer Inhalt. Eingang von jeder Hauptansicht aus erreichbar.  
**FR-002 [P0] Inbox Processing.** Ein Eintrag ist schrittweise klärbar: löschen/archivieren, Referenz, Aufgabe, Projekt, Agenda, Waiting For, Someday/Maybe, Termin oder Einkaufsliste. Splitten in mehrere Einträge ist möglich.  
**FR-003 [P0] Eingangsmetadaten.** Zeit, Quelle, Ersteller, Verarbeitungsstatus, Originaltext und Änderungsinformationen werden bewahrt.  
**FR-004 [P1] Spracheingabe.** Audioerfassung über Smartphone; Transkription per lokalem Whisper-Workflow, sofern verfügbar, mit manueller Korrektur. Ohne erreichbaren Transkriptionsdienst bleibt die Aufnahme lokal in einer Warteschlange bzw. Eingabe per Tastatur nutzbar.  
**FR-005 [P1] Teilen/Import.** Inhalte per Android-Share-Sheet, Zwischenablage, Datei/JSON oder einfachen vordefinierten Importformaten aufnehmen.  
**FR-006 [P1] KI-Vorschläge.** Optionale Klassifizierung und Next-Action-Vorschläge mit Voransicht und Bestätigung; KI darf unbestätigte Klassifikationen nicht als Gewissheit darstellen.

### 3.2 Aufgaben, Projekte, Kanban und Kontexte
**FR-010 [P0] Aufgabenfelder.** Titel, Notiz, Status, Area/Projekt, Priorität, geschätzte Dauer, Kontext(e), Energiebedarf, Defer, Due, Review, optionale Person und optionaler Termin.  
**FR-011 [P0] Projekttypen.** Sequentielle und parallele Projekte; im sequentiellen Fall wird nur die erste nicht blockierte Handlung als verfügbare Next Action ausgewiesen.  
**FR-012 [P0] Abhängigkeiten.** Erledigte Vorgänger machen nachfolgende Handlungen verfügbar; zyklische Abhängigkeiten müssen abgewiesen werden.  
**FR-013 [P0] Ansichten.** Inbox, Heute, Next Actions, Projekte, Agendas, Waiting For, Someday/Maybe und Reviews; Listen- und Kanban-Ansicht für geeignete Daten.  
**FR-014 [P0] Kontexte.** Mehrfach-Zuordnung zu Ort (Büro/Wohnung/unterwegs), Werkzeug (Laptop/Telefon), Person und Modus (Deep Work/Administration); manuell wählbar.  
**FR-015 [P0] Wiederholung.** Fixe und ab Abschluss berechnete Wiederholungsregeln, inklusive Auslassen und manueller Verschiebung ohne Endlosschleifen.  
**FR-016 [P1] Projektgesundheit.** Warnungen bei fehlender Next Action, stagnierendem Projekt, gefährdetem Meilenstein und fehlendem Review.  
**FR-017 [P1] Custom Perspectives.** Gespeicherte Kombinationen aus Filtern, Sortierung, Gruppierung und Kanban-Layout.

### 3.3 Personen, Agenda-Punkte und Meetings
**FR-020 [P0] People Directory light.** Person mit Anzeigename, optionaler Beziehung/Kategorie und individuellen Sichtbarkeitsregeln. Keine automatisierte Übernahme des Telefonadressbuchs in P0.  
**FR-021 [P0] Agenda.** Gesprächspunkte können Personen, Teams, wiederkehrenden Meetings und Projekten zugeordnet sein; bleiben bis „besprochen/erledigt/verschoben“ offen.  
**FR-022 [P0] Meeting Preparation.** Agenda-Ansicht gruppiert offene Punkte pro Meeting; manuell aufrufbar, zunächst auch ohne Kalenderintegration.  
**FR-023 [P1] Kalenderzuordnung.** Vor einem bestätigten Meeting können passende Agenda-Punkte vorgeschlagen werden; Beziehungen aus Terminbezeichnungen sind nicht blind automatisch zu übernehmen.  
**FR-024 [P1] Contact Log.** „Letzter Kontakt“ und optional kurze Interaktionsnotiz, manuell oder nach ausdrücklicher Bestätigung eines Termins.  
**FR-025 [P2] Relationship Review.** Freiwillige, unaufdringliche Kontaktwiedervorlagen; keine Beziehungsscores und kein Frequenzdruck.

### 3.4 Review und Wiedervorlage
**FR-030 [P0] Weekly Review Wizard.** Geführter Ablauf: Inbox, Kalender-Rückblick, offene Next Actions, Waiting For, laufende Projekte, Agendas, Someday/Maybe, Ausblick und Abschluss. Review jederzeit fortsetzbar.  
**FR-031 [P0] Individuelle Review-Frequenz.** Wöchentlich/monatlich/manuell je Projekt oder Bereich; getrennt vom Fälligkeitsdatum.  
**FR-032 [P0] Unaufdringliche Wiedervorlage.** Ein nicht dringender Punkt erscheint erst im entsprechenden Review oder an seinem Defer-/Review-Datum; keine tägliche rote Überfälligkeitsanzeige ohne echte Deadline.  
**FR-033 [P1] Review Insights.** Neue, stagnierende, überfällige und erledigte Punkte zusammenfassen, Entscheidungsvorschläge nur zur Bestätigung anbieten.  
**FR-034 [P0] Review-Historie.** Datum, durchlaufene Schritte und bewusste Entscheidungen sind nachvollziehbar.

### 3.5 Kalender, Verfügbarkeit und Kapazität
**FR-040 [P0] Google Calendar read-only.** Eigener, minimal berechtigter OAuth-Zugriff der App auf ausgewählte Kalender; erste Stufe liest Termine und Frei-/Belegt-Zeiten. ChatGPT-Verbindung ist keine automatische App-Berechtigung.  
**FR-041 [P0] Klassifikation.** Termine lassen sich als fix, flexibel oder geschützt kennzeichnen; Standardwerte dürfen nutzerseitig korrigiert werden. Das System darf die tatsächliche Verschiebbarkeit nicht allein aus Freitext behaupten.  
**FR-042 [P0] Kapazitätsanzeige.** Freie Zeitblöcke und geschätzter offener Aufwand je Woche, unter Berücksichtigung von Puffern und geschützter Erholung; sichtbar, wenn Kapazität überschritten ist.  
**FR-043 [P1] Latest Safe Start.** Aus Deadline, Restaufwand, Puffer und nutzbaren Zeitfenstern wird ein spätester sinnvoller Startpunkt samt Unsicherheitsbereich berechnet.  
**FR-044 [P1] Planvorschläge.** Vorschläge für Arbeitsblöcke mit Überschneidungsprüfung; Kalender-Schreibzugriff nur gesondert freigeben und jede Änderung bestätigen.  
**FR-045 [P1] Familienereignisse.** Schul- oder Prüfungstermine können mit vorbereitenden Aufgaben verbunden werden, etwa Lernstand abfragen und gemeinsame Übungszeit reservieren.

### 3.6 Focus Sessions und Zeiterfassung
**FR-050 [P0] Fokus-Timer.** Start/Pause/Fortsetzen/Ende, optionaler Planwert, Zuordnung zu Task/Projekt/Area; Ausfallschutz bei App-Neustart.  
**FR-051 [P0] Zeiteinträge.** Effektive Arbeitszeit getrennt von Pausen; manuelle Einträge und Korrekturen mit Änderungsprotokoll möglich.  
**FR-052 [P0] Session-Abschluss.** Fortschritt (Menge oder Notiz), Erledigungsstatus und neue Restschätzung erfassen; optional direkt nächste Handlung anlegen.  
**FR-053 [P1] Erfahrungswerte.** Aggregation nach Aufgabentyp (z. B. Prüfungsart), Stückzahl und Dauer; Durchschnitt, Streuung und Datenbasis transparent darstellen.  
**FR-054 [P1] Restaufwandsprognose.** Anzahl offener Einheiten × empirischer Aufwand pro Einheit + Sicherheitszuschlag; manuell übersteuerbar.  
**FR-055 [P1] Grenzen für Fokussessions.** Nicht aggressive Hinweise bei selbst gesetztem Zeitbudget/Schlafenszeit; nie Datenverlust oder erzwungener Abbruch.

### 3.7 Daily Compass und Recommender
**FR-060 [P0] Daily Compass.** Tagesübersicht mit fixen Terminen, heutigen relevanten Aufgaben, realer Zeitkapazität und maximal drei Vorschlägen.  
**FR-061 [P0] Regelbasierter „What's Next?“-Assistent.** Bewertet nur verfügbare Aufgaben unter Einbezug harter Deadline, Wichtigkeit, Zeitfenster, Kontext, Energieeinschätzung, Blockern und Gesamtbelastung. Liefert Begründung und Alternativen.  
**FR-062 [P0] Manuelle Übersteuerung.** Vorschlag ablehnen, bewusst verschieben, priorisieren oder „ich brauche gerade Pause“ wählen; keine automatische Sanktion.  
**FR-063 [P1] Adaptive Gewichtung.** Auf Wunsch aus Entscheidungen und Zeiterfassung lernen, ohne automatisches Training auf externen Servern vorauszusetzen.  
**FR-064 [P1] Neu orientieren.** Auf Knopfdruck Vorschläge anhand aktuell verfügbarer Zeit und Kontext neu berechnen.  
**FR-065 [P1] Energieinput.** Subjektive Selbsteinschätzung als wichtiger, eigenständiger Datenpunkt; Garmin-Daten dürfen nicht als objektiver Ersatz für kognitive Leistungsfähigkeit verwendet werden.

### 3.8 Ziele, Routinen und visuelle Fortschritte
**FR-070 [P0] Ziele und Meilensteine.** Ziele mit Projekten, überprüfbaren Outcomes, Meilensteinen und optionalen Zielterminen verknüpfen.  
**FR-071 [P0] Visueller Fortschritt.** Erledigte Arbeit, erreichte Meilensteine und bewusst gepflegte Zielkennzahlen getrennt anzeigen; keine irreführenden pauschalen Prozentwerte.  
**FR-072 [P1] Kompetenzentwicklung.** Kurse, Methoden, Praxisanwendungen und Lernziele als Fortschrittsverlauf mit qualitativen Notizen.  
**FR-073 [P1] Routinen.** Training, Tanzen, Erholung oder andere Gewohnheiten als freiwillig protokollierbare Wiederholungen. Keine beschämenden Streak-Meldungen.  
**FR-074 [P1] Wochenrückblick.** Erreichte Meilensteine, investierte Zeit, Pausen und Veränderung langfristiger Ziele aggregiert darstellen.

### 3.9 Listen und Geräte
**FR-080 [P0] Checklisten.** Einkaufsliste und andere einfache Listen sind unabhängig von Projekten verwendbar; Einträge abhaken, zurücksetzen und neu sortieren.  
**FR-081 [P0] PWA.** Installierbare mobile Website mit Offline-Lese-/Erfassungsfähigkeit und zugänglichem Quick Capture.  
**FR-082 [P1] Android-Widget.** Aktueller Fokus, schnelle Erfassung, kurze Aufgabenansicht. Ein echtes Homescreen-Widget erfordert einen nativen Android-Baustein, nicht lediglich PWA.  
**FR-083 [P2/SPIKE] Garmin fēnix 7S.** Connect-IQ-Minimal-App mit Today/Next Actions/Einkaufsliste, Auswahl und Abhaken; Synchronisation und gerätespezifische Grenzen zuerst prototypisch nachweisen. Keine freie Spracheingabe auf der Uhr voraussetzen.

### 3.10 Schlaf, Body Battery und Erholung
**FR-090 [P2/SPIKE] Health Connect.** Prüfen, welche von Garmin unter Android tatsächlich bereitgestellten Schlaf-, Aktivitäts- und Herzfrequenzdaten mit separater Einwilligung gelesen werden dürfen.  
**FR-091 [P2/SPIKE] Body Battery.** Gerätespezifischer Connect-IQ-Zugriff auf Body-Battery-Historie prototypisch prüfen, inklusive verfügbarer Historientiefe und Synchronisationsverhalten. Nicht voraussetzen, dass der Wert über Health Connect bereitsteht.  
**FR-092 [P2] Recovery Insights.** Opt-in, transparente Trendaussagen zur Erholung, ohne Diagnosen oder deterministische Leistungsbewertung.  
**FR-093 [P2] Gesundheitsdatenkontrolle.** Gesonderte Einwilligung, minimale Speicherung, lokale Analyse soweit möglich, Export und vollständiges Löschen der importierten Daten.

### 3.11 KI und externe Inhalte
**FR-100 [P1] Lokale LLM-Integration.** Optionaler Adapter zu lokal laufenden Modellen für Inbox-Triage, Aufgabenzerlegung und Review-Zusammenfassungen; ohne lokalen Dienst vollständig bedienbar.  
**FR-101 [P0] Strukturierter GPT-Import.** Definierte JSON/CSV-Importvorlage für Projekte, Teilaufgaben, Prioritäten, Zeitaufwand, Kontexte und Abhängigkeiten; Vorschau vor Übernahme und Duplikaterkennung.  
**FR-102 [P1] Textentwürfe.** Aus einer Aufgabe einen Prompt/E-Mail-Entwurf erstellen und kopieren; Versand nur über separat autorisierte Integration und mit Nutzerbestätigung.  
**FR-103 [P2] Cloud-KI.** Ausschließlich opt-in pro Funktion oder klarer Einstellung; sensible Kontakte und Gesundheitsdaten standardmäßig ausschließen, dokumentierte Lösch-/Aufbewahrungsoptionen berücksichtigen.  
**FR-104 [P1] Prüfbarkeit.** KI-Ausgaben sind Vorschläge; Ursprung und vom Nutzer bestätigte Änderungen nachvollziehbar.

## 4. Zentrale Nutzerabläufe (User Journeys)

**UJ-01 Spontaner Gedanke:** Gedanke auf Android erfassen → Inbox synchronisiert → im nächsten Inbox-Review als Agenda-Punkt zuordnen → erscheint bei Person/Meeting.  
**UJ-02 Jour fixe:** Kalender enthält kommenden Jour fixe → App zeigt vorbereitende Agenda → nach Meeting Punkt abhaken oder in Waiting For/Task überführen.  
**UJ-03 Dissertation:** Forschungsziel öffnen → Meilenstein und nächste ausführbare Handlung erkennen → Fokussession starten → Fortschritt speichern → nächster Review prüft Projektgesundheit.  
**UJ-04 Prüfungen:** Typ und Menge erfassen → Restaufwand erst schätzen → Korrektursessions aufzeichnen → Prognose aus empirischen Werten aktualisieren → bei Kapazitätsengpass rechtzeitig Warnung.  
**UJ-05 Überlastung:** Daily Compass erkennt zu wenig verfügbare Zeit → zeigt begründete Alternativen (verschieben, Umfang reduzieren, Pause, delegieren) statt bloß weitere Erinnerungen.  
**UJ-06 Familie:** Fixen Schularbeitstermin übernehmen → vorbereitende Tätigkeiten planen → Termin und geschützte Familienzeit respektieren.  
**UJ-07 Einkauf:** Liste auf Android pflegen → auf Garmin anzeigen → auf der Uhr abhaken → Änderungen später konfliktfest synchronisieren.  
**UJ-08 GPT-Beratung:** ChatGPT erstellt Projektplan → strukturierter Import → Nutzervorschau → neue Projekte und Aufgaben mit Zuordnung.  
**UJ-09 Kontakt-Review:** Mit Person lange nicht gesprochen → optional beim Relationship Review sehen → freiwillig Kontaktaktion planen, ohne automatisch Erinnerungsdruck aufzubauen.

## 5. Informationsarchitektur und Oberflächen

### 5.1 Primäre Navigation
1. **Heute / Daily Compass:** Agenda des Tages, Termine, knappe Empfehlung, aktueller Fokus.
2. **Inbox:** Schneller Eingang und Verarbeitung.
3. **Next Actions:** Filter nach Kontext, Person, verfügbarer Zeit und Energie.
4. **Projekte & Ziele:** Listen, Kanban, Meilensteine und Project Navigator.
5. **Agendas & People:** Personen, Meetings, offene Gesprächspunkte.
6. **Review:** Weekly Review, projektbezogene Reviews, Someday/Maybe.
7. **Progress:** Zeitaufwand, Zielentwicklung, Routinen und belastbare Visualisierungen.
8. **Listen:** Einkaufs- und andere Checklisten.
9. **Einstellungen:** Kalender, Datenschutz, KI, Synchronisation, Exporte, Geräte.

### 5.2 UI/UX-Prinzipien
- Mobile first für Capture, Desktop optimized für Planung und Review.
- Kanban als gleichberechtigte Ansicht, nicht als einziges Datenmodell.
- Tagesansicht mit höchstens drei hervorgehobenen Empfehlungen; übrige Aufgaben auf Wunsch sichtbar.
- Eine Inbox-Erfassung benötigt keine Projektauswahl; Strukturierung kann später erfolgen.
- Farbcodierung darf nicht alleiniger Informationsträger sein; barrierearme Kontraste und Tastaturbedienung.
- Positive Fortschrittsrückmeldung ohne Gamification-Zwang und ohne „Produktivitäts-Schuldgefühl“.
- Ruhige Benachrichtigungen: Standard ist Review-Digest oder eine ausdrücklich gesetzte Erinnerung, nicht permanentes Pushen.

## 6. Technische Architektur

### 6.1 Komponenten
- **Repository:** Eigenständiges GitHub-Repository mit dokumentierter Versionsführung, Tests, Deploy-Workflow und Release-Notes.
- **Frontend:** Statische, versionierte Web-App auf GitHub Pages unter einer `github.io/<repo>/`-Adresse; kein eigener Domainkauf notwendig.
- **PWA & Offline:** Service Worker für App-Shell, IndexedDB für lokale Aufgaben- und Ausgabedaten, Outbox für Änderungen, klare Speicher-/Offlineanzeigen.
- **Backend:** Separater Cloudflare Worker mit versionierter JSON-API, serverseitiger Autorisierung und validierten Eingaben.
- **Datenbank:** Eigene Cloudflare-D1-Datenbank; bevorzugt separates Cloudflare-Konto des Nutzers, sofern Kontobedingungen und Kostenrahmen passen.
- **Kalender:** Google Calendar API via eigene OAuth-Anmeldung mit minimalen Scopes.
- **Optionales Local-AI-Gateway:** Dienst auf dem Laptop bzw. lokalem Netz, nicht vorausgesetzt für normale App-Bedienung.
- **Android/Garmin:** Spätere native Erweiterungen für Homescreen-Widget, Health Connect und Connect IQ.

### 6.2 Sicherheitsgrenzen
GitHub Pages ist öffentliche, statische Auslieferung; weder Aufgaben noch Tokens oder sonstige private Nutzerdaten dürfen im Repository, im gebauten JavaScript-Bundle oder als ungeschützte JSON-Dateien stehen. Worker und D1 stellen private Inhalte ausschließlich nach Authentifizierung und Autorisierung bereit. Geheimnisse gehören in Secrets, nicht ins Frontend. Domainübergreifende Anfragen sind über eine enge CORS-Allowlist zu beschränken.

### 6.3 Synchronisation und Offline
Jeder Datensatz besitzt eindeutige ID, Version, Änderungszeit und Löschmarker. Der Client führt eine persistente Änderungs-Outbox; beim Wiederverbinden erfolgt differenzielle Synchronisation. Konflikte werden je nach Datentyp regelbasiert verarbeitet: unabhängige Änderungen zusammenführen, bei konkurrierender Bearbeitung kritischer Felder Nutzerentscheidung verlangen. Abhaken darf nicht durch alte Offlinezustände „rückgängig synchronisiert“ werden. Mehrere offene Timer für denselben Nutzer dürfen nicht stillschweigend gleichzeitig aktiv werden.

### 6.4 Verfügbarkeit, Quoten und Kosten
API-Aufrufe bündeln, nur geänderte Datensätze übertragen, keine permanente Vollabfrage. Limits von Workers/D1 beobachten und im UI verständliche Fehlermeldungen liefern. Eine Free-Tier-Eignung ist eine Zielannahme, keine garantierte Dauerzusage. Eigener Cloudflare-Account dient klarer Trennung, nicht der Umgehung von Anbieterrestriktionen.

### 6.5 Datenschutz und Berechtigungen
Personen- und Gesprächsnotizen sind private Daten, Gesundheitsinformationen besonders sensibel. Standardmäßig keine Übertragung an externe Sprach- oder KI-Dienste, kein Zugriff auf Kontakte ohne Einwilligung und keine sensiblen Inhalte in Push-Nachrichten. Datenminimierung, klare Zwecke, lokaler Geräteschutz, Sitzungssperre, Löschfunktion, Export und überprüfte Backup-/Restore-Prozeduren sind verpflichtend. Die Ausgestaltung einer etwaigen DSGVO-Verantwortlichkeit hängt von der tatsächlichen Nutzung ab und wird vor einer Öffnung für weitere Nutzer gesondert geprüft.

## 7. Logisches Datenmodell (Mindestbestand)

| Entität | Wichtige Felder / Beziehungen |
| --- | --- |
| User, Device, Session | Identität, Gerätebindung, Zugriff, Rechtemodell |
| Area, Goal, Milestone | Verantwortungsbereich, Zielzustand, Fortschrittsmodell |
| Project | Outcome, Typ sequenziell/parallel, Status, Area, Review-Frequenz |
| Task | Titel, Status, Due, Defer, Aufwand, Energie, Review, Projekt, Next-Action-Freigabe |
| TaskDependency | Vorgänger/Nachfolger, Typ, Blockierungsregeln |
| Context, TaskContext | Ort, Ressource, Modus, Person; n:m-Verknüpfung |
| Person, Interaction | Name, Kategorie, letzter bestätigter Kontakt, optionale Notiz |
| Meeting, AgendaItem | Meeting/Person-Verknüpfung, Status, Ergebnis, Nachfolgeaktion |
| WaitingFor | Erwartete Person, Auslöser, Wiedervorlage |
| ReviewCycle, ReviewDecision | Zeitpunkt, Checkliste, Ergebnis, explizite Entscheidung |
| FocusSession, TimeEntry | Start/Ende, Pausen, Dauer, Menge, Aufgabentyp |
| CalendarConnection, EventLink | Tokenreferenz, Kalender, Event-ID, Klassifizierung |
| Routine, RoutineLog | Wiederholungsregel, Erfüllung, Notiz |
| Checklist, ChecklistItem | Liste, Reihenfolge, erledigt, Sync-Version |
| HealthSample (opt-in) | Typ, Zeitpunkt, Wert, Quelle, Löschstatus |
| SyncChange, Conflict | Geräteänderung, Reihenfolge, Konfliktauflösung |
| AISuggestion, ImportBatch | Quelle, Vorschlag, Bestätigung, importierte Objekte |

**Datenmodell-Regel:** Kritische fachliche Unterschiede (Due vs. Defer vs. Review vs. Planungsblock; Agenda vs. Task; Time Entry vs. Estimate) sind als getrennte Felder/Beziehungen zu modellieren. Keine monolithische „Alles ist Task“-Tabelle ohne explizite Typen und Constraints.

## 8. Nichtfunktionale Anforderungen

| ID | Anforderung | Abnahmemethode |
| --- | --- | --- |
| NFR-01 [P0] | Kernfunktionen (Lesen/Capture/Abhaken) nach vorheriger Anmeldung offline nutzbar; Sync nach Wiederverbindung | Flugmodus-Test mit zwei Geräten |
| NFR-02 [P0] | Keine still verlorenen oder doppelt ausgeführten Änderungen | Konflikt-/Retry-Tests und Änderungsprotokoll |
| NFR-03 [P0] | Responsive Smartphone-/Desktop-Oberfläche, korrekte Touch-Ziele, Screenreader-Basis | Tests mit Android und Desktop |
| NFR-04 [P0] | Schnelle Kerninteraktion als Zielwert: lokales Capture in unter 2 s, warme Tagesansicht in unter 2 s auf Referenzgeräten | Wiederholte Messungen unter definierten Testbedingungen |
| NFR-05 [P0] | Authentifizierung, serverseitige Berechtigungsprüfung, HTTPS, Secret-Management, Rate-Limits | Security-Checkliste und negative API-Tests |
| NFR-06 [P0] | Export aller eigenen GTD-Daten in dokumentiertem JSON/CSV sowie verifizierbarer Restore-Test | Export-/Import-Roundtrip |
| NFR-07 [P0] | Versionierte Datenmigrationen mit Rückfallstrategie und Backup vor destruktiven Änderungen | Migrationstest mit Testdaten |
| NFR-08 [P0] | Keine Drittanbieter-Gesundheits-/Personendatenübertragung ohne explizite Freigabe | Netzwerkmitschnitt/Privacy-Test |
| NFR-09 [P1] | Verständliche Fehlerszenarien, Offline- und Sync-Status; technische Protokolle ohne sensible Inhalte | Usability- und Logging-Review |
| NFR-10 [P1] | Recommender zeigt Gewichtungen/Begründung und lässt manuelles Übersteuern zu | Szenariotests mit widersprüchlichen Prioritäten |

## 9. Abnahmefälle (End-to-End)

**AT-01 – Offline Quick Capture:** Eine Idee auf Android im Flugmodus erfassen; nach Wiederverbinden erscheint sie unverändert und genau einmal am Laptop.  
**AT-02 – Sequentielles Projekt:** Projekt mit drei abhängigen Aufgaben anlegen; zunächst nur A als Next Action; nach Abschluss von A wird B freigegeben, C bleibt blockiert.  
**AT-03 – Agenda statt Deadline:** Gesprächspunkt ohne Fälligkeitsdatum zu Person/Meeting erfassen; er erscheint auf Agenda und beim Review, aber nicht als überfällige Aufgabe.  
**AT-04 – Weekly Review:** Unterbrochenen Review fortsetzen, alle relevanten GTD-Listen abarbeiten, bewusste Entscheidungen speichern.  
**AT-05 – Kalenderüberlast:** Fixe Termine und flexible Blöcke importieren, Kapazitätsengpass mit korrektem Restaufwand anzeigen; keine automatische Terminänderung.  
**AT-06 – Timer nach Neustart:** Timer starten, Anwendung schließen/neu öffnen, tatsächliche Dauer/Pausen ohne Doppelzählung rekonstruieren.  
**AT-07 – Prüfungsprognose:** Korrekturmenge, bearbeitete Einheiten und erfasste Arbeitszeit speichern; Restaufwand aktualisiert sich nachvollziehbar.  
**AT-08 – Fortschritt:** Meilenstein abschließen; Dashboard zeigt entsprechenden Fortschritt, ohne nur Task-Anzahl als Gesamtprojektfortschritt zu verwenden.  
**AT-09 – GPT-Import:** Strukturierte Projektliste importieren; vor Bestätigung Vorschau, danach referenzierte Aufgaben/Abhängigkeiten konsistent vorhanden.  
**AT-10 – Datenschutz:** Nicht autorisierte API-Zugriffe erhalten keinen Aufgaben-/Personen-/Gesundheitsinhalt; nach Logout kein offener Zugriff über ein fremdes Gerät.  
**AT-11 – Konflikt:** Dasselbe Item offline auf zwei Geräten ändern; Konflikt wird korrekt aufgelöst oder sichtbar zur Entscheidung gestellt.  
**AT-12 – Einkaufsliste:** Liste und Abhakstatus funktionieren als P0 auf Android; später P2 auf der Fenix nach positivem Connect-IQ-SPIKE.

## 10. Umsetzungs-Roadmap und Build-Gates

### Phase A – Architektur, Sicherheitsfundament und Entwicklungsworkflow
Eigenständiges Repository, Hosting-/API-Trennung, Authentifizierung, D1-Migrationskonzept, lokale Datenhaltung, Sync-Protokoll, Testdaten, dokumentierter Releaseprozess. **Gate A:** Zwei Testgeräte können ein Item ohne Datenverlust offline bearbeiten und sicher synchronisieren.

### Phase B – GTD Core (erstes benutzbares Release)
Inbox, Processing, Areas, Ziele-Basis, Projekte, Aufgaben, Next Actions, Kontexte, Agenda/People light, Waiting For, Someday/Maybe, Listen, Kanban, einfache Fortschritte und Weekly Review. **Gate B:** Eine vollständige Arbeitswoche lässt sich ohne externen Task-Manager organisieren; Weekly Review deckt offene Schleifen ab.

### Phase C – Kalender, Daily Compass und Zeiterfassung
Read-only Google Calendar, fix/flexibel/geschützt, Kapazitätsanzeige, regelbasierte Empfehlungen, Fokus-Timer und manuelle Zeiteinträge. **Gate C:** Überplanung ist nachvollziehbar sichtbar und Empfehlungen respektieren Verfügbarkeit, Kontext und Nutzerentscheidungen.

### Phase D – Adaptive Guidance und Entwicklung
Empirische Aufwandsschätzungen, Latest Safe Start, Routinen, Kompetenz-/Projektfortschritt, KI-Import/Local AI, Project Health und Meeting-Vorbereitung. **Gate D:** Prognosen zeigen Datenbasis/Unsicherheit; KI ist abschaltbar; Betrieb ohne KI unverändert möglich.

### Phase E – Geräte und optionale Erweiterungen
Android-Widget, Garmin-Connect-IQ-SPIKE und nach Erfolg Task-/Einkaufs-Glance; getrennte Health-Connect-/Body-Battery-SPIKES; Relationship Review. **Gate E:** Jede native Integration besitzt eigene Tests, Berechtigungen und Fallbacks; Kernsystem bleibt unabhängig.

**Regel für jeden Build:** Inkrementeller Patch und vollständiger konsolidierter Release-Stand, dokumentierte Migrationen, automatische Tests, manuelle Smoke-Tests, Changelog, kein Rückschritt bereits funktionierender GTD-Kernabläufe.

## 11. Risiken, Abhängigkeiten und Gegenmaßnahmen

| Risiko | Gegenmaßnahme |
| --- | --- |
| Überladenes MVP | Phasen-Gates; P1/P2 nicht in den ersten GTD-Core hineinziehen |
| Offline-Konflikte, Datenverlust | Versionierte Änderungen, Outbox, Konfliktanzeige, Restore-Tests |
| Falsche Kalenderannahmen | Fix/flexibel/geschützt explizit bestätigbar; zunächst read-only |
| Überoptimistische Prognosen | Datenbasis, Unsicherheitsbereich, Puffer, manuelle Korrektur |
| KI-Halluzinationen | Nur Vorschläge mit Quellen-/Datenhinweis, keine automatische Ausführung |
| Übermäßige Benachrichtigungen | Review-first, Opt-in für Push, einstellbare Frequenzen |
| Persönliche und Gesundheitsdaten | Datensparsamkeit, getrennte Berechtigung, Schutz/Export/Löschung |
| Connect-IQ-Gerätelimits | Früher isolierter Prototyp für fēnix 7S |
| Cloudflare-Limits/Kosten | Deltasynchronisation, Quotenmonitoring, definierter Fallback |
| Nachträglich gewachsene Architektur | Modulares Domänenmodell, Migrationstests, wiederkehrende Konsolidierung |

## 12. Entscheidungen, Annahmen und offene technische Prüfungen

**Festgelegte Annahmen für die Spezifikation:** Einzelperson im ersten Release; deutschsprachige Oberfläche zunächst ausreichend; GitHub Pages ohne eigene Domain; bevorzugt separater Cloudflare-Account; Smartphone und Windows-Laptop als Primärgeräte; Garmin fēnix 7S als sekundäre Interaktionsfläche; keine Vollautomatisierung ohne Bestätigung; Personendaten und Health-Daten standardmäßig privat.

**Zu prüfen, ohne die P0-Entwicklung zu blockieren:** Wahl des Auth-Verfahrens und Session-Schutzes; Google-OAuth-Registrierung/Consent und Auswahl der Kalender; praktischer Einsatz des lokalen Whisper- und LLM-Dienstes von Android aus; Connect-IQ-API/Kommunikation auf der konkreten Fenix; tatsächlich verfügbare Garmin-Daten in Health Connect; langfristige Export- und Backupstrategie; möglicher Bedarf an mehreren Benutzern.

**Technische Referenzen (Dokumentationsstand Oktober 2026):**  
GitHub Pages – https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages  
Cloudflare D1 – https://developers.cloudflare.com/d1/platform/pricing/  
Cloudflare D1 Limits – https://developers.cloudflare.com/d1/platform/limits/  
Google Calendar FreeBusy – https://developers.google.com/workspace/calendar/api/v3/reference/freebusy/query  
Garmin Connect IQ SensorHistory – https://developer.garmin.com/connect-iq/api-docs/Toybox/SensorHistory.html

## 13. Definition of Done für den Kernrelease

Der Kernrelease gilt erst als abgenommen, wenn die Anforderungen **FR-001–003, FR-010–015, FR-020–022, FR-030–032/034, FR-040–042, FR-050–052, FR-060–062, FR-070–071, FR-080–081 und FR-101** funktionsfähig sind; alle NFR-P0-Tests bestanden sind; AT-01 bis AT-11 für alle bis dahin integrierten Module erfolgreich sind; ein belastbarer Datenexport und Restore erfolgreich getestet wurde; die Android- und Desktop-Nutzung im Alltag praktikabel ist; und Build, Migration, Sicherheitskonfiguration sowie bekannte Einschränkungen dokumentiert sind.

Die optionale Garmin-Glance, fortgeschrittene Beziehungsfunktionen und Health-Insights sind **keine** Abnahmevoraussetzung für diesen Kernrelease. Sie bleiben im Datenmodell vorbereitet und werden erst nach separater technischer und datenschutzbezogener Prüfung eingebaut.
