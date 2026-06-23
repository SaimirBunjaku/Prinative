import { ReactNode } from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { spring } from '../constants/motion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ScalePressableProps {
  onPress: () => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  scaleTo?: number;
}

export function ScalePressable({
  onPress,
  children,
  style,
  disabled = false,
  scaleTo = 0.92,
}: ScalePressableProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => {
        scale.value = withSpring(scaleTo, spring.snappy);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, spring.bouncy);
      }}
      style={[animatedStyle, style]}
    >
      {children}
    </AnimatedPressable>
  );
}
