export const RING_SIZE = 280;
export const RING_RADIUS = 110;

export const RING_PROGRESS_STROKE_WIDTH = 18;
export const RING_TRACK_STROKE_WIDTH = 16;

export const RING_TICK_COUNT = 60;
export const RING_TICK_LENGTH = 2.5;

export const RING_START_ANGLE = -90;

export const RING_GLOW_DOT_SIZE = 6;
export const RING_GLOW_DOT_COUNT = 48;
export const RING_GLOW_BLUR = 14;
export const RING_GLOW_SPREAD = 7;
export const RING_GLOW_OPACITY_HEX = "66";

// Fixed across themes. Color is a function of progress (0 -> 1.2).
// 0-50%: yellow -> light green, 50-100%: green (more saturated),
// over 100%: orange -> red.
export const RING_COLOR_STOPS = [
  { at: 0, color: "#FACC15" },
  { at: 0.5, color: "#86EFAC" },
  { at: 0.8, color: "#22C55E" },
  { at: 1.0, color: "#15A33F" },
  { at: 1.1, color: "#F97316" },
  { at: 1.2, color: "#DC2626" },
] as const;

export const RING_PILL_TEXT_COLOR = "#0B0F14";
