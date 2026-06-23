import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Task } from '../types/task';
import { colors, spacing, typography } from '../constants/theme';
import { lightImpact } from '../utils/haptics';

interface TaskItemProps {
  task: Task;
  onPress: () => void;
  onToggle: () => void;
  onDelete: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export function TaskItem({
  task,
  onPress,
  onToggle,
  onDelete,
  isFirst = false,
  isLast = false,
}: TaskItemProps) {
  const handleToggle = async () => {
    await lightImpact();
    onToggle();
  };

  return (
    <View
      style={[
        styles.wrapper,
        isFirst && styles.wrapperFirst,
        isLast && styles.wrapperLast,
        !isLast && styles.wrapperBorder,
      ]}
    >
      <Pressable
        onPress={handleToggle}
        hitSlop={10}
        style={({ pressed }) => [styles.checkboxHit, pressed && styles.pressed]}
      >
        <View style={[styles.checkbox, task.completed && styles.checkboxDone]}>
          {task.completed ? (
            <Ionicons name="checkmark" size={14} color="#FFFFFF" />
          ) : null}
        </View>
      </Pressable>

      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.content, pressed && styles.pressed]}
      >
        <Text
          style={[styles.title, task.completed && styles.titleDone]}
          numberOfLines={1}
        >
          {task.title}
        </Text>
        {task.description ? (
          <Text style={styles.description} numberOfLines={1}>
            {task.description}
          </Text>
        ) : null}
      </Pressable>

      <Pressable
        onPress={onDelete}
        hitSlop={10}
        style={({ pressed }) => [styles.deleteHit, pressed && styles.pressed]}
      >
        <Ionicons name="trash-outline" size={20} color={colors.textTertiary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.groupedBackground,
    paddingLeft: spacing.lg,
    paddingRight: spacing.md,
    minHeight: 64,
  },
  wrapperFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  wrapperLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  wrapperBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
  },
  checkboxHit: {
    paddingVertical: spacing.md,
    paddingRight: spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.textTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  content: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingRight: spacing.sm,
  },
  title: {
    ...typography.body,
    fontWeight: '500',
  },
  titleDone: {
    color: colors.textTertiary,
    textDecorationLine: 'line-through',
  },
  description: {
    ...typography.footnote,
    marginTop: 2,
    color: colors.textTertiary,
  },
  deleteHit: {
    padding: spacing.sm,
  },
  pressed: {
    opacity: 0.55,
  },
});
