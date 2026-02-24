"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type DummySeries = {
  id: string;
  title: string;
  chapters: number;
  cover: string;
};

export default function ProfileSeriesPage() {
  const params = useParams<{ username: string }>();
  const username = params?.username ?? "writer";

  const seriesList: DummySeries[] = useMemo(
    () => [
      {
        id: "broken-star",
        title: "Broken Star",
        chapters: 94,
        cover:
          "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=60",
      },
      {
        id: "echoes-of-the-haunted-legacy",
        title: "Echoes of the Haunted Legacy",
        chapters: 65,
        cover:
          "https://images.unsplash.com/photo-1520975958225-5b95b3d64f75?auto=format&fit=crop&w=1400&q=60",
      },
    ],
    []
  );

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

      <div style={{ width: "100%", padding: "18px 22px 32px" }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, opacity: 0.75 }}>Series</div>
          <h1 style={{ margin: "8px 0 0", fontSize: 28, fontWeight: 950 }}>
            Discover series from {username.toUpperCase()}
          </h1>
          <div style={{ marginTop: 8, fontSize: 13, opacity: 0.75 }}>
            (Dummy for now)
          </div>
        </div>

        {/* Series cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 14,
          }}
        >
          {seriesList.map((s) => (
            <Link
              key={s.id}
              href={`/profile/${username}/series/${s.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
              title="Open series"
            >
              <div
                style={{
                  borderRadius: 14,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <div style={{ width: "100%", aspectRatio: "16 / 9", background: "rgba(255,255,255,0.08)" }}>
                  <img
                    src={s.cover}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>

                <div style={{ padding: 12 }}>
                  <div style={{ fontWeight: 950, fontSize: 14 }}>{s.title}</div>
                  <div style={{ marginTop: 8, fontSize: 12, opacity: 0.75 }}>
                    {s.chapters} chapters
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}