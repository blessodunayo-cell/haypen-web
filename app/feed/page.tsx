"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

import TopNav from "@/components/feed/TopNav";
import FeedTabs from "@/components/feed/FeedTabs";
import PostCard from "@/components/feed/PostCard";
import FeedRightRail from "@/components/feed/FeedRightRail";

import styles from "./feed.module.css";

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
      const { data } = await supabase.auth.getSession();
      const session = data.session;

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

  const posts = [
    {
      id: "1",
      title: "The Quiet Strength of Starting Over",
      excerpt:
        "Some days you wake up and realize your life has been moving without your permission. This is how I took it back...",
      author: "Blessing Oba",
      category: "Life",
      readTime: "6 min read",
      views: 12450,
      cover: "https://picsum.photos/seed/haypen1/1200/700",
    },
    {
      id: "2",
      title: "A Letter to the Girl Who Won’t Quit",
      excerpt:
        "If nobody sees you yet, keep building. Your future self is watching and silently thanking you...",
      author: "Blessing Oba",
      category: "Motivation",
      readTime: "4 min read",
      views: 8820,
      cover: "https://picsum.photos/seed/haypen2/1200/700",
    },
    {
      id: "3",
      title: "Why Your First Draft Should Be Ugly",
      excerpt:
        "Perfection is the fastest way to kill your writing career. Here’s the method that saved me...",
      author: "Blessing Oba",
      category: "Writing",
      readTime: "5 min read",
      views: 20110,
      cover: "https://picsum.photos/seed/haypen3/1200/700",
    },
  ];

  if (loading) {
    return (
      <main className="hp-page" style={{ display: "grid", placeItems: "center" }}>
        <p className="hp-muted" style={{ fontWeight: 700 }}>
          Loading…
        </p>
      </main>
    );
  }

  if (!email) {
    router.push("/login");
    return null;
  }

  return (
    <div className="hp-page">
      <TopNav onSignOut={handleSignOut} signingOut={signingOut} />
      <FeedTabs active="for-you" />

      <main className={styles.wrap}>
        <div
          className="hp-surface"
          style={{
            padding: 16,
            marginTop: 14,
          }}
        >
          <div className={styles.grid}>
            <section className={styles.feedCol}>
              {posts.map((p) => (
                <PostCard key={p.id} {...p} />
              ))}
            </section>

            <aside>
              <FeedRightRail />
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}