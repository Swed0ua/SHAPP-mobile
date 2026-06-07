import "../src/i18n";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";

import { AppBottomNavBar } from "../src/components/AppBottomNavBar";
import { useAppShellBootstrap } from "../src/hooks/useAppShellBootstrap";
import { useTheme } from "../src/theme";

export default function RootLayout() {
  const { isAppShellReady } = useAppShellBootstrap();
  const { theme } = useTheme();
  const {top: topInsets} = useSafeAreaInsets();

  if (!isAppShellReady) {
    return (
      <SafeAreaProvider>
        <View
          style={[
            styles.boot,
            { backgroundColor: theme.colors.background.canvas },
          ]}
        >
          <ActivityIndicator
            size="large"
            color={theme.colors.content.secondary}
          />
          <StatusBar style={theme.mode === "dark" ? "light" : "dark"} />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View
        style={[styles.root, { backgroundColor: theme.colors.background.canvas }]}
      >
        <Stack
          screenOptions={{
            headerShown: false,
            headerShadowVisible: false,
            contentStyle: {
              backgroundColor: theme.colors.background.canvas,
              paddingTop: topInsets
            },
            headerStyle: {
              backgroundColor: theme.colors.background.canvas,
            },
            headerTintColor: theme.colors.content.primary,
            navigationBarColor: theme.colors.background.canvas,
          }}
        >
          <Stack.Screen name="index" options={{ title: "Home" }} />
          <Stack.Screen name="profile" options={{ title: "Profile" }} />
        </Stack>
        <AppBottomNavBar />
        <StatusBar style={theme.mode === "dark" ? "light" : "dark"} />
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
  },
});
