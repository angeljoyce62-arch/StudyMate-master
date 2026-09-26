import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { C, Card, Header, PriorityBadge, SearchBox } from "../../components/UI";
import { useApp } from "../../context/AppContext";

export default function AdminActivities(){
 const router=useRouter();
 const {activities,deleteActivity}=useApp();
 const [q,setQ]=useState("");
 const [confirmId,setConfirmId]=useState<string | null>(null);
 const filtered=activities.filter(a=>`${a.title} ${a.subject}`.toLowerCase().includes(q.toLowerCase()));
 return (
	<>
	<ScrollView style={s.screen} contentContainerStyle={s.content}>
		<Header title="Manage Activities" subtitle={`${activities.length} posted activities`} right={<TouchableOpacity style={s.add} onPress={()=>router.push("/(admin)/post")}><Ionicons name="add" size={20} color="#fff"/></TouchableOpacity>} />
		<SearchBox placeholder="Search activities..." value={q} onChangeText={setQ}/>
		{filtered.map(a=>
			<Card key={a.id} style={s.card}>
				<TouchableOpacity style={{flex:1}} onPress={()=>router.push({pathname:"/(admin)/activity-form",params:{mode:"edit",id:a.id}})}>
					<Text style={s.title}>{a.title}</Text>
					<Text style={s.muted}>{a.subject} • Due {a.dueDate}</Text>
					<Text style={s.muted}>Posted {a.createdAt}</Text>
				</TouchableOpacity>
				<PriorityBadge priority={a.priority}/>
				<TouchableOpacity accessibilityRole="button" accessibilityLabel={`Edit ${a.title}`} style={s.edit} onPress={()=>router.push({pathname:"/(admin)/activity-form",params:{mode:"edit",id:a.id}})}>
					<Ionicons name="create-outline" size={18} color={C.blue}/>
				</TouchableOpacity>
				<TouchableOpacity style={s.trash} onPress={()=>setConfirmId(a.id)}>
					<Ionicons name="trash-outline" size={18} color={C.red}/>
				</TouchableOpacity>
			</Card>
		)}
	</ScrollView>

	<Modal visible={!!confirmId} transparent animationType="fade">
		<View style={{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0.4)'}}>
			<View style={{backgroundColor:C.bg,padding:18,borderRadius:12,width:'86%'}}>
				<Text style={{color:'#fff',fontWeight:'800',fontSize:16}}>Delete Activity</Text>
				<Text style={{color:C.muted,marginTop:8}}>Remove this activity?</Text>
				<View style={{flexDirection:'row',justifyContent:'flex-end',gap:12,marginTop:14}}>
					<TouchableOpacity onPress={()=>setConfirmId(null)}><Text style={{color:C.muted}}>Cancel</Text></TouchableOpacity>
					<TouchableOpacity onPress={()=>{ if(confirmId){ deleteActivity(confirmId); } setConfirmId(null); }}><Text style={{color:C.red,fontWeight:'800'}}>Delete</Text></TouchableOpacity>
				</View>
			</View>
		</View>
	</Modal>
	</>
 );
}
const s=StyleSheet.create({screen:{flex:1,backgroundColor:C.bg},content:{padding:20,paddingBottom:35},add:{width:38,height:38,borderRadius:12,backgroundColor:C.blue,alignItems:"center",justifyContent:"center"},card:{flexDirection:"row",alignItems:"center",marginBottom:10},title:{color:"#fff",fontWeight:"800",fontSize:13},muted:{color:C.muted,fontSize:10,marginTop:4},edit:{marginLeft:8,padding:5},trash:{marginLeft:8,padding:5}});
