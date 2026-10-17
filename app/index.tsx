import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Href, useRouter } from 'expo-router';
import NetInfo from '@react-native-community/netinfo';
import { listTransactions, summary, Transaction } from '../lib/database';
import { rupiah } from '../lib/format';
import BottomNav from '../components/BottomNav';

type Module = { title: string; desc: string; route: Href; icon: string; color: string; category: string };
const modules: Module[] = [
  { title: 'SATU Money', desc: 'Transaksi, anggaran, dan dompet', route: '/money', icon: 'Rp', color: '#2388E8', category: 'Keuangan' },
  { title: 'SATU Business', desc: 'Produk, stok, dan kontak usaha', route: '/business', icon: 'UM', color: '#16A085', category: 'Usaha' },
  { title: 'SATU Wealth', desc: 'Aset, utang, kekayaan bersih', route: '/wealth', icon: '◆', color: '#8B5CF6', category: 'Keuangan' },
  { title: 'Laporan SATUOS', desc: 'Ringkasan dan ekspor PDF', route: '/reports', icon: '▤', color: '#0EA5C9', category: 'Produktivitas' },
  { title: 'SATU Social', desc: 'Draf konten dan berbagi', route: '/social', icon: '↗', color: '#E8793A', category: 'Produktivitas' },
  { title: 'Tugas & Tim', desc: 'Daftar tugas sederhana', route: '/tasks', icon: '✓', color: '#3B82F6', category: 'Produktivitas' },
  { title: 'Family & Team', desc: 'Catatan keluarga lokal', route: '/family', icon: '☷', color: '#EC4899', category: 'Produktivitas' },
  { title: 'SATU Automation', desc: 'Pengingat pada perangkat', route: '/automation', icon: '◷', color: '#D97706', category: 'Produktivitas' },
  { title: 'SATU Trust', desc: 'Pemeriksaan pola mencurigakan', route: '/trust', icon: '◎', color: '#0D9488', category: 'Keamanan' },
  { title: 'Jarvis · SATU AI', desc: 'Asisten lokal berbasis aturan', route: '/assistant', icon: 'AI', color: '#6366F1', category: 'Asisten' },
  { title: 'Pengaturan', desc: 'Cadangan dan privasi', route: '/settings', icon: '⚙', color: '#64748B', category: 'Sistem' },
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
      setLatest(transactions.slice(0, 5));
      setDbError(null);
    } catch (error) {
      setDbError(error instanceof Error ? error.message : 'Database lokal belum dapat dibuka.');
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Muat data SQLite secara asinkron saat dashboard dibuka.
    void load();
    const subscription = NetInfo.addEventListener((state) => setOnline(!!state.isConnected));
    return subscription;
  }, [load]);

  const filteredModules = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('id-ID');
    return needle ? modules.filter((item) => `${item.title} ${item.desc} ${item.category}`.toLocaleLowerCase('id-ID').includes(needle)) : modules;
  }, [query]);
  const refresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };
  const columns = width >= 720 ? 3 : width >= 420 ? 2 : 2;
  const gap = 12;
  const cardWidth = (Math.min(width, 920) - 40 - gap * (columns - 1)) / columns;
  const dateLabel = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.page} keyboardShouldPersistTaps="handled" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor="#FFFFFF" colors={['#FFFFFF']} />}>
        <View style={s.blueHeader}>
          <View style={s.topRow}>
            <View style={s.brandMark}><Text style={s.brandMarkText}>S</Text></View>
            <View style={s.brandBlock}><Text style={s.brand}>SATUOS</Text><Text style={s.signature}>M4zk1pL4y.Dev</Text></View>
            <View style={s.statusPill}><View style={[s.statusDot, online === false && s.statusOffline]} /><Text style={s.statusText}>{online === null ? 'Cek koneksi' : online ? 'Online' : 'Offline'}</Text></View>
          </View>
          <Text style={s.greeting}>Satu Aplikasi, Banyak Solusi.</Text>
          <Text style={s.date}>{dateLabel}</Text>
          <View style={s.balanceCard}>
            <View style={s.balanceTop}><Text style={s.balanceLabel}>TOTAL SALDO TERCATAT</Text><View style={s.localBadge}><Text style={s.localBadgeText}>● DATA LOKAL</Text></View></View>
            <Text style={s.balance}>{rupiah(totals.balance)}</Text>
            <View style={s.metrics}>
              <View style={s.metric}><Text style={s.metricLabel}>↙ Pemasukan</Text><Text numberOfLines={1} style={s.income}>{rupiah(totals.income)}</Text></View>
              <View style={s.metricDivider} />
              <View style={s.metric}><Text style={s.metricLabel}>↗ Pengeluaran</Text><Text numberOfLines={1} style={s.expense}>{rupiah(totals.expense)}</Text></View>
            </View>
          </View>
        </View>

        {dbError && <View style={s.errorCard}><Text style={s.errorTitle}>Data belum bisa dimuat</Text><Text style={s.errorText}>{dbError}</Text><Pressable accessibilityRole="button" onPress={() => void load()}><Text style={s.errorLink}>Coba lagi</Text></Pressable></View>}

        <View style={s.sectionHeader}><View><Text style={s.sectionTitle}>Aksi cepat</Text><Text style={s.sectionSub}>Fitur yang sering digunakan</Text></View></View>
        <View style={s.quickRow}>
          <Pressable accessibilityRole="button" style={({ pressed }) => [s.quickCard, pressed && s.pressed]} onPress={() => router.push('/money')}><View style={[s.quickIcon, { backgroundColor: '#E7F2FF' }]}><Text style={{ color: '#1976D2' }}>＋</Text></View><Text style={s.quickTitle}>Catat uang</Text><Text style={s.quickSub}>Pemasukan & biaya</Text></Pressable>
          <Pressable accessibilityRole="button" style={({ pressed }) => [s.quickCard, pressed && s.pressed]} onPress={() => router.push('/business')}><View style={[s.quickIcon, { backgroundColor: '#DDF8EF' }]}><Text style={{ color: '#0E9F78' }}>▦</Text></View><Text style={s.quickTitle}>Kelola usaha</Text><Text style={s.quickSub}>Produk & stok</Text></Pressable>
          <Pressable accessibilityRole="button" style={({ pressed }) => [s.quickCard, pressed && s.pressed]} onPress={() => router.push('/reports')}><View style={[s.quickIcon, { backgroundColor: '#FFF0DC' }]}><Text style={{ color: '#D97706', fontSize: 12 }}>PDF</Text></View><Text style={s.quickTitle}>Laporan</Text><Text style={s.quickSub}>Buat & cetak</Text></Pressable>
        </View>

        <View style={s.sectionHeader}><View><Text style={s.sectionTitle}>Modul SATUOS</Text><Text style={s.sectionSub}>Pilih layanan yang kamu butuhkan</Text></View><Text style={s.countBadge}>{filteredModules.length} fitur</Text></View>
        <View style={s.searchWrap}><Text style={s.searchIcon}>⌕</Text><TextInput accessibilityLabel="Cari modul SATUOS" value={query} onChangeText={setQuery} placeholder="Cari keuangan, usaha, laporan…" placeholderTextColor="#8A96A8" returnKeyType="search" style={s.search} /></View>
        {filteredModules.length === 0 ? <Text style={s.emptyText}>Modul tidak ditemukan. Coba kata kunci lain.</Text> : <View style={s.grid}>{filteredModules.map((item) => <Pressable accessibilityRole="button" key={item.title} onPress={() => router.push(item.route)} style={({ pressed }) => [s.module, { width: cardWidth }, pressed && s.pressed]}>
          <View style={[s.moduleIcon, { backgroundColor: item.color }]}><Text style={s.moduleIconText}>{item.icon}</Text></View>
          <Text style={s.moduleTitle}>{item.title}</Text><Text style={s.moduleDesc}>{item.desc}</Text>
          <View style={s.moduleFooter}><Text style={s.moduleCategory}>{item.category}</Text><Text style={[s.moduleArrow, { color: item.color }]}>→</Text></View>
        </Pressable>)}</View>}

        <View style={s.sectionHeader}><View><Text style={s.sectionTitle}>Transaksi terakhir</Text><Text style={s.sectionSub}>Catatan yang tersimpan di perangkat</Text></View><Pressable accessibilityRole="button" onPress={() => router.push('/money')}><Text style={s.seeAll}>Lihat semua ›</Text></Pressable></View>
        <View style={s.activityCard}>
          {latest.length === 0 ? <Text style={s.emptyText}>Belum ada transaksi. Tekan “Catat uang” untuk memulai.</Text> : latest.map((item, index) => <View key={item.id} style={[s.activityItem, index === latest.length - 1 && s.lastActivity]}>
            <View style={[s.activityIcon, { backgroundColor: item.kind === 'pemasukan' ? '#DDF8EA' : '#FFE6E7' }]}><Text style={{ color: item.kind === 'pemasukan' ? '#12805C' : '#D84B56', fontWeight: '900' }}>{item.kind === 'pemasukan' ? '↓' : '↑'}</Text></View>
            <View style={s.activityDetails}><Text numberOfLines={1} style={s.activityTitle}>{item.title}</Text><Text numberOfLines={1} style={s.activityMeta}>{item.category} · {item.created_at}</Text></View>
            <Text numberOfLines={1} style={[s.activityAmount, { color: item.kind === 'pemasukan' ? '#12805C' : '#D84B56' }]}>{item.kind === 'pemasukan' ? '+' : '−'}{rupiah(item.amount)}</Text>
          </View>)}
        </View>
        <View style={s.privacyNote}><Text style={s.privacyIcon}>✓</Text><Text style={s.privacyText}>Data inti tersimpan di perangkat. Koneksi ke layanan luar hanya dilakukan saat kamu memilihnya.</Text></View>
        <Text style={s.footer}>SATUOS · M4zk1pL4y.Dev</Text>
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F4F7FB' },
  page: { paddingBottom: 28, width: '100%', maxWidth: 960, alignSelf: 'center' },
  blueHeader: { backgroundColor: '#2388E8', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 25, borderBottomLeftRadius: 26, borderBottomRightRadius: 26 },
  topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  brandMark: { width: 40, height: 40, borderRadius: 13, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  brandMarkText: { color: '#2388E8', fontSize: 25, fontWeight: '900' },
  brandBlock: { flex: 1 },
  brand: { color: '#FFFFFF', fontSize: 21, fontWeight: '900', letterSpacing: 1.8 },
  signature: { color: '#DCEEFF', fontSize: 9, fontWeight: '800', letterSpacing: 1.2, marginTop: 1 },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,45,105,0.22)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 7 },
  statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#8FF0B9' },
  statusOffline: { backgroundColor: '#FFD166' },
  statusText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  greeting: { color: '#FFFFFF', fontSize: 19, fontWeight: '900' },
  date: { color: '#DDEEFF', fontSize: 11, marginTop: 4, textTransform: 'capitalize' },
  balanceCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 17, marginTop: 19, elevation: 5, shadowColor: '#164D83', shadowOpacity: 0.13, shadowRadius: 12, shadowOffset: { width: 0, height: 5 } },
  balanceTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  balanceLabel: { color: '#6B7B91', fontSize: 10, fontWeight: '900', letterSpacing: 0.7 },
  localBadge: { backgroundColor: '#E6F8EF', borderRadius: 7, paddingHorizontal: 7, paddingVertical: 4 },
  localBadgeText: { color: '#17865C', fontSize: 8, fontWeight: '900' },
  balance: { color: '#152B46', fontSize: 29, fontWeight: '900', marginTop: 9 },
  metrics: { flexDirection: 'row', alignItems: 'center', marginTop: 16, paddingTop: 13, borderTopColor: '#E8EDF4', borderTopWidth: 1 },
  metric: { flex: 1 },
  metricLabel: { color: '#78869A', fontSize: 10, fontWeight: '700' },
  income: { color: '#14966D', fontSize: 13, fontWeight: '900', marginTop: 5 },
  expense: { color: '#D84B56', fontSize: 13, fontWeight: '900', marginTop: 5 },
  metricDivider: { width: 1, height: 31, backgroundColor: '#E3E9F1', marginHorizontal: 13 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, marginTop: 23, marginBottom: 12 },
  sectionTitle: { color: '#19334F', fontSize: 17, fontWeight: '900' },
  sectionSub: { color: '#8290A2', fontSize: 11, marginTop: 3 },
  countBadge: { color: '#287EC7', backgroundColor: '#E1F0FF', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 8, fontSize: 10, fontWeight: '800' },
  quickRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20 },
  quickCard: { flex: 1, minWidth: 0, backgroundColor: '#FFFFFF', borderColor: '#E5EBF3', borderWidth: 1, borderRadius: 15, padding: 11, minHeight: 124, justifyContent: 'center', elevation: 1 },
  quickIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginBottom: 9 },
  quickTitle: { color: '#233C57', fontSize: 11, fontWeight: '900' },
  quickSub: { color: '#8592A4', fontSize: 9, lineHeight: 13, marginTop: 4 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 12, backgroundColor: '#FFFFFF', borderColor: '#E0E7F0', borderWidth: 1, borderRadius: 13, paddingHorizontal: 12 },
  searchIcon: { color: '#8290A2', fontSize: 22, marginRight: 8 },
  search: { flex: 1, color: '#203852', paddingVertical: 12, fontSize: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 20 },
  module: { backgroundColor: '#FFFFFF', borderColor: '#E5EBF3', borderWidth: 1, borderRadius: 16, padding: 13, minHeight: 158, elevation: 1 },
  moduleIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 11 },
  moduleIconText: { color: '#FFFFFF', fontSize: 13, fontWeight: '900' },
  moduleTitle: { color: '#203852', fontSize: 12, fontWeight: '900' },
  moduleDesc: { color: '#8491A3', fontSize: 10, lineHeight: 15, marginTop: 5, flex: 1 },
  moduleFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 11 },
  moduleCategory: { color: '#8A97A8', fontSize: 9, fontWeight: '700' },
  moduleArrow: { fontSize: 18, fontWeight: '900' },
  seeAll: { color: '#2388E8', fontSize: 11, fontWeight: '900' },
  activityCard: { marginHorizontal: 20, backgroundColor: '#FFFFFF', borderColor: '#E5EBF3', borderWidth: 1, borderRadius: 16, paddingHorizontal: 13 },
  activityItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 13, borderBottomColor: '#EEF1F6', borderBottomWidth: 1 },
  lastActivity: { borderBottomWidth: 0 },
  activityIcon: { width: 33, height: 33, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  activityDetails: { flex: 1 },
  activityTitle: { color: '#203852', fontWeight: '800', fontSize: 12 },
  activityMeta: { color: '#8A97A8', fontSize: 9, marginTop: 4 },
  activityAmount: { fontSize: 10, fontWeight: '900', maxWidth: 115, textAlign: 'right' },
  emptyText: { color: '#8491A3', fontSize: 12, lineHeight: 18, padding: 15 },
  privacyNote: { flexDirection: 'row', gap: 9, alignItems: 'center', backgroundColor: '#E8F8F0', borderColor: '#D0F0E0', borderWidth: 1, borderRadius: 13, padding: 12, marginHorizontal: 20, marginTop: 22 },
  privacyIcon: { color: '#16865C', fontSize: 15, fontWeight: '900' },
  privacyText: { flex: 1, color: '#427461', fontSize: 10, lineHeight: 15 },
  footer: { color: '#A1ACBA', textAlign: 'center', fontSize: 9, marginTop: 17 },
  pressed: { opacity: 0.78, transform: [{ scale: 0.98 }] },
  errorCard: { backgroundColor: '#FFF0F0', borderColor: '#F3B4B4', borderWidth: 1, borderRadius: 14, padding: 14, marginHorizontal: 20, marginTop: 16 },
  errorTitle: { color: '#B4232D', fontWeight: '900', fontSize: 14 },
  errorText: { color: '#9D3C43', fontSize: 12, marginTop: 5 },
  errorLink: { color: '#B4232D', fontWeight: '800', marginTop: 9 },
});
