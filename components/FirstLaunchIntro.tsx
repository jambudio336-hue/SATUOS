import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAudioPlayer } from 'expo-audio';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const INTRO_SEEN_KEY = '@satuos/intro-seen-v2';
const INTRO_VIDEO = require('../assets/intro-satuos.mp4');
const INTRO_AUDIO = require('../assets/audio/intro-ibu-pertiwi-10s.mp3');
const INTRO_DURATION_MS = 10_000;

export default function FirstLaunchIntro({ onFinished }: { onFinished: () => void }) {
  const finishedRef = useRef(false);
  const audioPlayer = useAudioPlayer(INTRO_AUDIO, { updateInterval: 100 });
  const videoPlayer = useVideoPlayer(INTRO_VIDEO, (player) => {
    player.muted = true;
    player.loop = true;
    player.play();
  });

  const finish = useCallback(async () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    audioPlayer.pause();
    try {
      await AsyncStorage.setItem(INTRO_SEEN_KEY, 'true');
    } catch {
      // Lanjutkan ke aplikasi meskipun marker lokal tidak dapat disimpan.
    } finally {
      onFinished();
    }
  }, [audioPlayer, onFinished]);

  useEffect(() => {
    let active = true;
    const timeout = setTimeout(() => { void finish(); }, INTRO_DURATION_MS);
    void audioPlayer.seekTo(0).then(() => {
      if (active) audioPlayer.play();
    }).catch(() => { /* Timer tetap menyelesaikan intro bila audio tidak dapat dimuat. */ });

    return () => {
      active = false;
      clearTimeout(timeout);
      audioPlayer.pause();
      videoPlayer.pause();
    };
  }, [audioPlayer, videoPlayer, finish]);

  return (
    <View style={styles.container} accessibilityLabel="Intro SATUOS">
      <VideoView player={videoPlayer} style={styles.video} contentFit="cover" nativeControls={false} />
      <View style={styles.overlay} pointerEvents="none">
        <View style={styles.soundPill}><View style={styles.soundDot} /><Text style={styles.soundText}>INTRO 10 DETIK</Text></View>
        <Text style={styles.brand}>SATUOS</Text>
        <Text style={styles.tagline}>Satu Aplikasi, Banyak Solusi.</Text>
      </View>
    </View>
  );
}

export async function shouldShowFirstLaunchIntro() {
  return (await AsyncStorage.getItem(INTRO_SEEN_KEY)) !== 'true';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070B16' },
  video: { ...StyleSheet.absoluteFill },
  overlay: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 58, backgroundColor: 'rgba(4, 8, 18, 0.12)' },
  soundPill: { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: 'rgba(7, 11, 22, 0.72)', borderColor: 'rgba(255, 181, 71, 0.45)', borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6, marginBottom: 16 },
  soundDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFB547' },
  soundText: { color: '#F6D6A8', fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  brand: { color: '#F8FAFC', fontSize: 24, fontWeight: '900', letterSpacing: 5, textShadowColor: '#7C3AED', textShadowRadius: 14 },
  tagline: { color: '#E1E6EF', fontSize: 12, marginTop: 8 },
});
