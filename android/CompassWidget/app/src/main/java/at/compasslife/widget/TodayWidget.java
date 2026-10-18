package at.compasslife.widget;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.widget.RemoteViews;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/** Secure initial widget: NO tokens, task text, or medical data outside encrypted Compass PWA. */
public class TodayWidget extends AppWidgetProvider {
    private static PendingIntent link(Context context, String url, int requestCode) {
        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
        return PendingIntent.getActivity(context, requestCode, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }
    @Override public void onUpdate(Context context, AppWidgetManager manager, int[] ids) {
        for(int id:ids) {
            RemoteViews view = new RemoteViews(context.getPackageName(), R.layout.widget_today);
            view.setTextViewText(R.id.widget_date, new SimpleDateFormat("EEEE, d. MMMM", Locale.GERMAN).format(new Date()));
            view.setOnClickPendingIntent(R.id.widget_today_button,link(context,"https://theophil-kroller.github.io/compass-life/?view=today",100));
            view.setOnClickPendingIntent(R.id.widget_capture_button,link(context,"https://theophil-kroller.github.io/compass-life/?capture=1",101));
            view.setOnClickPendingIntent(R.id.widget_recovery_button,link(context,"https://theophil-kroller.github.io/compass-life/?view=recovery",102));
            manager.updateAppWidget(id,view);
        }
    }
}
