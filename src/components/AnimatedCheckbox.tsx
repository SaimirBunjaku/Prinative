import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '../constants/theme';
import { spring } from '../constants/motion';

interface AnimatedCheckboxProps {
  completed: boolean;
  onPress: () => void;
}

export function AnimatedCheckbox({ completed, onPress }: AnimatedCheckboxProps) {
  const progress = useSharedValue(completed ? 1 : 0);
  const bounce = useSharedValue(1);

  useEffect(() => {
    progress.value = withSpring(completed ? 1 : 0, spring.snappy);

    if (completed) {
      bounce.value = withSequence(
        withSpring(1.18, { damping: 8, stiffness: 420 }),
        withSpring(1, spring.bouncy)
      );
    }
  }, [completed, bounce, progress]);

  const boxStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bounce.value }],
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ['rgba(0,0,0,0)', colors.primary]
    ),
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [colors.textTertiary, colors.primary]
    ),
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: 0.5 + progress.value * 0.5 }],
  }));

  return (
    <Pressable onPress={onPress} hitSlop={10} style={styles.hit}>
      <Animated.View style={[styles.box, boxStyle]}>
        <Animated.View style={checkStyle}>
          <Ionicons name="checkmark" size={14} color="#FFFFFF" />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    paddingVertical: 12,
    paddingRight: 16,
  },
  box: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
