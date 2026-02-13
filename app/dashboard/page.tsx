"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export default function DashboardPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const dummyPosts = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => ({
        id: i + 1,
        title: `Dummy Post Title ${i + 1}`,
        excerpt:
          "This is a short preview of the post. Your real content will show here once you start publishing on Haypen...",
        meta: "Life • 6 min read • 0 views",
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
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: 24,
          maxWidth: 1200,
          margin: "0 auto",
          padding: 24,
        }}
      >
        {/* ===== LEFT SIDEBAR ===== */}
        <aside
          style={{
            position: "sticky",
            top: 90,
            alignSelf: "start",
            height: "fit-content",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14,
            background: "rgba(255,255,255,0.03)",
            padding: 16,
          }}
        >
          {/* Avatar + name */}
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div
              style={{
                width: 74,
                height: 74,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.12)",
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 800 }}>Blessing</div>
              <div style={{ fontSize: 12, opacity: 0.75 }}>Writer • Creator</div>
            </div>

            {/* 3-dots dropdown */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="More"
                title="More"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "transparent",
                  color: "white",
                  cursor: "pointer",
                  opacity: 0.9,
                }}
              >
                ⋮
              </button>

              {menuOpen ? (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 40,
                    width: 200,
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "#0f0f0f",
                    overflow: "hidden",
                    zIndex: 10,
                  }}
                >
                  <MenuItem href="/profile">Edit profile</MenuItem>
                  <MenuItem href="/dashboard">Dashboard</MenuItem>
                  <MenuItem href="/dashboard">Earnings 💵</MenuItem>
                  <MenuItem href="/settings">Settings</MenuItem>
                </div>
              ) : null}
            </div>
          </div>

          {/* Write button */}
          <div style={{ marginTop: 14 }}>
            <Link
              href="/write"
              style={{
                display: "block",
                textAlign: "center",
                padding: "12px 14px",
                borderRadius: 999,
                background: "white",
                color: "#0b0b0b",
                fontWeight: 900,
                textDecoration: "none",
              }}
            >
              Write
            </Link>
          </div>

          {/* Earnings card */}
          <div
            style={{
              marginTop: 14,
              borderRadius: 12,
              padding: 14,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <div style={{ fontSize: 12, opacity: 0.75 }}>Estimated earnings</div>
            <div style={{ fontSize: 22, fontWeight: 900, marginTop: 6 }}>$0.00</div>
            <div style={{ fontSize: 12, opacity: 0.65, marginTop: 6 }}>
              (Dummy for now)
            </div>
          </div>

          {/* Sidebar nav */}
          <nav style={{ marginTop: 14, display: "grid", gap: 8 }}>
            <SideLink href="/dashboard" label="Dashboard" />
            <SideLink href="/profile" label="Profile" />
            <SideLink href="/dashboard" label="Earnings" icon="💵" />
            <SideLink href="/settings" label="Settings" />
          </nav>
        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <section>
          <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900 }}>Your Posts</h1>
              <p style={{ marginTop: 8, opacity: 0.75 }}>
                Your published work will appear here as cards.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <Chip active>All</Chip>
              <Chip>Drafts</Chip>
              <Chip>Series</Chip>
            </div>
          </div>

          <div style={{ marginTop: 18, display: "grid", gap: 14 }}>
            {dummyPosts.map((p) => (
              <article
                key={p.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "200px 1fr",
                  gap: 14,
                  borderRadius: 14,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                {/* Thumbnail */}
                <div style={{ background: "rgba(255,255,255,0.10)", minHeight: 120 }} />

                {/* Text */}
                <div style={{ padding: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <h2 style={{ margin: 0, fontSize: 16, fontWeight: 900 }}>{p.title}</h2>
                    <span
                      style={{
                        fontSize: 12,
                        padding: "4px 10px",
                        borderRadius: 999,
                        border: "1px solid rgba(255,255,255,0.12)",
                        opacity: 0.85,
                        height: "fit-content",
                      }}
                    >
                      Monetized ✓
                    </span>
                  </div>

                  <p style={{ marginTop: 8, marginBottom: 10, opacity: 0.78, lineHeight: 1.45 }}>
                    {p.excerpt}
                  </p>

                  <div style={{ display: "flex", gap: 10, alignItems: "center", opacity: 0.75 }}>
                    <span style={{ fontSize: 12 }}>{p.meta}</span>
                    <span style={{ fontSize: 12 }}>•</span>
                    <span style={{ fontSize: 12 }}>Published</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {/* Click outside dropdown closes it (simple overlay) */}
      {menuOpen ? (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 5,
          }}
        />
      ) : null}
    </main>
  );
}

function SideLink({ href, label, icon }: { href: string; label: string; icon?: string }) {
  return (
    <Link
      href={href}
      style={{
        textDecoration: "none",
        color: "white",
        padding: "10px 12px",
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(255,255,255,0.02)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        opacity: 0.9,
      }}
    >
      <span style={{ fontWeight: 700 }}>{label}</span>
      {icon ? <span style={{ opacity: 0.85 }}>{icon}</span> : null}
    </Link>
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
        fontWeight: 800,
        opacity: 0.9,
      }}
    >
      {children}
    </button>
  );
}

function MenuItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        padding: "10px 12px",
        textDecoration: "none",
        color: "white",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        opacity: 0.9,
      }}
    >
      {children}
    </Link>
  );
}
