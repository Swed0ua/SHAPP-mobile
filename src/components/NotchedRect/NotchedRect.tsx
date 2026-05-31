import { memo, useMemo, useState } from "react";
import {
  type LayoutChangeEvent,
  type StyleProp,
  View,
  type ViewStyle,
} from "react-native";
import Svg, { Path } from "react-native-svg";

const NOTCH_TOP_TANGENT_FACTOR = 0.25;
const NOTCH_BOTTOM_TANGENT_FACTOR = 0.2;

export interface NotchedRectProps {
  readonly height: number;
  readonly notchWidth: number;
  readonly notchDepth: number;
  readonly fill: string;
  readonly cornerRadius?: number;
  readonly notchCenterX?: number;
  readonly stroke?: string;
  readonly strokeWidth?: number;
  readonly style?: StyleProp<ViewStyle>;
}

interface BuildNotchedRectPathArgs {
  readonly width: number;
  readonly height: number;
  readonly cornerRadius: number;
  readonly notchWidth: number;
  readonly notchDepth: number;
  readonly notchCenterX: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function buildNotchedRectPath({
  width,
  height,
  cornerRadius,
  notchWidth,
  notchDepth,
  notchCenterX,
}: BuildNotchedRectPathArgs): string {
  const radius = clamp(cornerRadius, 0, Math.min(width, height) / 2);
  const depth = clamp(notchDepth, 0, height - radius);
  const safeNotchHalfWidth = Math.min(notchWidth / 2, width / 2 - radius);
  const safeNotchCenterX = clamp(
    notchCenterX,
    radius + safeNotchHalfWidth,
    width - radius - safeNotchHalfWidth,
  );
  const notchStartX = safeNotchCenterX - safeNotchHalfWidth;
  const notchEndX = safeNotchCenterX + safeNotchHalfWidth;
  const topTangent = safeNotchHalfWidth * 2 * NOTCH_TOP_TANGENT_FACTOR;
  const bottomTangent = safeNotchHalfWidth * 2 * NOTCH_BOTTOM_TANGENT_FACTOR;
  const hasRoundedCorners = radius > 0;
  const hasNotch = safeNotchHalfWidth > 0 && depth > 0;

  const segments: string[] = [`M ${radius} 0`];

  if (hasNotch) {
    segments.push(
      `H ${notchStartX}`,
      `C ${notchStartX + topTangent} 0, ${safeNotchCenterX - bottomTangent} ${depth}, ${safeNotchCenterX} ${depth}`,
      `C ${safeNotchCenterX + bottomTangent} ${depth}, ${notchEndX - topTangent} 0, ${notchEndX} 0`,
    );
  }

  segments.push(`H ${width - radius}`);

  if (hasRoundedCorners) {
    segments.push(`A ${radius} ${radius} 0 0 1 ${width} ${radius}`);
  }

  segments.push(`V ${height - radius}`);

  if (hasRoundedCorners) {
    segments.push(`A ${radius} ${radius} 0 0 1 ${width - radius} ${height}`);
  }

  segments.push(`H ${radius}`);

  if (hasRoundedCorners) {
    segments.push(`A ${radius} ${radius} 0 0 1 0 ${height - radius}`);
  }

  segments.push(`V ${radius}`);

  if (hasRoundedCorners) {
    segments.push(`A ${radius} ${radius} 0 0 1 ${radius} 0`);
  }

  segments.push("Z");

  return segments.join(" ");
}

export const NotchedRect = memo<NotchedRectProps>(
  ({
    height,
    notchWidth,
    notchDepth,
    fill,
    cornerRadius = 0,
    notchCenterX,
    stroke,
    strokeWidth,
    style,
  }) => {
    const [width, setWidth] = useState(0);

    const handleLayout = (event: LayoutChangeEvent) => {
      const nextWidth = event.nativeEvent.layout.width;
      setWidth((currentWidth) =>
        currentWidth === nextWidth ? currentWidth : nextWidth,
      );
    };

    const pathData = useMemo(() => {
      if (width <= 0 || height <= 0) {
        return null;
      }

      return buildNotchedRectPath({
        width,
        height,
        cornerRadius,
        notchWidth,
        notchDepth,
        notchCenterX: notchCenterX ?? width / 2,
      });
    }, [cornerRadius, height, notchCenterX, notchDepth, notchWidth, width]);

    return (
      <View onLayout={handleLayout} style={[{ height }, style]}>
        {pathData == null ? null : (
          <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <Path
              d={pathData}
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
            />
          </Svg>
        )}
      </View>
    );
  },
);

NotchedRect.displayName = "NotchedRect";
