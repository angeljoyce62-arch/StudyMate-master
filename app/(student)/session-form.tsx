import { Alert, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, C, Field, Header } from "../../components/UI";
import { useApp } from "../../context/AppContext";

export default function SessionForm(){
 const router=useRouter(); const {subjects,addSession}=useApp(); const [subject,setSubject]=useState(subjects[0]?.name||""); const [date,setDate]=useState("Sep 22, 2026"); const [startTime,setStartTime]=useState("5:00 PM"); const [duration,setDuration]=useState("1 hour");
 const save=()=>{if(!subject.trim())return Alert.alert("Missing subject","Please enter a subject.");addSession({subject,date,startTime,duration,status:"Planned"});router.back();};
 return <ScrollView style={s.screen} contentContainerStyle={s.content}><Header title="Add Study Session" onBack={()=>router.back()}/><Field label="Subject" value={subject} onChangeText={setSubject} placeholder="Database Systems"/><Field label="Date" value={date} onChangeText={setDate} placeholder="Sep 22, 2026"/><Field label="Start Time" value={startTime} onChangeText={setStartTime} placeholder="5:00 PM"/><Field label="Duration" value={duration} onChangeText={setDuration} placeholder="1 hour"/><Button title="ADD SESSION" onPress={save}/></ScrollView>
}
const s=StyleSheet.create({screen:{flex:1,backgroundColor:C.bg},content:{padding:20,paddingBottom:35}});
