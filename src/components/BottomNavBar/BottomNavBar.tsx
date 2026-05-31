import { memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "../../theme";
import { NotchedRect } from "../NotchedRect/NotchedRect";
import {
  CENTER_ACTION_BUTTON_SIZE,
  CenterActionButton,
} from "./CenterActionButton";
import { TabButton } from "./TabButton";
import type { BottomNavBarProps, BottomNavTab } from "./types";

const BAR_HEIGHT = 64;
const BAR_HORIZONTAL_MARGIN = 16;
const BAR_BOTTOM_MARGIN = 8;
const FAB_OVERLAP = CENTER_ACTION_BUTTON_SIZE;
const CENTER_SLOT_WIDTH = CENTER_ACTION_BUTTON_SIZE + 16;

const BAR_CORNER_RADIUS = BAR_HEIGHT / 2;
const NOTCH_WIDTH = 180;
const NOTCH_DEPTH = 26;

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
            paddingBottom: Math.max(insets.bottom, BAR_BOTTOM_MARGIN),
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
              />
            </View>

            <View style={styles.row}>
              {leftTabs.map((tab) => (
                <TabButton key={tab.key} tab={tab} />
              ))}
              {centerAction ? <View style={styles.centerSlot} /> : null}
              {rightTabs.map((tab) => (
                <TabButton key={tab.key} tab={tab} />
              ))}
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
    paddingHorizontal: BAR_HORIZONTAL_MARGIN,
    alignItems: "stretch",
  },
  barContainer: {
    position: "relative",
    width: "100%",
  },
  bar: {
    height: BAR_HEIGHT,
    overflow: "hidden",
  },
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "stretch",
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
