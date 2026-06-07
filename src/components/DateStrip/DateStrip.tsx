import { Ionicons } from "@expo/vector-icons";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  type ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useTheme } from "../../theme";
import {
  CARD_GAP,
  CARD_STRIDE,
  CARD_WIDTH,
  GO_TO_TODAY_SLOT_HEIGHT,
  INITIAL_LEADING_DAYS,
} from "./constants";
import { DayCard } from "./DayCard";
import { buildMockDays, todayId } from "./mock";
import type { CalendarDay } from "./types";

export interface DateStripProps {
  /** Initially selected day id (defaults to today). */
  readonly initialSelectedId?: string;
  readonly onChangeSelected?: (id: string) => void;
}

export const DateStrip = memo<DateStripProps>(
  ({ initialSelectedId, onChangeSelected }) => {
    const { theme } = useTheme();
    const { t } = useTranslation("common");
    const listRef = useRef<FlatList<CalendarDay>>(null);

    const days = useMemo(() => buildMockDays(), []);
    const todayIdValue = useMemo(() => todayId(), []);
    const [selectedId, setSelectedId] = useState(
      () => initialSelectedId ?? todayIdValue,
    );

    const selectedIndex = useMemo(
      () => days.findIndex((day) => day.id === selectedId),
      [days, selectedId],
    );
    const initialScrollIndex = Math.max(0, selectedIndex - INITIAL_LEADING_DAYS);
    const isTodaySelected = selectedId === todayIdValue;

    const handleSelect = useCallback(
      (id: string) => {
        setSelectedId(id);
        onChangeSelected?.(id);
      },
      [onChangeSelected],
    );

    const handleGoToToday = useCallback(() => {
      const todayIndex = days.findIndex((day) => day.isToday);
      setSelectedId(todayIdValue);
      onChangeSelected?.(todayIdValue);
      if (todayIndex >= 0) {
        listRef.current?.scrollToOffset({
          offset: CARD_STRIDE * Math.max(0, todayIndex - INITIAL_LEADING_DAYS),
          animated: true,
        });
      }
    }, [days, onChangeSelected, todayIdValue]);

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
      <View style={styles.wrapper}>
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
              style={{marginBottom: 2}}
            />
          </Pressable>
        ) : null}
      </View>
    );
  },
);

DateStrip.displayName = "DateStrip";

function keyExtractor(day: CalendarDay): string {
  return day.id;
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  // Reserve the link's slot so showing/hiding it never reflows the layout.
  wrapper: {
    paddingBottom: GO_TO_TODAY_SLOT_HEIGHT,
  },
  content: {
    alignItems: "center",
  },
  separator: {
    width: CARD_GAP,
  },
  goToToday: {
    position: "absolute",
    bottom: 0,
    height: GO_TO_TODAY_SLOT_HEIGHT,
    flexDirection: "row",
    alignItems: "flex-end",
    display: "flex",
    gap: 4,
  },
  goToTodayText: {
    fontSize: 16,
    fontWeight: "500",
  },
  pressed: {
    opacity: 0.6,
  },
});
