import { useState } from "react";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeProvider } from "@/components/theme-provider";
import { TaskFilter, TaskSort } from "./lib/types";
import useFilterAndSortTasks from "./components/hooks/useFilterAndSortTasks";
import useTaskManager from "./components/hooks/useTaskManager";

const App: React.FC = () => {
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [sort, setSort] = useState<TaskSort>("date-desc");

  const { toast } = useToast();

  const { tasks, addTask, deleteTask, toggleTask, updateTask } = useTaskManager(
    {
      toast,
    }
  );

  const filteredAndSortedTasks = useFilterAndSortTasks(tasks, filter, sort);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster />
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Список задач
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 space-y-2">
              <Select onValueChange={(value: TaskFilter) => setFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Фильтр задач" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все</SelectItem>
                  <SelectItem value="completed">Выполненные</SelectItem>
                  <SelectItem value="incomplete">Невыполненные</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={(value: TaskSort) => setSort(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Сортировка по дате" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-asc">Сначала старые</SelectItem>
                  <SelectItem value="date-desc">Сначала новые</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <TaskForm onAdd={addTask} />
            <TaskList
              tasks={filteredAndSortedTasks}
              onDelete={deleteTask}
              onToggle={toggleTask}
              onUpdate={updateTask}
            />
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  );
};

export default App;
