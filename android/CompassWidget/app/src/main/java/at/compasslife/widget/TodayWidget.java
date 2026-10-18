package at.compasslife.widget;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.widget.RemoteViews;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import org.json.JSONObject;

/** Read-only home screen preview; no passwords or full sessions are stored. */
public class TodayWidget extends AppWidgetProvider {
    public static final String REFRESH = "at.compasslife.widget.REFRESH";
    private static PendingIntent link(Context c,String path,int request){
        Intent i=new Intent(c,WidgetOpenActivity.class);
        i.putExtra("path",path);
        return PendingIntent.getActivity(c,request,i,PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);
    }
    private static PendingIntent refreshLink(Context c){
        Intent i=new Intent(c,TodayWidget.class).setAction(REFRESH);
        return PendingIntent.getBroadcast(c,22,i,PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);
    }
    public static void refreshAll(Context context){
        Intent i=new Intent(context,TodayWidget.class).setAction(REFRESH);
        context.sendBroadcast(i);
    }
    private static void render(Context c,AppWidgetManager m,int id,JSONObject data,String error){
        RemoteViews v=new RemoteViews(c.getPackageName(),R.layout.widget_today);
        v.setTextViewText(R.id.widget_date,new SimpleDateFormat("EEE, d. MMM",Locale.GERMAN).format(new Date()));
        if(data==null){
            v.setTextViewText(R.id.widget_count,WidgetTokenStore.INSTANCE.load(c)==null?"–":"·");
            v.setTextViewText(R.id.widget_next,WidgetTokenStore.INSTANCE.load(c)==null?"Widget in Companion verbinden":"Vorschau noch nicht geladen");
            v.setTextViewText(R.id.widget_health,error==null?"Tippe ↻ zum Aktualisieren":error);
        }else{
            int count=data.optInt("openToday",0);
            v.setTextViewText(R.id.widget_count,Integer.toString(count));
            JSONObject next=data.optJSONObject("next");
            boolean names=c.getSharedPreferences("compass-widget-options",0).getBoolean("showTitles",false);
            v.setTextViewText(R.id.widget_next,next==null?"Keine geplante nächste Aufgabe":names?"Nächster Schritt: "+next.optString("title",""):"Nächste Aufgabe: "+next.optString("dueDate","ohne Datum"));
            if(data.isNull("sleepAverageMinutes"))v.setTextViewText(R.id.widget_health,"Schlaf: keine Daten");
            else{int sleep=data.optInt("sleepAverageMinutes");v.setTextViewText(R.id.widget_health,"Ø Schlaf "+(sleep/60)+" h "+String.format(Locale.GERMAN,"%02d",sleep%60)+" m · "+data.optInt("sleepMeasuredDays",0)+" Tage");}
        }
        v.setOnClickPendingIntent(R.id.widget_today_button,link(c,"?view=today",101));
        v.setOnClickPendingIntent(R.id.widget_capture_button,link(c,"?capture=1",102));
        v.setOnClickPendingIntent(R.id.widget_recovery_button,link(c,"?view=recovery",103));
        v.setOnClickPendingIntent(R.id.widget_refresh,refreshLink(c));
        v.setOnClickPendingIntent(R.id.widget_setup,PendingIntent.getActivity(c,104,new Intent(c,MainActivity.class),PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE));
        m.updateAppWidget(id,v);
    }
    @Override public void onReceive(Context context,Intent intent){
        String action=intent.getAction();
        if(REFRESH.equals(action)||AppWidgetManager.ACTION_APPWIDGET_UPDATE.equals(action)){
            AppWidgetManager manager=AppWidgetManager.getInstance(context);
            int[] ids=manager.getAppWidgetIds(new ComponentName(context,TodayWidget.class));
            if(ids.length==0)return;
            for(int id:ids)render(context,manager,id,null,null);
            PendingResult pending=goAsync();
            new Thread(()->{try{
                String credential=WidgetTokenStore.INSTANCE.load(context);
                if(credential==null){for(int id:ids)render(context,manager,id,null,"Zuerst im Companion koppeln");return;}
                String day=new SimpleDateFormat("yyyy-MM-dd",Locale.US).format(new Date());
                HttpURLConnection conn=(HttpURLConnection)new URL("https://compass-api.theophil-tiger.workers.dev/api/widget/summary?day="+day).openConnection();
                try{
                    conn.setConnectTimeout(9000);conn.setReadTimeout(11000);
                    conn.setRequestProperty("Authorization","Bearer "+credential);
                    conn.setRequestProperty("Accept","application/json");
                    int status=conn.getResponseCode();
                    if(status==401){WidgetTokenStore.INSTANCE.clear(context);for(int id:ids)render(context,manager,id,null,"Verbindung widerrufen · neu koppeln");return;}
                    if(status!=200)throw new Exception("HTTP "+status);
                    StringBuilder body=new StringBuilder();try(BufferedReader r=new BufferedReader(new InputStreamReader(conn.getInputStream()))){String line;while((line=r.readLine())!=null&&body.length()<8192)body.append(line);}
                    JSONObject data=new JSONObject(body.toString());
                    for(int id:ids)render(context,manager,id,data,null);
                }finally{conn.disconnect();}
            }catch(Exception ex){for(int id:ids)render(context,manager,id,null,"Offline · ↻ aktualisieren");}
            finally{pending.finish();}}).start();return;
        }
        super.onReceive(context,intent);
    }
    @Override public void onUpdate(Context c,AppWidgetManager m,int[] ids){for(int id:ids)render(c,m,id,null,null);}
}
