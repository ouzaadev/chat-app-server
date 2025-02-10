import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const usersTable = pgTable("users", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(), // Use cuid for unique ID
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const conversationsTable = pgTable("Conversations", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(), // Use cuid for unique ID
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const convertionsRelations = relations(
  conversationsTable,
  ({ many }) => ({
    participants: many(participantsTable),
    messages: many(messagesTable),
  })
);

export const participantsTable = pgTable("participants", {
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  conversationId: text("conversation_id")
    .notNull()
    .references(() => conversationsTable.id, { onDelete: "cascade" }),
});

export const participantsRelations = relations(
  participantsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [participantsTable.userId],
      references: [usersTable.id],
    }),
    conversation: one(conversationsTable, {
      fields: [participantsTable.conversationId],
      references: [conversationsTable.id],
    }),
  })
);

export const messagesTable = pgTable("messages", {
  content: text("content").notNull(),
  senderId: text("sender_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  conversationId: text("conversation_id")
    .notNull()
    .references(() => conversationsTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messagesRelations = relations(messagesTable, ({ one }) => ({
  sender: one(usersTable, {
    fields: [messagesTable.senderId],
    references: [usersTable.id],
  }),
  conversation: one(conversationsTable, {
    fields: [messagesTable.conversationId],
    references: [conversationsTable.id],
  }),
}));
