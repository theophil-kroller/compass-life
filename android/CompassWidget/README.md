# Compass Widget (Android Studio Projekt – kein fertiges APK)

Separates Java-/Android-AppWidget-Projekt. Java 17, AGP 8.7.3, Android SDK 35. In Android Studio importieren, benötigten Android-SDK/Gradle-Wrapper via Android Studio installieren, danach `Build APK(s)`.

Erster Build ist bewusst **privacy-first** und zeigt nur Datum sowie zwei anklickbare Aktionen: `Heute öffnen` und `+ Erfassen` (Compass PWA mit Deep-Link-Parametern).

Echte Aufgaben und Kalendertermine kann die PWA noch nicht sicher an ein natives Widget übergeben; diese Funktion ist **nicht implementiert**. Die App benötigt keine Google-Tokens, keine Cloudflare-Berechtigungen, keine Gesundheitsdaten. Widget-Daten bleiben damit gegenwärtig unkritisch.
