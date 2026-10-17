import { useAudioPlayer } from 'expo-audio';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const INTRO_VIDEO = require('../assets/intro-satuos.mp4');
const INTRO_AUDIO = require('../assets/audio/intro-ibu-pertiwi-10s.mp3');
const INTRO_DURATION_MS = 10_000;

const quotes = [
  'Uang bukan tentang seberapa banyak yang datang, tetapi seberapa bijak kamu menjaganya.',
  'Jangan biarkan pengeluaran hari ini mencuri ketenangan masa depanmu.',
  'Sedikit yang disisihkan dengan konsisten, bisa menjadi harapan besar suatu hari nanti.',
  'Kamu tidak harus kaya hari ini. Mulailah dengan mengelola apa yang kamu punya.',
  'Setiap rupiah punya tujuan. Belanjakan dengan sadar, simpan dengan sabar.',
  'Pemasukan memberimu peluang, pengelolaan yang baik memberimu ketenangan.',
  'Keuangan yang sehat dimulai dari keberanian jujur pada setiap catatan.',
  'Bukan soal menahan semua keinginan, melainkan memilih mana yang paling berarti.',
  'Masa depan dibangun dari keputusan kecil yang kamu ambil hari ini.',
  'Uang yang dicatat mengajarkan kita menghargai usaha di balik setiap rupiah.',
  'Hidup sederhana bukan kekurangan; itu cara memberi ruang untuk hal yang penting.',
  'Sebelum uang habis tanpa arah, beri setiap rupiah alasan untuk pergi.',
  'Kemajuan finansial tidak selalu cepat, tetapi kebiasaan baik membuatnya nyata.',
  'Sisihkan untuk esok, nikmati secukupnya hari ini, dan syukuri prosesnya.',
  'Catatan kecil hari ini bisa mencegah penyesalan besar di kemudian hari.',
  'Jangan ukur keberhasilan hanya dari penghasilan, ukur juga dari ketenanganmu.',
  'Anggaran bukan batas kebebasan; anggaran adalah peta menuju tujuanmu.',
  'Kamu bekerja keras untuk uangmu. Beri uangmu pekerjaan yang jelas.',
  'Kebutuhan lebih dulu, keinginan setelah dipikirkan, masa depan jangan dilupakan.',
  'Mulai dari satu catatan, satu pilihan bijak, satu langkah menuju hidup lebih tenang.',
  'Jangan malu memulai dari sedikit. Yang penting kamu tahu ke mana uangmu pergi.',
  'Pemasukan adalah benih; kebiasaan mengelola adalah tanah tempat ia tumbuh.',
  'Ketenangan finansial tumbuh saat kenyataan dicatat, bukan sekadar ditebak.',
  'Beli karena perlu, simpan karena peduli pada dirimu di masa depan.',
  'Kamu layak menikmati hasil kerja kerasmu tanpa dihantui pengeluaran tak tercatat.',
  'Keuangan yang tertata memberi pikiran ruang untuk bermimpi lebih jauh.',
  'Satu keputusan bijak hari ini dapat menjadi hadiah untuk dirimu di masa depan.',
  'Jangan biarkan gengsi mengatur dompetmu. Biarkan tujuan yang memandumu.',
  'Rezeki patut disyukuri, dan tanggung jawab kita adalah mengelolanya dengan baik.',
  'Bertumbuh bukan selalu menambah penghasilan; kadang dimulai dengan mengurangi kebocoran.',
  'Buat uangmu menjadi alat untuk hidup, bukan alasan untuk kehilangan damai.',
];
function dailyQuote() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const day = Math.floor((now.getTime() - start.getTime()) / 86_400_000);
  return quotes[(day + now.getFullYear()) % quotes.length];
}

function pauseSafely(player: { pause: () => void } | null | undefined) {
  // Native players can be released by Expo during navigation/unmount.
  // Never let a late pause call crash the app or block dashboard navigation.
  try {
    player?.pause();
  } catch {
    // Player is already released; cleanup is intentionally best-effort.
  }
}

