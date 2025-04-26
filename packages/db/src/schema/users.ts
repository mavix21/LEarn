import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: text().primaryKey(),
    firstName: text().notNull(),
    lastName: text().notNull(),
    walletAddress: varchar().unique(),
    username: varchar({ length: 50 }).unique(),
    email: varchar({ length: 255 }).unique(),
    emailVerified: boolean().notNull(),
    image: text(),
    avatarUrl: varchar({ length: 255 }),
    bio: text(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
  },
  (table) => [
    // Indexes for common lookups
    index("user_wallet_address_idx").on(table.walletAddress),
    index("user_email_idx").on(table.email),
  ],
);

export type SelectUser = Omit<
  typeof users.$inferSelect,
  "createdAt" | "updatedAt"
>;
export type InsertUser = typeof users.$inferInsert;
