Compass 0.5.76.1 – CI-Hotfix für Workflow #153

Ursache: Der isolierte VM-Test der Personenansicht entfernte im Testaufbau
die ES-Modulimporte und stellte touchPersonSummary nicht im VM-Kontext bereit.

Änderung (nur Testcode):
- Import von touchPersonSummary aus touch-journal-v577.js
- Injection als ctx.touchPersonSummary im VM-Testaufbau

Keine Änderung an der Anwendung, am Vault oder der Datenbank.
Installation: Inhalt dieses ZIP in die bestehende GitHub-Repository-Wurzel
hochladen; tests/gtd-0411-people-timeline.test.mjs ersetzen.
Prüfung: node --check erfolgreich. Der vollständige GitHub-CI-Durchlauf
kann erst nach dem Commit von GitHub bestätigt werden.
