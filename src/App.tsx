import { useEffect, useState } from "react";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch("http://localhost:3000/tasks");
      const data: Task[] = await response.json();
      setTasks(data);
    };

    fetchTasks();

    socket.on("taskAdded", (newTask: Task) => {
      setTasks((prevTasks) => [...prevTasks, newTask]);
    });

    socket.on("taskDeleted", (taskId: number) => {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    });

    socket.on("taskToggled", (updatedTask: Task) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="container mx-auto p-4 max-w-md dark border border-neutral-800 rounded antialiased">
        <h1 className="text-2xl font-bold mb-4 text-white text-center">
          Список задач
        </h1>
        <TaskForm onAdd={addTask} />
        <TaskList tasks={tasks} onDelete={deleteTask} onToggle={toggleTask} />
      </div>
    </div>
  );
};

export default App;