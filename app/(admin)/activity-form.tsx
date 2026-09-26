import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Button, C, Field, Header } from "../../components/UI";
import { Priority, useApp } from "../../context/AppContext";

export default function ActivityForm(){
 const {mode,id}=useLocalSearchParams<{mode?:string;id?:string}>();const router=useRouter();const {activities,updateActivity}=useApp();const old=activities.find(a=>a.id===id);
 const [title,setTitle]=useState(old?.title||"");const [description,setDescription]=useState(old?.description||"");const [subject,setSubject]=useState(old?.subject||"");const [dueDate,setDueDate]=useState(old?.dueDate||"");const [priority,setPriority]=useState<Priority>(old?.priority||"Medium");const [attachment,setAttachment]=useState(old?.attachment||"");
 const save=()=>{if(!id||!title.trim())return Alert.alert("Missing title","Title is required.");updateActivity(id,{title,description,subject,dueDate,priority,attachment});Alert.alert("Updated","Activity updated successfully.",[{text:"OK",onPress:()=>router.back()}]);};
 return <ScrollView style={s.screen} contentContainerStyle={s.content}><Header title="Edit Activity" onBack={()=>router.back()}/><Field label="Activity Title" value={title} onChangeText={setTitle}/><Field label="Subject" value={subject} onChangeText={setSubject}/><Field label="Description" value={description} onChangeText={setDescription} multiline/><Field label="Due Date" value={dueDate} onChangeText={setDueDate}/><Field label="Attachment" value={attachment} onChangeText={setAttachment}/><Text style={s.label}>Priority</Text><View style={s.prios}>{(["High","Medium","Low"] as Priority[]).map(p=><TouchableOpacity key={p} onPress={()=>setPriority(p)} style={[s.prio,priority===p&&s.selected]}><Text style={s.text}>{p}</Text></TouchableOpacity>)}</View><Button title="SAVE CHANGES" onPress={save}/></ScrollView>
}
const s=StyleSheet.create({screen:{flex:1,backgroundColor:C.bg},content:{padding:20,paddingBottom:35},label:{color:C.muted,fontWeight:"700",fontSize:12,marginBottom:7},prios:{flexDirection:"row",gap:8,marginBottom:20},prio:{flex:1,paddingVertical:11,borderRadius:10,borderWidth:1,borderColor:C.border,backgroundColor:C.card,alignItems:"center"},selected:{backgroundColor:C.blue,borderColor:C.blue},text:{color:"#fff",fontWeight:"800",fontSize:11}});
