import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "../../theme";

export interface OptionSelectItem {
  readonly id: string;
  readonly label: string;
}

export interface OptionSelectProps {
  readonly options: readonly OptionSelectItem[];
  readonly value: string;
  readonly onChange: (id: string) => void;
}

export const OptionSelect = memo<OptionSelectProps>(
  ({ options, value, onChange }) => {
    const { theme } = useTheme();

    return (
      <View style={styles.row}>
        {options.map((option) => {
          const isActive = option.id === value;

          return (
            <Pressable
              key={option.id}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              onPress={() => onChange(option.id)}
              style={[
                styles.chip,
                {
                  borderColor: isActive
                    ? theme.colors.accent.default
                    : theme.colors.stroke.strong,
                  backgroundColor: isActive
                    ? theme.colors.accent.muted
                    : theme.colors.background.muted,
                },
              ]}
            >
              <Text
                style={[
                  styles.label,
                  {
                    color: isActive
                      ? theme.colors.accent.default
                      : theme.colors.content.primary,
                  },
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    );
  },
);

OptionSelect.displayName = "OptionSelect";

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
});
