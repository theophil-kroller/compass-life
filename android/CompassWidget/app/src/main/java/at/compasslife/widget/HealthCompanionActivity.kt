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

/** Companion sync runs ONLY after a user tap: no background uploads. */
class HealthCompanionActivity : ComponentActivity() {
    private val endpoint = "https://compass-api.theophil-tiger.workers.dev"
    private val healthPermissions = setOf(
        HealthPermission.getReadPermission(StepsRecord::class),
        HealthPermission.getReadPermission(SleepSessionRecord::class),
        HealthPermission.getReadPermission(ExerciseSessionRecord::class)
    )
    private lateinit var feedback: TextView
    private lateinit var code: EditText
    private val permissionsLauncher = registerForActivityResult(
        PermissionController.createRequestPermissionResultContract()
    ) { granted -> feedback.text = if (granted.containsAll(healthPermissions))
        "Gesundheitsdaten freigegeben. Jetzt mit Compass verbinden oder synchronisieren."
        else "Noch nicht alle Berechtigungen erteilt. Du kannst sie jederzeit in Health Connect ändern." }

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
        label("Schritte, Schlaf und Trainingsminuten aus Health Connect. Nur nach deiner Freigabe und einem Tipp auf Synchronisieren werden Tageswerte an deinen privaten Compass-Worker gesendet. Keine Standortdaten.")
        button("1 · Health Connect freigeben") {
            if (HealthConnectClient.getSdkStatus(this)!=HealthConnectClient.SDK_AVAILABLE) {
                feedback.text="Health Connect ist nicht verfügbar. Bitte in den Android-Einstellungen prüfen." }
            else permissionsLauncher.launch(healthPermissions)
        }
        label("2 · In Compass → Erholung → Gesundheits-Kopplungscode erzeugen und hier eingeben.")
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
        button("3 · Letzte 7 Tage synchronisieren") {
            lifecycleScope.launch {
                try {
                    val token=HealthTokenStore.load(this@HealthCompanionActivity)
                    if(token==null){feedback.text="Zuerst Gerät koppeln.";return@launch}
                    if(HealthConnectClient.getSdkStatus(this@HealthCompanionActivity)!=HealthConnectClient.SDK_AVAILABLE){feedback.text="Health Connect fehlt.";return@launch}
                    val client=HealthConnectClient.getOrCreate(this@HealthCompanionActivity)
                    val granted=client.permissionController.getGrantedPermissions()
                    if(!granted.containsAll(healthPermissions)){feedback.text="Bitte zuerst die Health-Connect-Berechtigungen erteilen.";return@launch}
                    feedback.text="Lese Tageswerte …"
                    val zone=ZoneId.systemDefault();val today=LocalDate.now();val rows=JSONArray()
                    for(i in 6 downTo 0){
                        val day=today.minusDays(i.toLong())
                        val from=day.atStartOfDay(zone).toInstant()
                        val until=day.plusDays(1).atStartOfDay(zone).toInstant()
                        val metrics=client.aggregate(AggregateRequest(
                            setOf(StepsRecord.COUNT_TOTAL,SleepSessionRecord.SLEEP_DURATION_TOTAL,ExerciseSessionRecord.EXERCISE_DURATION_TOTAL),
                            TimeRangeFilter.between(from,until)))
                        val steps=metrics[StepsRecord.COUNT_TOTAL]
                        val sleep=metrics[SleepSessionRecord.SLEEP_DURATION_TOTAL]?.toMinutes()
                        val training=metrics[ExerciseSessionRecord.EXERCISE_DURATION_TOTAL]?.toMinutes()
                        if(steps!=null||sleep!=null||training!=null){
                            val item=JSONObject().put("day",day.toString())
                            if(steps!=null)item.put("steps",steps.coerceIn(0L,100000L))
                            if(sleep!=null)item.put("sleepMinutes",sleep.coerceIn(0L,1440L))
                            if(training!=null)item.put("exerciseMinutes",training.coerceIn(0L,1440L))
                            rows.put(item)
                        }
                    }
                    if(rows.length()==0){feedback.text="Keine Tagesdaten in Health Connect gefunden. Prüfe die Garmin-Connect-Freigabe.";return@launch}
                    feedback.text="Übertrage ${rows.length()} Tage …"
                    val payload=JSONObject().put("days",rows)
                    val result=withContext(Dispatchers.IO){send("/api/health/days",payload,token)}
                    feedback.text="Erfolgreich: ${result.optInt("count")} Tage in Compass gespeichert. Dashboard öffnen und aktualisieren."
                }catch(ex:Exception){feedback.text="Abgleich fehlgeschlagen: ${ex.message}"}
            }
        }
        button("Compass-Webansicht öffnen") {startActivity(Intent(Intent.ACTION_VIEW,Uri.parse("https://theophil-kroller.github.io/compass-life/?view=recovery")))}
        button("Lokale Geräteverbindung vergessen"){
            HealthTokenStore.clear(this)
            feedback.text="Lokales Token entfernt. Für vollständigen Widerruf bitte auch das Gerät in Compass → Erholung trennen."
        }
        label("Android-Widget · Tagesvorschau",true)
        label("Das Homescreen-Widget zeigt optional offene Aufgaben, den nächsten geplanten Schritt und einen Schlafdurchschnitt. Es benötigt einen eigenen, widerrufbaren Lesecode aus Compass → Erholung. Der lokale Tresor bleibt geschützt.")
        val widgetCode=EditText(this).apply{hint="8-stelliger Widget-Code";inputType=InputType.TYPE_CLASS_NUMBER;root.addView(this)}
        button("Widget mit Compass verbinden") {
            val value=widgetCode.text.toString().trim()
            if(!value.matches(Regex("[0-9]{8}"))){feedback.text="Bitte acht Ziffern für das Widget eingeben.";return@button}
            lifecycleScope.launch {
                try {
                    feedback.text="Widget wird gekoppelt …"
                    val result=withContext(Dispatchers.IO){send("/api/widget/pair/claim",JSONObject().put("code",value),null)}
                    val token=result.getString("token")
                    if(!token.matches(Regex("cw1_[0-9a-f]{64}")))throw IllegalStateException("Ungültiges Widget-Token")
                    WidgetTokenStore.save(this@HealthCompanionActivity,token)
                    widgetCode.setText("")
                    TodayWidget.refreshAll(this@HealthCompanionActivity)
                    feedback.text="Widget verbunden. Die Tagesvorschau wird jetzt aktualisiert."
                }catch(ex:Exception){feedback.text="Widget-Kopplung fehlgeschlagen: ${ex.message}"}
            }
        }
        button("Widget jetzt aktualisieren") { TodayWidget.refreshAll(this);feedback.text="Widget-Abfrage gestartet." }
        val settings=getSharedPreferences("compass-widget-options",MODE_PRIVATE)
        button(if(settings.getBoolean("showTitles",false))"Aufgabentitel im Widget VERBERGEN" else "Aufgabentitel im Widget ANZEIGEN (privat)") {
            val enabled=!settings.getBoolean("showTitles",false)
            settings.edit().putBoolean("showTitles",enabled).apply()
            TodayWidget.refreshAll(this)
            feedback.text=if(enabled)"Aufgabentitel sichtbar. Beachte, dass sie damit auf deinem Homescreen erscheinen." else "Aufgabentitel werden verborgen."
        }
        button("Widget-Ziel-App auswählen") {
            startActivity(Intent(this,WidgetOpenActivity::class.java).putExtra("choose",true).putExtra("path","?view=today"))
        }
        button("Widget-Verbindung auf diesem Gerät vergessen") {
            WidgetTokenStore.clear(this);TodayWidget.refreshAll(this)
            feedback.text="Lokalen Widget-Schlüssel gelöscht. Bitte zusätzlich das Gerät in Compass → Erholung widerrufen."
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
        setContentView(TextView(this).apply{ text="Compass liest nach deiner Freigabe Schritte, Schlaf- und Sportdauer. Du startest den Upload manuell. Die Tageswerte werden in deinem privaten Compass-Cloudkonto gespeichert. Berechtigungen kannst du in Health Connect jederzeit widerrufen.";textSize=18f;setPadding(32,40,32,32)})
    }
}
