import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "../../theme";
import { MediaThumbnail } from "../MediaThumbnail";

export interface ItemPreviewProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly imageUri?: string;
}

export const ItemPreview = memo<ItemPreviewProps>(({ title, subtitle, imageUri }) => {
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
      <MediaThumbnail uri={imageUri} />
      <View style={styles.text}>
        <Text style={[styles.title, { color: theme.colors.content.primary }]}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: theme.colors.content.secondary }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
});

ItemPreview.displayName = "ItemPreview";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  text: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "500",
  },
});
