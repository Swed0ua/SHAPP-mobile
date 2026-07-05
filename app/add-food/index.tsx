import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  KeyboardAvoidingView,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ChipSelect } from "../../src/components/ChipSelect";
import { FoodChatProcessing } from "../../src/components/FoodChatProcessing";
import { InfoCard } from "../../src/components/InfoCard";
import { PrimaryButton } from "../../src/components/PrimaryButton";
import { ScreenHeader } from "../../src/components/ScreenHeader";
import { DEFAULT_MEAL_SELECTION } from "../../src/constants/addFood";
import { useFoodChatHistory } from "../../src/hooks/useFoodChatHistory";
import { useFoodPortionNavigation, useOpenFoodScan } from "../../src/hooks/useFoodPortionNavigation";
import {
  submitFoodChatMessage,
  type AiFoodSuggestion,
  type FoodChatListItem,
} from "../../src/services/foodChat";
import {
  useCalendarStore,
  useMealEntryStore,
  type MealType,
  type ServingUnit,
} from "../../src/store";
import { useTheme } from "../../src/theme";
import {
  buildFoodChatListItems,
  formatChatMessageTime,
} from "../../src/utils/foodChatFormat";
import { formatServingLabel } from "../../src/utils/mealEntry";
import {
  isMealSelection,
  MEAL_SLOTS,
  resolveCurrentMealSlot,
  type MealSelection,
} from "../../src/utils/meal";
import { computePortionNutrients } from "../../src/utils/serving";

function createMessageId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

const SCROLL_BOTTOM_THRESHOLD = 200;

