// Single source of truth for the "progress" color scale shared by the
// ProgressRing and the calendar day cards.
//
// Color is a function of progress ratio (0 -> 1.2):
//   0-50%  : yellow -> light green
//   50-100%: green (increasing saturation)
//   >100%  : orange -> red
// Theme-independent by design, so progress reads the same in light/dark.
export const PROGRESS_COLOR_STOPS = [
  { at: 0, color: "#FACC15" },
  { at: 0.5, color: "#86EFAC" },
  { at: 0.8, color: "#22C55E" },
  { at: 1.0, color: "#15A33F" },
  { at: 1.1, color: "#F97316" },
  { at: 1.2, color: "#DC2626" },
] as const;

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

interface Rgb {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

function hexToRgb(hex: string): Rgb {
  const value = hex.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function channelToHex(channel: number): string {
  return Math.round(channel).toString(16).padStart(2, "0").toUpperCase();
}

interface ColorStop {
  readonly at: number;
  readonly color: string;
}

/**
 * Maps a progress ratio (0 -> 1.2+) to a solid color, smoothly interpolated
 * in RGB between the configured stops.
 */
export function interpolateProgressColor(ratio: number): string {
  const stops: readonly ColorStop[] = PROGRESS_COLOR_STOPS;
  const first = stops[0];
  const last = stops[stops.length - 1];
  const clamped = clamp(ratio, first.at, last.at);

  let lower = first;
  let upper = last;
  for (let i = 0; i < stops.length - 1; i += 1) {
    if (clamped >= stops[i].at && clamped <= stops[i + 1].at) {
      lower = stops[i];
      upper = stops[i + 1];
      break;
    }
  }

  const span = upper.at - lower.at;
  const t = span > 0 ? (clamped - lower.at) / span : 0;

  const from = hexToRgb(lower.color);
  const to = hexToRgb(upper.color);

  const r = from.r + (to.r - from.r) * t;
  const g = from.g + (to.g - from.g) * t;
  const b = from.b + (to.b - from.b) * t;

  return `#${channelToHex(r)}${channelToHex(g)}${channelToHex(b)}`;
}
