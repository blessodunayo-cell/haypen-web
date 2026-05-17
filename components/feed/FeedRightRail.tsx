"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/app/lib/supabase/client";

type SeriesProfile =
  | {
      username: string | null;
    }
  | {
      username: string | null;
    }[]
  | null;

type SeriesRailItem = {
  id: string;
  title: string;
  slug: string;
  cover_url: string | null;
  author_id: string;
  profiles: SeriesProfile;
};

export default function FeedRightRail() {
  const supabase = createClient();

  const [seriesList, setSeriesList] = useState<SeriesRailItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadSeries() {
      setLoading(true);

      const { data, error } = await supabase
        .from("series")
        .select(
          `
          id,
          title,
          slug,
          cover_url,
          author_id,
          profiles:author_id (
            username
          )
        `
        )
        .eq("is_public", true)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(12);

      if (!cancelled) {
        if (error) {
          console.error("Failed to load popular series:", error.message);
          setSeriesList([]);
        } else {
          setSeriesList((data ?? []) as SeriesRailItem[]);
        }

        setLoading(false);
      }
    }

    loadSeries();

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  const boxStyle: React.CSSProperties = {
    border: "1px solid var(--hp-border)",
    borderRadius: 16,
    padding: 14,
    background: "var(--hp-card)",
    boxShadow: "var(--hp-shadow-card)",
  };

  const titleStyle: React.CSSProperties = {
    fontWeight: 950,
    fontSize: 13,
    color: "var(--hp-text)",
    marginBottom: 10,
    letterSpacing: -0.1,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={boxStyle}>
        <div style={titleStyle}>Popular series</div>

        {loading ? (
          <div className="hp-muted" style={{ fontSize: 13, fontWeight: 700 }}>
            Loading series…
          </div>
        ) : seriesList.length === 0 ? (
          <div className="hp-muted" style={{ fontSize: 13, lineHeight: 1.5 }}>
            Public series will appear here soon.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {seriesList.map((s) => {
              const profile = Array.isArray(s.profiles) ? s.profiles[0] : s.profiles;
              const username = profile?.username ?? "writer";

              return (
                <Link
                  key={s.id}
                  href={`/profile/${username}/series/${s.slug}`}
                  style={{
                    textDecoration: "none",
                    color: "var(--hp-text)",
                    border: "1px solid var(--hp-border)",
                    borderRadius: 14,
                    overflow: "hidden",
                    background: "var(--hp-card)",
                    display: "block",
                    boxShadow: "0 6px 16px rgba(17, 17, 26, 0.05)",
                    transition: "transform 160ms ease, box-shadow 160ms ease",
                  }}
                >
                  <div style={{ position: "relative" }}>
                    {s.cover_url ? (
                      <img
                        src={s.cover_url}
                        alt=""
                        style={{
                          width: "100%",
                          aspectRatio: "1 / 1",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          aspectRatio: "1 / 1",
                          display: "grid",
                          placeItems: "center",
                          background:
                            "linear-gradient(180deg, rgba(124,108,255,0.16), rgba(124,108,255,0.05))",
                          color: "var(--hp-muted)",
                          fontSize: 12,
                          fontWeight: 800,
                        }}
                      >
                        No cover
                      </div>
                    )}

                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to bottom, rgba(124,108,255,0.00), rgba(124,108,255,0.10))",
                        pointerEvents: "none",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      padding: 9,
                      fontSize: 12,
                      fontWeight: 850,
                      lineHeight: 1.25,
                    }}
                  >
                    {s.title}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}