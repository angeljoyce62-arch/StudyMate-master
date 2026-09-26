import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { C, Card, Header } from "../../components/UI";
import { useApp } from "../../context/AppContext";

export default function AdminDashboard(){
 const router=useRouter();const {activities,users,subjects,logout}=useApp();
 const confirmLogout = async () => {
  const proceed = Platform.OS === 'web' ? window.confirm('Logout?') : await new Promise<boolean>((res)=> Alert.alert('Logout','Are you sure you want to logout?',[{text:'Cancel',onPress:()=>res(false)},{text:'Logout',style:'destructive',onPress:()=>res(true)}]));
  if (proceed) { await logout(); if (Platform.OS === 'web') window.location.href = '/'; else router.replace('/'); }
 };

 return <ScrollView style={s.screen} contentContainerStyle={s.content}><Header title="Admin Dashboard" subtitle="Manage academic activities and students" right={<>
  <TouchableOpacity style={s.icon}><Ionicons name="school-outline" size={20} color="#fff"/></TouchableOpacity>
  <TouchableOpacity style={[s.icon,{marginLeft:8}]} onPress={confirmLogout}><Ionicons name="log-out-outline" size={18} color="#fff"/></TouchableOpacity>
  </>} />
 <Text style={s.welcome}>Welcome, Prof. Santos</Text><View style={s.grid}><Card style={s.stat}><Text style={s.num}>{subjects.length}</Text><Text style={s.muted}>Subjects</Text></Card><Card style={s.stat}><Text style={s.num}>{users.filter(u=>u.role==="student").length}</Text><Text style={s.muted}>Students</Text></Card><Card style={s.stat}><Text style={s.num}>{activities.length}</Text><Text style={s.muted}>Activities</Text></Card></View>
 <Text style={s.section}>Quick Actions</Text><View style={s.actions}><TouchableOpacity style={s.action} onPress={()=>router.push("/(admin)/post")}><Ionicons name="add-circle" size={28} color="#fff"/><Text style={s.actionText}>Post Activity</Text></TouchableOpacity><TouchableOpacity style={s.action} onPress={()=>router.push("/(admin)/activities")}><Ionicons name="list" size={28} color="#fff"/><Text style={s.actionText}>Manage Activities</Text></TouchableOpacity></View>
 <Text style={s.section}>Recent Posts</Text>{activities.slice(0,4).map(a=><TouchableOpacity key={a.id} onPress={()=>router.push({pathname:"/(admin)/activity-form",params:{mode:"edit",id:a.id}})}><Card style={s.item}><Ionicons name="document-text-outline" size={24} color={C.blue}/><View style={{flex:1,marginLeft:12}}><Text style={s.title}>{a.title}</Text><Text style={s.muted}>{a.subject} • Due {a.dueDate}</Text></View></Card></TouchableOpacity>)}</ScrollView>
}
const s=StyleSheet.create({screen:{flex:1,backgroundColor:C.bg},content:{padding:20,paddingBottom:35},icon:{width:38,height:38,borderRadius:11,backgroundColor:C.blue,alignItems:"center",justifyContent:"center"},welcome:{color:C.muted,fontSize:12,marginBottom:17},grid:{flexDirection:"row",gap:8},stat:{flex:1,padding:14},num:{color:"#fff",fontSize:24,fontWeight:"800"},muted:{color:C.muted,fontSize:10,marginTop:4},section:{color:"#fff",fontSize:18,fontWeight:"800",marginTop:22,marginBottom:10},actions:{flexDirection:"row",gap:9},action:{flex:1,backgroundColor:C.blue,borderRadius:15,padding:16,alignItems:"center"},actionText:{color:"#fff",fontWeight:"800",fontSize:12,marginTop:7},item:{flexDirection:"row",alignItems:"center",marginBottom:9},title:{color:"#fff",fontWeight:"800",fontSize:13}});
