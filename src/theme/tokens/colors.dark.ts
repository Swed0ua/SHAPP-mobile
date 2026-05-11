import type { ThemeColors } from "../types";

export const darkThemeColors: ThemeColors = {
  background: {
    canvas: "#09090B",
    elevated: "#18181B",
    muted: "#27272A",
  },
  content: {
    primary: "#FAFAFA",
    secondary: "rgba(250, 250, 250, 0.72)",
    tertiary: "rgba(250, 250, 250, 0.48)",
    inverse: "#18181B",
  },
  stroke: {
    subtle: "rgba(255, 255, 255, 0.08)",
    strong: "rgba(255, 255, 255, 0.16)",
  },
  accent: {
    default: "#3B82F6",
    onAccent: "#FFFFFF",
    muted: "rgba(59, 130, 246, 0.18)",
  },
  status: {
    danger: "#F87171",
    success: "#4ADE80",
    warning: "#FBBF24",
  },
};
