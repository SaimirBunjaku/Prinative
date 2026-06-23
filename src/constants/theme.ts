import { Platform, TextStyle } from 'react-native';

export const colors = {
  primary: '#007AFF',
  primaryPressed: '#0062CC',
  background: '#F2F2F7',
  groupedBackground: '#FFFFFF',
  text: '#000000',
  textSecondary: '#3C3C43',
  textTertiary: '#8E8E93',
  separator: 'rgba(60, 60, 67, 0.12)',
  fill: 'rgba(120, 120, 128, 0.12)',
  fillSecondary: 'rgba(120, 120, 128, 0.08)',
  destructive: '#FF3B30',
  success: '#34C759',
  tabBar: Platform.select({
    ios: 'rgba(255, 255, 255, 0.94)',
    default: '#FFFFFF',
  }),
  overlay: 'rgba(0, 0, 0, 0.4)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 16,
  full: 999,
};

export const typography = {
  largeTitle: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 0.37,
    color: colors.text,
  } as TextStyle,
  title2: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.35,
    color: colors.text,
  } as TextStyle,
  title3: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.38,
    color: colors.text,
  } as TextStyle,
  headline: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.41,
    color: colors.text,
  } as TextStyle,
  body: {
    fontSize: 17,
    fontWeight: '400',
    letterSpacing: -0.41,
    color: colors.text,
  } as TextStyle,
  callout: {
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: -0.32,
    color: colors.textSecondary,
  } as TextStyle,
  subhead: {
    fontSize: 15,
    fontWeight: '400',
    letterSpacing: -0.24,
    color: colors.textSecondary,
  } as TextStyle,
  footnote: {
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: -0.08,
    color: colors.textTertiary,
  } as TextStyle,
  caption: {
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0,
    color: colors.textTertiary,
  } as TextStyle,
};

export const shadows = {
  card: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
    },
    default: { elevation: 1 },
  }),
};
