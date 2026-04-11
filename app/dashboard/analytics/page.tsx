"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";

type AnalyticsStats = {
  totalViews: number;
  subscribers: number;
  estimatedEarnings: number;
  storiesPublished: number;
};

export default function AnalyticsPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AnalyticsStats>({
    totalViews: 0,
    subscribers: 0,
    estimatedEarnings: 0,
    storiesPublished: 0,
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchAnalytics() {
      try {
        setLoading(true);

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error("Failed to get current user:", userError);
          router.replace("/login");
          return;
        }

        const [postsResult, seriesResult] = await Promise.all([
          supabase
            .from("posts")
            .select("id", { count: "exact", head: true })
            .eq("author_id", user.id)
            .eq("is_active", true),

          supabase
            .from("series")
            .select("id", { count: "exact", head: true })
            .eq("author_id", user.id)
            .eq("is_active", true),
        ]);

        if (postsResult.error) throw postsResult.error;
        if (seriesResult.error) throw seriesResult.error;

        const storiesPublished =
          (postsResult.count ?? 0) + (seriesResult.count ?? 0);

        if (isMounted) {
          setStats({
            totalViews: 0,
            subscribers: 0,
            estimatedEarnings: 0,
            storiesPublished,
          });
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);

        if (isMounted) {
          setStats({
            totalViews: 0,
            subscribers: 0,
            estimatedEarnings: 0,
            storiesPublished: 0,
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchAnalytics();

    return () => {
      isMounted = false;
    };
  }, [router, supabase]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#EEEAF7",
        color: "#1F1F24",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderBottom: "1px solid #DCD6F0",
          background: "rgba(238,234,247,0.9)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          style={{
            width: "100%",
            padding: "14px 22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 900 }}>Haypen</div>

          <Link
            href="/dashboard"
            style={{
              textDecoration: "none",
              padding: "8px 14px",
              borderRadius: 999,
              border: "1px solid #DCD6F0",
              background: "#FFFFFF",
              color: "#1F1F24",
              fontWeight: 800,
              fontSize: 13,
            }}
          >
            Back to dashboard
          </Link>
        </div>
      </div>

      <div style={{ padding: "28px 22px 40px", maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ fontSize: 32, fontWeight: 950, marginBottom: 8 }}>
          Analytics
        </h1>

        <p style={{ opacity: 0.7, marginBottom: 28 }}>
          Overview of your writing performance
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 18,
            marginBottom: 32,
          }}
        >
          <StatCard
            label="Total Views"
            value={loading ? "—" : stats.totalViews.toLocaleString()}
          />
          <StatCard
            label="Subscribers"
            value={loading ? "—" : stats.subscribers.toLocaleString()}
          />
          <StatCard
            label="Estimated Earnings"
            value={loading ? "—" : `$${stats.estimatedEarnings.toFixed(2)}`}
          />
          <StatCard
            label="Stories Published"
            value={loading ? "—" : stats.storiesPublished.toString()}
          />
        </div>

        <div
          style={{
            background: "#FBFAFF",
            borderRadius: 18,
            padding: 22,
            border: "1px solid rgba(124,108,255,0.18)",
            boxShadow: "0 10px 30px rgba(31,31,36,0.08)",
            boxSizing: "border-box",
            marginBottom: 24,
          }}
        >
          <h2 style={{ marginBottom: 14, fontSize: 20, fontWeight: 900 }}>
            Performance Overview
          </h2>

          <div
            style={{
              minHeight: 280,
              borderRadius: 14,
              border: "1px solid rgba(0,0,0,0.05)",
              background:
                "linear-gradient(180deg, rgba(124,108,255,0.05), rgba(124,108,255,0.02))",
              display: "grid",
              placeItems: "center",
              textAlign: "center",
              padding: 24,
            }}
          >
            <div>
              <div style={{ fontSize: 18, fontWeight: 850, marginBottom: 8 }}>
                No data yet
              </div>
              <div style={{ fontSize: 13, opacity: 0.7 }}>
                Performance insights will appear here once your content starts getting activity.
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            background: "#FBFAFF",
            borderRadius: 18,
            padding: 22,
            border: "1px solid rgba(124,108,255,0.18)",
            boxShadow: "0 10px 30px rgba(31,31,36,0.08)",
            boxSizing: "border-box",
          }}
        >
          <h2 style={{ marginBottom: 14, fontSize: 20, fontWeight: 900 }}>
            Top Performing Stories
          </h2>

          <div
            style={{
              borderRadius: 14,
              overflow: "hidden",
              background:
                "linear-gradient(180deg, rgba(124,108,255,0.06), rgba(124,108,255,0.02))",
              border: "1px solid rgba(0,0,0,0.03)",
              minHeight: 180,
              display: "grid",
              placeItems: "center",
              textAlign: "center",
              padding: 24,
            }}
          >
            <div>
              <div style={{ fontSize: 18, fontWeight: 850, marginBottom: 8 }}>
                No data yet
              </div>
              <div style={{ fontSize: 13, opacity: 0.7 }}>
                Your top performing stories will appear here once your content starts gaining traction.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 18,
        padding: 18,
        border: "1px solid rgba(0,0,0,0.04)",
        boxShadow: "0 8px 24px rgba(31,31,36,0.06)",
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.65 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 950, marginTop: 6 }}>
        {value}
      </div>
    </div>
  );
}