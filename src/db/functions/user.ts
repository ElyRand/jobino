import { client } from "@/db/db";
import * as schema from "@/db/schema/user";
import * as companySchema from "@/db/schema/company";
import { InsertUser, SelectUser, users } from "@/db/schema/user";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { SelectCompany } from "../schema/company";

const db = drizzle(client, { schema: { ...schema, ...companySchema } });

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

export async function addUserToCompany(
  userId: SelectUser["externalId"],
  companyId: SelectCompany["externalId"]
) {
  const company = await db.query.companies.findFirst({
    where: (companies) => eq(companies.externalId, companyId),
  });
  if (!company) {
    throw new Error(`Company with id ${companyId} not found`);
  }
  await db
    .update(users)
    .set({ companyId: company.id })
    .where(eq(users.externalId, userId));
}

export async function removeUserFromCompany(userId: SelectUser["externalId"]) {
  await db
    .update(users)
    .set({ companyId: null })
    .where(eq(users.externalId, userId));
}
