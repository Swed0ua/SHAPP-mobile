import { memo, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { GlowRing } from "../GlowRing";
import { useTheme } from "../../theme";

const RING_SIZE = 56;
const RING_RADIUS = 22;
const LETTER_MS = 950;
const LOADER_ARC = 0.22;
const SPIN_MS = 1100;

const MACROS = ["P", "F", "C"] as const;

export const FoodChatProcessing = memo(() => {
  const { theme } = useTheme();
  const [macroIndex, setMacroIndex] = useState(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: SPIN_MS, easing: Easing.linear }),
      -1,
      false,
    );

    return () => {
      cancelAnimation(rotation);
    };
  }, [rotation]);

  useEffect(() => {
    const timer = setInterval(() => {
      setMacroIndex((current) => (current + 1) % MACROS.length);
    }, LETTER_MS);

    return () => clearInterval(timer);
  }, []);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.background.elevated,
            borderColor: theme.colors.stroke.subtle,
          },
        ]}
      >
        <View style={styles.ringShell}>
          <Animated.View style={[styles.ringSpin, spinStyle]}>
            <GlowRing
              size={RING_SIZE}
              radius={RING_RADIUS}
              progress={LOADER_ARC}
              color={theme.colors.accent.default}
              trackColor={theme.colors.background.muted}
              progressStrokeWidth={4}
              trackStrokeWidth={3}
              startAngle={-90}
              ticks={{ count: 28, length: 2 }}
              glow={{
                dotSize: 4,
                dotCount: 24,
                blur: 10,
                spread: 4,
                opacityHex: "55",
              }}
            />
          </Animated.View>

          <View style={styles.ringCenter} pointerEvents="none">
            <Text style={[styles.macroText, { color: theme.colors.accent.default }]}>
              {MACROS[macroIndex]}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
});

FoodChatProcessing.displayName = "FoodChatProcessing";

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  ringShell: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  ringSpin: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  ringCenter: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  macroText: {
    fontSize: 14,
    fontWeight: "800",
  },
});
