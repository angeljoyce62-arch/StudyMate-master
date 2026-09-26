import { Alert, ScrollView, StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Button, C, Field, Header } from "../../components/UI";
import { Priority, useApp } from "../../context/AppContext";

export default function TaskForm(){
 const {mode,id}=useLocalSearchParams<{mode?:string;id?:string}>(); const router=useRouter(); const {tasks,subjects,addTask,updateTask}=useApp(); const old=tasks.find(t=>t.id===id);
 const [title,setTitle]=useState(old?.title||""); const [description,setDescription]=useState(old?.description||""); const [subject,setSubject]=useState(old?.subject||subjects[0]?.name||""); const [dueDate,setDueDate]=useState(old?.dueDate||"Sep 30, 2026"); const [priority,setPriority]=useState<Priority>(old?.priority||"Medium");
 const save=()=>{if(!title.trim())return Alert.alert("Missing title","Please enter a task title.");const data={title,description,subject,dueDate,priority,completed:old?.completed||false,sourceActivityId:old?.sourceActivityId};if(mode==="edit"&&id)updateTask(id,data);else addTask(data);router.back();};
 return <ScrollView style={s.screen} contentContainerStyle={s.content}><Header title={mode==="edit"?"Edit Task":"Add Task"} onBack={()=>router.back()}/><Field label="Task Title" value={title} onChangeText={setTitle} placeholder="Assignment / activity name"/><Field label="Description" value={description} onChangeText={setDescription} multiline placeholder="Task details"/><Field label="Subject" value={subject} onChangeText={setSubject} placeholder="Information Assurance"/><Field label="Due Date" value={dueDate} onChangeText={setDueDate} placeholder="Sep 30, 2026"/><Text style={s.label}>Priority</Text><View style={s.prios}>{(["High","Medium","Low"] as Priority[]).map(p=><TouchableOpacity key={p} onPress={()=>setPriority(p)} style={[s.prio,priority===p&&s.selected]}><Text style={s.prioText}>{p}</Text></TouchableOpacity>)}</View><Button title="SAVE TASK" onPress={save}/></ScrollView>
}
const s=StyleSheet.create({screen:{flex:1,backgroundColor:C.bg},content:{padding:20,paddingBottom:35},label:{color:C.muted,fontWeight:"700",fontSize:12,marginBottom:7},prios:{flexDirection:"row",gap:8,marginBottom:20},prio:{flex:1,paddingVertical:11,alignItems:"center",borderRadius:10,backgroundColor:C.card,borderWidth:1,borderColor:C.border},selected:{backgroundColor:C.blue,borderColor:C.blue},prioText:{color:"#fff",fontWeight:"800",fontSize:11}});
