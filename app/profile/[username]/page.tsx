"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type DummyCard = {
  id: string;
  title: string;
  image: string;
};

export default function PublicProfilePage() {
  const params = useParams<{ username: string }>();
  const username = params?.username ?? "writer";

  // dummy follow state (later: supabase user_follows)
  const [isFollowing, setIsFollowing] = useState(false);

  const imagePool = useMemo(
    () => [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=60",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=60",
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=60",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=60",
      "https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&w=1200&q=60",
      "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=60",
      "https://images.unsplash.com/photo-1520975958225-5b95b3d64f75?auto=format&fit=crop&w=1200&q=60",
    ],
    []
  );

  const cards: DummyCard[] = useMemo(() => {
    const titles = [
      "The Circle of Life",
      "The Gods Are to Blame",
      "No Escape",
      "Life Has No...",
      "Home to the Heart",
      "Drug Abuse",
      "Is It Legit?",
      "Hot Gist of...",
      "Nawa — Getting Better?",
      "How to Mind",
      "Mindset?",
      "Beat It Down",
      "The Hades of Lust",
      "Broken Star 94",
      "Broken Star 93",
      "Broken Star 92",
    ];

    return Array.from({ length: 24 }).map((_, i) => ({
      id: String(i + 1),
      title: titles[i % titles.length],
      image: imagePool[i % imagePool.length],
    }));
  }, [imagePool]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--hp-bg)",
        color: "var(--hp-text)",
      }}
    >
      {/* Simple top bar for public profile (no creator controls) */}
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
            <Link href="/feed" className="hp-btn" style={pill()}>
              Back to feed
            </Link>
          </div>
        </div>
      </div>

      <div style={{ width: "100%", padding: "18px 22px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Profile header (reader view) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              marginBottom: 16,
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
                  {String(username).toUpperCase()}
                </div>
                <div style={{ marginTop: 8, fontSize: 13, color: "var(--hp-muted)" }}>
                  12k followers • Writer
                </div>
              </div>
            </div>

            {/* Reader actions: Series + Follow */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Link
                href={`/profile/${username}/series`}
                className="hp-btn"
                style={pill({ emphasize: true })}
                title="See series"
              >
                Series
              </Link>

              <button
                type="button"
                onClick={() => setIsFollowing((v) => !v)}
                className="hp-btn"
                style={pill({ active: isFollowing })}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            </div>
          </div>

          {/* Writings grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 14,
            }}
          >
            {cards.map((c) => (
              <Link
                key={c.id}
                href={`/post/${c.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
                title="Open post"
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
                      background:
                        "linear-gradient(180deg, rgba(124,108,255,0.10), rgba(124,108,255,0.03))",
                    }}
                  >
                    <img
                      src={c.image}
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
                    <div style={{ fontWeight: 850, fontSize: 13, lineHeight: 1.2 }}>
                      {c.title}
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

function pill(opts?: { active?: boolean; emphasize?: boolean }): React.CSSProperties {
  const active = !!opts?.active;
  const emphasize = !!opts?.emphasize;

  return {
    textDecoration: "none",
    padding: "10px 16px",
    borderRadius: 999,
    border: `1px solid var(--hp-border)`,
    background: emphasize
      ? "linear-gradient(180deg, rgba(124,108,255,0.20), rgba(124,108,255,0.10))"
      : active
      ? "linear-gradient(180deg, rgba(124,108,255,0.18), rgba(124,108,255,0.08))"
      : "var(--hp-card)",
    color: "var(--hp-text)",
    fontWeight: 900,
    cursor: "pointer",
    whiteSpace: "nowrap",
    boxShadow: "var(--hp-shadow-card)",
  };
}