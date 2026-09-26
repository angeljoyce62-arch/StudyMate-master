import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
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

  if (loading) return <View style={s.loading}><ActivityIndicator color="#fff" size="large"/></View>;

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
      <View style={s.glow1}/><View style={s.glow2}/>
      <View style={s.logoBox}><Ionicons name="book-outline" size={42} color="#fff"/></View>
      <Text style={s.logo}>Study<Text style={s.blue}>Mate</Text></Text>
      <Text style={s.tag}>A mobile study planner and academic task manager</Text>

      <View style={s.switch}>
        <TouchableOpacity onPress={() => {setRole("student"); setEmail(""); setPassword("")}} style={[s.switchBtn, role==="student" && s.active]}><Text style={s.switchText}>Student</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => {setRole("admin"); setEmail(""); setPassword("")}} style={[s.switchBtn, role==="admin" && s.active]}><Text style={s.switchText}>Admin / Teacher</Text></TouchableOpacity>
      </View>

      <View style={s.input}><Ionicons name="mail-outline" size={19} color="#8FA4BE"/><TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={s.textInput} placeholder="Email Address" placeholderTextColor="#71839B"/></View>
      <View style={s.input}><Ionicons name="lock-closed-outline" size={19} color="#8FA4BE"/><TextInput value={password} onChangeText={setPassword} secureTextEntry={!showPassword} style={s.textInput} placeholder="Password" placeholderTextColor="#71839B"/><TouchableOpacity onPress={()=>setShowPassword(!showPassword)}><Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={19} color="#8FA4BE"/></TouchableOpacity></View>

      {loginError ? <Text style={s.errorText}>{loginError}</Text> : null}

      <TouchableOpacity onPress={()=>router.push("/forgot-password")}><Text style={s.forgot}>Forgot Password?</Text></TouchableOpacity>
      <TouchableOpacity onPress={submit}><LinearGradient colors={["#2C7CFF","#7D5CFF"]} style={s.loginBtn}><Text style={s.loginText}>LOGIN</Text></LinearGradient></TouchableOpacity>

      {role !== "admin" && (
        <>
          <Text style={s.registerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={()=>router.push("/register")}><Text style={s.registerLink}>Create Student Account</Text></TouchableOpacity>
        </>
      )}

     
    </View>
  );
}
const s=StyleSheet.create({
screen:{flex:1,backgroundColor:"#07111F",padding:24,justifyContent:"center",position:"relative",overflow:"hidden"},loading:{flex:1,backgroundColor:"#07111F",alignItems:"center",justifyContent:"center"},
glow1:{position:"absolute",width:420,height:420,borderRadius:210,backgroundColor:"#122B4D",opacity:0.95,top:-160,left:-140,pointerEvents:"none",zIndex:0},glow2:{position:"absolute",width:440,height:440,borderRadius:220,backgroundColor:"#371C59",opacity:0.9,bottom:-180,right:-150,pointerEvents:"none",zIndex:0},
logoBox:{alignSelf:"center",width:78,height:78,borderRadius:24,backgroundColor:"#287CFF",borderWidth:1,borderColor:"#7DA5FF",alignItems:"center",justifyContent:"center",marginBottom:13,zIndex:1},logo:{textAlign:"center",color:"#fff",fontSize:35,fontWeight:"800",zIndex:1},blue:{color:"#7EA6FF"},tag:{color:"#8FA4BE",textAlign:"center",fontSize:12,lineHeight:18,marginBottom:25,zIndex:1},
switch:{backgroundColor:"#0E1A2D",padding:4,borderRadius:14,flexDirection:"row",marginBottom:18,borderWidth:1,borderColor:"#1D3352",zIndex:1},switchBtn:{flex:1,alignItems:"center",paddingVertical:11,borderRadius:11},active:{backgroundColor:"#1D63FF"},switchText:{color:"#fff",fontWeight:"700",fontSize:12},
input:{height:52,borderRadius:14,backgroundColor:"#101E31",borderWidth:1,borderColor:"#203650",flexDirection:"row",alignItems:"center",paddingHorizontal:14,marginBottom:12,zIndex:1},textInput:{flex:1,color:"#fff",marginLeft:10},forgot:{color:"#6E91FF",textAlign:"right",fontSize:12,marginBottom:17,zIndex:1},loginBtn:{height:52,borderRadius:14,alignItems:"center",justifyContent:"center",zIndex:1},loginText:{color:"#fff",fontWeight:"800"},
registerText:{color:"#8FA4BE",textAlign:"center",marginTop:18,fontSize:12,zIndex:1},registerLink:{color:"#6E91FF",fontWeight:"800",textAlign:"center",marginTop:4,zIndex:1},errorText:{color:"#FF8A8A",fontSize:12,fontWeight:"600",marginBottom:10,textAlign:"center"},demo:{marginTop:20,padding:12,borderRadius:12,backgroundColor:"#0D192A",borderWidth:1,borderColor:"#1A2B42",zIndex:1},demoTitle:{color:"#fff",fontWeight:"800",fontSize:11,textAlign:"center"},demoText:{color:"#71839B",fontSize:10,textAlign:"center",marginTop:4}
});
