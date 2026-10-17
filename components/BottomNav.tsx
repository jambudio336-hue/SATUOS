import { View, Text, Pressable, StyleSheet } from 'react-native';
import { usePathname, useRouter, Href } from 'expo-router';

const tabs: { label: string; icon: string; route: Href; matches: string[] }[] = [
  { label: 'Beranda', icon: '⌂', route: '/', matches: ['/'] },
  { label: 'Keuangan', icon: '▤', route: '/money', matches: ['/money'] },
  { label: 'Usaha', icon: '▦', route: '/business', matches: ['/business'] },
  { label: 'Sosial', icon: '↗', route: '/social', matches: ['/social'] },
  { label: 'Lainnya', icon: '☰', route: '/settings', matches: ['/settings', '/trust', '/assistant', '/family', '/tasks', '/wealth', '/automation', '/reports'] },
];

export default function BottomNav() {
  const router = useRouter();
  const path = usePathname();
  return (
    <View style={s.bar}>
      {tabs.map((tab) => {
        const active = tab.matches.includes(path);
        return (
          <Pressable key={tab.label} accessibilityRole="button" accessibilityLabel={tab.label} accessibilityState={{ selected: active }} onPress={() => router.push(tab.route)} android_ripple={{ color: '#DDEEFF' }} style={({ pressed }) => [s.tab, pressed && s.pressed]}>
            <View style={[s.iconWrap, active && s.iconWrapActive]}><Text style={[s.icon, active && s.active]}>{tab.icon}</Text></View>
            <Text numberOfLines={1} style={[s.label, active && s.active]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  bar: { minHeight: 66, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: '#FFFFFF', borderTopColor: '#E4EAF2', borderTopWidth: 1, paddingHorizontal: 4, paddingBottom: 2, elevation: 12, shadowColor: '#17324D', shadowOpacity: 0.08, shadowRadius: 9, shadowOffset: { width: 0, height: -3 } },
  pressed: { opacity: 0.7 },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 62, gap: 3 },
  iconWrap: { width: 35, height: 29, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  iconWrapActive: { backgroundColor: '#E4F1FF' },
  icon: { fontSize: 19, color: '#8794A6', fontWeight: '800' },
  label: { fontSize: 9, color: '#8794A6', fontWeight: '700' },
  active: { color: '#2388E8' },
});