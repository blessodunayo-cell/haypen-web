"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: 12,
    marginTop: 6,
    borderRadius: 12,
    border: "1px solid var(--hp-border)",
    background: "var(--hp-card)",
    color: "var(--hp-text)",
    outline: "none",
    boxShadow: "var(--hp-shadow-card)",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--hp-bg)",
        color: "var(--hp-text)",
        display: "grid",
        placeItems: "center",
        padding: "40px 16px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 480 }}>
        <div
          style={{
            marginBottom: 14,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div style={{ fontWeight: 950, letterSpacing: 0.2 }}>Haypen</div>

          <Link href="/login" className="hp-btn" style={pill()}>
            Back to sign in
          </Link>
        </div>

        <div
          style={{
            borderRadius: 18,
            border: "1px solid var(--hp-border)",
            background: "var(--hp-card)",
            boxShadow: "var(--hp-shadow-card)",
            padding: 18,
          }}
        >
          <h1 style={{ fontSize: 30, fontWeight: 950, margin: 0 }}>
            Forgot password
          </h1>

          <p style={{ marginTop: 10, color: "var(--hp-muted)" }}>
            Enter your email and we’ll send a reset link.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Reset email will be wired next (Supabase).");
            }}
            style={{ marginTop: 18, display: "grid", gap: 14 }}
          >
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 800, opacity: 0.95 }}>
                Email
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                style={inputStyle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <button
              type="submit"
              className="hp-btn"
              style={{
                padding: 12,
                fontWeight: 900,
                borderRadius: 999,
                border: "1px solid var(--hp-border)",
                background:
                  "linear-gradient(180deg, rgba(124,108,255,0.22), rgba(124,108,255,0.10))",
                color: "var(--hp-text)",
                cursor: "pointer",
                boxShadow: "var(--hp-shadow-card)",
              }}
            >
              Send reset link
            </button>

            <p style={{ fontSize: 13, color: "var(--hp-muted)" }}>
              Remembered it?{" "}
              <Link href="/login" style={{ textDecoration: "underline", color: "inherit" }}>
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}

function pill(): React.CSSProperties {
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