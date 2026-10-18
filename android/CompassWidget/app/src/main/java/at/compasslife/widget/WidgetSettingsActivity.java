package at.compasslife.widget;

import android.app.Activity;
import android.os.Bundle;
import android.graphics.Color;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.ScrollView;
import android.content.Intent;

/** Secondary settings avoid overwhelming first-time users with many buttons. */
public class WidgetSettingsActivity extends Activity {
  @Override public void onCreate(Bundle saved){super.onCreate(saved);
    LinearLayout root=new LinearLayout(this);root.setOrientation(LinearLayout.VERTICAL);root.setPadding(26,34,26,28);
    ScrollView scroller=new ScrollView(this);scroller.addView(root);setContentView(scroller);
    TextView title=new TextView(this);title.setText("Widget · Einstellungen");title.setTextSize(25);title.setTextColor(Color.rgb(36,74,58));root.addView(title);
    TextView info=new TextView(this);info.setText("Die Aufgaben-Titel erscheinen nur mit deiner ausdrücklichen Freigabe auf dem Homescreen. Beide Widgets haben einen widerrufbaren Lesezugang.");info.setTextSize(14);info.setPadding(0,20,0,15);root.addView(info);
    android.content.SharedPreferences prefs=getSharedPreferences("compass-widget-options",MODE_PRIVATE);
    Button titles=new Button(this);titles.setText(prefs.getBoolean("showTitles",false)?"Aufgabentitel ausblenden":"Aufgabentitel anzeigen");root.addView(titles);
    titles.setOnClickListener(v->{boolean show=!prefs.getBoolean("showTitles",false);prefs.edit().putBoolean("showTitles",show).apply();titles.setText(show?"Aufgabentitel ausblenden":"Aufgabentitel anzeigen");TodayWidget.refreshAll(this);});
    Button browser=new Button(this);browser.setText("Zielbrowser auswählen");root.addView(browser);browser.setOnClickListener(v->startActivity(new Intent(this,WidgetOpenActivity.class).putExtra("choose",true).putExtra("path","?view=today")));
    Button refresh=new Button(this);refresh.setText("Widgets aktualisieren");root.addView(refresh);refresh.setOnClickListener(v->TodayWidget.refreshAll(this));
    Button disconnect=new Button(this);disconnect.setText("Widget-Verbindung entfernen");root.addView(disconnect);disconnect.setOnClickListener(v->{WidgetTokenStore.INSTANCE.clear(this);TodayWidget.refreshAll(this);info.setText("Lokaler Schlüssel entfernt. Für vollständigen Widerruf bitte auch in Compass → Gesundheit das Gerät trennen.");});
  }
}
