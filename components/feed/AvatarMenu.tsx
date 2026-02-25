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
    borderRadius: 10,
    textDecoration: "none",
    color: "#e6e6e6",
    fontSize: 14,
    fontWeight: 650,
    opacity: 0.92,
  };

  const itemHover: React.CSSProperties = {
    background: "rgba(255,255,255,0.06)",
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
          border: "1px solid #3a3a3a",
          background: "rgba(255,255,255,0.06)",
          cursor: "pointer",
        }}
      />

      {/* Dropdown */}
      {open ? (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 44,
            minWidth: 230,
            padding: 8,
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "#0f0f0f",
            boxShadow: "0 12px 40px rgba(0,0,0,0.55)",
            zIndex: 100,
          }}
        >
          {/* ✅ FIXED: Owner "Me" profile */}
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

          <div style={{ height: 1, background: "rgba(255,255,255,0.10)", margin: "6px 6px" }} />

          <HoverLink href="/support" base={itemStyle} hover={itemHover} onPick={() => setOpen(false)}>
            Help & Support
          </HoverLink>

          <HoverLink href="/settings" base={itemStyle} hover={itemHover} onPick={() => setOpen(false)}>
            Settings
          </HoverLink>

          <div style={{ height: 1, background: "rgba(255,255,255,0.10)", margin: "6px 6px" }} />

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
                borderRadius: 10,
                border: "none",
                background: "transparent",
                color: "#e6e6e6",
                fontSize: 14,
                fontWeight: 750,
                cursor: signingOut ? "not-allowed" : "pointer",
                opacity: signingOut ? 0.55 : 0.95,
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
      style={{ ...base, ...(isHover ? hover : {}) }}
    >
      {children}
    </Link>
  );
}