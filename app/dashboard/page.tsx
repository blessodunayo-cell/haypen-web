"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AvatarMenu from "@/components/feed/AvatarMenu";
import { createClient } from "@/app/lib/supabase/client";

function BellIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 22a2.2 2.2 0 0 0 2.2-2.2h-4.4A2.2 2.2 0 0 0 12 22Zm7-6.2V11a7 7 0 1 0-14 0v4.8L3.2 18c-.5.6-.1 1.5.7 1.5h16.2c.8 0 1.2-.9.7-1.5L19 15.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type PostCard = {
  id: string;
  title: string;
  cover_image?: string | null;
  slug?: string | null;
};

export default function DashboardPage() {
  const supabase = createClient();

  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [posts, setPosts] = useState<PostCard[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [subscribers] = useState(0);
  const [penName] = useState("GOLDEN PEN");
  const [loading, setLoading] = useState(true);

  const totalPages = Math.max(1, Math.ceil(totalPosts / pageSize));

  useEffect(() => {
    let isMounted = true;

    async function fetchPosts() {
      try {
        setLoading(true);

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error("Failed to get current user:", userError);
          window.location.href = "/login";
          return;
        }

        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        const { data, count, error } = await supabase
          .from("posts")
          .select("id, title, cover_url, slug", { count: "exact" })
          .eq("author_id", user.id)
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .range(from, to);

        if (error) throw error;

        if (isMounted) {
          const mappedPosts: PostCard[] = (data ?? []).map((post) => ({
            id: post.id,
            title: post.title,
            cover_image: post.cover_url,
            slug: post.slug,
          }));

          setPosts(mappedPosts);
          setTotalPosts(count ?? 0);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard posts:", error);

        if (isMounted) {
          setPosts([]);
          setTotalPosts(0);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, [page, supabase]);

  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  const emptyMessage = useMemo(() => {
    if (loading) return "Loading your posts...";
    return "No published posts yet.";
  }, [loading]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--hp-bg)",
        color: "var(--hp-text)",
      }}
    >
      <div
        className="hp-topnav"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            width: "100%",
            padding: "14px 22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 14,
            maxWidth: 1280,
            margin: "0 auto",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: 0.2 }}>
              Haypen
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link
              href="/write"
              className="hp-btn"
              style={{
                textDecoration: "none",
                padding: "8px 12px",
                borderRadius: 999,
                border: "1px solid var(--hp-border)",
                background: "var(--hp-card)",
                color: "var(--hp-text)",
                fontWeight: 800,
                fontSize: 12,
                whiteSpace: "nowrap",
                boxShadow: "var(--hp-shadow-card)",
              }}
            >
              Create a post
            </Link>

            <button
              type="button"
              onClick={() => alert("Notifications")}
              className="hp-btn"
              style={{
                width: 38,
                height: 38,
                borderRadius: 999,
                border: "1px solid var(--hp-border)",
                background: "var(--hp-card)",
                color: "var(--hp-text)",
                cursor: "pointer",
                display: "grid",
                placeItems: "center",
                boxShadow: "var(--hp-shadow-card)",
              }}
              aria-label="Notifications"
              title="Notifications"
            >
              <BellIcon />
            </button>

            <AvatarMenu />
          </div>
        </div>
      </div>

      <div style={{ width: "100%", padding: "18px 22px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              gap: 18,
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: 132,
                height: 132,
                borderRadius: 999,
                background:
                  "linear-gradient(180deg, rgba(124,108,255,0.10), rgba(124,108,255,0.04))",
                border: "1px solid var(--hp-border)",
                boxShadow: "var(--hp-shadow-card)",
              }}
            />

            <div>
              <div style={{ fontSize: 26, fontWeight: 950, letterSpacing: 0.4 }}>
                {penName}
              </div>

              <div style={{ marginTop: 8, fontSize: 13, color: "var(--hp-muted)" }}>
                {subscribers} subscribers
              </div>
            </div>
          </div>

          {posts.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: 14,
              }}
            >
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={post.slug ? `/post/${post.slug}` : "#"}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                    style={{
                      borderRadius: 16,
                      overflow: "hidden",
                      border: "1px solid var(--hp-border)",
                      background: "var(--hp-card)",
                      boxShadow: "var(--hp-shadow-card)",
                      transition: "transform 120ms ease",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        aspectRatio: "16 / 10",
                        background: post.cover_image
                          ? "transparent"
                          : "linear-gradient(180deg, rgba(124,108,255,0.10), rgba(124,108,255,0.03))",
                      }}
                    >
                      {post.cover_image ? (
                        <img
                          src={post.cover_image}
                          alt={post.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "grid",
                            placeItems: "center",
                            fontSize: 12,
                            color: "var(--hp-muted)",
                          }}
                        >
                          No cover image
                        </div>
                      )}
                    </div>

                    <div style={{ padding: 12 }}>
                      <div style={{ fontWeight: 850, fontSize: 13, lineHeight: 1.2 }}>
                        {post.title}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div
              style={{
                minHeight: 260,
                borderRadius: 18,
                border: "1px solid var(--hp-border)",
                background: "var(--hp-card)",
                boxShadow: "var(--hp-shadow-card)",
                display: "grid",
                placeItems: "center",
                textAlign: "center",
                padding: 24,
              }}
            >
              <div>
                <div style={{ fontSize: 16, fontWeight: 800 }}>{emptyMessage}</div>
                {!loading && (
                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 13,
                      color: "var(--hp-muted)",
                    }}
                  >
                    Your published posts will appear here.
                  </div>
                )}
              </div>
            </div>
          )}

          {!loading && totalPosts > 0 && (
            <div
              style={{
                marginTop: 22,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 12,
              }}
            >
              <button
                type="button"
                onClick={() => setPage((p) => p - 1)}
                disabled={!canGoPrev}
                className="hp-btn"
                style={{
                  padding: "10px 16px",
                  borderRadius: 999,
                  border: "1px solid var(--hp-border)",
                  background: "var(--hp-card)",
                  color: "var(--hp-text)",
                  fontWeight: 900,
                  cursor: canGoPrev ? "pointer" : "not-allowed",
                  opacity: canGoPrev ? 1 : 0.6,
                  boxShadow: "var(--hp-shadow-card)",
                }}
              >
                Previous
              </button>

              <div style={{ fontSize: 13, color: "var(--hp-muted)", fontWeight: 700 }}>
                Page {page} of {totalPages}
              </div>

              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={!canGoNext}
                className="hp-btn"
                style={{
                  padding: "10px 16px",
                  borderRadius: 999,
                  border: "1px solid var(--hp-border)",
                  background: "var(--hp-card)",
                  color: "var(--hp-text)",
                  fontWeight: 900,
                  cursor: canGoNext ? "pointer" : "not-allowed",
                  opacity: canGoNext ? 1 : 0.6,
                  boxShadow: "var(--hp-shadow-card)",
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}