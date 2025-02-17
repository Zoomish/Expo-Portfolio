import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, useColorScheme } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface FloatingObjectProps {
  icon: keyof typeof Ionicons.glyphMap;
  delay?: number;
  position?: { top?: number; left?: number; right?: number; bottom?: number };
  onPress?: () => void;
}

export default function FloatingObject({
  icon,
  delay = 0,
  position,
  onPress,
}: FloatingObjectProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  React.useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(withSequence(withSpring(-10), withSpring(10)), -1, true)
    );

    rotate.value = withDelay(
      delay,
      withRepeat(withSequence(withSpring(-0.1), withSpring(0.1)), -1, true)
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotate.value}rad` },
    ],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(1.2);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={[styles.container, animatedStyle, position]}
    >
      <Ionicons name={icon} size={24} color={colors.text} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
