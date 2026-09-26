import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { C, Card, Header, SearchBox } from "../../components/UI";
import { useApp } from "../../context/AppContext";

export default function Notes(){
 const router=useRouter();const {notes,deleteNote,currentUser}=useApp();const [q,setQ]=useState("");const myNotes=notes.filter(note=>note.userId===currentUser?.id);
 const filtered=myNotes.filter(n=>`${n.title} ${n.content} ${n.subject}`.toLowerCase().includes(q.toLowerCase()));
 return <ScrollView style={s.screen} contentContainerStyle={s.content}><Header title="Notes" subtitle={`${myNotes.length} notes`} right={<TouchableOpacity style={s.add} onPress={()=>router.push({pathname:"/(student)/note-form",params:{mode:"add"}})}><Ionicons name="add" size={20} color="#fff"/></TouchableOpacity>}/><SearchBox placeholder="Search notes..." value={q} onChangeText={setQ}/>{filtered.map(n=><Card key={n.id} style={s.card}><TouchableOpacity style={{flex:1}} onPress={()=>router.push({pathname:"/(student)/note-form",params:{mode:"edit",id:n.id}})}><Text style={s.title}>{n.title}</Text><Text style={s.preview}>{n.content}</Text><Text style={s.meta}>{n.subject} • Updated {n.updatedAt}</Text></TouchableOpacity><TouchableOpacity onPress={()=>Alert.alert("Delete Note","Delete this note?",[{text:"Cancel"},{text:"Delete",style:"destructive",onPress:()=>deleteNote(n.id)}])}><Ionicons name="trash-outline" size={18} color={C.red}/></TouchableOpacity></Card>)}</ScrollView>
}
const s=StyleSheet.create({screen:{flex:1,backgroundColor:C.bg},content:{padding:20,paddingBottom:35},add:{width:38,height:38,borderRadius:12,backgroundColor:C.blue,alignItems:"center",justifyContent:"center"},card:{flexDirection:"row",marginBottom:10},title:{color:"#fff",fontWeight:"800",fontSize:14},preview:{color:C.muted,fontSize:11,lineHeight:16,marginTop:5},meta:{color:C.muted2,fontSize:10,marginTop:8}});
