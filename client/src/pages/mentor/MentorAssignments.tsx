import { Button } from "@/components/ui/button";
import AssignmentCard from "@/components/mentor/AssignmentCard";
import { MOCK_ASSIGNMENTS } from "@/constants/mentor.constant.ts";

const MentorAssignments = () => {
  return (
    <div className="space-y-3">
      <Button className="gradient-primary text-primary-foreground border-0">
        + Create Assignment
      </Button>

      {MOCK_ASSIGNMENTS.map((a) => (
        <AssignmentCard key={a.id} assignment={a} />
      ))}
    </div>
  );
};

export default MentorAssignments;
