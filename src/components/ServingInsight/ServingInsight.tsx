import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "../../theme";

export type ServingInsightHighlight = {
  readonly label: string;
  readonly value: string;
};

export interface ServingInsightProps {
  readonly badge?: string;
  readonly title?: string;
  readonly body?: string;
  readonly detail?: string;
  readonly meta?: string;
  readonly highlights?: readonly ServingInsightHighlight[];
}

export const ServingInsight = memo<ServingInsightProps>(
  ({ badge, title, body, detail, meta, highlights }) => {
    const { theme } = useTheme();

    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.background.elevated,
            borderColor: theme.colors.stroke.subtle,
          },
        ]}
      >
        <View
          style={[styles.accentBar, { backgroundColor: theme.colors.accent.default }]}
        />

        <View style={styles.content}>
          {badge ? (
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: theme.colors.accent.muted,
                  borderColor: theme.colors.stroke.subtle,
                },
              ]}
            >
              <Text style={[styles.badgeText, { color: theme.colors.accent.default }]}>
                {badge}
              </Text>
            </View>
          ) : null}

          {title ? (
            <Text style={[styles.title, { color: theme.colors.content.primary }]}>
              {title}
            </Text>
          ) : null}

          {body ? (
            <Text style={[styles.body, { color: theme.colors.content.primary }]}>
              {body}
            </Text>
          ) : null}

          {detail ? (
            <Text style={[styles.detail, { color: theme.colors.accent.default }]}>
              {detail}
            </Text>
          ) : null}

          {meta ? (
            <Text style={[styles.meta, { color: theme.colors.content.secondary }]}>
              {meta}
            </Text>
          ) : null}

          {highlights && highlights.length > 0 ? (
            <View style={styles.highlights}>
              {highlights.map((item) => (
                <View
                  key={item.label}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: theme.colors.background.muted,
                      borderColor: theme.colors.stroke.subtle,
                    },
                  ]}
                >
                  <Text
                    style={[styles.chipLabel, { color: theme.colors.content.secondary }]}
                  >
                    {item.label}
                  </Text>
                  <Text
                    style={[styles.chipValue, { color: theme.colors.content.primary }]}
                  >
                    {item.value}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}

        </View>
      </View>
    );
  },
);

ServingInsight.displayName = "ServingInsight";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  accentBar: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: 14,
    rowGap: 8,
  },
  badge: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  },
  detail: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
  },
  meta: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "500",
  },
  highlights: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minWidth: 72,
  },
  chipLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  chipValue: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: "700",
  },
});
