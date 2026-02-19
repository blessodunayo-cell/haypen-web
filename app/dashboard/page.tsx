"use client";

import { useMemo, useState } from "react";

export default function DashboardPage() {
  const [monetizationOn, setMonetizationOn] = useState(true);

  const dummyPosts = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        id: i + 1,
        title: `Dummy Post Title ${i + 1}`,
        views: 0,
        type: i % 3 === 0 ? "Series" : i % 3 === 1 ? "Article" : "Poem",
      })),
    []
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(1200px 600px at 20% 0%, rgba(255,255,255,0.06), transparent 55%), #0b0b0b",
        color: "white",
      }}
    >
      <div
        style={{
          maxWidth: 1250,
          margin: "0 auto",
          padding: "22px",
          display: "grid",
          gridTemplateColumns: "310px 1fr",
          gap: 22,
        }}
      >
        {/* LEFT SIDEBAR (your sketch) */}
        <aside
          style={{
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(255,255,255,0.03)",
            padding: 16,
            height: "fit-content",
            position: "sticky",
            top: 18,
          }}
        >
          {/* Big avatar + name */}
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div
              style={{
                width: 84,
                height: 84,
                borderRadius: 18,
                background: "rgba(255,255,255,0.10)",
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 900 }}>Blessing</div>
              <div style={{ fontSize: 12, opacity: 0.75 }}>Writer • Creator</div>
            </div>
          </div>

          {/* Write button */}
          <button
            type="button"
            onClick={() => alert("Write (will link to /write soon)")}
            style={{
              marginTop: 14,
              width: "100%",
              padding: "12px 14px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.06)",
              color: "white",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            Write
          </button>

          {/* Monetization ON (creator-level) */}
          <div
            style={{
              marginTop: 14,
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.02)",
              padding: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontWeight: 900 }}>Monetization</div>
              <div style={{ fontSize: 12, opacity: 0.75 }}>
                {monetizationOn ? "ON" : "OFF"} (dummy)
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMonetizationOn((v) => !v)}
              style={{
                width: 56,
                height: 30,
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.16)",
                background: monetizationOn ? "rgba(255,255,255,0.18)" : "transparent",
                color: "white",
                cursor: "pointer",
                fontWeight: 900,
              }}
              title="Toggle monetization"
            >
              {monetizationOn ? "ON" : "OFF"}
            </button>
          </div>

          {/* Earnings card */}
          <div
            style={{
              marginTop: 14,
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.02)",
              padding: 14,
            }}
          >
            <div style={{ fontSize: 12, opacity: 0.75 }}>Estimated earnings</div>
            <div style={{ fontSize: 22, fontWeight: 900, marginTop: 6 }}>$0.00</div>
            <div style={{ fontSize: 12, opacity: 0.65, marginTop: 6 }}>(Dummy for now)</div>
          </div>

          {/* Quick links (like your sketch list) */}
          <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
            <SideBtn label="Notifications" onClick={() => alert("Notifications (dummy)")} />
            <SideBtn label="Analytics" onClick={() => alert("Analytics (dummy)")} />
            <SideBtn label="Earnings" onClick={() => alert("Earnings (dummy)")} />
            <SideBtn label="Settings" onClick={() => alert("Settings (dummy)")} />
          </div>
        </aside>

        {/* RIGHT MAIN: Square-ish post cards grid */}
        <section>
          <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900 }}>Your Posts</h1>
              <p style={{ marginTop: 8, opacity: 0.75 }}>
                Your posts will show here as square cards. (Dummy for now)
              </p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <Chip active>All</Chip>
              <Chip>Drafts</Chip>
              <Chip>Series</Chip>
            </div>
          </div>

          <div
            style={{
              marginTop: 16,
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 14,
            }}
          >
            {dummyPosts.map((p) => (
              <article
                key={p.id}
                style={{
                  borderRadius: 14,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                {/* Square-ish cover */}
                <div
                  style={{
                    aspectRatio: "16 / 10",
                    background: "rgba(255,255,255,0.10)",
                  }}
                />

                <div style={{ padding: 12 }}>
                  <div style={{ fontWeight: 900 }}>{p.title}</div>

                  <div style={{ marginTop: 8, fontSize: 12, opacity: 0.75 }}>
                    {p.type} • {p.views} views
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function SideBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "12px 12px",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(255,255,255,0.02)",
        color: "white",
        cursor: "pointer",
        fontWeight: 800,
        opacity: 0.92,
      }}
    >
      {label}
    </button>
  );
}

function Chip({ children, active }: { children: string; active?: boolean }) {
  return (
    <button
      style={{
        padding: "8px 12px",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.12)",
        background: active ? "rgba(255,255,255,0.10)" : "transparent",
        color: "white",
        cursor: "pointer",
        fontWeight: 900,
        opacity: 0.9,
      }}
    >
      {children}
    </button>
  );
}
