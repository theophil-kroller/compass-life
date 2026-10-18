plugins { id("com.android.application"); id("org.jetbrains.kotlin.android") }
android {
    namespace = "at.compasslife.widget"
    compileSdk = 36
    defaultConfig { applicationId = "at.compasslife.widget"; minSdk = 26; targetSdk = 35; versionCode = 6; versionName = "0.5.6-widgets-stable" }
    compileOptions { sourceCompatibility = JavaVersion.VERSION_17; targetCompatibility = JavaVersion.VERSION_17 }
    kotlinOptions { jvmTarget = "17" }
}

dependencies {
    implementation("androidx.activity:activity-ktx:1.9.3")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.7")
    implementation("androidx.health.connect:connect-client:1.1.0")
    implementation("androidx.work:work-runtime-ktx:2.9.1")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.9.0")
}
