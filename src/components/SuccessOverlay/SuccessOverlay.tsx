import { BlurView } from "expo-blur";
import LottieView from "lottie-react-native";
import { memo, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "../../theme";

const successAnimation = require("../../../assets/animations/success.json");

const ENTER_MS = 160;
const EXIT_MS = 200;
const VISIBLE_MS = 820;
const LOTTIE_SIZE = 168;
const LOTTIE_SPEED = 4.5;

export interface SuccessOverlayProps {
  readonly onComplete: () => void;
}

export const SuccessOverlay = memo<SuccessOverlayProps>(({ onComplete }) => {
  const { theme } = useTheme();
  const { t } = useTranslation("common");
  const lottieRef = useRef<LottieView>(null);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.88);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: ENTER_MS,
      easing: Easing.out(Easing.cubic),
    });
    scale.value = withTiming(1, {
      duration: ENTER_MS,
      easing: Easing.out(Easing.cubic),
    });
    backdropOpacity.value = withTiming(1, {
      duration: ENTER_MS,
      easing: Easing.out(Easing.cubic),
    });

    lottieRef.current?.reset();
    lottieRef.current?.play();

    const timer = setTimeout(() => {
      opacity.value = withTiming(0, {
        duration: EXIT_MS,
        easing: Easing.in(Easing.cubic),
      });
      scale.value = withTiming(0.94, {
        duration: EXIT_MS,
        easing: Easing.in(Easing.cubic),
      });
      backdropOpacity.value = withTiming(
        0,
        { duration: EXIT_MS, easing: Easing.in(Easing.cubic) },
        (finished) => {
          if (finished) {
            runOnJS(onComplete)();
          }
        },
      );
    }, VISIBLE_MS);

    return () => clearTimeout(timer);
  }, [backdropOpacity, onComplete, opacity, scale]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const scrimColor =
    theme.mode === "dark" ? "rgba(11, 15, 20, 0.62)" : "rgba(11, 15, 20, 0.38)";

  return (
    <View
      style={styles.root}
      pointerEvents="auto"
      accessibilityLiveRegion="polite"
      accessibilityLabel={t("successOverlay.label")}
    >
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        {Platform.OS === "web" ? (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: scrimColor }]} />
        ) : (
          <>
            <BlurView
              intensity={theme.mode === "dark" ? 28 : 18}
              tint={theme.mode === "dark" ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
            <View style={[StyleSheet.absoluteFill, { backgroundColor: scrimColor }]} />
          </>
        )}
      </Animated.View>

      <Animated.View style={[styles.center, cardStyle]}>
        <View
          style={[
            styles.glowRing,
            {
              borderColor: `${theme.colors.accent.default}55`,
              boxShadow: `0 0 48px ${theme.colors.accent.default}44`,
            },
          ]}
        />
        <View
          style={[
            styles.lottieShell,
            {
              backgroundColor: theme.colors.background.elevated,
              borderColor: theme.colors.stroke.subtle,
            },
          ]}
        >
          <LottieView
            ref={lottieRef}
            source={successAnimation}
            autoPlay={false}
            loop={false}
            speed={LOTTIE_SPEED}
            style={styles.lottie}
          />
        </View>
      </Animated.View>
    </View>
  );
});

SuccessOverlay.displayName = "SuccessOverlay";

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: 9999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  glowRing: {
    position: "absolute",
    width: LOTTIE_SIZE + 56,
    height: LOTTIE_SIZE + 56,
    borderRadius: (LOTTIE_SIZE + 56) / 2,
    borderWidth: 1,
  },
  lottieShell: {
    width: LOTTIE_SIZE + 24,
    height: LOTTIE_SIZE + 24,
    borderRadius: (LOTTIE_SIZE + 24) / 2,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  lottie: {
    width: LOTTIE_SIZE,
    height: LOTTIE_SIZE,
  },
});
