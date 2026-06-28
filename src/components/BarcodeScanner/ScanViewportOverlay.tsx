import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "../../theme";

export interface ScanViewportOverlayProps {
  readonly hint: string;
}

const FRAME_WIDTH = 280;
const FRAME_HEIGHT = 140;
const CORNER_SIZE = 28;
const CORNER_WIDTH = 3;

export const ScanViewportOverlay = memo<ScanViewportOverlayProps>(({ hint }) => {
  const { theme } = useTheme();
  const cornerColor = theme.colors.accent.default;

  return (
    <View style={styles.root} pointerEvents="none">
      <View style={styles.dimTop} />
      <View style={styles.middleRow}>
        <View style={[styles.dimSide, styles.dimSideFill]} />
        <View style={[styles.frame, { borderColor: `${cornerColor}33` }]}>
          <View style={[styles.corner, styles.cornerTopLeft, { borderColor: cornerColor }]} />
          <View style={[styles.corner, styles.cornerTopRight, { borderColor: cornerColor }]} />
          <View style={[styles.corner, styles.cornerBottomLeft, { borderColor: cornerColor }]} />
          <View style={[styles.corner, styles.cornerBottomRight, { borderColor: cornerColor }]} />
        </View>
        <View style={[styles.dimSide, styles.dimSideFill]} />
      </View>
      <View style={styles.dimBottom}>
        <Text style={[styles.hint, { color: theme.colors.content.primary }]}>{hint}</Text>
      </View>
    </View>
  );
});

ScanViewportOverlay.displayName = "ScanViewportOverlay";

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
  },
  dimTop: {
    flex: 1,
    backgroundColor: "rgba(11, 15, 20, 0.55)",
  },
  middleRow: {
    flexDirection: "row",
    height: FRAME_HEIGHT,
  },
  dimSide: {
    flex: 1,
  },
  dimSideFill: {
    backgroundColor: "rgba(11, 15, 20, 0.55)",
  },
  frame: {
    width: FRAME_WIDTH,
    height: FRAME_HEIGHT,
    borderWidth: 1,
    borderRadius: 16,
    backgroundColor: "transparent",
  },
  corner: {
    position: "absolute",
    width: CORNER_SIZE,
    height: CORNER_SIZE,
  },
  cornerTopLeft: {
    top: -1,
    left: -1,
    borderTopWidth: CORNER_WIDTH,
    borderLeftWidth: CORNER_WIDTH,
    borderTopLeftRadius: 16,
  },
  cornerTopRight: {
    top: -1,
    right: -1,
    borderTopWidth: CORNER_WIDTH,
    borderRightWidth: CORNER_WIDTH,
    borderTopRightRadius: 16,
  },
  cornerBottomLeft: {
    bottom: -1,
    left: -1,
    borderBottomWidth: CORNER_WIDTH,
    borderLeftWidth: CORNER_WIDTH,
    borderBottomLeftRadius: 16,
  },
  cornerBottomRight: {
    bottom: -1,
    right: -1,
    borderBottomWidth: CORNER_WIDTH,
    borderRightWidth: CORNER_WIDTH,
    borderBottomRightRadius: 16,
  },
  dimBottom: {
    flex: 1.2,
    backgroundColor: "rgba(11, 15, 20, 0.55)",
    alignItems: "center",
    paddingTop: 28,
    paddingHorizontal: 24,
  },
  hint: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
    textAlign: "center",
  },
});
