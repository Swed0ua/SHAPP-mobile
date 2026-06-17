import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { type DimensionValue, StyleSheet, View, type ViewStyle } from "react-native";

import { StatRing } from "../StatRing";
import { getNutrientColor } from "./nutrientColors";
import type { NutrientStat } from "./types";

export interface NutrientBlockProps {
  /** Nutrients to render. Labels are resolved from i18n by `id`. */
  readonly items: readonly NutrientStat[];
}

/** Grid of nutrients, each shown as a glowing StatRing. */
export const NutrientBlock = memo<NutrientBlockProps>(({ items }) => {
  const { t } = useTranslation("common");

  const [columns] = useState(6);

  const getItemStyle = (
    _index: number,
    columnsCount: number = columns,
  ): ViewStyle => {
    const width: DimensionValue = `${100 / columnsCount}%`;
    const styleDict: ViewStyle = {
      width,
    };

    switch (columnsCount) {
      case 4:
        if ([0, 3, 4, 5].includes(_index)) {
          styleDict.marginTop= "-30" as DimensionValue;
        }
        if ([4].includes(_index)) {
          styleDict.marginLeft= "30" as DimensionValue;
        }
        if ([5].includes(_index)) {
          styleDict.marginRight= "30" as DimensionValue;
        }
        break;
      case 6:
        if ([1, 4].includes(_index)) {
          styleDict.marginTop= "-26" as DimensionValue;
        }
        if ([0, 5].includes(_index)) {
          styleDict.marginTop= "-74" as DimensionValue;
          // if (_index === 0) {
          //   styleDict.marginRight= "-0" as DimensionValue;
          // }
          // if (_index === 5) {
          //   styleDict.marginLeft= "-0" as DimensionValue;
          // }
        }
        break;
    }

    return styleDict;
  };

  return (
    <View style={styles.grid}>
      {items.map((nutrient, index) => (
        <View key={nutrient.id} style={[styles.cell, getItemStyle(index)]}>
          <StatRing
            icon={nutrient.icon}
            label={t(`nutrients.${nutrient.id}`)}
            value={`${nutrient.consumed}${nutrient.unit}`}
            progress={nutrient.goal > 0 ? nutrient.consumed / nutrient.goal : 0}
            color={getNutrientColor(nutrient.id)}
          />
        </View>
      ))}
    </View>
  );
});

NutrientBlock.displayName = "NutrientBlock";

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },
  cell: {
    alignItems: "center",
  },
});
