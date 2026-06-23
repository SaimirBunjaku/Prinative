import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { colors, radius, spacing, typography } from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'filled' | 'tinted' | 'plain' | 'destructive';
  disabled?: boolean;
  loading?: boolean;
  destructive?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function Button({
  title,
  onPress,
  variant = 'filled',
  disabled = false,
  loading = false,
  destructive = false,
  style,
  textStyle,
  icon,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const accentColor = destructive ? colors.destructive : colors.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        destructive && variant === 'tinted' && styles.tintedDestructive,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'filled' || variant === 'destructive' ? '#FFF' : accentColor}
        />
      ) : (
        <View style={styles.content}>
          {icon ? (
            <Ionicons
              name={icon}
              size={18}
              color={
                variant === 'filled' || variant === 'destructive'
                  ? '#FFFFFF'
                  : accentColor
              }
              style={styles.icon}
            />
          ) : null}
          <Text
            style={[
              styles.text,
              styles[`${variant}Text`],
              destructive && (variant === 'plain' || variant === 'tinted') && { color: accentColor },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: spacing.sm,
  },
  filled: {
    backgroundColor: colors.primary,
  },
  tinted: {
    backgroundColor: 'rgba(0, 122, 255, 0.12)',
  },
  tintedDestructive: {
    backgroundColor: 'rgba(255, 59, 48, 0.12)',
  },
  plain: {
    backgroundColor: colors.groupedBackground,
  },
  destructive: {
    backgroundColor: colors.destructive,
  },
  pressed: {
    opacity: 0.72,
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    ...typography.headline,
    fontSize: 17,
  },
  filledText: {
    color: '#FFFFFF',
  },
  tintedText: {
    color: colors.primary,
  },
  plainText: {
    color: colors.primary,
  },
  destructiveText: {
    color: '#FFFFFF',
  },
});
