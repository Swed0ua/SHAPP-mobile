import { memo } from "react";
import { FlatList, Pressable, StyleSheet, Text } from "react-native";

import { useTheme } from "../../theme";

export interface ChipOption {
  readonly id: string;
  readonly label: string;
  readonly subtitle?: string;
}

export interface ChipSelectProps {
  readonly options: readonly ChipOption[];
  readonly value: string;
  readonly onChange: (id: string) => void;
}

export const ChipSelect = memo<ChipSelectProps>(({ options, value, onChange }) => {
  const { theme } = useTheme();

  return (
    <FlatList
      data={[...options]}
      horizontal
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => {
        const isActive = value === item.id;

        return (
          <Pressable
            accessibilityRole="button"
            onPress={() => onChange(item.id)}
            style={[
              styles.chip,
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
                styles.label,
                {
                  color: isActive
                    ? theme.colors.accent.default
                    : theme.colors.content.primary,
                },
              ]}
            >
              {item.label}
            </Text>
            {item.subtitle ? (
              <Text
                style={[styles.subtitle, { color: theme.colors.content.secondary }]}
              >
                {item.subtitle}
              </Text>
            ) : null}
          </Pressable>
        );
      }}
    />
  );
});

ChipSelect.displayName = "ChipSelect";

const styles = StyleSheet.create({
  listContent: {
    columnGap: 10,
  },
  chip: {
    minWidth: 92,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: "500",
  },
});
