import { createClient } from "@libsql/client";
import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { users } from "./schema/user";
import { companies } from "./schema/company";
if (!("TURSO_CONNECTION_URL" in process.env))
  throw new Error("TURSO_CONNECTION_URL not found on .env.development");

const main = async () => {
  const client = createClient({
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });
  const db = drizzle(client);

  await db.delete(users);
  await db.insert(users).values([
    {
      externalId: "user_2eVO0XOcKbHfpE0hdYRUFOLjcf9",
      email: "elyeser.f@gmail.com",
    },
  ]);

  await db.delete(companies);
  await db.insert(companies).values([
    {
      name: "Google",
      externalId: "org_2eVO4tWJcaW6cRnvdiy9MFUVmOO",
    },
  ]);
};

main();
