import { Ionicons } from "@expo/vector-icons";
import { memo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useTheme } from "../../theme";
import {
  POPUP_SELECT_MAX_VISIBLE_OPTIONS,
  POPUP_SELECT_OPTION_GAP,
  POPUP_SELECT_OPTION_HEIGHT,
} from "./constants";

export interface PopupSelectOption {
  readonly id: string;
  readonly label: string;
  readonly detail?: string;
}

export interface PopupSelectProps {
  readonly label?: string;
  readonly options: readonly PopupSelectOption[];
  readonly value: string;
  readonly onChange: (id: string) => void;
  readonly maxVisibleOptions?: number;
}

export const PopupSelect = memo<PopupSelectProps>(
  ({ label, options, value, onChange, maxVisibleOptions = POPUP_SELECT_MAX_VISIBLE_OPTIONS }) => {
    const { theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const selected = options.find((option) => option.id === value);
    const menuMaxHeight =
      POPUP_SELECT_OPTION_HEIGHT * maxVisibleOptions +
      POPUP_SELECT_OPTION_GAP * (maxVisibleOptions - 1);

    return (
      <View style={styles.container}>
        {label ? (
          <Text style={[styles.fieldLabel, { color: theme.colors.content.primary }]}>
            {label}
          </Text>
        ) : null}

        <View
          style={[
            styles.shell,
            {
              backgroundColor: theme.colors.background.elevated,
              borderColor: isOpen
                ? theme.colors.accent.default
                : theme.colors.stroke.strong,
              boxShadow: isOpen
                ? `0 10px 28px ${theme.colors.accent.default}22`
                : undefined,
            },
            isOpen && styles.shellOpen,
          ]}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ expanded: isOpen }}
            onPress={() => setIsOpen((open) => !open)}
            style={({ pressed }) => [
              styles.trigger,
              pressed && !isOpen && styles.triggerPressed,
            ]}
          >
            <Text style={[styles.triggerText, { color: theme.colors.content.primary }]}>
              {selected?.label ?? ""}
            </Text>
            <View
              style={[
                styles.chevronWrap,
                isOpen && { backgroundColor: theme.colors.accent.muted },
              ]}
            >
              <Ionicons
                name={isOpen ? "chevron-up" : "chevron-down"}
                size={18}
                color={isOpen ? theme.colors.accent.default : theme.colors.content.secondary}
              />
            </View>
          </Pressable>

          {isOpen ? (
            <View style={styles.menu}>
              <View
                style={[styles.divider, { backgroundColor: theme.colors.stroke.strong }]}
              />
              <ScrollView
                style={[styles.menuScroll, { maxHeight: menuMaxHeight }]}
                contentContainerStyle={styles.menuContent}
                nestedScrollEnabled
                showsVerticalScrollIndicator={options.length > maxVisibleOptions}
                keyboardShouldPersistTaps="handled"
              >
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
                      style={({ pressed }) => [
                        styles.option,
                        {
                          borderColor: isActive
                            ? theme.colors.accent.default
                            : "transparent",
                          backgroundColor: isActive
                            ? theme.colors.accent.muted
                            : pressed
                              ? theme.colors.background.muted
                              : "transparent",
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
              </ScrollView>
            </View>
          ) : null}
        </View>
      </View>
    );
  },
);

PopupSelect.displayName = "PopupSelect";

const styles = StyleSheet.create({
  container: {
    rowGap: 10,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: "700",
  },
  shell: {
    borderWidth: 1,
    borderRadius: 14,
    overflow: "hidden",
  },
  shellOpen: {
    borderRadius: 16,
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 56,
    paddingHorizontal: 14,
    columnGap: 12,
  },
  triggerPressed: {
    opacity: 0.92,
  },
  triggerText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },
  chevronWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  menu: {
    paddingBottom: 6,
  },
  divider: {
    height: 1,
    marginHorizontal: 14,
  },
  menuScroll: {},
  menuContent: {
    paddingHorizontal: 8,
    paddingTop: 6,
    rowGap: POPUP_SELECT_OPTION_GAP,
  },
  option: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
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
