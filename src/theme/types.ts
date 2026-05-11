export type ThemeMode = "light" | "dark";

export type ThemePreference = ThemeMode | "auto";

export interface ThemeBackgroundColors {
  readonly canvas: string;
  readonly elevated: string;
  readonly muted: string;
}

export interface ThemeContentColors {
  readonly primary: string;
  readonly secondary: string;
  readonly tertiary: string;
  readonly inverse: string;
}

export interface ThemeStrokeColors {
  readonly subtle: string;
  readonly strong: string;
}

export interface ThemeAccentColors {
  readonly default: string;
  readonly onAccent: string;
  readonly muted: string;
}

export interface ThemeStatusColors {
  readonly danger: string;
  readonly success: string;
  readonly warning: string;
}

export interface ThemeColors {
  readonly background: ThemeBackgroundColors;
  readonly content: ThemeContentColors;
  readonly stroke: ThemeStrokeColors;
  readonly accent: ThemeAccentColors;
  readonly status: ThemeStatusColors;
}

export interface ThemeSpacing {
  readonly none: number;
  readonly xs: number;
  readonly sm: number;
  readonly md: number;
  readonly lg: number;
  readonly xl: number;
  readonly xxl: number;
}

export interface ThemeBorderRadius {
  readonly none: number;
  readonly sm: number;
  readonly md: number;
  readonly lg: number;
  readonly full: number;
}

export interface ThemeTextStyle {
  readonly fontSize: number;
  readonly lineHeight: number;
  readonly fontWeight: "400" | "500" | "600" | "700";
}

export interface ThemeTypography {
  readonly caption: ThemeTextStyle;
  readonly body: ThemeTextStyle;
  readonly title: ThemeTextStyle;
  readonly headline: ThemeTextStyle;
}

export interface Theme {
  readonly mode: ThemeMode;
  readonly colors: ThemeColors;
  readonly spacing: ThemeSpacing;
  readonly borderRadius: ThemeBorderRadius;
  readonly typography: ThemeTypography;
}
