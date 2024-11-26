import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Task } from "@/App";
import { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Check, Pencil, Trash2 } from "lucide-react";

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
    date: "",
  });

  const handleEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditedTask({
      title: task.title,
      completed: task.completed,
      date: task.date,
    });
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
            <form
              onSubmit={handleSubmit}
              className="flex-grow flex items-center gap-2"
            >
              <Input
                type="text"
                value={editedTask.title}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, title: e.target.value })
                }
                className="flex-grow"
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="px-3">
                    <CalendarIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                   mode="single"
                   selected={new Date(editedTask.date)}
                   onSelect={(date) =>
                     setEditedTask({
                       ...editedTask,
                       date: date ? format(date, "yyyy-MM-dd") : "",
                     })
                   }
                   initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Button type="submit" size="icon" className="p-3">
                <Check />
              </Button>
            </form>
          ) : (
            <>
              <div className="flex-grow">
                <label
                  htmlFor={`task-${task.id}`}
                  className={`block ${
                    task.completed ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {task.title}
                </label>
                <span className="text-sm text-muted-foreground">
                  {task.date &&
                    format(new Date(task.date), "dd MMMM", { locale: ru })}
                </span>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="px-3"
                onClick={() => handleEdit(task)}
              >
                <Pencil />
              </Button>
              <Button variant='outline' size='icon' className="px-3" onClick={() => onDelete(task.id)}><Trash2/></Button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
