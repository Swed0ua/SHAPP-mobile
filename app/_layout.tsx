import "../src/i18n";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { useAppShellBootstrap } from "../src/hooks/useAppShellBootstrap";

export default function RootLayout() {
  const { isAppShellReady } = useAppShellBootstrap();

  if (!isAppShellReady) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator size="large" color="#52525B" />
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: "Home" }}
        />
        <Stack.Screen
          name="profile"
          options={{ title: "Profile" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E4E4E7",
  },
});
