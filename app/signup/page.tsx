"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const labelStyle: React.CSSProperties = { display: "grid", gap: 6 };

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

  function cleanUsername(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9_-]/g, "");
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const finalDisplayName = displayName.trim();
    const finalUsername = cleanUsername(username);
    const finalEmail = email.trim();

    if (!finalDisplayName) return setError("Please enter a display name.");
    if (!finalUsername) return setError("Please choose a username.");
    if (finalUsername.length < 3)
      return setError("Username must be at least 3 characters.");
    if (!finalEmail) return setError("Please enter your email.");
    if (!password || password.length < 8)
      return setError("Password must be at least 8 characters.");

    setLoading(true);

    const supabase = createClient();

    const { data: existingUsername, error: usernameError } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", finalUsername)
      .maybeSingle();

    if (usernameError) {
      setLoading(false);
      return setError(usernameError.message);
    }

    if (existingUsername) {
      setLoading(false);
      return setError("That username is already taken.");
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: finalEmail,
      password,
      options: {
        emailRedirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/auth/callback`
            : undefined,
        data: {
          display_name: finalDisplayName,
          username: finalUsername,
        },
      },
    });

    if (signUpError) {
      setLoading(false);
      return setError(signUpError.message);
    }

    if (data.session && data.user) {
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: data.user.id,
        display_name: finalDisplayName,
        username: finalUsername,
      });

      setLoading(false);

      if (profileError) return setError(profileError.message);

      router.push("/feed");
      router.refresh();
      return;
    }

    setLoading(false);
    setMessage("Account created ✅ Check your email to verify.");
    setPassword("");
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
            <span style={{ fontSize: 13, fontWeight: 700 }}>Username</span>
            <input
              placeholder="e.g. blessingwrites"
              style={inputStyle}
              value={username}
              onChange={(e) => setUsername(cleanUsername(e.target.value))}
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

          {error && (
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
          )}

          {message && (
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
          )}
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