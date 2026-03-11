"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../../lib/supabase/client";

type ProfileRow = {
  id: string;
  username: string;
  display_name: string | null;
};

type SeriesRow = {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  slug: string;
  created_at: string;
  is_public: boolean;
  is_active: boolean;
};

type ChapterRow = {
  id: string;
  title: string | null;
  slug: string;
  created_at: string;
  series_id: string | null;
};

export default function SeriesChaptersPage() {
  const params = useParams<{ username: string; slug: string }>();
  const username = params?.username ?? "writer";
  const seriesSlug = params?.slug ?? "series";
  const supabase = createClient();

  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [series, setSeries] = useState<SeriesRow | null>(null);
  const [chapters, setChapters] = useState<ChapterRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSeriesPage() {
      try {
        setLoading(true);
        setError(null);
        setNotFound(false);

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, username, display_name")
          .eq("username", username)
          .single();

        if (profileError || !profileData) {
          if (!cancelled) {
            setNotFound(true);
          }
          return;
        }

        if (cancelled) return;
        setProfile(profileData);

        const { data: seriesData, error: seriesError } = await supabase
          .from("series")
          .select(
            "id, title, description, cover_url, slug, created_at, is_public, is_active"
          )
          .eq("author_id", profileData.id)
          .eq("slug", seriesSlug)
          .eq("is_public", true)
          .eq("is_active", true)
          .single();

        if (seriesError || !seriesData) {
          if (!cancelled) {
            setNotFound(true);
          }
          return;
        }

        if (cancelled) return;
        setSeries(seriesData);

        const { data: chapterData, error: chapterError } = await supabase
          .from("posts")
          .select("id, title, slug, created_at, series_id")
          .eq("author_id", profileData.id)
          .eq("series_id", seriesData.id)
          .order("created_at", { ascending: true });

        if (chapterError) {
          throw chapterError;
        }

        if (!cancelled) {
          setChapters(chapterData ?? []);
        }
      } catch (err) {
        console.error("Failed to load public series detail page:", err);
        if (!cancelled) {
          setError("Could not load this series right now.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSeriesPage();

    return () => {
      cancelled = true;
    };
  }, [username, seriesSlug, supabase]);

  const headingName =
    profile?.display_name?.trim() || String(username).toUpperCase();

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

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Link
              href={`/profile/${username}/series`}
              className="hp-btn"
              style={softPill()}
            >
              <span style={{ fontSize: 14, lineHeight: 1 }}>←</span>
              <span>Series</span>
            </Link>

            <Link
              href={`/profile/${username}`}
              className="hp-btn"
              style={softPill()}
            >
              <span style={{ fontSize: 14, lineHeight: 1 }}>←</span>
              <span>Profile</span>
            </Link>
          </div>
        </div>
      </div>

      <div style={{ width: "100%", padding: "18px 22px 36px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {loading ? (
            <div style={infoBoxStyle()}>Loading series...</div>
          ) : notFound ? (
            <div style={infoBoxStyle()}>This series could not be found.</div>
          ) : error ? (
            <div style={infoBoxStyle()}>{error}</div>
          ) : !series ? (
            <div style={infoBoxStyle()}>This series could not be found.</div>
          ) : (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "320px minmax(0, 1fr)",
                  gap: 22,
                  alignItems: "start",
                }}
              >
                <div
                  style={{
                    borderRadius: 22,
                    overflow: "hidden",
                    border: "1px solid var(--hp-border)",
                    background: "var(--hp-card)",
                    boxShadow: "var(--hp-shadow-card)",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "4 / 5",
                      background:
                        "linear-gradient(180deg, rgba(124,108,255,0.14), rgba(124,108,255,0.05))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {series.cover_url ? (
                      <img
                        src={series.cover_url}
                        alt={series.title}
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
                          fontSize: 15,
                          fontWeight: 800,
                          color: "var(--hp-muted)",
                        }}
                      >
                        No cover yet
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 13, color: "var(--hp-muted)" }}>Series</div>

                  <h1
                    style={{
                      margin: "12px 0 0",
                      fontSize: 34,
                      fontWeight: 950,
                      lineHeight: 1.08,
                      textTransform: "uppercase",
                    }}
                  >
                    {series.title}
                  </h1>

                  <div
                    style={{
                      marginTop: 12,
                      fontSize: 14,
                      color: "var(--hp-muted)",
                    }}
                  >
                    By {headingName} • {chapters.length} chapter
                    {chapters.length === 1 ? "" : "s"}
                  </div>

                  <div
                    style={{
                      marginTop: 16,
                      fontSize: 15,
                      lineHeight: 1.65,
                      color: "var(--hp-muted)",
                      maxWidth: 700,
                    }}
                  >
                    {series.description?.trim() || "No description yet."}
                  </div>

                  {chapters.length > 0 && (
                    <div style={{ marginTop: 20 }}>
                      <Link
                        href={`/post/${chapters[0].slug}`}
                        className="hp-btn"
                        style={primaryPill()}
                      >
                        Start reading
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: 30 }}>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 900,
                    marginBottom: 14,
                  }}
                >
                  Chapters
                </div>

                {chapters.length === 0 ? (
                  <div style={infoBoxStyle()}>No chapters in this series yet.</div>
                ) : (
                  <div style={{ display: "grid", gap: 12 }}>
                    {chapters.map((chapter, index) => (
                      <Link
                        key={chapter.id}
                        href={`/post/${chapter.slug}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <div
                          style={{
                            borderRadius: 16,
                            border: "1px solid var(--hp-border)",
                            background: "var(--hp-card)",
                            boxShadow: "var(--hp-shadow-card)",
                            padding: "14px 16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 16,
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 900, fontSize: 14 }}>
                              Chapter {index + 1}
                            </div>
                            <div
                              style={{
                                marginTop: 6,
                                fontSize: 14,
                                color: "var(--hp-muted)",
                              }}
                            >
                              {chapter.title?.trim() || `Chapter ${index + 1}`}
                            </div>
                          </div>

                          <div
                            style={{
                              fontSize: 12,
                              color: "var(--hp-muted)",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {formatDate(chapter.created_at)}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString();
}

function infoBoxStyle(): React.CSSProperties {
  return {
    border: "1px solid var(--hp-border)",
    background: "var(--hp-card)",
    borderRadius: 18,
    padding: "18px 20px",
    color: "var(--hp-muted)",
    boxShadow: "var(--hp-shadow-card)",
    fontSize: 14,
  };
}

function softPill(): React.CSSProperties {
  return {
    textDecoration: "none",
    padding: "9px 14px",
    borderRadius: 999,
    border: "1px solid var(--hp-border)",
    background: "rgba(255,255,255,0.72)",
    color: "var(--hp-text)",
    fontWeight: 700,
    fontSize: 14,
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

function primaryPill(): React.CSSProperties {
  return {
    textDecoration: "none",
    padding: "11px 16px",
    borderRadius: 999,
    border: "1px solid var(--hp-border)",
    background:
      "linear-gradient(180deg, rgba(124,108,255,0.16), rgba(124,108,255,0.08))",
    color: "var(--hp-text)",
    fontWeight: 800,
    fontSize: 14,
    whiteSpace: "nowrap",
    boxShadow: "0 6px 18px rgba(17, 24, 39, 0.06)",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  };
}