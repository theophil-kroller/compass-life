package at.compasslife.widget

import android.content.Context
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.HealthConnectFeatures
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.ExerciseSessionRecord
import androidx.health.connect.client.records.SleepSessionRecord
import androidx.health.connect.client.records.StepsRecord
import androidx.health.connect.client.request.AggregateRequest
import androidx.health.connect.client.time.TimeRangeFilter
import androidx.work.Constraints
import androidx.work.CoroutineWorker
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.NetworkType
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.WorkerParameters
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL
import java.time.LocalDate
import java.time.ZoneId
import java.util.concurrent.TimeUnit

/** Same measurement and endpoint logic for manual & consented periodic sync. */
object HealthDailySync {
    val reads = setOf(
        HealthPermission.getReadPermission(StepsRecord::class),
        HealthPermission.getReadPermission(SleepSessionRecord::class),
        HealthPermission.getReadPermission(ExerciseSessionRecord::class)
    )
    const val backgroundRead=HealthPermission.PERMISSION_READ_HEALTH_DATA_IN_BACKGROUND
    private const val endpoint="https://compass-api.theophil-tiger.workers.dev/api/health/days"
    fun supportsBackground(client:HealthConnectClient):Boolean =
        client.features.getFeatureStatus(HealthConnectFeatures.FEATURE_READ_HEALTH_DATA_IN_BACKGROUND) == HealthConnectFeatures.FEATURE_STATUS_AVAILABLE

    suspend fun run(context:Context,background:Boolean):Int {
        val token=HealthTokenStore.load(context)?:throw IllegalStateException("Gerät nicht gekoppelt")
        if(HealthConnectClient.getSdkStatus(context)!=HealthConnectClient.SDK_AVAILABLE)throw IllegalStateException("Health Connect nicht verfügbar")
        val client=HealthConnectClient.getOrCreate(context)
        val granted=client.permissionController.getGrantedPermissions()
        if(!granted.containsAll(reads))throw SecurityException("Health Connect: Schritte/Schlaf/Training nicht freigegeben")
        if(background&&(!supportsBackground(client)||backgroundRead !in granted))
            throw SecurityException("Hintergrund-Lesezugriff in Health Connect fehlt")
        val zone=ZoneId.systemDefault();val today=LocalDate.now();val rows=JSONArray()
        for(i in 6 downTo 0){
            val date=today.minusDays(i.toLong())
            val from=date.atStartOfDay(zone).toInstant()
            val to=date.plusDays(1).atStartOfDay(zone).toInstant()
            val metrics=client.aggregate(AggregateRequest(
                setOf(StepsRecord.COUNT_TOTAL,SleepSessionRecord.SLEEP_DURATION_TOTAL,ExerciseSessionRecord.EXERCISE_DURATION_TOTAL),
                TimeRangeFilter.between(from,to)))
            val steps=metrics[StepsRecord.COUNT_TOTAL]
            val sleep=metrics[SleepSessionRecord.SLEEP_DURATION_TOTAL]?.toMinutes()
            val training=metrics[ExerciseSessionRecord.EXERCISE_DURATION_TOTAL]?.toMinutes()
            if(steps!=null||sleep!=null||training!=null){
                val item=JSONObject().put("day",date.toString())
                if(steps!=null)item.put("steps",steps.coerceIn(0L,100000L))
                if(sleep!=null)item.put("sleepMinutes",sleep.coerceIn(0L,1440L))
                if(training!=null)item.put("exerciseMinutes",training.coerceIn(0L,1440L))
                rows.put(item)
            }
        }
        if(rows.length()==0)return 0
        val count=withContext(Dispatchers.IO){
            val conn=URL(endpoint).openConnection() as HttpURLConnection
            try{
                conn.requestMethod="POST";conn.connectTimeout=10000;conn.readTimeout=15000;conn.doOutput=true
                conn.setRequestProperty("Authorization","Bearer $token")
                conn.setRequestProperty("Content-Type","application/json")
                conn.outputStream.use{it.write(JSONObject().put("days",rows).toString().toByteArray(Charsets.UTF_8))}
                val status=conn.responseCode
                if(status==401)throw SecurityException("Geräteverbindung widerrufen")
                if(status !in 200..299)throw IOException("Health Upload HTTP $status")
                val text=conn.inputStream.bufferedReader().use{it.readText().take(3000)}
                JSONObject(text).optInt("count",rows.length())
            }finally{conn.disconnect()}
        }
        context.getSharedPreferences(HealthSyncSchedule.PREF,Context.MODE_PRIVATE).edit()
            .putLong("lastSuccess",System.currentTimeMillis()).remove("lastError").apply()
        return count
    }
}

/** WorkManager period is inexact; Android may defer due to power constraints. */
object HealthSyncSchedule {
    const val PREF="compass-health-sync"
    private const val WORK="compass-daily-health-v1"
    fun enabled(ctx:Context)=ctx.getSharedPreferences(PREF,Context.MODE_PRIVATE).getBoolean("enabled",false)
    fun enable(ctx:Context){
        ctx.getSharedPreferences(PREF,Context.MODE_PRIVATE).edit().putBoolean("enabled",true).apply()
        val request=PeriodicWorkRequestBuilder<HealthDailyWorker>(24,TimeUnit.HOURS)
            .setInitialDelay(1,TimeUnit.HOURS)
            .setConstraints(Constraints.Builder().setRequiredNetworkType(NetworkType.CONNECTED).build())
            .build()
        WorkManager.getInstance(ctx).enqueueUniquePeriodicWork(WORK,ExistingPeriodicWorkPolicy.UPDATE,request)
    }
    fun disable(ctx:Context){
        ctx.getSharedPreferences(PREF,Context.MODE_PRIVATE).edit().putBoolean("enabled",false).apply()
        WorkManager.getInstance(ctx).cancelUniqueWork(WORK)
    }
}

class HealthDailyWorker(ctx:Context,parameters:WorkerParameters):CoroutineWorker(ctx,parameters){
    override suspend fun doWork():Result {
        if(!HealthSyncSchedule.enabled(applicationContext))return Result.success()
        return try{HealthDailySync.run(applicationContext,true);Result.success()}
        catch(ex:SecurityException){
            applicationContext.getSharedPreferences(HealthSyncSchedule.PREF,Context.MODE_PRIVATE).edit().putString("lastError","Berechtigung oder Verbindung fehlt").apply()
            Result.failure()
        }catch(ex:Exception){
            applicationContext.getSharedPreferences(HealthSyncSchedule.PREF,Context.MODE_PRIVATE).edit().putString("lastError","Abgleich verschoben; erneuter Versuch").apply()
            Result.retry()
        }
    }
}
