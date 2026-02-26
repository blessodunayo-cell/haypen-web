"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Supabase sends recovery tokens in the URL hash: #access_token=...&type=recovery
  useEffect(() => {
    if (!window.location.hash) {
      setMsg("No recovery token found. Please request a new reset link.");
    }
  }, []);

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (password.length < 6) {
      setMsg("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setMsg("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setMsg(error.message);
      return;
    }

    setMsg("Password updated successfully. Redirecting to login…");
    setTimeout(() => router.replace("/login"), 900);
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
      <div style={{ width: "100%", maxWidth: 520 }}>
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

          <button
            type="button"
            className="hp-btn"
            onClick={() => router.push("/login")}
            style={pill()}
          >
            Back to sign in
          </button>
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
          <h1 style={{ fontSize: 26, fontWeight: 950, margin: 0 }}>
            Reset password
          </h1>

          <p style={{ marginTop: 10, color: "var(--hp-muted)" }}>
            Enter a new password for your account.
          </p>

          <form onSubmit={onSubmit} style={{ marginTop: 18, display: "grid", gap: 14 }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 800, opacity: 0.95 }}>
                New password
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
                style={inputStyle}
                required
              />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 800, opacity: 0.95 }}>
                Confirm password
              </span>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirm password"
                style={inputStyle}
                required
              />
            </label>

            {msg ? (
              <div
                style={{
                  fontSize: 13,
                  color: msg.toLowerCase().includes("success")
                    ? "var(--hp-text)"
                    : "var(--hp-muted)",
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid var(--hp-border)",
                  background:
                    "linear-gradient(180deg, rgba(124,108,255,0.10), rgba(124,108,255,0.04))",
                  boxShadow: "var(--hp-shadow-card)",
                }}
              >
                {msg}
              </div>
            ) : null}

            <button
              disabled={loading}
              type="submit"
              className="hp-btn"
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 999,
                border: "1px solid var(--hp-border)",
                background:
                  "linear-gradient(180deg, rgba(124,108,255,0.22), rgba(124,108,255,0.10))",
                color: "var(--hp-text)",
                fontWeight: 950,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                boxShadow: "var(--hp-shadow-card)",
              }}
            >
              {loading ? "Updating…" : "Update password"}
            </button>

            <div style={{ fontSize: 12, color: "var(--hp-muted)" }}>
              Tip: Use at least 8 characters for stronger security.
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

function pill(): React.CSSProperties {
  return {
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid var(--hp-border)",
    background: "var(--hp-card)",
    color: "var(--hp-text)",
    fontWeight: 850,
    fontSize: 12,
    whiteSpace: "nowrap",
    boxShadow: "var(--hp-shadow-card)",
    cursor: "pointer",
  };
}