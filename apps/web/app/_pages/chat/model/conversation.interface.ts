import type { Id } from "@/convex/_generated/dataModel";

export interface Conversation {
  id: Id<"messages">;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}
