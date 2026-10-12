import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Href, useRouter } from 'expo-router';
import NetInfo from '@react-native-community/netinfo';
import { listTransactions, summary, Transaction } from '../lib/database';
import { rupiah } from '../lib/format';
import BottomNav from '../components/BottomNav';

type Module = { title: string; desc: string; route: Href; icon: string; category: string };
const modules: Module[] = [
  { title: 'SATU Money', desc: 'Transaksi, anggaran, dan dompet', route: '/money', icon: 'Rp', category: 'Keuangan' },
  { title: 'SATU Business', desc: 'Produk, stok, dan kontak usaha', route: '/business', icon: 'UM', category: 'Usaha' },
  { title: 'SATU Wealth', desc: 'Aset, utang, kekayaan bersih', route: '/wealth', icon: '◆', category: 'Keuangan' },
  { title: 'Laporan SATUOS', desc: 'Ringkasan dan ekspor PDF', route: '/reports', icon: '▤', category: 'Produktivitas' },
  { title: 'SATU Social', desc: 'Draf konten dan platform', route: '/social', icon: '↗', category: 'Produktivitas' },
  { title: 'Tugas & Tim', desc: 'Daftar tugas sederhana', route: '/tasks', icon: '✓', category: 'Produktivitas' },
  { title: 'Family & Team', desc: 'Catatan keluarga lokal', route: '/family', icon: '☷', category: 'Produktivitas' },
  { title: 'SATU Automation', desc: 'Pengingat pada perangkat', route: '/automation', icon: '◷', category: 'Produktivitas' },
  { title: 'SATU Trust', desc: 'Pemeriksaan pola mencurigakan', route: '/trust', icon: '◎', category: 'Keamanan' },
  { title: 'Jarvis · SATU AI', desc: 'Asisten lokal berbasis aturan', route: '/assistant', icon: 'AI', category: 'Keamanan' },
  { title: 'Pengaturan', desc: 'Cadangan dan privasi', route: '/settings', icon: '⚙', category: 'Sistem' },
];

