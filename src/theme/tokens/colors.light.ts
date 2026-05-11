import type { ThemeColors } from "../types";

export const lightThemeColors: ThemeColors = {
  background: {
    canvas: "#FFFFFF",
    elevated: "#F4F4F5",
    muted: "#E4E4E7",
  },
  content: {
    primary: "#18181B",
    secondary: "rgba(24, 24, 27, 0.72)",
    tertiary: "rgba(24, 24, 27, 0.48)",
    inverse: "#FAFAFA",
  },
  stroke: {
    subtle: "rgba(24, 24, 27, 0.08)",
    strong: "rgba(24, 24, 27, 0.16)",
  },
  accent: {
    default: "#2563EB",
    onAccent: "#FFFFFF",
    muted: "rgba(37, 99, 235, 0.12)",
  },
  status: {
    danger: "#DC2626",
    success: "#16A34A",
    warning: "#D97706",
  },
};
