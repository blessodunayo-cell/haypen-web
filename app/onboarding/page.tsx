"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";

export default function OnboardingPage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      return setError("Please enter a username.");
    }

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("You must be logged in.");
        setLoading(false);
        return;
      }

      const cleanUsername = username.trim().toLowerCase();

      // 🔍 Check if username already exists
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", cleanUsername)
        .maybeSingle();

      if (existing) {
        setError("Username already taken.");
        setLoading(false);
        return;
      }

      // 🧠 Get display name from auth metadata
      const displayName =
        (user.user_metadata?.display_name as string) || "Writer";

      // 💾 Insert profile
      const { error: insertError } = await supabase.from("profiles").insert({
        id: user.id,
        username: cleanUsername,
        display_name: displayName,
      });

      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }

      // ✅ Go to feed
      router.replace("/feed");
    } catch (err) {
      setError("Something went wrong.");
    }

    setLoading(false);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 20,
        background: "var(--hp-bg)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 420,
          padding: 22,
          borderRadius: 16,
          background: "var(--hp-card)",
          border: "1px solid var(--hp-border)",
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 900 }}>
          Choose your username
        </h1>

        <p style={{ fontSize: 13, marginTop: 6, opacity: 0.7 }}>
          This will be your public profile link.
        </p>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. victorywrites"
          style={{
            marginTop: 14,
            width: "100%",
            padding: 12,
            borderRadius: 10,
            border: "1px solid var(--hp-border)",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 14,
            width: "100%",
            padding: 12,
            borderRadius: 10,
            fontWeight: 800,
            background: "#7c6cff",
            color: "#fff",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Saving..." : "Continue"}
        </button>

        {error && (
          <div style={{ marginTop: 10, color: "red", fontSize: 13 }}>
            {error}
          </div>
        )}
      </form>
    </main>
  );
}