import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

interface StudentCardProps {
  student: {
    id: string;
    name: string;
    skill: string;
    progress: number;
  };
}

const StudentCard = ({ student }: StudentCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="glass-card rounded-lg p-5">
      <h3 className="font-semibold text-foreground">{student.name}</h3>

      <p className="text-sm text-muted-foreground mt-1">
        Skill Focus:{" "}
        <span className="text-foreground font-medium">{student.skill}</span>
      </p>

      <div className="mt-3">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Progress</span>
          <span className="text-primary font-semibold">
            {student.progress}%
          </span>
        </div>
        <Progress value={student.progress} className="h-2" />
      </div>

      <Button
        variant="outline"
        className="w-full mt-4"
        onClick={() => navigate(`/students/${student.id}`)}
      >
        View Profile
      </Button>
    </div>
  );
};

export default StudentCard;
