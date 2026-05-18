"use server";

import { createClient } from "@/app/lib/supabase/server";

export async function markPostRead(postId: string) {
  const supabase = await createClient();

  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;

  if (!user) return;

  await supabase.from("post_reads").insert({
    post_id: postId,
    reader_id: user.id,
  });
}