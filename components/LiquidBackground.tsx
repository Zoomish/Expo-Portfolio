import Colors from '@/constants/Colors';
import React, { useEffect } from 'react';
import { StyleSheet, useColorScheme, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function LiquidBackground() {
  const { width, height } = useWindowDimensions();
  const progress = useSharedValue(0);
  const scale = useSharedValue(1);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const gesture = Gesture.Pan()
    .onBegin(() => {
      scale.value = withSpring(1.2);
    })
    .onFinalize(() => {
      scale.value = withSpring(1);
    });

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 8000 }), -1, true);
  }, []);

  const path = useDerivedValue(() => {
    const p = progress.value;

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.25;

    const points = Array.from({ length: 12 }).map((_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      const variance = radius * 0.4;

      const r =
        radius * scale.value +
        interpolate(
          p,
          [0, 1],
          [
            -variance + Math.sin(i * 3 + p * Math.PI * 2) * variance,
            variance + Math.cos(i * 2 + p * Math.PI * 2) * variance,
          ]
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
    <GestureDetector gesture={gesture}>
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
            {colors.gradient.map((color, index) => (
              <Stop
                key={color}
                offset={`${(index * 100) / (colors.gradient.length - 1)}%`}
                stopColor={color}
                stopOpacity="0.6"
              />
            ))}
          </LinearGradient>
        </Defs>
        <AnimatedPath animatedProps={animatedProps} fill="url(#gradient)" />
      </Svg>
    </GestureDetector>
  );
}
