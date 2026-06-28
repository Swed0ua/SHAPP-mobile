import { useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getBottomNavOverlayHeight } from "../components/BottomNavBar";
import { useTheme } from "../theme";

export function useBottomNavContentInset(extra = 0): number {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  return useMemo(
    () =>
      getBottomNavOverlayHeight(insets.bottom, theme.spacing.sm) + extra,
    [extra, insets.bottom, theme.spacing.sm],
  );
}
