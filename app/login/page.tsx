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

    // ✅ Send to feed after sign in
    router.push("/feed");
  }

  return (
    <main style={{ maxWidth: 480, margin: "40px auto", padding: "0 16px" }}>
      <h1 style={{ fontSize: 32, fontWeight: 700 }}>Sign in</h1>

      <p style={{ marginTop: 8, opacity: 0.8 }}>
        Welcome back. Sign in to continue.
      </p>

      <form onSubmit={handleLogin} style={{ marginTop: 24, display: "grid", gap: 14 }}>
        {/* Email */}
        <label style={labelStyle}>
          <span>Email</span>
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
          <span>Password</span>
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
            opacity: 0.9,
          }}
        >
          <input type="checkbox" defaultChecked />
          Stay logged in
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
          {loading ? "Signing in..." : "Sign in"}
        </button>

        {msg && <p style={{ marginTop: 6, color: "#ffb4b4" }}>{msg}</p>}

        {/* Links */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 13,
            opacity: 0.85,
          }}
        >
          <Link href="/forgot-password" style={{ textDecoration: "underline" }}>
            Forgot password?
          </Link>

          <span>
            Don&apos;t have an account?{" "}
            <Link href="/signup" style={{ textDecoration: "underline" }}>
              Create one
            </Link>
          </span>
        </div>
      </form>
    </main>
  );
}
