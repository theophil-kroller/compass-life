# Compass Life 0.5.77.59.40.3 — kompakter 📍-Schalter ohne abgeschnittenes Mobile-Menü

**Basis:** Exaktes Full-Source-Paket `Compass_0.5.77.59.40.2_FULL_SOURCE_READY.zip`.

## Was wurde verbessert?

- Der Standortschalter ist jetzt **kompakter und symbolorientiert**: im Trigger nur noch **📍 + Kontextsymbol** statt viel Text.
- Die manuelle Auswahl zeigt **nur noch Symbole** für **Zuhause (⌂)**, **Arbeit (▣)**, **Unterwegs (↗)** und **offen (○)**. Die Bezeichnungen bleiben aus Gründen der Bedienbarkeit als `aria-label`/Tooltip erhalten.
- Auf dem Smartphone öffnet sich das Menü nun als **festes Bottom-Sheet** innerhalb des Viewports. Dadurch wird es nicht mehr links/rechts oder unten abgeschnitten.
- Automatik, "Standort jetzt prüfen", passende Ansichten und "Was passt jetzt?" bleiben erhalten, aber deutlich kompakter.
- Die ausführlicheren Textblöcke sind in **⚙ Einstellungen** verschoben.

## Was bleibt gleich?

- Alle Handler und die Logik aus **0.5.77.59.39–40.2** bleiben erhalten.
- Keine Hintergrundüberwachung, keine Cloud-Übertragung, keine Speicherung von Bewegungsverläufen.
- Ortszonen bleiben lokal verschlüsselt im Vault.

## Qualität

- Keine D1-, Worker-, Tresor- oder Google-Migration.
- Der neue Release hängt sich als weitere Transformationsstufe **nach 0.5.77.59.40.2** an.
- Automatisierte Tests prüfen die .40.3-Transformationskette, den icon-first Trigger und das mobile Fixed-Bottom-Sheet.
