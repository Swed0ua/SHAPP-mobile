import { memo, type ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "../../theme";

export interface SettingsSectionProps {
  readonly title: string;
  readonly children: ReactNode;
}

export const SettingsSection = memo<SettingsSectionProps>(({ title, children }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.content.primary }]}>
        {title}
      </Text>
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.background.elevated,
            borderColor: theme.colors.stroke.subtle,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
});

SettingsSection.displayName = "SettingsSection";

const styles = StyleSheet.create({
  container: {
    rowGap: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    rowGap: 14,
  },
});
