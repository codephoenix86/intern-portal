import { Button } from "@/components/ui/button";
import type { Assignment } from "@/types/mentor.types";

interface AssignmentCardProps {
  assignment: Assignment;
  onReview?: (assignment: Assignment) => void;
}

const AssignmentCard = ({ assignment, onReview }: AssignmentCardProps) => {
  return (
    <div className="glass-card rounded-lg p-5 flex justify-between items-center">
      <div>
        <h3 className="font-semibold text-foreground">{assignment.title}</h3>
        <p className="text-sm text-muted-foreground">
          Deadline: {assignment.deadline}
        </p>
        <p className="text-sm text-muted-foreground">
          Submissions: {assignment.submissions}
        </p>
      </div>

      <Button variant="outline" onClick={() => onReview?.(assignment)}>
        Review
      </Button>
    </div>
  );
};

export default AssignmentCard;
