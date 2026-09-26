import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, C, Field, Header, PriorityBadge } from "../../components/UI";
import { getTaskPriority, useApp } from "../../context/AppContext";

export default function TaskForm(){
 const {mode,id}=useLocalSearchParams<{mode?:string;id?:string}>(); const router=useRouter(); const {tasks,subjects,addTask,updateTask,currentUser}=useApp(); const old=tasks.find(t=>t.id===id&&t.userId===currentUser?.id);
 const [title,setTitle]=useState(old?.title||""); const [description,setDescription]=useState(old?.description||""); const [subject,setSubject]=useState(old?.subject||subjects[0]?.name||""); const [dueDate,setDueDate]=useState(old?.dueDate||"Sep 30, 2026"); const priority=getTaskPriority(dueDate);
 const save=()=>{if(!title.trim())return Alert.alert("Missing title","Please enter a task title.");const data={title,description,subject,dueDate,priority,completed:old?.completed||false,userId:currentUser?.id,sourceActivityId:old?.sourceActivityId};if(mode==="edit"&&id&&old)updateTask(id,data);else addTask(data);router.back();};
 return <ScrollView style={s.screen} keyboardShouldPersistTaps="handled" contentContainerStyle={s.content}><Header title={mode==="edit"?"Edit Task":"Add Task"} onBack={()=>router.back()}/><Field label="Task Title" value={title} onChangeText={setTitle} placeholder="Assignment / activity name"/><Field label="Description" value={description} onChangeText={setDescription} multiline placeholder="Task details"/><Field label="Subject" value={subject} onChangeText={setSubject} placeholder="Information Assurance"/><Field label="Due Date" value={dueDate} onChangeText={setDueDate} placeholder="Sep 30, 2026"/><View style={s.priorityRow}><Text style={s.label}>Priority</Text><PriorityBadge priority={priority}/></View><Button title="SAVE TASK" onPress={save}/></ScrollView>
}
const s=StyleSheet.create({screen:{flex:1,backgroundColor:C.bg},content:{padding:20,paddingBottom:35},label:{color:C.muted,fontWeight:"700",fontSize:12,marginBottom:7},priorityRow:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginBottom:20}});
