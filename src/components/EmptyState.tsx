import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { colors, spacing, typography } from '../constants/theme';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
}

export function EmptyState({ icon, title, message }: EmptyStateProps) {
  return (
    <Animated.View
      entering={FadeInUp.springify().damping(20).stiffness(160)}
      style={styles.container}
    >
      <Animated.View entering={FadeInUp.delay(80).springify()} style={styles.iconWrap}>
        <Ionicons name={icon} size={40} color={colors.textTertiary} />
      </Animated.View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxl,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.fillSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.title3,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    ...typography.subhead,
    textAlign: 'center',
    lineHeight: 22,
    color: colors.textTertiary,
  },
});
