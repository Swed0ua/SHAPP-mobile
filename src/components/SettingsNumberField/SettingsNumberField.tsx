import { memo } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { useTheme } from "../../theme";

export interface SettingsNumberFieldProps {
  readonly label: string;
  readonly value: string;
  readonly placeholder?: string;
  readonly unit?: string;
  readonly onChangeText: (text: string) => void;
  readonly onBlur?: () => void;
}

export const SettingsNumberField = memo<SettingsNumberFieldProps>(
  ({ label, value, placeholder, unit, onChangeText, onBlur }) => {
    const { theme } = useTheme();

    return (
      <View style={styles.container}>
        <Text style={[styles.label, { color: theme.colors.content.secondary }]}>
          {label}
        </Text>
        <View
          style={[
            styles.inputShell,
            {
              backgroundColor: theme.colors.background.muted,
              borderColor: theme.colors.stroke.strong,
            },
          ]}
        >
          <TextInput
            value={value}
            onChangeText={onChangeText}
            onBlur={onBlur}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.content.tertiary}
            keyboardType="decimal-pad"
            style={[styles.input, { color: theme.colors.content.primary }]}
            selectionColor={theme.colors.accent.default}
          />
          {unit ? (
            <Text style={[styles.unit, { color: theme.colors.content.secondary }]}>
              {unit}
            </Text>
          ) : null}
        </View>
      </View>
    );
  },
);

SettingsNumberField.displayName = "SettingsNumberField";

const styles = StyleSheet.create({
  container: {
    rowGap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
  },
  inputShell: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  unit: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
  },
});
