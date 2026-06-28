import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { useFoodPortionNavigation } from "../../hooks/useFoodPortionNavigation";
import type { MealType, ServingUnit } from "../../store";
import { MEAL_SLOTS } from "../../utils/meal";
import { MealLogSection } from "../MealLogSection";
import { useDayMealLog } from "../../hooks/useDayMealLog";

function createExpandedState(): Record<MealType, boolean> {
  return MEAL_SLOTS.reduce(
    (acc, mealType) => {
      acc[mealType] = true;
      return acc;
    },
    {} as Record<MealType, boolean>,
  );
}

export function DayMealLog() {
  const { t } = useTranslation("common");
  const { grouped, caloriesByMeal } = useDayMealLog();
  const { openEdit } = useFoodPortionNavigation();
  const [expandedByMeal, setExpandedByMeal] = useState(createExpandedState);

  const unitLabels = useMemo(
    () =>
      t("foodAdd.servingUnits", { returnObjects: true }) as Record<
        ServingUnit,
        string
      >,
    [t],
  );

  const handleToggle = useCallback((mealType: MealType) => {
    setExpandedByMeal((current) => ({
      ...current,
      [mealType]: !current[mealType],
    }));
  }, []);

  return (
    <View style={styles.container}>
      {MEAL_SLOTS.map((mealType) => (
        <MealLogSection
          key={mealType}
          title={t(`home.meals.${mealType}`)}
          caloriesLabel={t("home.meals.calories", {
            value: caloriesByMeal[mealType],
          })}
          entries={grouped[mealType]}
          emptyLabel={t("home.meals.empty")}
          expanded={expandedByMeal[mealType]}
          onToggle={() => handleToggle(mealType)}
          onEntryPress={openEdit}
          unitLabels={unitLabels}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    rowGap: 12,
  },
});
