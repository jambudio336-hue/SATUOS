import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const INTRO_SEEN_KEY = '@satuos/intro-seen-v1';
const INTRO_VIDEO = require('../assets/intro-satuos.mp4');

export default function FirstLaunchIntro({ onFinished }: { onFinished: () => void }) {
  const videoRef = useRef<Video>(null);
  const [ready, setReady] = useState(false);
  const finishedRef = useRef(false);

  const finish = async () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    await AsyncStorage.setItem(INTRO_SEEN_KEY, 'true');
    onFinished();
  };

  useEffect(() => {
    const fallback = setTimeout(finish, 7500);
    return () => clearTimeout(fallback);
  }, []);

  const handleStatus = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;
    setReady(true);
    if (status.didJustFinish) finish();
  };

  return (
    <View style={styles.container} accessibilityLabel="Intro SATUOS">
      <Video
        ref={videoRef}
        source={INTRO_VIDEO}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping={false}
        isMuted={false}
        useNativeControls={false}
        onPlaybackStatusUpdate={handleStatus}
        onError={finish}
      />
      <View style={styles.overlay} pointerEvents="none">
        <Text style={[styles.brand, !ready && styles.hidden]}>SATUOS</Text>
        <Text style={[styles.tagline, !ready && styles.hidden]}>Satu Aplikasi, Banyak Solusi.</Text>
      </View>
    </View>
  );
}

export async function shouldShowFirstLaunchIntro() {
  return (await AsyncStorage.getItem(INTRO_SEEN_KEY)) !== 'true';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070B16' },
  video: { ...StyleSheet.absoluteFillObject },
  overlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 54 },
  brand: { color: '#F8FAFC', fontSize: 22, fontWeight: '900', letterSpacing: 5, textShadowColor: '#7C3AED', textShadowRadius: 14 },
  tagline: { color: '#CBD5E1', fontSize: 12, marginTop: 8 },
  hidden: { opacity: 0 },
});
