import MessageCard from "@/components/mentor/MessageCard";
import { MOCK_MESSAGES } from "@/constants/mentor.constant";

const MentorMessages = () => {
  return (
    <div className="space-y-3 max-w-2xl">
      {MOCK_MESSAGES.map((m) => (
        <MessageCard key={m.id} message={m} />
      ))}
    </div>
  );
};

export default MentorMessages;
