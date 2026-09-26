import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { C } from "../../components/UI";

export default function AdminTabs(){
 return <Tabs screenOptions={{headerShown:false,tabBarStyle:{backgroundColor:"#0B1828",borderTopColor:C.border,height:68,paddingBottom:8,paddingTop:5},tabBarActiveTintColor:"#4D8DFF",tabBarInactiveTintColor:C.muted2}}>
  <Tabs.Screen name="index" options={{title:"Dashboard",tabBarIcon:({color})=><Ionicons name="grid-outline" size={21} color={color}/>}}/>
  <Tabs.Screen name="post" options={{title:"Post",tabBarIcon:({color})=><Ionicons name="add-circle-outline" size={22} color={color}/>}}/>
  <Tabs.Screen name="activities" options={{title:"Activities",tabBarIcon:({color})=><Ionicons name="list-outline" size={21} color={color}/>}}/>
  <Tabs.Screen name="students" options={{title:"Students",tabBarIcon:({color})=><Ionicons name="people-outline" size={21} color={color}/>}}/>
  <Tabs.Screen name="subjects" options={{title:"Subjects",href:null}}/>
  <Tabs.Screen name="activity-form" options={{href:null}}/>
  <Tabs.Screen name="student-details" options={{href:null}}/>
 </Tabs>
}
