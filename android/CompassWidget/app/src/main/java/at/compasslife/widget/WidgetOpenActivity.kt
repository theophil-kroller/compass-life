package at.compasslife.widget

import android.app.Activity
import android.os.Bundle
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.graphics.Color
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Button
import android.widget.ScrollView

/** Choose a link target explicitly; the PWA has browser-specific IndexedDB. */
class WidgetOpenActivity: Activity(){
    private fun url(path:String):Uri {
        val safe=if(path in setOf("?view=today","?capture=1","?view=recovery"))path else "?view=today"
        return Uri.parse("https://theophil-kroller.github.io/compass-life/"+safe)
    }
    override fun onCreate(savedInstanceState:Bundle?){
        super.onCreate(savedInstanceState)
        val path=intent.getStringExtra("path")?:"?view=today"
        val choose=intent.getBooleanExtra("choose",false)
        val settings=getSharedPreferences("compass-widget-options",MODE_PRIVATE)
        val app=settings.getString("linkPackage",null)
        if(!choose&&app!=null){
            try { startActivity(Intent(Intent.ACTION_VIEW,url(path)).setPackage(app).addCategory(Intent.CATEGORY_BROWSABLE));finish();return }
            catch(_:Exception){settings.edit().remove("linkPackage").apply()}
        }
        val root=LinearLayout(this).apply{orientation=LinearLayout.VERTICAL;setPadding(28,34,28,24)}
        setContentView(ScrollView(this).apply{addView(root)})
        fun line(value:String,large:Boolean=false){root.addView(TextView(this).apply{ text=value;textSize=if(large)21f else 14f;setTextColor(Color.rgb(37,70,54));setPadding(0,0,0,22)})}
        line("Compass · Öffnen mit …",true)
        line("Wähle die installierte Compass-PWA, falls sie hier angeboten wird. Das ist wichtig: Der Tresor in Chrome und Samsung Internet ist jeweils separat gespeichert.")
        val intentToView=Intent(Intent.ACTION_VIEW,url(path)).addCategory(Intent.CATEGORY_BROWSABLE)
        val apps=packageManager.queryIntentActivities(intentToView,PackageManager.MATCH_DEFAULT_ONLY)
            .distinctBy{it.activityInfo.packageName}.sortedBy{it.loadLabel(packageManager).toString()}
        for(appInfo in apps){
            val pkg=appInfo.activityInfo.packageName
            val name=appInfo.loadLabel(packageManager).toString()
            root.addView(Button(this).apply{text="$name öffnen";setOnClickListener{
                settings.edit().putString("linkPackage",pkg).apply()
                try{startActivity(Intent(Intent.ACTION_VIEW,url(path)).setPackage(pkg).addCategory(Intent.CATEGORY_BROWSABLE));finish()}
                catch(ex:Exception){line("Öffnen fehlgeschlagen: ${ex.message}")}
            }})
        }
        root.addView(Button(this).apply{text="Android-App-Auswahl öffnen";setOnClickListener{
            try {startActivity(Intent.createChooser(Intent(Intent.ACTION_VIEW,url(path)),"Compass öffnen mit"));finish()}
            catch(ex:Exception){line("Kein Browser verfügbar: ${ex.message}")}
        }})
        line("Tipp: Wenn du bisher die installierte PWA verwendest, versuche sie hier als Ziel auszuwählen. Es werden keine Tresordaten an diese Auswahl übertragen.")
    }
}
