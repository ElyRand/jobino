import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const applications = sqliteTable("applications", {
  id: integer("id").primaryKey(),
  email: text("email").unique().notNull(),
  jobId: integer("job_id").notNull(),
});
