"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { slugify } from "@/app/lib/slug";

async function slugExists(supabase: any, slug: string) {
  const { data, error } = await supabase
    .from("posts")
    .select("id")
    .eq("slug", slug)
    .limit(1);

  if (error) throw new Error(error.message);
  return (data?.length ?? 0) > 0;
}

async function getUniqueSlug(supabase: any, title: string) {
  const base = slugify(title) || "post";

  if (!(await slugExists(supabase, base))) return base;

  for (let i = 2; i <= 200; i++) {
    const candidate = `${base}-${i}`;
    if (!(await slugExists(supabase, candidate))) return candidate;
  }

  throw new Error("Could not generate a unique slug. Try a different title.");
}

export async function publishPost(formData: FormData) {
  const postId = String(formData.get("postId") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "").trim();

  const aiInvolved = String(formData.get("aiInvolved") ?? "no") === "yes";
  const seriesChoice = String(formData.get("seriesChoice") ?? "no");
  const seriesIdRaw = String(formData.get("seriesId") ?? "").trim();
  const seriesId = seriesChoice === "yes" && seriesIdRaw ? seriesIdRaw : null;

  const subcategoryIds = formData.getAll("subcategoryIds").map((v) => String(v));

  if (!postId) throw new Error("Missing postId.");
  if (!categoryId) throw new Error("Pick a category.");

  const supabase = await createClient();

  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) throw new Error("Not authenticated.");

  // Load post and verify ownership
  const { data: post, error: postErr } = await supabase
    .from("posts")
    .select("id, author_id, published_at, title")
    .eq("id", postId)
    .single();

  if (postErr) throw new Error(postErr.message);
  if (!post) throw new Error("Post not found.");
  if (post.author_id !== user.id) throw new Error("Not allowed.");
  if (post.published_at) throw new Error("Already published.");

  // Generate unique slug
  const uniqueSlug = await getUniqueSlug(supabase, post.title ?? "");

  // Update post
  const { error: updErr } = await supabase
    .from("posts")
    .update({
      slug: uniqueSlug,
      category_id: categoryId,
      ai_involved: aiInvolved,
      series_id: seriesId,
      published_at: new Date().toISOString(),
    })
    .eq("id", postId);

  if (updErr) throw new Error(updErr.message);

  // Replace subcategories
  const { error: delErr } = await supabase
    .from("post_subcategories")
    .delete()
    .eq("post_id", postId);

  if (delErr) throw new Error(delErr.message);

  if (subcategoryIds.length > 0) {
    const rows = subcategoryIds.map((sid) => ({
      post_id: postId,
      subcategory_id: sid,
    }));

    const { error: insErr } = await supabase
      .from("post_subcategories")
      .insert(rows);

    if (insErr) throw new Error(insErr.message);
  }

  redirect(`/post/${uniqueSlug}`);
}