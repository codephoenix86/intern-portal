import { Button } from "@/components/ui/button";
import type { MentorClass } from "@/types/mentor.types";

interface ClassCardProps {
  mentorClass: MentorClass;
}

const ClassCard = ({ mentorClass }: ClassCardProps) => {
  return (
    <div className="glass-card rounded-lg p-5 flex justify-between items-center">
      <div>
        <h3 className="font-semibold text-foreground">{mentorClass.topic}</h3>
        <p className="text-sm text-muted-foreground">
          {mentorClass.date} • {mentorClass.time}
        </p>
      </div>

      <Button variant="outline">Manage</Button>
    </div>
  );
};

export default ClassCard;
