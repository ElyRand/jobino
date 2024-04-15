import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from "uuid";

export const candidates = sqliteTable("candidates", {
  id: integer("id").primaryKey(),
  externalId: text("external_id")
    .notNull()
    .$defaultFn(() => uuidv4()),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
});
