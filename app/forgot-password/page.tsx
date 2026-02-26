"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);

    const clean = email.trim();
    if (!clean) {
      setErr("Please enter your email.");
      return;
    }

    setLoading(true);

    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/reset-password`
        : undefined;

    const { error } = await supabase.auth.resetPasswordForEmail(clean, {
      redirectTo,
    });

    setLoading(false);

    if (error) {
      setErr(error.message);
      return;
    }

    setMsg("Reset link sent ✅ Check your email.");
    setEmail("");
  }

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
        padding: "0 16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          borderRadius: 18,
          border: "1px solid var(--hp-border)",
          background: "var(--hp-card)",
          boxShadow: "var(--hp-shadow-card)",
          padding: 18,
        }}
      >
        <div style={{ fontWeight: 900, marginBottom: 10 }}>Haypen</div>

        <h1 style={{ fontSize: 32, fontWeight: 900, margin: 0 }}>
          Forgot password
        </h1>

        <p style={{ marginTop: 10, color: "var(--hp-muted)" }}>
          Enter your email and we’ll send a reset link.
        </p>

        <form
          onSubmit={onSubmit}
          style={{ marginTop: 18, display: "grid", gap: 14 }}
        >
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontWeight: 700 }}>Email</span>
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
            disabled={loading}
            className="hp-btn"
            style={{
              padding: 12,
              fontWeight: 900,
              borderRadius: 999,
              border: "1px solid var(--hp-border)",
              background: "var(--hp-accent)",
              color: "white",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              boxShadow: "var(--hp-shadow-card)",
            }}
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>

          {err ? <p style={{ color: "#ff6b6b", margin: 0 }}>{err}</p> : null}
          {msg ? <p style={{ color: "var(--hp-muted)", margin: 0 }}>{msg}</p> : null}

          <p style={{ fontSize: 13, color: "var(--hp-muted)", margin: 0 }}>
            Remembered it?{" "}
            <Link href="/login" style={{ textDecoration: "underline" }}>
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}