export default function FirstLaunchIntro({ onFinished }: { onFinished: () => void }) {
  const finishedRef = useRef(false);
  const [showQuote, setShowQuote] = useState(false);
  const audioPlayer = useAudioPlayer(INTRO_AUDIO, { updateInterval: 100 });
  const videoPlayer = useVideoPlayer(INTRO_VIDEO, (player) => {
    player.muted = true;
    player.loop = true;
    player.play();
  });

  const finishVideo = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    pauseSafely(audioPlayer);
    pauseSafely(videoPlayer);
    setShowQuote(true);
  }, [audioPlayer, videoPlayer]);

  useEffect(() => {
    let active = true;
    const timeout = setTimeout(() => { if (active) finishVideo(); }, INTRO_DURATION_MS);
    void audioPlayer.seekTo(0).then(() => {
      if (active) audioPlayer.play();
    }).catch(() => { /* Video tetap selesai walau audio tidak tersedia. */ });
    return () => {
      active = false;
      clearTimeout(timeout);
      pauseSafely(audioPlayer);
      pauseSafely(videoPlayer);
    };
  }, [audioPlayer, videoPlayer, finishVideo]);

  return (
    <View style={styles.container} accessibilityLabel="Intro SATUOS">
      <VideoView player={videoPlayer} style={styles.video} contentFit="cover" nativeControls={false} />
      <View style={styles.overlay} pointerEvents={showQuote ? 'auto' : 'none'}>
        {!showQuote ? (
          <>
            <View style={styles.soundPill}><View style={styles.soundDot} /><Text style={styles.soundText}>SELAMAT DATANG</Text></View>
            <Text style={styles.brand}>SATUOS</Text>
            <Text style={styles.tagline}>Satu Aplikasi, Banyak Solusi.</Text>
            <Text style={styles.introVoice}>Selamat datang di SATUOS. Satu masalah untuk semua.</Text>
          </>
        ) : (
          <Pressable accessibilityRole="button" accessibilityLabel="Masuk ke dashboard SATUOS" onPress={onFinished} style={styles.quoteScreen}>
            <View style={styles.quotePanel}>
            <Text style={styles.quoteEyebrow}>KATA HARI INI</Text>
            <Text style={styles.quoteMark}>“</Text>
            <Text style={styles.quote}>{dailyQuote()}</Text>
            <Text style={styles.credit}>by.Mazkiplay</Text>
            <View style={styles.continueButton}><Text style={styles.continueText}>Masuk ke SATUOS  →</Text></View>
            <Text style={styles.tapHint}>Ketuk di mana saja untuk melanjutkan</Text>
            </View>
          </Pressable>
        )}
      </View>
    </View>
  );
}

export async function shouldShowFirstLaunchIntro() {
  return true;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070B16' },
  video: { ...StyleSheet.absoluteFill },
  overlay: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'flex-end', paddingHorizontal: 24, paddingBottom: 46, backgroundColor: 'rgba(4, 8, 18, 0.34)' },
  soundPill: { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: 'rgba(7, 11, 22, 0.78)', borderColor: 'rgba(255, 181, 71, 0.45)', borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6, marginBottom: 16 },
  soundDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFB547' },
  soundText: { color: '#F6D6A8', fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  brand: { color: '#F8FAFC', fontSize: 30, fontWeight: '900', letterSpacing: 5, textShadowColor: '#2388E8', textShadowRadius: 14 },
  tagline: { color: '#E1E6EF', fontSize: 13, marginTop: 8 },
  introVoice: { color: '#FFFFFF', fontSize: 12, textAlign: 'center', marginTop: 18, paddingHorizontal: 15 },
  quoteScreen: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 28 },
  quotePanel: { width: '100%', maxWidth: 460, backgroundColor: 'rgba(7, 15, 32, 0.92)', borderColor: 'rgba(120, 180, 255, 0.45)', borderWidth: 1, borderRadius: 24, padding: 24, alignItems: 'center', marginBottom: 12 },
  quoteEyebrow: { color: '#8CC8FF', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  quoteMark: { color: '#FFB547', fontSize: 48, lineHeight: 54, fontWeight: '900', marginTop: 8 },
  quote: { color: '#FFFFFF', fontSize: 19, lineHeight: 29, textAlign: 'center', fontWeight: '700' },
  credit: { color: '#9CCFFF', fontSize: 11, marginTop: 15, fontWeight: '700' },
  continueButton: { backgroundColor: '#2388E8', borderRadius: 13, paddingVertical: 14, paddingHorizontal: 22, marginTop: 23, width: '100%', alignItems: 'center' },
  continueText: { color: '#FFFFFF', fontWeight: '900', fontSize: 13 },
  tapHint: { color: '#9CAFC7', fontSize: 10, marginTop: 10 },
});