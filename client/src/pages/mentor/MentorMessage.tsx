import { useMemo, useState } from "react";
import MessageCard from "@/components/mentor/MessageCard";
import { MOCK_MESSAGES } from "@/constants/mentor.constant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ChatBubble = {
  id: number;
  sender: "student" | "mentor";
  text: string;
  at: string;
};

type Conversation = {
  student: string;
  messages: ChatBubble[];
};

const MentorMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>(() =>
    MOCK_MESSAGES.map((m) => ({
      student: m.student,
      messages: [
        {
          id: 1,
          sender: "student",
          text: m.msg,
          at: "Just now",
        },
      ],
    })),
  );

  const [activeStudent, setActiveStudent] = useState<string | null>(
    MOCK_MESSAGES[0]?.student ?? null,
  );
  const [draft, setDraft] = useState("");

  const activeConversation = useMemo(
    () => conversations.find((c) => c.student === activeStudent) ?? null,
    [conversations, activeStudent],
  );

  const handleReply = (student: string): void => {
    setActiveStudent(student);
  };

  const sendMessage = (): void => {
    const clean = draft.trim();
    if (!clean || !activeStudent) return;

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.student !== activeStudent) return conv;
        return {
          ...conv,
          messages: [
            ...conv.messages,
            {
              id: conv.messages.length + 1,
              sender: "mentor",
              text: clean,
              at: "Now",
            },
          ],
        };
      }),
    );

    setDraft("");
  };

  const messageCards = conversations.map((c, idx) => {
    const latest = c.messages[c.messages.length - 1]?.text ?? "";
    return {
      id: idx + 1,
      student: c.student,
      msg: latest,
    };
  });

  return (
    <div className="grid gap-4 lg:grid-cols-[360px,1fr]">
      <div className="space-y-3">
        {messageCards.map((m) => (
          <MessageCard
            key={m.id}
            message={m}
            isActive={m.student === activeStudent}
            onReply={() => handleReply(m.student)}
          />
        ))}
      </div>

      <div className="glass-card rounded-lg border border-border p-4 min-h-[440px] flex flex-col">
        {!activeConversation ? (
          <p className="text-sm text-muted-foreground">
            Select a student conversation to start chatting.
          </p>
        ) : (
          <>
            <div className="pb-3 border-b border-border">
              <h3 className="font-semibold text-foreground">
                Chat with {activeConversation.student}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Send a direct response to the student.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {activeConversation.messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${
                    m.sender === "mentor" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[78%] rounded-xl px-3 py-2 text-sm ${
                      m.sender === "mentor"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p>{m.text}</p>
                    <p
                      className={`mt-1 text-[10px] ${
                        m.sender === "mentor"
                          ? "text-primary-foreground/80"
                          : "text-muted-foreground"
                      }`}
                    >
                      {m.at}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-border flex gap-2">
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Type your reply..."
              />
              <Button onClick={sendMessage}>Send</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MentorMessages;
