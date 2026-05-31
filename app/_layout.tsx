import "../src/i18n";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppBottomNavBar } from "../src/components/AppBottomNavBar";
import { useAppShellBootstrap } from "../src/hooks/useAppShellBootstrap";

export default function RootLayout() {
  const { isAppShellReady } = useAppShellBootstrap();

  if (!isAppShellReady) {
    return (
      <SafeAreaProvider>
        <View style={styles.boot}>
          <ActivityIndicator size="large" color="#52525B" />
          <StatusBar style="auto" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <Stack
          screenOptions={{
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen name="index" options={{ title: "Home" }} />
          <Stack.Screen name="profile" options={{ title: "Profile" }} />
        </Stack>
        <AppBottomNavBar />
        <StatusBar style="auto" />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  boot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E4E4E7",
  },
});
