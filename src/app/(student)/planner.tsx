import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { C, Card, Header } from "../../components/UI";
import { useApp } from "../../context/AppContext";

export default function Planner(){
 const router=useRouter(); const {sessions,completeSession}=useApp();
 return <ScrollView style={s.screen} contentContainerStyle={s.content}><Header title="Study Planner" subtitle="Plan focused study sessions" right={<TouchableOpacity style={s.add} onPress={()=>router.push("/(student)/session-form")}><Ionicons name="add" size={20} color="#fff"/></TouchableOpacity>}/>
 <Card><View style={s.month}><Text style={s.white}>‹</Text><Text style={s.white}>September 2026</Text><Text style={s.white}>›</Text></View><View style={s.calendar}>{["21","22","23","24","25","26","27","28","29","30","1","2","3","4"].map((d,i)=><View key={i} style={[s.day,i===1&&s.sel]}><Text style={s.dayText}>{d}</Text></View>)}</View></Card>
 <Text style={s.section}>Study Sessions</Text>
 {sessions.map(x=><Card key={x.id} style={s.session}><Ionicons name="time-outline" size={28} color={C.blue}/><View style={{flex:1,marginLeft:12}}><Text style={s.title}>{x.subject}</Text><Text style={s.muted}>{x.date} • {x.startTime}</Text><Text style={s.muted}>{x.duration} • {x.status}</Text></View>{x.status==="Planned"?<TouchableOpacity style={s.start} onPress={()=>{completeSession(x.id);Alert.alert("Session complete","Nice work! Study session marked completed.")}}><Text style={s.startText}>COMPLETE</Text></TouchableOpacity>:<Text style={s.done}>DONE</Text>}</Card>)}
 </ScrollView>
}
const s=StyleSheet.create({screen:{flex:1,backgroundColor:C.bg},content:{padding:20,paddingBottom:35},add:{width:38,height:38,borderRadius:12,backgroundColor:C.blue,alignItems:"center",justifyContent:"center"},month:{flexDirection:"row",justifyContent:"space-between",marginBottom:15},white:{color:C.text,fontWeight:"800"},calendar:{flexDirection:"row",flexWrap:"wrap"},day:{width:"14.28%",height:42,alignItems:"center",justifyContent:"center"},sel:{backgroundColor:C.blue,borderRadius:10},dayText:{color:C.text},section:{color:C.text,fontSize:18,fontWeight:"800",marginTop:22,marginBottom:10},session:{flexDirection:"row",alignItems:"center",marginBottom:10},title:{color:C.text,fontWeight:"800"},muted:{color:C.muted,fontSize:10,marginTop:4},start:{backgroundColor:C.green,paddingHorizontal:10,paddingVertical:8,borderRadius:9},startText:{color:C.text,fontWeight:"800",fontSize:9},done:{color:C.green,fontWeight:"800",fontSize:10}});
