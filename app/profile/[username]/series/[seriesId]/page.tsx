"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Chapter = {
  no: number;
  title: string;
  date: string;
};

function prettifySeriesId(seriesId: string) {
  return seriesId
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export default function SeriesChaptersPage() {
  const params = useParams<{ username: string; seriesId: string }>();
  const username = params?.username ?? "writer";
  const seriesId = params?.seriesId ?? "series";

  const meta = useMemo(() => {
    if (seriesId === "broken-star") return { title: "Broken Star", total: 94 };
    if (seriesId === "echoes-of-the-haunted-legacy") return { title: "Echoes of the Haunted Legacy", total: 65 };
    return { title: prettifySeriesId(seriesId), total: 30 };
  }, [seriesId]);

  // Dummy chapter list (show first 25 to keep it clean)
  const chapters: Chapter[] = useMemo(() => {
    const count = Math.min(meta.total, 25);
    return Array.from({ length: count }).map((_, i) => ({
      no: i + 1,
      title: `Chapter ${i + 1}`,
      date: `2026-${String((i % 12) + 1).padStart(2, "0")}-${String(((i * 2) % 28) + 1).padStart(2, "0")}`,
    }));
  }, [meta.total]);

  return (
    <main style={{ minHeight: "100vh", background: "#0b0b0b", color: "white" }}>
      {/* Top bar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderBottom: "1px solid rgba(255,255,255,0.10)",
          background: "rgba(11,11,11,0.86)",
          backdropFilter: "blur(10px)",
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
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: 0.2 }}>Haypen</div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Link
              href={`/profile/${username}/series`}
              style={{
                textDecoration: "none",
                padding: "8px 12px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.05)",
                color: "white",
                fontWeight: 800,
                fontSize: 12,
                whiteSpace: "nowrap",
              }}
            >
              Back to series
            </Link>

            <Link
              href={`/profile/${username}`}
              style={{
                textDecoration: "none",
                padding: "8px 12px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.05)",
                color: "white",
                fontWeight: 800,
                fontSize: 12,
                whiteSpace: "nowrap",
              }}
            >
              Back to {username}
            </Link>
          </div>
        </div>
      </div>

      <div style={{ width: "100%", padding: "18px 22px 32px", maxWidth: 980, margin: "0 auto" }}>
        <div style={{ fontSize: 12, opacity: 0.75 }}>Series</div>
        <h1 style={{ margin: "8px 0 0", fontSize: 34, fontWeight: 950 }}>
          {meta.title}
        </h1>
        <div style={{ marginTop: 10, fontSize: 13, opacity: 0.75 }}>
          By {username} • {meta.total} chapters
        </div>

        {/* Chapter list */}
        <div style={{ marginTop: 18, display: "grid", gap: 10 }}>
          {chapters.map((ch) => (
            <div
              key={ch.no}
              style={{
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(255,255,255,0.03)",
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontWeight: 950 }}>Chapter {ch.no}</div>
                <div style={{ marginTop: 6, fontSize: 12, opacity: 0.75 }}>
                  {ch.title}
                </div>
              </div>

              <div style={{ fontSize: 12, opacity: 0.7, whiteSpace: "nowrap" }}>{ch.date}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16, fontSize: 12, opacity: 0.65 }}>
          Showing first {chapters.length} chapters (dummy). Later we’ll add pagination and real chapter titles.
        </div>
      </div>
    </main>
  );
}