import { CameraView, type BarcodeScanningResult } from "expo-camera";
import { memo, useCallback, useRef } from "react";
import { StyleSheet, View } from "react-native";

import { ScanViewportOverlay } from "./ScanViewportOverlay";

const BARCODE_TYPES = ["ean13", "ean8", "upc_a", "upc_e"] as const;
const SCAN_DEBOUNCE_MS = 1500;

export interface BarcodeScannerViewProps {
  readonly hint: string;
  readonly enabled: boolean;
  readonly onBarcodeScanned: (barcode: string) => void;
}

export const BarcodeScannerView = memo<BarcodeScannerViewProps>(
  ({ hint, enabled, onBarcodeScanned }) => {
    const lastScanRef = useRef<{ code: string; at: number } | null>(null);

    const handleBarcodeScanned = useCallback(
      (result: BarcodeScanningResult) => {
        if (!enabled || !result.data) {
          return;
        }

        const now = Date.now();
        const last = lastScanRef.current;

        if (
          last &&
          last.code === result.data &&
          now - last.at < SCAN_DEBOUNCE_MS
        ) {
          return;
        }

        lastScanRef.current = { code: result.data, at: now };
        onBarcodeScanned(result.data);
      },
      [enabled, onBarcodeScanned],
    );

    return (
      <View style={styles.container}>
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: [...BARCODE_TYPES] }}
          onBarcodeScanned={enabled ? handleBarcodeScanned : undefined}
        />
        <ScanViewportOverlay hint={hint} />
      </View>
    );
  },
);

BarcodeScannerView.displayName = "BarcodeScannerView";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
    borderRadius: 20,
  },
});
