"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import AvatarMenu from "@/components/feed/AvatarMenu"; // adjust if needed

function BellIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 22a2.2 2.2 0 0 0 2.2-2.2h-4.4A2.2 2.2 0 0 0 12 22Zm7-6.2V11a7 7 0 1 0-14 0v4.8L3.2 18c-.5.6-.1 1.5.7 1.5h16.2c.8 0 1.2-.9.7-1.5L19 15.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type DummyCard = {
  id: string;
  title: string;
  image: string;
};

export default function DashboardPage() {
  const [monetizationOn, setMonetizationOn] = useState(true);

  // Pagination / "nearly infinite" catalog
  const [page, setPage] = useState(1);
  const pageSize = 16; // 16 cards per page like your current grid

  // Safe rotating image pool (reduces broken images)
  const imagePool = useMemo(
    () => [
      "https://images.unsplash.com/photo-1520975958225-5b95b3d64f75?auto=format&fit=crop&w=1200&q=60",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=60",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=60",
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=60",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=60",
      "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=60",
      "https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&w=1200&q=60",
    ],
    []
  );

  // “Infinity” dummy dataset (enough for Page 1–50 vibes)
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

    const total = 16 * 60; // 60 pages if you want (960 cards dummy)
    return Array.from({ length: total }).map((_, i) => {
      const title = titles[i % titles.length];
      const episode = i + 1;

      // Make repeated content feel like “real back pages”
      const fancyTitle =
        title.startsWith("Broken Star")
          ? `Broken Star ${100 - ((episode % 100) || 1)}`
          : title;

      return {
        id: String(i + 1),
        title: fancyTitle,
        image: imagePool[i % imagePool.length],
      };
    });
  }, [imagePool]);

  const visibleCards = cards.slice(0, page * pageSize);
  const maxPages = Math.ceil(cards.length / pageSize);
  const canLoadMore = page < maxPages;

  return (
    <main style={{ minHeight: "100vh", background: "#0b0b0b", color: "white" }}>
      {/* TOP NAV (Dashboard-specific like your sketch) */}
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
          {/* Left: Haypen bold */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: 0.2 }}>Haypen</div>
          </div>

          {/* Right: Write, Monetization, Notifications, Avatar dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link
              href="/write"
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
              Write
            </Link>

            <div style={{ textAlign: "center" }}>
              <button
                type="button"
                onClick={() => setMonetizationOn((v) => !v)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "transparent",
                  color: "white",
                  fontWeight: 800,
                  fontSize: 12,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
                title="Toggle monetization"
              >
                Monetization
              </button>
              <div style={{ marginTop: 6, fontSize: 11, opacity: 0.7 }}>
                {monetizationOn ? "ON" : "OFF"}
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert("Notifications (dummy)")}
              style={{
                width: 38,
                height: 38,
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.04)",
                color: "white",
                cursor: "pointer",
                display: "grid",
                placeItems: "center",
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

      {/* BODY (full width) */}
      <div style={{ width: "100%", padding: "18px 22px 32px" }}>
        {/* Big avatar section (bigger, Vocal vibes) */}
        <div style={{ display: "flex", gap: 18, alignItems: "center", marginBottom: 16 }}>
          <div
            style={{
              width: 132,
              height: 132,
              borderRadius: 999,
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          />

          <div>
            <div style={{ fontSize: 26, fontWeight: 950, letterSpacing: 0.4 }}>
              GOLDEN PEN
            </div>
            <div style={{ marginTop: 8, fontSize: 13, opacity: 0.8 }}>12k followers</div>

            {/* optional small page indicator like vocal */}
            <div style={{ marginTop: 10, fontSize: 12, opacity: 0.65 }}>
              Page {page} of {maxPages}
            </div>
          </div>
        </div>

        {/* Grid of story cards (pics + title under, like feed) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 14,
          }}
        >
          {visibleCards.map((c) => (
            <div
              key={c.id}
              style={{
                borderRadius: 14,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <div style={{ width: "100%", aspectRatio: "16 / 10", background: "rgba(255,255,255,0.08)" }}>
                <img
                  src={c.image}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>

              <div style={{ padding: 12 }}>
                <div style={{ fontWeight: 850, fontSize: 13, lineHeight: 1.2 }}>{c.title}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Load more (gives "back pages" vibe) */}
        <div style={{ marginTop: 18, display: "flex", justifyContent: "center" }}>
          <button
            type="button"
            disabled={!canLoadMore}
            onClick={() => setPage((p) => p + 1)}
            style={{
              padding: "10px 16px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.14)",
              background: canLoadMore ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
              color: "white",
              fontWeight: 900,
              cursor: canLoadMore ? "pointer" : "not-allowed",
              opacity: canLoadMore ? 1 : 0.6,
            }}
          >
            {canLoadMore ? "Load more" : "No more posts"}
          </button>
        </div>
      </div>
    </main>
  );
}