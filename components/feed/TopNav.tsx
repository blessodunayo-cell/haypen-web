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
      <div
        style={{
          // lets Sign out pin to far right
          position: "relative",
          width: "100%",
          padding: "14px 22px",
        }}
      >
        {/* Main nav row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            // leave room at far right so Sign out doesn’t overlap
            paddingRight: 120,
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

            <Link href="/dashboard" style={{ textDecoration: "none", color: "#bbb" }}>
              Dashboard
            </Link>

            <Link href="/write" style={{ textDecoration: "none", color: "#bbb" }}>
              Write
            </Link>

            <Link href="/explore" style={{ textDecoration: "none", color: "#bbb" }}>
              Explore
            </Link>

            <Link href="/popular" style={{ textDecoration: "none", color: "#bbb" }}>
              Popular
            </Link>
          </div>

          {/* Right (but not Sign out) */}
          <div style={{ marginLeft: "auto", display: "flex", gap: 14, alignItems: "center" }}>
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

            <Link href="/settings" style={{ textDecoration: "none", color: "#bbb" }}>
              Settings
            </Link>
          </div>
        </div>

        {/* Sign out pinned to the FAR RIGHT edge */}
        {onSignOut ? (
          <button
            onClick={onSignOut}
            disabled={!!signingOut}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",

              padding: "7px 14px",
              borderRadius: 999,
              border: "1px solid #3a3a3a",
              background: "transparent",
              color: "white",
              fontWeight: 800,
              cursor: signingOut ? "not-allowed" : "pointer",
              opacity: signingOut ? 0.6 : 0.75,
            }}
            title="Sign out"
          >
            {signingOut ? "Signing out..." : "Sign out"}
          </button>
        ) : null}
      </div>
    </header>
  );
}
