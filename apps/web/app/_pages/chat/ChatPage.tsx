"use client";

import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";

import type { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

export function ChatPage() {
  // State for selected conversation and message input
  const [selectedConversationId, setSelectedConversationId] =
    useState<Id<"conversations"> | null>(null);
  const [message, setMessage] = useState("");

  // Fetch conversations
  const conversations = useQuery(api.messages.listConversations) || [];
  // Fetch messages for selected conversation
  const messages =
    useQuery(
      api.messages.listMessages,
      selectedConversationId
        ? { conversationId: selectedConversationId }
        : "skip",
    ) || [];

  const sendMessage = useMutation(api.messages.sendMessage);

  // Handle sending a message
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConversationId || !message.trim()) return;
    await sendMessage({
      conversationId: selectedConversationId,
      content: message,
    });
    setMessage("");
  };

  return (
    <div className="flex h-full w-full">
      {/* Conversations List */}
      <aside className="bg-background w-1/4 min-w-[250px] max-w-xs border-r p-4">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search or start a conversation"
            className="w-full rounded-md border px-3 py-2"
            disabled
          />
        </div>
        <div className="space-y-2">
          {conversations.length === 0 && (
            <div className="text-muted-foreground">No conversations</div>
          )}
          {conversations.map((conv) => (
            <div
              key={conv._id}
              className={`bg-muted cursor-pointer rounded-md p-3 ${selectedConversationId === conv._id ? "bg-primary text-white" : ""}`}
              onClick={() =>
                setSelectedConversationId(conv._id as Id<"conversations">)
              }
            >
              Conversation {conv._id.slice(-4)}
            </div>
          ))}
        </div>
      </aside>
      {/* Messages Panel */}
      <main className="bg-background flex flex-1 flex-col p-6">
        <div className="flex-1 overflow-y-auto">
          {selectedConversationId ? (
            messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`mb-2 ${msg.senderId === undefined ? "text-left" : "text-right"}`}
                >
                  <span
                    className={`inline-block rounded-lg px-4 py-2 ${msg.senderId === undefined ? "bg-muted" : "bg-primary text-white"}`}
                  >
                    {msg.content}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground">No messages</div>
            )
          ) : (
            <div className="text-muted-foreground">Select a conversation</div>
          )}
        </div>
        <form className="mt-4 flex gap-2" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 rounded-md border px-3 py-2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!selectedConversationId}
          />
          <button
            type="submit"
            className="bg-primary rounded-md px-4 py-2 text-white"
            disabled={!selectedConversationId || !message.trim()}
          >
            Send
          </button>
        </form>
      </main>
    </div>
  );
}
