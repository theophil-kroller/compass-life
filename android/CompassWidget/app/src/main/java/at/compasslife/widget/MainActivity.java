package at.compasslife.widget;

import android.app.Activity;
import android.os.Bundle;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Typeface;

import android.text.InputType;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import org.json.JSONObject;
import java.net.HttpURLConnection;
import java.net.URL;

/** Two simple setup journeys. Widget setup never creates a separate browser vault. */
public class MainActivity extends Activity {
    private TextView feedback;
    private int dp(float v){return (int)(getResources().getDisplayMetrics().density*v+.5f);}
    private TextView text(LinearLayout root,String value,int size,boolean strong){
        TextView v=new TextView(this);v.setText(value);v.setTextColor(Color.rgb(36,70,53));v.setTextSize(size);
        if(strong)v.setTypeface(Typeface.DEFAULT,Typeface.BOLD);
        v.setPadding(0,dp(5),0,dp(12));root.addView(v);return v;
    }
    @Override public void onCreate(Bundle state){
        super.onCreate(state);
        LinearLayout root=new LinearLayout(this);root.setOrientation(LinearLayout.VERTICAL);root.setPadding(dp(22),dp(30),dp(22),dp(26));root.setBackgroundColor(Color.rgb(250,252,250));
        ScrollView scroll=new ScrollView(this);scroll.addView(root);setContentView(scroll);
        text(root,"COMPASS",13,true);
        text(root,"Dein Startbildschirm",28,true);
        text(root,"Zwei Widgets: Fokus für deine nächsten Schritte und Entdecken für Veranstaltungen. Einmalig koppeln – danach einfach auf dem Homescreen hinzufügen.",15,false);
        boolean connected=WidgetTokenStore.INSTANCE.load(this)!=null;
        text(root,connected?"✓ Widgets verbunden":"1. Widgets verbinden",20,true);
        text(root,"Erzeuge in Compass → Gesundheit einen Widget-Code und gib ihn hier ein. Der lokale Tresor bleibt in deiner PWA.",13,false);
        EditText code=new EditText(this);code.setHint("8-stelliger Widget-Code");code.setInputType(InputType.TYPE_CLASS_NUMBER);code.setSingleLine(true);root.addView(code);
        Button connect=new Button(this);connect.setText("Widget verbinden");root.addView(connect);
        connect.setOnClickListener(v->{
            String c=code.getText().toString().trim();if(!c.matches("[0-9]{8}")){feedback.setText("Bitte den 8-stelligen Code eingeben.");return;}
            connect.setEnabled(false);feedback.setText("Verbindung wird eingerichtet …");
            new Thread(()->{
                String result;
                try{
                    HttpURLConnection con=(HttpURLConnection)new URL("https://compass-api.theophil-tiger.workers.dev/api/widget/pair/claim").openConnection();
                    try{
                        con.setRequestMethod("POST");con.setDoOutput(true);con.setConnectTimeout(9000);con.setReadTimeout(11000);con.setRequestProperty("Content-Type","application/json");
                        con.getOutputStream().write(new JSONObject().put("code",c).toString().getBytes("UTF-8"));
                        if(con.getResponseCode()!=200)throw new Exception("Code abgelaufen oder ungültig (HTTP "+con.getResponseCode()+")");
                        java.io.BufferedReader rd=new java.io.BufferedReader(new java.io.InputStreamReader(con.getInputStream(),"UTF-8"));String payload=rd.readLine();if(payload==null||payload.length()>2000)throw new Exception("Antwort ungültig");String token=new JSONObject(payload).getString("token");
                        if(!token.matches("cw1_[0-9a-f]{64}"))throw new Exception("Unerwartete Antwort");
                        WidgetTokenStore.INSTANCE.save(this,token);TodayWidget.refreshAll(this);
                        result="✓ Verbunden! Füge jetzt Compass Fokus oder Entdecken auf deinem Homescreen hinzu.";
                    }finally{con.disconnect();}
                }catch(Exception ex){result="Kopplung fehlgeschlagen: "+ex.getMessage();}
                final String message=result;runOnUiThread(()->{feedback.setText(message);connect.setEnabled(true);});
            }).start();
        });
        feedback=text(root,connected?"Bereits gekoppelt. Beide Widgets können denselben Zugang nutzen.":"Noch nicht verbunden.",13,false);
        text(root,"2. Gesundheitsdaten",20,true);
        text(root,"Optional: Health Connect einrichten und den täglichen Abgleich aktivieren. Keine Gesundheitsdaten im Fokus-Widget.",13,false);
        Button health=new Button(this);health.setText("Gesundheit einrichten");root.addView(health);
        health.setOnClickListener(v->startActivity(new Intent(this,HealthCompanionActivity.class)));
        TextView privacy=text(root,"Privatsphäre & Öffnen: Aufgabentitel sind zunächst verborgen. Einstellungen zur Anzeige und zum Zielbrowser findest du in den erweiterten Widget-Einstellungen.",12,false);
        privacy.setOnClickListener(v->startActivity(new Intent(this,WidgetSettingsActivity.class)));
    }
}
