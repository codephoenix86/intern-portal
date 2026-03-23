import StudentCard from "@/components/mentor/StudentCard";
import { MOCK_STUDENTS } from "@/constants/mentor.constant";

const MentorStudents = () => {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {MOCK_STUDENTS.map((s) => (
        <StudentCard key={s.id} student={s} />
      ))}
    </div>
  );
};

export default MentorStudents;
