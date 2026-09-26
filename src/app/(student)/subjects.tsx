import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { C, Card, Header, SearchBox } from "../../components/UI";
import { useApp } from "../../context/AppContext";

export default function Subjects() {
 const router=useRouter(); const {subjects,deleteSubject,currentUser}=useApp(); const [q,setQ]=useState("");
 const visibleSubjects=subjects.filter(subject=>currentUser?.role==="admin"||!subject.userId||subject.userId===currentUser?.id);
 const filtered=visibleSubjects.filter(s=>`${s.name} ${s.instructor}`.toLowerCase().includes(q.toLowerCase()));
 const canManage=currentUser?.role==="admin";
 const addSubject=()=>router.push({pathname:canManage?"/(admin)/subject-form":"/(student)/subject-form",params:{mode:"add"}});
 const openSubject=(id:string)=>{
  if(canManage)router.push({pathname:"/(admin)/subject-form",params:{mode:"edit",id}});
    else router.push({pathname:"/(student)/subject-details",params:{id}});
 };
 return <ScrollView style={s.screen} contentContainerStyle={s.content}><Header title="Subjects" subtitle={`${visibleSubjects.length} subjects`} right={<TouchableOpacity onPress={addSubject} style={s.add} accessibilityRole="button" accessibilityLabel="Add subject"><Ionicons name="add" size={20} color="#fff"/></TouchableOpacity>}/><SearchBox placeholder="Search subjects..." value={q} onChangeText={setQ}/>
 {filtered.length===0?<Text style={s.none}>No subjects found.</Text>:filtered.map(sub=>{const canEdit=canManage||sub.userId===currentUser?.id;return <Card key={sub.id} style={s.card}><TouchableOpacity style={s.subjectInfo} onPress={()=>openSubject(sub.id)} accessibilityRole="button"><View style={s.icon}><Ionicons name={sub.icon as any} size={23} color="#fff"/></View><View style={{flex:1}}><Text style={s.title}>{sub.name}</Text><Text style={s.muted}>{sub.instructor||"Personal subject"}</Text><Text style={s.muted}>{[sub.schedule,sub.room].filter(Boolean).join(" • ")}</Text></View></TouchableOpacity>{canEdit&&<><TouchableOpacity onPress={()=>router.push({pathname:canManage?"/(admin)/subject-form":"/(student)/subject-form",params:{mode:"edit",id:sub.id}})} style={s.smallBtn} accessibilityRole="button" accessibilityLabel={`Edit ${sub.name}`}><Ionicons name="create-outline" size={17} color="#fff"/></TouchableOpacity><TouchableOpacity onPress={()=>Alert.alert("Delete Subject","Remove this subject?",[{text:"Cancel",style:"cancel"},{text:"Delete",style:"destructive",onPress:()=>deleteSubject(sub.id)}])} style={s.smallBtn} accessibilityRole="button" accessibilityLabel={`Delete ${sub.name}`}><Ionicons name="trash-outline" size={17} color={C.red}/></TouchableOpacity></>}</Card>})}
 </ScrollView>
}
const s=StyleSheet.create({screen:{flex:1,backgroundColor:C.bg},content:{padding:20,paddingBottom:35},add:{width:38,height:38,borderRadius:12,backgroundColor:C.blue,alignItems:"center",justifyContent:"center"},card:{flexDirection:"row",alignItems:"center",marginBottom:10},subjectInfo:{flex:1,flexDirection:"row",alignItems:"center"},icon:{width:45,height:45,borderRadius:12,backgroundColor:C.purple,alignItems:"center",justifyContent:"center",marginRight:12},title:{color:"#fff",fontWeight:"800",fontSize:13,marginBottom:4},muted:{color:C.muted,fontSize:10,marginTop:2},smallBtn:{width:34,height:34,borderRadius:9,backgroundColor:C.card2,alignItems:"center",justifyContent:"center",marginLeft:6},none:{color:C.muted,textAlign:"center",marginTop:40}});
