import { db } from "../db";
import { InsertCompany, companies } from "../schema/company";

export async function createCompany(data: InsertCompany) {
  await db.insert(companies).values(data);
}
