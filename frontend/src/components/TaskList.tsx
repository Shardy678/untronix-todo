import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Task } from "@/App";
import { useState } from "react";

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onUpdate: (id: number, updatedTask: Omit<Task, "id">) => void;
}

export function TaskList({
  tasks,
  onDelete,
  onToggle,
  onUpdate,
}: TaskListProps) {
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editedTask, setEditedTask] = useState<Omit<Task, "id">>({
    title: "",
    completed: false,
  });

  const handleEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditedTask({ title: task.title, completed: task.completed });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedTask.title.trim() && editingTaskId !== null) {
      onUpdate(editingTaskId, { ...editedTask });
      setEditingTaskId(null);
    }
  };

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex items-center gap-2 p-2 border border-border rounded"
        >
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggle(task.id)}
            id={`task-${task.id}`}
          />
          {editingTaskId === task.id ? (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="text"
                value={editedTask.title}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, title: e.target.value })
                }
                className="flex-grow"
              />
              <Button type="submit">Сохранить</Button>
            </form>
          ) : (
            <>
              <label
                htmlFor={`task-${task.id}`}
                className={`flex-grow ${
                  task.completed ? "line-through text-muted-foreground" : ""
                }`}
              >
                {task.title}
              </label>
              <Button onClick={() => handleEdit(task)}>Редактировать</Button>
            </>
          )}
          <Button onClick={() => onDelete(task.id)}>Удалить</Button>
        </li>
      ))}
    </ul>
  );
}

