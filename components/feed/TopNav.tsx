"use client";

import Link from "next/link";
import AvatarMenu from "./AvatarMenu";

export default function TopNav({
  onSignOut,
  signingOut,
}: {
  onSignOut?: () => void;
  signingOut?: boolean;
}) {
  return (
    <header
      style={{
        borderBottom: "1px solid #2a2a2a",
        background: "#0b0b0b",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "14px 22px",
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        {/* Left: Brand */}
        <Link
          href="/feed"
          style={{
            fontWeight: 800,
            fontSize: 18,
            textDecoration: "none",
            color: "white",
            letterSpacing: -0.2,
            marginRight: 10,
          }}
        >
          Haypen
        </Link>

        {/* Middle: Main nav links (your old style) */}
        <nav style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <Link href="/dashboard" style={navLinkStyle}>
            Dashboard
          </Link>
          <Link href="/write" style={navLinkStyle}>
            Write
          </Link>
          <Link href="/explore" style={navLinkStyle}>
            Explore
          </Link>
          <Link href="/popular" style={navLinkStyle}>
            Popular
          </Link>
        </nav>

        {/* Right: Search + Notifications + Avatar */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
          {/* Search icon */}
          <Link
            href="/search"
            title="Search"
            aria-label="Search"
            style={{
              width: 36,
              height: 36,
              borderRadius: 999,
              border: "1px solid #3a3a3a",
              display: "grid",
              placeItems: "center",
              textDecoration: "none",
              color: "white",
              fontWeight: 800,
              lineHeight: 1,
              opacity: 0.9,
            }}
          >
            🔍
          </Link>

          {/* Notifications icon */}
          <button
            type="button"
            title="Notifications"
            aria-label="Notifications"
            onClick={() => alert("Notifications (dummy for now)")}
            style={{
              width: 36,
              height: 36,
              borderRadius: 999,
              border: "1px solid #3a3a3a",
              background: "transparent",
              color: "white",
              cursor: "pointer",
              fontSize: 16,
              opacity: 0.9,
            }}
          >
            🔔
          </button>

          {/* Avatar dropdown menu */}
          <AvatarMenu onSignOut={onSignOut} signingOut={signingOut} />
        </div>
      </div>
    </header>
  );
}

const navLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#bbb",
  fontWeight: 600,
  opacity: 0.95,
};
