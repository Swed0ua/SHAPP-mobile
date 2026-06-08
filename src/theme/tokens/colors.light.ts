import type { ThemeColors } from "../types";

const background = {
  canvas: "#FFFFFF",
  elevated: "#F4F4F5",
  muted: "#E4E4E7",
} as const;

const content = {
  primary: "#18181B",
  secondary: "rgba(24, 24, 27, 0.72)",
  tertiary: "rgba(24, 24, 27, 0.48)",
  inverse: "#FAFAFA",
} as const;

const stroke = {
  subtle: "rgba(24, 24, 27, 0.08)",
  strong: "rgba(24, 24, 27, 0.16)",
} as const;

const accent = {
  default: "#2563EB",
  onAccent: "#FFFFFF",
  muted: "rgba(37, 99, 235, 0.12)",
  glow: "#42AB49",
  highlight: "#D6336C",
} as const;

const status = {
  success: "#16A34A",
  warning: "#D97706",
  error: "#DC2626",
} as const;

export const lightThemeColors: ThemeColors = {
  background: {
    canvas: background.canvas,
    elevated: background.elevated,
    muted: background.muted,
  },
  content: {
    primary: content.primary,
    secondary: content.secondary,
    tertiary: content.tertiary,
    inverse: content.inverse,
  },
  stroke: {
    subtle: stroke.subtle,
    strong: stroke.strong,
  },
  accent: {
    default: accent.default,
    onAccent: accent.onAccent,
    muted: accent.muted,
    glow: accent.glow,
    highlight: accent.highlight,
  },
  status: {
    danger: status.error,
    success: status.success,
    warning: status.warning,
  },
};
