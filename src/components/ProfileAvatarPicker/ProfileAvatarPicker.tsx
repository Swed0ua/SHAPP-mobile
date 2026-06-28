import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { memo } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "../../theme";

const AVATAR_SIZE = 96;

export interface ProfileAvatarPickerProps {
  readonly imageUri?: string | null;
  readonly label: string;
  readonly changeLabel: string;
  readonly onChange: (uri: string) => void;
}

export const ProfileAvatarPicker = memo<ProfileAvatarPickerProps>(
  ({ imageUri, label, changeLabel, onChange }) => {
    const { theme } = useTheme();

    const handlePick = async () => {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        onChange(result.assets[0].uri);
      }
    };

    return (
      <View style={styles.container}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={label}
          onPress={() => void handlePick()}
          style={styles.avatarOuter}
        >
          <View
            style={[
              styles.avatarClip,
              {
                borderColor: theme.colors.stroke.subtle,
                backgroundColor: theme.colors.background.muted,
              },
            ]}
          >
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.avatar} />
            ) : (
              <Ionicons
                name="person-outline"
                size={40}
                color={theme.colors.content.secondary}
              />
            )}
          </View>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: theme.colors.accent.default,
                borderColor: theme.colors.background.elevated,
              },
            ]}
          >
            <Ionicons
              name="camera-outline"
              size={16}
              color={theme.colors.accent.onAccent}
            />
          </View>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={changeLabel}
          hitSlop={8}
          onPress={() => void handlePick()}
        >
          <Text style={[styles.changeLabel, { color: theme.colors.accent.default }]}>
            {changeLabel}
          </Text>
        </Pressable>
      </View>
    );
  },
);

ProfileAvatarPicker.displayName = "ProfileAvatarPicker";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    rowGap: 10,
  },
  avatarOuter: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
  },
  avatarClip: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
  },
  badge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  changeLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
});
