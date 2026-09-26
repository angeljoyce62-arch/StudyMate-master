import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { C, Card, Header, SearchBox } from "../../components/UI";
import { useApp } from "../../context/AppContext";
import { useState } from "react";

export default function Students(){
 const router=useRouter();const {users}=useApp();const [q,setQ]=useState("");const students=users.filter(u=>u.role==="student"&&`${u.name} ${u.email} ${u.studentId}`.toLowerCase().includes(q.toLowerCase()));
 return <ScrollView style={s.screen} contentContainerStyle={s.content}><Header title="Students" subtitle={`${students.length} registered students`}/><SearchBox placeholder="Search students..." value={q} onChangeText={setQ}/>{students.map(st=><TouchableOpacity key={st.id} onPress={()=>router.push({pathname:"/(admin)/student-details",params:{id:st.id}})}><Card style={s.card}><View style={s.avatar}><Ionicons name="person" size={18} color="#fff"/></View><View style={{flex:1}}><Text style={s.name}>{st.name}</Text><Text style={s.muted}>{st.studentId||"No ID"} • {st.year||"—"}</Text><Text style={s.muted}>{st.email}</Text></View><Ionicons name="chevron-forward" size={18} color={C.muted2}/></Card></TouchableOpacity>)}</ScrollView>
}
const s=StyleSheet.create({screen:{flex:1,backgroundColor:C.bg},content:{padding:20,paddingBottom:35},card:{flexDirection:"row",alignItems:"center",marginBottom:9},avatar:{width:42,height:42,borderRadius:21,backgroundColor:C.blue,alignItems:"center",justifyContent:"center",marginRight:12},name:{color:"#fff",fontWeight:"800",fontSize:13},muted:{color:C.muted,fontSize:10,marginTop:4}});
