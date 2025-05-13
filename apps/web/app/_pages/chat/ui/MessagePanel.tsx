"use client";

import type React from "react";
import { useState } from "react";
import { useQuery } from "convex/react";
import { Send } from "lucide-react";

import { Button } from "@skill-based/ui/components/button";
import { Input } from "@skill-based/ui/components/input";

import { api } from "@/convex/_generated/api";

import { MessageList } from "./MessageList";

interface Message {
  id: string;
  content: string;
  sender: "user" | "other";
  timestamp: string;
}
// Sample messages for demo
const initialMessages = [
  {
    id: "1",
    content: "Hey there! How's the project coming along?",
    sender: "other",
    timestamp: "10:30 AM",
  },
  {
    id: "2",
    content: "It's going well! I've completed the initial designs.",
    sender: "user",
    timestamp: "10:32 AM",
  },
  {
    id: "3",
    content: "That's great to hear! Can you share them with me?",
    sender: "other",
    timestamp: "10:33 AM",
  },
  {
    id: "4",
    content: "Sure, I'll send them over right away.",
    sender: "user",
    timestamp: "10:35 AM",
  },
];

interface MessagePanelProps {
  conversation: {
    id: string;
    name: string;
  };
}

export function MessagePanel({ conversation }: MessagePanelProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  // const listMessagesFromUserToOther = useQuery(
  //   api.messages.listMessagesFromUserToOther,
  //   {
  //     receiverId: conversation.id,
  //   },
  // );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, message]);
    setNewMessage("");

    // Simulate a response after a short delay
    setTimeout(() => {
      const response = {
        id: (Date.now() + 1).toString(),
        content: "Thanks for your message! I'll take a look at it soon.",
        sender: "other",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, response]);
    }, 1000);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-border border-b p-4">
        <h2 className="text-foreground text-lg font-medium">
          {conversation.name}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages as Message[]} />
      </div>

      <div className="border-border border-t p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
