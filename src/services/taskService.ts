import { Task } from '../types/task';

const API_URL = 'https://jsonplaceholder.typicode.com/todos?_limit=10';

interface ApiTodo {
  id: number;
  completed: boolean;
}

export const SEED_TASKS: Omit<Task, 'id' | 'completed' | 'createdDate'>[] = [
  {
    title: 'Buy groceries',
    description: 'Milk, eggs, whole wheat bread, bananas, and coffee beans.',
  },
  {
    title: 'Schedule dentist appointment',
    description: 'Call for a routine check-up — ask for a morning slot next week.',
  },
  {
    title: 'Finish project proposal',
    description: 'Review the budget section and send the draft to the team by Friday.',
  },
  {
    title: 'Morning run',
    description: '5 km around the park before work. Bring water and earbuds.',
  },
  {
    title: 'Pay electricity bill',
    description: 'Due on the 28th. Pay through the utility app to avoid late fees.',
  },
  {
    title: 'Call mom',
    description: 'Catch up about the weekend plans and her garden project.',
  },
  {
    title: 'Organize desk',
    description: 'Sort papers, wipe down the surface, and label the cable box.',
  },
  {
    title: 'Read 30 pages',
    description: 'Continue Atomic Habits — chapter on habit stacking.',
  },
  {
    title: 'Water the plants',
    description: 'Living room fern and balcony herbs need watering today.',
  },
  {
    title: 'Prepare presentation',
    description: 'Finalize slides for Monday stand-up. Include the Q3 metrics chart.',
  },
];

function daysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function templateForApiId(apiId: number) {
  return SEED_TASKS[(apiId - 1) % SEED_TASKS.length];
}

function buildApiTask(todo: ApiTodo): Task {
  const template = templateForApiId(todo.id);

  return {
    id: `api-${todo.id}`,
    title: template.title,
    description: template.description,
    completed: todo.completed,
    createdDate: daysAgo(todo.id),
  };
}

/** Re-apply seed content to API tasks that haven't been edited by the user. */
export function hydrateStoredTasks(tasks: Task[]): Task[] {
  return tasks.map((task) => {
    if (!task.id.startsWith('api-') || task.edited) return task;

    const apiId = parseInt(task.id.replace('api-', ''), 10);
    if (Number.isNaN(apiId)) return task;

    const template = templateForApiId(apiId);
    return {
      ...task,
      title: template.title,
      description: template.description,
    };
  });
}

export async function fetchTasksFromApi(): Promise<Task[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error('Failed to fetch tasks from API');
  }

  const data: ApiTodo[] = await response.json();
  return data.map(buildApiTask);
}
