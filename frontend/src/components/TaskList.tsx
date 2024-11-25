import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Task } from "@/App";

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}

export function TaskList({ tasks, onDelete, onToggle }: TaskListProps) {
  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex items-center gap-2 p-2 border border-neutral-800 rounded"
        >
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggle(task.id)}
            id={`task-${task.id}`}
          />
          <label
            htmlFor={`task-${task.id}`}
            className={`flex-grow text-white ${
              task.completed ? "line-through text-gray-400" : ""
            }`}
          >
            {task.title}
          </label>
          <Button onClick={() => onDelete(task.id)}>Удалить</Button>
        </li>
      ))}
    </ul>
  );
}
