export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdDate: string;
  edited?: boolean;
}

export type StatusFilter = 'all' | 'completed' | 'pending';
