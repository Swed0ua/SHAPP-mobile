import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  type ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useCalendarStore, useUserGoalsStore } from "../../store";
import { useTheme } from "../../theme";
import { parseDateId } from "../../utils/date";
import {
  CARD_GAP,
  CARD_STRIDE,
  CARD_WIDTH,
  EDGE_REANCHOR_THRESHOLD,
  GO_TO_TODAY_SLOT_HEIGHT,
  INITIAL_LEADING_DAYS,
} from "./constants";
import { DayCard } from "./DayCard";
import { buildMockDays, todayId } from "./mock";
import { SelectedDateLabel } from "./SelectedDateLabel";
import type { CalendarDay } from "./types";

export interface DateStripProps {
  /** Notified whenever the selected day changes. */
  readonly onChangeSelected?: (id: string) => void;
}

export const DateStrip = memo<DateStripProps>(({ onChangeSelected }) => {
  const { theme } = useTheme();
  const { t } = useTranslation("common");
  const router = useRouter();
  const listRef = useRef<FlatList<CalendarDay>>(null);

  const selectedId = useCalendarStore((state) => state.selectedId);
  const setSelectedId = useCalendarStore((state) => state.setSelectedId);
  const caloriesTarget = useUserGoalsStore((state) => state.goals.calories);

  const todayIdValue = useMemo(() => todayId(), []);

  // Day the window is centered on. Starts at the selected day and re-centers
  // whenever the selection drifts near an edge (or lands outside the window).
  const [anchorId, setAnchorId] = useState(selectedId);

  const days = useMemo(
    () => buildMockDays(parseDateId(anchorId), new Date(), caloriesTarget),
    [anchorId, caloriesTarget],
  );

  const selectedIndex = useMemo(
    () => days.findIndex((day) => day.id === selectedId),
    [days, selectedId],
  );
  const initialScrollIndex = Math.max(0, selectedIndex - INITIAL_LEADING_DAYS);
  const isTodaySelected = selectedId === todayIdValue;

  // Re-anchor the strip around the selected day when it sits within
  // EDGE_REANCHOR_THRESHOLD of either edge, or falls outside the rendered window.
  useEffect(() => {
    if (selectedId === anchorId) {
      return;
    }
    const index = days.findIndex((day) => day.id === selectedId);
    const nearEdge =
      index === -1 ||
      index <= EDGE_REANCHOR_THRESHOLD ||
      index >= days.length - 1 - EDGE_REANCHOR_THRESHOLD;
    if (nearEdge) {
      setAnchorId(selectedId);
    }
  }, [anchorId, days, selectedId]);

  const scrollToIndex = useCallback((index: number) => {
    if (index < 0) {
      return;
    }
    listRef.current?.scrollToOffset({
      offset: CARD_STRIDE * Math.max(0, index - INITIAL_LEADING_DAYS),
      animated: true,
    });
  }, []);

  // Keep the selected day visible when it changes (e.g. picked in the modal).
  useEffect(() => {
    scrollToIndex(selectedIndex);
  }, [scrollToIndex, selectedIndex]);

  const handleSelect = useCallback(
    (id: string) => {
      setSelectedId(id);
      onChangeSelected?.(id);
    },
    [onChangeSelected, setSelectedId],
  );

  const handleDateLabelPress = useCallback(() => {
    router.push("/calendar");
  }, [router]);

  const handleGoToToday = useCallback(() => {
    setSelectedId(todayIdValue);
    onChangeSelected?.(todayIdValue);
  }, [onChangeSelected, setSelectedId, todayIdValue]);

  const renderItem = useCallback<ListRenderItem<CalendarDay>>(
    ({ item }) => (
      <DayCard
        day={item}
        isSelected={item.id === selectedId}
        onSelect={handleSelect}
      />
    ),
    [handleSelect, selectedId],
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<CalendarDay> | null | undefined, index: number) => ({
      length: CARD_WIDTH,
      offset: CARD_STRIDE * index,
      index,
    }),
    [],
  );

  const handleScrollToIndexFailed = useCallback(
    (info: { index: number }) => {
      listRef.current?.scrollToOffset({
        offset: CARD_STRIDE * info.index,
        animated: false,
      });
    },
    [],
  );

  return (
    <View>
      <FlatList
        ref={listRef}
        data={days}
        horizontal
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        initialScrollIndex={initialScrollIndex}
        onScrollToIndexFailed={handleScrollToIndexFailed}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={[
          styles.content,
          { paddingHorizontal: theme.spacing.lg },
        ]}
      />

      <View style={[styles.footer, { marginTop: theme.spacing.sm }]}>
        {!isTodaySelected ? (
          <Pressable
            accessibilityRole="button"
            hitSlop={8}
            onPress={handleGoToToday}
            style={({ pressed }) => [
              styles.goToToday,
              { right: theme.spacing.sm },
              pressed && styles.pressed,
            ]}
          >
            <Text
              style={[
                styles.goToTodayText,
                { color: theme.colors.content.secondary },
              ]}
            >
              {t("calendar.goToToday")}
            </Text>
            <Ionicons
              name="arrow-forward"
              size={14}
              color={theme.colors.content.secondary}
              style={styles.goToTodayIcon}
            />
          </Pressable>
        ) : null}

        <View style={styles.dateLabel}>
          <SelectedDateLabel
            selectedId={selectedId}
            onPress={handleDateLabelPress}
          />
        </View>
      </View>
    </View>
  );
});

DateStrip.displayName = "DateStrip";

function keyExtractor(day: CalendarDay): string {
  return day.id;
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
  },
  footer: {
    height: GO_TO_TODAY_SLOT_HEIGHT * 2.5,
    position: "relative",
  },
  dateLabel: {
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
  },
  separator: {
    width: CARD_GAP,
  },
  goToToday: {
    position: "absolute",
    top: 0,
    height: GO_TO_TODAY_SLOT_HEIGHT,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
  },
  goToTodayIcon: {
    marginBottom: 0,
  },
  goToTodayText: {
    fontSize: 12,
    fontWeight: "500",
  },
  pressed: {
    opacity: 0.6,
  },
});
