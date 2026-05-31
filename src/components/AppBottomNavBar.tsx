import { useCallback, useMemo } from "react";
import { useRouter, usePathname } from "expo-router";
import { useTranslation } from "react-i18next";

import {
  BottomNavBar,
  type BottomNavCenterAction,
  type BottomNavIconName,
  type BottomNavTab,
} from "./BottomNavBar";

type AppRoute = "/" | "/profile";
type TabLabelKey =
  | "tabs.menu"
  | "tabs.home"
  | "tabs.calendar"
  | "tabs.profile"
  | "tabs.add";

interface AppBottomNavTabConfig {
  readonly key: string;
  readonly icon: BottomNavIconName;
  readonly iconActive?: BottomNavIconName;
  readonly labelKey: TabLabelKey;
  readonly targetRoute: AppRoute;
}

interface AppBottomNavCenterActionConfig {
  readonly icon: BottomNavIconName;
  readonly labelKey: TabLabelKey;
  readonly targetRoute: AppRoute;
}

const TAB_CONFIGS: readonly AppBottomNavTabConfig[] = [
  {
    key: "menu",
    icon: "menu-outline",
    iconActive: "menu",
    labelKey: "tabs.menu",
    targetRoute: "/",
  },
  {
    key: "home",
    icon: "home-outline",
    iconActive: "home",
    labelKey: "tabs.home",
    targetRoute: "/profile",
  },
  {
    key: "calendar",
    icon: "calendar-outline",
    iconActive: "calendar",
    labelKey: "tabs.calendar",
    targetRoute: "/",
  },
  {
    key: "profile",
    icon: "person-outline",
    iconActive: "person",
    labelKey: "tabs.profile",
    targetRoute: "/profile",
  },
];

const CENTER_ACTION_CONFIG: AppBottomNavCenterActionConfig = {
  icon: "add",
  labelKey: "tabs.add",
  targetRoute: "/",
};

export function AppBottomNavBar() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const pathname = usePathname();

  const navigate = useCallback((route: AppRoute) => {
    router.replace(route);
  }, [router]);

  const tabs = useMemo<readonly BottomNavTab[]>(
    () =>
      TAB_CONFIGS.map((config) => ({
        key: config.key,
        icon: config.icon,
        iconActive: config.iconActive,
        accessibilityLabel: t(config.labelKey),
        onPress: () => navigate(config.targetRoute),
        isActive: pathname === config.targetRoute,
      })),
    [navigate, pathname, t],
  );

  const centerAction = useMemo<BottomNavCenterAction>(
    () => ({
      icon: CENTER_ACTION_CONFIG.icon,
      accessibilityLabel: t(CENTER_ACTION_CONFIG.labelKey),
      onPress: () => navigate(CENTER_ACTION_CONFIG.targetRoute),
    }),
    [navigate, t],
  );

  return <BottomNavBar tabs={tabs} centerAction={centerAction} />;
}
