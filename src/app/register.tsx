import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button, C, Field, Header } from "../components/UI";
import { useApp } from "../context/AppContext";

const COURSE_OPTIONS = [
  "BS Information Technology",
  "BS Marine Biology",
  "BS Industrial Arts",
  "BS Home Economics",
];
const YEAR_OPTIONS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "6th Year", "Graduate Student"];

function DropdownField({ label, value, options, onSelect }: {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  const choose = (option: string) => {
    onSelect(option);
    setVisible(false);
  };

  return <View style={s.field}>
    <Text style={s.label}>{label}</Text>
    <TouchableOpacity onPress={() => setVisible(true)} style={s.select} accessibilityRole="button">
      <Text style={[s.selectText, !value && s.placeholder]}>{value || `Select ${label.toLowerCase()}`}</Text>
      <Ionicons name="chevron-down" size={16} color={C.muted}/>
    </TouchableOpacity>
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
      <View style={s.modalBackdrop}>
        <View style={s.modal}>
          <Text style={s.modalTitle}>{label}</Text>
          <ScrollView keyboardShouldPersistTaps="handled" style={s.options}>
            {options.map((option) => <TouchableOpacity key={option} onPress={() => choose(option)} style={s.option}>
              <Text style={s.optionText}>{option}</Text>
            </TouchableOpacity>)}
          </ScrollView>
          <TouchableOpacity onPress={() => setVisible(false)} style={s.closeButton}><Text style={s.closeText}>Cancel</Text></TouchableOpacity>
        </View>
      </View>
    </Modal>
  </View>;
}

export default function Register() {
  const router=useRouter(); const {register}=useApp(); const {role}=useLocalSearchParams<{role?:string}>();
  const isAdminAttempt = role === "admin";
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [confirmPassword,setConfirmPassword]=useState(""); const [studentId,setStudentId]=useState(""); const [course,setCourse]=useState(""); const [year,setYear]=useState(""); const [registerError,setRegisterError]=useState("");

  useEffect(() => {
    if (isAdminAttempt) {
      Alert.alert("Access denied", "Admin accounts cannot be created from this screen.");
      router.replace("/");
    }
  }, [isAdminAttempt, router]);

  const exitRegistration=()=>router.replace("/");
  const submit=async()=>{
    setRegisterError("");
    if(password.length<6){ setRegisterError("Password must be at least 6 characters."); return; }
    if(password!==confirmPassword){ setRegisterError("Please make sure both passwords match."); return; }
    if(!course||!year){ setRegisterError("Please select your course and year level."); return; }
    const r=await register(name,email,password,studentId,course,year,"student");
    if(!r.ok){ setRegisterError(r.message ?? "Unable to create account right now."); return; }
    router.replace("/(student)");
  };
  if (isAdminAttempt) return null;
  return <KeyboardAvoidingView style={s.screen} behavior={Platform.OS==="ios"?"padding":"height"}>
    <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={s.content}>
      <Header title="Create Account" subtitle="Student registration" onBack={exitRegistration}/>
      <View style={s.intro}><Text style={s.big}>Welcome to StudyMate</Text><Text style={s.muted}>Create your student account to manage activities, notes and study sessions.</Text></View>
      <Field label="Full Name" icon="person-outline" value={name} onChangeText={setName} placeholder="Your full name"/>
      <Field label="Email" icon="mail-outline" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com"/>
      <Field label="Password" icon="lock-closed-outline" value={password} onChangeText={setPassword} secureTextEntry placeholder="Minimum 6 characters"/>
      <Field label="Confirm Password" icon="lock-closed-outline" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry placeholder="Re-enter your password"/>
      <Field label="Student ID" icon="id-card-outline" value={studentId} onChangeText={setStudentId} placeholder="2026-0001"/>
      <DropdownField label="Course" value={course} options={COURSE_OPTIONS} onSelect={setCourse}/>
      <DropdownField label="Year Level" value={year} options={YEAR_OPTIONS} onSelect={setYear}/>
      {registerError ? <Text style={s.errorText}>{registerError}</Text> : null}
      <Button title="CREATE ACCOUNT" onPress={submit}/>
      <Text style={s.bottom}>Already have an account? <Text style={s.link} onPress={exitRegistration}>Login</Text></Text>
    </ScrollView>
  </KeyboardAvoidingView>
}
const s=StyleSheet.create({screen:{flex:1,backgroundColor:C.bg},content:{padding:20,paddingBottom:40},intro:{marginBottom:18},big:{color:C.text,fontSize:20,fontWeight:"800"},muted:{color:C.muted,fontSize:12,lineHeight:18,marginTop:5},bottom:{color:C.muted,textAlign:"center",fontSize:12,marginTop:16},link:{color:C.purple,fontWeight:"800"},errorText:{color:"#FF8A8A",fontSize:12,fontWeight:"600",marginBottom:10,textAlign:"center"},field:{marginBottom:14},label:{color:C.muted,fontSize:12,fontWeight:"700",marginBottom:7},select:{minHeight:50,borderRadius:12,backgroundColor:C.card,borderWidth:1,borderColor:C.border,flexDirection:"row",alignItems:"center",paddingHorizontal:14},selectText:{flex:1,color:C.text},placeholder:{color:C.muted2},modalBackdrop:{flex:1,backgroundColor:"rgba(0,0,0,0.72)",justifyContent:"center",padding:22},modal:{maxHeight:"80%",backgroundColor:C.card,borderRadius:14,borderWidth:1,borderColor:C.border,padding:16},modalTitle:{color:C.text,fontSize:18,fontWeight:"800",marginBottom:12},options:{flexGrow:0},option:{minHeight:46,justifyContent:"center",borderBottomWidth:1,borderBottomColor:C.border},optionText:{color:C.text,fontSize:14},closeButton:{alignItems:"center",paddingTop:14},closeText:{color:C.blue,fontWeight:"800"}});
