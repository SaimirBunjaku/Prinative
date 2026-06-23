import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius, shadows } from '../constants/theme';

interface GroupedSectionProps {
  children: ReactNode;
  style?: ViewStyle;
}

export function GroupedSection({ children, style }: GroupedSectionProps) {
  return <View style={[styles.section, style]}>{children}</View>;
}

interface GroupedRowProps {
  children: ReactNode;
  isFirst?: boolean;
  isLast?: boolean;
  style?: ViewStyle;
}

export function GroupedRow({
  children,
  isFirst = false,
  isLast = false,
  style,
}: GroupedRowProps) {
  return (
    <View
      style={[
        styles.row,
        isFirst && styles.rowFirst,
        isLast && styles.rowLast,
        !isLast && styles.rowBorder,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: colors.groupedBackground,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: 20,
    ...shadows.card,
  },
  row: {
    backgroundColor: colors.groupedBackground,
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 44,
    justifyContent: 'center',
  },
  rowFirst: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  rowLast: {
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
  },
});
