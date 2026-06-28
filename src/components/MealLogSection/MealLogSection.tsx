import { memo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text } from "react-native";

import type { MealEntry, ServingUnit } from "../../store";
import { useTheme } from "../../theme";
import { buildMealEntryCardModel } from "../../utils/mealEntry";
import { CollapsibleSection } from "../CollapsibleSection";
import { InfoCard } from "../InfoCard";

export interface MealLogSectionProps {
  readonly title: string;
  readonly caloriesLabel: string;
  readonly entries: readonly MealEntry[];
  readonly emptyLabel: string;
  readonly expanded: boolean;
  readonly onToggle: () => void;
  readonly onEntryPress: (entry: MealEntry) => void;
  readonly unitLabels: Record<ServingUnit, string>;
}

export const MealLogSection = memo<MealLogSectionProps>(
  ({
    title,
    caloriesLabel,
    entries,
    emptyLabel,
    expanded,
    onToggle,
    onEntryPress,
    unitLabels,
  }) => {
    const { t } = useTranslation("common");
    const { theme } = useTheme();

    return (
      <CollapsibleSection
        title={title}
        trailing={caloriesLabel}
        expanded={expanded}
        onToggle={onToggle}
      >
        {entries.length === 0 ? (
          <Text style={[styles.empty, { color: theme.colors.content.secondary }]}>
            {emptyLabel}
          </Text>
        ) : (
          entries.map((entry) => {
            const card = buildMealEntryCardModel(entry, unitLabels, t);

            return (
              <InfoCard
                key={entry.id}
                {...card}
                onPress={() => onEntryPress(entry)}
              />
            );
          })
        )}
      </CollapsibleSection>
    );
  },
);

MealLogSection.displayName = "MealLogSection";

const styles = StyleSheet.create({
  empty: {
    fontSize: 13,
    fontWeight: "500",
  },
});
