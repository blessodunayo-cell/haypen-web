"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [method, setMethod] = useState<"email" | "phone">("email");

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

  return (
    <main style={{ maxWidth: 480, margin: "40px auto", padding: "0 16px" }}>
      <h1 style={{ fontSize: 32, fontWeight: 700 }}>Sign in</h1>

      <p style={{ marginTop: 8, opacity: 0.8 }}>
        Welcome back. Sign in to continue.
      </p>

      <div style={{ marginTop: 24, display: "grid", gap: 14 }}>
        {/* Choose login method */}
        <div>
          <p style={{ marginBottom: 8 }}>Sign in with</p>

          <label style={{ marginRight: 16 }}>
            <input
              type="radio"
              name="method"
              checked={method === "email"}
              onChange={() => setMethod("email")}
            />{" "}
            Email
          </label>

          <label>
            <input
              type="radio"
              name="method"
              checked={method === "phone"}
              onChange={() => setMethod("phone")}
            />{" "}
            Phone
          </label>
        </div>

        {/* Email OR Phone input */}
        {method === "email" ? (
          <label style={labelStyle}>
            <span>Email</span>
            <input
              type="email"
              placeholder="you@example.com"
              style={inputStyle}
              required
            />
          </label>
        ) : (
          <label style={labelStyle}>
            <span>Phone number</span>
            <input
              placeholder="+2348012345678"
              style={inputStyle}
              required
            />
          </label>
        )}

        {/* Password */}
        <label style={labelStyle}>
          <span>Password</span>
          <input
            type="password"
            placeholder="Your password"
            style={inputStyle}
            required
          />
        </label>

        {/* Stay logged in */}
        <label style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14, opacity: 0.9 }}>
          <input type="checkbox" defaultChecked />
          Stay logged in
        </label>

        <button
          style={{
            padding: 12,
            fontWeight: 600,
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          Sign in
        </button>

        {/* Links */}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, opacity: 0.85 }}>
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
      </div>
    </main>
  );
}
