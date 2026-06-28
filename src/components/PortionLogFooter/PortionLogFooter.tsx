import { memo } from "react";
import { StyleSheet, View } from "react-native";

import { NutrientPreview } from "../NutrientPreview";
import { PrimaryButton } from "../PrimaryButton";
import { QuantityControl } from "../QuantityControl";
import { TextButton } from "../TextButton";

export interface PortionLogFooterSecondaryAction {
  readonly label: string;
  readonly onPress: () => void;
  readonly tone?: "default" | "danger";
}

export interface PortionLogFooterProps {
  readonly quantity: number;
  readonly onQuantityChange: (value: number) => void;
  readonly quantityLabel: string;
  readonly caloriesLabel: string;
  readonly macroLine: string;
  readonly actionLabel: string;
  readonly onAction: () => void;
  readonly secondaryAction?: PortionLogFooterSecondaryAction;
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
    secondaryAction,
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
      {secondaryAction ? (
        <TextButton
          label={secondaryAction.label}
          onPress={secondaryAction.onPress}
          tone={secondaryAction.tone}
        />
      ) : null}
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
