import { memo } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from "react-native";

import { useTheme } from "../../theme";

export interface SettingsTextFieldProps {
  readonly label: string;
  readonly value: string;
  readonly placeholder?: string;
  readonly onChangeText: (text: string) => void;
  readonly onBlur?: () => void;
  readonly keyboardType?: TextInputProps["keyboardType"];
  readonly autoCapitalize?: TextInputProps["autoCapitalize"];
  readonly autoCorrect?: boolean;
}

export const SettingsTextField = memo<SettingsTextFieldProps>(
  ({
    label,
    value,
    placeholder,
    onChangeText,
    onBlur,
    keyboardType,
    autoCapitalize,
    autoCorrect,
  }) => {
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
            style={[styles.input, { color: theme.colors.content.primary }]}
            selectionColor={theme.colors.accent.default}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
          />
        </View>
      </View>
    );
  },
);

SettingsTextField.displayName = "SettingsTextField";

const styles = StyleSheet.create({
  container: {
    rowGap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
  },
  inputShell: {
    borderWidth: 1,
    borderRadius: 12,
    minHeight: 48,
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  input: {
    fontSize: 16,
    fontWeight: "500",
  },
});
