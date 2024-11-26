export interface Task {
  id: number;
  title: string;
  completed: boolean;
  date: string;
}

export type TaskFilter = "all" | "completed" | "incomplete";
export type TaskSort = "date-asc" | "date-desc";
