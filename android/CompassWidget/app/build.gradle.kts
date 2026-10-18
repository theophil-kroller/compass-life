plugins { id("com.android.application") }
android {
    namespace = "at.compasslife.widget"
    compileSdk = 35
    defaultConfig { applicationId = "at.compasslife.widget"; minSdk = 26; targetSdk = 35; versionCode = 2; versionName = "0.5.0-beta" }
    compileOptions { sourceCompatibility = JavaVersion.VERSION_17; targetCompatibility = JavaVersion.VERSION_17 }
}
