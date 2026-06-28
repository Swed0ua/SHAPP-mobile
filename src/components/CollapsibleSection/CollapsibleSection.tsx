import { Ionicons } from "@expo/vector-icons";
import { memo, type ReactNode } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "../../theme";

export interface CollapsibleSectionProps {
  readonly title: string;
  readonly trailing?: string;
  readonly expanded: boolean;
  readonly onToggle: () => void;
  readonly children?: ReactNode;
}

const CORNER_RADIUS = 16;

export const CollapsibleSection = memo<CollapsibleSectionProps>(
  ({ title, trailing, expanded, onToggle, children }) => {
    const { theme } = useTheme();

    return (
      <View style={styles.clipShell}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.background.elevated,
              borderColor: theme.colors.stroke.subtle,
            },
          ]}
        >
          <View style={styles.header}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={title}
              accessibilityState={{ expanded }}
              onPress={onToggle}
              android_ripple={
                Platform.OS === "android"
                  ? { color: `${theme.colors.content.primary}14`, borderless: false }
                  : undefined
              }
              style={({ pressed }) => [
                StyleSheet.absoluteFillObject,
                pressed && styles.headerPressed,
              ]}
            />

            <Text
              style={[styles.title, { color: theme.colors.content.primary }]}
              pointerEvents="none"
            >
              {title}
            </Text>

            <View style={styles.trailing} pointerEvents="none">
              {trailing ? (
                <Text
                  style={[styles.trailingText, { color: theme.colors.accent.default }]}
                >
                  {trailing}
                </Text>
              ) : null}
              <View
                style={[
                  styles.chevronWrap,
                  expanded && { backgroundColor: theme.colors.accent.muted },
                ]}
              >
                <Ionicons
                  name={expanded ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={
                    expanded
                      ? theme.colors.accent.default
                      : theme.colors.content.secondary
                  }
                />
              </View>
            </View>
          </View>

          {expanded ? <View style={styles.body}>{children}</View> : null}
        </View>
      </View>
    );
  },
);

CollapsibleSection.displayName = "CollapsibleSection";

const styles = StyleSheet.create({
  clipShell: {
    borderRadius: CORNER_RADIUS,
    overflow: "hidden",
  },
  card: {
    borderWidth: 1,
    borderRadius: CORNER_RADIUS,
  },
  header: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  headerPressed: {
    opacity: 0.92,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
  },
  trailing: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
  trailingText: {
    fontSize: 14,
    fontWeight: "700",
  },
  chevronWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
});
