"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { MessageSquarePlus } from "lucide-react";

import { Button } from "@skill-based/ui/components/button";

import type { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

import type { Conversation } from "./model/conversation.interface";
import { ConversationList } from "./ui/ConversationList";
import { MessagePanel } from "./ui/MessagePanel";
import { NewConversationDialog } from "./ui/NewConversationDialog";

// Sample data
// const initialConversations = [
//   {
//     id: "1",
//     name: "Project Discussion",
//     lastMessage: "Let's schedule a meeting tomorrow",
//     timestamp: "10:30 AM",
//     unread: 2,
//   },
//   {
//     id: "2",
//     name: "Team Updates",
//     lastMessage: "The new feature is ready for testing",
//     timestamp: "Yesterday",
//     unread: 0,
//   },
//   {
//     id: "3",
//     name: "Client Feedback",
//     lastMessage: "They loved the new design!",
//     timestamp: "Monday",
//     unread: 0,
//   },
// ];

export function ChatPage() {
  const initialConversations = useQuery(api.messages.listConversations);
  const transformedConversations: Conversation[] | undefined =
    initialConversations?.map((msg) => ({
      id: msg._id,
      name: msg.receiverName, // You may want to customize this
      lastMessage: msg.content,
      timestamp: new Date(msg._creationTime).toLocaleTimeString(),
      unread: 0,
    }));

  // const [conversations, setConversations] = useState(
  //   transformedConversations || [],
  // );
  // const [activeConversation, setActiveConversation] = useState<
  //   Conversation | undefined
  // >(undefined);

  const activeConversation = transformedConversations?.[0];

  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false);

  if (transformedConversations === undefined) return "Loading...";

  const handleNewConversation = (name: string) => {
    const newConversation = {
      id: "temp" as Id<"messages">,
      name,
      lastMessage: "New conversation started",
      timestamp: "Just now",
      unread: 0,
    };
    // setConversations([newConversation, ...conversations]);
    setIsNewConversationOpen(false);
  };

  return (
    <div className="bg-background flex h-screen">
      <div className="border-border w-80 border-r">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-foreground text-xl font-semibold">
            Conversations
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsNewConversationOpen(true)}
            aria-label="New conversation"
          >
            <MessageSquarePlus className="text-primary h-5 w-5" />
          </Button>
        </div>
        <ConversationList
          conversations={transformedConversations}
          activeConversationId={activeConversation?.id}
          onSelect={() => {}}
        />
      </div>

      <div className="flex-1">
        {activeConversation && (
          <MessagePanel conversation={activeConversation} />
        )}
      </div>

      <NewConversationDialog
        open={isNewConversationOpen}
        onOpenChange={setIsNewConversationOpen}
        onCreateConversation={handleNewConversation}
      />
    </div>
  );
}
