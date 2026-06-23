import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLayoutEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { useTaskContext } from '../context/TaskContext';
import { colors, radius, shadows, spacing, typography } from '../constants/theme';
import { RootStackParamList } from '../navigation/types';
import { confirmDeleteTask } from '../utils/confirm';
import { lightImpact, successNotification } from '../utils/haptics';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskDetails'>;

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatRelativeDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function TaskDetailsScreen({ route, navigation }: Props) {
  const { taskId } = route.params;
  const { getTaskById, toggleTask, deleteTask } = useTaskContext();
  const insets = useSafeAreaInsets();
  const task = getTaskById(taskId);

  useLayoutEffect(() => {
    if (!task) {
      navigation.setOptions({ headerRight: undefined });
      return;
    }

    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => navigation.navigate('EditTask', { taskId: task.id })}
          hitSlop={8}
          style={styles.headerEdit}
        >
          <Text style={styles.headerEditText}>Edit</Text>
        </Pressable>
      ),
    });
  }, [navigation, task]);

  if (!task) {
    return (
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <EmptyState
          icon="document-outline"
          title="Task Not Found"
          message="This task may have been deleted."
        />
        <View style={styles.footer}>
          <Button title="Go Back" variant="tinted" onPress={() => navigation.goBack()} />
        </View>
      </View>
    );
  }

  const handleToggle = async () => {
    await successNotification();
    toggleTask(task.id);
  };

  const handleDelete = async () => {
    const confirmed = await confirmDeleteTask(task.title);
    if (confirmed) {
      await lightImpact();
      deleteTask(task.id);
      navigation.goBack();
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + spacing.xl },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.heroCard, shadows.card]}>
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusPill,
              task.completed ? styles.statusDone : styles.statusPending,
            ]}
          >
            <Ionicons
              name={task.completed ? 'checkmark-circle' : 'time-outline'}
              size={14}
              color={task.completed ? colors.success : colors.textTertiary}
            />
            <Text
              style={[
                styles.statusLabel,
                task.completed && styles.statusLabelDone,
              ]}
            >
              {task.completed ? 'Completed' : 'To Do'}
            </Text>
          </View>
          <Text style={styles.dateMeta}>{formatRelativeDate(task.createdDate)}</Text>
        </View>

        <Text style={styles.heroTitle}>{task.title}</Text>
        <Text style={styles.heroDescription}>
          {task.description || 'No additional notes.'}
        </Text>
      </View>

      <Text style={styles.sectionLabel}>INFORMATION</Text>
      <View style={[styles.group, shadows.card]}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={20} color={colors.primary} />
          <View style={styles.infoText}>
            <Text style={styles.infoLabel}>Created</Text>
            <Text style={styles.infoValue}>{formatDate(task.createdDate)}</Text>
          </View>
        </View>
        <View style={[styles.infoRow, styles.infoRowBorder]}>
          <Ionicons
            name={task.completed ? 'checkmark-circle-outline' : 'ellipse-outline'}
            size={20}
            color={colors.primary}
          />
          <View style={styles.infoText}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={styles.infoValue}>
              {task.completed ? 'Marked as done' : 'Still in progress'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          title="Edit Task"
          variant="tinted"
          icon="create-outline"
          onPress={() => navigation.navigate('EditTask', { taskId: task.id })}
        />
        <Button
          title={task.completed ? 'Mark as To Do' : 'Mark as Done'}
          variant="tinted"
          icon={task.completed ? 'arrow-undo-outline' : 'checkmark-outline'}
          onPress={handleToggle}
        />
        <Button
          title="Delete Task"
          variant="plain"
          destructive
          icon="trash-outline"
          onPress={handleDelete}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  heroCard: {
    backgroundColor: colors.groupedBackground,
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    gap: spacing.xs,
  },
  statusPending: {
    backgroundColor: colors.fill,
  },
  statusDone: {
    backgroundColor: 'rgba(52, 199, 89, 0.12)',
  },
  statusLabel: {
    ...typography.footnote,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  statusLabelDone: {
    color: colors.success,
  },
  dateMeta: {
    ...typography.footnote,
    color: colors.textTertiary,
  },
  heroTitle: {
    ...typography.title2,
    marginBottom: spacing.sm,
  },
  heroDescription: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 26,
  },
  sectionLabel: {
    ...typography.footnote,
    fontWeight: '500',
    color: colors.textTertiary,
    marginBottom: spacing.sm,
    marginLeft: spacing.sm,
    letterSpacing: 0.5,
  },
  group: {
    backgroundColor: colors.groupedBackground,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  infoRowBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.separator,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    ...typography.footnote,
    color: colors.textTertiary,
    marginBottom: 2,
  },
  infoValue: {
    ...typography.body,
    fontWeight: '500',
  },
  actions: {
    gap: spacing.sm,
  },
  headerEdit: {
    paddingHorizontal: spacing.sm,
  },
  headerEditText: {
    ...typography.body,
    color: colors.primary,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
});
