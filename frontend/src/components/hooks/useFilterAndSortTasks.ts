import { Task, TaskFilter, TaskSort } from "@/lib/types";
import { useMemo } from "react";

const useFilterAndSortTasks = (
  tasks: Task[],
  filter: TaskFilter,
  sort: TaskSort
) => {
  const filteredAndSortedTasks = useMemo(() => {
    let result = tasks;

    switch (filter) {
      case "completed":
        result = result.filter((task) => task.completed);
        break;
      case "incomplete":
        result = result.filter((task) => !task.completed);
        break;
    }

    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sort === "date-asc" ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [tasks, filter, sort]);

  return filteredAndSortedTasks;
};

export default useFilterAndSortTasks;
