"use client";

import Link from "next/link";

export default function AnalyticsPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#EEEAF7",
        color: "#1F1F24",
      }}
    >
      {/* TOP NAV */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderBottom: "1px solid #DCD6F0",
          background: "rgba(238,234,247,0.9)",
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
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 900 }}>Haypen</div>

          <Link
            href="/dashboard"
            style={{
              textDecoration: "none",
              padding: "8px 14px",
              borderRadius: 999,
              border: "1px solid #DCD6F0",
              background: "#FFFFFF",
              color: "#1F1F24",
              fontWeight: 800,
              fontSize: 13,
            }}
          >
            Back to dashboard
          </Link>
        </div>
      </div>

      {/* BODY */}
      <div style={{ padding: "28px 22px 40px", maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ fontSize: 32, fontWeight: 950, marginBottom: 8 }}>
          Analytics
        </h1>

        <p style={{ opacity: 0.7, marginBottom: 28 }}>
          Overview of your writing performance (dummy data)
        </p>

        {/* STATS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 18,
            marginBottom: 32,
          }}
        >
          <StatCard label="Total Views" value="124,892" />
          <StatCard label="Followers" value="12,104" />
          <StatCard label="Estimated Earnings" value="$238.90" />
          <StatCard label="Stories Published" value="46" />
        </div>

        {/* PERFORMANCE */}
        <div
          style={{
            background: "#FBFAFF",
            borderRadius: 18,
            padding: 22,
            border: "1px solid rgba(124,108,255,0.18)",
            boxShadow: "0 10px 30px rgba(31,31,36,0.08)",
            boxSizing: "border-box",
          }}
        >
          <h2 style={{ marginBottom: 14, fontSize: 20, fontWeight: 900 }}>
            Top Performing Stories
          </h2>

          <div
            style={{
              borderRadius: 14,
              overflow: "hidden",
              background:
                "linear-gradient(180deg, rgba(124,108,255,0.06), rgba(124,108,255,0.02))",
              border: "1px solid rgba(0,0,0,0.03)",
            }}
          >
            <DummyRow isFirst title="Broken Star 94" views="22,110" earnings="$44.20" />
            <DummyRow title="The Hades of Lust" views="18,332" earnings="$36.10" />
            <DummyRow title="No Escape" views="12,884" earnings="$25.02" />
            <DummyRow title="Life Has No..." views="9,120" earnings="$18.44" />
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 18,
        padding: 18,
        border: "1px solid rgba(0,0,0,0.04)",
        boxShadow: "0 8px 24px rgba(31,31,36,0.06)",
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.65 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 950, marginTop: 6 }}>
        {value}
      </div>
    </div>
  );
}

function DummyRow({
  title,
  views,
  earnings,
  isFirst = false,
}: {
  title: string;
  views: string;
  earnings: string;
  isFirst?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "14px 16px",
        borderTop: isFirst ? "none" : "1px solid rgba(0,0,0,0.05)",
        background: "transparent",
        transition: "background 160ms ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = "rgba(124,108,255,0.05)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = "transparent";
      }}
    >
      <div style={{ fontWeight: 750 }}>{title}</div>
      <div style={{ display: "flex", gap: 20, opacity: 0.82 }}>
        <span>{views} views</span>
        <span>{earnings}</span>
      </div>
    </div>
  );
}