"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

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

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      setMsg(error.message);
      return;
    }

    router.push("/feed");
  }

  return (
    <main
      className="hp-page"
      style={{ display: "grid", placeItems: "center", padding: "40px 16px" }}
    >
      <div className="hp-surface" style={{ width: "100%", maxWidth: 520, padding: 22 }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: 0.2 }}>
            Haypen
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 950, marginTop: 10 }}>
            Sign in
          </h1>

          <p className="hp-muted" style={{ marginTop: 8, fontSize: 14, lineHeight: 1.45 }}>
            Welcome back. Sign in to continue.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          style={{ marginTop: 18, display: "grid", gap: 14 }}
        >
          {/* Email */}
          <label style={labelStyle}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Email</span>
            <input
              type="email"
              placeholder="you@example.com"
              style={inputStyle}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          {/* Password */}
          <label style={labelStyle}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Password</span>
            <input
              type="password"
              placeholder="Your password"
              style={inputStyle}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {/* Stay logged in (UI only for now) */}
          <label
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              fontSize: 14,
              color: "var(--hp-muted)",
              userSelect: "none",
            }}
          >
            <input type="checkbox" defaultChecked />
            Stay logged in
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
            {loading ? "Signing in..." : "Sign in"}
          </button>

          {msg ? (
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
              {msg}
            </div>
          ) : null}

          {/* Links */}
          <div
            style={{
              marginTop: 6,
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              fontSize: 13,
              color: "var(--hp-muted)",
              flexWrap: "wrap",
            }}
          >
            <Link href="/forgot-password" style={{ textDecoration: "underline", color: "var(--hp-text)" }}>
              Forgot password?
            </Link>

            <span>
              Don&apos;t have an account?{" "}
              <Link href="/signup" style={{ textDecoration: "underline", color: "var(--hp-text)" }}>
                Create one
              </Link>
            </span>
          </div>
        </form>
      </div>
    </main>
  );
}