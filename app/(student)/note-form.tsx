import { Alert, ScrollView, StyleSheet, TextInput } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Button, C, Field, Header } from "../../components/UI";
import { useApp } from "../../context/AppContext";

export default function NoteForm(){
 const {mode,id}=useLocalSearchParams<{mode?:string;id?:string}>();const router=useRouter();const {notes,addNote,updateNote}=useApp();const old=notes.find(n=>n.id===id);
 const [title,setTitle]=useState(old?.title||"");const [subject,setSubject]=useState(old?.subject||"");const [content,setContent]=useState(old?.content||"");
 const save=()=>{if(!title.trim()||!content.trim())return Alert.alert("Missing fields","Title and content are required.");const data={title,subject,content};if(mode==="edit"&&id)updateNote(id,data);else addNote(data);router.back();};
 return <ScrollView style={s.screen} contentContainerStyle={s.content}><Header title={mode==="edit"?"Edit Note":"New Note"} onBack={()=>router.back()}/><Field label="Note Title" value={title} onChangeText={setTitle} placeholder="Database Review"/><Field label="Subject / Category" value={subject} onChangeText={setSubject} placeholder="Database Systems"/><TextInput value={content} onChangeText={setContent} placeholder="Write your notes here..." placeholderTextColor={C.muted2} multiline textAlignVertical="top" style={s.editor}/><Button title="SAVE NOTE" onPress={save}/></ScrollView>
}
const s=StyleSheet.create({screen:{flex:1,backgroundColor:C.bg},content:{padding:20,paddingBottom:35},editor:{minHeight:240,borderRadius:14,backgroundColor:C.card,borderWidth:1,borderColor:C.border,color:"#fff",padding:15,fontSize:13,lineHeight:20,marginBottom:18}});
