import { createClient } from "@/app/lib/supabase/server";

export default async function PostPage(props: {
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  const params = await Promise.resolve(props.params);
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from("posts")
    .select("id, title, content, cover_url, published_at, ai_involved, slug")
    .eq("slug", params.slug)
    .single();

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#ebe6f7] px-6 py-10">
        <div className="mx-auto max-w-3xl rounded-3xl border border-gray-200 bg-[#f3f3f3] p-8">
          <h1 className="text-2xl font-semibold">Post not found</h1>
          <p className="mt-2 text-gray-600">
            This story may have been removed or the link is incorrect.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ebe6f7] px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-gray-200 bg-[#f3f3f3] p-8 shadow-sm">
          {(post as any).cover_url ? (
            <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                <img
                  src={(post as any).cover_url}
                  alt={(post as any).title ?? "Cover"}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          ) : null}

          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span>
              {new Date((post as any).published_at).toLocaleDateString()}
            </span>
            {(post as any).ai_involved ? (
              <>
                <span>•</span>
                <span className="rounded-full bg-white px-3 py-1 border border-gray-200">
                  AI involved
                </span>
              </>
            ) : null}
          </div>

          <h1 className="text-3xl font-semibold text-gray-900">
            {(post as any).title}
          </h1>

          <div className="mt-6 whitespace-pre-wrap leading-8 text-gray-900">
            {(post as any).content}
          </div>
        </div>
      </div>
    </div>
  );
}