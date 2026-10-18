package at.compasslife.widget;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.view.View;
import android.os.Bundle;
import android.widget.RemoteViews;
import org.json.JSONArray;
import org.json.JSONObject;

/** Second independent widget: the next seven days of sourced events in the owner's cloud catalog. */
public class DiscoveryWidget extends AppWidgetProvider {
    public static final String REFRESH="at.compasslife.widget.REFRESH_EVENTS";
    public static void refreshAll(Context c){c.sendBroadcast(new Intent(c,DiscoveryWidget.class).setAction(REFRESH));}
    private static String symbol(String category){
        switch(category){
            case "Bujinkan":return "🥷";
            case "Zouk":case "Kizomba":case "Bachata":case "Tanz":return "💃";
            case "Oper":return "🎼";
            case "Theater":case "Ballett":case "Musical":return "🎭";
            case "Kino":return "🎬";
            case "Kabarett":return "🎙";
            case "Konzert":return "♫";
            case "Sport":return "⚽";
            case "Festival":return "🎪";
            default:return "✦";
        }
    }
    private static void render(Context c,AppWidgetManager m,int id,JSONObject data,String error){
        RemoteViews v=new RemoteViews(c.getPackageName(),R.layout.widget_events);
        v.setOnClickPendingIntent(R.id.events_open,TodayWidget.link(c,"?view=recovery",201));
        
        v.setOnClickPendingIntent(R.id.events_refresh,PendingIntent.getBroadcast(c,206,new Intent(c,DiscoveryWidget.class).setAction(REFRESH),PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE));
        int[] fields={R.id.events_row1,R.id.events_row2,R.id.events_row3};
        for(int i=0;i<fields.length;i++){
            v.setViewVisibility(fields[i],View.GONE);
            v.setTextViewText(fields[i],"");
            v.setOnClickPendingIntent(fields[i],TodayWidget.link(c,"?view=recovery",210+i));
        }

        if(data==null){
            v.setTextViewText(R.id.events_summary,error==null?"Events werden geladen …":error);
            v.setTextViewText(R.id.events_subheading,"Deine nächsten sieben Tage");
        }else{
            int total=data.optInt("total",0);
            v.setTextViewText(R.id.events_summary,total==0?"Freiraum diese Woche":total+(total==1?" Veranstaltung":" Veranstaltungen"));
            JSONArray events=data.optJSONArray("events");
            Bundle options=m.getAppWidgetOptions(id);int max=options!=null&&options.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT,220)>=280?3:2;
            int shown=events==null?0:Math.min(max,events.length());
            v.setTextViewText(R.id.events_subheading,shown==0?"Keine kommenden Termine importiert":shown<total?"Deine Merkliste zuerst · weitere in Compass":"Für dich entdeckt · Merkliste zuerst");
            for(int i=0;i<shown;i++){
                JSONObject e=events.optJSONObject(i);if(e==null)continue;
                String date=e.optString("date","");
                String shortDay=date.length()==10?date.substring(8,10)+"."+date.substring(5,7)+".":"";
                String line=(e.optBoolean("saved",false)?"★  ":"")+symbol(e.optString("category",""))+"  "+shortDay+"  "+e.optString("title","");
                v.setTextViewText(fields[i],line);
                v.setViewVisibility(fields[i],View.VISIBLE);

            }
        }
        m.updateAppWidget(id,v);
    }
    @Override public void onReceive(Context c,Intent i){
        String action=i.getAction();
        if(REFRESH.equals(action)||AppWidgetManager.ACTION_APPWIDGET_UPDATE.equals(action)){
            AppWidgetManager m=AppWidgetManager.getInstance(c);
            int[] ids=m.getAppWidgetIds(new ComponentName(c,DiscoveryWidget.class));
            if(ids.length==0)return;
            for(int id:ids)render(c,m,id,null,null);
            PendingResult pending=goAsync();
            new Thread(()->{try{
                JSONObject j=new JSONObject(TodayWidget.fetch(c,"/api/widget/events"));
                for(int id:ids)render(c,m,id,j,null);
            }catch(Exception ex){String msg=WidgetTokenStore.INSTANCE.load(c)==null?"Einmalig verbinden":"Derzeit nicht erreichbar";
                for(int id:ids)render(c,m,id,null,msg);
            }finally{pending.finish();}}).start();return;
        }
        super.onReceive(c,i);
    }
    @Override public void onUpdate(Context c,AppWidgetManager m,int[] ids){
        for(int id:ids)render(c,m,id,null,null);
        refreshAll(c);
    }
}
