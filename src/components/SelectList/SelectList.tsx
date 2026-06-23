import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "../../theme";

export interface SelectOption {
  readonly id: string;
  readonly label: string;
  readonly detail?: string;
}

export interface SelectListProps {
  readonly options: readonly SelectOption[];
  readonly value: string;
  readonly onChange: (id: string) => void;
}

export const SelectList = memo<SelectListProps>(({ options, value, onChange }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.list}>
      {options.map((option) => {
        const isActive = value === option.id;

        return (
          <Pressable
            key={option.id}
            accessibilityRole="button"
            onPress={() => onChange(option.id)}
            style={[
              styles.row,
              {
                borderColor: isActive
                  ? theme.colors.accent.default
                  : theme.colors.stroke.strong,
                backgroundColor: isActive
                  ? theme.colors.accent.muted
                  : theme.colors.background.elevated,
              },
            ]}
          >
            <View style={styles.text}>
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
              {option.detail ? (
                <Text
                  style={[styles.detail, { color: theme.colors.content.secondary }]}
                >
                  {option.detail}
                </Text>
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
});

SelectList.displayName = "SelectList";

const styles = StyleSheet.create({
  list: {
    rowGap: 8,
  },
  row: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  text: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
  },
  detail: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "500",
  },
});
