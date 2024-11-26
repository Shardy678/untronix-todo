import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import type { TaskSort } from "@/lib/types";

interface TaskSortProps {
  sort: TaskSort;
  setSort: (sort: TaskSort) => void;
}

const TaskSortForm = ({ setSort }: TaskSortProps) => {
  return (
    <Select onValueChange={(value: TaskSort) => setSort(value)}>
      <SelectTrigger>
        <SelectValue placeholder="Сортировка по дате" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="date-asc">Сначала старые</SelectItem>
        <SelectItem value="date-desc">Сначала новые</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default TaskSortForm;
