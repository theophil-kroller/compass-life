package at.compasslife.widget;
import android.app.Activity;
import android.os.Bundle;
import android.content.Intent;
import android.net.Uri;
public class MainActivity extends Activity {
  @Override public void onCreate(Bundle state){ super.onCreate(state); startActivity(new Intent(Intent.ACTION_VIEW,Uri.parse("https://theophil-kroller.github.io/compass-life/?view=today")));finish(); }
}
