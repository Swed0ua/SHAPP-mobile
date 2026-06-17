// Geometry for the compact stat ring. Kept small enough to fit a 3-column grid
// on phones while staying readable.
export const STAT_RING_SIZE = 64;
export const STAT_RING_RADIUS = 22;

/** Max width for value + label so long names truncate cleanly in tight grids. */
export const STAT_RING_CAPTION_WIDTH = STAT_RING_SIZE + 20;

export const STAT_RING_STROKE_WIDTH = 6;
export const STAT_RING_TRACK_STROKE_WIDTH = 6;

export const STAT_RING_ICON_SIZE = 18;

export const STAT_RING_START_ANGLE = -90;

// Neon glow that traces the progress arc (same technique as ProgressRing).
export const STAT_RING_GLOW_DOT_SIZE = 4;
export const STAT_RING_GLOW_DOT_COUNT = 36;
export const STAT_RING_GLOW_BLUR = 8;
export const STAT_RING_GLOW_SPREAD = 3;
export const STAT_RING_GLOW_OPACITY_HEX = "36";
