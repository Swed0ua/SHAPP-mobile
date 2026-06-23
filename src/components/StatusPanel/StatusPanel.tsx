import { memo } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { useTheme } from "../../theme";

export interface StatusPanelProps {
  readonly message: string;
  readonly isLoading?: boolean;
}

export const StatusPanel = memo<StatusPanelProps>(({ message, isLoading }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator color={theme.colors.accent.default} />
      ) : null}
      <Text style={[styles.message, { color: theme.colors.content.secondary }]}>
        {message}
      </Text>
    </View>
  );
});

StatusPanel.displayName = "StatusPanel";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 220,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    rowGap: 12,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
});
