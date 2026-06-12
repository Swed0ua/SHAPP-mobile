// Render window around the anchor day (mock stage; real paging comes later).
export const DAYS_BEFORE = 20;
export const DAYS_AFTER = 20;

/**
 * Re-center the strip when the selected day gets within this many days of
 * either edge of the rendered window, so there are always days to scroll into.
 */
export const EDGE_REANCHOR_THRESHOLD = 5;

export const CARD_WIDTH = 70;
export const CARD_HEIGHT = 90;
export const CARD_GAP = 14;
export const CARD_RADIUS = 24;

/** Wide border that doubles as a progress ring around the card. */
export const CARD_PROGRESS_STROKE_WIDTH = 4;

/** Horizontal stride per card, used by getItemLayout / scrollToIndex. */
export const CARD_STRIDE = CARD_WIDTH + CARD_GAP;

/** Selected day is positioned ~4th in view, leaving past days visible left. */
export const INITIAL_LEADING_DAYS = 3;

// Selection accent. Cyan is the brand "secondary" tone and is intentionally
// theme-independent so the selected day reads the same in light/dark.
export const SELECTED_FILL_COLOR = "#00D1FF";
export const SELECTED_TEXT_COLOR = "#0B0F14";

/**
 * Reserved height below the strip for the "go to today" link. The link is
 * absolutely positioned inside this slot so toggling its visibility never
 * reflows the surrounding layout.
 */
export const GO_TO_TODAY_SLOT_HEIGHT = 26;
