"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

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

  return (
    <main style={{ maxWidth: 480, margin: "40px auto", padding: "0 16px" }}>
      <h1 style={{ fontSize: 32, fontWeight: 700 }}>Forgot password</h1>

      <p style={{ marginTop: 8, opacity: 0.8 }}>
        Enter your email and we’ll send a reset link.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          alert("Reset email will be wired next (Supabase).");
        }}
        style={{ marginTop: 24, display: "grid", gap: 14 }}
      >
        <label style={{ display: "grid", gap: 6 }}>
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

        <button
          style={{
            padding: 12,
            fontWeight: 600,
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          Send reset link
        </button>

        <p style={{ fontSize: 13, opacity: 0.85 }}>
          Remembered it?{" "}
          <Link href="/login" style={{ textDecoration: "underline" }}>
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
}
