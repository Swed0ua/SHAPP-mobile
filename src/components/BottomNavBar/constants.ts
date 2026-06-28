export const BAR_HEIGHT = 64;
export const BAR_CORNER_RADIUS = BAR_HEIGHT / 2;

export const CENTER_ACTION_BUTTON_SIZE = 70;
export const CENTER_ACTION_ICON_SIZE = 42;
export const FAB_OVERLAP = CENTER_ACTION_BUTTON_SIZE;
export const CENTER_SLOT_WIDTH = CENTER_ACTION_BUTTON_SIZE + 16;

export const CENTER_ACTION_GLOW_BLUR = 30;
export const CENTER_ACTION_GLOW_SPREAD = 4;
export const CENTER_ACTION_GLOW_OPACITY_HEX = "50";

export const NOTCH_WIDTH = 180;
export const NOTCH_DEPTH = 26;

export const TAB_ICON_SIZE = 26;
export const TAB_ACTIVE_DOT_SIZE = 4;
export const TAB_ACTIVE_DOT_GLOW_BLUR = 30;
export const TAB_ACTIVE_DOT_GLOW_SPREAD = 14;
export const TAB_ACTIVE_DOT_GLOW_OPACITY_HEX = "50";

export function getBottomNavOverlayHeight(
  safeAreaBottom: number,
  spacingSm: number,
): number {
  return FAB_OVERLAP + BAR_HEIGHT + 20 + Math.max(safeAreaBottom, spacingSm);
}
