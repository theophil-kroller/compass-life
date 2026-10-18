package at.compasslife.widget

import android.content.Context
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import android.util.Base64
import java.security.KeyStore
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec

/** Device-scoped encrypted pairing token; only its hash is stored on the server. */
object WidgetTokenStore {
    private const val ALIAS="compass-widget-device-v1"
    private const val STORAGE="compass-widget-private"
    private fun key():SecretKey {
        val store=KeyStore.getInstance("AndroidKeyStore").apply{load(null)}
        val existing=store.getKey(ALIAS,null) as? SecretKey
        if(existing!=null)return existing
        val generator=KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES,"AndroidKeyStore")
        generator.init(KeyGenParameterSpec.Builder(ALIAS,KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT)
            .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
            .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE).build())
        return generator.generateKey()
    }
    fun save(ctx:Context,token:String){
        val cipher=Cipher.getInstance("AES/GCM/NoPadding");cipher.init(Cipher.ENCRYPT_MODE,key())
        val blob=cipher.iv+cipher.doFinal(token.toByteArray(Charsets.UTF_8))
        ctx.getSharedPreferences(STORAGE,Context.MODE_PRIVATE).edit().putString("credential",Base64.encodeToString(blob,Base64.NO_WRAP)).apply()
    }
    fun load(ctx:Context):String? { return try{
        val data=ctx.getSharedPreferences(STORAGE,Context.MODE_PRIVATE).getString("credential",null)?:return null
        val blob=Base64.decode(data,Base64.NO_WRAP)
        val cipher=Cipher.getInstance("AES/GCM/NoPadding")
        cipher.init(Cipher.DECRYPT_MODE,key(),GCMParameterSpec(128,blob.copyOfRange(0,12)))
        String(cipher.doFinal(blob.copyOfRange(12,blob.size)),Charsets.UTF_8).takeIf{it.matches(Regex("cw1_[0-9a-f]{64}"))}
    }catch(ex:Exception){null} }
    fun clear(ctx:Context){ctx.getSharedPreferences(STORAGE,Context.MODE_PRIVATE).edit().remove("credential").apply()}
}
