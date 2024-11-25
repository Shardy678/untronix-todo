import { useEffect, useMemo, useState } from "react";
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
import io from "socket.io-client";
import { ThemeProvider } from "@/components/theme-provider";

const socket = io("http://localhost:3000");

export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export type TaskFilter = "all" | "completed" | "incomplete";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>("all");

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case "completed":
        return tasks.filter((task) => task.completed);
      case "incomplete":
        return tasks.filter((task) => !task.completed);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  const { toast } = useToast();

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch("http://localhost:3000/tasks");
      const data: Task[] = await response.json();
      setTasks(data);
    };

    fetchTasks();

    socket.on("taskAdded", (newTask: Task) => {
      setTasks((prevTasks) => [...prevTasks, newTask]);
      toast({ title: `Задача «${newTask.title}» добавлена` });
    });

    socket.on("taskDeleted", (deletedTask: { id: number; title: string }) => {
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== deletedTask.id)
      );
      toast({ title: `Задача «${deletedTask.title}» удалена` });
    });

    socket.on("taskToggled", (updatedTask: Task) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
      toast({
        title: `Задача «${updatedTask.title}» ${
          updatedTask.completed ? "выполнена" : "не выполнена"
        }`,
      });
    });

    return () => {
      socket.off("taskAdded");
      socket.off("taskDeleted");
      socket.off("taskToggled");
    };
  }, []);

  const addTask = async (newTask: Omit<Task, "id">) => {
    const response = await fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    });
    const createdTask: Task = await response.json();
    socket.emit("taskAdded", createdTask);
  };

  const deleteTask = async (taskId: number) => {
    await fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: "DELETE",
    });
    socket.emit("taskDeleted", taskId);
  };

  const toggleTask = async (taskId: number) => {
    const taskToToggle = tasks.find((task) => task.id === taskId);
    if (!taskToToggle) return;

    const updatedTask = { ...taskToToggle, completed: !taskToToggle.completed };

    await fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    });
    socket.emit("taskToggled", updatedTask);
  };

  const updateTask = async (taskId: number, updatedTask: Omit<Task, "id">) => {
    const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    });
    const updatedTaskResponse: Task = await response.json();
    socket.emit("taskUpdated", updatedTaskResponse);
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster />
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="container mx-auto p-4 max-w-md border border-border rounded">
          <h1 className="text-2xl font-bold mb-4 text-foreground text-center">
            Список задач
          </h1>
          <div className="mb-4">
            <Select defaultValue="all" onValueChange={(value: TaskFilter) => setFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Фильтр" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все</SelectItem>
                <SelectItem value="completed">Выполненные</SelectItem>
                <SelectItem value="incomplete">Невыполненные</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <TaskForm onAdd={addTask} />
          <TaskList
            tasks={filteredTasks}
            onDelete={deleteTask}
            onToggle={toggleTask}
            onUpdate={updateTask}
          />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
