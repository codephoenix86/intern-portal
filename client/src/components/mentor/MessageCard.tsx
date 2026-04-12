import { Button } from "@/components/ui/button";
import type { Message } from "@/types/mentor.types";

interface MessageCardProps {
  message: Message;
  isActive?: boolean;
  onReply?: (message: Message) => void;
}

const MessageCard = ({ message, isActive = false, onReply }: MessageCardProps) => {
  return (
    <div
      className={`glass-card rounded-lg p-5 border transition-colors ${
        isActive ? "border-primary/40 bg-primary/5" : "border-border"
      }`}
    >
      <h3 className="font-semibold text-foreground">{message.student}</h3>
      <p className="text-sm text-muted-foreground mt-1">{message.msg}</p>

      <Button
        variant={isActive ? "default" : "outline"}
        className="mt-4"
        onClick={() => onReply?.(message)}
      >
        Reply
      </Button>
    </div>
  );
};

export default MessageCard;
