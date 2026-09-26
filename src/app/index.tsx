import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { C } from "../components/UI";
import { Role, useApp } from "../context/AppContext";

export default function Login() {
  const router = useRouter();
  const { currentUser, loading, login } = useApp();
  const [role, setRole] = useState<Role>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    if (!loading && currentUser) router.replace(currentUser.role === "student" ? "/(student)" : "/(admin)");
  }, [loading, currentUser]);

  if (loading) return <View style={s.loading}><ActivityIndicator color={C.blue} size="large"/></View>;

  const submit = async () => {
    setLoginError("");
    const result = await login(email, password, role);
    if (!result.ok) {
      setLoginError(result.message ?? "Incorrect email or password. Please check your credentials and try again.");
      return;
    }
  };

  return (
    <View style={s.screen}>
      <View style={s.logoBox}><Ionicons name="book-outline" size={38} color={C.text}/></View>
      <Text style={s.logo}>Study<Text style={s.blue}>Mate</Text></Text>
      <Text style={s.tag}>A mobile study planner and academic task manager</Text>

      <View style={s.switch}>
        <TouchableOpacity onPress={() => {setRole("student"); setEmail(""); setPassword("")}} style={[s.switchBtn, role==="student" && s.active]}><Text style={s.switchText}>Student</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => {setRole("admin"); setEmail(""); setPassword("")}} style={[s.switchBtn, role==="admin" && s.active]}><Text style={s.switchText}>Admin / Teacher</Text></TouchableOpacity>
      </View>

      <View style={s.input}><Ionicons name="mail-outline" size={19} color={C.muted2}/><TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={s.textInput} placeholder="Email Address" placeholderTextColor={C.muted2}/></View>
      <View style={s.input}><Ionicons name="lock-closed-outline" size={19} color={C.muted2}/><TextInput value={password} onChangeText={setPassword} secureTextEntry={!showPassword} style={s.textInput} placeholder="Password" placeholderTextColor={C.muted2}/><TouchableOpacity onPress={()=>setShowPassword(!showPassword)}><Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={19} color={C.muted2}/></TouchableOpacity></View>

      {loginError ? <Text style={s.errorText}>{loginError}</Text> : null}

      <TouchableOpacity onPress={()=>router.push("/forgot-password")}><Text style={s.forgot}>Forgot Password?</Text></TouchableOpacity>
      <TouchableOpacity onPress={submit}><LinearGradient colors={["#2C7CFF","#7D5CFF"]} style={s.loginBtn}><Text style={s.loginText}>LOGIN</Text></LinearGradient></TouchableOpacity>

      {role !== "admin" && (
        <>
          <Text style={s.registerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={()=>router.push({pathname:"/register",params:{role}})}><Text style={s.registerLink}>Create Student Account</Text></TouchableOpacity>
        </>
      )}

     
    </View>
  );
}
const s=StyleSheet.create({
screen:{flex:1,backgroundColor:"#07111F",padding:24,justifyContent:"center",position:"relative",overflow:"hidden"},loading:{flex:1,backgroundColor:"#07111F",alignItems:"center",justifyContent:"center"},
glow1:{position:"absolute",width:420,height:420,borderRadius:210,backgroundColor:"#122B4D",opacity:0.95,top:-160,left:-140,pointerEvents:"none",zIndex:0},glow2:{position:"absolute",width:440,height:440,borderRadius:220,backgroundColor:"#371C59",opacity:0.9,bottom:-180,right:-150,pointerEvents:"none",zIndex:0},
logoBox:{alignSelf:"center",width:72,height:72,borderRadius:20,backgroundColor:C.blue,borderWidth:1,borderColor:"#7DA5FF",alignItems:"center",justifyContent:"center",marginBottom:14,zIndex:1},logo:{textAlign:"center",color:C.text,fontSize:34,fontWeight:"800",zIndex:1},blue:{color:C.purple},tag:{color:C.muted,textAlign:"center",fontSize:13,lineHeight:19,marginBottom:25,zIndex:1},
switch:{backgroundColor:C.card2,padding:4,borderRadius:12,borderWidth:1,borderColor:C.border,flexDirection:"row",marginBottom:18,zIndex:1},switchBtn:{flex:1,alignItems:"center",paddingVertical:11,borderRadius:9},active:{backgroundColor:C.blue},switchText:{color:C.text,fontWeight:"700",fontSize:12},
input:{height:52,borderRadius:12,backgroundColor:C.card,borderWidth:1,borderColor:C.border,flexDirection:"row",alignItems:"center",paddingHorizontal:14,marginBottom:12,zIndex:1},textInput:{flex:1,color:C.text,marginLeft:10},forgot:{color:C.purple,textAlign:"right",fontSize:12,marginBottom:17,zIndex:1},loginBtn:{height:52,borderRadius:12,alignItems:"center",justifyContent:"center",zIndex:1},loginText:{color:C.text,fontWeight:"800"},
registerText:{color:C.muted,textAlign:"center",marginTop:18,fontSize:12,zIndex:1},registerLink:{color:C.purple,fontWeight:"800",textAlign:"center",marginTop:4,zIndex:1},errorText:{color:"#FF8A8A",fontSize:12,fontWeight:"600",marginBottom:10,textAlign:"center"},demo:{marginTop:20,padding:12,borderRadius:12,backgroundColor:C.card2,borderWidth:1,borderColor:C.border,zIndex:1},demoTitle:{color:C.text,fontWeight:"800",fontSize:11,textAlign:"center"},demoText:{color:C.muted2,fontSize:10,textAlign:"center",marginTop:4}
});
