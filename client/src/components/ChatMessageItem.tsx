import { memo } from "react";
import { Card } from "@/components/ui/card";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

interface ChatMessageItemProps {
  message: Message;
  index: number;
}

const ChatMessageItem = memo(function ChatMessageItem({
  message,
  index,
}: ChatMessageItemProps) {
  return (
    <div
      key={`${message.role}-${index}`}
      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
    >
      <Card
        className={`max-w-xs lg:max-w-md xl:max-w-lg p-4 rounded-2xl shadow-md transition-all ${
          message.role === "user"
            ? "bg-accent text-accent-foreground rounded-br-none"
            : "bg-card border-border rounded-bl-none"
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </p>
        {message.timestamp && (
          <p className="text-xs opacity-60 mt-2">
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </Card>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison: only re-render if message content or role changes
  return (
    prevProps.message.content === nextProps.message.content &&
    prevProps.message.role === nextProps.message.role &&
    prevProps.index === nextProps.index
  );
});

export default ChatMessageItem;
