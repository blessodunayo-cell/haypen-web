"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

type Series = {
  id: string;
  title: string;
  slug: string;
  cover_url: string | null;
};

export default function MySeriesPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const router = useRouter();

  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSeries() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("series")
        .select("id, title, slug, cover_url")
        .eq("author_id", user.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching series:", error);
      } else if (data) {
        setSeries(data);
      }

      setLoading(false);
    }

    fetchSeries();
  }, [supabase]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3efff",
      }}
    >
      {/* Header */}
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
          onClick={() => router.push("/dashboard")}
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

      {/* Content */}
      <div
        style={{
          padding: "18px 0 48px",
        }}
      >
        <div
          style={{
            marginLeft: 90,
          }}
        >
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
              margin: "14px 0 10px",
              fontSize: 30,
              fontWeight: 800,
              color: "#111827",
            }}
          >
            Manage your series
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: 14,
              color: "#6b7280",
            }}
          >
            Create and organize your story collections.
          </p>
        </div>

        <div
          style={{
            marginLeft: 90,
            marginTop: 22,
            display: "grid",
            gridTemplateColumns: "repeat(4, 270px)",
            gap: 18,
          }}
        >
          {!loading &&
            series.map((s) => (
              <div
                key={s.id}
                onClick={() => router.push(`/series/${s.slug}`)}
                style={{
                  width: 270,
                  borderRadius: 18,
                  overflow: "hidden",
                  background: "#ffffff",
                  border: "1px solid #d8d4e8",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: 180,
                    background: "#f8f7fc",
                    overflow: "hidden",
                  }}
                >
                  {s.cover_url ? (
                    <img
                      src={s.cover_url}
                      alt={s.title}
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
                        fontWeight: 600,
                        fontSize: 15,
                      }}
                    >
                      No cover yet
                    </div>
                  )}
                </div>

                <div
                  style={{
                    padding: "14px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      color: "#111827",
                      marginBottom: 6,
                    }}
                  >
                    {s.title}
                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      color: "#6b7280",
                    }}
                  >
                    Series
                  </div>
                </div>
              </div>
            ))}

          {!loading && (
            <div
              onClick={() => router.push("/dashboard/create-series")}
              style={{
                width: 270,
                borderRadius: 18,
                overflow: "hidden",
                background: "#ffffff",
                border: "1px dashed #b6abf8",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: 180,
                  background: "#faf8ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#8b7cf6",
                  fontWeight: 700,
                  fontSize: 34,
                }}
              >
                +
              </div>

              <div
                style={{
                  padding: "14px",
                }}
              >
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: "#111827",
                    marginBottom: 6,
                  }}
                >
                  Create New Series
                </div>

                <div
                  style={{
                    fontSize: 13,
                    color: "#6b7280",
                  }}
                >
                  Add a new story collection
                </div>
              </div>
            </div>
          )}

          {loading && (
            <p
              style={{
                fontSize: 15,
                color: "#6b7280",
              }}
            >
              Loading...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}