import React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { useEffect } from 'react';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function LiquidBackground() {
  const { width, height } = useWindowDimensions();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 10000 }),
      -1,
      true
    );
  }, []);

  const path = useDerivedValue(() => {
    const p = progress.value;
    
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.3;
    
    const points = Array.from({ length: 8 }).map((_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      const variance = radius * 0.3;
      
      const r = radius + interpolate(
        p,
        [0, 1],
        [-variance + Math.sin(i * 2) * variance, variance + Math.cos(i * 2) * variance]
      );
      
      return {
        x: centerX + Math.cos(angle) * r,
        y: centerY + Math.sin(angle) * r,
      };
    });

    const d = points.reduce((acc, point, i) => {
      if (i === 0) return `M ${point.x} ${point.y}`;
      const prevPoint = points[i - 1];
      const nextPoint = points[(i + 1) % points.length];
      
      const cp1x = prevPoint.x + (point.x - prevPoint.x) * 0.5;
      const cp1y = prevPoint.y + (point.y - prevPoint.y) * 0.5;
      const cp2x = point.x + (nextPoint.x - point.x) * 0.5;
      const cp2y = point.y + (nextPoint.y - point.y) * 0.5;
      
      return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${point.x} ${point.y}`;
    }, '');

    return d + ' Z';
  });

  const animatedProps = useAnimatedProps(() => ({
    d: path.value,
  }));

  return (
    <Svg style={StyleSheet.absoluteFill}>
      <AnimatedPath
        animatedProps={animatedProps}
        fill="url(#gradient)"
        opacity={0.8}
      />
    </Svg>
  );
}