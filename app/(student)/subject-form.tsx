import { Alert, ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Button, C, Field, Header } from "../../components/UI";
import { useApp } from "../../context/AppContext";

export default function SubjectForm(){
 const {mode,id}=useLocalSearchParams<{mode?:string;id?:string}>(); const router=useRouter(); const {subjects,addSubject,updateSubject}=useApp(); const old=subjects.find(s=>s.id===id);
 const [name,setName]=useState(old?.name||""); const [instructor,setInstructor]=useState(old?.instructor||""); const [room,setRoom]=useState(old?.room||""); const [schedule,setSchedule]=useState(old?.schedule||""); const [icon,setIcon]=useState(old?.icon||"book-outline");
 const save=()=>{if(!name.trim()||!instructor.trim())return Alert.alert("Missing fields","Subject name and instructor are required."); const data={name,instructor,room,schedule,icon}; if(mode==="edit"&&id)updateSubject(id,data);else addSubject(data); Alert.alert("Saved","Subject saved successfully.",[{text:"OK",onPress:()=>router.back()}]);};
 return <ScrollView style={s.screen} contentContainerStyle={s.content}><Header title={mode==="edit"?"Edit Subject":"Add Subject"} onBack={()=>router.back()}/><Field label="Subject Name" value={name} onChangeText={setName} placeholder="Information Assurance"/><Field label="Instructor" value={instructor} onChangeText={setInstructor} placeholder="Prof. Santos"/><Field label="Room" value={room} onChangeText={setRoom} placeholder="Room 101"/><Field label="Schedule" value={schedule} onChangeText={setSchedule} placeholder="MWF 9:00 AM"/><Field label="Icon Name" value={icon} onChangeText={setIcon} placeholder="book-outline"/><Button title="SAVE SUBJECT" onPress={save}/></ScrollView>
}
const s=StyleSheet.create({screen:{flex:1,backgroundColor:C.bg},content:{padding:20,paddingBottom:35}});
