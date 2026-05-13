import type { ThemeColors } from "../types";

const brand = {
  primary: "#B6FF00",
  secondary: "#00D1FF",
  accent: "#FF3D81",
} as const;

const surface = {
  background: "#0B0F14",
  surface: "#151A21",
  surfaceLight: "#1F2630",
} as const;

const content = {
  textPrimary: "#F5F7FA",
  textSecondary: "#9CA3AF",
  tertiary: "rgba(0, 209, 255, 0.55)",
  inverse: surface.background,
} as const;

const stroke = {
  border: "#2A323D",
  subtle: "rgba(0, 209, 255, 0.12)",
} as const;

const accent = {
  default: brand.primary,
  onAccent: surface.background,
  muted: "rgba(255, 61, 129, 0.18)",
} as const;

const status = {
  success: "#39FF14",
  warning: "#FFB800",
  error: "#FF4D4D",
} as const;

export const darkThemeColors: ThemeColors = {
  background: {
    canvas: surface.background,
    elevated: surface.surface,
    muted: surface.surfaceLight,
  },
  content: {
    primary: content.textPrimary,
    secondary: content.textSecondary,
    tertiary: content.tertiary,
    inverse: content.inverse,
  },
  stroke: {
    subtle: stroke.subtle,
    strong: stroke.border,
  },
  accent: {
    default: accent.default,
    onAccent: accent.onAccent,
    muted: accent.muted,
  },
  status: {
    danger: status.error,
    success: status.success,
    warning: status.warning,
  },
};
