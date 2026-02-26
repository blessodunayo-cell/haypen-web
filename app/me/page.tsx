"use client";

import Link from "next/link";

export default function MePage() {
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

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Link href="/dashboard" className="hp-btn" style={topPill()}>
              Dashboard
            </Link>

            <Link href="/feed" className="hp-btn" style={topPill()}>
              Feed
            </Link>
          </div>
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          width: "100%",
          padding: "22px",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 18,
          }}
        >
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <div
              style={{
                width: 110,
                height: 110,
                borderRadius: 999,
                background:
                  "linear-gradient(180deg, rgba(124,108,255,0.14), rgba(124,108,255,0.05))",
                border: "1px solid var(--hp-border)",
                boxShadow: "var(--hp-shadow-card)",
              }}
            />

            <div>
              <div style={{ fontSize: 26, fontWeight: 950, letterSpacing: 0.3 }}>
                Blessing
              </div>

              <div style={{ marginTop: 8, fontSize: 13, color: "var(--hp-muted)" }}>
                12k followers • 120 following • Creator
              </div>

              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <Link href="/profile/victory" className="hp-btn" style={miniPill()}>
                  View public profile
                </Link>

                <button
                  type="button"
                  onClick={() => alert("Edit profile (dummy)")}
                  className="hp-btn"
                  style={miniBtn()}
                >
                  Edit profile
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => alert("Share profile (dummy)")}
            className="hp-btn"
            style={{
              padding: "10px 14px",
              borderRadius: 999,
              border: "1px solid var(--hp-border)",
              background: "var(--hp-card)",
              color: "var(--hp-text)",
              fontWeight: 900,
              cursor: "pointer",
              whiteSpace: "nowrap",
              boxShadow: "var(--hp-shadow-card)",
            }}
          >
            Share
          </button>
        </div>

        {/* Quick tiles */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 14,
            marginBottom: 18,
          }}
        >
          <Tile label="Total views" value="124,892" />
          <Tile label="Stories" value="46" />
          <Tile label="Earnings" value="$238.90" />
        </div>

        {/* Actions list */}
        <div
          style={{
            borderRadius: 16,
            border: "1px solid var(--hp-border)",
            background: "var(--hp-card)",
            boxShadow: "var(--hp-shadow-card)",
            overflow: "hidden",
          }}
        >
          <MeRow title="My Series" subtitle="Manage your series and chapters" href="/series" />
          <MeRow
            title="Analytics"
            subtitle="Views, followers, and top posts"
            href="/dashboard/analytics"
          />
          <MeRow title="Earnings" subtitle="See how much you’ve made" href="/earnings" />
          <MeRow title="Settings" subtitle="Account, security, preferences" href="/settings" />
        </div>

        <div style={{ marginTop: 14, fontSize: 12, color: "var(--hp-muted)" }}>
          This is your private creator profile (“Me”). Dummy for now. We’ll connect it to
          Supabase later.
        </div>
      </div>
    </main>
  );
}

function topPill(): React.CSSProperties {
  return {
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
  };
}

function miniPill(): React.CSSProperties {
  return {
    textDecoration: "none",
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid var(--hp-border)",
    background: "var(--hp-card)",
    color: "var(--hp-text)",
    fontWeight: 850,
    fontSize: 12,
    whiteSpace: "nowrap",
    boxShadow: "var(--hp-shadow-card)",
  };
}

function miniBtn(): React.CSSProperties {
  return {
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid var(--hp-border)",
    background: "var(--hp-card)",
    color: "var(--hp-text)",
    fontWeight: 850,
    fontSize: 12,
    cursor: "pointer",
    whiteSpace: "nowrap",
    boxShadow: "var(--hp-shadow-card)",
  };
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        borderRadius: 16,
        border: "1px solid var(--hp-border)",
        background: "var(--hp-card)",
        boxShadow: "var(--hp-shadow-card)",
        padding: 14,
      }}
    >
      <div style={{ fontSize: 12, color: "var(--hp-muted)" }}>{label}</div>
      <div style={{ marginTop: 8, fontSize: 22, fontWeight: 950 }}>{value}</div>
    </div>
  );
}

function MeRow({
  title,
  subtitle,
  href,
}: {
  title: string;
  subtitle: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
        padding: "14px 14px",
        borderTop: "1px solid var(--hp-border)",
        background: "transparent",
      }}
    >
      <div style={{ fontWeight: 950 }}>{title}</div>
      <div style={{ marginTop: 6, fontSize: 12, color: "var(--hp-muted)" }}>
        {subtitle}
      </div>
    </Link>
  );
}