import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Task } from "@/App";

interface TaskFormProps {
  onAdd: (task: Omit<Task, "id">) => void;
}

export function TaskForm({ onAdd }: TaskFormProps) {
  const [newTask, setNewTask] = useState<Omit<Task, "id">>({
    title: "",
    completed: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.title.trim()) {
      onAdd(newTask);
      setNewTask({ title: "", completed: false });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <Input
        type="text"
        value={newTask.title}
        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        placeholder="Введите новую задачу"
        className="flex-grow"
      />
      <Button type="submit">Добавить</Button>
    </form>
  );
}
