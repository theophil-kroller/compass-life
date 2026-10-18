package at.compasslife.widget

import android.app.Activity
import android.os.Bundle
import android.content.Intent
import android.net.Uri
import android.graphics.Color
import android.text.InputType
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import androidx.activity.ComponentActivity
import androidx.activity.result.contract.ActivityResultContracts
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.PermissionController
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.ExerciseSessionRecord
import androidx.health.connect.client.records.SleepSessionRecord
import androidx.health.connect.client.records.StepsRecord
import androidx.health.connect.client.request.AggregateRequest
import androidx.health.connect.client.time.TimeRangeFilter
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import java.time.LocalDate
import java.time.ZoneId

/** Companion: manual sync or explicitly enabled, permission-gated daily sync. */
class HealthCompanionActivity : ComponentActivity() {
    private val endpoint = "https://compass-api.theophil-tiger.workers.dev"
    private val healthPermissions=HealthDailySync.reads
    private var awaitingBackground=false
    private lateinit var feedback: TextView
    private lateinit var code: EditText
    private val permissionsLauncher = registerForActivityResult(
        PermissionController.createRequestPermissionResultContract()
    ) { granted ->
        if(awaitingBackground){
            awaitingBackground=false
            if(granted.containsAll(healthPermissions)&&HealthDailySync.backgroundRead in granted){
                HealthSyncSchedule.enable(this)
                feedback.text="Tagesabgleich aktiviert: Android plant die Übertragung ungefähr alle 24 Stunden."
            }else feedback.text="Hintergrundzugriff nicht freigegeben. Automatik bleibt aus."
        }else feedback.text=if(granted.containsAll(healthPermissions))
            "Gesundheitsdaten freigegeben. Du kannst nun synchronisieren."
        else "Noch nicht alle Berechtigungen erteilt."
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val px = (resources.displayMetrics.density * 16).toInt()
        val root = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL; setPadding(px,px,px,px) }
        val scroller = ScrollView(this).apply { addView(root) }
        setContentView(scroller)
        fun label(text: String, large: Boolean=false) = TextView(this).apply {
            this.text = text; textSize = if (large) 23f else 15f; setTextColor(Color.rgb(39,69,55))
            setPadding(0,0,0,px)
            root.addView(this,LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,ViewGroup.LayoutParams.WRAP_CONTENT))
        }
        fun button(text:String, handler:()->Unit)=Button(this).apply { this.text=text;setOnClickListener{handler()};root.addView(this) }
        label("Compass · Gesundheitsdaten",true)
        label("Schritte, Schlaf und Trainingsminuten aus Health Connect. Nur nach Freigabe werden Tageswerte an Compass gesendet. Manuell oder optional täglich im Hintergrund (zusätzliche Berechtigung erforderlich). Keine Standortdaten.")
        button("Health Connect freigeben") {
            if (HealthConnectClient.getSdkStatus(this)!=HealthConnectClient.SDK_AVAILABLE) {
                feedback.text="Health Connect ist nicht verfügbar. Bitte in den Android-Einstellungen prüfen." }
            else permissionsLauncher.launch(healthPermissions)
        }
        label("Kopplungscode aus Compass → Gesundheit hier eingeben.")
        code=EditText(this).apply { hint="8-stelliger Code";inputType=InputType.TYPE_CLASS_NUMBER;root.addView(this) }
        button("Gerät mit Compass verbinden") {
            val value=code.text.toString().trim()
            if (!value.matches(Regex("[0-9]{8}"))) {feedback.text="Bitte acht Ziffern eingeben.";return@button}
            lifecycleScope.launch {
                try {
                    feedback.text="Kopplung läuft …"
                    val result=withContext(Dispatchers.IO){send("/api/health/pair/claim",JSONObject().put("code",value),null)}
                    val token=result.getString("token")
                    if (!token.matches(Regex("ch1_[0-9a-f]{64}")))throw IllegalStateException("Ungültiges Gerätetoken")
                    HealthTokenStore.save(this@HealthCompanionActivity,token)
                    code.setText("");feedback.text="Verbunden. Jetzt Gesundheitsdaten synchronisieren."
                }catch(ex:Exception){feedback.text="Kopplung fehlgeschlagen: ${ex.message}"}
            }
        }
        button("Jetzt synchronisieren") {
            lifecycleScope.launch {
                try{
                    feedback.text="Lese und übertrage Tageswerte …"
                    val count=HealthDailySync.run(this@HealthCompanionActivity,false)
                    feedback.text=if(count==0)"Keine Tagesdaten in Health Connect gefunden." else "$count Tage erfolgreich in Compass gespeichert."
                }catch(ex:Exception){feedback.text="Abgleich fehlgeschlagen: ${ex.message}"}
            }
        }
        label("Automatischer Abgleich · freiwillig",true)
        label("Mit zusätzlicher Health-Connect-Freigabe synchronisiert Android etwa einmal täglich bei Internetverbindung. Energiesparmodus kann den Zeitpunkt verschieben.")
        button("Täglichen Abgleich aktivieren"){
            if(HealthConnectClient.getSdkStatus(this)!=HealthConnectClient.SDK_AVAILABLE){
                feedback.text="Health Connect fehlt.";return@button
            }
            if(HealthTokenStore.load(this)==null){feedback.text="Bitte zuerst das Gesundheitsgerät koppeln.";return@button}
            val client=HealthConnectClient.getOrCreate(this)
            if(!HealthDailySync.supportsBackground(client)){
                feedback.text="Dieses Gerät unterstützt den Hintergrundzugriff auf Health Connect noch nicht. Manuelle Synchronisation bleibt verfügbar.";return@button
            }
            awaitingBackground=true
            permissionsLauncher.launch(healthPermissions+HealthDailySync.backgroundRead)
        }
        button("Automatischen Abgleich ausschalten"){
            HealthSyncSchedule.disable(this)
            feedback.text="Automatischer Gesundheitsabgleich ist ausgeschaltet."
        }
        val healthStatus=getSharedPreferences(HealthSyncSchedule.PREF,MODE_PRIVATE)
        val last=healthStatus.getLong("lastSuccess",0)
        label("Automatik: ${if(HealthSyncSchedule.enabled(this))"aktiv" else "aus"} · Letzter erfolgreicher Abgleich: ${if(last>0)java.text.SimpleDateFormat("dd.MM. HH:mm",java.util.Locale.GERMAN).format(java.util.Date(last))else"noch keiner"}. ${healthStatus.getString("lastError","")}")
        val more=label("Weitere Einstellungen · Verbindung entfernen")
        more.setOnClickListener {
            android.app.AlertDialog.Builder(this)
                .setTitle("Gesundheits-Verbindung entfernen?")
                .setMessage("Die tägliche Synchronisation wird ausgeschaltet und der lokale Schlüssel gelöscht. Bitte widerrufe zusätzlich den Zugang unter Compass → Gesundheit.")
                .setNegativeButton("Abbrechen",null)
                .setPositiveButton("Trennen") { _, _ ->
                    HealthSyncSchedule.disable(this)
                    HealthTokenStore.clear(this)
                    feedback.text="Gesundheits-Verbindung auf diesem Gerät entfernt."
                }.show()
        }
        feedback=label("Bereit. Verbindungen und Berechtigungen sind freiwillig.")
    }
    private fun send(path:String,payload:JSONObject,token:String?):JSONObject {
        val conn=URL(endpoint+path).openConnection() as HttpURLConnection
        try {
            conn.requestMethod="POST";conn.connectTimeout=10000;conn.readTimeout=15000;conn.doOutput=true
            conn.setRequestProperty("Content-Type","application/json")
            if(token!=null)conn.setRequestProperty("Authorization","Bearer $token")
            conn.outputStream.use{it.write(payload.toString().toByteArray(Charsets.UTF_8))}
            val status=conn.responseCode
            val content=(if(status in 200..299)conn.inputStream else conn.errorStream)?.bufferedReader()?.use{it.readText().take(4000)} ?: "{}"
            if(status !in 200..299)throw IllegalStateException("HTTP $status · ${JSONObject(content).optString("error")}")
            return JSONObject(content)
        }finally {conn.disconnect()}
    }
}

/** Health Connect permission usage rationale required by Android 14+. */
class PermissionUsageActivity: Activity(){
    override fun onCreate(savedInstanceState: Bundle?){super.onCreate(savedInstanceState)
        setContentView(TextView(this).apply{ text="Compass liest nach deiner Freigabe Schritte, Schlaf- und Sportdauer. Du kannst den Upload manuell starten oder zusätzlich den Hintergrundzugriff aktivieren. Die Tageswerte werden in deinem Compass-Cloudkonto gespeichert. Berechtigungen kannst du in Health Connect jederzeit widerrufen.";textSize=18f;setPadding(32,40,32,32)})
    }
}
