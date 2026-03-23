import { Button } from "@/components/ui/button";

const upcomingClasses = [
  { label: "DSA Bootcamp", when: "Today • 6 PM" },
  { label: "Resume Review", when: "Tomorrow • 4 PM" },
  { label: "Mock Interview", when: "Sunday • 7 PM" },
];

const UpcomingClasses = () => {
  return (
    <div className="glass-card rounded-lg p-5">
      <h3 className="font-semibold text-foreground mb-4">Upcoming Classes</h3>

      <div className="space-y-3 text-sm">
        {upcomingClasses.map((c, idx) => (
          <div
            key={idx}
            className={`flex justify-between pb-2 ${
              idx < upcomingClasses.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <span className="text-foreground font-medium">{c.label}</span>
            <span className="text-muted-foreground">{c.when}</span>
          </div>
        ))}
      </div>

      <Button className="w-full mt-4 gradient-primary text-primary-foreground border-0">
        Schedule New Class
      </Button>
    </div>
  );
};

export default UpcomingClasses;
