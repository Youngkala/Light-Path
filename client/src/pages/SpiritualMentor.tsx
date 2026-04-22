import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Send, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

export default function SpiritualMentor() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const createSessionMutation = trpc.spiritualMentor.createSession.useMutation();
  const getActiveSessionQuery = trpc.spiritualMentor.getActiveSession.useQuery();
  const getMessagesQuery = trpc.spiritualMentor.getMessages.useQuery(
    { sessionId: sessionId! },
    { enabled: !!sessionId }
  );
  const chatMutation = trpc.spiritualMentor.chat.useMutation();
  const clearChatMutation = trpc.spiritualMentor.clearChat.useMutation();

  // Initialize session on mount
  useEffect(() => {
    const initializeSession = async () => {
      try {
        setIsLoading(true);
        const activeSession = await getActiveSessionQuery.refetch();
        
        if (activeSession.data) {
          setSessionId(activeSession.data.id);
        } else {
          // Create new session if none exists
          const result = await createSessionMutation.mutateAsync();
          if (result.sessionId) {
            setSessionId(result.sessionId);
          } else {
            const newSession = await getActiveSessionQuery.refetch();
            if (newSession.data) {
              setSessionId(newSession.data.id);
            }
          }
        }
      } catch (error) {
        toast.error("Failed to initialize chat session");
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();
  }, []);

  // Load messages when session changes
  useEffect(() => {
    if (sessionId) {
      const loadMessages = async () => {
        try {
          const result = await getMessagesQuery.refetch();
          if (result.data) {
            const formattedMessages: Message[] = result.data.flatMap(chat => [
              { role: "user" as const, content: chat.userMessage, timestamp: new Date(chat.createdAt) },
              { role: "assistant" as const, content: chat.assistantResponse, timestamp: new Date(chat.createdAt) }
            ]);
            setMessages(formattedMessages);
          }
        } catch (error) {
          console.error("Failed to load messages:", error);
        }
      };
      loadMessages();
    }
  }, [sessionId, getMessagesQuery]);

  // Auto-scroll to latest message
  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  const handleSendMessage = useCallback(async () => {
    if (!message.trim() || !sessionId || chatMutation.isPending) return;

    const userMessage = message;
    setMessage("");
    setMessages(prev => [...prev, { role: "user", content: userMessage, timestamp: new Date() }]);

    try {
      const response = await chatMutation.mutateAsync({
        sessionId,
        message: userMessage
      });
      setMessages(prev => [...prev, { role: "assistant", content: response.response, timestamp: new Date() }]);
    } catch (error) {
      toast.error("Failed to get response from Spiritual Mentor");
      setMessages(prev => prev.slice(0, -1));
    }
  }, [message, sessionId, chatMutation]);

  const handleNewChat = useCallback(async () => {
    try {
      setIsLoading(true);
      setMessages([]);
      const result = await createSessionMutation.mutateAsync();
      if (result.sessionId) {
        setSessionId(result.sessionId);
      } else {
        const newSession = await getActiveSessionQuery.refetch();
        if (newSession.data) {
          setSessionId(newSession.data.id);
        }
      }
      toast.success("New chat started");
    } catch (error) {
      toast.error("Failed to create new chat");
    } finally {
      setIsLoading(false);
    }
  }, [createSessionMutation, getActiveSessionQuery]);

  const handleClearChat = useCallback(async () => {
    if (!sessionId) return;
    
    // Show confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to clear all messages in this chat? This action cannot be undone."
    );
    
    if (!confirmed) return;
    
    try {
      await clearChatMutation.mutateAsync({ sessionId });
      setMessages([]);
      toast.success("Chat cleared successfully");
    } catch (error) {
      toast.error("Failed to clear chat");
    }
  }, [sessionId, clearChatMutation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto mb-4" />
          <p className="text-foreground">Initializing Spiritual Mentor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 shadow-lg sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">LightPath Mentor</h1>
            <p className="text-sm text-primary-foreground/80">Scripture-grounded spiritual guidance</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleNewChat}
              variant="outline"
              size="sm"
              className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10"
              disabled={isLoading || createSessionMutation.isPending}
            >
              <Plus className="w-4 h-4 mr-1" />
              New Chat
            </Button>
            <Button
              onClick={handleClearChat}
              variant="outline"
              size="sm"
              className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10"
              disabled={isLoading || messages.length === 0 || clearChatMutation.isPending}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <div className="text-5xl">🙏</div>
                <h2 className="text-2xl font-semibold text-foreground">Welcome to Your Spiritual Mentor</h2>
                <p className="text-muted-foreground max-w-md">
                  Share your spiritual questions, concerns, or thoughts. I'm here to provide Scripture-grounded guidance and encouragement on your faith journey.
                </p>
                <div className="pt-4 space-y-2 text-sm text-muted-foreground">
                  <p>💭 Ask about faith and spiritual growth</p>
                  <p>📖 Explore Bible verses and Scripture</p>
                  <p>🙏 Discuss prayer and spiritual practices</p>
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                <Card
                  className={`max-w-xs lg:max-w-md xl:max-w-lg p-4 rounded-2xl shadow-md transition-all ${
                    msg.role === "user"
                      ? "bg-accent text-accent-foreground rounded-br-none"
                      : "bg-card border-border rounded-bl-none"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  {msg.timestamp && (
                    <p className="text-xs opacity-60 mt-2">
                      {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  )}
                </Card>
              </div>
            ))
          )}

          {/* Typing Indicator */}
          {chatMutation.isPending && (
            <div className="flex justify-start animate-fade-in">
              <Card className="bg-card border-border p-4 rounded-2xl rounded-bl-none">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4 bg-card/50 backdrop-blur">
          <div className="max-w-4xl mx-auto flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Share your spiritual question or thought..."
              disabled={chatMutation.isPending || !sessionId}
              className="flex-1 px-4 py-3 bg-input text-foreground border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all disabled:opacity-50"
            />
            <Button
              onClick={handleSendMessage}
              disabled={chatMutation.isPending || !message.trim() || !sessionId}
              className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full p-3 h-auto transition-all"
            >
              {chatMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