export default function Home() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [totals, setTotals] = useState({ income: 0, expense: 0, balance: 0 });
  const [latest, setLatest] = useState<Transaction[]>([]);
  const [dbError, setDbError] = useState<string | null>(null);
  const [online, setOnline] = useState<boolean | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');

  const load = useCallback(async () => {
    try {
      const [nextTotals, transactions] = await Promise.all([summary(), listTransactions()]);
      setTotals(nextTotals);
      setLatest(transactions.slice(0, 3));
      setDbError(null);
    } catch (error) {
      setDbError(error instanceof Error ? error.message : 'Database lokal belum dapat dibuka.');
    }
  }, []);

  // Pembacaan SQLite di sini bersifat asinkron; effect hanya memuat data awal dari storage.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Load data SQLite async saat dashboard dibuka.
    void load();
    const subscription = NetInfo.addEventListener((state) => setOnline(!!state.isConnected));
    return subscription;
  }, [load]);

  const filteredModules = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('id-ID');
    return needle ? modules.filter((item) => `${item.title} ${item.desc} ${item.category}`.toLocaleLowerCase('id-ID').includes(needle)) : modules;
  }, [query]);
  const refresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };
  const cardWidth = width < 380 ? '100%' : (width - 52) / 2;
  const dateLabel = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.page} keyboardShouldPersistTaps="handled" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor="#FFB547" />}>
        <View style={s.top}>
          <View><Text style={s.kicker}>{dateLabel.toLocaleUpperCase('id-ID')}</Text><Text style={s.brand}>SATUOS</Text><Text style={s.brandSignature}>M4zk1pL4y.Dev</Text><Text style={s.tagline}>Satu Aplikasi, Banyak Solusi.</Text></View>
          <View style={s.statusPill}><View style={[s.statusDot, online === false && s.statusOffline]} /><Text style={s.statusText}>{online === null ? 'Memeriksa' : online ? 'Online' : 'Offline'}</Text></View>
        </View>
        {dbError && <View style={s.errorCard}><Text style={s.errorTitle}>Data belum bisa dimuat</Text><Text style={s.errorText}>{dbError}</Text><Pressable accessibilityRole="button" onPress={() => void load()}><Text style={s.errorLink}>Coba lagi</Text></Pressable></View>}
        <View style={s.hero}>
          <View style={s.heroTop}><View><Text style={s.eyebrow}>SALDO BERSIH TERCATAT</Text><Text style={s.balance}>{rupiah(totals.balance)}</Text></View><View style={s.heroBadge}><Text style={s.heroBadgeText}>LOKAL</Text></View></View>
          <Text style={s.heroHint}>Dihitung dari transaksi yang tersimpan di perangkat ini.</Text>
          <View style={s.metricRow}><View style={s.metric}><Text style={s.metricLabel}>Pemasukan</Text><Text numberOfLines={1} style={s.income}>{rupiah(totals.income)}</Text></View><View style={s.metricDivider} /><View style={s.metric}><Text style={s.metricLabel}>Pengeluaran</Text><Text numberOfLines={1} style={s.expense}>{rupiah(totals.expense)}</Text></View></View>
        </View>
        <View style={s.sectionHeadingRow}><View><Text style={s.sectionTitle}>Aksi cepat</Text><Text style={s.sectionSub}>Lanjutkan pekerjaan utama</Text></View></View>
        <View style={s.quickRow}>
          <Pressable accessibilityRole="button" style={({pressed})=>[s.quickCard,pressed&&s.pressed]} onPress={() => router.push('/money')} android_ripple={{color:'rgba(255,255,255,0.14)'}}><Text style={s.quickIcon}>＋</Text><Text style={s.quickTitle}>Catat transaksi</Text><Text style={s.quickSub}>Pemasukan atau biaya</Text></Pressable>
          <Pressable accessibilityRole="button" style={({pressed})=>[s.quickCard,pressed&&s.pressed]} onPress={() => router.push('/business')} android_ripple={{color:'rgba(255,255,255,0.14)'}}><Text style={s.quickIcon}>▦</Text><Text style={s.quickTitle}>Kelola usaha</Text><Text style={s.quickSub}>Produk dan stok</Text></Pressable>
          <Pressable accessibilityRole="button" style={({pressed})=>[s.quickCard,pressed&&s.pressed]} onPress={() => router.push('/reports')} android_ripple={{color:'rgba(255,255,255,0.14)'}}><Text style={s.quickIcon}>PDF</Text><Text style={s.quickTitle}>Buat laporan</Text><Text style={s.quickSub}>Unduh sebagai PDF</Text></Pressable>
        </View>
        <View style={s.sectionHeadingRow}><View><Text style={s.sectionTitle}>Aktivitas terbaru</Text><Text style={s.sectionSub}>Transaksi terakhir di perangkat ini</Text></View><Pressable accessibilityRole="button" onPress={() => router.push('/money')}><Text style={s.seeAll}>Lihat semua →</Text></Pressable></View>
        <View style={s.activityCard}>
          {latest.length === 0 ? <Text style={s.emptyText}>Belum ada transaksi. Mulai dengan mencatat pemasukan atau pengeluaran.</Text> : latest.map((item, index) => <View key={item.id} style={[s.activityItem, index === latest.length - 1 && s.lastActivity]}>
            <View style={[s.activityIcon, item.kind === 'pemasukan' ? s.activityIncomeIcon : s.activityExpenseIcon]}><Text style={s.activityIconText}>{item.kind === 'pemasukan' ? '↓' : '↑'}</Text></View>
            <View style={s.activityDetails}><Text numberOfLines={1} style={s.activityTitle}>{item.title}</Text><Text style={s.activityMeta}>{item.category} · {item.created_at}</Text></View>
            <Text numberOfLines={1} style={[s.activityAmount, item.kind === 'pemasukan' ? s.income : s.expense]}>{item.kind === 'pemasukan' ? '+' : '−'}{rupiah(item.amount)}</Text>
          </View>)}
        </View>
        <View style={s.sectionHeadingRow}><View><Text style={s.sectionTitle}>Semua modul</Text><Text style={s.sectionSub}>{filteredModules.length} ruang kerja SATUOS</Text></View></View>
        <TextInput accessibilityLabel="Cari modul SATUOS" value={query} onChangeText={setQuery} placeholder="Cari modul atau fitur…" placeholderTextColor="#798496" returnKeyType="search" style={s.search} />
        {filteredModules.length === 0 ? <Text style={s.emptyText}>Modul tidak ditemukan. Coba kata kunci lain.</Text> : <View style={s.grid}>{filteredModules.map((item) => <Pressable accessibilityRole="button" key={item.title} onPress={() => router.push(item.route)} android_ripple={{color:'rgba(216,183,122,0.18)'}} style={({pressed})=>[s.module, { width: cardWidth },pressed&&s.pressed]}>
          <View style={s.moduleHeader}><View style={s.moduleIcon}><Text style={s.moduleIconText}>{item.icon}</Text></View><Text style={s.moduleCategory}>{item.category.toUpperCase()}</Text></View>
          <Text style={s.moduleTitle}>{item.title}</Text><Text style={s.moduleDesc}>{item.desc}</Text><Text style={s.moduleLink}>Buka modul <Text style={s.arrow}>→</Text></Text>
        </Pressable>)}</View>}
        <View style={s.privacyNote}><Text style={s.privacyIcon}>◈</Text><Text style={s.privacyText}>Data inti disimpan lokal. Koneksi internet hanya dipakai saat membuka layanan eksternal.</Text></View>
        <Text style={s.footer}>M4zk1pL4y.Dev · SATUOS 1.2.0</Text>
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#090D16' }, page: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 34, maxWidth: 900, width: '100%', alignSelf: 'center' },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }, kicker: { color: '#7D8CA3', fontSize: 9, fontWeight: '800', letterSpacing: 1.4, marginBottom: 5 }, brandSignature:{color:'#D8B77A',fontSize:10,fontWeight:'900',letterSpacing:1.8,marginTop:1}, pressed:{opacity:0.86,transform:[{scale:0.98}]}, brand: { color: '#F8FAFC', fontSize: 29, fontWeight: '900', letterSpacing: 3.5 }, tagline: { color: '#91A0B5', fontSize: 12, marginTop: 2 },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: '#151E2B', borderWidth: 1, borderColor: '#25364B', borderRadius: 20, paddingHorizontal: 11, paddingVertical: 8 }, statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#51D6A3' }, statusOffline: { backgroundColor: '#F6A94A' }, statusText: { color: '#D6E1EF', fontSize: 11, fontWeight: '700' },
  hero: { backgroundColor: '#131B28', borderColor: '#26364B', borderWidth: 1, borderRadius: 22, padding: 19, marginBottom: 25, overflow: 'hidden' }, heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }, eyebrow: { color: '#F4B35E', fontWeight: '800', fontSize: 10, letterSpacing: 1.25 }, balance: { color: '#F8FAFC', fontSize: 29, fontWeight: '900', marginTop: 8 }, heroBadge: { borderColor: '#38503F', borderWidth: 1, backgroundColor: '#16271F', borderRadius: 9, paddingHorizontal: 9, paddingVertical: 5 }, heroBadgeText: { color: '#79D8A8', fontWeight: '900', fontSize: 9, letterSpacing: 1 }, heroHint: { color: '#94A3B8', fontSize: 11, lineHeight: 17, marginTop: 5 }, metricRow: { flexDirection: 'row', alignItems: 'center', marginTop: 18, paddingTop: 15, borderTopColor: '#263448', borderTopWidth: 1 }, metric: { flex: 1 }, metricLabel: { color: '#91A0B5', fontSize: 10, fontWeight: '700' }, income: { color: '#6FE0B0', fontSize: 13, fontWeight: '800', marginTop: 5 }, expense: { color: '#F39BA5', fontSize: 13, fontWeight: '800', marginTop: 5 }, metricDivider: { width: 1, height: 29, backgroundColor: '#29394D', marginHorizontal: 15 },
  sectionHeadingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }, sectionTitle: { color: '#F1F5F9', fontSize: 18, fontWeight: '800' }, sectionSub: { color: '#7F8DA2', fontSize: 11, marginTop: 3 }, quickRow: { flexDirection: 'row', gap: 9, marginBottom: 25 }, quickCard: { flex: 1, minHeight: 112, backgroundColor: '#141D2B', borderColor: '#26364B', borderWidth: 1, borderRadius: 15, padding: 12, justifyContent: 'center' }, quickIcon: { color: '#FFB547', fontSize: 18, fontWeight: '900', marginBottom: 8 }, quickTitle: { color: '#E7EDF5', fontSize: 11, fontWeight: '800' }, quickSub: { color: '#8795A8', fontSize: 9, marginTop: 4, lineHeight: 13 }, seeAll: { color: '#FFBD65', fontSize: 11, fontWeight: '800', paddingBottom: 2 },
  activityCard: { backgroundColor: '#111925', borderColor: '#233248', borderWidth: 1, borderRadius: 16, paddingHorizontal: 13, marginBottom: 26 }, activityItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 13, borderBottomColor: '#202D3E', borderBottomWidth: 1 }, lastActivity: { borderBottomWidth: 0 }, activityIcon: { width: 31, height: 31, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }, activityIncomeIcon: { backgroundColor: '#173328' }, activityExpenseIcon: { backgroundColor: '#39262B' }, activityIconText: { color: '#DAE4F0', fontSize: 15, fontWeight: '900' }, activityDetails: { flex: 1 }, activityTitle: { color: '#E3EAF3', fontWeight: '700', fontSize: 12 }, activityMeta: { color: '#8795A8', fontSize: 9, marginTop: 4 }, activityAmount: { fontSize: 10, fontWeight: '800', maxWidth: 110, textAlign: 'right' }, emptyText: { color: '#91A0B5', fontSize: 12, lineHeight: 18, paddingVertical: 17 },
  search: { backgroundColor: '#111925', color: '#F3F6FA', borderColor: '#26364B', borderWidth: 1, borderRadius: 13, paddingHorizontal: 14, paddingVertical: 12, fontSize: 12, marginBottom: 12 }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 }, module: { backgroundColor: '#121B28', borderColor: '#24344A', borderWidth: 1, borderRadius: 16, padding: 14, minHeight: 157 }, moduleHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }, moduleIcon: { minWidth: 34, height: 34, borderRadius: 11, paddingHorizontal: 7, backgroundColor: '#302619', alignItems: 'center', justifyContent: 'center' }, moduleIconText: { color: '#FFB547', fontWeight: '900', fontSize: 12 }, moduleCategory: { color: '#74849A', fontWeight: '800', fontSize: 8, letterSpacing: 0.8 }, moduleTitle: { color: '#EFF4F9', fontSize: 13, fontWeight: '800' }, moduleDesc: { color: '#91A0B5', fontSize: 10, lineHeight: 15, marginTop: 5, minHeight: 30 }, moduleLink: { color: '#FFBC63', fontSize: 10, fontWeight: '800', marginTop: 11 }, arrow: { fontSize: 13 },
  privacyNote: { flexDirection: 'row', gap: 9, alignItems: 'center', backgroundColor: '#111B19', borderColor: '#244337', borderWidth: 1, borderRadius: 13, padding: 12, marginTop: 23 }, privacyIcon: { color: '#76D6AA', fontSize: 15, fontWeight: '900' }, privacyText: { flex: 1, color: '#A6B6AB', fontSize: 10, lineHeight: 15 }, footer: { color: '#536174', textAlign: 'center', fontSize: 9, marginTop: 17 },
  errorCard: { backgroundColor: '#351A1A', borderColor: '#7F1D1D', borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 16 }, errorTitle: { color: '#FCA5A5', fontWeight: '900', fontSize: 14 }, errorText: { color: '#FECACA', fontSize: 12, marginTop: 5 }, errorLink: { color: '#FFD0D0', fontWeight: '800', marginTop: 9 },
});
