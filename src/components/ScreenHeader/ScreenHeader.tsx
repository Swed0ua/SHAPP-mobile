import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "../../theme";

export interface ScreenHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly onBack: () => void;
  readonly backAccessibilityLabel?: string;
}

export const ScreenHeader = memo<ScreenHeaderProps>(
  ({ title, subtitle, onBack, backAccessibilityLabel }) => {
    const { theme } = useTheme();

    return (
      <View style={styles.container}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={backAccessibilityLabel}
          hitSlop={8}
          onPress={onBack}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.colors.content.primary}
          />
        </Pressable>
        <View style={styles.text}>
          <Text style={[styles.title, { color: theme.colors.content.primary }]}>
            {title}
          </Text>
          {subtitle ? (
            <Text
              style={[styles.subtitle, { color: theme.colors.content.secondary }]}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
    );
  },
);

ScreenHeader.displayName = "ScreenHeader";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 24,
  },
  text: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "500",
  },
});
