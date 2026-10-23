# Compass Life 0.5.77.23 · Quick Meals & Makroorientierung

Basis: 0.5.77.22. Keine D1- oder Vault-Migration, keine Worker-Änderung.

## 1. Offline Meal Composer – ausdrücklich zusätzlich zu allen Symbol-Kacheln

- Nutrition-Quick-Overlay zeigt ein neues Feld **„✨ Gericht beschreiben“** über der bisherigen Emoji-Kachelwelt. Alte Produkt-IDs, Matcha 30+, Supplements, Kacheln und Tageshistorie bleiben erhalten.
- Textbeispiel: „Chinakohlsalat, Tempeh, gebratenes Gemüse und Buchweizen“. Der rein lokale, deterministische Parser identifiziert vier Komponenten; anfangs rund 20 häufige Grundzutaten für vegetarische Gerichte.
- Mengenannahmen in Gramm sind vor Übernahme direkt änderbar. Die aktuellen Makros aktualisieren sich ohne globalen View-Render; Eingaben lösen weder Cloud- noch Vault-Schreibvorgänge pro Tastendruck aus. Aktiver Texteditor stellt den automatischen Cloud-Sync zurück.
- Bratöl und Dressing werden **nie stillschweigend hinzugefügt**. Vorhandene Hinweise mit schnellen optionalen „+ Bratöl“ / „+ Dressing“-Tasten. Genauso werden unbekannte Zutaten gezeigt und nicht erfunden.
- Einmalige Übernahme legt im bestehenden `nutritionJournal.customFoods` ein *komponiertes Rezept mit Nährwertprofil, Inhaltsstoffen und Quelle* sowie einen referenzierten Eintrag im `nutritionJournal.entries` an. Danach über 🍽️-Emoji unter „Eigene“ mit einem Tipp wiederverwendbar. `mergeJournalData` synchronisiert diese IDs bereits über den ausdrücklich aktivierten verschlüsselten Geräteabgleich. Keine zusätzliche Datenbank.
- Tagesanalyse verarbeitet die Zusammensetzung und alle hinterlegten Mikros (alle als **Schätzwerte**), inklusive Salz. Die bisherigen Herstelleretiketten werden nicht geändert.

## 2. GPT-Handoff explizit und sicher

- „GPT-Auftrag kopieren“ erzeugt eine kompakte Instruktion mit erlaubten IDs und Hinweisen zu unsicheren Portionsmengen.
- Ein strukturiertes JSON-Ergebnis kann manuell ins Formular eingefügt werden. Die Angaben werden strikt gegen lokale IDs und Mengengrenzen validiert, anschließend bestätigt.
- Keine automatische GPT-API-Verbindung, keine Datenweitergabe ohne Benutzeraktion und keine Übernahme unkontrollierter KI-Nährwerte.

## 3. Makroziele & Salz

- Optionales Modul „🎯 Persönliche Makroorientierung“ im „Makro & Mikro“-Tab: auf Grundlage des bereits konfigurierten Fitdays-/Garmin-Energie-Modells, auswählbar **Alltag** oder **regelmäßiges Krafttraining**. Erst nach Opt-in wird eine Tagesbilanz dargestellt. Alltagsmodus etwa 0,8–1,2 g/kg Protein, Krafttrainingsmodus etwa 1,4–1,8 g/kg; mit Mitte als Beispielplanung, 28 % Energie aus Fett, restliche kcal aus Kohlenhydraten. Keine blind automatisch wechselnden Ziele; Unvollständigkeit des Tagebuchs erkennbar.
- 🧂 Salzanzeige als Anteil von **5 g WHO-Orientierungsobergrenze**, kein Verzehrziel und kein Wert für fehlende Würzung.
- Makropräferenzen werden im bestehenden verschlüsselten Nutrition Journal versionsbewusst geräteübergreifend zusammengeführt.

## 4. Performance & Datenintegrität

- Zutatenparser, Summen und Vorschau sind reine synchrone Funktionen auf kleiner lokaler Datentabelle ohne Remote Request.
- Optionaler Performance Trace: sampled `Ernährung: Tippen bis Paint`, `Ernährung: Zutaten erkennen`, `Ernährung: Mahlzeit speichern`; keine Freitexte oder personenbezogenen Werte im Trace.
- Formularentwürfe sind im vorhandenen lokalen, separat verschlüsselten Draft Guard geschützt; eine negative Persistenz-Quittung gilt nicht als gespeicherter Eintrag.

## Abgrenzung & Datenqualität

- Daten stammen aus kleinen, statisch gebündelten typischen Basiswerten (USDA/SR-orientierte Angaben), **nicht** aus einem Vollimport des BLS 4.0. Eine vollständige mehrtausendteilige Lebensmitteldatenbank, Barcode-Lookups und eine direkt integrierte GPT-Verbindung sind ein späterer Architektur-Schritt.
- Grammzahlen und allgemeine Lebensmittelprofile sind Näherungen; Öl, Gewürze, Zubereitung, Dressing und Salz können die tatsächlichen Werte erheblich verändern. Vollständige Tagesaufnahme kann daraus nicht abgeleitet werden.
- Weiterhin separate Verschlüsselung des gesamten Haupt-Tresors bei echten Änderungen; der große lokale Vault bleibt bei Speicherung der hauptsächliche, noch offene Performanceengpass. Keine riskante Storage-Migration in diesem Release.

## Qualität

- Gesamte Node-Regressionssuite und Worker-Syntaxprüfung ausführen. Vite-Produktionsbundle konnte in dieser Umgebung mangels `node_modules` nicht aufgebaut werden; GitHub Actions prüfen.
