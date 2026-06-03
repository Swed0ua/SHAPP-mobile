// Render window around the selected day (mock stage; real paging comes later).
export const DAYS_BEFORE = 20;
export const DAYS_AFTER = 20;

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
