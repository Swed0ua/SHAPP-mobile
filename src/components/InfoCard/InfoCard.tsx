import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "../../theme";
import { MediaThumbnail } from "../MediaThumbnail";

export interface InfoCardProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly highlight?: string;
  readonly highlightDetail?: string;
  readonly footer?: string;
  readonly imageUri?: string;
  readonly onPress?: () => void;
}

export const InfoCard = memo<InfoCardProps>(
  ({
    title,
    subtitle,
    highlight,
    highlightDetail,
    footer,
    imageUri,
    onPress,
  }) => {
    const { theme } = useTheme();

    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.background.elevated,
            borderColor: theme.colors.stroke.subtle,
          },
        ]}
      >
        <MediaThumbnail uri={imageUri} />

        <View style={styles.body}>
          <View style={styles.header}>
            <View style={styles.titleWrap}>
              <Text style={[styles.title, { color: theme.colors.content.primary }]}>
                {title}
              </Text>
              {subtitle ? (
                <Text
                  style={[styles.subtitle, { color: theme.colors.content.secondary }]}
                >
                  {subtitle}
                </Text>
              ) : null}
            </View>
            {highlight ? (
              <View style={styles.highlightWrap}>
                <Text style={[styles.highlight, { color: theme.colors.accent.default }]}>
                  {highlight}
                </Text>
                {highlightDetail ? (
                  <Text
                    style={[
                      styles.metaText,
                      { color: theme.colors.content.secondary },
                    ]}
                  >
                    {highlightDetail}
                  </Text>
                ) : null}
              </View>
            ) : null}
          </View>

          {footer ? (
            <Text
              style={[
                styles.footer,
                styles.metaText,
                { color: theme.colors.content.secondary },
              ]}
            >
              {footer}
            </Text>
          ) : null}
        </View>
      </Pressable>
    );
  },
);

InfoCard.displayName = "InfoCard";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  body: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    columnGap: 12,
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "500",
  },
  highlight: {
    fontSize: 14,
    fontWeight: "700",
  },
  highlightWrap: {
    alignItems: "flex-end",
  },
  metaText: {
    fontSize: 12,
    fontWeight: "500",
  },
  footer: {
    marginTop: 10,
    textAlign: "right",
  },
});
