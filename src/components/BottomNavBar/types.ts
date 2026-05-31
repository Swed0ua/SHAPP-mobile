import type { ComponentProps } from "react";
import type { Ionicons } from "@expo/vector-icons";

export type BottomNavIconName = ComponentProps<typeof Ionicons>["name"];

export interface BottomNavTab {
  readonly key: string;
  readonly icon: BottomNavIconName;
  readonly iconActive?: BottomNavIconName;
  readonly accessibilityLabel: string;
  readonly onPress: () => void;
  readonly isActive?: boolean;
}

export interface BottomNavCenterAction {
  readonly icon: BottomNavIconName;
  readonly accessibilityLabel: string;
  readonly onPress: () => void;
}

export interface BottomNavBarProps {
  readonly tabs: readonly BottomNavTab[];
  readonly centerAction?: BottomNavCenterAction;
}
