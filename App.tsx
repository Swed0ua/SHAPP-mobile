import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";

import { useLocaleStore } from "./src/store";

export default function App() {
  const { t } = useTranslation("common");
  const locale = useLocaleStore((s) => s.locale);
  const isInitialLocaleResolved = useLocaleStore(
    (s) => s.isInitialLocaleResolved,
  );
  const resolveInitialLocale = useLocaleStore((s) => s.resolveInitialLocale);
  const setLocale = useLocaleStore((s) => s.setLocale);

  useEffect(() => {
    void resolveInitialLocale();
  }, [resolveInitialLocale]);

  if (!isInitialLocaleResolved) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator size="large" />
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("app.title")}</Text>
      <Text style={styles.sub}>{t("app.subtitle")}</Text>

      <View style={styles.row}>
        <Pressable
          style={[styles.chip, locale === "en" && styles.chipActive]}
          onPress={() => void setLocale("en")}
        >
          <Text>{t("language.en")}</Text>
        </Pressable>
        <Pressable
          style={[styles.chip, locale === "uk" && styles.chipActive]}
          onPress={() => void setLocale("uk")}
        >
          <Text>{t("language.uk")}</Text>
        </Pressable>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 8 },
  sub: { marginBottom: 20, opacity: 0.8 },
  row: { flexDirection: "row", gap: 12 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  chipActive: { borderColor: "#111", backgroundColor: "#f0f0f0" },
});
