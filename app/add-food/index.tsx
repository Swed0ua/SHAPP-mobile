import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ChipSelect } from "../../src/components/ChipSelect";
import { InfoCard } from "../../src/components/InfoCard";
import { ScreenHeader } from "../../src/components/ScreenHeader";
import { SearchInput } from "../../src/components/SearchInput";
import { StatusPanel } from "../../src/components/StatusPanel";
import {
  DEFAULT_MEAL_SELECTION,
  SEARCH_DEBOUNCE_MS,
} from "../../src/constants/addFood";
import { useDebouncedSearch } from "../../src/hooks/useDebouncedSearch";
import { useFoodPortionNavigation, useOpenFoodScan } from "../../src/hooks/useFoodPortionNavigation";
import { searchFoods } from "../../src/services/foodCatalog";
import { type FoodItem, type ServingUnit } from "../../src/store";
import { useTheme } from "../../src/theme";
import { formatServingLabel } from "../../src/utils/mealEntry";
import {
  isMealSelection,
  MEAL_SLOTS,
  resolveCurrentMealSlot,
  type MealSelection,
} from "../../src/utils/meal";

const EMPTY_RESULTS: FoodItem[] = [];

export default function AddFoodScreen() {
  const router = useRouter();
  const { t } = useTranslation("common");
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [mealSelection, setMealSelection] =
    useState<MealSelection>(DEFAULT_MEAL_SELECTION);
  const [query, setQuery] = useState("");

  const effectiveMeal =
    mealSelection === "now" ? resolveCurrentMealSlot() : mealSelection;

  const servingUnitLabels = useMemo(
    () =>
      t("foodAdd.servingUnits", { returnObjects: true }) as Record<
        ServingUnit,
        string
      >,
    [t],
  );

  const { results, isLoading } = useDebouncedSearch(
    query,
    searchFoods,
    SEARCH_DEBOUNCE_MS,
    EMPTY_RESULTS,
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

  const renderResult = useCallback(
    ({ item }: { item: FoodItem }) => (
      <InfoCard
        title={item.title}
        subtitle={item.brand ?? undefined}
        imageUri={item.imageUrl ?? undefined}
        highlight={t("foodAdd.calories", { value: item.nutrients.calories })}
        highlightDetail={formatServingLabel(
          item.servingAmount,
          item.servingUnit,
          servingUnitLabels,
        )}
        footer={t("foodAdd.macroLine", {
          protein: item.nutrients.protein,
          fat: item.nutrients.fat,
          carbs: item.nutrients.carbs,
        })}
        onPress={() => openAdd(item, effectiveMeal)}
      />
    ),
    [effectiveMeal, openAdd, servingUnitLabels, t],
  );

  const emptyMessage = query.trim()
    ? t("foodAdd.empty")
    : t("foodAdd.searchHint");

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background.canvas,
          paddingTop: theme.spacing.md,
          paddingBottom: insets.bottom,
          paddingHorizontal: theme.spacing.lg,
        },
      ]}
    >
      <ScreenHeader
        title={t("foodAdd.title")}
        subtitle={t(`foodAdd.selectedMeal.${effectiveMeal}`)}
        onBack={() => router.back()}
        backAccessibilityLabel={t("foodAdd.close")}
      />

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={renderResult}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: theme.spacing.xl },
        ]}
        ListHeaderComponent={
          <>
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

            <View style={styles.searchSection}>
              <SearchInput
                value={query}
                onChangeText={setQuery}
                placeholder={t("foodAdd.searchPlaceholder")}
                trailingIcon="barcode-outline"
                trailingAccessibilityLabel={t("foodAdd.barcode")}
                onTrailingPress={openFoodScan}
              />
            </View>

            <Text
              style={[
                styles.sectionTitle,
                { color: theme.colors.content.primary },
              ]}
            >
              {t("foodAdd.resultsTitle")}
            </Text>
          </>
        }
        ListEmptyComponent={
          <StatusPanel
            message={isLoading ? t("foodAdd.loading") : emptyMessage}
            isLoading={isLoading}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
  },
  mealSection: {
    marginBottom: 18,
  },
  searchSection: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 12,
  },
});
