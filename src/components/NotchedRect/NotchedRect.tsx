import { memo, useMemo, useRef, useState } from "react";
import {
  type LayoutChangeEvent,
  type StyleProp,
  View,
  type ViewStyle,
} from "react-native";
import Svg, { Defs, FeDropShadow, Filter, Path } from "react-native-svg";

const NOTCH_TOP_TANGENT_FACTOR = 0.25;
const NOTCH_BOTTOM_TANGENT_FACTOR = 0.2;

export interface NotchedRectDropShadow {
  readonly color: string;
  readonly blur: number;
  readonly dx?: number;
  readonly dy?: number;
  readonly opacity?: number;
}

export interface NotchedRectProps {
  readonly height: number;
  readonly notchWidth: number;
  readonly notchDepth: number;
  readonly fill: string;
  readonly cornerRadius?: number;
  readonly notchCenterX?: number;
  readonly stroke?: string;
  readonly strokeWidth?: number;
  readonly shadow?: NotchedRectDropShadow;
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

interface ShadowGeometry {
  readonly padLeft: number;
  readonly padRight: number;
  readonly padTop: number;
  readonly padBottom: number;
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

function computeShadowGeometry(
  shadow: NotchedRectDropShadow | undefined,
): ShadowGeometry {
  if (shadow == null) {
    return { padLeft: 0, padRight: 0, padTop: 0, padBottom: 0 };
  }

  const dx = shadow.dx ?? 0;
  const dy = shadow.dy ?? 0;
  const blur = Math.max(0, shadow.blur);

  return {
    padLeft: Math.ceil(blur + Math.max(0, -dx)),
    padRight: Math.ceil(blur + Math.max(0, dx)),
    padTop: Math.ceil(blur + Math.max(0, -dy)),
    padBottom: Math.ceil(blur + Math.max(0, dy)),
  };
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
    shadow,
    style,
  }) => {
    const [width, setWidth] = useState(0);
    const filterIdRef = useRef(
      `notched-rect-shadow-${Math.random().toString(36).slice(2, 10)}`,
    );

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

    const shadowGeometry = useMemo(
      () => computeShadowGeometry(shadow),
      [shadow],
    );

    if (pathData == null) {
      return <View onLayout={handleLayout} style={[{ height }, style]} />;
    }

    const hasShadow = shadow != null;
    const svgWidth =
      width + shadowGeometry.padLeft + shadowGeometry.padRight;
    const svgHeight =
      height + shadowGeometry.padTop + shadowGeometry.padBottom;
    const pathTransform = hasShadow
      ? `translate(${shadowGeometry.padLeft} ${shadowGeometry.padTop})`
      : undefined;
    const pathFilter = hasShadow ? `url(#${filterIdRef.current})` : undefined;
    const svgStyle = hasShadow
      ? {
          position: "absolute" as const,
          top: -shadowGeometry.padTop,
          left: -shadowGeometry.padLeft,
        }
      : undefined;

    return (
      <View onLayout={handleLayout} style={[{ height }, style]}>
        <Svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={svgStyle}
        >
          {hasShadow ? (
            <Defs>
              <Filter
                id={filterIdRef.current}
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <FeDropShadow
                  dx={shadow.dx ?? 0}
                  dy={shadow.dy ?? 0}
                  stdDeviation={shadow.blur / 2}
                  floodColor={shadow.color}
                  floodOpacity={shadow.opacity ?? 1}
                />
              </Filter>
            </Defs>
          ) : null}
          <Path
            d={pathData}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            transform={pathTransform}
            filter={pathFilter}
          />
        </Svg>
      </View>
    );
  },
);

NotchedRect.displayName = "NotchedRect";
