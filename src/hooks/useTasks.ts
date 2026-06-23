import { useCallback, useEffect, useState } from 'react';
import { Task } from '../types/task';
import { fetchTasksFromApi, hydrateStoredTasks } from '../services/taskService';
import { loadTasks, saveTasks } from '../services/storageService';

function generateId(): string {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    initializeTasks();
  }, []);

  useEffect(() => {
    if (!loading) {
      saveTasks(tasks);
    }
  }, [tasks, loading]);

  const initializeTasks = async () => {
    try {
      setError(null);
      const stored = await loadTasks();

      if (stored && stored.length > 0) {
        setTasks(hydrateStoredTasks(stored));
      } else {
        const apiTasks = await fetchTasksFromApi();
        setTasks(apiTasks);
      }
    } catch {
      setError('Unable to load tasks. Pull down to try again.');
    } finally {
      setLoading(false);
    }
  };

  const addTask = useCallback((title: string, description: string) => {
    const newTask: Task = {
      id: generateId(),
      title: title.trim(),
      description: description.trim(),
      completed: false,
      createdDate: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, []);

  const updateTask = useCallback(
    (id: string, title: string, description: string) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? {
                ...task,
                title: title.trim(),
                description: description.trim(),
                edited: true,
              }
            : task
        )
      );
    },
    []
  );

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const getTaskById = useCallback(
    (id: string) => tasks.find((task) => task.id === id),
    [tasks]
  );

  const refreshFromApi = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const apiTasks = await fetchTasksFromApi();
      setTasks((prev) => {
        const localTasks = prev.filter((task) => task.id.startsWith('local-'));
        const editedApiTasks = prev.filter(
          (task) => task.id.startsWith('api-') && task.edited
        );
        const editedIds = new Set(editedApiTasks.map((task) => task.id));
        const freshApiTasks = apiTasks.filter((task) => !editedIds.has(task.id));
        return [...localTasks, ...editedApiTasks, ...freshApiTasks];
      });
    } catch {
      setError('Unable to refresh tasks.');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    allTasks: tasks,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    getTaskById,
    refreshFromApi,
  };
}

export type UseTasksReturn = ReturnType<typeof useTasks>;
