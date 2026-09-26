import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button, C, Field, Header } from "../../components/UI";
import { Priority, useApp } from "../../context/AppContext";

export default function PostActivity(){
 const router=useRouter();
 const {subjects,addActivity}=useApp();
 const [title,setTitle]=useState("");
 const [description,setDescription]=useState("");
 const [subject,setSubject]=useState(subjects[0]?.name||"Information Assurance");
 const [dueDate,setDueDate]=useState("Sep 30, 2026");
 const [priority,setPriority]=useState<Priority>("High");
 const [attachment,setAttachment]=useState<string>("");
 const [successVisible,setSuccessVisible]=useState(false);
 const [errorVisible,setErrorVisible]=useState(false);
 const fileInputRef = useRef<HTMLInputElement | null>(null);

 const post = () => {
	if (!title.trim()) return setErrorVisible(true);
	addActivity({ title, description, subject, dueDate, priority, attachment });
	setSuccessVisible(true);
 };

 return (
	<ScrollView style={s.screen} contentContainerStyle={s.content}>
		<Header title="Post New Activity" subtitle="Students will receive a notification"/>
		<Text style={s.label}>Subject</Text>
		<View style={s.select}><Text style={s.value}>{subject}</Text></View>
		<Field label="Activity Title" value={title} onChangeText={setTitle} placeholder="e.g. Midterm Project"/>
		<Field label="Description" value={description} onChangeText={setDescription} multiline placeholder="Enter instructions and requirements..."/>
		<Field label="Due Date" value={dueDate} onChangeText={setDueDate} placeholder="Sep 30, 2026"/>

		<Text style={s.label}>Attachment (optional)</Text>
		{Platform.OS === 'web' ? (
			<>
				<input style={{display:'none'}} ref={(r)=>{ fileInputRef.current = r; }} type="file" onChange={(e:any)=>{ const f = e.target.files && e.target.files[0]; if(f) setAttachment(f.name); }} />
				<View style={{flexDirection:'row',gap:8,alignItems:'center',marginBottom:12}}>
					<TouchableOpacity style={[s.prio,{paddingVertical:8,paddingHorizontal:12}]} onPress={()=>fileInputRef.current?.click()}><Text style={s.prioText}>Choose File</Text></TouchableOpacity>
					<Text style={s.value}>{attachment || 'No file selected'}</Text>
				</View>
			</>
		) : (
			<Field label="Attachment (optional)" value={attachment} onChangeText={setAttachment} placeholder="example.pdf"/>
		)}

		<Text style={s.label}>Priority</Text>
		<View style={s.prios}>{(["High","Medium","Low"] as Priority[]).map(p=><TouchableOpacity key={p} onPress={()=>setPriority(p)} style={[s.prio,priority===p&&s.selected]}><Text style={s.prioText}>{p}</Text></TouchableOpacity>)}</View>
		<Button title="POST ACTIVITY" icon="paper-plane-outline" onPress={post}/>

		<Modal visible={errorVisible} transparent animationType="fade">
			<View style={{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0.4)'}}>
				<View style={{backgroundColor:C.bg,padding:18,borderRadius:12,width:'86%'}}>
					<Text style={{color:'#fff',fontWeight:'800',fontSize:16}}>Missing title</Text>
					<Text style={{color:C.muted,marginTop:8}}>Please enter an activity title.</Text>
					<TouchableOpacity onPress={()=>setErrorVisible(false)} style={{marginTop:14,alignSelf:'flex-end'}}><Text style={{color:C.blue,fontWeight:'800'}}>OK</Text></TouchableOpacity>
				</View>
			</View>
		</Modal>

		<Modal visible={successVisible} transparent animationType="fade">
			<View style={{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0.4)'}}>
				<View style={{backgroundColor:C.bg,padding:18,borderRadius:12,width:'86%'}}>
					<Text style={{color:'#fff',fontWeight:'800',fontSize:16}}>Posted</Text>
					<Text style={{color:C.muted,marginTop:8}}>Activity posted and a student notification was created.</Text>
					<TouchableOpacity onPress={()=>{setSuccessVisible(false);router.push('/(admin)/activities');}} style={{marginTop:14,alignSelf:'flex-end'}}><Text style={{color:C.blue,fontWeight:'800'}}>OK</Text></TouchableOpacity>
				</View>
			</View>
		</Modal>

	</ScrollView>
 );
}
const s=StyleSheet.create({screen:{flex:1,backgroundColor:C.bg},content:{padding:20,paddingBottom:35},label:{color:C.muted,fontSize:12,fontWeight:"700",marginBottom:7,marginTop:7},select:{height:50,borderRadius:13,backgroundColor:C.card,borderWidth:1,borderColor:C.border,justifyContent:"center",paddingHorizontal:14,marginBottom:8},value:{color:"#fff"},prios:{flexDirection:"row",gap:8,marginBottom:20},prio:{flex:1,paddingVertical:11,borderRadius:10,backgroundColor:C.card,borderWidth:1,borderColor:C.border,alignItems:"center"},selected:{backgroundColor:C.blue,borderColor:C.blue},prioText:{color:"#fff",fontWeight:"800",fontSize:11}});
