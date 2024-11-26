import { Task } from "@/lib/types";
import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

interface TaskManagerHook {
  tasks: Task[];
  addTask: (newTask: Omit<Task, "id">) => Promise<void>;
  deleteTask: (taskId: number) => Promise<void>;
  toggleTask: (taskId: number) => Promise<void>;
  updateTask: (taskId: number, updatedTask: Omit<Task, "id">) => Promise<void>;
}

interface UseTaskManagerProps {
  toast: (options: { title: string }) => void;
}

const useTaskManager = ({ toast }: UseTaskManagerProps): TaskManagerHook => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch("http://localhost:3000/tasks");
      const data: Task[] = await response.json();
      setTasks(data);
    };

    fetchTasks();

    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    newSocket.on("taskAdded", (newTask: Task) => {
      setTasks((prevTasks) => [...prevTasks, newTask]);
      toast({ title: `Задача «${newTask.title}» добавлена` });
    });

    newSocket.on(
      "taskDeleted",
      (deletedTask: { id: number; title: string }) => {
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task.id !== deletedTask.id)
        );
        toast({ title: `Задача «${deletedTask.title}» удалена` });
      }
    );

    newSocket.on("taskToggled", (updatedTask: Task) => {
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
      newSocket.off("taskAdded");
      newSocket.off("taskDeleted");
      newSocket.off("taskToggled");
      newSocket.disconnect();
    };
  }, [toast]);

  const addTask = async (newTask: Omit<Task, "id">) => {
    const response = await fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    });
    const createdTask: Task = await response.json();
    socket?.emit("taskAdded", createdTask);
  };

  const deleteTask = async (taskId: number) => {
    await fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: "DELETE",
    });
    socket?.emit("taskDeleted", { id: taskId, title: "Deleted Task" });
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
    socket?.emit("taskToggled", updatedTask);
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
    socket?.emit("taskUpdated", updatedTaskResponse);
    toast({ title: `Задача «${updatedTaskResponse.title}» обновлена` });
  };

  return {
    tasks,
    addTask,
    deleteTask,
    toggleTask,
    updateTask,
  };
};

export default useTaskManager;
