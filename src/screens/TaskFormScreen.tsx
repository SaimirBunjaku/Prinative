import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useLayoutEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTaskContext } from '../context/TaskContext';
import { colors, radius, shadows, spacing, typography } from '../constants/theme';
import { RootStackParamList } from '../navigation/types';
import { successNotification } from '../utils/haptics';

type AddProps = NativeStackScreenProps<RootStackParamList, 'AddTask'>;
type EditProps = NativeStackScreenProps<RootStackParamList, 'EditTask'>;
type Props = AddProps | EditProps;

export function TaskFormScreen({ navigation, route }: Props) {
  const isEditing = route.name === 'EditTask';
  const taskId = isEditing ? route.params.taskId : undefined;
  const { addTask, updateTask, getTaskById } = useTaskContext();
  const existing = taskId ? getTaskById(taskId) : undefined;

  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState(existing?.title ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [titleError, setTitleError] = useState('');

  const canSave = title.trim().length >= 3;

  const handleSave = useCallback(async () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setTitleError('A title is required.');
      return;
    }

    if (trimmedTitle.length < 3) {
      setTitleError('Title must be at least 3 characters.');
      return;
    }

    if (isEditing && taskId) {
      updateTask(taskId, trimmedTitle, description);
    } else {
      addTask(trimmedTitle, description);
    }

    await successNotification();
    navigation.goBack();
  }, [addTask, description, isEditing, navigation, taskId, title, updateTask]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Edit Task' : 'New Task',
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Text style={styles.headerAction}>Cancel</Text>
        </Pressable>
      ),
      headerRight: () => (
        <Pressable onPress={handleSave} disabled={!canSave} hitSlop={8}>
          <Text
            style={[styles.headerAction, !canSave && styles.headerActionDisabled]}
          >
            {isEditing ? 'Save' : 'Add'}
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, handleSave, canSave, isEditing]);

  if (isEditing && !existing) {
    return (
      <ScrollView contentContainerStyle={styles.missing}>
        <Text style={styles.missingText}>This task no longer exists.</Text>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.headerAction}>Go Back</Text>
        </Pressable>
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionLabel}>TASK</Text>
        <View style={[styles.group, shadows.card]}>
          <View style={styles.field}>
            <TextInput
              style={styles.titleInput}
              placeholder="Title"
              placeholderTextColor={colors.textTertiary}
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (titleError) setTitleError('');
              }}
              maxLength={100}
              autoFocus={!isEditing}
              returnKeyType="next"
            />
          </View>
          <View style={[styles.field, styles.fieldBorder]}>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Notes"
              placeholderTextColor={colors.textTertiary}
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
              maxLength={300}
            />
          </View>
        </View>

        {titleError ? (
          <Text style={styles.errorText}>{titleError}</Text>
        ) : (
          <Text style={styles.hint}>
            {isEditing
              ? 'Update the title or notes, then tap Save.'
              : 'Add a clear title. Notes are optional but helpful.'}
          </Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  missing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  missingText: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
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
  },
  field: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  fieldBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.separator,
  },
  titleInput: {
    ...typography.body,
    fontSize: 17,
    padding: 0,
    color: colors.text,
  },
  descriptionInput: {
    ...typography.body,
    fontSize: 17,
    minHeight: 120,
    padding: 0,
    color: colors.text,
    lineHeight: 24,
  },
  errorText: {
    ...typography.footnote,
    color: colors.destructive,
    marginTop: spacing.sm,
    marginLeft: spacing.sm,
  },
  hint: {
    ...typography.footnote,
    color: colors.textTertiary,
    marginTop: spacing.sm,
    marginLeft: spacing.sm,
    lineHeight: 18,
  },
  headerAction: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '400',
    paddingHorizontal: spacing.sm,
  },
  headerActionDisabled: {
    opacity: 0.35,
  },
});
