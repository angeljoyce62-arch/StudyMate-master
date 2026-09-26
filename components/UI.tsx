import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleProp, StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View, ViewStyle } from "react-native";

export const C = {
  bg: "#091426",
  card: "#101C2E",
  card2: "#14263F",
  border: "#233A5C",
  text: "#F4F7FF",
  muted: "#A8B7D1",
  muted2: "#7D8CA7",
  blue: "#2F6BFF",
  purple: "#7A5CFF",
  green: "#8AA8FF",
  yellow: "#E7B94A",
  red: "#E65B72",
};

export function Header({ title, subtitle, onBack, right }: {
  title: string; subtitle?: string; onBack?: () => void; right?: React.ReactNode
}) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {onBack ? <TouchableOpacity onPress={onBack} style={styles.back}><Ionicons name="arrow-back" size={21} color={C.text}/></TouchableOpacity> : null}
        <View><Text style={styles.headTitle}>{title}</Text>{subtitle ? <Text style={styles.headSubtitle}>{subtitle}</Text> : null}</View>
      </View>
      {right}
    </View>
  );
}

export function SearchBox({ placeholder, value, onChangeText }: { placeholder: string; value: string; onChangeText: (v: string) => void }) {
  return <View style={styles.search}><Ionicons name="search-outline" size={19} color={C.muted2}/><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={C.muted2} style={styles.searchInput}/></View>;
}

export function Field({ label, icon, ...props }: TextInputProps & { label: string; icon?: keyof typeof Ionicons.glyphMap }) {
  return <View style={{ marginBottom: 14 }}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputWrap}>{icon ? <Ionicons name={icon} size={19} color={C.muted2}/> : null}<TextInput {...props} placeholderTextColor={C.muted2} style={[styles.input, icon && { marginLeft: 9 }]} />
    </View>
  </View>
}

export function Button({ title, onPress, icon, secondary, style }: { title: string; onPress: () => void; icon?: keyof typeof Ionicons.glyphMap; secondary?: boolean; style?: StyleProp<ViewStyle> }) {
  const inner = <View style={[styles.button, secondary && styles.secondaryButton, style]}>{icon ? <Ionicons name={icon} size={18} color={C.text}/> : null}<Text style={styles.buttonText}>{title}</Text></View>;
  if (secondary) return <TouchableOpacity onPress={onPress}>{inner}</TouchableOpacity>;
  return <TouchableOpacity onPress={onPress}><LinearGradient colors={[C.blue, C.purple]} style={[styles.button, style]}>{icon ? <Ionicons name={icon} size={18} color={C.text}/> : null}<Text style={styles.buttonText}>{title}</Text></LinearGradient></TouchableOpacity>;
}

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function PriorityBadge({ priority }: { priority: "High" | "Medium" | "Low" }) {
  const bg = priority === "High" ? C.red : priority === "Medium" ? C.yellow : C.green;
  return <View style={[styles.badge, { backgroundColor: bg }]}><Text style={styles.badgeText}>{priority}</Text></View>;
}

export function EmptyState({ icon, title, message }: { icon: keyof typeof Ionicons.glyphMap; title: string; message: string }) {
  return <View style={styles.empty}><Ionicons name={icon} size={42} color={C.muted2}/><Text style={styles.emptyTitle}>{title}</Text><Text style={styles.emptyMessage}>{message}</Text></View>;
}

const styles = StyleSheet.create({
  header:{paddingTop:56,paddingBottom:18,flexDirection:"row",justifyContent:"space-between",alignItems:"center"},
  headerLeft:{flexDirection:"row",alignItems:"center",flex:1},back:{width:38,height:38,borderRadius:12,backgroundColor:C.card,alignItems:"center",justifyContent:"center",marginRight:10},
  headTitle:{color:C.text,fontSize:26,fontWeight:"800"},headSubtitle:{color:C.muted,fontSize:12,marginTop:3},search:{height:48,borderRadius:13,backgroundColor:C.card,borderWidth:1,borderColor:C.border,flexDirection:"row",alignItems:"center",paddingHorizontal:14,marginBottom:14},
  searchInput:{flex:1,color:C.text,marginLeft:9},label:{color:C.muted,fontSize:12,fontWeight:"700",marginBottom:7},inputWrap:{minHeight:50,borderRadius:13,backgroundColor:C.card,borderWidth:1,borderColor:C.border,flexDirection:"row",alignItems:"center",paddingHorizontal:14},
  input:{flex:1,color:C.text,minHeight:48},button:{minHeight:51,borderRadius:14,alignItems:"center",justifyContent:"center",flexDirection:"row",gap:8},secondaryButton:{backgroundColor:C.card,borderWidth:1,borderColor:C.border},buttonText:{color:C.text,fontWeight:"800"},card:{backgroundColor:C.card,borderWidth:1,borderColor:C.border,borderRadius:16,padding:15,boxShadow:"0px 4px 10px rgba(0,0,0,0.12)"},badge:{paddingHorizontal:8,paddingVertical:5,borderRadius:8},badgeText:{color:"#fff",fontSize:10,fontWeight:"800"},empty:{alignItems:"center",paddingVertical:45},emptyTitle:{color:C.text,fontSize:17,fontWeight:"800",marginTop:10},emptyMessage:{color:C.muted,textAlign:"center",marginTop:5,maxWidth:280,fontSize:12},
});
