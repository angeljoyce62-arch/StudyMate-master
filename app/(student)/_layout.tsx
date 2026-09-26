import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { C } from "../../components/UI";

export default function StudentTabs() {
 return <Tabs screenOptions={{headerShown:false,tabBarStyle:{backgroundColor:"#0B1828",borderTopColor:C.border,height:68,paddingBottom:8,paddingTop:5},tabBarActiveTintColor:"#4D8DFF",tabBarInactiveTintColor:C.muted2}}>
  <Tabs.Screen name="index" options={{title:"Home",tabBarIcon:({color})=><Ionicons name="home-outline" size={21} color={color}/>}}/>
  <Tabs.Screen name="subjects" options={{title:"Subjects",tabBarIcon:({color})=><Ionicons name="book-outline" size={21} color={color}/>}}/>
  <Tabs.Screen name="tasks" options={{title:"Tasks",tabBarIcon:({color})=><Ionicons name="checkbox-outline" size={21} color={color}/>}}/>
  <Tabs.Screen name="planner" options={{title:"Planner",tabBarIcon:({color})=><Ionicons name="calendar-outline" size={21} color={color}/>}}/>
  <Tabs.Screen name="profile" options={{title:"Profile",tabBarIcon:({color})=><Ionicons name="person-outline" size={21} color={color}/>}}/>
  <Tabs.Screen name="notes" options={{href:null}}/><Tabs.Screen name="notifications" options={{href:null}}/><Tabs.Screen name="activity-details" options={{href:null}}/><Tabs.Screen name="subject-form" options={{href:null}}/><Tabs.Screen name="task-form" options={{href:null}}/><Tabs.Screen name="note-form" options={{href:null}}/><Tabs.Screen name="session-form" options={{href:null}}/>
 </Tabs>
}
