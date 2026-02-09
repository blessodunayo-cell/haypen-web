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

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: 12,
    marginTop: 6,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.25)",
    background: "rgba(255,255,255,0.06)",
    color: "inherit",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "grid",
    gap: 6,
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
            ? `${window.location.origin}/login`
            : undefined,
        data: {
          display_name: displayName.trim(),
        },
      },
    });

    setLoading(false);

    if (signUpError) return setError(signUpError.message);

    setMessage("Account created ✅ Check your email to verify, then sign in.");
    setPassword("");
  }

  return (
    <main style={{ maxWidth: 480, margin: "40px auto", padding: "0 16px" }}>
      <h1 style={{ fontSize: 32, fontWeight: 700 }}>
        Create your Haypen account
      </h1>

      <p style={{ marginTop: 8, opacity: 0.8 }}>
        Writers create an account to publish. Readers can explore freely.
      </p>

      <form
        onSubmit={handleSignup}
        style={{ marginTop: 24, display: "grid", gap: 14 }}
      >
        <label style={labelStyle}>
          <span>Display name</span>
          <input
            placeholder="e.g. Blessing"
            style={inputStyle}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        </label>

        <label style={labelStyle}>
          <span>Email</span>
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
          <span>Password</span>
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
          style={{
            padding: 12,
            fontWeight: 600,
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.2)",
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Creating..." : "Create account"}
        </button>

        {error ? (
          <p style={{ marginTop: 6, color: "#ff6b6b" }}>{error}</p>
        ) : null}

        {message ? (
          <p style={{ marginTop: 6, opacity: 0.9 }}>{message}</p>
        ) : null}
      </form>

      <p style={{ marginTop: 14, fontSize: 13, opacity: 0.75 }}>
        Already have an account?{" "}
        <Link href="/login" style={{ textDecoration: "underline" }}>
          Sign in
        </Link>
      </p>
    </main>
  );
}
