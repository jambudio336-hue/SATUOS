import {Stack} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useEffect} from 'react';
import {db} from '../lib/database';
export default function Layout(){useEffect(()=>{db().catch(e=>console.error('Gagal membuka database',e))},[]);return <SafeAreaProvider><StatusBar style="light"/><Stack screenOptions={{headerShown:false,contentStyle:{backgroundColor:'#0B1220'}}}/></SafeAreaProvider>}
