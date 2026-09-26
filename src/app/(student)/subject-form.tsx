import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet } from "react-native";
import { Button, C, Field, Header } from "../../components/UI";
import { useApp } from "../../context/AppContext";

export default function SubjectForm(){
 const {mode,id}=useLocalSearchParams<{mode?:string;id?:string}>(); const router=useRouter(); const {subjects,addSubject,updateSubject,currentUser}=useApp(); const old=subjects.find(s=>s.id===id&&(currentUser?.role==="admin"||s.userId===currentUser?.id)); const canManage=currentUser?.role==="admin";
 const [name,setName]=useState(old?.name||""); const [instructor,setInstructor]=useState(old?.instructor||""); const [room,setRoom]=useState(old?.room||""); const [schedule,setSchedule]=useState(old?.schedule||""); const [icon,setIcon]=useState(old?.icon||"book-outline");
 const save=()=>{if(!name.trim()||(canManage&&!instructor.trim()))return Alert.alert("Missing fields",canManage?"Subject name and instructor are required.":"Subject name is required."); const data={name:name.trim(),instructor:instructor.trim(),room:room.trim(),schedule:schedule.trim(),icon}; if(mode==="edit"&&id&&old)updateSubject(id,data);else addSubject(data); Alert.alert("Saved","Subject saved successfully.",[{text:"OK",onPress:()=>router.back()}]);};
 return <ScrollView style={s.screen} contentContainerStyle={s.content}><Header title={mode==="edit"?"Edit Subject":"Add Subject"} onBack={()=>router.back()}/><Field label="Subject Name" value={name} onChangeText={setName} placeholder="Information Assurance"/><Field label="Instructor (optional)" value={instructor} onChangeText={setInstructor} placeholder="Instructor name"/><Field label="Room (optional)" value={room} onChangeText={setRoom} placeholder="Room 101"/><Field label="Schedule (optional)" value={schedule} onChangeText={setSchedule} placeholder="MWF 9:00 AM"/>{canManage&&<Field label="Icon Name" value={icon} onChangeText={setIcon} placeholder="book-outline"/>}<Button title="SAVE SUBJECT" onPress={save}/></ScrollView>
}
const s=StyleSheet.create({screen:{flex:1,backgroundColor:C.bg},content:{padding:20,paddingBottom:35}});
