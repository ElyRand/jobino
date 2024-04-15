import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { jobs } from "./job";
import { relations } from "drizzle-orm";
import { users } from "./user";

export const companies = sqliteTable("companies", {
  id: integer("id").primaryKey(),
  externalId: text("external_id").notNull(),
  name: text("name").notNull(),
});

export const companiesRelations = relations(companies, ({ many }) => ({
  jobs: many(jobs),
  members: many(users),
}));

export type InsertCompany = typeof companies.$inferInsert;
export type SelectCompany = typeof companies.$inferSelect;
