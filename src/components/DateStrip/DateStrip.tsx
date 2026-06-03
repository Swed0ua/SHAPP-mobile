import { memo, useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  type ListRenderItem,
  StyleSheet,
  View,
} from "react-native";

import { useTheme } from "../../theme";
import {
  CARD_GAP,
  CARD_STRIDE,
  CARD_WIDTH,
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
    const listRef = useRef<FlatList<CalendarDay>>(null);

    const days = useMemo(() => buildMockDays(), []);
    const [selectedId, setSelectedId] = useState(
      () => initialSelectedId ?? todayId(),
    );

    const selectedIndex = useMemo(
      () => days.findIndex((day) => day.id === selectedId),
      [days, selectedId],
    );
    const initialScrollIndex = Math.max(0, selectedIndex - INITIAL_LEADING_DAYS);

    const handleSelect = useCallback(
      (id: string) => {
        setSelectedId(id);
        onChangeSelected?.(id);
      },
      [onChangeSelected],
    );

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
  content: {
    alignItems: "center",
  },
  separator: {
    width: CARD_GAP,
  },
});
