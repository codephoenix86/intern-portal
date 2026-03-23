import ProgressCard from "@/components/mentor/ProgressCard";
import { MOCK_STUDENTS } from "@/constants/mentor.constant";

const MentorProgress = () => {
  return (
    <div className="space-y-3">
      {MOCK_STUDENTS.map((p) => (
        <ProgressCard
          key={p.id}
          data={{ id: p.id, name: p.name, skill: p.skill, score: p.progress }}
        />
      ))}
    </div>
  );
};

export default MentorProgress;
