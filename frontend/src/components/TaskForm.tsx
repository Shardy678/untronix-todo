import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Task } from "@/lib/types";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TaskFormProps {
  onAdd: (task: Omit<Task, "id">) => void;
}

export function TaskForm({ onAdd }: TaskFormProps) {
  const [newTask, setNewTask] = useState<Omit<Task, "id">>({
    title: "",
    completed: false,
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.title.trim()) {
      onAdd(newTask);
      setNewTask({
        title: "",
        completed: false,
        date: new Date().toISOString().split("T")[0],
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-4">
      <Input
        type="text"
        value={newTask.title}
        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        placeholder="Введите новую задачу"
        className="flex-grow"
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !newTask.date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {newTask.date ? (
              format(new Date(newTask.date), "PPP")
            ) : (
              <span>Выберите дату</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={new Date(newTask.date)}
            onSelect={(date) =>
              setNewTask({
                ...newTask,
                date: date ? format(date, "yyyy-MM-dd") : "",
              })
            }
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <Button type="submit" className="w-full">
        Добавить
      </Button>
    </form>
  );
}
