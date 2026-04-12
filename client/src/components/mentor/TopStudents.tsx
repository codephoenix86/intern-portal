import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const topStudents = [
  { name: "Aarav Sharma", score: "92%" },
  { name: "Anjali Verma", score: "88%" },
  { name: "Rohan Gupta", score: "84%" },
];

const TopStudents = () => {
  const navigate = useNavigate();

  return (
    <div className="glass-card rounded-lg p-5">
      <h3 className="font-semibold text-foreground mb-4">
        Top Performing Students
      </h3>

      <div className="space-y-3 text-sm">
        {topStudents.map((s, idx) => (
          <div key={idx} className="flex justify-between">
            <span className="text-foreground font-medium">{s.name}</span>
            <span className="text-primary font-bold">{s.score}</span>
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        className="w-full mt-4"
        onClick={() => navigate("/mentor/students")}
      >
        View Students
      </Button>
    </div>
  );
};

export default TopStudents;
