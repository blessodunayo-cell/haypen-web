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

export async function createDraftPost(formData: FormData) {
  console.log("createDraftPost started");

  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const coverUrl = String(formData.get("cover_url") ?? "").trim() || null;

  if (!title) throw new Error("Title is required.");
  if (!content) throw new Error("Content is required.");

  const supabase = await createClient();

  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;

  console.log("createDraftPost user:", user?.id);

  if (!user) throw new Error("Not authenticated.");

  const { data, error } = await supabase
    .from("posts")
    .insert({
      author_id: user.id,
      title,
      content,
      cover_url: coverUrl,
    })
    .select("id")
    .single();

  console.log("createDraftPost insert error:", error);
  console.log("createDraftPost inserted data:", data);

  if (error) throw new Error(error.message);

  redirect(`/write/publish?postId=${data.id}`);
}

export async function publishPost(formData: FormData) {
  console.log("publishPost started");

  const postId = String(formData.get("postId") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "").trim();

  const aiInvolved = String(formData.get("aiInvolved") ?? "no") === "yes";
  const seriesChoice = String(formData.get("seriesChoice") ?? "no");
  const seriesIdRaw = String(formData.get("seriesId") ?? "").trim();
  const seriesId = seriesChoice === "yes" && seriesIdRaw ? seriesIdRaw : null;

  const subcategoryIds = formData
    .getAll("subcategoryIds")
    .map((v) => String(v).trim())
    .filter(Boolean);

  console.log("publishPost values:", {
    postId,
    categoryId,
    aiInvolved,
    seriesChoice,
    seriesId,
    subcategoryIds,
  });

  if (!postId) throw new Error("Missing postId.");
  if (!categoryId) throw new Error("Pick a category.");

  const supabase = await createClient();

  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;

  console.log("publishPost user:", user?.id);

  if (!user) throw new Error("Not authenticated.");

  const { data: post, error: postErr } = await supabase
    .from("posts")
    .select("id, author_id, published_at, title")
    .eq("id", postId)
    .single();

  console.log("publishPost fetched post:", post);
  console.log("publishPost fetch error:", postErr);

  if (postErr) throw new Error(postErr.message);
  if (!post) throw new Error("Post not found.");
  if (post.author_id !== user.id) throw new Error("Not allowed.");
  if (post.published_at) throw new Error("Already published.");

  const uniqueSlug = await getUniqueSlug(supabase, post.title ?? "");
  console.log("publishPost uniqueSlug:", uniqueSlug);

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

  console.log("publishPost update error:", updErr);

  if (updErr) throw new Error(updErr.message);

  const { error: delErr } = await supabase
    .from("post_subcategories")
    .delete()
    .eq("post_id", postId);

  console.log("publishPost delete error:", delErr);

  if (delErr) throw new Error(delErr.message);

  if (subcategoryIds.length > 0) {
    const rows = subcategoryIds.map((sid) => ({
      post_id: postId,
      subcategory_id: sid,
    }));

    console.log("publishPost rows to insert:", rows);

    const { error: insErr } = await supabase
      .from("post_subcategories")
      .insert(rows);

    console.log("publishPost insert error:", insErr);

    if (insErr) throw new Error(insErr.message);
  }

  console.log("publishPost redirecting to:", `/post/${uniqueSlug}`);
  redirect(`/post/${uniqueSlug}`);
}