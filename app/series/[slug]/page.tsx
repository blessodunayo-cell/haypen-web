"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useParams, useRouter } from "next/navigation";

type SeriesData = {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  slug: string;
  author_id: string;
  is_public: boolean;
  is_active: boolean;
};

type PostChapter = {
  id: string;
  title: string;
  slug: string;
  created_at?: string;
};

export default function SeriesDetailPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const [series, setSeries] = useState<SeriesData | null>(null);
  const [chapters, setChapters] = useState<PostChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchSeriesPage() {
      if (!slug) return;

      setLoading(true);
      setErrorMsg("");

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const { data: seriesData, error: seriesError } = await supabase
          .from("series")
          .select(
            "id, title, description, cover_url, slug, author_id, is_public, is_active"
          )
          .eq("slug", slug)
          .single();

        if (seriesError || !seriesData) {
          setErrorMsg("Series not found.");
          setLoading(false);
          return;
        }

        setSeries(seriesData);
        setIsOwner(!!user && user.id === seriesData.author_id);

        const { data: postData, error: postError } = await supabase
          .from("posts")
          .select("id, title, slug, created_at")
          .eq("series_id", seriesData.id)
          .order("created_at", { ascending: true });

        if (!postError && postData) {
          setChapters(postData);
        }
      } catch (error) {
        setErrorMsg("Something went wrong while loading the series.");
      }

      setLoading(false);
    }

    fetchSeriesPage();
  }, [slug, supabase]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3efff",
      }}
    >
      <div
        style={{
          height: 78,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
          borderBottom: "1px solid #ddd6fe",
          background: "#f3efff",
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#111827",
          }}
        >
          Haypen
        </div>

        <button
          type="button"
          onClick={() => router.back()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 16px",
            borderRadius: 999,
            border: "1px solid #ddd6fe",
            background: "#ffffff",
            color: "#111827",
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 2px 10px rgba(17, 24, 39, 0.04)",
          }}
        >
          <span style={{ fontSize: 16 }}>←</span>
          <span>Back</span>
        </button>
      </div>

      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "30px 24px 50px",
        }}
      >
        {loading ? (
          <p
            style={{
              fontSize: 15,
              color: "#6b7280",
            }}
          >
            Loading series...
          </p>
        ) : errorMsg ? (
          <div
            style={{
              padding: "14px 16px",
              borderRadius: 14,
              background: "#fff1f2",
              border: "1px solid #fecdd3",
              color: "#be123c",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {errorMsg}
          </div>
        ) : series ? (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "340px 1fr",
                gap: 28,
                alignItems: "start",
              }}
            >
              <div
                style={{
                  width: "100%",
                  borderRadius: 22,
                  overflow: "hidden",
                  background: "#ffffff",
                  border: "1px solid #ddd6fe",
                  boxShadow: "0 8px 24px rgba(17, 24, 39, 0.05)",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "4 / 5",
                    background: "#faf8ff",
                    overflow: "hidden",
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
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#8b7cf6",
                        fontWeight: 700,
                        fontSize: 16,
                      }}
                    >
                      No cover yet
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    color: "#6b7280",
                  }}
                >
                  Series
                </p>

                <h1
                  style={{
                    margin: "12px 0 10px",
                    fontSize: 34,
                    lineHeight: 1.15,
                    fontWeight: 900,
                    color: "#111827",
                  }}
                >
                  {series.title}
                </h1>

                <p
                  style={{
                    margin: 0,
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: "#4b5563",
                    maxWidth: 700,
                  }}
                >
                  {series.description || "No description yet."}
                </p>

                <div
                  style={{
                    marginTop: 18,
                    display: "flex",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: 999,
                      border: "1px solid #ddd6fe",
                      background: "#ffffff",
                      color: "#111827",
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    {chapters.length} {chapters.length === 1 ? "chapter" : "chapters"}
                  </div>

                  {isOwner ? (
                    <button
                      type="button"
                      onClick={() => router.push(`/series/${series.slug}/write`)}
                      style={{
                        padding: "10px 16px",
                        borderRadius: 999,
                        border: "1px solid #8b7cf6",
                        background: "#8b7cf6",
                        color: "#ffffff",
                        fontSize: 14,
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      Add Chapter
                    </button>
                  ) : null}
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 34,
                background: "#ffffff",
                border: "1px solid #ddd6fe",
                borderRadius: 22,
                padding: 24,
                boxShadow: "0 8px 24px rgba(17, 24, 39, 0.05)",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#111827",
                }}
              >
                Chapters
              </h2>

              {chapters.length === 0 ? (
                <div
                  style={{
                    marginTop: 18,
                    padding: "18px 0 4px",
                    fontSize: 15,
                    color: "#6b7280",
                  }}
                >
                  {isOwner
                    ? "You have not added any chapters yet."
                    : "No chapters have been added to this series yet."}
                </div>
              ) : (
                <div
                  style={{
                    marginTop: 18,
                    display: "grid",
                    gap: 12,
                  }}
                >
                  {chapters.map((chapter, index) => (
                    <div
                      key={chapter.id}
                      onClick={() => router.push(`/post/${chapter.slug}`)}
                      style={{
                        border: "1px solid #e9e2ff",
                        background: "#fcfbff",
                        borderRadius: 16,
                        padding: "16px 18px",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 13,
                          color: "#8b7cf6",
                          fontWeight: 700,
                          marginBottom: 6,
                        }}
                      >
                        Chapter {index + 1}
                      </div>

                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 800,
                          color: "#111827",
                        }}
                      >
                        {chapter.title}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}