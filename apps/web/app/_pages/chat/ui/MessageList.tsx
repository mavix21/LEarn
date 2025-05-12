import { cn } from "@skill-based/ui/lib/utils";

interface Message {
  id: string;
  content: string;
  sender: "user" | "other";
  timestamp: string;
}

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex",
            message.sender === "user" ? "justify-end" : "justify-start",
          )}
        >
          <div
            className={cn(
              "max-w-[80%] rounded-lg px-4 py-2",
              message.sender === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground",
            )}
          >
            <p>{message.content}</p>
            <span className="mt-1 block text-xs opacity-70">
              {message.timestamp}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
