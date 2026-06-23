import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { useTheme } from "../../theme";

export interface SearchInputProps {
  readonly value: string;
  readonly onChangeText: (text: string) => void;
  readonly placeholder?: string;
  readonly trailingIcon?: keyof typeof Ionicons.glyphMap;
  readonly onTrailingPress?: () => void;
  readonly trailingAccessibilityLabel?: string;
}

export const SearchInput = memo<SearchInputProps>(
  ({
    value,
    onChangeText,
    placeholder,
    trailingIcon,
    onTrailingPress,
    trailingAccessibilityLabel,
  }) => {
    const { theme } = useTheme();

    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.background.elevated,
            borderColor: theme.colors.stroke.strong,
          },
        ]}
      >
        <Ionicons
          name="search-outline"
          size={20}
          color={theme.colors.content.secondary}
        />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.content.tertiary}
          style={[styles.input, { color: theme.colors.content.primary }]}
          autoCapitalize="none"
          autoCorrect={false}
          selectionColor={theme.colors.accent.default}
        />
        {trailingIcon ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={trailingAccessibilityLabel}
            hitSlop={8}
            onPress={onTrailingPress}
            style={styles.trailingButton}
          >
            <Ionicons
              name={trailingIcon}
              size={22}
              color={theme.colors.content.secondary}
            />
          </Pressable>
        ) : null}
      </View>
    );
  },
);

SearchInput.displayName = "SearchInput";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    minHeight: 56,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  trailingButton: {
    marginLeft: 8,
    paddingVertical: 4,
  },
});
