import { CompositeScreenProps, useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useMemo, useRef } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { EmptyState } from '../components/EmptyState';
import { ProgressBar } from '../components/ProgressBar';
import { ScalePressable } from '../components/ScalePressable';
import { SearchField } from '../components/SearchField';
import { TaskItem } from '../components/TaskItem';
import { useTaskContext } from '../context/TaskContext';
import { colors, shadows, spacing, typography } from '../constants/theme';
import { MainTabParamList, RootStackParamList } from '../navigation/types';
import { StatusFilter } from '../types/task';
import { confirmDeleteTask } from '../utils/confirm';
import { lightImpact } from '../utils/haptics';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList>,
  NativeStackScreenProps<RootStackParamList>
>;

const TAB_FILTER: Record<keyof MainTabParamList, StatusFilter> = {
  All: 'all',
  Pending: 'pending',
  Completed: 'completed',
};

const TAB_TITLE: Record<keyof MainTabParamList, string> = {
  All: 'Tasks',
  Pending: 'To Do',
  Completed: 'Done',
};

const EMPTY_CONFIG: Record<
  keyof MainTabParamList,
  { icon: keyof typeof Ionicons.glyphMap; title: string; message: string }
> = {
  All: {
    icon: 'clipboard-outline',
    title: 'No Tasks Yet',
    message: 'Tap + to add your first task.',
  },
  Pending: {
    icon: 'sunny-outline',
    title: 'All Caught Up',
    message: 'Nothing pending. Enjoy the moment.',
  },
  Completed: {
    icon: 'checkmark-done-outline',
    title: 'Nothing Completed',
    message: 'Finished tasks will appear here.',
  },
};

export function TaskListScreen({ route }: Props) {
  const stackNav = useNavigation<NativeStackScreenProps<RootStackParamList>['navigation']>();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const scrollRef = useRef<ScrollView>(null);
  const statusFilter = TAB_FILTER[route.name];
  const screenTitle = TAB_TITLE[route.name];

  const {
    allTasks,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    toggleTask,
    deleteTask,
    refreshFromApi,
  } = useTaskContext();

  const tasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return allTasks.filter((task) => {
      const matchesSearch =
        query.length === 0 || task.title.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'completed' && task.completed) ||
        (statusFilter === 'pending' && !task.completed);

      return matchesSearch && matchesStatus;
    });
  }, [allTasks, searchQuery, statusFilter]);

  const completedCount = allTasks.filter((t) => t.completed).length;
  const pendingCount = allTasks.filter((t) => !t.completed).length;
  const isInitialLoading = loading && allTasks.length === 0;
  const hasSearch = searchQuery.trim().length > 0;
  const emptyConfig = EMPTY_CONFIG[route.name];

  const handleDelete = async (id: string, title: string) => {
    const confirmed = await confirmDeleteTask(title);
    if (confirmed) {
      await lightImpact();
      deleteTask(id);
    }
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        scrollRef.current?.scrollTo({ y: 0, animated: false });
      };
    }, [])
  );

  const isRefreshing = isFocused && loading && allTasks.length > 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Animated.View entering={FadeInDown.duration(400).springify()} style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.largeTitle}>{screenTitle}</Text>
          <Text style={styles.subtitle}>
            {route.name === 'All'
              ? `${allTasks.length} total · ${pendingCount} remaining`
              : `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'}`}
          </Text>
        </View>

        <ScalePressable
          onPress={() => stackNav.navigate('AddTask')}
          style={styles.addButton}
        >
          <Ionicons name="add" size={28} color={colors.primary} />
        </ScalePressable>
      </Animated.View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshFromApi}
            tintColor={colors.textTertiary}
          />
        }
      >
        {route.name === 'All' && allTasks.length > 0 ? (
          <Animated.View entering={FadeInDown.delay(60).springify()}>
            <ProgressBar completed={completedCount} total={allTasks.length} />
          </Animated.View>
        ) : null}

        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <SearchField value={searchQuery} onChangeText={setSearchQuery} />
        </Animated.View>

        {error ? (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle-outline" size={18} color={colors.destructive} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {isInitialLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="small" color={colors.textTertiary} />
            <Text style={styles.loadingText}>Loading tasks…</Text>
          </View>
        ) : tasks.length === 0 ? (
          <EmptyState
            icon={hasSearch ? 'search-outline' : emptyConfig.icon}
            title={hasSearch ? 'No Results' : emptyConfig.title}
            message={hasSearch ? 'Try a different search term.' : emptyConfig.message}
          />
        ) : (
          <View style={[styles.listGroup, shadows.card]}>
            {tasks.map((task, index) => (
              <TaskItem
                key={task.id}
                task={task}
                index={index}
                isFirst={index === 0}
                isLast={index === tasks.length - 1}
                onPress={() => stackNav.navigate('TaskDetails', { taskId: task.id })}
                onToggle={() => toggleTask(task.id)}
                onDelete={() => handleDelete(task.id, task.title)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  headerText: {
    flex: 1,
    paddingRight: spacing.md,
  },
  largeTitle: {
    ...typography.largeTitle,
  },
  subtitle: {
    ...typography.subhead,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 122, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
  },
  listGroup: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.groupedBackground,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.08)',
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  errorText: {
    ...typography.subhead,
    color: colors.destructive,
    flex: 1,
  },
  loadingWrap: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
    gap: spacing.md,
  },
  loadingText: {
    ...typography.subhead,
    color: colors.textTertiary,
  },
});
