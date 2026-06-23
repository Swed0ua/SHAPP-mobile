import { Ionicons } from "@expo/vector-icons";
import { memo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "../../theme";

export interface DropdownOption {
  readonly id: string;
  readonly label: string;
  readonly detail?: string;
}

export interface SelectDropdownProps {
  readonly label?: string;
  readonly options: readonly DropdownOption[];
  readonly value: string;
  readonly onChange: (id: string) => void;
}

export const SelectDropdown = memo<SelectDropdownProps>(
  ({ label, options, value, onChange }) => {
    const { theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const selected = options.find((option) => option.id === value);

    return (
      <View style={styles.container}>
        {label ? (
          <Text style={[styles.label, { color: theme.colors.content.primary }]}>
            {label}
          </Text>
        ) : null}

        <Pressable
          accessibilityRole="button"
          onPress={() => setIsOpen((open) => !open)}
          style={[
            styles.trigger,
            {
              backgroundColor: theme.colors.background.elevated,
              borderColor: theme.colors.stroke.strong,
            },
          ]}
        >
          <Text style={[styles.triggerText, { color: theme.colors.content.primary }]}>
            {selected?.label ?? ""}
          </Text>
          <Ionicons
            name={isOpen ? "chevron-up" : "chevron-down"}
            size={20}
            color={theme.colors.content.secondary}
          />
        </Pressable>

        {isOpen ? (
          <View style={styles.menu}>
            {options.map((option) => {
              const isActive = option.id === value;

              return (
                <Pressable
                  key={option.id}
                  accessibilityRole="button"
                  onPress={() => {
                    onChange(option.id);
                    setIsOpen(false);
                  }}
                  style={[
                    styles.option,
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
                  <Text
                    style={[
                      styles.optionLabel,
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
                      style={[
                        styles.optionDetail,
                        { color: theme.colors.content.secondary },
                      ]}
                    >
                      {option.detail}
                    </Text>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        ) : null}
      </View>
    );
  },
);

SelectDropdown.displayName = "SelectDropdown";

const styles = StyleSheet.create({
  container: {
    rowGap: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 14,
    minHeight: 56,
    paddingHorizontal: 14,
  },
  triggerText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },
  menu: {
    rowGap: 8,
  },
  option: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  optionDetail: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "500",
  },
});
