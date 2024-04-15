import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { posts } from "./post";
import { companies } from "./company";
export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  externalId: text("external_id").notNull(),
  username: text("username"),
  email: text("email").unique().notNull(),
  companyId: integer("company_id"),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  posts: many(posts),
  company: one(companies, {
    fields: [users.companyId],
    references: [companies.id],
  }),
}));

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
