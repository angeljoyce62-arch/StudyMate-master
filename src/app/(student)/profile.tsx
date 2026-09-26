import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { C, Card, Header } from "../../components/UI";
import { useApp } from "../../context/AppContext";

export default function Profile(){
	const router = useRouter();
	const { currentUser, logout, updateProfile } = useApp();
	const [editing, setEditing] = React.useState(false);
	const [name, setName] = React.useState(currentUser?.name || "");
	const [email, setEmail] = React.useState(currentUser?.email || "");
	const [studentId, setStudentId] = React.useState(currentUser?.studentId || "");
	const [course, setCourse] = React.useState(currentUser?.course || "");
	const [year, setYear] = React.useState(currentUser?.year || "");

	React.useEffect(() => {
		setName(currentUser?.name || "");
		setEmail(currentUser?.email || "");
		setStudentId(currentUser?.studentId || "");
		setCourse(currentUser?.course || "");
		setYear(currentUser?.year || "");
	}, [currentUser]);

	const confirmLogout = async () => {
		const proceed = Platform.OS === "web"
			? window.confirm("Are you sure you want to logout?")
			: await new Promise<boolean>((res) => Alert.alert("Logout","Are you sure you want to logout?",[{text:"Cancel",onPress:()=>res(false)},{text:"Logout",style:"destructive",onPress:()=>res(true)}]));
		if (proceed) {
			await logout();
			if (Platform.OS === "web") {
				window.location.href = "/";
			} else {
				router.replace("/");
			}
		}
	};

	const save = () => {
		if (!name.trim() || !email.trim()) return Alert.alert("Missing fields", "Name and email are required.");
		updateProfile({ name: name.trim(), email: email.trim(), studentId: studentId.trim(), course: course.trim(), year: year.trim() });
		setEditing(false);
		Alert.alert("Saved", "Profile updated.");
	};

	return (
		<>
			<ScrollView style={s.screen} contentContainerStyle={s.content}>
				<Header title="Profile" />
				<View style={s.avatar}><Ionicons name="person" size={42} color={C.text}/></View>
				<Text style={s.name}>{currentUser?.name}</Text>
				<Text style={s.course}>{currentUser?.course||"Student"}</Text>
				<Card style={s.info}>
					<Text style={s.label}>Student ID</Text>
					<Text style={s.value}>{currentUser?.studentId||"—"}</Text>
					<Text style={s.label}>Email</Text>
					<Text style={s.value}>{currentUser?.email}</Text>
					<Text style={s.label}>Course / Year</Text>
					<Text style={s.value}>{currentUser?.course||"—"} • {currentUser?.year||"—"}</Text>
				</Card>
				<TouchableOpacity style={s.item} onPress={() => setEditing(true)}>
					<Ionicons name="create-outline" size={21} color={C.blue}/>
					<Text style={s.itemText}>Edit Profile</Text>
					<Ionicons name="chevron-forward" size={17} color={C.muted2}/>
				</TouchableOpacity>
				<TouchableOpacity style={s.item} onPress={()=>router.push("/(student)/notifications")}>
					<Ionicons name="notifications-outline" size={21} color={C.blue}/>
					<Text style={s.itemText}>Notifications</Text>
					<Ionicons name="chevron-forward" size={17} color={C.muted2}/>
				</TouchableOpacity>
				<TouchableOpacity style={[s.item,{borderColor:C.red}]} onPress={confirmLogout}>
					<Ionicons name="log-out-outline" size={21} color={C.red}/>
					<Text style={[s.itemText,{color:C.red}]}>Logout</Text>
					<Ionicons name="chevron-forward" size={17} color={C.red}/>
				</TouchableOpacity>
			</ScrollView>

			<Modal visible={editing} animationType="slide" transparent>
				<View style={m.backdrop}>
					<View style={m.modal}>
						<Header title="Edit Profile" onBack={() => setEditing(false)} />
						<Text style={m.label}>Name</Text>
						<TextInput value={name} onChangeText={setName} style={m.input} placeholder="Full name" placeholderTextColor={C.muted2} />
						<Text style={m.label}>Email</Text>
						<TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={m.input} placeholder="Email" placeholderTextColor={C.muted2} />
						<Text style={m.label}>Student ID</Text>
						<TextInput value={studentId} onChangeText={setStudentId} style={m.input} placeholder="Student ID" placeholderTextColor={C.muted2} />
						<Text style={m.label}>Course</Text>
						<TextInput value={course} onChangeText={setCourse} style={m.input} placeholder="Course" placeholderTextColor={C.muted2} />
						<Text style={m.label}>Year</Text>
						<TextInput value={year} onChangeText={setYear} style={m.input} placeholder="Year" placeholderTextColor={C.muted2} />
						<View style={{flexDirection:'row',gap:12,marginTop:12}}>
							<TouchableOpacity onPress={() => setEditing(false)} style={[s.item,{flex:1,justifyContent:'center'}]}>
								<Text style={[s.itemText,{textAlign:'center'}]}>Cancel</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={save} style={[s.item,{flex:1,justifyContent:'center'}]}>
								<Text style={[s.itemText,{textAlign:'center'}]}>Save</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</>
	);
}
const s=StyleSheet.create({screen:{flex:1,backgroundColor:C.bg},content:{padding:20,paddingBottom:35},avatar:{alignSelf:"center",width:92,height:92,borderRadius:28,backgroundColor:C.blue,borderWidth:2,borderColor:C.green,alignItems:"center",justifyContent:"center",marginTop:20},name:{color:C.text,fontSize:22,fontWeight:"800",textAlign:"center",marginTop:14},course:{color:C.muted,textAlign:"center",marginTop:4,fontSize:12},info:{marginTop:22,marginBottom:14},label:{color:C.muted2,fontSize:10,marginTop:5},value:{color:C.text,fontWeight:"700",fontSize:13,marginTop:4,marginBottom:12},item:{backgroundColor:C.card,borderWidth:1,borderColor:C.border,borderRadius:12,padding:15,flexDirection:"row",alignItems:"center",marginBottom:10},itemText:{flex:1,color:C.text,fontWeight:"700",marginLeft:12}});

const m = StyleSheet.create({
	backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
	modal: { backgroundColor: C.bg, borderRadius: 14, padding: 16, maxHeight: '90%' },
	label: { color: C.muted2, fontSize: 12, marginTop: 12, marginBottom: 6 },
	input: { height: 44, borderRadius: 10, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, paddingHorizontal: 10, color: C.text },
});
