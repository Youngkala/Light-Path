import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Send, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import ChatMessageItem from "@/components/ChatMessageItem";
import TypingIndicator from "@/components/TypingIndicator";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

export default function SpiritualMentor() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const createSessionMutation = trpc.chat.createSession.useMutation();
  const getSessionsQuery = trpc.chat.getSessions.useQuery();
  const getMessagesQuery = trpc.chat.getMessages.useQuery(
    { sessionId: sessionId! },
    { enabled: !!sessionId }
  );
  const chatMutation = trpc.chat.sendMessage.useMutation();
  const clearChatMutation = trpc.chat.clearMessages.useMutation();

  // Initialize session on mount
  useEffect(() => {
    if (isInitialized) return;

    const initializeSession = async () => {
      try {
        setIsLoading(true);
        const sessions = await getSessionsQuery.refetch();

        if (sessions.data && sessions.data.length > 0) {
          // Use the first session (most recent)
          setSessionId(sessions.data[0].id);
        } else {
          // Create a new session
          const result = await createSessionMutation.mutateAsync({});
          setSessionId(result.id);
        }
        setIsInitialized(true);
      } catch (error) {
        toast.error("Failed to initialize chat session");
        setIsInitialized(true);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();
  }, [isInitialized, getSessionsQuery, createSessionMutation]);

  // Load messages when session changes
  useEffect(() => {
    if (sessionId && isInitialized) {
      const loadMessages = async () => {
        try {
          const result = await getMessagesQuery.refetch();
          if (result.data) {
            // Limit to last 50 messages for performance
            const recentChats = result.data.slice(-50);
            const formattedMessages: Message[] = recentChats.flatMap((chat: any) => [
              {
                role: "user" as const,
                content: chat.userMessage,
                timestamp: new Date(chat.createdAt),
              },
              {
                role: "assistant" as const,
                content: chat.assistantResponse,
                timestamp: new Date(chat.createdAt),
              },
            ]);
            setMessages(formattedMessages);
          }
        } catch (error) {
          console.error("Failed to load messages:", error);
        }
      };
      loadMessages();
    }
  }, [sessionId, isInitialized, getMessagesQuery]);

  // Auto-scroll to latest message with optimized timing
  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
    return () => cancelAnimationFrame(timer);
  }, [messages.length]);

  // Memoized send message handler with useCallback
  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || !sessionId || chatMutation.isPending) return;

    const userMessage = inputValue;
    setInputValue(""); // Clear input immediately for responsive UI

    // Optimistically add user message
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage, timestamp: new Date() },
    ]);

    try {
      const response = await chatMutation.mutateAsync({
        sessionId,
        message: userMessage,
      });
      
      // Add assistant response
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.assistantResponse,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      toast.error("Failed to get response from Spiritual Mentor");
      // Remove the user message on error
      setMessages((prev) => prev.slice(0, -1));
    }
  }, [inputValue, sessionId, chatMutation]);

  // Memoized new chat handler
  const handleNewChat = useCallback(async () => {
    try {
      setIsLoading(true);
      setMessages([]);
      setInputValue("");
      
      const result = await createSessionMutation.mutateAsync({});
      setSessionId(result.id);
      toast.success("New chat started");
    } catch (error) {
      toast.error("Failed to create new chat");
    } finally {
      setIsLoading(false);
    }
  }, [createSessionMutation]);

  // Memoized clear chat handler
  const handleClearChat = useCallback(async () => {
    if (!sessionId) return;

    try {
      await clearChatMutation.mutateAsync({ sessionId });
      setMessages([]);
      toast.success("Chat cleared");
    } catch (error) {
      toast.error("Failed to clear chat");
    }
  }, [sessionId, clearChatMutation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pb-24">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Spiritual Mentor</h1>
            <p className="text-xs sm:text-sm text-primary-foreground/80">AI-powered spiritual guidance</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNewChat}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearChat}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Messages Container */}
      <main
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto max-w-4xl mx-auto w-full p-4 space-y-4"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-96 text-center">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Welcome to Your Spiritual Mentor
              </h2>
              <p className="text-muted-foreground">
                Ask questions about faith, spirituality, or any topic you'd like guidance on.
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <ChatMessageItem key={idx} message={msg} index={idx} />
          ))
        )}
        {chatMutation.isPending && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Ask your spiritual mentor..."
            className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={chatMutation.isPending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || chatMutation.isPending}
            className="gap-2"
          >
            {chatMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
