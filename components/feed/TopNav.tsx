import Link from "next/link";

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
      {/* Full width so the right items can go far right */}
      <div
        style={{
          width: "100%",
          padding: "14px 22px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
        }}
      >
        {/* Left */}
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <Link
            href="/feed"
            style={{
              fontWeight: 800,
              fontSize: 18,
              textDecoration: "none",
              color: "white",
              letterSpacing: -0.2,
            }}
          >
            Haypen
          </Link>

          <Link href="/explore" style={{ textDecoration: "none", color: "#bbb" }}>
            Explore
          </Link>

          <Link href="/popular" style={{ textDecoration: "none", color: "#bbb" }}>
            Popular
          </Link>
        </div>

        {/* Right */}
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          {/* Icon-only search */}
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
            }}
          >
            🔍
          </Link>

          <Link
            href="/dashboard"
            style={{
              padding: "7px 14px",
              borderRadius: 999,
              border: "1px solid #3a3a3a",
              textDecoration: "none",
              color: "white",
              fontWeight: 700,
            }}
          >
            Dashboard
          </Link>

          <Link href="/settings" style={{ textDecoration: "none", color: "#bbb" }}>
            Settings
          </Link>

          {/* Sign out MUST be last */}
          {onSignOut ? (
            <button
              onClick={onSignOut}
              disabled={!!signingOut}
              style={{
                padding: "7px 14px",
                borderRadius: 999,
                border: "1px solid #3a3a3a",
                background: "transparent",
                color: "white",
                fontWeight: 800,
                cursor: signingOut ? "not-allowed" : "pointer",
                opacity: signingOut ? 0.7 : 1,
              }}
            >
              {signingOut ? "Signing out..." : "Sign out"}
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
