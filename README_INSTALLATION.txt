Compass Life 0.5.76.1 - CI-Fix fuer fehlgeschlagenen GitHub Actions Run #155

Ursache
Der Regressionstest tests/touch-multi-05761.test.mjs legte p1 ohne relationKind an,
obwohl die Touch-Personenauswahl seit dem letzten Build absichtlich nur
family, partner und friend zulaesst. Dieser Widerspruch fuehrte zu
"not ok 796 - multiple checkboxes in direct form and explicit person choices".

Korrektur
- p1 im Test als 'friend' klassifiziert
- p2 als 'colleague', p3 als 'partner', p4 als 'family', p5 als 'acquaintance'
- Test prueft nun, dass friend/partner/family angeboten und
  colleague/acquaintance ausgeschlossen werden.
- Kein Anwendungscode, keine Datenbank, keine Nutzerdaten veraendert.

Installation: Datei tests/touch-multi-05761.test.mjs nach GitHub
in exakt dasselbe Verzeichnis hochladen und vorhandene Datei ersetzen.
ZIP-Inhalt: nur 1 aktualisierte Testdatei und diese Anleitung.

Pruefung: Isolierter Test mit lokal vorhandener aktueller Touch-Komponente:
node --test tests/touch-multi-05761.test.mjs
5 Tests, 5 bestanden. GitHub-Run #155: 799 von 800 Tests bestanden;
den verbliebenen Test lokal reproduziert und behoben.
Vollstaendiger CI-Workflow und Vite-Build sind erst nach Upload verifizierbar.
