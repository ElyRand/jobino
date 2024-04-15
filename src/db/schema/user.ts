import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { posts } from "./post";
export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  externalId: text("external_id").notNull(),
  username: text("username"),
  email: text("email").unique().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
