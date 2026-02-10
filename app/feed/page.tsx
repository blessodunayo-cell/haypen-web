"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function FeedPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let alive = true;

    async function load() {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;

      if (!alive) return;

      setEmail(session?.user?.email ?? null);
      setLoading(false);
    }

    load();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
      setLoading(false);
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    setSigningOut(true);
    await supabase.auth.signOut();
    setSigningOut(false);
    router.push("/");
  }

  if (loading) {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <p style={{ opacity: 0.85 }}>Loading…</p>
      </main>
    );
  }

  if (!email) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(1200px 600px at 20% 0%, rgba(255,255,255,0.08), transparent 55%), #0b0b0b",
          color: "white",
          padding: "64px 20px",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h1 style={{ fontSize: 40, fontWeight: 800, margin: 0 }}>
            You&apos;re not signed in
          </h1>
          <p style={{ marginTop: 12, opacity: 0.8 }}>
            Please sign in to access your feed.
          </p>

          <div style={{ display: "flex", gap: 16, marginTop: 22, alignItems: "center" }}>
            <Link
              href="/login"
              style={{
                padding: "10px 16px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.18)",
                textDecoration: "none",
                color: "inherit",
                fontWeight: 600,
              }}
            >
              Go to Sign in
            </Link>

            <Link
              href="/"
              style={{
                textDecoration: "underline",
                color: "inherit",
                opacity: 0.9,
                fontWeight: 600,
              }}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>Your Haypen Feed</h1>
          <p style={{ marginTop: 8, opacity: 0.8 }}>Signed in as: {email}</p>
        </div>

        <button
          onClick={handleSignOut}
          disabled={signingOut}
          style={{
            padding: "10px 16px",
            borderRadius: 999,
            border: "1px solid rgba(0,0,0,0.2)",
            background: "transparent",
            fontWeight: 700,
            cursor: signingOut ? "not-allowed" : "pointer",
            opacity: signingOut ? 0.7 : 1,
          }}
        >
          {signingOut ? "Signing out..." : "Sign out"}
        </button>
      </div>

      <div style={{ marginTop: 20, padding: 16, border: "1px solid #333", borderRadius: 12 }}>
        <p style={{ margin: 0, opacity: 0.9 }}>
          This is your feed page. Next we’ll load real posts here.
        </p>
      </div>
    </main>
  );
}
