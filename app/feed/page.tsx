"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";

import TopNav from "@/components/feed/TopNav";
import FeedTabs from "@/components/feed/FeedTabs";
import PostCard from "@/components/feed/PostCard";
import FeedRightRail from "@/components/feed/FeedRightRail";

import styles from "./feed.module.css";

type FeedProfile =
  | {
      display_name: string | null;
      username: string | null;
    }
  | {
      display_name: string | null;
      username: string | null;
    }[]
  | null;

type FeedPost = {
  id: string;
  title: string;
  content: string | null;
  slug: string | null;
  cover_url: string | null;
  published_at: string | null;
  created_at: string;
  author_id: string | null;
  profiles: FeedProfile;
};

function makeExcerpt(content: string | null) {
  if (!content) return "No excerpt available yet.";
  return content.length > 160 ? `${content.slice(0, 160)}...` : content;
}

function estimateReadTime(content: string | null) {
  const words = content?.trim().split(/\s+/).filter(Boolean).length ?? 0;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

function getAuthorName(post: FeedPost) {
  const profile = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles;
  return profile?.display_name?.trim() || profile?.username || "Unknown writer";
}

export default function FeedPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!alive) return;

      setEmail(session?.user?.email ?? null);
      setLoading(false);
    }

    load();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
      setLoading(false);
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!loading && !email) {
      router.push("/login");
    }
  }, [loading, email, router]);

  useEffect(() => {
    async function loadPosts() {
      setPostsLoading(true);
      setPostsError(null);

      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          id,
          title,
          content,
          slug,
          cover_url,
          published_at,
          created_at,
          author_id,
          profiles:author_id (
            display_name,
            username
          )
        `
        )
        .not("slug", "is", null)
        .order("published_at", { ascending: false })
        .limit(20);

      if (error) {
        setPostsError(error.message);
        setPosts([]);
      } else {
        setPosts((data ?? []) as FeedPost[]);
      }

      setPostsLoading(false);
    }

    if (!loading && email) {
      loadPosts();
    }
  }, [loading, email, supabase]);

  if (loading) {
    return (
      <main className="hp-page" style={{ display: "grid", placeItems: "center" }}>
        <p className="hp-muted" style={{ fontWeight: 700 }}>
          Loading…
        </p>
      </main>
    );
  }

  if (!email) {
    return null;
  }

  return (
    <div className="hp-page">
      <TopNav />
      <FeedTabs active="for-you" />

      <main className={styles.wrap}>
        <div className="hp-surface" style={{ padding: 16, marginTop: 14 }}>
          <div className={styles.grid}>
            <section className={styles.feedCol}>
              {postsLoading ? (
                <p className="hp-muted" style={{ fontWeight: 700 }}>
                  Loading stories…
                </p>
              ) : postsError ? (
                <div
                  style={{
                    padding: 14,
                    borderRadius: 14,
                    border: "1px solid rgba(255, 107, 107, 0.35)",
                    background: "rgba(255, 107, 107, 0.08)",
                    color: "#b42318",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {postsError}
                </div>
              ) : posts.length === 0 ? (
                <div className="hp-card" style={{ padding: 18, borderRadius: 16 }}>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>
                    No stories yet
                  </h2>
                  <p className="hp-muted" style={{ marginTop: 8, fontSize: 14 }}>
                    Published stories will appear here once writers start posting.
                  </p>
                </div>
              ) : (
                posts.map((post) => (
                  <PostCard
                    key={post.id}
                    id={post.slug ?? post.id}
                    title={post.title}
                    excerpt={makeExcerpt(post.content)}
                    author={getAuthorName(post)}
                    category="Story"
                    readTime={estimateReadTime(post.content)}
                    views={0}
                    cover={post.cover_url ?? undefined}
                  />
                ))
              )}
            </section>

            <aside>
              <FeedRightRail />
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}