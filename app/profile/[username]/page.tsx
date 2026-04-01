"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/app/lib/supabase/client";

type ProfileInfo = {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
};

type ProfileItem = {
  id: string;
  title: string;
  cover_image?: string | null;
  slug?: string | null;
  created_at: string;
  type: "post" | "series";
};

export default function PublicProfilePage() {
  const params = useParams<{ username: string }>();
  const username = params?.username ?? "";
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileInfo | null>(null);
  const [items, setItems] = useState<ProfileItem[]>([]);
  const [subscribers] = useState(0);

  const [page, setPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    let isMounted = true;

    async function fetchProfileContent() {
      try {
        setLoading(true);

        if (!username) {
          if (isMounted) {
            setProfile(null);
            setItems([]);
          }
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, username, display_name, bio")
          .eq("username", username)
          .maybeSingle();

        if (profileError) throw profileError;

        if (!profileData) {
          if (isMounted) {
            setProfile(null);
            setItems([]);
          }
          return;
        }

        const [postsResult, seriesResult] = await Promise.all([
          supabase
            .from("posts")
            .select("id, title, cover_url, slug, created_at")
            .eq("author_id", profileData.id)
            .eq("is_active", true),

          supabase
            .from("series")
            .select("id, title, cover_url, slug, created_at")
            .eq("author_id", profileData.id)
            .eq("is_active", true)
            .eq("is_public", true),
        ]);

        if (postsResult.error) throw postsResult.error;
        if (seriesResult.error) throw seriesResult.error;

        const mappedPosts: ProfileItem[] = (postsResult.data ?? []).map((post) => ({
          id: post.id,
          title: post.title,
          cover_image: post.cover_url,
          slug: post.slug,
          created_at: post.created_at,
          type: "post",
        }));

        const mappedSeries: ProfileItem[] = (seriesResult.data ?? []).map((series) => ({
          id: series.id,
          title: series.title,
          cover_image: series.cover_url,
          slug: series.slug,
          created_at: series.created_at,
          type: "series",
        }));

        const merged = [...mappedPosts, ...mappedSeries].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        if (isMounted) {
          setProfile(profileData);
          setItems(merged);
          setPage(1);
        }
      } catch (error) {
        console.error("Failed to fetch public profile:", error);

        if (isMounted) {
          setProfile(null);
          setItems([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProfileContent();

    return () => {
      isMounted = false;
    };
  }, [username]);

  const displayName = useMemo(() => {
    if (!profile) return username || "writer";
    return profile.display_name || profile.username;
  }, [profile, username]);

  const profileBio = profile?.bio?.trim() || "Writer on Haypen.";
  const hasItems = items.length > 0;

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const paginatedItems = useMemo(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    return items.slice(from, to);
  }, [items, page]);

  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

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
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: 0.2 }}>
            Haypen
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/feed" className="hp-btn" style={softPill()}>
              <span style={{ fontSize: 14, lineHeight: 1 }}>←</span>
              <span>Back</span>
            </Link>
          </div>
        </div>
      </div>

      <div style={{ width: "100%", padding: "18px 22px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              marginBottom: 18,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
              <div
                style={{
                  width: 132,
                  height: 132,
                  borderRadius: 999,
                  background:
                    "linear-gradient(180deg, rgba(124,108,255,0.14), rgba(124,108,255,0.05))",
                  border: "1px solid var(--hp-border)",
                  boxShadow: "var(--hp-shadow-card)",
                }}
              />

              <div>
                <div style={{ fontSize: 26, fontWeight: 950, letterSpacing: 0.4 }}>
                  {displayName}
                </div>

                <div
                  style={{
                    marginTop: 8,
                    fontSize: 13,
                    color: "var(--hp-muted)",
                  }}
                >
                  {subscribers} subscribers • Writer
                </div>

                <div
                  style={{
                    marginTop: 10,
                    fontSize: 14,
                    color: "var(--hp-muted)",
                    maxWidth: 560,
                    lineHeight: 1.5,
                  }}
                >
                  {profileBio}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Link
                href={`/profile/${username}/series`}
                className="hp-btn"
                style={softPill({ emphasize: true })}
                title="See series"
              >
                Series
              </Link>

              <button
                type="button"
                className="hp-btn"
                style={softPill()}
                title="Subscribe"
              >
                Subscribe
              </button>
            </div>
          </div>

          {loading ? (
            <EmptyBox title="Loading profile..." subtitle="" />
          ) : !profile ? (
            <EmptyBox
              title="Profile not found"
              subtitle="This writer profile does not exist or is unavailable."
            />
          ) : hasItems ? (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                  gap: 14,
                }}
              >
                {paginatedItems.map((item) => {
                  const href =
                    item.type === "post"
                      ? item.slug
                        ? `/post/${item.slug}`
                        : "#"
                      : item.slug
                      ? `/series/${item.slug}`
                      : "#";

                  return (
                    <Link
                      key={`${item.type}-${item.id}`}
                      href={href}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <div
                        style={{
                          borderRadius: 16,
                          overflow: "hidden",
                          border: "1px solid var(--hp-border)",
                          background: "var(--hp-card)",
                          boxShadow: "var(--hp-shadow-card)",
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            aspectRatio: "16 / 10",
                            background: item.cover_image
                              ? "transparent"
                              : "linear-gradient(180deg, rgba(124,108,255,0.10), rgba(124,108,255,0.03))",
                            position: "relative",
                          }}
                        >
                          {item.cover_image ? (
                            <img
                              src={item.cover_image}
                              alt={item.title}
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

                          <div
                            style={{
                              position: "absolute",
                              top: 10,
                              left: 10,
                              padding: "4px 8px",
                              borderRadius: 999,
                              background: "rgba(0,0,0,0.68)",
                              color: "#fff",
                              fontSize: 11,
                              fontWeight: 800,
                              letterSpacing: 0.2,
                            }}
                          >
                            {item.type === "post" ? "Post" : "Series"}
                          </div>
                        </div>

                        <div style={{ padding: 12 }}>
                          <div style={{ fontWeight: 850, fontSize: 13, lineHeight: 1.2 }}>
                            {item.title}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {totalItems > 0 && (
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

                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--hp-muted)",
                      fontWeight: 700,
                    }}
                  >
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
            </>
          ) : (
            <EmptyBox
              title="No content yet"
              subtitle="This writer has not published any posts or series yet."
            />
          )}
        </div>
      </div>
    </main>
  );
}

function EmptyBox({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
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
        <div style={{ fontSize: 16, fontWeight: 800 }}>{title}</div>
        {subtitle ? (
          <div
            style={{
              marginTop: 8,
              fontSize: 13,
              color: "var(--hp-muted)",
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function softPill(opts?: {
  emphasize?: boolean;
}): React.CSSProperties {
  const emphasize = !!opts?.emphasize;

  return {
    textDecoration: "none",
    padding: "9px 14px",
    borderRadius: 999,
    border: "1px solid var(--hp-border)",
    background: emphasize
      ? "linear-gradient(180deg, rgba(124,108,255,0.14), rgba(124,108,255,0.06))"
      : "rgba(255,255,255,0.72)",
    color: "var(--hp-text)",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    whiteSpace: "nowrap",
    boxShadow: "0 6px 18px rgba(17, 24, 39, 0.06)",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    transition: "all 0.18s ease",
  };
}