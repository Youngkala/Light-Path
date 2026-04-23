import { memo } from "react";
import { Card } from "@/components/ui/card";

const TypingIndicator = memo(function TypingIndicator() {
  return (
    <div className="flex justify-start animate-fade-in">
      <Card className="bg-card border-border p-4 rounded-2xl rounded-bl-none">
        <div className="flex gap-2">
          <div
            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </Card>
    </div>
  );
});

export default TypingIndicator;
