import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import BottomNav from '../components/BottomNav';
import { businessSummary, exportData, summary, wealthSummary } from '../lib/database';
import { rupiah } from '../lib/format';
import { buildReportSections, renderPdfReport, ReportMetrics } from '../lib/pdf-report';

const safeFilename = (title: string) => {
  const normalized = title.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48);
  return `${normalized || 'laporan-satuos'}-${new Date().toISOString().slice(0, 10)}.pdf`;
};

export default function ReportsPage() {
  const router = useRouter();
  const [title, setTitle] = useState('Laporan SATUOS');
  const [busy, setBusy] = useState(false);
  const [currentBalance, setCurrentBalance] = useState<number | null>(null);

  useEffect(() => {
    void summary().then((value) => setCurrentBalance(value.balance)).catch(() => setCurrentBalance(null));
  }, []);

  const createPdf = async () => {
    if (!title.trim()) { Alert.alert('Judul belum diisi', 'Masukkan judul laporan terlebih dahulu.'); return; }
    setBusy(true);
    try {
      const [backup, financial, business, wealth] = await Promise.all([exportData(), summary(), businessSummary(), wealthSummary()]);
      const parsed: { tables?: Record<string, Record<string, unknown>[]> } = JSON.parse(backup);
      if (!parsed.tables) throw new Error('Data laporan lokal tidak dapat dibaca.');
      const metrics: ReportMetrics = {
        income: financial.income, expense: financial.expense, balance: financial.balance,
        revenue: business.revenue, grossProfit: business.grossProfit, units: business.units, lowStock: business.lowStock,
        assets: wealth.assets, liabilities: wealth.liabilities, receivables: wealth.receivables, netWorth: wealth.net,
      };
      const generatedAt = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeStyle: 'short' }).format(new Date());
      const html = renderPdfReport(title.trim(), generatedAt, buildReportSections(parsed.tables, metrics));
      const result = await Print.printToFileAsync({ html, base64: false });
      const fileName = safeFilename(title);

      if (Platform.OS === 'android') {
        const permission = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permission.granted && permission.directoryUri) {
          const targetUri = await FileSystem.StorageAccessFramework.createFileAsync(permission.directoryUri, fileName, 'application/pdf');
          const base64 = await FileSystem.readAsStringAsync(result.uri, { encoding: FileSystem.EncodingType.Base64 });
          await FileSystem.writeAsStringAsync(targetUri, base64, { encoding: FileSystem.EncodingType.Base64 });
          Alert.alert('PDF berhasil disimpan', `${fileName}\n\nPilih folder Unduhan atau folder lain pada dialog penyimpanan.`);
          return;
        }
      }

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(result.uri, { mimeType: 'application/pdf', dialogTitle: `Simpan ${fileName}`, UTI: 'com.adobe.pdf' });
      } else {
        Alert.alert('PDF berhasil dibuat', `Berkas tersimpan sementara di ${result.uri}`);
      }
    } catch (error) {
      Alert.alert('PDF gagal dibuat', error instanceof Error ? error.message : 'Terjadi kesalahan saat membuat atau menyimpan laporan.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.page} keyboardShouldPersistTaps="handled">
          <Pressable accessibilityRole="button" onPress={() => router.back()}><Text style={s.back}>← Kembali</Text></Pressable>
          <View style={s.hero}><View style={s.pdfMark}><Text style={s.pdfMarkText}>PDF</Text></View><Text style={s.title}>Laporan SATUOS</Text><Text style={s.subtitle}>Buat dokumen PDF dengan judul pilihan dan tabel data lintas modul.</Text></View>
          <View style={s.card}>
            <Text style={s.label}>JUDUL LAPORAN</Text>
            <TextInput accessibilityLabel="Judul laporan PDF" value={title} onChangeText={setTitle} placeholder="Contoh: Laporan operasional Oktober" placeholderTextColor="#718096" maxLength={80} style={s.input} />
            <Text style={s.hint}>Judul ini tampil di sampul PDF dan nama berkas.</Text>
            <Pressable accessibilityRole="button" accessibilityState={{ disabled: busy }} disabled={busy} onPress={() => void createPdf()} style={[s.button, busy && s.buttonDisabled]}>
              <Text style={s.buttonText}>{busy ? 'Membuat PDF…' : 'Buat dan unduh PDF'}</Text>
            </Pressable>
            <Text style={s.hint}>Android: pilih folder Unduhan atau folder lain. iPhone: gunakan menu Bagikan untuk menyimpan ke Files.</Text>
          </View>
          <Text style={s.sectionTitle}>Isi laporan</Text>
          <View style={s.listCard}>
            {['Ringkasan keuangan, bisnis, dan kekayaan bersih', 'Transaksi, produk, penjualan, dan pembelian stok', 'Dompet, anggaran, utang/piutang, dan aset', 'Tugas, kontak, draf, pemeriksaan Trust, dan pengingat', 'Catatan keluarga dan riwayat aktivitas'].map((item, index) => <View key={item} style={s.listRow}><Text style={s.listIndex}>{String(index + 1).padStart(2, '0')}</Text><Text style={s.listText}>{item}</Text></View>)}
          </View>
          <View style={s.privacyCard}><Text style={s.privacyTitle}>Periksa privasi sebelum membagikan</Text><Text style={s.privacyText}>PDF dapat berisi nominal transaksi, nomor kontak, catatan keluarga, draf, dan aktivitas lokal. Simpan di folder pribadi dan pastikan penerima memang berhak melihatnya.</Text><Text style={s.privacyText}>Laporan bersifat informatif dan bukan pengganti laporan pajak atau akuntansi resmi.</Text></View>
          <View style={s.preview}><Text style={s.previewTitle}>Ringkasan saat ini</Text><Text style={s.previewText}>Nilai lengkap dan tabel detail dihitung otomatis dari seluruh data SATUOS saat PDF dibuat.</Text><Text style={s.previewExample}>Saldo bersih perangkat: {currentBalance === null ? 'belum tersedia' : rupiah(currentBalance)}</Text></View>
        </ScrollView>
      </KeyboardAvoidingView>
      <BottomNav />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#090D16' }, flex: { flex: 1 }, page: { padding: 20, paddingBottom: 32, maxWidth: 760, width: '100%', alignSelf: 'center' },
  back: { color: '#FFBD65', fontWeight: '800', marginBottom: 17 }, hero: { backgroundColor: '#141D2A', borderColor: '#29384D', borderWidth: 1, borderRadius: 20, padding: 18, marginBottom: 18 }, pdfMark: { width: 47, height: 47, borderRadius: 14, backgroundColor: '#382719', alignItems: 'center', justifyContent: 'center', marginBottom: 13 }, pdfMarkText: { color: '#FFB547', fontWeight: '900', fontSize: 13 }, title: { color: '#F4F7FB', fontSize: 25, fontWeight: '900' }, subtitle: { color: '#95A3B7', fontSize: 12, lineHeight: 18, marginTop: 7 },
  card: { backgroundColor: '#111925', borderColor: '#24344A', borderWidth: 1, borderRadius: 16, padding: 16, marginBottom: 23 }, label: { color: '#A7B4C5', fontSize: 10, fontWeight: '900', letterSpacing: 1.1, marginBottom: 8 }, input: { color: '#F5F7FA', backgroundColor: '#0B1220', borderColor: '#314259', borderWidth: 1, borderRadius: 12, padding: 13, fontSize: 14 }, hint: { color: '#8795A8', fontSize: 10, lineHeight: 15, marginTop: 8 }, button: { backgroundColor: '#E99B35', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 16 }, buttonDisabled: { opacity: 0.55 }, buttonText: { color: '#17130E', fontWeight: '900', fontSize: 13 },
  sectionTitle: { color: '#F1F5F9', fontSize: 17, fontWeight: '900', marginBottom: 11 }, listCard: { backgroundColor: '#111925', borderColor: '#24344A', borderWidth: 1, borderRadius: 15, paddingHorizontal: 13, marginBottom: 18 }, listRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#202D3E' }, listIndex: { color: '#FFB547', fontSize: 10, fontWeight: '900', width: 22 }, listText: { color: '#CFD8E5', fontSize: 11, lineHeight: 16, flex: 1 },
  privacyCard: { backgroundColor: '#201B12', borderColor: '#574123', borderWidth: 1, borderRadius: 15, padding: 14, marginBottom: 15 }, privacyTitle: { color: '#FFD28F', fontSize: 12, fontWeight: '900', marginBottom: 7 }, privacyText: { color: '#C8B99F', fontSize: 10, lineHeight: 16, marginTop: 3 }, preview: { padding: 14, borderRadius: 14, backgroundColor: '#101925', borderColor: '#24344A', borderWidth: 1 }, previewTitle: { color: '#E8EDF4', fontSize: 12, fontWeight: '800' }, previewText: { color: '#91A0B5', fontSize: 10, lineHeight: 15, marginTop: 6 }, previewExample: { color: '#728198', fontSize: 9, marginTop: 7 },
});
