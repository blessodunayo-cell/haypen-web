"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/app/lib/supabase/client";

type HomePost = {
  id: string;
  title: string;
  content: string | null;
  slug: string | null;
  published_at: string | null;
  created_at: string;
  category_name: string;
  author_name: string;
};

type LeaderboardWriter = {
  id: string;
  name: string;
  score: number;
};

function estimateReadTime(content: string | null) {
  if (!content) return "1 min read";
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

export default function Home() {
  const supabase = createClient();

  const [posts, setPosts] = useState<HomePost[]>([]);
  const [writers, setWriters] = useState<LeaderboardWriter[]>([]);
  const [loading, setLoading] = useState(true);

  const purpleBtn: React.CSSProperties = {
    background: "linear-gradient(135deg, #7C6AF2, #6A5AE0)",
    color: "#fff",
  };

  useEffect(() => {
    async function loadHomepage() {
      setLoading(true);

      const { data, error } = await supabase
        .from("posts")
        .select(`
          id,
          title,
          content,
          slug,
          published_at,
          created_at,
          author_id,
          profiles:author_id (
            id,
            display_name,
            username
          ),
          categories:category_id (
            name
          )
        `)
        .not("slug", "is", null)
        .order("published_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Homepage fetch error:", error.message);
        setPosts([]);
        setWriters([]);
        setLoading(false);
        return;
      }

      const cleanPosts: HomePost[] =
        data?.map((post: any) => {
          const profile = Array.isArray(post.profiles)
            ? post.profiles[0]
            : post.profiles;

          const category = Array.isArray(post.categories)
            ? post.categories[0]
            : post.categories;

          return {
            id: post.id,
            title: post.title,
            content: post.content,
            slug: post.slug,
            published_at: post.published_at,
            created_at: post.created_at,
            category_name: category?.name ?? "Story",
            author_name:
              profile?.display_name?.trim() ||
              profile?.username ||
              "Haypen Writer",
          };
        }) ?? [];

      setPosts(cleanPosts);

      const writerMap = new Map<string, LeaderboardWriter>();

      data?.forEach((post: any) => {
        const profile = Array.isArray(post.profiles)
          ? post.profiles[0]
          : post.profiles;

        const writerId = profile?.id || post.author_id;
        if (!writerId) return;

        const writerName =
          profile?.display_name?.trim() ||
          profile?.username ||
          "Haypen Writer";

        const existing = writerMap.get(writerId);

        writerMap.set(writerId, {
          id: writerId,
          name: writerName,
          score: existing ? existing.score + 1 : 1,
        });
      });

      setWriters(
        Array.from(writerMap.values())
          .sort((a, b) => b.score - a.score)
          .slice(0, 5)
      );

      setLoading(false);
    }

    loadHomepage();
  }, [supabase]);

  return (
    <main className="min-h-screen text-gray-900" style={{ background: "#EEEAF7" }}>
      <header className="border-b border-black/10 bg-[rgba(238,234,247,0.75)] backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="text-2xl font-semibold tracking-tight">Haypen</div>

          <nav className="flex items-center gap-3">
            <Link className="text-sm hover:underline" href="/explore">Explore</Link>
            <Link className="text-sm hover:underline" href="/write">Write</Link>

            <Link className="rounded-full border px-4 py-2 text-sm hover:bg-black/5" href="/login">
              Sign in
            </Link>

            <Link className="rounded-full px-4 py-2 text-sm text-white" style={purpleBtn} href="/signup">
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="md:col-span-2">
            <h1 className="text-4xl font-semibold leading-tight tracking-tight">
              A home for stories. A place for writers.
            </h1>

            <p className="mt-4 max-w-2xl text-gray-700">
              Haypen is a clean, modern home for stories, chapters, and articles.
              Read, write, follow creators, and discover what’s trending.
            </p>

            <div className="mt-8 flex gap-3">
              <Link className="rounded-full px-5 py-3 text-sm text-white" style={purpleBtn} href="/explore">
                Start reading
              </Link>

              <Link className="rounded-full border px-5 py-3 text-sm hover:bg-black/5" href="/signup">
                Become a writer
              </Link>
            </div>

            <div className="mt-10 border-t border-black/10 pt-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Trending</h2>
                <Link className="text-sm text-gray-700 hover:underline" href="/explore">See all</Link>
              </div>

              <div className="grid gap-4">
                {loading ? (
                  <div className="rounded-2xl border border-black/10 bg-white p-5 text-sm text-gray-600">
                    Loading trending stories...
                  </div>
                ) : posts.length === 0 ? (
                  <div className="rounded-2xl border border-black/10 bg-white p-5 text-sm text-gray-600">
                    No published stories yet.
                  </div>
                ) : (
                  posts.map((p) => (
                    <Link
                      key={p.id}
                      href={p.slug ? `/post/${p.slug}` : "#"}
                      className="block rounded-2xl border border-black/10 bg-white p-5 hover:bg-black/5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-gray-700">
                          {p.category_name}
                        </span>
                        <span className="text-xs text-gray-600">{estimateReadTime(p.content)}</span>
                      </div>

                      <h3 className="mt-3 text-xl font-semibold">{p.title}</h3>
                      <p className="mt-1 text-sm text-gray-700">by {p.author_name}</p>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>

          <aside className="md:col-span-1">
            <div className="sticky top-6 space-y-6">
              <div className="rounded-2xl border border-black/10 bg-white p-5">
                <h3 className="text-base font-semibold">Leaderboard</h3>
                <p className="mt-1 text-sm text-gray-700">Top writers this week.</p>

                <ol className="mt-4 space-y-3 text-sm">
                  {loading ? (
                    <li className="text-gray-600">Loading writers...</li>
                  ) : writers.length === 0 ? (
                    <li className="text-gray-600">No writers yet.</li>
                  ) : (
                    writers.map((writer, i) => (
                      <li key={writer.id} className="flex items-center justify-between">
                        <span className="text-gray-800">{i + 1}. {writer.name}</span>
                        <span className="text-gray-600">⭐</span>
                      </li>
                    ))
                  )}
                </ol>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-5">
                <h3 className="text-base font-semibold">Start writing</h3>
                <p className="mt-1 text-sm text-gray-700">
                  Create your channel and publish your first story in minutes.
                </p>

                <Link className="mt-4 block w-full rounded-full px-4 py-2 text-center text-sm text-white" style={purpleBtn} href="/login">
                  Create a channel
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <footer className="border-t border-black/10">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-gray-600">
          © {new Date().getFullYear()} Haypen • Privacy • Terms
        </div>
      </footer>
    </main>
  );
}