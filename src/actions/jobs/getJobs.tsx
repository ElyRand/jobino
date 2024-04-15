"use server";

import { db } from "@/db/db";
import { jobs } from "@/db/schema/job";

export async function getJobs() {
  return await db.select().from(jobs);
}
