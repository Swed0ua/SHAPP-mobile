import { memo } from "react";
import { StyleSheet, View } from "react-native";

import { NutrientPreview } from "../NutrientPreview";
import { PrimaryButton } from "../PrimaryButton";
import { QuantityControl } from "../QuantityControl";

export interface PortionLogFooterProps {
  readonly quantity: number;
  readonly onQuantityChange: (value: number) => void;
  readonly quantityLabel: string;
  readonly caloriesLabel: string;
  readonly macroLine: string;
  readonly actionLabel: string;
  readonly onAction: () => void;
  readonly bottomInset?: number;
}

export const PortionLogFooter = memo<PortionLogFooterProps>(
  ({
    quantity,
    onQuantityChange,
    quantityLabel,
    caloriesLabel,
    macroLine,
    actionLabel,
    onAction,
    bottomInset = 0,
  }) => (
    <View style={[styles.container, { paddingBottom: Math.max(bottomInset, 12) }]}>
      <QuantityControl
        label={quantityLabel}
        value={quantity}
        onChange={onQuantityChange}
        min={1}
        max={99}
        step={1}
      />
      <NutrientPreview caloriesLabel={caloriesLabel} macroLine={macroLine} />
      <PrimaryButton label={actionLabel} onPress={onAction} />
    </View>
  ),
);

PortionLogFooter.displayName = "PortionLogFooter";

const styles = StyleSheet.create({
  container: {
    rowGap: 16,
    paddingTop: 12,
  },
});
