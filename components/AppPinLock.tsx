import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

const PIN_KEY = 'satuos.pin.v1';

export default function AppPinLock({ onUnlocked }: { onUnlocked: () => void }) {
  const [pin, setPin] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const unlock = async () => {
    if (busy || !/^\d{4,8}$/.test(pin)) {
      setMessage('Masukkan PIN angka 4–8 digit.');
      return;
    }
    setBusy(true);
    try {
      const savedPin = await AsyncStorage.getItem(PIN_KEY);
      if (!savedPin) {
        onUnlocked();
        return;
      }
      if (pin === savedPin) {
        setPin('');
        setAttempts(0);
        setMessage('');
        onUnlocked();
        return;
      }
      const next = attempts + 1;
      setAttempts(next);
      setPin('');
      if (next >= 5) {
        setMessage('Maaf sepertinya Anda penyusup, bukan pemilik Diary Catatan ini, atau Anda lupa kata sandi. Jika lupa, silakan hubungi Developer APK by.Mazkiplay.');
      } else if (next >= 3) {
        setMessage('Mohon maaf, kata kunci yang Anda masukkan salah. Silakan masukkan kata kunci yang benar.');
      } else {
        setMessage('PIN salah. Silakan coba lagi.');
      }
    } catch {
      setMessage('Kunci aplikasi belum dapat diperiksa. Coba tutup dan buka aplikasi kembali.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={s.screen}>
      <View style={s.card}>
        <View style={s.logo}><Text style={s.logoText}>S</Text></View>
        <Text style={s.brand}>SATUOS</Text>
        <Text style={s.subtitle}>Diary Catatan Pribadi</Text>
        <Text style={s.title}>Aplikasi terkunci</Text>
        <Text style={s.help}>Masukkan PIN untuk membuka catatan dan data keuangan Anda.</Text>
        <TextInput value={pin} onChangeText={(value) => { setPin(value.replace(/\D/g, '').slice(0, 8)); setMessage(''); }} keyboardType="number-pad" secureTextEntry maxLength={8} placeholder="Masukkan PIN" placeholderTextColor="#8393A8" style={s.input} accessibilityLabel="PIN aplikasi" />
        {!!message && <Text accessibilityRole="alert" style={s.message}>{message}</Text>}
        <Pressable accessibilityRole="button" onPress={unlock} disabled={busy} style={s.button}><Text style={s.buttonText}>{busy ? 'Memeriksa…' : 'Buka SATUOS'}</Text></Pressable>
        {attempts >= 3 && <Pressable accessibilityRole="button" onPress={() => Linking.openURL('https://wa.me/6285262965282?text=Saya%20memerlukan%20bantuan%20pemulihan%20PIN%20SATUOS')} style={s.whatsapp}><Text style={s.whatsappText}>☏  Hubungi Developer via WhatsApp</Text></Pressable>}
        <Text style={s.credit}>by.Mazkiplay</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', padding: 22, backgroundColor: '#07111F' },
  card: { width: '100%', maxWidth: 420, alignSelf: 'center', padding: 24, borderRadius: 24, backgroundColor: '#FFFFFF', alignItems: 'stretch', borderWidth: 1, borderColor: '#D9E8F8' },
  logo: { width: 54, height: 54, borderRadius: 17, backgroundColor: '#2388E8', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  logoText: { color: '#FFFFFF', fontSize: 30, fontWeight: '900' },
  brand: { color: '#1D4F83', textAlign: 'center', fontSize: 23, fontWeight: '900', letterSpacing: 3 },
  subtitle: { color: '#72849A', textAlign: 'center', fontSize: 12, marginTop: 4 },
  title: { color: '#172B42', fontSize: 20, fontWeight: '900', marginTop: 28, textAlign: 'center' },
  help: { color: '#66788D', textAlign: 'center', fontSize: 13, lineHeight: 20, marginTop: 8 },
  input: { borderWidth: 1, borderColor: '#C9D7E7', borderRadius: 13, padding: 15, marginTop: 22, color: '#132B43', fontSize: 20, textAlign: 'center', letterSpacing: 8, backgroundColor: '#F8FBFF' },
  message: { color: '#C43D36', fontSize: 12, lineHeight: 18, marginTop: 13, textAlign: 'center' },
  button: { marginTop: 18, padding: 15, borderRadius: 13, backgroundColor: '#2388E8', alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
  whatsapp: { marginTop: 12, padding: 13, borderRadius: 12, backgroundColor: '#E5F7EC', alignItems: 'center' },
  whatsappText: { color: '#137A46', fontSize: 12, fontWeight: '800' },
  credit: { color: '#8A9AAF', textAlign: 'center', fontSize: 10, marginTop: 20 },
});