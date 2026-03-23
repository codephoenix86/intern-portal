import { Button } from "@/components/ui/button";

const topStudents = [
  { name: "Aarav Sharma", score: "92%" },
  { name: "Anjali Verma", score: "88%" },
  { name: "Rohan Gupta", score: "84%" },
];

const TopStudents = () => {
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

      <Button variant="outline" className="w-full mt-4">
        View Students
      </Button>
    </div>
  );
};

export default TopStudents;
