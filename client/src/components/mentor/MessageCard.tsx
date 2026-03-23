import { Button } from "@/components/ui/button";
import type { Message } from "@/types/mentor.types";

interface MessageCardProps {
  message: Message;
}

const MessageCard = ({ message }: MessageCardProps) => {
  return (
    <div className="glass-card rounded-lg p-5">
      <h3 className="font-semibold text-foreground">{message.student}</h3>
      <p className="text-sm text-muted-foreground mt-1">{message.msg}</p>

      <Button variant="outline" className="mt-4">
        Reply
      </Button>
    </div>
  );
};

export default MessageCard;
