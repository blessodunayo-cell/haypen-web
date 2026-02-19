import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function TopNav({
  onSignOut,
  signingOut,
  userInitials = "B",
}: {
  onSignOut?: () => void;
  signingOut?: boolean;
  userInitials?: string; // e.g. "BO"
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (menuRef.current.contains(e.target as Node)) return;
      setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

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
      <div style={{ width: "100%", padding: "14px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Left */}
          <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
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
          <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
            {/* Search icon only */}
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

            {/* Notifications bell (dummy for now) */}
            <button
              type="button"
              title="Notifications"
              aria-label="Notifications"
              style={{
                width: 36,
                height: 36,
                borderRadius: 999,
                border: "1px solid #3a3a3a",
                background: "transparent",
                color: "white",
                cursor: "pointer",
                opacity: 0.9,
              }}
              onClick={() => {
                // dummy placeholder for now
              }}
            >
              🔔
            </button>

            {/* Small avatar + dropdown */}
            <div ref={menuRef} style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Account menu"
                title="Account"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 999,
                  border: "1px solid #3a3a3a",
                  background: "rgba(255,255,255,0.06)",
                  color: "white",
                  fontWeight: 900,
                  cursor: "pointer",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                {userInitials}
              </button>

              {menuOpen ? (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 46,
                    width: 230,
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "#0f0f0f",
                    overflow: "hidden",
                    zIndex: 60,
                    boxShadow: "0 12px 40px rgba(0,0,0,0.55)",
                  }}
                >
                  <DropItem href="/profile">Profile</DropItem>
                  <DropItem href="/settings">Settings</DropItem>
                  <DropItem href="/dashboard">Earnings 💵</DropItem>
                  <DropItem href="/dashboard">Analytics</DropItem>

                  <div style={{ height: 1, background: "rgba(255,255,255,0.08)" }} />

                  <DropItem href="/support">Help & Support</DropItem>

                  {onSignOut ? (
                    <button
                      onClick={onSignOut}
                      disabled={!!signingOut}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "10px 12px",
                        border: "none",
                        background: "transparent",
                        color: "white",
                        cursor: signingOut ? "not-allowed" : "pointer",
                        opacity: signingOut ? 0.6 : 0.9,
                        fontWeight: 800,
                      }}
                      title="Sign out"
                    >
                      {signingOut ? "Signing out..." : "Sign out"}
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function DropItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        padding: "10px 12px",
        textDecoration: "none",
        color: "white",
        opacity: 0.9,
        fontWeight: 700,
      }}
    >
      {children}
    </Link>
  );
}
