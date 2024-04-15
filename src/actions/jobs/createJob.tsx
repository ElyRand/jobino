"use server";

import { db } from "@/db/db";
import { insertJobSchema, jobs } from "@/db/schema/job";

export async function createJob(prevState: any, formData: FormData) {
  const validatedFields = insertJobSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    companyId: formData.get("companyId"),
  });
  if (!validatedFields.success) {
    console.log("in createJob", validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }
  console.log("in createJob");

  // revalidateTag(jobs);
  await db.insert(jobs).values(validatedFields.data).returning();

  return {
    message: "Job created successfully",
    success: true,
  };
}
