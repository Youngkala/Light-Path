import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SpiritualMentor() {
  const [, setLocation] = useLocation();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: history } = trpc.spiritualMentor.getHistory.useQuery();
  const chatMutation = trpc.spiritualMentor.chat.useMutation();

  useEffect(() => {
    if (history) {
      const formattedMessages = history.flatMap(chat => [
        { role: "user", content: chat.userMessage },
        { role: "assistant", content: chat.assistantResponse }
      ]);
      setMessages(formattedMessages);
    }
  }, [history]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    setMessage("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);

    try {
      const response = await chatMutation.mutateAsync({ message: userMessage });
      setMessages(prev => [...prev, { role: "assistant", content: response.response }]);
    } catch (error) {
      toast.error("Failed to get response");
      setMessages(prev => prev.slice(0, -1));
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button onClick={() => setLocation("/dashboard")} className="hover:opacity-80">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Spiritual Mentor</h1>
            <p className="text-sm text-primary-foreground/80">AI-powered faith guidance grounded in Scripture</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-lg text-foreground mb-2">Welcome to your Spiritual Mentor</p>
                <p className="text-muted-foreground">Ask questions about faith, Scripture, or spiritual growth</p>
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <Card
                  className={`max-w-xs lg:max-w-md p-4 ${
                    msg.role === "user"
                      ? "bg-accent text-accent-foreground"
                      : "bg-card border-border"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </Card>
              </div>
            ))
          )}
          {chatMutation.isPending && (
            <div className="flex justify-start">
              <Card className="bg-card border-border p-4">
                <Loader2 className="w-5 h-5 animate-spin text-accent" />
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-border p-4 bg-card">
          <div className="max-w-4xl mx-auto flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask your spiritual mentor..."
              className="flex-1 px-4 py-2 bg-input text-foreground border border-border rounded-lg"
            />
            <Button
              onClick={handleSendMessage}
              disabled={chatMutation.isPending || !message.trim()}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
