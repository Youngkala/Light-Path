import { useState, useEffect, useRef, useCallback, memo } from "react";
import { Send, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Memoized message bubble for performance
const MessageBubble = memo(({ message }: { message: Message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs px-4 py-3 rounded-lg ${
          isUser
            ? "bg-amber-600 text-white rounded-br-none"
            : "bg-slate-700 text-slate-100 rounded-bl-none"
        }`}
      >
        <p className="text-base leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </p>
      </div>
    </div>
  );
});

MessageBubble.displayName = "MessageBubble";

// Memoized typing indicator
const TypingIndicator = memo(() => (
  <div className="flex mb-4 justify-start">
    <div className="bg-slate-700 px-4 py-3 rounded-lg rounded-bl-none">
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" />
        <div
          className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"
          style={{ animationDelay: "0.2s" }}
        />
        <div
          className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"
          style={{ animationDelay: "0.4s" }}
        />
      </div>
    </div>
  </div>
));

TypingIndicator.displayName = "TypingIndicator";

export default function SpiritualMentor() {
  // State management
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // tRPC mutations and queries
  const createSessionMutation = trpc.chat.createSession.useMutation();
  const getSessionsQuery = trpc.chat.getSessions.useQuery();
  const getMessagesQuery = trpc.chat.getMessages.useQuery(
    { sessionId: sessionId! },
    { enabled: !!sessionId }
  );
  const sendMessageMutation = trpc.chat.sendMessage.useMutation();
  const clearMessagesMutation = trpc.chat.clearMessages.useMutation();

  // Initialize chat session on mount
  useEffect(() => {
    if (isInitialized) return;

    const initializeChat = async () => {
      try {
        setIsLoading(true);
        const sessions = await getSessionsQuery.refetch();

        if (sessions.data && sessions.data.length > 0) {
          setSessionId(sessions.data[0].id);
        } else {
          const newSession = await createSessionMutation.mutateAsync({});
          setSessionId(newSession.id);
        }
        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to initialize chat:", error);
        toast.error("Failed to initialize chat");
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();
  }, [isInitialized, getSessionsQuery, createSessionMutation]);

  // Load messages when session changes
  useEffect(() => {
    if (sessionId && getMessagesQuery.data) {
      const formattedMessages: Message[] = getMessagesQuery.data.map(
        (msg: any, index: number) => ({
          id: `${msg.id}-${index}`,
          role: msg.role,
          content: msg.content,
          timestamp: new Date(),
        })
      );
      setMessages(formattedMessages);
    }
  }, [sessionId, getMessagesQuery.data]);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Handle sending a message
  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || !sessionId || isSending) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    // Add user message to UI immediately
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsSending(true);

    try {
      // Send message to backend
      const response = await sendMessageMutation.mutateAsync({
        sessionId,
        message: inputValue,
      });

      // Add AI response to UI
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: response.assistantResponse || "I'm here to help with your spiritual journey.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      scrollToBottom();
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
      // Remove the user message if sending failed
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== userMessage.id)
      );
      setInputValue(userMessage.content);
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  }, [inputValue, sessionId, isSending, sendMessageMutation, scrollToBottom]);

  // Handle creating a new chat
  const handleNewChat = useCallback(async () => {
    try {
      setIsLoading(true);
      const newSession = await createSessionMutation.mutateAsync({});
      setSessionId(newSession.id);
      setMessages([]);
      setInputValue("");
      toast.success("New chat started");
    } catch (error) {
      console.error("Failed to create new chat:", error);
      toast.error("Failed to create new chat");
    } finally {
      setIsLoading(false);
    }
  }, [createSessionMutation]);

  // Handle clearing chat
  const handleClearChat = useCallback(async () => {
    if (!window.confirm("Are you sure you want to clear all messages?")) return;

    try {
      if (sessionId) {
        await clearMessagesMutation.mutateAsync({ sessionId });
        setMessages([]);
        toast.success("Chat cleared");
      }
    } catch (error) {
      console.error("Failed to clear chat:", error);
      toast.error("Failed to clear chat");
    }
  }, [sessionId, clearMessagesMutation]);

  // Handle keyboard shortcut (Enter to send)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex-1 bg-slate-900 flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
      </div>
    );
  }

  // Render empty state
  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 px-4 py-4 border-b border-slate-700 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">AI Spiritual Mentor</h1>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleNewChat}
            className="bg-amber-600 hover:bg-amber-700 text-white border-0"
          >
            <Plus className="w-4 h-4 mr-1" />
            New Chat
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleClearChat}
            className="bg-red-600 hover:bg-red-700 text-white border-0"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Clear
          </Button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {isEmpty ? (
          <div className="h-full flex flex-col justify-center items-center text-center">
            <p className="text-slate-400 text-lg mb-4">
              Welcome to your AI Spiritual Mentor
            </p>
            <p className="text-slate-500 max-w-md">
              Ask me anything about faith, prayer, or spiritual growth. I'm here
              to help guide you on your spiritual journey.
            </p>
          </div>
        ) : (
          <div>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isSending && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="bg-slate-800 border-t border-slate-700 px-4 py-3">
        <div className="flex gap-2 items-end">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask LightPath Mentor..."
            disabled={isSending}
            className="flex-1 bg-slate-700 text-white placeholder-slate-500 border-slate-600 focus:border-amber-600 focus:ring-amber-600"
            style={{ minHeight: "44px" }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isSending}
            className="bg-amber-600 hover:bg-amber-700 text-white border-0 px-4 py-2"
            size="sm"
          >
            {isSending ? (
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
