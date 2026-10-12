import { ErrorBoundaryProps, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FirstLaunchIntro, { shouldShowFirstLaunchIntro } from '../components/FirstLaunchIntro';

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <View style={styles.errorPage}>
        <Text style={styles.brand}>SATUOS</Text>
        <Text style={styles.title}>Terjadi gangguan</Text>
        <Text style={styles.message}>SATUOS mengalami kesalahan saat membuka halaman. Data lokal tidak sengaja dihapus.</Text>
        <Text style={styles.details}>{error.message}</Text>
        <Pressable accessibilityRole="button" onPress={retry} style={styles.button}><Text style={styles.buttonText}>Coba buka lagi</Text></Pressable>
      </View>
    </SafeAreaProvider>
  );
}

export default function Layout() {
  const [checkingIntro, setCheckingIntro] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  useEffect(() => {
    let mounted = true;
    void shouldShowFirstLaunchIntro().then((show) => {
      if (!mounted) return;
      setShowIntro(show);
      setCheckingIntro(false);
    }).catch(() => {
      if (!mounted) return;
      setShowIntro(false);
      setCheckingIntro(false);
    });
    return () => { mounted = false; };
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {checkingIntro ? <View style={styles.loading} /> : showIntro ? <FirstLaunchIntro onFinished={() => setShowIntro(false)} /> : (
        // Database initialization remains lazy to avoid migration races on cold start.
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#090D16' } }} />
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: '#070B16' },
  errorPage: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#0B1220' },
  brand: { color: '#FF9F0A', fontSize: 14, fontWeight: '900', letterSpacing: 3, marginBottom: 18 },
  title: { color: '#F8FAFC', fontSize: 25, fontWeight: '900', marginBottom: 10 },
  message: { color: '#CBD5E1', fontSize: 15, lineHeight: 22 },
  details: { color: '#94A3B8', fontSize: 12, marginTop: 14 },
  button: { marginTop: 24, backgroundColor: '#FF9F0A', padding: 14, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#111827', fontWeight: '900' },
});
