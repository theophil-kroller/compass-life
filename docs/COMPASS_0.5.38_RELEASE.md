# Compass 0.5.38 — Next Actions sortieren und für heute vormerken

Next Actions haben nun dieselbe komfortable, optionale Sortierung wie die Inbox: Drag-and-drop am Griff sowie Auf-/Ab-Steuerung für Touch und Tastatur. Die Sortierung ist bewusst **separat** von `task.sortOrder`, um die Reihenfolge in sequenziellen Projekten und die synchronisierte Projekthierarchie nicht zu verändern. Sie wird im verschlüsselten lokalen Vault unter `uiPreferences.nextActionManualOrder` gespeichert. Eine Cloud-Synchronisierung dieser Anzeigepräferenz ist noch nicht vorgesehen.

Mit **Heute** kann eine ausführbare Next Action per Klick als geplante Aufgabe für den aktuellen lokalen Tag in der Tagesübersicht erscheinen. Technisch wird ausschließlich `plannedDate` gesetzt oder bei erneutem Klick entfernt; `dueDate` und die GTD-Workflow-Kategorien bleiben erhalten. Bestehende Wunschtermin-Daten werden nur nach Bestätigung verschoben.

Keine Worker- oder D1-Migration. Keine Änderungen am Finanzimport. Vorhandene Screens und Vault-Inhalte bleiben verwendbar. Tests: 403/403 bestanden. Produktions-Build mangels lokalem Vite offen, Browser-Abnahme ausstehend.
