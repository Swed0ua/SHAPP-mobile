import { useCameraPermissions } from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BarcodeScannerView } from "../../src/components/BarcodeScanner";
import { PrimaryButton } from "../../src/components/PrimaryButton";
import { ScreenHeader } from "../../src/components/ScreenHeader";
import { StatusPanel } from "../../src/components/StatusPanel";
import { useFoodPortionNavigation } from "../../src/hooks/useFoodPortionNavigation";
import { lookupFoodByBarcode } from "../../src/services/foodCatalog";
import { type MealType } from "../../src/store";
import { useTheme } from "../../src/theme";

type ScanPhase = "idle" | "lookingUp" | "notFound";

function isMealType(value: string): value is MealType {
  return (
    value === "breakfast" ||
    value === "lunch" ||
    value === "dinner" ||
    value === "snack"
  );
}

export default function FoodScanScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ meal?: string }>();
  const { t } = useTranslation("common");
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();

  const mealType: MealType = (() => {
    const meal = params.meal ?? "";
    return isMealType(meal) ? meal : "snack";
  })();

  const { openAdd } = useFoodPortionNavigation();
  const [phase, setPhase] = useState<ScanPhase>("idle");
  const [lastBarcode, setLastBarcode] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS !== "web" && permission && !permission.granted && permission.canAskAgain) {
      void requestPermission();
    }
  }, [permission, requestPermission]);

  const handleBarcodeScanned = useCallback(
    async (barcode: string) => {
      if (phase === "lookingUp") {
        return;
      }

      setPhase("lookingUp");
      setLastBarcode(barcode);

      try {
        const food = await lookupFoodByBarcode(barcode);

        if (food) {
          openAdd(food, mealType);
          return;
        }

        setPhase("notFound");
      } catch {
        setPhase("notFound");
      }
    },
    [mealType, openAdd, phase],
  );

  const handleRetry = useCallback(() => {
    setPhase("idle");
    setLastBarcode(null);
  }, []);

  const isScannerEnabled = phase === "idle" && Platform.OS !== "web";

  const renderBody = () => {
    if (Platform.OS === "web") {
      return <StatusPanel message={t("foodScan.unsupported")} />;
    }

    if (!permission) {
      return <StatusPanel message={t("foodScan.lookingUp")} isLoading />;
    }

    if (!permission.granted) {
      return (
        <View style={styles.permissionBlock}>
          <StatusPanel message={t("foodScan.permissionDenied")} />
          {permission.canAskAgain ? (
            <PrimaryButton
              label={t("foodScan.grantPermission")}
              onPress={() => void requestPermission()}
            />
          ) : null}
        </View>
      );
    }

    if (phase === "notFound") {
      return (
        <View style={styles.resultBlock}>
          <StatusPanel
            message={t("foodScan.notFound", { barcode: lastBarcode ?? "" })}
          />
          <PrimaryButton label={t("foodScan.retry")} onPress={handleRetry} />
        </View>
      );
    }

    return (
      <View style={styles.scannerWrap}>
        <BarcodeScannerView
          hint={t("foodScan.hint")}
          enabled={isScannerEnabled}
          onBarcodeScanned={(code) => void handleBarcodeScanned(code)}
        />
        {phase === "lookingUp" ? (
          <View style={styles.lookupOverlay}>
            <StatusPanel message={t("foodScan.lookingUp")} isLoading />
          </View>
        ) : null}
      </View>
    );
  };

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
        title={t("foodScan.title")}
        subtitle={t(`foodAdd.selectedMeal.${mealType}` as const)}
        onBack={() => router.back()}
        backAccessibilityLabel={t("foodAdd.close")}
      />

      <View style={styles.body}>{renderBody()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    marginTop: 12,
  },
  scannerWrap: {
    flex: 1,
    position: "relative",
  },
  lookupOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(11, 15, 20, 0.72)",
    justifyContent: "center",
  },
  permissionBlock: {
    flex: 1,
    justifyContent: "center",
    rowGap: 20,
  },
  resultBlock: {
    flex: 1,
    justifyContent: "center",
    rowGap: 20,
  },
});
