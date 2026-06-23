import { useEffect, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors, radius, spacing, typography } from '../constants/theme';
import { spring } from '../constants/motion';

interface ProgressBarProps {
  completed: number;
  total: number;
}

export function ProgressBar({ completed, total }: ProgressBarProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const ratio = total === 0 ? 0 : completed / total;
  const progress = useSharedValue(ratio);

  useEffect(() => {
    progress.value = withSpring(total === 0 ? 0 : completed / total, spring.soft);
  }, [completed, total, progress]);

  const onLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  };

  const fillStyle = useAnimatedStyle(() => ({
    width: trackWidth * progress.value,
  }));

  const percent = Math.round(ratio * 100);

  return (
    <View style={styles.wrap}>
      <View style={styles.labels}>
        <Text style={styles.label}>Progress</Text>
        <Text style={styles.percent}>{percent}%</Text>
      </View>
      <View style={styles.track} onLayout={onLayout}>
        <Animated.View style={[styles.fill, fillStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.md,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    paddingHorizontal: 2,
  },
  label: {
    ...typography.footnote,
    fontWeight: '500',
    color: colors.textTertiary,
  },
  percent: {
    ...typography.footnote,
    fontWeight: '600',
    color: colors.primary,
  },
  track: {
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.fill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
});
