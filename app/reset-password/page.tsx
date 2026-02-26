"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../lib/supabase";

function getHashParam(key: string) {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash?.replace(/^#/, "") || "";
  const params = new URLSearchParams(hash);
  return params.get(key);
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const search = useSearchParams();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;

    async function init() {
      setMsg(null);

      // 1) PKCE style: ?code=...
      const code = search.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!alive) return;
        if (error) {
          setMsg("This reset link is invalid or expired. Please request a new one.");
          setReady(false);
          return;
        }
        setReady(true);
        return;
      }

      // 2) Hash style: #access_token=...&refresh_token=...
      const access_token = getHashParam("access_token");
      const refresh_token = getHashParam("refresh_token");

      if (access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        if (!alive) return;

        if (error) {
          setMsg("This reset link is invalid or expired. Please request a new one.");
          setReady(false);
          return;
        }

        setReady(true);
        return;
      }

      // 3) If nothing provided
      setMsg("No recovery token found. Please request a new reset link.");
      setReady(false);
    }

    init();
    return () => {
      alive = false;
    };
  }, [search]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!ready) {
      setMsg("Please open the reset link from your email again.");
      return;
    }

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

    setMsg("Password updated successfully ✅ Redirecting…");
    setTimeout(() => router.replace("/login"), 900);
  }

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

        <h1 style={{ fontSize: 26, fontWeight: 950, margin: 0 }}>
          Reset password
        </h1>
        <p style={{ marginTop: 10, color: "var(--hp-muted)" }}>
          Enter a new password for your account.
        </p>

        <form onSubmit={onSubmit} style={{ marginTop: 16, display: "grid", gap: 12 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontWeight: 700 }}>New password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 12,
                border: "1px solid var(--hp-border)",
                background: "var(--hp-card)",
                color: "var(--hp-text)",
                outline: "none",
                boxShadow: "var(--hp-shadow-card)",
              }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontWeight: 700 }}>Confirm password</span>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm password"
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 12,
                border: "1px solid var(--hp-border)",
                background: "var(--hp-card)",
                color: "var(--hp-text)",
                outline: "none",
                boxShadow: "var(--hp-shadow-card)",
              }}
            />
          </label>

          {msg ? <div style={{ color: "var(--hp-muted)", fontSize: 13 }}>{msg}</div> : null}

          <button
            disabled={loading || !ready}
            style={{
              padding: 12,
              borderRadius: 999,
              border: "1px solid var(--hp-border)",
              background: "var(--hp-accent)",
              color: "white",
              fontWeight: 900,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading || !ready ? 0.6 : 1,
              boxShadow: "var(--hp-shadow-card)",
            }}
            type="submit"
          >
            {loading ? "Updating…" : "Update password"}
          </button>
        </form>
      </div>
    </main>
  );
}