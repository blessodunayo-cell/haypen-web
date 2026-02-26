"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function AvatarMenu({
  onSignOut,
  signingOut,
}: {
  onSignOut?: () => void;
  signingOut?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (wrapRef.current.contains(e.target as Node)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const itemStyle: React.CSSProperties = {
    display: "block",
    padding: "10px 12px",
    borderRadius: 12,
    textDecoration: "none",
    color: "var(--hp-text)",
    fontSize: 13,
    fontWeight: 750,
  };

  const itemHover: React.CSSProperties = {
    background: "var(--hp-accent-soft)",
    border: "1px solid rgba(124,108,255,0.18)",
  };

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      {/* Avatar button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title="Account"
        aria-label="Account"
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "1px solid var(--hp-border)",
          background: "var(--hp-card)",
          cursor: "pointer",
          boxShadow: "var(--hp-shadow-card)",
        }}
      />

      {/* Dropdown */}
      {open ? (
        <div
          className="hp-card"
          style={{
            position: "absolute",
            right: 0,
            top: 44,
            minWidth: 230,
            padding: 10,
            borderRadius: 16,
            zIndex: 100,
          }}
        >
          {/* ✅ Owner "Me" profile */}
          <HoverLink href="/me" base={itemStyle} hover={itemHover} onPick={() => setOpen(false)}>
            Profile
          </HoverLink>

          <HoverLink href="/series" base={itemStyle} hover={itemHover} onPick={() => setOpen(false)}>
            My Series
          </HoverLink>

          <HoverLink href="/earnings" base={itemStyle} hover={itemHover} onPick={() => setOpen(false)}>
            Earnings
          </HoverLink>

          <HoverLink href="/analytics" base={itemStyle} hover={itemHover} onPick={() => setOpen(false)}>
            Analytics
          </HoverLink>

          <div style={{ height: 1, background: "var(--hp-border)", margin: "8px 6px" }} />

          <HoverLink href="/support" base={itemStyle} hover={itemHover} onPick={() => setOpen(false)}>
            Help & Support
          </HoverLink>

          <HoverLink href="/settings" base={itemStyle} hover={itemHover} onPick={() => setOpen(false)}>
            Settings
          </HoverLink>

          <div style={{ height: 1, background: "var(--hp-border)", margin: "8px 6px" }} />

          {onSignOut ? (
            <button
              onClick={() => {
                setOpen(false);
                onSignOut();
              }}
              disabled={!!signingOut}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid transparent",
                background: "transparent",
                color: "var(--hp-text)",
                fontSize: 13,
                fontWeight: 900,
                cursor: signingOut ? "not-allowed" : "pointer",
                opacity: signingOut ? 0.55 : 0.95,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255,107,107,0.10)";
                (e.currentTarget as HTMLButtonElement).style.border =
                  "1px solid rgba(255,107,107,0.22)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                (e.currentTarget as HTMLButtonElement).style.border = "1px solid transparent";
              }}
              title="Sign out"
            >
              {signingOut ? "Signing out..." : "Sign out"}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function HoverLink({
  href,
  base,
  hover,
  onPick,
  children,
}: {
  href: string;
  base: React.CSSProperties;
  hover: React.CSSProperties;
  onPick: () => void;
  children: React.ReactNode;
}) {
  const [isHover, setIsHover] = useState(false);

  return (
    <Link
      href={href}
      onClick={onPick}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      style={{
        ...base,
        border: "1px solid transparent",
        ...(isHover ? hover : {}),
      }}
    >
      {children}
    </Link>
  );
}