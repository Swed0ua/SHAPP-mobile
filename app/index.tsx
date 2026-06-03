import { StyleSheet, View } from "react-native";

import { ProgressRing } from "../src/components/ProgressRing";
import { useTheme } from "../src/theme";

export default function HomeScreen() {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.canvas },
      ]}
    >
      <ProgressRing value={40} target={2200} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
