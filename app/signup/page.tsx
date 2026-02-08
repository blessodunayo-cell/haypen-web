"use client";

import { useState } from "react";

export default function SignupPage() {
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
      <h1 style={{ fontSize: 32, fontWeight: 700 }}>
        Create your Haypen account
      </h1>

      <p style={{ marginTop: 8, opacity: 0.8 }}>
        Sign up to read, write, and follow creators.
      </p>

      <div style={{ marginTop: 24, display: "grid", gap: 14 }}>
        {/* Display name */}
        <label style={labelStyle}>
          <span>Display name</span>
          <input placeholder="e.g. Blessing" style={inputStyle} required />
        </label>

        {/* Choose method */}
        <div>
          <p style={{ marginBottom: 8 }}>Sign up with</p>

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

        {/* Email OR Phone */}
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
            placeholder="Minimum 8 characters"
            style={inputStyle}
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
          Create account
        </button>
      </div>

      {/* Small helper text */}
      <p style={{ marginTop: 14, fontSize: 13, opacity: 0.75 }}>
        Email verification will be required. Phone verification is coming soon.
      </p>
    </main>
  );
}
