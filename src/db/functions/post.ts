import { db } from "@/db/db";
import { InsertPost, SelectPost, posts } from "@/db/schema/post";
import { eq } from "drizzle-orm";

export async function createPost(data: InsertPost): Promise<void> {
  db.insert(posts).values(data);
}

export async function dataPost(
  id: SelectPost["id"],
  data: Partial<Omit<SelectPost, "id">>
): Promise<SelectPost[]> {
  const updatedPost = await db
    .update(posts)
    .set(data)
    .where(eq(posts.id, id))
    .returning();

  return updatedPost;
}

export async function deletePost(id: SelectPost["id"]): Promise<void> {
  await db.delete(posts).where(eq(posts.id, id));
}
