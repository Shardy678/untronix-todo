import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/hooks/use-toast";
import { ThemeProvider } from "@/components/theme-provider";
import { TaskFilter, TaskSort } from "./lib/types";
import useFilterAndSortTasks from "./components/hooks/useFilterAndSortTasks";
import useTaskManager from "./components/hooks/useTaskManager";
import TaskPage from "./components/TaskPage";

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
      <TaskPage
        tasks={filteredAndSortedTasks}
        filter={filter}
        setFilter={setFilter}
        sort={sort}
        setSort={setSort}
        addTask={addTask}
        deleteTask={deleteTask}
        toggleTask={toggleTask}
        updateTask={updateTask}
      />
    </ThemeProvider>
  );
};

export default App;
