import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, {
  FadeInDown,
  FadeOutRight,
} from 'react-native-reanimated';
import { Task } from '../types/task';
import { AnimatedCheckbox } from './AnimatedCheckbox';
import { colors, spacing, typography } from '../constants/theme';
import { duration, stagger } from '../constants/motion';
import { lightImpact, successNotification } from '../utils/haptics';

interface TaskItemProps {
  task: Task;
  index: number;
  onPress: () => void;
  onToggle: () => void;
  onDelete: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

function DeleteAction({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.deleteAction}>
      <Ionicons name="trash" size={22} color="#FFFFFF" />
      <Text style={styles.deleteLabel}>Delete</Text>
    </Pressable>
  );
}

export function TaskItem({
  task,
  index,
  onPress,
  onToggle,
  onDelete,
  isFirst = false,
  isLast = false,
}: TaskItemProps) {
  const handleToggle = async () => {
    if (!task.completed) {
      await successNotification();
    } else {
      await lightImpact();
    }
    onToggle();
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * stagger.item)
        .springify()
        .damping(20)
        .stiffness(180)}
      exiting={FadeOutRight.duration(duration.normal)}
    >
      <Swipeable
        overshootRight={false}
        friction={2}
        rightThreshold={48}
        renderRightActions={() => <DeleteAction onPress={onDelete} />}
        containerStyle={[
          styles.swipeContainer,
          isFirst && styles.wrapperFirst,
          isLast && styles.wrapperLast,
        ]}
      >
        <View
          style={[
            styles.wrapper,
            !isLast && styles.wrapperBorder,
          ]}
        >
          <AnimatedCheckbox completed={task.completed} onPress={handleToggle} />

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

          <Ionicons
            name="chevron-forward"
            size={18}
            color={colors.textTertiary}
            style={styles.chevron}
          />
        </View>
      </Swipeable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  swipeContainer: {
    backgroundColor: colors.groupedBackground,
    overflow: 'hidden',
  },
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
  chevron: {
    opacity: 0.35,
    marginRight: 4,
  },
  pressed: {
    opacity: 0.55,
  },
  deleteAction: {
    width: 88,
    backgroundColor: colors.destructive,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  deleteLabel: {
    ...typography.caption,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
