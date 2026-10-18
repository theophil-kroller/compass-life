package at.compasslife.widget;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.RemoteViews;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import org.json.JSONArray;
import org.json.JSONObject;

/** Privacy-first focus widget. Personal task titles are hidden unless explicitly enabled. */
public class TodayWidget extends AppWidgetProvider {
    public static final String REFRESH="at.compasslife.widget.REFRESH";
    static final String BASE="https://compass-api.theophil-tiger.workers.dev";
    static String day(){return new SimpleDateFormat("yyyy-MM-dd",Locale.US).format(new Date());}
    static String fetch(Context context,String path)throws Exception{
        String credential=WidgetTokenStore.INSTANCE.load(context);
        if(credential==null)throw new IllegalStateException("unpaired");
        HttpURLConnection conn=(HttpURLConnection)new URL(BASE+path+"?day="+day()).openConnection();
        try{
            conn.setConnectTimeout(9000);conn.setReadTimeout(11000);
            conn.setRequestProperty("Authorization","Bearer "+credential);
            conn.setRequestProperty("Accept","application/json");
            int status=conn.getResponseCode();
            if(status==401){WidgetTokenStore.INSTANCE.clear(context);throw new SecurityException("revoked");}
            if(status!=200)throw new Exception("HTTP "+status);
            StringBuilder body=new StringBuilder();try(BufferedReader r=new BufferedReader(new InputStreamReader(conn.getInputStream()))){String line;while((line=r.readLine())!=null&&body.length()<16000)body.append(line);}
            return body.toString();
        }finally{conn.disconnect();}
    }
    static PendingIntent link(Context c,String path,int request){
        Intent i=new Intent(c,WidgetOpenActivity.class).putExtra("path",path);
        return PendingIntent.getActivity(c,request,i,PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);
    }
    static PendingIntent setup(Context c,int request){
        return PendingIntent.getActivity(c,request,new Intent(c,MainActivity.class),PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);
    }
    private static PendingIntent refreshLink(Context c){
        return PendingIntent.getBroadcast(c,22,new Intent(c,TodayWidget.class).setAction(REFRESH),PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);
    }
    public static void refreshAll(Context c){
        c.sendBroadcast(new Intent(c,TodayWidget.class).setAction(REFRESH));
        DiscoveryWidget.refreshAll(c);
    }
    private static String when(String date,String now){
        if(date==null||date.isEmpty())return "Ohne Termin";
        if(date.compareTo(now)<0)return "Überfällig";
        if(date.equals(now))return "Heute";
        return "Geplant · "+date.substring(8,10)+"."+date.substring(5,7)+".";
    }
    private static void render(Context c,AppWidgetManager m,int id,JSONObject data,String error){
        RemoteViews v=new RemoteViews(c.getPackageName(),R.layout.widget_today);
        v.setTextViewText(R.id.widget_date,new SimpleDateFormat("EEE, d. MMM",Locale.GERMAN).format(new Date()));
        v.setOnClickPendingIntent(R.id.widget_today_button,link(c,"?view=today",101));
        v.setOnClickPendingIntent(R.id.widget_capture_button,link(c,"?capture=1",102));
        v.setOnClickPendingIntent(R.id.widget_refresh,refreshLink(c));
        v.setOnClickPendingIntent(R.id.widget_setup,setup(c,104));
        Bundle size=m.getAppWidgetOptions(id);boolean compact=size.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT,240)<355;
        v.setViewVisibility(R.id.widget_more,compact?View.GONE:View.VISIBLE);
        boolean showTitles=c.getSharedPreferences("compass-widget-options",0).getBoolean("showTitles",false);
        if(data==null){
            v.setTextViewText(R.id.widget_count,"–");v.setTextViewText(R.id.widget_waiting,"–");
            v.setTextViewText(R.id.widget_next,error==null?"Fokus wird geladen …":error);
            v.setTextViewText(R.id.widget_meta,"Verbinde Compass im Companion");
            v.setTextViewText(R.id.widget_second,"Öffne die Einstellungen zur Verbindung");
        }else{
            v.setTextViewText(R.id.widget_count,String.valueOf(data.optInt("openToday",0)));
            v.setTextViewText(R.id.widget_waiting,String.valueOf(data.optInt("waitingFor",0)));
            JSONArray tasks=data.optJSONArray("nextActions");
            JSONObject first=tasks!=null?tasks.optJSONObject(0):null;
            JSONObject second=tasks!=null?tasks.optJSONObject(1):null;
            if(first==null){
                v.setTextViewText(R.id.widget_next,"Alles im Blick.");
                v.setTextViewText(R.id.widget_meta,"Kein geplanter nächster Schritt");
            }else{
                v.setTextViewText(R.id.widget_next,showTitles?first.optString("title","Nächste Aktion"):"Nächste Aktion bereit");
                String meta=when(first.optString("date",""),day());
                if(showTitles&&first.optInt("minutes",0)>0)meta+="  ·  "+first.optInt("minutes")+" min";
                if(showTitles&&!first.optString("context","").isEmpty())meta+="  ·  "+first.optString("context");
                v.setTextViewText(R.id.widget_meta,meta);
            }
            v.setTextViewText(R.id.widget_second,second==null?"Keine weiteren geplanten Schritte":showTitles?second.optString("title",""):"Weiterer Schritt · "+when(second.optString("date",""),day()));
        }
        m.updateAppWidget(id,v);
    }
    @Override public void onReceive(Context context,Intent intent){
        String action=intent.getAction();
        if(REFRESH.equals(action)||AppWidgetManager.ACTION_APPWIDGET_UPDATE.equals(action)){
            AppWidgetManager m=AppWidgetManager.getInstance(context);
            int[] ids=m.getAppWidgetIds(new ComponentName(context,TodayWidget.class));
            if(ids.length==0)return;
            for(int id:ids)render(context,m,id,null,null);
            PendingResult pending=goAsync();
            new Thread(()->{try{
                JSONObject data=new JSONObject(fetch(context,"/api/widget/summary"));
                for(int id:ids)render(context,m,id,data,null);
            }catch(Exception e){String reason=WidgetTokenStore.INSTANCE.load(context)==null?"Einmalig verbinden":e instanceof SecurityException?"Verbindung widerrufen":"Offline · später aktualisieren";
                for(int id:ids)render(context,m,id,null,reason);
            }finally{pending.finish();}}).start();return;
        }
        super.onReceive(context,intent);
    }
    @Override public void onUpdate(Context c,AppWidgetManager m,int[] ids){
        for(int id:ids)render(c,m,id,null,null);
        refreshAll(c);
    }
    @Override public void onAppWidgetOptionsChanged(Context c,AppWidgetManager m,int id,Bundle options){
        render(c,m,id,null,null);refreshAll(c);
    }
}
