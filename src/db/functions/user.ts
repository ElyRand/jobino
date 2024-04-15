import { client } from "@/db/db";
import { SelectPost, posts } from "@/db/schema/post";
import * as schema from "@/db/schema/user";
import { InsertUser, SelectUser, users } from "@/db/schema/user";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";

const db = drizzle(client, { schema });

export async function createUser(data: InsertUser): Promise<void> {
  await db.insert(users).values(data);
}

export async function patchUser(
  externalId: SelectUser["externalId"],
  data: Partial<Omit<SelectUser, "id">>
): Promise<void> {
  await db.update(users).set(data).where(eq(users.externalId, externalId));
}

export async function deleteUser(
  externalId: SelectUser["externalId"]
): Promise<void> {
  await db.delete(users).where(eq(users.externalId, externalId));
}

export async function getUserWithPosts(
  id: SelectUser["id"]
): Promise<Array<SelectUser>> {
  return db.query.users.findMany({
    with: {
      posts: true,
    },
    where: (users) => eq(users.id, id),
  });
}
