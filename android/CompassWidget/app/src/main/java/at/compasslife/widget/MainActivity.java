package at.compasslife.widget;

import android.app.Activity;
import android.os.Bundle;
import android.content.Intent;

/** Stable launcher for the widget and opt-in Health Connect companion. */
public class MainActivity extends Activity {
  @Override public void onCreate(Bundle state) {
    super.onCreate(state);
    startActivity(new Intent(this, HealthCompanionActivity.class));
    finish();
  }
}
