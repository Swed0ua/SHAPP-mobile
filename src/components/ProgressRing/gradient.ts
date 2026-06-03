import { RING_COLOR_STOPS } from "./constants";

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

/**
 * Maps a progress ratio (0 -> 1.2+) to a solid color, smoothly interpolated
 * in RGB between the configured stops. Theme-independent by design.
 */
interface ColorStop {
  readonly at: number;
  readonly color: string;
}

export function interpolateRingColor(ratio: number): string {
  const stops: readonly ColorStop[] = RING_COLOR_STOPS;
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