export default function AddFoodScreen() {
  const router = useRouter();
  const { t } = useTranslation("common");
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<FoodChatListItem>>(null);
  const isNearBottomRef = useRef(true);
  const pendingAutoScrollRef = useRef(false);
  const isAutoScrollingRef = useRef(false);

  const dateId = useCalendarStore((state) => state.selectedId);
  const addEntry = useMealEntryStore((state) => state.addEntry);

  const { messages, setMessages, isHydrated } = useFoodChatHistory();
  const listItems = useMemo(() => buildFoodChatListItems(messages), [messages]);

  const [mealSelection, setMealSelection] =
    useState<MealSelection>(DEFAULT_MEAL_SELECTION);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [hasUnreadAssistant, setHasUnreadAssistant] = useState(false);
  const prevMessageCountRef = useRef(0);
  const skipUnreadCheckRef = useRef(true);

  const markAssistantAsRead = useCallback(() => {
    setHasUnreadAssistant(false);
  }, []);

  const scrollToBottom = useCallback((animated = true) => {
    pendingAutoScrollRef.current = true;
    isNearBottomRef.current = true;
    isAutoScrollingRef.current = true;
    markAssistantAsRead();

    const list = listRef.current;
    if (!list) {
      return;
    }

    const lastIndex = listItems.length - 1;

    const run = (withAnimation: boolean) => {
      if (lastIndex >= 0) {
        list.scrollToIndex({
          index: lastIndex,
          animated: withAnimation,
          viewPosition: 1,
        });
      }
      list.scrollToEnd({ animated: withAnimation });
    };

    run(animated);
    requestAnimationFrame(() => {
      run(animated);
      requestAnimationFrame(() => {
        run(false);
        pendingAutoScrollRef.current = false;
        setTimeout(() => {
          isAutoScrollingRef.current = false;
        }, animated ? 320 : 0);
      });
    });
  }, [listItems.length, markAssistantAsRead]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isAutoScrollingRef.current) {
        return;
      }

      const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
      const distanceFromBottom =
        contentSize.height - layoutMeasurement.height - contentOffset.y;
      const nearBottom = distanceFromBottom <= SCROLL_BOTTOM_THRESHOLD;

      isNearBottomRef.current = nearBottom;
      if (nearBottom) {
        markAssistantAsRead();
      }
    },
    [markAssistantAsRead],
  );

  const handleContentSizeChange = useCallback(() => {
    if (!isNearBottomRef.current && !pendingAutoScrollRef.current) {
      return;
    }

    listRef.current?.scrollToEnd({ animated: pendingAutoScrollRef.current });
  }, []);

  useEffect(() => {
    if (!isNearBottomRef.current && !pendingAutoScrollRef.current) {
      return;
    }

    scrollToBottom(true);
  }, [messages, isSending, scrollToBottom]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (skipUnreadCheckRef.current) {
      skipUnreadCheckRef.current = false;
      prevMessageCountRef.current = messages.length;
      return;
    }

    const lastMessage = messages[messages.length - 1];
    const hasNewMessage = messages.length > prevMessageCountRef.current;

    if (
      hasNewMessage &&
      lastMessage?.role === "assistant" &&
      !isNearBottomRef.current
    ) {
      setHasUnreadAssistant(true);
    }

    prevMessageCountRef.current = messages.length;
  }, [isHydrated, messages]);

  const effectiveMeal: MealType =
    mealSelection === "now" ? resolveCurrentMealSlot() : mealSelection;

  const servingUnitLabels = useMemo(
    () =>
      t("foodAdd.servingUnits", { returnObjects: true }) as Record<
        ServingUnit,
        string
      >,
    [t],
  );

  const mealOptions = useMemo(
    () => [
      { id: "now", label: t("foodAdd.meals.now") },
      ...MEAL_SLOTS.map((slot) => ({
        id: slot,
        label: t(`foodAdd.meals.${slot}`),
      })),
    ],
    [t],
  );

  const { openAdd } = useFoodPortionNavigation();
  const openFoodScan = useOpenFoodScan(effectiveMeal);

  const addSuggestion = useCallback(
    async (suggestion: AiFoodSuggestion) => {
      await addEntry({
        date: dateId,
        mealType: effectiveMeal,
        food: suggestion.food,
        servingAmount: suggestion.servingAmount,
        servingUnit: suggestion.servingUnit,
        quantity: suggestion.quantity,
      });
    },
    [addEntry, dateId, effectiveMeal],
  );

  const handleSend = useCallback(async () => {
    const text = draft.trim();
    if (!text || isSending) {
      return;
    }

    setDraft("");
    isNearBottomRef.current = true;
    pendingAutoScrollRef.current = true;
    markAssistantAsRead();
    setMessages((current) => [
      ...current,
      {
        id: createMessageId(),
        role: "user",
        text,
        createdAt: new Date().toISOString(),
      },
    ]);
    setIsSending(true);

    try {
      const reply = await submitFoodChatMessage(text);
      setMessages((current) => [
        ...current,
        {
          id: createMessageId(),
          role: "assistant",
          text: reply.text,
          items: reply.items,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }, [draft, isSending, markAssistantAsRead]);

  const renderSuggestion = useCallback(
    (suggestion: AiFoodSuggestion) => {
      const nutrients = computePortionNutrients(
        suggestion.food,
        suggestion.servingAmount,
        suggestion.quantity,
      );

      return (
        <View key={suggestion.food.id} style={styles.suggestionRow}>
          <View style={styles.suggestionCard}>
            <InfoCard
              title={suggestion.food.title}
              subtitle={suggestion.food.brand ?? undefined}
              imageUri={suggestion.food.imageUrl ?? undefined}
              highlight={t("foodAdd.calories", { value: nutrients.calories })}
              highlightDetail={formatServingLabel(
                suggestion.servingAmount * suggestion.quantity,
                suggestion.servingUnit,
                servingUnitLabels,
              )}
              footer={t("foodAdd.macroLine", {
                protein: nutrients.protein,
                fat: nutrients.fat,
                carbs: nutrients.carbs,
              })}
              onPress={() => openAdd(suggestion.food, effectiveMeal)}
            />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("foodChat.addItem")}
            onPress={() => void addSuggestion(suggestion)}
            style={({ pressed }) => [
              styles.addButton,
              {
                backgroundColor: theme.colors.accent.muted,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Ionicons
              name="add"
              size={24}
              color={theme.colors.accent.default}
            />
          </Pressable>
        </View>
      );
    },
    [
      addSuggestion,
      effectiveMeal,
      openAdd,
      servingUnitLabels,
      t,
      theme.colors.accent.default,
      theme.colors.accent.muted,
    ],
  );

  const renderListItem = useCallback(
    ({ item }: { item: FoodChatListItem }) => {
      if (item.type === "date") {
        return (
          <View
            style={[
              styles.dateSeparator,
              {
                backgroundColor: theme.colors.background.elevated,
                borderColor: theme.colors.stroke.subtle,
              },
            ]}
          >
            <Text
              style={[styles.dateSeparatorText, { color: theme.colors.content.secondary }]}
            >
              {item.label}
            </Text>
          </View>
        );
      }

      const message = item.message;
      const timeLabel = formatChatMessageTime(message.createdAt);

      if (message.role === "user") {
        return (
          <View
            style={[
              styles.userBubble,
              { backgroundColor: theme.colors.accent.default },
            ]}
          >
            <Text style={[styles.userText, { color: theme.colors.accent.onAccent }]}>
              {message.text}
            </Text>
            <Text
              style={[
                styles.messageTime,
                { color: theme.colors.accent.onAccent, opacity: 0.72 },
              ]}
            >
              {timeLabel}
            </Text>
          </View>
        );
      }

      return (
        <View style={styles.assistantBlock}>
          <View
            style={[
              styles.assistantBubble,
              {
                backgroundColor: theme.colors.background.elevated,
                borderColor: theme.colors.stroke.subtle,
              },
            ]}
          >
            <Text style={[styles.assistantText, { color: theme.colors.content.primary }]}>
              {message.text}
            </Text>
            <Text
              style={[styles.messageTime, { color: theme.colors.content.tertiary }]}
            >
              {timeLabel}
            </Text>
          </View>
          {message.items.map(renderSuggestion)}
          {message.items.length > 0 ? (
            <PrimaryButton
              label={t("foodChat.addAll", { count: message.items.length })}
              onPress={() => {
                void (async () => {
                  for (const suggestion of message.items) {
                    await addSuggestion(suggestion);
                  }
                })();
              }}
            />
          ) : null}
        </View>
      );
    },
    [
      addSuggestion,
      renderSuggestion,
      t,
      theme.colors.accent.default,
      theme.colors.accent.onAccent,
      theme.colors.background.elevated,
      theme.colors.content.primary,
      theme.colors.content.secondary,
      theme.colors.content.tertiary,
      theme.colors.stroke.subtle,
    ],
  );

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background.canvas,
          paddingTop: theme.spacing.md,
        },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : 0}
    >
      <View style={{ paddingHorizontal: theme.spacing.lg }}>
        <ScreenHeader
          title={t("foodChat.title")}
          subtitle={t(`foodAdd.selectedMeal.${effectiveMeal}` as const)}
          onBack={() => router.back()}
          backAccessibilityLabel={t("foodAdd.close")}
        />

        <View style={styles.mealSection}>
          <ChipSelect
            options={mealOptions}
            value={mealSelection}
            onChange={(id) => {
              if (isMealSelection(id)) {
                setMealSelection(id);
              }
            }}
          />
        </View>
      </View>

      <View style={styles.listWrap}>
        <FlatList
          ref={listRef}
          data={listItems}
          keyExtractor={(item) => item.id}
          renderItem={renderListItem}
          contentContainerStyle={[
            styles.listContent,
            { paddingHorizontal: theme.spacing.lg },
          ]}
          keyboardShouldPersistTaps="handled"
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onContentSizeChange={handleContentSizeChange}
          onScrollToIndexFailed={({ averageItemLength, index }) => {
            listRef.current?.scrollToOffset({
              offset: averageItemLength * index,
              animated: true,
            });
            setTimeout(() => {
              listRef.current?.scrollToEnd({ animated: false });
            }, 80);
          }}
          ListFooterComponent={isSending ? <FoodChatProcessing /> : null}
          ListEmptyComponent={
            isHydrated ? (
              <Text style={[styles.hint, { color: theme.colors.content.secondary }]}>
                {t("foodChat.hint")}
              </Text>
            ) : null
          }
        />

        {hasUnreadAssistant ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("foodChat.scrollToBottom")}
            hitSlop={8}
            onPress={() => scrollToBottom(true)}
            style={({ pressed }) => [
              styles.scrollDownButton,
              {
                backgroundColor: theme.colors.background.overlay,
                borderColor: theme.colors.stroke.strong,
                borderRadius: theme.borderRadius.full,
                opacity: pressed ? 0.88 : 1,
              },
            ]}
          >
            <Ionicons
              name="chevron-down"
              size={22}
              color={theme.colors.accent.default}
            />
          </Pressable>
        ) : null}
      </View>

      <View
        style={[
          styles.composerWrap,
          {
            backgroundColor: theme.colors.background.canvas,
            borderTopColor: theme.colors.stroke.subtle,
          },
        ]}
      >
        <View
          style={[
            styles.composer,
            {
              paddingBottom: Math.max(insets.bottom, theme.spacing.sm),
              paddingHorizontal: theme.spacing.lg,
            },
          ]}
        >
        <View
          style={[
            styles.inputShell,
            {
              backgroundColor: theme.colors.background.elevated,
              borderColor: theme.colors.stroke.strong,
            },
          ]}
        >
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder={t("foodChat.placeholder")}
            placeholderTextColor={theme.colors.content.tertiary}
            style={[styles.input, { color: theme.colors.content.primary }]}
            multiline
            maxLength={500}
            selectionColor={theme.colors.accent.default}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("foodAdd.barcode")}
            hitSlop={8}
            onPress={openFoodScan}
            style={styles.barcodeButton}
          >
            <Ionicons
              name="barcode-outline"
              size={22}
              color={theme.colors.content.secondary}
            />
          </Pressable>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("foodChat.send")}
          disabled={!draft.trim() || isSending}
          onPress={() => void handleSend()}
          style={({ pressed }) => [
            styles.sendButton,
            {
              backgroundColor: theme.colors.accent.default,
              opacity: !draft.trim() || isSending ? 0.45 : pressed ? 0.9 : 1,
            },
          ]}
        >
          <Ionicons
            name="arrow-up"
            size={22}
            color={theme.colors.accent.onAccent}
          />
        </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mealSection: {
    marginBottom: 12,
  },
  listWrap: {
    flex: 1,
    position: "relative",
  },
  composerWrap: {
    borderTopWidth: 1,
  },
  scrollDownButton: {
    position: "absolute",
    alignSelf: "center",
    bottom: 12,
    zIndex: 2,
    width: 44,
    height: 44,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.22)",
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 32,
    rowGap: 14,
  },
  hint: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    marginTop: 8,
  },
  dateSeparator: {
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginVertical: 2,
  },
  dateSeparatorText: {
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 16,
  },
  messageTime: {
    alignSelf: "flex-end",
    fontSize: 11,
    fontWeight: "500",
    lineHeight: 14,
    marginTop: 4,
  },
  userBubble: {
    alignSelf: "flex-end",
    maxWidth: "85%",
    borderRadius: 16,
    borderBottomRightRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  userText: {
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 21,
  },
  assistantBlock: {
    rowGap: 10,
  },
  assistantBubble: {
    alignSelf: "flex-start",
    maxWidth: "92%",
    borderWidth: 1,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  assistantText: {
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 21,
  },
  suggestionRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
  },
  suggestionCard: {
    flex: 1,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    columnGap: 10,
    paddingTop: 10,
  },
  inputShell: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    borderWidth: 1,
    borderRadius: 14,
    paddingLeft: 14,
    paddingRight: 8,
    paddingVertical: 8,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    maxHeight: 120,
    paddingVertical: 4,
  },
  barcodeButton: {
    padding: 6,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});
