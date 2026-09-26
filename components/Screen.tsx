import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

export default function Screen({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.screen, style]}>{children}</View>;
}
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: "#07111F" } });
