import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, C, Field, Header } from "../components/UI";
import { useApp } from "../context/AppContext";

export default function Register() {
  const router=useRouter(); const {register}=useApp();
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [studentId,setStudentId]=useState(""); const [course,setCourse]=useState(""); const [year,setYear]=useState(""); const [registerError,setRegisterError]=useState("");

  useEffect(() => {
    if (router) {
      const params = (router as any).params ?? {};
      if (params.role === "admin") {
        Alert.alert("Access denied", "Admin accounts cannot be created from this screen.");
        router.replace("/");
      }
    }
  }, [router]);

  const submit=async()=>{ setRegisterError(""); if(!name.trim()){ setRegisterError("Please enter your full name."); return; } if(!email.trim()){ setRegisterError("Please enter your email address."); return; } if(password.length<6){ setRegisterError("Password must be at least 6 characters."); return; } if(!course.trim()||!year.trim()){ setRegisterError("Please select your course and year level."); return; } const r=await register(name,email,password,studentId,course,year); if(!r.ok){ setRegisterError(r.message ?? "Unable to create account right now."); return; } router.replace("/(student)");};
  return <ScrollView style={s.screen} contentContainerStyle={s.content}><Header title="Create Account" subtitle="Student registration" onBack={()=>router.back()}/><View style={s.intro}><Text style={s.big}>Welcome to StudyMate</Text><Text style={s.muted}>Create your student account to manage activities, notes and study sessions.</Text></View>
  <Field label="Full Name" icon="person-outline" value={name} onChangeText={setName} placeholder="Your full name"/>
  <Field label="Email" icon="mail-outline" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com"/>
  <Field label="Password" icon="lock-closed-outline" value={password} onChangeText={setPassword} secureTextEntry placeholder="Minimum 6 characters"/>
  <Field label="Student ID" icon="id-card-outline" value={studentId} onChangeText={setStudentId} placeholder="2026-0001"/>
  <Field label="Course" icon="school-outline" value={course} onChangeText={setCourse} placeholder="BS Information Technology"/>
  <Field label="Year Level" icon="calendar-outline" value={year} onChangeText={setYear} placeholder="3rd Year"/>
  {registerError ? <Text style={s.errorText}>{registerError}</Text> : null}
  <Button title="CREATE ACCOUNT" onPress={submit} /><Text style={s.bottom}>Already have an account? <Text style={s.link} onPress={()=>router.back()}>Login</Text></Text>
  </ScrollView>
}
const s=StyleSheet.create({screen:{flex:1,backgroundColor:C.bg},content:{padding:20,paddingBottom:40},intro:{marginBottom:18},big:{color:C.text,fontSize:20,fontWeight:"800"},muted:{color:C.muted,fontSize:12,lineHeight:18,marginTop:5},bottom:{color:C.muted,textAlign:"center",fontSize:12,marginTop:16},link:{color:"#6E91FF",fontWeight:"800"},errorText:{color:"#FF8A8A",fontSize:12,fontWeight:"600",marginBottom:10,textAlign:"center"}});
