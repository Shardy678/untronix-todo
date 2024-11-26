import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { TaskFilter } from "@/lib/types";

interface TaskFilterProps {
  filter: TaskFilter;
  setFilter: (filter: TaskFilter) => void;
}

const TaskFilterForm = ({ setFilter }: TaskFilterProps) => {
  return (
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
  );
};

export default TaskFilterForm;
