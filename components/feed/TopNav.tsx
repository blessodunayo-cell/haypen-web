"use client";

import Link from "next/link";
import AvatarMenu from "./AvatarMenu";

function SearchIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <circle
        cx="11"
        cy="11"
        r="7"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="20"
        y1="20"
        x2="16.5"
        y2="16.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BellIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <path
        d="M12 22a2.2 2.2 0 0 0 2.2-2.2h-4.4A2.2 2.2 0 0 0 12 22Zm7-6.2V11a7 7 0 1 0-14 0v4.8L3.2 18c-.5.6-.1 1.5.7 1.5h16.2c.8 0 1.2-.9.7-1.5L19 15.8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function TopNav({
  onSignOut,
  signingOut,
}: {
  onSignOut?: () => void;
  signingOut?: boolean;
}) {
  return (
    <header
      className="hp-topnav"
      style={{
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
            fontWeight: 900,
            fontSize: 18,
            textDecoration: "none",
            color: "var(--hp-text)",
            letterSpacing: -0.2,
            marginRight: 10,
          }}
        >
          Haypen
        </Link>

        {/* Middle: Main nav links */}
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
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          {/* Search */}
          <Link
            href="/search"
            title="Search"
            aria-label="Search"
            style={{
              width: 36,
              height: 36,
              borderRadius: 999,
              border: "1px solid var(--hp-border)",
              display: "grid",
              placeItems: "center",
              textDecoration: "none",
              color: "var(--hp-text)",
              background: "var(--hp-card)",
              boxShadow: "var(--hp-shadow-card)",
            }}
          >
            <SearchIcon size={18} />
          </Link>

          {/* Notifications */}
          <button
            type="button"
            title="Notifications"
            aria-label="Notifications"
            onClick={() => alert("Notifications (dummy for now)")}
            style={{
              width: 36,
              height: 36,
              borderRadius: 999,
              border: "1px solid var(--hp-border)",
              background: "var(--hp-card)",
              color: "var(--hp-text)",
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
              boxShadow: "var(--hp-shadow-card)",
            }}
          >
            <BellIcon size={18} />
          </button>

          {/* Avatar dropdown */}
          <AvatarMenu onSignOut={onSignOut} signingOut={signingOut} />
        </div>
      </div>
    </header>
  );
}

const navLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "var(--hp-text)",
  fontWeight: 750,
  opacity: 0.9,
};