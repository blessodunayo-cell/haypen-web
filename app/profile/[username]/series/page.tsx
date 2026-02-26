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
    <main
      style={{
        minHeight: "100vh",
        background: "var(--hp-bg)",
        color: "var(--hp-text)",
      }}
    >
      {/* Top bar */}
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

          <Link
            href={`/profile/${username}`}
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
            Back to {username}
          </Link>
        </div>
      </div>

      <div style={{ width: "100%", padding: "18px 22px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: "var(--hp-muted)" }}>Series</div>

            <h1 style={{ margin: "8px 0 0", fontSize: 28, fontWeight: 950 }}>
              Discover series from {String(username).toUpperCase()}
            </h1>

            <div style={{ marginTop: 8, fontSize: 13, color: "var(--hp-muted)" }}>
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
                      aspectRatio: "16 / 9",
                      background:
                        "linear-gradient(180deg, rgba(124,108,255,0.10), rgba(124,108,255,0.03))",
                    }}
                  >
                    <img
                      src={s.cover}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </div>

                  <div style={{ padding: 12 }}>
                    <div style={{ fontWeight: 950, fontSize: 14 }}>{s.title}</div>
                    <div style={{ marginTop: 8, fontSize: 12, color: "var(--hp-muted)" }}>
                      {s.chapters} chapters
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}