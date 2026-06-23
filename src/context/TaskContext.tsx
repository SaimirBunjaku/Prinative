import { createContext, ReactNode, useContext } from 'react';
import { useTasks, UseTasksReturn } from '../hooks/useTasks';

const TaskContext = createContext<UseTasksReturn | null>(null);

export function TaskProvider({ children }: { children: ReactNode }) {
  const taskState = useTasks();

  return (
    <TaskContext.Provider value={taskState}>{children}</TaskContext.Provider>
  );
}

export function useTaskContext(): UseTasksReturn {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }

  return context;
}
