import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';

const PIN_KEY = 'satuos.pin.v1';
const ENABLE_KEY = 'satuos.pin.enabled.v1';

export default function Settings() {
  const router = useRouter();
  const [enabled, setEnabled] = useState(false);
  const [hasPin, setHasPin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const [pin, flag] = await Promise.all([AsyncStorage.getItem(PIN_KEY), AsyncStorage.getItem(ENABLE_KEY)]);
      setHasPin(!!pin);
      setEnabled(flag === 'true' && !!pin);
    } catch {
      Alert.alert('Pengaturan belum tersedia', 'Penyimpanan lokal tidak dapat dibuka. Silakan coba lagi.');
    }
  }, []);

  useFocusEffect(useCallback(() => { void load(); }, [load]));

  const savePin = async () => {
    if (!/^\d{4,8}$/.test(newPin)) { Alert.alert('PIN belum valid', 'Gunakan PIN angka 4–8 digit.'); return; }
    if (newPin !== confirmPin) { Alert.alert('PIN tidak cocok', 'Ulangi PIN dengan angka yang sama.'); return; }
    setBusy(true);
    try {
      await AsyncStorage.setItem(PIN_KEY, newPin);
      await AsyncStorage.setItem(ENABLE_KEY, 'true');
      setNewPin('');
      setConfirmPin('');
      setHasPin(true);
      setEnabled(true);
      Alert.alert('Kunci aplikasi aktif', 'PIN akan diminta setiap kali aplikasi dibuka, setelah intro SATUOS selesai.');
    } catch {
      Alert.alert('Gagal menyimpan', 'PIN tidak dapat disimpan pada perangkat ini.');
    } finally { setBusy(false); }
  };

  const toggleLock = async (value: boolean) => {
    if (value && !hasPin) {
      Alert.alert('Buat PIN terlebih dahulu', 'Isi PIN baru dan konfirmasi PIN di bagian Keamanan Aplikasi.');
      return;
    }
    try {
      await AsyncStorage.setItem(ENABLE_KEY, value ? 'true' : 'false');
      setEnabled(value);
      Alert.alert(value ? 'Kunci diaktifkan' : 'Kunci dinonaktifkan', value ? 'PIN akan diminta setiap kali aplikasi dibuka.' : 'Aplikasi tidak akan meminta PIN saat mulai dibuka.');
    } catch {
      Alert.alert('Gagal mengubah pengaturan', 'Silakan coba lagi.');
    }
  };

  const removePin = () => Alert.alert('Hapus PIN?', 'Kunci aplikasi akan dinonaktifkan dan PIN lokal dihapus.', [
    { text: 'Batal', style: 'cancel' },
    { text: 'Hapus PIN', style: 'destructive', onPress: async () => {
      try { await AsyncStorage.multiRemove([PIN_KEY, ENABLE_KEY]); setEnabled(false); setHasPin(false); setNewPin(''); setConfirmPin(''); }
      catch { Alert.alert('Gagal', 'PIN belum dapat dihapus.'); }
    } },
  ]);

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.page} keyboardShouldPersistTaps="handled">
        <Pressable onPress={() => router.back()} style={s.back}><Text style={s.backText}>← Kembali</Text></Pressable>
        <Text style={s.eyebrow}>SATUOS · PRIVASI</Text>
        <Text style={s.title}>Pengaturan</Text>
        <Text style={s.subtitle}>Kelola keamanan aplikasi dan data yang tersimpan di perangkat.</Text>

        <View style={s.card}>
          <View style={s.row}><View style={s.icon}><Text style={s.iconText}>🔒</Text></View><View style={s.flex}><Text style={s.cardTitle}>Kunci Aplikasi dengan PIN</Text><Text style={s.muted}>{hasPin ? 'PIN sudah dibuat di perangkat ini.' : 'Buat PIN angka 4–8 digit untuk mengunci layar aplikasi.'}</Text></View><Switch value={enabled} onValueChange={toggleLock} trackColor={{ false: '#C8D2DF', true: '#2388E8' }} /></View>
          <View style={s.notice}><Text style={s.noticeText}>Catatan: kunci ini membantu mencegah orang membuka aplikasi tanpa izin saat perangkat digunakan bersama. Ini bukan enkripsi database dan tidak menggantikan keamanan sistem Android.</Text></View>
          <Text style={s.label}>{hasPin ? 'Ganti PIN' : 'Buat PIN baru'}</Text>
          <TextInput value={newPin} onChangeText={(v) => setNewPin(v.replace(/\D/g, '').slice(0, 8))} keyboardType="number-pad" secureTextEntry maxLength={8} placeholder="PIN baru (4–8 angka)" placeholderTextColor="#8B9AAF" style={s.input} />
          <TextInput value={confirmPin} onChangeText={(v) => setConfirmPin(v.replace(/\D/g, '').slice(0, 8))} keyboardType="number-pad" secureTextEntry maxLength={8} placeholder="Ulangi PIN baru" placeholderTextColor="#8B9AAF" style={s.input} />
          <Pressable disabled={busy} onPress={savePin} style={s.primary}><Text style={s.primaryText}>{busy ? 'Menyimpan…' : 'Simpan dan Aktifkan PIN'}</Text></Pressable>
          {hasPin && <Pressable onPress={removePin} style={s.danger}><Text style={s.dangerText}>Hapus PIN dari perangkat</Text></Pressable>}
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>Bantuan & Pemulihan</Text>
          <Text style={s.muted}>Jika lupa PIN, hubungi developer. Jangan kirim PIN lama kepada siapa pun.</Text>
          <Pressable style={s.whatsapp} onPress={() => Linking.openURL('https://wa.me/6285262965282?text=Saya%20memerlukan%20bantuan%20pemulihan%20PIN%20SATUOS')}><Text style={s.whatsappText}>☏  Hubungi by.Mazkiplay di WhatsApp</Text></Pressable>
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>Dukung Pengembangan SATUOS</Text>
          <Text style={s.muted}>Jika SATUOS membantu aktivitas Anda dan Anda menyukai aplikasi ini, Anda dapat mendukung pengembang melalui donasi atau saweria. Dukungan Anda membantu biaya pengembangan, perbaikan bug, peningkatan keamanan, dan pengalaman pengguna agar SATUOS terus berkembang. Donasi bersifat sukarela dan tidak wajib.</Text>
          <View style={s.notice}><Text style={s.noticeText}>Pembayaran donasi belum terhubung otomatis di aplikasi ini. Pastikan menggunakan kanal donasi resmi milik by.Mazkiplay dan periksa nama penerima sebelum membayar.</Text></View>
          <Pressable style={s.whatsapp} onPress={() => Linking.openURL('https://wa.me/6285262965282?text=Saya%20ingin%20mendukung%20pengembangan%20SATUOS%20melalui%20donasi%20atau%20saweria')}><Text style={s.whatsappText}>♡  Tanya kanal donasi resmi</Text></Pressable>
          <Text style={s.credit}>Terima kasih telah mendukung SATUOS.</Text>
          <Text style={s.credit}>by.Mazkiplay</Text>
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>Penyimpanan data</Text>
          <Text style={s.muted}>Catatan transaksi, usaha, dan riwayat aplikasi disimpan dalam database lokal SQLite di perangkat. Menghapus aplikasi atau data aplikasi dapat menghapus data lokal jika belum dicadangkan.</Text>
        </View>
        <Text style={s.credit}>SATUOS · Satu Aplikasi, Banyak Solusi.</Text>
        <Text style={s.credit}>by.Mazkiplay</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F3F7FC' },
  page: { padding: 20, paddingBottom: 36, gap: 15, maxWidth: 820, width: '100%', alignSelf: 'center' },
  back: { alignSelf: 'flex-start', paddingVertical: 5, paddingRight: 12 },
  backText: { color: '#2379C5', fontSize: 13, fontWeight: '800' },
  eyebrow: { color: '#2584D5', fontSize: 10, fontWeight: '900', letterSpacing: 1.4, marginTop: 8 },
  title: { color: '#17324D', fontSize: 29, fontWeight: '900' },
  subtitle: { color: '#6B7E93', fontSize: 13, lineHeight: 20, marginTop: -8 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 17, borderColor: '#E1EAF4', borderWidth: 1, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  icon: { width: 40, height: 40, borderRadius: 13, backgroundColor: '#E6F2FF', alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 20 },
  flex: { flex: 1 },
  cardTitle: { color: '#203B56', fontSize: 15, fontWeight: '900' },
  muted: { color: '#6B7E93', fontSize: 12, lineHeight: 18, marginTop: 3 },
  notice: { padding: 11, borderRadius: 11, backgroundColor: '#FFF5E6' },
  noticeText: { color: '#8B5B17', fontSize: 11, lineHeight: 17 },
  label: { color: '#2B4259', fontSize: 12, fontWeight: '800', marginTop: 3 },
  input: { borderWidth: 1, borderColor: '#D4E0EC', borderRadius: 12, padding: 13, backgroundColor: '#F9FBFE', color: '#17324D', fontSize: 16, letterSpacing: 5 },
  primary: { backgroundColor: '#2388E8', padding: 14, borderRadius: 12, alignItems: 'center' },
  primaryText: { color: '#FFFFFF', fontSize: 13, fontWeight: '900' },
  danger: { alignItems: 'center', padding: 10 },
  dangerText: { color: '#B93832', fontSize: 12, fontWeight: '800' },
  whatsapp: { padding: 13, borderRadius: 12, backgroundColor: '#E6F7EC', alignItems: 'center', marginTop: 5 },
  whatsappText: { color: '#147A47', fontSize: 12, fontWeight: '900' },
  credit: { color: '#8192A6', fontSize: 10, textAlign: 'center' },
});