import { memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "../../theme";
import { NotchedRect } from "../NotchedRect/NotchedRect";
import { CenterActionButton } from "./CenterActionButton";
import {
  BAR_CORNER_RADIUS,
  BAR_HEIGHT,
  CENTER_SLOT_WIDTH,
  FAB_OVERLAP,
  NOTCH_DEPTH,
  NOTCH_WIDTH,
} from "./constants";
import { TabButton } from "./TabButton";
import type { BottomNavBarProps, BottomNavTab } from "./types";

interface SplitTabs {
  readonly leftTabs: readonly BottomNavTab[];
  readonly rightTabs: readonly BottomNavTab[];
}

export const BottomNavBar = memo<BottomNavBarProps>(
  ({ tabs, centerAction }) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    const { leftTabs, rightTabs } = useMemo<SplitTabs>(() => {
      if (!centerAction) {
        return { leftTabs: tabs, rightTabs: [] };
      }
      const middle = Math.ceil(tabs.length / 2);
      return {
        leftTabs: tabs.slice(0, middle),
        rightTabs: tabs.slice(middle),
      };
    }, [tabs, centerAction]);

    return (
      <View
        pointerEvents="box-none"
        style={[
          styles.wrapper,
          {
            paddingTop: FAB_OVERLAP,
            paddingBottom: Math.max(insets.bottom, theme.spacing.sm),
            paddingHorizontal: theme.spacing.lg,
          },
        ]}
      >
        <View pointerEvents="box-none" style={styles.barContainer}>
          <View style={styles.bar}>
            <View pointerEvents="none" style={StyleSheet.absoluteFill}>
              <NotchedRect
                height={BAR_HEIGHT}
                notchWidth={centerAction ? NOTCH_WIDTH : 0}
                notchDepth={centerAction ? NOTCH_DEPTH : 0}
                cornerRadius={BAR_CORNER_RADIUS}
                fill={theme.colors.background.elevated}
                shadow={{
                  color: "#1DD77A",
                  blur: 30,
                  dx: 0,
                  dy: 6,
                  opacity: 0.06,
                }}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.tabGroup}>
                {leftTabs.map((tab) => (
                  <TabButton key={tab.key} tab={tab} />
                ))}
              </View>
              {centerAction ? <View style={styles.centerSlot} /> : null}
              <View style={styles.tabGroup}>
                {rightTabs.map((tab) => (
                  <TabButton key={tab.key} tab={tab} />
                ))}
              </View>
            </View>
          </View>

          {centerAction ? (
            <View pointerEvents="box-none" style={styles.centerOverlay}>
              <CenterActionButton action={centerAction} />
            </View>
          ) : null}
        </View>
      </View>
    );
  },
);

BottomNavBar.displayName = "BottomNavBar";

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "stretch",
 
  },
  barContainer: {
    position: "relative",
    width: "100%",
  },
  bar: {
    height: BAR_HEIGHT,
  },
  row: {
    flexDirection: "row",
    alignItems: "stretch",
    height: BAR_HEIGHT,
  },
  tabGroup: {
    flex: 2,
    flexDirection: "row",
    alignItems: "stretch",
    borderRadius: 100,
    overflow: "hidden",
  },
  centerSlot: {
    width: CENTER_SLOT_WIDTH,
  },
  centerOverlay: {
    position: "absolute",
    top: -FAB_OVERLAP,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
