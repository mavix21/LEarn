"use client";

import { cn } from "@skill-based/ui/lib/utils";

import type { Id } from "@/convex/_generated/dataModel";

interface Conversation {
  id: Id<"messages">;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: Id<"messages"> | undefined;
  onSelect: (conversation: Conversation) => void;
}

export function ConversationList({
  conversations,
  activeConversationId,
  onSelect,
}: ConversationListProps) {
  // console.log(conversations);
  return (
    <div className="overflow-y-auto">
      {conversations.map((conversation) => (
        <button
          key={conversation.id}
          className={cn(
            "hover:bg-accent/50 w-full px-4 py-3 text-left transition-colors",
            activeConversationId === conversation.id && "bg-accent",
          )}
          onClick={() => onSelect(conversation)}
        >
          <div className="flex justify-between">
            <span className="text-foreground font-medium">
              {conversation.name}
            </span>
            <span className="text-muted-foreground text-xs">
              {conversation.timestamp}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-muted-foreground max-w-[80%] truncate text-sm">
              {conversation.lastMessage}
            </p>
            {conversation.unread > 0 && (
              <span className="bg-primary text-primary-foreground flex h-5 w-5 items-center justify-center rounded-full text-xs">
                {conversation.unread}
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
