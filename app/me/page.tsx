"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/app/lib/supabase/client";

type MeProfile = {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
};

type MeStats = {
  totalViews: number;
  stories: number;
  earnings: number;
};

export default function MePage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<MeProfile | null>(null);
  const [stats, setStats] = useState<MeStats>({
    totalViews: 0,
    stories: 0,
    earnings: 0,
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchMe() {
      try {
        setLoading(true);

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error("Failed to get current user:", userError);
          window.location.href = "/login";
          return;
        }

        const [profileResult, postsResult, seriesResult] = await Promise.all([
          supabase
            .from("profiles")
            .select("id, username, display_name, bio")
            .eq("id", user.id)
            .maybeSingle(),

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

        if (profileResult.error) throw profileResult.error;
        if (postsResult.error) throw postsResult.error;
        if (seriesResult.error) throw seriesResult.error;

        const stories =
          (postsResult.count ?? 0) + (seriesResult.count ?? 0);

        if (isMounted) {
          setProfile(profileResult.data ?? null);
          setStats({
            totalViews: 0,
            stories,
            earnings: 0,
          });
        }
      } catch (error) {
        console.error("Failed to fetch private profile:", error);

        if (isMounted) {
          setProfile(null);
          setStats({
            totalViews: 0,
            stories: 0,
            earnings: 0,
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchMe();

    return () => {
      isMounted = false;
    };
  }, []);

  const displayName = useMemo(() => {
    if (!profile) return "Writer";
    return profile.display_name || profile.username || "Writer";
  }, [profile]);

  const username = profile?.username || "";
  const bio = profile?.bio?.trim() || "Writer on Haypen.";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--hp-bg)",
        color: "var(--hp-text)",
      }}
    >
      <div
        className="hp-topnav"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            width: "100%",
            padding: "14px 22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 14,
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: 0.2 }}>
            Haypen
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Link href="/dashboard" className="hp-btn" style={topPill()}>
              Dashboard
            </Link>

            <Link href="/feed" className="hp-btn" style={topPill()}>
              Feed
            </Link>
          </div>
        </div>
      </div>

      <div
        style={{
          width: "100%",
          padding: "22px",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 18,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <div
              style={{
                width: 110,
                height: 110,
                borderRadius: 999,
                background:
                  "linear-gradient(180deg, rgba(124,108,255,0.14), rgba(124,108,255,0.05))",
                border: "1px solid var(--hp-border)",
                boxShadow: "var(--hp-shadow-card)",
              }}
            />

            <div>
              <div style={{ fontSize: 26, fontWeight: 950, letterSpacing: 0.3 }}>
                {loading ? "Loading..." : displayName}
              </div>

              <div style={{ marginTop: 8, fontSize: 13, color: "var(--hp-muted)" }}>
                {loading ? "—" : "0 subscribers • Creator"}
              </div>

              <div
                style={{
                  marginTop: 10,
                  fontSize: 14,
                  color: "var(--hp-muted)",
                  maxWidth: 560,
                  lineHeight: 1.5,
                }}
              >
                {loading ? "Loading profile..." : bio}
              </div>

              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <Link
                  href={username ? `/profile/${username}` : "#"}
                  className="hp-btn"
                  style={miniPill()}
                >
                  View public profile
                </Link>

                <button
                  type="button"
                  onClick={() => alert("Edit profile coming soon")}
                  className="hp-btn"
                  style={miniBtn()}
                >
                  Edit profile
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => alert("Share profile coming soon")}
            className="hp-btn"
            style={{
              padding: "10px 14px",
              borderRadius: 999,
              border: "1px solid var(--hp-border)",
              background: "var(--hp-card)",
              color: "var(--hp-text)",
              fontWeight: 900,
              cursor: "pointer",
              whiteSpace: "nowrap",
              boxShadow: "var(--hp-shadow-card)",
            }}
          >
            Share
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 14,
            marginBottom: 18,
          }}
        >
          <Tile
            label="Total views"
            value={loading ? "—" : stats.totalViews.toLocaleString()}
          />
          <Tile
            label="Stories"
            value={loading ? "—" : stats.stories.toString()}
          />
          <Tile
            label="Earnings"
            value={loading ? "—" : `$${stats.earnings.toFixed(2)}`}
          />
        </div>

        <div
          style={{
            borderRadius: 16,
            border: "1px solid var(--hp-border)",
            background: "var(--hp-card)",
            boxShadow: "var(--hp-shadow-card)",
            overflow: "hidden",
          }}
        >
          <MeRow
            title="My Series"
            subtitle="Manage your series and chapters"
            href="/series"
            isFirst
          />
          <MeRow
            title="Analytics"
            subtitle="Views, subscribers, and top stories"
            href="/dashboard/analytics"
          />
          <MeRow
            title="Earnings"
            subtitle="See how much you’ve made"
            href="/earnings"
          />
          <MeRow
            title="Settings"
            subtitle="Account, security, preferences"
            href="/settings"
          />
        </div>
      </div>
    </main>
  );
}

function topPill(): React.CSSProperties {
  return {
    textDecoration: "none",
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid var(--hp-border)",
    background: "var(--hp-card)",
    color: "var(--hp-text)",
    fontWeight: 800,
    fontSize: 12,
    whiteSpace: "nowrap",
    boxShadow: "var(--hp-shadow-card)",
  };
}

function miniPill(): React.CSSProperties {
  return {
    textDecoration: "none",
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid var(--hp-border)",
    background: "var(--hp-card)",
    color: "var(--hp-text)",
    fontWeight: 850,
    fontSize: 12,
    whiteSpace: "nowrap",
    boxShadow: "var(--hp-shadow-card)",
  };
}

function miniBtn(): React.CSSProperties {
  return {
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid var(--hp-border)",
    background: "var(--hp-card)",
    color: "var(--hp-text)",
    fontWeight: 850,
    fontSize: 12,
    cursor: "pointer",
    whiteSpace: "nowrap",
    boxShadow: "var(--hp-shadow-card)",
  };
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        borderRadius: 16,
        border: "1px solid var(--hp-border)",
        background: "var(--hp-card)",
        boxShadow: "var(--hp-shadow-card)",
        padding: 14,
      }}
    >
      <div style={{ fontSize: 12, color: "var(--hp-muted)" }}>{label}</div>
      <div style={{ marginTop: 8, fontSize: 22, fontWeight: 950 }}>{value}</div>
    </div>
  );
}

function MeRow({
  title,
  subtitle,
  href,
  isFirst = false,
}: {
  title: string;
  subtitle: string;
  href: string;
  isFirst?: boolean;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
        padding: "14px 14px",
        borderTop: isFirst ? "none" : "1px solid var(--hp-border)",
        background: "transparent",
      }}
    >
      <div style={{ fontWeight: 950 }}>{title}</div>
      <div style={{ marginTop: 6, fontSize: 12, color: "var(--hp-muted)" }}>
        {subtitle}
      </div>
    </Link>
  );
}