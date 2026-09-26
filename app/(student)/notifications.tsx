import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useApp } from "../../context/AppContext";
import { C, Card, Header } from "../../components/UI";

export default function Notifications(){
 const {notifications,markNotificationRead,markAllNotificationsRead,clearNotifications}=useApp();
 return <ScrollView style={s.screen} contentContainerStyle={s.content}><Header title="Notifications" right={<TouchableOpacity onPress={clearNotifications}><Text style={s.clear}>Clear All</Text></TouchableOpacity>}/><View style={s.actions}><TouchableOpacity onPress={markAllNotificationsRead}><Text style={s.link}>Mark all as read</Text></TouchableOpacity></View>
 {notifications.map(n=><TouchableOpacity key={n.id} onPress={()=>markNotificationRead(n.id)}><Card style={[s.card,!n.read&&s.unread]}><View style={s.icon}><Ionicons name={n.type==="activity"?"document-text-outline":"notifications-outline"} size={21} color="#fff"/></View><View style={{flex:1}}><Text style={s.title}>{n.title}</Text><Text style={s.message}>{n.message}</Text><Text style={s.time}>{n.createdAt}</Text></View>{!n.read&&<View style={s.dot}/>}</Card></TouchableOpacity>)}
 {notifications.length===0?<Text style={s.empty}>No notifications.</Text>:null}
 </ScrollView>
}
const s=StyleSheet.create({screen:{flex:1,backgroundColor:C.bg},content:{padding:20,paddingBottom:35},clear:{color:C.red,fontWeight:"800",fontSize:11},actions:{alignItems:"flex-end",marginBottom:10},link:{color:C.blue,fontSize:11,fontWeight:"800"},card:{flexDirection:"row",alignItems:"center",marginBottom:10},unread:{borderColor:"#2A5F9F"},icon:{width:43,height:43,borderRadius:12,backgroundColor:C.blue,alignItems:"center",justifyContent:"center",marginRight:12},title:{color:"#fff",fontWeight:"800",fontSize:13},message:{color:C.muted,fontSize:11,lineHeight:16,marginTop:4},time:{color:C.muted2,fontSize:9,marginTop:5},dot:{width:8,height:8,borderRadius:4,backgroundColor:C.blue,marginLeft:8},empty:{color:C.muted,textAlign:"center",marginTop:40}});
