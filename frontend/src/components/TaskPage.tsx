import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskForm } from './TaskForm';
import { TaskList } from './TaskList';
import { TaskFilter, TaskSort, Task } from '@/lib/types';
import TaskFilterForm from "./TaskFilterForm";
import TaskSortForm from "./TaskSortForm";

interface TaskPageProps {
  tasks: Task[];
  filter: TaskFilter;
  setFilter: (filter: TaskFilter) => void;
  sort: TaskSort;
  setSort: (sort: TaskSort) => void;
  addTask: (newTask: Omit<Task, 'id'>) => Promise<void>;
  deleteTask: (taskId: number) => Promise<void>;
  toggleTask: (taskId: number) => Promise<void>;
  updateTask: (taskId: number, updatedTask: Omit<Task, 'id'>) => Promise<void>;
}

const TaskPage = ({
  tasks,
  filter,
  setFilter,
  sort,
  setSort,
  addTask,
  deleteTask,
  toggleTask,
  updateTask,
}: TaskPageProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Список задач</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 space-y-2">
            <TaskFilterForm filter={filter} setFilter={setFilter} />
            <TaskSortForm sort={sort} setSort={setSort} />
          </div>
          <TaskForm onAdd={addTask} />
          <TaskList tasks={tasks} onDelete={deleteTask} onToggle={toggleTask} onUpdate={updateTask} />
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskPage;
