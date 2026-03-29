import type { RoadmapTask } from "@/types/student.types";

interface RoadmapTaskItemProps {
  task: RoadmapTask;
  onToggle?: (id: string) => void;
  disabled?: boolean;
}

const RoadmapTaskItem = ({ task, onToggle, disabled = false }: RoadmapTaskItemProps) => {
  return (
    <div className="glass-card rounded-lg p-4 flex items-center gap-3">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle?.(task.id)}
        disabled={disabled}
        className="h-4 w-4 rounded border-border text-primary"
      />
      <div className="flex-1">
        <p
          className={`text-sm font-medium ${
            task.completed
              ? "line-through text-muted-foreground"
              : "text-foreground"
          }`}
        >
          {task.title}
        </p>
        <span className="text-xs text-muted-foreground">{task.category}</span>
      </div>
    </div>
  );
};

export default RoadmapTaskItem;
