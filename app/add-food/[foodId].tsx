import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ItemPreview } from "../../src/components/ItemPreview";
import { PortionLogFooter } from "../../src/components/PortionLogFooter";
import { ScreenHeader } from "../../src/components/ScreenHeader";
import { PopupSelect } from "../../src/components/PopupSelect";
import { ServingInsight } from "../../src/components/ServingInsight";
import { getFoodItemById } from "../../src/services/foodSearchApi";
import {
  useCalendarStore,
  useMealEntryStore,
  type MealType,
  type ServingUnit,
} from "../../src/store";
import type { ServingOption } from "../../src/store/types/serving";
import { useTheme } from "../../src/theme";
import { buildFoodServings, computePortionNutrients } from "../../src/utils/serving";

function isMealType(value: string): value is MealType {
  return (
    value === "breakfast" ||
    value === "lunch" ||
    value === "dinner" ||
    value === "snack"
  );
}

function servingLabel(
  serving: ServingOption,
  unitLabels: Record<ServingUnit, string>,
  t: TFunction<"common">,
): string {
  const unit = unitLabels[serving.unit];
  const values = { amount: serving.amount, unit };

  switch (serving.id) {
    case "1g":
      return t("foodPortion.presets.1g", values);
    case "100g":
      return t("foodPortion.presets.100g", values);
    case "portion":
      return t("foodPortion.presets.portion", values);
    case "large":
      return t("foodPortion.presets.large", values);
    default:
      return t("foodPortion.presets.default", values);
  }
}

export default function FoodPortionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ foodId: string; meal?: string }>();
  const { t } = useTranslation("common");
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const dateId = useCalendarStore((state) => state.selectedId);
  const addEntry = useMealEntryStore((state) => state.addEntry);

  const food = useMemo(
    () => (params.foodId ? getFoodItemById(params.foodId) : undefined),
    [params.foodId],
  );

  const servings = useMemo(
    () => (food ? buildFoodServings(food) : []),
    [food],
  );

  const [selectedServingId, setSelectedServingId] = useState(
    servings[1]?.id ?? servings[0]?.id ?? "",
  );
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (servings.length > 0 && !servings.some((s) => s.id === selectedServingId)) {
      setSelectedServingId(servings[1]?.id ?? servings[0].id);
    }
  }, [selectedServingId, servings]);

  useEffect(() => {
    if (!food) {
      router.back();
    }
  }, [food, router]);

  const unitLabels = useMemo(
    () =>
      t("foodAdd.servingUnits", { returnObjects: true }) as Record<
        ServingUnit,
        string
      >,
    [t],
  );

  const selectedServing = servings.find((s) => s.id === selectedServingId);

  const servingOptions = useMemo(
    () =>
      servings.map((serving) => {
        const preview = food
          ? computePortionNutrients(food, serving.amount, 1)
          : null;

        return {
          id: serving.id,
          label: servingLabel(serving, unitLabels, t),
          detail: preview
            ? t("foodAdd.calories", { value: preview.calories })
            : undefined,
        };
      }),
    [food, servings, t, unitLabels],
  );

  const nutrients = useMemo(() => {
    if (!food || !selectedServing) {
      return null;
    }
    return computePortionNutrients(food, selectedServing.amount, quantity);
  }, [food, quantity, selectedServing]);

  const servingInsight = useMemo(() => {
    if (!food || !selectedServing) {
      return null;
    }

    const perServing = computePortionNutrients(food, selectedServing.amount, 1);
    const unit = unitLabels[selectedServing.unit];

    const highlights = [
      {
        label: t("nutrients.fiber"),
        value: `${perServing.fiber ?? 0} ${unitLabels.g}`,
      },
      {
        label: t("nutrients.sugar"),
        value: `${perServing.sugar ?? 0} ${unitLabels.g}`,
      },
      {
        label: t("nutrients.sodium"),
        value: `${perServing.sodium ?? 0} mg`,
      },
    ];

    const sourceBadge =
      food.source === "fdc"
        ? "USDA"
        : food.source === "shapp"
          ? "SHAPP"
          : undefined;

    return {
      body: food.description,
      detail: t("foodPortion.perServingFacts", {
        amount: selectedServing.amount,
        unit,
        calories: perServing.calories,
        protein: perServing.protein,
        fat: perServing.fat,
        carbs: perServing.carbs,
      }),
      meta: food.details,
      highlights,
      badge: sourceBadge ?? food.brand ?? undefined,
    };
  }, [food, selectedServing, t, unitLabels]);

  const mealType: MealType = (() => {
    const meal = params.meal ?? "";
    return isMealType(meal) ? meal : "snack";
  })();

  if (!food || !selectedServing || !nutrients) {
    return null;
  }

  const handleAdd = async () => {
    await addEntry({
      date: dateId,
      mealType,
      food,
      servingAmount: selectedServing.amount,
      servingUnit: selectedServing.unit,
      quantity,
    });
    router.dismissAll();
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background.canvas,
          paddingTop: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
        },
      ]}
    >
      <ScreenHeader
        title={t("foodPortion.title")}
        subtitle={t(`foodAdd.selectedMeal.${mealType}` as const)}
        onBack={() => router.back()}
        backAccessibilityLabel={t("foodAdd.close")}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <ItemPreview
          title={food.title}
          subtitle={food.brand ?? undefined}
          imageUri={food.imageUrl ?? undefined}
        />

        <View style={styles.servingSection}>
          <PopupSelect
            label={t("foodPortion.servingSection")}
            options={servingOptions}
            value={selectedServingId}
            onChange={setSelectedServingId}
          />

          {servingInsight ? (
            <ServingInsight
              badge={servingInsight.badge}
              body={servingInsight.body}
              detail={servingInsight.detail}
              meta={servingInsight.meta}
              highlights={servingInsight.highlights}
            />
          ) : null}
        </View>
      </ScrollView>

      <PortionLogFooter
        quantity={quantity}
        onQuantityChange={setQuantity}
        quantityLabel={t("foodPortion.quantitySection")}
        caloriesLabel={t("foodAdd.calories", { value: nutrients.calories })}
        macroLine={t("foodAdd.macroLine", {
          protein: nutrients.protein,
          fat: nutrients.fat,
          carbs: nutrients.carbs,
        })}
        actionLabel={t("foodPortion.add")}
        onAction={() => void handleAdd()}
        bottomInset={insets.bottom}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 12,
  },
  servingSection: {
    marginTop: 20,
    rowGap: 14,
  },
});
