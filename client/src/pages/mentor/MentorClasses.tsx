// client/src/pages/mentor/MentorClasses.tsx

import { Button } from "@/components/ui/button";
import ClassCard from "@/components/mentor/ClassCard";
import { MOCK_CLASSES } from "@/constants/mentor.constant";

const MentorClasses = () => {
  return (
    <div className="space-y-4">
      <Button className="gradient-primary text-primary-foreground border-0">
        + Schedule Class
      </Button>

      <div className="space-y-3">
        {MOCK_CLASSES.map((c) => (
          <ClassCard key={c.id} mentorClass={c} />
        ))}
      </div>
    </div>
  );
};

export default MentorClasses;
