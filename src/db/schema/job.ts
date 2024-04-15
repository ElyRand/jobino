import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { companies } from "./company";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

export const jobs = sqliteTable("jobs", {
  id: integer("id").primaryKey(),
  externalId: text("external_id")
    .notNull()
    .$defaultFn(() => uuidv4()),
  title: text("title", { length: 50 }).notNull(),
  description: text("description", { length: 250 }).notNull(),
  companyId: integer("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const jobsRelations = relations(jobs, ({ one }) => ({
  company: one(companies, {
    fields: [jobs.companyId],
    references: [companies.id],
  }),
}));

export const insertJobSchema = createInsertSchema(jobs, {
  companyId: z.string().transform((value) => parseInt(value)),
});
export const selectJobSchema = createSelectSchema(jobs);

export type InsertJob = typeof jobs.$inferInsert;
export type SelectJob = typeof jobs.$inferSelect;
