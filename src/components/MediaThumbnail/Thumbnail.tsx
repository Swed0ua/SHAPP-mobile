import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { Image, StyleSheet, View } from "react-native";

import { useTheme } from "../../theme";

import { MEDIA_THUMBNAIL_SIZE } from "./constants";

export interface MediaThumbnailProps {
  readonly uri?: string;
  readonly size?: number;
}

export const MediaThumbnail = memo<MediaThumbnailProps>(
  ({ uri, size = MEDIA_THUMBNAIL_SIZE }) => {
    const { theme } = useTheme();

    const frameStyle = {
      width: size,
      height: size,
      borderRadius: size * 0.18,
      borderColor: theme.colors.stroke.subtle,
      backgroundColor: theme.colors.background.muted,
    };

    if (uri) {
      return (
        <Image
          source={{ uri }}
          style={[styles.image, frameStyle]}
          resizeMode="cover"
        />
      );
    }

    return (
      <View style={[styles.placeholder, frameStyle]}>
        <View
          style={[
            styles.iconWrap,
            {
              backgroundColor: theme.colors.accent.muted,
              borderColor: theme.colors.stroke.subtle,
            },
          ]}
        >
          <Ionicons
            name="nutrition-outline"
            size={size * 0.34}
            color={theme.colors.accent.default}
          />
        </View>
      </View>
    );
  },
);

MediaThumbnail.displayName = "MediaThumbnail";

const styles = StyleSheet.create({
  image: {
    borderWidth: 1,
  },
  placeholder: {
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  iconWrap: {
    width: "72%",
    height: "72%",
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
