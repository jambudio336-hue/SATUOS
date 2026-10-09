import {View,Text,Pressable,StyleSheet} from 'react-native';
import {usePathname,useRouter,Href} from 'expo-router';

const tabs:{label:string;icon:string;route:Href;matches:string[]}[]=[
 {label:'Beranda',icon:'⌂',route:'/',matches:['/']},
 {label:'Keuangan',icon:'▤',route:'/money',matches:['/money']},
 {label:'Usaha',icon:'▦',route:'/business',matches:['/business']},
 {label:'Konektor',icon:'↗',route:'/social',matches:['/social']},
 {label:'Lainnya',icon:'☰',route:'/settings',matches:['/settings','/trust','/assistant','/family','/tasks','/wealth','/automation','/reports']}
];
export default function BottomNav(){
 const router=useRouter();const path=usePathname();
 return <View style={s.bar}>{tabs.map(t=>{const active=t.matches.includes(path);return <Pressable key={t.label} accessibilityRole="button" accessibilityLabel={t.label} onPress={()=>router.push(t.route)} style={s.tab}><Text style={[s.icon,active&&s.active]}>{t.icon}</Text><Text numberOfLines={1} style={[s.label,active&&s.active]}>{t.label}</Text>{active&&<View style={s.dot}/>}</Pressable>})}</View>
}
const s=StyleSheet.create({bar:{height:66,flexDirection:'row',alignItems:'center',justifyContent:'space-around',backgroundColor:'#101116',borderTopColor:'#28282D',borderTopWidth:1,paddingHorizontal:4},tab:{flex:1,alignItems:'center',justifyContent:'center',height:'100%',gap:3},icon:{fontSize:21,color:'#85858D',fontWeight:'800'},label:{fontSize:10,color:'#8D8D95',fontWeight:'700'},active:{color:'#FF9F0A'},dot:{position:'absolute',bottom:3,width:4,height:4,borderRadius:2,backgroundColor:'#FF9F0A'}});