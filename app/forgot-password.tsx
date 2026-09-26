import { Alert, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, C, Field, Header } from "../components/UI";
import { useApp } from "../context/AppContext";

export default function ForgotPassword() {
 const router=useRouter(); const {resetPassword}=useApp(); const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
 const submit=async()=>{if(password.length<6)return Alert.alert("Password","Use at least 6 characters."); const r=await resetPassword(email,password); if(!r.ok)return Alert.alert("Reset Failed",r.message); Alert.alert("Success","Password updated locally.",[{text:"Back to Login",onPress:()=>router.replace("/")}]);};
 return <View style={s.screen}><Header title="Reset Password" subtitle="Local prototype reset" onBack={()=>router.back()}/><View style={s.card}><Text style={s.title}>Forgot your password?</Text><Text style={s.muted}>Enter a registered email and create a new password.</Text><Field label="Email" icon="mail-outline" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com"/><Field label="New Password" icon="lock-closed-outline" value={password} onChangeText={setPassword} secureTextEntry placeholder="New password"/><Button title="RESET PASSWORD" onPress={submit}/></View></View>
}
const s=StyleSheet.create({screen:{flex:1,backgroundColor:C.bg,padding:20},card:{backgroundColor:C.card,borderWidth:1,borderColor:C.border,borderRadius:18,padding:18,marginTop:20},title:{color:C.text,fontSize:21,fontWeight:"800"},muted:{color:C.muted,fontSize:12,lineHeight:18,marginTop:6,marginBottom:18}});
