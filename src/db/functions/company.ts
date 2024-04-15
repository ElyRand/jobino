import { eq } from "drizzle-orm";
import { db } from "../db";
import { InsertCompany, SelectCompany, companies } from "../schema/company";

export async function createCompany(data: InsertCompany) {
  await db.insert(companies).values(data);
}

export async function updateCompany(
  externalId: string,
  data: Partial<Omit<SelectCompany, "id">>
) {
  await db
    .update(companies)
    .set(data)
    .where(eq(companies.externalId, externalId));
}

export async function deleteCompany(externalId: string) {
  await db.delete(companies).where(eq(companies.externalId, externalId));
}
