"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";

export default function SignupPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const labelStyle: React.CSSProperties = {
    display: "grid",
    gap: 6,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: 12,
    marginTop: 6,
    borderRadius: 12,
    border: "1px solid var(--hp-border)",
    background: "var(--hp-card)",
    color: "var(--hp-text)",
    outline: "none",
    boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
  };

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!displayName.trim()) return setError("Please enter a display name.");
    if (!email.trim()) return setError("Please enter your email.");
    if (!password || password.length < 8)
      return setError("Password must be at least 8 characters.");

    setLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/auth/callback`
            : undefined,
        data: {
          display_name: displayName.trim(),
        },
      },
    });

    setLoading(false);

    if (signUpError) return setError(signUpError.message);

    setMessage("Account created ✅ Check your email to verify.");
    setPassword("");
  }

  return (
    <main className="hp-page" style={{ display: "grid", placeItems: "center", padding: "40px 16px" }}>
      <div className="hp-surface" style={{ width: "100%", maxWidth: 520, padding: 22 }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: 0.2 }}>
            Haypen
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 950, marginTop: 10 }}>
            Create your account
          </h1>

          <p className="hp-muted" style={{ marginTop: 8, fontSize: 14, lineHeight: 1.45 }}>
            Writers create an account to publish. Readers can explore freely.
          </p>
        </div>

        <form onSubmit={handleSignup} style={{ marginTop: 18, display: "grid", gap: 14 }}>
          <label style={labelStyle}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Display name</span>
            <input
              placeholder="e.g. Blessing"
              style={inputStyle}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </label>

          <label style={labelStyle}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Email</span>
            <input
              type="email"
              placeholder="you@example.com"
              style={inputStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label style={labelStyle}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Password</span>
            <input
              type="password"
              placeholder="Minimum 8 characters"
              style={inputStyle}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="hp-primary"
            style={{
              padding: 12,
              fontWeight: 800,
              border: "none",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Creating..." : "Create account"}
          </button>

          {error ? (
            <div
              style={{
                marginTop: 4,
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid rgba(255, 107, 107, 0.35)",
                background: "rgba(255, 107, 107, 0.08)",
                color: "#b42318",
                fontSize: 13,
                fontWeight: 650,
              }}
            >
              {error}
            </div>
          ) : null}

          {message ? (
            <div
              style={{
                marginTop: 4,
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid rgba(124, 108, 255, 0.25)",
                background: "rgba(124, 108, 255, 0.08)",
                color: "var(--hp-text)",
                fontSize: 13,
                fontWeight: 650,
              }}
            >
              {message}
            </div>
          ) : null}
        </form>

        <p className="hp-muted" style={{ marginTop: 14, fontSize: 13 }}>
          Already have an account?{" "}
          <Link href="/login" style={{ textDecoration: "underline", color: "var(--hp-text)" }}>
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}