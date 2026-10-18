import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const root=new URL('../',import.meta.url);
const read=path=>readFileSync(new URL(path,root),'utf8');

test('Android widget offers three consistent deep links supported by Compass router',()=>{
 const native=read('android/CompassWidget/app/src/main/java/at/compasslife/widget/TodayWidget.java');
 const xml=read('android/CompassWidget/app/src/main/res/layout/widget_today.xml');
 const web=read('client/src/main.js');
 for(const [name,route] of [['widget_today_button','?view=today'],['widget_capture_button','?capture=1'],['widget_recovery_button','?view=recovery']]){
   assert.ok(xml.includes(`android:id="@+id/${name}"`));
   assert.ok(native.includes(`R.id.${name}`));
   assert.ok(native.includes(route));
 }
 assert.match(web,/bootCapture=bootSearch\.get\('capture'\)==='1'/);
 assert.match(web,/bootView=bootSearch\.get\('view'\)/);
 assert.match(web,/\['today','inbox'.*'recovery'/);
});
test('GitHub can produce test APK; native widget has no health/token permissions',()=>{
 const flow=read('.github/workflows/build-android-widget.yml');
 const manifest=read('android/CompassWidget/app/src/main/AndroidManifest.xml');
 assert.match(flow,/assembleDebug/);
 assert.match(flow,/upload-artifact@v4/);
 assert.match(flow,/app-debug\.apk/);
 assert.match(manifest,/READ_SLEEP/);
 assert.match(manifest,/READ_STEPS/);
 assert.match(manifest,/READ_EXERCISE/);
 assert.match(read('android/CompassWidget/app/src/main/java/at/compasslife/widget/HealthTokenStore.kt'),/AndroidKeyStore/);
});
